import { GenericItem } from "./generic-item";
import { GroupingConfiguration } from "./grouping-configuration";
import { GenericRule } from "./rules/genric-rule";

export class RuleEngine {
  private rules: GenericRule[];

  constructor(rules: GenericRule[]) {
    this.rules = rules;
  }

  public process(input: GenericItem, config: GroupingConfiguration): void {
    this.rules.filter((rule) => rule.matches(input, config)).forEach((rule) => rule.apply(input, config));
  }
}
