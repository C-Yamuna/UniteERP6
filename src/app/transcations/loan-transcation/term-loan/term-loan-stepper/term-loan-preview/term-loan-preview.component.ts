import { Component } from '@angular/core';
import { InstitutionPromoterDetailsModel, MemberGroupDetailsModel, MembershipBasicRequiredDetails, MembershipInstitutionDetailsModel, promoterDetailsModel } from '../term-loan-new-membership/shared/term-loan-new-membership.model';
import { TermLoanKyc } from '../term-loans-kyc/shared/term-loan-kyc.model';
import { TermLoanCommunication } from '../term-loans-communication/shared/term-loan-communication.model';
import { TermApplication, TermLoanInterestPolicy, TermLoanProductDefinition } from '../term-loan-application-details/shared/term-application.model';
import { TermLoanJointHolder } from '../term-loan-joint-account/shared/term-loan-joint-holder.model';
import { TermLoanGuardianDetails, TermLoanNominee } from '../term-loans-nominee/shared/term-loan-nominee.model';
import { TermLoanGuarantor } from '../term-loans-loan-guarantor/shared/term-loan-guarantor.model';
import { TermBondLoanMortgage, TermGoldLoanMortgage, TermLandLoanMortgage, TermOtherLoanMortgage, TermStorageLoanMortgage, TermVehicleLoanMortgage } from '../term-loan-mortgage/shared/term-loan-mortgage.model';
import { TermLoanGenealogyTree } from '../term-loan-genealogy-tree/shared/term-loan-genealogy-tree.model';
import { TermLoanDocuments } from '../term-loan-documents/shared/term-loan-documents.model';
import { Responsemodel } from 'src/app/shared/responsemodel';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { applicationConstants } from 'src/app/shared/applicationConstants';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonComponent } from 'src/app/shared/common.component';
import { EncryptDecryptService } from 'src/app/shared/encrypt-decrypt.service';
import { CommonFunctionsService } from 'src/app/shared/commonfunction.service';
import { DatePipe } from '@angular/common';
import { FileUploadService } from 'src/app/shared/file-upload.service';
import { TermApplicationService } from '../term-loan-application-details/shared/term-application.service';
import { TranslateService } from '@ngx-translate/core';
import { TermLoanKycService } from '../term-loans-kyc/shared/term-loan-kyc.service';
import { Loantransactionconstant } from '../../../loan-transaction-constant';
import { ERP_TRANSACTION_CONSTANTS } from 'src/app/transcations/erp-transaction-constants';
import { FileUpload } from 'primeng/fileupload';
import { FileUploadModel } from 'src/app/layout/mainmenu/shared/file-upload-model.model';

@Component({
  selector: 'app-term-loan-preview',
  templateUrl: './term-loan-preview.component.html',
  styleUrls: ['./term-loan-preview.component.css']
})
export class TermLoanPreviewComponent {
  admissionNo: any;
  id: any;

  membershipBasicRequiredDetailsModel: MembershipBasicRequiredDetails = new MembershipBasicRequiredDetails();
  memberGroupDetailsModel: MemberGroupDetailsModel = new MemberGroupDetailsModel();
  membershipInstitutionDetailsModel: MembershipInstitutionDetailsModel = new MembershipInstitutionDetailsModel();
  termLoanKycModel: TermLoanKyc = new TermLoanKyc();
  termLoanCommunicationModel: TermLoanCommunication = new TermLoanCommunication();
  termLoanApplicationModel: TermApplication = new TermApplication();
  termLoanJointHolderModel: TermLoanJointHolder = new TermLoanJointHolder();
  termLoanNomineeModel: TermLoanNominee = new TermLoanNominee();
  termLoanGuarantorModel: TermLoanGuarantor = new TermLoanGuarantor();
  termGoldLoanMortgageModel: TermGoldLoanMortgage = new TermGoldLoanMortgage();
  termLandLoanMortgageModel: TermLandLoanMortgage = new TermLandLoanMortgage();
  termBondLoanMortgageModel: TermBondLoanMortgage = new TermBondLoanMortgage();
  termVehicleLoanMortgageModel: TermVehicleLoanMortgage = new TermVehicleLoanMortgage();
  termStorageLoanMortgageModel: TermStorageLoanMortgage = new TermStorageLoanMortgage();
  termOtherLoanMortgageModel: TermOtherLoanMortgage = new TermOtherLoanMortgage();
  termLoanDocumentsModel: TermLoanDocuments = new TermLoanDocuments();
  termLoanGenealogyTreeModel: TermLoanGenealogyTree = new TermLoanGenealogyTree();
  promoterDetailsModel: promoterDetailsModel = new promoterDetailsModel();
  institutionPromoterDetailsModel: InstitutionPromoterDetailsModel = new InstitutionPromoterDetailsModel();
  termLoanGuardianDetailsModel: TermLoanGuardianDetails = new TermLoanGuardianDetails()
  termLoanProductDefinitionModel: TermLoanProductDefinition = new TermLoanProductDefinition();
  termLoanInterestPolicyModel: TermLoanInterestPolicy = new TermLoanInterestPolicy();

  responseModel!: Responsemodel;
  msgs: any[] = [];
  kycGridList: any[] = []
  termLoanGuarantorDetailsList: any[] = [];

  goldLoanMortgageColumns: any[] = [];
  landLoanMortgageColumns: any[] = [];
  bondLoanMortgageColumns: any[] = [];
  vehicleLoanMortgageColumns: any[] = [];
  storageLoanMortgageColumns: any[] = [];
  otherLoanMortgageColumns: any[] = [];

  termLoanDocumentsDetailsList: any[] = [];
  termLoanGenealogyTreeList: any[] = [];

  termGoldLoanMortgageDetailsList: any[] = [];
  termLandLoanMortgageList: any[] = [];
  termBondLoanMortgageList: any[] = [];
  termVehicleLoanMortgageList: any[] = [];
  termStorageLoanMortgageList: any[] = [];
  termOtherLoanMortgageList: any[] = [];

  guardainFormEnable: boolean = false;
  nomineeMemberFullName: any;
  editOption: boolean = false;
  memberTypeName: any;
  preveiwFalg: any;
  flag: boolean = false;
  gardianFullName: any;
  orgnizationSetting: any;
  promoterDetails: any;
  institutionPromoter: any;
  memberBasicDetailsFalg: boolean = false;
  memberGroupFlag: boolean = false;
  memberIntitutionFlag: boolean = false;
  memberPromoterDetails: any
  groupPromoterList: any[] = []

  genealogyTreeDetails: any[] = [];
  guarantorColumns: any = [];
  jointHolderColumns: any[] = [];
  age: any;
  idEdit: any;
  jointHoldersFlag: boolean = false;
  jointHolderDetailsList: any[] = [];
  termLoanApplicationId: any;
  isNewMember: boolean = false;
  membreIndividualFlag: boolean = false;
  isKycApproved: any;
  memberPhotoCopyZoom: boolean = false;
  photoCopyFlag: boolean = false;
  signatureCopyFlag: boolean = true;
  groupPrmoters: any[] = [];
  columns: any[] = [];
  groupPrmotersList: any[] = [];
  institionPromotersList: any[] = [];
  relationTypesList: any[] = [];
  institutionPromoterFlag: boolean = false;
  groupPromotersPopUpFlag: boolean = false;
  isShowSubmit: boolean = applicationConstants.FALSE;
  editOpt: Boolean = true;
  showGoldform: boolean = false;
  showLandform: boolean = false;
  showBondform: boolean = false;
  showVehicleform: boolean = false;
  showStorageform: boolean = false;
  showOtherform: boolean = false;
  isFileUploaded: any;
  multipleFilesList: any;
  uploadFileData: any;
  isDisableSubmit: boolean = false;
  constructor(private router: Router, private formBuilder: FormBuilder,
    private commonComponent: CommonComponent, private activateRoute: ActivatedRoute, private encryptDecryptService: EncryptDecryptService,
    private datePipe: DatePipe, private termLoanApplicationsService: TermApplicationService,
    private fileUploadService: FileUploadService, private commonFunctionsService: CommonFunctionsService,
    private translate: TranslateService, private termLoanKycService: TermLoanKycService) {
   
   
    this.guarantorColumns = [
      // { field: 'memberTypeName', header: 'MEMBER TYPE' },
      // { field: ' admissionNo', header: 'ADMISSION NO' },
      // { field: 'admissionDateVal', header: 'ADMISSION DATE' },
      { field: 'name', header: 'NAME' },
      { field: 'aadharNo', header: 'AADHAR NUMBER' },
      { field: 'mobileNumber', header: 'MOBILE NUMBER' },
      { field: 'email', header: 'EMAIL' },
    ];
    this.jointHolderColumns = [
      { field: 'memberTypeName', header: 'MEMBER TYPE' },
      { field: ' admissionNo', header: 'ADMISSION NO' },
      { field: 'admissionDateVal', header: 'ADMISSION DATE' },
      { field: 'name', header: 'NAME' },
      { field: 'aadharNumber', header: 'AADHAR NUMBER' },
      { field: 'mobileNumber', header: 'MOBILE NUMBER' },
      { field: 'emailId', header: 'EMAIL' },
    ];
    this.goldLoanMortgageColumns = [
      { field: 'itemName', header: 'ITEM NAME' },
      { field: 'netWeight', header: 'NET WEIGHT IN GRAMS' },
      { field: 'grossWeight', header: 'GROSS WEIGHT IN GRAMS' },
      { field: 'value', header: 'VALUE' },
      // { field: 'remarks', header: 'REMARKS' },
      // { field: 'Action', header: 'ACTION' },
    ];
    this.landLoanMortgageColumns = [
      { field: 'passbookNumber', header: 'PASSBOOK NUMBER' },
      { field: 'surveyNo', header: 'SURVEY NUMBER' },
      { field: 'landTypeName', header: 'LAND TYPE' },
      { field: 'landUnits', header: 'LAND IN UNITS' },
      { field: 'landSubUnits', header: 'LAND IN SUB UNITS' },
      { field: 'value', header: 'VALUE' },
      { field: 'declaredLandUnits', header: 'DECLATRED LAND IN UNITS' },
      { field: 'declaredLandSubUnits', header: 'DECLARED LAND IN SUB UNITS' },
      // { field: 'remarks', header: 'REMARKS' },
      // { field: 'Action', header: 'ACTION' },
    ];
    this.bondLoanMortgageColumns = [
      { field: 'bondNumber', header: 'ERP.BOND_NO' },
      { field: 'faceValue', header: 'ERP.FACE_VALUE' },
      { field: 'surrenderValue', header: 'ERP.SURRENDER_VALUE' },
      // { field: 'remarks', header: 'REMARKS' },
      // { field: 'Action', header: 'ACTION' },
    ];
    this.vehicleLoanMortgageColumns = [
      { field: 'vechileName', header: 'ERP.VEHICLE_NAME' },
      { field: 'rcNumber', header: 'ERP.RC_NUMBER' },
      { field: 'value', header: 'VALUE' },
      { field: 'brand', header: 'ERP.BRAND' },
      // { field: 'remarks', header: 'REMARKS' },
      // { field: 'Action', header: 'ACTION' },
    ];

    this.storageLoanMortgageColumns = [
      { field: 'name', header: 'ERP.NAME' },
      { field: 'quantity', header: 'ERP.QUANTITY_IN_TONS' },
      { field: 'totalWeight', header: 'ERP.TOTAL_WEIGHT_IN_KILOGRAMS' },
      { field: 'netWeight', header: 'ERP.NET_WEIGHT_IN_GRAMS' },
      { field: 'value', header: 'VALUE' },
      // { field: 'remarks', header: 'REMARKS' },
    ];

    this.otherLoanMortgageColumns = [
      { field: 'name', header: 'ERP.NAME' },
      { field: 'noOfUnits', header: 'ERP.NO_OF_UNITS' },
      { field: 'value', header: 'VALUE' },
      // { field: 'remarks', header: 'REMARKS' },
      // { field: 'Action', header: 'ACTION' },
    ];

    this.genealogyTreeDetails = [
      { field: 'relationWithApplicantName', header: 'RELATION WITH MEMBER' },
      { field: 'name', header: 'RELATION NAME' },
      // { field: 'remarks', header: 'REMARKS' },
      // { field: 'Action', header: 'ACTION' },
    ];
   

    this.columns = [
      { field: 'surname', header: 'SURNAME' },
      { field: 'name', header: 'NAME' },
      { field: 'operatorTypeName', header: 'TRANSACTION_DATE' },
      { field: 'memDobVal', header: 'Date Of Birth' },
      { field: 'age', header: 'age' },
      { field: 'genderName', header: 'gender Name' },
      { field: 'maritalStatusName', header: 'marital status' },
      { field: 'mobileNumber', header: 'mobile Number' },
      { field: 'emailId', header: 'email' },
      { field: 'aadharNumber', header: 'aadhar' },
      { field: 'startDate', header: 'start date' },
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

  }

  ngOnInit() {
    this.translate.use(this.commonFunctionsService.getStorageValue('language'));
    this.orgnizationSetting = this.commonComponent.orgnizationSettings();
    this.getAllRelationTypes();
    this.activateRoute.queryParams.subscribe(params => {
      if (params['id'] != undefined || params['editOpt'] != undefined) {
        this.commonComponent.startSpinner();
        let id = this.encryptDecryptService.decrypt(params['id']);
        let idEdit = this.encryptDecryptService.decrypt(params['editOpt']);
        if (idEdit == "1") {
          this.preveiwFalg = true;
          this.editOpt = true;
        } else if (idEdit == "2") {
          this.editOpt = false;
          this.preveiwFalg = true;
        } else {
          this.preveiwFalg = false;
          this.editOpt = false;
        }
        if (params['isGridPage'] != undefined && params['isGridPage'] != null) {
          let isGrid = this.encryptDecryptService.decrypt(params['isGridPage']);
          if (isGrid === "0") {
            this.isShowSubmit = applicationConstants.FALSE;
          } else {
            this.isShowSubmit = applicationConstants.TRUE;
          }
        }
        this.termLoanApplicationsService.getTermApplicationById(id).subscribe(res => {
          this.responseModel = res;
          if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
            if (this.responseModel.data[0].admissionNo != null && this.responseModel.data[0].admissionNo != undefined) {
              this.admissionNo = this.responseModel.data[0].admissionNo;
              this.id = this.responseModel.data[0].id;
              this.memberTypeName = this.responseModel.data[0].memberTypeName;
              this.getTermApplicationByTermAccId();
            }
          }
          else {
            this.msgs = [];
            this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: this.responseModel.statusMsg }];
            setTimeout(() => {
              this.msgs = [];

            }, 2000);
          }
        });
      }
    }),
      (error: any) => {
        this.msgs = [];
        this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: this.responseModel.statusMsg }];
        setTimeout(() => {
          this.msgs = [];
        }, 2000);
      }
      
  }

  backbutton() {
    this.termLoanApplicationsService.resetCurrentStep();
    this.termLoanKycService.resetCurrentStep();
    this.router.navigate([Loantransactionconstant.TERM_LOAN]);
  }
  submit() {
    this.msgs = [];
    this.termLoanApplicationModel.accountStatus = 5;
    this.termLoanApplicationModel.accountStatusName = applicationConstants.SUBMISSION_FOR_APPROVAL;
    this.termLoanApplicationsService.submitTermApplicationForApproval(this.termLoanApplicationModel).subscribe(response => {
      this.responseModel = response;
      this.termLoanApplicationModel = response;
      this.msgs = [];
      if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
        this.commonComponent.stopSpinner();
        this.msgs.push({ severity: 'success', detail: this.responseModel.statusMsg });
        // setTimeout(() => {
        this.router.navigate([Loantransactionconstant.TERM_LOAN]);
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

  getTermApplicationByTermAccId() {
    this.termLoanApplicationsService.getTermApplicationByTermAccId(this.id).subscribe((data: any) => {
      this.responseModel = data;
      if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
        this.termLoanApplicationModel = this.responseModel.data[0];

        if (this.termLoanApplicationModel != null && this.termLoanApplicationModel != undefined) {

          if (this.termLoanApplicationModel.termProductId != null && this.termLoanApplicationModel.termProductId != undefined)
            this.getProductDefinitionByProductId(this.termLoanApplicationModel.termProductId);

          if (this.termLoanApplicationModel.applicationDate != null && this.termLoanApplicationModel.applicationDate != undefined)
            this.termLoanApplicationModel.applicationDateVal = this.datePipe.transform(this.termLoanApplicationModel.applicationDate, this.orgnizationSetting.datePipe);

          if (this.termLoanApplicationModel.sanctionDate != null && this.termLoanApplicationModel.sanctionDate != undefined)
            this.termLoanApplicationModel.sanctionDateVal = this.datePipe.transform(this.termLoanApplicationModel.sanctionDate, this.orgnizationSetting.datePipe);

          if (this.termLoanApplicationModel.loanDueDate != null && this.termLoanApplicationModel.loanDueDate != undefined)
            this.termLoanApplicationModel.loanDueDateVal = this.datePipe.transform(this.termLoanApplicationModel.loanDueDate, this.orgnizationSetting.datePipe);

          if (this.termLoanApplicationModel.memberTypeName != null && this.termLoanApplicationModel.memberTypeName != undefined)
            this.memberTypeName = this.termLoanApplicationModel.memberTypeName;

          if (this.termLoanApplicationModel.operationTypeName != null && this.termLoanApplicationModel.operationTypeName != undefined && this.termLoanApplicationModel.operationTypeName === "Joint")
            this.jointHoldersFlag = true;

          if (this.termLoanApplicationModel.termLoanCoApplicantDetailsDTOList != null && this.termLoanApplicationModel.termLoanCoApplicantDetailsDTOList != undefined && this.termLoanApplicationModel.termLoanCoApplicantDetailsDTOList.length > 0) {
            this.jointHoldersFlag = true;
            this.jointHolderDetailsList = this.termLoanApplicationModel.termLoanCoApplicantDetailsDTOList;
            this.jointHolderDetailsList = this.jointHolderDetailsList.map((model) => {
              if (model.admissionDate != null) {
                model.admissionDateVal = this.datePipe.transform(model.admissionDate, this.orgnizationSetting.datePipe);
              }
              return model;
            });
          }
          if (this.termLoanApplicationModel.individualMemberDetailsDTO != undefined && this.termLoanApplicationModel.individualMemberDetailsDTO != null) {
            this.membershipBasicRequiredDetailsModel = this.termLoanApplicationModel.individualMemberDetailsDTO;

            if (this.membershipBasicRequiredDetailsModel.admissionNumber != undefined && this.membershipBasicRequiredDetailsModel.admissionNumber != null)
              this.admissionNo = this.membershipBasicRequiredDetailsModel.admissionNumber;

            if (this.membershipBasicRequiredDetailsModel.admissionDate != null && this.membershipBasicRequiredDetailsModel.admissionDate != undefined)
              this.membershipBasicRequiredDetailsModel.admissionDateVal = this.datePipe.transform(this.membershipBasicRequiredDetailsModel.admissionDate, this.orgnizationSetting.datePipe);

            if (this.membershipBasicRequiredDetailsModel.dob != null && this.membershipBasicRequiredDetailsModel.dob != undefined)
              this.membershipBasicRequiredDetailsModel.dobVal = this.datePipe.transform(this.membershipBasicRequiredDetailsModel.dob, this.orgnizationSetting.datePipe);

            if (this.membershipBasicRequiredDetailsModel.isNewMember != null && this.membershipBasicRequiredDetailsModel.isNewMember != undefined)
              this.isNewMember = this.membershipBasicRequiredDetailsModel.isNewMember;

            if (this.membershipBasicRequiredDetailsModel.isKycApproved != null && this.membershipBasicRequiredDetailsModel.isKycApproved != undefined && this.membershipBasicRequiredDetailsModel.isKycApproved)
              this.isKycApproved = applicationConstants.KYC_APPROVED_NAME;
            else
              this.isKycApproved = applicationConstants.KYC_NOT_APPROVED_NAME;

            if (this.membershipBasicRequiredDetailsModel.photoCopyPath != null && this.membershipBasicRequiredDetailsModel.photoCopyPath != undefined) {
              this.membershipBasicRequiredDetailsModel.multipartFileListForPhotoCopy = this.fileUploadService.getFile(this.membershipBasicRequiredDetailsModel.photoCopyPath, ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.membershipBasicRequiredDetailsModel.photoCopyPath);
            }
            if (this.membershipBasicRequiredDetailsModel.signatureCopyPath != null && this.membershipBasicRequiredDetailsModel.signatureCopyPath != undefined) {
              this.membershipBasicRequiredDetailsModel.multipartFileListForsignatureCopyPath = this.fileUploadService.getFile(this.membershipBasicRequiredDetailsModel.signatureCopyPath, ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.membershipBasicRequiredDetailsModel.signatureCopyPath);
            }
            if (this.responseModel.data[0].individualMemberDetailsDTO.age != null && this.responseModel.data[0].individualMemberDetailsDTO.age != undefined) {
              this.age = this.responseModel.data[0].individualMemberDetailsDTO.age;
              if (this.age < 18) {
                this.guardainFormEnable = true;
              }
            }

          }

          if (this.termLoanApplicationModel.memberGroupDetailsDTO != undefined && this.termLoanApplicationModel.memberGroupDetailsDTO != null) {
            this.memberGroupDetailsModel = this.termLoanApplicationModel.memberGroupDetailsDTO;

            if (this.memberGroupDetailsModel.admissionNumber != undefined && this.memberGroupDetailsModel.admissionNumber != null)
              this.admissionNo = this.memberGroupDetailsModel.admissionNumber;

            if (this.memberGroupDetailsModel.admissionDate != null && this.memberGroupDetailsModel.admissionDate != undefined)
              this.memberGroupDetailsModel.admissionDateVal = this.datePipe.transform(this.memberGroupDetailsModel.admissionDate, this.orgnizationSetting.datePipe);
            
            if (this.memberGroupDetailsModel.registrationDate != null && this.memberGroupDetailsModel.registrationDate != undefined)
              this.memberGroupDetailsModel.registrationDateVal = this.datePipe.transform(this.memberGroupDetailsModel.registrationDate, this.orgnizationSetting.datePipe);

            if (this.memberGroupDetailsModel.isNewMember != null && this.memberGroupDetailsModel.isNewMember != undefined)
              this.isNewMember = this.membershipBasicRequiredDetailsModel.isNewMember;

            if (this.memberGroupDetailsModel.groupPromoterList != null && this.memberGroupDetailsModel.groupPromoterList != undefined && this.memberGroupDetailsModel.groupPromoterList.length > 0)
              this.groupPrmotersList = this.memberGroupDetailsModel.groupPromoterList;

            if (this.memberGroupDetailsModel.isKycApproved != null && this.memberGroupDetailsModel.isKycApproved != undefined && this.memberGroupDetailsModel.isKycApproved)
              this.isKycApproved = applicationConstants.KYC_APPROVED_NAME;
            else
              this.isKycApproved = applicationConstants.KYC_NOT_APPROVED_NAME;
          }

          if (this.termLoanApplicationModel.memberInstitutionDTO != undefined && this.termLoanApplicationModel.memberInstitutionDTO != null) {
            this.membershipInstitutionDetailsModel = this.termLoanApplicationModel.memberInstitutionDTO;

            if (this.membershipInstitutionDetailsModel.admissionNo != undefined && this.membershipInstitutionDetailsModel.admissionNo != null)
              this.admissionNo = this.membershipInstitutionDetailsModel.admissionNo;

            if (this.membershipInstitutionDetailsModel.admissionDate != null && this.membershipInstitutionDetailsModel.admissionDate != undefined)
              this.membershipInstitutionDetailsModel.admissionDateVal = this.datePipe.transform(this.membershipInstitutionDetailsModel.admissionDate, this.orgnizationSetting.datePipe);

            if (this.membershipInstitutionDetailsModel.isNewMember != null && this.membershipInstitutionDetailsModel.isNewMember != undefined)
              this.isNewMember = this.membershipBasicRequiredDetailsModel.isNewMember;

            if (this.membershipInstitutionDetailsModel.institutionPromoterList != null && this.membershipInstitutionDetailsModel.institutionPromoterList != undefined && this.membershipInstitutionDetailsModel.institutionPromoterList.length > 0)
              this.institionPromotersList = this.membershipInstitutionDetailsModel.institutionPromoterList;

            if (this.membershipInstitutionDetailsModel.isKycApproved != null && this.membershipInstitutionDetailsModel.isKycApproved != undefined && this.membershipInstitutionDetailsModel.isKycApproved)
              this.isKycApproved = applicationConstants.KYC_APPROVED_NAME;
            else
              this.isKycApproved = applicationConstants.KYC_NOT_APPROVED_NAME;
          }
          if (this.termLoanApplicationModel.termLoanKycDetailsDTOList != null && this.termLoanApplicationModel.termLoanKycDetailsDTOList != undefined) {
            this.kycGridList = this.termLoanApplicationModel.termLoanKycDetailsDTOList;
            for (let kyc of this.kycGridList) {
              kyc.multipartFileList = this.fileUploadService.getFile(kyc.kycFilePath, ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.FILES + "/" + kyc.kycFilePath);
              if (kyc.multipartFileList != null && kyc.multipartFileList != undefined) {
                kyc.multipartFileList = this.fileUploadService.getFile(kyc.kycFilePath, ERP_TRANSACTION_CONSTANTS.MEMBERSHIP + ERP_TRANSACTION_CONSTANTS.FILES + "/" + kyc.kycFilePath);
              }
            }
          }
          if (this.termLoanApplicationModel.termLoanCommunicationDTO != null && this.termLoanApplicationModel.termLoanCommunicationDTO != undefined)
            this.termLoanCommunicationModel = this.termLoanApplicationModel.termLoanCommunicationDTO;

          if (this.termLoanApplicationModel.membershipKycDetailsList != null && this.termLoanApplicationModel.membershipKycDetailsList != undefined) {
            this.kycGridList = this.termLoanApplicationModel.membershipKycDetailsList;
            for (let kyc of this.kycGridList) {
              if (kyc.kycFilePath != null && kyc.kycFilePath != undefined) {
                kyc.multipartFileList = this.fileUploadService.getFile(kyc.kycFilePath, ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.FILES + "/" + kyc.kycFilePath);
              }
            }
          }
          if (this.termLoanApplicationModel.termLoanNomineeDetailsDTO != null && this.termLoanApplicationModel.termLoanNomineeDetailsDTO != undefined) {
            this.termLoanNomineeModel = this.termLoanApplicationModel.termLoanNomineeDetailsDTO;

            let nominee = this.relationTypesList.find((data: any) => null != data && this.termLoanNomineeModel.relationTypeId != null && data.value == this.termLoanNomineeModel.relationTypeId);
            if (nominee != null && undefined != nominee && nominee.label != null && nominee.label != undefined) {
              this.termLoanNomineeModel.relationTypeName = nominee.label;
            }

            if (this.termLoanNomineeModel.nomineeFilePath != null && this.termLoanNomineeModel.nomineeFilePath != undefined) {
              this.termLoanNomineeModel.multipartFileList = this.fileUploadService.getFile(this.termLoanNomineeModel.nomineeFilePath, ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.termLoanNomineeModel.nomineeFilePath);
            }
          }

          if (this.termLoanApplicationModel.termMemberGuardianDetailsDTO != null && this.termLoanApplicationModel.termMemberGuardianDetailsDTO != undefined) {
            this.termLoanGuardianDetailsModel = this.termLoanApplicationModel.termMemberGuardianDetailsDTO;

            let guardain = this.relationTypesList.find((data: any) => null != data && this.termLoanGuardianDetailsModel.relationshipTypeId != null && data.value == this.termLoanGuardianDetailsModel.relationshipTypeId);
            if (guardain != null && undefined != guardain && guardain.label != null && guardain.label != undefined) {
              this.termLoanGuardianDetailsModel.relationshipTypeName = guardain.label;
            }
            if (this.termLoanGuardianDetailsModel.uploadFilePath != null && this.termLoanGuardianDetailsModel.uploadFilePath != undefined) {
              this.termLoanGuardianDetailsModel.guardainSighnedMultipartFiles = this.fileUploadService.getFile(this.termLoanGuardianDetailsModel.uploadFilePath, ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.termLoanGuardianDetailsModel.uploadFilePath);
            }
          }
          //Mortgage List
          //Gold
          if (this.termLoanApplicationModel.termLoanGoldMortgageDetailsDTOList != null && this.termLoanApplicationModel.termLoanGoldMortgageDetailsDTOList != undefined) {
            this.showGoldform = true;
            this.termGoldLoanMortgageDetailsList = this.termLoanApplicationModel.termLoanGoldMortgageDetailsDTOList;
          }
          //Land
          if (this.termLoanApplicationModel.termLoanLandMortgageDetailsDTOList != null && this.termLoanApplicationModel.termLoanLandMortgageDetailsDTOList != undefined) {
            this.showLandform = true;
            this.termLandLoanMortgageList = this.termLoanApplicationModel.termLoanLandMortgageDetailsDTOList;
          }
          //Bond
          if (this.termLoanApplicationModel.termBondsMortgageDetailsDTOList != null && this.termLoanApplicationModel.termBondsMortgageDetailsDTOList != undefined) {
            this.showBondform = true;
            this.termBondLoanMortgageList = this.termLoanApplicationModel.termBondsMortgageDetailsDTOList;
          }
          //Vechile
          if (this.termLoanApplicationModel.termLoanVehicleMortgageDetailsDTOList != null && this.termLoanApplicationModel.termLoanVehicleMortgageDetailsDTOList != undefined) {
            this.showVehicleform = true;
            this.termVehicleLoanMortgageList = this.termLoanApplicationModel.termLoanVehicleMortgageDetailsDTOList;
          }
          //Storage
          if (this.termLoanApplicationModel.termStorageMortgageDetailsDTOList != null && this.termLoanApplicationModel.termStorageMortgageDetailsDTOList != undefined) {
            this.showStorageform = true;
            this.termStorageLoanMortgageList = this.termLoanApplicationModel.termStorageMortgageDetailsDTOList;
          }
          //Other
          if (this.termLoanApplicationModel.termOtherMortgageDetailsDTOList != null && this.termLoanApplicationModel.termOtherMortgageDetailsDTOList != undefined) {
            this.showOtherform = true;
            this.termOtherLoanMortgageList = this.termLoanApplicationModel.termOtherMortgageDetailsDTOList;
          }

          if (this.termLoanApplicationModel.termLoanDocumentsDetailsDTOList != null && this.termLoanApplicationModel.termLoanDocumentsDetailsDTOList != undefined) {
            this.termLoanDocumentsDetailsList = this.termLoanApplicationModel.termLoanDocumentsDetailsDTOList;
            for (let document of this.termLoanDocumentsDetailsList) {
              if (document.filePath != null && document.filePath != undefined) {
                document.multipartFileList = this.fileUploadService.getFile(document.filePath, ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.FILES + "/" + document.filePath);
              }
            }
          }

          if (this.termLoanApplicationModel.termLoanGenealogyTreeDTOList != null && this.termLoanApplicationModel.termLoanGenealogyTreeDTOList != undefined)
            this.termLoanGenealogyTreeList = this.termLoanApplicationModel.termLoanGenealogyTreeDTOList;

          if (this.termLoanApplicationModel.termLoanGuarantorDetailsDTOList != null && this.termLoanApplicationModel.termLoanGuarantorDetailsDTOList != undefined) {
            this.termLoanGuarantorDetailsList = this.termLoanApplicationModel.termLoanGuarantorDetailsDTOList;
            this.termLoanGuarantorDetailsList = this.termLoanGuarantorDetailsList.map((model) => {
              if (model.admissionDate != null) {
                model.admissionDateVal = this.datePipe.transform(model.admissionDate, this.orgnizationSetting.datePipe);
              }
              return model;
            });
          }
          if (this.termLoanApplicationModel.applicationPath != null && this.termLoanApplicationModel.applicationPath != undefined) {
            this.termLoanApplicationModel.multipartFileList = this.fileUploadService.getFile(this.termLoanApplicationModel.applicationPath, ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.termLoanApplicationModel.applicationPath);
            this.isDisableSubmit = false;
          }
          else {
            this.isDisableSubmit = true;
          }

        }
        this.msgs = [];
        this.msgs = [{ severity: 'success', summary: applicationConstants.STATUS_SUCCESS, detail: this.responseModel.statusMsg }];
        setTimeout(() => {
          this.msgs = [];
        }, 2000);
      } else {
        this.msgs = [];
        this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: this.responseModel.statusMsg }];
        setTimeout(() => {
          this.msgs = [];
        }, 2000);
      }
    }, (error: any) => {
      this.msgs = [];
      this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: applicationConstants.WE_COULDNOT_PROCESS_YOU_ARE_REQUEST }];
      setTimeout(() => {
        this.msgs = [];
      }, 2000);
    });
  }

  getProductDefinitionByProductId(id: any) {
    this.termLoanApplicationsService.getPreviewDetailsByProductId(id).subscribe((data: any) => {
      this.responseModel = data;
      if (this.responseModel != null && this.responseModel != undefined) {
        if (this.responseModel != null && this.responseModel != undefined) {
          if (this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
            if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
              if (this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
                this.termLoanProductDefinitionModel = this.responseModel.data[0];

                if (this.termLoanProductDefinitionModel.termInterestPolicyConfigDTOList != null && this.termLoanProductDefinitionModel.termInterestPolicyConfigDTOList != undefined) {
                  if (this.termLoanProductDefinitionModel.termInterestPolicyConfigDTOList[0].penalInterest != undefined && this.termLoanProductDefinitionModel.termInterestPolicyConfigDTOList[0].penalInterest != null)
                    this.termLoanApplicationModel.penalInterest = this.termLoanProductDefinitionModel.termInterestPolicyConfigDTOList[0].penalInterest;

                  if (this.termLoanProductDefinitionModel.termInterestPolicyConfigDTOList[0].iod != undefined && this.termLoanProductDefinitionModel.termInterestPolicyConfigDTOList[0].iod != null)
                    this.termLoanApplicationModel.iod = this.termLoanProductDefinitionModel.termInterestPolicyConfigDTOList[0].iod;
                }
              }
            }
          }
        }
      }
    });
  }
   //get all relation types list
   getAllRelationTypes() {
    this.termLoanApplicationsService.getAllRelationTypes().subscribe((res: any) => {
      this.responseModel = res;
      if (this.responseModel != null && this.responseModel != undefined) {
        if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
          if (this.responseModel.data.length > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
            this.relationTypesList = this.responseModel.data
            this.relationTypesList = this.responseModel.data.filter((kyc: any) => kyc.status == applicationConstants.ACTIVE).map((count: any) => {
              return { label: count.name, value: count.id }
            });
          let  nominee= this.relationTypesList.find((data: any) => null != data && this.termLoanNomineeModel.relationTypeId  != null && data.value == this.termLoanNomineeModel.relationTypeId);
          if (nominee != null && undefined != nominee && nominee.label != null && nominee.label != undefined){
                this.termLoanNomineeModel.relationTypeName = nominee.label;
            }
            let  guardain= this.relationTypesList.find((data: any) => null != data && this.termLoanGuardianDetailsModel.relationshipTypeId  != null && data.value == this.termLoanGuardianDetailsModel.relationshipTypeId);
            if (guardain != null && undefined != guardain && nominee.label != null && guardain.label != undefined){
                this.termLoanGuardianDetailsModel.relationshipTypeName = guardain.label;
            }
          }
        }
      }
    });
  }
  editMembership(rowData: any) {
    this.router.navigate([Loantransactionconstant.TERMLOANS_NEW_MEMBERSHIP], { queryParams: { id: this.encryptDecryptService.encrypt(rowData.id) } });
  }

  editApplicationDetails(rowData: any) {
    if (rowData.operationTypeName == "Joint") {
      this.flag = true;
    }
    else {
      this.flag = false;
    }
    this.router.navigate([Loantransactionconstant.TERMLOANS_APPLICATION_DETAILS], { queryParams: { id: this.encryptDecryptService.encrypt(rowData.id) } });
  }

  editCommunicationDetails(rowData: any) {

    this.router.navigate([Loantransactionconstant.TERMLOANS_COMMUNICATION], { queryParams: { id: this.encryptDecryptService.encrypt(rowData.id) } });
  }

  editKYCDetails(rowData: any) {
    if (this.isNewMember) {
      this.router.navigate([Loantransactionconstant.TERMLOANS_KYC], { queryParams: { id: this.encryptDecryptService.encrypt(rowData.id) } });
    }
    else {
      this.router.navigate([Loantransactionconstant.TERMLOANS_MEMBERSHIP], { queryParams: { id: this.encryptDecryptService.encrypt(rowData.id) } });

    }
  }

  editJointHolderDetails(rowData: any) {
    this.router.navigate([Loantransactionconstant.TERMLOANS_JOINT_ACCOUNT], { queryParams: { id: this.encryptDecryptService.encrypt(rowData.id) } });
  }

  editNomineeDetails(rowData: any) {
    this.router.navigate([Loantransactionconstant.TERMLOANS_NOMINEE], { queryParams: { id: this.encryptDecryptService.encrypt(rowData.id) } });
  }

  editGuarantorDetails(rowData: any) {
    this.router.navigate([Loantransactionconstant.TERMLOANS_GUARANTOR], { queryParams: { id: this.encryptDecryptService.encrypt(rowData.id) } });
  }

  editMortgageDetails(rowData: any) {

    this.router.navigate([Loantransactionconstant.TERMLOANS_MORTAGAGE], { queryParams: { id: this.encryptDecryptService.encrypt(rowData.id) } });
  }

  editDocumentDetails(rowData: any) {
    this.router.navigate([Loantransactionconstant.TERM_LOAN_DOCUMENTS], { queryParams: { id: this.encryptDecryptService.encrypt(rowData.id) } });
  }

  editGenealogyTreeDetails(rowData: any) {
    this.router.navigate([Loantransactionconstant.TERMLOANS_GENEALOGY_TREE], { queryParams: { id: this.encryptDecryptService.encrypt(rowData.id) } });
  }

  onClickMemberIndividualMoreDetails() {
    this.membreIndividualFlag = true;
  }

  onClickMemberPhotoCopy() {
    this.memberPhotoCopyZoom = true;
  }

  onClickOfGroupPromotes() {
    this.groupPromotersPopUpFlag = true;
  }

  onClickOfInstitutionPromotes() {
    this.institutionPromoterFlag = true;
  }
  imageUploader(event: any, fileUpload: FileUpload) {
    this.isFileUploaded = applicationConstants.FALSE;
    this.termLoanApplicationModel.multipartFileList = [];
    this.multipleFilesList = [];
    this.termLoanApplicationModel.filesDTO = null; // Initialize as a single object
    this.termLoanApplicationModel.applicationPath = null;
    let file = event.files[0]; // Only one file
    let reader = new FileReader();
    reader.onloadend = (e) => {
      let filesDTO = new FileUploadModel();
      this.uploadFileData = e.target as FileReader;
      filesDTO.fileName = "TERM_LOAN_DETAILS_" + this.id + "_" + this.commonComponent.getTimeStamp() + "_" + file.name;
      filesDTO.fileType = file.type.split('/')[1];
      filesDTO.value = (this.uploadFileData.result as string).split(',')[1];
      filesDTO.imageValue = this.uploadFileData.result as string;
      this.termLoanApplicationModel.filesDTO = filesDTO;
      this.termLoanApplicationModel.applicationPath = filesDTO.fileName;
      this.isDisableSubmit = false;
      let index1 = event.files.indexOf(file);
      if (index1 > -1) {
        fileUpload.remove(event, index1);
      }
      fileUpload.clear();
    };

    reader.readAsDataURL(file);
  }
  fileRemoveEvent() {
    if (this.termLoanApplicationModel.filesDTO != null && this.termLoanApplicationModel.filesDTO != undefined) {
      let removeFileIndex = this.termLoanApplicationModel.filesDTO.findIndex((obj: any) => obj && obj.fileName === this.termLoanApplicationModel.applicationPath);
      this.termLoanApplicationModel.filesDTO.splice(removeFileIndex, 1);
      // this.termLoanApplicationModel.signedCopyPath = null;
      this.isDisableSubmit = true;
    }
  }
  pdfDownload() {
    this.commonComponent.startSpinner();
    this.termLoanApplicationsService.downloadPDf(this.id).subscribe((data: any) => {
      var file = new Blob([data], { type: 'application/pdf' });
      saveAs(file, "Loan_application_filled_Document.pdf");
      this.msgs = [];
      this.msgs.push({ severity: "success", detail: 'Loan Application Downloaded Successfully' });
      this.commonComponent.stopSpinner();
    }, error => {
      this.msgs = [];
      this.commonComponent.stopSpinner();
      this.msgs.push({ severity: "error", detail: 'Unable to Download Application' });
    })
     
  }
}
