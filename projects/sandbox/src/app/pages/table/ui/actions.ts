import { Component, OnInit } from '@angular/core';
import { TableProvider } from '../utils/table.controller';

@Component({
    selector: 'table-actions',
    templateUrl: './actions.html'
})
export class TableActions {

    constructor(
        private tableCtrl: TableProvider
    ) { }

    changeOrder($event: Event) {

        $event.preventDefault();
        $event.stopPropagation();

        const selectField = $event.target as HTMLSelectElement;
        this.tableCtrl.orderBy(selectField.value);
    }
}
