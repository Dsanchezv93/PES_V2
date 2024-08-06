import { ProductClassification } from "../../enums";
import { GenericGroupIndex } from "../grouping-configuration";
import { IntangibleItem } from "../intangible-item";
import { GenericRule } from "./genric-rule";

export class IntangibleRule extends GenericRule {
  matches(item: IntangibleItem): boolean {
    return item.productClassification === ProductClassification.Intangible;
  }

  process(item: IntangibleItem): GenericGroupIndex {
    return {
      sellerTypeIndex: item.sellerType,
      sellerNameIndex: item.sellerName,
      productClassificationIndex: item.productClassification,
    };
  }

  tag(item: IntangibleItem, indexes: GenericGroupIndex): void {
    const firstTagForProductAtt: string = `${indexes.sellerTypeIndex}-${indexes.sellerNameIndex}-${indexes.productClassificationIndex}`;
    item.classificationGroup = firstTagForProductAtt;
  }
}
