/**
 * Signature Helper Functions for React Native
 * Contains utilities for converting between signature formats
 */

/**
 * Convert base64 string to SVG
 * @param {string} base64String - Base64 encoded string
 * @returns {Promise<string>} SVG string
 */
export const convertBase64ToSVG = base64String => {
  return new Promise((resolve, reject) => {
    try {
      // For React Native, we'll need to handle this differently
      // This is a placeholder for the conversion logic
      const decodedData = atob(base64String.split(',')[1] || base64String);
      resolve(decodedData);
    } catch (error) {
      reject(new Error('Failed to convert base64 to SVG: ' + error.message));
    }
  });
};

/**
 * Convert signature points array to SVG path string
 * @param {Array} signaturePoints - Array of point groups
 * @param {number} width - Canvas width
 * @param {number} height - Canvas height
 * @returns {string} SVG string
 */
export const convertPointsToSVG = (
  signaturePoints,
  width = 400,
  height = 200,
) => {
  if (!Array.isArray(signaturePoints) || signaturePoints.length === 0) {
    return '';
  }

  const svgPaths = signaturePoints.map(pointGroup => {
    if (!Array.isArray(pointGroup) || pointGroup.length === 0) {
      return '';
    }

    const pathData = pointGroup
      .map((point, index) => {
        const x = point?.x || 0;
        const y = point?.y || 0;
        return index === 0 ? `M${x} ${y}` : `L${x} ${y}`;
      })
      .join(' ');

    return `<path d="${pathData}" fill="none" stroke="white" stroke-width="2" />`;
  });

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">${svgPaths.join('')}</svg>`;
};

/**
 * Parse SVG path string back to points array
 * @param {string} svgString - SVG string
 * @returns {Array} Array of point groups
 */
export const svgPathToPoints = svgString => {
  if (!svgString) return [];

  try {
    const pathRegex = /<path[^>]*d="([^"]*)"/g;
    const matches = [...svgString.matchAll(pathRegex)];
    const allPoints = [];

    matches.forEach(match => {
      const pathData = match[1];
      const points = [];

      // Parse M (move) and L (line) commands
      const commands = pathData.match(/[ML][\d.\s,]+/g) || [];

      commands.forEach(command => {
        const coords = command
          .slice(1)
          .trim()
          .split(/[\s,]+/);
        for (let i = 0; i < coords.length; i += 2) {
          const x = parseFloat(coords[i]);
          const y = parseFloat(coords[i + 1]);
          if (!isNaN(x) && !isNaN(y)) {
            points.push({ x, y });
          }
        }
      });

      if (points.length > 0) {
        allPoints.push(points);
      }
    });

    return allPoints;
  } catch (error) {
    console.error('Error parsing SVG to points:', error);
    return [];
  }
};

/**
 * Convert SVG string to base64 data URL
 * @param {string} svgString - SVG string
 * @returns {string} Base64 encoded data URL
 */
export const svgToBase64 = svgString => {
  try {
    // For React Native, we need to use btoa equivalent
    const base64 = btoa(unescape(encodeURIComponent(svgString)));
    return `data:image/svg+xml;base64,${base64}`;
  } catch (error) {
    console.error('Error converting SVG to base64:', error);
    return '';
  }
};

/**
 * Convert base64 to regular string
 * @param {string} base64String - Base64 string
 * @returns {string} Decoded string
 */
export const base64ToString = base64String => {
  try {
    const base64Data = base64String.replace(
      /^data:image\/svg\+xml;base64,/,
      '',
    );
    return decodeURIComponent(escape(atob(base64Data)));
  } catch (error) {
    console.error('Error decoding base64:', error);
    return '';
  }
};

/**
 * Generate SVG from signature data (from react-native-signature-canvas)
 * @param {Array} data - Signature data array
 * @param {number} width - Canvas width
 * @param {number} height - Canvas height
 * @returns {string} SVG string
 */
export const generateSvgFromPoints = (data, width = 400, height = 200) => {
  if (!Array.isArray(data) || data.length === 0) {
    return '';
  }

  const svgPaths = data
    .map(item => {
      const { color = 'white', points = [], dotSize = 2 } = item || {};

      if (!Array.isArray(points) || points.length === 0) {
        return '';
      }

      const pathD = points
        .map((point, index) => {
          const x = point?.x || 0;
          const y = point?.y || 0;
          return index === 0 ? `M${x},${y}` : `L${x},${y}`;
        })
        .join(' ');

      return `<path d="${pathD}" stroke="${color}" fill="none" stroke-width="${dotSize}"/>`;
    })
    .filter(Boolean)
    .join('');

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">${svgPaths}</svg>`;
};

/**
 * Extract SVG paths from SVG string
 * @param {string} svgString - SVG string
 * @returns {Array} Array of path strings
 */
export const extractSvgPaths = svgString => {
  if (!svgString) return [];

  try {
    const pathRegex = /<path[^>]*d="([^"]*)"/g;
    const matches = [...svgString.matchAll(pathRegex)];
    return matches.map(match => match[1]);
  } catch (error) {
    console.error('Error extracting SVG paths:', error);
    return [];
  }
};

/**
 * Validate if a string is valid SVG
 * @param {string} svgString - String to validate
 * @returns {boolean} True if valid SVG
 */
export const isValidSVG = svgString => {
  if (!svgString || typeof svgString !== 'string') {
    return false;
  }

  return (
    svgString.includes('<svg') &&
    svgString.includes('xmlns="http://www.w3.org/2000/svg"') &&
    svgString.includes('</svg>')
  );
};

/**
 * Clean and normalize SVG string
 * @param {string} svgString - SVG string to clean
 * @returns {string} Cleaned SVG string
 */
export const cleanSVG = svgString => {
  if (!svgString) return '';

  return svgString.replace(/\s+/g, ' ').replace(/>\s+</g, '><').trim();
};

/**
 * Merge multiple SVG signatures into one
 * @param {Array<string>} svgStrings - Array of SVG strings
 * @param {number} width - Canvas width
 * @param {number} height - Canvas height
 * @returns {string} Merged SVG string
 */
export const mergeSVGs = (svgStrings, width = 400, height = 200) => {
  if (!Array.isArray(svgStrings) || svgStrings.length === 0) {
    return '';
  }

  const allPaths = svgStrings
    .map(svg => {
      const paths = extractSvgPaths(svg);
      return paths.map(
        path =>
          `<path d="${path}" fill="none" stroke="white" stroke-width="2" />`,
      );
    })
    .flat()
    .join('');

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">${allPaths}</svg>`;
};

export default {
  convertBase64ToSVG,
  convertPointsToSVG,
  svgPathToPoints,
  svgToBase64,
  base64ToString,
  generateSvgFromPoints,
  extractSvgPaths,
  isValidSVG,
  cleanSVG,
  mergeSVGs,
};
