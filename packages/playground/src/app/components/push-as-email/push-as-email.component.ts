import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-push-as-email',
  templateUrl: './push-as-email.component.html',
  styleUrls: ['./push-as-email.component.scss']
})
export class PushAsEmailComponent implements OnInit {
  digest = 'no';
  email: string;

  constructor() { }

  ngOnInit(): void {
  }

}
