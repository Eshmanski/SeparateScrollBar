export interface Balance {
  periodName: string;
  regionName: string;
  leftovers: number;
  consumption: number;
  regions?: number[];
  production: number;
  anotherTransportIn: number;
  anotherTransportOut: number;
  export: number;
  import: number;
  pipeIn: number;
  pipeOut: number;
  railIn: number;
  railOut: number;
  waterIn: number;
  waterOut: number;
}

export interface BalanceTableData {
  periodName: string;
  regionName: string;
  leftovers: number;
  consumption: number;
  production: number;
  anotherTransportIn: number;
  anotherTransportOut: number;
  export: number;
  import: number;
  pipeIn: number;
  pipeOut: number;
  railIn: number;
  railOut: number;
  waterIn: number;
  waterOut: number;
}
