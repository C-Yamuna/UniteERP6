import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { TransactionsComponent } from '../transactions/transactions.component';
import { ApprovalTranscationsComponent } from './approval-transcations.component';
import { TermDepositApprovalDetailsComponent } from './term-deposit-approval-details/term-deposit-approval-details.component';
import { ReccuringDepositApprovalDetailsComponent } from './term-deposit-approval-details/reccuring-deposit-approval-details/reccuring-deposit-approval-details.component';
import { ReccuringDepositApprovalComponent } from './term-deposit-approval-details/reccuring-deposit-approval-details/reccuring-deposit-approval/reccuring-deposit-approval.component';
import { FdNonCummulativeApprovalDetailsComponent } from './term-deposit-approval-details/fd-non-cummulative-approval-details/fd-non-cummulative-approval-details.component';
import { FdNonCummulativeApprovalComponent } from './term-deposit-approval-details/fd-non-cummulative-approval-details/fd-non-cummulative-approval/fd-non-cummulative-approval.component';
import { FdCummulativeApprovalDetailsComponent } from './term-deposit-approval-details/fd-cummulative-approval-details/fd-cummulative-approval-details.component';
import { FdCummulativeApprovalComponent } from './term-deposit-approval-details/fd-cummulative-approval-details/fd-cummulative-approval/fd-cummulative-approval.component';
import { LoansApprovalDetailsComponent } from './loans-approvals/loans-approval-details.component';
import { SiLoanApprovalDetailsComponent } from './loans-approvals/si-loan-approval-details/si-loan-approval-details.component';
import { SiLoanApprovalComponent } from './loans-approvals/si-loan-approval-details/si-loan-approval/si-loan-approval.component';
import { CiLoanApprovalDetailsComponent } from './loans-approvals/ci-loan-approval-details/ci-loan-approval-details.component';
import { CiLoanApprovalStatusUpdateComponent } from './loans-approvals/ci-loan-approval-details/ci-loan-status-update/ci-loan-approval-status-update/ci-loan-approval-status-update.component';
import { ViewSbApprovalComponent } from './savings-account-application-approval/view_sb_Approval/view-sb-approval/view-sb-approval.component';
import { SaoLoanApprovalDetailsComponent } from './loans-approvals/sao-loan-approval-details/sao-loan-approval-details.component';
import { SaoLoanApprovalComponent } from './loans-approvals/sao-loan-approval-details/sao-loan-approval/sao-loan-approval.component';
import { TermLoanApplicationDetailsComponent } from '../loan-transcation/term-loan/term-loan-stepper/term-loan-application-details/term-loan-application-details.component';
import { TermLoanApprovalComponent } from './loans-approvals/term-loan-approval-details/term-loan-approval/term-loan-approval.component';
import { TermLoanApprovalDetailsComponent } from './loans-approvals/term-loan-approval-details/term-loan-approval-details.component';
import { BorrowingsApprovalDetailsComponent } from './borrowings-approval-details/borrowings-approval-details.component';
import { CiBorrowingApprovalDetailsComponent } from './borrowings-approval-details/ci-borrowing-approval-details/ci-borrowing-approval-details.component';
import { CiBorrowingApprovalComponent } from './borrowings-approval-details/ci-borrowing-approval-details/ci-borrowing-approval/ci-borrowing-approval.component';
import { SiBorrowingApprovalDetailsComponent } from './borrowings-approval-details/si-borrowing-approval-details/si-borrowing-approval-details.component';
import { SiBorrowingApprovalComponent } from './borrowings-approval-details/si-borrowing-approval-details/si-borrowing-approval/si-borrowing-approval.component';
import { SaoBorrowingApprovalDetailsComponent } from './borrowings-approval-details/sao-borrowing-approval-details/sao-borrowing-approval-details.component';
import { SaoBorrowingApprovalComponent } from './borrowings-approval-details/sao-borrowing-approval-details/sao-borrowing-approval/sao-borrowing-approval.component';
import { TermBorrowingApprovalDetailsComponent } from './borrowings-approval-details/term-borrowing-approval-details/term-borrowing-approval-details.component';
import { TermBorrowingApprovalComponent } from './borrowings-approval-details/term-borrowing-approval-details/term-borrowing-approval/term-borrowing-approval.component';


const routes: Routes = [
  {
    path: '', component: TransactionsComponent,
    children: [
      { path: 'approval_transactions', component: ApprovalTranscationsComponent },
      { path: 'term_deposit_approval_details', component: TermDepositApprovalDetailsComponent },
      { path: 'fd_non_cummulative_approval_details', component: FdNonCummulativeApprovalDetailsComponent },
      { path: 'fd_non_cummulative_approval', component: FdNonCummulativeApprovalComponent },
      { path: 'fd_cummulative_approval_details', component: FdCummulativeApprovalDetailsComponent },
      { path: 'fd_cummulative_approval', component: FdCummulativeApprovalComponent },
      { path: 'reccuring_deposit_approval_details', component: ReccuringDepositApprovalDetailsComponent },
      { path: 'reccuring_deposit_approval', component: ReccuringDepositApprovalComponent },

      //loans approvals
      { path: 'loans_approval_details', component: LoansApprovalDetailsComponent },

      { path: 'si_loan_approval_details', component: SiLoanApprovalDetailsComponent },
      { path: 'si_loan_approval', component: SiLoanApprovalComponent},

      {path: 'ci_loan_approval_grid', component: CiLoanApprovalDetailsComponent},
      {path: 'ci_loan_approval_status_update', component: CiLoanApprovalStatusUpdateComponent},

      {path: 'sao_loan_approval_details', component: SaoLoanApprovalDetailsComponent},
      {path: 'sao_loan_approval', component: SaoLoanApprovalComponent},

      {path: 'term_loan_approval_details', component: TermLoanApprovalDetailsComponent},
      {path: 'term_loan_approval', component: TermLoanApprovalComponent},

      {path: 'sb_approval_view',component:ViewSbApprovalComponent},
     
      //Borrowing-approvals
      { path: 'borrowing_approval_details', component: BorrowingsApprovalDetailsComponent },

      { path: 'ci_borrowing_approval_details', component: CiBorrowingApprovalDetailsComponent },
      { path: 'ci_borrowing_approval', component: CiBorrowingApprovalComponent },

      { path: 'si_borrowing_approval_details', component: SiBorrowingApprovalDetailsComponent },
      { path: 'si_borrowing_approval', component: SiBorrowingApprovalComponent },

      { path: 'sao_borrowing_approval_details', component: SaoBorrowingApprovalDetailsComponent },
      { path: 'sao_borrowing_approval', component: SaoBorrowingApprovalComponent },

      { path: 'term_borrowing_approval_details', component: TermBorrowingApprovalDetailsComponent },
      { path: 'term_borrowing_approval', component: TermBorrowingApprovalComponent },
      
    ]
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class ApprovalTranscationsRoutingModule { }
