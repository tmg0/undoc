import { exec } from 'node:child_process'

const processExec = (cmd: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    exec(cmd, (error, stdout) => {
      if (error) {
        reject(error)
        return
      }
      resolve(stdout)
    })
  })
}

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event)
    const out = await processExec(`npm view ${query.lib} versions`)
    return out.slice(2, -2).split(',\n ')
  } catch (error) { return { error } }
})
