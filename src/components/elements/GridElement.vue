<template>
  <div class="row element-grid">
    <div
      v-bind:class="{
        'sortable drop-target': allowEdit,
        'sortable-border': fields && fields.length === 0
      }"
      class="row"
      :data-prop-ref="`${parentRef}`"
    >
      <div
        v-for="(field, index) in fields"
        :key="field.id"
        :class="`col-sm-12 col-md-6 col-xl-${field.cols} field-element p-2`"
        v-on:click.stop="$emit('elementFocus', field)"
      >
        <div class="icon-move">
          <i class="pi pi-arrows-alt"></i>
        </div>
        <div
          :id="field.id"
          v-bind:class="{ 'focused-element': field.isFocused === true }"
          tabindex="-1"
          class="form-group form-element-container cancel-drag w-100"
        >
          <div v-bind:class="{ hide: field.isFocused !== true }" class="action-circles">
            <div
              v-on:click="$emit('deleteElement', field, parentRef)"
              class="action-circle delete-circle"
            >
            <i class="bi bi-trash-fill"></i>
              <span class="delete-text">Remover</span>
            </div>
          </div>
          <HeaderElement
            v-if="field.type === 'header'"
            v-bind:class="field.textalign"
            v-bind:field="field"
          >
          </HeaderElement>

          <InputElement v-if="field.type === 'input'" v-bind:field="field"> </InputElement>

          <RelationshipElement v-if="field.type === 'relationship'" v-bind:field="field">
          </RelationshipElement>

          <AddressElement
            v-if="field.type === 'address'"
            v-bind:field="field"
            v-on:elementFocus="$emit('elementFocus', field)"
          >
          </AddressElement>

          <checkboxElement v-if="field.type === 'checkbox'" v-bind:field="field">
          </checkboxElement>

          <RadioButtonElement v-if="field.type === 'radiobutton'" v-bind:field="field">
          </RadioButtonElement>

          <SelectElement v-if="field.type === 'select'" v-bind:field="field"> </SelectElement>

          <GridElement
            v-if="field.type === 'grid'"
            v-bind:fields="field.subfields"
            v-bind:columns="field.columns"
            v-bind:parentRef="`${parentRef}[${index}].subfields`"
            v-on:elementFocus="(subfield) => $emit('elementFocus', subfield)"
            v-on:deleteElement="
              (subfield) => $emit('deleteElement', subfield, `${parentRef}[${index}].subfields`)
            "
          >
          </GridElement>

          <TableElement v-if="field.type === 'table'" v-bind:field="field"> </TableElement>

          <div v-if="field.hidden" class="element-not-visible">
            <span class="glyphicon glyphicon-exclamation-sign"></span> Este campo é oculto e não
            será exibido no formulário.
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'GridElement'
}
</script>

<script setup>
import HeaderElement from './HeaderElement.vue'
import AddressElement from './AddressElement.vue'
import InputElement from './InputElement.vue'
import RelationshipElement from './RelationshipElement.vue'
import checkboxElement from './checkboxElement.vue'
import RadioButtonElement from './RadioButtonElement.vue'
import SelectElement from './SelectElement.vue'
import TableElement from './TableElement.vue'
import { PrimeIcons } from 'primevue/api'

const props = defineProps({
  fields: { type: Array },
  parentRef: { type: String },
  allowEdit: { type: Boolean, default: true }
})
</script>
