import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core'
import { TsMonkeyPatchOverlayControl } from '@tsmonkeypatch/core/overlay'
import { PaginationController } from '@tsmonkeypatch/core/pagination'
import { Subject } from 'rxjs'
import { takeUntil } from 'rxjs/operators'
import { PageDataSource } from '../utils/page-datasource'

@Component({
    selector: 'app-pagination--page-selector',
    templateUrl: './page-selector.html',
})
export class PageSelector implements AfterViewInit, OnInit, OnDestroy {

    dataSource: PageDataSource

    active = 1

    total = 0

    private destroy$: Subject<boolean>

    /**
     * overlay control
     *
     */
    @ViewChild(TsMonkeyPatchOverlayControl, {read: TsMonkeyPatchOverlayControl})
    private overlayCtrl: TsMonkeyPatchOverlayControl

    constructor(
        private paginationController: PaginationController
    ) {
        this.destroy$ = new Subject()
        this.dataSource = new PageDataSource()
    }

    /**
     *
     *
     */
    ngOnDestroy() {
        this.destroy$.next(true)
        this.destroy$.complete()
        this.destroy$ = null
    }

    /**
     * component has been initialized register to changes of pagination
     * 
     */
    ngOnInit(): void {
        this.dataSource.count = 5
        this.registerDataChange()
    }

    /**
     *
     *
     */
    ngAfterViewInit(): void {
        this.overlayCtrl.viewStateChange
            .pipe(takeUntil(this.destroy$))
            .subscribe((state: number) => {
                if (state) {
                    this.dataSource.load(this.active - 3)
                }
            });
    }

    /**
     * select page
     *
     */
    selectPage(page: number) {
        this.overlayCtrl.closeOverlay();
        this.paginationController.goTo(page)
    }

    /**
     * register on pagination data change
     *
     */
    private registerDataChange() {
        this.paginationController.change
            .pipe(takeUntil(this.destroy$))
            .subscribe((data) => {
                this.dataSource.total = data.state.total
                this.active = data.state.active
            })
    }
}
