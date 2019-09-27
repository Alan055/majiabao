<template>
  <keep-alive>
    <router-view></router-view>
  </keep-alive>
</template>

<script>
import util from '@/utils'

export function transformRoutes(routes) {
  return routes.map(item => {
    let route = util.extend({}, item)
    route.path = route.path.replace(/^\//, '')
    return route
  })
}
export default {

};
</script>
