<<<<<<< HEAD
- [1. WindowScrollProvider](#1-windowscrollprovider)
  - [1.1. Scroll to position](#11-scroll-to-position)
  - [1.2. Observe window scroll event](#12-observe-window-scroll-event)
- [2. Sticky directive](#2-sticky-directive)

# 1. WindowScrollProvider

Provider to observe window scroll and scroll to a position.

## 1.1. Scroll to position

scroll window to specific position, emits 1 time the scroll process has been completed

```ts
import { Component, OnInit } from '@angular/core';
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

  scrollToPosition() {

    /** scroll 2000px or max height of document and notify if completed */
    this.windowScrollProvider
      .scrollTo({ top: 2000, behavior: 'smooth'})
      .subscribe(() => console.log("scrolled to position"))
  }
}
```

## 1.2. Observe window scroll event

Emits as soon window has been scrolled.

```ts
import { Component, OnInit } from '@angular/core';
import { WindowScrollProvider } from '@tsmonkeypatch/core/common';

@Component({
  selector: 'app-root',
  templateUrl: "app.html",
  styleUrls: ["./app.scss"]
})
export class AppComponent implements OnInit {

    private destroy$: Subject<boolean> = new Subject();

    public constructor(
        private windowScrollProvider: WindowScrollProvider
    ) { }

    ngOnInit() {
        this.windowScrollProvider.scroll()
            .pipe(takeUntil(this.destroyed))
            /** 
             * position: {top: number, left: number}
             */
            .subscribe((position) => console.log(position));
    }
}
```

# 2. Sticky directive

Makes a container sticky on top
=======
# TsMonkeyPatch/Core/CommonModule
Collection of directives and services which can generally be used.

## Directives

- [Sticky](https://github.com/TsMonkeyPatch/framwork/tree/master/projects/core/common/docs/sticky.md)
Simple directive the html element stays on top if we scrolled down.

## Providers

- [WindowScroll](https://github.com/TsMonkeyPatch/framwork/tree/master/projects/core/common/docs/window-scroll.md)
Centralized service to monitor window scroll events. Currently this one only focus on vertical position (y axis).
>>>>>>> development
