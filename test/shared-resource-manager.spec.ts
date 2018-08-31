import { expect } from 'chai'
import redis, { RedisClient } from 'redis'
import SharedResourceManager from '../src/index'
import { generateKey } from '../src/utils'
import { hasSameMembers } from './helper'

describe('Core', () => {
  const uniqueKey = 'TEST'
  let srm: SharedResourceManager
  let client: RedisClient

  before(() => {
    srm = new SharedResourceManager({ uniqueKey })
    client = redis.createClient()
  })
  afterEach(() => {
    return new Promise((resolve, reject) => {
      client.flushall(err => (err ? reject(err) : resolve()))
    })
  })
  after(() => {
    srm.end(true)
    client.end(true)
  })

  describe('Add', () => {
    it('simple add test', async () => {
      const [ id, value ] = [ 'ID', 'VALUE' ]
      const count = await srm.add(id, value)
      await new Promise((resolve, reject) => {
        client.smembers(generateKey(uniqueKey, id), (err, ret) => {
          if (err) {
            return reject(err)
          }
          expect(ret).to.be.an.instanceof(Array).lengthOf(count)
          expect(ret[ 0 ]).to.eql(value)
          resolve()
        })
      })
    })
  })

  describe('Take', () => {
    it('simple take test', async () => {
      const [ id, ...valuesExpected ] = [ 'ID', 'VALUE1', 'VALUE2' ]
      await srm.add(id, valuesExpected)
      const valuesResult = await srm.take(id, 2)

      expect(hasSameMembers(valuesExpected, valuesResult)).to.eql(true)
    })

    it('can not take enough values if there are not have enough values', async () => {
      const [ id, ...valuesExpected ] = [ 'ID', 'VALUE1', 'VALUE2' ]
      await srm.add(id, valuesExpected)
      const valuesResult = await srm.take(id, 3)

      expect(hasSameMembers(valuesExpected, valuesResult)).to.eql(true)
    })
  })

  describe('SizeOf', () => {
    it('sizeOf should return cardinality of set', async () => {
      const [ id1, id2 ] = [ 'ID1', 'ID2' ]
      await srm.sizeOf(id1).then(size => expect(size).to.eql(0))
      await srm.sizeOf(id2).then(size => expect(size).to.eql(0))

      await srm.add(id1, 'a')
      await srm.add(id2, [ 'a', 'b', 'c' ])
      await srm.sizeOf(id1).then(size => expect(size).to.eql(1))
      await srm.sizeOf(id2).then(size => expect(size).to.eql(3))
    })
  })
})

describe('Inject exist redis client', () => {
  const uniqueKey = 'TEST_FOR_INJECT_CLIENT'
  const [ id, value ] = [ 'ID', 'VALUE' ]

  it('should work.', async () => {
    const client = redis.createClient()

    const empty = await new Promise((resolve) => {
      client.smembers(generateKey(uniqueKey, id), (_, ret) => resolve(ret))
    })
    expect(empty).to.eql([])

    const srm = new SharedResourceManager({ uniqueKey }, client)
    await srm.add(id, value)

    const membersOrg = await new Promise((resolve) => {
      client.smembers(generateKey(uniqueKey, id), (_, ret) => resolve(ret))
    }) as string[]
    const membersNew = await srm.take(id, 1)
    expect(hasSameMembers(membersOrg, membersNew)).to.eql(true)

    client.end(true)
  })
})
