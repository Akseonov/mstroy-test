type DataId = number | string;
type Parent = number | string | null;

interface TreeStoreItem {
  id: DataId;
  parent: Parent;
  label: string;
}
