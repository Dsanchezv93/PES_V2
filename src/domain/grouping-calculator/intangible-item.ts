import { ProductClassification, SellerType } from "../enums";
import { GenericItem } from "./generic-item";

export class IntangibleItem extends GenericItem {
  constructor(itemId: string, sellerType: SellerType, sellerName: string, productClassification: ProductClassification) {
    super(itemId, sellerType, sellerName, productClassification);
  }
}
