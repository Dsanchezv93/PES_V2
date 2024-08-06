export class HeaderRequestDto {
  constructor(public Authorization?: string) {}

  static fromAuthorization(authorizationToken: string): HeaderRequestDto {
    return new HeaderRequestDto(authorizationToken);
  }

  toHeaders(): Record<string, string> {
    const headers: Record<string, string> = {};
    if (this.Authorization) {
      headers["Authorization"] = this.Authorization;
    }

    return headers;
  }
}
