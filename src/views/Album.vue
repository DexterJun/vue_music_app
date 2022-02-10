/* 歌单详情页 */
<template>
  <div class="album">
    <MusicList
      :songs="songs"
      :title="title"
      :pic="pic"
      :loading="loading"
    ></MusicList>
  </div>
</template>

<script>
import detailComponents from '../assets/js/detailComponents'
import { ALBUM_KEY } from '../assets/js/constant'
import { getAlbum } from '../service/recommend'

export default detailComponents('Album', ALBUM_KEY, getAlbum)
</script>

<style lang="scss" scoped>
  .album {
    position: fixed;
    z-index: 10;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    background: $color-background;
  }
</style>
