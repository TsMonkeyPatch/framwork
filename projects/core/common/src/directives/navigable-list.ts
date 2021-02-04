import { AfterViewInit, ContentChildren, Directive, ElementRef, EventEmitter, HostListener, Output, QueryList } from '@angular/core';
import { FocusableOption, FocusKeyManager } from '@angular/cdk/a11y';
import { AsyncEvent } from '../utils/async-event';

export enum KEY_CODE {
    ARROW_DOWN = "ArrowDown",
    ARROW_UP = "ArrowUp"
}

export interface NavigableListBeforeNextEvent {

    /**
     * event container to get the result of the event
     *
     */
    event: AsyncEvent;

    /**
     * current keycode , arrow down or up 
     *
     */
    key: KEY_CODE;

    /**
     * item index which is currently active
     *
     */
    index: number;
}

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
        private el: ElementRef<HTMLElement>,
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
     * before next item event
     * this emits an async event where we can wait for a response
     *
     */
    @Output()
    private beforeNextItem: EventEmitter<NavigableListBeforeNextEvent> = new EventEmitter();

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
        this.focusKeyManager = new FocusKeyManager(this.items).withWrap();
    }

    /**
     * handle the keydown event and pass directly to focus keymanager
     *
     */
    @HostListener('keydown', ['$event'])
    onKeydown($event: KeyboardEvent) {
        this.beforeNextItem.observers.length && this.focusKeyManager.activeItem
            ? this.beforeNext($event)
            : this.focusKeyManager.onKeydown($event);
    }

    /**
     *
     *
     */
    setActiveItem(index: number) {
        this.focusKeyManager.setActiveItem(index);
        this.focusKeyManager.activeItem.focus();
    }

    /**
     * handle before next
     * 
     */
    private async beforeNext($event: KeyboardEvent) {

        const key = $event.key;

        if (key === KEY_CODE.ARROW_UP || key === KEY_CODE.ARROW_DOWN) {
            
            $event.stopPropagation();
            $event.preventDefault();

            const event     = new AsyncEvent();
            const keyCode   = key === KEY_CODE.ARROW_DOWN ? KEY_CODE.ARROW_DOWN : KEY_CODE.ARROW_UP;
            const direction = key === KEY_CODE.ARROW_DOWN ? 1 : -1;
            const index     = this.focusKeyManager.activeItemIndex + direction;

            event.completed.subscribe((result) => {
                result ? this.focusKeyManager.onKeydown($event) : void 0;
            });

            this.beforeNextItem.emit({ event, key: keyCode, index });
        }
    }
}
