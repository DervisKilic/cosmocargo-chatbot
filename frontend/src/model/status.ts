export interface StatusMapping<T> {
  frontend: T;
  backend: number;
}

export class StatusMapper<T> {
  private mappings: StatusMapping<T>[];
  
  constructor(mappings: StatusMapping<T>[]) {
      this.mappings = mappings;
  }
  
  toBackend(frontendStatus: T): number {
      return this.mappings.find(m => m.frontend === frontendStatus)?.backend ?? 0;
  }
  
  toFrontend(backendStatus: number): T {
      return this.mappings.find(m => m.backend === backendStatus)?.frontend ?? this.mappings[0].frontend;
  }
}