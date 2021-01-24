import { DOCUMENT } from '@angular/common';
import { Inject, Injectable, NgZone } from '@angular/core';
import { animationFrameScheduler, fromEvent, Observable, Subject, Subscriber } from 'rxjs';
import { debounceTime, filter, map, take, takeUntil } from 'rxjs/operators';

export interface ScrollPosition {
    left: number;
    top: number;
}

/** @dynamic */
@Injectable({
    providedIn: 'root'
})
export class WindowScrollProvider {

    private broadcast$: Subject<ScrollPosition> = new Subject();

    private removeEvent$: Subject<boolean> = new Subject();

    private subscriberCount = 0;

    public constructor(
        @Inject(DOCUMENT) private document: Document,
        private zone: NgZone
    ) {
    }

    public scrollTo(options: ScrollToOptions): Observable<ScrollPosition> {

        const maxScrollOffset = this.document.documentElement.scrollHeight - window.innerHeight;
        const completedHeight = options.top ? Math.min(options.top, maxScrollOffset) : maxScrollOffset;

        const scroll$ = this.broadcast$.pipe(
            filter((position) => position.top === completedHeight),
            take(1)
        );

        window.scrollTo(options);
        return scroll$;
    }

    public scroll(): Observable<ScrollPosition> {

        return new Observable((subscriber: Subscriber<ScrollPosition>) => {
            /** subscribe */
            this.subscriberCount += 1;

            if (this.subscriberCount === 1) {
                this.bindToWindowScrollEvent();
            }

            this.broadcast$
                .pipe(takeUntil(this.removeEvent$))
                .subscribe(subscriber);

            return () => {
                this.subscriberCount -= 1;

                if (this.subscriberCount <= 0) {
                    this.removeEvent$.next(true);
                }
            }
        });
    }

    private bindToWindowScrollEvent(): void {

        this.zone.runOutsideAngular(() => {
            fromEvent(window, 'scroll').pipe(
                takeUntil(this.removeEvent$),
                debounceTime(0, animationFrameScheduler),
                map<Event, ScrollPosition>(() => {
                    return {
                        left: window.scrollX,
                        top: window.scrollY
                    }
                })
            )
            .subscribe(this.broadcast$);
        });
    }
}