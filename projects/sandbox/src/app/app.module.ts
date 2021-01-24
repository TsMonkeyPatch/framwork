import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { TsMonkeyPatchCommonModule } from '@tsmonkeypatch/core/common';
import { TsMonkeyPatchOverlayModule } from '@tsmonkeypatch/core/overlay';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    TsMonkeyPatchCommonModule,
    TsMonkeyPatchOverlayModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
