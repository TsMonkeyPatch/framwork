import { Component, OnInit } from '@angular/core';
import { InfiniteDataSource } from '../utils/infinite-data.source';

@Component({
    selector: 'app-infinita-data',
    templateUrl: './infinite-data.html'
})
export class InfiniteDataComponent implements OnInit {

    public dataSource: InfiniteDataSource;

    ngOnInit(): void {
        this.dataSource = new InfiniteDataSource();
    }

    onItemSelect(item: number) {
        console.log(item);
    }
}
