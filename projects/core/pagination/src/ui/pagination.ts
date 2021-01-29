import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output, TemplateRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { PaginationData, PaginationItem } from '../api';
import { PaginationController } from '../utils/pagination.controller';

@Component({
    selector: 'tsmp-pagination',
    templateUrl: './pagination.html',
    styleUrls: ['./pagination.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class Pagination implements OnInit, OnDestroy {

    /**
     * subscription for templatedata has been changed
     *
     */
    private subscription: Subscription;

    /**
     * data for our template
     *
     */
    public templateData: PaginationData;

    /**
     * all items we have
     *
     */
    items: Array<string|number> = [];

    /**
     * page selected
     *
     */
    @Output()
    selectPage: EventEmitter<number> = new EventEmitter();

    /**
     * add custom pagination template
     *
     */
    @Input()
    template: TemplateRef<PaginationData>

    public constructor(
        private paginationCtrl: PaginationController,
        private cdRef: ChangeDetectorRef
    ) {}

    /**
     * component gets initialized
     *
     */
    ngOnInit() {
        this.subscription = this.paginationCtrl.change
            .subscribe((data) => this.render(data))
    }

    /**
     * component gets destroyed, remove subscription from 
     * pagination controller
     *
     */
    ngOnDestroy(): void {
        this.subscription.unsubscribe();
        this.subscription = null;
    }

    /**
     * goto page
     * 
     */
    goTo(item: PaginationItem) {
        this.paginationCtrl.goTo(item.value as number);
    }

    /**
     * goto next page
     * 
     */
    nextPage() {
        this.paginationCtrl.nextPage();
    }

    /**
     * goto prev page 
     *
     */
    prevPage() {
        this.paginationCtrl.prevPage();
    }

    /**
     * render page data
     *
     */
    private render(data: PaginationData) {
        this.templateData = data;
        this.cdRef.markForCheck();
    }
}
