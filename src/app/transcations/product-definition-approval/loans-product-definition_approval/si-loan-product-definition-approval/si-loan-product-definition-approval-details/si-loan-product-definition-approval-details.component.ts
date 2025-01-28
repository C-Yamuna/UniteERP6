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
import { CommonStatusData } from 'src/app/transcations/common-status-data.json';
import { SimpleInterestProductDefinition } from 'src/app/transcations/loan-transcation/simple-interest-loan/simple-interest-product-definition/shared/simple-interest-product-definition.model';
import { SimpleInterestProductDefinitionService } from 'src/app/transcations/loan-transcation/simple-interest-loan/simple-interest-product-definition/shared/simple-interest-product-definition.service';
import { SiInterestPolicy } from 'src/app/transcations/loan-transcation/simple-interest-loan/simple-interest-product-definition/simple-interest-product-definition-stepper/si-interest-policy/shared/si-interest-policy.model';
import { productDefinitionApprovalConstant } from '../../../product-definition-approval-constant';
import { SiRequiredDocuments } from 'src/app/transcations/loan-transcation/simple-interest-loan/simple-interest-product-definition/simple-interest-product-definition-stepper/si-required-documents/shared/si-required-documents.model';
import { CommonCategoryService } from 'src/app/configurations/loan-config/common-category/shared/common-category.service';

@Component({
  selector: 'app-si-loan-product-definition-approval-details',
  templateUrl: './si-loan-product-definition-approval-details.component.html',
  styleUrls: ['./si-loan-product-definition-approval-details.component.css']
})
export class SiLoanProductDefinitionApprovalDetailsComponent {
  simpleInterestProductDefinitionModel :SimpleInterestProductDefinition = new SimpleInterestProductDefinition();
  siInterestPolicyModel :SiInterestPolicy = new SiInterestPolicy();
  siRequiredDocumentsModel : SiRequiredDocuments = new SiRequiredDocuments();
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
  siProductId: any;
  isDisableSubmit: boolean = false;
  constructor(private commonComponent: CommonComponent, private formBuilder: FormBuilder,
    private activateRoute: ActivatedRoute, private encryptService: EncryptDecryptService, private datePipe: DatePipe,
    private router: Router, private commonFunctionsService: CommonFunctionsService, private translate: TranslateService,
    private simpleInterestProductDefinitionService : SimpleInterestProductDefinitionService,
    private commonStatusService: CommonCategoryService ) {

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
          this.siProductId = this.encryptService.decrypt(params['id']);
          
          this.isEdit = applicationConstants.TRUE;
          this.simpleInterestProductDefinitionService.getPreviewDetailsByProductId(this.siProductId).subscribe(res => {
            this.responseModel = res;
            if (this.responseModel != null && this.responseModel != undefined) {
              this.simpleInterestProductDefinitionModel = this.responseModel.data[0];
              if (null != this.simpleInterestProductDefinitionModel.effectiveStartDate && undefined != this.simpleInterestProductDefinitionModel.effectiveStartDate)
                this.simpleInterestProductDefinitionModel.effectiveStartDate = this.datePipe.transform(this.simpleInterestProductDefinitionModel.effectiveStartDate, this.orgnizationSetting.datePipe);
            
              if (this.simpleInterestProductDefinitionModel.siProdCollateralsConfigDTOList) {
                this.collateralList = this.simpleInterestProductDefinitionModel.siProdCollateralsConfigDTOList
                  .filter((item: any) => item != null && item.status === applicationConstants.ACTIVE) 
                  .map((item: { collateralTypeName: string, collateralType: any }) => ({
                    label: item.collateralTypeName,
                    value: item.collateralType
                  }));
              }
            
            
              if (this.simpleInterestProductDefinitionModel.siInterestPolicyConfigDTOList != null && this.simpleInterestProductDefinitionModel.siInterestPolicyConfigDTOList != undefined && this.simpleInterestProductDefinitionModel.siInterestPolicyConfigDTOList.length > 0) {
                this.interestPolicyList = this.simpleInterestProductDefinitionModel.siInterestPolicyConfigDTOList;
                this.interestPolicyList = this.interestPolicyList.filter((data: any) => data != null && data.effectiveStartDate != null).map((object: any) => {
                  object.effectiveStartDate = this.datePipe.transform(object.effectiveStartDate, this.orgnizationSetting.datePipe);
                  return object;
                });
              }
              if (this.simpleInterestProductDefinitionModel.siApportionConfigDTOList != null && this.simpleInterestProductDefinitionModel.siApportionConfigDTOList != undefined && this.simpleInterestProductDefinitionModel.siApportionConfigDTOList.length > 0) {
                this.collectionOrderList = this.simpleInterestProductDefinitionModel.siApportionConfigDTOList;
                this.collectionOrderList = this.collectionOrderList.filter((data: any) => data != null && data.effectiveStartDate != null).map((object: any) => {
                  object.effectiveStartDate = this.datePipe.transform(object.effectiveStartDate, this.orgnizationSetting.datePipe);
                  return object;
                });
              }
              if (this.simpleInterestProductDefinitionModel.siLoanLinkedShareCapitalConfigDTOList != null && this.simpleInterestProductDefinitionModel.siLoanLinkedShareCapitalConfigDTOList != undefined && this.simpleInterestProductDefinitionModel.siLoanLinkedShareCapitalConfigDTOList.length > 0) {
                this.linkedShareCapitalList = this.simpleInterestProductDefinitionModel.siLoanLinkedShareCapitalConfigDTOList;
                this.linkedShareCapitalList = this.linkedShareCapitalList.filter((data: any) => data != null && data.effectiveStartDate != null).map((object: any) => {
                  object.effectiveStartDate = this.datePipe.transform(object.effectiveStartDate, this.orgnizationSetting.datePipe);
                  return object;
                });
              }

              if (this.simpleInterestProductDefinitionModel.siProductChargesConfigDTOList != null && this.simpleInterestProductDefinitionModel.siProductChargesConfigDTOList != undefined && this.simpleInterestProductDefinitionModel.siProductChargesConfigDTOList.length > 0) {
                this.chargesList = this.simpleInterestProductDefinitionModel.siProductChargesConfigDTOList;
                this.chargesList = this.chargesList.filter((data: any) => data != null && data.effectiveStartDate != null).map((object: any) => {
                  object.effectiveStartDate = this.datePipe.transform(object.effectiveStartDate, this.orgnizationSetting.datePipe);
                  return object;
                });
              }
              if (this.simpleInterestProductDefinitionModel.siProdPurposeConfigDTOList != null && this.simpleInterestProductDefinitionModel.siProdPurposeConfigDTOList != undefined && this.simpleInterestProductDefinitionModel.siProdPurposeConfigDTOList.length > 0) {
                this.purposeList = this.simpleInterestProductDefinitionModel.siProdPurposeConfigDTOList;
                this.purposeList = this.purposeList.filter((data: any) => data != null && data.effectiveStartDate != null).map((object: any) => {
                  object.effectiveStartDate = this.datePipe.transform(object.effectiveStartDate, this.orgnizationSetting.datePipe);
                  return object;
                });
              }

              if (this.simpleInterestProductDefinitionModel.siRequiredDocumentsConfigDTOList != null && this.simpleInterestProductDefinitionModel.siRequiredDocumentsConfigDTOList != undefined && this.simpleInterestProductDefinitionModel.siRequiredDocumentsConfigDTOList.length > 0) {
                this.requiredDocumentsList = this.simpleInterestProductDefinitionModel.siRequiredDocumentsConfigDTOList;
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
      this.router.navigate([productDefinitionApprovalConstant.SI_PRODUCT_DEFINITION_APPROVAL]);
  }
  update(){
    if(this.simpleInterestProductDefinitionModel.effectiveStartDate != undefined && this.simpleInterestProductDefinitionModel.effectiveStartDate != null)
      this.simpleInterestProductDefinitionModel.effectiveStartDate = this.commonFunctionsService.getUTCEpoch(new Date(this.simpleInterestProductDefinitionModel.effectiveStartDate));
   
    if(this.simpleInterestProductDefinitionModel.endDate != undefined && this.simpleInterestProductDefinitionModel.endDate != null)
      this.simpleInterestProductDefinitionModel.endDate = this.commonFunctionsService.getUTCEpoch(new Date(this.simpleInterestProductDefinitionModel.endDate));
  
  
  
    if (this.simpleInterestProductDefinitionModel.siInterestPolicyConfigDTOList != null && this.simpleInterestProductDefinitionModel.siInterestPolicyConfigDTOList != undefined && this.simpleInterestProductDefinitionModel.siInterestPolicyConfigDTOList.length > 0) {
      this.simpleInterestProductDefinitionModel.siInterestPolicyConfigDTOList = this.simpleInterestProductDefinitionModel.siInterestPolicyConfigDTOList.filter((data:any) => data !=null &&data.effectiveStartDate !=null).map((object:any) => {
        object.effectiveStartDate = this.commonFunctionsService.getUTCEpoch(new Date(object.effectiveStartDate));
        return object;
      });
    }
    if (this.simpleInterestProductDefinitionModel.siApportionConfigDTOList != null && this.simpleInterestProductDefinitionModel.siApportionConfigDTOList != undefined && this.simpleInterestProductDefinitionModel.siApportionConfigDTOList.length > 0) {
      this.simpleInterestProductDefinitionModel.siApportionConfigDTOList = this.simpleInterestProductDefinitionModel.siApportionConfigDTOList.filter((data:any) => data !=null &&data.effectiveStartDate !=null).map((object:any) => {
        object.effectiveStartDate = this.commonFunctionsService.getUTCEpoch(new Date(object.effectiveStartDate));
        return object;
      });
    }


    if (this.simpleInterestProductDefinitionModel.siProductChargesConfigDTOList != null && this.simpleInterestProductDefinitionModel.siProductChargesConfigDTOList != undefined && this.simpleInterestProductDefinitionModel.siProductChargesConfigDTOList.length > 0) {
      this.simpleInterestProductDefinitionModel.siProductChargesConfigDTOList = this.simpleInterestProductDefinitionModel.siProductChargesConfigDTOList.filter((data:any) => data !=null &&data.effectiveStartDate !=null).map((object:any) => {
        object.effectiveStartDate = this.commonFunctionsService.getUTCEpoch(new Date(object.effectiveStartDate));
        return object;
      });
    }


    if (this.simpleInterestProductDefinitionModel.siProdPurposeConfigDTOList != null && this.simpleInterestProductDefinitionModel.siProdPurposeConfigDTOList != undefined && this.simpleInterestProductDefinitionModel.siProdPurposeConfigDTOList.length > 0) {
      this.simpleInterestProductDefinitionModel.siProdPurposeConfigDTOList = this.simpleInterestProductDefinitionModel.siProdPurposeConfigDTOList.filter((data:any) => data !=null &&data.effectiveStartDate !=null).map((object:any) => {
        object.effectiveStartDate = this.commonFunctionsService.getUTCEpoch(new Date(object.effectiveStartDate));
        return object;
      });
    }
    if (this.simpleInterestProductDefinitionModel.siLoanLinkedShareCapitalConfigDTOList != null && this.simpleInterestProductDefinitionModel.siLoanLinkedShareCapitalConfigDTOList != undefined && this.simpleInterestProductDefinitionModel.siLoanLinkedShareCapitalConfigDTOList.length > 0) {
      this.simpleInterestProductDefinitionModel.siLoanLinkedShareCapitalConfigDTOList = this.simpleInterestProductDefinitionModel.siLoanLinkedShareCapitalConfigDTOList.filter((data:any) => data !=null &&data.effectiveStartDate !=null).map((object:any) => {
        object.effectiveStartDate = this.commonFunctionsService.getUTCEpoch(new Date(object.effectiveStartDate));
        return object;
      });
    }



    if (this.simpleInterestProductDefinitionModel.siRequiredDocumentsConfigDTOList != null && this.simpleInterestProductDefinitionModel.siRequiredDocumentsConfigDTOList != undefined && this.simpleInterestProductDefinitionModel.siRequiredDocumentsConfigDTOList.length > 0) {
      this.simpleInterestProductDefinitionModel.siRequiredDocumentsConfigDTOList = this.simpleInterestProductDefinitionModel.siRequiredDocumentsConfigDTOList.filter((data:any) => data !=null &&data.effectiveStartDate !=null).map((object:any) => {
        object.effectiveStartDate = this.commonFunctionsService.getUTCEpoch(new Date(object.effectiveStartDate));
        return object;
      });
    }
    // this.simpleInterestProductDefinitionModel.statusName = CommonStatusData.SUBMISSION_FOR_APPROVAL;
    this.simpleInterestProductDefinitionService.updateSimpleInterestProductDefinition(this.simpleInterestProductDefinitionModel).subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel.status === applicationConstants.STATUS_SUCCESS && this.responseModel.data[0] !=null) {
        if (this.responseModel != null&& this.responseModel.data!= undefined) {
          if(null != this.simpleInterestProductDefinitionModel.effectiveStartDate && undefined != this.simpleInterestProductDefinitionModel.effectiveStartDate)
            this.simpleInterestProductDefinitionModel.effectiveStartDate=this.datePipe.transform(this.simpleInterestProductDefinitionModel.effectiveStartDate, this.orgnizationSetting.datePipe);
    
          if(null != this.simpleInterestProductDefinitionModel.endDate && undefined != this.simpleInterestProductDefinitionModel.endDate)
            this.simpleInterestProductDefinitionModel.endDate=this.datePipe.transform(this.simpleInterestProductDefinitionModel.endDate, this.orgnizationSetting.datePipe);
  
          if(null != this.siRequiredDocumentsModel.effectiveStartDate)
            this.siRequiredDocumentsModel.effectiveStartDate=this.datePipe.transform(this.siRequiredDocumentsModel.effectiveStartDate, this.orgnizationSetting.datePipe);
  
  
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
    this.msgs = [{ severity: "success", detail:  applicationConstants.SI_LOAN_PRODUCT_DEFINITION }];
    setTimeout(() => {
      this.router.navigate([productDefinitionApprovalConstant.SI_PRODUCT_DEFINITION_APPROVAL]);
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
      this.simpleInterestProductDefinitionModel.status = selectedStatus.value;
      this.simpleInterestProductDefinitionModel.statusName = selectedStatus.label;
      this.isDisableSubmit = false;
    } else {
      this.simpleInterestProductDefinitionModel.status = null;
      this.simpleInterestProductDefinitionModel.statusName = null;
      this.isDisableSubmit = true; 
    }
  }
}
