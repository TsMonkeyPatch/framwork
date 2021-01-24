import { Component, Input, OnInit } from '@angular/core';
import { Option } from './api';

@Component({
    selector: 'tsmp-forms-combobox',
    templateUrl: './combobox.html',
    styleUrls: ['./combobox.scss']
})
export class Combobox<T> implements OnInit {

    @Input()
    public options: Option<T>[];

    constructor() {
    }

    ngOnInit(): void {
    }
}
