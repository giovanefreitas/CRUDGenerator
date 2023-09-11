<template>
  <main>
    <Menubar :model="items">
      <template #start>
        <img alt="logo" src="/src/assets/logo.svg" height="40" class="mr-2 me-4" />
        <span class="me-4 h3">{{
          screen.referencedEntity.label || screen.referencedEntity.name
        }}</span>
      </template>
      <template #end>
        <Button @click="router.go(-1)">Fechar</Button>
      </template>
    </Menubar>
    <ScreenBuilder :screen="screen" :entity-list="entityList" />
  </main>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router'
import ScreenBuilder from '../components/ScreenBuilder.vue'
import { onMounted, ref } from 'vue'
import Menubar from 'primevue/menubar'
import Button from 'primevue/button'
import _ from 'lodash'
import { useToast } from 'primevue/usetoast'

const toast = useToast()
const BASE_URL = `${import.meta.env.VITE_API_BASE_URL}`

const items = ref([
  {
    label: 'Salvar',
    icon: 'pi pi-fw pi-plus',
    command: () => saveForm()
  }
])

const route = useRoute()
const router = useRouter()
const screen = ref({ referencedEntity: {} })
const entityList = ref([])

onMounted(() => {
  fetch(`${BASE_URL}/screens/${route.params.id}`)
    .then((resp) => resp.json())
    .then(async (screenData) => {
      await loadEntities(screenData.project_id)
      fetch(`${BASE_URL}/entities/${screenData.referenced_entity_id}`)
        .then((res) => res.json())
        .then((entityData) => {
          screenData.referencedEntity = entityData
          screen.value = screenData
        })
    })
})

const blacklist = ['isFocused', 'subheader_update', 'order_rank']
function sanitize(obj) {
  Object.keys(obj).forEach(function (key) {
    ;(blacklist.indexOf(key) >= 0 && delete obj[key]) ||
      (obj[key] && typeof obj[key] === 'object' && sanitize(obj[key]))
  })
  return obj
}

function saveForm() {
  saveEntity()
  saveScreen()
}

async function loadEntities(project_id) {
  fetch(`${BASE_URL}/entities/?project=${project_id}`)
    .then((resp) => resp.json())
    .then((dados) => {
      entityList.value = dados
    })
    .catch((err) => {
      console.error(err)
      toast.add({
        severity: 'error',
        summary: 'Erro',
        detail: err,
        life: 30000
      })
    })
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
    .then((response) => {
      console.log(response)
      if (response.status == 200) {
        toast.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'Screen Updated',
          life: 3000
        })
        return response.json()
      } else {
        response.text().then((text) => console.error(text))
        throw new Error('Não foi possível gravar a tela, por favor tente mais tarde.')
      }
    })
    .catch((error) => {
      toast.add({
        severity: 'error',
        summary: 'Erro',
        detail: error,
        life: 30000
      })
    })
}

function saveEntity() {
  let method = entity.value.id ? 'PUT' : 'POST'

  fetch(new Request(`${BASE_URL}/entities/${entity.value.id}`), {
    method: method,
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(entity.value)
  })
    .then((response) => {
      console.log(response)
      if (response.status == 200) {
        toast.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'Entity Updated',
          life: 3000
        })
        return response.json()
      } else {
        response.text().then((text) => console.error(text))
        throw new Error('Não foi possível gravar a tela, por favor tente mais tarde.')
      }
    })
    .catch((error) => {
      toast.add({
        severity: 'error',
        summary: 'Erro',
        detail: error,
        life: 30000
      })
    })
}
</script>
