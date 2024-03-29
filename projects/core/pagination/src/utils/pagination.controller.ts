import { Injectable } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';
import { PaginationData, PaginationItem, Settings } from '../api';

@Injectable()
export class PaginationController {

    /**
     * current page which is visible
     *
     */
    private page = 1;

    /**
     * total amount of pages we have
     *
     */
    private total = 1;

    /**
     * emits if the settings changed
     *
     */
    private change$: ReplaySubject<PaginationData> = new ReplaySubject(1);

    /**
     * emits current page and every time page has been changed
     *
     */
    private page$: ReplaySubject<number> = new ReplaySubject(1);

    /**
     * flag data has been initialized if true our change$ is allready
     * populated
     *
     */
    private dataInitialized = false;

    private displayCount = 5;

    /**
     * sets amount of pages which should be shown
     *
     */
    set display(count: number) {
        this.displayCount = count;

        if (isNaN(count) || count < 1) {
            this.displayCount = 5;
        }

        if(count % 2 === 0) {
            this.displayCount = count - 1;
        }
    }

    /**
     * return display amount
     *
     */
    get display(): number {
        return this.displayCount;
    }

    /**
     * @readonly settings the current settings
     *
     */
    get settings(): Settings {
        return {
            page: this.page,
            total: this.total
        };
    }

    /**
     * pagination data has been changed
     *
     */
    get change(): Observable<PaginationData> {
        if (!this.dataInitialized) {
            this.updatePaginationData();
        }
        return this.change$.asObservable();
    }

    /**
     * subscribe to get notified page changed
     *
     */
    get pageChange(): Observable<number> {
        return this.page$.asObservable();
    }

    /**
     * set current page
     *
     */
    goTo(page: number) {
        if (page < 1 || page > this.total) {
            return;
        }

        /** update pagination data */
        this.page = page;
        this.updatePaginationData();

        /** emit page changed */
        this.page$.next(page);
    }

    /**
     * goto next page
     *
     */
    nextPage() {
        if (this.page + 1 > this.total) {
            return;
        }
        this.goTo(this.page + 1);
    }

    /**
     * go to previous page
     *
     */
    prevPage() {
        if (this.page - 1 < 0) {
            return;
        }
        this.goTo(this.page - 1);
    }

    /**
     * update settings
     *
     */
    update(settings: Settings) {
        this.total   = settings.total;
        this.page    = settings.page;
        this.display = settings.displayCount || this.display;

        if (this.change$.observers.length) {
            this.updatePaginationData();
        }

        this.page$.next(settings.page);
    }

    /**
     * update pagination data
     *
     */
    private updatePaginationData() {
        const navigationFragments = this.createPaginationFragments();
        const paginationItems = this.convertToPaginationItem(navigationFragments);

        const data: PaginationData = {
            items: paginationItems,
            state: {
                active: this.page,
                isFirst: this.page === 1,
                isLast: this.page === this.total,
                total: this.total
            }
        };

        this.dataInitialized = true;
        this.change$.next(data);
    }

    /**
     * map data array to pagination items
     *
     */
    private convertToPaginationItem(items: Array<string|number>): PaginationItem[] {

        return items.map<PaginationItem>((item) => {
            let clickable = typeof item === 'number';
            clickable = clickable && item !== this.settings.page;

            return {
                clickable: clickable,
                text: item.toString(),
                value: item
            }
        });
    }

    /**
     * create pagination fragments like [1, 2, 3, ..., total]
     *
     */
    private createPaginationFragments(): Array<string|number> {
        const {page, total} = this.settings;
        const items: Array<string|number> = total > 5 ? [1, '...', '...', total] : [];

        if (total <= this.display) {
            for (let i = 0; i < total; i++) {
                items.push(i);
            }
        } else {
            // create subpages
            const pages: number[] = [];

            let i = this.display - 1;
            let j = Math.floor(i / 2) * -1;

            for (;i >= 0; i--, j++) {
                const skip = page + j <= 1 || page + j >= total;
                !skip ? pages.push(page + j) : void 0;
            }

            /**
             * base template: [1, '...', '...', l] (l = last page)
             *
             * page 1: move to index 1 and replace 1 item -> [1, pages, '...', l]
             * page n: move to index 2 and replace 0 item -> [1, '...', pages, '...', l]
             * page l: move to index 2 and replace 1 item -> [1, '...', pages, l]
             *
             */
            const start   = pages[0] - 1 === 1 ? 1 : 2;
            const replace = pages[0] - 1 > 1 && pages[pages.length - 1] + 1 < total ? 0 : 1;
            items.splice(start, replace, ...pages);
        }
        return items;
    }
}
