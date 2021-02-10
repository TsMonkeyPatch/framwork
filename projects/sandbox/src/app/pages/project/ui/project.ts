import { Component } from '@angular/core';
import { EventContainer } from '../utils/event-container';

@Component({
    selector: 'app-project',
    templateUrl: './project.html',
})
export class ProjectComponent {

    onSubmit($event: EventContainer<number>) {

        console.log($event.param);

        !$event.param ? $event.cancel() : $event.next(); 
    }
}
