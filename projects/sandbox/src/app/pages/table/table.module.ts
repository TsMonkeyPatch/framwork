import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CdkTableModule } from '@angular/cdk/table';
import { TsMonkeyPatchPaginationModule } from '@tsmonkeypatch/core/pagination';

import { TableRoutingModule } from './table.routing.module';
import { TableView } from './ui/table';
import { TablePage } from './ui/page';
import { TableActions } from './ui/actions';
import { TableProvider } from './utils/table.controller';

@NgModule({
    declarations: [
        TableActions,
        TablePage,
        TableView,
    ],
    imports: [
        CommonModule,
        CdkTableModule,
        TableRoutingModule,
        TsMonkeyPatchPaginationModule
    ],
    providers: [
        TableProvider
    ],
    exports: []
})
export class TablePageModule {}
