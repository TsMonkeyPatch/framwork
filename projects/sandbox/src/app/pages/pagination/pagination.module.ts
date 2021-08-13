import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TsMonkeyPatchDatalistModule } from '@tsmonkeypatch/core/datalist';
import { TsMonkeyPatchOverlayModule } from '@tsmonkeypatch/core/overlay';
import { TsMonkeyPatchPaginationModule } from '@tsmonkeypatch/core/pagination';
import { PaginationPageRoutingModule } from './pagination-routing.module';
import { PaginationPage } from './ui/pagination';
import { PageSelectorComponent } from './ui/page-selector';

@NgModule({
    declarations: [
        PaginationPage,
        PageSelectorComponent
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
