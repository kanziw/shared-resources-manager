import assert from 'assert'
import redis, { RedisClient } from 'redis'
import { SharedResourceManagerOptions, SharedValue } from './interfaces'
import { wrapArray } from './utils'

export { SharedResourceManagerOptions, SharedValue }

export default class SharedResourceManager {
  client: RedisClient
  uniqueKey: string

  constructor(options: SharedResourceManagerOptions) {
    const { port = 6379, host = '127.0.0.1', uniqueKey = '' } = options
    if (!uniqueKey) {
      console.debug('uniqueKey is not defined, use ["SRM"] instead.')
    }

    this.client = redis.createClient(port, host)
    this.uniqueKey = uniqueKey || 'SRM'
  }

  add(id: string = '', value: SharedValue = ''): Promise<void> {
    assert(id || value, '[add] Check params')
    let values: string[] = []

    if (!value) {
      values = wrapArray(id)
      id = this.uniqueKey
    } else {
      id = `${this.uniqueKey}:${id}`
      values = wrapArray(value)
    }

    return new Promise((resolve, reject) => {
      this.client.sadd(id, ...values, (err, ret) => {
        if (err) {
          return reject(err)
        }
        console.log('PARAMS', id, ...values)
        console.log('RESULT', ret)
        resolve()
      })
    })
  }
}
