<template>
  <div class="singer-detail">
    <MusicList :songs="songs" :pic="pic" :title="title" :loading="loading"></MusicList>
  </div>
</template>

<script>
import storage from 'good-storage'
import { getSingerDetail } from '../service/singer'
import { processSongs } from '../service/song'
import MusicList from '../components/musicList/MusicList.vue'
import { SINGER_KEY } from '../assets/js/constant'

export default {
  name: 'SingerDetail',
  components: { MusicList },
  props: {
    singer: Object
  },
  data() {
    return {
      songs: [],
      loading: true
    }
  },
  computed: {
    computedSinger() {
      let ret = null
      const singer = this.singer
      if (singer) {
        // 如果父组件传入了歌手信息则使用
        ret = singer
      } else {
        const cachedSinger = storage.session.get(SINGER_KEY)
        // 如果没有传入歌手信息（在当前页面刷新的情况），则从session中取出缓存的歌手信息，并与路由参数做对比
        if (cachedSinger && cachedSinger.mid === this.$route.params.id) {
          ret = cachedSinger
        }
      }
      return ret
    },
    pic() {
      const singer = this.computedSinger
      return singer && singer.pic
    },
    title() {
      const singer = this.computedSinger
      return singer && singer.name
    }
  },
  async created() {
    console.log(this.computedSinger)
    if (!this.computedSinger) { // 如果没有获取歌手信息则跳转到上一级路由中
      const path = this.$route.matched[0].path
      this.$router.push({ path })
      return
    }
    const result = await getSingerDetail(this.computedSinger) // 获取歌手的歌曲列表（所有歌曲都没有播放链接url）
    this.songs = await processSongs(result.songs) // 获取每首歌的播放链接得到完整的歌曲列表
    this.loading = false
  }
}
</script>

<style lang="scss" scoped>
  .singer-detail {
    position: fixed;
    z-index: 10;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    background: $color-background;
  }
</style>
