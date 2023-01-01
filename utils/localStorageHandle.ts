export function setLocalStorage(key: string, value: any) {
  window.localStorage.setItem(key, value);
}

export function getLocalStorage(key: string) {
  return window.localStorage.getItem(key);
}
