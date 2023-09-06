<template>
  <div>
    <h5>{{ field.label }}</h5>
    <DataTable :value="products" :reorderableColumns="true" @columnReorder="onColReorder">
      <Column
        v-for="col of columns"
        :field="col.field"
        :header="col.header"
        :key="col.field"
      ></Column>
    </DataTable>
    <div style="pointer-events: none">
      <Paginator :rows="10" :totalRecords="120" :rowsPerPageOptions="[10, 20, 30]"></Paginator>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Paginator from 'primevue/paginator'
import { faker } from '@faker-js/faker/locale/pt_BR'

const props = defineProps({ field: { type: Object } })

onMounted(() => {
  generateData()
  refreshColumns()
})

const columns = ref()
const products = ref()

watch(
  props,
  async (newValue, oldValue) => {
    console.log('Atualizando tabela')
    refreshColumns()
    if (newValue.field.fields.length != oldValue.field.fields.length) {
      generateData()
    }
  },
  {
    deep: true
  }
)

const onColReorder = (dragEvent) => {
  console.log(dragEvent)
  props.field.fields = moveArrayItem(props.field.fields, dragEvent.dragIndex, dragEvent.dropIndex)
  console.log(String(props.field.fields.map((item) => item.name)))
}

function generateData() {
  products.value = Array.from(
    { length: 5 },
    () => {
      const row = {}
      for (let column of props.field.fields) {
        row[column.name] = faker.vehicle.model()
      }

      return row
    }
    // faker.person.fullName(),
    // faker.date.birthdate().toLocaleDateString(),
    // faker.internet.email(),
    // faker.person.sex(),
    // faker.color.human(),
    // faker.vehicle.model()
  )
  console.log(products.value)
}

function refreshColumns() {
  columns.value = props.field.fields.map((item) => ({ field: item.name, header: item.label }))
  console.log(columns.value)
}

function moveArrayItem(arr, old_index, new_index) {
  if (new_index >= arr.length) {
    var k = new_index - arr.length + 1
    while (k--) {
      arr.push(undefined)
    }
  }
  arr.splice(new_index, 0, arr.splice(old_index, 1)[0])
  return arr // for testing
}
</script>
