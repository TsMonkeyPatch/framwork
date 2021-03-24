import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

export enum TsMpDatalistCommand {
    /**
     * reload data, this triggers to reload the data from datasource
     *
     */
    RELOAD
}

@Injectable()
export class TsMpDatalistControl<T> {

    private command: Subject<TsMpDatalistCommand> = new Subject()

    onCommand(): Observable<TsMpDatalistCommand> {
        return this.command.asObservable()
    }

    reload() {
        this.command.next(TsMpDatalistCommand.RELOAD)
    }
}
