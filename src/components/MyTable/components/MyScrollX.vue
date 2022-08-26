<template>
    <div ref='scrollbar' :class="$style.scrollX"><div @mousedown="clickScroll" :style="{ width: scrollThumbWidth + 'px', left: positionScrollThumb + 'px' }"></div></div>
</template>

<script setup lang="ts">
import { computed, ref, Ref, watch } from 'vue';

const props = defineProps<{
    element: HTMLElement | undefined
    positionX: number
}>()

const emit = defineEmits<{
    (e: 'changePosition', position: number): void
}>()

const scrollbar: Ref<HTMLElement | undefined> = ref()

const widthContentEl: Ref<number> = ref(1)
const widthViewEl: Ref<number> = ref(1)
const scrollBarWidth: Ref<number> = ref(1)

const scrollThumbWidth = computed(() => (widthViewEl.value / widthContentEl.value) * scrollBarWidth.value)
const positionScrollThumb = computed(() => (props.positionX / (widthContentEl.value - widthViewEl.value)) * (scrollBarWidth.value - scrollThumbWidth.value))

const clickScroll = (event: MouseEvent) => {
    event.preventDefault()
    event.stopPropagation()

    const oldPosition = positionScrollThumb.value
    const distance = scrollBarWidth.value - scrollThumbWidth.value

    const clickX = event.x

    let isActivated = false
    document.onmousemove = (event) => {
        if (!isActivated) {
            isActivated = true
            setTimeout(() => {
                const moveX = event.x
                let newPosition = oldPosition + moveX - clickX

                if (newPosition > distance) newPosition = distance
                else if (newPosition < 0) newPosition = 0

                emit('changePosition', (newPosition / distance) * (widthContentEl.value - widthViewEl.value))
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
                widthContentEl.value = props.element.scrollWidth
                widthViewEl.value = props.element.clientWidth
            }
        }).observe(props.element.firstChild as HTMLElement)
    }
})


watch(scrollbar, () => {
    if (scrollbar.value) {
        new ResizeObserver(() => {
            if (scrollbar.value)
                scrollBarWidth.value = scrollbar.value.clientWidth
        }).observe(scrollbar.value as HTMLElement)
    }
})
</script>

<style module lang="stylus">
.scrollX
  position absolute
  width 100%
  height 5px
  bottom -30px
  border-radius 5px
  background-color gray
  overflow hidden
  & div
    position absolute
    width 20px
    height 100%
    border-radius inherit
    background-color white
</style>