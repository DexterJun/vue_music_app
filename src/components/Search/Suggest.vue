/* 搜索提示组件 */
<template>
  <div
    class="suggest"
    ref="rootRef"
    v-loading:[loadingText]="loading"
    v-no-result:[noResultText]="noResult"
  >
    <ul class="suggest-list">
      <!-- 歌手列表 -->
      <li class="suggest-item" v-if="singer" @click="selectSinger(singer)">
        <div class="icon">
          <i class="icon-mine"></i>
        </div>
        <div class="name">
          <p class="text">{{singer.name}}</p>
        </div>
      </li>
      <!-- 歌曲列表 -->
      <li class="suggest-item" v-for="song in songs" :key="song.id" @click="selectSong(song)">
        <div class="icon">
          <i class="icon-music"></i>
        </div>
        <div class="name">
          <p class="text">{{song.singer}}--{{song.name}}</p>
        </div>
      </li>
      <div class="suggest-item" v-loading:[loadingText]="pullUpLoading"></div>
    </ul>
  </div>
</template>

<script>
import { ref, watch, computed, nextTick } from 'vue'
import { search } from '../../service/search'
import { processSongs } from '../../service/song'
import usePullUpLoad from './usePullUpLoad'

export default {
  name: 'Suggest',
  props: {
    query: String,
    showSinger: {
      type: Boolean,
      default: true
    }
  },
  emits: ['selectSong', 'selectSinger'],
  setup(props, { emit }) {
    const singer = ref(null)
    const songs = ref([])
    const page = ref(1)
    const hasMore = ref(true)
    const loadingText = ref('')
    const noResultText = ref('抱歉，暂无搜索结果')
    const autoLoading = ref(false)

    const loading = computed(() => {
      return !singer.value && !songs.value.length
    })
    const noResult = computed(() => {
      return !singer.value && !songs.value.length && !hasMore.value
    })
    const pullUpLoading = computed(() => {
      // 当正在上拉且有还有更多数据时显示正在加载的效果
      return isPullUpLoad.value && hasMore.value
    })
    /* 定义一个变量，当正在加载数据的时候用户执行上拉操作，则屏蔽此次操作，知道数据请求完毕才能上拉 */
    const preventPullUpLoad = computed(() => {
      return loading.value || autoLoading.value
    })

    const { scroll, rootRef, isPullUpLoad } = usePullUpLoad(searchMore, preventPullUpLoad)

    watch(() => props.query, async (newQuery) => {
      if (!newQuery) {
        return
      }
      await searchFirst()
    })
    // 当query参数发生变化时向后端请求数据
    async function searchFirst() {
      /* 一个极端情况：当输入了参数发送请求的过程中点击了叉号，需要取消之后的请求，
      所以在每次请求之前需要判断参数是否还存在，不存在就不执行后面的操作了 */
      if (!props.query) {
        return
      }
      page.value = 1
      songs.value = []
      singer.value = null
      hasMore.value = true

      const result = await search(props.query, page.value, props.showSinger)
      songs.value = await processSongs(result.songs)
      singer.value = result.singer
      hasMore.value = result.hasMore
      await nextTick()
      await makeItScrollable()
    }
    // 上拉操作时请求数据并与之前的数据做拼接
    async function searchMore() {
      if (!hasMore.value || !props.query) {
        return
      }
      page.value++ // 请求下一页的数据
      const result = await search(props.query, page.value, props.showSinger)
      songs.value = songs.value.concat(await processSongs(result.songs))
      hasMore.value = result.hasMore
      await nextTick()
      await makeItScrollable()
    }
    // 当请求回来的数据没有占满一屏的时候自动发送请求数据直到占满为止
    async function makeItScrollable() {
      if (scroll.value.maxScrollY >= -1) {
        autoLoading.value = true
        await searchMore()
        autoLoading.value = false
      }
    }
    function selectSong(song) {
      emit('selectSong', song)
    }
    function selectSinger(singer) {
      emit('selectSinger', singer)
    }

    return {
      singer,
      songs,
      loadingText,
      noResultText,
      loading,
      noResult,
      rootRef,
      isPullUpLoad,
      pullUpLoading,
      selectSong,
      selectSinger
    }
  }
}
</script>

<style lang="scss" scoped>
  .suggest {
    height: 100%;
    overflow: hidden;
    .suggest-list {
      padding: 0 30px;
      .suggest-item {
        display: flex;
        align-items: center;
        padding-bottom: 20px;
        .icon {
          flex: 0 0 30px;
          width: 30px;
          [class^="icon-"] {
            font-size: 14px;
            color: $color-text-d;
          }
        }
        .name {
          flex: 1;
          font-size: $font-size-medium;
          color: $color-text-d;
          overflow: hidden;
          .text {
            @include no-wrap();
          }
        }
      }
    }
  }
</style>
