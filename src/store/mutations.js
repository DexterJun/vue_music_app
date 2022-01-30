const mutations = {
  setPlayingState(state, playing) {
    state.playing = playing
  },
  setSquenceList(state, list) {
    state.sequenceList = list
  },
  setPlsyList(state, list) {
    state.playList = list
  },
  setPlayMode(state, mode) {
    state.playMode = mode
  },
  setCurrentIndex(state, index) {
    state.currentIndex = index
  },
  setFullScreen(state, fullScreen) {
    state.fullScreen = fullScreen
  }
}

export default mutations
