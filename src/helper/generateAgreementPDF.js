// helper/generateAgreementPDF.js
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import RNBlobUtil from 'react-native-blob-util';
import moment from 'moment';
import { Image } from 'react-native';

/**
 * @param {string} signatureSVG - SVG string of the signature
 * @param {string} signerName
 * @param {string|Date} dt - date
 * @returns {Promise<string>} file:// path to the generated PDF
 */
export const generateOrgAgreementPDF = async (
  signatureSVG = '',
  signerName = '',
  dt = new Date(),
) => {
  try {
    const pdfDoc = await PDFDocument.create();
    let page = pdfDoc.addPage([595, 842]); // A4
    const { width, height } = page.getSize();

    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const regularFont = await pdfDoc.embedFont(StandardFonts.Helvetica);

    const margin = 50;
    let y = height - margin;

    // Load and embed logo
    let logoImage;
    try {
      const logoAsset = Image.resolveAssetSource(
        require('../../assets/images/BDMT.png'),
      );

      const response = await RNBlobUtil.config({ fileCache: false }).fetch(
        'GET',
        logoAsset.uri,
      );

      const base64Logo = await response.base64();
      const logoBytes = Uint8Array.from(atob(base64Logo), c => c.charCodeAt(0));
      logoImage = await pdfDoc.embedPng(logoBytes);
    } catch (error) {
      console.error('Error loading logo:', error);
    }

    // ────────────────────────────────────────────────
    // HEADER SECTION
    // ────────────────────────────────────────────────
    if (logoImage) {
      const logoWidth = 160;
      const logoHeight = 80;
      page.drawImage(logoImage, {
        x: width - margin - logoWidth,
        y: y - 50,
        width: logoWidth,
        height: logoHeight,
      });
    }

    page.drawText('Blazor Media Toolkit', {
      x: margin,
      y,
      size: 14,
      font: boldFont,
      color: rgb(0, 0, 0),
    });

    y -= 20;
    page.drawText('54700, 216-A Bahria Al-Rehmat, Pecco Rd, Lahore, Pakistan', {
      x: margin,
      y,
      size: 10,
      font: regularFont,
    });

    y -= 15;
    page.drawText('+92 42-35132337', {
      x: margin,
      y,
      size: 10,
      font: regularFont,
    });

    y -= 20;
    page.drawLine({
      start: { x: margin, y },
      end: { x: width - margin, y },
      thickness: 1,
      color: rgb(0, 0, 0),
    });

    y -= 30;

    // ────────────────────────────────────────────────
    // TITLE
    // ────────────────────────────────────────────────
    page.drawText('Guidelines and Privacy Policy', {
      x: margin,
      y,
      size: 16,
      font: boldFont,
    });

    y -= 25;

    // ────────────────────────────────────────────────
    // INTRODUCTION
    // ────────────────────────────────────────────────
    const introText =
      'BMT is created in the spirit of peaceful civic engagement. We do not permit the use of bigoted language, anti-government or anti-law enforcement rhetoric or the provocation of violence of any kind. BMT bears no tolerance for objectionable content or abusive users. We reserve the right to not post any vehicle that we deem inappropriate or subversive to the spirit of our platform.';

    y = drawWrappedText(
      page,
      introText,
      margin,
      y,
      width - margin * 2,
      regularFont,
      10,
    );

    y -= 20;

    // ────────────────────────────────────────────────
    // PROHIBITED CONTENT SECTION
    // ────────────────────────────────────────────────
    page.drawText('Do not post, upload, stream, or share:', {
      x: margin,
      y,
      size: 11,
      font: boldFont,
    });

    y -= 18;

    const prohibitedItems = [
      'Content that boasts, praise or promotes past, present, or future crimes',
      'Unnecessary graphic details of crimes',
      "Yours or anyone else's' legal paperwork including court documents, victim documents or official documents from government agencies",
      'Admissions of guilt for crimes you have not been convicted of',
      'Names of individuals other than yourself or the loved one you are speaking on behalf of',
      'Individual personal addresses of you or anyone else',
      'Names of victims, co-defendants, witnessed or perpetrators nor names of specific correctional officers',
      'Content that encourages aggressive / angry words or actions directed at public officials, officers of the court, correctional officers, judges or any employee of the state',
      'Gang names, symbols, flags, logos or gestures',
      'Content that ridicules victims or their families',
      'Firearms or weapons of any kind including ammunition and / or accessories',
      'Content that depicts or promotes the usage of drugs, and or alcohol',
      'Content that solicits money or financial assistance for you, your loved one or any one at all',
      'Content that expresses, insinuates, or hints at the guilt of non-convicted citizens',
      'Explicit language',
      'Violent threats against any individual or entity of any kind',
      'Nudity or obscenity',
      'Content that equates to conspiracy theories',
      'Misinformation, lies or half-truths',
      'Personal medical records of you or anyone else',
      'Personal identity information such as bank account information, bank statements, social security numbers and/or card, drivers license or any other sensitive content of similar nature',
      'Personal login codes, names or passwords for you or anyone else',
      "Content that violates or infringes on someone else's legally held copyright, trademark, intellectual property or patten",
    ];

    for (const item of prohibitedItems) {
      if (y < 100) {
        page = pdfDoc.addPage([595, 842]);
        y = height - margin;
      }

      y = drawBulletPoint(
        page,
        item,
        margin,
        y,
        width - margin * 2,
        regularFont,
        9,
      );
      y -= 5;
    }

    y -= 15;

    // ────────────────────────────────────────────────
    // CONTENT INTEGRITY SECTION
    // ────────────────────────────────────────────────
    if (y < 150) {
      page = pdfDoc.addPage([595, 842]);
      y = height - margin;
    }

    page.drawText('Content Integrity', {
      x: margin,
      y,
      size: 12,
      font: boldFont,
    });

    y -= 18;

    const integrityItems = [
      'BMT expects every vehicle-share to contain authentic stories of truthfulness and honesty without lies fabrications or exaggerations.',
      'BMT is not responsible for stories or details within a story that may turn out to be falsified by the vehicle-share.',
      'BMT reserves the right to inquire with family, friends, law enforcement and policymakers about the truthfulness of your story including generalizations and / or details pertaining to people, places, things, and situations. We understand that situational evidence is subjective and that there may be numerous views and opinions about the same incident. If however, BMT discovers that any part of your story is false, your account will be suspended and your vehicle removed permanently.',
    ];

    for (const item of integrityItems) {
      if (y < 100) {
        page = pdfDoc.addPage([595, 842]);
        y = height - margin;
      }

      y = drawBulletPoint(
        page,
        item,
        margin,
        y,
        width - margin * 2,
        regularFont,
        9,
      );
      y -= 5;
    }

    y -= 20;

    // ────────────────────────────────────────────────
    // LAST UPDATED
    // ────────────────────────────────────────────────
    if (y < 150) {
      page = pdfDoc.addPage([595, 842]);
      y = height - margin;
    }

    page.drawText('Last Updated: February 14, 2023', {
      x: margin,
      y,
      size: 9,
      font: regularFont,
      color: rgb(0.3, 0.3, 0.3),
    });

    y -= 40;

    // ────────────────────────────────────────────────
    // SIGNATURE SECTION
    // ────────────────────────────────────────────────
    if (y < 200) {
      page = pdfDoc.addPage([595, 842]);
      y = height - margin;
    }

    y -= 50;

    // Signature line
    page.drawLine({
      start: { x: margin, y },
      end: { x: margin + 220, y },
      thickness: 1,
    });

    page.drawText('Signature', {
      x: margin,
      y: y - 15,
      size: 9,
      font: regularFont,
      color: rgb(0.4, 0.4, 0.4),
    });

    // Draw SVG signature
    if (signatureSVG) {
      try {
        const paths = extractSvgPaths(signatureSVG);
        paths.forEach(pathStr => {
          page.drawSvgPath(pathStr, {
            x: margin,
            y: y + 60,
            scale: 0.45,
            borderWidth: 2.5,
            borderColor: rgb(0, 0, 0),
          });
        });
      } catch (err) {
        console.log('SVG parse/draw failed', err);
      }
    }

    // Date line & value
    page.drawLine({
      start: { x: width - margin - 220, y },
      end: { x: width - margin, y },
      thickness: 1,
    });

    page.drawText('Date', {
      x: width - margin - 220,
      y: y - 15,
      size: 9,
      font: regularFont,
      color: rgb(0.4, 0.4, 0.4),
    });

    const signDate = moment(dt).format('MMM D, YYYY • h:mm A');
    page.drawText(signDate, {
      x: width - margin - 220,
      y: y + 8,
      size: 10,
      font: regularFont,
    });

    if (signerName) {
      page.drawText(`Signed by: ${signerName}`, {
        x: margin,
        y: y - 45,
        size: 10,
        font: regularFont,
      });
    }

    // ────────────────────────────────────────────────
    // SAVE TO FILE
    // ────────────────────────────────────────────────
    const pdfBytes = await pdfDoc.save();

    const fileName = `BMT_Agreement_${Date.now()}.pdf`;
    const pdfPath = `${RNBlobUtil.fs.dirs.DocumentDir}/${fileName}`;

    // Convert Uint8Array to base64 string
    let binary = '';
    const len = pdfBytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(pdfBytes[i]);
    }
    const base64String = btoa(binary);

    await RNBlobUtil.fs.writeFile(pdfPath, base64String, 'base64');

    return pdfPath;
  } catch (err) {
    console.error('PDF generation failed', err);
    throw err;
  }
};

// ─── HELPER FUNCTIONS ───────────────────────────────────────────────────────

/**
 * Draw wrapped text with proper paragraph handling
 */
function drawWrappedText(page, text, x, y, maxWidth, font, size) {
  const words = text.split(' ');
  let line = '';
  let currentY = y;

  for (let i = 0; i < words.length; i++) {
    const testLine = line + words[i] + ' ';
    const testWidth = font.widthOfTextAtSize(testLine, size);

    if (testWidth > maxWidth && i > 0) {
      page.drawText(line.trim(), {
        x,
        y: currentY,
        size,
        font,
        color: rgb(0, 0, 0),
      });
      line = words[i] + ' ';
      currentY -= size + 4;
    } else {
      line = testLine;
    }
  }

  if (line.trim()) {
    page.drawText(line.trim(), {
      x,
      y: currentY,
      size,
      font,
      color: rgb(0, 0, 0),
    });
    currentY -= size + 4;
  }

  return currentY;
}

/**
 * Draw bullet point with wrapped text
 */
function drawBulletPoint(page, text, x, y, maxWidth, font, size) {
  page.drawText('•', { x, y, size, font, color: rgb(0, 0, 0) });

  const bulletOffset = 15;
  const words = text.split(' ');
  let line = '';
  let currentY = y;

  for (let i = 0; i < words.length; i++) {
    const testLine = line + words[i] + ' ';
    const testWidth = font.widthOfTextAtSize(testLine, size);

    if (testWidth > maxWidth - bulletOffset && i > 0) {
      page.drawText(line.trim(), {
        x: x + bulletOffset,
        y: currentY,
        size,
        font,
        color: rgb(0, 0, 0),
      });
      line = words[i] + ' ';
      currentY -= size + 3;
    } else {
      line = testLine;
    }
  }

  if (line.trim()) {
    page.drawText(line.trim(), {
      x: x + bulletOffset,
      y: currentY,
      size,
      font,
      color: rgb(0, 0, 0),
    });
    currentY -= size + 3;
  }

  return currentY;
}

/**
 * Extract SVG path data
 */
function extractSvgPaths(svg) {
  if (!svg) return [];
  const matches = svg.matchAll(/d="([^"]*)"/g);
  return Array.from(matches, m => m[1]);
}

export default { generateOrgAgreementPDF };
