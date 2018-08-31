import { expect } from 'chai'
import { generateKey } from '../src/utils'
import { hasSameMembers } from './helper'

describe('Utils', () => {
  describe('generateKey', () => {
    it('generateKey should combine 2 strings with ":"', () => {
      expect(generateKey('a', 'b')).to.eql('a:b')
      expect(generateKey('abc', 'bcd')).to.eql('abc:bcd')
    })

    it('generateKey is curried function', () => {
      expect(generateKey('a', 'b')).to.eql(generateKey('a')('b'))
    })
  })
})

describe('helper', () => {
  describe('hasSameMembers', () => {
    it('should work well.', () => {
      const testSet = [
        {
          arr1: [ 'a', 'b' ],
          arr2: [ 'b', 'a' ],
          result: true,
        },
        {
          arr1: [ 'a', 'b' ],
          arr2: [ 'b', 'c' ],
          result: false,
        },
        {
          arr1: [ 'a', 'b', 'a' ],
          arr2: [ 'b', 'a' ],
          result: false,
        },
        {
          arr1: [ 'a', 'b', 'a' ],
          arr2: [ 'b', 'a', 'b' ],
          result: false,
        },
        {
          arr1: [ 1, '1', 'abc', null ],
          arr2: [ 1, null, '1', 'abc' ],
          result: true,
        },
      ]

      testSet.forEach(({ arr1, arr2, result }) => {
        console.log('>>', arr1, arr2)
        expect(hasSameMembers(arr1, arr2)).to.eql(result)
      })
    })
  })
})
