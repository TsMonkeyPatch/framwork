import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { PeriodicElement } from '../api';
import { TableProvider } from '../utils/table.controller';

@Component({
    selector: 'table-view',
    templateUrl: './table.html',
    styleUrls: ['./table.scss']
})
export class TableView implements OnInit, OnDestroy {

    public dataSource: PeriodicElement[];

    public displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];

    private subscription: Subscription;

    constructor(
        private tableDataProvider: TableProvider
    ) { }

    /**
     *
     *
     */
    ngOnInit(): void {
        this.subscription = this.tableDataProvider.data
            .subscribe((response) => this.dataSource = response.items)
    }

    /**
     *
     *
     */
    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }
}
