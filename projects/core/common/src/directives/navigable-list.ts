import { AfterViewInit, ContentChildren, Directive, ElementRef, EventEmitter, HostListener, Output, QueryList } from '@angular/core';
import { FocusableOption, FocusKeyManager } from '@angular/cdk/a11y';

/**
 * Directive for a focusable item
 * 
 */
@Directive({
    selector: '[tsmpNavigableListItem]',
    host: {
        tabIndex: "-1"
    }
})
export class TsMonkeyPatchNavigableListItem implements FocusableOption {

    /**
     * output event to get notified we focused the current element
     *
     */
    @Output()
    onFocus: EventEmitter<void> = new EventEmitter();

    constructor(
        private el: ElementRef<HTMLElement>
    ) {}

    /**
     * element gets the focus, programatically focus the html input element
     * and notify the observers
     *
     */
    focus(): void {
        this.el.nativeElement.focus();
        this.onFocus.emit();
    }
}

/**
 * Directive for a focusable list
 *
 */
@Directive({
    selector: '[tsmpNavigableList]',
})
export class  TsMonkeyPatchNavigableList implements AfterViewInit {

    /**
     * all content children which are focusable
     *
     */
    @ContentChildren(TsMonkeyPatchNavigableListItem, {read: TsMonkeyPatchNavigableListItem})
    private items: QueryList<TsMonkeyPatchNavigableListItem>;

    /**
     * focus keymanager from angular cdk which helps us to delegate through html elements
     * with the keyboard
     *
     */
    private focusKeyManager: FocusKeyManager<TsMonkeyPatchNavigableListItem>;

    /**
     * construct focus key manager instance and pass focusable items
     *
     */
    ngAfterViewInit() {
        this.focusKeyManager = new FocusKeyManager(this.items)
            .withWrap();
    }

    /**
     * handle the keydown event and pass directly to focus keymanager
     *
     */
    @HostListener('keydown', ['$event'])
    onKeydown($event: KeyboardEvent) {
        this.focusKeyManager.onKeydown($event);
    }
}
