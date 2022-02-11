//  为一个DOM元素添加一个class
export function addClass(el, className) {
  if (!el.classList.contains(className)) {
    el.classList.add(className)
  }
}

// 移除一个DOM元素的class值
export function removeClass(el, className) {
  el.classList.remove(className)
}
