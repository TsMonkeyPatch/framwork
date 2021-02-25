import { ListRange } from "@angular/cdk/collections";
import { DataResult, TsMonkeyPatchDataSource } from "@lib/core/scroll/public-api";
import { Observable, of } from "rxjs";

export class DataSource extends TsMonkeyPatchDataSource<string> {

    private isFiltered = false

    protected fetch(range: ListRange): Observable<DataResult<string>> {

        const data: string[] = []
        for (let i = range.start; i <= range.end; i++) {
            data.push((i).toString())
        }

        const result: DataResult<string> = {
            items: data,
            total: this.isFiltered ? 1000 * 50 :  1000 * 1000 * 10
        }
        return of (result)
    }
}
