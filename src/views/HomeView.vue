<template>
  <main>
    <Menubar :model="items">
      <template #start>
        <img alt="logo" src="/src/assets/logo.svg" height="40" class="mr-2" />
      </template>
      <template #end>
        <InputText placeholder="Pesquisar" type="text" />
      </template>
    </Menubar>
    <DataTable :value="projectList" tableStyle="min-width: 50rem">
      <Column field="name" header="Nome"></Column>
      <Column field="description" header="Descrição"></Column>
      <Column header="Status">
        <template #body="slotProps">
          <Tag
            :value="slotProps.data.published ? 'Publicado' : 'Rascunho'"
            :severity="getSeverity(slotProps.data)"
          />
        </template>
      </Column>
    </DataTable>
  </main>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import Menubar from 'primevue/menubar'
import InputText from 'primevue/inputtext'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Tag from 'primevue/tag'

const BASE_URL = `${import.meta.env.VITE_API_BASE_URL}`

const projectList = ref([])

const items = ref([
  {
    label: 'Novo projeto',
    icon: 'pi pi-fw pi-plus',
    command: () => createNewProject()
  },
  {
    label: 'Atualizar',
    icon: 'pi pi-fw pi-refresh',
    command: () => loadProjects()
  },
  {
    label: 'Sair',
    icon: 'pi pi-fw pi-power-off',
    command: () => signout()
  }
])

onMounted(() => {
  loadProjects()
})

function loadProjects() {
  fetch(`${BASE_URL}/projects/`)
    .then((resp) => resp.json())
    .then((dados) => {
      projectList.value = dados
    })
}

function createNewProject() {
  alert('novo projeto')
}

function signout() {
  alert('Saiu.')
}

const getSeverity = (project) => {
  if (project.published) {
    return 'success'
  } else {
    return 'warning'
  }
}
</script>
