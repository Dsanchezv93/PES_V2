import { GenericItem } from "../generic-item";
import { GenericGroupIndex, GroupingConfiguration } from "../grouping-configuration";

export abstract class GenericRule {
  abstract matches(input: GenericItem, config?: GroupingConfiguration): boolean;
  abstract process(input: GenericItem, config?: GroupingConfiguration): GenericGroupIndex;
  abstract tag(input: GenericItem, indexes: GenericGroupIndex): void;

  apply(input: GenericItem, config?: GroupingConfiguration): void {
    if (input.classificationGroup) {
      throw new Error("Item already has a group");
    }

    const resultIndexes = this.process(input, config);
    this.tag(input, resultIndexes);
  }
}
