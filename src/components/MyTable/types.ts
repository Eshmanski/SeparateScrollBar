export interface Colspan {
  commonName: string;
  colNames: {
    [key: string]: string 
  };
}

export interface TableHeader {
  [key: string]: string | Colspan
}
