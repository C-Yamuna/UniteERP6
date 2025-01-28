import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { applicationConstants } from 'src/app/shared/applicationConstants';
import { CommonComponent } from 'src/app/shared/common.component';
import { CommonFunctionsService } from 'src/app/shared/commonfunction.service';
import { EncryptDecryptService } from 'src/app/shared/encrypt-decrypt.service';
import { Responsemodel } from 'src/app/shared/responsemodel';
import { TermLoanProductDefinition } from 'src/app/transcations/loan-transcation/term-loan/term-loan-product-definition/shared/term-loan-product-definition.model';
import { TermLoanProductDefinitionService } from 'src/app/transcations/loan-transcation/term-loan/term-loan-product-definition/shared/term-loan-product-definition.service';
import { TermLoanLinkedShareCapital } from 'src/app/transcations/loan-transcation/term-loan/term-loan-product-definition/term-loan-product-definition-stepper/term-loan-linked-share-capital/shared/term-loan-linked-share-capital.model';
import { TermLoanRequiredDocuments } from 'src/app/transcations/loan-transcation/term-loan/term-loan-product-definition/term-loan-product-definition-stepper/term-loan-required-documents/shared/term-loan-required-documents.model';
import { TermLoanInterestPolicy } from 'src/app/transcations/loan-transcation/term-loan/term-loan-stepper/term-loan-application-details/shared/term-application.model';
import { productDefinitionApprovalConstant } from '../../../product-definition-approval-constant';
import { CommonStatusData } from 'src/app/transcations/common-status-data.json';
import { CommonCategoryService } from 'src/app/configurations/loan-config/common-category/shared/common-category.service';

@Component({
  selector: 'app-term-loan-product-definition-approval-details',
  templateUrl: './term-loan-product-definition-approval-details.component.html',
  styleUrls: ['./term-loan-product-definition-approval-details.component.css']
})
export class TermLoanProductDefinitionApprovalDetailsComponent {
  termLoanProductDefinitionModel: TermLoanProductDefinition = new TermLoanProductDefinition();
  termLoanInterestPolicyModel: TermLoanInterestPolicy = new TermLoanInterestPolicy();
  termLoanLinkedShareCapitalModel: TermLoanLinkedShareCapital = new TermLoanLinkedShareCapital();
  termLoanRequiredDocumentsModel: TermLoanRequiredDocuments = new TermLoanRequiredDocuments();
  interestPolicyList: any[] = [];
  requiredDocumentsList: any[] = [];
  chargesList: any[] = [];
  purposeList: any[] = [];
  linkedShareCapitalList: any[] = [];
  statusList: any[] = [];
  interestPostingFrequencyList: any[] = [];
  collectionOrderList: any[] = [];
  responseModel!: Responsemodel;
  msgs: any[] = [];
  collateralList: any[] = [];
  isEdit: any;
  buttonDisabled?: any;
  orgnizationSetting: any;
  memberLandDetails: any;
  termProductId: any;
  isDisableSubmit: boolean = false;
  constructor(private commonComponent: CommonComponent,
    private formBuilder: FormBuilder, private activateRoute: ActivatedRoute,
    private encryptService: EncryptDecryptService, private datePipe: DatePipe,
    private router: Router, private commonFunctionsService: CommonFunctionsService,
    private translate: TranslateService, private termLoanProductDefinitionService: TermLoanProductDefinitionService,
    private commonStatusService: CommonCategoryService,) {
  }
  ngOnInit(): void {
    this.orgnizationSetting = this.commonComponent.orgnizationSettings()
    this.interestPostingFrequencyList = this.commonComponent.rePaymentFrequency();
    this.commonFunctionsService.data.subscribe((res: any) => {
      if (res) {
        this.translate.use(res);
      } else {
        this.translate.use(this.commonFunctionsService.getStorageValue('language'));
      }
      this.activateRoute.queryParams.subscribe(params => {
        this.commonComponent.startSpinner();
        if (params['id'] != undefined && params['id'] != null) {
          this.termProductId = this.encryptService.decrypt(params['id']);
          this.isEdit = applicationConstants.TRUE;
          this.termLoanProductDefinitionService.getPreviewDetailsByProductId(this.termProductId).subscribe(res => {
            this.responseModel = res;
            if (this.responseModel != null && this.responseModel != undefined) {
              this.termLoanProductDefinitionModel = this.responseModel.data[0];
              if (null != this.termLoanProductDefinitionModel.effectiveStartDate && undefined != this.termLoanProductDefinitionModel.effectiveStartDate)
                this.termLoanProductDefinitionModel.effectiveStartDate = this.datePipe.transform(this.termLoanProductDefinitionModel.effectiveStartDate, this.orgnizationSetting.datePipe);

              if (this.termLoanProductDefinitionModel.termProdCollateralsConfigList) {
                this.collateralList = this.termLoanProductDefinitionModel.termProdCollateralsConfigList
                  .filter((item: any) => item != null && item.status === applicationConstants.ACTIVE)
                  .map((item: { collateralTypeName: any, collateralType: any }) => ({
                    label: item.collateralTypeName,
                    value: item.collateralType
                  }));
              }

              if (this.termLoanProductDefinitionModel.termInterestPolicyConfigDTOList != null && this.termLoanProductDefinitionModel.termInterestPolicyConfigDTOList != undefined && this.termLoanProductDefinitionModel.termInterestPolicyConfigDTOList.length > 0) {
                this.interestPolicyList = this.termLoanProductDefinitionModel.termInterestPolicyConfigDTOList;
                this.interestPolicyList = this.interestPolicyList.filter((data: any) => data != null && data.effectiveStartDate != null).map((object: any) => {
                  object.effectiveStartDate = this.datePipe.transform(object.effectiveStartDate, this.orgnizationSetting.datePipe);
                  return object;
                });
              }
              if (this.termLoanProductDefinitionModel.termApportionConfigDTOList != null && this.termLoanProductDefinitionModel.termApportionConfigDTOList != undefined && this.termLoanProductDefinitionModel.termApportionConfigDTOList.length > 0) {
                this.collectionOrderList = this.termLoanProductDefinitionModel.termApportionConfigDTOList;
                this.collectionOrderList = this.collectionOrderList.filter((data: any) => data != null && data.effectiveStartDate != null).map((object: any) => {
                  object.effectiveStartDate = this.datePipe.transform(object.effectiveStartDate, this.orgnizationSetting.datePipe);
                  return object;
                });
              }
              if (this.termLoanProductDefinitionModel.termLoanLinkedSharecapitalConfigList != null && this.termLoanProductDefinitionModel.termLoanLinkedSharecapitalConfigList != undefined && this.termLoanProductDefinitionModel.termLoanLinkedSharecapitalConfigList.length > 0) {
                this.linkedShareCapitalList = this.termLoanProductDefinitionModel.termLoanLinkedSharecapitalConfigList;
                this.linkedShareCapitalList = this.linkedShareCapitalList.filter((data: any) => data != null && data.effectiveStartDate != null).map((object: any) => {
                  object.effectiveStartDate = this.datePipe.transform(object.effectiveStartDate, this.orgnizationSetting.datePipe);
                  return object;
                });
              }

              if (this.termLoanProductDefinitionModel.termProductChargesConfigDTOList != null && this.termLoanProductDefinitionModel.termProductChargesConfigDTOList != undefined && this.termLoanProductDefinitionModel.termProductChargesConfigDTOList.length > 0) {
                this.chargesList = this.termLoanProductDefinitionModel.termProductChargesConfigDTOList;
                this.chargesList = this.chargesList.filter((data: any) => data != null && data.effectiveStartDate != null).map((object: any) => {
                  object.effectiveStartDate = this.datePipe.transform(object.effectiveStartDate, this.orgnizationSetting.datePipe);
                  return object;
                });
              }
              if (this.termLoanProductDefinitionModel.termProdPurPoseConfgList != null && this.termLoanProductDefinitionModel.termProdPurPoseConfgList != undefined && this.termLoanProductDefinitionModel.termProdPurPoseConfgList.length > 0) {
                this.purposeList = this.termLoanProductDefinitionModel.termProdPurPoseConfgList;
                this.purposeList = this.purposeList.filter((data: any) => data != null && data.effectiveStartDate != null).map((object: any) => {
                  object.effectiveStartDate = this.datePipe.transform(object.effectiveStartDate, this.orgnizationSetting.datePipe);
                  return object;
                });
              }

              if (this.termLoanProductDefinitionModel.termRequiredDocumentsConfigDTOList != null && this.termLoanProductDefinitionModel.termRequiredDocumentsConfigDTOList != undefined && this.termLoanProductDefinitionModel.termRequiredDocumentsConfigDTOList.length > 0) {
                this.requiredDocumentsList = this.termLoanProductDefinitionModel.termRequiredDocumentsConfigDTOList;
                this.requiredDocumentsList = this.requiredDocumentsList.filter((data: any) => data != null && data.effectiveStartDate != null).map((object: any) => {
                  object.effectiveStartDate = this.datePipe.transform(object.effectiveStartDate, this.orgnizationSetting.datePipe);
                  return object;
                });
              }
            }
          });
        } else {
          this.isEdit = applicationConstants.FALSE;
        }
      })
    })

    this.getAllStatusList()
  }
  navigateToBack() {
    this.router.navigate([productDefinitionApprovalConstant.TERM_LOAN_PRODUCT_DEFINITION_APPROVAL]);

  }
  update() {
    if (this.termLoanProductDefinitionModel.effectiveStartDate != undefined && this.termLoanProductDefinitionModel.effectiveStartDate != null)
      this.termLoanProductDefinitionModel.effectiveStartDate = this.commonFunctionsService.getUTCEpoch(new Date(this.termLoanProductDefinitionModel.effectiveStartDate));

    if (this.termLoanProductDefinitionModel.endDate != undefined && this.termLoanProductDefinitionModel.endDate != null)
      this.termLoanProductDefinitionModel.endDate = this.commonFunctionsService.getUTCEpoch(new Date(this.termLoanProductDefinitionModel.endDate));



    if (this.termLoanProductDefinitionModel.termInterestPolicyConfigDTOList != null && this.termLoanProductDefinitionModel.termInterestPolicyConfigDTOList != undefined && this.termLoanProductDefinitionModel.termInterestPolicyConfigDTOList.length > 0) {
      this.termLoanProductDefinitionModel.termInterestPolicyConfigDTOList = this.termLoanProductDefinitionModel.termInterestPolicyConfigDTOList.filter((data: any) => data != null && data.effectiveStartDate != null).map((object: any) => {
        object.effectiveStartDate = this.commonFunctionsService.getUTCEpoch(new Date(object.effectiveStartDate));
        return object;
      });
    }
    if (this.termLoanProductDefinitionModel.termApportionConfigDTOList != null && this.termLoanProductDefinitionModel.termApportionConfigDTOList != undefined && this.termLoanProductDefinitionModel.termApportionConfigDTOList.length > 0) {
      this.termLoanProductDefinitionModel.termApportionConfigDTOList = this.termLoanProductDefinitionModel.termApportionConfigDTOList.filter((data: any) => data != null && data.effectiveStartDate != null).map((object: any) => {
        object.effectiveStartDate = this.commonFunctionsService.getUTCEpoch(new Date(object.effectiveStartDate));
        return object;
      });
    }


    if (this.termLoanProductDefinitionModel.termProductChargesConfigDTOList != null && this.termLoanProductDefinitionModel.termProductChargesConfigDTOList != undefined && this.termLoanProductDefinitionModel.termProductChargesConfigDTOList.length > 0) {
      this.termLoanProductDefinitionModel.termProductChargesConfigDTOList = this.termLoanProductDefinitionModel.termProductChargesConfigDTOList.filter((data: any) => data != null && data.effectiveStartDate != null).map((object: any) => {
        object.effectiveStartDate = this.commonFunctionsService.getUTCEpoch(new Date(object.effectiveStartDate));
        return object;
      });
    }


    if (this.termLoanProductDefinitionModel.termProdPurPoseConfgList != null && this.termLoanProductDefinitionModel.termProdPurPoseConfgList != undefined && this.termLoanProductDefinitionModel.termProdPurPoseConfgList.length > 0) {
      this.termLoanProductDefinitionModel.termProdPurPoseConfgList = this.termLoanProductDefinitionModel.termProdPurPoseConfgList.filter((data: any) => data != null && data.effectiveStartDate != null).map((object: any) => {
        object.effectiveStartDate = this.commonFunctionsService.getUTCEpoch(new Date(object.effectiveStartDate));
        return object;
      });
    }
    if (this.termLoanProductDefinitionModel.termLoanLinkedSharecapitalConfigList != null && this.termLoanProductDefinitionModel.termLoanLinkedSharecapitalConfigList != undefined && this.termLoanProductDefinitionModel.termLoanLinkedSharecapitalConfigList.length > 0) {
      this.termLoanProductDefinitionModel.termLoanLinkedSharecapitalConfigList = this.termLoanProductDefinitionModel.termLoanLinkedSharecapitalConfigList.filter((data: any) => data != null && data.effectiveStartDate != null).map((object: any) => {
        object.effectiveStartDate = this.commonFunctionsService.getUTCEpoch(new Date(object.effectiveStartDate));
        return object;
      });
    }



    if (this.termLoanProductDefinitionModel.termRequiredDocumentsConfigDTOList != null && this.termLoanProductDefinitionModel.termRequiredDocumentsConfigDTOList != undefined && this.termLoanProductDefinitionModel.termRequiredDocumentsConfigDTOList.length > 0) {
      this.termLoanProductDefinitionModel.termRequiredDocumentsConfigDTOList = this.termLoanProductDefinitionModel.termRequiredDocumentsConfigDTOList.filter((data: any) => data != null && data.effectiveStartDate != null).map((object: any) => {
        object.effectiveStartDate = this.commonFunctionsService.getUTCEpoch(new Date(object.effectiveStartDate));
        return object;
      });
    }
    // this.termLoanProductDefinitionModel.statusName = CommonStatusData.SUBMISSION_FOR_APPROVAL;
    this.termLoanProductDefinitionService.updateTermLoanProductDefinition(this.termLoanProductDefinitionModel).subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel.status === applicationConstants.STATUS_SUCCESS && this.responseModel.data[0] != null) {
        if (this.responseModel != null && this.responseModel.data != undefined) {
          if (null != this.termLoanProductDefinitionModel.effectiveStartDate && undefined != this.termLoanProductDefinitionModel.effectiveStartDate)
            this.termLoanProductDefinitionModel.effectiveStartDate = this.datePipe.transform(this.termLoanProductDefinitionModel.effectiveStartDate, this.orgnizationSetting.datePipe);

          if (null != this.termLoanProductDefinitionModel.endDate && undefined != this.termLoanProductDefinitionModel.endDate)
            this.termLoanProductDefinitionModel.endDate = this.datePipe.transform(this.termLoanProductDefinitionModel.endDate, this.orgnizationSetting.datePipe);

          if (null != this.termLoanRequiredDocumentsModel.effectiveStartDate)
            this.termLoanRequiredDocumentsModel.effectiveStartDate = this.datePipe.transform(this.termLoanRequiredDocumentsModel.effectiveStartDate, this.orgnizationSetting.datePipe);


          this.commonComponent.stopSpinner();
          this.msgs = [];

          this.msgs = [{ severity: 'success', summary: applicationConstants.STATUS_SUCCESS, detail: this.responseModel.statusMsg }];

          setTimeout(() => {
            this.msgs = [];
          }, 2000);

        }
      } else {
        this.commonComponent.stopSpinner();
        this.msgs = [{ severity: 'error', detail: this.responseModel.statusMsg }];
        setTimeout(() => {
          this.msgs = [];
        }, 2000);
      }
    },
      error => {
        this.commonComponent.stopSpinner();
        this.msgs = [{ severity: 'error', detail: applicationConstants.SERVER_DOWN_ERROR }];
        setTimeout(() => {
          this.msgs = [];
        }, 2000);
      });
  }
  submit() {
    this.update();
    this.msgs = [];
    this.msgs = [{ severity: "success", detail: applicationConstants.TERM_LOAN_PRODUCT_DEFINITION }];
    setTimeout(() => {
      this.router.navigate([productDefinitionApprovalConstant.TERM_LOAN_PRODUCT_DEFINITION_APPROVAL]);
    }, 1500);
  }

  getAllStatusList() {
    this.isDisableSubmit = true;
    this.commonStatusService.getAllCommonStatus().subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel != null && this.responseModel != undefined) {
        if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
          if (this.responseModel.data != null && this.responseModel.data != undefined && this.responseModel.data.length > 0) {
            this.statusList = this.responseModel.data;
            this.statusList = this.responseModel.data.filter((obj: any) => obj != null && (obj.name == CommonStatusData.APPROVED ||
             obj.name == CommonStatusData.REQUEST_FOR_RESUBMISSION || obj.name == CommonStatusData.REJECTED)).map((status: { name: any; id: any; }) => {
              return { label: status.name, value: status.id };
            });
          }
          else {
            this.msgs = [];
            this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: this.responseModel.statusMsg }];
            setTimeout(() => {
              this.msgs = [];
            }, 2000);
          }
        }
      }
    },
      error => {
        this.commonComponent.stopSpinner();
        this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: this.responseModel.statusMsg }];
        setTimeout(() => {
          this.msgs = [];
        }, 2000);
      });
  }

  onStatusChange(event: any) {
    const selectedStatus = this.statusList.find((data: any) => data != null && data.value === event.value);
    if (selectedStatus) {
      this.termLoanProductDefinitionModel.status = selectedStatus.value;
      this.termLoanProductDefinitionModel.statusName = selectedStatus.label;
      this.isDisableSubmit = false;
    } else {
      this.termLoanProductDefinitionModel.status = null;
      this.termLoanProductDefinitionModel.statusName = null;
      this.isDisableSubmit = true; 
    }
  }
}
