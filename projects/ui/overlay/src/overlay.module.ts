import { NgModule } from '@angular/core';
import { OverlayModule } from '@angular/cdk/overlay';
import { TsMonkeyPatchOverlay } from './overlay';
import { TsMonkeyPatchOverlayControl } from './overlay.control';
import { TsMonkeyPatchOverlayTrigger } from './overlay.trigger';

@NgModule({
    imports: [
        OverlayModule
    ],
    exports: [
        TsMonkeyPatchOverlay,
        TsMonkeyPatchOverlayControl,
        TsMonkeyPatchOverlayTrigger
    ],
    declarations: [
        TsMonkeyPatchOverlay,
        TsMonkeyPatchOverlayControl,
        TsMonkeyPatchOverlayTrigger
    ],
    providers: [],
})
export class TsMonkeyPatchOverlayModule { }
