import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { MenuItem, SelectItem } from 'primeng/api';
import { applicationConstants } from 'src/app/shared/applicationConstants';
import { CommonComponent } from 'src/app/shared/common.component';
import { CommonFunctionsService } from 'src/app/shared/commonfunction.service';
import { EncryptDecryptService } from 'src/app/shared/encrypt-decrypt.service';
import { Responsemodel } from 'src/app/shared/responsemodel';
import { RdAccountsService } from 'src/app/transcations/term-deposits-transcation/shared/rd-accounts.service';
import { termdeposittransactionconstant } from 'src/app/transcations/term-deposits-transcation/term-deposit-transaction-constant';
import { approvaltransactionsconstant } from '../../approval-transactions-constant';
import { CommonStatusData } from 'src/app/transcations/common-status-data.json';
import { DatePipe } from '@angular/common';
import { FileUploadService } from 'src/app/shared/file-upload.service';
import { ERP_TRANSACTION_CONSTANTS } from 'src/app/transcations/erp-transaction-constants';

@Component({
  selector: 'app-reccuring-deposit-approval-details',
  templateUrl: './reccuring-deposit-approval-details.component.html',
  styleUrls: ['./reccuring-deposit-approval-details.component.css']
})
export class ReccuringDepositApprovalDetailsComponent {
  termdeposits: any[] = [];
  statuses!: SelectItem[];
  operations: any;
  operationslist: any;
  termdepositlist: any;
  items: MenuItem[] | undefined;
  activeItem: MenuItem | undefined;
  value: number = 0;
  newdepositer: any;
  pacsId: any;
  branchId: any;
  responseModel!: Responsemodel;
  gridListData: any[] = [];
  msgs: any[] = [];
  orgnizationSetting: any;
  showForm: boolean = false;
  memberPhotoCopyZoom: boolean = false;
  memberphotCopyMultipartFileList: any[] = [];
  tempGridListData: any[] = [];
  activeStatusCount: any;
  inactiveStatusCount: any;
  gridListLenght: Number | undefined;

  constructor(private router: Router, private translate: TranslateService,
    private commonComponent: CommonComponent, private encryptDecryptService:
      EncryptDecryptService, private commonFunctionsService: CommonFunctionsService,
    private datePipe: DatePipe, private fileUploadService: FileUploadService,
    private rdAccountsService: RdAccountsService) { }

  ngOnInit() {
    this.pacsId = 5;
    this.branchId = 12;
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
      { label: "Interest Payment", value: 1 },
      { label: "Foreclosure", value: 2 },
      { label: "Closure", value: 3 },
      { label: "Renewal", value: 4 },

    ]
    this.termdeposits = [
      { field: 'adminssionNumber', header: 'TERMDEPOSITSTRANSACTION.ADMINSSION_NUMBER' },
      { field: 'accountNumber', header: 'TERMDEPOSITSTRANSACTION.ACCOUNT_NUMBER' },
      { field: 'accountTypeName', header: 'TERMDEPOSITSTRANSACTION.ACCOUNT_TYPE' },
      { field: 'memberTypeName', header: 'TERMDEPOSITSTRANSACTION.MEMBER_TYPE' },
      { field: 'productName', header: 'TERMDEPOSITSTRANSACTION.PRODUCT_NAME' },
      { field: 'roi', header: 'TERMDEPOSITSTRANSACTION.ROI' },
      { field: 'statusName', header: 'TERMDEPOSITSTRANSACTION.STATUS' },
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
    this.pacsId = 1;
    this.branchId = 1;
    this.orgnizationSetting = this.commonComponent.orgnizationSettings();
    this.getGridListData();
  }

  getGridListData() {
    this.commonComponent.startSpinner();
    //  this.orgnizationSetting = this.commonComponent.orgnizationSettings();
    this.rdAccountsService.getRdAccountsByPacsAndBranchId(this.pacsId, this.branchId).subscribe((data: any) => {
      this.responseModel = data;
      this.gridListData = this.responseModel.data;
      this.gridListData = this.gridListData.filter((obj: any) => obj != null && obj.statusName != CommonStatusData.IN_PROGRESS &&
        obj.statusName != CommonStatusData.CREATED).map((reccuringDeposit: any) => {

          if (reccuringDeposit.depositDate != null && reccuringDeposit.depositDate != undefined) {
            reccuringDeposit.depositDate = this.datePipe.transform(reccuringDeposit.depositDate, this.orgnizationSetting.datePipe);
          }
          if (reccuringDeposit.photoCopyPath != null && reccuringDeposit.photoCopyPath != undefined) {
            reccuringDeposit.multipartFileListForPhotoCopy = this.fileUploadService.getFile(reccuringDeposit.photoCopyPath, ERP_TRANSACTION_CONSTANTS.TERMDEPOSITS + ERP_TRANSACTION_CONSTANTS.FILES + "/" + reccuringDeposit.photoCopyPath);
          }
          if (reccuringDeposit.statusName == CommonStatusData.APPROVED || reccuringDeposit.statusName == CommonStatusData.REQUEST_FOR_RESUBMISSION
            || reccuringDeposit.statusName == CommonStatusData.REJECTED) {
            reccuringDeposit.viewButton = true;
          } else {
            reccuringDeposit.viewButton = false;
          }
          return reccuringDeposit
        });
      this.activeStatusCount = this.gridListData.filter(rdAccountApplication => rdAccountApplication.status != null && rdAccountApplication.status != undefined && rdAccountApplication.status === applicationConstants.ACTIVE).length;
      this.inactiveStatusCount = this.gridListData.filter(rdAccountApplication => rdAccountApplication.status != null && rdAccountApplication.status != undefined && rdAccountApplication.status === applicationConstants.IN_ACTIVE).length;
      this.gridListLenght = this.gridListData.length;
      this.tempGridListData = this.gridListData;
      this.commonComponent.stopSpinner();
    }, error => {
      this.msgs = [];
      this.msgs = [{ severity: "error", summary: 'Failed', detail: applicationConstants.WE_COULDNOT_PROCESS_YOU_ARE_REQUEST }];
      this.commonComponent.stopSpinner();
    });
  }

  view(rowData: any) {
    this.router.navigate([termdeposittransactionconstant.RECURRING_DEPOSIT_PREVIEW], { queryParams: { id: this.encryptDecryptService.encrypt(rowData.id), editbutton: this.encryptDecryptService.encrypt(0), isGridPage: this.encryptDecryptService.encrypt(applicationConstants.IN_ACTIVE) } });
  }
  approve(rowData: any) {
    this.router.navigate([approvaltransactionsconstant.RECCURING_DEPOSIT_APPROVAL], { queryParams: { id: this.encryptDecryptService.encrypt(rowData.id), editbutton: this.encryptDecryptService.encrypt(applicationConstants.IN_ACTIVE), isGridPage: this.encryptDecryptService.encrypt(applicationConstants.IN_ACTIVE) } });
  }

  onChange() {
    this.showForm = !this.showForm;
  }
  onClickMemberPhotoCopy(rowData: any) {
    this.memberPhotoCopyZoom = true;
    this.memberphotCopyMultipartFileList = [];
    this.memberphotCopyMultipartFileList = rowData.multipartFileListForPhotoCopy;
  }
  closePhoto() {
    this.memberPhotoCopyZoom = false;
  }
}
