import type { TreeStore } from "@src/models/tree-store/TreeStore.ts";

export class UpdateItemCommand implements Command {
  private treeStore: TreeStore;
  private updatedItem: TreeStoreItem;
  private previousItem: TreeStoreItem | undefined;

  constructor(
    treeStore: TreeStore,
    updatedItem: TreeStoreItem,
    oldItem: TreeStoreItem,
  ) {
    this.treeStore = treeStore;
    this.updatedItem = structuredClone(updatedItem);
    this.previousItem = structuredClone(oldItem);
  }

  execute(): void {
    if (this.updatedItem) {
      this.treeStore.updateItemToItems(this.updatedItem);
    }
  }

  undo(): void {
    if (this.previousItem) {
      this.treeStore.updateItemToItems(this.previousItem);
    }
  }
}
