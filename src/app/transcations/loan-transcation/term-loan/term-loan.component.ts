import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { applicationConstants } from 'src/app/shared/applicationConstants';
import { CommonComponent } from 'src/app/shared/common.component';
import { CommonFunctionsService } from 'src/app/shared/commonfunction.service';
import { EncryptDecryptService } from 'src/app/shared/encrypt-decrypt.service';
import { TermApplicationService } from './term-loan-stepper/term-loan-application-details/shared/term-application.service';
import { Loantransactionconstant } from '../loan-transaction-constant';
import { MenuItem } from 'primeng/api';
import { Responsemodel } from 'src/app/shared/responsemodel';
import { TermApplication } from './term-loan-stepper/term-loan-application-details/shared/term-application.model';
import { FileUploadService } from 'src/app/shared/file-upload.service';
import { ERP_TRANSACTION_CONSTANTS } from '../../erp-transaction-constants';

@Component({
  selector: 'app-term-loan',
  templateUrl: './term-loan.component.html',
  styleUrls: ['./term-loan.component.css']
})
export class TermLoanComponent {
  termLoanApplicationModel: TermApplication = new TermApplication();
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
    private termApplicationService: TermApplicationService, private datePipe: DatePipe,
    private fileUploadService: FileUploadService) {
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
      // { field: 'repaymentFrequencyName', header: 'ERP.REPAYMENT_FREQUENCY' },
      { field: 'effectiveRoi', header: 'ERP.ROI' },
      { field: 'accountStatusName', header: 'ERP.STATUS' }
    ];
    this.operationslist = [
      { label: "Disbursement", value: 1 },
      { label: "Collection", value: 2 },
      { label: "Closure", value: 3 },
    ]
    this.getAllTermLoanDetailsBypacsIdAndBranchId();
  }

  getAllTermLoanDetailsBypacsIdAndBranchId() {
    this.termApplicationService.getTermByBranchIdPacsId(this.pacsId, this.branchId).subscribe((data: any) => {
      this.responseModel = data;
      if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
        if (this.responseModel.data != null && this.responseModel.data != undefined && this.responseModel.data.length > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
          this.gridList = this.responseModel.data.map((termLoan: any) => {
            
            if (termLoan != null && termLoan != undefined && termLoan.applicationDate != null && termLoan.applicationDate != undefined) {
              termLoan.applicationDateVal = this.datePipe.transform(termLoan.applicationDate, this.orgnizationSetting.datePipe);
            }
            if (termLoan != null && termLoan != undefined && termLoan.sanctionDate != null && termLoan.sanctionDate != undefined) {
              termLoan.sanctionDateVal = this.datePipe.transform(termLoan.sanctionDate, this.orgnizationSetting.datePipe);
            }
            if((termLoan.accountStatusName == applicationConstants.SUBMISSION_FOR_APPROVAL) ||  (termLoan.accountStatusName == applicationConstants.APPROVED)){
              termLoan.viewButton = true;
              termLoan.actionButton = false;
            }
            else{
              termLoan.actionButton = true;
              termLoan.viewButton = false;
            }
            if(termLoan.accountStatusName == applicationConstants.APPROVED){
              termLoan.approved = true;
            }
            else if(termLoan.accountStatusName == applicationConstants.REJECTED){
              termLoan.rejected = true;
            }
            else if(termLoan.accountStatusName == applicationConstants.SUBMISSION_FOR_APPROVAL){
              termLoan.submissionForApproval = true; 
            }
            else if(termLoan.accountStatusName == applicationConstants.CREATED || termLoan.accountStatusName == applicationConstants.IN_PROGRESS){
              termLoan.created = true; 
            }
            termLoan.multipartFileListForPhotoCopy = null;
            if (termLoan.memberPhotoCopyPath != null && termLoan.memberPhotoCopyPath != undefined)
              termLoan.multipartFileListForPhotoCopy = this.fileUploadService.getFile(termLoan.memberPhotoCopyPath, ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.FILES + "/" + termLoan.memberPhotoCopyPath);

            if (termLoan.balance == null || termLoan.balance == undefined || termLoan.balance == 0) {
              termLoan.balance = "0.0/-";
            }
            else {
              termLoan.balance = termLoan.balance + "/-";
            }
            return termLoan
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

  createaccount() {
    this.commonFunctionsService.setStorageValue(applicationConstants.B_CLASS_MEMBER_CREATION, false);
    this.router.navigate([Loantransactionconstant.TERMLOANS_MEMBERSHIP]);
  }

  edit(rowData: any) {
    this.router.navigate([Loantransactionconstant.PREVIEW_TERM_LOAN], { queryParams: { id: this.encryptDecryptService.encrypt(rowData.id), editOpt: this.encryptDecryptService.encrypt(applicationConstants.ACTIVE), isGridPage: this.encryptDecryptService.encrypt(applicationConstants.IN_ACTIVE) } });
  }

  view(rowData: any) {
    this.router.navigate([Loantransactionconstant.PREVIEW_TERM_LOAN], { queryParams: { id: this.encryptDecryptService.encrypt(rowData.id),editOpt: this.encryptDecryptService.encrypt(applicationConstants.IN_ACTIVE), isGridPage: this.encryptDecryptService.encrypt(applicationConstants.IN_ACTIVE) } });
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
