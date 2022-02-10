// 处理歌词展示的钩子函数
import { useStore } from 'vuex'
import { computed, watch, ref } from 'vue'
import { getLyric } from '../../service/song'
import Lyric from 'lyric-parser'

export default function useLyric({ songReady, currentTime }) {
  const currentLyric = ref(null) // 当前歌词
  const currentLineNum = ref(0) // 当前行号
  const lyricScrollRef = ref(null)
  const lyricListRef = ref(null)
  const pureMusicLyric = ref('') // 纯音乐歌词提示词
  const playingLyric = ref('') // 当前正在播放的歌词
  const store = useStore()
  const currentSong = computed(() => store.getters.currentSong)

  watch(currentSong, async (newSong) => {
    if (!newSong.url || !newSong.id) {
      return
    }
    /* 当按着列表往下切换歌曲即每次都播放新的歌曲时歌词和歌曲播放都没有问题，
    但是如果往回切歌时，由于切歌时并没有停下歌词播放，而切回到该歌曲时歌词又从头开始播放，
    就造成了歌词上下来回滚动的问题，所以在切换歌曲时需要把歌词停掉 */
    stopLyric()
    /* 由于歌词的加载是异步的过程，如果在歌曲已经ready，但是歌词还没有加载成功，
    此时会触发playLyric，而新的lyric还没有准备好，程序中保存的还是上一首歌的lyric和lineNum，
    因此在播放时可能会出现歌词和歌曲不匹配的情况，所以要在切换歌曲时将下面两个参数重置 */
    currentLyric.value = null
    currentLineNum.value = 0
    pureMusicLyric.value = ''
    playingLyric.value = ''

    const lyric = await getLyric(newSong)
    // 将歌词添加到对应的歌曲对象中交给vuex保存
    store.commit('addSongLyric', {
      song: newSong,
      lyric
    })
    /* 当歌曲由A切换到B，B歌曲在getLyric的过程中又切换到了C歌曲，则执行到下面的if语句时，
    currentSong已经变成了歌曲C，而获取到的lyric却是歌曲B的，所以在歌曲B的那一轮事件循环中
    就不需要执行后续的歌词操作了，等到了歌曲C的事件循环中再执行后续操作。 */
    if (currentSong.value.lyric !== lyric) {
      return
    }
    currentLyric.value = new Lyric(lyric, handleLyric)
    console.log('currentLyric', currentLyric.value)
    const hasLyric = currentLyric.value.lines.length
    if (hasLyric) {
      // 如果歌曲准备就绪则播放歌词
      if (songReady.value) {
        playLyric()
      }
    } else {
      playingLyric.value = pureMusicLyric.value = lyric.replace(/\[(\d{2}):(\d{2}):(\d{2})\]/g, '')
    }
  })
  function handleLyric({ lineNum, txt }) {
    currentLineNum.value = lineNum
    playingLyric.value = txt // 获取当前正在播放的歌词
    const scrollComp = lyricScrollRef.value
    const listEl = lyricListRef.value
    if (!listEl) {
      return
    }
    if (lineNum > 5) {
      const lineEl = listEl.children[lineNum - 5]
      scrollComp.scroll.scrollToElement(lineEl, 1000)
    } else {
      scrollComp.scroll.scrollTo(0, 0, 1000)
    }
  }
  function playLyric() {
    const currentLyricVal = currentLyric.value
    if (currentLyricVal) {
      /* 经过lyric-parser包装过的歌词对象，其原型上会有一个seek方法，用来进行歌词的跳转，
      参数为跳转的时间 */
      currentLyricVal.seek(currentTime.value * 1000)
    }
  }
  function stopLyric() {
    const currentLyricVal = currentLyric.value
    if (currentLyricVal) {
      currentLyricVal.stop()
    }
  }
  console.log('currentLineNum', currentLineNum.value)
  return {
    currentLineNum,
    currentLyric,
    playLyric,
    lyricScrollRef,
    lyricListRef,
    stopLyric,
    pureMusicLyric,
    playingLyric
  }
}
