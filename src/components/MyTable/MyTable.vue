<template>
  <div :class="$style.tableComponent">
    <div :class="$style.tableWrapper">
      <div @scroll="scrollTable" ref="table" :class="$style.table">
        <table>
          <thead>
            <tr>
              <th v-for="header, key of props.tableHeader" v-bind:key="key" :colspan="typeof header === 'string' ? 1 : Object.keys(header.colNames).length">
                <div v-if="typeof header === 'string'" :class="$style.header">
                  {{ header }} 
                  <div @click="() => handleClickSort(key as string, sortType.up)" v-if="sortOption.col === key && sortOption.type === sortType.down" v-html="sortDownSVG()" :class="$style.img"></div>
                  <div @click="() => handleClickSort(key as string, sortType.down)" v-else-if="sortOption.col === key && sortOption.type === sortType.up" v-html="sortUpSVG()" :class="$style.img"></div>
                  <div @click="() => handleClickSort(key as string, sortType.down)" v-else v-html="sortSVG()" :class="$style.img"></div>
                </div>
                <template v-else>
                   {{ header.commonName }}
                </template>
              </th>
            </tr>
            <tr>
              <th :class="{ [$style.firstSubHead]: subHeader[2] === 0 }" v-for="subHeader, key of subHeaders" v-bind:key="key">
                <div v-if="subHeader[1]" :class="$style.header">
                  {{ subHeader[1] }}
                  <div @click="() => handleClickSort(subHeader[0] as string, sortType.up)" v-if="sortOption.col === subHeader[0] && sortOption.type === sortType.down" v-html="sortDownSVG()" :class="$style.img"></div>
                  <div @click="() => handleClickSort(subHeader[0] as string, sortType.down)" v-else-if="sortOption.col === subHeader[0] && sortOption.type === sortType.up" v-html="sortUpSVG()" :class="$style.img"></div>
                  <div @click="() => handleClickSort(subHeader[0] as string, sortType.down)" v-else v-html="sortSVG()" :class="$style.img"></div>
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="content, key of getSortedContent(props.tableContent, sortOption)" v-bind:key="key">
              <td nowrap v-for="col of cols" v-bind:key="col" :align="isNaN(Number(content[col])) ? 'left' : 'right'">
                {{ content[col] }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
      <MyScrollY :element="table" :positionY="positionTableY" @changePosition="changePositionY"/>
      <MyScrollX :element="table" :positionX="positionTableX" @changePosition="changePositionX"/>
  </div>
</template>

<script setup lang="ts">
import { computed, Ref, ref, watch } from "vue";
import { TableHeader } from "./types";
import MyScrollX from "./components/MyScrollX.vue";
import MyScrollY from "./components/MyScrollY.vue";
import sortSVG from "./SVGs/sortSVG";
import sortUpSVG from "./SVGs/sortUpSVG";
import sortDownSVG from "./SVGs/sortDownSVG";

const props = defineProps<{
  tableHeader: TableHeader;
  tableContent: any
}>();

const cols = computed(() => Object.entries(props.tableHeader).map(item => typeof item[1] === 'string' ? item[0] : Object.keys(item[1].colNames)).flat())
const subHeaders = computed(() => Object.values(props.tableHeader)
  .map(item => 
    typeof item === 'string' 
      ? '' 
      : Object.entries(item.colNames).map((item: string[], index: number) => [...item, index]))
  .flat())

const table: Ref<HTMLElement | undefined> = ref()

enum sortType { 'up', 'down' }

const sortOption: Ref<{ col: string; type: sortType }> = ref({
  col: Object.keys(props.tableHeader)[0],
  type: sortType.down,
})

const positionTableX: Ref<number> = ref(0)
const positionTableY: Ref<number> = ref(0)

const getSortedContent = (arr: any, sortOption: { col: string; type: sortType }) => {
  const newArr = [...arr]
  const direction = sortOption.type === sortType.up ? -1 : 1

  return newArr.sort((a: any, b: any) => {
    if (typeof a[sortOption.col] === 'number' && typeof b[sortOption.col] === 'number') {
      return (b[sortOption.col] - a[sortOption.col]) * direction
    } else {
      return a[sortOption.col].localeCompare(b[sortOption.col]) * direction
    }
  })
}

const handleClickSort = (col: string, type: sortType) => {
  sortOption.value = { col, type }
}

const scrollTable = (event: UIEvent) => {
  const el = event.target as HTMLElement

  if (positionTableX.value !== el.scrollLeft) {
    positionTableX.value = el.scrollLeft
  }

  if (positionTableY.value !== el.scrollTop) {
    positionTableY.value = el.scrollTop
  }
}

const changePositionX = (positionX: number) => {
  positionTableX.value = positionX
}

const changePositionY = (positionY: number) => {
  positionTableY.value = positionY
}

watch(positionTableX, (newPositionTableX) => {
  if (table.value) table.value.scrollLeft = newPositionTableX
})

watch(positionTableY, (newPositionTableY) => {
  if (table.value) table.value.scrollTop = newPositionTableY
})
</script>

<style module lang="stylus">
.tableComponent
    position relative
    height: 100%
    width: 100%
.tableWrapper
    height: 100%
    width: 100%
    padding 30px
    box-sizing border-box
    & .table
      height: 100%
      width: 100%
      overflow auto
      border 1px solid white
      &::-webkit-scrollbar
        display none
    & table
      border-spacing 0

    & thead
      position: sticky
      top 0px
      background-color #888181
      z-index 99
      & tr:last-child th
        border-bottom 3px solid white
      & .header
        display flex
        flex-direction row
        justify-content center
        align-items: center
        .img
          margin-left 10px
          width 10px
          cursor pointer
          svg
            vertical-align bottom
        img
          margin-left 10px
          width 15px
          height 15px
          cursor pointer
    & th
      border-right 3px solid white
      padding 10px
      user-select none
    & .subHead
      border-bottom 3px solid white
      color red
    & td
      border-bottom 3px solid #c7c4c4
      border-right 3px solid #c7c4c4
      padding 10px
    & tbody tr:last-child td
      border-bottom none
    & th:first-child
      position: sticky
      left: 0px
      background-color #888181
    & td:first-child
      position sticky
      left: 0px
      background-color: #888181;
      border-right 3px solid white
      border-bottom 3px solid white
    .firstSubHead
      border-right none
</style>
