// 收藏相关钩子函数

import { useStore } from 'vuex'
import { computed } from 'vue'
import { save, remove } from '../../assets/js/arrayStore'
import { FAVORITE_KEY } from '../../assets/js/constant'

export default function useFavorite() {
  const store = useStore()
  const favoriteList = computed(() => store.state.favoriteList)
  const maxlen = 100 // 最多收藏100首歌曲

  function getFavoriteIcon(song) {
    return isFavorite(song) ? 'icon-favorite' : 'icon-not-favorite'
  }

  // 判断收藏列表中是否有当前播放的歌曲
  function isFavorite(song) {
    return favoriteList.value.findIndex((item) => {
      return item.id === song.id
    }) > -1
  }

  // 添加或移除喜欢列表
  function toggleFavorite(song) {
    let list
    if (isFavorite(song)) {
      // 如果歌曲已经在收藏列表中，则取消收藏
      list = remove(FAVORITE_KEY, compare)
    } else {
      // 如果歌曲不再收藏列表中，则加入收藏
      list = save(song, FAVORITE_KEY, compare, maxlen)
    }
    store.commit('setFavoriteList', list)
    function compare(item) {
      return item.id === song.id
    }
  }

  return {
    getFavoriteIcon,
    toggleFavorite
  }
}
