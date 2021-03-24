import { Observable, from, of } from "rxjs";
import { DataProvider } from "./data.provider";

export class MemoryDataProvider<T> extends DataProvider<T> {

    private data: T[] = [];

    /**
     * set the data source
     *
     */
    public set source(data: T[]) {
        this.data = data;
    }

    canLoad(start: number, count: number): boolean {
        return start >= 0 && start + count <= this.data.length
    }

    /**
     * resolve data from memory
     *
     */
    protected fetch(start: number, count: number): Observable<T[]> {

        const result: T[] = [];

        const startFrom = start < 0 ? 0 : Math.min(start, this.data.length - count);
        const to        = Math.min(start + count, this.data.length);

        for (let i = startFrom; i < to; i++) {
            result.push(this.data[i]);
        }

        return of(result);
    }
}
