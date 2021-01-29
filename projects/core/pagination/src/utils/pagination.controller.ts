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
     * flag data has been initialized
     *
     */
    private dataInitialized = false;

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
            this.change$.next(this.createPaginationData());
        }
        return this.change$.asObservable();
    }

    /**
     * set current page
     *
     */
    goTo(page: number) {
        if (page < 0 || page > this.total) {
            return;
        }

        this.page = page;
        this.change$.next(
            this.createPaginationData());
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
        this.total = settings.total;
        this.page  = settings.page;

        if (this.change$.observers.length) {
            this.change$.next(this.createPaginationData());
        }
    }

    /**
     * update pagination data and notify observers
     *
     */
    private createPaginationData(): PaginationData {
        const navigationFragments = this.createPaginationFragments();
        const paginationItems = this.buildPaginationItem(navigationFragments);

        const data: PaginationData = {
            data: {
                active: this.page,
                isFirst: this.page === 1,
                isLast: this.page === this.total,
                total: this.total
            },
            items: paginationItems,
        };

        this.dataInitialized = true;
        return data;
    }

    /**
     * map data 
     *
     */
    private buildPaginationItem(items: Array<string|number>): PaginationItem[] {

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
     * create pagination fragments like [1, 2, 3, ..., 10]
     *
     */
    private createPaginationFragments(): Array<string|number> {
        const {page, total} = this.settings;
        const items: Array<string|number> = total > 5 ? [1, '...', '...', total] : [];

        if (total <= 5) {
            for (let i = 0; i < total; i++) {
                items.push(i);
            }
        } else {
            // create subpages
            const pages: number[] = [];
            let j = page === 1 ? 0 : page === total ? -2 : -1;

            for (let i = 2; i >= 0; i--, j++) {
                if (page + j === 1 || page + j === total) {
                    continue;
                }
                pages.push(page + j);
            }

            // create page fragment array
            const start   = pages[0] - 1 === 1 ? 1 : 2;
            const replace = pages[0] - 1 > 1 && pages.slice(-1)[0] + 1 < total ? 0 : 1;
            items.splice(start, replace, ...pages);
        }
        return items;
    }
}
