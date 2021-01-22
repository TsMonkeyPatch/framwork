import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsPage } from './ui/forms';

@NgModule({
    imports: [
        RouterModule.forChild([{
            path: "",
            component: FormsPage
        }])
    ],
    exports: [
        RouterModule
    ]
})
export class SandboxFormsRoutingModule {
}
