# @tsmonkeypatch/core/common.WindowScrollProvider 

Centralized service to monitor window scroll events. Currently this one only focus on vertical position (y axis).

## Usage

### Monitor
window scroll events

```ts
import { Component, OnInit } from '@angular/core';
import { WindowScrollProvider } from '@tsmonkeypatch/core/common';

@Component({
  selector: 'app-root',
  templateUrl: "app.html",
  styleUrls: ["./app.scss"]
})
export class AppComponent implements OnInit {

  private scrollSubscription: Subscription;

  public constructor(
    private windowScrollProvider: WindowScrollProvider
  ) { }

  ngOnInit() {
    this.scrollSubscription = this.scrollProvider.scroll()
        /** emits if a scroll event triggers */
        .subscribe((position) => console.log('top: %i, left: %i', position.top, position.left));
  }

  ngOnDestroy() {
      this.scrollSubscription.unsubscribe();
  }
}
```

### Scroll to

position and get notified if we reached the position

```ts
import { Component } from '@angular/core';
import { WindowScrollProvider } from '@tsmonkeypatch/core/common';

@Component({
  selector: 'app-root',
  templateUrl: "app.html",
  styleUrls: ["./app.scss"]
})
export class AppComponent {

  public constructor(
    private windowScrollProvider: WindowScrollProvider
  ) { }

  scrollToPageEnd() {
    this.windowScrollProvider
      .scrollTo({ top: 2000, behavior: 'smooth'})
      /** emits only once when the position has been reached */
      .subscribe(() => console.log("scrolled to position"))
  }
}
```

## API

### Methods

|name|param|@return|description|
|-|-|-|-|
|scroll|void|Observable\<ScrollPosition\>|emits every time page has been scroll|
|scrollTo|ScrollToOptions|Observable\<ScrollPosition\>|scroll to position and notify if position has been reached|