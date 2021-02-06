import { Component, OnInit } from '@angular/core';
import { ScrollPosition } from '@lib/core/common';
import { WindowScrollProvider } from '@tsmonkeypatch/core/common';
import { PaginationController } from '@tsmonkeypatch/core/pagination';

@Component({
  selector: 'app-root',
  templateUrl: "app.html",
  styleUrls: ["./app.scss"]
})
export class AppComponent implements OnInit {

  title = 'sandbox';

  public data: number[] = Array.from(Array(40)).map((value ,index) => index);

  public constructor(
    private windowScrollProvider: WindowScrollProvider,
    private paginationController: PaginationController
  ) { }

  ngOnInit() {
    this.paginationController.update({
      page: 1,
      total: 20
    });
  }

  prevPage() {
    this.paginationController.prevPage();
  }

  nextPage() {
    this.paginationController.nextPage();
  }

  scrollToPageEnd() {
    this.windowScrollProvider.scroll()
      .subscribe((position: ScrollPosition) => console.log(
        "scrolled to x: %i y: %i", position.top, position.left
      ))
  }
}
