import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { PrimengMaterialUiModule } from 'src/app/shared/primeng.material.module';
import { MessageModule } from 'primeng/message';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonHttpService } from 'src/app/shared/common-http.service';
import { EncryptDecryptService } from 'src/app/shared/encrypt-decrypt.service';
import { CommonComponent } from 'src/app/shared/common.component';
import { ProductDefinitionApprovalComponent } from './product-definition-approval.component';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TermDepositProductDefinitionApprovalComponent } from './term-deposit-product-definition-approval/term-deposit-product-definition-approval.component';
import { FdCummulativeProductDefinitionApprovalComponent } from './term-deposit-product-definition-approval/fd-cummulative-product-definition-approval/fd-cummulative-product-definition-approval.component';
import { FdNonCummulativeProductDefinitionApprovalComponent } from './term-deposit-product-definition-approval/fd-non-cummulative-product-definition-approval/fd-non-cummulative-product-definition-approval.component';
import { RecurringDepositProductDefinitionApprovalComponent } from './term-deposit-product-definition-approval/recurring-deposit-product-definition-approval/recurring-deposit-product-definition-approval.component';
import { ProductDefinitionApprovalRoutingModule } from './product-definition-approval-routing.module';
import { FdCummulativeProductDefinitionApprovalDetailsComponent } from './term-deposit-product-definition-approval/fd-cummulative-product-definition-approval/fd-cummulative-product-definition-approval-details/fd-cummulative-product-definition-approval-details.component';
import { RecurringDepositProductDefinitionApprovalDetailsComponent } from './term-deposit-product-definition-approval/recurring-deposit-product-definition-approval/recurring-deposit-product-definition-approval-details/recurring-deposit-product-definition-approval-details.component';
import { FdNonCummulativeProductDefinitionApprovalDetailsComponent } from './term-deposit-product-definition-approval/fd-non-cummulative-product-definition-approval/fd-non-cummulative-product-definition-approval-details/fd-non-cummulative-product-definition-approval-details.component';
import { TermLoanProductDefinitionApprovalComponent } from './loans-product-definition_approval/term-loan-product-definition-approval/term-loan-product-definition-approval.component';
import { SaoLoanProductDefinitionApprovalComponent } from './loans-product-definition_approval/sao-loan-product-definition-approval/sao-loan-product-definition-approval.component';
import { SiLoanProductDefinitionApprovalComponent } from './loans-product-definition_approval/si-loan-product-definition-approval/si-loan-product-definition-approval.component';
import { CiLoanProductDefinitionApprovalComponent } from './loans-product-definition_approval/ci-loan-product-definition-approval/ci-loan-product-definition-approval.component';
import { CiLoanProductDefinitionApprovalDetailsComponent } from './loans-product-definition_approval/ci-loan-product-definition-approval/ci-loan-product-definition-approval-details/ci-loan-product-definition-approval-details.component';
import { SaoLoanProductDefinitionApprovalDetailsComponent } from './loans-product-definition_approval/sao-loan-product-definition-approval/sao-loan-product-definition-approval-details/sao-loan-product-definition-approval-details.component';
import { SiLoanProductDefinitionApprovalDetailsComponent } from './loans-product-definition_approval/si-loan-product-definition-approval/si-loan-product-definition-approval-details/si-loan-product-definition-approval-details.component';
import { TermLoanProductDefinitionApprovalDetailsComponent } from './loans-product-definition_approval/term-loan-product-definition-approval/term-loan-product-definition-approval-details/term-loan-product-definition-approval-details.component';
import { SavingsBankProductDefinitionApprovalDetailsComponent } from './savings-bank-product-definition-approval-details/savings-bank-product-definition-approval-details.component';
import { SavingsBankProductDefinitionApprovalComponent } from './savings-bank-product-definition-approval-details/savings-bank-product-definition-approval/savings-bank-product-definition-approval.component';
export function httpLoaderFactory(httpClient: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(httpClient, './assets/i18n/', '.json');
}


@NgModule({
  declarations: [
    ProductDefinitionApprovalComponent,
    TermDepositProductDefinitionApprovalComponent,
    FdCummulativeProductDefinitionApprovalComponent,
    FdNonCummulativeProductDefinitionApprovalComponent,
    RecurringDepositProductDefinitionApprovalComponent,
    FdCummulativeProductDefinitionApprovalDetailsComponent,
    RecurringDepositProductDefinitionApprovalDetailsComponent,
    FdNonCummulativeProductDefinitionApprovalDetailsComponent,
    TermLoanProductDefinitionApprovalComponent,
    SaoLoanProductDefinitionApprovalComponent,
    SiLoanProductDefinitionApprovalComponent,
    CiLoanProductDefinitionApprovalComponent,
    CiLoanProductDefinitionApprovalDetailsComponent,
    SaoLoanProductDefinitionApprovalDetailsComponent,
    SiLoanProductDefinitionApprovalDetailsComponent,
    TermLoanProductDefinitionApprovalDetailsComponent,
    SavingsBankProductDefinitionApprovalDetailsComponent,
    SavingsBankProductDefinitionApprovalComponent,
  ],
  
  imports: [
    CommonModule,
    ProductDefinitionApprovalRoutingModule,
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
export class ProductDefinitionApprovalModule { }
