function clamp(val: number) {
  return Math.max(0, Math.min(255, val));
}

export function hexToRgb(hex: string) {
  const match = hex.replace('#', '').match(/.{1,2}/g);
  if (!match) return [0, 0, 0];
  return match.map((x) => parseInt(x, 16));
}

function rgbToHex([r, g, b]: number[]) {
  return (
    '#' +
    [r, g, b]
      .map((x) => {
        const hex = x.toString(16);
        return hex.length === 1 ? '0' + hex : hex;
      })
      .join('')
  );
}

export function offsetColor(hex: string, offset: number) {
  const rgb = hexToRgb(hex);
  return rgbToHex(rgb.map((c) => clamp(c + offset)));
}

export function colorDistance(rgb1: number[], rgb2: number[]) {
  return Math.sqrt(
    Math.pow(rgb1[0] - rgb2[0], 2) +
    Math.pow(rgb1[1] - rgb2[1], 2) +
    Math.pow(rgb1[2] - rgb2[2], 2)
  );
} 