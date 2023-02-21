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

const parsePKG = async (query: any) => {
  const stdout = await processExec(`npm view ${query.name} --json`)
  return JSON.parse(stdout)
}

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event)
    return await parsePKG(query)
  } catch (error) { return { error } }
})
