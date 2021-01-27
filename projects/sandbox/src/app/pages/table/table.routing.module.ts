import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TablePage } from './ui/page';

@NgModule({
    declarations: [],
    imports: [
        CommonModule,
        RouterModule.forChild([{
            path: "",
            component: TablePage
        }])
    ],
    exports: [],
    providers: [],
})
export class TableRoutingModule {
}