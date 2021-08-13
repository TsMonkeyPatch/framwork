import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TsMonkeyPatchStickyDirective } from './directives/sticky-directive';
import { TsMonkeyPatchNavigableListDirective, TsMonkeyPatchNavigableListItemDirective } from './directives/navigable-list';

@NgModule({
    declarations: [
        TsMonkeyPatchStickyDirective,
        TsMonkeyPatchNavigableListDirective,
        TsMonkeyPatchNavigableListItemDirective
    ],
    imports: [
        CommonModule
    ],
    exports: [
        TsMonkeyPatchStickyDirective,
        TsMonkeyPatchNavigableListDirective,
        TsMonkeyPatchNavigableListItemDirective
    ]
})
export class TsMonkeyPatchCommonModule {
}
