/* 排行榜二级页面 */
<template>
  <div class="top-detail">
    <MusicList
      :songs="songs"
      :title="title"
      :pic="pic"
      :loading="loading"
      rank
    ></MusicList>
  </div>
</template>

<script>
import detailComponents from '../assets/js/detailComponents'
import { getTopDetail } from '../service/topList'
import { TOP_KEY } from '../assets/js/constant'

export default detailComponents('TopDetail', TOP_KEY, getTopDetail)
</script>

<style lang="scss" scoped>
  .top-detail {
    position: fixed;
    z-index: 10;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    background: $color-background;
  }
</style>
