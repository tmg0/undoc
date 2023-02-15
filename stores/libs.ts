export interface Lib {
  name: string
  version: string
}

export interface PackageJSON extends Record<string, any> {
  dependencies?: Record<string, string>
  devDependencies?: Record<string, string>
  [key: string]: string | number | string[] | Record<string, string> | undefined
}

export const useLibs = defineStore('lib', {
  state: () => ({
    count: 0,
    libs: [] as Lib[]
  }),

  actions: {
    parsePackageJSON (json: PackageJSON) {
      const libs = Object.entries({ ...(json.dependencies || {}), ...(json.devDependencies || {}) }).map(([name, version]) => ({
        name, version
      }))

      this.libs = libs
      this.count = libs.length
    }
  }
})
