/**
 * Returns a number whose value is limited to the given range.
 *
 * @param {Number} val The initial value
 * @param {Number} min The lower boundary
 * @param {Number} max The upper boundary
 * @returns {Number} A number in the range (min, max)
 */
export function clamp (val, min, max) {
  return Math.min(Math.max(val, min), max)
}

/**
 * Re-maps a number from one range to another.
 *
 * For example, calling `map(2, 0, 10, 0, 100)` returns 20. The first three
 * arguments set the original value to 2 and the original range from 0 to 10.
 * The last two arguments set the target range from 0 to 100. 20's position
 * in the target range [0, 100] is proportional to 2's position in the
 * original range [0, 10].
 *
 * @method map
 * @param  {Number} value  the incoming value to be converted.
 * @param  {Number} start1 lower bound of the value's current range.
 * @param  {Number} stop1  upper bound of the value's current range.
 * @param  {Number} start2 lower bound of the value's target range.
 * @param  {Number} stop2  upper bound of the value's target range.
 * @return {Number}        remapped number.
 **/
export function map(n, start1, stop1, start2, stop2, withinBounds) {
  const newval = (n - start1) / (stop1 - start1) * (stop2 - start2) + start2
  if (!withinBounds) {
    return newval
  }
  if (start2 < stop2) {
    return clamp(newval, start2, stop2)
  } else {
    return clamp(newval, stop2, start2)
  }
}
