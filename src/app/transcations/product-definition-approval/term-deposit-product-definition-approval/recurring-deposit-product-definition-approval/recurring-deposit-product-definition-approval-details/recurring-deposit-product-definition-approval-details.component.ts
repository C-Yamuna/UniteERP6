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
import { RecurringDepositInterestPolicy } from 'src/app/transcations/term-deposits-transcation/recurring-deposit-product-definition/add-recurring-deposit-product-definition/recurring-deposit-interest-policy/shared/recurring-deposit-interest-policy.model';
import { RecurringDepositPenalityConfig } from 'src/app/transcations/term-deposits-transcation/recurring-deposit-product-definition/add-recurring-deposit-product-definition/recurring-deposit-penality-config/shared/recurring-deposit-penality-config.model';
import { RecurringDepositRequiredDocuments } from 'src/app/transcations/term-deposits-transcation/recurring-deposit-product-definition/add-recurring-deposit-product-definition/recurring-deposit-required-documents/shared/recurring-deposit-required-documents.model';
import { RecurringDepositProductDefinition } from 'src/app/transcations/term-deposits-transcation/recurring-deposit-product-definition/shared/recurring-deposit-product-definition.model';
import { RecurringDepositProductDefinitionService } from 'src/app/transcations/term-deposits-transcation/recurring-deposit-product-definition/shared/recurring-deposit-product-definition.service';
import { termdeposittransactionconstant } from 'src/app/transcations/term-deposits-transcation/term-deposit-transaction-constant';
import { productDefinitionApprovalConstant } from '../../../product-definition-approval-constant';
import { CommonCategoryService } from 'src/app/configurations/term-deposit-config/td-common-category/shared/common-category.service';

@Component({
  selector: 'app-recurring-deposit-product-definition-approval-details',
  templateUrl: './recurring-deposit-product-definition-approval-details.component.html',
  styleUrls: ['./recurring-deposit-product-definition-approval-details.component.css']
})
export class RecurringDepositProductDefinitionApprovalDetailsComponent {
  recurringDepositProductDefinitionModel: RecurringDepositProductDefinition = new RecurringDepositProductDefinition();
  recurringDepositInterestPolicyModel: RecurringDepositInterestPolicy = new RecurringDepositInterestPolicy();
  recurringDepositPenalityConfigModel: RecurringDepositPenalityConfig = new RecurringDepositPenalityConfig();
  recurringDepositRequiredDocumentsModel: RecurringDepositRequiredDocuments = new RecurringDepositRequiredDocuments();
  interestPolicyList: any[] = [];
  penalityConfigList: any[] = [];
  requiredDocumentsList: any[] = [];
  statusList: any[] = [];

  responseModel!: Responsemodel;
  msgs: any[] = [];

  isEdit: any;
  buttonDisabled?: any;
  orgnizationSetting: any;
  memberLandDetails: any;
  rdProductId: any;
  preveiwFalg: Boolean = applicationConstants.TRUE;
  isShowSubmit: boolean = applicationConstants.FALSE;
  isDisableSubmit: boolean = applicationConstants.FALSE;
  viewButton: boolean = applicationConstants.FALSE;
  editFlag: boolean = applicationConstants.FALSE;
  roleName: any;
  isFileUploaded: any;
  multipleFilesList: any[] = [];
  uploadFileData: any;

  constructor(private commonComponent: CommonComponent, private formBuilder: FormBuilder, private commonStatusService: CommonCategoryService,
    private activateRoute: ActivatedRoute, private encryptService: EncryptDecryptService, private datePipe: DatePipe,
    private router: Router, private commonFunctionsService: CommonFunctionsService, private translate: TranslateService,
    private recurringDepositProductDefinitionService: RecurringDepositProductDefinitionService, private fileUploadService: FileUploadService) {

  }

  ngOnInit(): void {
    this.orgnizationSetting = this.commonComponent.orgnizationSettings()
    this.commonFunctionsService.data.subscribe((res: any) => {
      if (res) {
        this.translate.use(res);
      } else {
        this.translate.use(this.commonFunctionsService.getStorageValue('language'));
      }
      this.activateRoute.queryParams.subscribe(params => {
        this.commonComponent.startSpinner();
        if (params['id'] != undefined && params['id'] != null) {
          this.rdProductId = this.encryptService.decrypt(params['id']);
          if (params['editbtn'] != undefined && params['editbtn'] != null) {
            let isEditParam = this.encryptService.decrypt(params['editbtn']);
            if (isEditParam === "1") {
              this.preveiwFalg = applicationConstants.TRUE;
            } else {
              this.preveiwFalg = applicationConstants.FALSE;
            }
          }
          if (params['isGridPage'] != undefined && params['isGridPage'] != null) {
            let isGrid = this.encryptService.decrypt(params['isGridPage']);
            if (isGrid === "0") {
              this.isShowSubmit = applicationConstants.FALSE;
              this.viewButton = applicationConstants.FALSE;
              this.editFlag = applicationConstants.TRUE;
            } else {
              this.isShowSubmit = applicationConstants.TRUE;
            }
          }
          this.isEdit = applicationConstants.TRUE;
          this.recurringDepositProductDefinitionService.getRecurringDepositProductDefinitionOverviewDetailsById(this.rdProductId).subscribe(res => {
            this.responseModel = res;
            if (this.responseModel != null && this.responseModel != undefined) {
              this.recurringDepositProductDefinitionModel = this.responseModel.data[0];
              if (null != this.recurringDepositProductDefinitionModel.effectiveStartDate && undefined != this.recurringDepositProductDefinitionModel.effectiveStartDate)
                this.recurringDepositProductDefinitionModel.effectiveStartDate = this.datePipe.transform(this.recurringDepositProductDefinitionModel.effectiveStartDate, this.orgnizationSetting.datePipe);

              if (null != this.recurringDepositProductDefinitionModel.effectiveEndDate && undefined != this.recurringDepositProductDefinitionModel.effectiveEndDate)
                this.recurringDepositProductDefinitionModel.effectiveEndDate = this.datePipe.transform(this.recurringDepositProductDefinitionModel.effectiveEndDate, this.orgnizationSetting.datePipe);

              if (this.recurringDepositProductDefinitionModel.signedCopyPath != null && this.recurringDepositProductDefinitionModel.signedCopyPath != undefined) {
                this.recurringDepositProductDefinitionModel.multipartFileListsignedCopyPath = this.fileUploadService.getFile(this.recurringDepositProductDefinitionModel.signedCopyPath, ERP_TRANSACTION_CONSTANTS.TERMDEPOSITS + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.recurringDepositProductDefinitionModel.signedCopyPath);
                this.isDisableSubmit = false;
              }
              else {
                this.isDisableSubmit = true;
              }

              if (this.recurringDepositProductDefinitionModel.intestPolicyConfigList != null && this.recurringDepositProductDefinitionModel.intestPolicyConfigList != undefined && this.recurringDepositProductDefinitionModel.intestPolicyConfigList.length > 0) {
                this.interestPolicyList = this.recurringDepositProductDefinitionModel.intestPolicyConfigList;

              }
              if (this.recurringDepositProductDefinitionModel.penaltyConfigList != null && this.recurringDepositProductDefinitionModel.penaltyConfigList != undefined && this.recurringDepositProductDefinitionModel.penaltyConfigList.length > 0) {
                this.penalityConfigList = this.recurringDepositProductDefinitionModel.penaltyConfigList;

              }
              if (this.recurringDepositProductDefinitionModel.requiredDocumentsConfigList != null && this.recurringDepositProductDefinitionModel.requiredDocumentsConfigList != undefined && this.recurringDepositProductDefinitionModel.requiredDocumentsConfigList.length > 0) {
                this.requiredDocumentsList = this.recurringDepositProductDefinitionModel.requiredDocumentsConfigList;

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
    this.router.navigate([productDefinitionApprovalConstant.RECURRING_DEPOSIT_PRODUCT_DEFINITION_APPROVAL]);
  }

  submit() {
    // Determine the status name before submission
    if (this.recurringDepositProductDefinitionModel.status != null && this.recurringDepositProductDefinitionModel.status != undefined) {
      const statusName = this.statusList.find((data: any) => data != null && data.value === this.recurringDepositProductDefinitionModel.statusName);
      if (statusName != null && statusName != undefined) {
        this.recurringDepositProductDefinitionModel.statusName = statusName.label;
      }
    } else {
      this.commonComponent.stopSpinner();
      this.msgs = [];
      this.msgs = [{ severity: 'error', detail: this.responseModel.statusMsg }];
      setTimeout(() => {
        this.msgs = [];
      }, 2000);
    }
    if (this.recurringDepositProductDefinitionModel.effectiveStartDate != undefined && this.recurringDepositProductDefinitionModel.effectiveStartDate != null)
      this.recurringDepositProductDefinitionModel.effectiveStartDate = this.commonFunctionsService.getUTCEpoch(new Date(this.recurringDepositProductDefinitionModel.effectiveStartDate));

    if (this.recurringDepositProductDefinitionModel.effectiveEndDate != undefined && this.recurringDepositProductDefinitionModel.effectiveEndDate != null)
      this.recurringDepositProductDefinitionModel.effectiveEndDate = this.commonFunctionsService.getUTCEpoch(new Date(this.recurringDepositProductDefinitionModel.effectiveEndDate));



    if (this.recurringDepositInterestPolicyModel.effectiveStartDate != undefined && this.recurringDepositInterestPolicyModel.effectiveStartDate != null)
      this.recurringDepositInterestPolicyModel.effectiveStartDate = this.commonFunctionsService.getUTCEpoch(new Date(this.recurringDepositInterestPolicyModel.effectiveStartDate));


    if (this.recurringDepositProductDefinitionModel.requiredDocumentsConfigList != null && this.recurringDepositProductDefinitionModel.requiredDocumentsConfigList != undefined && this.recurringDepositProductDefinitionModel.requiredDocumentsConfigList.length > 0) {
      this.recurringDepositProductDefinitionModel.requiredDocumentsConfigList = this.recurringDepositProductDefinitionModel.requiredDocumentsConfigList.filter((data: any) => data != null && data.effectiveStartDate != null).map((object: any) => {
        object.effectiveStartDate = this.commonFunctionsService.getUTCEpoch(new Date(object.effectiveStartDate));
        return object;
      });
    }
    this.recurringDepositProductDefinitionService.updateRecurringDepositProductDefinition(this.recurringDepositProductDefinitionModel).subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel.status === applicationConstants.STATUS_SUCCESS && this.responseModel.data[0] != null) {
        if (this.responseModel != null && this.responseModel.data != undefined) {
          if (null != this.recurringDepositProductDefinitionModel.effectiveStartDate && undefined != this.recurringDepositProductDefinitionModel.effectiveStartDate)
            this.recurringDepositProductDefinitionModel.effectiveStartDate = this.datePipe.transform(this.recurringDepositProductDefinitionModel.effectiveStartDate, this.orgnizationSetting.datePipe);

          if (null != this.recurringDepositProductDefinitionModel.effectiveEndDate && undefined != this.recurringDepositProductDefinitionModel.effectiveEndDate)
            this.recurringDepositProductDefinitionModel.effectiveEndDate = this.datePipe.transform(this.recurringDepositProductDefinitionModel.effectiveEndDate, this.orgnizationSetting.datePipe);

          if (null != this.recurringDepositRequiredDocumentsModel.effectiveStartDate)
            this.recurringDepositRequiredDocumentsModel.effectiveStartDate = this.datePipe.transform(this.recurringDepositRequiredDocumentsModel.effectiveStartDate, this.orgnizationSetting.datePipe);


          this.commonComponent.stopSpinner();
          this.msgs = [];

          this.msgs = [{ severity: 'success', summary: applicationConstants.STATUS_SUCCESS, detail: this.responseModel.statusMsg }];

          setTimeout(() => {
            this.msgs = [];
          }, 2000);
          this.router.navigate([productDefinitionApprovalConstant.RECURRING_DEPOSIT_PRODUCT_DEFINITION_APPROVAL]);
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

  //image upload and document path save
  //@Bhargavi
  fileUploader(event: any, fileUpload: FileUpload) {
    this.isFileUploaded = applicationConstants.FALSE;
    this.multipleFilesList = [];
    if (this.isEdit && this.recurringDepositProductDefinitionModel.filesDTOList == null || this.recurringDepositProductDefinitionModel.filesDTOList == undefined) {
      this.recurringDepositProductDefinitionModel.filesDTOList = [];
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
        this.recurringDepositProductDefinitionModel.multipartFileListsignedCopyPath = [];
        this.recurringDepositProductDefinitionModel.filesDTOList.push(files);
        this.recurringDepositProductDefinitionModel.signedCopyPath = null;
        this.recurringDepositProductDefinitionModel.filesDTOList[this.recurringDepositProductDefinitionModel.filesDTOList.length - 1].fileName = "RD_Filled_pdf" + "_" + timeStamp + "_" + file.name;
        this.recurringDepositProductDefinitionModel.signedCopyPath = "RD_Filled_pdf" + "_" + timeStamp + "_" + file.name;
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
    if (this.recurringDepositProductDefinitionModel.filesDTOList != null && this.recurringDepositProductDefinitionModel.filesDTOList != undefined && this.recurringDepositProductDefinitionModel.filesDTOList.length > 0) {
      let removeFileIndex = this.recurringDepositProductDefinitionModel.filesDTOList.findIndex((obj: any) => obj && obj.fileName === this.recurringDepositProductDefinitionModel.signedCopyPath);
      this.recurringDepositProductDefinitionModel.filesDTOList.splice(removeFileIndex, 1);
      this.recurringDepositProductDefinitionModel.signedCopyPath = null;
      this.isDisableSubmit = true;
    }
  }

  // for submit button validation based on status
  onStatusChange(event: any) {
    if (this.recurringDepositProductDefinitionModel.statusName != null && this.recurringDepositProductDefinitionModel.statusName != undefined) {
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
