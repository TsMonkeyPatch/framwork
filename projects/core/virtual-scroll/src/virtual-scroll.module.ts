import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TsMonkeyPatchCommonModule } from '@tsmonkeypatch/core/common';
import { TsMonkeyPatchVirtualScroll } from './ui/virtual-scroll';

@NgModule({
    declarations: [
        TsMonkeyPatchVirtualScroll
    ],
    imports: [
        CommonModule,
        TsMonkeyPatchCommonModule
    ],
    exports: [
        TsMonkeyPatchVirtualScroll
    ]
})
export class TsMonkeyPatchVirtualScrollModule {}
