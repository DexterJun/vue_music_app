/* 播放器组件 */
<template>
  <div class="player" v-show="playList.length">
    <transition
      name="normal"
      @enter="enter"
      @afterEnter="afterEnter"
      @leave="leave"
      @afterLeave="afterLeave"
    >
      <div class="normal-player" v-show="fullScreen">
        <!-- 歌曲背景图片 -->
        <div class="background">
          <img :src="currentSong.pic">
        </div>
        <!-- 播放器顶部歌曲信息即缩小按钮 -->
        <div class="top">
          <div class="back" @click="goBack">
            <i class="icon-back"></i>
          </div>
          <h1 class="title">{{currentSong.name}}</h1>
          <h2 class="subtitle">{{currentSong.singer}}</h2>
        </div>
        <!-- 播放器中间内容区 -->
        <div
          class="middle"
          @touchstart.prevent="onMiddleTouchStart"
          @touchmove.prevent="onMiddleTouchMove"
          @touchend.prevent="onMiddleTouchEnd"
        >
          <!-- 旋转专辑封面 -->
          <div class="middle-l" :style="middleLStyle">
            <!-- 旋转专辑封面 -->
            <div class="cd-wrapper" ref="cdWrapperRef">
              <div class="cd" ref="cdRef">
                <img class="image" :class="cdCls" ref="cdImageRef" :src="currentSong.pic">
              </div>
            </div>
            <!-- 当前正在播放的歌词 -->
            <div class="playing-lyric-wrapper">
              <div class="playing-lyric">{{playingLyric}}</div>
            </div>
          </div>
          <!-- 歌词页面 -->
          <Scroll class="middle-r" ref="lyricScrollRef" :style="middleRStyle">
            <div class="lyric-wrapper">
              <!-- 歌词存在播放歌词 -->
              <div v-if="currentLyric" ref="lyricListRef">
                <p
                  class="text"
                  :class="{'current': currentLineNum === index}"
                  v-for="(line, index) in currentLyric.lines"
                  :key="line.num"
                >
                  {{line.txt}}
                </p>
              </div>
              <!-- 歌词不存在显示提示 -->
              <div class="pure-music" v-show="pureMusicLyric">
                <p>{{pureMusicLyric}}</p>
              </div>
            </div>
          </Scroll>
        </div>
        <!-- 播放器底部控制播放按钮 -->
        <div class="bottom">
          <!-- 歌词与操作页面切换的小点 -->
          <div class="dot-wrapper">
            <span class="dot" :class="{'active': currentShow === 'cd'}"></span>
            <span class="dot" :class="{'active': currentShow === 'lyric'}"></span>
          </div>
          <!-- 播放进度条 -->
          <div class="progress-wrapper">
            <!-- 当前歌曲播放时长 -->
            <span class="time time-l">{{formatTime(currentTime)}}</span>
            <!-- 进度条组件 -->
            <div class="progress-bar-wrapper">
              <ProgressBar
                ref="barRef"
                :progress="progress"
                @progressChanging="onProgressChanging"
                @progressChanged="onProgressChanged"
              ></ProgressBar>
            </div>
            <!-- 当前歌曲总时长 -->
            <span class="time time-r">{{formatTime(currentSong.duration)}}</span>
          </div>
          <!-- 歌曲操作按钮 -->
          <div class="operators">
            <!-- 播放模式按钮 -->
            <div class="icon i-left">
              <i :class="modeIcon" @click="changeMode"></i>
            </div>
            <!-- 上一首按钮 -->
            <div class="icon i-left"  :class="disableCls">
              <i class="icon-prev" @click="prev"></i>
            </div>
            <!-- 播放或暂定按钮 -->
            <div class="icon i-center"  :class="disableCls">
              <i :class="playIcon" @click="togglePlay" ></i>
            </div>
            <!-- 下一首按钮 -->
            <div class="icon i-right" :class="disableCls">
              <i class="icon-next" @click="next"></i>
            </div>
            <!-- 收藏按钮 -->
            <div class="icon i-right">
              <i :class="getFavoriteIcon(currentSong)" @click="toggleFavorite(currentSong)"></i>
            </div>
          </div>
        </div>
      </div>
    </transition>
    <MiniPlayer :progress="progress" :togglePlay="togglePlay"></MiniPlayer>
    <!-- 当终端可以播放媒体文件时触发该canplay事件，估计加载足够的数据来播放媒体直到其结束，
    而不必停止以进一步缓冲内容 -->
    <audio
      ref="audioRef"
      @pause="pause"
      @canplay="ready"
      @error="error"
      @timeupdate="updateTime"
      @ended="end"
    ></audio>
  </div>
</template>

<script>
import { useStore } from 'vuex'
import { ref, computed, watch, nextTick } from 'vue'
import useMode from './useMode'
import useFavorite from './useFavorite'
import useCd from './useCd'
import useLyric from './useLyric'
import useInteractive from './useInteractive'
import useAnimation from './useAnimation'
import { formatTime } from '../../assets/js/util'
import { PLAY_MODE } from '../../assets/js/constant'
import ProgressBar from './ProgressBar.vue'
import Scroll from '../base/scroll/Scroll.vue'
import MiniPlayer from './MiniPlayer.vue'

export default {
  name: 'Player',
  components: {
    ProgressBar,
    Scroll,
    MiniPlayer
  },
  setup() {
    const audioRef = ref(null)
    const barRef = ref(null)
    const songReady = ref(false)
    const currentTime = ref(0)
    let progressChanging = false

    const store = useStore()
    const fullScreen = computed(() => store.state.fullScreen)
    const currentSong = computed(() => store.getters.currentSong)
    const playing = computed(() => store.state.playing)
    const currentIndex = computed(() => store.state.currentIndex)
    const playList = computed(() => store.state.playList)
    const playMode = computed(() => store.state.playMode)

    const { modeIcon, changeMode } = useMode()
    const { getFavoriteIcon, toggleFavorite } = useFavorite()
    const { cdCls, cdRef, cdImageRef } = useCd()
    const {
      currentLineNum,
      currentLyric,
      playLyric,
      lyricScrollRef,
      lyricListRef,
      stopLyric,
      pureMusicLyric,
      playingLyric
    } = useLyric({ songReady, currentTime })
    const {
      currentShow,
      middleLStyle,
      middleRStyle,
      onMiddleTouchStart,
      onMiddleTouchMove,
      onMiddleTouchEnd
    } = useInteractive()

    const { cdWrapperRef, enter, afterEnter, leave, afterLeave } = useAnimation()

    const playIcon = computed(() => { // 播放和暂停图标的切换
      return playing.value ? 'icon-pause' : 'icon-play'
    })
    const disableCls = computed(() => { // 当歌曲没有就绪时操作按钮不可用
      return songReady.value ? '' : 'disable'
    })
    const progress = computed(() => {
      return currentTime.value / currentSong.value.duration
    })

    // 监视当前播放的歌曲，如果切歌则播放新的歌曲
    watch(currentSong, (newSong) => {
      if (!newSong.id || !newSong.url) {
        return
      }
      currentTime.value = 0 // 切歌时将播放时长重置为0
      songReady.value = false // 当歌曲发生变化时更改songReady的值
      const audioEl = audioRef.value
      audioEl.src = newSong.url
      audioEl.play()
      store.commit('setPlayingState', true)
    })
    // 监视播放状态，如果改变则操作audio播放或暂停
    watch(playing, (newPlaying) => {
      if (!songReady.value) { // 如果歌曲还没有准备好则不播放
        return
      }
      const audioEl = audioRef.value
      // 如果playing的值发生变化，则更改歌曲和歌词的播放状态
      if (newPlaying) {
        audioEl.play()
        playLyric()
      } else {
        audioEl.pause()
        stopLyric()
      }
    })
    // 从小播放器切换到全屏时需要从新获取播放进度
    watch(fullScreen, async (newFullScreen) => {
      if (newFullScreen) {
        await nextTick()
        barRef.value.setOffset(progress.value)
      }
    })

    // 控制播放或者暂停的回调
    function togglePlay() {
      if (!songReady.value) {
        return
      }
      store.commit('setPlayingState', !playing.value)
    }

    // 播放器退出全屏
    function goBack() {
      store.commit('setFullScreen', false)
    }

    // 通过事件监听audio的暂停事件，如果是电脑合住等非主动暂停的情况暂停了时，也需要更改状态
    function pause() {
      store.commit('setPlayingState', false)
    }

    // 播放上一首歌
    function prev() {
      const list = playList.value
      if (!songReady.value || !list.length) { // 如果播放列表为空，则什么也不做
        return
      }
      if (list.length === 1) { // 如果播放列表只有一首歌则循环播放
        loop()
      } else {
        let index = currentIndex.value - 1
        if (index === -1) {
          // 如果当前歌曲是第一首的话，则其上一首歌是最后一首
          index = list.length - 1
        }
        store.commit('setCurrentIndex', index)
      }
    }

    // 播放下一首歌
    function next() {
      const list = playList.value
      if (!songReady.value || !list.length) {
        return
      }
      if (list.length === 1) {
        loop()
      } else {
        let index = currentIndex.value + 1
        if (index === list.length) {
          index = 0
        }
        store.commit('setCurrentIndex', index)
      }
    }

    // 单曲循环
    function loop() {
      const audioEl = audioRef.value
      audioEl.currentTime = 0
      audioEl.play()
      store.commit('setPlayingState', true)
    }

    // 歌曲可以播放时的回调
    function ready() {
      if (songReady.value) {
        return
      }
      songReady.value = true
      playLyric()
    }

    // 当播放出错时使操作按钮可选
    function error() {
      songReady.value = true
    }

    // 获取歌曲当前已经播放了的时长
    function updateTime(e) {
      if (!progressChanging) {
        currentTime.value = e.target.currentTime
      }
    }

    // 拖动进度条时触发自定义事件
    function onProgressChanging(progress) {
      progressChanging = true
      // 在拖拽过程中记录下歌曲的播放进度，但是并不改变歌曲的播放
      currentTime.value = currentSong.value.duration * progress
      playLyric() // 让歌词移动到拖拽的位置然后停下来
      stopLyric()
    }

    // 进度条拖拽结束时触发自定义事件
    function onProgressChanged(progress) {
      progressChanging = false
      // 当松开的时候再改变歌曲的播放进度
      currentTime.value = currentSong.value.duration * progress
      audioRef.value.currentTime = currentTime.value
      // 拖拽完成如果歌曲处于暂停状态则播放歌曲
      if (!playing.value) {
        store.commit('setPlayingState', true)
      }
      playLyric() // 当拖拽结束后让歌词移动到拖拽后的位置
    }

    // 一首歌播放结束后触发
    function end() {
      currentTime.value = 0
      if (playMode.value === PLAY_MODE.loop) {
        loop()
      } else {
        next()
      }
    }

    return {
      audioRef,
      barRef,
      fullScreen,
      playList,
      currentSong,
      goBack,
      playIcon,
      togglePlay,
      pause,
      prev,
      next,
      ready,
      disableCls,
      error,
      modeIcon,
      changeMode,
      getFavoriteIcon,
      toggleFavorite,
      currentTime,
      progress,
      updateTime,
      formatTime,
      onProgressChanging,
      onProgressChanged,
      end,
      cdCls,
      cdRef,
      cdImageRef,
      currentLineNum,
      currentLyric,
      lyricListRef,
      lyricScrollRef,
      pureMusicLyric,
      playingLyric,
      currentShow,
      middleLStyle,
      middleRStyle,
      onMiddleTouchStart,
      onMiddleTouchMove,
      onMiddleTouchEnd,
      cdWrapperRef,
      enter,
      afterEnter,
      leave,
      afterLeave
    }
  }
}
</script>

<style lang="scss" scoped>
  .player {
    .normal-player {
      position: fixed;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      z-index: 150;
      background: $color-background;
      .background {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        z-index: -1;
        opacity: 0.6;
        filter: blur(20px);

        img {
          width: 100%;
          height: 100%;
        }
      }
      .top {
        position: relative;
        margin-bottom: 25px;
        .back {
          position: absolute;
          top: 0;
          left: 6px;
          z-index: 50;
        }
        .icon-back {
          display: block;
          padding: 9px;
          font-size: $font-size-large-x;
          color: $color-theme;
          transform: rotate(-90deg);
        }
        .title {
          width: 70%;
          margin: 0 auto;
          line-height: 40px;
          text-align: center;
          @include no-wrap();
          font-size: $font-size-large;
          color: $color-text;
        }
        .subtitle {
          line-height: 20px;
          text-align: center;
          font-size: $font-size-medium;
          color: $color-text;
        }
      }
      .middle {
        position: fixed;
        width: 100%;
        top: 80px;
        bottom: 170px;
        white-space: nowrap;
        font-size: 0;
        .middle-l {
          display: inline-block;
          vertical-align: top;
          position: relative;
          width: 100%;
          height: 0;
          padding-top: 80%;
          .cd-wrapper {
            position: absolute;
            left: 10%;
            top: 0;
            width: 80%;
            box-sizing: border-box;
            height: 100%;
            .cd {
              width: 100%;
              height: 100%;
              border-radius: 50%;
              img {
                position: absolute;
                left: 0;
                top: 0;
                width: 100%;
                height: 100%;
                box-sizing: border-box;
                border-radius: 50%;
                border: 10px solid rgba(255, 255, 255, 0.1);
              }
              .playing {
                animation: rotate 20s linear infinite
              }
            }
          }
          .playing-lyric-wrapper {
            width: 80%;
            margin: 30px auto 0 auto;
            overflow: hidden;
            text-align: center;
            .playing-lyric {
              height: 20px;
              line-height: 20px;
              font-size: $font-size-medium;
              color: $color-text-l;
            }
          }
        }
        .middle-r {
          display: inline-block;
          vertical-align: top;
          width: 100%;
          height: 100%;
          overflow: hidden;
          .lyric-wrapper {
            width: 80%;
            margin: 0 auto;
            overflow: hidden;
            text-align: center;
            .text {
              line-height: 32px;
              color: $color-text-l;
              font-size: $font-size-medium;
              &.current {
                color: $color-text;
              }
            }
            .pure-music {
              padding-top: 50%;
              line-height: 32px;
              color: $color-text-l;
              font-size: $font-size-medium;
            }
          }
        }
      }
      .bottom {
        position: absolute;
        bottom: 50px;
        width: 100%;
        .dot-wrapper {
          text-align: center;
          font-size: 0;
          .dot {
            display: inline-block;
            vertical-align: middle;
            margin: 0 4px;
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: $color-text-l;
            &.active {
              width: 20px;
              border-radius: 5px;
              background: $color-text-ll;
            }
          }
        }
        .progress-wrapper {
          display: flex;
          align-items: center;
          width: 80%;
          margin: 0px auto;
          padding: 10px 0;
          .time {
            color: $color-text;
            font-size: $font-size-small;
            flex: 0 0 40px;
            line-height: 30px;
            width: 40px;
            &.time-l {
              text-align: left;
            }
            &.time-r {
              text-align: right;
            }
          }
          .progress-bar-wrapper {
            flex: 1;
          }
        }
        .operators {
          display: flex;
          align-items: center;
          .icon {
            flex: 1;
            color: $color-theme;
            &.disable {
              color: $color-theme-d;
            }
            i {
              font-size: 30px;
            }
          }
          .i-left {
            text-align: right;
          }
          .i-center {
            padding: 0 20px;
            text-align: center;
            i {
              font-size: 40px;
            }
          }
          .i-right {
            text-align: left
          }
          .icon-favorite {
            color: $color-sub-theme;
          }
        }
      }
      &.normal-enter-active, &.normal-leave-active {
        transition: all .6s;
        .top, .bottom {
          transition: all .6s cubic-bezier(0.45, 0, 0.55, 1);
        }
      }
      &.normal-enter-from, &.normal-leave-to {
        opacity: 0;
        .top {
          transform: translate3d(0, -100px, 0);
        }
        .bottom {
          transform: translate3d(0, 100px, 0)
        }
      }
    }
  }
</style>
