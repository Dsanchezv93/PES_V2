import { ShippingMethod, ShippingSubType, ShippingType } from "./enums";

export interface Presale {
  date: string;
}

export interface Marketplace {
  isMarketplace: boolean;
}

export interface Slot {
  name: string;
  deliveryTimeStart: string;
  deliveryTimeEnd: string;
}

export class ShippingOption {
  shippingType: ShippingType;
  shippingMethod: ShippingMethod;
  shippingSubType?: ShippingSubType;
  options: ShippingSubOption[];

  constructor(shippingType: ShippingType, shippingMethod: ShippingMethod, shippingSubType: ShippingSubType, options: ShippingSubOption[]) {
    this.shippingType = shippingType;
    this.shippingMethod = shippingMethod;
    this.shippingSubType = shippingSubType;
    this.options = options;
  }
}

export class ShippingSubOption {
  timeSlot: Slot[];
  deliveryDateFrom: string;
  deliveryDateTo: string;
  shipDate: string;
  nodeCode: string;

  constructor(timeSlot: Slot[], deliveryDateFrom: string, deliveryDateTo: string, shipDate: string, nodeCode: string) {
    this.timeSlot = timeSlot;
    this.deliveryDateFrom = deliveryDateFrom;
    this.deliveryDateTo = deliveryDateTo;
    this.shipDate = shipDate;
    this.nodeCode = nodeCode;
  }
}
