<template>
  <main>
    <Menubar :model="items">
      <template #start>
        <img alt="logo" src="/src/assets/logo.svg" height="40" class="mr-2" />
      </template>
      <template #end>
        <Button @click="router.go(-1)">Fechar</Button>
      </template>
    </Menubar>
    <ScreenBuilder :base-form="screen" />
  </main>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router'
import ScreenBuilder from '../components/ScreenBuilder.vue'
import { onMounted, ref } from 'vue'
import Menubar from 'primevue/menubar'
import Button from 'primevue/button'
import _ from 'lodash'

const BASE_URL = `${import.meta.env.VITE_API_BASE_URL}`

const items = ref([
  {
    label: 'Salvar',
    icon: 'pi pi-fw pi-plus',
    command: () => saveScreen()
  }
])

const route = useRoute()
const router = useRouter();
const screen = ref({})

onMounted(() => {
  fetch(`${BASE_URL}/screens/${route.params.id}`)
    .then((resp) => resp.json())
    .then((dados) => {
      screen.value = dados
    })
})

const blacklist = ['isFocused']
function sanitize(obj) {
  Object.keys(obj).forEach(function (key) {
    ;(blacklist.indexOf(key) >= 0 && delete obj[key]) ||
      (obj[key] && typeof obj[key] === 'object' && sanitize(obj[key]))
  })
  return obj
}

function saveScreen() {
  let sanitizedObject = sanitize(_.cloneDeep(screen.value))
  let method = screen.value.id ? 'PUT' : 'POST'

  fetch(new Request(`${BASE_URL}/screens/${screen.value.id}`), {
    method: method,
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(sanitizedObject)
  })
}
</script>
