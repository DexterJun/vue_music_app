import { computed, ref } from 'vue'

export default function useShortcut(props, groupRef) {
  const ANCHOR_HEIGHT = 18 // 每一个字母的高度
  const scrollRef = ref(null)
  const shortcutList = computed(() => {
    return props.data.map((group) => {
      return group.title
    })
  })

  const touch = {}

  function onShortcutTouchStart(e) {
    const anchorIndex = parseInt(e.target.dataset.index) // 拿到当前所点击的导航字母的index值

    touch.anchorIndex = anchorIndex
    touch.y1 = e.touches[0].pageY

    scrollTo(anchorIndex)
  }

  function onShortcutTouchMove(e) {
    touch.y2 = e.touches[0].pageY
    const delta = (touch.y2 - touch.y1) / ANCHOR_HEIGHT | 0 // 计算出滑动一共经过了多少个字母（区域项）
    const anchorIndex = touch.anchorIndex + delta // 得到当前应当展示的区域
    scrollTo(anchorIndex)
  }

  function scrollTo(index) {
    /* 如果在索引的上下黑边处开始拖动时会报错，因为此时所传入的index是NaN，所以需要对index的值进行判断 */
    if (isNaN(index)) {
      return
    }
    /* 如果开始滑动时在滑条区域内，滑动结束超出了滑条，则需要对index的值进行限制，
    使其在内容块数量范围之内 */
    index = Math.max(0, Math.min(shortcutList.value.length - 1, index))
    const targetEl = groupRef.value.children[index] // 得到当前应当展示的项
    const scroll = scrollRef.value.scroll // 通过Scroll组件获取到scroll实例
    scroll.scrollToElement(targetEl, 0) // scrollToElement(el, time, offsetX, offsetY, easing)滚动到指定位置
  }

  return { shortcutList, onShortcutTouchStart, onShortcutTouchMove, scrollRef }
}
