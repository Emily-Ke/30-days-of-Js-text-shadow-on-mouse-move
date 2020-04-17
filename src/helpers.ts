/**
 * Waits `wait` milliseconds after last invocation before executing `fn`
 * @param {Function} fn function to debounce
 * @param {number} [wait=20] milliseconds to wait before executing `fn`
 */
const debounce = (fn: Function, wait: number = 20) => {
  let timeout = 0;
  return (...args: any[]) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn(...args), wait);
  };
};

/**
 * Returns the angle between `point1` and `point2` in radians
 * @param {[number, number]} point1 point from
 * @param {[number, number]} point2 point to
 */
const angleBetweenTwoPoints = (
  point1: [number, number],
  point2: [number, number]
) => {
  const [p1x, p1y] = point1;
  const [p2x, p2y] = point2;
  const dx = p2x - p1x;
  const dy = p2y - p1y;

  return Math.atan2(dy, dx);
};

/**
 * Returns the `[adjacent, opposite]` sides of a right triangle
 * @param {number} angle angle in radians between hypotenuse and adjacent side
 * @param {number} hypotenuse hypotenuse of the right triangle
 */
const sides = (angle: number, hypotenuse: number) => {
  const adjacent = hypotenuse * Math.cos(angle);
  const opposite = hypotenuse * Math.sin(angle);
  return [adjacent, opposite];
};

/**
 * Returns a Promist that enables pausing code execution for `time` milliseconds
 * @param {number} [time=0] milliseconds to wait before resolving promise
 */
const wait = (time: number = 0) =>
  new Promise(resolve => {
    setTimeout(() => {
      resolve(true);
    }, time);
  });

/**
 * Rounds a number to a specified number of digits
 * @param {number} number the number to round
 * @param {number} precision the number of digits after the decimal to round to
 */
const round = (number: number, precision: number = 1) => {
  const factor = 10 ** precision;
  return Math.round(number * factor) / factor;
};
