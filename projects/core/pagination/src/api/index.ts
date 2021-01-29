export interface Settings {
    page: number;
    total: number;
}

export interface PaginationItem {
    clickable: boolean;
    text: string;
    value: string | number;
}

export interface PaginationData {
    items: PaginationItem[];
    data: {
        active: number;
        isLast: boolean;
        isFirst: boolean;
        total: number;
    }
}
