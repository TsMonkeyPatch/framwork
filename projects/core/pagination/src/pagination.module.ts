import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Pagination } from './ui/pagination';
import { PaginationController } from './utils/pagination.controller';

@NgModule({
    declarations: [
        Pagination
    ],
    imports: [
        CommonModule
    ],
    providers: [
        PaginationController
    ],
    exports: [
        Pagination
    ]
})
export class TsMonkeyPatchPaginationModule {}
