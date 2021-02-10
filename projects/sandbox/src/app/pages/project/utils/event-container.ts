import { Observable, Subject } from "rxjs";

export class EventContainer<T> {

    private event$: Subject<boolean> = new Subject();

    constructor(private params: T) {
    }

    get param(): T {
        return this.params;
    }

    get completed(): Observable<boolean> {
        return this.event$.asObservable();
    }

    /**
     * cancel the event
     * 
     */
    cancel() {
        this.event$.next(false);
        this.event$.complete();
    }

    /**
     * continue event
     *
     */
    next() {
        this.event$.next(true);
        this.event$.complete();
    }
}