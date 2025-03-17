import { TreeStore } from "@src/models/tree-store/TreeStore.ts";

let treeStore: TreeStore;

export function useTreeStore() {
  function createTreeStore(items: TreeStoreItem[]) {
    treeStore = new TreeStore(items);
  }

  return {
    treeStore,

    createTreeStore,
  };
}
