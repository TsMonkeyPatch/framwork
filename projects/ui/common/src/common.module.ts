import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TsMonkeyPatchStickyDirective } from './directives/sticky-directive';

@NgModule({
    declarations: [
        TsMonkeyPatchStickyDirective
    ],
    imports: [
        CommonModule
    ],
    exports: [
        TsMonkeyPatchStickyDirective
    ],
    providers: [],
})
export class TsMonkeyPatchCommonModule {
}
