import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.page.html',
  styleUrls: ['./add-user.page.scss'],
})
export class AddUserPage implements OnInit {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: number;

  fInput: any;
  lInput: any;

  userInfo = {
    email: '',
    password: '',
    username: '',
    role: 5,
  };

  constructor() {}

  ngOnInit() {}

  edit() {}
}
