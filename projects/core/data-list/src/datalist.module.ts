import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TsMonkeyPatchCommonModule } from '@core/common';

import { TsMonkeyPatchDatalist } from './ui/datalist';

@NgModule({
    declarations: [ TsMonkeyPatchDatalist ],
    imports: [
        CommonModule,
        TsMonkeyPatchCommonModule
    ],
    exports: [ TsMonkeyPatchDatalist ]
})
export class TsMonkeyPatchDatalistModule {}
