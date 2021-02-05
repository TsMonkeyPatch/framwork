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
     * we simple return an array every time where each number will increased by one
     *
     */
    protected fetch(start: number, count: number): Observable<number[]> {
        const data = Array.from({length: count}).map(() => start + 1);
        return of(data);
    }
}