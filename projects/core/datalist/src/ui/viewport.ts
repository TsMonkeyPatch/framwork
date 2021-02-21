/**
 * base on @see https://blog.logrocket.com/virtual-scrolling-core-principles-and-basic-implementation-in-react/
 *
 */
import { AfterViewChecked, AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Input, NgZone, OnInit, Renderer2, ViewChild } from '@angular/core';
import { animationFrameScheduler, fromEvent } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, startWith, tap } from 'rxjs/operators';
import { DataProvider } from '../utils/data.provider';

@Component({
    selector: 'tsmp-datalist-viewport',
    templateUrl: './viewport.html',
    styleUrls: ['./viewport.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TsMonkeyPatchVirtualViewport implements AfterViewChecked, AfterViewInit, OnInit {

    /**
     * set item height
     *
     */
    @Input()
    itemHeight = 40

    /**
     * sets total amount of items
     *
     */
    @Input()
    set total(count: number) {
        if (count !== this.itemsTotal) {
            this.itemsTotal = count
        }
    }

    /**
     * Datasource maybe we should add an Adapter to this one
     * sounds more logical
     *
     */
    @Input()
    source: DataProvider<any>;

    /**
     * @todo remove
     *
     */
    items: string[]

    /**
     * tolerance on bottom and top
     *
     */
    private tolerance = 2

    /**
     * current range we have loaded
     *
     */
    private range: number[]

    /**
     * flag for afterViewChecked the range should be updated
     *
     */
    private rangeNeedsUpdate = false

    get total(): number {
        return this.itemsTotal
    }

    /**
     * max amount of items we expect
     *
     */
    private itemsTotal = 1000 * 10 * 10

    /**
     * set the max size to 6 Million pixel to avoid rendering issues (even with scrollbars)
     * if itemsTotal * itemSize > 6 Million we have to scale this down
     * if we come bigger then we have to convert down to maximum of 6 Million
     * 
     * @see https://stackoverflow.com/questions/10882769/do-the-browsers-have-a-maximum-height-for-the-body-document
     * 
     * Chrome: 512,000,000
     * Firefox: 6,000,000
     * IE8-9: 1,000,000 // should be obsolet
     * IE6-7: 128,000,000 (yes, more than newer IEs)
     *
     */
    private static MAX_SIZE = 6 * 1000 * 1000 * 1000

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
     * virtual space on bottom max height should be 500k px so we are
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

    /**
     * register scroll events
     * 
     */
    ngOnInit(): void {
        this.registerEvents()
    }

    /**
     * after everything has been initialized (eq content)
     *
     */
    ngAfterViewInit(): void {
        /**
         * set height of virtual padding element
         *
         */
        const totalHeight = Math.min(this.itemsTotal * this.itemHeight, TsMonkeyPatchVirtualViewport.MAX_SIZE)
        this.renderer.setStyle(this.virtualSpace.nativeElement, `height`, `${totalHeight}px`)
    }

    ngAfterViewChecked(): void {

        if (this.rangeNeedsUpdate) {
            this.translateContent()
            this.rangeNeedsUpdate = false
        }
    }

    /**
     * register events
     *
     */
    private registerEvents() {
        this.zone.runOutsideAngular(() => this.registerScrollEvent())
    }

    /**
     * register to scroll event and gets the item range
     * we want to show
     *
     */
    private registerScrollEvent() {
        fromEvent(this.viewport.nativeElement, "scroll")
            .pipe(
                startWith(),
                debounceTime(0, animationFrameScheduler),
                map(() => this.getRange()),
                distinctUntilChanged((x, y) => x[0] === y[0] && x[1] === y[1])
            )
            .subscribe((range) => {
                this.range = range
                this.source.load(range[0], range[1] - range[0])
                this.rangeNeedsUpdate = true

                this.zone.run(() => this.cdRef.markForCheck())
            })
    }
 
    /**
     * get range to render next
     *
     */
    private getRange(): [number, number] {
        const top  = this.viewport.nativeElement.scrollTop
        const toleranceHeight = this.tolerance * this.itemHeight
        const start = Math.max(Math.floor((top - toleranceHeight) / this.itemHeight), 0)
        const end   = Math.min(start + this.tolerance * 2 + 6, this.total)

        return [start, end]
    }

    /**
     * move content to correct position
     *
     */
    private translateContent() {
        const top = this.range[0] * this.itemHeight
        const totalHeight = Math.min(this.itemsTotal * this.itemHeight, TsMonkeyPatchVirtualViewport.MAX_SIZE)
        const maxTop = Math.min(top, totalHeight - this.content.nativeElement.getBoundingClientRect().height)
        this.renderer.setStyle(this.content.nativeElement, 'transform', `translateY(${maxTop}px)`)
    }
}
