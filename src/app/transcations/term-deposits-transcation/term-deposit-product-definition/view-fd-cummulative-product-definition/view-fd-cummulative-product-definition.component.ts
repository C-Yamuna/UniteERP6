import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { CommonComponent } from 'src/app/shared/common.component';
import { CommonFunctionsService } from 'src/app/shared/commonfunction.service';
import { EncryptDecryptService } from 'src/app/shared/encrypt-decrypt.service';
import { Responsemodel } from 'src/app/shared/responsemodel';
import { GeneralConfig } from '../add-td-product-definition/general-config/shared/general-config.model';
import { InterestPolicy } from '../add-td-product-definition/interest-policy/shared/interest-policy.model';
import { RequiredDocuments } from '../add-td-product-definition/required-documents/shared/required-documents.model';
import { termdeposittransactionconstant } from '../../term-deposit-transaction-constant';
import { TermDepositProductDefinitionService } from '../shared/term-deposit-product-definition.service';
import { applicationConstants } from 'src/app/shared/applicationConstants';
import { CommonStatusData } from 'src/app/transcations/common-status-data.json';
import { productDefinitionApprovalConstant } from 'src/app/transcations/product-definition-approval/product-definition-approval-constant';
import { FileUpload } from 'primeng/fileupload';
import { FileUploadModel } from 'src/app/layout/mainmenu/shared/file-upload-model.model';
import { FileUploadService } from 'src/app/shared/file-upload.service';
import { ERP_TRANSACTION_CONSTANTS } from 'src/app/transcations/erp-transaction-constants';

@Component({
  selector: 'app-view-fd-cummulative-product-definition',
  templateUrl: './view-fd-cummulative-product-definition.component.html',
  styleUrls: ['./view-fd-cummulative-product-definition.component.css']
})
export class ViewFdCummulativeProductDefinitionComponent {
  generalConfigModel: GeneralConfig = new GeneralConfig();
  interestPolicyModel: InterestPolicy = new InterestPolicy();
  requiredDocumentsModel: RequiredDocuments = new RequiredDocuments();
  interestPolicyList: any[] = [];
  requiredDocumentsList: any[] = [];
  statusList: any[] = [];

  responseModel!: Responsemodel;
  msgs: any[] = [];

  isEdit: any;
  buttonDisabled?: any;
  orgnizationSetting: any;
  countryList: any[] = [];
  memberLandDetails: any;
  fdCummulativeId: any;
  preveiwFalg: Boolean = true;
  isShowSubmit: boolean = applicationConstants.FALSE;
  isDisableSubmit: boolean = false;
  viewButton: boolean = false;
  editFlag: boolean = false;
  roleName: any;
  isFileUploaded: any;
  multipleFilesList: any[] = [];
  uploadFileData: any;

  constructor(private commonComponent: CommonComponent, private formBuilder: FormBuilder,
    private activateRoute: ActivatedRoute, private encryptService: EncryptDecryptService, private datePipe: DatePipe,
    private router: Router, private commonFunctionsService: CommonFunctionsService, private translate: TranslateService,
    private termDepositProductDefinitionService: TermDepositProductDefinitionService,private fileUploadService: FileUploadService) {

  }

  ngOnInit(): void {
    this.roleName = this.commonFunctionsService.getStorageValue(applicationConstants.roleName);
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
          this.fdCummulativeId = this.encryptService.decrypt(params['id']);
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
              this.viewButton = false;
              this.editFlag = true;
            } else {
              this.isShowSubmit = applicationConstants.TRUE;
            }
          }
          this.isEdit = applicationConstants.TRUE;
          this.termDepositProductDefinitionService.getFdCumulativeProductDefinitionOverviewDetailsById(this.fdCummulativeId).subscribe(res => {
            this.responseModel = res;
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
              if (this.generalConfigModel.intestPolicyConfigList != null && this.generalConfigModel.intestPolicyConfigList.length > 0) {
                this.interestPolicyList = this.generalConfigModel.intestPolicyConfigList;

              }
              if (this.generalConfigModel.requiredDocumentsConfigList != null && this.generalConfigModel.requiredDocumentsConfigList.length > 0) {
                this.requiredDocumentsList = this.generalConfigModel.requiredDocumentsConfigList;

              }
            }
          });
        } else {
          this.isEdit = false;
        }
      })
    })
  }

  // navigateToBack() {
  //   this.router.navigate([termdeposittransactionconstant.TERMDEPOSIT_PRODUCT_DEFINITION]);
  // }


  navigateToBack() {
    if (this.roleName == "Manager") {
      this.router.navigate([productDefinitionApprovalConstant.FD_CUMMULATIVE_PRODUCT_DEFINITION_APPROVAL]);
    } else {
      this.router.navigate([termdeposittransactionconstant.TERMDEPOSIT_PRODUCT_DEFINITION]);
    }
  }

  update() {
    if (this.generalConfigModel.effectiveStartDate != undefined && this.generalConfigModel.effectiveStartDate != null)
      this.generalConfigModel.effectiveStartDate = this.commonFunctionsService.getUTCEpoch(new Date(this.generalConfigModel.effectiveStartDate));

    if (this.generalConfigModel.effectiveEndDate != undefined && this.generalConfigModel.effectiveEndDate != null)
      this.generalConfigModel.effectiveEndDate = this.commonFunctionsService.getUTCEpoch(new Date(this.generalConfigModel.effectiveEndDate));

    if (this.interestPolicyModel.effectiveStartDate != undefined && this.interestPolicyModel.effectiveStartDate != null)
      this.interestPolicyModel.effectiveStartDate = this.commonFunctionsService.getUTCEpoch(new Date(this.interestPolicyModel.effectiveStartDate));


    if (this.generalConfigModel.requiredDocumentsConfigList != null && this.generalConfigModel.requiredDocumentsConfigList != undefined && this.generalConfigModel.requiredDocumentsConfigList.length > 0) {
      this.generalConfigModel.requiredDocumentsConfigList = this.generalConfigModel.requiredDocumentsConfigList.filter((data: any) => data != null && data.effectiveStartDate != null).map((object: any) => {
        object.effectiveStartDate = this.commonFunctionsService.getUTCEpoch(new Date(object.effectiveStartDate));
        return object;
      });
    }
    this.generalConfigModel.statusName = CommonStatusData.SUBMISSION_FOR_APPROVAL;
    this.termDepositProductDefinitionService.updateFdCummulativeProductDefination(this.generalConfigModel).subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel.status === applicationConstants.STATUS_SUCCESS && this.responseModel.data[0] != null) {
        if (this.responseModel != null && this.responseModel.data != undefined) {
          if (null != this.generalConfigModel.effectiveStartDate && undefined != this.generalConfigModel.effectiveStartDate)
            this.generalConfigModel.effectiveStartDate = this.datePipe.transform(this.generalConfigModel.effectiveStartDate, this.orgnizationSetting.datePipe);

          if (null != this.generalConfigModel.effectiveEndDate && undefined != this.generalConfigModel.effectiveEndDate)
            this.generalConfigModel.effectiveEndDate = this.datePipe.transform(this.generalConfigModel.effectiveEndDate, this.orgnizationSetting.datePipe);

          if (null != this.requiredDocumentsModel.effectiveStartDate)
            this.requiredDocumentsModel.effectiveStartDate = this.datePipe.transform(this.requiredDocumentsModel.effectiveStartDate, this.orgnizationSetting.datePipe);


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
    this.msgs = [{ severity: "success", detail: applicationConstants.FD_CUMULATIVE_PRODUCT_DEFINITION }];
    setTimeout(() => {
      this.router.navigate([termdeposittransactionconstant.TERMDEPOSIT_PRODUCT_DEFINITION]);
    }, 1500);
  }
  editFdCummlativeproductDefinationdetails(rowData: any, activeIndex: any) {
    switch (activeIndex) {
      case 0:
        this.router.navigate([termdeposittransactionconstant.TERMDEPOSIT_GENERAL_CONFIG], { queryParams: { id: this.encryptService.encrypt(rowData.fdCummulativeProductId) } });
        break;
      case 1:
        this.router.navigate([termdeposittransactionconstant.TERMDEPOSIT_INTEREST_POLICY], { queryParams: { id: this.encryptService.encrypt(rowData.fdCummulativeProductId) } });
        break;
      case 2:
        this.router.navigate([termdeposittransactionconstant.TERMDEPOSIT_REQUIRED_DOCUMENTS], { queryParams: { id: this.encryptService.encrypt(rowData.fdCummulativeProductId) } });
        break;
    }
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
        this.generalConfigModel.filesDTOList[this.generalConfigModel.filesDTOList.length - 1].fileName = "FD_CUMMULATIVE_Filled_pdf" + "_" + timeStamp + "_" + file.name;
        this.generalConfigModel.signedCopyPath = "FD_CUMMULATIVE_Filled_pdf" + "_" + timeStamp + "_" + file.name;
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
}
