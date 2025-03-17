import { AddItemCommand } from "@src/models/command/AddItemCommand.ts";
import { RemoveItemCommand } from "@src/models/command/RemoveItemCommand.ts";
import { UpdateItemCommand } from "@src/models/command/UpdateItemCommand.ts";

export class TreeStore {
  private items: TreeStoreItem[];
  private itemsMap: Map<number | string, TreeStoreItem>;
  private childrenMap: Map<number | string, TreeStoreItem[]>;
  private maxId: number;
  private history: Command[] = [];
  private currentHistoryIndex: number = -1;

  constructor(items: TreeStoreItem[]) {
    this.items = items;
    this.itemsMap = new Map();
    this.childrenMap = new Map();
    this.maxId = 0;

    items.forEach((item: TreeStoreItem) => {
      this.itemsMap.set(item.id, item);
      if (!this.childrenMap.has(item.parent ?? 0)) {
        this.childrenMap.set(item.parent ?? 0, []);
      }
      this.childrenMap.get(item.parent ?? 0)?.push(item);

      if (+item.id > this.maxId) {
        this.maxId = +item.id;
      }
    });
  }

  /**
   * Возвращает изначальный массив элементов.
   */
  public getAll(): TreeStoreItem[] {
    return this.items;
  }

  /**
   * Принимает id и возвращает сам объект элемента.
   * @param id {DataId} - id элемента
   */
  public getItem(id: DataId | null): TreeStoreItem | undefined {
    if (id) {
      return this.itemsMap.get(id);
    }
  }

  /**
   * Принимает id и возвращает массив элементов, являющихся дочерними для того
   * элемента, чей id получен в аргументе. Если у элемента нет дочерних,
   * то возвращается пустой массив.
   * @param id {DataId} - id элемента
   */
  public getChildren(id: DataId): TreeStoreItem[] {
    return this.childrenMap.get(id) || [];
  }

  /**
   * Принимает id и возвращает массив элементов, являющихся прямыми дочерними того,
   * чей id получен в аргументе + если у него есть дочерние элементы, то они тоже будут
   * включены в результат и так до самого глубокого уровня.
   * Если у элемента нет дочерних, то возвращается пустой массив.
   * @param id {DataId} - id элемента
   */
  public getAllChildren(id: DataId): TreeStoreItem[] {
    const result: TreeStoreItem[] = [];
    const stack: TreeStoreItem[] = this.getChildren(id);

    while (stack.length > 0) {
      const current = stack.pop()!;
      result.push(current);
      stack.push(...this.getChildren(current.id));
    }

    return result;
  }

  /**
   * Принимает id и возвращает массив из цепочки родительских элементов, начиная от
   * самого элемента, чей id был передан в аргументе и до корневого элемента,
   * т.е. должен получиться путь элемента наверх дерева через цепочку родителей
   * к корню дерева. Порядок элементов Важен!!!
   * @param id
   */
  public getAllParents(id: DataId): TreeStoreItem[] {
    const result: TreeStoreItem[] = [];
    let current = this.itemsMap.get(id);

    while (current && current.parent !== null) {
      current = this.itemsMap.get(current.parent);
      if (current) {
        result.unshift(current);
      }
    }

    return result;
  }

  public addItemToItems(item: TreeStoreItem) {
    this.items.push(item);
  }

  public addItemToItemsMap(item: TreeStoreItem) {
    this.itemsMap.set(item.id, item);
  }

  public addItemToChildrenMap(item: TreeStoreItem) {
    if (!this.childrenMap.has(item.parent!)) {
      this.childrenMap.set(item.parent!, []);
    }
    this.childrenMap.get(item.parent!)?.push(item);
  }

  public removeItemFromItems(id: DataId) {
    const itemsToRemove = this.getAllChildren(id);
    itemsToRemove.push(this.itemsMap.get(id)!);

    itemsToRemove.forEach((item) => {
      this.removeItemFromItemsMap(item);
      this.removeItemFromChildrenMap(item);
    });

    this.items = this.items.filter((item) => !itemsToRemove.includes(item));

    return itemsToRemove;
  }

  public removeItemFromItemsMap(item: TreeStoreItem) {
    this.itemsMap.delete(item.id);
  }

  public removeItemFromChildrenMap(item: TreeStoreItem) {
    const siblings = this.childrenMap.get(item.parent ?? 0) || [];
    const index = siblings.findIndex((sibling) => sibling.id === item.id);
    if (index !== -1) {
      siblings.splice(index, 1);
    }
  }

  public updateItemToItems(updatedItem: TreeStoreItem) {
    const existingItem = this.itemsMap.get(updatedItem.id);
    if (existingItem) {
      Object.assign(existingItem, updatedItem);
    }
  }

  /**
   * Принимает объект нового элемента и добавляет его в общую структуру хранилища.
   */
  public addItem(item: Pick<TreeStoreItem, "parent">): void {
    const command = new AddItemCommand(this, {
      ...item,
      id: ++this.maxId,
      label: `Айтем ${this.maxId}`,
    });
    command.execute();
    this.addToHistory(command);
  }

  /**
   * Принимает id элемента и удаляет соответствующий элемент и все его дочерние
   * элементы из хранилища.
   * @param id
   */
  public removeItem(id: DataId): void {
    const command = new RemoveItemCommand(this, id);
    command.execute();
    this.addToHistory(command);
  }

  /**
   * Принимает объект обновленного айтема и актуализирует этот айтем в хранилище
   */
  public updateItem(updatedItem: TreeStoreItem, oldItem: TreeStoreItem) {
    const command = new UpdateItemCommand(this, updatedItem, oldItem);
    command.execute();
    this.addToHistory(command);
  }

  private addToHistory(command: Command): void {
    this.history = this.history.slice(0, this.currentHistoryIndex + 1);
    this.history.push(command);
    this.currentHistoryIndex++;
  }

  public undo(): void {
    if (this.currentHistoryIndex >= 0) {
      const command = this.history[this.currentHistoryIndex];
      command.undo();
      this.currentHistoryIndex--;
    }
  }

  public redo(): void {
    if (this.currentHistoryIndex < this.history.length - 1) {
      this.currentHistoryIndex++;
      const command = this.history[this.currentHistoryIndex];
      command.execute();
    }
  }
}
