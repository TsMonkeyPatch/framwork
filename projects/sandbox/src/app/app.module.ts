import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { TsMonkeyPatchCommonModule } from '@tsmonkeypatch/core/common';
import { TsMonkeyPatchOverlayModule } from '@tsmonkeypatch/core/overlay';
import { TsMonkeyPatchPaginationModule } from '@tsmonkeypatch/core/pagination';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TsMonkeyPatchDatalistModule } from '@lib/core/datalist/public-api';
import { TsMonkeyPatchVirtualScrollModule } from '@lib/core/virtual-scroll/public-api';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    TsMonkeyPatchCommonModule,
    TsMonkeyPatchOverlayModule,
    TsMonkeyPatchPaginationModule,
    TsMonkeyPatchDatalistModule,
    TsMonkeyPatchVirtualScrollModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
