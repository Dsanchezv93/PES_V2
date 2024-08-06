import { Item } from "../../domain/grouping-calculator/item";

export class PromiseEngineResponse {
  items: Item[];
  constructor(items: Item[]) {
    this.items = items;
  }
}
