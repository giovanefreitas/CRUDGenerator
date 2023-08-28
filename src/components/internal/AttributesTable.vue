<template>
  <table class="table">
    <thead>
      <tr>
        <th scope="col">
          <a href="#" @click="selectAllColumns">Todos</a>
          <span class="ms-2 me-2">/</span>
          <a href="#" @click="deselectAllColumns">Nenhum</a>
        </th>
        <th scope="col">Nome</th>
        <th scope="col">Nome da Coluna</th>
        <th scope="col">Rótulo</th>
        <th scope="col">Tipo</th>
      </tr>
    </thead>
    <tbody>
      <template v-for="(field, index) of fields" :key="field.id">
        <tr v-if="field.type != 'table'">
          <th scope="row">
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
        </tr>
      </template>
    </tbody>
  </table>
</template>
<script setup>
const props = defineProps({
  fields: { type: Object, required: false },
  disabled: { type: Boolean, default: false }
})

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
