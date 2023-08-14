<template>
  <div>
    <label class="editable editable-label" contenteditable="true" @input="onInput">{{
      field.label
    }}</label>
    <input
      v-if="field.widgetType == 'autocomplete'"
      type="text"
      name="input"
      class="form-control"
    />
    <select v-if="field.widgetType == 'select'" name="input" class="form-select">
      <option>Exemplo item 1</option>
      <option>Exemplo item 2</option>
      <option>Exemplo item 3</option>
    </select>
  </div>
</template>

<script setup>
const props = defineProps({ field: { type: Object } })

function onInput(e) {
  props.field.label = e.target.innerText
}
</script>
