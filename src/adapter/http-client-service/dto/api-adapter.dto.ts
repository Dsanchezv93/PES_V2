import { HttpMethod } from "../enums";
import { HeaderRequestDto } from ".";

export class ApiAdapterDto<T> {
  constructor(
    public url: string,
    public method: HttpMethod,
    public action: string,
    public data?: T,
    public headers?: HeaderRequestDto,
    public queryParams?: Record<string, string>,
  ) {}
}
