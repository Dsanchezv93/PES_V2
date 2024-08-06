import { GroupingConfiguration, GroupingPriority } from "../../domain/grouping-calculator/grouping-configuration";
import { DataCollectorResponse } from "../data-collector/dto/data-collector.response";
import { ClientPreferenceRequest } from "../dto/client-preference.request";
import { GroupingpPriorityRequest } from "../dto/grouping-priority.request";
import { GroupingCalculatorRequest } from "../grouping-calculator/dto/grouping-calculator.request";

export class MapperService {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public transformToGroupingRequest(request: DataCollectorResponse): GroupingCalculatorRequest {
    return new GroupingCalculatorRequest([], {
      groupingPriority: {},
    });
  }

  private sortGroupingPriorities(groupingPriorityArray: GroupingpPriorityRequest[]): GroupingpPriorityRequest[] {
    return groupingPriorityArray.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  }

  public groupingPriorities(
    groupingPriorityArray: GroupingpPriorityRequest[],
    clientPreference?: ClientPreferenceRequest,
  ): GroupingConfiguration {
    const groupingPriorityMap: GroupingPriority[] = [];

    if (clientPreference) {
      const preferredPriority: GroupingPriority = {
        shippingType: clientPreference.shippingType,
        shippingMethod: clientPreference.shippingMethod,
        ...(clientPreference.shippingSubType !== undefined && { shippingSubType: clientPreference.shippingSubType }),
        ...(clientPreference.deliveryDateFrom !== undefined && { deliveryDateFrom: clientPreference.deliveryDateFrom }),
        ...(clientPreference.deliveryDateTo !== undefined && { deliveryDateTo: clientPreference.deliveryDateTo }),
        ...(clientPreference.nodeCode !== undefined && { nodeCode: clientPreference.nodeCode }),
        ...(clientPreference.timeSlot !== undefined && { timeSlot: clientPreference.timeSlot }),
      };
      groupingPriorityMap.push(preferredPriority);
    }

    const sortedPriorityArray = this.sortGroupingPriorities(groupingPriorityArray);

    sortedPriorityArray.forEach((priority: GroupingpPriorityRequest) => {
      groupingPriorityMap.push({
        shippingType: priority.shippingType,
        shippingMethod: priority.shippingMethod,
        ...(priority.shippingSubType !== undefined && { shippingSubType: priority.shippingSubType }),
        ...(priority.deliveryDateFrom !== undefined && { deliveryDateFrom: priority.deliveryDateFrom }),
        ...(priority.deliveryDateTo !== undefined && { deliveryDateTo: priority.deliveryDateTo }),
        ...(priority.nodeCode !== undefined && { nodeCode: priority.nodeCode }),
        ...(priority.timeSlot !== undefined && { timeSlot: priority.timeSlot }),
      });
    });

    const numberedGroupingPriorityMap: Record<number, GroupingPriority> = {};
    groupingPriorityMap.forEach((priority, index) => {
      numberedGroupingPriorityMap[index + 1] = priority;
    });

    return new GroupingConfiguration(numberedGroupingPriorityMap);
  }
}
