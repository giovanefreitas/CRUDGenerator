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
    <DataTable
      ref="dt"
      :value="screenList"
      v-model:selection="selectedScreens"
      dataKey="id"
      :paginator="true"
      :rows="10"
      :filters="filters"
      tableStyle="min-width: 50rem"
    >
      <template #header>
        <div class="flex flex-wrap gap-2 align-items-center justify-content-between">
          <h4 class="m-0">Telas</h4>
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
          <router-link :to="`/screen/${slotProps.data.id}`">
            <Button label="Editar" icon="pi pi-edit" severity="primary" class="mr-2" />
          </router-link>
        </template>
      </Column>
    </DataTable>
    <DataTable
      ref="dt"
      :value="entityList"
      v-model:selection="selectedEntities"
      dataKey="id"
      :paginator="true"
      :rows="10"
      :filters="filters"
      tableStyle="min-width: 50rem"
    >
      <template #header>
        <div class="flex flex-wrap gap-2 align-items-center justify-content-between">
          <h4 class="m-0">Tabelas</h4>
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
          <router-link :to="`/entity/${slotProps.data.id}`">
            <Button label="Editar" icon="pi pi-edit" severity="primary" class="mr-2" />
          </router-link>
        </template>
      </Column>
    </DataTable>
    <Dialog
      v-model:visible="screenDialog"
      :style="{ width: '450px' }"
      header="Screen Details"
      :modal="true"
      class="p-fluid"
    >
      <div class="field">
        <label for="name">Name</label>
        <InputText
          id="name"
          v-model.trim="screen.name"
          required="true"
          autofocus
          autocomplete="off"
        />
        <small class="p-error" v-if="!screen.name">Name is required.</small>
      </div>
      <div class="field">
        <label for="description">Description</label>
        <Textarea
          id="description"
          v-model="screen.description"
          required="true"
          rows="3"
          cols="20"
        />
      </div>

      <div class="field">
        <label for="inventoryStatus" class="mb-3">Inventory Status</label>
        <Dropdown
          id="inventoryStatus"
          v-model="screen.inventoryStatus"
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
              v-model="screen.category"
            />
            <label for="category1">Accessories</label>
          </div>
          <div class="field-radiobutton col-6">
            <RadioButton
              id="category2"
              name="category"
              value="Clothing"
              v-model="screen.category"
            />
            <label for="category2">Clothing</label>
          </div>
          <div class="field-radiobutton col-6">
            <RadioButton
              id="category3"
              name="category"
              value="Electronics"
              v-model="screen.category"
            />
            <label for="category3">Electronics</label>
          </div>
          <div class="field-radiobutton col-6">
            <RadioButton id="category4" name="category" value="Fitness" v-model="screen.category" />
            <label for="category4">Fitness</label>
          </div>
        </div>
      </div>

      <div class="formgrid grid">
        <div class="field col">
          <label for="price">Price</label>
          <InputNumber
            id="price"
            v-model="screen.price"
            mode="currency"
            currency="USD"
            locale="en-US"
          />
        </div>
        <div class="field col">
          <label for="quantity">Quantity</label>
          <InputNumber id="quantity" v-model="screen.quantity" integeronly />
        </div>
      </div>
      <template #footer>
        <Button label="Cancelar" icon="pi pi-times" text @click="hideScreenDialog" />
        <Button label="Adicionar" icon="pi pi-check" text @click="saveScreen" />
      </template>
    </Dialog>

    <Dialog
      v-model:visible="entityDialog"
      :style="{ width: '450px' }"
      header="Nova tabela"
      :modal="true"
      class="p-fluid"
    >
      <div class="field">
        <label for="name">Name</label>
        <InputText
          id="name"
          v-model.trim="entity.name"
          required="true"
          autofocus
          autocomplete="off"
        />
        <small class="p-error" v-if="!entity.name">Name is required.</small>
      </div>
      <div class="field">
        <label for="description">Description</label>
        <Textarea
          id="description"
          v-model="entity.description"
          required="true"
          rows="3"
          cols="20"
        />
      </div>

      <div class="field">
        <label for="inventoryStatus" class="mb-3">Inventory Status</label>
        <Dropdown
          id="inventoryStatus"
          v-model="entity.inventoryStatus"
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
              v-model="entity.category"
            />
            <label for="category1">Accessories</label>
          </div>
          <div class="field-radiobutton col-6">
            <RadioButton
              id="category2"
              name="category"
              value="Clothing"
              v-model="entity.category"
            />
            <label for="category2">Clothing</label>
          </div>
          <div class="field-radiobutton col-6">
            <RadioButton
              id="category3"
              name="category"
              value="Electronics"
              v-model="entity.category"
            />
            <label for="category3">Electronics</label>
          </div>
          <div class="field-radiobutton col-6">
            <RadioButton id="category4" name="category" value="Fitness" v-model="entity.category" />
            <label for="category4">Fitness</label>
          </div>
        </div>
      </div>

      <div class="formgrid grid">
        <div class="field col">
          <label for="price">Price</label>
          <InputNumber
            id="price"
            v-model="entity.price"
            mode="currency"
            currency="USD"
            locale="en-US"
          />
        </div>
        <div class="field col">
          <label for="quantity">Quantity</label>
          <InputNumber id="quantity" v-model="entity.quantity" integeronly />
        </div>
      </div>
      <template #footer>
        <Button label="Cancelar" icon="pi pi-times" text @click="hideEntityDialog" />
        <Button label="Adicionar" icon="pi pi-check" text @click="saveEntity" />
      </template>
    </Dialog>

    <Dialog
      v-model:visible="deleteScreenDialog"
      :style="{ width: '450px' }"
      header="Confirm"
      :modal="true"
    >
      <div class="confirmation-content">
        <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
        <span v-if="screen"
          >Você tem certeza que deseja excluir o tela <b>{{ screen.name }}</b
          >?</span
        >
      </div>
      <template #footer>
        <Button label="No" icon="pi pi-times" text @click="deleteScreenDialog = false" />
        <Button label="Yes" icon="pi pi-check" text @click="deleteScreen" />
      </template>
    </Dialog>

    <Dialog
      v-model:visible="deleteScreensDialog"
      :style="{ width: '450px' }"
      header="Confirm"
      :modal="true"
    >
      <div class="confirmation-content">
        <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
        <span v-if="screen">Você tem certeza que deseja excluir os telas selecionados?</span>
      </div>
      <template #footer>
        <Button label="No" icon="pi pi-times" text @click="deleteScreensDialog = false" />
        <Button label="Yes" icon="pi pi-check" text @click="deleteSelectedScreens" />
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
import { useRoute, useRouter } from 'vue-router'

const BASE_URL = `${import.meta.env.VITE_API_BASE_URL}`
const toast = useToast()
const dt = ref()
const screenDialog = ref(false)
const entityDialog = ref(false)
const deleteScreenDialog = ref(false)
const deleteScreensDialog = ref(false)
const screenList = ref([])
const entityList = ref([])
const screen = ref({})
const entity = ref({})
const selectedScreens = ref()
const selectedEntities = ref()
const router = useRouter()
const route = useRoute()

const items = ref([
  {
    label: 'Nova tela',
    icon: 'pi pi-fw pi-plus',
    command: () => createNewScreen()
  },
  {
    label: 'Nova tabela',
    icon: 'pi pi-fw pi-plus',
    command: () => createNewEntity()
  },
  {
    label: 'Atualizar',
    icon: 'pi pi-fw pi-refresh',
    command: () => loadScreens()
  },
  {
    label: 'Excluir',
    icon: 'pi pi-fw pi-trash',
    command: () => confirmDeleteSelected()
    //disabled="!selectedScreens || !selectedScreens.length
  },
  {
    label: 'Exportar',
    icon: 'pi pi-fw pi-download',
    command: () => exportCSV()
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
  loadScreens()
  loadEntities()
})

function loadScreens() {
  fetch(`${BASE_URL}/screens/?project=${route.params.id}`)
    .then((resp) => resp.json())
    .then((dados) => {
      screenList.value = dados
    })
}

function loadEntities() {
  fetch(`${BASE_URL}/entities/?project=${route.params.id}`)
    .then((resp) => resp.json())
    .then((dados) => {
      entityList.value = dados
    })
}

const getSeverity = (screen) => {
  if (screen.published) {
    return 'success'
  } else {
    return 'warning'
  }
}

const createNewScreen = () => {
  screen.value = { project_id: route.params.id }
  screenDialog.value = true
}
const createNewEntity = () => {
  entity.value = { project_id: route.params.id }
  entityDialog.value = true
}
const hideScreenDialog = () => {
  screenDialog.value = false
}
const hideEntityDialog = () => {
  entityDialog.value = false
}

const saveScreen = () => {
  const method = screen.value.id ? 'PUT' : 'POST'

  fetch(new Request(`${BASE_URL}/screens/${screen.value.id ? screen.value.id : ''}`), {
    method: method,
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(screen.value)
  })
    .then((response) => {
      console.log(response)
      if (response.status == 200 || response.status == 201) {
        loadScreens()
        toast.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'Screen Updated',
          life: 3000
        })
        screenDialog.value = false
        screen.value = {}
        return response.json()
      } else {
        response.text().then((text) => console.error(text))
        throw new Error('Não foi possível gravar a tela, por favor tente mais tarde.')
      }
    })
    .then((data) => {
      console.log(data)
      router.push(`/screen/${data.id}`)
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

const saveEntity = () => {
  const method = entity.value.id ? 'PUT' : 'POST'

  fetch(new Request(`${BASE_URL}/entities/${entity.value.id ? entity.value.id : ''}`), {
    method: method,
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(entity.value)
  })
    .then((response) => {
      console.log(response)
      if (response.status == 200 || response.status == 201) {
        loadEntities()
        toast.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'Tabela atualizada',
          life: 3000
        })
        entityDialog.value = false
        entity.value = {}
        return response.json()
      } else {
        response.text().then((text) => console.error(text))
        throw new Error('Não foi possível gravar a tabela, por favor tente mais tarde.')
      }
    })
    .then((data) => {
      console.log(data)
      router.push(`/entity/${data.id}`)
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
const editScreen = (prod) => {
  screen.value = { ...prod }
  screenDialog.value = true
}
const confirmDeleteScreen = (prod) => {
  screen.value = prod
  deleteScreenDialog.value = true
}
const deleteScreen = () => {
  screens.value = screens.value.filter((val) => val.id !== screen.value.id)
  deleteScreenDialog.value = false
  screen.value = {}
  toast.add({ severity: 'success', summary: 'Successful', detail: 'Screen Deleted', life: 3000 })
}
const findIndexById = (id) => {
  let index = -1
  for (let i = 0; i < screens.value.length; i++) {
    if (screens.value[i].id === id) {
      index = i
      break
    }
  }

  return index
}

const exportCSV = () => {
  dt.value.exportCSV()
}
const confirmDeleteSelected = () => {
  deleteScreensDialog.value = true
}
const deleteSelectedScreens = () => {
  screens.value = screens.value.filter((val) => !selectedScreens.value.includes(val))
  deleteScreensDialog.value = false
  selectedScreens.value = null
  toast.add({ severity: 'success', summary: 'Successful', detail: 'Screens Deleted', life: 3000 })
}
const deleteSelectedEntities = () => {
  entities.value = entities.value.filter((val) => !selectedEnties.value.includes(val))
  deleteEnties.value = false
  selectedEnties.value = null
  toast.add({ severity: 'success', summary: 'Successful', detail: 'Enties Deleted', life: 3000 })
}
</script>
