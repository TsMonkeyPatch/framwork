import { Injectable } from '@angular/core';
import { Observable, of, ReplaySubject } from 'rxjs';
import { take, tap } from 'rxjs/operators';
import { TableDataResponse } from '../api';
import { ELEMENT_DATA } from '../model/datasource';
import { TableModel } from '../model/table';

@Injectable()
export class TableProvider {

    /**
     * save data in a replay subject, this is also a cache
     * the next who subscribed becomes the same data
     *
     */
    private data$: ReplaySubject<TableDataResponse> = new ReplaySubject(1);

    /**
     * indicator data has one time loaded allready so we have something into
     * the cache
     *
     */
    private loaded = false;

    /**
     * data model which holds all informations and data
     *
     */
    private model: TableModel;

    /**
     * resolve table data, this will fetch first time we subscribe
     *
     */
    get data(): Observable<TableDataResponse> {

        if (!this.loaded) {
            this.fetch();
            this.loaded = true;
        }

        return this.data$.asObservable();
    }

    constructor(
    ) {
        this.model = new TableModel(ELEMENT_DATA);
    }

    /**
     * order data by column
     *
     */
    orderBy(column: string) {
        this.sortData(column);
        this.setPage(0);
    }

    /**
     * navigate forward
     *
     */
    nextPage() {
        if (this.model.page + 1 >= this.model.pageCount) {
            return;
        }
        this.setPage(this.model.page + 1);
    }

    /**
     * navigate back
     *
     */
    prevPage() {
        if (this.model.page <= 0) {
            return;
        }

        this.setPage(this.model.page - 1);
    }

    /**
     * set current page we want to show and load data
     *
     */
    setPage(page: number) {
        this.model.page = page;
        this.fetch();
    }

    /**
     * set page size and reload data
     *
     */
    setPageSize(size: number) {
        this.model.pageSize = size;
    }

    /**
     * fetch data
     *
     */
    private fetch() {

        let data = this.model.data;

        const from = this.model.page * this.model.pageSize;
        const to   = from + this.model.pageSize;

        of<TableDataResponse>({
            items: data.slice(from, to),
            page: this.model.page,
            total: data.length
        })
        .pipe(
            tap((response) => this.model.pageCount = Math.ceil(response.total / this.model.pageSize)),
            take(1)
        )
        .subscribe((response) => this.data$.next(response));
    }

    /**
     *
     *
     */
    private sortData(field: string) {

        const fieldName = field;
        this.model.data.sort((a, b) => a[fieldName] < b[fieldName] ? -1 : 1);
    }
}
