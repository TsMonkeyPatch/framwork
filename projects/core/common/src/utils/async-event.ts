import { Observable, Subject } from "rxjs";
import { take } from "rxjs/operators";

/**
 * an Event container which will passed through
 * an Event Emitter, data can be written by sender / resolver
 * and read by sender and resolver. So we can share our informations
 *
 */
export class AsyncEvent<T = any> {

    private event$: Subject<boolean> = new Subject();

    public constructor(
        private data: T
    ) { }

    /**
     * write data to the container
     *
     */
    get params(): T {
        return this.data;
    }

    /**
     * emits only one time and complete
     * 
     */
    get complete(): Observable<boolean> {
        return this.event$.pipe(take(1));
    }

    /**
     * continue
     * 
     */
    next() {
        this.finalize(true);
    }

    /**
     * cancel event
     * 
     */
    cancel() {
        this.finalize(false);
    }

    private finalize(value: boolean) {
        this.event$.next(value);
        this.event$.complete();
    }
}
