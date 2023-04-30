
const storage = {
  get: (key: string) => localStorage.getItem(key),
  set: (key: string, value: string) =>
    localStorage.setItem(key, value),
  remove: (key: string) =>
    localStorage.removeItem(key),
  removeAll: (find?: string) => {
    const all = localStorage.get()
    Object.keys(all).forEach(key => {
      if (find) {
        if (key.match(find)) {
          localStorage.remove(key)
        }
      } else {
        localStorage.remove(key)
      }
    })
  },
  clear: () => Object.keys(localStorage.get()).forEach(key => localStorage.remove(key)),
}

export default storage
