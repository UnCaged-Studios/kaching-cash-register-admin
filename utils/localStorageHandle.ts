export function setLocalStorage(key: string, value: any) {
  window.localStorage.setItem(key, value);
}

export function getLocalStorage(key: string) {
  const ls = window.localStorage.getItem(key);
  return ls;
}
