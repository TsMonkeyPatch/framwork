import { ConnectionPositionPair } from "@angular/cdk/overlay";

export abstract class PositionFactory {

    /**
     * overlay connected to bottom position
     *
     */
    public static bottomPositionPair(): ConnectionPositionPair {
        return {
            originX: 'start',
            originY: 'bottom',
            overlayX: 'start',
            overlayY: 'top'
        }
    }

    /**
     * overlay connected to top position
     *
     */
    public static topPositionPair(): ConnectionPositionPair {
        return {
            originX: 'start',
            originY: 'top',
            overlayX: 'start',
            overlayY: 'bottom'
        }
    }

    /**
     * overlay connected to top left position
     *
     */
    public static leftPositionPair(originTop = false, overlayTop = false): ConnectionPositionPair {
        return {
            originX: 'start',
            originY:  originTop ? 'top' : 'bottom',
            overlayX: 'end',
            overlayY: overlayTop ? 'top' : 'bottom'
        }
    }

    /**
     * overlay connected to top left position
     *
     */
    public static rightPositionPair(originTop = true, overlayTop = true): ConnectionPositionPair {
        return {
            originX: 'end',
            originY:  originTop ? 'top' : 'bottom',
            overlayX: 'start',
            overlayY: overlayTop ? 'top' : 'bottom'
        }
    }

    /**
     * center an overlay
     *
     */
    public static centeredPositionPair(): ConnectionPositionPair[] {

        const centered: ConnectionPositionPair[] = [{
            originX: 'center',
            originY:  'center',
            overlayX: 'center',
            overlayY: 'center'
        }]

        return centered
    }


    /**
     * center an overlay vertical centered
     *
     */
    public static verticalCenteredPositionPair(): ConnectionPositionPair[] {

        const verticalCentered: ConnectionPositionPair[] = [{
            originX: 'start',
            originY:  'center',
            overlayX: 'start',
            overlayY: 'center'
        }]

        return verticalCentered
    }

    /**
     * default configuration for horizontal centered
     *
     */
    public static horizontalCenteredPositionPair(): ConnectionPositionPair[] {

        const horizontalCentered: ConnectionPositionPair[] = [{
            originX: 'center',
            originY:  'bottom',
            overlayX: 'center',
            overlayY: 'top'
        }, {
            originX: 'center',
            originY:  'top',
            overlayX: 'center',
            overlayY: 'bottom'
        }]

        return horizontalCentered
    }

    /**
     * vertical centered position pair
     * by default position on bottom, if the is no space left switch to top
     *
     */
    public static verticalPositionPair(): ConnectionPositionPair[] {
        const position: ConnectionPositionPair[] = [
            this.bottomPositionPair(),
            this.topPositionPair()
        ]
        return position;
    }

    /**
     * horizontal position pair
     *
     */
    public static horizonalPositionPair(): ConnectionPositionPair[] {
        const position: ConnectionPositionPair[] = [
            this.rightPositionPair(),
            this.leftPositionPair()
        ]
        return position;
    }
}
