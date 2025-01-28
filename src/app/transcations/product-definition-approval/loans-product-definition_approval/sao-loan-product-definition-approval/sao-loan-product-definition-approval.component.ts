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
import { SaoProductDefinitionsService } from 'src/app/transcations/loan-transcation/sao/sao-product-definition/shared/sao-product-definitions.service';
import { productDefinitionApprovalConstant } from '../../product-definition-approval-constant';

@Component({
  selector: 'app-sao-loan-product-definition-approval',
  templateUrl: './sao-loan-product-definition-approval.component.html',
  styleUrls: ['./sao-loan-product-definition-approval.component.css']
})
export class SaoLoanProductDefinitionApprovalComponent {
  responseModel!: Responsemodel;
  saoLoanproductdefinition: any[] = [];
  showForm: boolean = applicationConstants.FALSE;
  editViewButton: boolean = applicationConstants.FALSE;
  gridListData: any[] = [];
  orgnizationSetting: any;
  msgs: any[] = [];

  constructor(private router: Router, private translate: TranslateService, private commonFunctionsService: CommonFunctionsService,
    private encryptDecryptService: EncryptDecryptService, private saoProductDefinitionsService: SaoProductDefinitionsService,
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
    this.saoLoanproductdefinition = [
      { field: 'name', header: 'LOANS.PRODUCT_NAME' },
      { field: '', header: 'LOANS.RATE_OF_INTEREST' },
      { field: 'eligibleMInAmount', header: 'LOANS.MINIMUM_AMOUNT' },
      { field: 'eligibleMaxAmount', header: 'LOANS.MAXIMUM_AMOUNT' },
      { field: 'effectiveStartDate', header: 'LOANS.EFFECTIVE_START_DATE' },
      { field: 'status', header: 'LOANS.STATUS' }
    ];
    this.getAllSaoProductDefinitions();
  }
  
  viewsaoproductdefinition(rowData: any) {
    this.router.navigate([productDefinitionApprovalConstant.SAO_PRODUCT_DEFINITION_APPROVAL_DETAILS], { queryParams: { id: this.encryptDecryptService.encrypt(rowData.saoProductId), editbtn: this.encryptDecryptService.encrypt(applicationConstants.IN_ACTIVE) } });
  }
  
  getAllSaoProductDefinitions() {
    this.saoProductDefinitionsService.getAllSaoProductDefinitions().subscribe((data: any) => {
      this.responseModel = data;
      if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
        if (null != this.responseModel.data && undefined != this.responseModel.data) {
          this.gridListData = this.responseModel.data;
          if (null != this.gridListData && undefined != this.gridListData && this.gridListData.length > 0) {
            this.gridListData = this.gridListData.filter((data: any) => null != data.effectiveStartDate).map(saoLoans => {
              saoLoans.effectiveStartDate = this.datePipe.transform(saoLoans.effectiveStartDate, this.orgnizationSetting.datePipe) || '';
              if (saoLoans.statusName === CommonStatusData.IN_PROGRESS || saoLoans.statusName === CommonStatusData.REQUEST_FOR_RESUBMISSION) {
                saoLoans.showEdit = true;
              } else if (saoLoans.statusName === CommonStatusData.SUBMISSION_FOR_APPROVAL || saoLoans.statusName === CommonStatusData.REJECTED ||
                saoLoans.statusName === CommonStatusData.CLOSED || saoLoans.statusName === CommonStatusData.APPROVED) {
                saoLoans.showEdit = false;
              }
              return saoLoans
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
