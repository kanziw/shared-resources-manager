import { expect } from 'chai'
import redis, { RedisClient } from 'redis'
import SharedResourceManager from '../src/index'
import { generateKey } from '../src/utils'

describe('Add shared values', () => {
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
