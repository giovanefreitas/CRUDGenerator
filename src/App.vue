<script setup>
import { RouterLink, RouterView } from 'vue-router'
import Toast from 'primevue/toast'
</script>

<template>
  <header>
    <div class="container">
      <nav>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/about">About</RouterLink>
        <RouterLink to="/schema-importer">Importar</RouterLink>
        <RouterLink to="/project/new">Novo projeto</RouterLink>
      </nav>
    </div>
  </header>
  <Toast />
  <RouterView />
</template>
