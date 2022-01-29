import { PLAY_MODE } from '../assets/js/constant'
import { shuffle } from '../assets/js/util'

export function selectPlay({ commit }, { list, index }) {
  commit('setPlayMode', PLAY_MODE.sequence)
  commit('setSquenceList', list)
  commit('setPlayingState', true)
  commit('setFullScreen', true)
  commit('setPlsyList', list)
  commit('setCurrentIndex', index)
}

export function randomPlay({ commit }, list) {
  commit('setPlayMode', PLAY_MODE.random)
  commit('setSquenceList', list)
  commit('setPlayingState', true)
  commit('setFullScreen', true)
  commit('setPlsyList', shuffle(list))
  commit('setCurrentIndex', 0)
}
