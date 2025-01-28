import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { FileUpload } from 'primeng/fileupload';
import { CommonCategoryService } from 'src/app/configurations/loan-config/common-category/shared/common-category.service';
import { FileUploadModel } from 'src/app/layout/mainmenu/shared/file-upload-model.model';
import { applicationConstants } from 'src/app/shared/applicationConstants';
import { CommonComponent } from 'src/app/shared/common.component';
import { CommonFunctionsService } from 'src/app/shared/commonfunction.service';
import { EncryptDecryptService } from 'src/app/shared/encrypt-decrypt.service';
import { FileUploadService } from 'src/app/shared/file-upload.service';
import { Responsemodel } from 'src/app/shared/responsemodel';
import { CommonStatusData } from 'src/app/transcations/common-status-data.json';
import { ERP_TRANSACTION_CONSTANTS } from 'src/app/transcations/erp-transaction-constants';
import { Loantransactionconstant } from 'src/app/transcations/loan-transcation/loan-transaction-constant';
import { SiLoanApplication } from 'src/app/transcations/loan-transcation/shared/si-loans/si-loan-application.model';
import { SiLoanApplicationService } from 'src/app/transcations/loan-transcation/shared/si-loans/si-loan-application.service';
import { SiLoanCommunication } from 'src/app/transcations/loan-transcation/shared/si-loans/si-loan-communication.model';
import { SiLoanDocuments } from 'src/app/transcations/loan-transcation/shared/si-loans/si-loan-documents.model';
import { SiLoanGenealogyTree } from 'src/app/transcations/loan-transcation/shared/si-loans/si-loan-genealogy-tree.model';
import { SiLoanGuarantor } from 'src/app/transcations/loan-transcation/shared/si-loans/si-loan-guarantor.model';
import { SiLoanGuardian } from 'src/app/transcations/loan-transcation/shared/si-loans/si-loan-guardian.model';
import { SiLoanInsuranceDetails } from 'src/app/transcations/loan-transcation/shared/si-loans/si-loan-insurance-details.model';
import { MemberGroupDetailsModel, MembershipBasicRequiredDetails, MembershipInstitutionDetailsModel } from 'src/app/transcations/loan-transcation/shared/si-loans/si-loan-membership-details.model';
import { SiLoanNominee } from 'src/app/transcations/loan-transcation/shared/si-loans/si-loan-nominee.model';
import { SiLoanInterestPolicy, SiLoanProductDefinition } from 'src/app/transcations/loan-transcation/shared/si-loans/si-loan-product-definition.model';
import { SiProductDefinitionService } from 'src/app/transcations/loan-transcation/shared/si-loans/si-product-definition.service';
import { approvaltransactionsconstant } from '../../../approval-transactions-constant';

@Component({
  selector: 'app-si-loan-approval',
  templateUrl: './si-loan-approval.component.html',
  styleUrls: ['./si-loan-approval.component.css']
})
export class SiLoanApprovalComponent {
  siOtherLoansDetailsList: any[] = [];
  saoOtherLoansDetails: any;
  loanGuarantorDetails: any;
  landMortagageDetails: any;
  loansDocuments: any;
  saoLoanDocumentList: any[] = [];
  loanGeneologyTree: any;
  saoLoanGeneologyTreeList: any[] = [];
  responseModel!: Responsemodel;
  id: any;
  msgs: any[] = [];
  isEdit: any;
  buttonDisabled?: any;
  orgnizationSetting: any;
  statusList: any[] = [];
  loanGuarantorDetailsList: any[] = [];
  flag: boolean = false;
  
  memberTypeName: any;
  membershipBasicRequiredDetailsModel: MembershipBasicRequiredDetails = new MembershipBasicRequiredDetails();
  memberGroupDetailsModel: MemberGroupDetailsModel = new MemberGroupDetailsModel();
  membershipInstitutionDetailsModel: MembershipInstitutionDetailsModel = new MembershipInstitutionDetailsModel();
  siLoanApplicationModel: SiLoanApplication = new SiLoanApplication();
  siLoanCommunicationModel: SiLoanCommunication = new SiLoanCommunication();
  siLoanNomineeModel: SiLoanNominee = new SiLoanNominee();
  siLoanGuardianModel: SiLoanGuardian = new SiLoanGuardian();
  siLoanGuarantorModel: SiLoanGuarantor = new SiLoanGuarantor();
  siLoanDocumentsModel: SiLoanDocuments = new SiLoanDocuments();
  siLoanGenealogyTreeModel: SiLoanGenealogyTree = new SiLoanGenealogyTree();
  siLoanInsuranceDetailsModel: SiLoanInsuranceDetails = new SiLoanInsuranceDetails();
  siLoanProductDefinitionModel: SiLoanProductDefinition = new SiLoanProductDefinition();
  siLoanInterestPolicyModel: SiLoanInterestPolicy = new SiLoanInterestPolicy();
  admissionNumber: any;
  addressOne: any;
  addressTwo: any;
  kycGridList: any[] = [];
  groupPrmoters : any[] = [];
  groupPrmotersList: any[]=[];
  institionPromotersList: any[]=[];
  jointHoldersFlag: boolean = false;
  jointHolderDetailsList: any[] = [];
  institutionPromoterFlag: boolean = false;
  groupPromotersPopUpFlag: boolean = false;
  membreIndividualFlag: boolean = false;
  memberPhotoCopyZoom: boolean = false;
  photoCopyFlag: boolean = true;
  signatureCopyFlag: boolean = true;
  loanId: any;
  isKycApproved : any;
  columns: any[] = [];
  siLoanLandMortgageDetailsDTOList: any[] = [];
  memberTypeId: any;
  isShowSubmit: boolean =applicationConstants.FALSE;
  uploadFileData: any;
  isDisableSubmit: boolean = false;
  isFileUploaded: any;
  multipleFilesList: any;
  preveiwFalg:  boolean = false;
  editOpt: Boolean = true;
  filesDTO: any[] = [];
  constructor(private router: Router, private activateRoute: ActivatedRoute,private commonStatusService:CommonCategoryService,
    private encryptService: EncryptDecryptService, private siLoanApplicationService: SiLoanApplicationService, private commonComponent: CommonComponent,
    private commonFunctionsService: CommonFunctionsService, private datePipe: DatePipe, private encryptDecryptService: EncryptDecryptService,
    private siProductDefinitionService: SiProductDefinitionService,private translate: TranslateService,private fileUploadService :FileUploadService,) {
    this.saoOtherLoansDetails = [
      { field: 'bankName', header: 'BANK NAME' },
      { field: 'acNo', header: 'ACCOUNT NUMBER' },
      { field: 'loanAmount', header: 'LOAN AMOUNT' },
      { field: 'Outstanding Amount()', header: 'OUTSTANDING AMOUNT' },
      { field: 'Loan Date', header: 'LOAN DATE' },
      { field: 'dueDate', header: 'LOAN DUE DATE' },

    ];
    this.loanGuarantorDetails = [
      //{ field: 'admissionNo', header: 'ADMISSION NUMBER' },
      { field: 'name', header: 'NAME' },
     // { field: 'fatherSpouseName', header: 'FATHER/SPOUSE NAME' },
      { field: 'aadharNumber', header: 'AADHAR NUMBER' },
     // { field: 'panNo', header: 'PAN NUMBER' },
      { field: 'mobileNumber', header: 'MOBILE NUMBER' },
      { field: 'email', header: 'EMAIL' },
     // { field: 'occupation', header: 'OCCUPATION' },
     // { field: 'income', header: 'INCOME' },
     // { field: 'Address', header: 'ADDRESS' },
     // { field: 'Upload', header: 'UPLOAD' },
    ];
    this.loansDocuments = [
      { field: 'documentType', header: 'DOCUMENT TYPE' },
      { field: 'documentNo', header: 'DOCUMENT NO' },
      { field: 'filePath', header: 'FILE PATH' },
      { field: 'remarks', header: 'REMARKS' },
    ];
    this.loanGeneologyTree = [
      { field: 'name', header: 'NAME' },
      { field: 'relationWithApplicantName', header: 'RELATION WITH APPLICANT' },
      { field: 'remarks', header: 'REMARKS' },
    ];
    this.landMortagageDetails = [
      { field: 'passbookNumber', header: 'PASSBOOK NUMBER' },
      { field: 'surveyNo', header: 'SURVEY NO' },
      { field: 'landTypeName', header: 'LAND TYPE' },
      { field: 'declaredLandUnits', header: 'DECLARED LAND UNITS' },
      { field: 'declaredLandSubUnits', header: 'DECLARED LAND SUB UNITS' },
      { field: 'value', header: 'VALUE' },
      { field: 'documentPath', header: 'DOCUMENT PATH' },
      { field: 'remarks', header: 'REMARKS' },
    ];
    this.groupPrmoters = [
      { field: 'surname', header: 'surname' },
      { field: 'name', header: 'name' },
      { field: 'operatorTypeName', header: 'operation type name' },
      { field: 'memDobVal', header: 'member Date Of Birth' },
      { field: 'age', header: 'age' },
      { field: 'genderName', header: 'gender name' },
      { field: 'maritalStatusName', header: 'marital status' },
      { field: 'mobileNumber', header: 'mobile number' },
      { field: 'emailId', header: 'email' },
      { field: 'aadharNumber', header: 'aadhar' },
      { field: 'startDate', header: 'start date' },
    ];
    this.columns = [
      { field: 'surname', header: 'SURNAME' },
      { field: 'name', header: 'NAME' },
      { field: 'operatorTypeName', header: 'operation Type Name' },
      { field: 'memDobVal', header: 'Date Of Birth' },
      { field: 'age', header: 'age' },
      { field: 'genderName', header: 'gender Name' },
      { field: 'maritalStatusName', header: 'marital status' },
      { field: 'mobileNumber', header: 'mobile Number' },
      { field: 'emailId', header: 'email' },
      { field: 'aadharNumber', header: 'aadhar' },
      { field: 'startDate', header: 'start date' },
    ];
    this.statusList = [
      { label: 'Approved', value: 'Approved' },
      { label: 'Rejected', value: 'Rejected' },
      { label: 'Inprogress', value: 'Inprogress' },
      { label: 'Request for Resubmission', value: 'Request for Resubmission' },
      { label: 'Closed', value: 'Closed' }
    ]
  }
  ngOnInit() {
    // this.getAllStatusList();
    this.orgnizationSetting = this.commonComponent.orgnizationSettings()
    this.translate.use(this.commonFunctionsService.getStorageValue('language'));
    this.activateRoute.queryParams.subscribe(params => {
      if (params['id'] != undefined || params['editOpt'] != undefined) {
        this.commonComponent.startSpinner();
        let id = this.encryptService.decrypt(params['id']);
        let idEdit = this.encryptDecryptService.decrypt(params['editOpt']);
        this.loanId = Number(id);

        if (idEdit == "1"){
          this.preveiwFalg = true;
          this.editOpt = true;
        }else if(idEdit == "2"){
          this.editOpt = false;
          this.preveiwFalg = true;
        }else{
          this.preveiwFalg = false;
          this.editOpt = false;
        }
        if (params['isGridPage'] != undefined && params['isGridPage'] != null) {
          let isGrid = this.encryptService.decrypt(params['isGridPage']);
          if (isGrid === "0") {
            this.isShowSubmit = applicationConstants.FALSE;
          } else {
            this.isShowSubmit = applicationConstants.TRUE;
          }
        }
        this.getPreviewDetails();
      } 
    })
  }

  getPreviewDetails(){
    this.siLoanApplicationService.getSILoanApplicationById(this.loanId).subscribe(res => {
      this.responseModel = res;
      this.siLoanApplicationModel = this.responseModel.data;
      if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
        if(this.responseModel.data[0].admissionNo != null && this.responseModel.data[0].admissionNo != undefined){
        this.admissionNumber = this.responseModel.data[0].admissionNo;
        this.id = this.responseModel.data[0].id;
        this.memberTypeName = this.responseModel.data[0].memberTypeName;
        this.memberTypeId = this.responseModel.data[0].memberTypeId;
      }
      }
     
      this.commonComponent.stopSpinner();
      if (this.siLoanApplicationModel.applicationDateVal != undefined && this.siLoanApplicationModel.applicationDateVal != null)
        this.siLoanApplicationModel.applicationDate = this.commonFunctionsService.getUTCEpoch(new Date(this.siLoanApplicationModel.applicationDateVal));

      if (this.siLoanApplicationModel.loanDueDateVal != undefined && this.siLoanApplicationModel.loanDueDateVal != null)
        this.siLoanApplicationModel.loanDueDate = this.commonFunctionsService.getUTCEpoch(new Date(this.siLoanApplicationModel.loanDueDateVal));

      if (this.responseModel.status == applicationConstants.STATUS_SUCCESS && this.responseModel.data && this.responseModel.data.length > 0) {
        this.siLoanApplicationModel = this.responseModel.data[0];

        this.getProductDetailsById(this.siLoanApplicationModel.siProductId);

        if (null != this.siLoanApplicationModel.applicationDate)
          this.siLoanApplicationModel.applicationDateVal = this.datePipe.transform(this.siLoanApplicationModel.applicationDate, this.orgnizationSetting.datePipe);

        if (null != this.siLoanApplicationModel.loanDueDate)
          this.siLoanApplicationModel.loanDueDateVal = this.datePipe.transform(this.siLoanApplicationModel.loanDueDate, this.orgnizationSetting.datePipe);

        if (this.siLoanApplicationModel.siLoanLandMortgageDetailsDTOList!= null && this.siLoanApplicationModel.siLoanLandMortgageDetailsDTOList!= undefined) {
            this.siLoanLandMortgageDetailsDTOList = this.siLoanApplicationModel.siLoanLandMortgageDetailsDTOList;
            this.siLoanLandMortgageDetailsDTOList = this.siLoanApplicationModel.siLoanLandMortgageDetailsDTOList.map((land: any) => {
              if (land != null && land != undefined && land.documentPath != null && land.documentPath != undefined) {
                land.requestedDocPathMultipartFileList = this.fileUploadService.getFile(land.documentPath , ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.FILES + "/" + land.documentPath);
              }
               return land
            });
        }

        if (this.siLoanApplicationModel.siLoanInsuranceDetailsDTO != null && this.siLoanApplicationModel.siLoanInsuranceDetailsDTO != undefined) {
          this.siLoanInsuranceDetailsModel = this.siLoanApplicationModel.siLoanInsuranceDetailsDTO;
        }

        if (this.siLoanApplicationModel.siOtherMortgageDetailsDTOList != null && this.siLoanApplicationModel.siOtherMortgageDetailsDTOList.length > 0) {
          this.siOtherLoansDetailsList = this.siLoanApplicationModel.siOtherMortgageDetailsDTOList;
        }

        if (this.siLoanApplicationModel.siLoanGuarantorDetailsDTOList != null && this.siLoanApplicationModel.siLoanGuarantorDetailsDTOList.length > 0) {
          this.loanGuarantorDetailsList = this.siLoanApplicationModel.siLoanGuarantorDetailsDTOList;
        }

        if (this.siLoanApplicationModel.siLoanDocumentsDetailsDTOList != null && this.siLoanApplicationModel.siLoanDocumentsDetailsDTOList.length > 0) {
          this.saoLoanDocumentList = this.siLoanApplicationModel.siLoanDocumentsDetailsDTOList;
          for (let document of this.saoLoanDocumentList) {
            if(document.filePath != null && document.filePath != undefined){
              document.multipartFileList  = this.fileUploadService.getFile(document.filePath ,ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.FILES + "/" + document.filePath);
            }
          } 
        }

        if (this.siLoanApplicationModel.siLoanGenealogyTreeDTOList != null && this.siLoanApplicationModel.siLoanGenealogyTreeDTOList.length > 0) {
          this.saoLoanGeneologyTreeList = this.siLoanApplicationModel.siLoanGenealogyTreeDTOList;
        }
        if (this.siLoanApplicationModel.siLoanNomineeDetailsDTO != null && this.siLoanApplicationModel.siLoanNomineeDetailsDTO != undefined) {
          this.siLoanNomineeModel = this.siLoanApplicationModel.siLoanNomineeDetailsDTO;

            if(this.siLoanNomineeModel.nomineeFilePath != null && this.siLoanNomineeModel.nomineeFilePath != undefined){
              this.siLoanNomineeModel.nomineeFilePath =  this.fileUploadService.getFile(this.siLoanNomineeModel.nomineeFilePath , ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.siLoanNomineeModel.nomineeFilePath);
            }
        }

        if (this.siLoanApplicationModel.individualMemberDetailsDTO != null && this.siLoanApplicationModel.individualMemberDetailsDTO != undefined) {
          this.membershipBasicRequiredDetailsModel = this.siLoanApplicationModel.individualMemberDetailsDTO;
          if (this.membershipBasicRequiredDetailsModel.admissionDate != null && this.membershipBasicRequiredDetailsModel.admissionDate != undefined) {
            this.membershipBasicRequiredDetailsModel.admissionDateVal = this.datePipe.transform(this.membershipBasicRequiredDetailsModel.admissionDate, this.orgnizationSetting.datePipe);
          }
          if (this.membershipBasicRequiredDetailsModel.dob != null && this.membershipBasicRequiredDetailsModel.dob != undefined) {
            this.membershipBasicRequiredDetailsModel.dobVal = this.datePipe.transform(this.membershipBasicRequiredDetailsModel.dob, this.orgnizationSetting.datePipe);
          }
          if (this.membershipBasicRequiredDetailsModel.photoCopyPath != null && this.membershipBasicRequiredDetailsModel.photoCopyPath != undefined) {
            this.membershipBasicRequiredDetailsModel.multipartFileListForPhotoCopy = this.fileUploadService.getFile(this.membershipBasicRequiredDetailsModel.photoCopyPath ,ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.membershipBasicRequiredDetailsModel.photoCopyPath  );
          }
          else{
            this.photoCopyFlag = false;
          }
          if (this.membershipBasicRequiredDetailsModel.signatureCopyPath != null && this.membershipBasicRequiredDetailsModel.signatureCopyPath != undefined) {
              this.membershipBasicRequiredDetailsModel.multipartFileListForsignatureCopyPath = this.fileUploadService.getFile(this.membershipBasicRequiredDetailsModel.signatureCopyPath ,ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.membershipBasicRequiredDetailsModel.signatureCopyPath  );
          }
          else{
            this.signatureCopyFlag = false;
          }
          
          if (this.membershipBasicRequiredDetailsModel.isKycApproved != null && this.membershipBasicRequiredDetailsModel.isKycApproved != undefined && this.membershipBasicRequiredDetailsModel.isKycApproved) {
            this.isKycApproved = applicationConstants.KYC_APPROVED_NAME;
          }
          else {
            this.isKycApproved = applicationConstants.KYC_NOT_APPROVED_NAME;
          }
        }
        if (this.siLoanApplicationModel.memberGroupDetailsDTO != null && this.siLoanApplicationModel.memberGroupDetailsDTO != undefined) {
          this.memberGroupDetailsModel = this.siLoanApplicationModel.memberGroupDetailsDTO;
          
          if (this.memberGroupDetailsModel.groupPromotersDTOList != null && this.memberGroupDetailsModel.groupPromotersDTOList != undefined && this.memberGroupDetailsModel.groupPromotersDTOList.length > 0) {
            this.groupPrmotersList=this.memberGroupDetailsModel.groupPromotersDTOList ;
          }
          if (this.memberGroupDetailsModel.registrationDate != null && this.memberGroupDetailsModel.registrationDate != undefined) {
            this.memberGroupDetailsModel.registrationDateVal = this.datePipe.transform(this.memberGroupDetailsModel.registrationDate, this.orgnizationSetting.datePipe);
          }
          if (this.memberGroupDetailsModel.admissionDate != null && this.memberGroupDetailsModel.admissionDate != undefined) {
            this.memberGroupDetailsModel.admissionDateVal = this.datePipe.transform(this.memberGroupDetailsModel.admissionDate, this.orgnizationSetting.datePipe);
          }
          if (this.memberGroupDetailsModel.isKycCompleted != null && this.memberGroupDetailsModel.isKycCompleted != undefined) {
            this.isKycApproved = applicationConstants.KYC_APPROVED_NAME;
          }
          else {
            this.isKycApproved = applicationConstants.KYC_NOT_APPROVED_NAME;
          }
        }

        if (this.siLoanApplicationModel.memberInstitutionDTO != null && this.siLoanApplicationModel.memberInstitutionDTO != undefined) {
          this.membershipInstitutionDetailsModel = this.siLoanApplicationModel.memberInstitutionDTO;
          
          if (this.membershipInstitutionDetailsModel.registrationDate != null && this.membershipInstitutionDetailsModel.registrationDate != undefined) {
            this.membershipInstitutionDetailsModel.registrationDateVal = this.datePipe.transform(this.membershipInstitutionDetailsModel.registrationDate, this.orgnizationSetting.datePipe);
          }
          if (this.membershipInstitutionDetailsModel.admissionDate != null && this.membershipInstitutionDetailsModel.admissionDate != undefined) {
            this.membershipInstitutionDetailsModel.admissionDateVal = this.datePipe.transform(this.membershipInstitutionDetailsModel.admissionDate, this.orgnizationSetting.datePipe);
          }
          if (this.membershipInstitutionDetailsModel.institutionPromoterList != null && this.membershipInstitutionDetailsModel.institutionPromoterList != undefined && this.membershipInstitutionDetailsModel.institutionPromoterList.length > 0) {
            this.institionPromotersList=this.membershipInstitutionDetailsModel.institutionPromoterList ;
          }
          // if (this.membershipInstitutionDetailsModel.isKycCompleted != null && this.membershipInstitutionDetailsModel.isKycCompleted != undefined) {
          //   this.isKycApproved = applicationConstants.KYC_APPROVED_NAME;
          // }
          else {
            this.isKycApproved = applicationConstants.KYC_NOT_APPROVED_NAME;
          }
        }

        if(this.siLoanApplicationModel.siLoanKycDetailsDTOList != null && this.siLoanApplicationModel.siLoanKycDetailsDTOList != undefined){
          this.kycGridList = this.siLoanApplicationModel.siLoanKycDetailsDTOList;
          for (let kyc of this.kycGridList) {
            if(kyc.kycFilePath != null && kyc.kycFilePath != undefined){
              if(kyc.kycFilePath != null && kyc.kycFilePath != undefined){
                kyc.multipartFileList = this.fileUploadService.getFile(kyc.kycFilePath ,ERP_TRANSACTION_CONSTANTS.MEMBERSHIP + ERP_TRANSACTION_CONSTANTS.FILES + "/" + kyc.kycFilePath);

              }
            }  
          }
        }

        if(this.siLoanApplicationModel.siLoanCommunicationDTOList != null && this.siLoanApplicationModel.siLoanCommunicationDTOList != undefined)
          this.siLoanCommunicationModel= this.siLoanApplicationModel.siLoanCommunicationDTOList;
        if(this.siLoanApplicationModel.siLoanCoApplicantDetailsDTOList != null && this.siLoanApplicationModel.siLoanCoApplicantDetailsDTOList != undefined){
          this.jointHoldersFlag = true;
          this.jointHolderDetailsList = this.siLoanApplicationModel.siLoanCoApplicantDetailsDTOList;
          if(this.jointHolderDetailsList != null && this.jointHolderDetailsList != undefined){
            this.jointHolderDetailsList = this.jointHolderDetailsList;
            for(let joint of this.jointHolderDetailsList){
              joint.admissionDateVal = this.datePipe.transform(this.jointHolderDetailsList[0].admissionDate, this.orgnizationSetting.datePipe);
            }  
          }
        }

        if(this.siLoanApplicationModel.applicationPath != null && this.siLoanApplicationModel.applicationPath != undefined){
          this.siLoanApplicationModel.multipartFileList = this.fileUploadService.getFile(this.siLoanApplicationModel.applicationPath ,ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.siLoanApplicationModel.applicationPath);
          this.isDisableSubmit = false;
        }
        else{
          this.isDisableSubmit = true;
        }

      }

    });
  }
  
  // imageUploader(event: any, fileUpload: FileUpload) {
  //   this.isFileUploaded = applicationConstants.FALSE;
  //   this.siLoanApplicationModel.multipartFileList = [];
  //   this.multipleFilesList = [];
  //   this.siLoanApplicationModel.filesDTO = null; // Initialize as a single object
  //   this.siLoanApplicationModel.applicationPath = null;
  //   let file = event.files[0]; // Only one file
  //   let reader = new FileReader();
  //   reader.onloadend = (e) => {
  //     let filesDTO = new FileUploadModel();
  //     this.uploadFileData = e.target as FileReader;
  //     filesDTO.fileName = "SI_LOAN_DETAILS_" + this.loanId + "_" + this.commonComponent.getTimeStamp() + "_" + file.name;
  //     filesDTO.fileType = file.type.split('/')[1];
  //     filesDTO.value = (this.uploadFileData.result as string).split(',')[1];
  //     filesDTO.imageValue = this.uploadFileData.result as string;
  //     // this.filesDTO = [filesDTO]
  //     // this.siLoanApplicationModel.filesDTO = this.filesDTO;
  //     // this.siLoanApplicationModel.applicationPath = filesDTO.fileName;
  //     this.siLoanApplicationModel.filesDTO = filesDTO;
  //     this.siLoanApplicationModel.applicationPath = filesDTO.fileName;
  //     let index1 = event.files.indexOf(file);
  //     if (index1 > -1) {
  //       fileUpload.remove(event, index1);
  //     }
  //     fileUpload.clear();
  //   };

  //   reader.readAsDataURL(file);
   
  // }

  // fileRemoveEvent() {
  //   if (this.siLoanApplicationModel.filesDTO != null && this.siLoanApplicationModel.filesDTO != undefined) {
  //       let removeFileIndex = this.siLoanApplicationModel.filesDTO.findIndex((obj: any) => obj && obj.fileName === this.siLoanApplicationModel.applicationPath);
  //       this.siLoanApplicationModel.filesDTO.splice(removeFileIndex, 1);
  //       this.isDisableSubmit = true;
  //     }
  //   }
  fileUploader(event: any, fileUpload: FileUpload) {
    this.isFileUploaded = applicationConstants.FALSE;
    this.multipleFilesList = [];
    if (this.isEdit && this.siLoanApplicationModel.filesDTO == null || this.siLoanApplicationModel.filesDTO == undefined) {
      this.siLoanApplicationModel.filesDTO = [];
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
        this.siLoanApplicationModel.multipartFileList = [];
        this.siLoanApplicationModel.filesDTO.push(files);
        this.siLoanApplicationModel.applicationPath = null;
        this.siLoanApplicationModel.filesDTO[this.siLoanApplicationModel.filesDTO.length - 1].fileName = "SI_LOAN_Signed_Copy" + "" + timeStamp + "" + file.name;
        this.siLoanApplicationModel.applicationPath = "SI_LOAN_Signed_Copy" + "" + timeStamp + "" + file.name;
      }
      reader.readAsDataURL(file);
    }
  }
  fileRemoveEvent() {
    if (this.siLoanApplicationModel.filesDTO != null && this.siLoanApplicationModel.filesDTO != undefined && this.siLoanApplicationModel.filesDTO.length > 0) {
        let removeFileIndex = this.siLoanApplicationModel.filesDTO.findIndex((obj: any) => obj && obj.fileName === this.siLoanApplicationModel.applicationPath);
        this.siLoanApplicationModel.filesDTO.splice(removeFileIndex, 1);
        this.siLoanApplicationModel.applicationPath = null;
      }
    }

  getProductDetailsById(id: any) {
    this.siProductDefinitionService.getSIProductDefinitionPreviewByProductId(id).subscribe((data: any) => {
      this.responseModel = data;
      if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
        this.siLoanProductDefinitionModel = this.responseModel.data[0];

        // if (this.siLoanProductDefinitionModel.minLoanPeriod != undefined && this.siLoanProductDefinitionModel.minLoanPeriod != null)
        //   this.siLoanApplicationModel.minLoanPeriod = this.siLoanProductDefinitionModel.minLoanPeriod;

        // if (this.siLoanProductDefinitionModel.maxLoanPeriod != undefined && this.siLoanProductDefinitionModel.maxLoanPeriod != null )
        //   this.siLoanApplicationModel.maxLoanPeriod = this.siLoanProductDefinitionModel.maxLoanPeriod;

        // if (this.siLoanProductDefinitionModel.repaymentFrequency != undefined && this.siLoanProductDefinitionModel.repaymentFrequency != null)
        //   this.siLoanApplicationModel.repaymentFrequency = this.siLoanProductDefinitionModel.repaymentFrequency;

        if (this.siLoanProductDefinitionModel.siInterestPolicyConfigDTOList != null && this.siLoanProductDefinitionModel.siInterestPolicyConfigDTOList != undefined) {
          if (this.siLoanProductDefinitionModel.siInterestPolicyConfigDTOList[0].penalInterest != undefined && this.siLoanProductDefinitionModel.siInterestPolicyConfigDTOList[0].penalInterest != null)
            this.siLoanApplicationModel.penalInterest = this.siLoanProductDefinitionModel.siInterestPolicyConfigDTOList[0].penalInterest;

          if (this.siLoanProductDefinitionModel.siInterestPolicyConfigDTOList[0].iod != undefined && this.siLoanProductDefinitionModel.siInterestPolicyConfigDTOList[0].iod != null)
            this.siLoanApplicationModel.iod = this.siLoanProductDefinitionModel.siInterestPolicyConfigDTOList[0].iod;
        }
        
      }
    });
  }
  back() {
    this.router.navigate([approvaltransactionsconstant.SI_LOANS_APPROVAL_TRANSACTION_DETAILS]);
  }
  submit() {
    this.msgs = [];
    // this.siLoanApplicationModel.accountStatusName =null;

    this.siLoanApplicationService.updateSILoanApplication(this.siLoanApplicationModel).subscribe(response => {
      this.responseModel = response;
      this.siLoanApplicationModel =response;
      this.msgs = [];
      if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
        this.commonComponent.stopSpinner();
        this.msgs.push({ severity: 'success', detail: this.responseModel.statusMsg });
        // setTimeout(() => {
          this.router.navigate([approvaltransactionsconstant.SI_LOANS_APPROVAL_TRANSACTION_DETAILS]);
          // }, 300);
      } else {
        this.commonComponent.stopSpinner();
        this.msgs.push({ severity: 'error', detail: this.responseModel.statusMsg });
      }
    }, error => {
      this.msgs = [];
      this.commonComponent.stopSpinner();
      this.msgs.push({ severity: 'error', detail: applicationConstants.WE_COULDNOT_PROCESS_YOU_ARE_REQUEST });
    });
  }
  applicationEdit(rowData: any) {
    if(rowData.operationTypeName == "joint"){
    this.flag = true;
  }
  else {
    this.flag = false;
  }
    this.router.navigate([Loantransactionconstant.SIMPLE_INTEREST_LOANS_APPLICATION_DETAILS], { queryParams: { id: this.encryptDecryptService.encrypt(rowData.id)} });
  }

  onClick(){
    this.institutionPromoterFlag = true;
  }
  
  close(){
    this.institutionPromoterFlag = false;
    this.groupPromotersPopUpFlag = false;
    this.membreIndividualFlag = false;
  }

  onClickMemberIndividualMoreDetails(){
    this.membreIndividualFlag = true;
  }
  onClickOfGroupPromotes(){
    this.groupPromotersPopUpFlag = true;
  }



  /**
   * @implement Image Zoom POp up
   */
  onClickMemberPhotoCopy(){
    this.memberPhotoCopyZoom = true;
  }
   /**
   * @implement onclose popup
   */
   closePhotoCopy() {
    this.memberPhotoCopyZoom = false;
  }
  /**
   * @implements close photo dialogue
   */
  closePhoto(){
    this.memberPhotoCopyZoom = false;
  }
  getAccountStatus(){
    if(this.siLoanApplicationModel.accountStatus != null && this.siLoanApplicationModel.accountStatus != undefined){
       this.isDisableSubmit = false;
    }
    else{
      this.isDisableSubmit = true;
    }
  }
  getAllStatusList() {
    this.commonStatusService.getAllCommonStatus().subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel != null && this.responseModel != undefined) {
        if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
          if (this.responseModel.data != null && this.responseModel.data != undefined && this.responseModel.data.length > 0 ) {
            this.statusList = this.responseModel.data;
            this.statusList = this.responseModel.data.filter((obj: any) => obj != null && obj.name != CommonStatusData.CREATED ).map((state: { name: any; id: any; }) => {
              return { label: state.name, value: state.id };
            });

            let state = this.statusList.find((data: any) => null != data && this.siLoanApplicationModel.accountStatus != null && data.value == this.siLoanApplicationModel.accountStatus);
            if (state != null && undefined != state && state.label != null && state.label != undefined) {
              this.siLoanApplicationModel.accountStatusName = state.label;
            }
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
}
