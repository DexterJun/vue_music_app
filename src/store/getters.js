// 获取当前正在播放的歌曲
export const currentSong = (state) => {
  /* 由于Player组件被注册为全局组件，因此在一开始渲染时得到的playList是空数组，
  无法从中获取数据，所以要为其设置一个空对象值 */
  return state.playList[state.currentIndex] || {}
}
