import type { TreeStore } from "@src/models/tree-store/TreeStore.ts";

export class RemoveItemCommand implements Command {
  private treeStore: TreeStore;
  private id: DataId;
  private deletedItems: TreeStoreItem[] = [];

  constructor(treeStore: TreeStore, id: DataId) {
    this.treeStore = treeStore;
    this.id = id;
  }

  execute(): void {
    this.deletedItems = this.treeStore.removeItemFromItems(this.id);
  }

  undo(): void {
    this.deletedItems.forEach((item) => {
      this.treeStore.addItemToItems(item);
      this.treeStore.addItemToItemsMap(item);
      this.treeStore.addItemToChildrenMap(item);
    });
  }
}
