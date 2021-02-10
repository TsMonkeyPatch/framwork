import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DatalistPage } from './ui/datalist';

@NgModule({
    declarations: [],
    imports: [ 
        RouterModule.forChild([
            {
                path: "",
                component: DatalistPage
            }
        ])
    ],
    exports: [
        RouterModule
    ],
    providers: [],
})
export class DetailListRoutingModule {}