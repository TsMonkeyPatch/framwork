import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ProjectComponent } from './ui/project';

@NgModule({
    declarations: [],
    imports: [ 
        RouterModule.forChild([
            {
                path: "",
                component: ProjectComponent
            }
        ])
    ],
    exports: [
        RouterModule
    ],
    providers: [],
})
export class ProjectRoutingModule {}