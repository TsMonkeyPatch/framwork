import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { TableProvider } from '../utils/table.controller';

@Component({
    selector: 'table-pagination',
    templateUrl: './pagination.html',
    styleUrls: ['./pagination.scss']
})
export class TablePagination implements OnInit, OnDestroy {

    public currentPage: number;

    private subscription: Subscription;

    constructor(
        private tableProvider: TableProvider
    ) { }

    ngOnInit(): void {
        this.subscription = this.tableProvider.data
            .subscribe((response) => this.currentPage = response.page + 1);
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    nextPage() {
        this.tableProvider.nextPage();
    }

    prevPage() {
        this.tableProvider.prevPage();
    }
}
