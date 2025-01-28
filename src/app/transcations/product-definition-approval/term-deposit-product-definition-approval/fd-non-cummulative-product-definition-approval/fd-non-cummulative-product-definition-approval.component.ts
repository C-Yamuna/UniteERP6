import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { applicationConstants } from 'src/app/shared/applicationConstants';
import { CommonComponent } from 'src/app/shared/common.component';
import { CommonFunctionsService } from 'src/app/shared/commonfunction.service';
import { EncryptDecryptService } from 'src/app/shared/encrypt-decrypt.service';
import { Responsemodel } from 'src/app/shared/responsemodel';
import { CommonStatusData } from 'src/app/transcations/common-status-data.json';
import { FdNonCumulativeProductDefinitionService } from 'src/app/transcations/term-deposits-transcation/fd-non-cumulative-product-definition/shared/fd-non-cumulative-product-definition.service';
import { termdeposittransactionconstant } from 'src/app/transcations/term-deposits-transcation/term-deposit-transaction-constant';
import { productDefinitionApprovalConstant } from '../../product-definition-approval-constant';

@Component({
  selector: 'app-fd-non-cummulative-product-definition-approval',
  templateUrl: './fd-non-cummulative-product-definition-approval.component.html',
  styleUrls: ['./fd-non-cummulative-product-definition-approval.component.css']
})
export class FdNonCummulativeProductDefinitionApprovalComponent {
  responseModel!: Responsemodel;
  fdNonCumulativeproductdefinition: any[] = [];
  showForm: boolean = applicationConstants.FALSE;
  editViewButton: boolean = applicationConstants.FALSE;
  gridListData: any[] = [];
  orgnizationSetting: any;
  msgs: any[] = [];
  tempGridListData: any[] = [];
  activeStatusCount: any;
  inactiveStatusCount: any;
  gridListLength: Number | undefined;

  constructor(private router: Router, private translate: TranslateService, private commonFunctionsService: CommonFunctionsService,
    private encryptDecryptService: EncryptDecryptService,
    private fdNonCumulativeProductDefinitionService: FdNonCumulativeProductDefinitionService,
    private datePipe: DatePipe,
    private commonComponent: CommonComponent) {

  }

  /**
  @author bhargavi
  @implements Fd Cummulative Configuration details Stepper Configuration
 */
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
    this.fdNonCumulativeproductdefinition = [
      { field: 'name', header: 'TERMDEPOSITSTRANSACTION.PRODUCT_NAME' },
      { field: '', header: 'TERMDEPOSITSTRANSACTION.RATE_OF_INTEREST' },
      { field: 'minDepositAmount', header: 'TERMDEPOSITSTRANSACTION.MIN_DEPOSIT_AMOUNT' },
      { field: 'maxDepositAmount', header: 'TERMDEPOSITSTRANSACTION.MAX_DEPOSIT_AMOUNT' },
      { field: 'effectiveStartDate', header: 'TERMDEPOSITSTRANSACTION.EFFECTIVE_START_DATE' },
      { field: 'statusName', header: 'TERMDEPOSITSTRANSACTION.STATUS' }
    ];
    this.getAllFdNonCumulativeProductDefinition();
  }

  /**
    @author bhargavi
    @implements Routes to View Fd Cummulative Product Defination Details
   */
  view(rowData: any) {
    this.router.navigate([termdeposittransactionconstant.VIEW_FD_NON_CUMMULATIVE_PRODUCT_DEFINITION], { queryParams: { id: this.encryptDecryptService.encrypt(rowData.id), editbtn: this.encryptDecryptService.encrypt(0), isGridPage: this.encryptDecryptService.encrypt(applicationConstants.IN_ACTIVE) } });
  }

  approve(rowData: any) {
    this.router.navigate([productDefinitionApprovalConstant.FD_NON_CUMMULATIVE_PRODUCT_DEFINITION_APPROVAL_DETAILS], { queryParams: { id: this.encryptDecryptService.encrypt(rowData.id), editbtn: this.encryptDecryptService.encrypt(applicationConstants.IN_ACTIVE), isGridPage: this.encryptDecryptService.encrypt(applicationConstants.IN_ACTIVE) } });
  }

  /**
    @author bhargavi
    @implements Get All Fd Cummulative Configuration details 
    @returns list of Fd Cummulative Configuration details
   */
  getAllFdNonCumulativeProductDefinition() {
    this.fdNonCumulativeProductDefinitionService.getAllFdNonCumulativeProductDefinition().subscribe((data: any) => {
      this.responseModel = data;
      if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
        if (null != this.responseModel.data && undefined != this.responseModel.data) {
          this.gridListData = this.responseModel.data;
          if (null != this.gridListData && undefined != this.gridListData && this.gridListData.length > 0) {
            this.gridListData = this.gridListData.filter((data: any) => null != data.effectiveStartDate).map(fdNonCummulative => {
              fdNonCummulative.effectiveStartDate = this.datePipe.transform(fdNonCummulative.effectiveStartDate, this.orgnizationSetting.datePipe) || '';
              //defaualt values as false
              fdNonCummulative.isSubmissionForApproval = false;
              fdNonCummulative.isApproved = false;
              fdNonCummulative.isRejected = false;
              fdNonCummulative.isRequestForResubmission = false;
              fdNonCummulative.viewButton = false;

              if (fdNonCummulative.statusName === CommonStatusData.SUBMISSION_FOR_APPROVAL) {
                fdNonCummulative.isSubmissionForApproval = true;
                fdNonCummulative.isApproved = true;
              } else if (fdNonCummulative.statusName === CommonStatusData.APPROVED) {
                fdNonCummulative.isApproved = true;
                fdNonCummulative.viewButton = true;
              } else if (fdNonCummulative.statusName === CommonStatusData.REJECTED) {
                fdNonCummulative.isRejected = true;
                fdNonCummulative.viewButton = true;
              } else if (fdNonCummulative.statusName === CommonStatusData.REQUEST_FOR_RESUBMISSION) {
                fdNonCummulative.isRequestForResubmission = true;
                fdNonCummulative.viewButton = true;
              }
              return fdNonCummulative
            });
          }
        }
        this.activeStatusCount = this.gridListData.filter(fdAccountApplication => fdAccountApplication.status != null && fdAccountApplication.status != undefined && fdAccountApplication.status === applicationConstants.ACTIVE).length;
        this.inactiveStatusCount = this.gridListData.filter(fdAccountApplication => fdAccountApplication.status != null && fdAccountApplication.status != undefined && fdAccountApplication.status === applicationConstants.IN_ACTIVE).length;
        this.gridListLength = this.gridListData.length;
        this.tempGridListData = this.gridListData;
        this.commonComponent.stopSpinner();
      } else {
        this.commonComponent.stopSpinner();
        this.msgs = [{ severity: 'error', detail: this.responseModel.statusMsg }];
        setTimeout(() => {
          this.msgs = [];
        }, 2000);
      }
    }, error => {
      this.msgs = [];
      this.msgs = [{ severity: "error", summary: 'Failed', detail: applicationConstants.WE_COULDNOT_PROCESS_YOU_ARE_REQUEST }];
      this.commonComponent.stopSpinner();
    });
  }
  /**
    @author bhargavi
    @implements To Enable/ Disable search filter form
   */
  onChange() {
    this.showForm = !this.showForm;
  }
}
