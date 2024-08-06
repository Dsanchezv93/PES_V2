import { GroupingPriority } from "../../domain/grouping-calculator/grouping-configuration";

export interface GroupingpPriorityRequest extends GroupingPriority {
  order?: number;
}
