import { DataProvider } from "@tsmonkeypatch/core/datalist";
import { Observable, of } from "rxjs";

export class InfiniteDataSource extends DataProvider<number> {

    /**
     * check we can load more data before we send an request
     * 
     */
    canLoad(): boolean {
        return true;
    }

    /**
     * we simple return an array every time with new numbers
     *
     */
    protected fetch(start: number, count: number): Observable<number[]> {

        const data = Array(count);
        for(let i = start, j = 0; i < start + count; i++, j++) {
            data[j] = start + i;
        }

        return of(data);
    }
}