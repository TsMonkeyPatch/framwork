import { Component, OnInit } from '@angular/core';
import { PaginationController } from '@tsmonkeypatch/core/pagination';

@Component({
    selector: 'app-data',
    templateUrl: './datapage.html',
    providers: [ PaginationController ]
})
export class DataPage implements OnInit {

    public page: number;

    constructor(
        private paginationController: PaginationController
    ) { }

    ngOnInit(): void {
        this.paginationController.update({ page: 1, total: 30, displayCount: 5});
        this.paginationController.pageChange
            .subscribe((page) => this.page = page);
    }

    nextPage() {
        this.paginationController.nextPage();
    }

    prevPage() {
        this.paginationController.prevPage();
    }
}
