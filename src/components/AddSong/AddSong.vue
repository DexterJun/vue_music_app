/* 添加歌曲组件 */
<template>
  <teleport to='body'>
    <transition name="slide">
      <div class="add-song" v-show="visible">
        <!-- 头部区域 -->
        <div class="header">
          <h1 class="title">添加歌曲列表</h1>
          <div class="close" @click="hide">
            <i class="icon-close"></i>
          </div>
        </div>
        <!-- 搜索框 -->
        <div class="search-input-wrapper">
          <SearchInput v-model="query" placeholder="搜索歌曲"></SearchInput>
        </div>
        <div v-show="!query">
          <Switches :items="['最近播放', '搜索历史']" v-model="currentIndex"></Switches>
          <div class="list-wrapper">
            <!-- 播放历史 -->
            <Scroll class="list-scroll" v-if="currentIndex===0" ref="scrollRef">
              <div class="list-inner">
                <SongList :songs="playHistory" @select="selectSongBySongList"></SongList>
              </div>
            </Scroll>
            <!-- 搜索历史 -->
            <Scroll class="list-scroll" v-if="currentIndex===1" ref="scrollRef">
              <div class="list-inner">
                <!-- 这里的搜索历史不展示删除按钮 -->
                <SearchList :searches="searchHistory" :showDelete="false" @select="addQuery"></SearchList>
              </div>
            </Scroll>
          </div>
        </div>
        <!-- 没有搜索过任何内容时显示提示搜索组件 -->
        <div class="search-result" v-show="query">
          <Suggest :query="query" :showSinger="false" @selectSong="selectSongBySuggest"></Suggest>
        </div>
        <!-- 添加歌曲提示信息 -->
        <Message ref="messageRef">
          <div class="message-title">
            <i class="icon-ok"></i>
            <span class="text">1首歌已经添加到播放列表</span>
          </div>
        </Message>
      </div>
    </transition>
  </teleport>
</template>

<script>
import { ref, computed, nextTick, watch } from 'vue'
import { useStore } from 'vuex'
import SearchInput from '../Search/SearchInput.vue'
import Suggest from '../Search/Suggest.vue'
import Switches from '../base/switches/Switches.vue'
import SongList from '../base/songList/SongList.vue'
import Scroll from '../base/scroll/Scroll.vue'
import SearchList from '../base/searchList/SearchList.vue'
import Message from '../base/message/Message.vue'
import useSearchHistory from '../Search/useSearchHistory'

export default {
  name: 'AddSong',
  components: { SearchInput, Suggest, Switches, SongList, Scroll, SearchList, Message },
  setup() {
    const store = useStore()
    const visible = ref(false)
    const query = ref('')
    const currentIndex = ref(0)
    const scrollRef = ref(null)
    const messageRef = ref(null)

    const searchHistory = computed(() => store.state.searchHistory)
    const playHistory = computed(() => store.state.playHistory)

    watch(query, async () => {
      await nextTick()
      refreshScroll()
    })

    const { saveSearch } = useSearchHistory()

    async function show() {
      visible.value = true
      await nextTick()
      refreshScroll()
    }
    function hide() {
      visible.value = false
    }
    function addQuery(s) {
      query.value = s
    }
    function selectSongBySongList({ song }) {
      addSong(song)
    }
    function selectSongBySuggest(song) {
      addSong(song)
      saveSearch(query.value)
    }
    function addSong(song) {
      store.dispatch('addSong', song)
      showMessage() // 添加歌曲成功显示提示信息
    }
    function refreshScroll() {
      scrollRef.value.scroll.refresh()
    }
    function showMessage() {
      messageRef.value.show()
    }

    return {
      visible,
      query,
      show,
      hide,
      currentIndex,
      searchHistory,
      playHistory,
      addQuery,
      selectSongBySongList,
      selectSongBySuggest,
      scrollRef,
      messageRef
    }
  }
}
</script>

<style lang="scss" scoped>
  .add-song {
    position: fixed;
    top: 0;
    bottom: 0;
    width: 100%;
    z-index: 300;
    background: $color-background;
    .header {
      position: relative;
      height: 44px;
      text-align: center;
      .title {
        line-height: 44px;
        font-size: $font-size-large;
        color: $color-text;
      }
      .close {
        position: absolute;
        top: 0;
        right: 8px;
        .icon-close {
          display: block;
          padding: 12px;
          font-size: 20px;
          color: $color-theme;
        }
      }
    }
    .search-input-wrapper {
      margin: 20px
    }
    .list-wrapper {
      position: absolute;
      top: 165px;
      bottom: 0;
      width: 100%;
      .list-scroll {
        height: 100%;
        overflow: hidden;
        .list-inner {
          padding: 20px 30px;
        }
      }
    }
    .search-result {
      position: fixed;
      top: 124px;
      bottom: 0;
      width: 100%;
    }
  }

  .message-title {
    text-align: center;
    padding: 18px 0;
    font-size: 0;
    .icon-ok {
      font-size: $font-size-medium;
      color: $color-theme;
      margin-right: 4px;
    }
    .text {
      font-size: $font-size-medium;
      color: $color-text;
    }
  }
</style>
