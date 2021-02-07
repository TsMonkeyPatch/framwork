import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { TsMonkeyPatchDatalistModule } from '@tsmonkeypatch/core/datalist'
import { DetailListRoutingModule } from './datalist-routing.module'
import { InfiniteDataComponent } from './ui/inifinite-data'
import { DatalistPage } from './ui/datalist'

@NgModule({
    declarations: [
        InfiniteDataComponent,
        DatalistPage
    ],
    imports: [
        CommonModule,
        DetailListRoutingModule,
        TsMonkeyPatchDatalistModule
    ],
    exports: [],
    providers: [],
})
export class DatalistModule {}