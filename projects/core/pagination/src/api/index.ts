export interface Settings {
    page: number;
    total: number;
}

export interface PaginationItem {
    clickable: boolean;
    text: string;
    value: string | number;
}

export interface PaginationState {
    active: number;
    isLast: boolean;
    isFirst: boolean;
    total: number;
}

export interface PaginationData {
    items: PaginationItem[];
    state: PaginationState;
}
