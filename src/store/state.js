import { PLAY_MODE, SEARCH_KEY } from '../assets/js/constant'
import { load } from '../assets/js/arrayStore'

const state = {
  sequenceList: [], // 歌曲顺序列表
  playList: [], // 正在播放的列表
  playing: false, // 标记是否正在播放
  playMode: PLAY_MODE.sequence, // 默认顺序播放
  currentIndex: 0, // 当前正在播放的歌曲索引
  fullScreen: false, // 播放器状态是否全屏
  favoriteList: [], // 收藏歌曲列表
  searchHistory: load(SEARCH_KEY), // 搜索历史
  playHistory: [] // 播放历史
}

export default state
