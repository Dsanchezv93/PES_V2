import assert from "node:assert";
import { beforeEach, describe, it } from "node:test";
import { ProductClassification, SellerType } from "../../enums";
import { IntangibleItem } from "../intangible-item";
import { IntangibleRule } from "./intangible";
import { GroupingConfiguration } from "../grouping-configuration";

void describe("IntangibleRule", () => {
  const rule = new IntangibleRule();
  let item: IntangibleItem;
  let config: GroupingConfiguration;

  void beforeEach(() => {
    item = {
      itemId: "1",
      sellerType: SellerType.Paris,
      sellerName: "SellerName",
      productClassification: ProductClassification.Intangible,
      classificationGroup: "",
    };
  });

  void it("should match an intangible item", () => {
    const result = rule.matches(item);
    assert.equal(result, true);
  });

  void it("should not match a non-intangible item", () => {
    item.productClassification = ProductClassification.Intangible;
    const result = rule.matches(item);
    assert.equal(result, true);
  });

  void it("should process the item and return the correct group index", () => {
    const expectedIndex = {
      sellerTypeIndex: SellerType.Paris,
      sellerNameIndex: "SellerName",
      productClassificationIndex: ProductClassification.Intangible,
    };
    const result = rule.process(item);
    assert.deepEqual(result, expectedIndex);
  });

  void it("should tag the item correctly", () => {
    const indexes = {
      sellerTypeIndex: SellerType.Paris,
      sellerNameIndex: "SellerName",
      productClassificationIndex: ProductClassification.Intangible,
    };
    rule.tag(item, indexes);
    assert.equal(item.classificationGroup, "1P-SellerName-INTANGIBLE");
  });

  void it("should throw an error if the item already has a group", () => {
    item.classificationGroup = "existing-group";

    assert.throws(() => {
      rule.apply(item, config);
    }, Error);
  });
});
