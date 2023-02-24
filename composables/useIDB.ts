import { openDB } from 'idb'

export enum CacheStore {
  NPM_VIEW_API = 'npm-view-api',
  REPO_DOC_API = 'repo-doc-api'
}

export const useIdb = () => {
  const db = openDB('cache', 1, {
    upgrade (db) {
      Object.values(CacheStore).forEach((store) => {
        db.createObjectStore(store)
      })
    }
  })

  const get = async (store: CacheStore, key: string, def = '') => {
    if (!db) { return '' }

    const data = await (await db).get(store, key)

    if (!data) { return def }

    if (!data.expire) { return data.value }

    if (data.expire >= new Date().getTime()) { return data.value }

    del(store, key)
  }

  const set = async (store: CacheStore, value: any, key: string, expire: number = 1000 * 60 * 60) => {
    if (!db) { return '' }

    return await (await db).put(store, {
      value,
      expire: expire ? new Date().getTime() + expire : null
    }, key)
  }

  const del = async (store: CacheStore, key: string) => {
    if (!db) { return '' }

    return await (await db).delete(store, key)
  }

  const clear = async (store: CacheStore) => {
    if (!db) { return '' }

    return await (await db).clear(store)
  }

  return { db, open, get, set, del, clear }
}
