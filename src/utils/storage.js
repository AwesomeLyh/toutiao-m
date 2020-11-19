export const getItem = key => {
  const item = window.localStorage.getItem(key)
  try {
    return JSON.parse(item)
  } catch (error) {
    return item
  }
}

export const setItem = (key, value) => {
  if (typeof value === 'object') {
    value = JSON.stringify(value)
  }
  window.localStorage.setItem(key, value)
}
