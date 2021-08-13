import { DataProvider } from "@tsmonkeypatch/core/datalist";
import { Observable, of } from "rxjs";

export class PageDataSource extends DataProvider<number> {

    constructor() {
        super();
        this.count = 5
    }

    /**
     *
     *
     */
    canLoad(start: number, count: number): boolean {
        return start > -1 && start + count <= this.total
    }

    /**
     *
     *
     */
    updateTotal(total: number) {
        this.total = total
    }

    /**
     * we simple return an array every time with new numbers
     *
     */
    protected fetch(start: number, count: number): Observable<number[]> {

        const data = Array(count);
        const max = start + count;

        console.log(start)

        for(let i = start, j = 0; i < max; i++, j++) {
            data[j] = i + 1
        }
        return of(data)
    }
}
