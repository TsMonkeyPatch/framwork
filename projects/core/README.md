# TsMonkeyPatch Core

Angular Library with several modules created as part of the [YouTube project](https://www.youtube.com/results?search_query=TsMonkeyPatch) which is constantly growing. Each module can be imported and used separately.

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

### [TsMonkeyPatchCommonModule]()

#### Directives

- [Sticky](https://github.com/TsMonkeyPatch/framwork/tree/master/projects/core/common/docs/sticky.md)
Simple directive the html element stays on top if we scrolled down.

#### Providers

- [WindowScroll](https://github.com/TsMonkeyPatch/framwork/tree/master/projects/core/common/docs/window-scroll.md)
Provider to observe window scroll event or scroll to a specific position.

---

### [TsMonkeyPatchPaginationModule](https://github.com/TsMonkeyPatch/framwork/tree/master/projects/core/pagination/README.md)

Basic pagination module with interchangeable template.

---

### [TsMonkeyPatchOverlayModule](https://github.com/TsMonkeyPatch/framwork/tree/master/projects/core/overlay/README.md)

Creates an empty dropdown / overlay which is aligned to an element, can be used for tooltips, combobox, menu or anything else.
