import R from 'ramda'

export function wrapArray(value: any) {
  return Array.isArray(value) ? value : [ value ]
}

export const generateKey = R.curry((uniqueKey: string, id: string) => `${uniqueKey}:${id}`)
