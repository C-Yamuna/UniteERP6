import { ApplicationInitStatus, ChangeDetectorRef, Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuItem, MessageService } from 'primeng/api';
import { Loantransactionconstant } from '../../loan-transaction-constant';
import { CiLoanApplication } from './ci-product-details/shared/ci-loan-application.model';
import { MembershipBasicDetails, MembershipGroupDetails, MemInstitutionDetails } from './ci-membership-details/shared/membership-details.model';
import { CiLoanKyc } from './ci-kyc/shared/ci-kyc.model';
import { CiLoanCommunication } from './ci-communication/shared/ci-communication.model';
import { CiLoanCoApplicantDetails } from './ci-loan-co-applicant-details/shared/ci-loan-co-applicant-details.model';
import { CiLoanNominee } from './ci-nominee/shared/ci-loan-nominee.model';
import { CiLoanGuarantor } from './ci-loan-guarantor/shared/ci-loan-guarantor.model';
import { CiBondsMortgageLoan, CiGoldMortgageLoan, CiLandMortgageLoan, CiOthersMortgageLoan, CiStorageMortgageLoan, CiVehicleMortgageLoan } from './ci-loan-mortgage/shared/ci-loan-mortgage.model';
import { CiLoanDocumentsDetails } from './ci-loan-documents/shared/ci-loan-documents-details.model';
import { CiLoanGenealogyTree } from './ci-loan-genealogy-tree/shared/ci-loan-genealogy-tree.model';
import { EncryptDecryptService } from 'src/app/shared/encrypt-decrypt.service';
import { CommonComponent } from 'src/app/shared/common.component';
import { MembershipDetailsService } from './ci-membership-details/shared/membership-details.service';
import { Responsemodel } from 'src/app/shared/responsemodel';
import { applicationConstants } from 'src/app/shared/applicationConstants';
import { DatePipe } from '@angular/common';
import { FileUploadService } from 'src/app/shared/file-upload.service';
import { ERP_TRANSACTION_CONSTANTS } from 'src/app/transcations/erp-transaction-constants';
import { CommonFunctionsService } from 'src/app/shared/commonfunction.service';
import { TranslateService } from '@ngx-translate/core';
import { CiLoanApplicationService } from './ci-product-details/shared/ci-loan-application.service';
import { CiLoanGuardian } from './ci-nominee/shared/ci-loan-guardian.model';
import { CiLoanCoApplicantDetailsService } from './ci-loan-co-applicant-details/shared/ci-loan-co-applicant-details.service';
import { CiLoanNomineeService } from './ci-nominee/shared/ci-loan-nominee.service';
import { CiLoanGuardianService } from './ci-nominee/shared/ci-loan-guardian.service';
import { CiCommunicationService } from './ci-communication/shared/ci-communication.service';
import { CiLoanGuarantorService } from './ci-loan-guarantor/shared/ci-loan-guarantor.service';
import { CiLoanGenealogyTreeService } from './ci-loan-genealogy-tree/shared/ci-loan-genealogy-tree.service';
import { MemberShipTypesData } from 'src/app/transcations/common-status-data.json';

@Component({
  selector: 'app-compound-interest-loan-stepper',
  templateUrl: './compound-interest-loan-stepper.component.html',
  styleUrls: ['./compound-interest-loan-stepper.component.css']
})
export class CompoundInterestLoanStepperComponent {

  items: MenuItem[] = [];
  activeIndex: number = 0;
  buttonDisabled: boolean = false;
  ciLoanApplicationId: any;
  activeItem: any;
  societyId: any;
  branchId: any;
  isEdit: boolean = false;
  responseModel!: Responsemodel;
  msgs: any[] = [];
  completed: any;
  flagForLabelName: boolean = false;
  admissionNumber: any;
  previouseButtonDisable: boolean = false;
  surName: any;
  name: any;
  gender: any;
  age: any;
  maritalStatus: any;
  relationshipType: any;
  relativeName: any;
  mobileNumber: any;
  email: any;
  dateOfBirth: any;
  accountType: any;
  flag: Boolean = false;
  isApplicationEdit: boolean = false;
  isCommunicationEdit: boolean = false;
  isJointEdit: boolean = false;
  isKycEdit: boolean = false;
  isNomineeEdit: boolean = false;
  isDocumentEdit: boolean = false;
  flagForNomineeTypeValue: any;
  isPerminentAddressIsSameFalg: boolean = false;
  accountNumber: any;
  memberTypeName: any;
  menuDisabled: boolean = true;
  checked: Boolean = false;
  showForm: boolean = false;
  tabviewButton: boolean = true;
  pacsId: any;
  operationTypeName: any;
  allTypesOfmembershipList: any;
  // memberCard feilds 
  individualFlag: boolean = true;
  groupFlag: boolean = false;
  institutionFlag: boolean = false;
  isNewMemberCreation: boolean = false;
  permenentAllTypesOfmembershipList: any;
  orgnizationSetting: any;
  memberDropDownDisable: boolean = false;
  rdJointHolderList: any[] = [];
  memberTypeId: any;
  admissionNumberDropDownDisable: boolean = false;
  previousStepFlag: boolean = false;
  membreIndividualFlag: boolean = false;
  memberPhotoCopyZoom: boolean = false;
  institutionPromoterFlag: boolean = false;
  groupPromotersPopUpFlag: boolean = false;
  groupPrmotersList: any[] = [];
  groupPrmoters: any[] = [];
  institionPromotersList: any[] = [];
  columns: any[] = [];
  photoCopyFlag: boolean = false;
  memberSignatureCopyZoom: boolean = false;
  memberDetails: any;
  isKycApproved: any;
  jointAccountHolderList: any[] = [];
  memberTypeList: any[] = [];
  guarantorDetailsList: any;
  isGuarantorEdit: boolean = false;
  isMortgageEdit: boolean = false;
  isGenealogyEdit: boolean = false;
  pacsCode: any;
  
  membershipBasicDetailsModel: MembershipBasicDetails = new MembershipBasicDetails();
  membershipGroupDetailsModel: MembershipGroupDetails = new MembershipGroupDetails();
  membershipInstitutionDetailsModel: MemInstitutionDetails = new MemInstitutionDetails();
  ciLoanApplicationModel: CiLoanApplication = new CiLoanApplication();
  ciLoanCommunicationModel: CiLoanCommunication = new CiLoanCommunication();
  ciLoanKycModel: CiLoanKyc = new CiLoanKyc();
  ciLoanCoApplicantDetailsModel: CiLoanCoApplicantDetails = new CiLoanCoApplicantDetails();
  ciLoanNomineeModel: CiLoanNominee = new CiLoanNominee();
  ciLoanGuardianModel: CiLoanGuardian = new CiLoanGuardian();
  ciLoanGuarantorModel: CiLoanGuarantor = new CiLoanGuarantor();
  ciGoldMortgageLoanModel: CiGoldMortgageLoan = new CiGoldMortgageLoan();
  ciLandMortgageLoanModel: CiLandMortgageLoan = new CiLandMortgageLoan();
  ciBondsMortgageLoanModel: CiBondsMortgageLoan = new CiBondsMortgageLoan();
  ciVehicleMortgageLoanModel: CiVehicleMortgageLoan = new CiVehicleMortgageLoan();
  ciStorageMortgageLoanModel: CiStorageMortgageLoan = new CiStorageMortgageLoan();
  ciOthersMortgageLoanModel: CiOthersMortgageLoan = new CiOthersMortgageLoan();
  ciLoanDocumentsDetailsModel: CiLoanDocumentsDetails = new CiLoanDocumentsDetails();
  ciLoanGenealogyTreeModel: CiLoanGenealogyTree = new CiLoanGenealogyTree();

  constructor(private router: Router,   
    private ciLoanApplicationService: CiLoanApplicationService,
    private ciLoanCoApplicantDetailsService: CiLoanCoApplicantDetailsService,
    private ciLoanNomineeService: CiLoanNomineeService,
    private ciLoanGuardianService: CiLoanGuardianService,
    private ciCommunicationService: CiCommunicationService,
    private ciLoanGuarantorService: CiLoanGuarantorService,
    private ciLoanGenealogyTreeService: CiLoanGenealogyTreeService,
    private membershipDetailsService: MembershipDetailsService,
    private commonComponent: CommonComponent,
    private activateRoute: ActivatedRoute,
    private encryptDecryptService: EncryptDecryptService,
    private commonFunctionsService: CommonFunctionsService,
    private translate: TranslateService,
    private datePipe: DatePipe,
    private fileUploadService: FileUploadService , private ref: ChangeDetectorRef) {
    this.columns = [
      { field: 'surname', header: 'surname' },
      { field: 'name', header: 'name' },
      { field: 'operatorTypeName', header: 'operation type name' },
      { field: 'memDobVal', header: 'Date Of Birth' },
      { field: 'age', header: 'age' },
      { field: 'genderName', header: 'gender Name' },
      { field: 'maritalStatusName', header: 'marital status' },
      { field: 'mobileNumber', header: 'mobile Number' },
      { field: 'emailId', header: 'email' },
      { field: 'aadharNumber', header: 'aadhar' },
      { field: 'startDateVal', header: 'start date' },
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
      { field: 'startDateVal', header: 'start date' },
    ];
  }

  ngOnInit() {
    this.pacsId = this.commonFunctionsService.getStorageValue(applicationConstants.PACS_ID);
    this.branchId = this.commonFunctionsService.getStorageValue(applicationConstants.BRANCH_ID);
    this.orgnizationSetting = this.commonComponent.orgnizationSettings();

    this.showForm = this.commonFunctionsService.getStorageValue(applicationConstants.B_CLASS_MEMBER_CREATION);


    this.activateRoute.queryParams.subscribe(params => {
      if (params['id'] != undefined || params['admissionNo'] != undefined || params['falg'] != undefined || params['showForm'] != undefined) {
        if (params['id'] != undefined) {
          let queryParams = Number(this.encryptDecryptService.decrypt(params['id']));
          let qParams = queryParams;
          this.ciLoanApplicationId = qParams;
          this.menuDisabled = false;
          this.getCiLoanApplicationsById(this.ciLoanApplicationId);
        }
        if (params['falg'] != undefined || params['showForm'] != undefined) {
          this.refreshTheMemberCardData();
        }

        if (params['admissionNo'] != undefined) {
          let queryParams = Number(this.encryptDecryptService.decrypt(params['admissionNo']));
          let qParams = queryParams;
          this.admissionNumber = qParams;
          this.getMemberDetailsByAdmissionNUmber(this.admissionNumber);
          this.getGroupDetailsByAdmissionNumber(this.admissionNumber);
          this.getInstitutionDetailsByAdmissionNumber(this.admissionNumber);
        }
        this.isEditCheck(this.activeIndex);
      } else {
        this.isEdit = false;
        this.flagForLabelName = false;
      }
      this.itemList();
    });
    if (this.memberDetails != null && this.memberDetails != undefined) {
      this.membershipBasicDetailsModel = this.memberDetails
    }
    if (!this.showForm) {
      this.getAllTypeOfMembershipDetails(this.pacsId, this.branchId);
    }
    this.appendCurrentStepperData();
  }

  refreshTheMemberCardData() {
    this.ciLoanApplicationService.resetCurrentStep();
    this.membershipBasicDetailsModel = new MembershipBasicDetails();
    this.membershipGroupDetailsModel = new MembershipGroupDetails();
    this.membershipInstitutionDetailsModel = new MemInstitutionDetails();
    this.admissionNumber = null;
  }


  appendCurrentStepperData() {
    this.ciLoanApplicationService.currentStep.subscribe((data: any) => {
      if (data) {
        this.translate.use(this.commonFunctionsService.getStorageValue('language'));
      } else {
        this.translate.use(this.commonFunctionsService.getStorageValue('language'));
      }
      if (data != undefined) {
        this.activeIndex = data.stepperIndex;
        this.previouseButtonDisable = false;
        this.changeStepperSelector(this.activeIndex);
        this.buttonDisabled = data.isDisable;
        if (data.data != null && data.data != undefined) {
          if (this.activeIndex == 0) {
            this.ciLoanApplicationModel = data.data;
            if (this.ciLoanApplicationModel != null && this.ciLoanApplicationModel != undefined) {
              if (this.ciLoanApplicationModel.isNewMember != null && this.ciLoanApplicationModel.isNewMember != undefined)
                this.showForm = this.ciLoanApplicationModel.isNewMember;
              if (this.ciLoanApplicationModel.admissionNo != null && this.ciLoanApplicationModel.admissionNo != undefined)
                this.admissionNumber = this.ciLoanApplicationModel.admissionNo;
              if (this.ciLoanApplicationModel.memberTypeName != null && this.ciLoanApplicationModel.memberTypeName != undefined)
                this.memberTypeName = this.ciLoanApplicationModel.memberTypeName;
              this.memberTypeCheck(this.memberTypeName, this.ciLoanApplicationModel);
            }
            this.itemList();
          }
          else if (this.activeIndex == 1) {
            this.previouseButtonDisable = data.isDisable;
            if (data.data != null && data.data != undefined) {
              this.ciLoanKycModel = data.data;
            }
            this.itemList();
          }
          else if (this.activeIndex == 2) {
            if (data.data != null && data.data != undefined) {
              this.ciLoanCommunicationModel = data.data;
            }
            this.itemList();
          }
          else if (this.activeIndex == 3) {
            if (data.data != null && data.data != undefined) {
              this.ciLoanApplicationModel = data.data;
            }
            this.itemList();
          }

          else if (this.activeIndex == 4) {
            if (data.data != null && data.data != undefined) {
              if (data.data.admissionNumber != null && data.data.admissionNumber != undefined) {
                this.ciLoanApplicationModel.admissionNo = data.data.admissionNumber;
              }
              if (data.data.ciLoanApplicationId != null && data.data.ciLoanApplicationId != undefined) {
                this.ciLoanApplicationId = data.data.ciLoanApplicationId;
              }
              if (data.data.jointHolderList != null && data.data.jointHolderList != undefined && data.data.jointHolderList.length > 0) {
                this.jointAccountHolderList = data.data.jointHolderList;
              }
              this.ciLoanCoApplicantDetailsModel = data.data;
            }
            this.itemList();
          }
          else if (this.activeIndex == 5) {
            if (data.data != null && data.data != undefined) {
              this.ciLoanGuardianModel = new CiLoanGuardian();
              if (data.data.ciLoanGuardian != null && data.data.ciLoanGuardian != undefined) {
                this.ciLoanGuardianModel = data.data.ciLoanGuardian;
              }
              this.ciLoanNomineeModel = data.data;
            }
            this.itemList();
          }
          else if (this.activeIndex == 6) {
            if (data.data != null && data.data != undefined) {
              if (data.data.accountTypeId != null && data.data.accountTypeId != undefined) {
                this.operationTypeName = data.data.accountTypeId;
              }
              if (data.data.admissionNumber != null && data.data.admissionNumber != undefined) {
                this.ciLoanGuarantorModel.admissionNumber = data.data.admissionNumber;
              }
              if (data.data.ciLoanApplicationId != null && data.data.ciLoanApplicationId != undefined) {
                this.ciLoanApplicationId = data.data.ciLoanApplicationId;
              }
              if (data.data.guarantorDetailsList != null && data.data.guarantorDetailsList != undefined && data.data.guarantorDetailsList.length > 0) {
                this.guarantorDetailsList = data.data.guarantorDetailsList;
              }
            }
          }
          else if (this.activeIndex == 7) {
            if (data.data.collateralType == 1) {
              this.ciGoldMortgageLoanModel = data.data;
            } else if (data.data.collateralType == 2) {
              this.ciLandMortgageLoanModel = data.data;
            } else if (data.data.collateralType == 3) {
              this.ciBondsMortgageLoanModel = data.data;
            } else if (data.data.collateralType == 4) {
              this.ciVehicleMortgageLoanModel = data.data;
            } else if (data.data.collateralType == 5) {
              this.ciStorageMortgageLoanModel = data.data;
            } else if (data.data.collateralType == 6) {
              this.ciOthersMortgageLoanModel = data.data;
            }
          }
          else if (this.activeIndex == 8) {
            this.ciLoanDocumentsDetailsModel = data.data;
          }
          else if (this.activeIndex == 9) {
            this.itemList();
            this.ciLoanGenealogyTreeModel = data.data;
          }
        }
      }
    });
  }




  itemList() {
    this.items = [];
    if(this.ciLoanApplicationId != null && this.ciLoanApplicationId != undefined){
      if (this.showForm) {
        if (this.ciLoanApplicationModel.operationTypeName != "Joint") {
          this.items = [
            {
              label: 'Member Details', icon: 'fa fa-id-badge', routerLink: Loantransactionconstant.COMPOUND_INTEREST_LOANS_NEW_MEMBERSHIP_DETAILS, queryParams: { id: this.encryptDecryptService.encrypt(this.ciLoanApplicationId)},
              disabled: this.menuDisabled,
              command: (event: any) => {
                this.activeIndex = 0;
              }
            },
            {
              label: 'KYC', icon: 'fa fa-podcast', routerLink: Loantransactionconstant.COMPOUND_INTEREST_LOANS_KYC,queryParams: { id: this.encryptDecryptService.encrypt(this.ciLoanApplicationId)},
              disabled: this.menuDisabled,
              command: (event: any) => {
                this.activeIndex = 1;
              }
            },
            {
              label: 'Communication', icon: 'fa fa-map-marker', routerLink: Loantransactionconstant.COMPOUND_INTEREST_LOANS_COMMUNICATON,queryParams: { id: this.encryptDecryptService.encrypt(this.ciLoanApplicationId)},
              disabled: this.menuDisabled,
              command: (event: any) => {
                this.activeIndex = 2;
              }
            },
            {
              label: 'Application', icon: 'fa fa-id-badge', routerLink: Loantransactionconstant.COMPOUND_INTEREST_LOANS_APPLICATIOIN_DETAILS,queryParams: { id: this.encryptDecryptService.encrypt(this.ciLoanApplicationId)},
              disabled: this.menuDisabled,
              command: (event: any) => {
                this.activeIndex = 3;
              }
            },
            {
              label: 'Nominee', icon: 'fa fa-user-o', routerLink: Loantransactionconstant.COMPOUND_INTEREST_LOANS_NOMINEE,queryParams: { id: this.encryptDecryptService.encrypt(this.ciLoanApplicationId)},
              disabled: this.menuDisabled,
              command: (event: any) => {
                this.activeIndex = 5;
              }
            },
            {
              label: 'Loan Guarantor', icon: 'fa fa-male', routerLink: Loantransactionconstant.COMPOUND_INTEREST_LOANS_GUARANTOR,queryParams: { id: this.encryptDecryptService.encrypt(this.ciLoanApplicationId)},
              disabled: this.menuDisabled,
              command: (event: any) => {
                this.activeIndex = 6;
              }
            },
            {
              label: 'Loan Mortagage', icon: 'fa fa-puzzle-piece', routerLink: Loantransactionconstant.COMPOUND_INTEREST_LOANS_MORTAGAGE,queryParams: { id: this.encryptDecryptService.encrypt(this.ciLoanApplicationId)},
              disabled: this.menuDisabled,
              command: (event: any) => {
                this.activeIndex = 7;
              }
            },
            {
              label: 'Loan Documents', icon: 'fa fa-files-o', routerLink: Loantransactionconstant.COMPOUND_INTEREST_LOANS_DOCUMENTS,queryParams: { id: this.encryptDecryptService.encrypt(this.ciLoanApplicationId)},
              disabled: this.menuDisabled,
              command: (event: any) => {
                this.activeIndex = 8;
              }
            },
            {
              label: 'Loan Genealogy Tree', icon: 'fa fa-sitemap', routerLink: Loantransactionconstant.COMPOUND_INTEREST_LOANS_GENEALOGY_TREE,queryParams: { id: this.encryptDecryptService.encrypt(this.ciLoanApplicationId)},
              disabled: this.menuDisabled,
              command: (event: any) => {
                this.activeIndex = 9;
              }
            }
          ];
        }
        else {
          this.items = [
            {
              label: 'Member Details', icon: 'fa fa-id-badge', routerLink: Loantransactionconstant.COMPOUND_INTEREST_LOANS_NEW_MEMBERSHIP_DETAILS,queryParams: { id: this.encryptDecryptService.encrypt(this.ciLoanApplicationId)},
              disabled: this.menuDisabled,
              command: (event: any) => {
                this.activeIndex = 0;
              }
            },
            {
              label: 'KYC', icon: 'fa fa-podcast', routerLink: Loantransactionconstant.COMPOUND_INTEREST_LOANS_KYC,queryParams: { id: this.encryptDecryptService.encrypt(this.ciLoanApplicationId)},
              disabled: this.menuDisabled,
              command: (event: any) => {
                this.activeIndex = 1;
              }
            },
            {
              label: 'Communication', icon: 'fa fa-map-marker', routerLink: Loantransactionconstant.COMPOUND_INTEREST_LOANS_KYC,queryParams: { id: this.encryptDecryptService.encrypt(this.ciLoanApplicationId)},
              disabled: this.menuDisabled,
              command: (event: any) => {
                this.activeIndex = 2;
              }
            },
            {
              label: 'Application', icon: 'fa fa-id-badge', routerLink: Loantransactionconstant.COMPOUND_INTEREST_LOANS_APPLICATIOIN_DETAILS,queryParams: { id: this.encryptDecryptService.encrypt(this.ciLoanApplicationId)},
              disabled: this.menuDisabled,
              command: (event: any) => {
                this.activeIndex = 3;
              }
            },
            {
              label: 'Joint Account', icon: 'fa fa-handshake-o', routerLink: Loantransactionconstant.COMPOUND_INTEREST_LOANS_CO_APPLICANT_DETAILS,queryParams: { id: this.encryptDecryptService.encrypt(this.ciLoanApplicationId)},
              disabled: this.menuDisabled,
              command: (event: any) => {
                this.activeIndex = 4;
              }
            },
            {
              label: 'Nominee', icon: 'fa fa-user-o', routerLink: Loantransactionconstant.COMPOUND_INTEREST_LOANS_NOMINEE,queryParams: { id: this.encryptDecryptService.encrypt(this.ciLoanApplicationId)},
              disabled: this.menuDisabled,
              command: (event: any) => {
                this.activeIndex = 5;
              }
            },
            {
              label: 'Loan Guarantor', icon: 'fa fa-male', routerLink: Loantransactionconstant.COMPOUND_INTEREST_LOANS_GUARANTOR,queryParams: { id: this.encryptDecryptService.encrypt(this.ciLoanApplicationId)},
              disabled: this.menuDisabled,
              command: (event: any) => {
                this.activeIndex = 6;
              }
            },
            {
              label: 'Loan Mortagage', icon: 'fa fa-puzzle-piece', routerLink: Loantransactionconstant.COMPOUND_INTEREST_LOANS_MORTAGAGE,queryParams: { id: this.encryptDecryptService.encrypt(this.ciLoanApplicationId)},
              disabled: this.menuDisabled,
              command: (event: any) => {
                this.activeIndex = 7;
              }
            },
            {
              label: 'Loan Documents', icon: 'fa fa-files-o', routerLink: Loantransactionconstant.COMPOUND_INTEREST_LOANS_DOCUMENTS,queryParams: { id: this.encryptDecryptService.encrypt(this.ciLoanApplicationId)},
              disabled: this.menuDisabled,
              command: (event: any) => {
                this.activeIndex = 8;
              }
            },
            {
              label: 'Loan Genealogy Tree', icon: 'fa fa-sitemap', routerLink: Loantransactionconstant.COMPOUND_INTEREST_LOANS_GENEALOGY_TREE,queryParams: { id: this.encryptDecryptService.encrypt(this.ciLoanApplicationId)},
              disabled: this.menuDisabled,
              command: (event: any) => {
                this.activeIndex = 9;
              }
            }
          ];
        }
      }
      else {
        if (this.ciLoanApplicationModel.operationTypeName != "Joint") {
          this.items = [
            {
              label: 'KYC', icon: 'fa fa-podcast', routerLink: Loantransactionconstant.COMPOUND_INTEREST_LOANS_MEMBERSHIP_DETAILS,queryParams: { id: this.encryptDecryptService.encrypt(this.ciLoanApplicationId)},
              disabled: this.menuDisabled,
              command: (event: any) => {
                this.activeIndex = 0;
              }
            },
            {
              label: 'Communication', icon: 'fa fa-map-marker', routerLink: Loantransactionconstant.COMPOUND_INTEREST_LOANS_COMMUNICATON,queryParams: { id: this.encryptDecryptService.encrypt(this.ciLoanApplicationId)},
              disabled: this.menuDisabled,
              command: (event: any) => {
                this.activeIndex = 2;
              }
            },
            {
              label: 'Application', icon: 'fa fa-id-badge', routerLink: Loantransactionconstant.COMPOUND_INTEREST_LOANS_APPLICATIOIN_DETAILS,queryParams: { id: this.encryptDecryptService.encrypt(this.ciLoanApplicationId)},
              disabled: this.menuDisabled,
              command: (event: any) => {
                this.activeIndex = 3;
              }
            },
            {
              label: 'Nominee', icon: 'fa fa-user-o', routerLink: Loantransactionconstant.COMPOUND_INTEREST_LOANS_NOMINEE,queryParams: { id: this.encryptDecryptService.encrypt(this.ciLoanApplicationId)},
              disabled: this.menuDisabled,
              command: (event: any) => {
                this.activeIndex = 5;
              }
            },
            {
              label: 'Loan Guarantor', icon: 'fa fa-male', routerLink: Loantransactionconstant.COMPOUND_INTEREST_LOANS_GUARANTOR,queryParams: { id: this.encryptDecryptService.encrypt(this.ciLoanApplicationId)},
              disabled: this.menuDisabled,
              command: (event: any) => {
                this.activeIndex = 6;
              }
            },
            {
              label: 'Loan Mortagage', icon: 'fa fa-puzzle-piece', routerLink: Loantransactionconstant.COMPOUND_INTEREST_LOANS_MORTAGAGE,queryParams: { id: this.encryptDecryptService.encrypt(this.ciLoanApplicationId)},
              disabled: this.menuDisabled,
              command: (event: any) => {
                this.activeIndex = 7;
              }
            },
            {
              label: 'Loan Documents', icon: 'fa fa-files-o', routerLink: Loantransactionconstant.COMPOUND_INTEREST_LOANS_DOCUMENTS,queryParams: { id: this.encryptDecryptService.encrypt(this.ciLoanApplicationId)},
              disabled: this.menuDisabled,
              command: (event: any) => {
                this.activeIndex = 8;
              }
            },
            {
              label: 'Loan Genealogy Tree', icon: 'fa fa-sitemap', routerLink: Loantransactionconstant.COMPOUND_INTEREST_LOANS_GENEALOGY_TREE,queryParams: { id: this.encryptDecryptService.encrypt(this.ciLoanApplicationId)},
              disabled: this.menuDisabled,
              command: (event: any) => {
                this.activeIndex = 9;
              }
            }
          ];
        }
        else {
          this.items = [
            {
              label: 'KYC', icon: 'fa fa-podcast', routerLink: Loantransactionconstant.COMPOUND_INTEREST_LOANS_MEMBERSHIP_DETAILS,queryParams: { id: this.encryptDecryptService.encrypt(this.ciLoanApplicationId)},
              disabled: this.menuDisabled,
              command: (event: any) => {
                this.activeIndex = 0;
              }
            },
            {
              label: 'Communication', icon: 'fa fa-map-marker', routerLink: Loantransactionconstant.COMPOUND_INTEREST_LOANS_COMMUNICATON,queryParams: { id: this.encryptDecryptService.encrypt(this.ciLoanApplicationId)},
              disabled: this.menuDisabled,
              command: (event: any) => {
                this.activeIndex = 2;
              }
            },
            {
              label: 'Application', icon: 'fa fa-id-badge', routerLink: Loantransactionconstant.COMPOUND_INTEREST_LOANS_APPLICATIOIN_DETAILS,queryParams: { id: this.encryptDecryptService.encrypt(this.ciLoanApplicationId)},
              disabled: this.menuDisabled,
              command: (event: any) => {
                this.activeIndex = 3;
              }
            },
            {
              label: 'Joint Account', icon: 'fa fa-handshake-o', routerLink: Loantransactionconstant.COMPOUND_INTEREST_LOANS_CO_APPLICANT_DETAILS,queryParams: { id: this.encryptDecryptService.encrypt(this.ciLoanApplicationId)},
              disabled: this.menuDisabled,
              command: (event: any) => {
                this.activeIndex = 4;
              }
            },
            {
              label: 'Nominee', icon: 'fa fa-user-o', routerLink: Loantransactionconstant.COMPOUND_INTEREST_LOANS_NOMINEE,queryParams: { id: this.encryptDecryptService.encrypt(this.ciLoanApplicationId)},
              disabled: this.menuDisabled,
              command: (event: any) => {
                this.activeIndex = 5;
              }
            },
            {
              label: 'Loan Guarantor', icon: 'fa fa-male', routerLink: Loantransactionconstant.COMPOUND_INTEREST_LOANS_GUARANTOR,queryParams: { id: this.encryptDecryptService.encrypt(this.ciLoanApplicationId)},
              disabled: this.menuDisabled,
              command: (event: any) => {
                this.activeIndex = 6;
              }
            },
            {
              label: 'Loan Mortagage', icon: 'fa fa-puzzle-piece', routerLink: Loantransactionconstant.COMPOUND_INTEREST_LOANS_MORTAGAGE,queryParams: { id: this.encryptDecryptService.encrypt(this.ciLoanApplicationId)},
              disabled: this.menuDisabled,
              command: (event: any) => {
                this.activeIndex = 7;
              }
            },
            {
              label: 'Loan Documents', icon: 'fa fa-files-o', routerLink: Loantransactionconstant.COMPOUND_INTEREST_LOANS_DOCUMENTS,queryParams: { id: this.encryptDecryptService.encrypt(this.ciLoanApplicationId)},
              disabled: this.menuDisabled,
              command: (event: any) => {
                this.activeIndex = 8;
              }
            },
            {
              label: 'Loan Genealogy Tree', icon: 'fa fa-sitemap', routerLink: Loantransactionconstant.COMPOUND_INTEREST_LOANS_GENEALOGY_TREE,queryParams: { id: this.encryptDecryptService.encrypt(this.ciLoanApplicationId)},
              disabled: this.menuDisabled,
              command: (event: any) => {
                this.activeIndex = 9;
              }
            }
          ];
        }
      }
    }
    else {
      this.itemListWithoutParams();
    }
    this.activeItem = this.items[this.activeIndex];
  }


  memberTypeCheck(memberType: any, data: any) {
    if (memberType == MemberShipTypesData.INDIVIDUAL) {
      this.individualFlag = true;
      this.groupFlag = false;
      this.institutionFlag = false;
      this.membershipBasicDetailsModel = data.individualMemberDetailsDTO;
      if (this.membershipBasicDetailsModel.dob != null && this.membershipBasicDetailsModel.dob != undefined) {
        this.membershipBasicDetailsModel.dobVal = this.datePipe.transform(this.membershipBasicDetailsModel.dob, this.orgnizationSetting.datePipe);
      }
      if (this.membershipBasicDetailsModel.admissionDate != null && this.membershipBasicDetailsModel.admissionDate != undefined) {
        this.membershipBasicDetailsModel.admissionDateVal = this.datePipe.transform(this.membershipBasicDetailsModel.admissionDate, this.orgnizationSetting.datePipe);
      }
      if(this.membershipBasicDetailsModel.isNewMember){
        this.membershipBasicDetailsModel.multipartFileListForPhotoCopy = this.fileUploadService.getFile(this.membershipBasicDetailsModel.photoCopyPath, ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.membershipBasicDetailsModel.photoCopyPath);
      }
      else {
        this.membershipBasicDetailsModel.multipartFileListForPhotoCopy = this.fileUploadService.getFile(this.membershipBasicDetailsModel.photoCopyPath, ERP_TRANSACTION_CONSTANTS.MEMBERSHIP + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.membershipBasicDetailsModel.photoCopyPath);
      }
      this.membershipBasicDetailsModel.tempAdmissionNumber = this.membershipBasicDetailsModel.admissionNumber;
      // this.getMultiPartFileList();
    }
    else if (memberType == MemberShipTypesData.GROUP) {
      this.groupFlag = true;
      this.institutionFlag = false;
      this.individualFlag = false;
      this.membershipGroupDetailsModel = data.memberGroupDetailsDTO;
      if (this.membershipGroupDetailsModel.registrationDate != null && this.membershipGroupDetailsModel.registrationDate != undefined) {
        this.membershipGroupDetailsModel.registrationDateVal = this.datePipe.transform(this.membershipGroupDetailsModel.registrationDate, this.orgnizationSetting.datePipe);
      }
      if (this.membershipGroupDetailsModel.admissionDate != null && this.membershipGroupDetailsModel.admissionDate != undefined) {
        this.membershipGroupDetailsModel.admissionDateVal = this.datePipe.transform(this.membershipGroupDetailsModel.admissionDate, this.orgnizationSetting.datePipe);
      }
      if(this.membershipGroupDetailsModel.admissionNumber != null && this.membershipGroupDetailsModel.admissionNumber != undefined){
        this.membershipGroupDetailsModel.tempAdmissionNumber = this.membershipGroupDetailsModel.admissionNumber;
      }
      if (this.membershipGroupDetailsModel.isNewMember) {
            this.groupPrmotersList=this.membershipGroupDetailsModel.groupPromoterList ;
          //   for(let promoter of this.groupPrmotersList){
          //   if (promoter.dob != null && promoter.dob != undefined) {
          //     promoter.memberDobVal = this.datePipe.transform(this.membershipInstitutionDetailsModel.registrationDate, this.orgnizationSetting.datePipe);
          //   }
          //   if (promoter.startDate != null && promoter.startDate != undefined) {
          //     promoter.startDateVal = this.datePipe.transform(this.membershipInstitutionDetailsModel.admissionDate, this.orgnizationSetting.datePipe);
          //   }
          // }
      }
    }
    else if (memberType == MemberShipTypesData.INSTITUTION) {
      this.institutionFlag = true;
      this.groupFlag = false;
      this.individualFlag = false;
      this.membershipInstitutionDetailsModel = data.memberInstitutionDTO;
      if (this.membershipInstitutionDetailsModel.registrationDate != null && this.membershipInstitutionDetailsModel.registrationDate != undefined) {
        this.membershipInstitutionDetailsModel.registrationDateVal = this.datePipe.transform(this.membershipInstitutionDetailsModel.registrationDate, this.orgnizationSetting.datePipe);
      }
      if (this.membershipInstitutionDetailsModel.admissionDate != null && this.membershipInstitutionDetailsModel.admissionDate != undefined) {
        this.membershipInstitutionDetailsModel.admissionDateVal = this.datePipe.transform(this.membershipInstitutionDetailsModel.admissionDate, this.orgnizationSetting.datePipe);
      }
      if (this.membershipInstitutionDetailsModel.isNewMember ) {
        this.institionPromotersList=this.membershipInstitutionDetailsModel.institutionPromoterList ;
      }
      if(this.membershipInstitutionDetailsModel.admissionNumber != null && this.membershipInstitutionDetailsModel.admissionNumber != undefined){
        this.membershipInstitutionDetailsModel.tempAdmissionNumber = this.membershipInstitutionDetailsModel.admissionNumber;
      }
    }
  }

  isEditCheck(activeIndex: any) {
    if (activeIndex == 0) {
      this.isEdit = true;
    } else if (activeIndex == 1) {
      this.isApplicationEdit = true
    } else if (activeIndex == 2) {
      this.isJointEdit = true
    } else if (activeIndex == 3) {
      this.isCommunicationEdit = true
    } else if (activeIndex == 4) {
      this.isKycEdit = true
    } else if (activeIndex == 4) {
      this.isJointEdit = true
    } else if (activeIndex == 6) {
      this.isNomineeEdit = true
    } else if (activeIndex == 7) {
      this.isGuarantorEdit = true
    } else if (activeIndex == 8) {
      this.isMortgageEdit = true
    } else if (activeIndex == 9) {
      this.isGenealogyEdit = true
    }
  }

  changeStepperSelector(item: any) {
    if (this.menuDisabled) {
      return; // Do nothing if menu is disabled
    }
    this.activeItem = item;
    // this.menuDisabled = !this.menuDisabled;
  }

  ngAfterContentChecked(): void {
    this.ref.detectChanges();
  }


  //membership module admissionNumbers 
  getAllTypeOfMembershipDetails(pacsId: any, branchId: any) {
    this.membershipDetailsService.getAllTypeOfMemberDetailsListFromMemberModule(pacsId, branchId).subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel != null && this.responseModel != undefined) {
        if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
          if (this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
            this.permenentAllTypesOfmembershipList = this.responseModel.data;
            this.allTypesOfmembershipList = this.permenentAllTypesOfmembershipList.filter((obj: any) => obj != null).map((relationType: { id: any; name: any; admissionNumber: any; memberTypeName: any }) => {
              return {
                label: `${relationType.name} - ${relationType.admissionNumber} - ${relationType.memberTypeName}`,
                value: relationType.admissionNumber
              };
            });
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
    });
  }

  navigateTo(activeIndex: any, ciLoanApplicationId: any) {
    switch (activeIndex) {
      case 0:
        if (!this.showForm) {
          this.router.navigate([Loantransactionconstant.COMPOUND_INTEREST_LOANS_MEMBERSHIP_DETAILS], { queryParams: { id: this.encryptDecryptService.encrypt(ciLoanApplicationId) } });
        }
        else {
          this.router.navigate([Loantransactionconstant.COMPOUND_INTEREST_LOANS_NEW_MEMBERSHIP_DETAILS], { queryParams: { id: this.encryptDecryptService.encrypt(ciLoanApplicationId) } });
        }
        break;
      case 1:
        this.router.navigate([Loantransactionconstant.COMPOUND_INTEREST_LOANS_KYC], { queryParams: { id: this.encryptDecryptService.encrypt(ciLoanApplicationId) } });
        break;
      case 2:
        this.router.navigate([Loantransactionconstant.COMPOUND_INTEREST_LOANS_COMMUNICATON], { queryParams: { id: this.encryptDecryptService.encrypt(ciLoanApplicationId) } });
        break;
      case 3:
        this.router.navigate([Loantransactionconstant.COMPOUND_INTEREST_LOANS_APPLICATIOIN_DETAILS], { queryParams: { id: this.encryptDecryptService.encrypt(ciLoanApplicationId) } });
        break;
      case 4:
        this.router.navigate([Loantransactionconstant.COMPOUND_INTEREST_LOANS_CO_APPLICANT_DETAILS], { queryParams: { id: this.encryptDecryptService.encrypt(ciLoanApplicationId) } });
        break;
      case 5:
        this.router.navigate([Loantransactionconstant.COMPOUND_INTEREST_LOANS_NOMINEE], { queryParams: { id: this.encryptDecryptService.encrypt(ciLoanApplicationId) } });
        break;
      case 6:
        this.router.navigate([Loantransactionconstant.COMPOUND_INTEREST_LOANS_GUARANTOR], { queryParams: { id: this.encryptDecryptService.encrypt(ciLoanApplicationId) } });
        break;
      case 7:
        this.router.navigate([Loantransactionconstant.COMPOUND_INTEREST_LOANS_MORTAGAGE], { queryParams: { id: this.encryptDecryptService.encrypt(ciLoanApplicationId) } });
        break;
      case 8:
        this.router.navigate([Loantransactionconstant.COMPOUND_INTEREST_LOANS_DOCUMENTS], { queryParams: { id: this.encryptDecryptService.encrypt(ciLoanApplicationId) } });
        break;
      case 9:
        this.router.navigate([Loantransactionconstant.COMPOUND_INTEREST_LOANS_GENEALOGY_TREE], { queryParams: { id: this.encryptDecryptService.encrypt(ciLoanApplicationId) } });
        break;
    }
  }

  prevStep(activeIndex: number) {
    this.activeIndex = activeIndex - 1;
    if (activeIndex == 0) {
      this.navigateTo(this.activeIndex, this.ciLoanApplicationId);
    }
    else if (activeIndex == 1) {
      this.navigateTo(this.activeIndex, this.ciLoanApplicationId);
    }
    else if (activeIndex == 2) {
      if (!this.showForm) {
        this.activeIndex = this.activeIndex - 1;
      }
      this.navigateTo(this.activeIndex, this.ciLoanApplicationId);
    }
    else if (activeIndex == 3) {
      this.navigateTo(this.activeIndex, this.ciLoanApplicationId);
    }
    else if (activeIndex == 4) {
      this.navigateTo(this.activeIndex, this.ciLoanApplicationId);
    }
    else if (activeIndex == 5) {
      if (this.ciLoanApplicationModel.operationTypeName != "Joint") {
        this.flag = false;
        this.activeIndex = this.activeIndex - 1;
      }
      this.navigateTo(this.activeIndex, this.ciLoanApplicationId);
    }
    else if (activeIndex == 6) {
      this.navigateTo(this.activeIndex, this.ciLoanApplicationId);
    }
    else if (activeIndex == 7) {
      this.navigateTo(this.activeIndex, this.ciLoanApplicationId);
    }
    else if (activeIndex == 8) {
      this.navigateTo(this.activeIndex, this.ciLoanApplicationId);
    }
    else if (activeIndex == 9) {
      this.navigateTo(this.activeIndex, this.ciLoanApplicationId);
    }
  }

  nextStep(activeIndex: number) {
    if (activeIndex == 0) {
      if (this.memberTypeName == "Individual") {
        this.setMemberDetailsToCiApplicationDetails(this.ciLoanApplicationModel.individualMemberDetailsDTO);
      } else if (this.memberTypeName == "Group") {
        this.setMemberDetailsToCiApplicationDetails(this.ciLoanApplicationModel.memberGroupDetailsDTO);
      } else if (this.memberTypeName == "Institution") {
        this.setMemberDetailsToCiApplicationDetails(this.ciLoanApplicationModel.memberInstitutionDTO);
      }
      this.addAOrUpdateCiApplicationDetails(activeIndex, "next");
    }
    else if (activeIndex == 2) {
      this.addOrUpdateCommunicationDetails(activeIndex, "next");
    } else if (activeIndex == 3) {
      if (!this.isNomineeEdit) {
        this.flagForNomineeTypeValue = 0;
      } else {
        this.flagForNomineeTypeValue = this.ciLoanNomineeModel.flagForNomineeTypeValue;
      }
      this.addAOrUpdateCiApplicationDetails(activeIndex, "next");
    } else if (activeIndex == 4) {
      this.saveJointHolder();
    } else if (activeIndex == 5) {
      // this.activeIndex = activeIndex + 1;
      // this.navigateTo(this.activeIndex, this.ciLoanApplicationId);
      this.addOrUpdateNomineeDetails();
      if (this.ciLoanGuardianModel != null && this.ciLoanGuardianModel != undefined  && Object.keys(this.ciLoanGuardianModel).length > 0) {
        this.addOrUpdateGuardianDetails();
      }
    } else if (activeIndex == 6) {
      this.saveOrUpdateGuarantorDetails();
    } else if (activeIndex == 7) {
      if (this.ciGoldMortgageLoanModel.collateralType == 1) {
        this.saveOrUpdateGoldLoanMortagageDetails(activeIndex, "next");
      } else if (this.ciLandMortgageLoanModel.collateralType == 2) {
        this.saveOrUpdateLandLoanMortagageDetails(activeIndex, "next");
      } else if (this.ciBondsMortgageLoanModel.collateralType == 3) {
        this.saveOrUpdateBondLoanMortagageDetails(activeIndex, "next");
      } else if (this.ciVehicleMortgageLoanModel.collateralType == 4) {
        this.saveOrUpdateVehicleLoanMortagageDetails(activeIndex, "next");
      } else if (this.ciStorageMortgageLoanModel.collateralType == 5) {
        this.saveOrUpdateStorageLoanMortagageDetails(activeIndex, "next");
      } else if (this.ciOthersMortgageLoanModel.collateralType == 6) {
        this.saveOrUpdateOtherLoanMortagageDetails(activeIndex, "next");
      }
    } else if (activeIndex == 8) {
      this.saveOrUpdateDocumentDetails(activeIndex, "next");
    } else if (activeIndex == 9) {
      this.saveOrUpdateGenealogyDetails(activeIndex, "next");
    } else {
      this.activeIndex = activeIndex + 1;
      this.navigateTo(this.activeIndex, this.ciLoanApplicationId);
    }
  }

  setMemberDetailsToCiApplicationDetails(memeberdetailsObj: any) {
    this.ciLoanApplicationModel.memberTypeId = memeberdetailsObj.memberTypeId;
    // this.ciLoanApplicationModel.memberTypeName = memeberdetailsObj.memberTypeName;
    // this.ciLoanApplicationModel.name = memeberdetailsObj.name;
    // // this.ciLoanApplicationModel.surName = memeberdetailsObj.surName;
    // this.ciLoanApplicationModel.email = memeberdetailsObj.emailId;
    // this.ciLoanApplicationModel.mobileNumber = memeberdetailsObj.mobileNumber;
  }
  back() {
    this.router.navigate([Loantransactionconstant.COMPOUND_INTEREST_LOAN]);
  }

  cancel() {
    this.router.navigate([Loantransactionconstant.COMPOUND_INTEREST_LOAN]);
  }

  navigateToPreview() {
    this.buttonDisabled = true;
    this.router.navigate([Loantransactionconstant.COMPOUND_INTEREST_LOANS_PREVIEW], { queryParams: { id: this.encryptDecryptService.encrypt(this.ciLoanApplicationId), editbutton: this.encryptDecryptService.encrypt(applicationConstants.ACTIVE), isGridPage: this.encryptDecryptService.encrypt(applicationConstants.ACTIVE) } });
  }


  onChange() {

    this.commonFunctionsService.setStorageValue(applicationConstants.B_CLASS_MEMBER_CREATION, this.showForm);
    if (this.showForm) {
      this.router.navigate([Loantransactionconstant.COMPOUND_INTEREST_LOANS_NEW_MEMBERSHIP_DETAILS], { queryParams: { showForm: this.encryptDecryptService.encrypt(this.showForm) } });
    }
    else {
      this.router.navigate([Loantransactionconstant.COMPOUND_INTEREST_LOANS_MEMBERSHIP_DETAILS], { queryParams: { showForm: this.encryptDecryptService.encrypt(this.showForm) } });
    }
  }

  getCiLoanApplicationsById(id: any) {
    this.ciLoanApplicationService.getLoanApplicationDetailsByLoanApplicationId(id).subscribe((data: any) => {
      this.responseModel = data;
      if (this.responseModel != null && this.responseModel != undefined) {
        if (this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
          if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
            if (this.responseModel.data.length > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
              this.memberDropDownDisable = true;
              this.ciLoanApplicationModel = this.responseModel.data[0];
              this.admissionNumberDropDownDisable = true;
              this.isNewMemberCreation = true;
              this.admissionNumber = this.ciLoanApplicationModel.admissionNo;

              if (this.ciLoanApplicationModel.individualMemberDetailsDTO != null && this.ciLoanApplicationModel.individualMemberDetailsDTO != undefined) {
                this.membershipBasicDetailsModel = this.ciLoanApplicationModel.individualMemberDetailsDTO;

                if (this.membershipBasicDetailsModel.photoCopyPath != null && this.membershipBasicDetailsModel.photoCopyPath != undefined) {
                  if(this.membershipBasicDetailsModel.isNewMember){
                    this.membershipBasicDetailsModel.multipartFileListForPhotoCopy = this.fileUploadService.getFile(this.membershipBasicDetailsModel.photoCopyPath, ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.membershipBasicDetailsModel.photoCopyPath);
                  }
                  else {
                    this.membershipBasicDetailsModel.multipartFileListForPhotoCopy = this.fileUploadService.getFile(this.membershipBasicDetailsModel.photoCopyPath, ERP_TRANSACTION_CONSTANTS.MEMBERSHIP + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.membershipBasicDetailsModel.photoCopyPath);
                  }
                  this.photoCopyFlag = true;
                }
                if (this.membershipBasicDetailsModel.signatureCopyPath != null && this.membershipBasicDetailsModel.signatureCopyPath != undefined) {
                  if(this.membershipBasicDetailsModel.isNewMember){
                    this.membershipBasicDetailsModel.multipartFileListForsignatureCopyPath = this.fileUploadService.getFile(this.membershipBasicDetailsModel.signatureCopyPath, ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.membershipBasicDetailsModel.signatureCopyPath);
                  }
                  else {
                    this.membershipBasicDetailsModel.multipartFileListForsignatureCopyPath = this.fileUploadService.getFile(this.membershipBasicDetailsModel.signatureCopyPath, ERP_TRANSACTION_CONSTANTS.MEMBERSHIP + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.membershipBasicDetailsModel.signatureCopyPath);
                  }
                }

                if (this.ciLoanApplicationModel.memberTypeId != null && this.ciLoanApplicationModel.memberTypeId != undefined)
                  this.memberTypeId = this.membershipBasicDetailsModel.memberTypeId;

                if (this.ciLoanApplicationModel.memberTypeName != null && this.ciLoanApplicationModel.memberTypeName != undefined)
                  this.memberTypeName = this.membershipBasicDetailsModel.memberTypeName;

                if (this.membershipBasicDetailsModel.isNewMember != undefined && this.membershipBasicDetailsModel.isNewMember != null) {
                  this.showForm = this.membershipBasicDetailsModel.isNewMember;
                  this.itemList();
                }

                if (this.membershipBasicDetailsModel.dob != null && this.membershipBasicDetailsModel.dob != undefined)
                  this.membershipBasicDetailsModel.dobVal = this.datePipe.transform(this.membershipBasicDetailsModel.dob, this.orgnizationSetting.datePipe);

                if (this.membershipBasicDetailsModel.admissionDate != null && this.membershipBasicDetailsModel.admissionDate != undefined)
                  this.membershipBasicDetailsModel.admissionDateVal = this.datePipe.transform(this.membershipBasicDetailsModel.admissionDate, this.orgnizationSetting.datePipe);

                if (this.membershipBasicDetailsModel.isKycApproved != null && this.membershipBasicDetailsModel.isKycApproved != undefined && this.membershipBasicDetailsModel.isKycApproved)
                  this.isKycApproved = applicationConstants.KYC_APPROVED_NAME;
                else
                  this.isKycApproved = applicationConstants.KYC_NOT_APPROVED_NAME;

                this.individualFlag = true;
                this.groupFlag = false;
                this.institutionFlag = false;
                this.admissionNumber = this.ciLoanApplicationModel.admissionNo;
                
              }
              if (this.ciLoanApplicationModel.memberGroupDetailsDTO != null && this.ciLoanApplicationModel.memberGroupDetailsDTO != undefined) {
                this.membershipGroupDetailsModel = this.ciLoanApplicationModel.memberGroupDetailsDTO;
                this.membershipGroupDetailsModel.admissionNumber = this.ciLoanApplicationModel.memberGroupDetailsDTO.tempAdmissionNumber;
                if (this.membershipGroupDetailsModel.memberTypeId != null && this.membershipGroupDetailsModel.memberTypeId != undefined)
                  this.memberTypeId = this.membershipGroupDetailsModel.memberTypeId;

                if (this.membershipGroupDetailsModel.memberTypeName != null && this.membershipGroupDetailsModel.memberTypeName != undefined)
                  this.memberTypeName = this.membershipGroupDetailsModel.memberTypeName;

                if (this.membershipGroupDetailsModel.isNewMember != undefined && this.membershipGroupDetailsModel.isNewMember != null) {
                  this.showForm = this.membershipGroupDetailsModel.isNewMember;
                  this.itemList();
                }

                if (this.membershipGroupDetailsModel.registrationDate != null && this.membershipGroupDetailsModel.registrationDate != undefined)
                  this.membershipGroupDetailsModel.registrationDateVal = this.datePipe.transform(this.membershipGroupDetailsModel.registrationDate, this.orgnizationSetting.datePipe);

                if (this.membershipGroupDetailsModel.admissionDate != null && this.membershipGroupDetailsModel.admissionDate != undefined)
                  this.membershipGroupDetailsModel.admissionDateVal = this.datePipe.transform(this.membershipGroupDetailsModel.admissionDate, this.orgnizationSetting.datePipe);

                if (this.membershipGroupDetailsModel.isKycApproved != null && this.membershipGroupDetailsModel.isKycApproved != undefined && this.membershipGroupDetailsModel.isKycApproved)
                  this.isKycApproved = applicationConstants.KYC_APPROVED_NAME;
                else
                  this.isKycApproved = applicationConstants.KYC_NOT_APPROVED_NAME;

                if (this.membershipGroupDetailsModel.groupPromoterList != null && this.membershipGroupDetailsModel.groupPromoterList != undefined)
                  this.groupPrmotersList = this.membershipGroupDetailsModel.groupPromoterList;
                for(let promoter of this.groupPrmotersList){
                  promoter.memDobVal = this.datePipe.transform(promoter.dob, this.orgnizationSetting.datePipe);
                  promoter.startDateVal = this.datePipe.transform(promoter.startDate, this.orgnizationSetting.datePipe);
                }

                this.individualFlag = false;
                this.groupFlag = true;
                this.institutionFlag = false;
                this.admissionNumber = this.ciLoanApplicationModel.admissionNo;
              }
              if (this.ciLoanApplicationModel.memberInstitutionDTO != null && this.ciLoanApplicationModel.memberInstitutionDTO != undefined) {
                this.membershipInstitutionDetailsModel = this.ciLoanApplicationModel.memberInstitutionDTO;

                if (this.membershipInstitutionDetailsModel.memberTypeId != null && this.membershipInstitutionDetailsModel.memberTypeId != undefined)
                  this.memberTypeId = this.membershipInstitutionDetailsModel.memberTypeId;

                if (this.membershipInstitutionDetailsModel.memberTypeName != null && this.membershipInstitutionDetailsModel.memberTypeName != undefined)
                  this.memberTypeName = this.membershipInstitutionDetailsModel.memberTypeName;

                if (this.membershipInstitutionDetailsModel.isNewMember != undefined && this.membershipInstitutionDetailsModel.isNewMember != null) {
                  this.showForm = this.membershipInstitutionDetailsModel.isNewMember;
                  this.itemList();
                }

                if (this.membershipInstitutionDetailsModel.registrationDate != null && this.membershipInstitutionDetailsModel.registrationDate != undefined)
                  this.membershipInstitutionDetailsModel.registrationDateVal = this.datePipe.transform(this.membershipInstitutionDetailsModel.registrationDate, this.orgnizationSetting.datePipe);

                if (this.membershipInstitutionDetailsModel.admissionDate != null && this.membershipInstitutionDetailsModel.admissionDate != undefined)
                  this.membershipInstitutionDetailsModel.admissionDateVal = this.datePipe.transform(this.membershipInstitutionDetailsModel.admissionDate, this.orgnizationSetting.datePipe);

                if (this.membershipInstitutionDetailsModel.isKycCompleted != null && this.membershipInstitutionDetailsModel.isKycCompleted != undefined && this.membershipInstitutionDetailsModel.isKycCompleted)
                  this.isKycApproved = applicationConstants.KYC_APPROVED_NAME;
                else
                  this.isKycApproved = applicationConstants.KYC_NOT_APPROVED_NAME;

                if (this.membershipInstitutionDetailsModel.institutionPromoterList.length && this.membershipInstitutionDetailsModel.institutionPromoterList != null && this.membershipInstitutionDetailsModel.institutionPromoterList != undefined)
                  this.institionPromotersList = this.membershipInstitutionDetailsModel.institutionPromoterList;
                for(let promoter of this.institionPromotersList){
                  promoter.memDobVal = this.datePipe.transform(promoter.dob, this.orgnizationSetting.datePipe);
                  promoter.startDateVal = this.datePipe.transform(promoter.startDate, this.orgnizationSetting.datePipe);
                }

                this.individualFlag = false;
                this.groupFlag = false;
                this.institutionFlag = true;
                this.admissionNumber = this.ciLoanApplicationModel.admissionNo;
              }
            }
          }
        }
      }
    }, error => {
      this.commonComponent.stopSpinner();
      this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: applicationConstants.SERVER_DOWN_ERROR }];
      setTimeout(() => {
        this.msgs = [];
      }, 3000);
    });
  }
  OnChangeAdmissionNumber(admissionNo: any) {
    const filteredItem = this.allTypesOfmembershipList.find((item: { value: any; }) => item.value === admissionNo);
    const parts = filteredItem.label.split(' - ');
    let label = parts[parts.length - 1].trim();
    this.membershipBasicDetailsModel.memberTypeName = label;
    const admissionNumber = filteredItem.label.split(' - ');
    let admissionNumberLable = parts[parts.length - 2].trim();
    this.admissionNumber = admissionNumberLable;
    if (this.membershipBasicDetailsModel.memberTypeName == MemberShipTypesData.INDIVIDUAL) {
      this.individualFlag = true;
      this.groupFlag = false;
      this.institutionFlag = false;
      this.getMemberDetailsByAdmissionNUmber(admissionNo);
    } else if (this.membershipBasicDetailsModel.memberTypeName ==  MemberShipTypesData.GROUP) {
      this.groupFlag = true;
      this.institutionFlag = false;
      this.individualFlag = false;
      this.getGroupDetailsByAdmissionNumber(admissionNo);
    } else if (this.membershipBasicDetailsModel.memberTypeName ==  MemberShipTypesData.INSTITUTION) {
      this.institutionFlag = true;
      this.individualFlag = false;
      this.groupFlag = false;
      this.getInstitutionDetailsByAdmissionNumber(admissionNo);
    }
    this.router.navigate([Loantransactionconstant.COMPOUND_INTEREST_LOANS_MEMBERSHIP_DETAILS], { queryParams: { admissionNo: this.encryptDecryptService.encrypt(admissionNo) } });

  }
  //get member module data by admissionNUmber
  getMemberDetailsByAdmissionNUmber(admissionNumber: any) {
    this.membershipDetailsService.getMembershipBasicDetailsByAdmissionNumber(admissionNumber).subscribe((data: any) => {
      this.responseModel = data;
      if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
        if (this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
          this.membershipBasicDetailsModel = this.responseModel.data[0];
          this.membershipBasicDetailsModel.ciLoanCommunicationDTOList = this.responseModel.data[0].memberShipCommunicationDetailsDTO;

          if (this.membershipBasicDetailsModel.dob != null && this.membershipBasicDetailsModel.dob != undefined) {
            this.membershipBasicDetailsModel.dobVal = this.datePipe.transform(this.membershipBasicDetailsModel.dob, this.orgnizationSetting.datePipe);
          }
          if (this.membershipBasicDetailsModel.admissionDate != null && this.membershipBasicDetailsModel.admissionDate != undefined) {
            this.membershipBasicDetailsModel.admissionDateVal = this.datePipe.transform(this.membershipBasicDetailsModel.admissionDate, this.orgnizationSetting.datePipe);
          }
          if (this.membershipBasicDetailsModel.ciLoanCommunicationDTOList != null && this.membershipBasicDetailsModel.ciLoanCommunicationDTOList != undefined) {
            this.ciLoanCommunicationModel = this.membershipBasicDetailsModel.ciLoanCommunicationDTOList;
          }
          if (this.membershipBasicDetailsModel.photoCopyPath != null && this.membershipBasicDetailsModel.photoCopyPath != undefined) {
            this.membershipBasicDetailsModel.multipartFileListForPhotoCopy = this.fileUploadService.getFile(this.membershipBasicDetailsModel.photoCopyPath, ERP_TRANSACTION_CONSTANTS.MEMBERSHIP + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.membershipBasicDetailsModel.photoCopyPath);
            this.photoCopyFlag = true;
          }
          if (this.membershipBasicDetailsModel.signatureCopyPath != null && this.membershipBasicDetailsModel.signatureCopyPath != undefined) {
            this.membershipBasicDetailsModel.multipartFileListForsignatureCopyPath = this.fileUploadService.getFile(this.membershipBasicDetailsModel.signatureCopyPath, ERP_TRANSACTION_CONSTANTS.MEMBERSHIP + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.membershipBasicDetailsModel.signatureCopyPath);
          }
          if (this.membershipBasicDetailsModel.isKycApproved != null && this.membershipBasicDetailsModel.isKycApproved != undefined && this.membershipBasicDetailsModel.isKycApproved) {
            this.isKycApproved = applicationConstants.KYC_APPROVED_NAME;
          }
          else {
            this.isKycApproved = applicationConstants.KYC_NOT_APPROVED_NAME;
          }
          this.admissionNumber = this.membershipBasicDetailsModel.admissionNumber;
          this.membershipBasicDetailsModel.tempAdmissionNumber = this.membershipBasicDetailsModel.admissionNumber;
          this.ciLoanApplicationModel.memberTypeName = this.membershipBasicDetailsModel.memberTypeName;
          this.ciLoanApplicationModel.individualMemberDetailsDTO = this.membershipBasicDetailsModel;
        }
      }
      else {
        this.commonComponent.stopSpinner();
        this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: this.responseModel.statusMsg }];
        setTimeout(() => {
          this.msgs = [];
        }, 3000);
      }

    }, error => {
      this.commonComponent.stopSpinner();
      this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: applicationConstants.SERVER_DOWN_ERROR }];
      setTimeout(() => {
        this.msgs = [];
      }, 3000);
    });
  }

  //get group details from member module data by admissionNumber
  getGroupDetailsByAdmissionNumber(admissionNUmber: any) {
    this.membershipDetailsService.getMemberGroupByAdmissionNumber(admissionNUmber).subscribe((data: any) => {
      this.responseModel = data;
      if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
        if (this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
          this.membershipGroupDetailsModel = this.responseModel.data[0];

          this.memberTypeName = this.responseModel.data[0].memberTypeName;
          if (this.membershipGroupDetailsModel.registrationDate != null && this.membershipGroupDetailsModel.registrationDate != undefined) {
            this.membershipGroupDetailsModel.registrationDateVal = this.datePipe.transform(this.membershipGroupDetailsModel.registrationDate, this.orgnizationSetting.datePipe);
          }
          if (this.membershipGroupDetailsModel.admissionDate != null && this.membershipGroupDetailsModel.admissionDate != undefined) {
            this.membershipGroupDetailsModel.admissionDateVal = this.datePipe.transform(this.membershipGroupDetailsModel.admissionDate, this.orgnizationSetting.datePipe);
          }
          if (this.membershipGroupDetailsModel.groupPromoterList != null && this.membershipGroupDetailsModel.groupPromoterList != undefined) {
            this.groupPrmotersList = this.membershipGroupDetailsModel.groupPromoterList;
            for(let promoter of this.groupPrmotersList){
              promoter.memDobVal = this.datePipe.transform(promoter.dob, this.orgnizationSetting.datePipe);
              promoter.startDateVal = this.datePipe.transform(promoter.startDate, this.orgnizationSetting.datePipe);
            }
          }
          if (this.membershipGroupDetailsModel.isKycApproved != null && this.membershipGroupDetailsModel.isKycApproved != undefined) {
            this.isKycApproved = applicationConstants.KYC_APPROVED_NAME;
          }
          else {
            this.isKycApproved = applicationConstants.KYC_NOT_APPROVED_NAME;
          }
          this.admissionNumber = this.membershipGroupDetailsModel.admissionNumber;
          this.membershipGroupDetailsModel.tempAdmissionNumber = this.membershipGroupDetailsModel.admissionNumber;
          this.ciLoanApplicationModel.memberTypeName = this.membershipGroupDetailsModel.memberTypeName;
          this.ciLoanApplicationModel.memberGroupDetailsDTO = this.membershipGroupDetailsModel;
        }
      }
      else {
        this.commonComponent.stopSpinner();
        this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: this.responseModel.statusMsg }];
        setTimeout(() => {
          this.msgs = [];
        }, 3000);
      }
    }, error => {
      this.commonComponent.stopSpinner();
      this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: applicationConstants.SERVER_DOWN_ERROR }];
      setTimeout(() => {
        this.msgs = [];
      }, 3000);
    });
  }

  //get member institution details from member module by admissionNumber
  getInstitutionDetailsByAdmissionNumber(admissionNumber: any) {
    this.membershipDetailsService.getMemberIstitutionByAdmissionNumber(admissionNumber).subscribe((data: any) => {
      this.responseModel = data;
      if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
        if (this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
          this.membershipInstitutionDetailsModel = this.responseModel.data[0];
          this.memberTypeName = this.membershipInstitutionDetailsModel.memberTypeName;
          this.ciLoanApplicationModel.memberTypeName = this.membershipInstitutionDetailsModel.memberTypeName;

          if (this.membershipInstitutionDetailsModel.registrationDate != null && this.membershipInstitutionDetailsModel.registrationDate != undefined) {
            this.membershipInstitutionDetailsModel.registrationDateVal = this.datePipe.transform(this.membershipInstitutionDetailsModel.registrationDate, this.orgnizationSetting.datePipe);
          }
          if (this.membershipInstitutionDetailsModel.admissionDate != null && this.membershipInstitutionDetailsModel.admissionDate != undefined) {
            this.membershipInstitutionDetailsModel.admissionDateVal = this.datePipe.transform(this.membershipInstitutionDetailsModel.admissionDate, this.orgnizationSetting.datePipe);
          }
          if (this.membershipInstitutionDetailsModel.institutionPromoterList.length && this.membershipInstitutionDetailsModel.institutionPromoterList != null && this.membershipInstitutionDetailsModel.institutionPromoterList != undefined) {
            this.institionPromotersList = this.membershipInstitutionDetailsModel.institutionPromoterList;
            for(let promoter of this.institionPromotersList){
              promoter.memDobVal = this.datePipe.transform(promoter.dob, this.orgnizationSetting.datePipe);
              promoter.startDateVal = this.datePipe.transform(promoter.startDate, this.orgnizationSetting.datePipe);
            }
          }
          if (this.membershipInstitutionDetailsModel.isKycCompleted != null && this.membershipInstitutionDetailsModel.isKycCompleted != undefined) {
            this.isKycApproved = applicationConstants.KYC_APPROVED_NAME;
          }
          else {
            this.isKycApproved = applicationConstants.KYC_NOT_APPROVED_NAME;
          }
          this.admissionNumber = this.membershipInstitutionDetailsModel.admissionNumber;
          this.membershipInstitutionDetailsModel.tempAdmissionNumber = this.membershipInstitutionDetailsModel.admissionNumber;
        }
      }
      else {
        this.commonComponent.stopSpinner();
        this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: this.responseModel.statusMsg }];
        setTimeout(() => {
          this.msgs = [];
        }, 3000);
      }
    }, error => {
      this.commonComponent.stopSpinner();
      this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: applicationConstants.SERVER_DOWN_ERROR }];
      setTimeout(() => {
        this.msgs = [];
      }, 3000);
    });
  }

  // add or update fd non cumulative account details
  // addAOrUpdateCiApplicationDetails(activeIndex: any, buttonName: any) {
  //   this.ciLoanApplicationModel.pacsId = 1;
  //   this.ciLoanApplicationModel.pacsCode = 12345;
  //   this.ciLoanApplicationModel.branchId = 1;

  //   if (this.ciLoanApplicationModel.id != null) {
  //     this.isApplicationEdit = true;
  //   }
  //   else {
  //     this.isApplicationEdit = false;
  //   }

  //   if (this.ciLoanApplicationModel.individualMemberDetailsDTO != null && this.ciLoanApplicationModel.individualMemberDetailsDTO)
  //     this.membershipBasicDetailsModel = this.ciLoanApplicationModel.individualMemberDetailsDTO;
  //   else if (this.ciLoanApplicationModel.memberGroupDetailsDTO != null && this.ciLoanApplicationModel.memberGroupDetailsDTO)
  //     this. membershipGroupDetailsModel = this.ciLoanApplicationModel.memberGroupDetailsDTO;
  //   else if (this.ciLoanApplicationModel.memberInstitutionDTO != null && this.ciLoanApplicationModel.memberInstitutionDTO)
  //     this.membershipInstitutionDetailsModel = this.ciLoanApplicationModel.memberInstitutionDTO;
  //   // member dates convert
  //   if (this.membershipBasicDetailsModel.dob != null && this.membershipBasicDetailsModel.dob != undefined) {
  //     this.membershipBasicDetailsModel.dob = this.commonFunctionsService.getUTCEpoch(new Date(this.membershipBasicDetailsModel.dob));
  //   }
  //   if (this.membershipBasicDetailsModel.admissionDate != null && this.membershipBasicDetailsModel.admissionDate != undefined) {
  //     this.membershipBasicDetailsModel.admissionDate = this.commonFunctionsService.getUTCEpoch(new Date(this.membershipBasicDetailsModel.admissionDate));
  //   }
  //   // group dates convert
  //   if (this.membershipGroupDetailsModel.registrationDate != null && this.membershipGroupDetailsModel.registrationDate != undefined) {
  //     this.membershipGroupDetailsModel.registrationDate = this.commonFunctionsService.getUTCEpoch(new Date(this.membershipGroupDetailsModel.registrationDate));
  //   }
  //   if (this.membershipGroupDetailsModel.admissionDate != null && this.membershipGroupDetailsModel.admissionDate != undefined) {
  //     this.membershipGroupDetailsModel.admissionDate = this.commonFunctionsService.getUTCEpoch(new Date(this.membershipGroupDetailsModel.admissionDate));
  //   }
  //   // institution dates convert
  //   if (this.membershipInstitutionDetailsModel.registrationDate != null && this.membershipInstitutionDetailsModel.registrationDate != undefined) {
  //     this.membershipInstitutionDetailsModel.registrationDate = this.commonFunctionsService.getUTCEpoch(new Date(this.membershipInstitutionDetailsModel.registrationDate));
  //   }
  //   if (this.membershipInstitutionDetailsModel.admissionDate != null && this.membershipInstitutionDetailsModel.admissionDate != undefined) {
  //     this.membershipInstitutionDetailsModel.admissionDate = this.commonFunctionsService.getUTCEpoch(new Date(this.membershipInstitutionDetailsModel.admissionDate));
  //   }
  //   if (this.ciLoanApplicationModel.applicationDate != null && this.ciLoanApplicationModel.applicationDate != undefined) {
  //     this.ciLoanApplicationModel.applicationDate = this.commonFunctionsService.getUTCEpoch(new Date(this.ciLoanApplicationModel.applicationDate));
  //   }
  //   if (this.ciLoanApplicationModel.loanDueDate != null && this.ciLoanApplicationModel.loanDueDate != undefined) {
  //     this.ciLoanApplicationModel.loanDueDate = this.commonFunctionsService.getUTCEpoch(new Date(this.ciLoanApplicationModel.loanDueDate));
  //   }
  //   if (this.ciLoanApplicationModel.sanctionDate != null && this.ciLoanApplicationModel.sanctionDate != undefined) {
  //     this.ciLoanApplicationModel.sanctionDate = this.commonFunctionsService.getUTCEpoch(new Date(this.ciLoanApplicationModel.sanctionDate));
  //   }
  //   if (this.isApplicationEdit) {
  //     this.ciLoanApplicationModel.statusName = applicationConstants.IS_ACTIVE;
  //     this.ciLoanApplicationService.updateCiLoanApplications(this.ciLoanApplicationModel).subscribe((response: any) => {
  //       this.responseModel = response;
  //       if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
  //         if (this.responseModel.data[0] != undefined && this.responseModel.data[0] != null && this.responseModel.data.length > 0) {
  //           this.ciLoanApplicationModel = this.responseModel.data[0];
  //           if (this.ciLoanApplicationModel.id != undefined && this.ciLoanApplicationModel.id != null)
  //             this.ciLoanApplicationId = this.ciLoanApplicationModel.id;
  //           if (this.ciLoanApplicationModel.operationTypeName != null && this.ciLoanApplicationModel.operationTypeName != undefined)
  //             this.operationTypeName = this.ciLoanApplicationModel.operationTypeName;
  //           if (this.ciLoanApplicationModel.memberTypeName != null && this.ciLoanApplicationModel.memberTypeName != undefined)
  //             this.memberTypeName = this.ciLoanApplicationModel.memberTypeName;
  //           if (this.responseModel.data[0].accountNumber != null && this.ciLoanApplicationModel.accountNumber != undefined)
  //             this.accountNumber = this.ciLoanApplicationModel.accountNumber;
  //           if (this.ciLoanApplicationModel.admissionNo != null && this.ciLoanApplicationModel.admissionNo != undefined)
  //             this.admissionNumber = this.ciLoanApplicationModel.admissionNo;
  //         }
  //         this.previousStepFlag = true;
  //         this.memberDropDownDisable = true;

  //         if (activeIndex === 3) {
  //           activeIndex = this.accountTypeBasedActiveIndexInscrement(this.ciLoanApplicationModel.operationTypeName);
  //         }else if (this.activeIndex === 0) {
  //           this.activeIndexIncrement();
  //         }
  //         this.msgs = [{ severity: 'success', summary: applicationConstants.STATUS_SUCCESS, detail: this.responseModel.statusMsg }];
  //         setTimeout(() => {
  //           this.msgs = [];
  //         }, 1200);
  //         this.navigateTo(this.activeIndex, this.ciLoanApplicationId)
  //         this.completed = 1;
  //       } else {
  //         this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: this.responseModel.statusMsg }];
  //         setTimeout(() => {
  //           this.msgs = [];
  //         }, 3000);
  //       }
  //     }, (error: any) => {
  //       this.commonComponent.stopSpinner();
  //       this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: applicationConstants.SERVER_DOWN_ERROR }];
  //       setTimeout(() => {
  //         this.msgs = [];
  //       }, 3000);
  //     });
  //   } else {
  //     this.ciLoanApplicationModel.statusName = applicationConstants.IS_ACTIVE;
  //     this.ciLoanApplicationModel.statusName = "Created";
  //     this.ciLoanApplicationService.addCiLoanApplications(this.ciLoanApplicationModel).subscribe((response: any) => {
  //       this.responseModel = response;
  //       if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
  //         if (this.responseModel.data[0] != undefined && this.responseModel.data[0] != null && this.responseModel.data.length > 0) {
  //           this.ciLoanApplicationModel = this.responseModel.data[0];
  //           if (this.ciLoanApplicationModel.id != undefined && this.ciLoanApplicationModel.id != null)
  //             this.ciLoanApplicationId = this.ciLoanApplicationModel.id;
  //           if (this.ciLoanApplicationModel.operationTypeName != null && this.ciLoanApplicationModel.operationTypeName != undefined)
  //             this.operationTypeName = this.ciLoanApplicationModel.operationTypeName;
  //           if (this.ciLoanApplicationModel.memberTypeName != null && this.ciLoanApplicationModel.memberTypeName != undefined)
  //             this.memberTypeName = this.ciLoanApplicationModel.memberTypeName;
  //           if (this.responseModel.data[0].accountNumber != null && this.ciLoanApplicationModel.accountNumber != undefined)
  //             this.accountNumber = this.ciLoanApplicationModel.accountNumber;
  //           if (this.ciLoanApplicationModel.admissionNo != null && this.ciLoanApplicationModel.admissionNo != undefined)
  //             this.admissionNumber = this.ciLoanApplicationModel.admissionNo;

  //           this.isNewMemberCreation = true;
  //           this.memberDropDownDisable = true;
  //         }
  //         this.msgs = [{ severity: 'success', summary: applicationConstants.STATUS_SUCCESS, detail: this.responseModel.statusMsg }];
  //         setTimeout(() => {
  //           this.msgs = [];
  //         }, 1200);
  //         if (this.activeIndex == 3) {
  //           activeIndex = this.accountTypeBasedActiveIndexInscrement(this.ciLoanApplicationModel.operationTypeName);
  //         }else if (this.activeIndex === 0) {
  //           this.activeIndexIncrement();
  //         }
  //         this.navigateTo(this.activeIndex, this.ciLoanApplicationId)
  //         this.completed = 1;
  //       } else {
  //         this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: this.responseModel.statusMsg }];
  //         setTimeout(() => {
  //           this.msgs = [];
  //         }, 3000);
  //       }
  //     }, (error: any) => {
  //       this.commonComponent.stopSpinner();
  //       this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: applicationConstants.SERVER_DOWN_ERROR }];
  //       setTimeout(() => {
  //         this.msgs = [];
  //       }, 3000);
  //     });
  //   }
  // }

  addAOrUpdateCiApplicationDetails(activeIndex: any, buttonName: any) {
    this.ciLoanApplicationModel.pacsId = this.pacsId;
    this.ciLoanApplicationModel.pacsCode = this.pacsCode;
    this.ciLoanApplicationModel.branchId = this.branchId;
    this.memberTypeId = this.ciLoanApplicationModel.memberTypeId;
   
    if (this.ciLoanApplicationModel.id != null) {
      this.isApplicationEdit = true;
    } else {
      this.isApplicationEdit = false;
    }
    if(activeIndex != 3){
      if (this.ciLoanApplicationModel.individualMemberDetailsDTO != null && this.ciLoanApplicationModel.individualMemberDetailsDTO)
        this.membershipBasicDetailsModel = this.ciLoanApplicationModel.individualMemberDetailsDTO;
      else if (this.ciLoanApplicationModel.memberGroupDetailsDTO != null && this.ciLoanApplicationModel.memberGroupDetailsDTO)
        this. membershipGroupDetailsModel = this.ciLoanApplicationModel.memberGroupDetailsDTO;
      else if (this.ciLoanApplicationModel.memberInstitutionDTO != null && this.ciLoanApplicationModel.memberInstitutionDTO)
        this.membershipInstitutionDetailsModel = this.ciLoanApplicationModel.memberInstitutionDTO;
      // member dates convert
      if (this.membershipBasicDetailsModel.dob != null && this.membershipBasicDetailsModel.dob != undefined) {
        this.membershipBasicDetailsModel.dob = this.commonFunctionsService.getUTCEpoch(new Date(this.membershipBasicDetailsModel.dob));
      }
      if (this.membershipBasicDetailsModel.admissionDate != null && this.membershipBasicDetailsModel.admissionDate != undefined) {
        this.membershipBasicDetailsModel.admissionDate = this.commonFunctionsService.getUTCEpoch(new Date(this.membershipBasicDetailsModel.admissionDate));
      }
      // group dates convert
      if (this.membershipGroupDetailsModel.registrationDate != null && this.membershipGroupDetailsModel.registrationDate != undefined) {
        this.membershipGroupDetailsModel.registrationDate = this.commonFunctionsService.getUTCEpoch(new Date(this.membershipGroupDetailsModel.registrationDate));
      }
      if (this.membershipGroupDetailsModel.admissionDate != null && this.membershipGroupDetailsModel.admissionDate != undefined) {
        this.membershipGroupDetailsModel.admissionDate = this.commonFunctionsService.getUTCEpoch(new Date(this.membershipGroupDetailsModel.admissionDate));
      }
      // institution dates convert
      if (this.membershipInstitutionDetailsModel.registrationDate != null && this.membershipInstitutionDetailsModel.registrationDate != undefined) {
        this.membershipInstitutionDetailsModel.registrationDate = this.commonFunctionsService.getUTCEpoch(new Date(this.membershipInstitutionDetailsModel.registrationDate));
      }
      if (this.membershipInstitutionDetailsModel.admissionDate != null && this.membershipInstitutionDetailsModel.admissionDate != undefined) {
        this.membershipInstitutionDetailsModel.admissionDate = this.commonFunctionsService.getUTCEpoch(new Date(this.membershipInstitutionDetailsModel.admissionDate));
      }
    }
    if (this.ciLoanApplicationModel.applicationDateVal != null && this.ciLoanApplicationModel.applicationDateVal != undefined)
      this.ciLoanApplicationModel.applicationDate = this.commonFunctionsService.getUTCEpochWithTime(this.ciLoanApplicationModel.applicationDateVal);

    if (this.ciLoanApplicationModel.sanctionDate != null && this.ciLoanApplicationModel.sanctionDate != undefined)
      this.ciLoanApplicationModel.sanctionDate = this.commonFunctionsService.getUTCEpochWithTime(this.ciLoanApplicationModel.sanctionDate);

    if (this.ciLoanApplicationModel.loanDueDate != null && this.ciLoanApplicationModel.loanDueDate != undefined)
      this.ciLoanApplicationModel.loanDueDate = this.commonFunctionsService.getUTCEpochWithTime(this.ciLoanApplicationModel.loanDueDate);

    if (this.isApplicationEdit) {
      this.ciLoanApplicationService.updateCiLoanApplications(this.ciLoanApplicationModel).subscribe((response: any) => {
        this.responseModel = response;
        if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
          if (this.responseModel.data.length > 0 && this.responseModel.data[0] != undefined && this.responseModel.data[0] != null) {
            if (this.responseModel.data[0].id != undefined && this.responseModel.data[0].id != null) {
              this.ciLoanApplicationId = this.responseModel.data[0].id;
              this.memberTypeName = this.responseModel.data[0].memberTypeName;
              if (this.responseModel.data[0].accountNumber != null && this.responseModel.data[0].accountNumber != undefined) {
                this.accountNumber = this.responseModel.data[0].accountNumber;
              }
              if (this.responseModel.data[0].admissionNo != null && this.responseModel.data[0].admissionNo != undefined) {
                this.admissionNumber = this.responseModel.data[0].admissionNo;
              }
            }
          }
          this.previousStepFlag = true;
          this.admissionNumberDropDownDisable = true;
          this.memberDropDownDisable = true;
          if (this.activeIndex === 0 || this.activeIndex === 1) {
            this.activeIndexIncrement();
          }
          else if (this.activeIndex === 3) {
            this.activeIndex = this.accountTypeBasedActiveIndexInscrement(this.ciLoanApplicationModel.operationTypeName);
          }
          this.msgs = [{ severity: 'success', summary: applicationConstants.STATUS_SUCCESS, detail: this.responseModel.statusMsg }];
          setTimeout(() => {
            this.msgs = [];
          }, 1200);
          this.navigateTo(this.activeIndex, this.responseModel.data[0].id)
          this.completed = 1;
        } else {
          this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: this.responseModel.statusMsg }];
          setTimeout(() => {
            this.msgs = [];
          }, 3000);
        }
      }, error => {
        this.commonComponent.stopSpinner();
        this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: applicationConstants.SERVER_DOWN_ERROR }];
        setTimeout(() => {
          this.msgs = [];
        }, 3000);
      });
    } else {
      this.ciLoanApplicationModel.accountStatusName =  applicationConstants.IN_PROGRESS;
      if(activeIndex != 3){
      if (this.ciLoanApplicationModel.ciLoanInsuranceDetailsDTO != undefined && this.ciLoanApplicationModel.ciLoanInsuranceDetailsDTO != null)
        this.ciLoanApplicationModel.ciLoanInsuranceDetailsDTO.statusName = applicationConstants.IS_ACTIVE;
      if (this.memberTypeName == "Individual") {
        this.ciLoanApplicationModel.individualMemberDetailsDTO.memStatusName=  applicationConstants.IN_PROGRESS;
        if (this.ciLoanApplicationModel.individualMemberDetailsDTO != undefined && this.ciLoanApplicationModel.individualMemberDetailsDTO != null) {
          if (this.ciLoanApplicationModel.individualMemberDetailsDTO.age != undefined && this.ciLoanApplicationModel.individualMemberDetailsDTO.age != null) {
            this.age = this.ciLoanApplicationModel.individualMemberDetailsDTO.age;
            if (this.ciLoanApplicationModel.individualMemberDetailsDTO.age <= 18)
              this.ciLoanApplicationModel.individualMemberDetailsDTO.isMinor = applicationConstants.TRUE;
            else
              this.ciLoanApplicationModel.individualMemberDetailsDTO.isMinor = applicationConstants.FALSE;
          }
          if (this.ciLoanApplicationModel.individualMemberDetailsDTO.id != undefined && this.ciLoanApplicationModel.individualMemberDetailsDTO.id != null)
            this.ciLoanApplicationModel.individualMemberDetailsDTO.id = null;

          if (this.ciLoanApplicationModel.individualMemberDetailsDTO.memberShipKycDetailsDTOList != null && this.ciLoanApplicationModel.individualMemberDetailsDTO.memberShipKycDetailsDTOList != undefined) {
            for (let kyc of this.ciLoanApplicationModel.individualMemberDetailsDTO.memberShipKycDetailsDTOList) {
              kyc.id = null;
            }
            this.ciLoanApplicationModel.ciLoanKycDetailsList = this.ciLoanApplicationModel.individualMemberDetailsDTO.memberShipKycDetailsDTOList;
          }
        }
      } else if (this.memberTypeName == "Group") {
        this.ciLoanApplicationModel.memberGroupDetailsDTO.groupStatusName =  applicationConstants.IN_PROGRESS;
        if (this.ciLoanApplicationModel.memberGroupDetailsDTO != undefined && this.ciLoanApplicationModel.memberGroupDetailsDTO != null) {
          if (this.ciLoanApplicationModel.memberGroupDetailsDTO.age != undefined && this.ciLoanApplicationModel.memberGroupDetailsDTO.age != null)
            this.ciLoanApplicationModel.memberGroupDetailsDTO.id = null;

          if (this.ciLoanApplicationModel.memberGroupDetailsDTO.groupKycList != null && this.ciLoanApplicationModel.memberGroupDetailsDTO.groupKycList != undefined) {
            for (let kyc of this.ciLoanApplicationModel.memberGroupDetailsDTO.groupKycList) {
              kyc.id = null;
            }
            this.ciLoanApplicationModel.ciLoanKycDetailsList = this.ciLoanApplicationModel.memberGroupDetailsDTO.groupKycList;
          }
        }
      } else if (this.memberTypeName == "Institution") {
        this.ciLoanApplicationModel.memberInstitutionDTO.institutionStatusName =  applicationConstants.IN_PROGRESS;
        if (this.ciLoanApplicationModel.memberInstitutionDTO != undefined && this.ciLoanApplicationModel.memberInstitutionDTO != null) {
          if (this.ciLoanApplicationModel.memberInstitutionDTO.age != undefined && this.ciLoanApplicationModel.memberInstitutionDTO.age != null)
            this.ciLoanApplicationModel.memberInstitutionDTO.id = null;

          if (this.ciLoanApplicationModel.memberInstitutionDTO.institutionKycDetailsDTOList != null && this.ciLoanApplicationModel.memberInstitutionDTO.institutionKycDetailsDTOList != undefined) {
            for (let kyc of this.ciLoanApplicationModel.memberInstitutionDTO.institutionKycDetailsDTOList) {
              kyc.id = null;
            }
            this.ciLoanApplicationModel.ciLoanKycDetailsList = this.ciLoanApplicationModel.memberInstitutionDTO.institutionKycDetailsDTOList;
          }
        }
      }
    }
      this.ciLoanApplicationService.addCiLoanApplications(this.ciLoanApplicationModel).subscribe((response: any) => {
        this.responseModel = response;
        if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
          if (this.responseModel.data.length > 0 && this.responseModel.data[0] != undefined && this.responseModel.data[0] != null) {
            this.memberTypeName = this.responseModel.data[0].memberTypeName;
            if (this.responseModel.data[0].id != undefined && this.responseModel.data[0].id != null)
              this.ciLoanApplicationId = this.responseModel.data[0].id;
            if (this.responseModel.data[0].operationTypeName != undefined && this.responseModel.data[0].operationTypeName != null)
              this.operationTypeName = this.responseModel.data[0].operationTypeName;
            if (this.responseModel.data[0].accountNumber != null && this.responseModel.data[0].accountNumber != undefined) {
              this.accountNumber = this.responseModel.data[0].accountNumber;
            }
            if (this.responseModel.data[0].admissionNo != null && this.responseModel.data[0].admissionNo != undefined) {
              this.admissionNumber = this.responseModel.data[0].admissionNo;
            }
            this.isNewMemberCreation = true;
            this.admissionNumberDropDownDisable = true;
            
          }
          this.memberDropDownDisable = true;
          this.previousStepFlag = false;
          this.msgs = [{ severity: 'success', summary: applicationConstants.STATUS_SUCCESS, detail: this.responseModel.statusMsg }];
          setTimeout(() => {
            this.msgs = [];
          }, 1200);
          if (this.activeIndex === 0 || this.activeIndex === 1) {
            this.activeIndexIncrement();
          }
          else if (this.activeIndex == 3) {
            this.activeIndex = this.accountTypeBasedActiveIndexInscrement(this.ciLoanApplicationModel.operationTypeName);
          }
          this.navigateTo(this.activeIndex, this.responseModel.data[0].id)
          this.completed = 1;
        } else {
          this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: this.responseModel.statusMsg }];
          setTimeout(() => {
            this.msgs = [];
          }, 3000);
        }
      }, error => {
        this.commonComponent.stopSpinner();
        this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: applicationConstants.SERVER_DOWN_ERROR }];
        setTimeout(() => {
          this.msgs = [];
        }, 3000);
      });
    }
  }

  // add or update fd non cumulative Communication Details
  addOrUpdateCommunicationDetails(activeIndex: any, buttonName: any) {
    this.ciLoanCommunicationModel.admissionNumber = this.admissionNumber;
    this.ciLoanCommunicationModel.ciLoanApplicationId = this.ciLoanApplicationId;
    if (this.ciLoanCommunicationModel.isSameAddress == true) {
      this.isPerminentAddressIsSameFalg = true;
    }
    else {
      this.isPerminentAddressIsSameFalg = true;
    }
    if (this.ciLoanCommunicationModel.id == null) {
      this.isCommunicationEdit = false;
    }
    else
      this.isCommunicationEdit = true;
    if (this.isCommunicationEdit) {
      this.ciCommunicationService.updateCiLoanCommunicationDetails(this.ciLoanCommunicationModel).subscribe((response: any) => {
        this.responseModel = response;
        if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
          if (this.responseModel.data > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != null) {
            this.ciLoanApplicationId = this.responseModel.data[0].ciLoanApplicationId;
          }
          if (this.responseModel.data[0].admissionNumber != null && this.responseModel.data[0].admissionNumber != undefined) {
            this.admissionNumber = this.responseModel.data[0].admissionNumber;
          }
          this.msgs = [{ severity: 'success', summary: applicationConstants.STATUS_SUCCESS, detail: this.responseModel.statusMsg }];
          setTimeout(() => {
            this.msgs = [];
          }, 1200);
          this.activeIndex = this.activeIndex + 1;
          this.navigateTo(this.activeIndex, this.ciLoanApplicationId);
          this.completed = 1;
        } else {
          this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: this.responseModel.statusMsg }];
          setTimeout(() => {
            this.msgs = [];
          }, 3000);
        }
      });
    }
    else {
      this.ciCommunicationService.addCiLoanCommunicationDetails(this.ciLoanCommunicationModel).subscribe((response: any) => {
        this.responseModel = response;
        if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
          if (this.responseModel.data > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != null) {
            this.ciLoanApplicationId = this.responseModel.data[0].ciLoanApplicationId;
          }
          if (this.responseModel.data[0].admissionNumber != null && this.responseModel.data[0].admissionNumber != undefined) {
            this.admissionNumber = this.responseModel.data[0].admissionNumber;
          }
          this.msgs = [{ severity: 'success', summary: applicationConstants.STATUS_SUCCESS, detail: this.responseModel.statusMsg }];
          setTimeout(() => {
            this.msgs = [];
          }, 1200);
          this.activeIndex = this.activeIndex + 1;
          this.navigateTo(this.activeIndex, this.ciLoanApplicationId);
          this.completed = 1;
        } else {
          this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: this.responseModel.statusMsg }];
          setTimeout(() => {
            this.msgs = [];
          }, 3000);
        }
      });
    }
  }

  saveJointHolder() {
    this.ciLoanCoApplicantDetailsService.saveJointHolderList(this.jointAccountHolderList).subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
        if (this.responseModel.data > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != null) {
          this.ciLoanApplicationId = this.responseModel.data[0].ciLoanApplicationId;
        }
        this.msgs = [{ severity: 'success', summary: applicationConstants.STATUS_SUCCESS, detail: this.responseModel.statusMsg }];
        setTimeout(() => {
          this.msgs = [];
        }, 1200);
        this.activeIndex = this.activeIndex + 1;
        this.navigateTo(this.activeIndex, this.ciLoanApplicationId);
        console.log("Navigation executed, activeIndex: ", this.activeIndex);
        this.completed = 1;
      } else {
        this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: this.responseModel.statusMsg }];
        setTimeout(() => {
          this.msgs = [];
        }, 3000);
      }
    }, error => {
      this.msgs = [];
      this.commonComponent.stopSpinner();
      this.msgs = [{ severity: 'error', detail: applicationConstants.SERVER_DOWN_ERROR }];
      setTimeout(() => {
        this.msgs = [];
      }, 2000);
    });
  }

  // add or update fd non cumulative Nominee Details
  addOrUpdateNomineeDetails() {
    this.ciLoanNomineeModel.ciLoanApplicationId = this.ciLoanApplicationId;
    // this.ciLoanNomineeModel.accountNumber = this.accountNumber;
    // this. fdCumulativeNominee.isNewMember = this.showForm;
    if (this.ciLoanNomineeModel.id == null) {
      this.isNomineeEdit = false;
    }
    else {
      this.isNomineeEdit = true;
    }
    if (this.isNomineeEdit) {
      this.ciLoanNomineeService.updateCiLoanNomineeDetails(this.ciLoanNomineeModel).subscribe((response: any) => {
        this.responseModel = response;
        if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
          this.msgs = [{ severity: 'success', summary: applicationConstants.STATUS_SUCCESS, detail: this.responseModel.statusMsg }];
          setTimeout(() => {
            this.msgs = [];
          }, 1200);
          this.activeIndex = this.activeIndex + 1;
          this.navigateTo(this.activeIndex, this.ciLoanApplicationId);
          this.completed = 1;
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
    else {
      this.ciLoanNomineeService.addCiLoanNomineeDetails(this.ciLoanNomineeModel).subscribe((response: any) => {
        this.responseModel = response;
        if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
          this.msgs = [{ severity: 'success', summary: applicationConstants.STATUS_SUCCESS, detail: this.responseModel.statusMsg }];
          setTimeout(() => {
            this.msgs = [];
          }, 1200);
          this.activeIndex = this.activeIndex + 1;
          this.navigateTo(this.activeIndex, this.ciLoanApplicationId);
          this.completed = 1;
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
  }

  addOrUpdateGuardianDetails() {
    this.ciLoanGuardianModel.ciLoanApplicationId = this.ciLoanApplicationId;
    // this.ciLoanGuardianModel.accountNumber = this.accountNumber;
    // this.ciLoanGuardianModel.isNewMember = this.showForm;
    if (this.ciLoanGuardianModel.id == null) {
      this.isNomineeEdit = false;
    }
    else {
      this.isNomineeEdit = true;
    }
    if (this.isNomineeEdit) {
      this.ciLoanGuardianService.updateCiLoanGuardianDetails(this.ciLoanGuardianModel).subscribe((response: any) => {
        this.responseModel = response;
        if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
          this.msgs = [{ severity: 'success', summary: applicationConstants.STATUS_SUCCESS, detail: this.responseModel.statusMsg }];
          setTimeout(() => {
            this.msgs = [];
          }, 1200);
          this.navigateTo(this.activeIndex, this.ciLoanApplicationId);
          this.completed = 1;
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
    else {
      this.ciLoanGuardianService.addCiLoanGuardianDetails(this.ciLoanGuardianModel).subscribe((response: any) => {
        this.responseModel = response;
        if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
          this.msgs = [{ severity: 'success', summary: applicationConstants.STATUS_SUCCESS, detail: this.responseModel.statusMsg }];
          setTimeout(() => {
            this.msgs = [];
          }, 1200);
          this.navigateTo(this.activeIndex, this.ciLoanApplicationId);
          this.completed = 1;
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
  }

  saveOrUpdateGuarantorDetails() {
    this.ciLoanGuarantorService.saveGuarantorList(this.guarantorDetailsList).subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
        if (this.responseModel.data > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != null) {
          this.ciLoanApplicationId = this.responseModel.data[0].siLoanApplicationId;
        }
        this.msgs = [{ severity: 'success', summary: applicationConstants.STATUS_SUCCESS, detail: this.responseModel.statusMsg }];
        setTimeout(() => {
          this.msgs = [];
        }, 1200);
        this.activeIndex = this.activeIndex + 1;
        this.navigateTo(this.activeIndex, this.ciLoanApplicationId);
        console.log("Navigation executed, activeIndex: ", this.activeIndex);
        this.completed = 1;
      } else {
        this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: this.responseModel.statusMsg }];
        setTimeout(() => {
          this.msgs = [];
        }, 3000);
      }
    }, error => {
      this.msgs = [];
      this.commonComponent.stopSpinner();
      this.msgs = [{ severity: 'error', detail: applicationConstants.SERVER_DOWN_ERROR }];
      setTimeout(() => {
        this.msgs = [];
      }, 2000);
    });
  }

  saveOrUpdateGoldLoanMortagageDetails(activeIndex: any, buttonName: any) {
    this.msgs = [{ severity: 'success', summary: applicationConstants.STATUS_SUCCESS, detail: this.responseModel.statusMsg }];
    setTimeout(() => {
      this.msgs = [];
    }, 1200);
    this.activeIndex = this.activeIndex + 1;
    this.navigateTo(this.activeIndex, this.ciLoanApplicationId);
    console.log("Navigation executed, activeIndex: ", this.activeIndex);
    this.completed = 1;
  }

  saveOrUpdateLandLoanMortagageDetails(activeIndex: any, buttonName: any) {
    this.msgs = [{ severity: 'success', summary: applicationConstants.STATUS_SUCCESS, detail: this.responseModel.statusMsg }];
    setTimeout(() => {
      this.msgs = [];
    }, 1200);
    this.activeIndex = this.activeIndex + 1;
    this.navigateTo(this.activeIndex, this.ciLoanApplicationId);
    console.log("Navigation executed, activeIndex: ", this.activeIndex);
    this.completed = 1;
  }

  saveOrUpdateBondLoanMortagageDetails(activeIndex: any, buttonName: any) {
    this.msgs = [{ severity: 'success', summary: applicationConstants.STATUS_SUCCESS, detail: this.responseModel.statusMsg }];
    setTimeout(() => {
      this.msgs = [];
    }, 1200);
    this.activeIndex = this.activeIndex + 1;
    this.navigateTo(this.activeIndex, this.ciLoanApplicationId);
    console.log("Navigation executed, activeIndex: ", this.activeIndex);
    this.completed = 1;
  }

  saveOrUpdateVehicleLoanMortagageDetails(activeIndex: any, buttonName: any) {
    this.msgs = [{ severity: 'success', summary: applicationConstants.STATUS_SUCCESS, detail: this.responseModel.statusMsg }];
    setTimeout(() => {
      this.msgs = [];
    }, 1200);
    this.activeIndex = this.activeIndex + 1;
    this.navigateTo(this.activeIndex, this.ciLoanApplicationId);
    console.log("Navigation executed, activeIndex: ", this.activeIndex);
    this.completed = 1;
  }

  saveOrUpdateStorageLoanMortagageDetails(activeIndex: any, buttonName: any) {
    this.msgs = [{ severity: 'success', summary: applicationConstants.STATUS_SUCCESS, detail: this.responseModel.statusMsg }];
    setTimeout(() => {
      this.msgs = [];
    }, 1200);
    this.activeIndex = this.activeIndex + 1;
    this.navigateTo(this.activeIndex, this.ciLoanApplicationId);
    console.log("Navigation executed, activeIndex: ", this.activeIndex);
    this.completed = 1;
  }

  saveOrUpdateOtherLoanMortagageDetails(activeIndex: any, buttonName: any) {
    this.msgs = [{ severity: 'success', summary: applicationConstants.STATUS_SUCCESS, detail: this.responseModel.statusMsg }];
    setTimeout(() => {
      this.msgs = [];
    }, 1200);
    this.activeIndex = this.activeIndex + 1;
    this.navigateTo(this.activeIndex, this.ciLoanApplicationId);
    console.log("Navigation executed, activeIndex: ", this.activeIndex);
    this.completed = 1;
  }

  saveOrUpdateDocumentDetails(activeIndex: any, buttonName: any) {
    this.msgs = [{ severity: 'success', summary: applicationConstants.STATUS_SUCCESS, detail: this.responseModel.statusMsg }];
    setTimeout(() => {
      this.msgs = [];
    }, 1200);
    this.activeIndex = this.activeIndex + 1;
    this.navigateTo(this.activeIndex, this.ciLoanApplicationId);
    console.log("Navigation executed, activeIndex: ", this.activeIndex);
    this.completed = 1;
  }

  saveOrUpdateGenealogyDetails(activeIndex: any, buttonName: any) {
    // this.ciLoanGenealogyTreeModel.pacsId = this.pacsId;
    // this.ciLoanGenealogyTreeModel.pacsCode = this.pacsCode;
    // this.ciLoanGenealogyTreeModel.branchId = this.branchId;
    this.ciLoanGenealogyTreeModel.id = this.ciLoanApplicationId;
    // this.ciLoanGenealogyTreeModel.accountNumber = this.accountNumber;
    this.ciLoanGenealogyTreeModel.applicantAdmissionNo = this.admissionNumber;
    if (this.ciLoanGenealogyTreeModel.id == null) {
      this.isGenealogyEdit = false;
    } else {
      this.isGenealogyEdit = true;
    }
    if (this.isGenealogyEdit) {
      this.ciLoanGenealogyTreeService.updateCiLoanGenealogyTrees(this.ciLoanGenealogyTreeModel).subscribe((response: any) => {
        this.responseModel = response;
        if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
          this.msgs = [{ severity: 'success', summary: applicationConstants.STATUS_SUCCESS, detail: this.responseModel.statusMsg }];
          setTimeout(() => {
            this.msgs = [];
          }, 1200);
          this.activeIndex = this.activeIndex + 1;
          this.navigateTo(this.activeIndex, this.ciLoanApplicationId);
          console.log("Navigation executed, activeIndex: ", this.activeIndex);
          this.completed = 1;
        } else {
          this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: this.responseModel.statusMsg }];
          setTimeout(() => {
            this.msgs = [];
          }, 3000);
        }
      }, error => {
        this.commonComponent.stopSpinner();
        this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: applicationConstants.SERVER_DOWN_ERROR }];
        setTimeout(() => {
          this.msgs = [];
        }, 3000);
      });
    } else {
      this.ciLoanGenealogyTreeService.addCiLoanGenealogyTrees(this.ciLoanGenealogyTreeModel).subscribe((response: any) => {
        this.responseModel = response;
        if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
          this.msgs = [{ severity: 'success', summary: applicationConstants.STATUS_SUCCESS, detail: this.responseModel.statusMsg }];
          setTimeout(() => {
            this.msgs = [];
          }, 1200);
          this.activeIndex = this.activeIndex + 1;
          this.navigateTo(this.activeIndex, this.ciLoanApplicationId);
          console.log("Navigation executed, activeIndex: ", this.activeIndex);
          this.completed = 1;
        } else {
          this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: this.responseModel.statusMsg }];
          setTimeout(() => {
            this.msgs = [];
          }, 3000);
        }
      }, error => {
        this.commonComponent.stopSpinner();
        this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: applicationConstants.SERVER_DOWN_ERROR }];
        setTimeout(() => {
          this.msgs = [];
        }, 3000);
      });
    }
  }

  activeIndexIncrement() {
    if (!this.showForm) {
      this.activeIndex = this.activeIndex + 2
    }
    else {
      this.activeIndex = this.activeIndex + 1
    }
    return this.activeIndex;
  }

  accountTypeBasedActiveIndexInscrement(operationTypeName: any) {
    if (operationTypeName == "Joint") {
      this.activeIndex = this.activeIndex + 1
    }
    else {
      this.activeIndex = this.activeIndex + 2;
    }
    return this.activeIndex;
  }
  onClickMemberIndividualMoreDetails() {
    this.membreIndividualFlag = true;
  }

  onClickOfGroupMoreDetails() {
    this.groupPromotersPopUpFlag = true;
  }

  onClickInstitutionMoreDetails() {
    this.institutionPromoterFlag = true;
  }

  onClickMemberPhotoCopy() {
    this.memberPhotoCopyZoom = true;
  }
  close() {
    this.institutionPromoterFlag = false;
    this.groupPromotersPopUpFlag = false;
    this.memberSignatureCopyZoom = false;
    this.memberPhotoCopyZoom = false;
  }

  itemListWithoutParams(){
      if (this.showForm) {
        if (this.ciLoanApplicationModel.operationTypeName != "Joint") {
          this.items = [
            {
              label: 'Member Details', icon: 'fa fa-id-badge', routerLink: Loantransactionconstant.COMPOUND_INTEREST_LOANS_NEW_MEMBERSHIP_DETAILS, 
              disabled: this.menuDisabled,
              command: (event: any) => {
                this.activeIndex = 0;
              }
            },
            {
              label: 'KYC', icon: 'fa fa-podcast', routerLink: Loantransactionconstant.COMPOUND_INTEREST_LOANS_KYC,
              disabled: this.menuDisabled,
              command: (event: any) => {
                this.activeIndex = 1;
              }
            },
            {
              label: 'Communication', icon: 'fa fa-map-marker', routerLink: Loantransactionconstant.COMPOUND_INTEREST_LOANS_COMMUNICATON,
              disabled: this.menuDisabled,
              command: (event: any) => {
                this.activeIndex = 2;
              }
            },
            {
              label: 'Application', icon: 'fa fa-id-badge', routerLink: Loantransactionconstant.COMPOUND_INTEREST_LOANS_APPLICATIOIN_DETAILS,
              disabled: this.menuDisabled,
              command: (event: any) => {
                this.activeIndex = 3;
              }
            },
            {
              label: 'Nominee', icon: 'fa fa-user-o', routerLink: Loantransactionconstant.COMPOUND_INTEREST_LOANS_NOMINEE,
              disabled: this.menuDisabled,
              command: (event: any) => {
                this.activeIndex = 5;
              }
            },
            {
              label: 'Loan Guarantor', icon: 'fa fa-male', routerLink: Loantransactionconstant.COMPOUND_INTEREST_LOANS_GUARANTOR,
              disabled: this.menuDisabled,
              command: (event: any) => {
                this.activeIndex = 6;
              }
            },
            {
              label: 'Loan Mortagage', icon: 'fa fa-puzzle-piece', routerLink: Loantransactionconstant.COMPOUND_INTEREST_LOANS_MORTAGAGE,
              disabled: this.menuDisabled,
              command: (event: any) => {
                this.activeIndex = 7;
              }
            },
            {
              label: 'Loan Documents', icon: 'fa fa-files-o', routerLink: Loantransactionconstant.COMPOUND_INTEREST_LOANS_DOCUMENTS,
              disabled: this.menuDisabled,
              command: (event: any) => {
                this.activeIndex = 8;
              }
            },
            {
              label: 'Loan Genealogy Tree', icon: 'fa fa-sitemap', routerLink: Loantransactionconstant.COMPOUND_INTEREST_LOANS_GENEALOGY_TREE,
              disabled: this.menuDisabled,
              command: (event: any) => {
                this.activeIndex = 9;
              }
            }
          ];
        }
        else {
          this.items = [
            {
              label: 'Member Details', icon: 'fa fa-id-badge', routerLink: Loantransactionconstant.COMPOUND_INTEREST_LOANS_NEW_MEMBERSHIP_DETAILS,
              disabled: this.menuDisabled,
              command: (event: any) => {
                this.activeIndex = 0;
              }
            },
            {
              label: 'KYC', icon: 'fa fa-podcast', routerLink: Loantransactionconstant.COMPOUND_INTEREST_LOANS_KYC,
              disabled: this.menuDisabled,
              command: (event: any) => {
                this.activeIndex = 1;
              }
            },
            {
              label: 'Communication', icon: 'fa fa-map-marker', routerLink: Loantransactionconstant.COMPOUND_INTEREST_LOANS_KYC,
              disabled: this.menuDisabled,
              command: (event: any) => {
                this.activeIndex = 2;
              }
            },
            {
              label: 'Application', icon: 'fa fa-id-badge', routerLink: Loantransactionconstant.COMPOUND_INTEREST_LOANS_APPLICATIOIN_DETAILS,
              disabled: this.menuDisabled,
              command: (event: any) => {
                this.activeIndex = 3;
              }
            },
            {
              label: 'Joint Account', icon: 'fa fa-handshake-o', routerLink: Loantransactionconstant.COMPOUND_INTEREST_LOANS_CO_APPLICANT_DETAILS,
              disabled: this.menuDisabled,
              command: (event: any) => {
                this.activeIndex = 4;
              }
            },
            {
              label: 'Nominee', icon: 'fa fa-user-o', routerLink: Loantransactionconstant.COMPOUND_INTEREST_LOANS_NOMINEE,
              disabled: this.menuDisabled,
              command: (event: any) => {
                this.activeIndex = 5;
              }
            },
            {
              label: 'Loan Guarantor', icon: 'fa fa-male', routerLink: Loantransactionconstant.COMPOUND_INTEREST_LOANS_GUARANTOR,
              disabled: this.menuDisabled,
              command: (event: any) => {
                this.activeIndex = 6;
              }
            },
            {
              label: 'Loan Mortagage', icon: 'fa fa-puzzle-piece', routerLink: Loantransactionconstant.COMPOUND_INTEREST_LOANS_MORTAGAGE,
              disabled: this.menuDisabled,
              command: (event: any) => {
                this.activeIndex = 7;
              }
            },
            {
              label: 'Loan Documents', icon: 'fa fa-files-o', routerLink: Loantransactionconstant.COMPOUND_INTEREST_LOANS_DOCUMENTS,
              command: (event: any) => {
                this.activeIndex = 8;
              }
            },
            {
              label: 'Loan Genealogy Tree', icon: 'fa fa-sitemap', routerLink: Loantransactionconstant.COMPOUND_INTEREST_LOANS_GENEALOGY_TREE,
              disabled: this.menuDisabled,
              command: (event: any) => {
                this.activeIndex = 9;
              }
            }
          ];
        }
      }
      else {
        if (this.ciLoanApplicationModel.operationTypeName != "Joint") {
          this.items = [
            {
              label: 'KYC', icon: 'fa fa-podcast', routerLink: Loantransactionconstant.COMPOUND_INTEREST_LOANS_MEMBERSHIP_DETAILS,
              command: (event: any) => {
                this.activeIndex = 0;
              }
            },
            {
              label: 'Communication', icon: 'fa fa-map-marker', routerLink: Loantransactionconstant.COMPOUND_INTEREST_LOANS_COMMUNICATON,
              disabled: this.menuDisabled,
              command: (event: any) => {
                this.activeIndex = 2;
              }
            },
            {
              label: 'Application', icon: 'fa fa-id-badge', routerLink: Loantransactionconstant.COMPOUND_INTEREST_LOANS_APPLICATIOIN_DETAILS,
              disabled: this.menuDisabled,
              command: (event: any) => {
                this.activeIndex = 3;
              }
            },
            {
              label: 'Nominee', icon: 'fa fa-user-o', routerLink: Loantransactionconstant.COMPOUND_INTEREST_LOANS_NOMINEE,
              disabled: this.menuDisabled,
              command: (event: any) => {
                this.activeIndex = 5;
              }
            },
            {
              label: 'Loan Guarantor', icon: 'fa fa-male', routerLink: Loantransactionconstant.COMPOUND_INTEREST_LOANS_GUARANTOR,
              disabled: this.menuDisabled,
              command: (event: any) => {
                this.activeIndex = 6;
              }
            },
            {
              label: 'Loan Mortagage', icon: 'fa fa-puzzle-piece', routerLink: Loantransactionconstant.COMPOUND_INTEREST_LOANS_MORTAGAGE,
              disabled: this.menuDisabled,
              command: (event: any) => {
                this.activeIndex = 7;
              }
            },
            {
              label: 'Loan Documents', icon: 'fa fa-files-o', routerLink: Loantransactionconstant.COMPOUND_INTEREST_LOANS_DOCUMENTS,
              disabled: this.menuDisabled,
              command: (event: any) => {
                this.activeIndex = 8;
              }
            },
            {
              label: 'Loan Genealogy Tree', icon: 'fa fa-sitemap', routerLink: Loantransactionconstant.COMPOUND_INTEREST_LOANS_GENEALOGY_TREE,
              disabled: this.menuDisabled,
              command: (event: any) => {
                this.activeIndex = 9;
              }
            }
          ];
        }
        else {
          this.items = [
            {
              label: 'KYC', icon: 'fa fa-podcast', routerLink: Loantransactionconstant.COMPOUND_INTEREST_LOANS_MEMBERSHIP_DETAILS,
              disabled: this.menuDisabled,
              command: (event: any) => {
                this.activeIndex = 0;
              }
            },
            {
              label: 'Communication', icon: 'fa fa-map-marker', routerLink: Loantransactionconstant.COMPOUND_INTEREST_LOANS_COMMUNICATON,
              disabled: this.menuDisabled,
              command: (event: any) => {
                this.activeIndex = 2;
              }
            },
            {
              label: 'Application', icon: 'fa fa-id-badge', routerLink: Loantransactionconstant.COMPOUND_INTEREST_LOANS_APPLICATIOIN_DETAILS,
              disabled: this.menuDisabled,
              command: (event: any) => {
                this.activeIndex = 3;
              }
            },
            {
              label: 'Joint Account', icon: 'fa fa-handshake-o', routerLink: Loantransactionconstant.COMPOUND_INTEREST_LOANS_CO_APPLICANT_DETAILS,
              disabled: this.menuDisabled,
              command: (event: any) => {
                this.activeIndex = 4;
              }
            },
            {
              label: 'Nominee', icon: 'fa fa-user-o', routerLink: Loantransactionconstant.COMPOUND_INTEREST_LOANS_NOMINEE,
              disabled: this.menuDisabled,
              command: (event: any) => {
                this.activeIndex = 5;
              }
            },
            {
              label: 'Loan Guarantor', icon: 'fa fa-male', routerLink: Loantransactionconstant.COMPOUND_INTEREST_LOANS_GUARANTOR,
              disabled: this.menuDisabled,
              command: (event: any) => {
                this.activeIndex = 6;
              }
            },
            {
              label: 'Loan Mortagage', icon: 'fa fa-puzzle-piece', routerLink: Loantransactionconstant.COMPOUND_INTEREST_LOANS_MORTAGAGE,
              disabled: this.menuDisabled,
              command: (event: any) => {
                this.activeIndex = 7;
              }
            },
            {
              label: 'Loan Documents', icon: 'fa fa-files-o', routerLink: Loantransactionconstant.COMPOUND_INTEREST_LOANS_DOCUMENTS,
              disabled: this.menuDisabled,
              command: (event: any) => {
                this.activeIndex = 8;
              }
            },
            {
              label: 'Loan Genealogy Tree', icon: 'fa fa-sitemap', routerLink: Loantransactionconstant.COMPOUND_INTEREST_LOANS_GENEALOGY_TREE,
              disabled: this.menuDisabled,
              command: (event: any) => {
                this.activeIndex = 9;
              }
            }
          ];
        }
      }
  }
}
