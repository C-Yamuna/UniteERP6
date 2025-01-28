import { Component } from '@angular/core';
import { termdeposittransactionconstant } from '../../term-deposit-transaction-constant';
import { RecurringDepositProductDefinition } from '../shared/recurring-deposit-product-definition.model';
import { RecurringDepositPenalityConfig } from '../add-recurring-deposit-product-definition/recurring-deposit-penality-config/shared/recurring-deposit-penality-config.model';
import { RecurringDepositInterestPolicy } from '../add-recurring-deposit-product-definition/recurring-deposit-interest-policy/shared/recurring-deposit-interest-policy.model';
import { RecurringDepositRequiredDocuments } from '../add-recurring-deposit-product-definition/recurring-deposit-required-documents/shared/recurring-deposit-required-documents.model';
import { Responsemodel } from 'src/app/shared/responsemodel';
import { applicationConstants } from 'src/app/shared/applicationConstants';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { EncryptDecryptService } from 'src/app/shared/encrypt-decrypt.service';
import { DatePipe } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { CommonFunctionsService } from 'src/app/shared/commonfunction.service';
import { CommonComponent } from 'src/app/shared/common.component';
import { RecurringDepositProductDefinitionService } from '../shared/recurring-deposit-product-definition.service';
import { CommonStatusData } from 'src/app/transcations/common-status-data.json';
import { FileUploadService } from 'src/app/shared/file-upload.service';
import { ERP_TRANSACTION_CONSTANTS } from 'src/app/transcations/erp-transaction-constants';
import { FileUpload } from 'primeng/fileupload';
import { FileUploadModel } from 'src/app/layout/mainmenu/shared/file-upload-model.model';
import { productDefinitionApprovalConstant } from 'src/app/transcations/product-definition-approval/product-definition-approval-constant';

@Component({
  selector: 'app-view-recurring-deposit-product-definition',
  templateUrl: './view-recurring-deposit-product-definition.component.html',
  styleUrls: ['./view-recurring-deposit-product-definition.component.css']
})
export class ViewRecurringDepositProductDefinitionComponent {
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

  constructor(private commonComponent: CommonComponent, private formBuilder: FormBuilder,
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
  }
  // navigateToBack() {
  //   this.router.navigate([termdeposittransactionconstant.RECURRING_DEPOSIT_PRODUCT_DEFINITION]);
  // }

  navigateToBack() {
    if (this.roleName == "Manager") {
      this.router.navigate([productDefinitionApprovalConstant.RECURRING_DEPOSIT_PRODUCT_DEFINITION_APPROVAL]);
    } else {
      this.router.navigate([termdeposittransactionconstant.RECURRING_DEPOSIT_PRODUCT_DEFINITION]);
    }
  }
  update() {
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
    this.recurringDepositProductDefinitionModel.statusName = CommonStatusData.SUBMISSION_FOR_APPROVAL;
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
    this.msgs = [{ severity: "success", detail: applicationConstants.RD_PRODUCT_DEFINITION }];
    setTimeout(() => {
      this.router.navigate([termdeposittransactionconstant.RECURRING_DEPOSIT_PRODUCT_DEFINITION]);
    }, 1500);
  }
  editRecurringDepositproductDefinationdetails(rowData: any, activeIndex: any) {
    switch (activeIndex) {
      case 0:
        this.router.navigate([termdeposittransactionconstant.RECURRING_DEPOSIT_GENERAL_CONFIG], { queryParams: { id: this.encryptService.encrypt(rowData.rdProductId) } });
        break;
      case 1:
        this.router.navigate([termdeposittransactionconstant.RECURRING_DEPOSIT_INTEREST_POLICY], { queryParams: { id: this.encryptService.encrypt(rowData.rdProductId) } });
        break;
      case 2:
        this.router.navigate([termdeposittransactionconstant.RECURRING_DEPOSIT_PENALITY_CONFIG], { queryParams: { id: this.encryptService.encrypt(rowData.rdProductId) } });
        break;
      case 3:
        this.router.navigate([termdeposittransactionconstant.RECURRING_DEPOSIT_REQUIRED_DOCUMENTS_CONFIG], { queryParams: { id: this.encryptService.encrypt(rowData.rdProductId) } });
        break;
    }
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
}
