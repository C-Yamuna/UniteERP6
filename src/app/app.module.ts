import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ChangePasswordComponent } from './authentication/change-password/change-password.component';
import { ForgotPasswordComponent } from './authentication/forgot-password/forgot-password.component';
import { LoginComponent } from './authentication/login/login.component';
import { FooterComponent } from './layout/footer/footer.component';
import { HeaderComponent } from './layout/header/header.component';
import { MainmenuComponent } from './layout/mainmenu/mainmenu.component';
import { MenuComponent } from './layout/menu/menu.component';
import { RouterModule } from '@angular/router';
import { AppRoutes, routes } from './app.routes';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PrimengMaterialUiModule } from './shared/primeng.material.module';
import { MessageService } from 'primeng/api';
// import { TransactionsComponent } from './transcations/transactions/transactions.component';
// i18n translater
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HTTP_INTERCEPTORS, HttpClient,HttpClientModule } from '@angular/common/http';
export function httpLoaderFactory(httpClient: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(httpClient, './assets/i18n/', '.json');
}
import { CommonFunctionsService } from './shared/commonfunction.service';
import { CommonHttpService } from './shared/common-http.service';
import { ErpInterceptor } from './shared/erpInterceptor';
import { EncryptDecryptService } from './shared/encrypt-decrypt.service';
import { CommonComponent } from './shared/common.component';
import { AuthenticationService } from './authentication/service/authentication.service';
import { DatePipe, HashLocationStrategy, LocationStrategy } from '@angular/common';
import { PasswordModule } from 'primeng/password';
import { OrganizationChartModule } from 'primeng/organizationchart';
//spinner
import { NgxSpinnerModule } from 'ngx-spinner';
// Scroller
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { SpeedDialModule } from 'primeng/speeddial';
import { MembershipApprovalDetailsComponent } from './transcations/approval-transcations/membership-approval-details/membership-approval-details.component';
import { MemberApprovalComponent } from './transcations/approval-transcations/membership-approval-details/member-approval/member-approval.component';
import { SavingsApplicationApprovalComponent } from './transcations/approval-transcations/savings-account-application-approval/savings-application-approval/savings-application-approval.component';
import { SavingsAccountApplicationApprovalComponent } from './transcations/approval-transcations/savings-account-application-approval/savings_acc_approval/savings-account-application-approval.component';
import { SaoLoanApprovalDetailsComponent } from './transcations/approval-transcations/loans-approvals/sao-loan-approval-details/sao-loan-approval-details.component';
import { SiLoanApprovalDetailsComponent } from './transcations/approval-transcations/loans-approvals/si-loan-approval-details/si-loan-approval-details.component';
import { CiLoanApprovalDetailsComponent } from './transcations/approval-transcations/loans-approvals/ci-loan-approval-details/ci-loan-approval-details.component';
import { TermLoanApprovalDetailsComponent } from './transcations/approval-transcations/loans-approvals/term-loan-approval-details/term-loan-approval-details.component';
import { SaoLoanApprovalComponent } from './transcations/approval-transcations/loans-approvals/sao-loan-approval-details/sao-loan-approval/sao-loan-approval.component';
import { SavingsAccountTransactionAppovalComponent } from './transcations/approval-transcations/savings-account-application-approval/savings-account-transaction-appoval/savings-account-transaction-appoval.component';
import { ProductDefinitionApprovalComponent } from './transcations/product-definition-approval/product-definition-approval.component';

@NgModule({
  declarations: [
    AppComponent,
    ChangePasswordComponent,
    ForgotPasswordComponent,
    LoginComponent,
    FooterComponent,
    HeaderComponent,
    MainmenuComponent,
    MenuComponent,
    MembershipApprovalDetailsComponent,
    MemberApprovalComponent,
    SavingsAccountApplicationApprovalComponent,
    SavingsApplicationApprovalComponent,
    SaoLoanApprovalDetailsComponent,
    SiLoanApprovalDetailsComponent,
    CiLoanApprovalDetailsComponent,
    TermLoanApprovalDetailsComponent,
    SaoLoanApprovalComponent,
    SavingsAccountTransactionAppovalComponent,
    // NgxSpinnerModule,
    // TransactionsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterModule.forRoot(routes),
    AppRoutes,
    FormsModule,
    ReactiveFormsModule,
    PrimengMaterialUiModule,
    BrowserAnimationsModule,
    NgxSpinnerModule.forRoot(),
    TranslateModule.forRoot({
      loader: {
          provide: TranslateLoader,
          useFactory: httpLoaderFactory,
          deps: [HttpClient]
      },
      isolate: true
  }),
   TranslateModule,
   HttpClientModule,
   PasswordModule,
   ScrollPanelModule,
   OrganizationChartModule,
   SpeedDialModule
  ],
  
  providers: [MessageService,TranslateService,CommonFunctionsService,CommonHttpService,EncryptDecryptService,CommonComponent, DatePipe,AuthenticationService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass:   ErpInterceptor,
      multi: true
  },
  { provide: LocationStrategy, useClass: HashLocationStrategy },

  ],

  bootstrap: [AppComponent],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA,
    NO_ERRORS_SCHEMA
],

})
export class AppModule { }
