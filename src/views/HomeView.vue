<template>
  <main>
    <h1>Seja bem-vindo!</h1>
  </main>
</template>

<script setup>
import { nextTick, onMounted, ref } from 'vue'

onMounted(() => {
  fetch(`${BASE_URL}/cadastros/`)
    .then((resp) => resp.json())
    .then((dados) => {
      baseForm.value = dados
      selectedField.value = null
      incializarSortable()
    })
})
</script>
