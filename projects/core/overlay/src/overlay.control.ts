import { Directive, ElementRef, EventEmitter, Host, HostListener, Inject, Input, OnDestroy, OnInit, Optional, Output, Renderer2, ViewContainerRef } from '@angular/core';
import { ConnectionPositionPair, Overlay, OverlayRef, PositionStrategy } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { fromEvent, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { PositionFactory } from './position.factory';
import { TsMonkeyPatchOverlayComponent } from './overlay';

export enum OverlayViewState {
    HIDDEN,
    VISIBLE
}

@Directive({
    selector: '[tsmpOverlay]'
})
export class TsMonkeyPatchOverlayControlDirective implements OnInit, OnDestroy {

    @Input()
    public tsmpOverlay: TsMonkeyPatchOverlayComponent = null;

    /**
     * sets width strategy for the overlay
     *
     * host - overlay gets the same width as the host element
     * none - width is set to auto
     *
     */
    @Input()
    public widthStrategy: 'host' | 'none' = 'none';

    @Input()
    public position: ConnectionPositionPair[];

    @Output()
    public viewStateChange: EventEmitter<OverlayViewState> = new EventEmitter();

    /**
     * overview ref
     *
     */
    private overlayRef: OverlayRef;

    /**
     * visible state
     *
     */
    private viewState = OverlayViewState.HIDDEN;

    /**
     *
     *
     */
    private destroy$: Subject<boolean> = new Subject();

    public constructor(
        private el: ElementRef<HTMLElement>,
        private overlay: Overlay,
        private renderer: Renderer2,
        private viewRef: ViewContainerRef,
        @Host() @Optional() @Inject('trigger') private hasTrigger: boolean
    ) {}

    /**
     * toggle between viewstate visible, hidden
     *
     */
    toggleOverlay() {
        this.viewState === OverlayViewState.HIDDEN ? this.openOverlay() : this.closeOverlay();
    }

    /**
     * register for document click event, so we are aware that we have clicked outside
     * of our overlay and it could be closed now
     *
     */
    @HostListener('document:click', ['$event.target'])
    onClick(targetElement: HTMLElement) {

        if (!this.overlayRef || !targetElement || this.viewState === OverlayViewState.HIDDEN) {
            return;
        }

        let clickOutside = !this.overlayRef.overlayElement.contains(targetElement);
        clickOutside = clickOutside && !this.el.nativeElement.contains(targetElement);
        clickOutside = clickOutside && targetElement !== this.el.nativeElement;

        if (clickOutside) {
            this.closeOverlay();
        }
    }

    ngOnInit() {
        if (!this.hasTrigger) {
            fromEvent(this.el.nativeElement, 'click')
                .pipe(takeUntil(this.destroy$))
                .subscribe(() => this.toggleOverlay());
        }
    }

    ngOnDestroy(): void {
        this.overlayRef.detach();
        this.overlayRef = null;

        this.destroy$.next(true);
        this.destroy$.complete();
        this.destroy$ = null;
    }
    
    /**
     * create and open a overlay if this not exists
     *
     */
    openOverlay() {

        if (this.viewState === OverlayViewState.VISIBLE) {
            return;
        }

        if (!this.overlayRef) {
            this.overlayRef = this.createOverlayRef();
        }

        const portal = new TemplatePortal(this.tsmpOverlay.template, this.viewRef);

        this.tsmpOverlay.control = this;
        this.overlayRef.attach(portal);
        this.viewState = OverlayViewState.VISIBLE;
        this.viewStateChange.emit(this.viewState);
    }

    /**
     * close overlay
     *
     */
    closeOverlay() {

        if (this.overlayRef && this.viewState === OverlayViewState.HIDDEN) {
            return;
        }

        this.overlayRef.detach();
        this.viewState = OverlayViewState.HIDDEN;
        this.viewStateChange.emit(this.viewState);
    }

    /**
     * after view initialized
     *
     */
    private createOverlayRef(): OverlayRef {

        const overlayRef = this.overlay.create({
            hasBackdrop: false,
            width: this.widthStrategy === 'host' ? this.el.nativeElement.offsetWidth : 'auto',
            panelClass: 'tsmp-overlay',
            positionStrategy: this.resolveOverlayPosition(),
            scrollStrategy: this.overlay.scrollStrategies.reposition()
        });

        this.renderer.setStyle(overlayRef.hostElement, 'position', 'relative');
        return overlayRef;
    }

    /**
     * resolve overlay position
     *
     */
    private resolveOverlayPosition(): PositionStrategy {

        return this.overlay.position()
            .flexibleConnectedTo(this.el.nativeElement)
            .withPositions(this.position ?? PositionFactory.verticalPositionPair())
            .withFlexibleDimensions(false)
            .withPush(false);
    }
}
