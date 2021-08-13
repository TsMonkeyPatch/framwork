import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaginationComponent } from './ui/pagination';
import { PaginationController } from './utils/pagination.controller';

@NgModule({
    declarations: [
        PaginationComponent
    ],
    imports: [
        CommonModule
    ],
    providers: [
        PaginationController
    ],
    exports: [
        PaginationComponent
    ]
})
export class TsMonkeyPatchPaginationModule {}
