import { ElementRef, Host, OnDestroy, OnInit } from '@angular/core';
import { Directive, Input } from '@angular/core';
import { TsMonkeyPatchOverlayControl } from './overlay.control';
import { fromEvent, Subscription } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';

@Directive({
    selector: '[tsMonkeyPatchOverlayTrigger]',
    providers: [{ provide: 'trigger', useValue: true}]
})
export class TsMonkeyPatchOverlayTrigger implements OnDestroy, OnInit {

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
    ngOnInit() {
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
