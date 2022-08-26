<template>
  <div :class="$style.tablePage">
    <div :class="$style.tableContainer">
      <MyTable :tableHeader="tableHeader" :tableContent="tableData"/>
    </div>
  </div>
</template>

<script setup lang="ts">
import MyTable from "@/components/MyTable/MyTable.vue";
import { Balance, BalanceTableData } from "@/types";
import { onMounted, Ref, ref } from "vue";

let tableData: Ref<BalanceTableData[]> = ref([]);

const tableHeader = {
  regionName: 'Области',
  periodName: 'Период',
  production: 'Производство',
  export: 'Экспорт',
  import: 'Импорт',
  consumption: 'Потребление',
  leftovers: 'Остатки',
  pipe: { 
    commonName: 'Труба',
    colNames: { 
      pipeIn: 'Поступление', 
      pipeOut: 'Отправка',
    }, 
  },
  rail: { 
    commonName: 'ЖД',
    colNames: { 
      railIn: 'Поступление', 
      railOut: 'Отправка',
    }, 
  },
  water: { 
    commonName: 'Река',
    colNames: { 
      waterIn: 'Поступление', 
      waterOut: 'Отправка',
    }, 
  },
  anotherTransport: { 
    commonName: 'Прочее',
    colNames: { 
      anotherTransportIn: 'Поступление', 
      anotherTransportOut: 'Отправка',
    }, 
  },
}

onMounted(async () => {
  const res = await fetch("http://localhost:8082/balances.json");
  const data: Balance[] = await res.json();


  tableData.value = data.filter(item => item.regions?.length === 1).map((item) => {
    const data = { ...item };
    delete data.regions;

    return data as BalanceTableData;
  });
});
</script>

<style module lang="stylus">
.tablePage
    position absolute
    top 0
    left 0
    right 0
    bottom 0
    color white
    background rgb(57,52,62)
    background linear-gradient(121deg, rgba(57,52,62,1) 0%, rgba(96,46,115,1) 27%, rgba(24,48,108,1) 63%, rgba(35,5,52,1) 100%)
.tableContainer
    width 1000px
    height 700px
    margin auto
    margin-top 200px
    background-color #898181
    border-radius 20px
    // padding 10px
</style>
