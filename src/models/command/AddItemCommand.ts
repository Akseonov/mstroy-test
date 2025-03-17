import type { TreeStore } from "@src/models/tree-store/TreeStore.ts";

export class AddItemCommand implements Command {
  private treeStore: TreeStore;
  private item: TreeStoreItem;

  constructor(treeStore: TreeStore, item: TreeStoreItem) {
    this.treeStore = treeStore;
    this.item = item;
  }

  execute(): void {
    this.treeStore.addItemToItems(this.item);
    this.treeStore.addItemToItemsMap(this.item);
    this.treeStore.addItemToChildrenMap(this.item);
  }

  undo(): void {
    this.treeStore.removeItemFromItems(this.item.id);
  }
}
