import { Component } from '@angular/core';
import { applicationConstants } from 'src/app/shared/applicationConstants';
import { Router } from '@angular/router';
import { MenuItem, SelectItem } from 'primeng/api';
import { CommonFunctionsService } from 'src/app/shared/commonfunction.service';
import { Responsemodel } from 'src/app/shared/responsemodel';
import { EncryptDecryptService } from 'src/app/shared/encrypt-decrypt.service';
import { CommonComponent } from 'src/app/shared/common.component';
import { DatePipe } from '@angular/common';
import { FileUploadService } from 'src/app/shared/file-upload.service';
import { ERP_TRANSACTION_CONSTANTS } from 'src/app/transcations/erp-transaction-constants';
import { savingsbanktransactionconstant } from 'src/app/transcations/savings-bank-transcation/savingsbank-transaction-constant';
import { SavingsAccountService } from 'src/app/transcations/savings-bank-transcation/shared/savings-account.service';
import { SbTransaction } from 'src/app/transcations/savings-bank-transcation/sb-transactions/shared/sb-transaction';
import { approvaltransactionsconstant } from '../../approval-transactions-constant';


@Component({
  selector: 'app-savings-application-approval',
  templateUrl: './savings-application-approval.component.html',
  styleUrls: ['./savings-application-approval.component.css']
})
export class SavingsApplicationApprovalComponent {

  savingsbank: any[] = [];
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
  translate: any;
  showForm: boolean=false;
  memberPhotoCopyZoom: boolean = false;
  memberphotCopyMultipartFileList: any;

  constructor(private router: Router,private commonFunctionsService: CommonFunctionsService
    ,private savingsAccountService : SavingsAccountService , private encryptDecryptService: EncryptDecryptService ,private commonComponent: CommonComponent,private datePipe : DatePipe ,private fileUploadService : FileUploadService)
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
    this.savingsbank = [
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
   this.getAllSbAccountDetailsListByPacsIdAndBranchId();
}

view(rowData : any){
  this.router.navigate([approvaltransactionsconstant.SB_APPROVAL_VIEW], { queryParams: { id: this.encryptDecryptService.encrypt(rowData.id) ,editOpt: this.encryptDecryptService.encrypt(applicationConstants.IN_ACTIVE),isGridPage: this.encryptDecryptService.encrypt(applicationConstants.IN_ACTIVE)}});
}

edit(rowData:any){
  this.router.navigate([savingsbanktransactionconstant.APROVAL], { queryParams: { id: this.encryptDecryptService.encrypt(rowData.id) ,editOpt: this.encryptDecryptService.encrypt(applicationConstants.IN_ACTIVE),isGridPage: this.encryptDecryptService.encrypt(applicationConstants.IN_ACTIVE)}});
}


getAllSbTransactionDetails() {
    this.savingsAccountService.getAllSavingsAccountDetails().subscribe((data: any) => {
      this.responseModel = data;
      this.gridListData = this.responseModel.data;
      if(this.gridListData.length > 0 && this.gridListData != null && this.gridListData != undefined){
        this.gridListLenght = this.gridListData.length;
        this.gridListData = this.gridListData.map(sb => {
          if(sb != null && sb != undefined){
          if( sb.admissionDate != null && sb.admissionDate != undefined){
            sb.admissionDate = (this.datePipe.transform(sb.admissionDate, this.orgnizationSetting.datePipe))||('');
          }
          if(sb.accountOpenDate != null && sb.accountOpenDate != undefined){
            sb.accountOpenDate = (this.datePipe.transform(sb.accountOpenDate, this.orgnizationSetting.accountOpenDate))||('');
          }
          if(sb.balance == null || sb.balance == undefined || sb.balance == 0){
            sb.balance = 0;
          }
        }
          return sb
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

  getAllSbAccountDetailsListByPacsIdAndBranchId() {
    this.savingsAccountService.getSavingsAccountDetailsByPacsIdAndBranchId(this.pacsId, this.branchId).subscribe((data: any) => {
      this.responseModel = data;
      if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
        if (this.responseModel.data != null && this.responseModel.data != undefined && this.responseModel.data.length > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
          this.gridList = this.responseModel.data.filter((sb: any) => sb.accountStatusName != savingsbanktransactionconstant.CREATED && sb.accountStatusName != savingsbanktransactionconstant.IN_PROGRESS ).map((sb: any) =>  {
            if (sb != null && sb != undefined && sb.accountOpenDate != null && sb.accountOpenDate != undefined) {
              sb.accountOpenDate = this.datePipe.transform(sb.accountOpenDate, this.orgnizationSetting.datePipe);
            }
            sb.multipartFileListForPhotoCopy = null;
            if(sb.memberPhotoCopyPath != null && sb.memberPhotoCopyPath != undefined && sb.isNewMember){
              sb.multipartFileListForPhotoCopy = this.fileUploadService.getFile(sb.memberPhotoCopyPath ,ERP_TRANSACTION_CONSTANTS.DEMANDDEPOSITS + ERP_TRANSACTION_CONSTANTS.FILES + "/" + sb.memberPhotoCopyPath  );
            }
            else{
              sb.multipartFileListForPhotoCopy = this.fileUploadService.getFile(sb.memberPhotoCopyPath ,ERP_TRANSACTION_CONSTANTS.MEMBERSHIP + ERP_TRANSACTION_CONSTANTS.FILES + "/" + sb.memberPhotoCopyPath  );
            }
            if(sb.balance == null || sb.balance == undefined || sb.balance == 0){
              sb.balance = "0.0/-";
            }
            else{
              sb.balance = sb.balance +"/-";
            }
            if(sb.accountStatusName === savingsbanktransactionconstant.SUBMISSION_FOR_APPROVAL){
              sb.actionButton = true;
              sb.submissionForApproval = true; 
              sb.rejected = false;
              sb.approved = false;
              sb.viewButton = true;
            }
            else{
              sb.actionButton = false;
              sb.viewButton = true;
            }
            if(sb.accountStatusName == savingsbanktransactionconstant.APPROVED){
              sb.approved = true;
              sb.rejected = false;
              sb.submissionForApproval = false; 
              sb.actionButton = false;
              sb.viewButton = true;
            }
            else if(sb.accountStatusName == savingsbanktransactionconstant.REJECTED){
              sb.rejected = true;
              sb.approved = false;
              sb.submissionForApproval = false; 
              sb.actionButton = false;
              sb.viewButton = true;
            }
           
            
            return sb
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
  onChange(){
    this.showForm = !this.showForm;
  }

  /**
   * @implement Image Zoom POp up
   * @author jyothi.naidana
   */
  onClickMemberPhotoCopy(sbRowData : any){
    this.memberPhotoCopyZoom = true;
    this.memberphotCopyMultipartFileList = [];
    this.memberphotCopyMultipartFileList = sbRowData.multipartFileListForPhotoCopy ;
  }

  closePhoto(){
    this.memberPhotoCopyZoom = false;
  }

  transacionApproval(rowData :any){
    this.router.navigate([savingsbanktransactionconstant.APPROVAL_TRANSACTION], { queryParams: { id: this.encryptDecryptService.encrypt(rowData.id)}});
  }
}
