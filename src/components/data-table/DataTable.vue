<script setup lang="ts">
import { computed, ref, shallowRef } from "vue";
import { AgGridVue } from "ag-grid-vue3";
import {
  ClientSideRowModelModule,
  ModuleRegistry,
  ValidationModule,
  ColumnAutoSizeModule,
  TextEditorModule,
  RenderApiModule,
  ColumnApiModule,
  CellStyleModule,
  themeAlpine,
  type ValueGetterParams,
  type GridReadyEvent,
  type CellChangedEvent,
  type CellClassParams,
} from "ag-grid-community";
import {
  type GetRowIdParams,
  TreeDataModule,
  PivotModule,
  type ColDef,
  type GridApi,
} from "ag-grid-enterprise";

import CategoryCell from "@src/components/category-cell/CategoryCell.vue";
import { useTreeStore } from "@src/composbles/useTreeStore.ts";
import ArrowLeftIcon from "@assets/svg/arrow-left.svg?component";

ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  ValidationModule,
  ColumnAutoSizeModule,
  TreeDataModule,
  TextEditorModule,
  RenderApiModule,
  PivotModule,
  ColumnApiModule,
  CellStyleModule,
]);

const gridApi = shallowRef<GridApi<TreeStoreItem> | null>(null);

const { treeStore } = useTreeStore();

const rowData = ref(treeStore.getAll());
const editMode = ref(false);

const myTheme = themeAlpine.withParams({
  headerColumnBorderHeight: "100%",
  headerColumnBorder: { color: "rgba(24, 26, 31, 0.15)", width: 1 },
});

const colDefs = ref<ColDef>([
  {
    field: "index",
    headerName: "№ п\\п",
    valueGetter: (params: ValueGetterParams) => params.node!.rowIndex! + 1,
    lockPosition: "left",
    width: 80,
    maxWidth: 80,
    cellClass: "text-bold",
    resizable: false,
  },
  {
    field: "label",
    headerName: "Наименование",
    editable: editMode,
    cellClass: (params: CellClassParams) => {
      return params.node.allChildrenCount ? "text-bold" : "";
    },
    resizable: false,
  },
]);

const autoGroupColumnDef = ref<ColDef>({
  minWidth: 200,
  cellRendererParams: {
    suppressCount: true,
    editable: editMode,
  },
  headerName: "Категория",
  valueGetter: (params: ValueGetterParams) =>
    treeStore.getChildren(params.data.id).length > 0 ? "Группа" : "Элемент",
  cellRenderer: CategoryCell,
  resizable: false,
});

const getDataPath = (data: TreeStoreItem) => {
  const path = [data.label];
  let parent = treeStore.getItem(data.parent);
  while (parent) {
    path.unshift(parent.label);
    parent = treeStore.getItem(parent.parent);
  }
  return path;
};

const toggleEditMode = () => {
  editMode.value = !editMode.value;
  colDefs.value[1].editable = editMode.value;
};

const editModeLabel = computed(() =>
  editMode.value ? "Режим: просмотр" : "Режим: редактирование",
);

const onGridReady = (event: GridReadyEvent) => {
  event.api.sizeColumnsToFit();
  gridApi.value = event.api;
};

const onCellValueChanged = (event: CellChangedEvent<string>) => {
  treeStore.updateItem(
    { ...event.data, label: event.newValue },
    { ...event.data, label: event.oldValue },
  );
  gridApi.value!.setGridOption("rowData", treeStore.getAll());
  gridApi.value!.refreshCells({
    force: true,
  });
};

const getRowId = (params: GetRowIdParams) => `${params.data.id}`;

const undo = async () => {
  treeStore.undo();
  gridApi.value!.setGridOption("rowData", treeStore.getAll());
  gridApi.value!.refreshCells({
    force: true,
  });
};

const redo = async () => {
  treeStore.redo();
  gridApi.value!.setGridOption("rowData", treeStore.getAll());
  gridApi.value!.refreshCells({
    force: true,
  });
};

defineExpose({
  CategoryCell,
});
</script>

<template>
  <div class="data-table">
    <div class="data-table_buttons">
      <button class="edit-button" @click="toggleEditMode">
        {{ editModeLabel }}
      </button>
      <button v-if="editMode" class="history-button" @click="undo">
        <ArrowLeftIcon />
      </button>
      <button
        v-if="editMode"
        class="history-button history-button__right"
        @click="redo"
      >
        <ArrowLeftIcon />
      </button>
    </div>
    <AgGridVue
      tree-data
      :get-data-path="getDataPath"
      :row-data="rowData"
      :column-defs="colDefs"
      :auto-group-column-def="autoGroupColumnDef"
      :group-default-expanded="-1"
      :get-row-id="getRowId"
      :theme="myTheme"
      style="width: 100%; height: 100%"
      @grid-ready="onGridReady"
      @cell-value-changed="onCellValueChanged"
    />
  </div>
</template>

<style lang="scss">
:where(.ag-ltr) .ag-header-cell:last-child:after {
  border-right: none;
}

.ag-layout-normal {
  height: 100% !important;
}

.data-table {
  --ag-header-column-resize-handle-height: 100%;
  --ag-wrapper-border: none;
  --ag-header-column-resize-handle-width: 1px;
}

.data-table_buttons {
  display: flex;
  margin-bottom: 20px;
  height: 20px;
  align-items: center;
}

.edit-button {
  color: #2180ed;
  padding: 0;
  border: none;
  background-color: transparent;
  font-size: 12px;
  font-weight: 400;
  margin-right: 20px;

  &:hover {
    color: rgba(33, 128, 237, 0.85);
  }
}

.history-button {
  color: #2180ed;
  padding: 0;
  border: none;
  background-color: transparent;
  width: 20px;
  height: 20px;

  &__right {
    transform: rotate(180deg);
  }

  &:hover {
    color: rgba(33, 128, 237, 0.85);
  }
}
</style>
