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
              <input
                type="text"
                class="form-control"
                id="inputServiceName"
                v-model="dadosConexao.serviceName"
              />
            </div>
          </div>
          <div class="form-group row">
            <label for="inputOwner" class="col-sm-2 col-form-label">Owner</label>
            <div class="col-sm-10">
              <input
                type="text"
                class="form-control"
                id="inputOwner"
                v-model="dadosConexao.owner"
              />
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
              <input
                type="password"
                class="form-control"
                id="inputPassword"
                v-model="dadosConexao.password"
              />
            </div>
          </div>
          <div class="form-check">
            <input
              type="checkbox"
              class="form-check-input"
              id="inputCommentAsLabel"
              v-model="dadosConexao.commentAsLabel"
            />
            <label class="form-check-label" for="inputCommentAsLabel"
              >Utilizar comentário como label</label
            >
          </div>
        </form>
      </template>
      <template v-slot:page2>
        <form>
          <div class="form-group row">
            <label for="inputHost" class="col-sm-2 col-form-label">Projeto</label>
            <div class="col-sm-10">
              <input
                type="text"
                class="form-control"
                id="inputHost"
                v-model="generatedProject.name"
              />
            </div>
          </div>
          <div class="form-check">
            <input
              type="checkbox"
              class="form-check-input"
              id="inputCommentAsLabel"
              v-model="generatedProject.useOpenID"
            />
            <label class="form-check-label" for="inputCommentAsLabel"
              >Utilizar autenticação Open ID</label
            >
          </div>
        </form>
      </template>
      <template v-slot:page3>
        <div class="row">
          <div v-for="screen of generatedProject.screens" class="col-4" :key="screen.entity">
            <input
              type="checkbox"
              class="form-check-input"
              :id="`inputTable${screen.table}`"
              v-model="screen.selected"
            />
            <label class="form-check-label" :for="`inputTable${screen.table}`">{{
              screen.table
            }}</label>
          </div>
        </div>
      </template>
      <template v-slot:page4>
        <div class="accordion" id="accordionDetails">
          <div v-for="(screen, index) in selectedTables" class="accordion-item" :key="screen.table">
            <h2 class="accordion-header">
              <button
                class="accordion-button"
                :class="{ collapsed: index > 0 }"
                type="button"
                data-bs-toggle="collapse"
                :data-bs-target="`#detail${screen.table}`"
                aria-expanded="true"
                aria-controls="detail${screen.table}`"
              >
                {{ screen.table }}
              </button>
            </h2>
            <div
              :id="`detail${screen.table}`"
              class="accordion-collapse collapse"
              :class="{ show: index == 0 }"
              data-bs-parent="#accordionDetails"
            >
              <div class="accordion-body">
                <div class="form-group row">
                  <label for="inputName" class="col-sm-3 col-form-label"
                    >Identificador singular</label
                  >
                  <div class="col-sm-9">
                    <input type="text" class="form-control" id="inputName" v-model="screen.name" />
                  </div>
                </div>
                <div class="form-group row">
                  <label for="inputPluralName" class="col-sm-3 col-form-label"
                    >Identificador plural</label
                  >
                  <div class="col-sm-9">
                    <input
                      type="text"
                      class="form-control"
                      id="inputPluralName"
                      v-model="screen.pluralName"
                    />
                  </div>
                </div>
                <div class="form-group row">
                  <label for="inputLabel" class="col-sm-3 col-form-label">Rótulo</label>
                  <div class="col-sm-9">
                    <input
                      type="text"
                      class="form-control"
                      id="inputLabel"
                      v-model="screen.label"
                    />
                  </div>
                </div>
                <div class="form-group row">
                  <label for="inputEntity" class="col-sm-3 col-form-label">Entidade</label>
                  <div class="col-sm-9">
                    <input
                      type="text"
                      class="form-control"
                      id="inputEntity"
                      v-model="screen.entity"
                    />
                  </div>
                </div>
                <div class="form-group row">
                  <label for="inputTable" class="col-sm-3 col-form-label">Tabela</label>
                  <div class="col-sm-9">
                    <input
                      type="text"
                      class="form-control"
                      id="inputTable"
                      v-model="screen.table"
                    />
                  </div>
                </div>
                <h4>Atributos:</h4>
                <table class="table">
                  <thead>
                    <tr>
                      <th scope="col">#</th>
                      <th scope="col">Nome</th>
                      <th scope="col">Nome da Coluna</th>
                      <th scope="col">Rótulo</th>
                      <th scope="col">Tipo</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(field, index) of screen.subfields" :key="field.id">
                      <th scope="row">{{ index + 1 }}</th>
                      <td>
                        <input type="text" v-model="field.name" />
                      </td>
                      <td>
                        <input type="text" v-model="field.column" />
                      </td>
                      <td>
                        <input type="text" v-model="field.label" />
                      </td>
                      <td>
                        <input type="text" v-model="field.type" />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </template>
      <template v-slot:page5>
        <h1>Fim</h1>
      </template>
    </form-wizard>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import FormWizard from '../components/internal/FormWizard.vue'
import _ from 'lodash'
import { useRouter } from 'vue-router'

const BASE_URL = `${import.meta.env.VITE_API_BASE_URL}`

const router = useRouter()
const generatedProject = ref(null)
const importingSchema = ref(false)
const steps = ref([
  {
    label: 'Configurar conexão',
    slot: 'page1'
  },
  {
    label: 'Configurações gerais',
    slot: 'page2'
  },
  {
    label: 'Selecionar telas',
    slot: 'page3'
  },
  {
    label: 'Detalhes',
    slot: 'page4',
    options: {
      nextDisabled: true // control whether next is disabled or not
    }
  },
  {
    label: 'Finalizar',
    slot: 'page5',
    options: {
      nextDisabled: true // control whether next is disabled or not
    }
  }
])
const dadosConexao = ref({
  host: `${import.meta.env.VITE_DB_HOST}`,
  serviceName: `${import.meta.env.VITE_DB_SERVICE_NAME}`,
  port: `${import.meta.env.VITE_DB_PORT}`,
  owner: `${import.meta.env.VITE_DB_OWNER}`,
  user: `${import.meta.env.VITE_DB_USER}`,
  password: `${import.meta.env.VITE_DB_PASSWORD}`,
  commentAsLabel: true
})

const selectedTables = computed(() =>
  generatedProject.value.screens.filter((item) => item.selected)
)

async function nextClicked(currentPage) {
  if (currentPage == 0) {
    await importFromDatabase()
  }

  if (currentPage == 4) {
    salvarProjeto()
  }

  return true //return false if you want to prevent moving to next page
}

function backClicked(currentPage) {
  if (currentPage == 1) {
    return confirm(
      'Atenção, se você voltar para a etapa inicial tadas as configurações serão descartadas.'
    )
  }
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
    .then((data) => {
      generatedProject.value = data
      importingSchema.value = false
      console.log('end request')
    })
}

const blacklist = ['selected']
function sanitizar(obj) {
  Object.keys(obj).forEach(function (key) {
    ;(blacklist.indexOf(key) >= 0 && delete obj[key]) ||
      (obj[key] && typeof obj[key] === 'object' && sanitizar(obj[key]))
  })
  return obj
}

function salvarProjeto() {
  var objSanitizado = sanitizar(_.cloneDeep(generatedProject.value))

  fetch(new Request(`${BASE_URL}/cadastros/`), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(objSanitizado)
  })
    .then((resp) => resp.json())
    .then((data) => {
      console.log(data)
      router.push({ name: 'project', params: { id: data.insertedId } })
    })
}
</script>
