import { createApp } from 'vue'
import Loading from './Loading.vue'
import { addClass, removeClass } from '../../../assets/js/dom'

const relativeCls = 'g-relative'

const loadingDirective = {
  mounted(el, binding) {
    const app = createApp(Loading) // 创建Loading组件的实例对象
    const instance = app.mount(document.createElement('div')) //  生成Loading组件所对应的DOM对象
    el.instance = instance
    const title = binding.arg
    if (typeof title !== 'undefined') {
      instance.setTitle(title)
    }
    if (binding.value) {
      append(el)
    }
  },
  updated(el, binding) {
    const title = binding.arg
    if (typeof title !== 'undefined') {
      el.instance.setTitle(title)
    }
    if (binding.value !== binding.oldValue) {
      binding.value ? append(el) : remove(el)
    }
  }
}

function append(el) {
  /* 这里想要使所开发的Loading组件具有通用性
  由于在Loading组件中使用绝对定位使其在页面中居中显示，而实际使用v-loading的组件并不一定就开启了定位，
  如果没有开启定位，则Loading组件并不能实现应有的效果。因此在这里对使用了v-loading元素的样式进行判断，
  如果该元素没有开启定位，则为其添加一个相对定位，如果开启了则不作操作。 */
  const style = getComputedStyle(el)
  if (['absolute', 'fixed', 'relative'].indexOf(style.position) === -1) {
    addClass(el, relativeCls)
  }
  el.appendChild(el.instance.$el)
}
function remove(el) {
  // 在Loading组件卸载后移除所添加的相对定位样式
  removeClass(el, relativeCls)
  el.removeChild(el.instance.$el)
}

export default loadingDirective
