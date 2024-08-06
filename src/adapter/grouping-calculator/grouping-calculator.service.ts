import { IntangibleRule } from "../../domain/grouping-calculator/rules/intangible";
import { RuleEngine } from "../../domain/grouping-calculator/rule-engine";
import { GroupingCalculatorRequest } from "../../port/grouping-calculator/dto/grouping-calculator.request";
import { GroupingCalculatorResponse } from "../../port/grouping-calculator/dto/grouping-calculator.response";
import { IGroupingCalculatorService } from "../../port/grouping-calculator/grouping-calculator.service";
import { ParisRule } from "../../domain/grouping-calculator/rules/paris";

export class GroupingCalculatorService implements IGroupingCalculatorService {
  constructor(private ruleEngine = new RuleEngine([new IntangibleRule(), new ParisRule()])) {}
  process(request: GroupingCalculatorRequest): GroupingCalculatorResponse {
    const { config, items } = request;
    items.forEach((item) => {
      this.ruleEngine.process(item, config);
    });

    return new GroupingCalculatorResponse(request.items);
  }
}
