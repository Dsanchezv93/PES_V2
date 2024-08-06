import { ProductClassification, SellerType } from "../enums";

export abstract class GenericItem {
  itemId: string;
  sellerType: SellerType;
  sellerName: string;
  productClassification: ProductClassification;
  classificationGroup?: string;

  constructor(itemId: string, sellerType: SellerType, sellerName: string, productClassification: ProductClassification) {
    this.itemId = itemId;
    this.sellerType = sellerType;
    this.sellerName = sellerName;
    this.productClassification = productClassification;
  }
}
