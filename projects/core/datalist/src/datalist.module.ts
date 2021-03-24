import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TsMonkeyPatchCommonModule } from '@tsmonkeypatch/core/common';
import { TsMonkeyPatchDatalistComponent } from './ui/datalist';

@NgModule({
    declarations: [
        TsMonkeyPatchDatalistComponent
    ],
    imports: [
        CommonModule,
        TsMonkeyPatchCommonModule
    ],
    exports: [
        TsMonkeyPatchDatalistComponent
    ]
})
export class TsMonkeyPatchDatalistModule {}
