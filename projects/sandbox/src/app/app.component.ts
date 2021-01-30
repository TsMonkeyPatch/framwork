import { Component, OnInit } from '@angular/core';
import { WindowScrollProvider } from '@tsmonkeypatch/core/common';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: "app.html",
  styleUrls: ["./app.scss"]
})
export class AppComponent implements OnInit {

  title = 'sandbox';


  public constructor(
    private windowScrollProvider: WindowScrollProvider
  ) { }

  ngOnInit() {
  }

  scrollToPageEnd() {
    this.windowScrollProvider.scroll()
      .subscribe((position) => console.log(
        "scrolled to x: %i y: %i", position.top, position.left
      ))
  }
}
