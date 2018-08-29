export function wrapArray(value: any) {
  return Array.isArray(value) ? value : [value]
}
