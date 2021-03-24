import { AfterViewInit, Component, Host, OnDestroy, OnInit } from '@angular/core'
import { TsMonkeyPatchOverlayComponent } from '@tsmonkeypatch/core/overlay'
import { PaginationController } from '@tsmonkeypatch/core/pagination'
import { Subject } from 'rxjs'
import { takeUntil } from 'rxjs/operators'
import { PageDataSource } from '../utils/page-datasource'

@Component({
    selector: 'pagination--page-selector',
    templateUrl: './page-selector.html',
    styleUrls: ['./page-selector.scss']
})
export class PageSelector implements AfterViewInit, OnInit, OnDestroy {

    dataSource: PageDataSource

    active = 1

    private destroy$: Subject<boolean>

    constructor(
        private paginationController: PaginationController,
        @Host() private overlay: TsMonkeyPatchOverlayComponent
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
        this.paginationController.change
            .subscribe((data) => {
                this.dataSource.total = data.state.total
                this.dataSource.load(data.state.active - 3)
            })
    }

    /**
     * select page
     *
     */
    selectPage(page: number) {
        this.paginationController.goTo(page)
        this.overlay.closeOverlay()
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
