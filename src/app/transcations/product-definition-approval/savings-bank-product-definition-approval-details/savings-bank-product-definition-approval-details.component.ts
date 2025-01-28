import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { MenuItem } from 'primeng/api';
import { applicationConstants } from 'src/app/shared/applicationConstants';
import { CommonComponent } from 'src/app/shared/common.component';
import { CommonFunctionsService } from 'src/app/shared/commonfunction.service';
import { EncryptDecryptService } from 'src/app/shared/encrypt-decrypt.service';
import { Responsemodel } from 'src/app/shared/responsemodel';
import { CommonStatusData } from '../../common-status-data.json';
import { SbProductDefinitionService } from '../../savings-bank-transcation/savings-bank-product-definition/shared/sb-product-definition.service';
import { savingsbanktransactionconstant } from '../../savings-bank-transcation/savingsbank-transaction-constant';
import { productDefinitionApprovalConstant } from '../product-definition-approval-constant';

@Component({
  selector: 'app-savings-bank-product-definition-approval-details',
  templateUrl: './savings-bank-product-definition-approval-details.component.html',
  styleUrls: ['./savings-bank-product-definition-approval-details.component.css']
})
export class SavingsBankProductDefinitionApprovalDetailsComponent {
  sbproductdefinition: any[] = [];
  items: MenuItem[] | undefined;
  activeItem: MenuItem | undefined;
  value: number = 0;
  gridListData: any[] = [];
  pacsId: any;
  responseModel!: Responsemodel;
  orgnizationSetting: any;
  msgs: any[] = [];
  showForm: boolean = false;
  editViewButton:boolean=false;

  constructor(private router: Router, private translate: TranslateService, private commonFunctionsService: CommonFunctionsService,
    private sbProductDefinitionService: SbProductDefinitionService, private commonComponent: CommonComponent,private datePipe: DatePipe,
    private encryptDecryptService: EncryptDecryptService) { }
  ngOnInit() {
    this.pacsId = 1;
    this.commonFunctionsService.setStorageValue('language', 'en');
    this.commonFunctionsService.data.subscribe((res: any) => {
      if (res) {
        this.translate.use(res);
      } else {
        this.translate.use('en');
      }
    });
    this.sbproductdefinition = [
      { field: 'productName', header: 'DEMANDDEPOSITS.PRODUCT_TYPE' },
      { field: 'minDepositAmountForAccountOpen', header: 'DEMANDDEPOSITS.ACCOUNT_OPENING_BALANCE' },
      { field: 'rateOfInterst', header: 'DEMANDDEPOSITS.RATE_OF_INTEREST' },
      { field: 'minBalanceMaintainInAccount', header: 'DEMANDDEPOSITS.MINIMUM_MAINTAIN_BALANCE' },
      { field: 'effectiveStartDate', header: 'DEMANDDEPOSITS.EFFECTIVE_START_DATE' },
      { field: 'statusName', header: 'DEMANDDEPOSITS.STATUS' },
    ];
    let tabLabels = [
      'No Of Products',
      'Approved',
      'Rejected',
      'Pending',
      'Text',
      'Text',

    ];
    this.items = tabLabels.map((label, index) => ({ label: label, value: `${index + 1}` }));
    //  tabLabels = Array.from({length: 100000}).map((_, i) => `Item #${i}`);
    this.getAllProductDefinitions();
  }


  view(rowData: any) {
    let viewScreen = true;
    this.router.navigate([savingsbanktransactionconstant.SB_VIEW_PRODUCT_DEFINITION], { queryParams: { id: this.encryptDecryptService.encrypt(rowData.id), editbtn: this.encryptDecryptService.encrypt(0), isGridPage: this.encryptDecryptService.encrypt(applicationConstants.IN_ACTIVE) } });
  }
  approve(rowData: any) {
    this.router.navigate([productDefinitionApprovalConstant.SAVINGS_BANK_PRODUCT_DEFINITION_APPROVAL], { queryParams: { id: this.encryptDecryptService.encrypt(rowData.id), editbtn: this.encryptDecryptService.encrypt(applicationConstants.IN_ACTIVE), isGridPage: this.encryptDecryptService.encrypt(applicationConstants.IN_ACTIVE) } });
  }

//get all product definitions by pacsid
  //  @author vinitha
  getAllProductDefinitions() {
    this.commonComponent.startSpinner();
    this.orgnizationSetting = this.commonComponent.orgnizationSettings();
    this.sbProductDefinitionService.getAllsbProductDefinition().subscribe((data: any) => {
      this.responseModel = data;
      this.gridListData = this.responseModel.data;
      this.gridListData = this.gridListData.filter((obj: any) => obj != null && obj.statusName != CommonStatusData.IN_PROGRESS &&
        obj.statusName != CommonStatusData.CREATED).map((savingsBank: any) => {

          if (savingsBank.effectiveStartDate != null && savingsBank.effectiveStartDate != undefined) {
            savingsBank.effectiveStartDate = this.datePipe.transform(savingsBank.effectiveStartDate, this.orgnizationSetting.datePipe);
          }
          //defaualt values as false
          savingsBank.isSubmissionForApproval = false;
          savingsBank.isApproved = false;
          savingsBank.isRejected = false;
          savingsBank.isRequestForResubmission = false;
          savingsBank.viewButton = false;

          if (savingsBank.statusName === CommonStatusData.SUBMISSION_FOR_APPROVAL) {
            savingsBank.isSubmissionForApproval = true;
            savingsBank.isApproved = true;
          } else if (savingsBank.statusName === CommonStatusData.APPROVED) {
            savingsBank.isApproved = true;
            savingsBank.viewButton = true;
          } else if (savingsBank.statusName === CommonStatusData.REJECTED) {
            savingsBank.isRejected = true;
            savingsBank.viewButton = true;
          } else if (savingsBank.statusName === CommonStatusData.REQUEST_FOR_RESUBMISSION) {
            savingsBank.isRequestForResubmission = true;
            savingsBank.viewButton = true;
          }
          return savingsBank
        });
      this.commonComponent.stopSpinner();
    }, error => {
      this.msgs = [];
      this.msgs = [{ severity: "error", summary: 'Failed', detail: applicationConstants.WE_COULDNOT_PROCESS_YOU_ARE_REQUEST }];
      this.commonComponent.stopSpinner();
    });
  }
  onChange() {
    this.showForm = !this.showForm;
  }
}
