import { NgModule } from '@angular/core';
import { OverlayModule } from '@angular/cdk/overlay';
import { TsMonkeyPatchOverlayControlDirective } from './overlay.control';
import { TsMonkeyPatchOverlayTriggerDirective } from './overlay.trigger';
import { TsMonkeyPatchOverlayComponent } from './overlay';

@NgModule({
    imports: [
        OverlayModule
    ],
    exports: [
        TsMonkeyPatchOverlayComponent,
        TsMonkeyPatchOverlayControlDirective,
        TsMonkeyPatchOverlayTriggerDirective
    ],
    declarations: [
        TsMonkeyPatchOverlayComponent,
        TsMonkeyPatchOverlayControlDirective,
        TsMonkeyPatchOverlayTriggerDirective
    ]
})
export class TsMonkeyPatchOverlayModule { }
