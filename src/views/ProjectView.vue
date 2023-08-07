<template>
  <main>
    <AppHeader>
      <button @click="saveForm">Salvar</button>
      <select v-model="selectedScreen">
        <option v-for="(screen, index) of baseForm.screens" :value="screen" :key="index">
          {{ screen.label }}
        </option>
      </select>
    </AppHeader>
    <ScreenBuilder :base-form="selectedScreen" />
  </main>
</template>

<script setup>
import AppHeader from '../components/AppHeader.vue'
import { useRoute } from 'vue-router'
import ScreenBuilder from '../components/ScreenBuilder.vue'
import { onMounted, ref } from 'vue'
import _ from 'lodash'

const BASE_URL = `${import.meta.env.VITE_API_BASE_URL}`
const route = useRoute()
const selectedScreen = ref({});
const baseForm = ref({
  name: 'Novo Projeto',
  entities: [],
  screens: [
    {
      name: 'grid',
      label: 'Grid',
      type: 'grid',
      subfields: []
    }
  ]
})

onMounted(() => {
  fetch(`${BASE_URL}/cadastros/${route.params.id}`)
    .then((resp) => resp.json())
    .then((dados) => {
      baseForm.value = dados
    })
})

function saveForm() {
  var objSanitizado = sanitizar(_.cloneDeep(baseForm.value))

  fetch(new Request(`${BASE_URL}/cadastros/64ac2f9f5cb711f1fd3c1e4d`), {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(objSanitizado)
  })
}
</script>
