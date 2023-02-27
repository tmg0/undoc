import fse from 'fs-extra'
import { join } from 'pathe'

export default defineEventHandler(() => {
  try {
    const path = join(process.cwd(), 'package.json')
    return fse.readJsonSync(path)
  } catch (error) { return { error } }
})
