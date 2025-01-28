import { Component } from '@angular/core';
import { approvaltransactionsconstant } from '../../../approval-transactions-constant';
import { applicationConstants } from 'src/app/shared/applicationConstants';
import { CiAccountDetails } from 'src/app/transcations/borrowing-transaction/ci-borrowing/ci-borrowing-stepper/ci-account-details/shared/ci-account-details.model';
import { CiBorrowingAccountMapping } from 'src/app/transcations/borrowing-transaction/ci-borrowing/ci-borrowing-stepper/ci-borrowing-account-mapping/shared/ci-borrowing-account-mapping.model';
import { CiBorrowingDocuments } from 'src/app/transcations/borrowing-transaction/ci-borrowing/ci-borrowing-stepper/ci-borrowing-documents/shared/ci-borrowing-documents.model';
import { Responsemodel } from 'src/app/shared/responsemodel';
import { CommonComponent } from 'src/app/shared/common.component';
import { CiAccountDetailsService } from 'src/app/transcations/borrowing-transaction/ci-borrowing/ci-borrowing-stepper/ci-account-details/shared/ci-account-details.service';
import { FormBuilder } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { EncryptDecryptService } from 'src/app/shared/encrypt-decrypt.service';
import { CommonFunctionsService } from 'src/app/shared/commonfunction.service';
import { FileUploadService } from 'src/app/shared/file-upload.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { FileUpload } from 'primeng/fileupload';
import { FileUploadModel } from 'src/app/layout/mainmenu/shared/file-upload-model.model';
import { ERP_TRANSACTION_CONSTANTS } from 'src/app/transcations/erp-transaction-constants';
import { CommonCategoryService } from 'src/app/configurations/loan-config/common-category/shared/common-category.service';
import { CommonStatusData } from 'src/app/transcations/common-status-data.json';

@Component({
  selector: 'app-ci-borrowing-approval',
  templateUrl: './ci-borrowing-approval.component.html',
  styleUrls: ['./ci-borrowing-approval.component.css']
})
export class CiBorrowingApprovalComponent {
  ciborrowingAccountDetailsModel :CiAccountDetails = new CiAccountDetails();
  ciBorrowingAccountMappingModel:CiBorrowingAccountMapping = new CiBorrowingAccountMapping();
  ciBorrowingDocumentModel:CiBorrowingDocuments = new CiBorrowingDocuments();
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
  ciborrowingMappingList: any[]=[];
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
    private ciAccountDetailsService : CiAccountDetailsService, private translate: TranslateService,

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
            this.getPreviewDataByCiBorrowingAccountId();
        } 
      })
      this.getAllStatusList();
    }
  backbutton() {
    this.router.navigate([approvaltransactionsconstant.CI_BORROWING_APPROVAL_TRANSACTION_DETAILS]);
  }

  submit() {
    // Determine the status name before submission
    if (this.ciborrowingAccountDetailsModel.status != null && this.ciborrowingAccountDetailsModel.status != undefined) {
      const statusName = this.statusList.find((data: any) => data != null && data.value === this.ciborrowingAccountDetailsModel.statusName);
      if (statusName != null && statusName != undefined) {
        this.ciborrowingAccountDetailsModel.statusName = statusName.label;
      }
    } else {
      this.commonComponent.stopSpinner();
      this.msgs = [];
      this.msgs = [{ severity: 'error', detail: this.responseModel.statusMsg }];
      setTimeout(() => {
        this.msgs = [];
      }, 2000);
    }

    if (this.ciborrowingAccountDetailsModel.applicationDate != null && this.ciborrowingAccountDetailsModel.applicationDate != undefined) {
      this.ciborrowingAccountDetailsModel.applicationDate = this.commonFunctionsService.getUTCEpoch(new Date(this.ciborrowingAccountDetailsModel.applicationDate));
    }
    if (this.ciborrowingAccountDetailsModel.sanctionedDate != null && this.ciborrowingAccountDetailsModel.sanctionedDate != undefined) {
      this.ciborrowingAccountDetailsModel.sanctionedDate = this.commonFunctionsService.getUTCEpoch(new Date(this.ciborrowingAccountDetailsModel.sanctionedDate));
    }
    if (this.ciborrowingAccountDetailsModel.requestedDate != null && this.ciborrowingAccountDetailsModel.requestedDate != undefined) {
      this.ciborrowingAccountDetailsModel.requestedDate = this.commonFunctionsService.getUTCEpoch(new Date(this.ciborrowingAccountDetailsModel.requestedDate));
    }
    this.ciAccountDetailsService.updateCiAccountDetails(this.ciborrowingAccountDetailsModel).subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
        if (this.responseModel.data[0] != undefined && this.responseModel.data[0] != null && this.responseModel.data.length > 0) {
          this.ciborrowingAccountDetailsModel = this.responseModel.data[0];
          if (this.ciborrowingAccountDetailsModel.id != undefined && this.ciborrowingAccountDetailsModel.id != null)
            this.borrowingAccountId = this.ciborrowingAccountDetailsModel.id;
        
          if (this.responseModel.data[0].accountNumber != null && this.ciborrowingAccountDetailsModel.accountNumber != undefined)
            this.accountNumber = this.ciborrowingAccountDetailsModel.accountNumber;         
        }
        this.msgs = [{ severity: 'success', summary: applicationConstants.STATUS_SUCCESS, detail: this.responseModel.statusMsg }];
        setTimeout(() => {
          this.msgs = [];
        }, 1200);
        this.router.navigate([approvaltransactionsconstant.CI_BORROWING_APPROVAL_TRANSACTION_DETAILS]);
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
  
  getPreviewDataByCiBorrowingAccountId() {
    this.ciAccountDetailsService.getPreviewDataByCiBorrowingAccountId(this.borrowingAccountId).subscribe(res => {
      this.responseModel = res;
      if(this.ciborrowingAccountDetailsModel.sanctionedDate != undefined && this.ciborrowingAccountDetailsModel.sanctionedDate != null)
        this.ciborrowingAccountDetailsModel.sanctionedDate = this.commonFunctionsService.getUTCEpoch(new Date(this.ciborrowingAccountDetailsModel.sanctionedDate));
      if (this.responseModel != null && this.responseModel != undefined) {
        this.ciborrowingAccountDetailsModel = this.responseModel.data[0];

        if(null != this.ciborrowingAccountDetailsModel.sanctionedDate)
       this.ciborrowingAccountDetailsModel.sanctionedDate=this.datePipe.transform(this.ciborrowingAccountDetailsModel.sanctionedDate, this.orgnizationSetting.datePipe);

        if(null != this.ciborrowingAccountDetailsModel.applicationDate)
          this.ciborrowingAccountDetailsModel.applicationDate=this.datePipe.transform(this.ciborrowingAccountDetailsModel.applicationDate, this.orgnizationSetting.datePipe);


        if(null != this.ciborrowingAccountDetailsModel.requestedDate)
          this.ciborrowingAccountDetailsModel.requestedDate=this.datePipe.transform(this.ciborrowingAccountDetailsModel.requestedDate, this.orgnizationSetting.datePipe);


        if(null != this.ciborrowingAccountDetailsModel.borrowingDueDate)
          this.ciborrowingAccountDetailsModel.borrowingDueDate=this.datePipe.transform(this.ciborrowingAccountDetailsModel.borrowingDueDate, this.orgnizationSetting.datePipe);

        if(this.ciborrowingAccountDetailsModel.signedCopyPath != null && this.ciborrowingAccountDetailsModel.signedCopyPath != undefined)
          this.ciborrowingAccountDetailsModel.multipartFileListsignedCopyPath = this.fileUploadService.getFile(this.ciborrowingAccountDetailsModel.signedCopyPath ,ERP_TRANSACTION_CONSTANTS.BORROWINGS + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.ciborrowingAccountDetailsModel.signedCopyPath);

        if(this.ciborrowingAccountDetailsModel.ciFileCopyPath != null && this.ciborrowingAccountDetailsModel.ciFileCopyPath != undefined)
          this.ciborrowingAccountDetailsModel.multipartFileList = this.fileUploadService.getFile(this.ciborrowingAccountDetailsModel.ciFileCopyPath ,ERP_TRANSACTION_CONSTANTS.BORROWINGS + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.ciborrowingAccountDetailsModel.ciFileCopyPath);

        if (this.ciborrowingAccountDetailsModel.ciBorrowingAccountMappedLoansDTOList != null && this.ciborrowingAccountDetailsModel.ciBorrowingAccountMappedLoansDTOList.length > 0) {
          this.ciborrowingMappingList = this.ciborrowingAccountDetailsModel.ciBorrowingAccountMappedLoansDTOList;
        }
        if (this.ciborrowingAccountDetailsModel.ciBorrowingAccountDocumentsDTOList != null && this.ciborrowingAccountDetailsModel.ciBorrowingAccountDocumentsDTOList.length > 0) {
          this.borrowingdocumentlist = this.ciborrowingAccountDetailsModel.ciBorrowingAccountDocumentsDTOList;

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
    this.ciborrowingAccountDetailsModel.multipartFileList = [];
    this.multipartFileList = [];
    this.ciborrowingAccountDetailsModel.filesDTO = null; // Initialize as a single object
    this.ciborrowingAccountDetailsModel.signedCopyPath = null;
    let file = event.files[0]; // Only one file
    let reader = new FileReader();
    reader.onloadend = (e) => {
      let filesDTO = new FileUploadModel();
      this.uploadFileData = e.target as FileReader;
      filesDTO.fileName = "CI_Borrowing_Filled_pdf"+ this.commonComponent.getTimeStamp() + "_" + file.name;
      filesDTO.fileType = file.type.split('/')[1];
      filesDTO.value = (this.uploadFileData.result as string).split(',')[1];
      filesDTO.imageValue = this.uploadFileData.result as string;
      // this.filesDTOList = [filesDTO]

      this.ciborrowingAccountDetailsModel.filesDTO = filesDTO;
      this.ciborrowingAccountDetailsModel.signedCopyPath = filesDTO.fileName;
      let index1 = event.files.indexOf(file);
      if (index1 > -1) {
        fileUpload.remove(event, index1);
      }
      fileUpload.clear();
    };

    reader.readAsDataURL(file);
  }
  fileRemoveEvent() {
    if (this.ciborrowingAccountDetailsModel.filesDTO != null && this.ciborrowingAccountDetailsModel.filesDTO != undefined && this.ciborrowingAccountDetailsModel.filesDTO.length > 0) {
      let removeFileIndex = this.ciborrowingAccountDetailsModel.filesDTO.findIndex((obj: any) => obj && obj.fileName === this.ciborrowingAccountDetailsModel.signedCopyPath);
      this.ciborrowingAccountDetailsModel.filesDTO.splice(removeFileIndex, 1);
      this.ciborrowingAccountDetailsModel.signedCopyPath = null;
    }
  }

  // for submit button validation based on status
  onStatusChange(event: any) {
    if (this.ciborrowingAccountDetailsModel.statusName != null && this.ciborrowingAccountDetailsModel.statusName != undefined) {
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
