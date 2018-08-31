import assert from 'assert'
import redis, { RedisClient } from 'redis'
import { SharedResourceManagerOptions, SharedValue } from './interfaces'
import { generateKey, wrapArray } from './utils'

export { SharedResourceManagerOptions, SharedValue }

export default class SharedResourceManager {
  public uniqueKey: string
  private client: RedisClient

  constructor(options: SharedResourceManagerOptions) {
    const { port = 6379, host = '127.0.0.1', uniqueKey = '' } = options
    if (!uniqueKey) {
      console.debug('uniqueKey is not defined, use ["SRM"] instead.')
    }

    this.client = redis.createClient(port, host)
    this.uniqueKey = uniqueKey || 'SRM'
  }

  public add(id: string, value: SharedValue): Promise<number> {
    assert(id && value, '[add] Check params')
    return new Promise((resolve, reject) => {
      this.client.sadd(this.genKey(id), ...wrapArray(value), (err, count) => {
        return err ? reject(err) : resolve(count)
      })
    })
  }

  public take(id: string, count: number = 1): Promise<string[]> {
    assert(count > 0, '[take] Check params')
    return new Promise((resolve, reject) => {
      this.client.spop(this.genKey(id), count, (err, ret) => {
        return err ? reject(err) : resolve(ret)
      })
    })
  }

  public sizeOf(id: string): Promise<number> {
    assert(id, '[sizeOf] Check params')
    return new Promise((resolve, reject) => {
      this.client.scard(this.genKey(id), (err, size) => {
        return err ? reject(err) : resolve(size)
      })
    })
  }

  public end(flush: boolean): void {
    this.client.end(flush)
  }

  private genKey(id: string): string {
    return generateKey(this.uniqueKey, id)
  }
}
