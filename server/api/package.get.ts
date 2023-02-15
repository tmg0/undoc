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

const parseVersions = async (query: any) => {
  const stdout = await processExec(`npm view ${query.lib} versions --json`)
  return JSON.parse(stdout)
}

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event)
    const [versions] = await Promise.all([parseVersions(query)])
    return { versions }
  } catch (error) { return { error } }
})
