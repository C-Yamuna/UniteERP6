import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { CommonComponent } from 'src/app/shared/common.component';
import { CommonFunctionsService } from 'src/app/shared/commonfunction.service';
import { EncryptDecryptService } from 'src/app/shared/encrypt-decrypt.service';
import { Responsemodel } from 'src/app/shared/responsemodel';
import { TermDepositProductDefinitionService } from 'src/app/transcations/term-deposits-transcation/term-deposit-product-definition/shared/term-deposit-product-definition.service';
import { termdeposittransactionconstant } from 'src/app/transcations/term-deposits-transcation/term-deposit-transaction-constant';
import { productDefinitionApprovalConstant } from '../../product-definition-approval-constant';
import { applicationConstants } from 'src/app/shared/applicationConstants';
import { ERP_TRANSACTION_CONSTANTS } from 'src/app/transcations/erp-transaction-constants';
import { FileUploadService } from 'src/app/shared/file-upload.service';
import { CommonStatusData } from 'src/app/transcations/common-status-data.json';

@Component({
  selector: 'app-fd-cummulative-product-definition-approval',
  templateUrl: './fd-cummulative-product-definition-approval.component.html',
  styleUrls: ['./fd-cummulative-product-definition-approval.component.css']
})
export class FdCummulativeProductDefinitionApprovalComponent {
  responseModel!: Responsemodel;
  termdepositproductdefinition: any[] = [];
  showForm: boolean = false;
  editViewButton: boolean = false;
  gridListData: any[] = [];
  orgnizationSetting: any;
  msgs: any[] = [];
  tempGridListData: any[] = [];
  activeStatusCount: any;
  inactiveStatusCount: any;
  gridListLength: Number | undefined;

  constructor(private router: Router,
    private translate: TranslateService,
    private commonFunctionsService: CommonFunctionsService,
    private encryptDecryptService: EncryptDecryptService,
    private fileUploadService: FileUploadService,
    private termDepositProductDefinitionService: TermDepositProductDefinitionService,
    private datePipe: DatePipe, private commonComponent: CommonComponent) {

  }

  /**
  @author Phanidher
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
    this.termdepositproductdefinition = [
      { field: 'name', header: 'TERMDEPOSITSTRANSACTION.PRODUCT_NAME' },
      { field: 'minDepositAmount', header: 'TERMDEPOSITSTRANSACTION.MIN_DEPOSIT_AMOUNT' },
      { field: 'maxDepositAmount', header: 'TERMDEPOSITSTRANSACTION.MAX_DEPOSIT_AMOUNT' },
      { field: 'effectiveStartDate', header: 'TERMDEPOSITSTRANSACTION.EFFECTIVE_START_DATE' },
      { field: 'statusName', header: 'TERMDEPOSITSTRANSACTION.STATUS' }
    ];
    this.getAllFdCummulativeProductDefinations();
  }

  view(rowData: any) {
    this.router.navigate([termdeposittransactionconstant.VIEW_FD_CUMMULATIVE_PRODUCT_DEFINITION], { queryParams: { id: this.encryptDecryptService.encrypt(rowData.id), editbtn: this.encryptDecryptService.encrypt(0), isGridPage: this.encryptDecryptService.encrypt(applicationConstants.IN_ACTIVE) } });
  }
  approve(rowData: any) {
    this.router.navigate([productDefinitionApprovalConstant.FD_CUMMULATIVE_PRODUCT_DEFINITION_APPROVAL_DETAILS], { queryParams: { id: this.encryptDecryptService.encrypt(rowData.id), editbtn: this.encryptDecryptService.encrypt(applicationConstants.IN_ACTIVE), isGridPage: this.encryptDecryptService.encrypt(applicationConstants.IN_ACTIVE) } });
  }


  getAllFdCummulativeProductDefinations() {
    this.termDepositProductDefinitionService.getAllFdCummulativeProductDefinations().subscribe((data: any) => {
      this.responseModel = data;
      this.gridListData = this.responseModel.data;
      this.gridListData = this.gridListData.filter((obj: any) => obj != null && obj.statusName != CommonStatusData.IN_PROGRESS &&
        obj.statusName != CommonStatusData.CREATED).map((fdCummulative: any) => {

          if (fdCummulative.effectiveStartDate != null && fdCummulative.effectiveStartDate != undefined) {
            fdCummulative.effectiveStartDate = this.datePipe.transform(fdCummulative.effectiveStartDate, this.orgnizationSetting.datePipe);
          }
          //defaualt values as false
          fdCummulative.isSubmissionForApproval = false;
          fdCummulative.isApproved = false;
          fdCummulative.isRejected = false;
          fdCummulative.isRequestForResubmission = false;
          fdCummulative.viewButton = false;

          if (fdCummulative.statusName === CommonStatusData.SUBMISSION_FOR_APPROVAL) {
            fdCummulative.isSubmissionForApproval = true;
            fdCummulative.isApproved = true;
          } else if (fdCummulative.statusName === CommonStatusData.APPROVED) {
            fdCummulative.isApproved = true;
            fdCummulative.viewButton = true;
          } else if (fdCummulative.statusName === CommonStatusData.REJECTED) {
            fdCummulative.isRejected = true;
            fdCummulative.viewButton = true;
          } else if (fdCummulative.statusName === CommonStatusData.REQUEST_FOR_RESUBMISSION) {
            fdCummulative.isRequestForResubmission = true;
            fdCummulative.viewButton = true;
          }
          return fdCummulative
        });
      this.activeStatusCount = this.gridListData.filter(fdAccountApplication => fdAccountApplication.status != null && fdAccountApplication.status != undefined && fdAccountApplication.status === applicationConstants.ACTIVE).length;
      this.inactiveStatusCount = this.gridListData.filter(fdAccountApplication => fdAccountApplication.status != null && fdAccountApplication.status != undefined && fdAccountApplication.status === applicationConstants.IN_ACTIVE).length;
      this.gridListLength = this.gridListData.length;
      this.tempGridListData = this.gridListData;
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
