# @tsmonkeypatch/core/common/StickyDirective 
Simple directive the html element stays on top if we scrolled down.

## Usage

```ts
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { TsMonkeyPatchCommonModule } from '@tsmonkeypatch/core/common';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    TsMonkeyPatchCommonModule,
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
```

in the app.component.html

```html
<div class="header">
    <img src="./assets/img/ts-logo.svg" style="height: 150px" class="logo">

    <!-- navbar stays allways visible (bootstrap not required)-->
    <nav class="navbar navbar-expand navbar-light bg-light" tsMonkeyPatchSticky> 
        <a class="navbar-brand">TsMonkeypatch</a>
    </nav>

</div>
```
