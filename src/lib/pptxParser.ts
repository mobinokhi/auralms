import JSZip from 'jszip';
import { SlideItem } from '@/types/masLms';

/**
 * Converts a base64 Data URL or string to an ArrayBuffer
 */
function dataUrlToArrayBuffer(dataUrl: string): ArrayBuffer {
  const base64Index = dataUrl.indexOf('base64,');
  const base64 = base64Index !== -1 ? dataUrl.substring(base64Index + 7) : dataUrl;
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
}

/**
 * Parses a PPTX file and extracts its genuine slides, titles, bullet points, and images.
 */
export async function parsePptx(input: File | ArrayBuffer | string): Promise<SlideItem[]> {
  try {
    let arrayBuffer: ArrayBuffer;

    if (input instanceof File) {
      arrayBuffer = await input.arrayBuffer();
    } else if (typeof input === 'string') {
      if (input.startsWith('data:') || input.length > 200) {
        arrayBuffer = dataUrlToArrayBuffer(input);
      } else {
        return [];
      }
    } else {
      arrayBuffer = input;
    }

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

    // Sort numerically by slide number
    slideFiles.sort((a, b) => a.index - b.index);

    const parser = new DOMParser();
    const slides: SlideItem[] = [];

    for (const item of slideFiles) {
      const file = zip.file(item.path);
      if (!file) continue;

      const xmlText = await file.async('text');
      const xmlDoc = parser.parseFromString(xmlText, 'text/xml');

      // Check relationships for embedded media images: ppt/slides/_rels/slide{N}.xml.rels
      let slideImageUrl: string | undefined = undefined;
      const relsPath = `ppt/slides/_rels/slide${item.index}.xml.rels`;
      const relsFile = zip.file(relsPath);

      if (relsFile) {
        try {
          const relsXml = await relsFile.async('text');
          const relsDoc = parser.parseFromString(relsXml, 'text/xml');
          const relNodes = relsDoc.getElementsByTagName('Relationship');

          for (let r = 0; r < relNodes.length; r++) {
            const rel = relNodes[r];
            const type = rel.getAttribute('Type') || '';
            const target = rel.getAttribute('Target') || '';

            if (type.includes('/image') && target) {
              // Resolve relative path: usually ../media/image1.png -> ppt/media/image1.png
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
                break; // Use primary media image for this slide
              }
            }
          }
        } catch {
          // ignore media rels error
        }
      }

      // Extract all text paragraphs (<a:p>)
      const paragraphNodes = xmlDoc.getElementsByTagName('a:p');
      const textParagraphs: string[] = [];

      for (let p = 0; p < paragraphNodes.length; p++) {
        const pNode = paragraphNodes[p];
        const textNodes = pNode.getElementsByTagName('a:t');
        let fullParaText = '';

        for (let t = 0; t < textNodes.length; t++) {
          fullParaText += textNodes[t].textContent || '';
        }

        fullParaText = fullParaText.trim();
        if (fullParaText.length > 0) {
          textParagraphs.push(fullParaText);
        }
      }

      // First paragraph is usually the title, or derive sensible title
      let title = `Slide ${item.index}`;
      let subtitle: string | undefined = undefined;
      const bulletPoints: string[] = [];

      if (textParagraphs.length > 0) {
        title = textParagraphs[0];
        
        // If there are multiple paragraphs, check if second is a subtitle
        let startIndex = 1;
        if (textParagraphs.length > 1 && textParagraphs[1].length < 80 && !textParagraphs[1].includes('•')) {
          subtitle = textParagraphs[1];
          startIndex = 2;
        }

        for (let i = startIndex; i < textParagraphs.length; i++) {
          const pt = textParagraphs[i];
          // Remove leading bullet characters if present
          const cleanPt = pt.replace(/^[\u2022\u25E6\u2023\u2219-]\s*/, '').trim();
          if (cleanPt) {
            bulletPoints.push(cleanPt);
          }
        }
      }

      slides.push({
        id: `pptx-slide-${item.index}`,
        title: title || `Slide ${item.index}`,
        subtitle: subtitle || `Presentation Slide ${item.index}`,
        bulletPoints: bulletPoints.length > 0 ? bulletPoints : undefined,
        imageUrl: slideImageUrl,
        notes: textParagraphs.length > 5 ? textParagraphs.slice(5).join(' ') : undefined
      });
    }

    return slides;
  } catch (err) {
    console.error('Failed to parse PPTX file:', err);
    return [];
  }
}
