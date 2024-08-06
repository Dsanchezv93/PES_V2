import { ShippingService } from "../../port/data-collector/shipping.service";

export class ShippingMethodService extends ShippingService {
  constructor() {
    super();
  }

  process(): void {
    throw new Error("Method not implemented.");
  }
}
