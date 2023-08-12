<template>
  <div>
    <label class="editable editable-label" contenteditable="true" @input="onInput">{{
      field.label
    }}</label>
    <select class="form-control">
      <option v-for="option in splitStringByLine(field.options)">{{ option }}</option>
    </select>
  </div>
</template>

<script setup>
const props = defineProps({ field: { type: Object } })

function splitStringByLine(str) {
  return str.split('\n')
}

function onInput(e) {
  props.field.label = e.target.innerText
}
</script>
