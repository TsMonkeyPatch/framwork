import { Component, ChangeDetectionStrategy, OnInit, OnDestroy, Output, Input, TemplateRef, ChangeDetectorRef, EventEmitter } from "@angular/core";
import { PaginationController } from "../utils/pagination.controller";
import { PaginationData, PaginationItem } from "../api";
import { Subscription } from "rxjs";

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
    public data: PaginationData;

    @Input()
    template: TemplateRef<PaginationData>;

    /**
     * page selected
     *
     */
    @Output()
    selectPage: EventEmitter<number> = new EventEmitter();

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
            .subscribe((data) => this.render(data));
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
        this.data = data;
        this.cdRef.markForCheck();
    }
}
