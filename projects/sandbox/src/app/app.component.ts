import { Component, OnInit } from '@angular/core';
import { ScrollPosition } from '@lib/core/common';
import { TsMpDatalistControl } from '@lib/core/virtual-scroll/src/utils/control';
import { WindowScrollProvider } from '@tsmonkeypatch/core/common';
import { PaginationController } from '@tsmonkeypatch/core/pagination';
import { DataSource } from './utils/datasource';

@Component({
  selector: 'app-root',
  templateUrl: "app.html",
  styleUrls: ["./app.scss"],
  viewProviders: [ TsMpDatalistControl ]
})
export class AppComponent implements OnInit {

  title = 'sandbox'

  data: number[] = Array.from(Array(40)).map((value ,index) => index)

  datasource = new DataSource()

  public constructor(
    private windowScrollProvider: WindowScrollProvider,
    private paginationController: PaginationController,
    private datalistCtrl: TsMpDatalistControl<string>
  ) { }

  ngOnInit() {
    this.paginationController.update({
      page: 1,
      total: 20
    })
  }

  prevPage() {
    this.paginationController.prevPage()
  }

  nextPage() {
    this.paginationController.nextPage()
  }

  addFilter() {
    this.datasource.filter = true
    this.datalistCtrl.reload()
  }

  clearFilter() {
    this.datasource.filter = false
    this.datalistCtrl.reload()
  }

  scrollToPageEnd() {
    this.windowScrollProvider.scroll()
      .subscribe((position: ScrollPosition) => console.log(
        "scrolled to x: %i y: %i", position.top, position.left
      ))
  }
}
