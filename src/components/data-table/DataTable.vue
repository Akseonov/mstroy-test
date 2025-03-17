<script setup lang="ts">
import { ref } from "vue";
import { AgGridVue } from "ag-grid-vue3";
import {
  AllCommunityModule,
  ModuleRegistry,
  type ValueGetterParams,
} from "ag-grid-community";

// Register all Community features
ModuleRegistry.registerModules([AllCommunityModule]);

// Row Data: The data to be displayed.
const rowData = ref<TreeStoreItem[]>([
  { id: 1, parent: null, label: "Айтем 1" },
  { id: "2", parent: 1, label: "Айтем 2" },
  { id: 3, parent: 1, label: "Айтем 3" },
  { id: 4, parent: "2", label: "Айтем 4" },
  { id: 5, parent: "2", label: "Айтем 5" },
  { id: 6, parent: "2", label: "Айтем 6" },
  { id: 7, parent: 4, label: "Айтем 7" },
  { id: 8, parent: 4, label: "Айтем 8" },
]);

// Column Definitions: Defines the columns to be displayed.
const colDefs = ref([
  {
    field: "id",
    headerName: "№ п/п",
    valueGetter: (p: ValueGetterParams) => {
      console.log(p);
      return +p.data.id;
    },
  },
  {
    field: "category",
    headerName: "Категория",
    valueGetter: (p: ValueGetterParams) => p.data.make + " " + p.data.model,
  },
  { field: "label", headerName: "Наименование" },
]);
</script>

<template>
  <div style="height: 100%; display: flex; flex-direction: column">
    <p style="flex: 0 1 0%">Theme:</p>
    <div style="flex: 1 1 0%">
      <AgGridVue
        :row-data="rowData"
        :column-defs="colDefs"
        style="height: 100%"
      >
      </AgGridVue>
    </div>
  </div>
</template>

<style scoped lang="scss"></style>
