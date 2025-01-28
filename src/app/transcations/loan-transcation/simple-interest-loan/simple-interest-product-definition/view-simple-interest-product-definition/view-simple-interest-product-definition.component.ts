import { Component } from '@angular/core';
import { SimpleInterestProductDefinition } from '../shared/simple-interest-product-definition.model';
import { SiInterestPolicy } from '../simple-interest-product-definition-stepper/si-interest-policy/shared/si-interest-policy.model';
import { SiLinkedShareCapital } from '../simple-interest-product-definition-stepper/si-linked-share-capital/shared/si-linked-share-capital.model';
import { SiCharges } from '../simple-interest-product-definition-stepper/si-charges/shared/si-charges.model';
import { SiPurpose } from '../simple-interest-product-definition-stepper/si-purpose/shared/si-purpose.model';
import { SiRequiredDocuments } from '../simple-interest-product-definition-stepper/si-required-documents/shared/si-required-documents.model';
import { Responsemodel } from 'src/app/shared/responsemodel';
import { applicationConstants } from 'src/app/shared/applicationConstants';
import { SimpleInterestProductDefinitionService } from '../shared/simple-interest-product-definition.service';
import { CommonComponent } from 'src/app/shared/common.component';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { EncryptDecryptService } from 'src/app/shared/encrypt-decrypt.service';
import { CommonFunctionsService } from 'src/app/shared/commonfunction.service';
import { DatePipe } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { Loantransactionconstant } from '../../../loan-transaction-constant';
import { CommonStatusData } from 'src/app/transcations/common-status-data.json';
import { FileUploadModel } from 'src/app/layout/mainmenu/shared/file-upload-model.model';

@Component({
  selector: 'app-view-simple-interest-product-definition',
  templateUrl: './view-simple-interest-product-definition.component.html',
  styleUrls: ['./view-simple-interest-product-definition.component.css']
})
export class ViewSimpleInterestProductDefinitionComponent {
  simpleInterestProductDefinitionModel :SimpleInterestProductDefinition = new SimpleInterestProductDefinition();
  siInterestPolicyModel :SiInterestPolicy = new SiInterestPolicy();
  siLoanLinkedShareCapitalModel :SiLinkedShareCapital = new SiLinkedShareCapital();
  siChargesModel :SiCharges = new SiCharges();
  siPurposeModel :SiPurpose = new SiPurpose();
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
  editbtn: Boolean = applicationConstants.TRUE;
  isShowSubmit: boolean =applicationConstants.FALSE;
  isFileUploaded: boolean = false;
  multipleFilesList: any[] = [];
  uploadFileData: any;

  constructor(private commonComponent: CommonComponent, private formBuilder: FormBuilder,
    private activateRoute: ActivatedRoute, private encryptService: EncryptDecryptService, private datePipe: DatePipe,
    private router: Router, private commonFunctionsService: CommonFunctionsService, private translate: TranslateService,
    private simpleInterestProductDefinitionService : SimpleInterestProductDefinitionService,) {

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
          if (params['editbtn'] != undefined && params['editbtn'] != null) {
            let isEditParam = this.encryptService.decrypt(params['editbtn']);
            if (isEditParam == "1") {
              this.editbtn = applicationConstants.TRUE;
            } else {
              this.editbtn = applicationConstants.FALSE;
            }
          }
          if (params['isGridPage'] != undefined && params['isGridPage'] != null) {
            let isGrid = this.encryptService.decrypt(params['isGridPage']);
            if (isGrid === "0") {
              this.isShowSubmit = applicationConstants.FALSE;
            } else {
              this.isShowSubmit = applicationConstants.TRUE;
            }
          }
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
  }
  navigateToBack() {
      this.router.navigate([Loantransactionconstant.SIMPLE_INTEREST_PRODUCT_DEFINITION]);
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
    this.simpleInterestProductDefinitionModel.statusName = CommonStatusData.SUBMISSION_FOR_APPROVAL;
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
      this.router.navigate([Loantransactionconstant.SIMPLE_INTEREST_PRODUCT_DEFINITION]);
    }, 1500);
  }
  editSiLoansproductDefinationdetails(rowData: any, activeIndex: any) {
    switch (activeIndex) {
      case 0:
        this.router.navigate([Loantransactionconstant.SIMPLE_INTEREST_PRODUCT_CONFIGURATION], { queryParams: { id: this.encryptService.encrypt(rowData.siProductId) } });
        break;
      case 1:
        this.router.navigate([Loantransactionconstant.SIMPLE_INTEREST_INTEREST_POLICY_CONFIG], { queryParams: { id: this.encryptService.encrypt(rowData.siProductId) } });
        break;
      case 2:
        this.router.navigate([Loantransactionconstant.SIMPLE_INTEREST_LOAN_LINKED_SHARE_CAPITAL], { queryParams: { id: this.encryptService.encrypt(rowData.siProductId) } });
        break;
      case 3:
        this.router.navigate([Loantransactionconstant.SIMPLE_INTEREST_PRODUCT_CHARGES_CONFIG], { queryParams: { id: this.encryptService.encrypt(rowData.siProductId) } });
        break;
      case 4:
        this.router.navigate([Loantransactionconstant.SIMPLE_INTEREST_PROD_PURPOSE_CONFIG], { queryParams: { id: this.encryptService.encrypt(rowData.siProductId) } });
        break;
      case 5:
        this.router.navigate([Loantransactionconstant.SIMPLE_INTEREST_REQUIRED_DOCUMENT_CONFIG], { queryParams: { id: this.encryptService.encrypt(rowData.siProductId) } });
        break;
    }
  }
  pdfDownload() {
    this.commonComponent.startSpinner();
    this.simpleInterestProductDefinitionService.downloadSIPreviewPDf(this.siProductId).subscribe((data: any) => {
      var file = new Blob([data], { type: 'application/pdf' });
      saveAs(file, "SI_Product_Definition_Filled_Document.pdf");
      this.msgs = [];
      this.msgs.push({ severity: "success", detail: 'SI Product Definition File Downloaded Successfully' });
      this.commonComponent.stopSpinner();
    }, error => {
      this.msgs = [];
      this.commonComponent.stopSpinner();
      this.msgs.push({ severity: "error", detail: 'Unable to download filled product details' });
    })
     
  }

  pdfUploader(event:any,fileUpload:any){
    this.isFileUploaded = applicationConstants.TRUE;
    this.multipleFilesList = [];
    this.simpleInterestProductDefinitionModel.filesDTOList = [];
    this.simpleInterestProductDefinitionModel.multipartFileList = [];
    // this.simpleInterestProductDefinitionModel.applicationSignedForm = null;
    let files: FileUploadModel = new FileUploadModel();
    for (let file of event.files) {
      let reader = new FileReader();
      reader.onloadend = (e) => {
        let files = new FileUploadModel();
        this.uploadFileData = e.currentTarget;
        files.fileName = file.name;
        files.fileType = file.type.split('/')[1];
        files.value = this.uploadFileData.result.split(',')[1];
        files.imageValue = this.uploadFileData.result;

        let index = this.multipleFilesList.findIndex(x => x.fileName == files.fileName);
        if (index === -1) {
          this.multipleFilesList.push(files);
          this.simpleInterestProductDefinitionModel.filesDTOList.push(files); 
        }
        let timeStamp = this.commonComponent.getTimeStamp();
        this.simpleInterestProductDefinitionModel.filesDTOList[0].fileName = "SI_Product_definition_signed_copy" + this.siProductId + "_" +timeStamp+ "_"+ file.name ;
        // this.simpleInterestProductDefinitionModel.applicationSignedForm = "Sb_Application_signed_copy" + this.siProductId + "_" +timeStamp+"_"+ file.name; // This will set the last file's name as docPath
        let index1 = event.files.findIndex((x: any) => x === file);
        fileUpload.remove(event, index1);
        fileUpload.clear();
      }
      reader.readAsDataURL(file);
    }
  }

}
