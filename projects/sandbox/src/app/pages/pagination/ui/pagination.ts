import { ConnectionPositionPair } from '@angular/cdk/overlay';
import { Component, OnInit } from '@angular/core';
import { PositionFactory } from '@tsmonkeypatch/core/overlay';
import { PaginationController } from '@tsmonkeypatch/core/pagination';

@Component({
    selector: 'pagnation',
    templateUrl: './pagination.html'
})
export class PaginationPage implements OnInit {

    public position: ConnectionPositionPair[]

    constructor(
        private paginationController: PaginationController
    ) {}

    ngOnInit() {
        this.position = PositionFactory.centeredPositionPair()
        this.paginationController.update({
            page: 1,
            total: 200,
            displayCount: 5
        })
    }
}
