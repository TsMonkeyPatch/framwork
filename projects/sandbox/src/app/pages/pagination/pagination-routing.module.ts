import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PaginationPage } from './ui/pagination';

@NgModule({
    declarations: [],
    imports: [ 
        RouterModule.forChild([
            {
                path: "",
                component: PaginationPage
            }
        ])
    ],
    exports: [
        RouterModule
    ],
    providers: [],
})
export class PaginationPageRoutingModule {}