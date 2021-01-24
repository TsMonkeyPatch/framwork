import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CheckboxGroup } from './checkbox-group';
import { ReactiveFormsModule } from '@angular/forms';
import { TsMonkeyPatchCommonModule } from '@tsmonkeypatch/core/common';

@NgModule({
    declarations: [
        CheckboxGroup
    ],
    imports: [
       CommonModule,
       ReactiveFormsModule,
       TsMonkeyPatchCommonModule
    ],
    exports: [
        CheckboxGroup,
    ]
})
export class TsMonkeyPatchCheckboxGroupModule {}
