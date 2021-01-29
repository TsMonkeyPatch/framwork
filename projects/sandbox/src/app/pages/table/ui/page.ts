import { Component, OnInit } from '@angular/core';
import { PaginationController } from '@tsmonkeypatch/core/pagination';

@Component({
    selector: 'table-page',
    templateUrl: './page.html'
})
export class TablePage implements OnInit {

    public constructor(
        private paginationCtrl: PaginationController
    ) {}

    ngOnInit(): void {
        this.paginationCtrl.update({
            page: 102,
            total: 2000000
        })
    }

    nextPage() {
        this.paginationCtrl.nextPage();
    }

    prevPage() {
        this.paginationCtrl.prevPage();
    }
}
