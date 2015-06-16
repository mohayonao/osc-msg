export function size4(num) {
  return Math.ceil((num|0) / 4) << 2;
}

export function isInteger(value) {
  return Math.floor(value) === value && value % 1 === 0;
}

export function isFloat(value) {
  return value === value && typeof value === "number";
}

export function isString(value) {
  return typeof value === "string";
}

export function isBlob(value) {
  return (value instanceof ArrayBuffer) || (value instanceof global.Buffer);
}

export function isTimetag(value) {
  return typeof value === "number" && value >= 0 && value % 1 === 0;
}

export function isDouble(value) {
  return value === value && typeof value === "number";
}
