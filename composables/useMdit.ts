import markdownit from 'markdown-it'

export const useMdit = () => {
  const mdit = markdownit({ html: true })

  return { mdit }
}
