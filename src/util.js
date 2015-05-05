export function size4(num) {
  return Math.ceil((num|0) / 4) << 2;
}

export function isInteger(value) {
  return (value|0) === value;
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
  return typeof value === "number" && isFinite(+value) && value >= 0 && Math.floor(value) === value;
}

export function isDouble(value) {
  return value === value && typeof value === "number";
}
