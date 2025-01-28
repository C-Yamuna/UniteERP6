import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { FileUpload } from 'primeng/fileupload';
import { FileUploadModel } from 'src/app/layout/mainmenu/shared/file-upload-model.model';
import { applicationConstants } from 'src/app/shared/applicationConstants';
import { CommonComponent } from 'src/app/shared/common.component';
import { CommonFunctionsService } from 'src/app/shared/commonfunction.service';
import { EncryptDecryptService } from 'src/app/shared/encrypt-decrypt.service';
import { FileUploadService } from 'src/app/shared/file-upload.service';
import { Responsemodel } from 'src/app/shared/responsemodel';
import { CommonStatusData } from 'src/app/transcations/common-status-data.json';
import { ERP_TRANSACTION_CONSTANTS } from 'src/app/transcations/erp-transaction-constants';
import { GeneralConfig } from 'src/app/transcations/savings-bank-transcation/savings-bank-product-definition/add-sb-product-definition/general-config/shared/general-config.model';
import { GeneralConfigService } from 'src/app/transcations/savings-bank-transcation/savings-bank-product-definition/add-sb-product-definition/general-config/shared/general-config.service';
import { InterestPolicy } from 'src/app/transcations/savings-bank-transcation/savings-bank-product-definition/add-sb-product-definition/interest-policy/shared/interest-policy.model';
import { RequiredDocuments } from 'src/app/transcations/savings-bank-transcation/savings-bank-product-definition/add-sb-product-definition/required-documents/shared/required-documents.model';
import { ServiceCharges } from 'src/app/transcations/savings-bank-transcation/savings-bank-product-definition/add-sb-product-definition/service-charges/shared/service-charges.model';
import { TransactionLimitConfig } from 'src/app/transcations/savings-bank-transcation/savings-bank-product-definition/add-sb-product-definition/transaction-limit-config/shared/transaction-limit-config.model';
import { savingsbanktransactionconstant } from 'src/app/transcations/savings-bank-transcation/savingsbank-transaction-constant';
import { productDefinitionApprovalConstant } from '../../product-definition-approval-constant';
import { CommonCategoryService } from 'src/app/configurations/sb-config/common-category/shared/common-category.service';

@Component({
  selector: 'app-savings-bank-product-definition-approval',
  templateUrl: './savings-bank-product-definition-approval.component.html',
  styleUrls: ['./savings-bank-product-definition-approval.component.css']
})
export class SavingsBankProductDefinitionApprovalComponent {
  generalConfigModel: GeneralConfig = new GeneralConfig();
  interestPolicyModel: InterestPolicy = new InterestPolicy();
  transactionLimitConfigModel: TransactionLimitConfig = new TransactionLimitConfig();
  serviceChargesModel: ServiceCharges = new ServiceCharges();
  requiredDocumentsModel: RequiredDocuments = new RequiredDocuments();
  borrowingaccountmapping: any[] = [];
  borrowingdocument: any[] = [];
  statusList: any[] = [];

  responseModel!: Responsemodel;
  msgs: any[] = [];
  editbtn: boolean = true;
  isEdit: any;
  buttonDisabled?: any;
  orgnizationSetting: any;
  isDisableSubmit: boolean = false;
  viewButton: boolean = false;
  editFlag: boolean = false;
  roleName: any;
  isFileUploaded: any;
  multipleFilesList: any[] = [];
  uploadFileData: any;


  isShowSubmit: boolean = applicationConstants.FALSE;
  servicechargeslist: any[] = [];
  productId: any;
  requireddocumentlist: any[] = [];
  intpostingfrequencylist: any[] = [];
  constructor(private commonComponent: CommonComponent, private formBuilder: FormBuilder,
    private generalConfigService: GeneralConfigService, private translate: TranslateService,
    private commonStatusService: CommonCategoryService,
    private activateRoute: ActivatedRoute, private encryptService: EncryptDecryptService, private datePipe: DatePipe,
    private router: Router, private commonFunctionsService: CommonFunctionsService, private fileUploadService: FileUploadService) {

  }

  ngOnInit(): void {
    this.orgnizationSetting = this.commonComponent.orgnizationSettings();
    this.intpostingfrequencylist = this.commonComponent.rePaymentFrequency();
    this.commonFunctionsService.data.subscribe((res: any) => {
      if (res) {
        this.translate.use(res);
      } else {
        this.translate.use(this.commonFunctionsService.getStorageValue('language'));
      }
      this.activateRoute.queryParams.subscribe(params => {
        this.commonComponent.startSpinner();
        if (params['id'] != undefined && params['id'] != null) {
          this.productId = this.encryptService.decrypt(params['id']);
          if (params['editbtn'] != undefined && params['editbtn'] != null) {
            let isEditParam = this.encryptService.decrypt(params['editbtn']);
            if (isEditParam === "1") {
              this.editbtn = applicationConstants.TRUE;
            } else {
              this.editbtn = applicationConstants.FALSE;
            }
          }
          if (params['isGridPage'] != undefined && params['isGridPage'] != null) {
            let isGrid = this.encryptService.decrypt(params['isGridPage']);
            if (isGrid === "0") {
              this.isShowSubmit = applicationConstants.FALSE;
              this.viewButton = false;
              this.editFlag = true;
            } else {
              this.isShowSubmit = applicationConstants.TRUE;
            }
          }
          this.isEdit = applicationConstants.TRUE;
          this.generalConfigService.getGeneralConfigById(this.productId).subscribe(res => {
            this.responseModel = res;
            if (this.generalConfigModel.effectiveStartDate != undefined && this.generalConfigModel.effectiveStartDate != null)
              this.generalConfigModel.effectiveStartDate = this.commonFunctionsService.getUTCEpoch(new Date(this.generalConfigModel.effectiveStartDate));
            if (this.responseModel != null && this.responseModel != undefined) {
              this.generalConfigModel = this.responseModel.data[0];
              if (null != this.generalConfigModel.effectiveStartDate)
                this.generalConfigModel.effectiveStartDate = this.datePipe.transform(this.generalConfigModel.effectiveStartDate, this.orgnizationSetting.datePipe);

              if (null != this.generalConfigModel.effectiveEndDate)
                this.generalConfigModel.effectiveEndDate = this.datePipe.transform(this.generalConfigModel.effectiveEndDate, this.orgnizationSetting.datePipe);

              if (this.generalConfigModel.signedCopyPath != null && this.generalConfigModel.signedCopyPath != undefined) {
                this.generalConfigModel.multipartFileListsignedCopyPath = this.fileUploadService.getFile(this.generalConfigModel.signedCopyPath, ERP_TRANSACTION_CONSTANTS.TERMDEPOSITS + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.generalConfigModel.signedCopyPath);
                this.isDisableSubmit = false;
              }
              else {
                this.isDisableSubmit = true;
              }

              if (this.generalConfigModel.interestPolicyConfigDto != null && this.generalConfigModel.interestPolicyConfigDto != undefined)
                this.interestPolicyModel = this.generalConfigModel.interestPolicyConfigDto;

              if (null != this.interestPolicyModel.effectiveStartDate)
                this.interestPolicyModel.effectiveStartDate = this.datePipe.transform(this.interestPolicyModel.effectiveStartDate, this.orgnizationSetting.datePipe);

              if (null != this.interestPolicyModel.interestPostingDate)
                this.interestPolicyModel.interestPostingDate = this.datePipe.transform(this.interestPolicyModel.interestPostingDate, this.orgnizationSetting.datePipe);

              if (this.generalConfigModel.transactionLimitConfigDto != null && this.generalConfigModel.transactionLimitConfigDto != undefined) {
                this.transactionLimitConfigModel = this.generalConfigModel.transactionLimitConfigDto;
              }
              if (null != this.transactionLimitConfigModel.effectiveStartDate)
                this.transactionLimitConfigModel.effectiveStartDate = this.datePipe.transform(this.transactionLimitConfigModel.effectiveStartDate, this.orgnizationSetting.datePipe);

              if (this.generalConfigModel.accServiceConfigChargesList != null && this.generalConfigModel.accServiceConfigChargesList != undefined && this.generalConfigModel.accServiceConfigChargesList.length > 0) {
                this.servicechargeslist = this.generalConfigModel.accServiceConfigChargesList;
                this.servicechargeslist = this.servicechargeslist.filter((data: any) => data != null && data.effectiveStartDate != null).map((object: any) => {
                  object.effectiveStartDate = this.datePipe.transform(object.effectiveStartDate, this.orgnizationSetting.datePipe);
                  return object;
                });
              }

              if (this.generalConfigModel.requiredDocumentsConfigList != null && this.generalConfigModel.requiredDocumentsConfigList != undefined && this.generalConfigModel.requiredDocumentsConfigList.length > 0) {
                this.requireddocumentlist = this.generalConfigModel.requiredDocumentsConfigList;
                this.requireddocumentlist = this.requireddocumentlist.filter((data: any) => data != null && data.effectiveStartDate != null).map((object: any) => {
                  object.effectiveStartDate = this.datePipe.transform(object.effectiveStartDate, this.orgnizationSetting.datePipe);
                  return object;
                });
              }

            }
          });
        } else {
          this.isEdit = false;
        }
      })
    })
    this.getAllStatusList();
  }
  navigateToBack() {
    this.router.navigate([productDefinitionApprovalConstant.SAVINGS_BANK_PRODUCT_DEFINITION_APPROVAL_DETAILS]);
  }
  submit() {
    // Determine the status name before submission
    if (this.generalConfigModel.status != null && this.generalConfigModel.status != undefined) {
      const statusName = this.statusList.find((data: any) => data != null && data.value === this.generalConfigModel.statusName);
      if (statusName != null && statusName != undefined) {
        this.generalConfigModel.statusName = statusName.label;
      }
    } else {
      this.commonComponent.stopSpinner();
      this.msgs = [];
      this.msgs = [{ severity: 'error', detail: this.responseModel.statusMsg }];
      setTimeout(() => {
        this.msgs = [];
      }, 2000);
    }
    if (this.generalConfigModel.effectiveStartDate != undefined && this.generalConfigModel.effectiveStartDate != null)
      this.generalConfigModel.effectiveStartDate = this.commonFunctionsService.getUTCEpoch(new Date(this.generalConfigModel.effectiveStartDate));

    if (this.generalConfigModel.effectiveEndDate != undefined && this.generalConfigModel.effectiveEndDate != null)
      this.generalConfigModel.effectiveEndDate = this.commonFunctionsService.getUTCEpoch(new Date(this.generalConfigModel.effectiveEndDate));

    if (this.interestPolicyModel.interestPostingDate != undefined && this.interestPolicyModel.interestPostingDate != null)
      this.interestPolicyModel.interestPostingDate = this.commonFunctionsService.getUTCEpoch(new Date(this.interestPolicyModel.interestPostingDate));

    if (this.interestPolicyModel.effectiveStartDate != undefined && this.interestPolicyModel.effectiveStartDate != null)
      this.interestPolicyModel.effectiveStartDate = this.commonFunctionsService.getUTCEpoch(new Date(this.interestPolicyModel.effectiveStartDate));

    if (this.transactionLimitConfigModel.effectiveStartDate != undefined && this.transactionLimitConfigModel.effectiveStartDate != null)
      this.transactionLimitConfigModel.effectiveStartDate = this.commonFunctionsService.getUTCEpoch(new Date(this.transactionLimitConfigModel.effectiveStartDate));

    if (this.generalConfigModel.accServiceConfigChargesList != null && this.generalConfigModel.accServiceConfigChargesList != undefined && this.generalConfigModel.accServiceConfigChargesList.length > 0) {
      this.generalConfigModel.accServiceConfigChargesList = this.generalConfigModel.accServiceConfigChargesList.filter((data: any) => data != null && data.effectiveStartDate != null).map((object: any) => {
        object.effectiveStartDate = this.commonFunctionsService.getUTCEpoch(new Date(object.effectiveStartDate));
        return object;
      });
    }
    if (this.generalConfigModel.requiredDocumentsConfigList != null && this.generalConfigModel.requiredDocumentsConfigList != undefined && this.generalConfigModel.requiredDocumentsConfigList.length > 0) {
      this.generalConfigModel.requiredDocumentsConfigList = this.generalConfigModel.requiredDocumentsConfigList.filter((data: any) => data != null && data.effectiveStartDate != null).map((object: any) => {
        object.effectiveStartDate = this.commonFunctionsService.getUTCEpoch(new Date(object.effectiveStartDate));
        return object;
      });
    }
    this.generalConfigService.updateGeneralConfig(this.generalConfigModel).subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel.status === applicationConstants.STATUS_SUCCESS && this.responseModel.data[0] != null) {
        if (this.responseModel != null && this.responseModel.data != undefined) {
          if (null != this.generalConfigModel.effectiveStartDate && undefined != this.generalConfigModel.effectiveStartDate)
            this.generalConfigModel.effectiveStartDate = this.datePipe.transform(this.generalConfigModel.effectiveStartDate, this.orgnizationSetting.datePipe);

          if (null != this.generalConfigModel.effectiveEndDate && undefined != this.generalConfigModel.effectiveEndDate)
            this.generalConfigModel.effectiveEndDate = this.datePipe.transform(this.generalConfigModel.effectiveEndDate, this.orgnizationSetting.datePipe);
          if (null != this.interestPolicyModel.interestPostingDate)
            this.interestPolicyModel.interestPostingDate = this.datePipe.transform(this.interestPolicyModel.interestPostingDate, this.orgnizationSetting.datePipe);

          if (null != this.generalConfigModel.accServiceConfigChargesList.effectiveStartDate)
            this.generalConfigModel.accServiceConfigChargesList.effectiveStartDate = this.datePipe.transform(this.generalConfigModel.accServiceConfigChargesList.effectiveStartDate, this.orgnizationSetting.datePipe);

          if (null != this.requiredDocumentsModel.effectiveStartDate)
            this.requiredDocumentsModel.effectiveStartDate = this.datePipe.transform(this.requiredDocumentsModel.effectiveStartDate, this.orgnizationSetting.datePipe);


          this.commonComponent.stopSpinner();
          this.msgs = [];

          this.msgs = [{ severity: 'success', summary: applicationConstants.STATUS_SUCCESS, detail: this.responseModel.statusMsg }];

          setTimeout(() => {
            this.msgs = [];
          }, 2000);

        }
        this.router.navigate([productDefinitionApprovalConstant.SAVINGS_BANK_PRODUCT_DEFINITION_APPROVAL_DETAILS]);
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

  //image upload and document path save
  //@Bhargavi
  fileUploader(event: any, fileUpload: FileUpload) {
    this.isFileUploaded = applicationConstants.FALSE;
    this.multipleFilesList = [];
    if (this.isEdit && this.generalConfigModel.filesDTOList == null || this.generalConfigModel.filesDTOList == undefined) {
      this.generalConfigModel.filesDTOList = [];
    }
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
        this.multipleFilesList.push(files);
        let timeStamp = this.commonComponent.getTimeStamp();
        this.generalConfigModel.multipartFileListsignedCopyPath = [];
        this.generalConfigModel.filesDTOList.push(files);
        this.generalConfigModel.signedCopyPath = null;
        this.generalConfigModel.filesDTOList[this.generalConfigModel.filesDTOList.length - 1].fileName = "SB_Filled_pdf" + "_" + timeStamp + "_" + file.name;
        this.generalConfigModel.signedCopyPath = "SB_Filled_pdf" + "_" + timeStamp + "_" + file.name;
        this.isDisableSubmit = false;
      }
      reader.readAsDataURL(file);
    }
  }

  /**
* @implements onFileremove from file value
* @param fileName 
* @author Bhargavi
*/
  fileRemoveEvent() {
    if (this.generalConfigModel.filesDTOList != null && this.generalConfigModel.filesDTOList != undefined && this.generalConfigModel.filesDTOList.length > 0) {
      let removeFileIndex = this.generalConfigModel.filesDTOList.findIndex((obj: any) => obj && obj.fileName === this.generalConfigModel.signedCopyPath);
      this.generalConfigModel.filesDTOList.splice(removeFileIndex, 1);
      this.generalConfigModel.signedCopyPath = null;
      this.isDisableSubmit = true;
    }
  }
  // for submit button validation based on status
  onStatusChange(event: any) {
    if (this.generalConfigModel.statusName != null && this.generalConfigModel.statusName != undefined) {
      this.isDisableSubmit = false;
    }
    else {
      this.isDisableSubmit = true;
    }
  }

  getAllStatusList() {
    this.commonStatusService.getAllCommonStatus().subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel != null && this.responseModel != undefined) {
        if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
          if (this.responseModel.data != null && this.responseModel.data != undefined && this.responseModel.data.length > 0) {
            this.statusList = this.responseModel.data;
            this.statusList = this.statusList.filter((obj: any) => obj != null && obj.name === CommonStatusData.REJECTED || obj.name === CommonStatusData.APPROVED ||
              obj.name === CommonStatusData.REQUEST_FOR_RESUBMISSION).map((status: { name: any; id: any; }) => {
                return { label: status.name, value: status.id };
              });
          } else {
            this.msgs = [];
            this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: this.responseModel.statusMsg }];
            setTimeout(() => {
              this.msgs = [];
            }, 2000);
          }
        }
      }
    }, error => {
      this.commonComponent.stopSpinner();
      this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: this.responseModel.statusMsg }];
      setTimeout(() => {
        this.msgs = [];
      }, 2000);
    });
  }
}
