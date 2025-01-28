import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { TransactionsComponent } from '../transactions/transactions.component';
import { ProductDefinitionApprovalComponent } from './product-definition-approval.component';
import { TermDepositProductDefinitionApprovalComponent } from './term-deposit-product-definition-approval/term-deposit-product-definition-approval.component';
import { FdCummulativeProductDefinitionApprovalComponent } from './term-deposit-product-definition-approval/fd-cummulative-product-definition-approval/fd-cummulative-product-definition-approval.component';
import { FdNonCummulativeProductDefinitionApprovalComponent } from './term-deposit-product-definition-approval/fd-non-cummulative-product-definition-approval/fd-non-cummulative-product-definition-approval.component';
import { RecurringDepositProductDefinitionApprovalComponent } from './term-deposit-product-definition-approval/recurring-deposit-product-definition-approval/recurring-deposit-product-definition-approval.component';
import { FdCummulativeProductDefinitionApprovalDetailsComponent } from './term-deposit-product-definition-approval/fd-cummulative-product-definition-approval/fd-cummulative-product-definition-approval-details/fd-cummulative-product-definition-approval-details.component';
import { FdNonCummulativeProductDefinitionApprovalDetailsComponent } from './term-deposit-product-definition-approval/fd-non-cummulative-product-definition-approval/fd-non-cummulative-product-definition-approval-details/fd-non-cummulative-product-definition-approval-details.component';
import { RecurringDepositProductDefinitionApprovalDetailsComponent } from './term-deposit-product-definition-approval/recurring-deposit-product-definition-approval/recurring-deposit-product-definition-approval-details/recurring-deposit-product-definition-approval-details.component';
import { SiLoanProductDefinitionApprovalComponent } from './loans-product-definition_approval/si-loan-product-definition-approval/si-loan-product-definition-approval.component';
import { SiLoanProductDefinitionApprovalDetailsComponent } from './loans-product-definition_approval/si-loan-product-definition-approval/si-loan-product-definition-approval-details/si-loan-product-definition-approval-details.component';
import { CiLoanProductDefinitionApprovalDetailsComponent } from './loans-product-definition_approval/ci-loan-product-definition-approval/ci-loan-product-definition-approval-details/ci-loan-product-definition-approval-details.component';
import { CiLoanProductDefinitionApprovalComponent } from './loans-product-definition_approval/ci-loan-product-definition-approval/ci-loan-product-definition-approval.component';
import { SaoLoanProductDefinitionApprovalDetailsComponent } from './loans-product-definition_approval/sao-loan-product-definition-approval/sao-loan-product-definition-approval-details/sao-loan-product-definition-approval-details.component';
import { SaoLoanProductDefinitionApprovalComponent } from './loans-product-definition_approval/sao-loan-product-definition-approval/sao-loan-product-definition-approval.component';
import { TermLoanProductDefinitionApprovalDetailsComponent } from './loans-product-definition_approval/term-loan-product-definition-approval/term-loan-product-definition-approval-details/term-loan-product-definition-approval-details.component';
import { TermLoanProductDefinitionApprovalComponent } from './loans-product-definition_approval/term-loan-product-definition-approval/term-loan-product-definition-approval.component';
import { SavingsAccountApplicationApprovalComponent } from '../approval-transcations/savings-account-application-approval/savings_acc_approval/savings-account-application-approval.component';
import { SavingsBankProductDefinitionApprovalDetailsComponent } from './savings-bank-product-definition-approval-details/savings-bank-product-definition-approval-details.component';
import { SavingsBankProductDefinitionApprovalComponent } from './savings-bank-product-definition-approval-details/savings-bank-product-definition-approval/savings-bank-product-definition-approval.component';


const routes: Routes = [
  {
    path: '', component: TransactionsComponent,
    children: [
      { path: 'product_definition_approval', component: ProductDefinitionApprovalComponent },
      
      { path: 'term_deposit_product_definition_approval', component: TermDepositProductDefinitionApprovalComponent },

      { path: 'fd_cummulative_product_definition_approval', component: FdCummulativeProductDefinitionApprovalComponent },

      { path: 'fd_non_cummulative_product_definition_approval', component: FdNonCummulativeProductDefinitionApprovalComponent },

      { path: 'recurring_deposit_product_definition_approval', component: RecurringDepositProductDefinitionApprovalComponent },

      { path: 'fd_cummulative_product_definition_approval_details', component: FdCummulativeProductDefinitionApprovalDetailsComponent },

      { path: 'fd_non_cummulative_product_definition_approval_details', component: FdNonCummulativeProductDefinitionApprovalDetailsComponent },

      { path: 'recurring_deposit_product_definition_approval_details', component: RecurringDepositProductDefinitionApprovalDetailsComponent },

      { path: 'si_loan_product_definition_approval', component: SiLoanProductDefinitionApprovalComponent },

      { path: 'si_loan_product_definition_approval_details', component: SiLoanProductDefinitionApprovalDetailsComponent },

      { path: 'ci_loan_product_definition_approval', component: CiLoanProductDefinitionApprovalComponent },

      { path: 'ci_loan_product_definition_approval_details', component: CiLoanProductDefinitionApprovalDetailsComponent },

      { path: 'sao_loan_product_definition_approval', component: SaoLoanProductDefinitionApprovalComponent },

      { path: 'sao_loan_product_definition_approval_details', component: SaoLoanProductDefinitionApprovalDetailsComponent },

      { path: 'term_loan_product_definition_approval', component: TermLoanProductDefinitionApprovalComponent },

      { path: 'term_loan_product_definition_approval_details', component: TermLoanProductDefinitionApprovalDetailsComponent },

      { path: 'savings_bank_product_definition_approval_details', component: SavingsBankProductDefinitionApprovalDetailsComponent },

      { path: 'savings_bank_product_definition_approval', component: SavingsBankProductDefinitionApprovalComponent },

    ]
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductDefinitionApprovalRoutingModule { }
