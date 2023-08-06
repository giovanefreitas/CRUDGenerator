<template>
  <div>
    <label class="editable editable-label" contenteditable="true">{{ field.label }}</label>
    <input type="text" name="input" class="form-control" />
  </div>
</template>

<script setup>
defineProps({ field: { type: Object } })
</script>
