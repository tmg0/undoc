import markdownit from 'markdown-it'
import containerPlugin from 'markdown-it-container'

export const useMdit = () => {
  const mdit = markdownit({ html: true })

  return { mdit }
}
