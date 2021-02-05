import { AfterViewInit, ContentChildren, Directive, ElementRef, EventEmitter, HostListener, Output, QueryList } from '@angular/core';
import { FocusableOption, FocusKeyManager } from '@angular/cdk/a11y';
import { AsyncEvent } from '../utils/async-event';

export enum KEY_CODE {
    ARROW_DOWN = "ArrowDown",
    ARROW_UP = "ArrowUp"
}

export interface NavigationData {

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

    /**
     * direction we will move, -1 = up or 1 = down
     *
     */
    direction: 1 | -1;
}

export declare type NavigableListEvent = AsyncEvent<NavigationData>;

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
    private navigate: EventEmitter<NavigableListEvent> = new EventEmitter();

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
        this.navigate.observers.length && this.focusKeyManager.activeItem
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

    getActiveItemIndex(): number {
        return this.focusKeyManager.activeItemIndex;
    }

    /**
     * control navigation event before we move
     * 
     */
    private async beforeNext($event: KeyboardEvent) {

        const key = $event.key;

        if (key === KEY_CODE.ARROW_UP || key === KEY_CODE.ARROW_DOWN) {
            
            $event.stopPropagation();
            $event.preventDefault();

            const keyCode = key === KEY_CODE.ARROW_DOWN ? KEY_CODE.ARROW_DOWN : KEY_CODE.ARROW_UP;
            const direction: 1|-1 = key === KEY_CODE.ARROW_DOWN ? 1 : -1;
            const index = this.focusKeyManager.activeItemIndex + direction;

            /** create params */
            const params = { index, key: keyCode, direction };
            const event  = new AsyncEvent<NavigationData>(params);

            /** listen to container is completed and handle the response */
            event.closed.subscribe((result) => {
                result ? this.focusKeyManager.onKeydown($event) : void 0;
            });

            /** emit container through event emitter */
            this.navigate.emit(event);
        }
    }
}
