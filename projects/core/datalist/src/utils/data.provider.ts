import { Observable, ReplaySubject } from "rxjs";
import { switchMap } from "rxjs/operators";

export interface DataSourceSetting {
    start: number;
    count: number;
}

export abstract class DataProvider<T = any> {

    /**
     * total amount of items
     *
     */
    total = -1

    /**
     * prevalidate data can loaded
     *
     */
    protected abstract canLoad(start: number, count: number): boolean

    /**
     * loads the data from repository / memory
     *
     */
    protected abstract fetch(start: number, count: number): Observable<T[]>

    /**
     *
     *
     */
    private load$: ReplaySubject<{from: number, to: number}> = new ReplaySubject(1)

    /** 
     *
     *
     */
    private data$: Observable<any>;

    /**
     * start index where we start loading
     *
     *
     */
    public get current(): number {
        return this.loadedIndex;
    }

    /**
     * count of items which should be loaded
     *
     */
    private _count = 10

    private loadedIndex = 0;

    /**
     *
     *
     */
    get loaded(): Observable<T[]> {
        if (!this.data$) {
            this.data$ = this.load$.pipe(
                switchMap(({from, to}) => this.fetch(from, to)),
            );
        }
        return this.data$;
    }

    /**
     * set amount of items which should be loaded
     *
     */
    set count(count: number) {
        this._count = count
    }

    /**
     * get amount of items which should be loaded
     *
     */
    get count(): number {
        return this._count
    }

    /**
     * load data
     *
     */
    load(start: number, count?: number): boolean {

        let from = this.total < 0 ? start :  Math.min(this.total -  count ?? this.count, start) 
            from = Math.max(0, from)

        const to = count ?? this.count

        if (this.canLoad(from, to)) {
            this.loadedIndex = from;
            this.load$.next({from, to})
            return true
        }
        return false;
    }
}
