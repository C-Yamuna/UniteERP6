import { ModuleWithProviders } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { MenuComponent } from "./layout/menu/menu.component";
import { MainmenuComponent } from "./layout/mainmenu/mainmenu.component";
import { HeaderComponent } from "./layout/header/header.component";
import { ChangePasswordComponent } from "./authentication/change-password/change-password.component";
import { ForgotPasswordComponent } from "./authentication/forgot-password/forgot-password.component";
import { LoginComponent } from "./authentication/login/login.component";
import { SavingsAccountApplicationApprovalComponent } from "./transcations/approval-transcations/savings-account-application-approval/savings_acc_approval/savings-account-application-approval.component";
import { SavingsApplicationApprovalComponent } from "./transcations/approval-transcations/savings-account-application-approval/savings-application-approval/savings-application-approval.component";
import { SaoLoanApprovalDetailsComponent } from "./transcations/approval-transcations/loans-approvals/sao-loan-approval-details/sao-loan-approval-details.component";
import { SaoLoanApprovalComponent } from "./transcations/approval-transcations/loans-approvals/sao-loan-approval-details/sao-loan-approval/sao-loan-approval.component";
import { SavingsAccountTransactionAppovalComponent } from "./transcations/approval-transcations/savings-account-application-approval/savings-account-transaction-appoval/savings-account-transaction-appoval.component";

export const routes: Routes = [

    {path:'', component: LoginComponent},

    {path:'menu', component: MainmenuComponent,
     children: [ 
        {path:'configurations',loadChildren:() => import('./configurations/configuration.module').then(m => m.ConfigurationModule)},
        {path: 'loan_transaction', loadChildren:() => import ('./transcations/loan-transcation/loan-transcation.module').then(m => m.LoanTranscationModule)},
        {path: 'membership_transaction',loadChildren:() => import('./transcations/membership-transcation/membership-transcation.module').then(m => m.MembershipTranscationModule)},
        {path: 'savings_bank_transactions',loadChildren:() =>import('./transcations/savings-bank-transcation/savings-bank-transcation.module').then(m => m.SavingsBankTranscationModule)},
        {path: 'term_deposit_transaction',loadChildren:() => import('./transcations/term-deposits-transcation/term-deposits-transcation.module').then(m =>m.TermDepositsTranscationModule)},
        {path: 'cash_counter_transaction',loadChildren:() => import('./transcations/cash-counter-transaction/cash-counter-transaction.module').then(m =>m.CashCounterTransactionModule)},
        {path: 'agent_details_transaction',loadChildren:() => import('./transcations/agent-details-transaction/agent-details-transaction.module').then(m => m.AgentDetailsTransactionModule)},
        {path: 'borrowing_transaction',loadChildren:() => import('./transcations/borrowing-transaction/borrowing-transaction.module').then(m => m.BorrowingTransactionModule)},
        {path: 'investments_transaction',loadChildren:() => import('./transcations/investments-transaction/investments-transaction.module').then(m => m.InvestmentsTransactionModule)},
        {path: 'daily_deposits_transaction',loadChildren:() => import('./transcations/daily-deposits-transaction/daily-deposit-transaction.module').then(m => m.DailyDepositTransactionModule)},
        {path: 'locker_transaction',loadChildren:() => import('./transcations/locker-transaction/locker-transaction.module').then(m => m.LockerTransactionModule)}, 
        {path: 'membership_approval_details',loadChildren:() => import('./transcations/approval-transcations/membership-approval-details/membership-approval-details-routing.module').then(m=>m.MembershipApprovalDetailsRoutingModule)},
        {path: 'savings_account_approval', component: SavingsAccountApplicationApprovalComponent },
        {path: 'savings_accounts_approval', component: SavingsApplicationApprovalComponent },
        {path: 'savings_account-transaction_approval', component:SavingsAccountTransactionAppovalComponent},
        {path: 'approval_transactions',loadChildren:() => import('./transcations/approval-transcations/approval-transcations.module').then(m => m.ApprovalTranscationsModule)},
        {path: 'product_definition_approval',loadChildren:() => import('./transcations/product-definition-approval/product-definition-approval.module').then(m => m.ProductDefinitionApprovalModule)},


    ]
    
    },
    { path: 'forgot-password', component: ForgotPasswordComponent },
    { path: 'change_password', component: ChangePasswordComponent },
]
export const AppRoutes: ModuleWithProviders<any> = RouterModule.forRoot(routes);