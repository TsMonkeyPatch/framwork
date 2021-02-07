import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubmitButton } from './ui/submit';
import { ProjectComponent } from './ui/project';
import { ProjectRoutingModule } from './project-routing.module';

@NgModule({
    declarations: [
        ProjectComponent,
        SubmitButton
    ],
    imports: [
        CommonModule,
        ProjectRoutingModule
    ],
    exports: [],
    providers: [],
})
export class ProjectModule {}