import fs from 'node:fs'
import { resolvePath } from 'mlly'

export default defineEventHandler(async () => {
  try {
    const path = await resolvePath('./package.json', { url: process.cwd() })
    const json = await fs.readFileSync(path).toString()
    return JSON.parse(json)
  } catch (error) { return { error } }
})
