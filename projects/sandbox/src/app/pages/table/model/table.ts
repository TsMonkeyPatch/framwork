import { PeriodicElement } from "../api";

export class TableModel {

    /**
     * all data in memory
     *
     */
    private periodicElements: PeriodicElement[];

    /**
     * current display page
     * 
     */
    private currentPage = 0;

    /**
     * table page size how many records displayed at once
     *
     */
    private tablePageSize = 5;

    /**
     * max page count
     *
     */
    private tablePageCount = 0;

    constructor(data: PeriodicElement[]) {
        this.data = data;
    }

    /**
     * resolve data
     *
     */
    get data(): PeriodicElement[] {
        return this.periodicElements;
    }

    /**
     * set data
     *
     */
    set data(data: PeriodicElement[]) {
        this.periodicElements = data;
    }

    /**
     * set current page
     *
     */
    set page(page: number) {
        this.currentPage = page;
    }

    /**
     * get current page
     *
     */
    get page() {
        return this.currentPage;
    }

    /**
     * set page size
     *
     */
    set pageSize(size: number) {
        this.tablePageSize = size;
    }

    /**
     * resolve page size
     *
     */
    get pageSize(): number {
        return this.tablePageSize;
    }

    /**
     * set page size
     *
     */
    set pageCount(size: number) {
        this.tablePageCount = size;
    }

    /**
     * resolve page size
     *
     */
    get pageCount(): number {
        return this.tablePageCount;
    }
}
