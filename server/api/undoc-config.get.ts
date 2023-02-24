import fs from 'node:fs'
import { resolvePath } from 'mlly'
import merge from 'lodash.merge'
import defaultUndocConf from '~~/undoc.config.json'

export default defineEventHandler(async () => {
  try {
    const path = await resolvePath('./undoc.config.json', { url: process.cwd() })
    const json = fs.readFileSync(path).toString()
    return merge(defaultUndocConf, JSON.parse(json)) as UndocConfig
  } catch (error) { return { error } }
})
