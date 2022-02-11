/* 搜索组件 */
<template>
  <div class="search">
    <!-- 输入框 -->
    <div class="search-input-wrapper">
      <SearchInput v-model="query"></SearchInput>
    </div>
    <!-- 搜索列表区域 -->
    <scroll class="search-content" v-show="!query" ref="scrollRef">
      <div>
        <!-- 热门搜索区域 -->
        <div class="hot-keys">
          <h1 class="title">热门搜索</h1>
          <ul>
            <li class="item" v-for="item in hotKeys" :key="item.id" @click="addQuery(item.key)">
              <span>{{item.key}}</span>
            </li>
          </ul>
        </div>
        <!-- 搜索历史区域 -->
        <div class="search-history" v-show="searchHistory.length">
          <h1 class="title">
            <span class="text">搜索历史</span>
            <span class="clear" @click="showConfirm">
              <i class="icon-clear"></i>
            </span>
          </h1>
          <Confirm
            ref="confirmRef"
            text="是否清空所有搜索历史"
            confirmBtnText="清空"
            @confirm="clearSearch"
          ></Confirm>
          <SearchList :searches="searchHistory" @select="addQuery" @delete="deleteSearch"></SearchList>
        </div>
      </div>
    </scroll>
    <!-- 搜索提示区域 -->
    <div class="search-result" v-show="query">
      <Suggest :query="query" @selectSong="selectSong" @selectSinger="selectSinger"></Suggest>
    </div>
    <!-- 路由跳转时加载左右滑动的动画效果 -->
    <router-view v-slot="{ Component }">
      <transition appear name="slide">
        <component :is="Component" :data="selectedSinger"></component>
      </transition>
    </router-view>
  </div>
</template>

<script>
import { ref, watch, computed, nextTick } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import SearchInput from '../components/Search/SearchInput.vue'
import Suggest from '../components/Search/Suggest.vue'
import SearchList from '../components/base/searchList/SearchList.vue'
import scroll from '../components/wrapScroll/index'
import Confirm from '../components/base/conform/Conform.vue'
import { getHotKeys } from '../service/search'
import storage from 'good-storage'
import { SINGER_KEY } from '../assets/js/constant'
import useSearchHistory from '../components/Search/useSearchHistory'

export default {
  name: 'Search',
  components: { SearchInput, Suggest, SearchList, scroll, Confirm },
  setup() {
    const store = useStore()
    const router = useRouter()
    const query = ref('')
    const hotKeys = ref([])
    const selectedSinger = ref(null)
    const scrollRef = ref(null)
    const confirmRef = ref(null)

    const searchHistory = computed(() => store.state.searchHistory)

    const { saveSearch, deleteSearch, clearSearch } = useSearchHistory()

    getHotKeys().then((result) => {
      hotKeys.value = result.hotKeys
    })

    watch(query, async (newQuery) => {
      if (!newQuery) {
        await nextTick()
        refreshScroll()
      }
    })

    function refreshScroll() {
      scrollRef.value.scroll.refresh()
    }
    // 将搜索词传给input
    function addQuery(s) {
      query.value = s
    }
    // 添加并播放当前选中的歌曲
    function selectSong(song) {
      saveSearch(query.value)
      store.dispatch('addSong', song)
    }
    // 跳转到歌手详情页
    function selectSinger(singer) {
      saveSearch(query.value)
      selectedSinger.value = singer
      cacheSinger(singer)
      router.push({
        path: `/search/${singer.mid}`
      })
    }
    function cacheSinger(singer) {
      storage.session.set(SINGER_KEY, singer)
    }
    function showConfirm() {
      confirmRef.value.show()
    }

    return {
      query,
      hotKeys,
      addQuery,
      selectSong,
      selectSinger,
      selectedSinger,
      searchHistory,
      deleteSearch,
      scrollRef,
      showConfirm,
      confirmRef,
      clearSearch
    }
  }
}
</script>

<style lang="scss" scoped>
  .search {
    position: fixed;
    width: 100%;
    top: 88px;
    bottom: 0;
    display: flex;
    flex-direction: column;
    .search-input-wrapper {
      margin: 20px;
    }
    .search-content {
      flex: 1;
      overflow: hidden;
      .hot-keys {
        margin: 0 20px 20px 20px;
        .title {
          margin-bottom: 20px;
          font-size: $font-size-medium;
          color: $color-text-l;
        }
        .item {
          display: inline-block;
          padding: 5px 10px;
          margin: 0 20px 10px 0;
          border-radius: 6px;
          background: $color-highlight-background;
          font-size: $font-size-medium;
          color: $color-text-d;
        }
      }
      .search-history {
        position: relative;
        margin: 0 20px;
        .title {
          display: flex;
          align-items: center;
          height: 40px;
          font-size: $font-size-medium;
          color: $color-text-l;
          .text {
            flex: 1;
          }
          .clear {
            @include extend-click();
            .icon-clear {
              font-size: $font-size-medium;
              color: $color-text-d;
            }
          }
        }
      }
    }
    .search-result {
      flex: 1;
      overflow: hidden;
    }
  }
</style>
