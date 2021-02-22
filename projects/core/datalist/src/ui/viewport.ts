/**
 * base on @see https://blog.logrocket.com/virtual-scrolling-core-principles-and-basic-implementation-in-react/
 *
 */
import { 
    AfterViewChecked,
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ElementRef,
    Input,
    NgZone,
    OnInit,
    Renderer2,
    ViewChild
} from '@angular/core';
import { animationFrameScheduler, fromEvent } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, startWith } from 'rxjs/operators';
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

        /**
         * @todo recalculate and scroll to top
         *
         */
    }

    /**
     * number of items in total
     *
     */
    get total(): number {
        return this.itemsTotal
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
    private tolerance = 4

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

    /**
     * max amount of items we expect
     *
     */
    private itemsTotal = 1000 * 1000 * 100

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
        const totalHeight = Math.min(this.itemsTotal * this.itemHeight, TsMonkeyPatchVirtualViewport.MAX_SIZE)
        this.renderer.setStyle(this.virtualSpace.nativeElement, `height`, `${totalHeight}px`)
    }

    /**
     * view has been checked, update css property transform: translateY if required
     *
     */
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
        let top  = this.viewport.nativeElement.scrollTop
        const toleranceHeight = this.tolerance * this.itemHeight

        let start = Math.max(Math.floor((top - toleranceHeight) / this.itemHeight), 0)
        let end   = Math.min(start + this.tolerance * 2 + 6, this.total)

        this.range = [start, end]

        /**
         * the original high is greater then MAX_SIZE, so convert the data
         * 
         */
        const virtualHeight = this.itemsTotal * this.itemHeight
        if (virtualHeight > TsMonkeyPatchVirtualViewport.MAX_SIZE) {

            const viewportHeight = this.viewport.nativeElement.clientHeight
            const offsetMax = TsMonkeyPatchVirtualViewport.MAX_SIZE - viewportHeight
            const offsetScrolled = Math.min(top, offsetMax);
            const virtualOffsetMax = virtualHeight - viewportHeight
            const virtualOffsetScrolled = offsetScrolled * virtualOffsetMax / offsetMax

            start = Math.max(Math.floor((virtualOffsetScrolled - toleranceHeight) / this.itemHeight), 0)
            end   = Math.min(start + this.tolerance * 2 + 6, this.total)
        }

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
