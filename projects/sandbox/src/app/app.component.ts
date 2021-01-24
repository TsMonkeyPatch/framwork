import { Component, OnInit } from '@angular/core';
import { WindowScrollProvider } from '@tsmonkeypatch/core/common';
import { take } from 'rxjs/operators';
import { Option } from '@tsmonkeypatch/forms/checkbox-group';

@Component({
  selector: 'app-root',
  templateUrl: "app.html",
  styleUrls: ["./app.scss"]
})
export class AppComponent implements OnInit {

  title = 'sandbox';

  public options: Option<string>[] = [];

  public constructor(
    private windowScrollProvider: WindowScrollProvider
  ) { }

  ngOnInit() {
    this.options = [
      {label: 'Option 1', value: '1'},
      {label: 'Option 2', value: 'option 2'},
      {label: 'Option 3', value: 'option 3'},
    ]
  }

  scrollToPageEnd() {
    this.windowScrollProvider
      .scrollTo({ top: 2000, behavior: 'smooth'})
      .pipe(take(1))
      .subscribe(() => console.log("scrolled to position"))
  }

  onValueChanges(selected: Option<string>[]) {
    console.log("selected");
  }
}
