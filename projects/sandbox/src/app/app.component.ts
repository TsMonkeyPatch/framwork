import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { ScrollPosition } from '@lib/core/common';
import { TsMpDatalistControl } from '@lib/core/virtual-scroll/src/utils/control';
import { WindowScrollProvider } from '@tsmonkeypatch/core/common';
import { PaginationController } from '@tsmonkeypatch/core/pagination';
import { DataSource } from './utils/datasource';

@Component({
  selector: 'sandbox-root',
  templateUrl: "app.html",
  styleUrls: ["./app.scss"],
  viewProviders: [ TsMpDatalistControl ]
})
export class AppComponent implements OnInit {

  data: number[] = Array.from(Array(40)).map((value ,index) => index)
  datasource = new DataSource()
  title = 'sandbox'
  fileCtrl: FormControl;
  uploadFile: File;

  public constructor(
    private readonly windowScrollProvider: WindowScrollProvider,
    private readonly paginationController: PaginationController,
    private readonly datalistCtrl: TsMpDatalistControl<string>,
    private readonly formBuilder: FormBuilder,
    private readonly http: HttpClient
  ) { }

  ngOnInit() {

    this.fileCtrl = this.formBuilder.control('');

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

  submitFile() {
    if (!this.uploadFile) {
      return;
    }

    const formData = new FormData();
    formData.append('files', this.uploadFile);
    formData.append('data', JSON.stringify({'name': 'Ralf'}));

//     GET /api/message/workbooks HTTP/1.1
// Host: localhost
// Connection: keep-alive
// sec-ch-ua: " Not;A Brand";v="99", "Google Chrome";v="91", "Chromium";v="91"
// Accept: application/json, text/plain, */*
// X-Correlation-Id: 98bcef22-a0c7-4f93-8de7-18cec5dac8d2
// sec-ch-ua-mobile: ?0
// User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.114 Safari/537.36
// Sec-Fetch-Site: same-origin
// Sec-Fetch-Mode: cors
// Sec-Fetch-Dest: empty
// Referer: http://localhost/workbooks
// Accept-Encoding: gzip, deflate, br
// Accept-Language: en-GB,en-US;q=0.9,en;q=0.8,de;q=0.7
// Cookie: intercom-session-yywwahc9=MUUveG5KNG9kencwdmtjMmppUDRZYS9xRGQvNlZNbkRkSjlQZWcrR3UxL01FekVOZEZOMnYxMThLT0VadWRIVi0tSnZzZEsxUC91ZU5jMGxGUXhBT3Fzdz09--f88e43b8b0a05852da98a0ccdc2896977049c26f
// If-None-Match: W/"10cb-NgCj1khFLZFho9XuBQ328UGDElU"

    document.cookie = 'intercom-session-yywwahc9=MUUveG5KNG9kencwdmtjMmppUDRZYS9xRGQvNlZNbkRkSjlQZWcrR3UxL01FekVOZEZOMnYxMThLT0VadWRIVi0tSnZzZEsxUC91ZU5jMGxGUXhBT3Fzdz09--f88e43b8b0a05852da98a0ccdc2896977049c26f';

    const headers = new HttpHeaders({
      'X-Correlation-Id': '98bcef22-a0c7-4f93-8de7-18cec5dac8d2'
    });

    this.http.post(`http://172.25.230.97:3333/api/message/file-storage`, formData, {
      headers
    }).subscribe()
  }

  fileChange(event: Event) {
    this.uploadFile = (event.target as HTMLInputElement).files?.[0];
  }
}
