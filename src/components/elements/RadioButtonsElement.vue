<template>
  <div>
    <label class="editable" contenteditable="true" @input="onInput">{{ field.label }}</label>
    <div class="form-element">
      <div v-for="option in splitStringByLine(field.options)" class="radio">
        <label><input type="radio" :name="field.name" />{{ option }}</label>
      </div>
    </div>
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
