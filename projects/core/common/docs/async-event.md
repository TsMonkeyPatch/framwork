# @tsmonkeypatch/core/common.AsyncEvent

Event Container which accepts parameters and will passed through an EventEmitter.

## Motivation

Normal event emitters are fire and forget, so we are never notified of a result. In some cases, however, we want to be able to cancel or execute events depending on the result of the event.

The AsyncEvent is an event container which accepts parameters and can then be read out by everyone who listens to it and can be canceled or completed.

## Usage

This is a very basic example, i use this behavior in NavigableList to know we can move to next element or not but i want to keep things more simple.

@framework-selector.ts

```ts
import { Component, EventEmitter } from '@angular/core';
import { AsyncEvent } from '@tsmonkeypatch/core/common';

export enum FrameWork {
    Angular,
    Vue,
    FrameWork
}

export declare type FrameworkSelectEvent = AsyncEvent<FrameWork>;

/**
 * Directive for a focusable list
 *
 */
@Component({
    selector: '[app-framework-selector]',
    templateUrl: './framework-selector.html'
})
export class FrameworkSelector {

    @Output()
    selectFramework: EventEmitter<FrameworkSelectEvent> = new EventEmitter();

    /**
     * control navigation event before we move
     * 
     */
    chooseFramework(framework: Framework) {

        $event.stopPropagation();
        $event.preventDefault();

        /** create params */
        const event  = new AsyncEvent<Framework>(framework);

        /** listen to container is completed and handle the response */
        event.complete.subscribe((result: boolean) => {
            if (result) {
                this.saveFramework(framework);
            }
        });

        /** emit container through event emitter */
        this.selectFramework.emit(event);
    }

    private saveFramework(framework: Framework) {
        ...
    }
}
```

@project.ts

```ts
import { Component, EventEmitter } from '@angular/core';
import { FrameworkSelectEvent, Framework } from './select-framework';

@Component({
    selector: '[app-project]',
    templateUrl: './project.html'
})
export class ProjectComponent {

    /**
     * control navigation event before we move
     * 
     */
    onSelectFramework($event: FrameworkSelectEvent) {

        const selectedFramework = $event.params;
        const useFramework = selectedFramework === Framework.Angular || selectedFramework === Framework.Vue;

        /** 
         * include only angular and vue, if this passed send next
         * otherwise cancel the event
         * 
         */
        useFramework ? $event.next() : $event.cancel();
    }
}
```

@project.html

```html
<app-framework-selector (selectFramework)="onSelectFramework($event)">
</app-framework-selector>
```
