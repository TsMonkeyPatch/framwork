# Pagination

Basic pagination module with customizeable template

## Youtube

[Pagination 1/2 - Source code](https://youtu.be/__nvKFrqREs)
[Pagination 2/2 - apply custom template](https://youtu.be/Kx3t7UZhCYY)

## Usage

```ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TsMonkeyPatchPaginationModule } from '@tsmonkeypatch/core/pagination';

@NgModule({
    declarations: [
        ...
    ],
    imports: [
        TsMonkeyPatchPaginationModule
    ],
    providers: [
        ...
    ],
    exports: []
})
export class AppModule {}
```

app.component.ts

```ts
@Component({
    selector: 'app-page',
    templateUrl: './page.html'
})
export class AppPage implements OnInit, OnDestroy {

    private destroy$: Subject<boolean> = new Subject();

    constructor(
        private paginationCtrl: PaginationController
    ) {}

    ngOnInit(): void {
        /**
         * initialize pagination or update to force repaint
         *
         */
        this.paginationCtrl.update({
            page: 1,
            total: 2000000
        });

        this.paginationCtrl.pageChange
            .pipe(takeUntil(this.destroy$))
            .subscribe((page: number) => this.loadData(page))
    }

    ngOnDestroy() {
        this.destroy$.next(true);
        this.destroy$.complete();
        this.destroy$ = null;
    }

    private loadData(page: number) {
        ...
    }
}

```

app.component.html (i currently used bootstrap grid for the styles, this is not required )

```html
<div class="container-fluid">
    <div class="row">

        <div class="col-3">
            <h1>Filter goes here</h1>
        </div>

        <div class="col d-flex flex-column">
            <tsmp-pagination></tsmp-pagination>

            <div class="my_content"></div>

            <tsmp-pagination></tsmp-pagination>
        </div>
    </div>
</div>
```

## Examples

### CustomTemplate

```html
<!-- define your custom template -->
<ng-template #paginationTemplate let-state="state">
    <ul class="tsmp-pagination">
        <li (click)="prevPage()"> < </li>
        <li> {{state.active}} / {{state.total}}</li>
        <li (click)="nextPage()"> > </li>
    </ul>
</ng-template>

<div class="container-fluid">
    <div class="row">
        <div class="col d-flex flex-column">
            <tsmp-pagination [template]="#paginationTemplate"></tsmp-pagination>

            <div class="my_content"></div>
            
            <!-- still using default template -->
            <tsmp-pagination></tsmp-pagination>
        </div>
    </div>
</div>
```

## Api

### PaginationData

Data which is passed to a template

|name|type|description|
|-|-|-|
|items|PaginationItem|Page items like [1, '...', 5, 6, 7, '...', lastpage]|
|state|PaginationState|All informations about current state|

---

### PaginationItem 

|name|type|description|
|-|-|-|
|clickable|boolean|item can activated, false for current page or '...'|
|text|string|text for the pagination item|
|value|string \| number|the current value for the pagination item|

---

### PaginationState 

|name|type|description|
|-|-|-|
|active|number|current page which is active|
|isLast|boolean|true if the active page is the last page|
|isFirst|boolean|true if the active page is the first page|
|total|number|total amount of pages|

---

### PaginationSetting 

|name|type|description|
|-|-|-|
|page|number|current page which should be active|
|total|boolean|total amount of pages|
|displayCount *optional*|number|maximum amount of pages which should be shown at once (default 5)|

---

### PaginationController

#### Properties

|name|type|description|
|-|-|-|
|change|Observable\<PaginationData\>|emits if the page data has been changed|
|pageChange|Observable\<number\>|emits if the page has been changed|
|@readonly settings|PaginationSetting|current settings for pagination|

---

#### Methods

|name|type|description|
|-|-|-|
|goTo(page: number)|void|activate given page and update pagination data|
|nextPage()|void|activate next page|
|prevPage()|void|activate previous page|
|update(setting: Setting)|void|update settings, update pagination data|
