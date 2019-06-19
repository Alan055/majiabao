import Vue from 'vue'
import RegMap from '@/utils/RegMap'
import util from '@/utils'

// 禁止输入emoji
// v-no-emoji
Vue.directive('no-emoji', {
  // 当被绑定的元素插入到 DOM 中时……
  inserted (el, binding, vnode) {
    let reg = RegMap.emoji
    // let reg = /\d/g  // for test

    // component
    if (vnode.componentInstance) {
      // 监听vue input事件
      let instance = vnode.componentInstance
      instance.$on('input', () => {
        // 避免循环触发
        instance.$nextTick(() => {
          let value = String(instance.value)
          if (reg.test(value)) {
            value = value.replace(reg, '')
              instance.$emit('input', value)
          }
        })
      })      
    }
    // element(输入框)
    else {
      // 监听input事件(原生)
      el.addEventListener('input', e => {
        let value = String(el.value)
        if (reg.test(value)) {
          el.value = value.replace(reg, '')
          el.dispatchEvent(new Event('input'))
        }
      })      
    }    
  }  
})

// 最长可输入字符(中文字算2个字符)
// v-max-char-len="50"
Vue.directive('max-char-len', {
  // 组件更新时
  update(el, binding, vnode, oldVnode) {
    let max = binding.value

    // warn: vconsole打印 vnode 会造成卡顿
    // console.log(vnode, oldVnode)

    // component
    if(vnode.componentInstance) {
      // 重复value判断
      let value = vnode.data.model.value
      let oldValue = oldVnode.data.model.value
      if (value === oldValue) return

      console.log('value changed', value, oldValue)

      let instance = vnode.componentInstance

      // 判断长度
      if (util.getCharLen(value) > max) {
        // value长度超限, 替换为oldvalue, 如果oldvalue也超限，长度截取一半
        if (util.getCharLen(oldValue) > max) {
          value = oldValue.slice(0, Math.floor(max / 2))
        }
        else {
          value = oldValue
        }
        instance.$nextTick(() => {
          instance.$emit('input', value)
        })
      }

    }
    // element(输入框)
    else {
      // 重复value判断
      let value = vnode.data.domProps.value
      let oldValue = oldVnode.data.domProps.value
      if(value === oldValue) return

      console.log('value changed', value, oldValue)

      // 判断长度
      if (util.getCharLen(value) > max) {
        // value长度超限, 替换为oldvalue, 如果oldvalue也超限，长度截取一半
        if (util.getCharLen(oldValue) > max) {
          el.value = oldValue.slice(0, Math.floor(max/2))
        }
        else {
          el.value = oldValue
        }
        el.dispatchEvent(new Event('input'))
      }
    }
  }
})

// 容器设置最小高度100%
// v-min-height
Vue.directive('min-height', {
  inserted(el, binding, vnode) {
    // console.log(el)
    let minHeight = el.parentElement.clientHeight
    if(minHeight) {
      el.style.minHeight = minHeight + 'px'
    }
  }
})




// 禁止ios bounce
Vue.directive('no-bounce', {
  inserted(el) {
    // 支持passive
    let supportsPassiveOption = false;
    try {
      let opts = Object.defineProperty({}, 'passive', {
        get: function () {
          supportsPassiveOption = true;
        }
      });
      window.addEventListener('test', null, opts);
    } catch (e) { }

    // start move
    let startY = 0
    el.addEventListener('touchstart', e => {
      startY = e.touches ? e.touches[0].screenY : e.screenY
      // console.log('startY', startY)
    }, supportsPassiveOption ? { passive: false } : false)

    // touch move
    el.addEventListener('touchmove', e => {
      let curY = e.touches ? e.touches[0].screenY : e.screenY
      // console.log('startY', startY, 'curY', curY, 'scrollTop', el.scrollTop)
      if (curY > startY && el.scrollTop <= 0) {
        // console.log('prevented')
        e.preventDefault()
      }
    }, supportsPassiveOption ? { passive: false } : false)
  }
})