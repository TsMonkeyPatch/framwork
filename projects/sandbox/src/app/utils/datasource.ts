import { DataProvider } from "@lib/core/datalist/public-api";
import { Observable, of } from "rxjs";

export class DataSource extends DataProvider<string> {

    protected canLoad(): boolean {
        return true
    }

    protected fetch(start: number, count: number): Observable<string[]> {

        const data = Array.from(Array(count)).map((_, index) => `item #` + (start + index))
        return of(data)
    }
}
