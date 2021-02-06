# @tsmonkeypatch/core/common.NavigableListDirective 

Directive to enable keyboard control in a list.

## Usage

> Hint: you allways need to focus the list to make it navigable that means mouseclick inside the list
> or focus programatically.

@app.module.ts

```ts
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { TsMonkeyPatchCommonModule } from '@tsmonkeypatch/core/common';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    TsMonkeyPatchCommonModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
```

@app.component.ts

```ts
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: "app.html",
  styleUrls: ["./app.scss"]
})
export class AppComponent implements OnInit {
  public items: number[] = Array.from({length: 10}).map((_ ,index) => index);
}
```

@app.component.html

> could be also divs or anything else every tsmpNavigableListItem will be reached

```html
<ul tsmpNavigableList>
    <li *ngFor="let item of items" tsmpNavigableListItem>{{item}}</li>
</ul>
```

## Examples

### Example listen and control move to next item

To gain some control we can move to next item, we can listen to @Output.navigate and recive an **NavigableListEvent** which is an **AsyncEvent\<NavigationState\>** which is triggered before
we move to next item, so we pass it and will move on or cancel it and stay on position.

@app.component.ts

```ts
import { Component, OnInit } from '@angular/core';
import { NavigableListEvent } from '@tsmonkeypatch/core/common';

@Component({
  selector: 'app-root',
  templateUrl: "app.html",
  styleUrls: ["./app.scss"]
})
export class AppComponent implements OnInit {
    public items: number[] = Array.from({length: 10}).map((_ ,index) => index);

    /**
     * we not move out of range since we show 10 items
     */
    onNavigate($event: NavigableListEvent) {
        /** 
         * by default if we reach the end it will start on top
         * to avoid this we cancel the event and stop navigation.
         * 
         * @example
         * useful in datalist since we want load next dataset and keep
         * focus on last item.
         */
        const cancel = next >= this.items.length || next < 0
        cancel ? $event.cancel() : $event.next();
    }
}
```

@app.component.html

```html
<ul tsmpNavigableList (navigate)="onNavigate($event)">
    <li *ngFor="let item of items" tsmpNavigableListItem>{{item}}</li>
</ul>
```

## Api

### NavigableListDirective

#### KEY_CODE

```ts
export enum KEY_CODE {
    ARROW_DOWN = "ArrowDown",
    ARROW_UP = "ArrowUp"
}
```

#### NavigationState

|name|type|description|
|-|-|-|
|active|number|current index of focused node (not the array index, it is the HTMLElement.children index)|
|direction|-1\|1| the direction we currently move, -1 is up and 1 down|
|key|enum|current keycode as Enum ArrowUp or ArrowDown|
|next|number|next item index, allways active + direction (could be out of bounds)|

#### @Output

|name|type|description|
|-|-|-|
|navigate|EventEmitter\<NavigableListEvent\>|current state of navigation|

#### Methods

|name|params|description|
|-|-|-|
|setActiveItem|number|set active item, this will trigger a focus event on an item|


### NavigableListItemDirective

#### @Output
|name|type|description|
|-|-|-|
|onFocus|EventEmitter\<void\>|fires if the list item recieves focus|

