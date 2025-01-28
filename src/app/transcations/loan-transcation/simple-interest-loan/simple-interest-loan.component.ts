import { Component } from '@angular/core';
import { Loantransactionconstant } from '../loan-transaction-constant';
import { MenuItem } from 'primeng/api';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { CommonFunctionsService } from 'src/app/shared/commonfunction.service';
import { EncryptDecryptService } from 'src/app/shared/encrypt-decrypt.service';
import { CommonComponent } from 'src/app/shared/common.component';
import { SiTransactionDetailsService } from '../shared/si-loans/si-transaction-details.service';
import { applicationConstants } from 'src/app/shared/applicationConstants';
import { Responsemodel } from 'src/app/shared/responsemodel';
import { DatePipe } from '@angular/common';
import { SiLoanApplication } from '../shared/si-loans/si-loan-application.model';
import { FileUploadService } from 'src/app/shared/file-upload.service';
import { ERP_TRANSACTION_CONSTANTS } from '../../erp-transaction-constants';
import { SiLoanApplicationService } from '../shared/si-loans/si-loan-application.service';
import { SiLoanKycService } from '../shared/si-loans/si-loan-kyc.service';

@Component({
  selector: 'app-simple-interest-loan',
  templateUrl: './simple-interest-loan.component.html',
  styleUrls: ['./simple-interest-loan.component.css']
})
export class SimpleInterestLoanComponent {

  siLoanApplicationModel: SiLoanApplication = new SiLoanApplication();
  responseModel!: Responsemodel;
  items: MenuItem[] | undefined;
  activeItem: MenuItem | undefined;
  isMemberCreation: boolean = false;
  orgnizationSetting: any;
  operations: any;
  operationslist: any;
  value: number = 0;
  msgs: any[] = [];
  columns: any[] = [];
  gridList: any[] = [];
  showForm: boolean = false;
  activeStatusCount: number = 0;
  inactiveStatusCount: number = 0;

  memberPhotoCopyZoom: boolean = false;
  memberphotCopyMultipartFileList: any;

  pacsId: any;
  branchId: any;
  tempGridListData: any[] = [];
  gridListLenght: Number | undefined;

  constructor(private router: Router, private translate: TranslateService, private commonFunctionsService: CommonFunctionsService,
    private encryptDecryptService: EncryptDecryptService, private commonComponent: CommonComponent,
    private siTransactionDetailsService: SiTransactionDetailsService, private datePipe: DatePipe,
    private fileUploadService: FileUploadService,  private siLoanApplicationService: SiLoanApplicationService,
    private siLoanKycService: SiLoanKycService ) {
  }

  ngOnInit() {
    this.orgnizationSetting = this.commonComponent.orgnizationSettings();
    this.commonFunctionsService.setStorageValue('language', 'en');
    this.pacsId = this.commonFunctionsService.getStorageValue(applicationConstants.PACS_ID);
    this.branchId = this.commonFunctionsService.getStorageValue(applicationConstants.BRANCH_ID);
    this.commonFunctionsService.data.subscribe((res: any) => {
      if (res) {
        this.translate.use(res);
      } else {
        this.translate.use('en');
      }
    });
    this.columns = [
      { field: 'accountNumber', header: 'ERP.ACCOUNT_NUMBER' },
      { field: 'admissionNo', header: 'ERP.ADMISSION_NUMBER' },
      { field: 'applicationDateVal', header: 'ERP.APPLICATION_DATE' },
      { field: 'sanctionDateVal', header: 'ERP.SANCTION_DATE' },
      { field: 'repaymentFrequencyName', header: 'ERP.REPAYMENT_FREQUENCY' },
      { field: 'accountStatusName', header: 'ERP.STATUS' }
    ];
    this.operationslist = [
      { label: "Disbursement", value: 1 },
      { label: "Collection", value: 2 },
      { label: "Closure", value: 3 },
    ]
    // this.getAll();
    this.getAllSILoanDetailsBypacsIdAndBranchId();
  }

  getAll() {
    this.siTransactionDetailsService.getAllSITransactionDetails().subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel != null && this.responseModel != undefined) {
        if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
          this.gridList = this.responseModel.data;
          this.gridList = this.responseModel.data.map((member: any) => {
            if (member != null && member != undefined && member.applicationDate != null && member.applicationDate != undefined) {
              member.applicationDateVal = this.datePipe.transform(member.applicationDate, this.orgnizationSetting.datePipe);
            }
            if (member != null && member != undefined && member.sanctionDate != null && member.sanctionDate != undefined) {
              member.sanctionDateVal = this.datePipe.transform(member.sanctionDate, this.orgnizationSetting.datePipe);
            }
            member.multipartFileListForPhotoCopy = null;
            if (member.memberPhotoCopyPath != null && member.memberPhotoCopyPath != undefined)
              member.multipartFileListForPhotoCopy = this.fileUploadService.getFile(member.memberPhotoCopyPath, ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.FILES + "/" + member.memberPhotoCopyPath);

            if (member.balance == null || member.balance == undefined || member.balance == 0) {
              member.balance = "0.0/-";
            }
            else {
              member.balance = member.balance + "/-";
            }
            return member
          });

        } else {
          this.msgs = [];
          this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: this.responseModel.statusMsg }];
          setTimeout(() => {
            this.msgs = [];
          }, 2000);
        }
      }
    }, error => {
      this.msgs = [];
      this.commonComponent.stopSpinner();
      this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: applicationConstants.WE_COULDNOT_PROCESS_YOU_ARE_REQUEST }];
    });
  }

  getAllSILoanDetailsBypacsIdAndBranchId() {
    this.siTransactionDetailsService.getAllSILoanDetailsByPacsIdAndBranchId(this.pacsId, this.branchId).subscribe((data: any) => {
      this.responseModel = data;
      if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
        if (this.responseModel.data != null && this.responseModel.data != undefined && this.responseModel.data.length > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
          this.gridList = this.responseModel.data.map((siLoan: any) => {
            if (siLoan != null && siLoan != undefined && siLoan.accountOpenDate != null && siLoan.accountOpenDate != undefined) {
              siLoan.accountOpenDate = this.datePipe.transform(siLoan.accountOpenDate, this.orgnizationSetting.datePipe);
            }
            if (siLoan != null && siLoan != undefined && siLoan.applicationDate != null && siLoan.applicationDate != undefined) {
              siLoan.applicationDateVal = this.datePipe.transform(siLoan.applicationDate, this.orgnizationSetting.datePipe);
            }
            if (siLoan != null && siLoan != undefined && siLoan.sanctionDate != null && siLoan.sanctionDate != undefined) {
              siLoan.sanctionDateVal = this.datePipe.transform(siLoan.sanctionDate, this.orgnizationSetting.datePipe);
            }
            siLoan.multipartFileListForPhotoCopy = null;
            if (siLoan.memberPhotoCopyPath != null && siLoan.memberPhotoCopyPath != undefined)
              siLoan.multipartFileListForPhotoCopy = this.fileUploadService.getFile(siLoan.memberPhotoCopyPath, ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.FILES + "/" + siLoan.memberPhotoCopyPath);

            if (siLoan.balance == null || siLoan.balance == undefined || siLoan.balance == 0) {
              siLoan.balance = "0.0/-";
            }
            else {
              siLoan.balance = siLoan.balance + "/-";
            }
            return siLoan
          });
          this.activeStatusCount = this.gridList.filter(sbAccountApplication => sbAccountApplication.status != null && sbAccountApplication.status != undefined && sbAccountApplication.status === applicationConstants.ACTIVE).length;
          this.inactiveStatusCount = this.gridList.filter(sbAccountApplication => sbAccountApplication.status != null && sbAccountApplication.status != undefined && sbAccountApplication.status === applicationConstants.IN_ACTIVE).length;
          this.gridListLenght = this.gridList.length;
          this.tempGridListData = this.gridList;
        }
      } else {
        this.msgs = [];
        this.msgs = [{ severity: "error", summary: 'Failed', detail: applicationConstants.WE_COULDNOT_PROCESS_YOU_ARE_REQUEST }];
        setTimeout(() => {
          this.msgs = [];
        }, 3000);
      }
    }, error => {
      this.msgs = [];
      this.msgs = [{ severity: "error", summary: 'Failed', detail: applicationConstants.WE_COULDNOT_PROCESS_YOU_ARE_REQUEST }];
      setTimeout(() => {
        this.msgs = [];
      }, 3000);
    });
  }

  createSILoanAccount() {
    this.siLoanApplicationService.resetCurrentStep();
    this.siLoanKycService.resetCurrentStep();
    
    this.commonFunctionsService.setStorageValue('b-class-member_creation', false);
    this.commonFunctionsService.setStorageValue(applicationConstants.INDIVIDUAL_MEMBER_DTAILS, null);
    this.commonFunctionsService.setStorageValue(applicationConstants.GROUP_DETAILS, null);
    this.commonFunctionsService.setStorageValue(applicationConstants.INSTITUTION_DETAILS, null);
    this.router.navigate([Loantransactionconstant.SIMPLE_INTEREST_LOANS_KYC], { queryParams: { createLoanFlag: this.encryptDecryptService.encrypt(true) } });
  }

  edit(rowData: any) {
    this.router.navigate([Loantransactionconstant.VIEW_SIMPLE_INTEREST_LOAN], { queryParams: { id: this.encryptDecryptService.encrypt(rowData.id), editOpt: this.encryptDecryptService.encrypt(applicationConstants.ACTIVE), isGridPage: this.encryptDecryptService.encrypt(applicationConstants.IN_ACTIVE) } });
  }

  view(rowData: any) {
    this.router.navigate([Loantransactionconstant.VIEW_SIMPLE_INTEREST_LOAN], { queryParams: { id: this.encryptDecryptService.encrypt(rowData.id), isGridPage: this.encryptDecryptService.encrypt(applicationConstants.IN_ACTIVE) } });
  }

  onChange() {
    this.isMemberCreation = !this.isMemberCreation;
  }

  navigateToInfoDetails(event: any, rowData: any) {
    if (event.value === 1)
      this.router.navigate([Loantransactionconstant.SIMPLE_INTEREST_LOAN_DISBURSEMENTS], { queryParams: { id: this.encryptDecryptService.encrypt(rowData.id) } });
    else if (event.value === 2)
      this.router.navigate([Loantransactionconstant.SIMPLE_INTEREST_LOAN_COLLECTIONS], { queryParams: { id: this.encryptDecryptService.encrypt(rowData.id) } });
    else if (event.value === 3)
      this.router.navigate([Loantransactionconstant.SIMPLE_INTEREST_LOAN_CLOSURE], { queryParams: { id: this.encryptDecryptService.encrypt(rowData.id) } });
  }

  onSearch() {
    this.showForm = !this.showForm;
  }

  onClickMemberPhotoCopy(sbRowData: any) {
    this.memberPhotoCopyZoom = true;
    this.memberphotCopyMultipartFileList = [];
    this.memberphotCopyMultipartFileList = sbRowData.multipartFileListForPhotoCopy;
  }

  closePhoto() {
    this.memberPhotoCopyZoom = false;
  }

}
