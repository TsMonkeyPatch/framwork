import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
    selector: 'sandbox-forms',
    templateUrl: './forms.html',
    styleUrls: ['./forms.scss']
})
export class FormsPage implements OnInit {

    public testForm: FormGroup;

    constructor(
        private formBuilder: FormBuilder
    ) { }

    ngOnInit(): void {
        this.testForm = this.formBuilder.group({
            name: this.formBuilder.control("")
        });
    }
}
