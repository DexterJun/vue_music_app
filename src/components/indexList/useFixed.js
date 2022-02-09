import { ref, watch, nextTick, computed } from 'vue'

export default function useFixed(props) {
  const TITLE_HEIGHT = 30
  const groupRef = ref(null) // 滚动区域的DOM对象
  const listHeights = ref([]) //  每个子区域的高度数组
  const scrollY = ref(0)
  const currentIndex = ref(0)
  const distance = ref(0)

  const fixedTitle = computed(() => {
    /* 根据pos值的正负，当列表处于最顶端时，还继续往下滑动，会有弹性效果可以继续滑动，
    由于是向下滑动的，所以pos的值是正值，则scrollY的值就是负值，而当列表处于顶端时第一项的标题就在顶端，
    所以不需要返回标题 */
    if (scrollY.value < 0) {
      return ''
    }
    const currentGroup = props.data[currentIndex.value] //  取出当前展示的项
    return currentGroup ? currentGroup.title : '' //  将当前展示项的标题返回
  })
  //  添加标题更换时被挤上去的效果
  const fixedStyle = computed(() => {
    const distanceVal = distance.value
    //  当差值比标题的高度还要小的时候，让标题向上移动这个差值与标题高度间产值的距离
    const diff = (distanceVal > 0 && distanceVal < TITLE_HEIGHT) ? distanceVal - TITLE_HEIGHT : 0
    return { transform: `translate3d(0, ${diff}px, 0)` }
  })

  watch(() => props.data, async () => {
    await nextTick()
    calculate()
  })
  watch(scrollY, (newY) => {
    const listHeightsVal = listHeights.value
    for (let i = 0; i < listHeightsVal.length - 1; i++) {
      const heightTop = listHeightsVal[i]
      const heightBottom = listHeightsVal[i + 1]
      if (newY >= heightTop && newY <= heightBottom) {
        currentIndex.value = i
        distance.value = heightBottom - newY // 计算当前项的底部与当前所滚动的距离的差值
      }
    }
  })

  function calculate() {
    const list = groupRef.value.children
    const listHeightsVal = listHeights.value
    let height = 0

    listHeightsVal.length = 0 //  初始化高度数组
    listHeightsVal.push(height) //  第一项的高度初始化为0
    for (let i = 0; i < list.length; i++) {
      height += list[i].clientHeight
      listHeightsVal.push(height)
    }
  }

  function onScroll(pos) {
    /* 当往上滚动时pos的值是负值，当往下滚动时pos的值为正值 */
    scrollY.value = -pos.y
  }

  return { groupRef, fixedTitle, onScroll, fixedStyle, currentIndex }
}
