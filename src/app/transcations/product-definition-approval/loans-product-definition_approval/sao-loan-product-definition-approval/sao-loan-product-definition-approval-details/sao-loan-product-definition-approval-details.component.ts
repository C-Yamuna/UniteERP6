import { Component } from '@angular/core';
import { productDefinitionApprovalConstant } from '../../../product-definition-approval-constant';
import { applicationConstants } from 'src/app/shared/applicationConstants';
import { Responsemodel } from 'src/app/shared/responsemodel';
import { SaoProductDefinition } from 'src/app/transcations/loan-transcation/sao/sao-product-definition/shared/sao-product-definition.model';
import { SaoInterestPolicyConfig } from 'src/app/transcations/loan-transcation/sao/sao-product-definition/sao-product-definition-stepper/sao-interest-policy-conig/shared/sao-interest-policy-config.model';
import { CommonComponent } from 'src/app/shared/common.component';
import { FormBuilder } from '@angular/forms';
import { EncryptDecryptService } from 'src/app/shared/encrypt-decrypt.service';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonFunctionsService } from 'src/app/shared/commonfunction.service';
import { TranslateService } from '@ngx-translate/core';
import { SaoProductDefinitionsService } from 'src/app/transcations/loan-transcation/sao/sao-product-definition/shared/sao-product-definitions.service';
import { CommonStatusData } from 'src/app/transcations/common-status-data.json';
import { SaoRequiredDocuments } from 'src/app/transcations/loan-transcation/sao/sao-product-definition/sao-product-definition-stepper/sao-required-documents-config/shared/sao-required-documents.model';
import { SaoLoanLinkedShareCapital } from 'src/app/transcations/loan-transcation/sao/sao-product-definition/sao-product-definition-stepper/sao-loan-linked-share-capital/shared/sao-loan-linked-share-capital.model';
import { CommonCategoryService } from 'src/app/configurations/loan-config/common-category/shared/common-category.service';

@Component({
  selector: 'app-sao-loan-product-definition-approval-details',
  templateUrl: './sao-loan-product-definition-approval-details.component.html',
  styleUrls: ['./sao-loan-product-definition-approval-details.component.css']
})
export class SaoLoanProductDefinitionApprovalDetailsComponent {
  saoProductDefinitionModel: SaoProductDefinition = new SaoProductDefinition();
  saoInterestPolicyConfigModel: SaoInterestPolicyConfig = new SaoInterestPolicyConfig();
  saoLoanLinkedShareCapitalModel: SaoLoanLinkedShareCapital = new SaoLoanLinkedShareCapital();
  saoRequiredDocumentsModel: SaoRequiredDocuments = new SaoRequiredDocuments();
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
  saoProductId: any;
  
  isDisableSubmit: boolean = false;
  constructor(private commonComponent: CommonComponent, private formBuilder: FormBuilder,
    private activateRoute: ActivatedRoute, private encryptService: EncryptDecryptService, private datePipe: DatePipe,
    private router: Router, private commonFunctionsService: CommonFunctionsService, private translate: TranslateService,
    private saoProductDefinitionsService: SaoProductDefinitionsService,
    private commonStatusService:CommonCategoryService) {

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
          this.saoProductId = this.encryptService.decrypt(params['id']);
          
          this.isEdit = applicationConstants.TRUE;
          this.saoProductDefinitionsService.getPreviewDetailsByProductId(this.saoProductId).subscribe(res => {
            this.responseModel = res;
            if (this.responseModel != null && this.responseModel != undefined) {
              this.saoProductDefinitionModel = this.responseModel.data[0];
              if (null != this.saoProductDefinitionModel.effectiveStartDate && undefined != this.saoProductDefinitionModel.effectiveStartDate)
                this.saoProductDefinitionModel.effectiveStartDate = this.datePipe.transform(this.saoProductDefinitionModel.effectiveStartDate, this.orgnizationSetting.datePipe);
            
              if (this.saoProductDefinitionModel.saoProdCollateralsConfigList) {
                this.collateralList = this.saoProductDefinitionModel.saoProdCollateralsConfigList
                  .filter((item: any) => item != null && item.status === applicationConstants.ACTIVE) 
                  .map((item: { collateralTypeName: string, collateralType: any }) => ({
                    label: item.collateralTypeName,
                    value: item.collateralType
                  }));
              }
            
            
              if (this.saoProductDefinitionModel.saoInterestPolicyConfigDtoList != null && this.saoProductDefinitionModel.saoInterestPolicyConfigDtoList != undefined && this.saoProductDefinitionModel.saoInterestPolicyConfigDtoList.length > 0) {
                this.interestPolicyList = this.saoProductDefinitionModel.saoInterestPolicyConfigDtoList;
                this.interestPolicyList = this.interestPolicyList.filter((data: any) => data != null && data.effectiveStartDate != null).map((object: any) => {
                  object.effectiveStartDate = this.datePipe.transform(object.effectiveStartDate, this.orgnizationSetting.datePipe);
                  return object;
                });
              }
              if (this.saoProductDefinitionModel.saoApportionConfigDTOList != null && this.saoProductDefinitionModel.saoApportionConfigDTOList != undefined && this.saoProductDefinitionModel.saoApportionConfigDTOList.length > 0) {
                this.collectionOrderList = this.saoProductDefinitionModel.saoApportionConfigDTOList;
                this.collectionOrderList = this.collectionOrderList.filter((data: any) => data != null && data.effectiveStartDate != null).map((object: any) => {
                  object.effectiveStartDate = this.datePipe.transform(object.effectiveStartDate, this.orgnizationSetting.datePipe);
                  return object;
                });
              }
              if (this.saoProductDefinitionModel.saoLoanLinkedSharecapitalConfigList != null && this.saoProductDefinitionModel.saoLoanLinkedSharecapitalConfigList != undefined && this.saoProductDefinitionModel.saoLoanLinkedSharecapitalConfigList.length > 0) {
                this.linkedShareCapitalList = this.saoProductDefinitionModel.saoLoanLinkedSharecapitalConfigList;
                this.linkedShareCapitalList = this.linkedShareCapitalList.filter((data: any) => data != null && data.effectiveStartDate != null).map((object: any) => {
                  object.effectiveStartDate = this.datePipe.transform(object.effectiveStartDate, this.orgnizationSetting.datePipe);
                  return object;
                });
              }

              if (this.saoProductDefinitionModel.saoProductChargesConfigDTOList != null && this.saoProductDefinitionModel.saoProductChargesConfigDTOList != undefined && this.saoProductDefinitionModel.saoProductChargesConfigDTOList.length > 0) {
                this.chargesList = this.saoProductDefinitionModel.saoProductChargesConfigDTOList;
                this.chargesList = this.chargesList.filter((data: any) => data != null && data.effectiveStartDate != null).map((object: any) => {
                  object.effectiveStartDate = this.datePipe.transform(object.effectiveStartDate, this.orgnizationSetting.datePipe);
                  return object;
                });
              }
              if (this.saoProductDefinitionModel.saoProdPurPoseConfgList != null && this.saoProductDefinitionModel.saoProdPurPoseConfgList != undefined && this.saoProductDefinitionModel.saoProdPurPoseConfgList.length > 0) {
                this.purposeList = this.saoProductDefinitionModel.saoProdPurPoseConfgList;
                this.purposeList = this.purposeList.filter((data: any) => data != null && data.effectiveStartDate != null).map((object: any) => {
                  object.effectiveStartDate = this.datePipe.transform(object.effectiveStartDate, this.orgnizationSetting.datePipe);
                  return object;
                });
              }

              if (this.saoProductDefinitionModel.saoRequiredDocumentsConfigDTOList != null && this.saoProductDefinitionModel.saoRequiredDocumentsConfigDTOList != undefined && this.saoProductDefinitionModel.saoRequiredDocumentsConfigDTOList.length > 0) {
                this.requiredDocumentsList = this.saoProductDefinitionModel.saoRequiredDocumentsConfigDTOList;
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
  update(){
    if(this.saoProductDefinitionModel.effectiveStartDate != undefined && this.saoProductDefinitionModel.effectiveStartDate != null)
      this.saoProductDefinitionModel.effectiveStartDate = this.commonFunctionsService.getUTCEpoch(new Date(this.saoProductDefinitionModel.effectiveStartDate));
   
    if(this.saoProductDefinitionModel.endDate != undefined && this.saoProductDefinitionModel.endDate != null)
      this.saoProductDefinitionModel.endDate = this.commonFunctionsService.getUTCEpoch(new Date(this.saoProductDefinitionModel.endDate));
  
  
  
    if (this.saoProductDefinitionModel.saoInterestPolicyConfigDtoList != null && this.saoProductDefinitionModel.saoInterestPolicyConfigDtoList != undefined && this.saoProductDefinitionModel.saoInterestPolicyConfigDtoList.length > 0) {
      this.saoProductDefinitionModel.saoInterestPolicyConfigDtoList = this.saoProductDefinitionModel.saoInterestPolicyConfigDtoList.filter((data:any) => data !=null &&data.effectiveStartDate !=null).map((object:any) => {
        object.effectiveStartDate = this.commonFunctionsService.getUTCEpoch(new Date(object.effectiveStartDate));
        return object;
      });
    }
    if (this.saoProductDefinitionModel.saoApportionConfigDTOList != null && this.saoProductDefinitionModel.saoApportionConfigDTOList != undefined && this.saoProductDefinitionModel.saoApportionConfigDTOList.length > 0) {
      this.saoProductDefinitionModel.saoApportionConfigDTOList = this.saoProductDefinitionModel.saoApportionConfigDTOList.filter((data:any) => data !=null &&data.effectiveStartDate !=null).map((object:any) => {
        object.effectiveStartDate = this.commonFunctionsService.getUTCEpoch(new Date(object.effectiveStartDate));
        return object;
      });
    }


    if (this.saoProductDefinitionModel.saoProductChargesConfigDTOList != null && this.saoProductDefinitionModel.saoProductChargesConfigDTOList != undefined && this.saoProductDefinitionModel.saoProductChargesConfigDTOList.length > 0) {
      this.saoProductDefinitionModel.saoProductChargesConfigDTOList = this.saoProductDefinitionModel.saoProductChargesConfigDTOList.filter((data:any) => data !=null &&data.effectiveStartDate !=null).map((object:any) => {
        object.effectiveStartDate = this.commonFunctionsService.getUTCEpoch(new Date(object.effectiveStartDate));
        return object;
      });
    }


    if (this.saoProductDefinitionModel.saoProdPurPoseConfgList != null && this.saoProductDefinitionModel.saoProdPurPoseConfgList != undefined && this.saoProductDefinitionModel.saoProdPurPoseConfgList.length > 0) {
      this.saoProductDefinitionModel.saoProdPurPoseConfgList = this.saoProductDefinitionModel.saoProdPurPoseConfgList.filter((data:any) => data !=null &&data.effectiveStartDate !=null).map((object:any) => {
        object.effectiveStartDate = this.commonFunctionsService.getUTCEpoch(new Date(object.effectiveStartDate));
        return object;
      });
    }
    if (this.saoProductDefinitionModel.saoLoanLinkedSharecapitalConfigList != null && this.saoProductDefinitionModel.saoLoanLinkedSharecapitalConfigList != undefined && this.saoProductDefinitionModel.saoLoanLinkedSharecapitalConfigList.length > 0) {
      this.saoProductDefinitionModel.saoLoanLinkedSharecapitalConfigList = this.saoProductDefinitionModel.saoLoanLinkedSharecapitalConfigList.filter((data:any) => data !=null &&data.effectiveStartDate !=null).map((object:any) => {
        object.effectiveStartDate = this.commonFunctionsService.getUTCEpoch(new Date(object.effectiveStartDate));
        return object;
      });
    }



    if (this.saoProductDefinitionModel.saoRequiredDocumentsConfigDTOList != null && this.saoProductDefinitionModel.saoRequiredDocumentsConfigDTOList != undefined && this.saoProductDefinitionModel.saoRequiredDocumentsConfigDTOList.length > 0) {
      this.saoProductDefinitionModel.saoRequiredDocumentsConfigDTOList = this.saoProductDefinitionModel.saoRequiredDocumentsConfigDTOList.filter((data:any) => data !=null &&data.effectiveStartDate !=null).map((object:any) => {
        object.effectiveStartDate = this.commonFunctionsService.getUTCEpoch(new Date(object.effectiveStartDate));
        return object;
      });
    }
    // this.saoProductDefinitionModel.statusName = CommonStatusData.SUBMISSION_FOR_APPROVAL;
    this.saoProductDefinitionsService.updateSaoProductDefinitions(this.saoProductDefinitionModel).subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel.status === applicationConstants.STATUS_SUCCESS && this.responseModel.data[0] !=null) {
        if (this.responseModel != null&& this.responseModel.data!= undefined) {
          if(null != this.saoProductDefinitionModel.effectiveStartDate && undefined != this.saoProductDefinitionModel.effectiveStartDate)
            this.saoProductDefinitionModel.effectiveStartDate=this.datePipe.transform(this.saoProductDefinitionModel.effectiveStartDate, this.orgnizationSetting.datePipe);
    
          if(null != this.saoProductDefinitionModel.endDate && undefined != this.saoProductDefinitionModel.endDate)
            this.saoProductDefinitionModel.endDate=this.datePipe.transform(this.saoProductDefinitionModel.endDate, this.orgnizationSetting.datePipe);
  
          if(null != this.saoRequiredDocumentsModel.effectiveStartDate)
            this.saoRequiredDocumentsModel.effectiveStartDate=this.datePipe.transform(this.saoRequiredDocumentsModel.effectiveStartDate, this.orgnizationSetting.datePipe);
  
  
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
    this.msgs = [{ severity: "success", detail:  applicationConstants.SAO_LOAN_PRODUCT_DEFINITION }];
    setTimeout(() => {
      this.router.navigate([productDefinitionApprovalConstant.SAO_PRODUCT_DEFINITION_APPROVAL]);
    }, 1500);
  }
  navigateToBack() {
      this.router.navigate([productDefinitionApprovalConstant.SAO_PRODUCT_DEFINITION_APPROVAL]);
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
      this.saoProductDefinitionModel.status = selectedStatus.value;
      this.saoProductDefinitionModel.statusName = selectedStatus.label;
      this.isDisableSubmit = false;
    } else {
      this.saoProductDefinitionModel.status = null;
      this.saoProductDefinitionModel.statusName = null;
      this.isDisableSubmit = true; 
    }
  }
}
