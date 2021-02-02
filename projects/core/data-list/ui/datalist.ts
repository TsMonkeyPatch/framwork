import { Component, ElementRef, HostListener, Input, OnDestroy, OnInit } from '@angular/core';
import { fromEvent, ReplaySubject, Subscription } from 'rxjs';
import { filter, take, takeUntil, tap } from 'rxjs/operators';
import { DataProvider } from '../utils/data.provider';
import { MemoryDataProvider } from '../utils/memory';

@Component({
    selector: 'tsmp-datalist',
    templateUrl: './datalist.html',
    styleUrls: ['./datalist.scss'],
    exportAs: "datalist"
})
export class TsMonkeyPatchDatalist<T> implements OnInit, OnDestroy {

    /**
     * item stream
     *
     */
    items: ReplaySubject<T[]> = new ReplaySubject();

    /**
     * max display count of items
     *
     */
    @Input()
    displayCount = 10;

    /**
     * 
     * 
     */
    private dataSource: DataProvider;

    /**
     * start index
     *
     */
    private start = 0;

    /**
     *
     *
     */
    private subscription: Subscription;

    /**
     *
     *
     */
    private isMouserOver = false;

    /**
     *
     */
    @Input()
    set source(source: T[] | DataProvider) {

        if (source instanceof DataProvider) {
            this.dataSource = source;
            return;
        }

        this.dataSource = new MemoryDataProvider();
        (this.dataSource as MemoryDataProvider<T>).source = source;
    }

    public constructor(
        private el: ElementRef<HTMLElement>
    ) {}

    /**
     * initialize component
     * 
     */
    ngOnInit(): void {
        this.subscription = this.dataSource?.loaded.subscribe(this.items);
        this.loadItems(0);
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        this.subscription = null;
    }

    /**
     * go up for 1 item 
     *
     */
    prevItem() {
        this.loadItems(this.start - 1);
    }

    /**
     * go down for 1 item
     * 
     */
    nextItem() {
        this.loadItems(this.start + 1);
    }

    /**
     * load next data
     *
     */
    private loadItems(start: number) {
        if (this.dataSource.canLoad(start, this.displayCount)) {
            this.start = start;
            this.dataSource.load(this.start, this.displayCount);
        }
    }

    /**
     * listen on mouseove, if true we listen
     *
     */
    @HostListener('mouseover', ['$event'])
    protected registerMouseControlEvents($event: MouseEvent) {

        if (!this.isMouserOver) {

            const mouseout$ = fromEvent<MouseEvent>(window, 'mouseout').pipe(
                filter((event: MouseEvent) => !this.el.nativeElement.contains(event.target as HTMLElement)), 
                tap(() => this.isMouserOver = false),
                take(1)
            );

            fromEvent<WheelEvent>(this.el.nativeElement, 'mousewheel')
                .pipe(takeUntil(mouseout$))
                .subscribe(($event) => {
                    $event.stopPropagation();
                    $event.preventDefault();
                    $event.deltaY < 0 ? this.prevItem() : this.nextItem();
                });

            this.isMouserOver = true;
        }
    }
}
