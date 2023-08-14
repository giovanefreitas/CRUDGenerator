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
const EMPTY_PROJECT = {
  name: 'Novo Projeto',
  entities: [],
  screens: [
    {
      name: 'grid',
      label: 'Nova tela',
      type: 'grid',
      subfields: []
    }
  ]
}

const route = useRoute()
const selectedScreen = ref({})
const baseForm = ref(_.cloneDeep(EMPTY_PROJECT))

onMounted(() => {
  if (route.params.id != 'new') {
    fetch(`${BASE_URL}/cadastros/${route.params.id}`)
      .then((resp) => resp.json())
      .then((dados) => {
        baseForm.value = dados
        selectedScreen.value = baseForm.value.screens[0]
      })
  } else {
    baseForm.value = EMPTY_PROJECT
    selectedScreen.value = baseForm.value.screens[0]
  }
})

const blacklist = ['_id', 'isFocused']
function sanitize(obj) {
  Object.keys(obj).forEach(function (key) {
    ;(blacklist.indexOf(key) >= 0 && delete obj[key]) ||
      (obj[key] && typeof obj[key] === 'object' && sanitize(obj[key]))
  })
  return obj
}

function saveForm() {
  var sanitizedObject = sanitize(_.cloneDeep(baseForm.value))

  fetch(new Request(`${BASE_URL}/cadastros/${baseForm.value._id}`), {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(sanitizedObject)
  })
}
</script>
