/* 歌手页面 */
<template>
  <div class="singer" v-loading="!singers.length">
    <IndexList :data="singers" @select="selectSinger"></IndexList>
    <!-- 路由跳转时加载左右滑动的动画效果 -->
    <router-view v-slot="{ Component }">
      <transition appear name="slide">
        <component :is="Component" :singer="selectedSinger"></component>
      </transition>
    </router-view>
  </div>
</template>

<script>
import storage from 'good-storage'
import { getSingerList } from '../service/singer'
import IndexList from '../components/indexList/IndexList.vue'
import { SINGER_KEY } from '../assets/js/constant'

export default {
  name: 'singer',
  components: { IndexList },
  data() {
    return {
      singers: [],
      selectedSinger: null
    }
  },
  async created() {
    const result = await getSingerList()
    console.log(result)
    this.singers = result.singers
  },
  methods: {
    selectSinger(singer) {
      this.selectedSinger = singer
      this.cacheSinger(singer) // 在路由跳转之前通过session将所点击的歌手信息存储在浏览器中
      this.$router.push({
        path: `/singer/${singer.mid}` // 将歌手的mid作为params参数传递
      })
    },
    cacheSinger(singer) {
      storage.session.set(SINGER_KEY, singer)
    }
  }
}
</script>

<style lang='scss' scoped>
  .singer {
    position: fixed;
    width: 100%;
    top: 88px;
    bottom: 0;
  }
</style>
