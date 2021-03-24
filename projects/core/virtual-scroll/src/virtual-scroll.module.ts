import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TsMonkeyPatchCommonModule } from '@tsmonkeypatch/core/common';
import { TsMonkeyPatchVirtualScrollComponent } from './ui/virtual-scroll';

@NgModule({
    declarations: [
        TsMonkeyPatchVirtualScrollComponent
    ],
    imports: [
        CommonModule,
        TsMonkeyPatchCommonModule
    ],
    exports: [
        TsMonkeyPatchVirtualScrollComponent
    ]
})
export class TsMonkeyPatchVirtualScrollModule {}
