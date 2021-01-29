# Pagination

Basic pagination module with customizeable template

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
    selector: 'table-page',
    templateUrl: './page.html'
})
export class TablePage implements OnInit, OnDestroy {

    private destroy$ = new Subject();

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
<ng-template #paginationTemplate let-data="data">
    <ul class="tsmp-pagination">
        <li (click)="prevPage()"> < </li>
        <li> {{data.active}} / {{data.total}}</li>
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

### TemplateData
