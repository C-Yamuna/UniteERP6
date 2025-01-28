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
import { SimpleInterestProductDefinitionService } from 'src/app/transcations/loan-transcation/simple-interest-loan/simple-interest-product-definition/shared/simple-interest-product-definition.service';
import { productDefinitionApprovalConstant } from '../../product-definition-approval-constant';

@Component({
  selector: 'app-si-loan-product-definition-approval',
  templateUrl: './si-loan-product-definition-approval.component.html',
  styleUrls: ['./si-loan-product-definition-approval.component.css']
})
export class SiLoanProductDefinitionApprovalComponent {
  responseModel!: Responsemodel;
  siLoanproductdefinition: any[] = [];
  showForm: boolean = applicationConstants.FALSE;
  editViewButton: boolean = applicationConstants.FALSE;
  gridListData: any[] = [];
  orgnizationSetting: any;
  msgs: any[] = [];

  constructor(private router: Router, private translate: TranslateService, private commonFunctionsService: CommonFunctionsService,
    private encryptDecryptService: EncryptDecryptService, private simpleInterestProductDefinitionService: SimpleInterestProductDefinitionService,
    private datePipe: DatePipe,
    private commonComponent: CommonComponent) {

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
    this.siLoanproductdefinition = [
      { field: 'name', header: 'LOANS.PRODUCT_NAME' },
      { field: '', header: 'LOANS.RATE_OF_INTEREST' },
      { field: 'eligibleMInAmount', header: 'LOANS.MINIMUM_AMOUNT' },
      { field: 'eligibleMaxAmount', header: 'LOANS.MAXIMUM_AMOUNT' },
      { field: 'effectiveStartDate', header: 'LOANS.EFFECTIVE_START_DATE' },
      { field: 'statusName', header: 'LOANS.STATUS' }
    ];
    this.getAllSiProductDefinitions();
  }

  viewsiproductdefinition(rowData: any) {
    this.router.navigate([productDefinitionApprovalConstant.SI_PRODUCT_DEFINITION_APPROVAL_DETAILS], { queryParams: { id: this.encryptDecryptService.encrypt(rowData.siProductId), editbtn: this.encryptDecryptService.encrypt(applicationConstants.IN_ACTIVE) } });
  }

  getAllSiProductDefinitions() {
    this.simpleInterestProductDefinitionService.getAllSimpleInterestProductDefinition().subscribe((data: any) => {
      this.responseModel = data;
      if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
        if (null != this.responseModel.data && undefined != this.responseModel.data) {
          this.gridListData = this.responseModel.data;
          if (null != this.gridListData && undefined != this.gridListData && this.gridListData.length > 0) {
            this.gridListData = this.gridListData.filter((data: any) => null != data.effectiveStartDate).map(siLoans => {
              siLoans.effectiveStartDate = this.datePipe.transform(siLoans.effectiveStartDate, this.orgnizationSetting.datePipe) || '';
              if (siLoans.statusName === CommonStatusData.IN_PROGRESS || siLoans.statusName === CommonStatusData.REQUEST_FOR_RESUBMISSION) {
                siLoans.showEdit = true;
              } else if (siLoans.statusName === CommonStatusData.SUBMISSION_FOR_APPROVAL || siLoans.statusName === CommonStatusData.REJECTED ||
                siLoans.statusName === CommonStatusData.CLOSED || siLoans.statusName === CommonStatusData.APPROVED) {
                siLoans.showEdit = false;
              }
              return siLoans
            });
          }
        }
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
 
  onChange() {
    this.showForm = !this.showForm;
  }
}
