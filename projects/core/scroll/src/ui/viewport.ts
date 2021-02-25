/**
 * base on @see https://blog.logrocket.com/virtual-scrolling-core-principles-and-basic-implementation-in-react/
 *
 */
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Input, NgZone, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { animationFrameScheduler, fromEvent, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { TsMonkeyPatchDataSource } from '../utils/datasource';

@Component({
    selector: 'tsmp-virtual-scroll',
    templateUrl: './viewport.html',
    styleUrls: ['./viewport.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TsMonkeyPatchVirtualViewport<T> implements OnDestroy, OnInit {

    /**
     * set item height
     *
     */
    @Input()
    itemHeight = 40

    /**
     * Datasource maybe we should add an Adapter to this one
     * sounds more logical
     *
     */
    @Input()
    source: TsMonkeyPatchDataSource<T>;

    /**
     * @todo remove
     *
     */
    items: T[] | readonly T[]

    /**
     * eine andere view müsste das auch wieder implementieren und sich selber connecten
     * dabei ist das gar nicht daran interessiert
     *
     */

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

    private scroll$: Subscription

    /**
     * max amount of items we expect
     *
     */
    private total: number

    /**
     * set the max height of the document to 1million px, by default chrome seems to handle a max height
     * of 33.5 Million Pixel but it seems even on less pixel (tested with 6 million) we got some scrolling issues like a 
     * rubber band
     * 
     * so set max_size of document to 750k pixels this seems to be good
     */
    private static MAX_SIZE = 1000 * 750

    /**
     * viewport which has the content
     *
     */
    @ViewChild('viewport', { read: ElementRef, static: true })
    private viewport: ElementRef<HTMLDivElement>

    /**
     * the content wrapper which holds the list and will be moved
     * via translateY
     *
     */
    @ViewChild('content', { read: ElementRef, static: true })
    private content: ElementRef<HTMLDivElement>

    /**
     * virtual space on bottom max height should be 750k px so we are
     * safe nothing breaks
     *
     */
    @ViewChild('virtualspace', { read: ElementRef, static: true })
    private virtualSpace: ElementRef<HTMLDivElement>

    constructor(
        private zone: NgZone,
        private renderer: Renderer2,
        private cdRef: ChangeDetectorRef
    ) {}

    ngOnInit(): void {
        this.initializeData()
        this.zone.runOutsideAngular(() => this.registerScrollEvent())
    }

    ngOnDestroy() {
        this.scroll$.unsubscribe()
        this.scroll$ = null
    }

    /**
     * initialize data 
     * 
     */
    private initializeData() {
        const viewportHeight = this.viewport.nativeElement.getBoundingClientRect().height
        this.pageSize = Math.floor(viewportHeight / this.itemHeight)

        this.source.change.subscribe((result) => {

            if (!this.total || this.total !== result.total) {
                this.resetScrollView(result.total, this.total !== undefined)
            }

            this.total = result.total
            this.items = result.items

            this.translateContent(result.items.length)
            this.cdRef.markForCheck()
        })

        this.source.load({start: 0, end: this.pageSize + this.tolerance * 2 })
    }

    /**
     *
     *
     */
    private resetScrollView(total: number, reset = false) {
        const totalHeight = Math.min(total * this.itemHeight, TsMonkeyPatchVirtualViewport.MAX_SIZE)
        this.renderer.setStyle(this.virtualSpace.nativeElement, `height`, `${totalHeight}px`)

        if (reset) {
            this.viewport.nativeElement.scrollTo({top: 0, left: 0})
        }
    }

    /**
     * register to scroll event and gets the item range
     * we want to show
     *
     */
    private registerScrollEvent() {
        this.scroll$ = fromEvent(this.viewport.nativeElement, "scroll")
            .pipe(
                debounceTime(0, animationFrameScheduler),
                map(() => this.getRange()),
                distinctUntilChanged((x, y) => x[0] === y[0] && x[1] === y[1]),
            )
            .subscribe((range) => {
                this.zone.run(() => this.source.load({start: range[0], end: range[1]}))
            })
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
        if (virtualHeight > TsMonkeyPatchVirtualViewport.MAX_SIZE) {

            const viewportHeight = this.viewport.nativeElement.clientHeight
            const offsetMax = TsMonkeyPatchVirtualViewport.MAX_SIZE - viewportHeight
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
        const totalHeight = Math.min(this.total * this.itemHeight, TsMonkeyPatchVirtualViewport.MAX_SIZE)

        if (!this.range) {
            return
        }

        const maxTop = Math.min(top, totalHeight - loaded * this.itemHeight)
        this.renderer.setStyle(this.content.nativeElement, 'transform', `translateY(${maxTop}px)`)
    }
}
