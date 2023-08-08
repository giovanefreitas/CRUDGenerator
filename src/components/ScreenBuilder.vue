<template>
  <div>
    <div class="content-container build-container build-body">
      <div class="form-elements">
        <div class="element-main-header">Elementos</div>

        <div
          v-for="elemento in ELEMENTS"
          :key="elemento.name"
          :id="elemento.name"
          class="element-container element-template"
        >
          <div class="element-icon">
            <i class="bi" :class="elemento.icon"></i>
          </div>
          <div class="element-text">{{ elemento.label }}</div>
        </div>
      </div>

      <div class="editor-area" @click.stop="limparSelecao">
        <grid-element
          :fields="baseForm.subfields"
          v-on:elementFocus="elementFocus"
          v-on:deleteElement="deleteElement"
          parentRef="subfields"
          class="card shadow"
        >
        </grid-element>
      </div>

      <div class="element-properties" v-if="selectedField">
        <div class="element-main-header">Properties</div>
        <div v-if="selectedField.type === 'header'" class="element-property">
          <div class="form-group">
            <label>Título</label>
            <input type="text" class="form-control" v-model="selectedField.label" />
          </div>
        </div>
        <div
          v-if="selectedField.type !== 'header' && selectedField.type !== 'grid'"
          class="element-property"
        >
          <div class="form-group">
            <label>Rótulo</label>
            <input type="text" class="form-control" v-model="selectedField.label" />
          </div>
          <div class="form-group">
            <label>Identificador</label>
            <input type="text" class="form-control" v-model="selectedField.name" />
          </div>
          <div class="form-group">
            <label>Coluna</label>
            <input type="text" class="form-control" v-model="selectedField.column" />
          </div>
        </div>
        <div v-if="selectedField.type === 'header'" class="element-property">
          <div class="form-group">
            <label>Sub-Heading Text</label>
            <input type="text" class="form-control" v-model="selectedField.subheader" />
            <small class="form-text text-muted">Small text below the heading.</small>
          </div>
        </div>
        <div v-if="selectedField.type === 'header'" class="element-property">
          <div class="form-group">
            <label>Heading Size</label>
            <div class="radio-wrapper">
              <label
                v-bind:class="{
                  'label-active': selectedField.tagname === null || selectedField.tagname === 'h1'
                }"
                class="radio-inline"
              >
                <input type="radio" name="tagname" v-model="selectedField.tagname" value="h1" />H1
              </label>
              <label
                v-bind:class="{
                  'label-active': selectedField.tagname === 'h2'
                }"
                class="radio-inline"
              >
                <input type="radio" name="tagname" v-model="selectedField.tagname" value="h2" />H2
              </label>
              <label
                v-bind:class="{
                  'label-active': selectedField.tagname === 'h3'
                }"
                class="radio-inline"
              >
                <input type="radio" name="tagname" v-model="selectedField.tagname" value="h3" />H3
              </label>
              <label
                v-bind:class="{
                  'label-active': selectedField.tagname === 'h4'
                }"
                class="radio-inline"
              >
                <input type="radio" name="tagname" v-model="selectedField.tagname" value="h4" />H4
              </label>
              <label
                v-bind:class="{
                  'label-active': selectedField.tagname === 'h5'
                }"
                class="radio-inline"
              >
                <input type="radio" name="tagname" v-model="selectedField.tagname" value="h5" />H5
              </label>
              <label
                v-bind:class="{
                  'label-active': selectedField.tagname === 'h6'
                }"
                class="radio-inline"
              >
                <input type="radio" name="tagname" v-model="selectedField.tagname" value="h6" />H6
              </label>
            </div>
          </div>
        </div>
        <div v-if="selectedField.type === 'header'" class="element-property">
          <div class="form-group">
            <label>Text Alignment</label>
            <div class="radio-wrapper">
              <label
                v-bind:class="{
                  'label-active':
                    selectedField.textalign === null || selectedField.textalign === 'text-left'
                }"
                class="radio-inline"
              >
                <input
                  type="radio"
                  name="optradio"
                  v-model="selectedField.textalign"
                  value="text-left"
                />Left
              </label>
              <label
                v-bind:class="{
                  'label-active': selectedField.textalign === 'text-center'
                }"
                class="radio-inline"
              >
                <input
                  type="radio"
                  name="optradio"
                  v-model="selectedField.textalign"
                  value="text-center"
                />Center
              </label>
              <label
                v-bind:class="{
                  'label-active': selectedField.textalign === 'text-right'
                }"
                class="radio-inline"
              >
                <input
                  type="radio"
                  name="optradio"
                  v-model="selectedField.textalign"
                  value="text-right"
                />Right
              </label>
            </div>
          </div>
        </div>
        <div
          v-if="
            selectedField.type === 'checkboxes' ||
            selectedField.type === 'radio_buttons' ||
            selectedField.type === 'select'
          "
          class="element-property"
        >
          <div class="form-group">
            <label>Opções</label>
            <textarea class="form-control" rows="5" v-model="selectedField.options"></textarea>
          </div>
        </div>

        <div v-if="selectedField.type != 'grid'" class="element-property">
          <div class="row" v-for="subfield in selectedField.subfields" :key="subfield.id">
            <div class="col-sm-6">{{ subfield.label_display }}</div>
            <div class="col-sm-6 col-padding">
              <input type="text" class="form-control" v-model="subfield.label" />
            </div>
          </div>
        </div>
        <div v-if="selectedField.type != 'grid'">
          <div
            v-for="subfield in selectedField.subfields"
            class="element-property"
            :key="subfield.id"
          >
            <label>{{ subfield.label_display }}</label>
            <div>
              <label class="switch">
                <input type="checkbox" v-model="subfield.active" />

                <div class="slider">
                  <div
                    class="switch-on"
                    v-bind:class="{ 'switch-on-active': subfield.active !== false }"
                  >
                    ON
                  </div>
                  <div
                    class="switch-off"
                    v-bind:class="{
                      'switch-off-active': subfield.active === true
                    }"
                  >
                    OFF
                  </div>
                </div>
              </label>
            </div>
          </div>
        </div>

        <div class="element-property">
          <label>Ocultar campo</label>
          <div>
            <label class="switch">
              <input type="checkbox" value="hidden" v-model="selectedField.hidden" />
              <div class="slider">
                <div
                  class="switch-on"
                  v-bind:class="{ 'switch-on-active': selectedField.hidden !== false }"
                >
                  ON
                </div>
                <div
                  class="switch-off"
                  v-bind:class="{ 'switch-off-active': selectedField.hidden === true }"
                >
                  OFF
                </div>
              </div>
            </label>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import GridElement from './elements/GridElement.vue'
import { nextTick, onMounted, ref, watch } from 'vue'

import _ from 'lodash'

const props = defineProps({ baseForm: { type: Object } })

/*
ELEMENTO:
  type: tipo padrão
  name: varíaveis e colunas
  label: exibição na tela do sistema gerado
  label_display: exibição na tela do editor de formulários
  placeholder: dica de tela exibida no sistema gerado
  tagname: tag html a ser usada
  textalign: css de alinhamento
  subfields: sub componentes
  active: usado para indicar se um atributo padrão de um elemento composto deve ser usado ou não
  options: lista de valores padrões para radio, checkbox e select
  isFocused: usado apenas no editor de formulários
  hidden: Indica se o componente deve ficar oculto no sistema gerado
  subheader: descrição adicional do campo, exibida no sistema gerado
*/

const ELEMENTS = {
  header: {
    name: 'header',
    label: 'Título',
    type: 'header',
    tagname: 'h1',
    textalign: 'text-left',
    icon: 'bi-type',
    subfields: []
  },
  address: {
    name: 'address',
    label: 'Endereço',
    type: 'address',
    icon: 'bi-geo-alt',
    subfields: [
      {
        name: 'header',
        label: 'Endereço',
        label_display: 'Título da seção',
        type: 'header',
        tagname: 'h1',
        textalign: 'text-left',
        subfields: [],
        active: true
      },
      {
        name: 'cep',
        label: 'CEP',
        label_display: 'CEP',
        type: 'input',
        placeholder: 'CEP',
        active: true
      },
      {
        name: 'logradouro',
        label: 'Logradouro',
        label_display: 'Logradouro',
        type: 'input',
        placeholder: 'Logradouro',
        active: true
      },
      {
        name: 'bairro',
        label: 'Bairro',
        label_display: 'Bairro',
        type: 'input',
        placeholder: 'Bairro',
        active: true
      },
      {
        name: 'municipio',
        label: 'Município',
        label_display: 'Município',
        type: 'input',
        placeholder: 'municipio',
        active: true
      },
      {
        name: 'uf',
        label: 'UF',
        label_display: 'UF',
        type: 'input',
        placeholder: 'uf',
        active: true
      },
      {
        name: 'pais',
        label: 'País',
        label_display: 'País',
        type: 'input',
        placeholder: 'pais',
        active: false
      }
    ]
  },
  input: {
    name: 'input',
    label: 'Caixa de entrada',
    type: 'input',
    tagname: 'input',
    icon: 'bi-input-cursor-text',
    subfields: []
  },
  checkboxes: {
    name: 'checkboxes',
    label: 'Caixa de marcação',
    type: 'checkboxes',
    tagname: 'input',
    options: 'Opção 1\nOpção 2\nOpção 3',
    icon: 'bi-ui-checks',
    subfields: []
  },
  radio_buttons: {
    name: 'radio_buttons',
    label: 'Caixa de seleção',
    type: 'radio_buttons',
    tagname: 'input',
    options: 'Opção 1\nOpção 2\nOpção 3',
    icon: 'bi-ui-radios',
    subfields: []
  },
  select: {
    name: 'select',
    label: 'Lista suspensa',
    type: 'select',
    tagname: 'select',
    options: 'Opção 1\nOpção 2\nOpção 3',
    icon: 'bi-menu-button-fill',
    subfields: []
  },
  grid: {
    name: 'grid',
    label: 'Grid',
    type: 'grid',
    icon: 'bi-layout-three-columns',
    subfields: []
  },
  table: {
    name: 'table',
    label: 'Tabela',
    type: 'table',
    icon: 'bi-table',
    subfields: []
  }
}

const selectedField = ref(null)

watch(props, async (newValue, oldValue) => {
  console.log('incializarSortable')
  incializarSortable()
})

function elementFocus(field) {
  console.log(field)
  if (selectedField.value) {
    selectedField.value.isFocused = false
  }
  field.isFocused = true
  selectedField.value = field
}

function deleteElement(field, parentRef) {
  const parent = _.get(props.baseForm, parentRef)
  parent.splice(parent.indexOf(field), 1)
}

function receiveElement(element, newIndex, propRef) {
  const parent = _.get(props.baseForm, propRef)
  console.log(propRef)
  console.log(props.baseForm)
  console.log(parent)

  let novoItem = Object.assign(
    {
      id: propRef + '_' + parent.length,
      subheader_update: true,
      order_rank: newIndex
    },
    element
  )

  if (element.type == 'grid') {
    window.jQuery('.drop-target').sortable('destroy')
  }

  parent.splice(newIndex, 0, novoItem)
  elementFocus(novoItem)
  if (element.type == 'grid') {
    console.log('Atualizando o sortable')
    nextTick(function () {
      incializarSortable()
    })
  }
}

function incializarSortable() {
  console.log('Incializando sortable')

  window.jQuery('.drop-target').sortable({
    cursor: 'move',
    opamunicipio: 0.7,
    cancel: '.editable',
    start: function (e, ui) {
      // creates a temporary attribute on the element with the old index
      window.jQuery(this).attr('data-previndex', ui.item.index())
    },
    receive: function (event, ui) {
      console.log('event.target', event.target)
      const propRef = event.target.getAttribute('data-prop-ref')
      console.log('ID=', ui.item.attr('id'))
      if (ui.item.attr('id')) {
        const newIndex = parseInt(window.jQuery(this).data('ui-sortable').currentItem.index())
        const element = window.jQuery.extend(true, {}, ELEMENTS[ui.item.attr('id')])

        window.jQuery(this).removeAttr('data-previndex')
        window.jQuery(ui.helper).replaceWith('')

        receiveElement(element, newIndex, propRef)
      }
    }
    // update: function (event, ui) {
    //   if (ui.item.index() !== -1) {
    //     const propRef = event.target.getAttribute("data-prop-ref");
    //     const parent = _.get(props.baseForm, propRef);
    //     var newIndex = ui.item.index();

    //     var oldIndex = parseInt(window.jQuery(this).attr("data-previndex"));
    //     window.jQuery(this).removeAttr("data-previndex");

    //     window.jQuery(ui.helper).replaceWith("");

    //     parent.splice(newIndex, 0, parent.splice(oldIndex, 1)[0]);
    //     that.elementFocus(newIndex);
    //   }
    // },
  })
}

onMounted(() => {
  window.jQuery('.element-template').draggable({
    connectToSortable: '.drop-target',
    helper: 'clone',
    opamunicipio: 0.7
  })
})

function limparSelecao() {
  if (selectedField.value) {
    selectedField.value.isFocused = false
    selectedField.value = null
  }
}
</script>
