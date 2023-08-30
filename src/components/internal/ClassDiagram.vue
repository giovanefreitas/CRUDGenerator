<template>
  <span>Hello!</span>
  <div ref="graphDiv"></div>
</template>

<script setup>
import mermaid from 'mermaid'
import { onMounted, ref } from 'vue'

const graphDiv = ref(null)

mermaid.initialize({ startOnLoad: false })

const drawDiagram = async function () {
  const { svg } = await mermaid.render('graphDiv', graphDefinition)
  graphDiv.value.innerHTML = svg
}

const graphDefinition = `classDiagram
    note "From Duck till Zebra"
    Animal <|-- Duck
    note for Duck "can fly\ncan swim\ncan dive\ncan help in debugging"
    Animal <|-- Fish
    Animal <|-- Zebra
    Animal : +int age
    Animal : +String gender
    Animal: +isMammal()
    Animal: +mate()
    class Duck{
        +String beakColor
        +swim()
        +quack()
    }
    class Fish{
        -int sizeInFeet
        -canEat()
    }
    class Zebra{
        +bool is_wild
        +run()
    }`

onMounted(() => {
  drawDiagram()
})
</script>

<style></style>
