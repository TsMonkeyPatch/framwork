import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TsMonkeyPatchCommonModule } from '@tsmonkeypatch/core/common';
import { TsMonkeyPatchVirtualViewport } from './ui/viewport';

@NgModule({
    declarations: [
        TsMonkeyPatchVirtualViewport
    ],
    imports: [
        CommonModule,
        TsMonkeyPatchCommonModule
    ],
    exports: [
        TsMonkeyPatchVirtualViewport
    ]
})
export class TsMonkeyPatchScrollModule {}
