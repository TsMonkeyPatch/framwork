import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { TsMonkeyPatchCommonModule } from '@tsmonkeypatch/core/common';
import { TsMonkeyPatchPaginationModule } from '@tsmonkeypatch/core/pagination';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TsMonkeyPatchDatalistModule } from '@lib/core/datalist/public-api';
import { TsMonkeyPatchVirtualScrollModule } from '@lib/core/virtual-scroll/public-api';
import { TsMonkeyPatchOverlayModule } from '@lib/core/overlay/public-api';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    ReactiveFormsModule,
    HttpClientModule,
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
