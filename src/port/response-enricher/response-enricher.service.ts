import { PromiseEngineResponse } from "../dto/promise-engine.response";
import { GroupingCalculatorResponse } from "../grouping-calculator/dto/grouping-calculator.response";

export interface ResponseEnricherService {
  process(response: GroupingCalculatorResponse): PromiseEngineResponse;
}
