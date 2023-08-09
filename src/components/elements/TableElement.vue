<template>
  <div class="row">
    <table class="table">
      <thead>
        <tr>
          <th v-for="column of field.subfields" :key="column.id" scope="col">{{ column.label }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(data, index) of generatedData" :key="index">
          <td v-for="(column, indexCol) of field.subfields" :key="column.id">
            {{ data[indexCol] }}
          </td>
        </tr>
      </tbody>
    </table>
    <ul class="pagination">
      <li class="page-item"><a class="page-link" href="#">Previous</a></li>
      <li class="page-item"><a class="page-link" href="#">1</a></li>
      <li class="page-item"><a class="page-link" href="#">2</a></li>
      <li class="page-item"><a class="page-link" href="#">3</a></li>
      <li class="page-item"><a class="page-link" href="#">Next</a></li>
    </ul>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { faker } from '@faker-js/faker/locale/pt_BR'

defineProps({ field: { type: Object } })

const generatedData = computed(() => {
  return Array.from({ length: 5 }, () => [
    faker.person.fullName(),
    faker.date.birthdate().toLocaleDateString(),
    faker.internet.email(),
    faker.person.sex(),
    faker.color.human(),
    faker.vehicle.model()
  ])
})
</script>
