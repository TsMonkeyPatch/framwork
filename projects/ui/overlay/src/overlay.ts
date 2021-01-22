import { Component, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';

@Component({
    encapsulation: ViewEncapsulation.None,
    selector: 'tsmp-overlay',
    styles: [`
        .tsmp-overlay {
            position: absolute;
            z-index: 5000;
        }
    `],
    template: `
        <ng-template #wrapper>
            <ng-content></ng-content>
        </ng-template>
    `
})
export class TsMonkeyPatchOverlay {

    @ViewChild('wrapper', {read: TemplateRef, static: true})
    public template: TemplateRef<void>;
}
