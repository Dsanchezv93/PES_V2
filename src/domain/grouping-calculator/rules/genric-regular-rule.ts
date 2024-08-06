import { SellerType, ProductClassification } from "../../enums";
import { ShippingOption, ShippingSubOption, Slot } from "../../types";
import { GroupingConfiguration, GroupingPriority } from "../grouping-configuration";
import { Item } from "../item";
import { GenericRule } from "./genric-rule";

export abstract class GenericRegularRule extends GenericRule {
  process(item: Item, config: GroupingConfiguration) {
    const { groupingPriority } = config;
    const groupPriorityValues = Object.values(groupingPriority);

    for (const priority of groupPriorityValues) {
      const result = this.processShippingOptions(item, priority);
      if (result) {
        return result;
      }
    }

    throw new Error("No shipping method found for the given priority");
  }

  private processShippingOptions(item: Item, priority: GroupingPriority) {
    const { shippingMethodOptions, sellerType, sellerName, productClassification } = item;
    for (const so of shippingMethodOptions) {
      if (so.shippingType !== priority.shippingType || so.shippingMethod !== priority.shippingMethod) {
        continue;
      }

      if (priority.shippingSubType && so.shippingSubType !== priority.shippingSubType) {
        continue;
      }

      return this.processOptions(so, priority, sellerType, sellerName, productClassification);
    }

    return;
  }

  private processOptions(
    so: ShippingOption,
    priority: GroupingPriority,
    sellerType: SellerType,
    sellerName: string,
    productClassification: ProductClassification,
  ) {
    for (const option of so.options) {
      if (priority.nodeCode && option.nodeCode !== priority.nodeCode) {
        continue;
      }

      if (priority.deliveryDateFrom && option.deliveryDateFrom !== priority.deliveryDateFrom) {
        continue;
      }

      if (priority.deliveryDateTo && option.deliveryDateTo !== priority.deliveryDateTo) {
        continue;
      }

      for (const slot of option.timeSlot) {
        if (priority.timeSlot && slot.name !== priority.timeSlot) {
          continue;
        }

        return this.buildGroupIndexes(sellerType, sellerName, productClassification, so, option, slot);
      }
    }

    return;
  }

  private buildGroupIndexes(
    sellerType: SellerType,
    sellerName: string,
    productClassification: ProductClassification,
    so: ShippingOption,
    option: ShippingSubOption,
    slot: Slot,
  ) {
    return {
      sellerTypeIndex: sellerType,
      sellerNameIndex: sellerName,
      productClassificationIndex: productClassification,
      shippingTypeIndex: so.shippingType.toString(),
      shippingMethodIndex: so.shippingMethod.toString(),
      ...(so.shippingSubType ? { shippingSubTypeIndex: so.shippingSubType } : {}),
      ...(option.nodeCode ? { nodeCodeIndex: option.nodeCode } : {}),
      ...(slot.name ? { timeSlotIndex: slot.name } : {}),
      ...(option.deliveryDateFrom ? { deliveryDateFromIndex: option.deliveryDateFrom } : {}),
      ...(option.deliveryDateTo ? { deliveryDateToIndex: option.deliveryDateTo } : {}),
    };
  }
}
