import { AfterViewChecked, Component, ElementRef, HostListener, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { fromEvent, ReplaySubject, Subscription } from 'rxjs';
import { filter, finalize, take, takeUntil, tap } from 'rxjs/operators';

import { NavigableListEvent, TsMonkeyPatchNavigableList } from '@tsmonkeypatch/core/common';

import { DataProvider } from '../utils/data.provider';
import { MemoryDataProvider } from '../utils/memory';

@Component({
    selector: 'tsmp-datalist',
    templateUrl: './datalist.html',
    styleUrls: ['./datalist.scss'],
    exportAs: "datalist"
})
export class TsMonkeyPatchDatalist<T> implements OnInit, OnDestroy, AfterViewChecked {

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
     * flage data has been changed so we could update the current state 
     * of navigable list item
     *
     */
    private dataChanged = false;

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
     * boolean flag we scrolled with our mouse
     * this is only important if we update the selected item 
     * in the navigable list
     *
     */
    private isMouseScroll = false;

    /**
     * direction we move currently -1 = up and 1 = down
     * this is only interesting for keyboard navigation and navigable list
     *
     */
    private direction = 0;

    /**
     *
     *
     */
    @ViewChild(TsMonkeyPatchNavigableList, { read:  TsMonkeyPatchNavigableList, static: true })
    private navigableList: TsMonkeyPatchNavigableList;

    /**
     *
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
     * if we move with the arrow keys we have to check current position
     *
     */
    ngAfterViewChecked() {
        if (this.dataChanged && this.direction !== 0 && !this.isMouseScroll) {
            this.navigableList.setActiveItem(this.direction < 0 ? 0 : this.displayCount - 1);
            this.dataChanged = false;
        }
    }

    /**
     * initialize component and register to datasource loaded
     * stream, also load first 5 items
     * 
     */
    ngOnInit(): void {
        this.subscription = this.dataSource?.loaded
            .pipe(tap(() => this.dataChanged = true))
            .subscribe(this.items);

        this.loadItems(0);
    }

    /**
     *
     *
     */
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
     * on before next item
     * 
     */
    onNavigate(event: NavigableListEvent) {

        this.direction = event.params.direction;
        this.isMouseScroll = false;

        const next   = event.params.index;
        const cancel = next >= this.displayCount || next < 0;

        if (cancel) {
            this.direction === -1 ? this.prevItem() : this.nextItem();
            event.cancel();
            return;
        }

        event.next();
    }

    setActiveItem(index: number) {
        this.navigableList.setActiveItem(index);
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
     * @outsource this to directive
     *
     */
    @HostListener('mouseover')
    protected registerMouseControlEvents() {

        if (!this.isMouserOver) {

            const mouseout$ = fromEvent<MouseEvent>(window, 'mouseout').pipe(
                filter((event: MouseEvent) => !this.el.nativeElement.contains(event.target as HTMLElement)), 
                tap(() => this.isMouserOver = false),
                take(1)
            );

            fromEvent<WheelEvent>(this.el.nativeElement, 'mousewheel')
                .pipe(
                    finalize(() => this.isMouseScroll = false),
                    takeUntil(mouseout$),
                )
                .subscribe(($event) => {
                    $event.stopPropagation();
                    $event.preventDefault();
                    $event.deltaY < 0 ? this.prevItem() : this.nextItem();

                    this.isMouseScroll = true;
                });

            this.isMouserOver = true;
        }
    }
}
