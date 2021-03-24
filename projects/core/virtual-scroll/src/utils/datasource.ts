import { ListRange, DataSource, CollectionViewer } from "@angular/cdk/collections";
import { Observable, of, ReplaySubject, Subscription } from "rxjs";
import { catchError, take } from "rxjs/operators";

export interface DataResult<T> {
    items: T[] | readonly T[];

    total: number;
}

/**
 * Datasource adapter for virtual scroll view so we can handle it
 *
 */
export abstract class VirtualScrollDataSource<T> extends DataSource<T> {

    /**
     * data stream which is passed to collection viewer
     *
     */
    private data$: ReplaySubject<T[] | ReadonlyArray<T>> = new ReplaySubject()

    /**
     * @var itemcount amount of total items in dataset
     *
     */
    private itemcount: number

    /**
     * @returns total amount of items
     *
     */
    get total() {
        return this.itemcount
    }

    /**
     * @var viewSubscriptions weakmap to hold all view subscriptions
     *
     */
    private viewSubscriptions: WeakMap<CollectionViewer, Subscription> = new WeakMap()

    /**
     * @inheritdoc
     *
     */
    connect(collectionViewer: CollectionViewer): Observable<T[] | ReadonlyArray<T>> {
        const subscription = collectionViewer.viewChange.subscribe((range) => this.load(range))
        this.viewSubscriptions.set(collectionViewer, subscription)
        return this.data$.asObservable()
    }

    /**
     * @inheritdoc
     *
     */
    disconnect(collectionViewer: CollectionViewer) {
        const subscription = this.viewSubscriptions.get(collectionViewer)
        if (subscription) {
            subscription.unsubscribe()
            this.viewSubscriptions.delete(collectionViewer)
        }
    }

    /**
     * fetch items for given data range
     *
     */
    protected abstract fetch(range: ListRange): Observable<DataResult<T>>

    /**
     * load data range
     *
     */
    private load(range: ListRange) {
        this.fetch(range).pipe(
            catchError<DataResult<T>, Observable<DataResult<T>>>(() => of({ total: 0, items: [] })),
            take(1)
        )
        .subscribe((result) => {
            this.itemcount = result.total
            this.data$.next(result.items)
        })
    }
}
