<template lang="pug">
transition(name='spinner')
  .spinner
    svg.circular
      circle.path(cx='50', cy='50', r='20', fill='none', stroke-width='5', stroke-miterlimit='10')

</template>

<script>
export default {
  methods: {
    dashProgress () {
      return `0, 200`
    }
  }
}
</script>

<style lang="sass", scoped>
.circular
  animation: rotate 2s linear infinite
  height: 100px
  position: relative
  width: 100px

.path 
  stroke-dasharray: 1,200
  stroke-dashoffset: 0
  stroke: #d62d20
  animation: dash 1.5s ease-in-out infinite
  
  stroke-linecap: round


@keyframes rotate
 100%
  transform: rotate(360deg)
 

@keyframes dash
 0%
  stroke-dasharray: 1,200
  stroke-dashoffset: 0
 
 50%
  stroke-dasharray: 89,200
  stroke-dashoffset: -35
 
 100%
  stroke-dasharray: 89,200
  stroke-dashoffset: -124
 
  
</style>
