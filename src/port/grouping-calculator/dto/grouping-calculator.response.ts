import { GenericItem } from "../../../domain/grouping-calculator/generic-item";

export class GroupingCalculatorResponse {
  items: GenericItem[];
  constructor(items: GenericItem[]) {
    this.items = items;
  }
}
