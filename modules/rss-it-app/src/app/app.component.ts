import { Component } from '@angular/core';
import {FeedParser} from "./feed-parser";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  html: string;
  json: string;

  constructor() {

  }

  parseHtml() {

    const domParser = new DOMParser();
    const htmlDoc = domParser.parseFromString(this.html, 'text/html');

    const feedParser = new FeedParser(htmlDoc);

    this.json = JSON.stringify(feedParser.getArticles());
  }
}
