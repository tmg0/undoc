import fse from 'fs-extra'
import merge from 'lodash.merge'
import { join } from 'pathe'
import defaultUndocConf from '~~/undoc.config.json'

export default defineEventHandler(async (): Promise<UndocConfig> => {
  try {
    const path = join(process.cwd(), '/undoc.config.json')

    const existCustomConf = await fse.pathExists(path)

    if (!existCustomConf) { return defaultUndocConf }

    const json = fse.readJsonSync(path)

    return merge(defaultUndocConf, json)
  } catch (error) { throw new Error(String(error)) }
})
