/* 从迷你播放器弹出的播放列表组件 */
<template>
  <teleport to='body'>
    <transition name="list-fade">
      <div class="playlist" v-show="visible && playList.length" @click="hide">
        <div class="list-wrapper" @click.stop>
          <!-- 列表头部信息 -->
          <div class="list-header">
            <h1 class="title">
              <i class="icon" :class="modeIcon" @click="changeMode"></i>
              <span class="text">{{modeText}}</span>
              <span class="clear" @click="showConfirm">
                <i class="icon-clear"></i>
              </span>
            </h1>
          </div>
          <!-- 播放列表 -->
          <Scroll class="list-content" ref="scrollRef">
            <transition-group  tag="ul" name="list" ref="ulRef">
              <li class="item" v-for="song in sequenceList" :key="song.id" @click="selectItem(song)">
                <i class="current" :class="getCurrentIcon(song)"></i>
                <span class="text">{{song.name}}</span>
                <span class="favorite" @click.stop="toggleFavorite(song)">
                  <i :class="getFavoriteIcon(song)"></i>
                </span>
                <span class="delete" :class="{'disable': removing}" @click.stop="removeSong(song)">
                  <i class="icon-delete"></i>
                </span>
              </li>
            </transition-group>
          </Scroll>
          <!-- 关闭按钮 -->
          <div class="list-footer" @click.stop="hide">
            <span>关闭</span>
          </div>
        </div>
        <Confirm
          ref="confirmRef"
          text="是否清空播放列表？"
          confirmBtnText="清空"
          @confirm="confirmClear"
        ></Confirm>
      </div>
    </transition>
  </teleport>
</template>

<script>
import { computed, ref, nextTick, watch } from 'vue'
import { useStore } from 'vuex'
import useMode from './useMode'
import useFavorite from './useFavorite'
import Scroll from '../base/scroll/Scroll.vue'
import Confirm from '../base/conform/Conform.vue'

export default {
  name: 'playList',
  components: { Scroll, Confirm },
  setup() {
    const visible = ref(false)
    const scrollRef = ref(null)
    const confirmRef = ref(null)
    const ulRef = ref(null)
    const removing = ref(null)

    const store = useStore()
    const playList = computed(() => store.state.playList)
    const sequenceList = computed(() => store.state.sequenceList)
    const currentSong = computed(() => store.getters.currentSong)

    const { modeIcon, modeText, changeMode } = useMode()
    const { getFavoriteIcon, toggleFavorite } = useFavorite()

    // 当播放歌曲发生变化时都将刷新滚动列表
    watch(currentSong, async (newSong) => {
      // 快速点击删除时会传入一个空的歌曲对象
      if (!visible.value || !newSong.id) {
        return
      }
      await nextTick()
      scrollToCurrent()
    })

    // 为正在播放的歌曲左侧添加播放图标
    function getCurrentIcon(song) {
      if (song.id === currentSong.value.id) {
        return 'icon-play'
      }
    }

    async function show() {
      visible.value = true
      await nextTick()
      refreshScroll()
      scrollToCurrent()
    }

    function hide() {
      visible.value = false
    }

    function refreshScroll() {
      scrollRef.value.scroll.refresh()
    }
    // 每次点开播放列表组件时都将当前播放的歌曲置顶
    function scrollToCurrent() {
      const index = sequenceList.value.findIndex((song) => {
        return currentSong.value.id === song.id
      })
      // 点击过快会找不到歌曲
      if (index === -1) {
        return
      }
      const target = ulRef.value.$el.children[index]
      scrollRef.value.scroll.scrollToElement(target, 300)
    }
    // 实现点击歌曲播放
    function selectItem(song) {
      const index = playList.value.findIndex((item) => {
        return song.id === item.id
      })
      store.commit('setCurrentIndex', index)
      store.commit('setPlayingState', true)
    }

    function removeSong(song) {
      // 如果正在删除歌曲则不执行，避免过快的点击
      if (removing.value) {
        return
      }
      removing.value = true
      store.dispatch('removeSong', song)
      if (!playList.value) {
        hide()
      }
      setTimeout(() => {
        removing.value = false // 动画结束后才可以再次删除
      }, 300)
    }

    function showConfirm() {
      confirmRef.value.show()
    }

    function confirmClear() {
      store.dispatch('clearSongList')
      hide()
    }

    return {
      scrollRef,
      confirmRef,
      ulRef,
      visible,
      playList,
      removing,
      sequenceList,
      modeIcon,
      modeText,
      changeMode,
      getFavoriteIcon,
      toggleFavorite,
      hide,
      show,
      getCurrentIcon,
      refreshScroll,
      selectItem,
      removeSong,
      showConfirm,
      confirmClear
    }
  }
}
</script>

<style lang="scss" scoped>
  .playlist {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 200;
    background-color: $color-background-d;
    &.list-fade-enter-active, &.list-fade-leave-active {
      transition: opacity .3s;
      .list-wrapper {
        transition: all .3s;
      }
    }
    &.list-fade-enter-from, &.list-fade-leave-to {
      opacity: 0;
      .list-wrapper {
        transform: translate3d(0, 100%, 0);
      }
    }
    .list-wrapper {
      position: fixed;
      left: 0;
      bottom: 0;
      z-index: 210;
      width: 100%;
      background-color: $color-highlight-background;
      .list-header {
        position: relative;
        padding: 20px 30px 10px 20px;
        .title {
          display: flex;
          align-items: center;
          .icon {
            margin-right: 10px;
            font-size: 24px;
            color: $color-theme-d;
          }
          .text {
            flex: 1;
            font-size: $font-size-medium;
            color: $color-text-l;
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
      .list-content {
        max-height: 240px;
        overflow: hidden;
        .item {
          display: flex;
          align-items: center;
          height: 40px;
          padding: 0 30px 0 20px;
          overflow: hidden;
          .current {
            flex: 0 0 20px;
            width: 20px;
            font-size: $font-size-small;
            color: $color-theme-d;
          }
          .text {
            flex: 1;
            @include no-wrap();
            font-size: $font-size-medium;
            color: $color-text-d;
          }
          .favorite {
            @include extend-click();
            margin-right: 15px;
            font-size: $font-size-small;
            color: $color-theme;
            .icon-favorite {
              color: $color-sub-theme;
            }
          }
          .delete {
            @include extend-click();
            font-size: $font-size-small;
            color: $color-theme;
            &.disable {
              color: $color-theme-d;
            }
          }
        }
      }
      .list-add {
        width: 140px;
        margin: 20px auto 30px auto;
        .add {
          display: flex;
          align-items: center;
          padding: 8px 16px;
          border: 1px solid $color-text-l;
          border-radius: 100px;
          color: $color-text-l;
          .icon-add {
            margin-right: 5px;
            font-size: $font-size-small-s;
          }
          .text {
            font-size: $font-size-small;
          }
        }
      }
      .list-footer {
        text-align: center;
        line-height: 50px;
        background: $color-background;
        font-size: $font-size-medium-x;
        color: $color-text-l;
      }
    }
  }
</style>
