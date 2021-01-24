import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CheckboxGroup } from './checkbox-group';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
    declarations: [
        CheckboxGroup
    ],
    imports: [
       CommonModule,
       ReactiveFormsModule
    ],
    exports: [
        CheckboxGroup,
    ]
})
export class TsMonkeyPatchCheckboxGroupModule {}
