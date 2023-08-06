<template>
  <div class="row">
    <div
      v-bind:class="{ 'sortable drop-target': allowEdit, 'sortable-border': fields && fields.length === 0 }"
      class="col"
      :data-prop-ref="`${parentRef}`"
    >
      <div
        :id="field.id"
        v-bind:class="{ 'focused-element': field.isFocused === true }"
        v-on:click.stop="$emit('elementFocus', field)"
        tabindex="-1"
        class="form-group form-element-container"
        v-for="(field, index) in fields"
        :key="field.id"
      >
        <div v-bind:class="{ hide: field.isFocused !== true }" class="action-circles">
          <div
            v-on:click="$emit('deleteElement', field, parentRef)"
            class="action-circle delete-circle"
          >
            <span class="glyphicon glyphicon-trash delete-trash"></span>
            <span class="delete-text">Remove</span>
          </div>
        </div>
        <HeaderElement
          v-if="field.type === 'header'"
          v-bind:class="field.textalign"
          v-bind:field="field"
        >
        </HeaderElement>

        <InputElement v-if="field.type === 'input'" v-bind:field="field"> </InputElement>

        <AddressElement
          v-if="field.type === 'address'"
          v-bind:field="field"
          v-on:elementFocus="$emit('elementFocus', field)"
        >
        </AddressElement>

        <CheckboxesElement v-if="field.type === 'checkboxes'" v-bind:field="field">
        </CheckboxesElement>

        <RadioButtonsElement v-if="field.type === 'radio_buttons'" v-bind:field="field">
        </RadioButtonsElement>

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

        <div v-if="field.visibility === 'hidden'" class="element-not-visible">
          <span class="glyphicon glyphicon-exclamation-sign"></span> This field is hidden and will
          not be seen on the form.
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
import CheckboxesElement from './CheckboxesElement.vue'
import RadioButtonsElement from './RadioButtonsElement.vue'
import SelectElement from './SelectElement.vue'

const props = defineProps({
  fields: { type: Array },
  parentRef: { type: String },
  allowEdit: { type: Boolean, default: true }
})
</script>
