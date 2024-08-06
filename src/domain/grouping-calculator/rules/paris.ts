import { ProductClassification, SellerType } from "../../enums";
import { GroupIndexes } from "../grouping-configuration";
import { Item } from "../item";
import { GenericRegularRule } from "./genric-regular-rule";

export class ParisRule extends GenericRegularRule {
  matches(item: Item) {
    const isParis: boolean = item.sellerType === SellerType.Paris;
    const isRegular: boolean = item.productClassification === ProductClassification.Regular;

    if (isParis && isRegular) {
      return true;
    }

    return false;
  }

  tag(item: Item, indexes: GroupIndexes) {
    const shippingSubType = indexes.shippingSubTypeIndex ? indexes.shippingSubTypeIndex + "-" : "";
    const firstTagForProductAtt: string = `${indexes.sellerTypeIndex}-${indexes.sellerNameIndex}-${indexes.productClassificationIndex}`;
    const secondTagForShmAtt: string = `${indexes.nodeCodeIndex}-${indexes.shippingMethodIndex}-${indexes.shippingTypeIndex}-${shippingSubType}`;
    const thirdTagForOptShmAtt: string = `${indexes.deliveryDateFromIndex}-${indexes.deliveryDateToIndex}-${indexes.timeSlotIndex}`;
    item.classificationGroup = `${firstTagForProductAtt}-${secondTagForShmAtt}${thirdTagForOptShmAtt}`;
  }
}
