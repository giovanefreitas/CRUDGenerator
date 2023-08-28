<template>
  <div>
    <grid-element
      :fields="activeFields"
      :allow-edit="false"
      v-on:elementFocus="$emit('elementFocus', 
      field)"
    >
    </grid-element>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import GridElement from './GridElement.vue'

const props = defineProps({ field: { type: Object } })

const activeFields = computed(() => {
  return props.field.fields.filter((subfield) => subfield.active)
})
</script>
