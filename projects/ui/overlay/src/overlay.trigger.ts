import { ElementRef, Host, OnDestroy } from '@angular/core';
import { AfterViewInit, Directive, Input } from '@angular/core';
import { fromEvent, Subscription } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { TsMonkeyPatchOverlayControl } from './overlay.control';

@Directive({
    selector: '[tsMonkeyPatchOverlayTrigger]'
})
export class TsMonkeyPatchOverlayTrigger implements AfterViewInit, OnDestroy {

    @Input()
    public tsMonkeyPatchOverlayTrigger: 'click' | 'hover' | 'focus';

    private eventSubscription: Subscription;

    constructor(
        @Host() private overlayCtrl: TsMonkeyPatchOverlayControl,
        private el: ElementRef<HTMLElement>
    ) { }

    /**
     * view gets initialized
     *
     */
    ngAfterViewInit() {
        switch (this.tsMonkeyPatchOverlayTrigger) {
            case 'focus':
                this.registerFocusListener();
                break;

            case 'hover':
                this.registerHoverListener();
                break;

            default:
                this.registerClickListener();
        }
    }

    /**
     * component gets destroyed
     *
     */
    ngOnDestroy(): void {
        this.eventSubscription.unsubscribe();
        this.eventSubscription = null;
    }

    /**
     * register for mouseclick
     * 
     */
    private registerClickListener() {
        const click$ = fromEvent(this.el.nativeElement, 'click');
        this.eventSubscription = click$.subscribe(
            () => this.overlayCtrl.toggleOverlay());
    }

    /**
     * register mouseover stream
     *
     */
    private registerHoverListener() {
        const mouseover$ = fromEvent(this.el.nativeElement, 'mouseover');
        const mouseout$ = fromEvent(this.el.nativeElement, 'mouseout');

        this.eventSubscription = mouseover$.pipe(
            tap(() => this.overlayCtrl.openOverlay()),
            switchMap(() => mouseout$)
        ).subscribe(() => this.overlayCtrl.closeOverlay());
    }

    /**
     * register focus / blur listener
     *
     */
    private registerFocusListener() {
        const focus$ = fromEvent(this.el.nativeElement, 'focus');
        const blur$ = fromEvent(this.el.nativeElement, 'blur');

        this.eventSubscription = focus$.pipe(
            tap(() => this.overlayCtrl.openOverlay()),
            switchMap(() => blur$)
        ).subscribe(() => this.overlayCtrl.closeOverlay());
    }
}
