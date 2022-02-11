<template>
  <div class="music-list">
    <!-- 返回图标 -->
    <div class="back" @click="goBack">
      <i class="icon-back"></i>
    </div>
    <!-- 歌手姓名 -->
    <h1 class="title">{{title}}</h1>
    <!-- 歌手背景图 -->
    <div class="bg-image" :style="bgImageStyle" ref="bgImage">
      <!-- 随机播放按钮 -->
      <div class="play-btn-wrapper" :style="playBtnStyle">
        <div class="play-btn" v-show="songs.length > 0" @click="random">
          <i class="icon-play"></i>
          <span class="text">随机播放全部歌曲</span>
        </div>
      </div>
      <!-- 背景模糊效果 -->
      <div class="filter" :style="filterStyle"></div>
    </div>
    <!-- 歌曲列表 -->
    <scroll
      class="list"
      :style="scrollStyle"
      v-loading="loading"
      v-no-result:[noResultText]="noResult"
      :probeType="3"
      @scroll="onScroll"
    >
      <div class="song-list-wrapper">
        <SongList :songs="songs" @select="selectItem" :rank="rank"></SongList>
      </div>
    </scroll>
  </div>
</template>

<script>
import Scroll from '../wrapScroll/index'
import SongList from '../base/songList/SongList.vue'
import { mapActions, mapState } from 'vuex'

const RESERVED_HEIGHT = 40 // 定义常量表示标题的高度

export default {
  name: 'MusicList',
  components: { Scroll, SongList },
  props: {
    songs: {
      type: Array,
      default() {
        return []
      }
    },
    title: String,
    pic: String,
    loading: Boolean, // 由于当前组件的数据并不是请求获取的，所以loading的值需要从父组件获取
    noResultText: {
      type: String,
      default: '抱歉，没有找到可播放的歌曲'
    },
    rank: Boolean
  },
  data() {
    return {
      imageHeight: 0,
      scrollY: 0, // 当前滚动的距离
      maxTranslateY: 0 // 最大滚动距离
    }
  },
  computed: {
    noResult() {
      return !this.loading && !this.songs.length
    },
    playBtnStyle() {
      let display = ''
      // 当滚动高度大于最大滚动高度时不显示随机播放按钮
      if (this.scrollY >= this.maxTranslateY) {
        display = 'none'
      }
      return { display }
    },
    bgImageStyle() {
      const scrollY = this.scrollY
      let zIndex = 0 // 当在范围内滚动时歌曲列表的层级高于背景
      let paddingTop = '70%'
      let height = 0
      let translateZ = 0 // 兼容iphone
      if (scrollY > this.maxTranslateY) {
        zIndex = 10 // 当超过滚动范围，则背景层级高于列表层级
        paddingTop = 0
        height = `${RESERVED_HEIGHT}px` // 当超过范围时修改背景的高度为标题高度
        translateZ = 1 // // 兼容iphone
      }
      let scale = 1
      if (scrollY < 0) {
        // 当往下滑动时是背景图片有放大的效果
        scale = 1 + Math.abs(scrollY / this.imageHeight)
      }
      return {
        paddingTop,
        height,
        zIndex,
        backgroundImage: `url(${this.pic})`,
        transform: `scale(${scale})translateZ(${translateZ}px)` // 兼容iphone
      }
    },
    scrollStyle() {
      const bottom = this.playList.length ? '60px' : '0' // 使歌曲列表底部留出迷你播放器宽度的边距
      // 通过获取相应歌手照片的高度，来动态设置歌曲列表内容区的top值
      return { top: `${this.imageHeight}px`, bottom }
    },
    filterStyle() {
      let blur = 0
      const scrollY = this.scrollY
      const imageHeight = this.imageHeight
      if (scrollY >= 0) {
        blur = Math.min(this.maxTranslateY / imageHeight, scrollY / imageHeight) * 20
      }
      return { backdropFilter: `blur(${blur}px)` }
    },
    ...mapState(['playList'])
  },
  mounted() {
    this.imageHeight = this.$refs.bgImage.clientHeight
    this.maxTranslateY = this.imageHeight - RESERVED_HEIGHT // 背景区域的高度减去标题的高度就是能够滚动的最大高度
  },
  methods: {
    goBack() {
      this.$router.back()
    },
    onScroll(pos) {
      this.scrollY = -pos.y
    },
    selectItem({ song, index }) {
      this.selectPlay({
        list: this.songs,
        index
      })
    },
    random() {
      this.randomPlay(this.songs)
    },
    ...mapActions(['selectPlay', 'randomPlay'])
  }
}
</script>

<style lang="scss" scoped>
  .music-list {
    position: relative;
    height: 100%;
    .back {
      position: absolute;
      top: 0;
      left: 6px;
      z-index: 20;
      transform: translateZ(2px);
      .icon-back {
        display: block;
        padding: 10px;
        font-size: $font-size-large-x;
        color: $color-theme;
      }
    }
    .title {
      position: absolute;
      top: 0;
      left: 10%;
      width: 80%;
      z-index: 20;
      transform: translateZ(2px);
      @include no-wrap();
      text-align: center;
      line-height: 40px;
      font-size: $font-size-large;
      color: $color-text;
    }
    .bg-image {
      position: relative;
      width: 100%;
      transform-origin: top;
      background-size: cover;
      .play-btn-wrapper {
        position: absolute;
        bottom: 20px;
        z-index: 10;
        width: 100%;
        .play-btn {
          box-sizing: border-box;
          width: 135px;
          padding: 7px 0;
          margin: 0 auto;
          text-align: center;
          border: 1px solid $color-theme;
          color: $color-theme;
          border-radius: 100px;
          font-size: 0;
        }
        .icon-play {
          display: inline-block;
          vertical-align: middle;
          margin-right: 6px;
          font-size: $font-size-medium-x;
        }
        .text {
          display: inline-block;
          vertical-align: middle;
          font-size: $font-size-small;
        }
      }
      .filter {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(7, 17, 27, 0.4);
      }
    }
    .list {
      position: absolute;
      bottom: 0;
      width: 100%;
      z-index: 0;
      .song-list-wrapper {
        padding: 20px 30px;
        background: $color-background;
      }
    }
  }
</style>
