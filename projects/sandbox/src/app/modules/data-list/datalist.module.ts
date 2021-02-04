import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TsMonkeyPatchDatalist } from './ui/datalist';

@NgModule({
    declarations: [ TsMonkeyPatchDatalist ],
    imports: [ CommonModule ],
    exports: [ TsMonkeyPatchDatalist ]
})
export class TsMonkeyPatchDatalistModule {}
