import { AfterViewInit, ChangeDetectorRef, Directive, ElementRef, Host, HostBinding, NgZone, OnDestroy, Optional, Renderer2, SkipSelf } from '@angular/core';
import { WindowScrollProvider } from '../utils/window-scroll';
import { Subscription } from 'rxjs';
import { distinctUntilChanged, map, startWith } from 'rxjs/operators';

export interface ElementBounds {
    top: number;
    left: number;
    height: number;
    width: number;
    x: number;
    y: number;
}

@Directive({
    selector: '[tsMonkeyPatchSticky]',
})
export class TsMonkeyPatchStickyDirective implements AfterViewInit, OnDestroy {

    @HostBinding('class.is-sticky')
    get className(): boolean {
        return this.isSticky;
    }

    /**
     * initial element bounds
     *
     */
    private bounds: ElementBounds = null;

    /**
     * placeholder we use to keep the height of the parent element, since we switch
     * from position: static (this is default) to fixed the height of the parent will not
     * affected by the sticky element anymore and the whole page becomes smaller which leads
     * to wrong results
     *
     */
    private placeHolder: HTMLDivElement = null;

    /**
     * holds subscription on window.scroll
     *
     */
    private scrollSubscription: Subscription = null;

    /**
     * if true we set the class is-sticky to our host element
     *
     */
    private isSticky = false;

    public constructor(
        @Optional() @Host() @SkipSelf() private hostEl: ElementRef<HTMLElement>,
        private el: ElementRef<HTMLElement>,
        private renderer: Renderer2,
        private scrollProvider: WindowScrollProvider,
        private zone: NgZone,
        private cdRef: ChangeDetectorRef
    ) { }

    ngAfterViewInit() {
        this.zone.runOutsideAngular(() => {
            window.setTimeout(() => {
                this.bounds = this.resolveBounds();
                this.createPlaceholder();
                this.initializeScrollObserver();
            }, 0);
        })
    }

    ngOnDestroy() {
        this.scrollSubscription.unsubscribe();
        this.scrollSubscription = null;
    }

    /**
     * register to window scroll event so we get notified if we apply scroll
     *
     */
    private initializeScrollObserver() {

        this.scrollSubscription = this.scrollProvider.scroll()
            .pipe(
                startWith({top: window.scrollY, left: 0}),
                map((position) => position.top >= this.bounds.top),
                distinctUntilChanged()
            )
            .subscribe((sticky) => this.toggleSticky(sticky));
    }

    /**
     * toggle sticky mode
     *
     */
    private toggleSticky(isSticky: boolean) {

        this.renderer.setStyle(this.el.nativeElement, 'position', isSticky ? 'fixed' : null);
        this.renderer.setStyle(this.el.nativeElement, 'top', isSticky ? '0px' : null);
        this.renderer.setStyle(this.placeHolder, 'display', isSticky ? 'block' : 'none');

        this.isSticky = isSticky;
        this.cdRef.detectChanges();
    }

    /**
     * create a placeholder which will shown if element is sticky
     * 
     */
    private createPlaceholder() {
        this.placeHolder = this.renderer.createElement('div');

        this.renderer.setStyle(this.placeHolder, 'display', 'none');
        this.renderer.setStyle(this.placeHolder, 'height', this.bounds.height);
        this.renderer.setStyle(this.placeHolder, 'width', this.bounds.width);

        this.renderer.insertBefore(this.hostEl.nativeElement, this.placeHolder, this.el.nativeElement);
    }

    /**
     * resolve bounds which are required for the position
     *
     */
    private resolveBounds(): ElementBounds {

        const bounds: Partial<ElementBounds> = {
            top: 0,
            left: 0
        };

        let node = this.el.nativeElement;

        do {
            bounds.top += node.offsetTop;
            bounds.left += node.offsetLeft;
            node = node.offsetParent as HTMLElement;
        } while(node);

        return {
            ...this.el.nativeElement.getBoundingClientRect().toJSON(),
            ...bounds
        }
    }
}
