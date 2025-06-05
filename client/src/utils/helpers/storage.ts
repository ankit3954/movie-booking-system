// utils/helpers/storage.ts

export function storeToken(token: string, key = 'authToken') {
  localStorage.setItem(key, token)
}

export function getToken(key = 'authToken'): string | null {
  return localStorage.getItem(key)
}

export function removeToken(key = 'authToken') {
  localStorage.removeItem(key)
}
