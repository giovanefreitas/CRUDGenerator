<template>
  <div>
    <h1 v-if="field.tagname === 'h1' || field.tagname === null">
      <span class="editable editable-label" contenteditable="true">{{ field.label }}</span
      ><br />
      <small
        class="editable"
        v-if="
          field.isFocused ||
          (field.subheader !== null && field.subheader !== '' && field.subheader !== undefined)
        "
        contenteditable="true"
        data-text="Informe a descrição"
        >{{ field.subheader }}</small
      >
    </h1>
    <h2 v-if="field.tagname === 'h2'">
      <span class="editable editable-label" contenteditable="true">{{ field.label }}</span
      ><br />
      <small
        class="editable"
        v-if="
          field.isFocused ||
          (field.subheader !== null && field.subheader !== '' && field.subheader !== undefined)
        "
        contenteditable="true"
        data-text="Informe a descrição"
        >{{ field.subheader }}</small
      >
    </h2>
    <h3 v-if="field.tagname === 'h3'">
      <span class="editable editable-label" contenteditable="true">{{ field.label }}</span
      ><br />
      <small
        class="editable"
        :class="'editable-sub-' + index"
        v-if="field.isFocused || (field.subheader !== null && field.subheader !== '')"
        contenteditable="true"
        data-text="Informe a descrição"
        >{{ field.subheader }}</small
      >
    </h3>
    <h4 v-if="field.tagname === 'h4'">
      <span class="editable editable-label" contenteditable="true">{{ field.label }}</span
      ><br />
      <small
        class="editable"
        :class="'editable-sub-' + index"
        v-if="field.isFocused || (field.subheader !== null && field.subheader !== '')"
        contenteditable="true"
        data-text="Informe a descrição"
        >{{ field.subheader }}</small
      >
    </h4>
    <h5 v-if="field.tagname === 'h5'">
      <span class="editable editable-label" contenteditable="true">{{ field.label }}</span
      ><br />
      <small
        class="editable"
        :class="'editable-sub-' + index"
        v-if="field.isFocused || (field.subheader !== null && field.subheader !== '')"
        contenteditable="true"
        data-text="Informe a descrição"
        >{{ field.subheader }}</small
      >
    </h5>
    <h6 v-if="field.tagname === 'h6'">
      <span class="editable editable-label" contenteditable="true">{{ field.label }}</span
      ><br />
      <small
        class="editable"
        :class="'editable-sub-' + index"
        v-if="field.isFocused || (field.subheader !== null && field.subheader !== '')"
        contenteditable="true"
        data-text="Informe a descrição"
        >{{ field.subheader }}</small
      >
    </h6>
  </div>
</template>

<script setup>
defineProps({ field: { type: Object } })
</script>
