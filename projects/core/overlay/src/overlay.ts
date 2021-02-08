import { Component, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';

export interface OverlayControl {
    closeOverlay(): void;

    openOverlay(): void;

    toggleOverlay(): void;
}

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

    /**
     * the overlay control
     *
     */
    control: OverlayControl

    /**
     * close the overlay
     *
     */
    closeOverlay() {
        this.control.closeOverlay()
    }

    /**
     *
     *
     */
    openOverlay() {
        this.control.openOverlay()
    }

    /**
     * toggle overlay
     *
     */
    toggleOverlay() {
        this.control.toggleOverlay()
    }
}
