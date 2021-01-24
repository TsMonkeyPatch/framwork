import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TsMonkeyPatchStickyDirective } from './directives/sticky-directive';
import { TsMonkeyPatchNavigableListItem, TsMonkeyPatchNavigableList } from './directives/navigable-list';

@NgModule({
    declarations: [
        TsMonkeyPatchStickyDirective,
        TsMonkeyPatchNavigableList,
        TsMonkeyPatchNavigableListItem
    ],
    imports: [
        CommonModule
    ],
    exports: [
        TsMonkeyPatchStickyDirective,
        TsMonkeyPatchNavigableList,
        TsMonkeyPatchNavigableListItem
    ]
})
export class TsMonkeyPatchCommonModule {
}
