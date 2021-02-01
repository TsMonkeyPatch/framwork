import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { TsMonkeyPatchCommonModule } from '@tsmonkeypatch/core/common';
import { TsMonkeyPatchOverlayModule } from '@tsmonkeypatch/core/overlay';
import { TsMonkeyPatchPaginationModule } from '@tsmonkeypatch/core/pagination';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DataPage } from './components/datapage';

@NgModule({
  declarations: [
    AppComponent,
    DataPage
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    TsMonkeyPatchCommonModule,
    TsMonkeyPatchOverlayModule,
    TsMonkeyPatchPaginationModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
