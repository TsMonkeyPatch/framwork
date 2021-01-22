import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SandboxFormsRoutingModule } from './forms.routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsPage } from './ui/forms';

@NgModule({
    declarations: [
        FormsPage
    ],
    imports: [
        CommonModule,
        SandboxFormsRoutingModule,
        ReactiveFormsModule,
    ]
})
export class SandboxFormsModule {
}
