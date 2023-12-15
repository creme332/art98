const colorValidator = (v) => /^#([0-9a-f]{3}){1,2}$/i.test(v);

/**
 * The greater the canvas size, the more time it will take to create
 * canvas and its respective pixels on MongoDB.
 *
 * ! Do not change this value unless you know what you are doing.
 * ! canvasSize on frontend must be updated manually.
 */
const canvasSize = 100;

module.exports = { colorValidator, canvasSize };
