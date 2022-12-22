import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AccountFormPageRoutingModule } from './account-form-routing.module';

import { AccountFormPage } from './account-form.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AccountFormPageRoutingModule
  ],
  declarations: [AccountFormPage]
})
export class AccountFormPageModule {}
