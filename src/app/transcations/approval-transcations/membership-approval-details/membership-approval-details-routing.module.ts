import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TransactionsComponent } from '../../transactions/transactions.component';
import { MembershipApprovalDetailsComponent } from './membership-approval-details.component';
import { MemberApprovalComponent } from './member-approval/member-approval.component';
import { SavingsAccountTransactionAppovalComponent } from '../savings-account-application-approval/savings-account-transaction-appoval/savings-account-transaction-appoval.component';

const routes: Routes = [
  
    { path: '', component: TransactionsComponent,

        children: [
          { path: 'membership_approval_details', component: MembershipApprovalDetailsComponent},

         
          { path: 'member_approval', component:MemberApprovalComponent},

          
      ]
    },               
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class MembershipApprovalDetailsRoutingModule {
 
}
