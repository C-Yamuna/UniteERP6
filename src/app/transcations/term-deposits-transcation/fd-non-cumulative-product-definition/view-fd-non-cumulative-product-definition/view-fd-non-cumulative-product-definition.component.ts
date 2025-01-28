import { Component } from '@angular/core';
import { termdeposittransactionconstant } from '../../term-deposit-transaction-constant';
import { FdNonCumulativeProductDefinition } from '../shared/fd-non-cumulative-product-definition.model';
import { FdNonCumulativeInterestPolicy } from '../add-fd-non-cumulative-product-definition/fd-non-cumulative-interest-policy/shared/fd-non-cumulative-interest-policy.model';
import { FdNonCumulativeRequiredDocuments } from '../add-fd-non-cumulative-product-definition/fd-non-cumulative-required-documents/shared/fd-non-cumulative-required-documents.model';
import { Responsemodel } from 'src/app/shared/responsemodel';
import { CommonComponent } from 'src/app/shared/common.component';
import { FormBuilder } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonFunctionsService } from 'src/app/shared/commonfunction.service';
import { EncryptDecryptService } from 'src/app/shared/encrypt-decrypt.service';
import { FdNonCumulativeProductDefinitionService } from '../shared/fd-non-cumulative-product-definition.service';
import { applicationConstants } from 'src/app/shared/applicationConstants';
import { CommonStatusData } from 'src/app/transcations/common-status-data.json';
import { FileUploadService } from 'src/app/shared/file-upload.service';
import { ERP_TRANSACTION_CONSTANTS } from 'src/app/transcations/erp-transaction-constants';
import { FileUpload } from 'primeng/fileupload';
import { FileUploadModel } from 'src/app/layout/mainmenu/shared/file-upload-model.model';
import { productDefinitionApprovalConstant } from 'src/app/transcations/product-definition-approval/product-definition-approval-constant';


@Component({
  selector: 'app-view-fd-non-cumulative-product-definition',
  templateUrl: './view-fd-non-cumulative-product-definition.component.html',
  styleUrls: ['./view-fd-non-cumulative-product-definition.component.css']
})
export class ViewFdNonCumulativeProductDefinitionComponent {
  fdNonCumulativeProductDefinitionModel: FdNonCumulativeProductDefinition = new FdNonCumulativeProductDefinition();
  fdNonCumulativeInterestPolicyModel: FdNonCumulativeInterestPolicy = new FdNonCumulativeInterestPolicy();
  fdNonCumulativeRequiredDocumentsModel: FdNonCumulativeRequiredDocuments = new FdNonCumulativeRequiredDocuments();
  interestPolicyList: any[] = [];
  requiredDocumentsList: any[] = [];
  statusList: any[] = [];

  responseModel!: Responsemodel;
  msgs: any[] = [];
  isEdit: any;
  buttonDisabled?: any;
  orgnizationSetting: any;
  memberLandDetails: any;
  fdNonCummulativeProductId: any;
  editbtn: Boolean = applicationConstants.TRUE;
  showSubmitButton: boolean = false;
  buttonDisbled: boolean = false;
  editbtns: Boolean = applicationConstants.TRUE;
  isShowSubmit: boolean = applicationConstants.FALSE;
  viewButton: boolean = false;
  editFlag: boolean = false;
  isDisableSubmit: boolean = false;
  isFileUploaded: any;
  multipleFilesList: any[] = [];
  uploadFileData: any;
  roleName: any;


  constructor(private commonComponent: CommonComponent, private formBuilder: FormBuilder,
    private activateRoute: ActivatedRoute, private encryptService: EncryptDecryptService, private datePipe: DatePipe,
    private router: Router, private commonFunctionsService: CommonFunctionsService, private translate: TranslateService,
    private fdNonCumulativeProductDefinitionService: FdNonCumulativeProductDefinitionService, private fileUploadService: FileUploadService) {

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
          this.fdNonCummulativeProductId = this.encryptService.decrypt(params['id']);
          if (params['editbtn'] != undefined && params['editbtn'] != null) {
            let isEditParam = this.encryptService.decrypt(params['editbtn']);
            // this.editbtn = (isEditParam === "1") ? applicationConstants.TRUE : applicationConstants.FALSE;
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
          this.fdNonCumulativeProductDefinitionService.getFdNonCumulativeProductDefinitionOverviewDetailsById(this.fdNonCummulativeProductId).subscribe(res => {
            this.responseModel = res;
            if (this.responseModel != null && this.responseModel != undefined) {
              this.fdNonCumulativeProductDefinitionModel = this.responseModel.data[0];
              if (null != this.fdNonCumulativeProductDefinitionModel.effectiveStartDate && undefined != this.fdNonCumulativeProductDefinitionModel.effectiveStartDate)
                this.fdNonCumulativeProductDefinitionModel.effectiveStartDate = this.datePipe.transform(this.fdNonCumulativeProductDefinitionModel.effectiveStartDate, this.orgnizationSetting.datePipe);

              if (null != this.fdNonCumulativeProductDefinitionModel.effectiveEndDate && undefined != this.fdNonCumulativeProductDefinitionModel.effectiveEndDate)
                this.fdNonCumulativeProductDefinitionModel.effectiveEndDate = this.datePipe.transform(this.fdNonCumulativeProductDefinitionModel.effectiveEndDate, this.orgnizationSetting.datePipe);

              if (this.fdNonCumulativeProductDefinitionModel.signedCopyPath != null && this.fdNonCumulativeProductDefinitionModel.signedCopyPath != undefined) {
                this.fdNonCumulativeProductDefinitionModel.multipartFileListsignedCopyPath = this.fileUploadService.getFile(this.fdNonCumulativeProductDefinitionModel.signedCopyPath, ERP_TRANSACTION_CONSTANTS.TERMDEPOSITS + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.fdNonCumulativeProductDefinitionModel.signedCopyPath);
                this.isDisableSubmit = false;
              }
              else {
                this.isDisableSubmit = true;
              }
              if (this.fdNonCumulativeProductDefinitionModel.fdNonCummulativeInterestPolicyConfigList != null && this.fdNonCumulativeProductDefinitionModel.fdNonCummulativeInterestPolicyConfigList != undefined && this.fdNonCumulativeProductDefinitionModel.fdNonCummulativeInterestPolicyConfigList.length > 0) {
                this.interestPolicyList = this.fdNonCumulativeProductDefinitionModel.fdNonCummulativeInterestPolicyConfigList;

              }
              if (this.fdNonCumulativeProductDefinitionModel.fdNonCummulativeRequiredDocumentsConfigList != null && this.fdNonCumulativeProductDefinitionModel.fdNonCummulativeRequiredDocumentsConfigList != undefined && this.fdNonCumulativeProductDefinitionModel.fdNonCummulativeRequiredDocumentsConfigList.length > 0) {
                this.requiredDocumentsList = this.fdNonCumulativeProductDefinitionModel.fdNonCummulativeRequiredDocumentsConfigList;

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
  //   this.router.navigate([termdeposittransactionconstant.FD_NON_CUMULATIVE_PRODUCT_DEFINITION]);
  // }

  navigateToBack() {
    if (this.roleName == "Manager") {
      this.router.navigate([productDefinitionApprovalConstant.FD_NON_CUMMULATIVE_PRODUCT_DEFINITION_APPROVAL]);
    } else {
      this.router.navigate([termdeposittransactionconstant.FD_NON_CUMULATIVE_PRODUCT_DEFINITION]);
    }
  }
  update() {
    if (this.fdNonCumulativeProductDefinitionModel.effectiveStartDate != undefined && this.fdNonCumulativeProductDefinitionModel.effectiveStartDate != null)
      this.fdNonCumulativeProductDefinitionModel.effectiveStartDate = this.commonFunctionsService.getUTCEpoch(new Date(this.fdNonCumulativeProductDefinitionModel.effectiveStartDate));

    if (this.fdNonCumulativeProductDefinitionModel.effectiveEndDate != undefined && this.fdNonCumulativeProductDefinitionModel.effectiveEndDate != null)
      this.fdNonCumulativeProductDefinitionModel.effectiveEndDate = this.commonFunctionsService.getUTCEpoch(new Date(this.fdNonCumulativeProductDefinitionModel.effectiveEndDate));



    if (this.fdNonCumulativeInterestPolicyModel.effectiveStartDate != undefined && this.fdNonCumulativeInterestPolicyModel.effectiveStartDate != null)
      this.fdNonCumulativeInterestPolicyModel.effectiveStartDate = this.commonFunctionsService.getUTCEpoch(new Date(this.fdNonCumulativeInterestPolicyModel.effectiveStartDate));


    if (this.fdNonCumulativeProductDefinitionModel.fdNonCummulativeRequiredDocumentsConfigList != null && this.fdNonCumulativeProductDefinitionModel.fdNonCummulativeRequiredDocumentsConfigList != undefined && this.fdNonCumulativeProductDefinitionModel.fdNonCummulativeRequiredDocumentsConfigList.length > 0) {
      this.fdNonCumulativeProductDefinitionModel.fdNonCummulativeRequiredDocumentsConfigList = this.fdNonCumulativeProductDefinitionModel.fdNonCummulativeRequiredDocumentsConfigList.filter((data: any) => data != null && data.effectiveStartDate != null).map((object: any) => {
        object.effectiveStartDate = this.commonFunctionsService.getUTCEpoch(new Date(object.effectiveStartDate));
        return object;
      });
    }
    this.fdNonCumulativeProductDefinitionModel.statusName = CommonStatusData.SUBMISSION_FOR_APPROVAL;
    this.fdNonCumulativeProductDefinitionService.updateFdNonCumulativeProductDefinition(this.fdNonCumulativeProductDefinitionModel).subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel.status === applicationConstants.STATUS_SUCCESS && this.responseModel.data[0] != null) {
        if (this.responseModel != null && this.responseModel.data != undefined) {
          if (null != this.fdNonCumulativeProductDefinitionModel.effectiveStartDate && undefined != this.fdNonCumulativeProductDefinitionModel.effectiveStartDate)
            this.fdNonCumulativeProductDefinitionModel.effectiveStartDate = this.datePipe.transform(this.fdNonCumulativeProductDefinitionModel.effectiveStartDate, this.orgnizationSetting.datePipe);

          if (null != this.fdNonCumulativeProductDefinitionModel.effectiveEndDate && undefined != this.fdNonCumulativeProductDefinitionModel.effectiveEndDate)
            this.fdNonCumulativeProductDefinitionModel.effectiveEndDate = this.datePipe.transform(this.fdNonCumulativeProductDefinitionModel.effectiveEndDate, this.orgnizationSetting.datePipe);

          if (null != this.fdNonCumulativeRequiredDocumentsModel.effectiveStartDate)
            this.fdNonCumulativeRequiredDocumentsModel.effectiveStartDate = this.datePipe.transform(this.fdNonCumulativeRequiredDocumentsModel.effectiveStartDate, this.orgnizationSetting.datePipe);


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
    this.buttonDisbled = true;
    this.msgs = [];
    this.msgs = [{ severity: "success", detail: applicationConstants.FD_NON_CUMULATIVE_PRODUCT_DEFINITION }];
    setTimeout(() => {
      this.router.navigate([termdeposittransactionconstant.FD_NON_CUMULATIVE_PRODUCT_DEFINITION]);
    }, 1500);

  }
  editFdNonCummlativeproductDefinationdetails(rowData: any, activeIndex: any) {
    switch (activeIndex) {
      case 0:
        this.router.navigate([termdeposittransactionconstant.FD_NON_CUMULATIVE_GENERAL_CONFIG], { queryParams: { id: this.encryptService.encrypt(rowData.fdNonCummulativeProductId) } });
        break;
      case 1:
        this.router.navigate([termdeposittransactionconstant.FD_NON_CUMULATIVE_INTEREST_POLICY], { queryParams: { id: this.encryptService.encrypt(rowData.fdNonCummulativeProductId) } });
        break;
      case 2:
        this.router.navigate([termdeposittransactionconstant.FD_NON_CUMULATIVE_REQUIRED_DOCUMENTS], { queryParams: { id: this.encryptService.encrypt(rowData.fdNonCummulativeProductId) } });
        break;
    }
  }

  //image upload and document path save
  //@Bhargavi
  fileUploader(event: any, fileUpload: FileUpload) {
    this.isFileUploaded = applicationConstants.FALSE;
    this.multipleFilesList = [];
    if (this.isEdit && this.fdNonCumulativeProductDefinitionModel.filesDTOList == null || this.fdNonCumulativeProductDefinitionModel.filesDTOList == undefined) {
      this.fdNonCumulativeProductDefinitionModel.filesDTOList = [];
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
        this.fdNonCumulativeProductDefinitionModel.multipartFileListsignedCopyPath = [];
        this.fdNonCumulativeProductDefinitionModel.filesDTOList.push(files);
        this.fdNonCumulativeProductDefinitionModel.signedCopyPath = null;
        this.fdNonCumulativeProductDefinitionModel.filesDTOList[this.fdNonCumulativeProductDefinitionModel.filesDTOList.length - 1].fileName = "FD_NON_CUMMULATIVE_Filled_pdf" + "_" + timeStamp + "_" + file.name;
        this.fdNonCumulativeProductDefinitionModel.signedCopyPath = "FD_NON_CUMMULATIVE_Filled_pdf" + "_" + timeStamp + "_" + file.name;
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
    if (this.fdNonCumulativeProductDefinitionModel.filesDTOList != null && this.fdNonCumulativeProductDefinitionModel.filesDTOList != undefined && this.fdNonCumulativeProductDefinitionModel.filesDTOList.length > 0) {
      let removeFileIndex = this.fdNonCumulativeProductDefinitionModel.filesDTOList.findIndex((obj: any) => obj && obj.fileName === this.fdNonCumulativeProductDefinitionModel.signedCopyPath);
      this.fdNonCumulativeProductDefinitionModel.filesDTOList.splice(removeFileIndex, 1);
      this.fdNonCumulativeProductDefinitionModel.signedCopyPath = null;
      this.isDisableSubmit = true;
    }
  }
}
