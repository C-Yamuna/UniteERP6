import { Component, ViewChild } from '@angular/core';
import { Table } from 'primeng/table';
import { Responsemodel } from 'src/app/shared/responsemodel';
import { InstitutionPromoterDetailsModel, MemberGroupDetailsModel, MembershipBasicRequiredDetails, MembershipInstitutionDetailsModel, promoterDetailsModel } from './shared/term-loan-new-membership.model';
import { TermLoanKyc } from '../term-loans-kyc/shared/term-loan-kyc.model';
import { TermApplication } from '../term-loan-application-details/shared/term-application.model';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonComponent } from 'src/app/shared/common.component';
import { CommonFunctionsService } from 'src/app/shared/commonfunction.service';
import { TermLoanNewMembershipService } from './shared/term-loan-new-membership.service';
import { DatePipe } from '@angular/common';
import { EncryptDecryptService } from 'src/app/shared/encrypt-decrypt.service';
import { TermLoanCommunicationService } from '../term-loans-communication/shared/term-loan-communication.service';
import { TermApplicationService } from '../term-loan-application-details/shared/term-application.service';
import { applicationConstants } from 'src/app/shared/applicationConstants';
import { TermLoanCommunication } from '../term-loans-communication/shared/term-loan-communication.model';
import { ERP_TRANSACTION_CONSTANTS } from 'src/app/transcations/erp-transaction-constants';
import { FileUploadService } from 'src/app/shared/file-upload.service';
import { FileUpload } from 'primeng/fileupload';
import { FileUploadModel } from 'src/app/layout/mainmenu/shared/file-upload-model.model';

@Component({
  selector: 'app-term-loan-new-membership',
  templateUrl: './term-loan-new-membership.component.html',
  styleUrls: ['./term-loan-new-membership.component.css']
})
export class TermLoanNewMembershipComponent {
  memberCreationForm: FormGroup;
  groupForm: FormGroup;
  institutionForm: FormGroup;
  applicationList: any[] = [];
  accountList: any[] = [];
  genderList: any[] = [];
  maritalstatusList: any[] = [];
  membershipBasicRequiredDetailsModel: MembershipBasicRequiredDetails = new MembershipBasicRequiredDetails();
  memberGroupDetailsModel: MemberGroupDetailsModel = new MemberGroupDetailsModel();
  membershipInstitutionDetailsModel: MembershipInstitutionDetailsModel = new MembershipInstitutionDetailsModel();
  termLoanKycModel: TermLoanKyc = new TermLoanKyc();
  promoterDetailsModel: promoterDetailsModel = new promoterDetailsModel();
  institutionPromoterDetailsModel: InstitutionPromoterDetailsModel = new InstitutionPromoterDetailsModel();
  termLoanApplicationModel: TermApplication = new TermApplication();
  termLoanCommunicationModel: TermLoanCommunication = new TermLoanCommunication();
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
  age: any;
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
  groupPrmotersList: any[] = [];
  memberTypeId: any;

  @ViewChild('dt', { static: false }) private dt!: Table;
  @ViewChild('cv', { static: false }) private cv!: Table;

  msgs: any[] = [];
  operatorTypeList: any[] = [];
  admisionNumber: any;
  communicationForm: any;
  pacsId: any;
  branchId: any;
  allTypesOfmembershipList: any;
  permenentAllTypesOfmembershipList: any;
  termLoanApplicationId: any;
  multipleFilesList: any;
  uploadFileData: any;
  isFileUploaded: any;;

  cancleButtonFlag : Boolean = true;

  constructor(private router: Router, private formBuilder: FormBuilder,
    private commonComponent: CommonComponent, private activateRoute: ActivatedRoute, private encryptDecryptService: EncryptDecryptService,
    private commonFunctionsService: CommonFunctionsService, private datePipe: DatePipe, private termLoanCommunicationService: TermLoanCommunicationService,
    private termLoanApplicationsService: TermApplicationService,
    private membershipService: TermLoanNewMembershipService, private fileUploadService :FileUploadService) {

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
        // pocNumber: ['', Validators.required],
        mobileNumber: ['', [Validators.pattern(applicationConstants.MOBILE_PATTERN), Validators.compose([Validators.required])]],
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
        operatorTypeId: ['', Validators.required],
        dob: ['', Validators.required],
        age: ['', [Validators.pattern(applicationConstants.ALLOW_NUMBERS), Validators.compose([Validators.required])]],
        genderId: ['', Validators.required],
        martialId: ['', Validators.required],
        mobileNumber: ['', [Validators.pattern(applicationConstants.MOBILE_PATTERN), Validators.compose([Validators.required])]],
        aadharNumber: ['', [Validators.pattern(applicationConstants.AADHAR_PATTERN), Validators.compose([Validators.required])]],
        emailId: ['', [Validators.pattern(applicationConstants.EMAIL_PATTERN), Validators.compose([Validators.required])]],
        startDate: ['', Validators.required],
      })
    }
  
    ngOnInit(): void {
      this.membershipBasicRequiredDetailsModel.filesDTOList = [];
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
          this.termLoanApplicationId = this.encryptDecryptService.decrypt(params['id']);
          this.getTermApplicationByTermAccId(this.termLoanApplicationId);
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
    getTermApplicationByTermAccId(id: any) {
      this.termLoanApplicationsService.getTermApplicationByTermAccId(id).subscribe((data: any) => {
        this.responseModel = data;
        if (this.responseModel != null && this.responseModel != undefined) {
          if (this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
            if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
              if (this.responseModel.data.length > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
                this.termLoanApplicationModel = this.responseModel.data[0];
  
                this.admisionNumber = this.termLoanApplicationModel.admissionNo;
                this.memberTypeId = this.termLoanApplicationModel.memberTypeId;
                this.memberTypeName = this.termLoanApplicationModel.memberTypeName;
                this.age = this.termLoanApplicationModel.individualMemberDetailsDTO.age;
  
                if (this.termLoanApplicationModel.individualMemberDetailsDTO != null && this.termLoanApplicationModel.individualMemberDetailsDTO != undefined) {
                  this.membershipBasicRequiredDetailsModel = this.termLoanApplicationModel.individualMemberDetailsDTO;
  
                  if (this.membershipBasicRequiredDetailsModel.dob != null && this.membershipBasicRequiredDetailsModel.dob != undefined)
                    this.membershipBasicRequiredDetailsModel.dobVal = this.datePipe.transform(this.membershipBasicRequiredDetailsModel.dob, this.orgnizationSetting.datePipe);
  
                  if (this.membershipBasicRequiredDetailsModel.admissionDate != null && this.membershipBasicRequiredDetailsModel.admissionDate != undefined)
                    this.membershipBasicRequiredDetailsModel.admissionDateVal = this.datePipe.transform(this.membershipBasicRequiredDetailsModel.admissionDate, this.orgnizationSetting.datePipe);
  
                  if (this.membershipBasicRequiredDetailsModel.photoCopyPath != null && this.membershipBasicRequiredDetailsModel.photoCopyPath != undefined) {
                    this.membershipBasicRequiredDetailsModel.multipartFileListForPhotoCopy = this.fileUploadService.getFile(this.membershipBasicRequiredDetailsModel.photoCopyPath, ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.membershipBasicRequiredDetailsModel.photoCopyPath);
                  }
                  if (this.membershipBasicRequiredDetailsModel.signatureCopyPath != null && this.membershipBasicRequiredDetailsModel.signatureCopyPath != undefined) {
                    this.membershipBasicRequiredDetailsModel.multipartFileListForsignatureCopyPath = this.fileUploadService.getFile(this.membershipBasicRequiredDetailsModel.signatureCopyPath, ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.membershipBasicRequiredDetailsModel.signatureCopyPath);
                  }
  
                  this.individualFlag = true;
                  this.groupFlag = false;
                  this.institutionFlag = false;
                  this.showForm = this.membershipBasicRequiredDetailsModel.isNewMember;
                  this.admisionNumber = this.termLoanApplicationModel.admissionNo;
                }
                if (this.termLoanApplicationModel.memberGroupDetailsDTO != null && this.termLoanApplicationModel.memberGroupDetailsDTO != undefined) {
                  this.memberGroupDetailsModel = this.termLoanApplicationModel.memberGroupDetailsDTO;
  
                  if (this.memberGroupDetailsModel.registrationDate != null && this.memberGroupDetailsModel.registrationDate != undefined)
                    this.memberGroupDetailsModel.registrationDateVal = this.datePipe.transform(this.memberGroupDetailsModel.registrationDate, this.orgnizationSetting.datePipe);
  
                  if (this.memberGroupDetailsModel.admissionDate != null && this.memberGroupDetailsModel.admissionDate != undefined)
                    this.memberGroupDetailsModel.admissionDateVal = this.datePipe.transform(this.memberGroupDetailsModel.admissionDate, this.orgnizationSetting.datePipe);
  
                  this.individualFlag = false;
                  this.groupFlag = true;
                  this.institutionFlag = false;
                  this.showForm = this.memberGroupDetailsModel.isNewMember;
                  this.admisionNumber = this.termLoanApplicationModel.admissionNo;
                }
                if (this.termLoanApplicationModel.memberInstitutionDTO != null && this.termLoanApplicationModel.memberInstitutionDTO != undefined) {
                  this.membershipInstitutionDetailsModel = this.termLoanApplicationModel.memberInstitutionDTO;
  
                  if (this.membershipInstitutionDetailsModel.registrationDate != null && this.membershipInstitutionDetailsModel.registrationDate != undefined)
                    this.membershipInstitutionDetailsModel.registrationDateVal = this.datePipe.transform(this.membershipInstitutionDetailsModel.registrationDate, this.orgnizationSetting.datePipe);
  
                  if (this.membershipInstitutionDetailsModel.admissionDate != null && this.membershipInstitutionDetailsModel.admissionDate != undefined)
                    this.membershipInstitutionDetailsModel.admissionDateVal = this.datePipe.transform(this.membershipInstitutionDetailsModel.admissionDate, this.orgnizationSetting.datePipe);
  
                  this.individualFlag = false;
                  this.groupFlag = false;
                  this.institutionFlag = true;
                  this.showForm = this.membershipInstitutionDetailsModel.isNewMember;
                  this.admisionNumber = this.termLoanApplicationModel.admissionNo;
                }
              this.updateData();
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
      this.termLoanApplicationModel.memberTypeId = this.memberTypeId;
      if (this.memberTypeName == "Individual") {
        this.individualFlag = true;
        this.isDisableFlag = (!this.memberCreationForm.valid)
        this.termLoanApplicationModel.memberTypeName = this.memberTypeName;
        this.membershipBasicRequiredDetailsModel.memberTypeName = this.memberTypeName;
        this.membershipBasicRequiredDetailsModel.isNewMember = this.showForm;
        this.termLoanApplicationModel.individualMemberDetailsDTO = this.membershipBasicRequiredDetailsModel;
      }
      if (this.memberTypeName == "Group") {
        this.groupFlag = true;
      this.isDisableFlag = (!this.groupForm.valid)
        this.memberGroupDetailsModel.memberTypeId = this.memberTypeId;
        this.memberGroupDetailsModel.memberTypeName = this.memberTypeName;
        this.memberGroupDetailsModel.isNewMember = this.showForm;
        this.termLoanApplicationModel.memberGroupDetailsDTO = this.memberGroupDetailsModel;
        this.termLoanApplicationModel.memberTypeName = this.memberTypeName;
        this.termLoanApplicationModel.memberGroupDetailsDTO = this.memberGroupDetailsModel;
      }
      if (this.memberTypeName == "Institution") {
        this.institutionFlag = true;
        this.isDisableFlag = (!this.institutionForm.valid)
        this.membershipInstitutionDetailsModel.memberTypeId = this.memberTypeId;
        this.membershipInstitutionDetailsModel.memberTypeName = this.memberTypeName;
        this.membershipInstitutionDetailsModel.isNewMember = this.showForm;
        this.termLoanApplicationModel.memberTypeName = this.memberTypeName;
        this.termLoanApplicationModel.memberInstitutionDTO = this.membershipInstitutionDetailsModel;
    }
      this.termLoanApplicationsService.changeData({
      formValid: this.memberCreationForm.valid ? true : false || this.institutionForm.valid ? true : false || this.memberCreationForm.valid ? true : false,
        data: this.termLoanApplicationModel,
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
      this.membershipBasicRequiredDetailsModel.relationName = filteredItem.label;
    }
    //for relation Types
    getAllRelationTypes() {
      this.termLoanApplicationsService.getAllRelationTypes().subscribe((res: any) => {
        this.responseModel = res;
        if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
          this.relationTypesList = this.responseModel.data;
        this.relationTypesList = this.relationTypesList.filter((obj: any) => obj.status == applicationConstants.ACTIVE).map((relationType: { name: any; id: any; }) => {
            return { label: relationType.name, value: relationType.id };
          });
        }
      });
    }
    //Occupations List
    getAllOccupationTypes() {
    this.termLoanApplicationsService.getAllOccupationTypes().subscribe((res: any) => {
        this.responseModel = res;
        if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
          this.occupationTypeList = this.responseModel.data;
        this.occupationTypeList = this.occupationTypeList.filter((obj: any) => obj.status == applicationConstants.ACTIVE).map((relationType: { name: any; id: any; }) => {
            return { label: relationType.name, value: relationType.id };
          });
        }
      });
    }
    //qualifications List
    getAllQualificationType() {
      this.termLoanApplicationsService.getQualificationTypes().subscribe((res: any) => {
        this.responseModel = res;
        if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
          this.qualificationTypes = this.responseModel.data;
        this.qualificationTypes = this.qualificationTypes.filter((obj: any) => obj.status == applicationConstants.ACTIVE).map((relationType: { name: any; id: any; }) => {
            return { label: relationType.name, value: relationType.id };
          });
        }
      });
    }
  
    //castes List
    getCastesList() {
      this.termLoanApplicationsService.getCastes().subscribe((res: any) => {
        this.responseModel = res;
        if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
          this.castesList = this.responseModel.data;
        this.castesList = this.castesList.filter((obj: any) => obj.status == applicationConstants.ACTIVE).map((relationType: { name: any; id: any; }) => {
            return { label: relationType.name, value: relationType.id };
          });
        }
      });
    }
  
   
    //get member individual details
    getMemberDetailsByAdmissionNumber(admisionNumber: any) {
      this.termLoanApplicationsService.getMemberByAdmissionNumber(admisionNumber).subscribe((response: any) => {
        this.responseModel = response;
        if (this.responseModel != null && this.responseModel != undefined) {
         this.memberTypeList.filter((village: any) => village != null && village.value == this.membershipBasicRequiredDetailsModel.memberTypeId).map((act: { label: any; }) => {
    this.membershipBasicRequiredDetailsModel.memberTypeName = act.label;
  });
          if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
            if (this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
              this.membershipBasicRequiredDetailsModel = this.responseModel.data[0];
              if (this.membershipBasicRequiredDetailsModel.dob != null && this.membershipBasicRequiredDetailsModel.dob != undefined) {
                this.membershipBasicRequiredDetailsModel.dobVal = this.datePipe.transform(this.membershipBasicRequiredDetailsModel.dob, this.orgnizationSetting.datePipe);
              }
              if (this.membershipBasicRequiredDetailsModel.admissionDate != null && this.membershipBasicRequiredDetailsModel.admissionDate != undefined) {
                this.membershipBasicRequiredDetailsModel.admissionDateVal = this.datePipe.transform(this.membershipBasicRequiredDetailsModel.admissionDate, this.orgnizationSetting.datePipe);
              }
              if(this.membershipBasicRequiredDetailsModel.memberTypeId != undefined && this.membershipBasicRequiredDetailsModel.memberTypeId){
                this.memberTypeId = this.membershipBasicRequiredDetailsModel.memberTypeId;
              }
              if (this.membershipBasicRequiredDetailsModel.photoCopyPath != null && this.membershipBasicRequiredDetailsModel.photoCopyPath != undefined) {
                this.membershipBasicRequiredDetailsModel.multipartFileListForPhotoCopy = this.fileUploadService.getFile(this.membershipBasicRequiredDetailsModel.photoCopyPath ,ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.membershipBasicRequiredDetailsModel.photoCopyPath  );
              }
              if (this.membershipBasicRequiredDetailsModel.signatureCopyPath != null && this.membershipBasicRequiredDetailsModel.signatureCopyPath != undefined) {
                this.membershipBasicRequiredDetailsModel.multipartFileListForsignatureCopyPath = this.fileUploadService.getFile(this.membershipBasicRequiredDetailsModel.signatureCopyPath ,ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.membershipBasicRequiredDetailsModel.signatureCopyPath  );
              }
              this.termLoanApplicationModel.individualMemberDetailsDTO = this.membershipBasicRequiredDetailsModel;
              this.termLoanApplicationModel.memberTypeName = this.membershipBasicRequiredDetailsModel.memberTypeName;
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
      this.termLoanApplicationsService.getGroupByAdmissionNumber(admissionNumber).subscribe((response: any) => {
        this.responseModel = response;
        if (this.responseModel != null && this.responseModel != undefined) {
          if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
            if (this.responseModel.data.length > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
              this.memberGroupDetailsModel = this.responseModel.data[0];
              if (this.memberGroupDetailsModel.registrationDate != null && this.memberGroupDetailsModel.registrationDate != undefined) {
                this.memberGroupDetailsModel.registrationDateVal = this.datePipe.transform(this.memberGroupDetailsModel.registrationDateVal, this.orgnizationSetting.datePipe);
              }
              if (this.memberGroupDetailsModel.admissionDate != null && this.memberGroupDetailsModel.admissionDate != undefined) {
                this.memberGroupDetailsModel.admissionDateVal = this.datePipe.transform(this.memberGroupDetailsModel.admissionDate, this.orgnizationSetting.datePipe);
              }
              if (this.memberGroupDetailsModel.memberTypeId != null && this.memberGroupDetailsModel.memberTypeId != undefined) {
                this.memberTypeId = this.memberGroupDetailsModel.memberTypeId;
              }
              if (this.memberGroupDetailsModel.groupPromoterList != null && this.memberGroupDetailsModel.groupPromoterList != undefined) {
                this.groupPrmotersList = this.memberGroupDetailsModel.groupPromoterList;
                
              }
            if (this.memberGroupDetailsModel.groupPromoterList != null && this.memberGroupDetailsModel.groupPromoterList != undefined && this.memberGroupDetailsModel.groupPromoterList.length > 0) {
              this.groupPrmotersList = this.memberGroupDetailsModel.groupPromoterList.map((member: any) => {
                if(member != null && member != undefined){
                  if(member.dob != null && member.dob != undefined){
                    member.memDobVal = this.datePipe.transform(member.dob, this.orgnizationSetting.datePipe);
                    }
                  if(member.startDate != null && member.startDate != undefined){
                    member.startDateVal = this.datePipe.transform(member.startDate, this.orgnizationSetting.datePipe);
                    }
                    if(member.genderId != null && member.genderId != undefined){
                      let Obj = this.genderList.filter(obj => obj.value == member.genderId);
                      if(Obj != null && Obj != undefined ){
                        member.genderName = Obj[0].label ;
                      }
                    }
                    if(member.martialId != null && member.martialId != undefined){
                      let Obj = this.maritalStatusList.filter(obj => obj.value == member.martialId);
                      if(Obj != null && Obj != undefined ){
                        member.maritalStatusName = Obj[0].label ;
                      }
                    }
                    if(member.operatorTypeId != null && member.operatorTypeId != undefined){
                      let Obj = this.operatorTypeList.filter(obj => obj.value == member.operatorTypeId);
                      if(Obj != null && Obj != undefined ){
                        member.operatorTypeName = Obj[0].label ;
                      }
                    }
                }
                return member;
              });
                if(this.memberGroupDetailsModel.memberTypeName != null && this.memberGroupDetailsModel.memberTypeName != undefined){
                  this.termLoanApplicationModel.memberTypeName = this.memberGroupDetailsModel.memberTypeName;
                }
                if(this.memberGroupDetailsModel != null && this.memberGroupDetailsModel != undefined){
                this.termLoanApplicationModel.memberGroupDetailsDTO = this.memberGroupDetailsModel;
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
      this.termLoanApplicationsService.getInstitutionDetails(admissionNumber).subscribe((response: any) => {
        this.responseModel = response;
        if (this.responseModel != null && this.responseModel != undefined) {
          if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
            if (this.responseModel.data.length > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
              this.membershipInstitutionDetailsModel = this.responseModel.data[0];
  
              if (this.membershipInstitutionDetailsModel.registrationDate != null && this.membershipInstitutionDetailsModel.registrationDate != undefined) {
              this.membershipInstitutionDetailsModel.registrationDateVal = this.datePipe.transform(this.membershipInstitutionDetailsModel.registrationDateVal, this.orgnizationSetting.datePipe);
              }
              if (this.membershipInstitutionDetailsModel.admissionDate != null && this.membershipInstitutionDetailsModel.admissionDate != undefined) {
                this.membershipInstitutionDetailsModel.admissionDateVal = this.datePipe.transform(this.membershipInstitutionDetailsModel.admissionDate, this.orgnizationSetting.datePipe);
              }
              if(this.membershipInstitutionDetailsModel.memberTypeId != null && this.membershipInstitutionDetailsModel.memberTypeId != undefined){
                this.memberTypeId = this.memberTypeId;
              }
            if (this.membershipInstitutionDetailsModel.institutionPromoterList != null && this.membershipInstitutionDetailsModel.institutionPromoterList != undefined) {
              this.institutionPromoter = this.membershipInstitutionDetailsModel.institutionPromoterList;
              
            }

            if (this.membershipInstitutionDetailsModel.institutionPromoterList != null && this.membershipInstitutionDetailsModel.institutionPromoterList != undefined && this.membershipInstitutionDetailsModel.institutionPromoterList.length > 0) {
              this.institutionPromoter = this.membershipInstitutionDetailsModel.institutionPromoterList.map((member: any) => {
                if(member != null && member != undefined){
                  if(member.dob != null && member.dob != undefined){
                    member.memDobVal = this.datePipe.transform(member.dob, this.orgnizationSetting.datePipe);
                    }
                  if(member.startDate != null && member.startDate != undefined){
                    member.startDateVal = this.datePipe.transform(member.startDate, this.orgnizationSetting.datePipe);
                    }
                    if(member.genderId != null && member.genderId != undefined){
                      let Obj = this.genderList.filter(obj => obj.value == member.genderId);
                      if(Obj != null && Obj != undefined ){
                        member.genderName = Obj[0].label ;
                      }
                    }
                    if(member.martialId != null && member.martialId != undefined){
                      let Obj = this.maritalStatusList.filter(obj => obj.value == member.martialId);
                      if(Obj != null && Obj != undefined ){
                        member.maritalStatusName = Obj[0].label ;
                      }
                    }
                    if(member.operatorTypeId != null && member.operatorTypeId != undefined){
                      let Obj = this.operatorTypeList.filter(obj => obj.value == member.operatorTypeId);
                      if(Obj != null && Obj != undefined ){
                        member.operatorTypeName = Obj[0].label ;
                      }
                    }
                }
                return member;
              });
                if(this.memberGroupDetailsModel.memberTypeName != null && this.memberGroupDetailsModel.memberTypeName != undefined){
                  this.termLoanApplicationModel.memberTypeName = this.memberGroupDetailsModel.memberTypeName;
                }
                if(this.memberGroupDetailsModel != null && this.memberGroupDetailsModel != undefined){
                this.termLoanApplicationModel.memberGroupDetailsDTO = this.memberGroupDetailsModel;
                }
            }
              this.termLoanApplicationModel.memberTypeName = this.membershipInstitutionDetailsModel.memberTypeName;
              this.termLoanApplicationModel.memberInstitutionDTO = this.membershipInstitutionDetailsModel;
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
        this.membershipBasicRequiredDetailsModel.memberTypeId = 1;
      }
      else if (event.value == 2) {
        this.addButton = false;
        this.EditDeleteDisable = false;
        this.groupFlag = true;
        this.individualFlag = false;
        this.institutionFlag = false;
        this.memberGroupDetailsModel.memberTypeId = 2;
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
  
  
    //save Promoters oF Group 
    savePromoterDetails(rowData: any) {
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
      let Object = this.operatorTypeList.find((obj:any)=>obj.value == rowData.operatorTypeId);
      if(Object != null && Object != undefined && Object.label != null && Object.label != undefined) {
        rowData.operatorTypeName = Object.label;
      }
      let gebnder = this.genderList.find((obj:any)=>obj.value == rowData.genderId);
      if(gebnder != null && gebnder != undefined && gebnder.label != null && gebnder.label != undefined) {
        rowData.genderName = gebnder.label;
      }
      let maritalstatus = this.operatorTypeList.find((obj:any)=>obj.value == rowData.martialId);
      if(maritalstatus != null && maritalstatus != undefined && maritalstatus.label != null && maritalstatus.label != undefined) {
        rowData.maritalStatusName = maritalstatus.label;
      }
      if (rowData.startDate != null && rowData.startDate != undefined) {
        rowData.startDateVal  = this.datePipe.transform(rowData.startDate, this.orgnizationSetting.datePipe);
      }
    if (!this.memberGroupDetailsModel.groupPromoterList) {
      this.memberGroupDetailsModel.groupPromoterList = []; // Initialize it as an empty array
      }
      if(this.groupPrmotersList != null && this.groupPrmotersList != undefined && this.groupPrmotersList.length > 0 ){
        const kyc = this.groupPrmotersList.findIndex((obj:any) => (obj != null && obj != undefined ) && obj.uniqueId === rowData.uniqueId );
        this.groupPrmotersList[kyc] = null;
        this.groupPrmotersList[kyc] = rowData;
        this.memberGroupDetailsModel.groupPromoterList = this.groupPrmotersList;
      }
      this.updateData();
    }
  
    //inline cancle Promoters oF Group 
  cancelPromoter() {
      this.addButton = false;
      this.EditDeleteDisable = false;
    }
    //inline add new entry for group promoter
    addNewEntry() {
      this.newRow = { uniqueId: this.groupPrmotersList.length + 1, surname: '', name: '', operatorTypeId: '', dob: '', age: '', genderId: '', martialId: '', mobileNumber: '', emailId: '', aadharNumber: '', startDate: '' }
  
    }
    //inline edit for group promoter
    editPromoter(row: any) {
      this.addButton = true;
      this.EditDeleteDisable = true;
    }
  
    //inline edit for group promoter
    onRowEditSave() {
    this.promoterDetailsModel = new promoterDetailsModel();
    this.addNewEntry();
      this.EditDeleteDisable = true;
      this.addButton = true;
      this.dt._first = 0;
    this.dt.value.unshift(this.newRow);
      this.dt.initRowEdit(this.dt.value[0]);
  
    }
    //inline edit for operator details
    getAllOperatorTypes() {
      this.commonComponent.startSpinner();
      this.termLoanApplicationsService.getAllOperationTypes().subscribe((res: any) => {
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
            this.promoterDetailsModel.operatorTypeName = relation.label;
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

    saveInstitutionPromoterDetails(rowData: any) {
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
      let Object = this.operatorTypeList.find((obj:any)=>obj.value == rowData.operatorTypeId);
      if(Object != null && Object != undefined && Object.label != null && Object.label != undefined) {
        rowData.operatorTypeName = Object.label;
      }
      let gebnder = this.genderList.find((obj:any)=>obj.value == rowData.genderId);
      if(gebnder != null && gebnder != undefined && gebnder.label != null && gebnder.label != undefined) {
        rowData.genderName = gebnder.label;
      }
      let maritalstatus = this.operatorTypeList.find((obj:any)=>obj.value == rowData.martialId);
      if(maritalstatus != null && maritalstatus != undefined && maritalstatus.label != null && maritalstatus.label != undefined) {
        rowData.maritalStatusName = maritalstatus.label;
      }
      if (rowData.startDate != null && rowData.startDate != undefined) {
        rowData.startDateVal  = this.datePipe.transform(rowData.startDate, this.orgnizationSetting.datePipe);
      }
    if (!this.membershipInstitutionDetailsModel.institutionPromoterList) {
      this.membershipInstitutionDetailsModel.institutionPromoterList = []; // Initialize it as an empty array
      }
      if(this.institutionPromoter != null && this.institutionPromoter != undefined && this.institutionPromoter.length > 0 ){
        const kyc = this.institutionPromoter.findIndex((obj:any) => (obj != null && obj != undefined ) && obj.uniqueId === rowData.uniqueId );
        this.institutionPromoter[kyc] = null;
        this.institutionPromoter[kyc] = rowData;
        this.membershipInstitutionDetailsModel.institutionPromoterList = this.institutionPromoter;
      }
      this.updateData();
    }
  
    //inline cancle for institution promoters details
  cancelInstitutionPromoter() {
      this.addButton = false;
      this.EditDeleteDisable = false;
    }
    //inline add new row for institution promoters details
   
    addForInstitutionNewEntry() {
      this.newRow = { uniqueId: this.institutionPromoter.length + 1, surname: '', name: '', operatorTypeId: '', dob: '', age: '', genderId: '', martialId: '', mobileNumber: '', emailId: '', aadharNumber: '', startDate: '' }
    }
  
    //inline edit new row for institution promoters details
   
    editInstitutionPromoter(row: any) {
      this.cancleButtonFlag = false;
      this.addButton = true;
      this.EditDeleteDisable = true;

    }
    //inline add new row for institution promoters details
    onRowAddInstitution() {
      this.institutionPromoterDetailsModel = new InstitutionPromoterDetailsModel();
    this.addForInstitutionNewEntry();
      this.EditDeleteDisable = true;
      this.addButton = true;
    this.dt._first = 0;
    this.dt.value.unshift(this.newRow);
    this.dt.initRowEdit(this.dt.value[0]);
    }
  
    getAllMemberType() {
      this.membershipService.getAllMemberTypes().subscribe((data: any) => {
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
  
    membershipDataFromFdModule() {
      if (this.memberTypeName == "Individual") {
        this.individualFlag = true;
        this.getMemberDetailsByAdmissionNumber(this.admisionNumber);
      } else if (this.memberTypeName == "Group") {
        this.groupFlag = true;
        this.getGroupByAdmissionNumber(this.admisionNumber);
      } else if (this.memberTypeName == "Institution") {
        this.institutionFlag = true;
        this.getInstitutionByAdmissionNumber(this.admisionNumber);
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
    
    
      if(this.isEdit && this.membershipBasicRequiredDetailsModel.filesDTOList == null || this.membershipBasicRequiredDetailsModel.filesDTOList == undefined){
        this.membershipBasicRequiredDetailsModel.filesDTOList = [];
      
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
            this.membershipBasicRequiredDetailsModel.filesDTOList.push(files);
            this.membershipBasicRequiredDetailsModel.photoCopyPath = null;
            this.membershipBasicRequiredDetailsModel.multipartFileListForPhotoCopy = [];
            this.membershipBasicRequiredDetailsModel.filesDTOList[this.membershipBasicRequiredDetailsModel.filesDTOList.length - 1].fileName = "Individual_Member_Photo_copy" + "_" + timeStamp + "_" + file.name;
            this.membershipBasicRequiredDetailsModel.photoCopyPath = "Individual_Member_Photo_copy" + "_" + timeStamp + "_" + file.name; // This will set the last file's name as docPath
          }
          if (filePathName === "individualSighnedCopy") {
            this.membershipBasicRequiredDetailsModel.filesDTOList.push(files);
            this.membershipBasicRequiredDetailsModel.multipartFileListForsignatureCopyPath = [];
            this.membershipBasicRequiredDetailsModel.signatureCopyPath = null;
            this.membershipBasicRequiredDetailsModel.filesDTOList[this.membershipBasicRequiredDetailsModel.filesDTOList.length - 1].fileName = "Individual_Member_signed_copy" + "_" + timeStamp + "_" + file.name;
            this.membershipBasicRequiredDetailsModel.signatureCopyPath = "Individual_Member_signed_copy" + "_" + timeStamp + "_" + file.name; // This will set the last file's name as docPath
          }
          if (filePathName === "groupPhotoCopy") {
            this.memberGroupDetailsModel.filesDTOList.push(files);
            this.memberGroupDetailsModel.photoCopyPath = null;
            this.memberGroupDetailsModel.filesDTOList[this.memberGroupDetailsModel.filesDTOList.length - 1].fileName = "Group_Member_Photo_copy" + "_" + timeStamp + "_" + file.name;
            this.memberGroupDetailsModel.photoCopyPath = "Group_Member_Photo_copy" + "_" + timeStamp + "_" + file.name; // This will set the last file's name as docPath
          }
          if (filePathName === "groupSignatureCopy") {
            this.memberGroupDetailsModel.filesDTOList.push(files);
            this.memberGroupDetailsModel.signatureCopyPath = null;
            this.memberGroupDetailsModel.filesDTOList[this.memberGroupDetailsModel.filesDTOList.length - 1].fileName = "Group_Member_signed_copy" + "_" + timeStamp + "_" + file.name;
            this.memberGroupDetailsModel.signatureCopyPath = "Group_Member_signed_copy" + "_" + timeStamp + "_" + file.name; // This will set the last file's name as docPath
          }
          if (filePathName === "intistutionPhotoCopy") {
            this.membershipInstitutionDetailsModel.filesDTOList.push(files);
            this.membershipInstitutionDetailsModel.photoCopyPath = null;
            this.membershipInstitutionDetailsModel.filesDTOList[this.membershipInstitutionDetailsModel.filesDTOList.length - 1].fileName = "Institution_Member_Photo_copy" + "_" + timeStamp + "_" + file.name;
            this.membershipInstitutionDetailsModel.photoCopyPath = "Institution_Member_Photo_copy" + "_" + timeStamp + "_" + file.name; // This will set the last file's name as docPath
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
        if (this.membershipBasicRequiredDetailsModel.filesDTOList != null && this.membershipBasicRequiredDetailsModel.filesDTOList != undefined && this.membershipBasicRequiredDetailsModel.filesDTOList.length > 0) {
          if (fileName == "individualPhotoCopy") {
          let removeFileIndex = this.membershipBasicRequiredDetailsModel.filesDTOList.findIndex((obj: any) => obj && obj.fileName === this.membershipBasicRequiredDetailsModel.photoCopyPath);
          let obj = this.membershipBasicRequiredDetailsModel.filesDTOList.find((obj: any) => obj && obj.fileName === this.membershipBasicRequiredDetailsModel.photoCopyPath);
          this.membershipBasicRequiredDetailsModel.filesDTOList.splice(removeFileIndex, 1);
          this.membershipBasicRequiredDetailsModel.photoCopyPath = null;
        }
        if (fileName == "individualSighnedCopy") {
          let removeFileIndex = this.membershipBasicRequiredDetailsModel.filesDTOList.findIndex((obj: any) => obj && obj.fileName === this.membershipBasicRequiredDetailsModel.signatureCopyPath);
          let obj = this.membershipBasicRequiredDetailsModel.filesDTOList.find((obj: any) => obj && obj.fileName === this.membershipBasicRequiredDetailsModel.signatureCopyPath);
          this.membershipBasicRequiredDetailsModel.filesDTOList.splice(removeFileIndex, 1);
          this.membershipBasicRequiredDetailsModel.signatureCopyPath = null;
        }
      }
    }
  
    dateConverstion() {
      if (this.memberGroupDetailsModel != null && this.memberGroupDetailsModel != undefined) {
        if (this.memberGroupDetailsModel.admissionDateVal != null && this.memberGroupDetailsModel.admissionDateVal != undefined) {
          this.memberGroupDetailsModel.admissionDate = this.commonFunctionsService.getUTCEpoch(new Date(this.memberGroupDetailsModel.admissionDateVal));
        }
        if (this.memberGroupDetailsModel.registrationDateVal != null && this.memberGroupDetailsModel.registrationDateVal != undefined) {
          this.memberGroupDetailsModel.registrationDate = this.commonFunctionsService.getUTCEpoch(new Date(this.memberGroupDetailsModel.registrationDateVal));
        }
      }
      if (this.membershipBasicRequiredDetailsModel != null && this.membershipBasicRequiredDetailsModel != undefined) {
        if (this.membershipBasicRequiredDetailsModel.admissionDateVal != null && this.membershipBasicRequiredDetailsModel.admissionDateVal != undefined) {
          this.membershipBasicRequiredDetailsModel.admissionDate = this.commonFunctionsService.getUTCEpoch(new Date(this.membershipBasicRequiredDetailsModel.admissionDateVal));
        }
        if (this.membershipBasicRequiredDetailsModel.dobVal != null && this.membershipBasicRequiredDetailsModel.dobVal != undefined) {
          this.membershipBasicRequiredDetailsModel.dob = this.commonFunctionsService.getUTCEpoch(new Date(this.membershipBasicRequiredDetailsModel.dobVal));
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

}
