import { Component } from '@angular/core';
import { BorrowingTransactionConstant } from 'src/app/transcations/borrowing-transaction/borrowing-transaction-constants';
import { approvaltransactionsconstant } from '../../approval-transactions-constant';
import { applicationConstants } from 'src/app/shared/applicationConstants';
import { CommonStatusData } from 'src/app/transcations/common-status-data.json';
import { Responsemodel } from 'src/app/shared/responsemodel';
import { MenuItem, SelectItem } from 'primeng/api';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { CommonComponent } from 'src/app/shared/common.component';
import { EncryptDecryptService } from 'src/app/shared/encrypt-decrypt.service';
import { CommonFunctionsService } from 'src/app/shared/commonfunction.service';
import { FileUploadService } from 'src/app/shared/file-upload.service';
import { SiBorrowingStepperService } from 'src/app/transcations/borrowing-transaction/si-borrowing/si-borrowing-stepper/shared/si-borrowing-stepper.service';
import { DatePipe } from '@angular/common';
import { ERP_TRANSACTION_CONSTANTS } from 'src/app/transcations/erp-transaction-constants';

@Component({
  selector: 'app-si-borrowing-approval-details',
  templateUrl: './si-borrowing-approval-details.component.html',
  styleUrls: ['./si-borrowing-approval-details.component.css']
})
export class SiBorrowingApprovalDetailsComponent {
  siborrowings: any[] = [];
  statuses!: SelectItem[];
  operations: any;
  operationslist: any;
  termdepositlist: any;
  items: MenuItem[] | undefined;
  activeItem: MenuItem | undefined;
  value: number = 0;
  newdepositer: any;
  pacsId: Number = 1;
  branchId: Number = 1;
  responseModel!: Responsemodel;
  gridListData: any[] = [];
  msgs: any[] = [];
  tempGridListData: any[] = [];
  activeStatusCount: any;
  inactiveStatusCount: any;
  orgnizationSetting: any;
  gridListLenght: Number | undefined;
  showForm: boolean=false;
  memberPhotoCopyZoom: boolean =false;
  memberphotCopyMultipartFileList: any[] = [];

  constructor(private router: Router,
    private translate: TranslateService,
    private commonComponent: CommonComponent,
    private encryptDecryptService: EncryptDecryptService,
    private commonFunctionsService: CommonFunctionsService,
    private fileUploadService :FileUploadService,
    private siBorrowingStepperService : SiBorrowingStepperService,
    private datePipe: DatePipe) { }

  ngOnInit() {
    this.orgnizationSetting = this.commonComponent.orgnizationSettings()
    this.commonFunctionsService.setStorageValue('language', 'en');
    this.commonFunctionsService.data.subscribe((res: any) => {
      if (res) {
        this.translate.use(res);
      } else {
        this.translate.use('en');
      }
    });

    this.operationslist = [
      { label: "Disbursement", value: 1},
      { label: "Collection", value: 2 },
      { label: "Closure ", value: 3},
      { label: "Charges Collection ", value: 4 },

    ]
    this.siborrowings = [
      { field: 'accountNumber', header: 'BORROWINGSTRANSACTIONS.DCCB_BORROWING_ACCOUNT_NO' },
      { field: 'financiarBankTypeName', header: 'BORROWINGSTRANSACTIONS.FINANCIAL_BANK_TYPE' },
      { field: 'productName', header: 'BORROWINGSTRANSACTIONS.PRODUCT' },
      { field: 'applicationDate', header: 'BORROWINGSTRANSACTIONS.APPLICATION_DATE' },
      { field: 'sanctionedAmount',header:'BORROWINGSTRANSACTIONS.SANCTIONED_AMOUNT'},
      { field: 'sanctionedDate',header:'BORROWINGSTRANSACTIONS.SANCTIONED_DATE'},
      { field: 'roi', header: 'BORROWINGSTRANSACTIONS.ROI' },
      { field: 'statusName', header: 'BORROWINGSTRANSACTIONS.STATUS' },
    ];

    let tabLabels = [
      'Total Accounts',
      'Total Deposit Amount',
      'Total Maturity Amount',
      'Cumulative Accounts',
      'Non-Cumulative Accounts',
      'Recurring Deposit Accounts',
      'Total Deposit Amount',
      'Forclosure Accounts',
      'Closure Accounts',
    ];
    this.items = tabLabels.map((label, index) => ({ label: label, value: `${index + 1}` }));
    //  tabLabels = Array.from({length: 100000}).map((_, i) => `Item #${i}`);
    this.getAllBorrowingsAccountDetailsListByPacsIdAndBranchId();
  }

  getAllBorrowingsAccountDetailsListByPacsIdAndBranchId() {
    this.commonComponent.startSpinner();
   this.orgnizationSetting = this.commonComponent.orgnizationSettings();
   this.siBorrowingStepperService.getSiBorrowingAccountsListByPacsIdAndBranchId(this.pacsId,this.branchId).subscribe((data: any) => {
    this.responseModel = data;
    this.gridListData = this.responseModel.data;
    this.gridListData = this.gridListData.filter((obj: any) => obj != null && obj.statusName != CommonStatusData.IN_PROGRESS &&
    obj.statusName != CommonStatusData.CREATED).map((siBorrowing: any) => {

      if (siBorrowing.applicationDate != null && siBorrowing.applicationDate != undefined) {
        siBorrowing.applicationDate = this.datePipe.transform(siBorrowing.applicationDate,this.orgnizationSetting.datePipe);
      }
      if (siBorrowing.requestedDate != null && siBorrowing.requestedDate != undefined) {
        siBorrowing.requestedDate = this.datePipe.transform(siBorrowing.requestedDate,this.orgnizationSetting.datePipe);
      }
      if (siBorrowing.sanctionedDate != null && siBorrowing.sanctionedDate != undefined) {
        siBorrowing.sanctionedDate = this.datePipe.transform(siBorrowing.sanctionedDate,this.orgnizationSetting.datePipe);
      }
      if (siBorrowing.borrowingDueDate != null && siBorrowing.borrowingDueDate != undefined) {
        siBorrowing.borrowingDueDate = this.datePipe.transform(siBorrowing.borrowingDueDate,this.orgnizationSetting.datePipe);
      }
      if (siBorrowing.signedCopyPath != null && siBorrowing.signedCopyPath != undefined) {
        siBorrowing.multipartFileListForPhotoCopy = this.fileUploadService.getFile(siBorrowing.signedCopyPath, ERP_TRANSACTION_CONSTANTS.BORROWINGS + ERP_TRANSACTION_CONSTANTS.FILES + "/" + siBorrowing.signedCopyPath);
      }
      if (siBorrowing.statusName == CommonStatusData.APPROVED || siBorrowing.statusName == CommonStatusData.REQUEST_FOR_RESUBMISSION
         || siBorrowing.statusName == CommonStatusData.REJECTED ) {
          siBorrowing.viewButton = true; 
      } else {
        siBorrowing.viewButton = false;
      }
      return siBorrowing 
    });
    this.activeStatusCount = this.gridListData.filter(siAccountApplication => siAccountApplication.status != null && siAccountApplication.status != undefined && siAccountApplication.status === applicationConstants.ACTIVE).length;
    this.inactiveStatusCount = this.gridListData.filter(siAccountApplication => siAccountApplication.status != null && siAccountApplication.status != undefined && siAccountApplication.status === applicationConstants.IN_ACTIVE).length;
    this.gridListLenght = this.gridListData.length;
    this.tempGridListData = this.gridListData;
    this.commonComponent.stopSpinner();
 }, error => {
   this.msgs = [];
   this.msgs = [{ severity: "error", summary: 'Failed', detail: applicationConstants.WE_COULDNOT_PROCESS_YOU_ARE_REQUEST }];
   // this.commonComponent.stopSpinner();
 });
 }

  view(rowData: any) {
    this.router.navigate([BorrowingTransactionConstant.SI_VIEW_BORROWING], { queryParams: { id: this.encryptDecryptService.encrypt(rowData.id), editbutton: this.encryptDecryptService.encrypt(0), isGridPage: this.encryptDecryptService.encrypt(applicationConstants.IN_ACTIVE) } });
  }
  approve(rowData: any) {
    this.router.navigate([approvaltransactionsconstant.SI_BORROWING_APPROVAL], { queryParams: { id: this.encryptDecryptService.encrypt(rowData.id), editbutton: this.encryptDecryptService.encrypt(applicationConstants.IN_ACTIVE), isGridPage: this.encryptDecryptService.encrypt(applicationConstants.IN_ACTIVE) } });
  }

  onChange(){
    this.showForm = !this.showForm;
  }
  onClickMemberPhotoCopy(rowData : any){
    this.memberPhotoCopyZoom = true;
    this.memberphotCopyMultipartFileList = [];
    this.memberphotCopyMultipartFileList = rowData.multipartFileListForPhotoCopy ;
  }
  closePhoto(){
    this.memberPhotoCopyZoom = false;
  }
}
