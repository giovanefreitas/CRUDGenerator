<template>
  <div>
    <grid-element
      :fields="activeSubFields"
      :allowEdit="false"
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

const activeSubFields = computed(() => {
  return props.field.subfields.filter((subfield) => subfield.active)
})
</script>
