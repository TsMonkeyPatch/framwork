[![CodeFactor](https://www.codefactor.io/repository/github/tsmonkeypatch/framwork/badge/master)](https://www.codefactor.io/repository/github/tsmonkeypatch/framwork/overview/master)

# TsMonkeyPatch Core

Angular Library with several modules created as part of the [YouTube project](https://www.youtube.com/channel/UCq6b8A1Je9oPdJAoorfeDQw) which is constantly growing. Each module can be imported and used separately.

## Install

```bash
npm i --save @tsmonkeypatch/core @angular/cdk
```

## @example

```ts
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {TsMonkeyPatchPaginationModule} from '@tsmonkeypatch/core/pagination';
import {TsMonkeyPatchOverlayModule} from '@tsmonkeypatch/core/overlay';

@NgModule({
  declarations: [
    AppComponent,
    DataPage
  ],
  imports: [
    TsMonkeyPatchOverlayModule,
    TsMonkeyPatchPaginationModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
```

## Modules

### [TsMonkeyPatchCommonModule](https://github.com/TsMonkeyPatch/framwork/tree/master/projects/core/common/README.md)
Collection of directives and services which can generally be used.

---

### [TsMonkeyPatchPaginationModule](https://github.com/TsMonkeyPatch/framwork/tree/master/projects/core/pagination/README.md)

Basic pagination module with interchangeable template.

---

### [TsMonkeyPatchOverlayModule](https://github.com/TsMonkeyPatch/framwork/tree/master/projects/core/overlay/README.md)

Creates an empty dropdown / overlay which is aligned to an element, can be used for tooltips, combobox, menu or anything else.

---

### [TsMonkeyPatchDatalistModule](https://github.com/TsMonkeyPatch/framwork/tree/master/projects/core/datalist/README.md)

Datalist which lazy loads and render only a specific amount of items, could handle large datasets with more then millions of entries.
