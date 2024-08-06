import { ProductClassification, SellerType } from "../enums";
import { Marketplace, Presale, ShippingOption } from "../types";
import { GenericItem } from "./generic-item";

export class Item extends GenericItem {
  shippingMethodOptions: ShippingOption[];
  marketplace?: Marketplace;
  presale?: Presale;

  constructor(
    itemId: string,
    sellerType: SellerType,
    sellerName: string,
    productClassifcation: ProductClassification,
    shippingMethodOptions: ShippingOption[],
    marketplace?: Marketplace,
    presale?: Presale,
  ) {
    super(itemId, sellerType, sellerName, productClassifcation);
    this.shippingMethodOptions = shippingMethodOptions;
    if (marketplace) this.marketplace = marketplace;
    if (presale) this.presale = presale;
  }
}
