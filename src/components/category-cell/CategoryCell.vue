<script setup lang="ts">
import { type ICellRendererParams } from "ag-grid-enterprise";
import { computed, onMounted, ref } from "vue";

import CloseIcon from "@assets/svg/close.svg?component";
import { useTreeStore } from "@src/composbles/useTreeStore.ts";

const { treeStore } = useTreeStore();

const props = defineProps<{
  params: ICellRendererParams<TreeStoreItem>;
}>();

const expanded = ref(false);

const setRowNodeExpanded = () => {
  expanded.value = !props.params.node.expanded;
  props.params.api.setRowNodeExpanded(
    props.params.node,
    !props.params.node.expanded,
  );
};

const addItem = () => {
  treeStore.addItem({
    parent: props.params.data.id,
  });
  props.params.api.setGridOption("rowData", treeStore.getAll());
  props.params.api.refreshCells({
    force: true,
  });
};

const removeItem = () => {
  treeStore.removeItem(props.params.data.id);
  props.params.api.setGridOption("rowData", treeStore.getAll());
  props.params.api.refreshCells({
    force: true,
  });
};

const iconClass = computed(() => [
  "ag-group-expanded category-cell_arrow",
  {
    "category-cell_arrow__close": !expanded.value,
  },
]);

const classLabel = computed(() => [
  "ag-group-value category-cell_label",
  {
    "text-bold": props.params.node.allChildrenCount,
  },
]);

const editable = computed(() => props.params.editable);

onMounted(() => {
  expanded.value = props.params.node.expanded;
  props.params.api.refreshCells();
});
</script>

<template>
  <div
    class="category-cell ag-cell-wrapper ag-cell-expandable ag-row-group ag-row-group-indent-1"
  >
    <div>
      <span
        v-show="params.node.allChildrenCount"
        data-ref="eExpanded"
        :class="iconClass"
      >
        <span
          class="ag-icon ag-icon-tree-open"
          unselectable="on"
          role="presentation"
          @click="setRowNodeExpanded"
        />
      </span>
      <span
        :class="classLabel"
        data-ref="eValue"
        :style="`--ag-indentation-level: ${params.node.level}`"
      >
        {{ params.value }}
      </span>
    </div>
    <div v-show="editable" class="category-cell_edit">
      <button
        class="category-cell_button category-cell_button__create"
        @click="addItem"
      >
        <CloseIcon />
      </button>
      <button
        class="category-cell_button category-cell_button__remove"
        @click="removeItem"
      >
        <CloseIcon />
      </button>
    </div>
  </div>
</template>

<style lang="scss" src="./category-cell.scss"></style>
