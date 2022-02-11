<template>
  <div class="progress-bar" @click="onClick">
    <div class="bar-inner">
      <!-- 已经播放的宽度 -->
      <div class="progress" :style="progressStyle" ref="progress"></div>
      <div
        class="progress-btn-wrapper"
        :style="btnStyle"
        @touchstart.prevent="onTouchStart"
        @touchmove.prevent="onTouchMove"
        @touchend.prevent="onTouchEnd"
      >
        <div class="progress-btn"></div>
      </div>
    </div>
  </div>
</template>

<script>
const progressBtnWidth = 16 // 进度条按钮的宽度

export default {
  name: 'ProgressBar',
  props: {
    progress: {
      type: Number,
      default: 0
    }
  },
  emits: ['progressChanging', 'progressChanged'],
  created() {
    this.touch = {} // 定义在这里的原因是不需要检测其改变，即使改变也不需模板重新渲染
  },
  data() {
    return {
      offset: 0
    }
  },
  computed: {
    progressStyle() {
      return `width: ${this.offset}px`
    },
    btnStyle() {
      return `transform: translate3d(${this.offset}px, 0, 0)`
    }
  },
  watch: {
    progress(newProgress) {
      this.setOffset(newProgress)
    }
  },
  methods: {
    onTouchStart(e) {
      this.touch.x1 = e.touches[0].pageX // 获取鼠标点击的横坐标
      this.touch.beginWidth = this.$refs.progress.clientWidth // 当前歌曲已经播放了的宽度
    },
    onTouchMove(e) {
      const delta = e.touches[0].pageX - this.touch.x1 // 计算鼠标拖拽的距离
      const tempWidth = this.touch.beginWidth + delta // 拖动后进度条所在的位置
      const barWidth = this.$el.clientWidth - progressBtnWidth // 总进度条长度
      const progress = Math.min(1, Math.max(tempWidth / barWidth, 0))
      this.offset = barWidth * progress
      this.$emit('progressChanging', progress)
    },
    onTouchEnd() {
      const barWidth = this.$el.clientWidth - progressBtnWidth
      const progress = this.$refs.progress.clientWidth / barWidth
      this.$emit('progressChanged', progress)
    },
    onClick(e) {
      const rect = this.$el.getBoundingClientRect() // 返回元素的大小及其相对于视口的位置
      const offsetWidth = e.pageX - rect.left // 鼠标的位置减去进度条的左边距得到点击后进度条所加载的位置
      const barWidth = this.$el.clientWidth - progressBtnWidth
      const progress = offsetWidth / barWidth
      this.$emit('progressChanged', progress)
    },
    setOffset(progress) {
      const barWidth = this.$el.clientWidth - progressBtnWidth // 总进度条的长度
      this.offset = barWidth * progress // 计算当前进度条的长度
    }
  }
}
</script>

<style lang="scss" scoped>
  .progress-bar {
    height: 30px;
    .bar-inner {
      position: relative;
      top: 13px;
      height: 4px;
      background: rgba(0, 0, 0, 0.3);
      .progress {
        position: absolute;
        height: 100%;
        background: $color-theme;
      }
      .progress-btn-wrapper {
        position: absolute;
        left: -8px;
        top: -13px;
        width: 30px;
        height: 30px;
        .progress-btn {
          position: relative;
          top: 7px;
          left: 7px;
          box-sizing: border-box;
          width: 16px;
          height: 16px;
          border: 3px solid $color-text;
          border-radius: 50%;
          background: $color-theme;
        }
      }
    }
  }
</style>
