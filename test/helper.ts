import R from 'ramda'

export const hasSameMembers = R.curry((arr1: any[], arr2: any[]) => {
  return R.equals(arr1.sort(), arr2.sort())
})
