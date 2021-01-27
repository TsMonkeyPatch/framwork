export interface PeriodicElement {
    [key: string]: string | number;
    name: string;
    position: number;
    weight: number;
    symbol: string;
}

/**
 * reponse data
 */
export interface TableDataResponse {
    items: PeriodicElement[],
    page: number,
    total: number
}
