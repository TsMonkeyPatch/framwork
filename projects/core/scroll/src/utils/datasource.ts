import { ListRange } from "@angular/cdk/collections";
import { Observable, of, ReplaySubject } from "rxjs";
import { catchError, take, takeUntil } from "rxjs/operators";

export interface DataResult<T> {
    items: T[] | readonly T[];

    total: number;
}

export interface TsMonkeyPatchDataView {
    refresh: () => void
}

/**
 *
 *
 */
export abstract class TsMonkeyPatchDataSource<T> {

    /**
     * data stream which is passed to collection viewer
     *
     */
    private data$: ReplaySubject<DataResult<T>> = new ReplaySubject()

    private dataView: TsMonkeyPatchDataView

    /**
     * change data result
     *
     */
    get change(): Observable<DataResult<T>> {
        return this.data$.asObservable()
    }

    /**
     * connect a view to the datasource
     *
     */
    connect(view: TsMonkeyPatchDataView) {
        this.dataView = view
    }

    /**
     * load data range
     *
     */
    load(range: ListRange) {
        this.fetch(range).pipe(
            catchError(() => of({ total: 0, items: [] })),
            take(1)
        )
        .subscribe((result) => this.data$.next(result))
    }

    /**
     * fetch required data
     *
     */
    protected abstract fetch(range: ListRange): Observable<DataResult<T>>
}
