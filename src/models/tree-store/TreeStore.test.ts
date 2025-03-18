import { TreeStore } from "./TreeStore";
import { test, expect, describe, beforeEach } from "vitest";

describe("Tree State get data tests", () => {
  const items = [
    { id: 1, parent: null, label: "Айтем 1" },
    { id: "2", parent: 1, label: "Айтем 2" },
    { id: 3, parent: 1, label: "Айтем 3" },
    { id: 4, parent: "2", label: "Айтем 4" },
    { id: 5, parent: "2", label: "Айтем 5" },
    { id: 6, parent: "2", label: "Айтем 6" },
    { id: 7, parent: 4, label: "Айтем 7" },
    { id: 8, parent: 4, label: "Айтем 8" },
  ];

  const treeStore = new TreeStore(items);

  test("getAll returns all items", () => {
    expect(treeStore.getAll()).toEqual(items);
  });

  test("getItem returns correct item", () => {
    expect(treeStore.getItem(1)).toEqual(items[0]);
  });

  test("getChildren returns correct children", () => {
    expect(treeStore.getChildren(1)).toEqual([items[1], items[2]]);
  });

  test("getAllChildren returns all nested children", () => {
    expect(treeStore.getAllChildren(1).sort((a, b) => +a.id - +b.id)).toEqual(
        items.slice(1).sort((a, b) => +a.id - +b.id),
    );
  });

  test("getAllParents returns correct parent chain", () => {
    expect(treeStore.getAllParents(7)).toEqual([items[3], items[1], items[0]]);
  });
});

describe("Tree State change data tests", () => {
  let treeStore: TreeStore;

  beforeEach(async () => {
    const items = [
      { id: 1, parent: null, label: "Айтем 1" },
      { id: "2", parent: 1, label: "Айтем 2" },
      { id: 3, parent: 1, label: "Айтем 3" },
      { id: 4, parent: "2", label: "Айтем 4" },
      { id: 5, parent: "2", label: "Айтем 5" },
      { id: 6, parent: "2", label: "Айтем 6" },
      { id: 7, parent: 4, label: "Айтем 7" },
      { id: 8, parent: 4, label: "Айтем 8" },
    ];

    treeStore = new TreeStore(items);
  });

  test("addItemToItems add new item to array", () => {
    const newItem = {
      id: 11,
      parent: 1,
      label: "",
    };

    treeStore.addItemToItems(newItem)

    expect(treeStore.getAll().includes(newItem)).toEqual(true);
  });

  test("removeItemFromItems remove all data from array", () => {
    treeStore.removeItemFromItems(1);

    expect(treeStore.getAll().length === 0).toEqual(true);
  });

  test("removeItemFromItems remove part of a data from array", () => {
    treeStore.removeItemFromItems("2");

    expect(treeStore.getAll().length === 2).toEqual(true);
    expect(treeStore.getAll()[1].id === 3).toEqual(true);
  });

  test("updateItemToItems update a selected item", () => {
    const newItem = {
      id: 3,
      parent: 1,
      label: "Айтем 18",
    };

    treeStore.updateItemToItems(newItem);

    expect(treeStore.getAll()[2].label).toEqual(newItem.label);
  });
});
