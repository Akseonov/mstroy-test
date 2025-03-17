<script setup lang="ts">
import DataTable from "@src/components/data-table/DataTable.vue";
import { useTreeStore } from "@src/composbles/useTreeStore.ts";

const { createTreeStore } = useTreeStore();

// createTreeStore([
//   { id: 1, parent: null, label: "Айтем 1" },
//   { id: "2", parent: 1, label: "Айтем 2" },
//   { id: 3, parent: 1, label: "Айтем 3" },
//   { id: 4, parent: "2", label: "Айтем 4" },
//   { id: 5, parent: "2", label: "Айтем 5" },
//   { id: 6, parent: "2", label: "Айтем 6" },
//   { id: 7, parent: 4, label: "Айтем 7" },
//   { id: 8, parent: 4, label: "Айтем 8" },
//   // { id: 12, parent: null, label: "Айтем 9" },
//   // { id: 15, parent: "2", label: "Айтем 12" },
//   // { id: 18, parent: 12, label: "Айтем 13" },
//   // { id: 20, parent: 5, label: "Айтем 14" },
// ]);

createTreeStore([
  { id: 5, parent: "2", label: "Айтем 5" },
  { id: 1, parent: null, label: "Айтем 1" },
  { id: "2", parent: 1, label: "Айтем 2" },
  { id: 3, parent: 1, label: "Айтем 3" },
  { id: 4, parent: "2", label: "Айтем 4" },
  { id: 6, parent: "2", label: "Айтем 6" },
  { id: 7, parent: 4, label: "Айтем 7" },
  { id: 8, parent: 4, label: "Айтем 8" },
  // { id: 12, parent: null, label: "Айтем 9" },
  // { id: 15, parent: "2", label: "Айтем 12" },
  // { id: 18, parent: 12, label: "Айтем 13" },
  // { id: 20, parent: 5, label: "Айтем 14" },
]);
</script>

<template>
  <DataTable />
</template>

<style scoped></style>
