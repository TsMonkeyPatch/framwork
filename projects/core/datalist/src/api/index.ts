export interface ListItem<T> {
    label: string;

    value: T;
}

export declare type ListData<T> = ListItem<T>[];
