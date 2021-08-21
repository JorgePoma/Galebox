import { Component, OnInit } from '@angular/core';
import { AccountService } from "../services/account.service";

@Component({
  selector: 'app-account',
  templateUrl: './account.page.html',
  styleUrls: ['./account.page.scss'],
})
export class AccountPage implements OnInit {

  constructor(
    private accountService:AccountService
  ) { }

  ngOnInit() {

  }
  getCurrentAccount(){
    try {
      this.accountService.verifyLogin()
    } catch (error) {
      console.log(error)
    }
    
  }
}
