<template>
  <div>
    <form-wizard :steps="steps" :onNext="nextClicked" :onBack="backClicked">
      <template v-slot:page1>
        <form>
          <div class="form-group row">
            <label for="inputHost" class="col-sm-2 col-form-label">Servidor</label>
            <div class="col-sm-10">
              <input type="text" class="form-control" id="inputHost" v-model="dadosConexao.host" />
            </div>
          </div>
          <div class="form-group row">
            <label for="inputPort" class="col-sm-2 col-form-label">Porta</label>
            <div class="col-sm-10">
              <input type="text" class="form-control" id="inputPort" v-model="dadosConexao.port" />
            </div>
          </div>
          <div class="form-group row">
            <label for="inputServiceName" class="col-sm-2 col-form-label">Service Name</label>
            <div class="col-sm-10">
              <input type="text" class="form-control" id="inputServiceName" v-model="dadosConexao.serviceName" />
            </div>
          </div>
          <div class="form-group row">
            <label for="inputUser" class="col-sm-2 col-form-label">Usuário</label>
            <div class="col-sm-10">
              <input type="text" class="form-control" id="inputUser" v-model="dadosConexao.user" />
            </div>
          </div>
          <div class="form-group row">
            <label for="inputPassword" class="col-sm-2 col-form-label">Senha</label>
            <div class="col-sm-10">
              <input type="password" class="form-control" id="inputPassword" v-model="dadosConexao.password" />
            </div>
          </div>
          <div class="form-check">
            <input type="checkbox" class="form-check-input" id="inputCommentAsLabel" v-model="dadosConexao.commentAsLabel"/>
            <label class="form-check-label" for="inputCommentAsLabel"
              >Utilizar comentário como label</label
            >
          </div>
        </form>
      </template>
      <template v-slot:page2>
        <h4>Step 2</h4>
        <p>This is step 2</p>
      </template>
      <template v-slot:page3>
        <h4>Step 3</h4>
        <p>This is step 3</p>
      </template>
      <template v-slot:page4>
        <h4>Step 4</h4>
        <p>This is step 4</p>
      </template>
    </form-wizard>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import FormWizard from '../components/internal/FormWizard.vue'

const BASE_URL = `${import.meta.env.VITE_API_BASE_URL}`

const generatedProject = ref(null)
const importingSchema = ref(false)
const steps = ref([
  {
    label: 'Configurar conexão',
    slot: 'page1'
  },
  {
    label: 'Add Constraints',
    slot: 'page2'
  },
  {
    label: 'Review',
    slot: 'page3'
  },
  {
    label: 'Apply',
    slot: 'page4',
    options: {
      nextDisabled: true // control whether next is disabled or not
    }
  }
])
const dadosConexao = ref({
  host: '',
  serviceName: '',
  port: 1521,
  owner: '',
  user: '',
  password: '',
  commentAsLabel: true
})

async function nextClicked(currentPage) {
  if (currentPage == 0) {
    await importFromDatabase()
  }

  return true //return false if you want to prevent moving to next page
}

function backClicked(currentPage) {
  console.log('back clicked', currentPage)
  return true //return false if you want to prevent moving to previous page
}

async function importFromDatabase() {
  console.log('start request')
  importingSchema.value = true
  await fetch(`${BASE_URL}/importar/oracle`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(dadosConexao.value)
  })
    .then((resp) => resp.json())
    .then((dados) => {
      generatedProject.value = dados
      importingSchema.value = false
      console.log('end request')
    })
}
</script>
