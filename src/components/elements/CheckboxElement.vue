<template>
  <div>
    <label class="editable" contenteditable="true" @input="onInput">{{ field.label }}</label>
    <div class="form-element">
      <div class="outer">
        <div v-for="option in splitStringByLine(field.options)" class="checkbox">
          <label><input type="checkbox" value="" />{{ option }}</label>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({ field: { type: Object } })

function splitStringByLine(str) {
  if (str) {
    return str.split('\n')
  } else {
    return []
  }
}

function onInput(e) {
  props.field.label = e.target.innerText
}
</script>
