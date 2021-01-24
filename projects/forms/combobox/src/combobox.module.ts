import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { TsMonkeyPatchOverlayModule } from '@tsmonkeypatch/core/overlay';
import { Combobox } from './combobox';

@NgModule({
    declarations: [
        Combobox
    ],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        TsMonkeyPatchOverlayModule
    ],
    exports: [
        Combobox
    ]
})
export class TsMonkeyPatchComboboxModule {
}
