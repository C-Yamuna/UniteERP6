import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { applicationConstants } from 'src/app/shared/applicationConstants';
import { CommonComponent } from 'src/app/shared/common.component';
import { CommonFunctionsService } from 'src/app/shared/commonfunction.service';
import { EncryptDecryptService } from 'src/app/shared/encrypt-decrypt.service';
import { Responsemodel } from 'src/app/shared/responsemodel';
import { RecurringDepositProductDefinitionService } from './shared/recurring-deposit-product-definition.service';
import { termdeposittransactionconstant } from '../term-deposit-transaction-constant';
import { DatePipe } from '@angular/common';
import { CommonStatusData } from '../../common-status-data.json';

@Component({
  selector: 'app-recurring-deposit-product-definition',
  templateUrl: './recurring-deposit-product-definition.component.html',
  styleUrls: ['./recurring-deposit-product-definition.component.css']
})
export class RecurringDepositProductDefinitionComponent {
  responseModel!: Responsemodel;
  recurringDepositproductdefinition: any[] = [];
  showForm: boolean = applicationConstants.FALSE;
  editViewButton:boolean = applicationConstants.FALSE;
  gridListData: any[] = [];
  orgnizationSetting: any;
  msgs: any[] = [];
  tempGridListData: any[] = [];
  activeStatusCount: any;
  inactiveStatusCount: any;
  gridListLength: Number | undefined;

  constructor(private router: Router,private translate: TranslateService,private commonFunctionsService: CommonFunctionsService,
    private encryptDecryptService: EncryptDecryptService,private recurringDepositProductDefinitionService : RecurringDepositProductDefinitionService,
    private datePipe: DatePipe,
    private commonComponent: CommonComponent){ 
      
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
    this.recurringDepositproductdefinition = [
      { field: 'name', header: 'TERMDEPOSITSTRANSACTION.PRODUCT_NAME' },
      // { field: '', header: 'TERMDEPOSITSTRANSACTION.RATE_OF_INTEREST' },
      { field: 'minDepositAmount', header: 'TERMDEPOSITSTRANSACTION.MIN_DEPOSIT_AMOUNT' },
      { field: 'maxDepositAmount',header:'TERMDEPOSITSTRANSACTION.MAX_DEPOSIT_AMOUNT'},
      { field: 'effectiveStartDate',header:'TERMDEPOSITSTRANSACTION.EFFECTIVE_START_DATE'},
      { field: 'statusName',header:'TERMDEPOSITSTRANSACTION.STATUS'}
    ];
    this.getAllRecurringDepositProductDefinition();
}
/**
    @author vinitha
    @implements Routes to add Recurring Deposit Product Defination Stepper
   */
  addRecurringDeposit(){
    this.router.navigate([termdeposittransactionconstant.RECURRING_DEPOSIT_GENERAL_CONFIG]);
  }
  /**
    @author vinitha
    @implements Routes to View Recurring Deposit Product Defination Details
   */
    viewRecurringDeposit(rowData: any) {
    this.router.navigate([termdeposittransactionconstant.VIEW_RECURRING_DEPOSIT_PRODUCT_DEFINITION], { queryParams: { id: this.encryptDecryptService.encrypt(rowData.rdProductId),editbtn:this.encryptDecryptService.encrypt(applicationConstants.IN_ACTIVE)}});
  }
  /**
    @author vinitha
    @implements Routes to Edit Recurring Deposit Product Defination Stepper
   */
    editRecurringDeposit(rowData: any) {
    this.router.navigate([termdeposittransactionconstant.VIEW_RECURRING_DEPOSIT_PRODUCT_DEFINITION], { queryParams: { id: this.encryptDecryptService.encrypt(rowData.rdProductId) ,isGridPage:this.encryptDecryptService.encrypt(applicationConstants.IN_ACTIVE) }});
    this.editViewButton =applicationConstants.TRUE;
  }
  /**
    @author vinitha
    @implements Get All Recurring Deposit Configuration details 
    @returns list of Recurring Deposit Configuration details
   */
    getAllRecurringDepositProductDefinition() {
    this.recurringDepositProductDefinitionService.getAllRecurringDepositProductDefinition().subscribe((data: any) => {
      this.responseModel = data;
      if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
        if(null!=this.responseModel.data && undefined!=this.responseModel.data ){
          this.gridListData = this.responseModel.data;
          if(null!=this.gridListData && undefined!=this.gridListData && this.gridListData.length>0){
            this.gridListData = this.gridListData.filter((data:any) => null!=data.effectiveStartDate).map(recurringDeposit => {
              recurringDeposit.effectiveStartDate = this.datePipe.transform(recurringDeposit.effectiveStartDate, this.orgnizationSetting.datePipe)||'';
              //defaualt values as false
              recurringDeposit.inProgress = false;
              recurringDeposit.isSubmissionForApproval = false;
              recurringDeposit.isApproved = false;
              recurringDeposit.isRejected = false;
              recurringDeposit.isRequestForResubmission = false;
              recurringDeposit.viewButton = false;
              recurringDeposit.showEdit = false;

              if (recurringDeposit.statusName === CommonStatusData.IN_PROGRESS) {
                recurringDeposit.inProgress = true;
                recurringDeposit.showEdit = true;
              }else if (recurringDeposit.statusName === CommonStatusData.REQUEST_FOR_RESUBMISSION) {
                recurringDeposit.isRequestForResubmission = true;
                recurringDeposit.showEdit = true;
              }else if (recurringDeposit.statusName === CommonStatusData.APPROVED) {
                recurringDeposit.isApproved = true;
                recurringDeposit.showEdit = true;
              } else if (recurringDeposit.statusName === CommonStatusData.REJECTED) {
                recurringDeposit.isRejected = true;
                recurringDeposit.showEdit = true;
              }else if (recurringDeposit.statusName === CommonStatusData.SUBMISSION_FOR_APPROVAL) {
                recurringDeposit.isSubmissionForApproval = true;
                recurringDeposit.showEdit = true;
              }
              
              return recurringDeposit
            });
          }
        }
        this.activeStatusCount = this.gridListData.filter(fdAccountApplication => fdAccountApplication.status != null && fdAccountApplication.status != undefined && fdAccountApplication.status === applicationConstants.ACTIVE).length;
        this.inactiveStatusCount = this.gridListData.filter(fdAccountApplication => fdAccountApplication.status != null && fdAccountApplication.status != undefined && fdAccountApplication.status === applicationConstants.IN_ACTIVE).length;
        this.gridListLength = this.gridListData.length;
        this.tempGridListData = this.gridListData;
         this.commonComponent.stopSpinner();
      }else {
        this.commonComponent.stopSpinner();
        this.msgs = [{ severity: 'error', detail: this.responseModel.statusMsg }];
        setTimeout(() => {
          this.msgs = [];
        }, 2000);
      }
    }, error => {
      this.msgs = [];
      this.msgs = [{ severity: "error", summary: 'Failed', detail:  applicationConstants.WE_COULDNOT_PROCESS_YOU_ARE_REQUEST }];
      this.commonComponent.stopSpinner();
    });
  }
  /**
    @author vinitha
    @implements To Enable/ Disable search filter form
   */
  onChange(){
    this.showForm = !this.showForm;
  }
}
