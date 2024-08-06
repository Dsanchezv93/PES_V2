import { GroupingCalculatorRequest } from "./dto/grouping-calculator.request";
import { GroupingCalculatorResponse } from "./dto/grouping-calculator.response";

export interface IGroupingCalculatorService {
  process(groupingCalculatorRequest: GroupingCalculatorRequest): GroupingCalculatorResponse;
}
