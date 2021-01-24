import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TsMonkeyPatchStickyDirective } from './directives/sticky-directive';
import { TsMonkeyPatchFocusable, TsMonkeyPatchNavigableList } from './directives/navigable-list';

@NgModule({
    declarations: [
        TsMonkeyPatchStickyDirective,
        TsMonkeyPatchNavigableList,
        TsMonkeyPatchFocusable
    ],
    imports: [
        CommonModule
    ],
    exports: [
        TsMonkeyPatchStickyDirective,
        TsMonkeyPatchNavigableList,
        TsMonkeyPatchFocusable
    ],
    providers: [],
})
export class TsMonkeyPatchCommonModule {
}
