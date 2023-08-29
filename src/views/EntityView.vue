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
      :value="entity.properties"
      v-model:selection="selectedAttributes"
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
          <Button
            label="Editar"
            icon="pi pi-edit"
            severity="primary"
            class="mr-2"
            @click="editAttribute(slotProps.data)"
          />
        </template>
      </Column>
    </DataTable>

    <Dialog
      v-model:visible="attributeDialog"
      :style="{ width: '450px' }"
      header="Attribute Details"
      :modal="true"
      class="p-fluid"
    >
      <div class="field">
        <label for="name">Name</label>
        <InputText
          id="name"
          v-model.trim="attribute.name"
          required="true"
          autofocus
          autocomplete="off"
        />
        <small class="p-error" v-if="!attribute.name">Name is required.</small>
      </div>
      <div class="field">
        <label for="description">Description</label>
        <Textarea
          id="description"
          v-model="attribute.description"
          required="true"
          rows="3"
          cols="20"
        />
      </div>

      <div class="field">
        <label for="inventoryStatus" class="mb-3">Inventory Status</label>
        <Dropdown
          id="inventoryStatus"
          v-model="attribute.inventoryStatus"
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
              v-model="attribute.category"
            />
            <label for="category1">Accessories</label>
          </div>
          <div class="field-radiobutton col-6">
            <RadioButton
              id="category2"
              name="category"
              value="Clothing"
              v-model="attribute.category"
            />
            <label for="category2">Clothing</label>
          </div>
          <div class="field-radiobutton col-6">
            <RadioButton
              id="category3"
              name="category"
              value="Electronics"
              v-model="attribute.category"
            />
            <label for="category3">Electronics</label>
          </div>
          <div class="field-radiobutton col-6">
            <RadioButton
              id="category4"
              name="category"
              value="Fitness"
              v-model="attribute.category"
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
            v-model="attribute.price"
            mode="currency"
            currency="USD"
            locale="en-US"
          />
        </div>
        <div class="field col">
          <label for="quantity">Quantity</label>
          <InputNumber id="quantity" v-model="attribute.quantity" integeronly />
        </div>
      </div>
      <template #footer>
        <Button label="Cancelar" icon="pi pi-times" text @click="hideAttributeDialog" />
        <Button label="Adicionar" icon="pi pi-check" text @click="addAttribute" />
      </template>
    </Dialog>

    <Dialog
      v-model:visible="deleteAttributeDialog"
      :style="{ width: '450px' }"
      header="Confirm"
      :modal="true"
    >
      <div class="confirmation-content">
        <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
        <span v-if="attribute"
          >Você tem certeza que deseja excluir o tela <b>{{ attribute.name }}</b
          >?</span
        >
      </div>
      <template #footer>
        <Button label="No" icon="pi pi-times" text @click="deleteAttributeDialog = false" />
        <Button label="Yes" icon="pi pi-check" text @click="deleteAttribute" />
      </template>
    </Dialog>

    <Dialog
      v-model:visible="deleteAttributesDialog"
      :style="{ width: '450px' }"
      header="Confirm"
      :modal="true"
    >
      <div class="confirmation-content">
        <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
        <span v-if="attribute">Você tem certeza que deseja excluir os telas selecionados?</span>
      </div>
      <template #footer>
        <Button label="No" icon="pi pi-times" text @click="deleteAttributesDialog = false" />
        <Button label="Yes" icon="pi pi-check" text @click="deleteSelectedAttributes" />
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
const attributeDialog = ref(false)
const deleteAttributeDialog = ref(false)
const deleteAttributesDialog = ref(false)
const entity = ref([])
const attribute = ref({})
const selectedAttributes = ref()
const router = useRouter()
const route = useRoute()

const items = ref([
  {
    label: 'Novo atributo',
    icon: 'pi pi-fw pi-plus',
    command: () => createNewAttribute()
  },
  {
    label: 'Salvar',
    icon: 'pi pi-fw pi-refresh',
    command: () => saveEntity()
  },
  {
    label: 'Atualizar',
    icon: 'pi pi-fw pi-refresh',
    command: () => loadAttributes()
  },
  {
    label: 'Excluir',
    icon: 'pi pi-fw pi-trash',
    command: () => confirmDeleteSelected()
    //disabled="!selectedAttributes || !selectedAttributes.length
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
  loadEntity()
})

function loadEntity() {
  fetch(`${BASE_URL}/entities/${route.params.id}`)
    .then((resp) => resp.json())
    .then((dados) => {
      entity.value = dados
    })
}

const getSeverity = (attribute) => {
  if (attribute.published) {
    return 'success'
  } else {
    return 'warning'
  }
}

const createNewAttribute = () => {
  attribute.value = {}
  attributeDialog.value = true
}

const editAttribute = (attribute) => {
  attribute.value = { ...attribute }
  attributeDialog.value = true
}

const hideAttributeDialog = () => {
  attributeDialog.value = false
}

const addAttribute = () => {
  entity.value.properties.push(attribute.value)
  attributeDialog.value = false
  attribute.value = {}
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
        toast.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'Tabela salva com sucesso.',
          life: 3000
        })

        return response.json()
      } else {
        response.text().then((text) => console.error(text))
        throw new Error('Não foi possível gravar a tabela, por favor tente mais tarde.')
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

const confirmDeleteAttribute = (prod) => {
  attribute.value = prod
  deleteAttributeDialog.value = true
}
const deleteAttribute = () => {
  attributes.value = attributes.value.filter((val) => val.id !== attribute.value.id)
  deleteAttributeDialog.value = false
  attribute.value = {}
  toast.add({ severity: 'success', summary: 'Successful', detail: 'Attribute Deleted', life: 3000 })
}
const findIndexById = (id) => {
  let index = -1
  for (let i = 0; i < attributes.value.length; i++) {
    if (attributes.value[i].id === id) {
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
  deleteAttributesDialog.value = true
}
const deleteSelectedAttributes = () => {
  attributes.value = attributes.value.filter((val) => !selectedAttributes.value.includes(val))
  deleteAttributesDialog.value = false
  selectedAttributes.value = null
  toast.add({
    severity: 'success',
    summary: 'Successful',
    detail: 'Attributes Deleted',
    life: 3000
  })
}
const deleteSelectedEntities = () => {
  entities.value = entities.value.filter((val) => !selectedEnties.value.includes(val))
  deleteEnties.value = false
  selectedEnties.value = null
  toast.add({ severity: 'success', summary: 'Successful', detail: 'Enties Deleted', life: 3000 })
}
</script>
