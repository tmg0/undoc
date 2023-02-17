const useMapValues = <T extends Record<string, any>>(object: T, iteratee: (value: T, key: string, object: Record<string, T>) => any) => {
  object = Object(object)
  const result: Record<string, any> = {}

  Object.keys(object).forEach((key) => {
    const value = iteratee(object[key], key, object)
    if (value) { result[key] = value }
  })
  return result
}

export default useMapValues
