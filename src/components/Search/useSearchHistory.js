// 搜索历史相关的钩子
import { useStore } from 'vuex'
import { save, remove, clear } from '../../assets/js/arrayStore'
import { SEARCH_KEY } from '../../assets/js/constant'

export default function useSearchHistory() {
  const store = useStore()
  const maxlen = 200

  function saveSearch(query) {
    const searches = save(query, SEARCH_KEY, (item) => {
      return item === query
    }, maxlen)
    store.commit('setSearchHistory', searches)
  }

  function deleteSearch(query) {
    const searches = remove(SEARCH_KEY, (item) => {
      return item === query
    })
    store.commit('setSearchHistory', searches)
  }

  function clearSearch() {
    const searches = clear(SEARCH_KEY)
    store.commit('setSearchHistory', searches)
  }

  return {
    saveSearch,
    deleteSearch,
    clearSearch
  }
}
