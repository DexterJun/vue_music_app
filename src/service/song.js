import { get } from './base'

export function processSongs(songs) {
  if (!songs.length) {
    return Promise.resolve(songs)
  }
  return get('/api/getSongsUrl', {
    mid: songs.map((song) => {
      return song.mid
    })
  }).then((result) => { // 这里得到的reuslt对象中有一个数组中包含了传入的songs数组中每一首歌的播放链接
    console.log('re', result)
    const map = result.map
    return songs.map((song) => { // 由于songs中的歌曲没有播放链接，所以这里需要将播放链接插入到songs中返回
      song.url = map[song.mid]
      return song
    }).filter((song) => { // 当vkey的值小于-1时表示该歌曲不可以播放，则过滤掉
      return song.url.indexOf('vkey') > -1
    })
  })
}
