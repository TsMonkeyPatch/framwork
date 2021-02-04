import { Observable, Subject } from "rxjs";
import { take } from "rxjs/operators";

/**
 * AsyncEvent which will emits through EventEmitter
 * so we can do some (async) operations before we
 * let pass / cancel the event.
 *
 */
export class AsyncEvent {

    private event$: Subject<boolean> = new Subject();

    /**
     * emits only one time and complete
     * 
     */
    public get completed(): Observable<boolean> {
        return this.event$.pipe(take(1));
    }

    /**
     * event should be executed
     * 
     */
    public done() {
        this.event$.next(true);
    }

    /**
     * event should be canceled
     * 
     */
    public cancel() {
        this.event$.next(false);
    }
}
