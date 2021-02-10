import { Component, EventEmitter, Output } from '@angular/core';
import { EventContainer } from '../utils/event-container';

@Component({
    selector: 'app-project-submit',
    templateUrl: './submit.html'
})
export class SubmitButton {

    @Output()
    submit: EventEmitter<EventContainer<number>> = new EventEmitter();

    submitData() {
        const event = new EventContainer(Math.round(Math.random()));
        event.completed.subscribe((result) => result ? this.doTheMagic() : this.eventCanceled());

        this.submit.emit(event);
    }

    private doTheMagic() {
        console.log("magic");
    }

    private eventCanceled() {
        console.log("canceled");
    }
}

