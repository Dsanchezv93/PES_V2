import assert from "node:assert";
import { beforeEach, describe, it } from "node:test";
import { ProductClassification, SellerType, ShippingMethod, ShippingSubType, ShippingType } from "../../enums";
import { Item } from "../item";
import { MarketplaceRule } from "./marketplace";
import { GroupIndexes, GroupingConfiguration } from "../grouping-configuration";

void describe("MarketplaceRule", () => {
  const rule = new MarketplaceRule();
  let itemMock: Item;
  let config: GroupingConfiguration;

  void beforeEach(() => {
    itemMock = {
      itemId: "name1",
      sellerType: SellerType.Marketplace,
      sellerName: "LG",
      productClassification: ProductClassification.Regular,
      shippingMethodOptions: [
        {
          shippingType: ShippingType.Collect,
          shippingMethod: ShippingMethod.Scheduled,
          shippingSubType: ShippingSubType.InStore,
          options: [
            {
              nodeCode: "facility1",
              deliveryDateFrom: "2021-01-01",
              deliveryDateTo: "2021-01-01",
              shipDate: "2021-01-01",
              timeSlot: [
                {
                  name: "TH",
                  deliveryTimeStart: "10:00",
                  deliveryTimeEnd: "12:00",
                },
              ],
            },
          ],
        },
        {
          shippingType: ShippingType.Delivery,
          shippingMethod: ShippingMethod.DateRange,
          options: [
            {
              nodeCode: "facility1",
              deliveryDateFrom: "2021-01-01",
              deliveryDateTo: "2021-01-01",
              shipDate: "2021-01-01",
              timeSlot: [
                {
                  name: "TH",
                  deliveryTimeStart: "10:00",
                  deliveryTimeEnd: "12:00",
                },
              ],
            },
          ],
        },
        {
          shippingType: ShippingType.Delivery,
          shippingMethod: ShippingMethod.NextDay,
          options: [
            {
              nodeCode: "facility2",
              deliveryDateFrom: "2021-01-01",
              deliveryDateTo: "2021-01-01",
              shipDate: "2021-01-01",
              timeSlot: [
                {
                  name: "AM1",
                  deliveryTimeStart: "10:00",
                  deliveryTimeEnd: "12:00",
                },
                {
                  name: "PM1",
                  deliveryTimeStart: "10:00",
                  deliveryTimeEnd: "12:00",
                },
              ],
            },
          ],
        },
      ],
    };

    config = {
      groupingPriority: {
        10: {
          shippingType: ShippingType.Delivery,
          shippingMethod: ShippingMethod.DateRange,
        },
        5: {
          shippingType: ShippingType.Delivery,
          shippingMethod: ShippingMethod.NextDay,
        },
      },
    };
  });

  void it("should apply the rule to the input item", () => {
    rule.apply(itemMock, config);
    assert.strictEqual(itemMock.classificationGroup, "3P-LG-REGULAR-facility2-NEXT_DAY-DELIVERY-2021-01-01-2021-01-01-AM1");
  });

  void it("should apply the rule to the input item using priority 0", () => {
    config.groupingPriority = {
      ...config.groupingPriority,
      0: {
        shippingType: ShippingType.Delivery,
        shippingMethod: ShippingMethod.DateRange,
      },
    };

    rule.apply(itemMock, config);
    assert.strictEqual(itemMock.classificationGroup, `3P-LG-REGULAR-facility1-DATE_RANGE-DELIVERY-2021-01-01-2021-01-01-TH`);
  });

  void it("should apply the rule to the input item using priority 0 with optional priority properties", () => {
    config.groupingPriority = {
      ...config.groupingPriority,
      0: {
        shippingType: ShippingType.Collect,
        shippingMethod: ShippingMethod.Scheduled,
        shippingSubType: ShippingSubType.InStore,
        nodeCode: "facility1",
        deliveryDateFrom: "2021-01-01",
        deliveryDateTo: "2021-01-01",
        timeSlot: "TH",
      },
    };

    rule.apply(itemMock, config);
    assert.strictEqual(itemMock.classificationGroup, `3P-LG-REGULAR-facility1-SCHEDULED-COLLECT-IN_STORE-2021-01-01-2021-01-01-TH`);
  });

  void it("should apply the rule to the input item using priority 1 when priority 0 not matches shipping method", () => {
    config.groupingPriority = {
      ...config.groupingPriority,
      0: {
        shippingMethod: ShippingMethod.NextDay,
        shippingType: ShippingType.Delivery,
      },
    };

    rule.apply(itemMock, config);
    assert.strictEqual(itemMock.classificationGroup, `3P-LG-REGULAR-facility2-NEXT_DAY-DELIVERY-2021-01-01-2021-01-01-AM1`);
  });

  void it("should apply the rule to the input item using priority 1 when priority 0 not matches shipping type", () => {
    config.groupingPriority = {
      ...config.groupingPriority,
      0: {
        shippingMethod: ShippingMethod.NextDay,
        shippingType: ShippingType.Collect,
      },
    };

    rule.apply(itemMock, config);
    assert.strictEqual(itemMock.classificationGroup, "3P-LG-REGULAR-facility2-NEXT_DAY-DELIVERY-2021-01-01-2021-01-01-AM1");
  });

  void it("should apply the rule to the input item using priority 1 when priority 0 not matches shipping sub type", () => {
    config.groupingPriority = {
      ...config.groupingPriority,
      0: {
        shippingMethod: ShippingMethod.Scheduled,
        shippingType: ShippingType.Collect,
        shippingSubType: ShippingSubType.Local,
        nodeCode: "facility1",
      },
    };

    rule.apply(itemMock, config);
    assert.strictEqual(itemMock.classificationGroup, "3P-LG-REGULAR-facility2-NEXT_DAY-DELIVERY-2021-01-01-2021-01-01-AM1");
  });

  void it("should apply the rule to the input item using priority 1 when priority 0 not matches delivery date from", () => {
    config.groupingPriority = {
      ...config.groupingPriority,
      0: {
        shippingMethod: ShippingMethod.Scheduled,
        shippingType: ShippingType.Delivery,
        deliveryDateFrom: "2021-01-02",
      },
    };

    rule.apply(itemMock, config);
    assert.strictEqual(itemMock.classificationGroup, "3P-LG-REGULAR-facility2-NEXT_DAY-DELIVERY-2021-01-01-2021-01-01-AM1");
  });

  void it("should apply the rule to the input item using priority 1 when priority 0 not matches delivery date to", () => {
    config.groupingPriority = {
      ...config.groupingPriority,
      0: {
        shippingMethod: ShippingMethod.Scheduled,
        shippingType: ShippingType.Delivery,
        deliveryDateFrom: "2021-01-02",
        deliveryDateTo: "2021-01-02",
      },
    };

    rule.apply(itemMock, config);
    assert.strictEqual(itemMock.classificationGroup, "3P-LG-REGULAR-facility2-NEXT_DAY-DELIVERY-2021-01-01-2021-01-01-AM1");
  });

  void it("should apply the rule to the input item using priority 1 when priority 0 not matches node code", () => {
    config.groupingPriority = {
      ...config.groupingPriority,
      0: {
        shippingMethod: ShippingMethod.Scheduled,
        shippingType: ShippingType.Collect,
        shippingSubType: ShippingSubType.InStore,
        nodeCode: "facility2",
      },
    };
    rule.apply(itemMock, config);
    assert.strictEqual(itemMock.classificationGroup, "3P-LG-REGULAR-facility2-NEXT_DAY-DELIVERY-2021-01-01-2021-01-01-AM1");
  });

  void it("should apply the rule to the input item using priority 1 when priority 0 not matches time slot", () => {
    config.groupingPriority = {
      ...config.groupingPriority,
      0: {
        shippingMethod: ShippingMethod.Scheduled,
        shippingType: ShippingType.Collect,
        nodeCode: "facility1",
        timeSlot: "TH2",
      },
    };

    rule.apply(itemMock, config);
    assert.strictEqual(itemMock.classificationGroup, "3P-LG-REGULAR-facility2-NEXT_DAY-DELIVERY-2021-01-01-2021-01-01-AM1");
  });

  void it("should apply the rule to the input item using priority 1 when priority 0 not matches any additional field", () => {
    config.groupingPriority = {
      ...config.groupingPriority,
      0: {
        shippingType: ShippingType.Delivery,
        shippingMethod: ShippingMethod.Scheduled,
        deliveryDateTo: "2021-01-02",
      },
      1: {
        shippingType: ShippingType.Delivery,
        shippingMethod: ShippingMethod.NextDay,
      },
    };

    rule.apply(itemMock, config);
    assert.strictEqual(itemMock.classificationGroup, `3P-LG-REGULAR-facility2-NEXT_DAY-DELIVERY-2021-01-01-2021-01-01-AM1`);
  });

  void it("should match a Paris regular item", () => {
    const result = rule.matches(itemMock);
    assert.strictEqual(result, true);
  });

  void it("should not match a non-regular item", () => {
    itemMock.productClassification = ProductClassification.Intangible;
    const result = rule.matches(itemMock);
    assert.strictEqual(result, false);
  });

  void it("should not match a non-Marketplace item", () => {
    itemMock.sellerType = SellerType.Paris;
    const result = rule.matches(itemMock);
    assert.strictEqual(result, false);
  });

  void it("should tag the item correctly", () => {
    const indexes: GroupIndexes = {
      sellerTypeIndex: SellerType.Marketplace,
      sellerNameIndex: "SellerName",
      productClassificationIndex: ProductClassification.Regular,
      nodeCodeIndex: "facility1",
      shippingMethodIndex: ShippingMethod.DateRange,
      shippingTypeIndex: ShippingType.Delivery,
      timeSlotIndex: "TH",
      deliveryDateFromIndex: "2021-01-01",
      deliveryDateToIndex: "2021-01-01",
    };
    rule.tag(itemMock, indexes);
    assert.strictEqual(itemMock.classificationGroup, "3P-SellerName-REGULAR-facility1-DATE_RANGE-DELIVERY-2021-01-01-2021-01-01-TH");
  });

  void it("should throw an error if the item already has a group", () => {
    itemMock.classificationGroup = "existing-group";

    assert.throws(
      () => {
        rule.apply(itemMock, config);
      },
      {
        message: "Item already has a group",
      },
    );
  });

  void it("should throw an error if there are no matching shipping methods with the config", () => {
    itemMock.shippingMethodOptions = [];

    assert.throws(
      () => {
        rule.apply(itemMock, config);
      },
      {
        message: "No shipping method found for the given priority",
      },
    );
  });
});
