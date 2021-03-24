/**
 * based on @see https://blog.logrocket.com/virtual-scrolling-core-principles-and-basic-implementation-in-react/
 *
 */
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Input, NgZone, OnDestroy, OnInit, Optional, Renderer2, TemplateRef, ViewChild } from '@angular/core';
import { CollectionViewer, ListRange } from "@angular/cdk/collections";
import { animationFrameScheduler, fromEvent, Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, takeUntil } from 'rxjs/operators';
import { TsMpDatalistCommand, TsMpDatalistControl } from '../utils/control';
import { VirtualScrollDataSource } from '../utils/datasource';

export interface TemplateOutletContext<T> {
    items: T[] | readonly T[];
}

@Component({
    selector: 'tsmp-virtual-scroll',
    templateUrl: './virtual-scroll.html',
    styleUrls: ['./virtual-scroll.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TsMonkeyPatchVirtualScrollComponent<T> implements CollectionViewer, OnDestroy, OnInit {

    /**
     * set item height
     *
     */
    @Input()
    itemHeight = 40

    @Input()
    set source(source: VirtualScrollDataSource<T>) {

        if (this.datasource) {
            this.datasource.disconnect(this)
        }

        this.datasource = source;
        this.source$ = this.datasource.connect(this)
    }

    /**
     * template
     *
     */
    @Input()
    template: TemplateRef<TemplateOutletContext<T>>

    /**
     * items to be shown
     *
     */
    items: T[] | readonly T[]

    /**
     * datasource we are connect to
     *
     */
    private datasource: VirtualScrollDataSource<T>

    /**
     * component gets destroyed
     *
     */
    private destroy$ = new Subject<boolean>()

    /**
     * tolerance on bottom and top
     *
     */
    private tolerance = 4

    /**
     * amount of items which fits into a page (even the partial ones)
     *
     */
    private pageSize: number

    /**
     * current range we have loaded
     *
     */
    private range: [number, number]

    /**
     * max amount of items we expect
     *
     */
    private total: number

    /**
     * we load a new range from our data source
     *
     */
    private range$: Subject<ListRange> = new Subject()

    /**
     * scroll event stream
     *
     */
    private source$: Observable<T[] | ReadonlyArray<T>>

    /**
     * set the max height of the document to 1million px, by default chrome seems to handle a max height
     * of 33.5 Million Pixel but it seems even on less pixel (tested with 6 million) we got some scrolling issues
     * like a rubber band
     *
     * so set max_size of document to 750k pixels this seems to be good
     */
    private static MAX_SIZE = 1000 * 750

    /**
     * the area which is scrollable
     *
     */
    @ViewChild('viewport', { read: ElementRef, static: true })
    private viewport: ElementRef<HTMLDivElement>

    /**
     * content wrapper which holds the content
     *
     */
    @ViewChild('content', { read: ElementRef, static: true })
    private content: ElementRef<HTMLDivElement>

    /**
     * virtual space on bottom to show a scrollbar if required
     *
     */
    @ViewChild('virtualspace', { read: ElementRef, static: true })
    private virtualSpace: ElementRef<HTMLDivElement>

    constructor(
        @Optional() private control: TsMpDatalistControl<T>,
        private zone: NgZone,
        private renderer: Renderer2,
        private cdRef: ChangeDetectorRef
    ) {}

    /**
     * view has been changed
     *
     */
    get viewChange(): Observable<ListRange> {
        return this.range$.asObservable()
    }

    /**
     * initialize component
     *
     */
    ngOnInit(): void {
        this.loadInitialDataset()
        this.registerScrollEvent()

        // register on remote control if exists
        this.control ? this.registerCtrlCommands() : void 0
    }

    /**
     * destroy component
     *
     */
    ngOnDestroy() {
        this.datasource.disconnect(this)
        this.destroy$.next(true)
        this.destroy$.complete()
        this.destroy$ = null
    }

    /**
     * initialize data
     *
     */
    private loadInitialDataset() {
        const viewportHeight = this.viewport.nativeElement.getBoundingClientRect().height
        this.pageSize = Math.floor(viewportHeight / this.itemHeight)

        this.source$.subscribe((result) => {

            if (!this.total || this.total !== this.datasource.total) {
                this.total = this.datasource.total
                this.resetScrollView()
            }

            this.items = result

            this.translateContent(result.length)
            this.cdRef.markForCheck()
        })

        this.range$.next({start: 0, end: this.pageSize + this.tolerance * 2 })
    }

 
    /**
     * get range to render next
     *
     */
    private getRange(): [number, number] {
        let top  = this.viewport.nativeElement.scrollTop

        this.range = this.measureRange(top)

        // the original height is gt MAX_SIZE so we use the MAX_SIZE (750k pixels)
        const virtualHeight = this.total * this.itemHeight
        if (virtualHeight > TsMonkeyPatchVirtualScrollComponent.MAX_SIZE) {

            const viewportHeight = this.viewport.nativeElement.clientHeight
            const offsetMax = TsMonkeyPatchVirtualScrollComponent.MAX_SIZE - viewportHeight
            const offsetScrolled = Math.min(top, offsetMax);
            const virtualOffsetMax = virtualHeight - viewportHeight
            const virtualOffsetScrolled = offsetScrolled * virtualOffsetMax / offsetMax

            return this.measureRange(virtualOffsetScrolled)
        }

        return this.range
    }

    /**
     * measure range
     *
     */
    private measureRange(offset: number): [number, number] {
        const toleranceHeight = this.tolerance * this.itemHeight
        const start = Math.max(Math.floor((offset - toleranceHeight) / this.itemHeight), 0)
        const end   = Math.min(start + this.tolerance * 2 + this.pageSize, this.total)

        return [start, end]
    }

    /**
     * move content to correct position
     *
     */
    private translateContent(loaded: number) {
        const top = (this.range?.[0] ?? 0) * this.itemHeight
        const totalHeight = Math.min(this.total * this.itemHeight, TsMonkeyPatchVirtualScrollComponent.MAX_SIZE)

        if (!this.range) {
            return
        }

        const maxTop = Math.min(top, totalHeight - loaded * this.itemHeight)
        this.renderer.setStyle(this.content.nativeElement, 'transform', `translateY(${maxTop}px)`)
    }

    /**
     * register to commands from remote control
     *
     */
    private registerCtrlCommands() {

        this.control.onCommand()
            .pipe(takeUntil(this.destroy$))
            .subscribe((command) => {
                switch (command) {
                    case TsMpDatalistCommand.RELOAD:
                        this.range$.next({start: 0, end: this.pageSize + this.tolerance * 2 })
                        this.scrollTop()
                        break
                }
            })
    }

    /**
     * register to scroll event and gets the item range
     * we want to show
     *
     */
    private registerScrollEvent() {
        this.zone.runOutsideAngular(() => {
            fromEvent(this.viewport.nativeElement, "scroll")
                .pipe(
                    debounceTime(0, animationFrameScheduler),
                    map(() => this.getRange()),
                    distinctUntilChanged((x, y) => x[0] === y[0] && x[1] === y[1]),
                    takeUntil(this.destroy$)
                )
                .subscribe((range) => {
                    this.zone.run(() => this.range$.next({start: range[0], end: range[1]}))
                })
        })
    }

    /**
     * recalculate scroll view
     *
     */
    private resetScrollView() {
        const totalHeight = Math.min(this.total * this.itemHeight, TsMonkeyPatchVirtualScrollComponent.MAX_SIZE)
        this.renderer.setStyle(this.virtualSpace.nativeElement, `height`, `${totalHeight}px`)
        this.scrollTop()
    }

    /**
     * scroll to top
     *
     */
    private scrollTop() {
        this.viewport.nativeElement.scrollTo({top: 0})
    }
}
