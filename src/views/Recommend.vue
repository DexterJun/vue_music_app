<template>
  <!-- 使用自定义指令为组件添加loading效果 -->
  <div class="recommend" v-loading:[loadingText]="loading">
    <Scroll class="recommend-content">
    <!-- 由于Scroll只渲染第一个子组件，所以这里需要再包裹一层div -->
      <div>
        <!-- 轮播图区域 -->
        <div class="slider-wrapper">
          <div class="slider-content">
            <!-- 如果没有数据则不渲染轮播图 -->
            <Slider v-if="sliders.length" :sliders="sliders"></Slider>
          </div>
        </div>
        <!-- 热门歌单推荐区域 -->
        <div class="recommend-list">
          <h1 class="list-title" v-show="!loading">热门歌单推荐</h1>
          <ul>
            <li class="item" v-for="item in albums" :key="item.id">
              <div class="icon">
                <img v-lazy="item.pic" width="60" height="60">
              </div>
              <div class="text">
                <h2 class="name">{{item.username}}</h2>
                <p class="title">{{item.title}}</p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </Scroll>
  </div>
</template>

<script>
import { getRecommend } from '../service/recommend'
import Slider from '../components/base/slider/Slider.vue'
import Scroll from '../components/wrapScroll/index'

export default {
  name: 'recommend',
  components: { Slider, Scroll },
  data() {
    return {
      sliders: [],
      albums: [],
      loadingText: '正在加载中'
    }
  },
  computed: {
    loading() {
      return !this.sliders.length && !this.albums.length
    }
  },
  async created() {
    const result = await getRecommend()
    this.sliders = result.sliders
    this.albums = result.albums
  }
}
</script>

<style lang='scss' scoped>
  .recommend {
    position: fixed;
    width: 100%;
    top: 88px;
    bottom: 0;
    .recommend-content {
      height: 100%;
      overflow: hidden;
      .slider-wrapper {
        position: relative;
        width: 100%;
        height: 0;
        padding-top: 40%;
        overflow: hidden;
        .slider-content {
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
          height: 100%;
        }
      }
      .recommend-list {
        .list-title {
          height: 65px;
          line-height: 65px;
          text-align: center;
          font-size: $font-size-medium;
          color: $color-theme;
        }
        .item {
          display: flex;
          box-sizing: border-box;
          align-items: center;
          padding: 0 20px 20px 2px;
          .icon {
            flex: 0 0 60px;
            width: 60px;
            padding-right: 20px;
          }
          .text {
            display: flex;
            flex-direction: column;
            justify-content: center;
            flex: 1;
            line-height: 20px;
            overflow: hidden;
            font-size: $font-size-medium;
          }
          .name {
            margin-bottom: 10px;
            color: $color-text;
          }
          .title {
            color: $color-text-d;
          }
        }
      }
    }
  }
</style>
