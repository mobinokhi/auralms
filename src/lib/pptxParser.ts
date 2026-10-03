import JSZip from 'jszip';
import { SlideItem } from '@/types/masLms';

/**
 * Converts File, ArrayBuffer, or Data URL to an ArrayBuffer reliably
 */
async function toArrayBuffer(input: File | ArrayBuffer | string): Promise<ArrayBuffer> {
  if (input instanceof File) {
    return await input.arrayBuffer();
  }
  if (input instanceof ArrayBuffer) {
    return input;
  }
  if (typeof input === 'string') {
    if (input.startsWith('data:')) {
      const res = await fetch(input);
      return await res.arrayBuffer();
    }
    // Base64 string fallback
    const cleanBase64 = input.replace(/\s+/g, '');
    const binary = atob(cleanBase64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return bytes.buffer;
  }
  throw new Error('Unsupported input format');
}

/**
 * Decodes XML entities into standard readable text
 */
function decodeXml(str: string): string {
  return str
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .trim();
}

/**
 * Parses slide XML content using high-performance regex that handles namespaces, tables, group shapes, and text runs
 */
function parseSlideXml(xml: string): { title: string; subtitle?: string; bodyParagraphs: string[] } {
  let title = '';
  let subtitle: string | undefined = undefined;
  const bodyParagraphs: string[] = [];

  // 1. Check explicit title shapes: <*:sp> or <*:grpSp> containing <*:ph ... type="title" | "ctrTitle" | idx="0">
  const titleRegex = /<[a-zA-Z0-9]+:sp\b[^>]*>([\s\S]*?<[a-zA-Z0-9]+:ph\b[^>]*(?:type="(?:title|ctrTitle)"|idx="0")[\s\S]*?)<\/[a-zA-Z0-9]+:sp>/i;
  const titleMatch = titleRegex.exec(xml);
  if (titleMatch) {
    const tRegex = /<[a-zA-Z0-9]+:t\b[^>]*>([^<]*)<\/[a-zA-Z0-9]+:t>/gi;
    let tMatch;
    let tText = '';
    while ((tMatch = tRegex.exec(titleMatch[1])) !== null) {
      tText += tMatch[1];
    }
    title = decodeXml(tText);
  }

  // 2. Check explicit subtitle shapes: <*:ph ... type="subTitle" | idx="1">
  const subRegex = /<[a-zA-Z0-9]+:sp\b[^>]*>([\s\S]*?<[a-zA-Z0-9]+:ph\b[^>]*(?:type="subTitle"|idx="1")[\s\S]*?)<\/[a-zA-Z0-9]+:sp>/i;
  const subMatch = subRegex.exec(xml);
  if (subMatch) {
    const tRegex = /<[a-zA-Z0-9]+:t\b[^>]*>([^<]*)<\/[a-zA-Z0-9]+:t>/gi;
    let tMatch;
    let sText = '';
    while ((tMatch = tRegex.exec(subMatch[1])) !== null) {
      sText += tMatch[1];
    }
    subtitle = decodeXml(sText);
  }

  // 3. Extract table rows if present (<a:tr> ... <a:tc>)
  const trRegex = /<[a-zA-Z0-9]+:tr\b[^>]*>([\s\S]*?)<\/[a-zA-Z0-9]+:tr>/gi;
  let trMatch;
  while ((trMatch = trRegex.exec(xml)) !== null) {
    const trContent = trMatch[1];
    const tcRegex = /<[a-zA-Z0-9]+:tc\b[^>]*>([\s\S]*?)<\/[a-zA-Z0-9]+:tc>/gi;
    let tcMatch;
    const cells: string[] = [];
    while ((tcMatch = tcRegex.exec(trContent)) !== null) {
      const tcContent = tcMatch[1];
      const tRegex = /<[a-zA-Z0-9]+:t\b[^>]*>([^<]*)<\/[a-zA-Z0-9]+:t>/gi;
      let cellText = '';
      let tM;
      while ((tM = tRegex.exec(tcContent)) !== null) {
        cellText += tM[1];
      }
      cellText = decodeXml(cellText);
      if (cellText) cells.push(cellText);
    }
    if (cells.length > 0) {
      bodyParagraphs.push(cells.join('  •  '));
    }
  }

  // 4. Extract all paragraphs: <a:p>...</a:p>
  const pRegex = /<[a-zA-Z0-9]+:p\b[^>]*>([\s\S]*?)<\/[a-zA-Z0-9]+:p>/gi;
  let pMatch;
  while ((pMatch = pRegex.exec(xml)) !== null) {
    const pContent = pMatch[1];
    const tRegex = /<[a-zA-Z0-9]+:t\b[^>]*>([^<]*)<\/[a-zA-Z0-9]+:t>/gi;
    let tMatch;
    let paraText = '';
    while ((tMatch = tRegex.exec(pContent)) !== null) {
      paraText += tMatch[1];
    }
    paraText = decodeXml(paraText);
    if (paraText.length > 0) {
      if (paraText !== title && paraText !== subtitle && !bodyParagraphs.includes(paraText)) {
        bodyParagraphs.push(paraText);
      }
    }
  }

  // 5. Fallback: If no explicit title shape was matched, use the first paragraph as title
  if (!title && bodyParagraphs.length > 0) {
    title = bodyParagraphs.shift() || '';
  }

  return { title, subtitle, bodyParagraphs };
}

/**
 * Parses a PPTX file and extracts its genuine slides, titles, bullet points, and embedded images.
 */
export async function parsePptx(input: File | ArrayBuffer | string): Promise<SlideItem[]> {
  try {
    const arrayBuffer = await toArrayBuffer(input);
    const zip = await JSZip.loadAsync(arrayBuffer);

    // Identify all slide files: ppt/slides/slide1.xml, slide2.xml...
    const slideFiles: { index: number; path: string }[] = [];
    zip.forEach((relativePath) => {
      const match = relativePath.match(/^ppt\/slides\/slide([0-9]+)\.xml$/i);
      if (match) {
        slideFiles.push({
          index: parseInt(match[1], 10),
          path: relativePath
        });
      }
    });

    if (slideFiles.length === 0) {
      return [];
    }

    // Sort numerically by slide number (1, 2, 3, 10...)
    slideFiles.sort((a, b) => a.index - b.index);

    const slides: SlideItem[] = [];

    for (const item of slideFiles) {
      const file = zip.file(item.path);
      if (!file) continue;

      const xmlText = await file.async('text');
      const { title, subtitle, bodyParagraphs } = parseSlideXml(xmlText);

      // Extract image relationships: ppt/slides/_rels/slide{N}.xml.rels
      let slideImageUrl: string | undefined = undefined;
      const relsPath = `ppt/slides/_rels/slide${item.index}.xml.rels`;
      const relsFile = zip.file(relsPath);

      if (relsFile) {
        try {
          const relsXml = await relsFile.async('text');
          const relRegex = /<Relationship\b[^>]*Target="([^"]+)"[^>]*Type="[^"]*\/image"/gi;
          const altRelRegex = /<Relationship\b[^>]*Type="[^"]*\/image"[^>]*Target="([^"]+)"/gi;

          let targetMatch = relRegex.exec(relsXml) || altRelRegex.exec(relsXml);
          if (targetMatch && targetMatch[1]) {
            const target = targetMatch[1];
            const mediaPath = target.startsWith('../')
              ? 'ppt/' + target.replace(/^\.\.\//, '')
              : target.startsWith('media/')
              ? 'ppt/' + target
              : target;

            const mediaFile = zip.file(mediaPath);
            if (mediaFile) {
              const ext = target.split('.').pop()?.toLowerCase() || 'png';
              const mimeType = ext === 'jpg' || ext === 'jpeg' ? 'image/jpeg' : `image/${ext}`;
              const base64Data = await mediaFile.async('base64');
              slideImageUrl = `data:${mimeType};base64,${base64Data}`;
            }
          }
        } catch {
          // ignore media rels error
        }
      }

      // Clean bullet points
      const cleanBullets = bodyParagraphs
        .map(p => p.replace(/^[\u2022\u25E6\u2023\u2219-]\s*/, '').trim())
        .filter(p => p.length > 0);

      slides.push({
        id: `pptx-real-slide-${item.index}`,
        title: title || `Slide ${item.index}`,
        subtitle: subtitle || `Slide ${item.index} of ${slideFiles.length}`,
        bulletPoints: cleanBullets.length > 0 ? cleanBullets : undefined,
        imageUrl: slideImageUrl,
        notes: cleanBullets.length > 6 ? cleanBullets.slice(6).join(' ') : undefined
      });
    }

    return slides;
  } catch (err) {
    console.error('Failed to parse PPTX file:', err);
    return [];
  }
}
