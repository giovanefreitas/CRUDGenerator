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
          :fields="screen.fields"
          v-on:elementFocus="elementFocus"
          v-on:deleteElement="deleteElement"
          parentRef="fields"
          class="card shadow pt-4 pb-4"
        >
        </grid-element>
      </div>

      <PropertiesPanel
        :selected-field="selectedField"
        :screen="screen"
      ></PropertiesPanel>
    </div>
  </div>
  <!-- Modal -->
  <div
    class="modal fade"
    id="tableEditor"
    tabindex="-1"
    aria-labelledby="tableEditorLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-xl">
      <div class="modal-content w-100">
        <div class="modal-header">
          <h1 class="modal-title fs-5" id="tableEditorLabel">
            Editar tabela {{ selectedField.name }}
          </h1>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <AttributesTable :fields="selectedField.fields" />
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-primary" data-bs-dismiss="modal">Fechar</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import GridElement from './elements/GridElement.vue'
import AttributesTable from './internal/AttributesTable.vue'
import PropertiesPanel from './internal/PropertiesPanel.vue'
import { nextTick, onMounted, ref, watch } from 'vue'

import _ from 'lodash'

const props = defineProps({ screen: { type: Object }, entity: { type: Object } })

/*
ELEMENTO:
  type: tipo de dado do atributo
  widgetType: Tipo de input usado na interface do usuário
  name: variáveis e colunas
  label: exibição na tela do sistema gerado
  cols: Número de colunas que serão utilizadas em uma grade de 12 colunas
  placeholder: dica de tela exibida no sistema gerado
  tagname: tag html a ser usada
  textalign: css de alinhamento
  fields: sub componentes
  active: usado para indicar se um atributo padrão de um elemento composto deve ser usado ou não
  options: lista de valores padrões para radio, checkbox e select
  isFocused: usado apenas no editor de formulários
  hidden: Indica se o componente deve ficar oculto no sistema gerado
  subheader: descrição adicional do campo, exibida no sistema gerado
  column: Nome da coluna onde será salvo
  table: Nome da databela onde a composição ou agregação será persistida
  referencedSchema: Nome do schema ao qual pertence a tabela referenciada em um autocomplete
  referencedTable: Nome da tabela referenciada em um autocomplete
  referencedColumn: Nome das colunas que compõem a foreign key em um autocomplete
  referencedDescribeColumn: Nome da coluna que será usada como descritor em um autocomplete
  referencedEntity: Nome da entidade referenciada em um relacionamento
*/

const ELEMENTS = {
  header: {
    name: 'header',
    label: 'Título',
    type: 'header',
    tagname: 'h1',
    textalign: 'text-left',
    icon: 'bi-type',
    cols: 12,
    fields: []
  },
  address: {
    name: 'address',
    label: 'Endereço',
    type: 'address',
    icon: 'bi-geo-alt',
    cols: 12,
    fields: [
      {
        name: 'titulo',
        label: 'Endereço',
        type: 'header',
        tagname: 'h1',
        textalign: 'text-left',
        cols: 12,
        fields: [],
        active: true
      },
      {
        name: 'cep',
        label: 'CEP',
        type: 'input',
        placeholder: 'CEP',
        cols: 4,
        active: true
      },
      {
        name: 'logradouro',
        label: 'Logradouro',
        type: 'input',
        placeholder: 'Logradouro',
        cols: 8,
        active: true
      },
      {
        name: 'bairro',
        label: 'Bairro',
        type: 'input',
        placeholder: 'Bairro',
        cols: 5,
        active: true
      },
      {
        name: 'municipio',
        label: 'Município',
        type: 'input',
        placeholder: 'municipio',
        cols: 5,
        active: true
      },
      {
        name: 'uf',
        label: 'UF',
        type: 'input',
        placeholder: 'uf',
        cols: 2,
        active: true
      },
      {
        name: 'pais',
        label: 'País',
        type: 'input',
        placeholder: 'pais',
        cols: 6,
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
    cols: 12,
    fields: []
  },
  checkbox: {
    name: 'checkbox',
    label: 'Caixa de marcação',
    type: 'checkbox',
    tagname: 'input',
    options: 'Opção 1\nOpção 2\nOpção 3',
    icon: 'bi-ui-checks',
    cols: 12,
    fields: []
  },
  radiobutton: {
    name: 'radiobutton',
    label: 'Caixa de seleção',
    type: 'radiobutton',
    tagname: 'input',
    options: 'Opção 1\nOpção 2\nOpção 3',
    icon: 'bi-ui-radios',
    cols: 12,
    fields: []
  },
  select: {
    name: 'select',
    label: 'Lista suspensa',
    type: 'select',
    tagname: 'select',
    options: 'Opção 1\nOpção 2\nOpção 3',
    icon: 'bi-menu-button-fill',
    cols: 12,
    fields: []
  },
  grid: {
    name: 'grid',
    label: 'Grid',
    type: 'grid',
    icon: 'bi-layout-three-columns',
    cols: 12,
    fields: []
  },
  table: {
    name: 'table',
    label: 'Tabela',
    type: 'table',
    icon: 'bi-table',
    cols: 12,
    fields: []
  },
  relationship: {
    name: 'relationship',
    label: 'Relacionamento',
    type: 'relationship',
    widgetType: 'select',
    icon: 'bi-link-45deg',
    cols: 12,
    fields: []
  }
}

const selectedField = ref({})

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
  const parent = _.get(props.screen, parentRef)
  parent.splice(parent.indexOf(field), 1)
}

function receiveElement(element, newIndex, propRef) {
  const parent = _.get(props.screen, propRef)
  console.log(propRef)
  console.log(props.screen)
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
    opamunicipio: 0.7,
    cancel: '.cancel-drag',
    delay: 150,
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
    //     const parent = _.get(props.screen, propRef);
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
    selectedField.value = {}
  }
}

function addNewSubField(field, options) {
  if (!field.fields) {
    field.fields = []
  }

  const newSubfield = _.cloneDeep(ELEMENTS.input)
  Object.assign(newSubfield, options)
  field.fields.push(newSubfield)
}
</script>
