import { get } from './base'

// 获取歌曲信息
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
      return song.url && song.url.indexOf('vkey') > -1
    })
  })
}

// 获取歌词信息
/* 如果只在一个地方如歌曲列表中操作时，一首歌的对象是固定的，可以直接判断歌曲对象中是否有
lyric属性即可，但是一首歌可能在其他地方也存在，如推荐列表等，此时还是这首歌，但是会生成一个
新的歌曲对象，来到这里就会从新请求一次歌词，因此这里对歌曲的mid进行一次缓存，如果lyricMap中
保存了当前歌曲的歌词，则不用再去请求 */
const lyricMap = {}
export function getLyric(song) {
  if (song.lyric) {
    return Promise.resolve(song.lyric)
  }
  const mid = song.mid
  const lyric = lyricMap[mid]
  if (lyric) {
    return Promise.resolve(lyric)
  }
  return get('/api/getLyric', {
    mid
  }).then((result) => {
    const lyric = result ? result.lyric : '[00:00:00]该歌曲暂时无法获取歌词'
    lyricMap[mid] = lyric
    return lyric
  })
}
