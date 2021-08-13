import { AfterViewChecked, ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Input, NgZone, OnDestroy, OnInit, Output, ViewChild } from '@angular/core'
import { fromEvent, ReplaySubject, Subject } from 'rxjs'
import { filter, finalize, switchMap, takeUntil, tap } from 'rxjs/operators'
import { NavigableListEvent, TsMonkeyPatchNavigableListDirective } from '@tsmonkeypatch/core/common'
import { DataProvider } from '../utils/data.provider'
import { MemoryDataProvider } from '../utils/memory'

@Component({
    selector: 'tsmp-datalist',
    templateUrl: './datalist.html',
    styleUrls: ['./datalist.scss'],
    exportAs: "datalist",
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TsMonkeyPatchDatalistComponent<T> implements OnInit, OnDestroy, AfterViewChecked {

    /**
     * item stream
     *
     */
    items: ReplaySubject<T[]> = new ReplaySubject()

    /**
     *
     *
     */
    @Output()
    selected: EventEmitter<T> = new EventEmitter()

    /**
     * max display count of items
     *
     */
    @Input()
    displayCount: number

    /**
     * max display count of items
     *
     */
    @Input()
    disableScroll = false

    /**
     * flage data has been changed so we could update the current state
     * of navigable list item
     *
     */
    private dataChanged = false

    /**
     *
     *
     */
    private dataSource: DataProvider

    /**
     *
     *
     */
    private destroy$: Subject<boolean> = new Subject()

    /**
     * direction we move currently -1 = up and 1 = down
     * this is only interesting for keyboard navigation and navigable list
     *
     */
    private direction = 0

    /**
     * flag we used mouse scroll to load more data
     *
     */
    private isMouseScroll = false

    /**
     *
     *
     */
    @ViewChild(TsMonkeyPatchNavigableListDirective, { read:  TsMonkeyPatchNavigableListDirective, static: true })
    private navigableList: TsMonkeyPatchNavigableListDirective

    /**
     *
     *
     */
    @Input()
    set source(source: T[] | DataProvider<T>) {

        if (!Array.isArray(source)) {
            this.dataSource = source
            return
        }

        this.dataSource = new MemoryDataProvider();
        (this.dataSource as MemoryDataProvider<T>).source = source
    }

    /**
     *
     *
     */
    constructor(
        private el: ElementRef<HTMLElement>,
        private zone: NgZone
    ) { }

    /**
     * if we move with the arrow keys we have to check current position
     *
     */
    ngAfterViewChecked() {
        const activeItem = this.navigableList.getActiveItemIndex();
        if (this.dataChanged && !this.isMouseScroll && activeItem > -1) {
            this.navigableList.setActiveItem(this.direction < 0 ? 0 : this.dataSource.count - 1)
        }
        this.dataChanged = false
    }

    /**
     * initialize component and register to datasource loaded
     * stream, also load first 5 items
     *
     */
    ngOnInit(): void {

        if (!this.disableScroll) {
            this.registerMouseControls();
        }

        this.dataSource?.loaded.pipe(
            tap(() => this.dataChanged = true),
            takeUntil(this.destroy$)
        )
        .subscribe(this.items)

        this.dataSource.count = this.displayCount ?? this.dataSource.count
        this.dataSource.load(0)
    }

    /**
     *
     *
     */
    ngOnDestroy() {
        this.destroy$.next(true)
        this.destroy$.complete()
        this.destroy$ = null
    }

    /**
     * go down for 1 item
     *
     */
    nextItem() {
        this.dataSource.load(this.dataSource.current + 1)
    }

    /**
     * go up for 1 item
     *
     */
    prevItem() {
        this.dataSource.load(this.dataSource.current - 1)
    }

    /**
     * on before next item
     *
     */
    onNavigate(event: NavigableListEvent) {
        this.direction = event.params.direction
        this.isMouseScroll = false

        const next   = event.params.next
        const cancel = next > this.dataSource.count - 1 || next < 0

        if (cancel) {
            this.direction === -1 ? this.prevItem() : this.nextItem()
            event.cancel()
            return
        }
        event.next()
    }

    selectItem(item: T) {
        this.selected.emit(item)
    }

    /**
     *
     *
     */
    setActiveItem(index: number, item: T) {
        this.navigableList.setActiveItem(index)
        this.selectItem(item)
    }

    /**
     * listen mouse controls, if we hover then we can scroll via mousewheel
     * until we go out with our mouse. Run all this outside of the ng-zone
     * so we do not affect change detection all time.
     *
     */
    private registerMouseControls() {

        this.zone.runOutsideAngular(() => {
            const mouseover$ = fromEvent<MouseEvent>(this.el.nativeElement, 'mouseover')
            const mouseout$ = fromEvent<MouseEvent>(window, 'mouseout')
            const mouseWheel$ = fromEvent<WheelEvent>(this.el.nativeElement, 'mousewheel')

            const destroy$ = mouseout$.pipe(
                filter((event: MouseEvent) => !this.el.nativeElement.contains(event.target as HTMLElement))
            )
            
            mouseover$.pipe(
                switchMap(() => mouseWheel$.pipe(
                    tap(() => this.isMouseScroll = true),
                    finalize(() => this.isMouseScroll = false),
                    takeUntil(destroy$))
                ),
                takeUntil(this.destroy$)
            )
            .subscribe(($event) => {
                $event.stopPropagation()
                $event.preventDefault()
                this.zone.run(() => $event.deltaY < 0 ? this.prevItem() : this.nextItem())
            })
        })
    }
}
