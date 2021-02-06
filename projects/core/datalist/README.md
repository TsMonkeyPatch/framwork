# @tsmonkeypatch/core/datalist

Works like @angular/cdk/scroll but only shows a list of items which can be navigated by keyboard or mousewheel and no scrollbars.

## Motivation

@angular/cdk/scroll has one big problem in my opinion this are very large datasets, since this one is working with arrays this will be as big as the number of items we expect to recieve. This is okay for datasets of 10k or maybe 100k items but if we go forward and expect datasets which could have Millions of entries we get a huge problem.

@Example

```ts
/** 
 * 10 million entries there could be more in big data
 * memory usage of chrome grows up to 2.4gb and got the
 * message "he is dead jim"
 * 
 * anyway if we not add the map, the browser will stay alive
 * but there is allways an array in the background of the scroll
 * which will be filled up and this one will have 10.000.000 entries
 * 
 */
Array.from({length: 10000000}).map((value, index) => index);
```

A big pro is they use the scrollbars of the browser se they dont need a scrollbar library (customizing is not a problem which can be solved by css), but to make this possible they add a container after the list which simply gets a specific height like 40px height per item multiplied with the total amount of items. 

- 10k items * 40px = 400.000px (easy)
- 100k items * 40px = 4.000.000px (easy)
- 10M items * 40px = 400.000.000px (okay at this point we become some serious trouble, if the array creation not crashed the browser allready).

So @angular/cdk/scrolling is perfectly fine with datasets which have 10k items at least 100k is also okay so this could be used, we just want to resolve the issue that we can have really big data. 

## Usage

@app.module.ts

```ts
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { TsMonkeyPatchDatalistModule } from '@tsmonkeypatch/core/datalist';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent,
    DataPage
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    TsMonkeyPatchDatalistModule
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
export class AppComponent {
  /**
   * this is our datasource, could be an array or an Instance of DataSource
   * to keep things more simple we pass an array ;) this one will converted
   * to an MemoryDataSource internally and should not be used for large data sets.
   * 
   */
  public data: number[] = Array.from(Array(40)).map((value ,index) => index);
}
```

@app.component.html

```html
    <tsmp-datalist [displayCount]=5 [source]="data"></tsmp-datalist>
```

## Example Infinite Datasource

Create a own datasource, since i dont have any backend now we just create a data source which has unlimited amount of items. To make this work we just have to extend
**DataProvider** and implement a can load method and fetch method.

@infinite-data.source.ts

```ts
import { DataProvider } from "@tsmonkeypatch/core/datalist";
import { Observable, of } from "rxjs";

export class InfiniteDataSource extends DataProvider<number> {

    /**
     * if this returns false no data will be loaded
     * 
     */
    canLoad(): boolean {
        return true;
    }

    /**
     * fetch data, in this case just the amount we need, so this will
     * load endless numbers (never reached the end now just give up on 3k)
     *
     */
    protected fetch(start: number, count: number): Observable<number[]> {

        const data = Array(count);
        const max = start + count;

        for(let i = start, j = 0; i < max; i++, j++) {
            data[j] = i;
        }
        return of(data);
    }
}
```

@infinite-data.ts

```ts
import { Component, OnInit } from '@angular/core';
import { InfiniteDataSource } from './infinite-data.source';

@Component({
    selector: 'app-infinita-data',
    templateUrl: './infinite-data.html'
})
export class InfiniteDataComponent implements OnInit {

    public dataSource: InfiniteDataSource;

    ngOnInit(): void {
        this.dataSource = new InfiniteDataSource();
    }
}
```

@infinite-data.html

```html
<!-- show 10 items and pass our data source -->
<tsmp-datalist [displayCount]="10" [source]="dataSource">
</tsmp-datalist>
```

## Api

### @Input

|name|type|description|
|-|-|-|
|source|Array\<T\>\|DataSource\<T\>|Datasource which provides the data|
|displayCout|number|Amount of items which will be shown at once|