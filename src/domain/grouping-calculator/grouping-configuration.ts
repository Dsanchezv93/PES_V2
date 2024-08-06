import { ShippingMethod, ShippingSubType, ShippingType } from "../enums";

export interface GroupingPriority {
  shippingType: ShippingType;
  shippingMethod: ShippingMethod;
  shippingSubType?: ShippingSubType;
  deliveryDateFrom?: string;
  deliveryDateTo?: string;
  nodeCode?: string;
  timeSlot?: string;
}

export interface GenericGroupIndex {
  sellerTypeIndex: string;
  sellerNameIndex: string;
  productClassificationIndex: string;
}

export interface GroupIndexes extends GenericGroupIndex {
  shippingTypeIndex: string;
  shippingMethodIndex: string;
  shippingSubTypeIndex?: string | undefined;
  nodeCodeIndex?: string;
  timeSlotIndex?: string;
  deliveryDateFromIndex?: string;
  deliveryDateToIndex?: string;
}

export class GroupingConfiguration {
  groupingPriority: { [k: number]: GroupingPriority };

  constructor(groupingPriority: Record<number, GroupingPriority>) {
    this.groupingPriority = groupingPriority;
  }
}
