import { Component } from '@angular/core';
import { applicationConstants } from 'src/app/shared/applicationConstants';
import { productDefinitionApprovalConstant } from '../../../product-definition-approval-constant';
import { CompoundInterestProductDefinition } from 'src/app/transcations/loan-transcation/compound-interest-loan/compound-interest-product-definition/shared/compound-interest-product-definition.model';
import { CommonComponent } from 'src/app/shared/common.component';
import { FormBuilder } from '@angular/forms';
import { EncryptDecryptService } from 'src/app/shared/encrypt-decrypt.service';
import { DatePipe } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CompoundInterestProductDefinitionService } from 'src/app/transcations/loan-transcation/compound-interest-loan/compound-interest-product-definition/shared/compound-interest-product-definition.service';
import { CommonFunctionsService } from 'src/app/shared/commonfunction.service';
import { Responsemodel } from 'src/app/shared/responsemodel';
import { CommonStatusData } from 'src/app/transcations/common-status-data.json';
import { CiRequiredDocuments } from 'src/app/transcations/loan-transcation/compound-interest-loan/compound-interest-product-definition/compound-interest-product-definition-stepper/ci-required-documents/shared/ci-required-documents.model';
import { CommonCategoryService } from 'src/app/configurations/loan-config/common-category/shared/common-category.service';

@Component({
  selector: 'app-ci-loan-product-definition-approval-details',
  templateUrl: './ci-loan-product-definition-approval-details.component.html',
  styleUrls: ['./ci-loan-product-definition-approval-details.component.css']
})
export class CiLoanProductDefinitionApprovalDetailsComponent {
  compoundInterestProductDefinitionModel :CompoundInterestProductDefinition = new CompoundInterestProductDefinition();
  ciRequiredDocumentsModel : CiRequiredDocuments = new CiRequiredDocuments();
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
  ciProductId: any;
  isDisableSubmit: boolean = false;

  constructor(private commonComponent: CommonComponent,
    private formBuilder: FormBuilder, private router: Router,
    private activateRoute: ActivatedRoute, private datePipe: DatePipe,
    private encryptService: EncryptDecryptService,
    private commonFunctionsService: CommonFunctionsService,
    private translate: TranslateService,
    private compoundInterestProductDefinitionService: CompoundInterestProductDefinitionService,
    private commonStatusService: CommonCategoryService) {
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
          this.ciProductId = this.encryptService.decrypt(params['id']);
          
          this.isEdit = applicationConstants.TRUE;
          this.compoundInterestProductDefinitionService.getPreviewDetailsByProductId(this.ciProductId).subscribe(res => {
            this.responseModel = res;
            if (this.responseModel != null && this.responseModel != undefined) {
              this.compoundInterestProductDefinitionModel = this.responseModel.data[0];
              if (null != this.compoundInterestProductDefinitionModel.effectiveStartDate && undefined != this.compoundInterestProductDefinitionModel.effectiveStartDate)
                this.compoundInterestProductDefinitionModel.effectiveStartDate = this.datePipe.transform(this.compoundInterestProductDefinitionModel.effectiveStartDate, this.orgnizationSetting.datePipe);
            
              if (this.compoundInterestProductDefinitionModel.ciProdCollateralsConfigDTOList) {
                this.collateralList = this.compoundInterestProductDefinitionModel.ciProdCollateralsConfigDTOList
                  .filter((item: any) => item != null  && item.status === applicationConstants.ACTIVE) 
                  .map((item: { collateralTypeName: string, collateralType: any }) => ({
                    label: item.collateralTypeName,
                    value: item.collateralType
                  }));
              }
            
            
              if (this.compoundInterestProductDefinitionModel.ciInterestPolicyConfigDTOList != null && this.compoundInterestProductDefinitionModel.ciInterestPolicyConfigDTOList != undefined && this.compoundInterestProductDefinitionModel.ciInterestPolicyConfigDTOList.length > 0) {
                this.interestPolicyList = this.compoundInterestProductDefinitionModel.ciInterestPolicyConfigDTOList;
                this.interestPolicyList = this.interestPolicyList.filter((data: any) => data != null && data.effectiveStartDate != null).map((object: any) => {
                  object.effectiveStartDate = this.datePipe.transform(object.effectiveStartDate, this.orgnizationSetting.datePipe);
                  return object;
                });
              }
              if (this.compoundInterestProductDefinitionModel.ciApportionConfigDTOList != null && this.compoundInterestProductDefinitionModel.ciApportionConfigDTOList != undefined && this.compoundInterestProductDefinitionModel.ciApportionConfigDTOList.length > 0) {
                this.collectionOrderList = this.compoundInterestProductDefinitionModel.ciApportionConfigDTOList;
                this.collectionOrderList = this.collectionOrderList.filter((data: any) => data != null && data.effectiveStartDate != null).map((object: any) => {
                  object.effectiveStartDate = this.datePipe.transform(object.effectiveStartDate, this.orgnizationSetting.datePipe);
                  return object;
                });
              }
              if (this.compoundInterestProductDefinitionModel.ciLoanLinkedShareCapitalConfigDTOList != null && this.compoundInterestProductDefinitionModel.ciLoanLinkedShareCapitalConfigDTOList != undefined && this.compoundInterestProductDefinitionModel.ciLoanLinkedShareCapitalConfigDTOList.length > 0) {
                this.linkedShareCapitalList = this.compoundInterestProductDefinitionModel.ciLoanLinkedShareCapitalConfigDTOList;
                this.linkedShareCapitalList = this.linkedShareCapitalList.filter((data: any) => data != null && data.effectiveStartDate != null).map((object: any) => {
                  object.effectiveStartDate = this.datePipe.transform(object.effectiveStartDate, this.orgnizationSetting.datePipe);
                  return object;
                });
              }

              if (this.compoundInterestProductDefinitionModel.ciProductChargesConfigDTOList != null && this.compoundInterestProductDefinitionModel.ciProductChargesConfigDTOList != undefined && this.compoundInterestProductDefinitionModel.ciProductChargesConfigDTOList.length > 0) {
                this.chargesList = this.compoundInterestProductDefinitionModel.ciProductChargesConfigDTOList;
                this.chargesList = this.chargesList.filter((data: any) => data != null && data.effectiveStartDate != null).map((object: any) => {
                  object.effectiveStartDate = this.datePipe.transform(object.effectiveStartDate, this.orgnizationSetting.datePipe);
                  return object;
                });
              }
              if (this.compoundInterestProductDefinitionModel.ciProdPurposeConfigDTOList != null && this.compoundInterestProductDefinitionModel.ciProdPurposeConfigDTOList != undefined && this.compoundInterestProductDefinitionModel.ciProdPurposeConfigDTOList.length > 0) {
                this.purposeList = this.compoundInterestProductDefinitionModel.ciProdPurposeConfigDTOList;
                this.purposeList = this.purposeList.filter((data: any) => data != null && data.effectiveStartDate != null).map((object: any) => {
                  object.effectiveStartDate = this.datePipe.transform(object.effectiveStartDate, this.orgnizationSetting.datePipe);
                  return object;
                });
              }

              if (this.compoundInterestProductDefinitionModel.ciRequiredDocumentsConfigDTOList != null && this.compoundInterestProductDefinitionModel.ciRequiredDocumentsConfigDTOList != undefined && this.compoundInterestProductDefinitionModel.ciRequiredDocumentsConfigDTOList.length > 0) {
                this.requiredDocumentsList = this.compoundInterestProductDefinitionModel.ciRequiredDocumentsConfigDTOList;
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
    this.getAllStatusList();
  }
  navigateToBack() {
      this.router.navigate([productDefinitionApprovalConstant.CI_PRODUCT_DEFINITION_APPROVAL]);
  }

  update(){
    if(this.compoundInterestProductDefinitionModel.effectiveStartDate != undefined && this.compoundInterestProductDefinitionModel.effectiveStartDate != null)
      this.compoundInterestProductDefinitionModel.effectiveStartDate = this.commonFunctionsService.getUTCEpoch(new Date(this.compoundInterestProductDefinitionModel.effectiveStartDate));
   
    if(this.compoundInterestProductDefinitionModel.endDate != undefined && this.compoundInterestProductDefinitionModel.endDate != null)
      this.compoundInterestProductDefinitionModel.endDate = this.commonFunctionsService.getUTCEpoch(new Date(this.compoundInterestProductDefinitionModel.endDate));
  
  
  
    if (this.compoundInterestProductDefinitionModel.ciInterestPolicyConfigDTOList != null && this.compoundInterestProductDefinitionModel.ciInterestPolicyConfigDTOList != undefined && this.compoundInterestProductDefinitionModel.ciInterestPolicyConfigDTOList.length > 0) {
      this.compoundInterestProductDefinitionModel.ciInterestPolicyConfigDTOList = this.compoundInterestProductDefinitionModel.ciInterestPolicyConfigDTOList.filter((data:any) => data !=null &&data.effectiveStartDate !=null).map((object:any) => {
        object.effectiveStartDate = this.commonFunctionsService.getUTCEpoch(new Date(object.effectiveStartDate));
        return object;
      });
    }
    if (this.compoundInterestProductDefinitionModel.ciApportionConfigDTOList != null && this.compoundInterestProductDefinitionModel.ciApportionConfigDTOList != undefined && this.compoundInterestProductDefinitionModel.ciApportionConfigDTOList.length > 0) {
      this.compoundInterestProductDefinitionModel.ciApportionConfigDTOList = this.compoundInterestProductDefinitionModel.ciApportionConfigDTOList.filter((data:any) => data !=null &&data.effectiveStartDate !=null).map((object:any) => {
        object.effectiveStartDate = this.commonFunctionsService.getUTCEpoch(new Date(object.effectiveStartDate));
        return object;
      });
    }


    if (this.compoundInterestProductDefinitionModel.ciProductChargesConfigDTOList != null && this.compoundInterestProductDefinitionModel.ciProductChargesConfigDTOList != undefined && this.compoundInterestProductDefinitionModel.ciProductChargesConfigDTOList.length > 0) {
      this.compoundInterestProductDefinitionModel.ciProductChargesConfigDTOList = this.compoundInterestProductDefinitionModel.ciProductChargesConfigDTOList.filter((data:any) => data !=null &&data.effectiveStartDate !=null).map((object:any) => {
        object.effectiveStartDate = this.commonFunctionsService.getUTCEpoch(new Date(object.effectiveStartDate));
        return object;
      });
    }


    if (this.compoundInterestProductDefinitionModel.ciProdPurposeConfigDTOList != null && this.compoundInterestProductDefinitionModel.ciProdPurposeConfigDTOList != undefined && this.compoundInterestProductDefinitionModel.ciProdPurposeConfigDTOList.length > 0) {
      this.compoundInterestProductDefinitionModel.ciProdPurposeConfigDTOList = this.compoundInterestProductDefinitionModel.ciProdPurposeConfigDTOList.filter((data:any) => data !=null &&data.effectiveStartDate !=null).map((object:any) => {
        object.effectiveStartDate = this.commonFunctionsService.getUTCEpoch(new Date(object.effectiveStartDate));
        return object;
      });
    }
    if (this.compoundInterestProductDefinitionModel.ciLoanLinkedShareCapitalConfigDTOList != null && this.compoundInterestProductDefinitionModel.ciLoanLinkedShareCapitalConfigDTOList != undefined && this.compoundInterestProductDefinitionModel.ciLoanLinkedShareCapitalConfigDTOList.length > 0) {
      this.compoundInterestProductDefinitionModel.ciLoanLinkedShareCapitalConfigDTOList = this.compoundInterestProductDefinitionModel.ciLoanLinkedShareCapitalConfigDTOList.filter((data:any) => data !=null &&data.effectiveStartDate !=null).map((object:any) => {
        object.effectiveStartDate = this.commonFunctionsService.getUTCEpoch(new Date(object.effectiveStartDate));
        return object;
      });
    }



    if (this.compoundInterestProductDefinitionModel.ciRequiredDocumentsConfigDTOList != null && this.compoundInterestProductDefinitionModel.ciRequiredDocumentsConfigDTOList != undefined && this.compoundInterestProductDefinitionModel.ciRequiredDocumentsConfigDTOList.length > 0) {
      this.compoundInterestProductDefinitionModel.ciRequiredDocumentsConfigDTOList = this.compoundInterestProductDefinitionModel.ciRequiredDocumentsConfigDTOList.filter((data:any) => data !=null &&data.effectiveStartDate !=null).map((object:any) => {
        object.effectiveStartDate = this.commonFunctionsService.getUTCEpoch(new Date(object.effectiveStartDate));
        return object;
      });
    }
    // this.compoundInterestProductDefinitionModel.statusName = CommonStatusData.SUBMISSION_FOR_APPROVAL;
    this.compoundInterestProductDefinitionService.updateCompoundInterestProductDefinition(this.compoundInterestProductDefinitionModel).subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel.status === applicationConstants.STATUS_SUCCESS && this.responseModel.data[0] !=null) {
        if (this.responseModel != null&& this.responseModel.data!= undefined) {
          if(null != this.compoundInterestProductDefinitionModel.effectiveStartDate && undefined != this.compoundInterestProductDefinitionModel.effectiveStartDate)
            this.compoundInterestProductDefinitionModel.effectiveStartDate=this.datePipe.transform(this.compoundInterestProductDefinitionModel.effectiveStartDate, this.orgnizationSetting.datePipe);
    
          if(null != this.compoundInterestProductDefinitionModel.endDate && undefined != this.compoundInterestProductDefinitionModel.endDate)
            this.compoundInterestProductDefinitionModel.endDate=this.datePipe.transform(this.compoundInterestProductDefinitionModel.endDate, this.orgnizationSetting.datePipe);
  
          if(null != this.ciRequiredDocumentsModel.effectiveStartDate)
            this.ciRequiredDocumentsModel.effectiveStartDate=this.datePipe.transform(this.ciRequiredDocumentsModel.effectiveStartDate, this.orgnizationSetting.datePipe);
  
  
        this.commonComponent.stopSpinner();
        this.msgs = [];
   
        this.msgs =[{ severity: 'success',summary: applicationConstants.STATUS_SUCCESS, detail: this.responseModel.statusMsg }];
    
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
    this.msgs = [{ severity: "success", detail:  applicationConstants.CI_LOAN__PRODUCT_DEFINITION }];
    setTimeout(() => {
      this.router.navigate([productDefinitionApprovalConstant.CI_PRODUCT_DEFINITION_APPROVAL]);
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
      this.compoundInterestProductDefinitionModel.status = selectedStatus.value;
      this.compoundInterestProductDefinitionModel.statusName = selectedStatus.label;
      this.isDisableSubmit = false;
    } else {
      this.compoundInterestProductDefinitionModel.status = null;
      this.compoundInterestProductDefinitionModel.statusName = null;
      this.isDisableSubmit = true; 
    }
  }
}
