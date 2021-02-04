import { Observable, ReplaySubject, Subject } from "rxjs";
import { switchMap } from "rxjs/operators";

export abstract class DataProvider<T = any> {

    abstract canLoad(start: number, count: number): boolean;

    /**
     * loads the data from repository / memory
     *
     */
    protected abstract fetch(start: number, count: number): Observable<T[]>;

    /**
     *
     *
     */
    get loaded(): Observable<T[]> {
        if (!this.data$) {
            this.data$ = this.load$.pipe(
                switchMap(({start, count}) => this.fetch(start, count)),
            );
        }
        return this.data$;
    }

    private load$: ReplaySubject<{start: number, count: number}> = new ReplaySubject(1);

    private data$: Observable<any>;

    /**
     * load data
     *
     */
    load(start: number, count: number): void {
        start = start < 0 ? 0 : start;
        this.load$.next({start, count});
    }
}
