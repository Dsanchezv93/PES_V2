/* eslint-disable @typescript-eslint/ban-ts-comment */
import { PromiseEngineRequest } from "../dto/promise-engine.request";

import { ShippingService } from "./shipping.service";
import { ConfigurationService } from "./configuration.service";
import { DataCollectorResponse } from "./dto/data-collector.response";

export abstract class DataCollectorService {
  constructor(
    // @ts-ignore
    private readonly shippingService: ShippingService,
    // @ts-ignore
    private readonly configurationService: ConfigurationService,
  ) {}

  abstract process(request: PromiseEngineRequest): DataCollectorResponse;
}
