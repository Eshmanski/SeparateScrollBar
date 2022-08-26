<template>
  <div :class="$style.pageWrapper">
    <router-view />
  </div>
</template>

<style module lang="stylus">
.pageWrapper
  position relative
  width 100vw
  height 100vh
</style>

<style lang="stylus">
*
  margin 0
  padding 0
</style>
