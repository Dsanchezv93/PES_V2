import { DataCollectorService } from "../port/data-collector/data-collector.service";
import { PromiseEngineRequest } from "../port/dto/promise-engine.request";
import { GroupingCalculatorResponse } from "../port/grouping-calculator/dto/grouping-calculator.response";
import { IGroupingCalculatorService } from "../port/grouping-calculator/grouping-calculator.service";
import { MapperService } from "../port/mapper/mapper.service";
import { ResponseEnricherService } from "../port/response-enricher/response-enricher.service";
export class CalculatePromiseEngine {
  constructor(
    private readonly dataCollectorService: DataCollectorService,
    private readonly groupingCalculatorService: IGroupingCalculatorService,
    private readonly responseEnricherService: ResponseEnricherService,
    private readonly mapperService: MapperService,
  ) {}

  public calculate(request: PromiseEngineRequest): GroupingCalculatorResponse {
    const dataCollectorResponse = this.dataCollectorService.process(request);

    const groupingCalculatorRequest = this.mapperService.transformToGroupingRequest(dataCollectorResponse);

    const groupingResponse = this.groupingCalculatorService.process(groupingCalculatorRequest);

    return this.responseEnricherService.process(groupingResponse);
  }
}
