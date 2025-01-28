import { Component } from '@angular/core';
import { applicationConstants } from 'src/app/shared/applicationConstants';
import { CommonStatusData } from 'src/app/transcations/common-status-data.json';
import { ERP_TRANSACTION_CONSTANTS } from 'src/app/transcations/erp-transaction-constants';
import { Loantransactionconstant } from 'src/app/transcations/loan-transcation/loan-transaction-constant';
import { approvaltransactionsconstant } from '../../approval-transactions-constant';
import { SiTransactionDetailsService } from 'src/app/transcations/loan-transcation/shared/si-loans/si-transaction-details.service';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { SelectItem, MenuItem } from 'primeng/api';
import { CommonComponent } from 'src/app/shared/common.component';
import { CommonFunctionsService } from 'src/app/shared/commonfunction.service';
import { EncryptDecryptService } from 'src/app/shared/encrypt-decrypt.service';
import { FileUploadService } from 'src/app/shared/file-upload.service';
import { Responsemodel } from 'src/app/shared/responsemodel';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-si-loan-approval-details',
  templateUrl: './si-loan-approval-details.component.html',
  styleUrls: ['./si-loan-approval-details.component.css']
})
export class SiLoanApprovalDetailsComponent {
  siloans: any[] = [];
  statuses!: SelectItem[];
  operations:any;
  operationslist:any;
  items: MenuItem[] | undefined;
  activeItem: MenuItem | undefined;
  value: number = 0;
  responseModel!: Responsemodel;
  gridListData: any[] = [];
  orgnizationSetting: any;
  msgs: any[] = [];
  tempGridListData: any[] = [];
  gridListLenght: Number | undefined;
  pacsId : any;
  branchId : any;
  gridList: any [] = [];
  activeStatusCount: any;
  inactiveStatusCount: any;
  showForm: boolean=false;
  memberPhotoCopyZoom: boolean = false;
  memberphotCopyMultipartFileList: any;

  constructor(private router: Router,private commonFunctionsService: CommonFunctionsService
    ,private siTransactionDetailsService : SiTransactionDetailsService ,private translate:TranslateService,
     private encryptDecryptService: EncryptDecryptService ,private commonComponent: CommonComponent,private datePipe : DatePipe ,private fileUploadService : FileUploadService)
  {
    this. operationslist = [
      { label: "Standing instructions", value: 1 },
      { label: "Account service", value: 2 },
      { label: "Amount Block", value: 3 },
      // { label: "Chequebook issue", value: 4 },
      // { label: "Debit card issue ", value: 5 },
      { label: "Closure ", value: 6 },
      { label: "Death Claim ", value: 7 },
    ]
    this.siloans = [
      { field: 'accountNumber', header: 'Account Number' },
      { field: 'balance', header: 'Account Balence' },
      { field: 'name', header: 'Name' },
      { field: 'memberTypeName', header: 'Member Type' },
      { field: 'accountTypeName', header: 'Account Type' },
      { field: 'admissionNumber',header:'Admission Number'},
      { field: 'accountOpenDate', header: 'Account Openinig Date' },
      { field: 'accountStatusName', header: 'Status' },
      // { field: 'Action', header: 'ACTION' },
    ];
   }
  ngOnInit() {
    this.commonFunctionsService.setStorageValue('language', 'en');
    this.orgnizationSetting = this.commonComponent.orgnizationSettings();
    this.commonFunctionsService.data.subscribe((res: any) => {
      if (res) {
        this.translate.use(res);
      } else {
        this.translate.use('en');
      }
    });
    this.pacsId =  this.commonFunctionsService.getStorageValue(applicationConstants.PACS_ID);
   this.branchId =  this.commonFunctionsService.getStorageValue(applicationConstants.BRANCH_ID);
   this.getAllSILoanDetailsByPacsIdAndBranchId();
}

view(rowData : any){
  this.router.navigate([Loantransactionconstant.VIEW_SIMPLE_INTEREST_LOAN], { queryParams: { id: this.encryptDecryptService.encrypt(rowData.id) ,editOpt: this.encryptDecryptService.encrypt(applicationConstants.IN_ACTIVE),isGridPage: this.encryptDecryptService.encrypt(applicationConstants.IN_ACTIVE)}});
}

edit(rowData:any){
  this.router.navigate([approvaltransactionsconstant.SI_LOANS_APPROVAL], { queryParams: { id: this.encryptDecryptService.encrypt(rowData.id) ,editOpt: this.encryptDecryptService.encrypt(applicationConstants.IN_ACTIVE),isGridPage: this.encryptDecryptService.encrypt(applicationConstants.IN_ACTIVE)}});
}


getAllSITransactionDetails() {
    this.siTransactionDetailsService.getAllSITransactionDetails().subscribe((data: any) => {
      this.responseModel = data;
      this.gridListData = this.responseModel.data;
      if(this.gridListData.length > 0 && this.gridListData != null && this.gridListData != undefined){
        this.gridListLenght = this.gridListData.length;
        this.gridListData = this.gridListData.map(siLoan => {
          if(siLoan != null && siLoan != undefined){
          if( siLoan.admissionDate != null && siLoan.admissionDate != undefined){
            siLoan.admissionDate = (this.datePipe.transform(siLoan.admissionDate, this.orgnizationSetting.datePipe))||('');
          }
          if(siLoan.accountOpenDate != null && siLoan.accountOpenDate != undefined){
            siLoan.accountOpenDate = (this.datePipe.transform(siLoan.accountOpenDate, this.orgnizationSetting.accountOpenDate))||('');
          }
          if(siLoan.balance == null || siLoan.balance == undefined || siLoan.balance == 0){
            siLoan.balance = 0;
          }
        }
          return siLoan
        });
        this.tempGridListData = this.gridListData;
      }
      //  this.commonComponent.stopSpinner();
    }, error => {
      this.msgs = [];
      this.msgs = [{ severity: "error", summary: 'Failed', detail:  applicationConstants.WE_COULDNOT_PROCESS_YOU_ARE_REQUEST }];
      // this.commonComponent.stopSpinner();
    });
  }

  getAllSILoanDetailsByPacsIdAndBranchId() {
    this.siTransactionDetailsService.getAllSILoanDetailsByPacsIdAndBranchId(this.pacsId, this.branchId).subscribe((data: any) => {
      this.responseModel = data;
      if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
        if (this.responseModel.data != null && this.responseModel.data != undefined && this.responseModel.data.length > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
          this.gridList = this.responseModel.data.filter((siLoan: any) => siLoan.accountStatusName != CommonStatusData.CREATED ).map((siLoan: any) =>  {
            if (siLoan != null && siLoan != undefined && siLoan.accountOpenDate != null && siLoan.accountOpenDate != undefined) {
              siLoan.accountOpenDate = this.datePipe.transform(siLoan.accountOpenDate, this.orgnizationSetting.datePipe);
            }
            siLoan.multipartFileListForPhotoCopy = null;
            if(siLoan.memberPhotoCopyPath != null && siLoan.memberPhotoCopyPath != undefined && siLoan.isNewMember){
              siLoan.multipartFileListForPhotoCopy = this.fileUploadService.getFile(siLoan.memberPhotoCopyPath ,ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.FILES + "/" + siLoan.memberPhotoCopyPath  );
            }
            else{
              siLoan.multipartFileListForPhotoCopy = this.fileUploadService.getFile(siLoan.memberPhotoCopyPath ,ERP_TRANSACTION_CONSTANTS.MEMBERSHIP + ERP_TRANSACTION_CONSTANTS.FILES + "/" + siLoan.memberPhotoCopyPath  );
            }
            if(siLoan.balance == null || siLoan.balance == undefined || siLoan.balance == 0){
              siLoan.balance = "0.0/-";
            }
            else{
              siLoan.balance = siLoan.balance +"/-";
            }
            if(siLoan.accountStatusName === CommonStatusData.SUBMISSION_FOR_APPROVAL){
              siLoan.actionButton = true;
            }
            else{
              siLoan.viewButton = true;
            }
            if(siLoan.accountStatusName == CommonStatusData.APPROVED){
              siLoan.approved = true;
            }
            else if(siLoan.accountStatusName == CommonStatusData.REJECTED){
              siLoan.rejected = true;
            }
            else if(siLoan.accountStatusName == CommonStatusData.SUBMISSION_FOR_APPROVAL){
              siLoan.submissionForApproval = true; 
            }
           
            
            return siLoan
          });
          this.activeStatusCount = this.gridList.filter(siLoanAccountApplication => siLoanAccountApplication.status != null && siLoanAccountApplication.status != undefined && siLoanAccountApplication.status === applicationConstants.ACTIVE).length;
          this.inactiveStatusCount = this.gridList.filter(siLoanAccountApplication => siLoanAccountApplication.status != null && siLoanAccountApplication.status != undefined && siLoanAccountApplication.status === applicationConstants.IN_ACTIVE).length;
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
  onChange(){
    this.showForm = !this.showForm;
  }


  onClickMemberPhotoCopy(sbRowData : any){
    this.memberPhotoCopyZoom = true;
    this.memberphotCopyMultipartFileList = [];
    this.memberphotCopyMultipartFileList = sbRowData.multipartFileListForPhotoCopy ;
  }

  closePhoto(){
    this.memberPhotoCopyZoom = false;
  }


}
