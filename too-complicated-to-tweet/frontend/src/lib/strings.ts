
export const mbParseDecimals = (value: string): number | undefined => {
  const r = parseInt(value, 10);
  if (!Number.isInteger(r)) {
    return undefined
  }
  return r
}