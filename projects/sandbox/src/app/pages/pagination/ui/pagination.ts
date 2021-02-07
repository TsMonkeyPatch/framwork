import { Component, OnInit } from '@angular/core';
import { PaginationController } from '@tsmonkeypatch/core/pagination';

@Component({
    selector: 'app-pagnation',
    templateUrl: './pagination.html'
})
export class PaginationPage implements OnInit {

    constructor(
        private paginationController: PaginationController
    ) {}

    ngOnInit() {
        this.paginationController.update({
            page: 1,
            total: 200,
            displayCount: 5
        })
    }

    /**
     * select a page
     *
     */
    selectPage(page: number) {
        this.paginationController.goTo(page)
    }
}
