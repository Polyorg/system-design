/**
 * Color conversion functions (and some color logic functions)
 *
 * - HEX to RGB
 *   - hexToRgbaString
 *   - hexToRgbaArray
 * - RGB to RGB
 *   - rgbaArrayToRgbaString
 *   - rgbaStringToRgbaArray
 * - RGB to HEX
 *   - rgbaStringToHex
 *   - rgbaArrayToHex
 *   - Or, use Color to HEX section.
 * - Color to RGB
 *   - colorToRgbaArray
 *   - colorToRgbaString (alias colorToAlpha)
 * - Color to HEX
 *   - colorToHex
 */

const BYTE = 255
const RGB = 3
const RGBA = 4
const HEX = 16
const BRIGHTNESS_MAX = 145
const BRIGHTNESS_MULTIPLIER = [299, 587, 114] // https://www.w3.org/TR/AERT/#color-contrast
const RE_RGB = /^rgb\((\d+),\s*(\d+),\s*(\d+)\)/
const RE_RGBA = /^rgba\((\d+),\s*(\d+),\s*(\d+),\s*([.\d]+)\)/

//
// Conversion Functions
//

// HEX to RGB

/* eslint-disable @typescript-eslint/no-unused-vars */
/**
 * hexToRgbaArray(hex, [alpha])
 * @param hex "#fab" or "fab" or "#ffaabb" or "ffaabb" or "#fab8"
 *             or "fab8" or "#ffaabb88" or "ffaabb88"
 * @param alpha (optional) 0.0 - 1.0
 * @returns [255, 170, 187] or [255, 170, 187, 1.0] depending on whether color has alpha
 */
export const hexToRgbaArray = (
  hex: string,
  alpha: number | null = null,
): number[] => {
  let cutHex = hex.charAt(0) === "#" ? hex.substr(1) : hex
  if (cutHex.length <= RGBA) {
    cutHex = cutHex.replace(/./g, "$&$&")
  }
  const chunks = cutHex.match(/.{1,2}/g)
  if (!chunks) {
    throw new Error("Bad hex input = " + cutHex)
  }
  const rgba = chunks.map((rgb: string) => parseInt(rgb, HEX))
  if (rgba.length < RGB || rgba.length > RGBA) {
    throw new Error("Bad hex = " + rgba)
  }
  return rgba
}
/* eslint-enable @typescript-eslint/no-unused-vars */

// RGB to RGB

/**
 * rgbaArrayToRgbaString(rgba)
 * @param rgba  [255, 170, 187] or [255, 170, 187, 1.0]
 * @returns     "rgb(255, 170, 187)" or "rgba(255, 170, 187, 1.0)"
 *              depending on whether rgba has alpha
 */
export const rgbaArrayToRgbaString = (rgba: number[]): string => {
  if (rgba.length < RGB || rgba.length > RGBA) {
    throw new Error("Bad color array = " + rgba)
  }
  return `rgb${rgba.length === RGBA ? "a" : ""}(${rgba.join(", ")})`
}

/**
 * hexToRgbaString(hex, [alpha])
 * @param hex   "#fab" or "fab" or "#ffaabb" or "ffaabb"
 *              or "#fab8" or "fab8" or "#ffaabb88" or "ffaabb88"
 * @param alpha (optional) 0.0 - 1.0
 * @returns     "rgb(255, 170, 187)" or "rgba(255, 170, 187, 1.0)"
 *              depending on whether color has alpha
 */
export function hexToRgbaString(
  hex: string,
  alpha: number | null = null,
): string {
  const rgba = hexToRgbaArray(hex, alpha)
  return rgbaArrayToRgbaString(rgba)
}

/**
 * rgbaStringToRgbaArray(rgbs)
 * @param rgbs  "rgb(255, 170, 187)" or "rgba(255, 170, 187, 1.0)"
 * @returns     [255, 170, 187] or [255, 170, 187, 1.0] depending on whether rgbs has alpha
 */
export const rgbaStringToRgbaArray = (rgbs: string): number[] => {
  const parts = rgbs.match(RE_RGB) || rgbs.match(RE_RGBA)
  if (!parts) {
    throw new Error("Bad RGB string = " + rgbs)
  }
  return parts.slice(1).map(Number)
}

// COLOR to RGB

/**
 * colorToRgbaArray(color, [alpha])
 * @param color "#fab" or "fab" or "#ffaabb" or "ffaabb"
 *                or "#fab8" or "fab8" or "#ffaabb88" or "ffaabb88"
 *                or "rgb(255, 170, 187)" or "rgba(255, 170, 187, 1.0)"
 * @param alpha (optional) 0.0 - 1.0
 * @returns     [255, 170, 187] or [255, 170, 187, 1.0] depending on whether color has alpha
 */
export function colorToRgbaArray(
  color: string,
  alpha: number | null = null,
): number[] {
  const rgba = color.startsWith("rgb")
    ? rgbaStringToRgbaArray(color)
    : hexToRgbaArray(color)
  if (alpha !== null) {
    rgba[RGBA - 1] = alpha
  }
  return rgba
}

/**
 * colorToRgbaString(color, [alpha])
 * @param color "#fab" or "fab" or "#ffaabb" or "ffaabb" or
 *               "#fab8" or "fab8" or "#ffaabb88" or "ffaabb88"
 *                or "rgb(255, 170, 187)" or "rgba(255, 170, 187, 1.0)"
 * @param alpha (optional) 0.0 - 1.0
 * @returns     "rgb(255, 170, 187)" or "rgba(255, 170, 187, 1.0)"
 *              depending on whether color has alpha
 */
export function colorToRgbaString(
  color: string,
  alpha: number | null = null,
): string {
  const rgba = colorToRgbaArray(color, alpha)
  return rgbaArrayToRgbaString(rgba)
}

// COLOR to HEX

/**
 * colorToHex(color, [alpha])
 * @param color "#fab" or "fab" or "#ffaabb" or "ffaabb"
 *              or "#fab8" or "fab8" or "#ffaabb88" or "ffaabb88"
 *              or "rgb(255, 170, 187)" or "rgba(255, 170, 187, 1.0)"
 * @param alpha (optional) 0.0 - 1.0
 * @returns     [255, 170, 187] or [255, 170, 187, 1.0] depending on whether color has alpha
 */
export function colorToHex(color: string, alpha: number | null = null): string {
  const rgba = colorToRgbaArray(color, alpha)
  if (rgba.length === RGBA) {
    rgba[RGBA - 1] *= BYTE
  }
  const hex = rgba
    .map(Math.floor)
    .map((rgb: number) => (rgb < HEX ? "0" : "") + rgb.toString(HEX))
    .join("")
  return "#" + hex
}

// RGB to HEX

/**
 * rgbaStringToHex(rgbs, [alpha])
 * @param color "#fab" or "fab" or "#ffaabb" or "ffaabb"
 *               or "#fab8" or "fab8" or "#ffaabb88" or "ffaabb88"
 *               or "rgb(255, 170, 187)" or "rgba(255, 170, 187, 1.0)"
 * @param alpha (optional) 0.0 - 1.0
 * @returns     "#ffaabb" or "#ffaabb88" depending on whether color has alpha
 */
export const rgbaStringToHex = colorToHex

/**
 * rgbaArrayToHex(rgba, [alpha])
 * @param rgba  [255, 170, 187] or [255, 170, 187, 1.0]
 * @param alpha (optional) 0.0 - 1.0
 * @returns     "#ffaabb" or "#ffaabb88" depending on whether rgba has alpha
 */
export function rgbaArrayToHex(
  rgba: number[],
  alpha: number | null = null,
): string {
  const color = rgbaArrayToRgbaString(rgba)
  return rgbaStringToHex(color, alpha)
}

//
// Logic Functions
//

/**
 * getColorBrightness(color)
 * @param color "#fab" or "fab" or "#ffaabb" or "ffaabb"
 *              or "#fab8" or "fab8" or "#ffaabb88" or "ffaabb88"
 *              or "rgb(255, 170, 187)" or "rgba(255, 170, 187, 1.0)"
 * @returns     numerical brightness measurement
 */
export const getColorBrightness = (color: string): number => {
  const [hRed, hGreen, hBlue] = colorToRgbaArray(color)
    .slice(0, RGB)
    .map((rgb: number, i: number) => rgb * BRIGHTNESS_MULTIPLIER[i])
  const brightness = (hRed + hGreen + hBlue) / 1000
  return brightness
}

/**
 * shouldReverseColor(color)
 * @param color "#fab" or "fab" or "#ffaabb" or "ffaabb" or "#fab8"
 *              or "fab8" or "#ffaabb88" or "ffaabb88"
 *              or "rgb(255, 170, 187)" or "rgba(255, 170, 187, 1.0)"
 * @returns     true or false depending on if numerical brightness
 *              measurement exceeds BRIGHTNESS_MAX
 */
export const shouldReverseColor = (color: string): boolean => {
  const brightness = getColorBrightness(color)
  return brightness > BRIGHTNESS_MAX
}

//
// Default Export
//

/**
 * colorToAlpha(color, [alpha])
 * @param color "#fab" or "fab" or "#ffaabb" or "ffaabb" or "#fab8"
 *              or "fab8" or "#ffaabb88" or "ffaabb88"
 *              or "rgb(255, 170, 187)" or "rgba(255, 170, 187, 1.0)"
 * @param alpha (optional) 0.0 - 1.0
 * @returns     "rgb(255, 170, 187)" or "rgba(255, 170, 187, 1.0)"
 *              depending on whether color has alpha
 */
export const colorToAlpha = colorToRgbaString

export default colorToAlpha
