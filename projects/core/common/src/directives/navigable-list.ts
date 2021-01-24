import { AfterViewInit, ContentChildren, Directive, ElementRef, EventEmitter, HostListener, Output, QueryList } from '@angular/core';
import { FocusableOption, FocusKeyManager } from '@angular/cdk/a11y';

/**
 * focusable item
 * 
 */
@Directive({
    selector: '[tsmpFocusable]',
    host: {
        tabIndex: "-1"
    }
})
export class TsMonkeyPatchFocusable implements FocusableOption {

    @Output()
    tsmpFocusable: EventEmitter<void> = new EventEmitter();

    constructor(
        private el: ElementRef<HTMLElement>
    ) {}

    focus(): void {
        this.el.nativeElement.focus();
        this.tsmpFocusable.emit();
    }
}

/**
 * focusable list directive
 *
 */
@Directive({
    selector: '[tsmpNavigableList]',
})
export class  TsMonkeyPatchNavigableList implements AfterViewInit {

    /**
     * das ist spannend das geht wirklich ...
     *
     */
    @ContentChildren(TsMonkeyPatchFocusable, {read: TsMonkeyPatchFocusable})
    public items: QueryList<TsMonkeyPatchFocusable>;

    /**
     * angular cdk keymanager to control keyboard navigation 
     *
     */
    private keyManager: FocusKeyManager<TsMonkeyPatchFocusable>;

    /**
     * construct focus key manager instance and pass focusable items
     *
     */
    ngAfterViewInit() {
        this.keyManager = new FocusKeyManager(this.items)
            .withWrap();
    }

    /**
     * catch and bypass keydown event to keymanager
     *
     */
    @HostListener('keydown', ['$event'])
    keyDown($event: KeyboardEvent) {
        this.keyManager.onKeydown($event);
    }
}
