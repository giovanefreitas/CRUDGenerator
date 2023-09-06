<script setup></script>
<template>
  <div class="element-properties">
    <div v-if="!selectedField.type" class="element-main-header">Propriedades da Tela</div>
    <div v-if="!selectedField.type" class="element-property">
      <div class="form-group">
        <label>Nome (identificador válido)</label>
        <input type="text" class="form-control" v-model="screen.name" />
      </div>
      <div class="form-group">
        <label>Título</label>
        <input type="text" class="form-control" v-model="screen.title" />
      </div>
      <div class="form-group">
        <label>Texto do menu</label>
        <input type="text" class="form-control" v-model="screen.menuLabel" />
      </div>
      <div class="form-group">
        <label for="referencedEntity" class="mb-3">Entidade manipulada</label>
        <Dropdown
          id="referencedEntity"
          class="w-100"
          v-model="screen.referencedEntity"
          :options="entityList"
          optionLabel="name"
          placeholder="Criar uma nova entidade"
        >
        </Dropdown>
      </div>
    </div>

    <div v-if="selectedField.type" class="element-main-header">Propriedades do campo</div>
    <div v-if="selectedField.type === 'header'" class="element-property">
      <div class="form-group">
        <label>Título</label>
        <input type="text" class="form-control" v-model="selectedField.label" />
      </div>
    </div>
    <div v-if="selectedField.type" class="element-property">
      <div class="form-group">
        <label>Largura da coluna</label>
        <input type="number" class="form-control" v-model="selectedField.cols" min="1" max="12" />
      </div>
    </div>
    <div
      v-if="selectedField.type && selectedField.type !== 'header' && selectedField.type !== 'grid'"
      class="element-property"
    >
      <div class="form-group">
        <label>Atributo</label>
        <div class="input-group mb-3">
          <input
            type="text"
            class="form-control"
            placeholder="Selecione um atributo"
            aria-label="Selecione um atributo"
            aria-describedby="button-addon2"
            disabled
          />
          <button
            class="btn btn-outline-secondary"
            type="button"
            id="button-addon2"
            data-bs-toggle="modal"
            data-bs-target="#entityEditor"
          >
            <i class="bi bi-search"></i>
          </button>
        </div>
      </div>
      <div class="form-group">
        <label>Rótulo</label>
        <input type="text" class="form-control" v-model="selectedField.label" />
      </div>
      <div v-if="selectedField.type == 'relationship'" class="form-group">
        <label>Tipo de entrada</label>
        <select class="form-select" v-model="selectedField.widgetType">
          <option value="select">Lista suspensa</option>
          <option value="autocomplete">Caixa de entrada com busca dinâmica</option>
        </select>
      </div>
      <div v-if="selectedField.type == 'relationship'" class="form-group">
        <label>Entidade referenciada</label>
        <input
          type="text"
          class="form-control"
          v-model="selectedField.attribute.referencedEntity"
        />
      </div>
    </div>
    <div v-if="selectedField.type === 'table' && selectedField.attribute" class="element-property">
      <div class="form-group">
        <label>Entidade</label>
        <input type="text" class="form-control" v-model="selectedField.attribute.entity" />
      </div>
      <button
        type="button"
        class="btn btn-primary"
        data-bs-toggle="modal"
        data-bs-target="#tableEditor"
      >
        Editar tabela
      </button>
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
        selectedField.type === 'checkbox' ||
        selectedField.type === 'radiobutton' ||
        selectedField.type === 'select'
      "
      class="element-property"
    >
      <div class="form-group">
        <label>Opções</label>
        <textarea class="form-control" rows="5" v-model="selectedField.options"></textarea>
      </div>
    </div>

    <div v-if="selectedField.type" class="element-property">
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

    <!-- Modal de Tabela -->
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

    <!-- Modal de Atributos -->
    <div
      v-if="screen.referencedEntity"
      class="modal fade"
      id="entityEditor"
      tabindex="-1"
      aria-labelledby="entityEditorLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-xl">
        <div class="modal-content w-100">
          <div class="modal-header">
            <h1 class="modal-title fs-5" id="entityEditorLabel">
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
            <AttributesTable :fields="screen.referencedEntity.properties" />
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-primary" data-bs-dismiss="modal">Fechar</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import Dropdown from 'primevue/dropdown'
import AttributesTable from './AttributesTable.vue'

defineProps({
  selectedField: { type: Object, required: true },
  screen: { type: Object, required: true },
  entityList: { type: Array, requied: true }
})
</script>
