<template>
  <div>
    <label class="editable editable-label" contenteditable="true" @input="onInput">{{
      field.label
    }}</label>
    <input type="text" name="input" class="form-control" />
  </div>
</template>

<script setup>
const props = defineProps({ field: { type: Object } })

function onInput(e) {
  props.field.label = e.target.innerText;
}
</script>
