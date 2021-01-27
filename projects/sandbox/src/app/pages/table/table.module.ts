import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CdkTableModule } from '@angular/cdk/table';
import { TableRoutingModule } from './table.routing.module';
import { TablePagination } from './ui/pagination';
import { TableView } from './ui/table';
import { TablePage } from './ui/page';
import { TableActions } from './ui/actions';
import { TableProvider } from './utils/table.controller';

@NgModule({
    declarations: [
        TableActions,
        TablePage,
        TablePagination,
        TableView,
    ],
    imports: [
        CommonModule,
        CdkTableModule,
        TableRoutingModule
    ],
    providers: [
        TableProvider
    ],
    exports: []
})
export class TablePageModule {}
