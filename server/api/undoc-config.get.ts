import undocConf from '~~/undoc.config.json'

export default defineEventHandler(() => {
  try {
    return undocConf as UndocConfig
  } catch (error) { return { error } }
})
