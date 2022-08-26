<template>
    <div ref='scrollbar' :class="$style.scrollY"><div @mousedown="clickScroll" :style="{ height: scrollThumbHeight + 'px', top: positionScrollThumb + 'px' }"></div></div>
</template>

<script setup lang="ts">
import { computed, ref, Ref, watch } from 'vue';

const props = defineProps<{
    element: HTMLElement | undefined
    positionY: number
}>()

const emit = defineEmits<{
    (e: 'changePosition', position: number): void
}>()

const scrollbar: Ref<HTMLElement | undefined> = ref()

const heightContentEl: Ref<number> = ref(1)
const heightViewEl: Ref<number> = ref(1)
const scrollBarHeight: Ref<number> = ref(1)

const scrollThumbHeight = computed(() => (heightViewEl.value / heightContentEl.value) * scrollBarHeight.value)
const positionScrollThumb = computed(() => (props.positionY / (heightContentEl.value - heightViewEl.value)) * (scrollBarHeight.value - scrollThumbHeight.value))

const clickScroll = (event: MouseEvent) => {
    event.preventDefault()
    event.stopPropagation()

    const oldPosition = positionScrollThumb.value
    const distance = scrollBarHeight.value - scrollThumbHeight.value

    if (distance === 0) return 0

    const clickY = event.y

    let isActivated = false
    document.onmousemove = (event) => {
        if (!isActivated) {
            isActivated = true
            setTimeout(() => {
                const moveY = event.y
                let newPosition = oldPosition + moveY - clickY

                if (newPosition > distance) newPosition = distance
                else if (newPosition < 0) newPosition = 0

                emit('changePosition', (newPosition / distance) * (heightContentEl.value - heightViewEl.value))
                isActivated = false
            }, 10)
        }
    }

    document.onmouseup = () => {
        document.onmousemove = null
        document.onmouseup = null
    } 
}

watch(() => props.element, () => {
    if (props.element && props.element.firstChild) {
        new ResizeObserver(() => {
            if (props.element) {
                heightContentEl.value = props.element.scrollHeight
                heightViewEl.value = props.element.clientHeight
            }
        }).observe(props.element.firstChild as HTMLElement)
    }
})


watch(scrollbar, () => {
    if (scrollbar.value) {
        new ResizeObserver(() => {
            if (scrollbar.value)
                scrollBarHeight.value = scrollbar.value.clientHeight
        }).observe(scrollbar.value as HTMLElement)
    }
})
</script>

<style module lang="stylus">
.scrollY
  position absolute
  height 100%
  width 5px
  right -30px
  top 0px
  border-radius 5px
  background-color grey
  overflow hidden
  & div
    position absolute
    width 100%
    border-radius inherit
    background-color white
</style>