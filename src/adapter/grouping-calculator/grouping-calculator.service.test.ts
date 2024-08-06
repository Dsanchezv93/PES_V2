import assert from "node:assert";
import { beforeEach, describe, it } from "node:test";

import { ProductClassification, SellerType, ShippingMethod, ShippingSubType, ShippingType } from "../../domain/enums";
import { IntangibleItem } from "../../domain/grouping-calculator/intangible-item";
import { Item } from "../../domain/grouping-calculator/item";
import { RuleEngine } from "../../domain/grouping-calculator/rule-engine";
import { IntangibleRule } from "../../domain/grouping-calculator/rules/intangible";
import { GroupingCalculatorRequest } from "../../port/grouping-calculator/dto/grouping-calculator.request";
import { GroupingCalculatorResponse } from "../../port/grouping-calculator/dto/grouping-calculator.response";
import { GroupingCalculatorService } from "./grouping-calculator.service";

void describe("GroupingCalculatorService", () => {
  let request: GroupingCalculatorRequest;
  beforeEach(() => {
    request = {
      items: [new IntangibleItem("1", SellerType.Paris, "SellerName", ProductClassification.Intangible)],
      config: {
        groupingPriority: {
          0: {
            shippingType: ShippingType.Collect,
            shippingSubType: ShippingSubType.InStore,
            shippingMethod: ShippingMethod.Scheduled,
          },
          2: {
            shippingType: ShippingType.Collect,
            shippingMethod: ShippingMethod.Scheduled,
          },
        },
      },
    };
  });

  void it("should process the items and not apply any group", () => {
    const ruleEngineMock = new RuleEngine([]);
    const groupingCalculatorService = new GroupingCalculatorService(ruleEngineMock);

    const response: GroupingCalculatorResponse = groupingCalculatorService.process(request);

    assert.deepEqual(response.items[0], {
      itemId: "1",
      sellerType: SellerType.Paris,
      sellerName: "SellerName",
      productClassification: ProductClassification.Intangible,
      classificationGroup: undefined,
    });
  });

  void it("should process the items and apply the intangible group", () => {
    const ruleEngineMock = new RuleEngine([new IntangibleRule()]);
    const groupingCalculatorService = new GroupingCalculatorService(ruleEngineMock);

    const response: GroupingCalculatorResponse = groupingCalculatorService.process(request);

    assert.deepEqual(response.items[0], {
      itemId: "1",
      classificationGroup: "1P-SellerName-INTANGIBLE",
      productClassification: ProductClassification.Intangible,
      sellerName: "SellerName",
      sellerType: SellerType.Paris,
    });
  });

  void it("should process the items and not apply the intangible group", () => {
    const ruleEngineMock = new RuleEngine([new IntangibleRule()]);
    const groupingCalculatorService = new GroupingCalculatorService(ruleEngineMock);
    request.items[0] = new Item("1", SellerType.Marketplace, "SellerName", ProductClassification.Regular, [], { isMarketplace: true });

    const response: GroupingCalculatorResponse = groupingCalculatorService.process(request);

    assert.deepEqual(response.items[0], {
      marketplace: {
        isMarketplace: true,
      },
      itemId: "1",
      sellerName: "SellerName",
      sellerType: SellerType.Marketplace,
      productClassification: ProductClassification.Regular,
      shippingMethodOptions: [],
      presale: undefined,
      classificationGroup: undefined,
    });
  });
});
