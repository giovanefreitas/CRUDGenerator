<template>
  <main>
    <Menubar :model="items">
      <template #start>
        <img alt="logo" src="/src/assets/logo.svg" height="40" class="mr-2" />
      </template>
      <template #end>
        <span class="p-input-icon-left">
          <i class="pi pi-search" />
          <InputText v-model="filters['global'].value" placeholder="Pesquisar..." />
        </span>
      </template>
    </Menubar>
    <DataTable
      ref="dt"
      :value="projectList"
      v-model:selection="selectedProjects"
      dataKey="id"
      :paginator="true"
      :rows="10"
      :filters="filters"
      tableStyle="min-width: 50rem"
    >
      <template #header>
        <div class="flex flex-wrap gap-2 align-items-center justify-content-between">
          <h4 class="m-0">Projetos</h4>
        </div>
      </template>
      <Column selectionMode="multiple" style="width: 3rem" :exportable="false"></Column>
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
      <Column header="Status">
        <template #body="slotProps">
          <router-link :to="`/project/${slotProps.data.id}`">
            <Button label="Editar" icon="pi pi-edit" severity="primary" class="mr-2" />
          </router-link>
        </template>
      </Column>
    </DataTable>
    <Dialog
      v-model:visible="projectDialog"
      :style="{ width: '450px' }"
      header="Project Details"
      :modal="true"
      class="p-fluid"
    >
      <div class="field">
        <label for="name">Name</label>
        <InputText
          id="name"
          v-model.trim="project.name"
          required="true"
          autofocus
          :class="{ 'p-invalid': submitted && !project.name }"
        />
        <small class="p-error" v-if="submitted && !project.name">Name is required.</small>
      </div>
      <div class="field">
        <label for="description">Description</label>
        <Textarea
          id="description"
          v-model="project.description"
          required="true"
          rows="3"
          cols="20"
        />
      </div>

      <div class="field">
        <label for="inventoryStatus" class="mb-3">Inventory Status</label>
        <Dropdown
          id="inventoryStatus"
          v-model="project.inventoryStatus"
          :options="statuses"
          optionLabel="label"
          placeholder="Select a Status"
        >
          <template #value="slotProps">
            <div v-if="slotProps.value && slotProps.value.value">
              <Tag
                :value="slotProps.value.value"
                :severity="getStatusLabel(slotProps.value.label)"
              />
            </div>
            <div v-else-if="slotProps.value && !slotProps.value.value">
              <Tag :value="slotProps.value" :severity="getStatusLabel(slotProps.value)" />
            </div>
            <span v-else>
              {{ slotProps.placeholder }}
            </span>
          </template>
        </Dropdown>
      </div>

      <div class="field">
        <label class="mb-3">Category</label>
        <div class="formgrid grid">
          <div class="field-radiobutton col-6">
            <RadioButton
              id="category1"
              name="category"
              value="Accessories"
              v-model="project.category"
            />
            <label for="category1">Accessories</label>
          </div>
          <div class="field-radiobutton col-6">
            <RadioButton
              id="category2"
              name="category"
              value="Clothing"
              v-model="project.category"
            />
            <label for="category2">Clothing</label>
          </div>
          <div class="field-radiobutton col-6">
            <RadioButton
              id="category3"
              name="category"
              value="Electronics"
              v-model="project.category"
            />
            <label for="category3">Electronics</label>
          </div>
          <div class="field-radiobutton col-6">
            <RadioButton
              id="category4"
              name="category"
              value="Fitness"
              v-model="project.category"
            />
            <label for="category4">Fitness</label>
          </div>
        </div>
      </div>

      <div class="formgrid grid">
        <div class="field col">
          <label for="price">Price</label>
          <InputNumber
            id="price"
            v-model="project.price"
            mode="currency"
            currency="USD"
            locale="en-US"
          />
        </div>
        <div class="field col">
          <label for="quantity">Quantity</label>
          <InputNumber id="quantity" v-model="project.quantity" integeronly />
        </div>
      </div>
      <template #footer>
        <Button label="Cancel" icon="pi pi-times" text @click="hideDialog" />
        <Button label="Save" icon="pi pi-check" text @click="saveProject" />
      </template>
    </Dialog>

    <Dialog
      v-model:visible="deleteProjectDialog"
      :style="{ width: '450px' }"
      header="Confirm"
      :modal="true"
    >
      <div class="confirmation-content">
        <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
        <span v-if="project"
          >Você tem certeza que deseja excluir o projeto <b>{{ project.name }}</b
          >?</span
        >
      </div>
      <template #footer>
        <Button label="No" icon="pi pi-times" text @click="deleteProjectDialog = false" />
        <Button label="Yes" icon="pi pi-check" text @click="deleteProject" />
      </template>
    </Dialog>

    <Dialog
      v-model:visible="deleteProjectsDialog"
      :style="{ width: '450px' }"
      header="Confirm"
      :modal="true"
    >
      <div class="confirmation-content">
        <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
        <span v-if="project">Você tem certeza que deseja excluir os projetos selecionados?</span>
      </div>
      <template #footer>
        <Button label="No" icon="pi pi-times" text @click="deleteProjectsDialog = false" />
        <Button label="Yes" icon="pi pi-check" text @click="deleteSelectedProjects" />
      </template>
    </Dialog>
  </main>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useToast } from 'primevue/usetoast'
import Menubar from 'primevue/menubar'
import InputText from 'primevue/inputtext'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Tag from 'primevue/tag'
import Button from 'primevue/button'
import Toolbar from 'primevue/toolbar'
import RadioButton from 'primevue/radiobutton'
import InputNumber from 'primevue/inputnumber'
import Dropdown from 'primevue/dropdown'
import Textarea from 'primevue/textarea'
import Dialog from 'primevue/dialog'
import { FilterMatchMode } from 'primevue/api'
import _ from 'lodash'
import { useRouter } from 'vue-router'

const BASE_URL = `${import.meta.env.VITE_API_BASE_URL}`
const toast = useToast()
const dt = ref()
const projectDialog = ref(false)
const deleteProjectDialog = ref(false)
const deleteProjectsDialog = ref(false)
const projectList = ref([])
const project = ref({})
const selectedProjects = ref()
const submitted = ref(false)
const router = useRouter()

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
    label: 'Excluir',
    icon: 'pi pi-fw pi-trash',
    command: () => confirmDeleteSelected()
    //disabled="!selectedProjects || !selectedProjects.length
  },
  {
    label: 'Importar',
    icon: 'pi pi-fw pi-upload',
    command: () => exportCSV()
  },
  {
    label: 'Sair',
    icon: 'pi pi-fw pi-power-off',
    command: () => signout()
  }
])

const statuses = ref([
  { label: 'INSTOCK', value: 'instock' },
  { label: 'LOWSTOCK', value: 'lowstock' },
  { label: 'OUTOFSTOCK', value: 'outofstock' }
])

const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS }
})

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

const getSeverity = (project) => {
  if (project.published) {
    return 'success'
  } else {
    return 'warning'
  }
}

const createNewProject = () => {
  project.value = {}
  submitted.value = false
  projectDialog.value = true
}
const hideDialog = () => {
  projectDialog.value = false
  submitted.value = false
}

const saveProject = () => {
  submitted.value = true

  const sanitizedObject = sanitize(_.cloneDeep(project.value))
  const method = project.value.id ? 'PUT' : 'POST'

  fetch(new Request(`${BASE_URL}/projects/${project.value.id ? project.value.id : ''}`), {
    method: method,
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(sanitizedObject)
  })
    .then((response) => {
      console.log(response)
      if (response.status == 200 || response.status == 201) {
        loadProjects()
        toast.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'Project Updated',
          life: 3000
        })
        return response.json()
      } else {
        response.text().then((text) => console.error(text))
        throw new Error('Não foi possível gravar o projeto, por favor tente mais tarde.')
      }
    })
    .then((data) => {
      console.log(data)
      router.push(`/project/${data.id}`)
    })
    .catch((error) => {
      toast.add({
        severity: 'error',
        summary: 'Erro',
        detail: error,
        life: 30000
      })
    })

  projectDialog.value = false
  project.value = {}
}
const editProject = (prod) => {
  project.value = { ...prod }
  projectDialog.value = true
}
const confirmDeleteProject = (prod) => {
  project.value = prod
  deleteProjectDialog.value = true
}
const deleteProject = () => {
  projects.value = projects.value.filter((val) => val.id !== project.value.id)
  deleteProjectDialog.value = false
  project.value = {}
  toast.add({ severity: 'success', summary: 'Successful', detail: 'Project Deleted', life: 3000 })
}
const findIndexById = (id) => {
  let index = -1
  for (let i = 0; i < projects.value.length; i++) {
    if (projects.value[i].id === id) {
      index = i
      break
    }
  }

  return index
}

const blacklist = ['isFocused']
function sanitize(obj) {
  Object.keys(obj).forEach(function (key) {
    ;(blacklist.indexOf(key) >= 0 && delete obj[key]) ||
      (obj[key] && typeof obj[key] === 'object' && sanitize(obj[key]))
  })
  return obj
}

const exportCSV = () => {
  dt.value.exportCSV()
}
const confirmDeleteSelected = () => {
  deleteProjectsDialog.value = true
}
const deleteSelectedProjects = () => {
  projects.value = projects.value.filter((val) => !selectedProjects.value.includes(val))
  deleteProjectsDialog.value = false
  selectedProjects.value = null
  toast.add({ severity: 'success', summary: 'Successful', detail: 'Projects Deleted', life: 3000 })
}
</script>
