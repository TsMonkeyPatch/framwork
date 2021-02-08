import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TsMonkeyPatchOverlayModule } from '@tsmonkeypatch/core/overlay';
import { TsMonkeyPatchDatalistModule } from '@tsmonkeypatch/core/datalist';
import { TsMonkeyPatchPaginationModule } from '@tsmonkeypatch/core/pagination';
import { PaginationPageRoutingModule } from './pagination-routing.module';
import { PaginationPage } from './ui/pagination';
import { PageSelector } from './ui/page-selector';
import { FormsModule } from '@angular/forms';

@NgModule({
    declarations: [
        PaginationPage,
        PageSelector
    ],
    imports: [
        CommonModule,
        FormsModule,
        PaginationPageRoutingModule,
        TsMonkeyPatchDatalistModule,
        TsMonkeyPatchOverlayModule,
        TsMonkeyPatchPaginationModule
    ],
    exports: [],
    providers: [],
})
export class PaginationPageModule {
}
