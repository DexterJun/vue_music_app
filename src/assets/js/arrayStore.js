import storage from 'good-storage'

function insertArray(arr, val, compare, maxlen) {
  const index = arr.findIndex(compare)
  if (index > -1) {
    return
  }
  arr.unshift(val)
  if (maxlen && arr.length > maxlen) {
    arr.pop()
  }
}

// 向浏览器本地保存收藏的歌曲
export function save(item, key, compare, maxlen) {
  const items = storage.get(key, [])
  insertArray(items, item, compare, maxlen)
  storage.set(key, items)
  return items
}

function deleteFromArray(arr, compare) {
  const index = arr.findIndex(compare)
  if (index > -1) {
    arr.splice(index, 1)
  }
}

// 向浏览器本地删除保存的歌曲
export function remove(key, compare) {
  const items = storage.get(key, [])
  deleteFromArray(items, compare)
  storage.set(key, items)
  return items
}

// 初始化时从本地读取收藏列表
export function load(key) {
  return storage.get(key, [])
}

// 清空本地数据
export function clear(key) {
  storage.remove(key)
  return []
}
