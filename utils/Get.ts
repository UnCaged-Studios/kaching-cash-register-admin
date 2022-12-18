export function getLocalStorage(key: string) {
  const ls = window.localStorage.getItem(key);
  return ls;
}
