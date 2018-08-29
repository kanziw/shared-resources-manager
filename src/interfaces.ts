import { ClientOpts } from 'redis'

export interface SharedResourceManagerOptions extends ClientOpts {
  uniqueKey: string
}

export type SharedValue = string | string[] | undefined
