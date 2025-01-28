import { Component } from '@angular/core';
import { FileUpload } from 'primeng/fileupload';
import { FileUploadModel } from 'src/app/layout/mainmenu/shared/file-upload-model.model';
import { applicationConstants } from 'src/app/shared/applicationConstants';
import { CommonStatusData } from 'src/app/transcations/common-status-data.json';
import { ERP_TRANSACTION_CONSTANTS } from 'src/app/transcations/erp-transaction-constants';
import { approvaltransactionsconstant } from '../../../approval-transactions-constant';
import { Responsemodel } from 'src/app/shared/responsemodel';
import { SiBorrowingAccountDetails } from 'src/app/transcations/borrowing-transaction/si-borrowing/si-borrowing-stepper/shared/siborrowing.model';
import { SiBorrowingAccountMapping } from 'src/app/transcations/borrowing-transaction/si-borrowing/si-borrowing-stepper/si-borrowing-account-mapping/shared/si-borrowing-account-mapping.model';
import { SiBorrowingDocument } from 'src/app/transcations/borrowing-transaction/si-borrowing/si-borrowing-stepper/si-borrowing-document/shared/si-borrowing-document.model';
import { CommonComponent } from 'src/app/shared/common.component';
import { SiBorrowingStepperService } from 'src/app/transcations/borrowing-transaction/si-borrowing/si-borrowing-stepper/shared/si-borrowing-stepper.service';
import { TranslateService } from '@ngx-translate/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FileUploadService } from 'src/app/shared/file-upload.service';
import { CommonFunctionsService } from 'src/app/shared/commonfunction.service';
import { EncryptDecryptService } from 'src/app/shared/encrypt-decrypt.service';
import { DatePipe } from '@angular/common';
import { CommonCategoryService } from 'src/app/configurations/loan-config/common-category/shared/common-category.service';

@Component({
  selector: 'app-si-borrowing-approval',
  templateUrl: './si-borrowing-approval.component.html',
  styleUrls: ['./si-borrowing-approval.component.css']
})
export class SiBorrowingApprovalComponent {
  siborrowingAccountDetailsModel :SiBorrowingAccountDetails = new SiBorrowingAccountDetails();
  siBorrowingAccountMappingModel:SiBorrowingAccountMapping = new SiBorrowingAccountMapping();
  SiBorrowingDocumentModel:SiBorrowingDocument = new SiBorrowingDocument();
  borrowingaccountmapping: any[] = [];
  borrowingdocument: any[] = [];
  statusList: any[]=[];
 
  responseModel!: Responsemodel;
  msgs: any[]=[];
  editbtn: boolean = true;
  isEdit: any;
  buttonDisabled?: any;
  orgnizationSetting: any;
  countryList: any[]=[];
  memberLandDetails: any;
  siborrowingMappingList: any[]=[];
  borrowingAccountId:any;
  borrowingdocumentlist: any[]=[];
  viewButton: boolean = false;
  editFlag: boolean = false;
  uploadFileData: any;
  isShowSubmit: boolean =applicationConstants.FALSE;
  isFileUploaded: any;
  multipartFileList: any[] = [];
  isDisableSubmit: boolean = false;
  accountNumber: any;
  constructor(private commonComponent: CommonComponent, private formBuilder: FormBuilder,
    private siBorrowingStepperService : SiBorrowingStepperService, private translate: TranslateService,

    private activateRoute: ActivatedRoute, private encryptService: EncryptDecryptService,private datePipe: DatePipe,
    private router: Router, private commonFunctionsService: CommonFunctionsService, private commonStatusService: CommonCategoryService,
    private fileUploadService :FileUploadService,) {

    
    }
    ngOnInit() {
      this.orgnizationSetting = this.commonComponent.orgnizationSettings();
      this.translate.use(this.commonFunctionsService.getStorageValue('language'));
      this.activateRoute.queryParams.subscribe(params => {
        if (params['id'] != undefined && params['editbutton'] != undefined) {
           let id = this.encryptService.decrypt(params['id']);
          // let type = this.encryptDecryptService.decrypt(params['memType']);
          let idEdit = this.encryptService.decrypt(params['editbutton']);
          this.borrowingAccountId = Number(id);
  
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
            this.getPreviewDataBySiBorrowingAccountId();
        } 
      })
      this.getAllStatusList();
    }
  backbutton() {
    this.router.navigate([approvaltransactionsconstant.SI_BORROWING_APPROVAL_TRANSACTION_DETAILS]);
  }

  submit() {
    // Determine the status name before submission
    if (this.siborrowingAccountDetailsModel.status != null && this.siborrowingAccountDetailsModel.status != undefined) {
      const statusName = this.statusList.find((data: any) => data != null && data.value === this.siborrowingAccountDetailsModel.statusName);
      if (statusName != null && statusName != undefined) {
        this.siborrowingAccountDetailsModel.statusName = statusName.label;
      }
    } else {
      this.commonComponent.stopSpinner();
      this.msgs = [];
      this.msgs = [{ severity: 'error', detail: this.responseModel.statusMsg }];
      setTimeout(() => {
        this.msgs = [];
      }, 2000);
    }

    if (this.siborrowingAccountDetailsModel.applicationDate != null && this.siborrowingAccountDetailsModel.applicationDate != undefined) {
      this.siborrowingAccountDetailsModel.applicationDate = this.commonFunctionsService.getUTCEpoch(new Date(this.siborrowingAccountDetailsModel.applicationDate));
    }
    if (this.siborrowingAccountDetailsModel.sanctionedDate != null && this.siborrowingAccountDetailsModel.sanctionedDate != undefined) {
      this.siborrowingAccountDetailsModel.sanctionedDate = this.commonFunctionsService.getUTCEpoch(new Date(this.siborrowingAccountDetailsModel.sanctionedDate));
    }
    if (this.siborrowingAccountDetailsModel.requestedDate != null && this.siborrowingAccountDetailsModel.requestedDate != undefined) {
      this.siborrowingAccountDetailsModel.requestedDate = this.commonFunctionsService.getUTCEpoch(new Date(this.siborrowingAccountDetailsModel.requestedDate));
    }
    if (this.siborrowingAccountDetailsModel.borrowingDueDate != null && this.siborrowingAccountDetailsModel.borrowingDueDate != undefined) {
      this.siborrowingAccountDetailsModel.borrowingDueDate = this.commonFunctionsService.getUTCEpoch(new Date(this.siborrowingAccountDetailsModel.borrowingDueDate));
    }
    this.siBorrowingStepperService.updateSiBorrowingStepper(this.siborrowingAccountDetailsModel).subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
        if (this.responseModel.data[0] != undefined && this.responseModel.data[0] != null && this.responseModel.data.length > 0) {
          this.siborrowingAccountDetailsModel = this.responseModel.data[0];
          if (this.siborrowingAccountDetailsModel.id != undefined && this.siborrowingAccountDetailsModel.id != null)
            this.borrowingAccountId = this.siborrowingAccountDetailsModel.id;
        
          if (this.responseModel.data[0].accountNumber != null && this.siborrowingAccountDetailsModel.accountNumber != undefined)
            this.accountNumber = this.siborrowingAccountDetailsModel.accountNumber;         
        }
        this.msgs = [{ severity: 'success', summary: applicationConstants.STATUS_SUCCESS, detail: this.responseModel.statusMsg }];
        setTimeout(() => {
          this.msgs = [];
        }, 1200);
        this.router.navigate([approvaltransactionsconstant.SI_BORROWING_APPROVAL_TRANSACTION_DETAILS]);
      } else {
        this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: this.responseModel.statusMsg }];
        setTimeout(() => {
          this.msgs = [];
        }, 3000);
      }
    }, (error: any) => {
      this.commonComponent.stopSpinner();
      this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: applicationConstants.SERVER_DOWN_ERROR }];
      setTimeout(() => {
        this.msgs = [];
      }, 3000);
    });
  }
  
  getPreviewDataBySiBorrowingAccountId() {
    this.siBorrowingStepperService.getPreviewDataBySiBorrowingAccountId(this.borrowingAccountId).subscribe(res => {
      this.responseModel = res;
      if(this.siborrowingAccountDetailsModel.sanctionedDate != undefined && this.siborrowingAccountDetailsModel.sanctionedDate != null)
        this.siborrowingAccountDetailsModel.sanctionedDate = this.commonFunctionsService.getUTCEpoch(new Date(this.siborrowingAccountDetailsModel.sanctionedDate));
      if (this.responseModel != null && this.responseModel != undefined) {
        this.siborrowingAccountDetailsModel = this.responseModel.data[0];

        if(null != this.siborrowingAccountDetailsModel.sanctionedDate)
       this.siborrowingAccountDetailsModel.sanctionedDate=this.datePipe.transform(this.siborrowingAccountDetailsModel.sanctionedDate, this.orgnizationSetting.datePipe);

        if(null != this.siborrowingAccountDetailsModel.applicationDate)
          this.siborrowingAccountDetailsModel.applicationDate=this.datePipe.transform(this.siborrowingAccountDetailsModel.applicationDate, this.orgnizationSetting.datePipe);

        if(null != this.siborrowingAccountDetailsModel.requestedDate)
          this.siborrowingAccountDetailsModel.requestedDate=this.datePipe.transform(this.siborrowingAccountDetailsModel.requestedDate, this.orgnizationSetting.datePipe);

        if(null != this.siborrowingAccountDetailsModel.borrowingDueDate)
          this.siborrowingAccountDetailsModel.borrowingDueDate=this.datePipe.transform(this.siborrowingAccountDetailsModel.borrowingDueDate, this.orgnizationSetting.datePipe);

        if(this.siborrowingAccountDetailsModel.signedCopyPath != null && this.siborrowingAccountDetailsModel.signedCopyPath != undefined)
          this.siborrowingAccountDetailsModel.multipartFileListsignedCopyPath = this.fileUploadService.getFile(this.siborrowingAccountDetailsModel.signedCopyPath ,ERP_TRANSACTION_CONSTANTS.BORROWINGS + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.siborrowingAccountDetailsModel.signedCopyPath);

        if(this.siborrowingAccountDetailsModel.siFileCopyPath != null && this.siborrowingAccountDetailsModel.siFileCopyPath != undefined)
          this.siborrowingAccountDetailsModel.multipartFileList = this.fileUploadService.getFile(this.siborrowingAccountDetailsModel.siFileCopyPath ,ERP_TRANSACTION_CONSTANTS.BORROWINGS + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.siborrowingAccountDetailsModel.siFileCopyPath);

        if (this.siborrowingAccountDetailsModel.siborrowingAccountMappedLoansDTOList != null && this.siborrowingAccountDetailsModel.siborrowingAccountMappedLoansDTOList.length > 0) {
          this.siborrowingMappingList = this.siborrowingAccountDetailsModel.siborrowingAccountMappedLoansDTOList;
        }
        if (this.siborrowingAccountDetailsModel.siborrowingAccountDocumentsDTOList != null && this.siborrowingAccountDetailsModel.siborrowingAccountDocumentsDTOList.length > 0) {
          this.borrowingdocumentlist = this.siborrowingAccountDetailsModel.siborrowingAccountDocumentsDTOList;

          this.borrowingdocumentlist  = this.borrowingdocumentlist.filter(obj => null != obj && null !=obj.status && obj.status === applicationConstants.ACTIVE ).map((kyc:any)=>{
            kyc.multipartFileList = this.fileUploadService.getFile(kyc.documentPath ,ERP_TRANSACTION_CONSTANTS.BORROWINGS + ERP_TRANSACTION_CONSTANTS.FILES + "/" + kyc.documentPath);
            return kyc;
          });
        }
      }
    });
  
    }
  
  fileUploader(event: any, fileUpload: FileUpload) {
    this.isFileUploaded = applicationConstants.FALSE;
    this.siborrowingAccountDetailsModel.multipartFileList = [];
    this.multipartFileList = [];
    this.siborrowingAccountDetailsModel.filesDTO = null; // Initialize as a single object
    this.siborrowingAccountDetailsModel.signedCopyPath = null;
    let file = event.files[0]; // Only one file
    let reader = new FileReader();
    reader.onloadend = (e) => {
      let filesDTO = new FileUploadModel();
      this.uploadFileData = e.target as FileReader;
      filesDTO.fileName = "SI_Borrowing_Filled_pdf"+ this.commonComponent.getTimeStamp() + "_" + file.name;
      filesDTO.fileType = file.type.split('/')[1];
      filesDTO.value = (this.uploadFileData.result as string).split(',')[1];
      filesDTO.imageValue = this.uploadFileData.result as string;
      // this.filesDTOList = [filesDTO]

      this.siborrowingAccountDetailsModel.filesDTO = filesDTO;
      this.siborrowingAccountDetailsModel.signedCopyPath = filesDTO.fileName;
      let index1 = event.files.indexOf(file);
      if (index1 > -1) {
        fileUpload.remove(event, index1);
      }
      fileUpload.clear();
    };

    reader.readAsDataURL(file);
  }
  fileRemoveEvent() {
    if (this.siborrowingAccountDetailsModel.filesDTO != null && this.siborrowingAccountDetailsModel.filesDTO != undefined && this.siborrowingAccountDetailsModel.filesDTO.length > 0) {
      let removeFileIndex = this.siborrowingAccountDetailsModel.filesDTO.findIndex((obj: any) => obj && obj.fileName === this.siborrowingAccountDetailsModel.signedCopyPath);
      this.siborrowingAccountDetailsModel.filesDTO.splice(removeFileIndex, 1);
      this.siborrowingAccountDetailsModel.signedCopyPath = null;
    }
  }

  // for submit button validation based on status
  onStatusChange(event: any) {
    if (this.siborrowingAccountDetailsModel.statusName != null && this.siborrowingAccountDetailsModel.statusName != undefined) {
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
            this.statusList = this.statusList.filter((obj: any) => obj != null && obj.name == CommonStatusData.REJECTED || obj.name == CommonStatusData.APPROVED ||
              obj.name == CommonStatusData.REQUEST_FOR_RESUBMISSION).map((status: { name: any; id: any; }) => {
            return { label: status.name, value: status.id };
            });
          }else {
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
}
