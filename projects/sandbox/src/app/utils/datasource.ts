import { ListRange } from "@angular/cdk/collections";
import { DataResult, VirtualScrollDataSource } from "@lib/core/virtual-scroll/public-api";
import { Observable, of } from "rxjs";

export class DataSource extends VirtualScrollDataSource<string> {

    private isFiltered = false

    set filter(filtered: boolean) {
        this.isFiltered = filtered;
    }

    protected fetch(range: ListRange): Observable<DataResult<string>> {

        const data: string[] = []
        for (let i = range.start; i <= range.end; i++) {
            data.push((i).toLocaleString())
        }

        const result: DataResult<string> = {
            items: data,
            total: this.isFiltered ? 30 :  1000 * 1000 * 10
        }
        return of (result)
    }
}
