import storage from 'good-storage'
import MusicList from '../../components/musicList/MusicList.vue'
import { processSongs } from '../../service/song'

export default function detailComponents(name, key, fetch) {
  return {
    name,
    components: { MusicList },
    props: {
      data: Object
    },
    data() {
      return {
        songs: [],
        loading: true
      }
    },
    computed: {
      computedData() {
        let ret = null
        const data = this.data
        if (data) {
          // 如果父组件传入了歌手信息则使用
          ret = data
        } else {
          const cachedData = storage.session.get(key)
          // 如果没有传入歌手信息（在当前页面刷新的情况），则从session中取出缓存的歌手信息，并与路由参数做对比
          // 歌手对象标识是mid，专辑对象标识是id
          if (cachedData && (cachedData.mid || cachedData.id + '') === this.$route.params.id) {
            ret = cachedData
          }
        }
        return ret
      },
      pic() {
        const data = this.computedData
        return data && data.pic
      },
      title() {
        const data = this.computedData
        return data && (data.name || data.title) // 歌手名字段是name，专辑名字段是title
      }
    },
    async created() {
      const data = this.computedData
      if (!data) { // 如果没有获取歌手信息则跳转到上一级路由中
        const path = this.$route.matched[0].path
        this.$router.push({ path })
        return
      }
      const result = await fetch(data) // 获取歌手的歌曲列表（所有歌曲都没有播放链接url）
      this.songs = await processSongs(result.songs) // 获取每首歌的播放链接得到完整的歌曲列表
      this.loading = false
    }
  }
}
