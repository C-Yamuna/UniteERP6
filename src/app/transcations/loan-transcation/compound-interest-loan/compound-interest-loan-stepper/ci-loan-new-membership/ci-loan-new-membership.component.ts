import { Component, ViewChild } from '@angular/core';
import { GroupPromoterDetails, InstitutionPromoterDetails, MembershipBasicDetails, MembershipGroupDetails, MemInstitutionDetails } from '../ci-membership-details/shared/membership-details.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Responsemodel } from 'src/app/shared/responsemodel';
import { CiLoanApplication } from '../ci-product-details/shared/ci-loan-application.model';
import { Table } from 'primeng/table';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonComponent } from 'src/app/shared/common.component';
import { EncryptDecryptService } from 'src/app/shared/encrypt-decrypt.service';
import { CommonFunctionsService } from 'src/app/shared/commonfunction.service';
import { DatePipe } from '@angular/common';
import { FileUploadService } from 'src/app/shared/file-upload.service';
import { applicationConstants } from 'src/app/shared/applicationConstants';
import { CiLoanApplicationService } from '../ci-product-details/shared/ci-loan-application.service';
import { ERP_TRANSACTION_CONSTANTS } from 'src/app/transcations/erp-transaction-constants';
import { FileUpload } from 'primeng/fileupload';
import { FileUploadModel } from 'src/app/layout/mainmenu/shared/file-upload-model.model';
import { MembershipServiceService } from 'src/app/transcations/savings-bank-transcation/savings-bank-account-creation-stepper/membership-basic-required-details/shared/membership-service.service';



@Component({
  selector: 'app-ci-loan-new-membership',
  templateUrl: './ci-loan-new-membership.component.html',
  styleUrls: ['./ci-loan-new-membership.component.css']
})
export class CiLoanNewMembershipComponent {
  memberCreationForm: FormGroup;
  groupForm: FormGroup;
  institutionForm: FormGroup;
  applicationList: any[] = [];
  accountList: any[] = [];
  genderList: any[] = [];
  maritalstatusList: any[] = [];
  groupPromoters: boolean = false;
  cancleButtonFlag: boolean = false;
  admissionNumberDropDown: boolean = false;
  admissionNumbersList: any [] =[];
  institutionPromoterPopUp: boolean = false;
;

  membershipBasicDetailsModel: MembershipBasicDetails = new MembershipBasicDetails();
  membershipGroupDetailsModel: MembershipGroupDetails = new MembershipGroupDetails();
  membershipInstitutionDetailsModel: MemInstitutionDetails = new MemInstitutionDetails();
  ciLoanApplicationModel: CiLoanApplication = new CiLoanApplication;
  promoterDetailsModel: GroupPromoterDetails = new GroupPromoterDetails();
  institutionPromoterDetailsModel: InstitutionPromoterDetails = new InstitutionPromoterDetails();
  relationTypesList: any[] = [];
  occupationTypeList: any[] = [];
  qualificationTypes: any[] = [];
  admissionNumberList: any[] = [];
  castesList: any[] = [];
  checked: Boolean = false;
  showForm: Boolean = false;
  id: any;
  isEdit: boolean = false;
  imageUrl: string | ArrayBuffer | null = null;
  fileName: any;
  responseModel!: Responsemodel;
  orgnizationSetting: any;
  docFilesList: any[] = [];
  submitFlag: boolean = false;
  maritalStatusList: any[] = [];

  memberTypeList: any[] = [];
  memberTypeName: any;
  individualFlag: boolean = false;
  groupFlag: boolean = false;
  institutionFlag: boolean = false;
  isDisableFlag: boolean = true;
  disableMemberType: boolean = false;
  promoterDetailsForm: any;
  promoterColumns: any[] = [];
  institutionPromoterColumn: any[] = [];
  institutionPromoter: any[] = [];
  addButton: boolean = false;
  EditDeleteDisable: boolean = false;
  newRow: any;
  promoterDetails: any[] = [];
  memberTypeId: any;

  promterTypeDisabled:any;

  @ViewChild('dt', { static: false }) private dt!: Table;
  @ViewChild('cv', { static: false }) private cv!: Table;

  msgs: any[] = [];
  operatorTypeList: any[] = [];
  admissionNumber: any;
  communicationForm: any;
  pacsId: any;
  branchId: any;
  allTypesOfmembershipList: any;
  permenentAllTypesOfmembershipList: any;
  ciLoanApplicationId: any;
  multipleFilesList: any;
  uploadFileData: any;
  isFileUploaded: any;;

  constructor(private router: Router,
    private formBuilder: FormBuilder,
    private ciLoanApplicationService: CiLoanApplicationService,
    private commonComponent: CommonComponent,
    private activateRoute: ActivatedRoute,
    private encryptDecryptService: EncryptDecryptService,
    private commonFunctionsService: CommonFunctionsService,
    private datePipe: DatePipe,
    private membershipServiceService: MembershipServiceService , private fileUploadService :FileUploadService) {
      this.memberCreationForm = this.formBuilder.group({
        surName: ['', [Validators.pattern(applicationConstants.NEW_NAME_VALIDATIONS), Validators.compose([Validators.required])]],
        name: ['', [Validators.pattern(applicationConstants.NEW_NAME_VALIDATIONS), Validators.compose([Validators.required])]],
        gender: ['', Validators.required],
        dateOfBirth: ['', Validators.required],
        age: ['', [Validators.pattern(applicationConstants.ALLOW_NUMBERS_ONLY), Validators.compose([Validators.required])]],
        maritalStatus: ['', Validators.required],
        relationWithMember: [''],
        relationName: [''],
        aadharNumber: ['', [Validators.pattern(applicationConstants.AADHAR_PATTERN), Validators.compose([Validators.required])]],
        panNumber: ['', [Validators.pattern(applicationConstants.PAN_NUMBER_PATTERN), Validators.compose([Validators.required])]],
        mobileNumber: ['', [Validators.pattern(applicationConstants.MOBILE_PATTERN), Validators.compose([Validators.required])]],
        occupation: [''],
        quslification: [''],
        caste: [''],
        email: ['', [Validators.pattern(applicationConstants.EMAIL_PATTERN), Validators.compose([Validators.required])]],
        admissionDate: [''],
        isStaff: [''],
        fileUpload:[''],
      })
      this.groupForm = this.formBuilder.group({
        name: ['', [Validators.pattern(applicationConstants.NEW_NAME_VALIDATIONS), Validators.compose([Validators.required])]],
        registrationNumber: ['', [Validators.pattern(applicationConstants.NEW_NAME_VALIDATIONS), Validators.compose([Validators.required])]],
        registrationDate: ['', Validators.required],
        admissionDate: ['', Validators.required],
        pocName:['', Validators.required],
        pocNumber: ['', [Validators.pattern(applicationConstants.MOBILE_PATTERN), Validators.compose([Validators.required])]],
        // mobileNumber: ['', [Validators.pattern(applicationConstants.MOBILE_PATTERN), Validators.compose([Validators.required])]],
        panNumber: ['', [Validators.pattern(applicationConstants.PAN_NUMBER_PATTERN), Validators.compose([Validators.required])]],
        tanNumber: ['', [Validators.pattern(applicationConstants.TAN_NUMBER), Validators.compose([Validators.required])]],
        gstNumber: ['', [Validators.pattern(applicationConstants.GST_NUMBER_PATTERN), Validators.compose([Validators.required])]],
  
      })
      this.institutionForm = this.formBuilder.group({
        name: ['', [Validators.pattern(applicationConstants.NEW_NAME_VALIDATIONS), Validators.compose([Validators.required])]],
        registrationNumber: ['', [Validators.pattern(applicationConstants.NEW_NAME_VALIDATIONS), Validators.compose([Validators.required])]],
        registrationDate: ['', Validators.required],
        admissionDate: ['', Validators.required],
        // pocName: ['', Validators.required],
        mobileNumber: ['', [Validators.pattern(applicationConstants.MOBILE_PATTERN), Validators.compose([Validators.required])]],
        panNumber: ['', [Validators.pattern(applicationConstants.PAN_NUMBER_PATTERN), Validators.compose([Validators.required])]],
        tanNumber: ['', [Validators.pattern(applicationConstants.TAN_NUMBER), Validators.compose([Validators.required])]],
        gstNumber: ['', [Validators.pattern(applicationConstants.GST_NUMBER_PATTERN), Validators.compose([Validators.required])]],
      })
      this.promoterDetailsForm = this.formBuilder.group({
        surname: ['', [Validators.pattern(applicationConstants.NEW_NAME_VALIDATIONS), Validators.compose([Validators.required])]],
        name: ['', [Validators.pattern(applicationConstants.NEW_NAME_VALIDATIONS), Validators.compose([Validators.required])]],
        operatorTypeId: ['',],
        dob: ['', Validators.required],
        age: ['', [Validators.pattern(applicationConstants.ALLOW_NUMBERS), Validators.compose([Validators.required])]],
        genderId: ['', Validators.required],
        martialId: ['', Validators.required],
        mobileNumber: ['', [Validators.pattern(applicationConstants.MOBILE_PATTERN), Validators.compose([Validators.required])]],
        aadharNumber: ['', [Validators.pattern(applicationConstants.AADHAR_PATTERN), Validators.compose([Validators.required])]],
        emailId: ['', [Validators.pattern(applicationConstants.EMAIL_PATTERN), Validators.compose([Validators.required])]],
        startDate: ['', Validators.required],
        promterType: ['',],
        isGroupLeader :['',],
        admissionNumber :['',],
        authorizedSignatory:['',],
      })
  }

  ngOnInit(): void {
    this.membershipBasicDetailsModel.filesDTOList = [];
    this.pacsId = 1;
    this.branchId = 1;
    this.showForm = this.commonFunctionsService.getStorageValue(applicationConstants.B_CLASS_MEMBER_CREATION);
    this.orgnizationSetting = this.commonComponent.orgnizationSettings()
    this.maritalStatusList = this.commonComponent.maritalStatusList();

    // this.memberTypeList = [
    //   { label: "Individual", value: 1 },
    //   { label: "Group", value: 2 },
    //   { label: "Institution", value: 3 },
    // ]
    this.genderList = [
      { label: 'Male', value: 1 },
      { label: 'Female', value: 2 },
    ]
    this.maritalstatusList = [
      { label: 'Married', value: 1 },
      { label: 'Un-Married', value: 2 }
    ]
    // this.getGenderList();
    this.getAllRelationTypes();
    this.getAllMemberType();
    this.getAllOperatorTypes();
    this.getAllOccupationTypes();
    this.getAllQualificationType();
    this.getCastesList();
    this.activateRoute.queryParams.subscribe(params => {
      if (params['id'] != undefined) {
        this.commonComponent.startSpinner();
        this.ciLoanApplicationId = this.encryptDecryptService.decrypt(params['id']);
        this.getCiLoanApplicationByLoanApplicationId(this.ciLoanApplicationId);
        this.isEdit = true;
      }
      else {
        this.updateData();
        let val = this.commonFunctionsService.getStorageValue(applicationConstants.B_CLASS_MEMBER_CREATION);
        this.memberFormReset(val);

        if (!this.showForm) {
          this.individualFlag = true;
        }
      }
    });
    this.memberCreationForm.valueChanges.subscribe((data: any) => {
      this.updateData();
      if (this.memberCreationForm.valid || this.groupForm.valid || this.institutionForm.valid) {
        this.save();
      }
    });
    this.groupForm.valueChanges.subscribe((data: any) => {
      this.updateData();
      if (this.groupForm.valid) {
        this.save();
      }
    });
    this.institutionForm.valueChanges.subscribe((data: any) => {
      this.updateData();
      if (this.groupForm.valid) {
        this.save();
      }
    });


  }
  getCiLoanApplicationByLoanApplicationId(id: any) {
    this.ciLoanApplicationService.getLoanApplicationDetailsByLoanApplicationId(id).subscribe((data: any) => {
      this.responseModel = data;
      if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
          if (this.responseModel.data.length > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
              this.admissionNumber = this.responseModel.data[0].adminssionNumber;
              this.memberTypeName = this.responseModel.data[0].memberTypeName;;
              this.memberTypeId = this.responseModel.data[0].memberTypeId;
              this.ciLoanApplicationModel = this.responseModel.data[0];
            if (this.ciLoanApplicationModel != null && this.ciLoanApplicationModel != undefined) {
              if (this.ciLoanApplicationModel.applicationDate != null && this.ciLoanApplicationModel.applicationDate != undefined)
                this.ciLoanApplicationModel.applicationDateVal = this.datePipe.transform(this.ciLoanApplicationModel.applicationDate, this.orgnizationSetting.datePipe);

              if (this.ciLoanApplicationModel.sanctionDate != null && this.ciLoanApplicationModel.sanctionDate != undefined)
                this.ciLoanApplicationModel.sanctionDateVal = this.datePipe.transform(this.ciLoanApplicationModel.sanctionDate, this.orgnizationSetting.datePipe);

              if (this.ciLoanApplicationModel.loanDueDate != null && this.ciLoanApplicationModel.loanDueDate != undefined)
                this.ciLoanApplicationModel.loanDueDateVal = this.datePipe.transform(this.ciLoanApplicationModel.loanDueDate, this.orgnizationSetting.datePipe);

              if (this.ciLoanApplicationModel.memberTypeName != null && this.ciLoanApplicationModel.memberTypeName != undefined)
                this.memberTypeName = this.ciLoanApplicationModel.memberTypeName;

              if (this.ciLoanApplicationModel.applicationPath != null && this.ciLoanApplicationModel.applicationPath != undefined) {
                this.ciLoanApplicationModel.multipartFileList = this.fileUploadService.getFile(this.ciLoanApplicationModel.applicationPath, ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.ciLoanApplicationModel.applicationPath);
              }

              if (this.ciLoanApplicationModel.individualMemberDetailsDTO != undefined && this.ciLoanApplicationModel.individualMemberDetailsDTO != null) {
                this.individualFlag = true;
                this.disableMemberType = true;
                this.membershipBasicDetailsModel = this.ciLoanApplicationModel.individualMemberDetailsDTO;

                if (this.membershipBasicDetailsModel.admissionNumber != undefined && this.membershipBasicDetailsModel.admissionNumber != null)
                  this.admissionNumber = this.membershipBasicDetailsModel.admissionNumber;

                if (this.membershipBasicDetailsModel.admissionDate != null && this.membershipBasicDetailsModel.admissionDate != undefined)
                  this.membershipBasicDetailsModel.admissionDateVal = this.datePipe.transform(this.membershipBasicDetailsModel.admissionDate, this.orgnizationSetting.datePipe);

                if (this.membershipBasicDetailsModel.dob != null && this.membershipBasicDetailsModel.dob != undefined)
                  this.membershipBasicDetailsModel.dobVal = this.datePipe.transform(this.membershipBasicDetailsModel.dob, this.orgnizationSetting.datePipe);

                if (this.membershipBasicDetailsModel.photoCopyPath != null && this.membershipBasicDetailsModel.photoCopyPath != undefined) {
                  this.membershipBasicDetailsModel.multipartFileListForPhotoCopy = this.fileUploadService.getFile(this.membershipBasicDetailsModel.photoCopyPath, ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.membershipBasicDetailsModel.photoCopyPath);
                }
                if (this.membershipBasicDetailsModel.signatureCopyPath != null && this.membershipBasicDetailsModel.signatureCopyPath != undefined) {
                  this.membershipBasicDetailsModel.multipartFileListForsignatureCopyPath = this.fileUploadService.getFile(this.membershipBasicDetailsModel.signatureCopyPath, ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.membershipBasicDetailsModel.signatureCopyPath);
                }
              }
              if (this.ciLoanApplicationModel.memberGroupDetailsDTO != undefined && this.ciLoanApplicationModel.memberGroupDetailsDTO != null) {
                this.groupFlag = true
                this.disableMemberType = true;
                this.membershipGroupDetailsModel = this.ciLoanApplicationModel.memberGroupDetailsDTO;

                if (this.membershipGroupDetailsModel.admissionNumber != undefined && this.membershipGroupDetailsModel.admissionNumber != null)
                  this.admissionNumber = this.membershipGroupDetailsModel.admissionNumber;

                if (this.membershipGroupDetailsModel.admissionDate != null && this.membershipGroupDetailsModel.admissionDate != undefined)
                  this.membershipGroupDetailsModel.admissionDateVal = this.datePipe.transform(this.membershipGroupDetailsModel.admissionDate, this.orgnizationSetting.datePipe);

                if (this.membershipGroupDetailsModel.registrationDate != null && this.membershipGroupDetailsModel.registrationDate != undefined)
                  this.membershipGroupDetailsModel.registrationDateVal = this.datePipe.transform(this.membershipGroupDetailsModel.registrationDate, this.orgnizationSetting.datePipe);


                if (this.membershipGroupDetailsModel.groupPromoterList != null && this.membershipGroupDetailsModel.groupPromoterList != undefined && this.membershipGroupDetailsModel.groupPromoterList.length > 0)
                  this.promoterDetails = this.membershipGroupDetailsModel.groupPromoterList;
                for(let promoter of this.promoterDetails){
                  promoter.memDobVal = this.datePipe.transform(promoter.dob, this.orgnizationSetting.datePipe);
                  promoter.startDateVal = this.datePipe.transform(promoter.startDate, this.orgnizationSetting.datePipe);
                }
              }
              if (this.ciLoanApplicationModel.memberInstitutionDTO != undefined && this.ciLoanApplicationModel.memberInstitutionDTO != null) {
                this.institutionFlag = true;
                this.disableMemberType = true;
                this.membershipInstitutionDetailsModel = this.ciLoanApplicationModel.memberInstitutionDTO;

                if (this.membershipInstitutionDetailsModel.admissionNumber != undefined && this.membershipInstitutionDetailsModel.admissionNumber != null)
                  this.admissionNumber = this.membershipInstitutionDetailsModel.admissionNumber;

                if (this.membershipInstitutionDetailsModel.admissionDate != null && this.membershipInstitutionDetailsModel.admissionDate != undefined)
                  this.membershipInstitutionDetailsModel.admissionDateVal = this.datePipe.transform(this.membershipInstitutionDetailsModel.admissionDate, this.orgnizationSetting.datePipe);

                if (this.membershipInstitutionDetailsModel.registrationDate != null && this.membershipInstitutionDetailsModel.registrationDate != undefined)
                  this.membershipInstitutionDetailsModel.registrationDateVal = this.datePipe.transform(this.membershipInstitutionDetailsModel.registrationDate, this.orgnizationSetting.datePipe);


                if (this.membershipInstitutionDetailsModel.institutionPromoterList != null && this.membershipInstitutionDetailsModel.institutionPromoterList != undefined && this.membershipInstitutionDetailsModel.institutionPromoterList.length > 0)
                  this.institutionPromoter = this.membershipInstitutionDetailsModel.institutionPromoterList;
                for(let promoter of this.institutionPromoter){
                  promoter.memDobVal = this.datePipe.transform(promoter.dob, this.orgnizationSetting.datePipe);
                  promoter.startDateVal = this.datePipe.transform(promoter.startDate, this.orgnizationSetting.datePipe);
                }
              }

            }
            this.msgs = [];
            this.msgs = [{ severity: 'success', summary: applicationConstants.STATUS_SUCCESS, detail: this.responseModel.statusMsg }];
            setTimeout(() => {
              this.msgs = [];
            }, 2000);
          }
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

  memberFormReset(flag: any) {
    if (flag) {
      this.memberCreationForm.reset();
      this.showForm = flag;
    }
    else {
      this.showForm = flag;
    }
  }
  //update data to main stepper component based on member type form validation
  updateData() {
    this.ciLoanApplicationModel.memberTypeId = this.memberTypeId;
    if (this.memberTypeName == "Individual") {
      this.individualFlag = true;
      this.isDisableFlag = (!this.memberCreationForm.valid)
      this.ciLoanApplicationModel.memberTypeName = this.memberTypeName;
      this.membershipBasicDetailsModel.memberTypeName = this.memberTypeName;
      this.membershipBasicDetailsModel.isNewMember = this.showForm;
      this.ciLoanApplicationModel.individualMemberDetailsDTO = this.membershipBasicDetailsModel;
    }
    if (this.memberTypeName == "Group") {
      this.groupFlag = true;
      this.isDisableFlag = (!this.groupForm.valid)
      this.membershipGroupDetailsModel.memberTypeId = this.memberTypeId;
      this.membershipGroupDetailsModel.memberTypeName = this.memberTypeName;
      this.membershipGroupDetailsModel.isNewMember = this.showForm;
      this.ciLoanApplicationModel.memberGroupDetailsDTO = this.membershipGroupDetailsModel;
      this.ciLoanApplicationModel.memberTypeName = this.memberTypeName;
      this.ciLoanApplicationModel.memberGroupDetailsDTO = this.membershipGroupDetailsModel;
    }
    if (this.memberTypeName == "Institution") {
      this.institutionFlag = true;
      this.isDisableFlag = (!this.institutionForm.valid)
      this.membershipInstitutionDetailsModel.memberTypeId = this.memberTypeId;
      this.membershipInstitutionDetailsModel.memberTypeName = this.memberTypeName;
      this.membershipInstitutionDetailsModel.isNewMember = this.showForm;
      this.ciLoanApplicationModel.memberTypeName = this.memberTypeName;
      this.ciLoanApplicationModel.memberInstitutionDTO = this.membershipInstitutionDetailsModel;
  }
    this.ciLoanApplicationService.changeData({
      formValid: this.memberCreationForm.valid ? true : false || this.institutionForm.valid ? true : false || this.memberCreationForm.valid ? true : false,
      data: this.ciLoanApplicationModel,
      isDisable: this.isDisableFlag,
      stepperIndex: 0,
    });
  }
  //stepper data save
  save() {
    this.updateData();
  }

  //for append relation name values
  onChangeRelationTypeChange(event: any) {
    const filteredItem = this.relationTypesList.find(item => item.value === event.value);
    this.membershipBasicDetailsModel.relationTypeName = filteredItem.label;
  }
  //for relation Types
  getAllRelationTypes() {
    this.ciLoanApplicationService.getAllRelationTypes().subscribe((res: any) => {
      this.responseModel = res;
      if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
        this.relationTypesList = this.responseModel.data;
        this.relationTypesList = this.relationTypesList.filter((obj: any) => obj != null).map((relationType: { name: any; id: any; }) => {
          return { label: relationType.name, value: relationType.id };
        });
      }
    });
  }
  //Occupations List
  getAllOccupationTypes() {
    this.ciLoanApplicationService.getAllAccountTypes().subscribe((res: any) => {
      this.responseModel = res;
      if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
        this.occupationTypeList = this.responseModel.data;
        this.occupationTypeList = this.occupationTypeList.filter((obj: any) => obj != null).map((relationType: { name: any; id: any; }) => {
          return { label: relationType.name, value: relationType.id };
        });

      }
    });
  }
  //qualifications List
  getAllQualificationType() {
    this.ciLoanApplicationService.getQualificationTypes().subscribe((res: any) => {
      this.responseModel = res;
      if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
        this.qualificationTypes = this.responseModel.data;
        this.qualificationTypes = this.qualificationTypes.filter((obj: any) => obj != null).map((relationType: { name: any; id: any; }) => {
          return { label: relationType.name, value: relationType.id };
        });
      }
    });
  }

  //castes List
  getCastesList() {
    this.ciLoanApplicationService.getCastes().subscribe((res: any) => {
      this.responseModel = res;
      if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
        this.castesList = this.responseModel.data;
        this.castesList = this.castesList.filter((obj: any) => obj != null).map((relationType: { name: any; id: any; }) => {
          return { label: relationType.name, value: relationType.id };
        });
      }
    });
  }

 
  //get member individual details
  getMemberDetailsByAdmissionNumber(admisionNumber: any) {
    this.ciLoanApplicationService.getMemberShipBasicDetailsFromLoansModule(admisionNumber).subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel != null && this.responseModel != undefined) {
         this.memberTypeList.filter((village: any) => village != null && village.value == this.membershipBasicDetailsModel.memberTypeId).map((act: { label: any; }) => {
    this.membershipBasicDetailsModel.memberTypeName = act.label;
  });
        if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
          if (this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
            this.membershipBasicDetailsModel = this.responseModel.data[0];
            if (this.membershipBasicDetailsModel.dob != null && this.membershipBasicDetailsModel.dob != undefined) {
              this.membershipBasicDetailsModel.dob = this.datePipe.transform(this.membershipBasicDetailsModel.dob, this.orgnizationSetting.datePipe);
            }
            if (this.membershipBasicDetailsModel.admissionDate != null && this.membershipBasicDetailsModel.admissionDate != undefined) {
              this.membershipBasicDetailsModel.admissionDate = this.datePipe.transform(this.membershipBasicDetailsModel.admissionDate, this.orgnizationSetting.datePipe);
            }
            if(this.membershipBasicDetailsModel.memberTypeId != undefined && this.membershipBasicDetailsModel.memberTypeId){
              this.memberTypeId = this.membershipBasicDetailsModel.memberTypeId;
            }
            if (this.membershipBasicDetailsModel.photoCopyPath != null && this.membershipBasicDetailsModel.photoCopyPath != undefined) {
              this.membershipBasicDetailsModel.multipartFileListForPhotoCopy = this.fileUploadService.getFile(this.membershipBasicDetailsModel.photoCopyPath ,ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.membershipBasicDetailsModel.photoCopyPath  );
            }
            if (this.membershipBasicDetailsModel.signatureCopyPath != null && this.membershipBasicDetailsModel.signatureCopyPath != undefined) {
              this.membershipBasicDetailsModel.multipartFileListForsignatureCopyPath = this.fileUploadService.getFile(this.membershipBasicDetailsModel.signatureCopyPath ,ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.membershipBasicDetailsModel.signatureCopyPath  );
            }
            this.ciLoanApplicationModel.individualMemberDetailsDTO = this.membershipBasicDetailsModel;
            this.ciLoanApplicationModel.memberTypeName = this.membershipBasicDetailsModel.memberTypeName;
            this.updateData();
            this.disableMemberType = true;
          }
        }
        else {
          this.commonComponent.stopSpinner();
          this.msgs = [];
          this.msgs = [{ severity: 'error', detail: this.responseModel.statusMsg }];
          setTimeout(() => {
            this.msgs = [];
          }, 2000);
        }
      }
    },
      error => {
        this.msgs = [];
        this.commonComponent.stopSpinner();
        this.msgs = [{ severity: 'error', detail: applicationConstants.SERVER_DOWN_ERROR }];
        setTimeout(() => {
          this.msgs = [];
        }, 2000);
      });
  }
  //get group details
  getGroupByAdmissionNumber(admissionNumber: any) {
    this.ciLoanApplicationService.getMemberShipGroupDetailsFromLoansModule(admissionNumber).subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel != null && this.responseModel != undefined) {
        if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
          if (this.responseModel.data.length > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
            this.membershipGroupDetailsModel = this.responseModel.data[0];
            if (this.membershipGroupDetailsModel.registrationDate != null && this.membershipGroupDetailsModel.registrationDate != undefined) {
              this.membershipGroupDetailsModel.registrationDate = this.datePipe.transform(this.membershipGroupDetailsModel.registrationDate, this.orgnizationSetting.datePipe);
            }
            if (this.membershipGroupDetailsModel.admissionDate != null && this.membershipGroupDetailsModel.admissionDate != undefined) {
              this.membershipGroupDetailsModel.admissionDate = this.datePipe.transform(this.membershipGroupDetailsModel.admissionDate, this.orgnizationSetting.datePipe);
            }
            if (this.membershipGroupDetailsModel.memberTypeId != null && this.membershipGroupDetailsModel.memberTypeId != undefined) {
              this.memberTypeId = this.membershipGroupDetailsModel.memberTypeId;
            }
            if (this.membershipGroupDetailsModel.groupPromotersDTOList != null && this.membershipGroupDetailsModel.groupPromotersDTOList != undefined && this.membershipGroupDetailsModel.groupPromotersDTOList.length > 0) {
              this.promoterDetails = this.membershipGroupDetailsModel.groupPromotersDTOList.map((member: any) => {
                if(member != null && member != undefined){
                  if(member.dob != null && member.dob != undefined){
                    member.memdob = this.datePipe.transform(member.dob, this.orgnizationSetting.datePipe);
                  }
                  if(member.startDate != null && member.startDate != undefined){
                    member.startDateVal = this.datePipe.transform(member.startDate, this.orgnizationSetting.datePipe);
                  }
                }
                return member;
              });
              if(this.membershipGroupDetailsModel.memberTypeName != null && this.membershipGroupDetailsModel.memberTypeName != undefined){
                this.ciLoanApplicationModel.memberTypeName = this.membershipGroupDetailsModel.memberTypeName;
              }
              if(this.membershipGroupDetailsModel != null && this.membershipGroupDetailsModel != undefined){
              this.ciLoanApplicationModel.individualMemberDetailsDTO = this.membershipGroupDetailsModel;
              }
            }
            this.updateData();
            this.disableMemberType = true;
          }

        }
        else {
          this.commonComponent.stopSpinner();
          this.msgs = [];
          this.msgs = [{ severity: 'error', detail: this.responseModel.statusMsg }];
          setTimeout(() => {
            this.msgs = [];
          }, 2000);
        }
      }
    },
      error => {
        this.msgs = [];
        this.commonComponent.stopSpinner();
        this.msgs = [{ severity: 'error', detail: applicationConstants.SERVER_DOWN_ERROR }];
        setTimeout(() => {
          this.msgs = [];
        }, 2000);
      });
  }
  //get institution details
  getInstitutionByAdmissionNumber(admissionNumber: any) {
    this.ciLoanApplicationService.getMemberShipInstitutionDetailsFromLoansModule(admissionNumber).subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel != null && this.responseModel != undefined) {
        if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
          if (this.responseModel.data.length > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
            this.membershipInstitutionDetailsModel = this.responseModel.data[0];

            if (this.membershipInstitutionDetailsModel.registrationDate != null && this.membershipInstitutionDetailsModel.registrationDate != undefined) {
              this.membershipInstitutionDetailsModel.registrationDate = this.datePipe.transform(this.membershipInstitutionDetailsModel.registrationDate, this.orgnizationSetting.datePipe);
            }
            if (this.membershipInstitutionDetailsModel.admissionDate != null && this.membershipInstitutionDetailsModel.admissionDate != undefined) {
              this.membershipInstitutionDetailsModel.admissionDate = this.datePipe.transform(this.membershipInstitutionDetailsModel.admissionDate, this.orgnizationSetting.datePipe);
            }
            if(this.membershipInstitutionDetailsModel.memberTypeId != null && this.membershipInstitutionDetailsModel.memberTypeId != undefined){
              this.memberTypeId = this.memberTypeId;
            }
            if (this.membershipInstitutionDetailsModel.institutionPromoterDetailsDTOList.length > 0)
              this.institutionPromoter = this.membershipInstitutionDetailsModel.institutionPromoterDetailsDTOList;
            this.ciLoanApplicationModel.memberTypeName = this.membershipInstitutionDetailsModel.memberTypeName;
            this.ciLoanApplicationModel.memberInstitutionDTO = this.membershipInstitutionDetailsModel;
            this.updateData();
            this.disableMemberType = true;
          }
        } else {
          this.commonComponent.stopSpinner();
          this.msgs = [];
          this.msgs = [{ severity: 'error', detail: this.responseModel.statusMsg }];
          setTimeout(() => {
            this.msgs = [];
          }, 2000);
        }
      }
    },
      error => {
        this.msgs = [];
        this.commonComponent.stopSpinner();
        this.msgs = [{ severity: 'error', detail: applicationConstants.SERVER_DOWN_ERROR }];
        setTimeout(() => {
          this.msgs = [];
        }, 2000);
      });
  }

  //on change Of memberType
  OnChangeMemberType(event: any) {
    const filteredItem = this.memberTypeList.find((item: { value: any; }) => item.value === event.value);
    this.memberTypeName = filteredItem.label;
    if (event.value == 1) {
      this.individualFlag = true;
      this.institutionFlag = false;
      this.groupFlag = false;
      this.membershipBasicDetailsModel.memberTypeId = 1;
    }
    else if (event.value == 2) {
      this.addButton = false;
      this.EditDeleteDisable = false;
      this.groupFlag = true;
      this.individualFlag = false;
      this.institutionFlag = false;
      this.membershipGroupDetailsModel.memberTypeId = 2;
    }
    else if (event.value == 3) {
      this.addButton = false;
      this.EditDeleteDisable = false;
      this.institutionFlag = true;
      this.individualFlag = false;
      this.groupFlag = false;
      this.membershipInstitutionDetailsModel.memberTypeId = 3;
    }
    this.updateData();
  }


   /**
  * @implements save group prmoters
  * @param rowData 
  * @author jyothi.naidana
  */
   savePromoterDetails(rowData: any) {
    this.groupPromoters = false;
    rowData.pacsId = 1;
    this.addButton = false;
    this.EditDeleteDisable = false;
    if(rowData.memDobVal != null && rowData.memDobVal != undefined){
      rowData.dob = this.commonFunctionsService.getUTCEpoch(new Date(rowData.memDobVal) );
    }
    if (rowData.dob != null && rowData.dob != undefined) {
      rowData.memDobVal  = this.datePipe.transform(rowData.dob, this.orgnizationSetting.datePipe);
    }
    if(rowData.startDateVal != null && rowData.startDateVal != undefined){
      rowData.startDate = this.commonFunctionsService.getUTCEpoch(new Date(rowData.startDateVal) );
    }
    
    if (rowData.startDate != null && rowData.startDate != undefined) {
      rowData.startDateVal  = this.datePipe.transform(rowData.startDate, this.orgnizationSetting.datePipe);
    }
    if (!this.membershipGroupDetailsModel.groupPromotersDTOList) {
      this.membershipGroupDetailsModel.groupPromotersDTOList = []; // Initialize it as an empty array
    }
    let Object = this.operatorTypeList.find((obj:any)=>obj.value == rowData.operatorTypeId);
    if(Object != null && Object != undefined && Object.label != null && Object.label != undefined) {
      rowData.operatorTypeName = Object.label;
    }
    Object = this.genderList.find((obj:any)=>obj.value == rowData.genderId);
    if(Object != null && Object != undefined && Object.label != null && Object.label != undefined) {
      rowData.genderName = Object.label;
    }
    Object = this.maritalStatusList.find((obj:any)=>obj.value == rowData.martialId);
    if(Object != null && Object != undefined && Object.label != null && Object.label != undefined) {
      rowData.maritalStatusName = Object.label;
    }
    if(this.promoterDetails != null && this.promoterDetails != undefined && this.promoterDetails.length > 0 ){
      const kyc = this.promoterDetails.findIndex((obj:any) => (obj != null && obj != undefined ) && obj.uniqueId === rowData.uniqueId );
      if(kyc != -1){
        this.promoterDetails[kyc] = null;
        this.promoterDetails[kyc] = rowData;
      }
      else{
        this.promoterDetails.push(rowData);
      }
      this.membershipGroupDetailsModel.groupPromoterList = this.promoterDetails;
    }else{
      this.promoterDetails.push(rowData);
      this.membershipGroupDetailsModel.groupPromoterList = this.promoterDetails;
    }
    this.updateData();
  }

  //inline cancle Promoters oF Group 
  cancelPromoter(flag:Boolean) {
    this.addButton = false;
    this.groupPromoters = false;
    this.EditDeleteDisable = false;
    this.promoterDetails;
  }
  //inline add new entry for group promoter
  addNewEntry() {
    this.newRow = { uniqueId: this.promoterDetails.length + 1, surname: '', name: '', operatorTypeId: '', dob: '', age: '', genderId: '', martialId: '', mobileNumber: '', emailId: '', aadharNumber: '', startDate: '' }

  }
  //inline edit for group promoter
  editPromoter(row: any) {
    this.cancleButtonFlag = true;
    this.addButton = true;
    this.EditDeleteDisable = true;
    this.groupPromoters = true;
    this.promoterDetailsModel = new GroupPromoterDetails();
    this.promoterDetailsModel = this.promoterDetails.find((obj:any) => (obj != null && obj != undefined) && obj.uniqueId === row.uniqueId );
    if(this.promoterDetailsModel.isExistingMember ){
      this.admissionNumberDropDown = true;
    }
    else{
      this.admissionNumberDropDown = false;
    }
    this.promoterDetailsModel.multipartFileListForPhotoCopyPath = this.fileUploadService.getFile(this.promoterDetailsModel.uploadImage ,ERP_TRANSACTION_CONSTANTS.DEMANDDEPOSITS + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.promoterDetailsModel.uploadImage  );
    this.promoterDetailsModel.multipartFileListForSignatureCopyPath = this.fileUploadService.getFile(this.promoterDetailsModel.uploadSignature ,ERP_TRANSACTION_CONSTANTS.DEMANDDEPOSITS + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.promoterDetailsModel.uploadSignature  );
  }

   /**
   * @implements row add of group promoters
   * @author jyothi.naidana
   */
   onRowAddSave() {
    this.groupPromoters = true;
    this.cancleButtonFlag = false;
    this.promoterDetailsModel = new GroupPromoterDetails();
    this.promoterDetailsModel.uniqueId = this.promoterDetails.length + 1
    this.promoterDetailsForm.reset();
    this.onChangeExistedPrmoter(false);
    this.admissionNumberDropDown = false;
  }
  //inline edit for operator details
  getAllOperatorTypes() {
    this.commonComponent.startSpinner();
    this.ciLoanApplicationService.getAllOperationTypes().subscribe((res: any) => {
      this.responseModel = res;
      if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
        if (this.responseModel.data == null || (this.responseModel.data != null && this.responseModel.data.length == 0)) {
          this.msgs = [];
          this.msgs = [{ severity: 'error', detail: applicationConstants.RELATIONSHIP_TYPE_NO_DATA_MESSAGE }];
          setTimeout(() => {
            this.msgs = [];
          }, 2000);
        }
        this.operatorTypeList = this.responseModel.data.filter((customertype: any) => customertype.status == applicationConstants.ACTIVE).map((count: any) => {
          return { label: count.name, value: count.id }
        });
        let relation = this.operatorTypeList.find((data: any) => null != data && data.value == this.promoterDetailsModel.operatorTypeId);
        if (relation != null && undefined != relation)
          this.promoterDetailsModel.operationTypeName = relation.label;
        this.commonComponent.stopSpinner();
      } else {
        this.commonComponent.stopSpinner();
        this.msgs = [];
        this.msgs = [{ severity: 'error', detail: this.responseModel.statusMsg }];
        setTimeout(() => {
          this.msgs = [];
        }, 2000);
      }
    },
      error => {
        this.msgs = [];
        this.commonComponent.stopSpinner();
        this.msgs = [{ severity: 'error', detail: applicationConstants.SERVER_DOWN_ERROR }];
        setTimeout(() => {
          this.msgs = [];
        }, 2000);
      });
  }

   /**
   * @implements save institution promoters details
   * @param rowData 
   * @author jyothi.naidana
   */
   saveInstitutionPromoterDetails(rowData: any) {
    this.institutionPromoterPopUp = false;
    this.cancleButtonFlag = false
    rowData.pacsId = 1;
    this.addButton = false;
    this.EditDeleteDisable = false;

    if(rowData.memDobVal != null && rowData.memDobVal != undefined){
      rowData.dob = this.commonFunctionsService.getUTCEpoch(new Date(rowData.memDobVal) );
    }
    if (rowData.dob != null && rowData.dob != undefined) {
      rowData.memDobVal  = this.datePipe.transform(rowData.dob, this.orgnizationSetting.datePipe);
    }
    if(rowData.startDateVal != null && rowData.startDateVal != undefined){
      rowData.startDate = this.commonFunctionsService.getUTCEpoch(new Date(rowData.startDateVal) );
    }
    
    if (rowData.startDate != null && rowData.startDate != undefined) {
      rowData.startDateVal  = this.datePipe.transform(rowData.startDate, this.orgnizationSetting.datePipe);
    }
    let Object = this.operatorTypeList.find((obj:any)=>obj.value == rowData.operatorTypeId);
    if(Object != null && Object != undefined && Object.label != null && Object.label != undefined) {
      rowData.operatorTypeName = Object.label;
    }
    Object = this.genderList.find((obj: any) => obj.value == rowData.genderId);
    if (Object != null && Object != undefined && Object.label != null && Object.label != undefined) {
      rowData.genderName = Object.label;
    }
    Object = this.maritalStatusList.find((obj: any) => obj.value == rowData.martialId);
    if (Object != null && Object != undefined && Object.label != null && Object.label != undefined) {
      rowData.maritalStatusName = Object.label;
    }

    if (!this.membershipInstitutionDetailsModel.institutionPromoterList) {
      this.membershipInstitutionDetailsModel.institutionPromoterList = []; // Initialize it as an empty array
    }
    if(this.institutionPromoter != null && this.institutionPromoter != undefined && this.institutionPromoter.length > 0){
      const kyc = this.institutionPromoter.findIndex((obj:any) => (obj != null && obj != undefined) && obj.uniqueId === rowData.uniqueId );
      if(kyc != -1){
        this.institutionPromoter[kyc] = null;
        this.institutionPromoter[kyc] = rowData;
      }
      else {
        this.institutionPromoter.push(rowData);
      }
      this.membershipInstitutionDetailsModel.institutionPromoterList = this.institutionPromoter;
    }
    else{
      this.institutionPromoter.push(rowData);
      this.membershipInstitutionDetailsModel.institutionPromoterList = this.institutionPromoter;
    }
    this.updateData();
  }

  /**
   * @implements cancle institution promoters
   * @param falg 
   * @author jyothi.naidana
   */
  cancelInstitutionPromoter(falg : Boolean) {
    this.addButton = false;
    this.EditDeleteDisable = false;
    this.institutionPromoterPopUp = false;
    this.institutionPromoter;
  }
  //inline add new row for institution promoters details
  addForInstitutionNewEntry() {
    this.newRow = { uniqueId: this.institutionPromoter.length + 1, surname: '', name: '', operatorTypeId: '', dob: '', age: '', genderId: '', martialId: '', mobileNumber: '', emailId: '', aadharNumber: '', startDate: '' }
  }

  /**
   * @implements edit institution promoters
   * @param rowData 
   * @author jyothi.naidana
   */
  editInstitutionPromoter(rowData: any) {
    this.cancleButtonFlag = false;
    this.addButton = true;
    this.EditDeleteDisable = true;
    this.institutionPromoterPopUp = true;
    this.institutionPromoterDetailsModel = new InstitutionPromoterDetails();
    this.institutionPromoterDetailsModel =  this.institutionPromoter.find((obj:any) => (obj != null && obj != undefined) && obj.uniqueId === rowData.uniqueId );
    if(this.institutionPromoterDetailsModel.isExistingMember ){
      this.admissionNumberDropDown = true;
    }
    else{
      this.admissionNumberDropDown = false;
    }
    this.institutionPromoterDetailsModel.multipartFileListForPhotoCopyPath = this.fileUploadService.getFile(this.institutionPromoterDetailsModel.uploadImage ,ERP_TRANSACTION_CONSTANTS.DEMANDDEPOSITS + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.institutionPromoterDetailsModel.uploadImage  );
    this.institutionPromoterDetailsModel.multipartFileListForSignatureCopyPath = this.fileUploadService.getFile(this.institutionPromoterDetailsModel.uploadSignature ,ERP_TRANSACTION_CONSTANTS.DEMANDDEPOSITS + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.institutionPromoterDetailsModel.uploadSignature  );
  }
   /**
   * @implements on institution promoter add
   * @author jyothi.naidana
   */
   onRowAddInstitution() {
    this.institutionPromoterPopUp = true;
    this.cancleButtonFlag = true;
    let uniqueId = this.institutionPromoter.length + 1
    this.institutionPromoterDetailsModel = new InstitutionPromoterDetails();
    this.institutionPromoterDetailsModel.uniqueId = uniqueId; 
    this.promoterDetailsForm.reset();
    this.admissionNumberDropDown = false;
    
  }

  getAllMemberType() {
    this.ciLoanApplicationService.getAllMemberTypes().subscribe((data: any) => {
      this.responseModel = data;
      if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
        if (this.responseModel.data.length > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
          this.memberTypeList = this.responseModel.data;
          this.memberTypeList = this.memberTypeList.filter((obj: any) => obj != null).map((relationType: { name: any; id: any; }) => {
            return { label: relationType.name, value: relationType.id };
          });
        }
        const filteredItem = this.memberTypeList.find((item: { value: any; }) => item.value === this.memberTypeId);
        if(filteredItem != null && filteredItem != undefined && filteredItem.label != null && filteredItem.label != undefined){
          this.memberTypeName = filteredItem.label;
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

  membershipDataFromRdModule() {
    if (this.memberTypeName == "Individual") {
      this.individualFlag = true;
      // this.membershipBasicDetailsModel.admissionNumber = this.admisionNumber;
      this.getMemberDetailsByAdmissionNumber(this.admissionNumber);
    } else if (this.memberTypeName == "Group") {
      this.groupFlag = true;
      // this.membershipGroupDetailsModel.admissionNumber = this.admisionNumber;
      this.getGroupByAdmissionNumber(this.admissionNumber);
    } else if (this.memberTypeName == "Institution") {
      this.institutionFlag = true;
      // this.membershipInstitutionDetailsModel.admissionNumber = this.admisionNumber;
      this.getInstitutionByAdmissionNumber(this.admissionNumber);
    }
  }

  /**
   * @implements image uploader
   * @param event 
   * @param fileUpload 
   */
  fileUploader(event: any, fileUpload: FileUpload, filePathName: any) {
    this.isFileUploaded = applicationConstants.FALSE;
    this.multipleFilesList = [];
    
    
    if(this.isEdit && this.membershipBasicDetailsModel.filesDTOList == null || this.membershipBasicDetailsModel.filesDTOList == undefined){
      this.membershipBasicDetailsModel.filesDTOList = [];
      
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
         // Add to filesDTOList array
        let timeStamp = this.commonComponent.getTimeStamp();
        if (filePathName === "individualPhotoCopy") {
          this.membershipBasicDetailsModel.filesDTOList.push(files);
          this.membershipBasicDetailsModel.photoCopyPath = null;
          this.membershipBasicDetailsModel.multipartFileListForPhotoCopy = [];
          this.membershipBasicDetailsModel.filesDTOList[this.membershipBasicDetailsModel.filesDTOList.length - 1].fileName = "Individual_Member_Photo_copy" + "_" + timeStamp + "_" + file.name;
          this.membershipBasicDetailsModel.photoCopyPath = "Individual_Member_Photo_copy" + "_" + timeStamp + "_" + file.name; // This will set the last file's name as docPath
        }
        if (filePathName === "individualSighnedCopy") {
          this.membershipBasicDetailsModel.filesDTOList.push(files);
          this.membershipBasicDetailsModel.multipartFileListForsignatureCopyPath = [];
          this.membershipBasicDetailsModel.signatureCopyPath = null;
          this.membershipBasicDetailsModel.filesDTOList[this.membershipBasicDetailsModel.filesDTOList.length - 1].fileName = "Individual_Member_signed_copy" + "_" + timeStamp + "_" + file.name;
          this.membershipBasicDetailsModel.signatureCopyPath = "Individual_Member_signed_copy" + "_" + timeStamp + "_" + file.name; // This will set the last file's name as docPath
        }
        if (filePathName === "groupPhotoCopy") {
          this.membershipGroupDetailsModel.filesDTOList.push(files);
          this.membershipGroupDetailsModel.signatureCopyPath = null;
          this.membershipGroupDetailsModel.filesDTOList[this.membershipGroupDetailsModel.filesDTOList.length - 1].fileName = "Group_Member_Photo_copy" + "_" + timeStamp + "_" + file.name;
          this.membershipGroupDetailsModel.signatureCopyPath = "Group_Member_Photo_copy" + "_" + timeStamp + "_" + file.name; // This will set the last file's name as docPath
        }
        if (filePathName === "groupSignatureCopy") {
          this.membershipGroupDetailsModel.filesDTOList.push(files);
          this.membershipGroupDetailsModel.signatureCopyPath = null;
          this.membershipGroupDetailsModel.filesDTOList[this.membershipGroupDetailsModel.filesDTOList.length - 1].fileName = "Group_Member_signed_copy" + "_" + timeStamp + "_" + file.name;
          this.membershipGroupDetailsModel.signatureCopyPath = "Group_Member_signed_copy" + "_" + timeStamp + "_" + file.name; // This will set the last file's name as docPath
        }
        if (filePathName === "intistutionPhotoCopy") {
          this.membershipInstitutionDetailsModel.filesDTOList.push(files);
          this.membershipInstitutionDetailsModel.signatureCopyPath = null;
          this.membershipInstitutionDetailsModel.filesDTOList[this.membershipInstitutionDetailsModel.filesDTOList.length - 1].fileName = "Institution_Member_Photo_copy" + "_" + timeStamp + "_" + file.name;
          this.membershipInstitutionDetailsModel.signatureCopyPath = "Institution_Member_Photo_copy" + "_" + timeStamp + "_" + file.name; // This will set the last file's name as docPath
        }
        if (filePathName === "institutionSignature") {
          this.membershipInstitutionDetailsModel.filesDTOList.push(files);
          this.membershipInstitutionDetailsModel.signatureCopyPath = null;
          this.membershipInstitutionDetailsModel.filesDTOList[this.membershipInstitutionDetailsModel.filesDTOList.length - 1].fileName = "Institution_Member_signed_copy" + "_" + timeStamp + "_" + file.name;
          this.membershipInstitutionDetailsModel.signatureCopyPath = "Institution_Member_signed_copy" + "_" + timeStamp + "_" + file.name; // This will set the last file's name as docPath
        }
        // let index1 = event.files.findIndex((x: any) => x === file);
        // fileUpload.remove(event, index1);
        // fileUpload.clear();
        this.updateData();
      }
      reader.readAsDataURL(file);
    }
  }

  /**
   * @implements onFileremove from file value
   * @param fileName 
   */
  fileRemoeEvent(fileName: any) {
      if (this.membershipBasicDetailsModel.filesDTOList != null && this.membershipBasicDetailsModel.filesDTOList != undefined && this.membershipBasicDetailsModel.filesDTOList.length > 0) {
        if (fileName == "individualPhotoCopy") {
        let removeFileIndex = this.membershipBasicDetailsModel.filesDTOList.findIndex((obj: any) => obj && obj.fileName === this.membershipBasicDetailsModel.photoCopyPath);
        let obj = this.membershipBasicDetailsModel.filesDTOList.find((obj: any) => obj && obj.fileName === this.membershipBasicDetailsModel.photoCopyPath);
        this.membershipBasicDetailsModel.filesDTOList.splice(removeFileIndex, 1);
        this.membershipBasicDetailsModel.photoCopyPath = null;
      }
      if (fileName == "individualSighnedCopy") {
        let removeFileIndex = this.membershipBasicDetailsModel.filesDTOList.findIndex((obj: any) => obj && obj.fileName === this.membershipBasicDetailsModel.signatureCopyPath);
        let obj = this.membershipBasicDetailsModel.filesDTOList.find((obj: any) => obj && obj.fileName === this.membershipBasicDetailsModel.signatureCopyPath);
        this.membershipBasicDetailsModel.filesDTOList.splice(removeFileIndex, 1);
        this.membershipBasicDetailsModel.signatureCopyPath = null;
      }
    }
  }

  dateConverstion() {
    if (this.membershipGroupDetailsModel != null && this.membershipGroupDetailsModel != undefined) {
      if (this.membershipGroupDetailsModel.admissionDateVal != null && this.membershipGroupDetailsModel.admissionDateVal != undefined) {
        this.membershipGroupDetailsModel.admissionDate = this.commonFunctionsService.getUTCEpoch(new Date(this.membershipGroupDetailsModel.admissionDateVal));
      }
      if (this.membershipGroupDetailsModel.registrationDateVal != null && this.membershipGroupDetailsModel.registrationDateVal != undefined) {
        this.membershipGroupDetailsModel.registrationDate = this.commonFunctionsService.getUTCEpoch(new Date(this.membershipGroupDetailsModel.registrationDateVal));
      }
    }
    if (this.membershipBasicDetailsModel != null && this.membershipBasicDetailsModel != undefined) {
      if (this.membershipBasicDetailsModel.admissionDateVal != null && this.membershipBasicDetailsModel.admissionDateVal != undefined) {
        this.membershipBasicDetailsModel.admissionDate = this.commonFunctionsService.getUTCEpoch(new Date(this.membershipBasicDetailsModel.admissionDateVal));
      }
      if (this.membershipBasicDetailsModel.dobVal != null && this.membershipBasicDetailsModel.dobVal != undefined) {
        this.membershipBasicDetailsModel.dob = this.commonFunctionsService.getUTCEpoch(new Date(this.membershipBasicDetailsModel.dobVal));
      }
    }
    if (this.membershipInstitutionDetailsModel != null && this.membershipInstitutionDetailsModel != undefined) {
      if (this.membershipInstitutionDetailsModel.admissionDateVal != null && this.membershipInstitutionDetailsModel.admissionDateVal != undefined) {
        this.membershipInstitutionDetailsModel.admissionDate = this.commonFunctionsService.getUTCEpoch(new Date(this.membershipInstitutionDetailsModel.admissionDateVal));
      }
      if (this.membershipInstitutionDetailsModel.registrationDateVal != null && this.membershipInstitutionDetailsModel.registrationDateVal != undefined) {
        this.membershipInstitutionDetailsModel.registrationDate = this.commonFunctionsService.getUTCEpoch(new Date(this.membershipInstitutionDetailsModel.registrationDateVal));
      }
    }
    this.updateData();
  }

   /**
   * @implements onchange existed prmoter
   * @author jyothi.naidana
   */
   onChangeExistedPrmoter(isExistingMember :any){
    if(isExistingMember){
        this.admissionNumberDropDown = true;
        this.getAllTypeOfMembershipDetails(this.pacsId,this.branchId);
        this.resetFields();
        this.promoterDetailsForm.get('surname').disable();
        this.promoterDetailsForm.get('name').disable();
        this.promoterDetailsForm.get('operatorTypeId').disable();
        this.promoterDetailsForm.get('dob').disable();
        this.promoterDetailsForm.get('age').disable();
        this.promoterDetailsForm.get('genderId').disable();
        this.promoterDetailsForm.get('martialId').disable();
        this.promoterDetailsForm.get('mobileNumber').disable();
        this.promoterDetailsForm.get('aadharNumber').disable();
        this.promoterDetailsForm.get('emailId').disable();
        this.promoterDetailsForm.get('startDate').disable();
        
        this.promoterDetailsForm.get('admissionNumber').setValidators( Validators.compose([Validators.required]));
    }
    else {
      this.resetFields();
        this.promoterDetailsForm.get('surname').enable();
        this.promoterDetailsForm.get('name').enable();
        this.promoterDetailsForm.get('operatorTypeId').enable();
        this.promoterDetailsForm.get('dob').enable();
        this.promoterDetailsForm.get('age').enable();
        this.promoterDetailsForm.get('genderId').enable();
        this.promoterDetailsForm.get('martialId').enable();
        this.promoterDetailsForm.get('mobileNumber').enable();
        this.promoterDetailsForm.get('aadharNumber').enable();
        this.promoterDetailsForm.get('emailId').enable();
        this.promoterDetailsForm.get('startDate').enable();
        this.admissionNumberDropDown = false;
    }
  }

  /**
   * @implements reset feilds 
   * @author jyothi.naidana
   */
  resetFields(){
    this.promoterDetailsForm.get('surname').reset();
    this.promoterDetailsForm.get('name').reset();
    this.promoterDetailsForm.get('operatorTypeId').reset();
    this.promoterDetailsForm.get('dob').reset();
    this.promoterDetailsForm.get('age').reset();
    this.promoterDetailsForm.get('genderId').reset();
    this.promoterDetailsForm.get('martialId').reset();
    this.promoterDetailsForm.get('mobileNumber').reset();
    this.promoterDetailsForm.get('aadharNumber').reset();
    this.promoterDetailsForm.get('emailId').reset();
    this.promoterDetailsForm.get('startDate').reset();
  }

  /**
   * @author jyothi.naidana
   * @implement get member admission Numbers list
   * @argument pacsId,branchId
   */
getAllTypeOfMembershipDetails(pacsId: any, branchId: any) {
  this.membershipServiceService.getAllTypeOfMemberDetailsListFromMemberModule(this.pacsId, this.branchId).subscribe((response: any) => {
    this.responseModel = response;
    if (this.responseModel != null && this.responseModel != undefined) {
      if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
        if (this.responseModel.data.length > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
          this.allTypesOfmembershipList = this.responseModel.data;
          this.admissionNumbersList = this.allTypesOfmembershipList.filter((obj: any) => (obj != null) && obj.memberTypeName == "Individual").map((relationType: { id: any; name: any; admissionNumber: any; memberTypeName: any }) => {
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

/**
   * @author jyothi.naidana
   * @implement get member module data by admission Number
   * @argument admissionNumber
   */
getMemberDetailsByAdmissionNUmber(admissionNumber: any) {
  this.membershipServiceService.getMembershipBasicDetailsByAdmissionNumber(admissionNumber).subscribe((data: any) => {
    this.responseModel = data;
    if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
      if (this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
        this.membershipBasicDetailsModel = this.responseModel.data[0];
       this.promoterDetailsModel.name  = this.membershipBasicDetailsModel.name,
       this.promoterDetailsModel.surname  = this.membershipBasicDetailsModel.surname;
       this.promoterDetailsModel.aadharNumber  = this.membershipBasicDetailsModel.aadharNumber;
       this.promoterDetailsModel.dob  = this.membershipBasicDetailsModel.dob;
       if(this.promoterDetailsModel.dob != null && this.promoterDetailsModel.dob != undefined)
        this.promoterDetailsModel.memDobVal = this.datePipe.transform(this.promoterDetailsModel.dob, this.orgnizationSetting.datePipe);
       this.promoterDetailsModel.age  = this.membershipBasicDetailsModel.age;
       this.promoterDetailsModel.genderId  = this.membershipBasicDetailsModel.genderId;
       this.promoterDetailsModel.martialId  = this.membershipBasicDetailsModel.martialId;
       this.promoterDetailsModel.mobileNumber  = this.membershipBasicDetailsModel.mobileNumber;
       this.promoterDetailsModel.emailId  = this.membershipBasicDetailsModel.emailId;
       this.promoterDetailsModel.startDate  = this.membershipBasicDetailsModel.admissionDate;
       if(this.promoterDetailsModel.startDate != null && this.promoterDetailsModel.startDate != undefined)
        this.promoterDetailsModel.startDateVal = this.datePipe.transform(this.promoterDetailsModel.startDate, this.orgnizationSetting.datePipe);
       this.promoterDetailsModel.operatorTypeId  = this.membershipBasicDetailsModel.occupationId;
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

/**
 * @implements onselect group leader
 * @param isGroup 
 * @author jyothi.naidana
 */
  onGroupLeaderSelect(isGroup:any) {
    if(isGroup){
      let isGroupLeadeExited = this.promoterDetails.filter((obj: any) => obj.isGroupLeader == true);
      if (isGroupLeadeExited != null && isGroupLeadeExited != undefined && isGroupLeadeExited.length >0) {
        this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: "One Group leader is Already Exist" }];
        setTimeout(() => {
          this.promoterDetailsForm.get('isGroupLeader').reset();
          this.msgs = [];
        }, 3000);
      }
    }
    else{
      let isGroupLeadeExited = this.institutionPromoter.filter((obj: any) => obj.isGroupLeader == true);
      if (isGroupLeadeExited != null && isGroupLeadeExited != undefined && isGroupLeadeExited.length >0) {
        this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: "One Group leader is Already Exist" }];
        setTimeout(() => {
          this.promoterDetailsForm.get('isGroupLeader').reset();
          this.msgs = [];
        }, 3000);
      }
    }
    
  }


  /**
   * @implements fileUpload for promoter in group
   * @param event 
   * @param fileUpload 
   * @param filePathName 
   */
  fileUploaderForPromoters(event: any, fileUpload: FileUpload, filePathName: any) {
    this.isFileUploaded = applicationConstants.FALSE;
    this.multipleFilesList = [];
    if(this.isEdit && this.promoterDetailsModel.filesDTOList == null || this.promoterDetailsModel.filesDTOList == undefined){
      this.promoterDetailsModel.filesDTOList = [];
    }
    let files: FileUploadModel = new FileUploadModel();
    for (let file of event.files) {
      let reader = new FileReader();
      reader.onloadend = (e) => {
        let timeStamp = this.commonComponent.getTimeStamp();
        let files = new FileUploadModel();
        this.uploadFileData = e.currentTarget;
        files.fileName = "Individual_Member_Photo_copy" + "_" + timeStamp + "_" + file.name;
        files.fileType = file.type.split('/')[1];
        files.value = this.uploadFileData.result.split(',')[1];
        files.imageValue = this.uploadFileData.result;
        this.multipleFilesList.push(files);
         
        if (filePathName === "groupPromoterImage") {
          this.promoterDetailsModel.filesDTOList.push(files);
          this.promoterDetailsModel.uploadImage = null;
          this.promoterDetailsModel.filesDTOList[this.promoterDetailsModel.filesDTOList.length - 1].fileName = "Group_Promoter_Photo_copy" + "_" + timeStamp + "_" + file.name;
          this.promoterDetailsModel.uploadImage = "Group_Promoter_Photo_copy" + "_" + timeStamp + "_" + file.name; // This will set the last file's name as docPath
        }
        if (filePathName === "groupPromoterSignature") {
          this.promoterDetailsModel.filesDTOList.push(files);
          this.promoterDetailsModel.uploadSignature = null;
          this.promoterDetailsModel.filesDTOList[this.promoterDetailsModel.filesDTOList.length - 1].fileName = "Group_Promoter_signed_copy" + "_" + timeStamp + "_" + file.name;
          this.promoterDetailsModel.uploadSignature = "Group_Promoter_signed_copy" + "_" + timeStamp + "_" + file.name; // This will set the last file's name as docPath
        }
        let index1 = event.files.findIndex((x: any) => x === file);
        fileUpload.remove(event, index1);
        fileUpload.clear();
        this.updateData();
      }
      reader.readAsDataURL(file);
    }
  }

  /**
   * @implements fileUpload for promoter in institution
   * @param event 
   * @param fileUpload 
   * @param filePathName 
   */
  fileUploaderForInstitutionPromoters(event: any, fileUpload: FileUpload, filePathName: any) {
    this.isFileUploaded = applicationConstants.FALSE;
    this.multipleFilesList = [];
    if(this.isEdit && this.institutionPromoterDetailsModel.filesDTOList == null || this.institutionPromoterDetailsModel.filesDTOList == undefined){
      this.institutionPromoterDetailsModel.filesDTOList = [];
    }
    let files: FileUploadModel = new FileUploadModel();
    for (let file of event.files) {
      let reader = new FileReader();
      reader.onloadend = (e) => {
        let timeStamp = this.commonComponent.getTimeStamp();
        let files = new FileUploadModel();
        this.uploadFileData = e.currentTarget;
        files.fileName = "Institution_Photo_copy" + "_" + timeStamp + "_" + file.name;
        files.fileType = file.type.split('/')[1];
        files.value = this.uploadFileData.result.split(',')[1];
        files.imageValue = this.uploadFileData.result;
        this.multipleFilesList.push(files);
         
        if (filePathName === "institutionPromoterImage") {
          this.institutionPromoterDetailsModel.filesDTOList.push(files);
          this.institutionPromoterDetailsModel.uploadImage = null;
          this.institutionPromoterDetailsModel.filesDTOList[this.institutionPromoterDetailsModel.filesDTOList.length - 1].fileName = "Institution_Promoter_Photo_copy" + "_" + timeStamp + "_" + file.name;
          this.institutionPromoterDetailsModel.uploadImage = "Institution_Promoter_Photo_copy" + "_" + timeStamp + "_" + file.name; // This will set the last file's name as docPath
        }
        if (filePathName === "insitutionPromoterSignature") {
          this.institutionPromoterDetailsModel.filesDTOList.push(files);
          this.institutionPromoterDetailsModel.uploadSignature = null;
          this.institutionPromoterDetailsModel.filesDTOList[this.institutionPromoterDetailsModel.filesDTOList.length - 1].fileName = "Institution_Promoter_signed_copy" + "_" + timeStamp + "_" + file.name;
          this.institutionPromoterDetailsModel.uploadSignature = "Institution_Promoter_signed_copy" + "_" + timeStamp + "_" + file.name; // This will set the last file's name as docPath
        }
        let index1 = event.files.findIndex((x: any) => x === file);
        fileUpload.remove(event, index1);
        fileUpload.clear();
        this.updateData();
      }
      reader.readAsDataURL(file);
    }
  }

}
