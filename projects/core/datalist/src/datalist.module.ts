import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TsMonkeyPatchCommonModule } from '@tsmonkeypatch/core/common';
import { TsMonkeyPatchDatalist } from './ui/datalist';
import { TsMonkeyPatchVirtualViewport } from './ui/viewport';

@NgModule({
    declarations: [
        TsMonkeyPatchDatalist,
        TsMonkeyPatchVirtualViewport
    ],
    imports: [
        CommonModule,
        TsMonkeyPatchCommonModule
    ],
    exports: [
        TsMonkeyPatchDatalist,
        TsMonkeyPatchVirtualViewport
    ]
})
export class TsMonkeyPatchDatalistModule {}
