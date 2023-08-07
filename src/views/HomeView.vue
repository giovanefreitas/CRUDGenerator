<template>
  <main>
    <h1>Seja bem-vindo!</h1>
    <div v-for="project of projectList" :key="project._id" class="row">
      <router-link :to="`/project/${project._id}`">{{ project.name }}</router-link>
    </div>
  </main>
</template>

<script setup>
import { nextTick, onMounted, ref } from 'vue'

const BASE_URL = `${import.meta.env.VITE_API_BASE_URL}`

const projectList = ref([])

onMounted(() => {
  fetch(`${BASE_URL}/cadastros/`)
    .then((resp) => resp.json())
    .then((dados) => {
      projectList.value = dados
    })
})
</script>
