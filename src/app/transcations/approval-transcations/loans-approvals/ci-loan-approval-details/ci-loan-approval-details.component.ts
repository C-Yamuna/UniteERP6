import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { MenuItem } from 'primeng/api';
import { applicationConstants } from 'src/app/shared/applicationConstants';
import { CommonComponent } from 'src/app/shared/common.component';
import { CommonFunctionsService } from 'src/app/shared/commonfunction.service';
import { EncryptDecryptService } from 'src/app/shared/encrypt-decrypt.service';
import { FileUploadService } from 'src/app/shared/file-upload.service';
import { Responsemodel } from 'src/app/shared/responsemodel';
import { ERP_TRANSACTION_CONSTANTS } from 'src/app/transcations/erp-transaction-constants';
import { CompoundInterestLoan } from 'src/app/transcations/loan-transcation/compound-interest-loan/shared/compound-interest-loan.model';
import { Loantransactionconstant } from 'src/app/transcations/loan-transcation/loan-transaction-constant';
import { CiLoanApplicationsService } from 'src/app/transcations/loan-transcation/shared/ci-loans/ci-loan-applications.service';
import { savingsbanktransactionconstant } from 'src/app/transcations/savings-bank-transcation/savingsbank-transaction-constant';

@Component({
  selector: 'app-ci-loan-approval-details',
  templateUrl: './ci-loan-approval-details.component.html',
  styleUrls: ['./ci-loan-approval-details.component.css']
})
export class CiLoanApprovalDetailsComponent {
  loans: any[] = [];
  pacsId: any;
  branchId: any;
  gridList: any [] = [];
  msgs: any[] = [];
  gridListLenght: Number | undefined;
  tempGridListData: any[] = [];
  responseModel!: Responsemodel;
  items: MenuItem[] | undefined;
  activeItem: MenuItem | undefined;
  value: number = 0;
  operationslist:any;
  operations:any;
  activeStatusCount: number = 0;
  inactiveStatusCount: number = 0;
  showForm: boolean=false;
  compoundInterestLoan : CompoundInterestLoan = new CompoundInterestLoan();
  constructor(private router: Router, private translate: TranslateService,private commonComponent: CommonComponent,
    private commonFunctionsService: CommonFunctionsService,private ciLoanApplicationService : CiLoanApplicationsService, private encryptDecryptService: EncryptDecryptService ,private fileUploadService : FileUploadService)
  { 
    this.loans = [
      { field: 'accountNumber', header: 'LOAN_TRANSACTION.ACCOUNT_NUMBER' },
      { field: 'admissionNo',header:'LOAN_TRANSACTION.ADMISSION_NUMBER'},
      { field: 'memberName', header: 'LOAN_TRANSACTION.NAME' },
      // { field: 'Application ', header: 'APPLICATION' },
      { field: 'ciProductName', header: 'LOAN_TRANSACTION.PRODUCT_NAME ' },
      { field: 'sanctionAmount',header:'LOAN_TRANSACTION.SANCTION_AMOUNT'},
      { field: 'effectiveRoi', header: 'LOAN_TRANSACTION.ROI' },
      { field: 'statusName', header: 'LOAN_TRANSACTION.STATUS' },
     // { field: 'Action', header: 'ACTION' },
    ];
  }
  ngOnInit() {
    this.commonFunctionsService.setStorageValue('language', 'en');
    this.commonFunctionsService.data.subscribe((res: any) => {
      if (res) {
        this.translate.use(res);
      } else {
        this.translate.use('en');
      }
    });
    let tabLabels = [
      'Total Accounts',
      'Total Disbursement Amount',     
      'Total Collection Amount',
      'Total SAO Loans',
      'Total Term Loans',
      ' Total Simple Interest Loans ',                   
    ];
    this. operationslist = [
      { label: "Disbursement", value: 1 },
      { label: "Collection", value: 2 },
      { label: "Closure", value: 3 },
    ]
    this.items = tabLabels.map((label, index)=> ({ label: label, value: `${index + 1}` }));
    this.pacsId = 1;
    this.branchId = 1;
    this.getAllCiLoanApplicationDetailsListByPacsIdAndBranchId();
  }
  getAllCiLoanApplicationDetailsListByPacsIdAndBranchId() {
    this.commonComponent.startSpinner();
    this.ciLoanApplicationService.getCiLoanApplicationDetailsByPacsIdAndBranchId(this.pacsId, this.branchId).subscribe((data: any) => {
      this.responseModel = data;
      if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
        this.gridList = this.responseModel.data.filter((ci: any) => ci.accountStatusName != savingsbanktransactionconstant.CREATED && ci.accountStatusName != savingsbanktransactionconstant.IN_PROGRESS).map((ci: any) =>  {
          ci.multipartFileListForPhotoCopy = null;
          if(ci.memberPhotoCopyPath != null && ci.memberPhotoCopyPath != undefined && ci.isNewMember){
            ci.multipartFileListForPhotoCopy = this.fileUploadService.getFile(ci.memberPhotoCopyPath ,ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.FILES + "/" + ci.memberPhotoCopyPath  );
          }
          else{
            ci.multipartFileListForPhotoCopy = this.fileUploadService.getFile(ci.memberPhotoCopyPath ,ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.FILES + "/" + ci.memberPhotoCopyPath  );
          }
          if(ci.balance == null || ci.balance == undefined || ci.balance == 0){
            ci.balance = "0.0/-";
          }
          else{
            ci.balance = ci.balance +"/-";
          }
          if(ci.accountStatusName === savingsbanktransactionconstant.SUBMISSION_FOR_APPROVAL){
            ci.actionButton = true;
            ci.submissionForApproval = true; 
            ci.rejected = false;
            ci.approved = false;
            ci.viewButton = true;
          }
          else{
            ci.actionButton = false;
            ci.viewButton = true;
          }
          if(ci.accountStatusName == savingsbanktransactionconstant.APPROVED){
            ci.approved = true;
            ci.rejected = false;
            ci.submissionForApproval = false; 
            ci.actionButton = false;
            ci.viewButton = true;
          }
          else if(ci.accountStatusName == savingsbanktransactionconstant.REJECTED){
            ci.rejected = true;
            ci.approved = false;
            ci.submissionForApproval = false; 
            ci.actionButton = false;
            ci.viewButton = true;
          }
          return ci
        });
        this.activeStatusCount = this.gridList.filter(ci => ci.status != null && ci.status != undefined && ci.status === applicationConstants.ACTIVE).length;
        this.inactiveStatusCount = this.gridList.filter(ci => ci.status != null && ci.status != undefined && ci.status === applicationConstants.IN_ACTIVE).length;
        this.gridListLenght = this.gridList.length;
        this.tempGridListData = this.gridList;
      } else {
        this.msgs = [];
        this.msgs = [{ severity: "error", summary: 'Failed', detail: this.responseModel.statusMsg }];
        this.commonComponent.stopSpinner();
      }
      this.commonComponent.stopSpinner();
    }, error => {
      this.msgs = [];
      this.msgs = [{ severity: "error", summary: 'Failed', detail: applicationConstants.WE_COULDNOT_PROCESS_YOU_ARE_REQUEST }];
      this.commonComponent.stopSpinner();
    });
  }
  createaccount(){
    this.commonFunctionsService.setStorageValue(applicationConstants.B_CLASS_MEMBER_CREATION, false);
    this.router.navigate([Loantransactionconstant.LOANS_COMPOUND_INTEREST_LOANS_STEPPER]);
  }


  editCompoundInterestDetails(rowData: any){
    this.router.navigate([Loantransactionconstant.COMPOUND_INTEREST_APPROVAL_STATUS_UPDATE], { queryParams: { id: this.encryptDecryptService.encrypt(rowData.id), editbutton: this.encryptDecryptService.encrypt(1) } });
  }

  viewCompoundInterestDetails(rowData: any) {
    this.router.navigate([Loantransactionconstant.COMPOUND_INTEREST_LOANS_PREVIEW], { queryParams: { id: this.encryptDecryptService.encrypt(rowData.id), editbutton: this.encryptDecryptService.encrypt(1) } });
  }

  navigateToOperations(event: any) {
    if (event.value === 1)
    this.router.navigate([Loantransactionconstant.LOANS_DISBURSEMENT]);
    else if (event.value === 2)
    this.router.navigate([Loantransactionconstant.LOANS_COLLECTIONS]);
    else if (event.value === 3)
    this.router.navigate([Loantransactionconstant.LOANS_CLOSURE]);
  
  }

  onChange(){
    this.showForm = !this.showForm;
  }
}
