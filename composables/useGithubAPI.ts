const githubAPI = 'https://api.github.com'

export const useGithubAPI = () => {
  const getContentAPI = (owner?: string, repo?: string, filepath?: string, branch?: string) => `${githubAPI}/repos/${owner}/${repo}/contents/${filepath}?ref=${branch}`

  return { getContentAPI }
}
