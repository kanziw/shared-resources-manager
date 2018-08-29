import SharedResourceManager from '../src/index'

describe('Add shared values', () => {
  let srm: SharedResourceManager
  before(() => {
    srm = new SharedResourceManager({ uniqueKey: 'TEST' })
  })
  afterEach(() => {
    return new Promise((resolve, reject) => {
      srm.client.flushall(err => (err ? reject(err) : resolve()))
    })
  })
  after(() => srm.client.end(true))

  it('basic', async () => {
    console.log('?????')

    await srm.add('123')
    await new Promise(resolve => {
      srm.client.smembers('TEST', (err, ret) => {
        console.log('ER?', err)
        console.log('', ret)
        resolve()
      })
    })
  })
})
