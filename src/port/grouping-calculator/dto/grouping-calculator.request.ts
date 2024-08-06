import { GenericItem } from "../../../domain/grouping-calculator/generic-item";
import { GroupingConfiguration } from "../../../domain/grouping-calculator/grouping-configuration";

export class GroupingCalculatorRequest {
  items: GenericItem[];
  config: GroupingConfiguration;
  constructor(items: GenericItem[], config: GroupingConfiguration) {
    this.items = items;
    this.config = config;
  }
}
