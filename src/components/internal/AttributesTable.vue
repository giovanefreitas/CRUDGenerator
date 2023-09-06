<template>
  <div>
    <nav class="navbar navbar-expand-lg bg-body-tertiary">
      <div class="container-fluid">
        <a class="navbar-brand" href="#">Atributos</a>
        <div class="collapse navbar-collapse" id="navbarSupportedContent">
          <ul class="navbar-nav me-auto mb-2 mb-lg-0">
            <button class="btn btn-outline-success" type="submit" @click="addNewAttribute">
              Novo
            </button>
          </ul>
          <div class="d-flex" role="search">
            <input
              class="form-control me-2"
              type="search"
              placeholder="Pesquisar"
              aria-label="Pesquisar"
            />
          </div>
        </div>
      </div>
    </nav>
    <table class="table">
      <thead>
        <tr>
          <th scope="col" v-if="multipleSelection">
            <a href="#" @click="selectAllColumns">Todos</a>
            <span class="ms-2 me-2">/</span>
            <a href="#" @click="deselectAllColumns">Nenhum</a>
          </th>
          <th scope="col">Nome</th>
          <th scope="col">Nome da Coluna</th>
          <th scope="col">Rótulo</th>
          <th scope="col">Tipo</th>
          <th scope="col"></th>
        </tr>
      </thead>
      <tbody>
        <template v-for="(field, index) of fields" :key="field.id">
          <tr v-if="field.type != 'table'">
            <th scope="row" v-if="multipleSelection">
              <input
                type="checkbox"
                class="form-check-input"
                :id="`inputTable_${field.column}`"
                v-model="field.selected"
                :disabled="props.disabled"
              /><span class="ms-3">{{ index + 1 }}</span>
            </th>
            <td>
              <input
                type="text"
                v-model="field.name"
                class="form-control"
                :disabled="!field.selected || props.disabled"
              />
            </td>
            <td>
              <input
                type="text"
                v-model="field.column"
                class="form-control"
                :disabled="!field.selected || props.disabled"
              />
            </td>
            <td>
              <input
                type="text"
                v-model="field.label"
                class="form-control"
                :disabled="!field.selected || props.disabled"
              />
            </td>
            <td>
              <select
                v-model="field.type"
                class="form-select"
                :disabled="!field.selected || props.disabled"
              >
                <option value="input">Caixa de entrada</option>
                <option value="checkbox">Caixa de marcação</option>
                <option value="radiobutton">Caixa de seleção</option>
                <option value="address">Endereço</option>
                <option value="select">Lista suspensa</option>
                <option value="relationship">Relacionamento</option>
              </select>
            </td>
            <td>
              <button class="btn btn-outline-primary">Selecionar</button>
            </td>
          </tr>
        </template>
      </tbody>
    </table>
  </div>
</template>
<script setup>
const props = defineProps({
  fields: { type: Object, required: false },
  disabled: { type: Boolean, default: false },
  multipleSelection: { type: Boolean, default: false}
})

function addNewAttribute() {
  props.fields.push({})
}

function selectAllColumns() {
  for (let field of props.fields) {
    field.selected = true
  }
}

function deselectAllColumns() {
  for (let field of props.fields) {
    field.selected = false
  }
}
</script>
