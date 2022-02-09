// 歌曲操作页面与歌词页面切换的钩子

import { ref } from 'vue'

export default function useInteractive() {
  const currentShow = ref('cd')
  const middleLStyle = ref(null)
  const middleRStyle = ref(null)

  const touch = {}
  let currentView = 'cd'

  function onMiddleTouchStart(e) {
    touch.startX = e.touches[0].pageX
    touch.startY = e.touches[0].pageY
    touch.directionLocked = ''
  }
  function onMiddleTouchMove(e) {
    const deltaX = e.touches[0].pageX - touch.startX // 左滑负值右滑正值
    const deltaY = e.touches[0].pageY - touch.startY
    const absDeltaX = Math.abs(deltaX)
    const absDeltaY = Math.abs(deltaY)
    // 当横向滑动距离大于纵向滑动距离时表明横向滑动是有效的，锁定横向滑动
    if (!touch.directionLocked) {
      touch.directionLocked = absDeltaX >= absDeltaY ? 'h' : 'v'
    }
    if (touch.directionLocked === 'v') { // 如果当前锁定了纵向滑动，则不用执行后续的操作了
      return
    }

    const left = currentView === 'cd' ? 0 : -window.innerWidth // left表示专辑页面距离左边框的距离
    /* offsetWidth可以理解为歌词页面的偏移量，当显示的是专辑页面时，偏移量是0，
    开始左滑时所滑动的距离就是歌词组件的偏移量，当偏移量占innerWidth超过0.2时切换组件，
    当歌词组件到达页面中间时偏移量达到最大值为innerWidth，而开始右滑时偏移量开始减少，
    当偏移量占innerWidth小于0.8时切换组件 */
    const offsetWidth = Math.min(0, Math.max(-window.innerWidth, left + deltaX))
    touch.percent = Math.abs(offsetWidth / window.innerWidth)
    if (currentView === 'cd') {
      if (touch.percent > 0.2) {
        currentShow.value = 'lyric'
      } else {
        currentShow.value = 'cd'
      }
    } else {
      if (touch.percent < 0.8) {
        currentShow.value = 'cd'
      } else {
        currentShow.value = 'lyric'
      }
    }
    // 只要开始滑动都为专辑页面添加不透明度
    middleLStyle.value = {
      opacity: 1 - touch.percent,
      transitionDuration: '0ms'
    }
    middleRStyle.value = {
      transform: `translate3d(${offsetWidth}px, 0, 0)`,
      transitionDuration: '0ms'
    }
  }
  function onMiddleTouchEnd() {
    let offsetWidth
    let opacity
    if (currentShow.value === 'cd') {
      currentView = 'cd'
      offsetWidth = 0
      opacity = 1
    } else {
      currentView = 'lyric'
      offsetWidth = -window.innerWidth
      opacity = 0
    }
    const duration = 300
    middleLStyle.value = {
      opacity,
      transitionDuration: `${duration}ms`
    }
    middleRStyle.value = {
      transform: `translate3d(${offsetWidth}px, 0, 0)`,
      transitionDuration: `${duration}ms`
    }
  }
  return {
    currentShow,
    middleLStyle,
    middleRStyle,
    onMiddleTouchStart,
    onMiddleTouchMove,
    onMiddleTouchEnd
  }
}
