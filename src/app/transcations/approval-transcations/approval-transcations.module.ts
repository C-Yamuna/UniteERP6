import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ApprovalTranscationsComponent } from './approval-transcations.component';
import { PrimengMaterialUiModule } from 'src/app/shared/primeng.material.module';
import { MessageModule } from 'primeng/message';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { ApprovalTranscationsRoutingModule } from './approval-transcations-routing.module';
import { FdNonCummulativeApprovalDetailsComponent } from './term-deposit-approval-details/fd-non-cummulative-approval-details/fd-non-cummulative-approval-details.component';
import { FdCummulativeApprovalDetailsComponent } from './term-deposit-approval-details/fd-cummulative-approval-details/fd-cummulative-approval-details.component';
import { ReccuringDepositApprovalDetailsComponent } from './term-deposit-approval-details/reccuring-deposit-approval-details/reccuring-deposit-approval-details.component';
import { FdCummulativeApprovalComponent } from './term-deposit-approval-details/fd-cummulative-approval-details/fd-cummulative-approval/fd-cummulative-approval.component';
import { FdNonCummulativeApprovalComponent } from './term-deposit-approval-details/fd-non-cummulative-approval-details/fd-non-cummulative-approval/fd-non-cummulative-approval.component';
import { ReccuringDepositApprovalComponent } from './term-deposit-approval-details/reccuring-deposit-approval-details/reccuring-deposit-approval/reccuring-deposit-approval.component';
import { TermDepositApprovalDetailsComponent } from './term-deposit-approval-details/term-deposit-approval-details.component';
import { CommonHttpService } from 'src/app/shared/common-http.service';
import { EncryptDecryptService } from 'src/app/shared/encrypt-decrypt.service';
import { CommonComponent } from 'src/app/shared/common.component';
import { LoansApprovalDetailsComponent } from './loans-approvals/loans-approval-details.component';
import { SiLoanApprovalComponent } from './loans-approvals/si-loan-approval-details/si-loan-approval/si-loan-approval.component';
import { CiLoanApprovalStatusUpdateComponent } from './loans-approvals/ci-loan-approval-details/ci-loan-status-update/ci-loan-approval-status-update/ci-loan-approval-status-update.component';
import { ViewSbApprovalComponent } from './savings-account-application-approval/view_sb_Approval/view-sb-approval/view-sb-approval.component';
import { TermLoanApprovalComponent } from './loans-approvals/term-loan-approval-details/term-loan-approval/term-loan-approval.component';
import { BorrowingsApprovalDetailsComponent } from './borrowings-approval-details/borrowings-approval-details.component';
import { SiBorrowingApprovalDetailsComponent } from './borrowings-approval-details/si-borrowing-approval-details/si-borrowing-approval-details.component';
import { CiBorrowingApprovalDetailsComponent } from './borrowings-approval-details/ci-borrowing-approval-details/ci-borrowing-approval-details.component';
import { TermBorrowingApprovalDetailsComponent } from './borrowings-approval-details/term-borrowing-approval-details/term-borrowing-approval-details.component';
import { SaoBorrowingApprovalDetailsComponent } from './borrowings-approval-details/sao-borrowing-approval-details/sao-borrowing-approval-details.component';
import { CiBorrowingApprovalComponent } from './borrowings-approval-details/ci-borrowing-approval-details/ci-borrowing-approval/ci-borrowing-approval.component';
import { SaoBorrowingApprovalComponent } from './borrowings-approval-details/sao-borrowing-approval-details/sao-borrowing-approval/sao-borrowing-approval.component';
import { SiBorrowingApprovalComponent } from './borrowings-approval-details/si-borrowing-approval-details/si-borrowing-approval/si-borrowing-approval.component';
import { TermBorrowingApprovalComponent } from './borrowings-approval-details/term-borrowing-approval-details/term-borrowing-approval/term-borrowing-approval.component';
export function httpLoaderFactory(httpClient: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(httpClient, './assets/i18n/', '.json');
}


@NgModule({
  declarations: [
    ApprovalTranscationsComponent,
    FdNonCummulativeApprovalDetailsComponent,
    FdCummulativeApprovalDetailsComponent,
    ReccuringDepositApprovalDetailsComponent,
    FdCummulativeApprovalComponent,
    FdNonCummulativeApprovalComponent,
    ReccuringDepositApprovalComponent,
    TermDepositApprovalDetailsComponent,
    LoansApprovalDetailsComponent,
    SiLoanApprovalComponent,
    CiLoanApprovalStatusUpdateComponent,
    ViewSbApprovalComponent,
    TermLoanApprovalComponent,
    BorrowingsApprovalDetailsComponent,
    SiBorrowingApprovalDetailsComponent,
    CiBorrowingApprovalDetailsComponent,
    TermBorrowingApprovalDetailsComponent,
    SaoBorrowingApprovalDetailsComponent,
    CiBorrowingApprovalComponent,
    SaoBorrowingApprovalComponent,
    SiBorrowingApprovalComponent,
    TermBorrowingApprovalComponent
  ],
  imports: [
    CommonModule,
    ApprovalTranscationsRoutingModule,
    PrimengMaterialUiModule,
    MessageModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: httpLoaderFactory,
        deps: [HttpClient]
      },
      isolate: true
    }),
    TranslateModule,
    HttpClientModule],
  providers: [
    CommonHttpService,
    EncryptDecryptService,
    CommonComponent,
    DatePipe
  ]
})
export class ApprovalTranscationsModule { }
