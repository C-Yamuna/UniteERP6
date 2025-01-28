import { Component } from '@angular/core';
import { SiBorrowingAccountDetails } from '../si-borrowing-stepper/shared/siborrowing.model';
import { SiBorrowingAccountMapping } from '../si-borrowing-stepper/si-borrowing-account-mapping/shared/si-borrowing-account-mapping.model';
import { SiBorrowingDocument } from '../si-borrowing-stepper/si-borrowing-document/shared/si-borrowing-document.model';
import { Responsemodel } from 'src/app/shared/responsemodel';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonFunctionsService } from 'src/app/shared/commonfunction.service';
import { CommonComponent } from 'src/app/shared/common.component';
import { EncryptDecryptService } from 'src/app/shared/encrypt-decrypt.service';
import { SiBorrowingAccountMappingService } from '../si-borrowing-stepper/si-borrowing-account-mapping/shared/si-borrowing-account-mapping.service';
import { SiBorrowingDocumentService } from '../si-borrowing-stepper/si-borrowing-document/shared/si-borrowing-document.service';
import { DatePipe } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { SiBorrowingStepperService } from '../si-borrowing-stepper/shared/si-borrowing-stepper.service';
import { applicationConstants } from 'src/app/shared/applicationConstants';
import { BorrowingTransactionConstant } from '../../borrowing-transaction-constants';
import { ERP_TRANSACTION_CONSTANTS } from 'src/app/transcations/erp-transaction-constants';
import { FileUploadService } from 'src/app/shared/file-upload.service';
import { CommonStatusData } from 'src/app/transcations/common-status-data.json';
import { approvaltransactionsconstant } from 'src/app/transcations/approval-transcations/approval-transactions-constant';
import { FileUpload } from 'primeng/fileupload';
import { FileUploadModel } from 'src/app/layout/mainmenu/shared/file-upload-model.model';

@Component({
  selector: 'app-si-view-borrowing',
  templateUrl: './si-view-borrowing.component.html',
  styleUrls: ['./si-view-borrowing.component.css']
})
export class SiViewBorrowingComponent {
  orgnizationSetting:any;
  siborrowingAccountDetailsModel :SiBorrowingAccountDetails = new SiBorrowingAccountDetails();
  SiBorrowingAccountMappingModel:SiBorrowingAccountMapping = new SiBorrowingAccountMapping();
  SiBorrowingDocumentModel:SiBorrowingDocument = new SiBorrowingDocument();
  borrowingaccountmapping: any[] = [];
  borrowingdocument: any[] = [];
  statusList: any[]=[];
 
  responseModel!: Responsemodel;
  msgs: any[]=[];
  editbtn: boolean = true;
  isEdit: any;
  buttonDisabled?: any;
  countryList: any[]=[];
  memberLandDetails: any;
  siborrowingMappingList: any[]=[];
  borrowingAccountId:any;
  borrowingdocumentlist: any[]=[];
  isShowSubmit: boolean =applicationConstants.FALSE;
  isDisableSubmit: boolean = false;
  isFileUploaded: any;
  multipleFilesList: any[] = [];
  uploadFileData: any;
  roleName: any;
  accountNumber: any;
  viewButton: boolean = false;
  editFlag: boolean = false;
  multipartFileList: any[] = [];
  constructor(private router:Router, 
    private commonFunctionsService: CommonFunctionsService,private activateRoute: ActivatedRoute,
    private encryptService: EncryptDecryptService,private commonComponent: CommonComponent,
    private siBorrowingAccountMappingService:SiBorrowingAccountMappingService,
    private siBorrowingDocumentService:SiBorrowingDocumentService,
    private SiBorrowingStepperService : SiBorrowingStepperService,
    private datePipe: DatePipe,private translate: TranslateService,private fileUploadService :FileUploadService
  ){
    this.borrowingaccountmapping = [
      { field: 'loanMemberAdmissionNumber', header: 'BORROWINGSTRANSACTIONS.ADMISSION_NUMBER' },
      { field: 'loanAccountNumber', header: 'BORROWINGSTRANSACTIONS.LOAN_ACCOUNT_NUMBER' },
      { field: '', header: 'BORROWINGSTRANSACTIONS.NAME' },
      { field: '', header: 'BORROWINGSTRANSACTIONS.DATE_OF_BIRTH' },
      { field: '',header:'BORROWINGSTRANSACTIONS.AADHAR_NUMBER'},
      { field: '',header:'BORROWINGSTRANSACTIONS.PURPOSE'},
      { field: 'loanAmount',header:'BORROWINGSTRANSACTIONS.REQUESTED_AMOUNT'},
     
    ];
    // this.borrowingdocument = [
    //   { field: 'documentTypeName', header: 'BORROWINGSTRANSACTIONS.DOCUMENT_TYPE' },
    //   { field: 'documentNumber', header: 'BORROWINGSTRANSACTIONS.DOCUMENT_NO' },
    //   { field: '', header: 'BORROWINGSTRANSACTIONS.FILE_PATH' },
    //   { field: '', header: 'BORROWINGSTRANSACTIONS.REMARKS' },
      
     
    // ];
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
      this.borrowingAccountId = this.encryptService.decrypt(params['id']);
    if (params['editbtn'] != undefined && params['editbtn'] != null) {
      let isEditParam = this.encryptService.decrypt(params['editbtn']);
      if (isEditParam == "1") {
        this.editbtn = true;
      } else {
        this.editbtn = false;
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
    this.isEdit = true;
    this.SiBorrowingStepperService.getPreviewDataBySiBorrowingAccountId(this.borrowingAccountId).subscribe(res => {
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
  } else {
    this.isEdit = false;
  }
})
})
}


submit() {
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
  
  this.siborrowingAccountDetailsModel.status = 5;
  this.siborrowingAccountDetailsModel.statusName = CommonStatusData.SUBMISSION_FOR_APPROVAL;
  this.SiBorrowingStepperService.updateSiBorrowingStepper(this.siborrowingAccountDetailsModel).subscribe((response: any) => {
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
      this.router.navigate([BorrowingTransactionConstant.SI_BORROWINGS]);
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
navigateToBack() {
if (this.roleName == "Manager") {
  this.router.navigate([approvaltransactionsconstant.SI_BORROWING_APPROVAL_TRANSACTION_DETAILS]);
} else {
  this.router.navigate([BorrowingTransactionConstant.SI_BORROWINGS]);
}
}
editSiBorrowingDetails(rowData: any, activeIndex: any) {
switch (activeIndex) {
  case 0:
    this.router.navigate([BorrowingTransactionConstant.SI_ACCOUNT_DETAILS], { queryParams: { id: this.encryptService.encrypt(rowData.id) } });
    break;
  case 1:
    this.router.navigate([BorrowingTransactionConstant.SI_BORROWING_ACCOUNT_MAPPING], { queryParams: { id: this.encryptService.encrypt(rowData.id) } });
    break;
  case 2:
    this.router.navigate([BorrowingTransactionConstant.SI_BORROWING_DOCUMENT], { queryParams: { id: this.encryptService.encrypt(rowData.id) } });
    break;
}
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
  this.isDisableSubmit = true;
}
}

pdfDownload() {
//   this.commonComponent.startSpinner();
//   this.fdNonCumulativeApplicationService.downloadPreviewPDf(this.fdNonCummulativeAccId).subscribe((data: any) => {
//     var file = new Blob([data], { type: 'application/pdf' });
//     saveAs(file, "CI_Borrowing_application_filled_Document.pdf");
//     this.msgs = [];
//     this.msgs.push({ severity: "success", detail: 'CI Borrowing application file downloaded successfully' });
//     this.commonComponent.stopSpinner();
//   }, error => {
//     this.msgs = [];
//     this.commonComponent.stopSpinner();
//     this.msgs.push({ severity: "error", detail: 'Unable to download filled Ci Borrowing Application' });
//   })
 
}

}
