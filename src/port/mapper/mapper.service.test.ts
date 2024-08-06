import assert from "node:assert/strict";
import { describe, test } from "node:test";
import { ShippingMethod, ShippingSubType, ShippingType } from "../../domain/enums";
import { GroupingConfiguration, GroupingPriority } from "../../domain/grouping-calculator/grouping-configuration";
import { ClientPreferenceRequest } from "../dto/client-preference.request";
import { GroupingpPriorityRequest } from "../dto/grouping-priority.request";
import { MapperService } from "./mapper.service";

const mapperService = new MapperService();

const pemSettings: GroupingpPriorityRequest[] = [
  {
    shippingType: ShippingType.Delivery,
    shippingMethod: ShippingMethod.SameDay,
    order: 1,
  },
  {
    shippingType: ShippingType.Delivery,
    shippingMethod: ShippingMethod.NextDay,
    order: 2,
  },
  {
    shippingType: ShippingType.Delivery,
    shippingMethod: ShippingMethod.DateRange,
    order: 2,
  },
  {
    shippingType: ShippingType.Delivery,
    shippingMethod: ShippingMethod.Scheduled,
    order: 3,
  },
  {
    shippingType: ShippingType.Collect,
    shippingMethod: ShippingMethod.Scheduled,
    shippingSubType: ShippingSubType.InStore,
    order: 4,
  },
  {
    shippingType: ShippingType.Collect,
    shippingMethod: ShippingMethod.Scheduled,
    shippingSubType: ShippingSubType.Local,
    order: 4,
  },
];

void describe("MapperService", () => {
  void test("groupingPriorities - It should build GroupingConfiguration with clientPreference", () => {
    // Datos de prueba
    const clientPreference: ClientPreferenceRequest = {
      shippingType: ShippingType.Collect,
      shippingMethod: ShippingMethod.Scheduled,
      shippingSubType: ShippingSubType.InStore,
      deliveryDateFrom: "20-06-2024",
      deliveryDateTo: "20-06-2024",
      nodeCode: "20",
      timeSlot: "TH",
    };

    // Llamar al método
    const result: GroupingConfiguration = mapperService.groupingPriorities(pemSettings, clientPreference);

    // Validar el resultado
    const expectedGroupingPriorityMap: Record<number, GroupingPriority> = {
      1: {
        shippingType: ShippingType.Collect,
        shippingMethod: ShippingMethod.Scheduled,
        shippingSubType: ShippingSubType.InStore,
        deliveryDateFrom: "20-06-2024",
        deliveryDateTo: "20-06-2024",
        nodeCode: "20",
        timeSlot: "TH",
      },
      2: {
        shippingType: ShippingType.Delivery,
        shippingMethod: ShippingMethod.SameDay,
      },
      3: {
        shippingType: ShippingType.Delivery,
        shippingMethod: ShippingMethod.NextDay,
      },
      4: {
        shippingType: ShippingType.Delivery,
        shippingMethod: ShippingMethod.DateRange,
      },
      5: {
        shippingType: ShippingType.Delivery,
        shippingMethod: ShippingMethod.Scheduled,
      },
      6: {
        shippingType: ShippingType.Collect,
        shippingMethod: ShippingMethod.Scheduled,
        shippingSubType: ShippingSubType.InStore,
      },
      7: {
        shippingType: ShippingType.Collect,
        shippingMethod: ShippingMethod.Scheduled,
        shippingSubType: ShippingSubType.Local,
      },
    };

    assert.deepStrictEqual(result.groupingPriority, expectedGroupingPriorityMap);
  });

  void test("groupingPriorities - It should build GroupingConfiguration with clientPreference set to NULL", () => {
    // Llamar al método
    const result: GroupingConfiguration = mapperService.groupingPriorities(pemSettings);

    // Validar el resultado
    const expectedGroupingPriorityMap: Record<number, GroupingPriority> = {
      1: {
        shippingType: ShippingType.Delivery,
        shippingMethod: ShippingMethod.SameDay,
      },
      2: {
        shippingType: ShippingType.Delivery,
        shippingMethod: ShippingMethod.NextDay,
      },
      3: {
        shippingType: ShippingType.Delivery,
        shippingMethod: ShippingMethod.DateRange,
      },
      4: {
        shippingType: ShippingType.Delivery,
        shippingMethod: ShippingMethod.Scheduled,
      },
      5: {
        shippingType: ShippingType.Collect,
        shippingMethod: ShippingMethod.Scheduled,
        shippingSubType: ShippingSubType.InStore,
      },
      6: {
        shippingType: ShippingType.Collect,
        shippingMethod: ShippingMethod.Scheduled,
        shippingSubType: ShippingSubType.Local,
      },
    };

    assert.deepStrictEqual(result.groupingPriority, expectedGroupingPriorityMap);
  });

  void test("sortGroupingPriorities - It should sort the grouping priorities in ascending order.", () => {
    const groupingPriorityArray: GroupingpPriorityRequest[] = [
      {
        shippingType: ShippingType.Collect,
        shippingMethod: ShippingMethod.Scheduled,
        shippingSubType: ShippingSubType.Local,
        order: 4,
      },
      {
        shippingType: ShippingType.Delivery,
        shippingMethod: ShippingMethod.NextDay,
        order: 2,
      },
      {
        shippingType: ShippingType.Delivery,
        shippingMethod: ShippingMethod.SameDay,
        order: 1,
      },
      {
        shippingType: ShippingType.Delivery,
        shippingMethod: ShippingMethod.DateRange,
        order: 2,
      },
      {
        shippingType: ShippingType.Collect,
        shippingMethod: ShippingMethod.Scheduled,
        shippingSubType: ShippingSubType.InStore,
        order: 4,
      },
      {
        shippingType: ShippingType.Delivery,
        shippingMethod: ShippingMethod.Scheduled,
        order: 3,
      },
    ];

    const expectedSortedArray: GroupingpPriorityRequest[] = [
      {
        shippingType: ShippingType.Delivery,
        shippingMethod: ShippingMethod.SameDay,
        order: 1,
      },
      {
        shippingType: ShippingType.Delivery,
        shippingMethod: ShippingMethod.NextDay,
        order: 2,
      },
      {
        shippingType: ShippingType.Delivery,
        shippingMethod: ShippingMethod.DateRange,
        order: 2,
      },
      {
        shippingType: ShippingType.Delivery,
        shippingMethod: ShippingMethod.Scheduled,
        order: 3,
      },
      {
        shippingType: ShippingType.Collect,
        shippingMethod: ShippingMethod.Scheduled,
        shippingSubType: ShippingSubType.Local,
        order: 4,
      },
      {
        shippingType: ShippingType.Collect,
        shippingMethod: ShippingMethod.Scheduled,
        shippingSubType: ShippingSubType.InStore,
        order: 4,
      },
    ];

    const sortedArray = mapperService["sortGroupingPriorities"](groupingPriorityArray);
    assert.deepStrictEqual(sortedArray, expectedSortedArray);
  });
});
