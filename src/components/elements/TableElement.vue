<template>
  <div>
    <DataTable
      :value="products"
      :reorderableColumns="true"
      @columnReorder="onColReorder"
      @rowReorder="onRowReorder"
      tableStyle="min-width: 50rem"
    >
      <Column rowReorder headerStyle="width: 3rem" :reorderableColumn="false" />
      <Column
        v-for="col of columns"
        :field="col.field"
        :header="col.header"
        :key="col.field"
      ></Column>
    </DataTable>
    <Toast />
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useToast } from 'primevue/usetoast'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Toast from 'primevue/toast'
import { faker } from '@faker-js/faker/locale/pt_BR'

const props = defineProps({ field: { type: Object } })

onMounted(() => {
  generateData()
  refreshColumns()
})

const toast = useToast()
const columns = ref()
const products = ref()

watch(props, async (newValue, oldValue) => {
  console.log('Atualizando tabela')
  generateData()
  refreshColumns()
})

const onColReorder = () => {
  toast.add({ severity: 'success', summary: 'Column Reordered', life: 3000 })
}
const onRowReorder = (event) => {
  products.value = event.value
  toast.add({ severity: 'success', summary: 'Rows Reordered', life: 3000 })
}

function generateData() {
  products.value = Array.from({ length: 5 }, () => [
    faker.person.fullName(),
    faker.date.birthdate().toLocaleDateString(),
    faker.internet.email(),
    faker.person.sex(),
    faker.color.human(),
    faker.vehicle.model()
  ])
}

function refreshColumns() {
  columns.value = props.field.subfields.map((item) => ({ field: item.name, header: item.label }))
}
</script>
