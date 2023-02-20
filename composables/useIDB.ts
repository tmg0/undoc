import { openDB } from 'idb'

export enum CacheStore {
  GITHUB_API = 'github-api'
}

export const useIDB = () => {
  const db = openDB('cache', 1, {
    upgrade (db) {
      db.createObjectStore(CacheStore.GITHUB_API)
    }
  })

  const get = async (store: CacheStore, key: string, def = '') => {
    const item = await (await db).get(store, key)

    if (item !== null) {
      try {
        const data = JSON.parse(item)

        if (!data.expire) { return data.value }

        if (data.expire >= new Date().getTime()) { return data.value }

        await del(store, key)
      } catch (err) {
        return def
      }
    }

    return def
  }

  const set = async (store: CacheStore, value: any, key: string, expire?: number) => {
    const stringifyValue = JSON.stringify({
      value,
      expire: expire ? new Date().getTime() + expire : null
    })

    return await (await db).put(store, key, stringifyValue)
  }

  const del = async (store: CacheStore, key: string) => {
    return await (await db).delete(store, key)
  }

  const clear = async (store: CacheStore) => {
    return await (await db).clear(store)
  }

  return { db, get, set, del, clear }
}
