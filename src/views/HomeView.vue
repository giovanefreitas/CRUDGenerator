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
    <Toolbar class="mb-4">
      <template #start>
        <Button label="New" icon="pi pi-plus" severity="success" class="mr-2" @click="openNew" />
        <Button
          label="Delete"
          icon="pi pi-trash"
          severity="danger"
          @click="confirmDeleteSelected"
          :disabled="!selectedProducts || !selectedProducts.length"
        />
      </template>
      <template #end>
        <Button label="Importar" icon="pi pi-upload" severity="help" @click="exportCSV($event)" />
        <Button label="Exportar" icon="pi pi-download" severity="help" @click="exportCSV($event)" />
      </template>
    </Toolbar>
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
    <Dialog
      v-model:visible="productDialog"
      :style="{ width: '450px' }"
      header="Product Details"
      :modal="true"
      class="p-fluid"
    >
      <div class="field">
        <label for="name">Name</label>
        <InputText
          id="name"
          v-model.trim="product.name"
          required="true"
          autofocus
          :class="{ 'p-invalid': submitted && !product.name }"
        />
        <small class="p-error" v-if="submitted && !product.name">Name is required.</small>
      </div>
      <div class="field">
        <label for="description">Description</label>
        <Textarea
          id="description"
          v-model="product.description"
          required="true"
          rows="3"
          cols="20"
        />
      </div>

      <div class="field">
        <label for="inventoryStatus" class="mb-3">Inventory Status</label>
        <Dropdown
          id="inventoryStatus"
          v-model="product.inventoryStatus"
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
              v-model="product.category"
            />
            <label for="category1">Accessories</label>
          </div>
          <div class="field-radiobutton col-6">
            <RadioButton
              id="category2"
              name="category"
              value="Clothing"
              v-model="product.category"
            />
            <label for="category2">Clothing</label>
          </div>
          <div class="field-radiobutton col-6">
            <RadioButton
              id="category3"
              name="category"
              value="Electronics"
              v-model="product.category"
            />
            <label for="category3">Electronics</label>
          </div>
          <div class="field-radiobutton col-6">
            <RadioButton
              id="category4"
              name="category"
              value="Fitness"
              v-model="product.category"
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
            v-model="product.price"
            mode="currency"
            currency="USD"
            locale="en-US"
          />
        </div>
        <div class="field col">
          <label for="quantity">Quantity</label>
          <InputNumber id="quantity" v-model="product.quantity" integeronly />
        </div>
      </div>
      <template #footer>
        <Button label="Cancel" icon="pi pi-times" text @click="hideDialog" />
        <Button label="Save" icon="pi pi-check" text @click="saveProduct" />
      </template>
    </Dialog>

    <Dialog
      v-model:visible="deleteProductDialog"
      :style="{ width: '450px' }"
      header="Confirm"
      :modal="true"
    >
      <div class="confirmation-content">
        <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
        <span v-if="product"
          >Are you sure you want to delete <b>{{ product.name }}</b
          >?</span
        >
      </div>
      <template #footer>
        <Button label="No" icon="pi pi-times" text @click="deleteProductDialog = false" />
        <Button label="Yes" icon="pi pi-check" text @click="deleteProduct" />
      </template>
    </Dialog>

    <Dialog
      v-model:visible="deleteProductsDialog"
      :style="{ width: '450px' }"
      header="Confirm"
      :modal="true"
    >
      <div class="confirmation-content">
        <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
        <span v-if="product">Are you sure you want to delete the selected products?</span>
      </div>
      <template #footer>
        <Button label="No" icon="pi pi-times" text @click="deleteProductsDialog = false" />
        <Button label="Yes" icon="pi pi-check" text @click="deleteSelectedProducts" />
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
import _ from 'lodash'

const BASE_URL = `${import.meta.env.VITE_API_BASE_URL}`
const toast = useToast()
const productDialog = ref(false)
const deleteProductDialog = ref(false)
const deleteProductsDialog = ref(false)
const projectList = ref([])
const product = ref({})
const selectedProducts = ref()
const submitted = ref(false)

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

const statuses = ref([
  { label: 'INSTOCK', value: 'instock' },
  { label: 'LOWSTOCK', value: 'lowstock' },
  { label: 'OUTOFSTOCK', value: 'outofstock' }
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

const openNew = () => {
  product.value = {}
  submitted.value = false
  productDialog.value = true
}
const hideDialog = () => {
  productDialog.value = false
  submitted.value = false
}

const saveProduct = () => {
  submitted.value = true

  const sanitizedObject = sanitize(_.cloneDeep(product.value))
  const method = product.value.id ? 'PUT' : 'POST'

  fetch(new Request(`${BASE_URL}/projects/${product.value.id ? product.value.id : ''}`), {
    method: method,
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(sanitizedObject)
  })
    .then(() => {
      loadProjects()
      toast.add({
        severity: 'success',
        summary: 'Successful',
        detail: 'Product Updated',
        life: 3000
      })
    })
    .catch((error) => {
      toast.add({
        severity: 'danger',
        summary: 'Erro',
        detail: error,
        life: 30000
      })
    })

  productDialog.value = false
  product.value = {}
}
const editProduct = (prod) => {
  product.value = { ...prod }
  productDialog.value = true
}
const confirmDeleteProduct = (prod) => {
  product.value = prod
  deleteProductDialog.value = true
}
const deleteProduct = () => {
  products.value = products.value.filter((val) => val.id !== product.value.id)
  deleteProductDialog.value = false
  product.value = {}
  toast.add({ severity: 'success', summary: 'Successful', detail: 'Product Deleted', life: 3000 })
}
const findIndexById = (id) => {
  let index = -1
  for (let i = 0; i < products.value.length; i++) {
    if (products.value[i].id === id) {
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
  deleteProductsDialog.value = true
}
const deleteSelectedProducts = () => {
  products.value = products.value.filter((val) => !selectedProducts.value.includes(val))
  deleteProductsDialog.value = false
  selectedProducts.value = null
  toast.add({ severity: 'success', summary: 'Successful', detail: 'Products Deleted', life: 3000 })
}
</script>
