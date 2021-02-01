import { Component, OnInit } from '@angular/core';
import { WindowScrollProvider } from '@tsmonkeypatch/core/common';
import { PaginationController } from '@tsmonkeypatch/core/pagination';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: "app.html",
  styleUrls: ["./app.scss"]
})
export class AppComponent implements OnInit {

  title = 'sandbox';


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
      .subscribe((position) => console.log(
        "scrolled to x: %i y: %i", position.top, position.left
      ))
  }
}
