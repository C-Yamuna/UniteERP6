import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Table } from 'primeng/table';
import { Responsemodel } from 'src/app/shared/responsemodel';
import { InstitutionPromoterDetailsModel, MemberGroupDetailsModel, MembershipBasicRequiredDetails, MembershipInstitutionDetailsModel, promoterDetailsModel } from '../membership-basic-required-details/shared/membership-basic-required-details';
import { SavingBankApplicationModel } from '../savings-bank-application/shared/saving-bank-application-model';
import { applicationConstants } from 'src/app/shared/applicationConstants';
import { SavingBankApplicationService } from '../savings-bank-application/shared/saving-bank-application.service';
import { SavingsBankCommunicationService } from '../savings-bank-communication/shared/savings-bank-communication.service';
import { MembershipServiceService } from '../membership-basic-required-details/shared/membership-service.service';
import { CommonComponent } from 'src/app/shared/common.component';
import { DatePipe } from '@angular/common';
import { CommonFunctionsService } from 'src/app/shared/commonfunction.service';
import { EncryptDecryptService } from 'src/app/shared/encrypt-decrypt.service';
import { FileUpload } from 'primeng/fileupload';
import { FileUploadModel } from 'src/app/layout/mainmenu/shared/file-upload-model.model';
import { ERP_TRANSACTION_CONSTANTS } from 'src/app/transcations/erp-transaction-constants';
import { FileUploadService } from 'src/app/shared/file-upload.service';
import { SbTransaction } from '../../sb-transactions/shared/sb-transaction';

@Component({
  selector: 'app-new-membership',
  templateUrl: './new-membership.component.html',
  styleUrls: ['./new-membership.component.css']
})
export class NewMembershipComponent {

  memberCreationForm: FormGroup;
  groupForm: FormGroup;
  institutionForm: FormGroup;
  applicationList: any[] = [];
  accountList: any[] = [];
  genderList: any[] = [];
  maritalstatusList: any[] = [];
  
  membershipBasicRequiredDetails: MembershipBasicRequiredDetails = new MembershipBasicRequiredDetails();
  memberGroupDetailsModel: MemberGroupDetailsModel = new MemberGroupDetailsModel();
  membershipInstitutionDetailsModel: MembershipInstitutionDetailsModel = new MembershipInstitutionDetailsModel();
  promoterDetailsModel: promoterDetailsModel = new promoterDetailsModel();
  institutionPromoterDetailsModel: InstitutionPromoterDetailsModel = new InstitutionPromoterDetailsModel();
  savingBankApplicationModel: SavingBankApplicationModel = new SavingBankApplicationModel();

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
  addButton: boolean = true;
  EditDeleteDisable: boolean = false;
  newRow: any;
  promoterDetails: any[] = [];
  memberTypeId: any;

  @ViewChild('dt', { static: false }) private dt!: Table;
  @ViewChild('dt1', { static: false }) private dt1!: Table;
  @ViewChild('cv', { static: false }) private cv!: Table;

  msgs: any[] = [];
  operatorTypeList: any[] = [];
  admisionNumber: any;
  communicationForm: any;
  pacsId: any;
  branchId: any;
  allTypesOfmembershipList: any;
  permenentAllTypesOfmembershipList: any;
  sbAccId: any;
  multipleFilesList: any;
  uploadFileData: any;
  isFileUploaded: any;
  groupPromoters: boolean = false;
 

  cancleButtonFlag : Boolean = false;

  promterTypeDisabled : any;

  admissionNumbersList:any[]=[];
  admissionNumberDropDown: boolean = false;

  isExistingMember:Boolean =false;
  institutionPromoterPopUp: boolean = false;
  uploadSignature: boolean = false;

  constructor(private router: Router, private formBuilder: FormBuilder, private savingBankApplicationService: SavingBankApplicationService, private commonComponent: CommonComponent, private activateRoute: ActivatedRoute, private encryptDecryptService: EncryptDecryptService, private commonFunctionsService: CommonFunctionsService, private datePipe: DatePipe, private savingsBankCommunicationService: SavingsBankCommunicationService, private membershipServiceService: MembershipServiceService , private fileUploadService :FileUploadService) {
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
    this.membershipBasicRequiredDetails.filesDTOList = [];
    this.pacsId = 1;
    this.branchId = 1;
    this.showForm = this.commonFunctionsService.getStorageValue(applicationConstants.B_CLASS_MEMBER_CREATION);
    this.orgnizationSetting = this.commonComponent.orgnizationSettings()
    this.maritalStatusList = this.commonComponent.maritalStatusList();
  
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
        this.sbAccId = this.encryptDecryptService.decrypt(params['id']);
        this.getSbAccountDetailsById(this.sbAccId);
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
  /**
   * @implements get sb account details by id
   * @param id 
   * @author jyothi.naidana
   */
  getSbAccountDetailsById(id: any) {
    this.savingBankApplicationService.getSbApplicationById(id).subscribe((data: any) => {
      this.responseModel = data;
      if (this.responseModel != null && this.responseModel != undefined) {
        if (this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
          if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
            if (this.responseModel.data.length > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
              this.admisionNumber = this.responseModel.data[0].admissionNumber;
              this.memberTypeName = this.responseModel.data[0].memberTypeName;
              this.memberTypeId = this.responseModel.data[0].memberTypeId;
              this.savingBankApplicationModel = this.responseModel.data[0];
              this.updateData();
              this.membershipDataFromSbModule();
            }
          }
        }
      }
    });
  }
  /**
    * @implements member form reset
    * @author jyothi.naidana
    */
  memberFormReset(flag: any) {
    if (flag) {
      this.memberCreationForm.reset();
      this.showForm = flag;
    }
    else {
      this.showForm = flag;
    }
  }
  /**
   * @implements update
   * @author jyothi.naidana
   */
  updateData() {
    this.savingBankApplicationModel.memberTypeId = this.memberTypeId;
    if (this.memberTypeName == "Individual") {
      this.individualFlag = true;
      this.isDisableFlag = (!this.memberCreationForm.valid)
      this.savingBankApplicationModel.memberTypeName = this.memberTypeName;
      this.membershipBasicRequiredDetails.memberTypeName = this.memberTypeName;
      this.membershipBasicRequiredDetails.isNewMember = this.showForm;
      this.savingBankApplicationModel.memberShipBasicDetailsDTO = this.membershipBasicRequiredDetails;
    }
    if (this.memberTypeName == "Group") {
      this.groupFlag = true;
      this.isDisableFlag = !(this.groupForm.valid && (this.memberGroupDetailsModel.groupPromoterList != null && this.memberGroupDetailsModel.groupPromoterList != undefined && this.memberGroupDetailsModel.groupPromoterList.length  >0))
      this.memberGroupDetailsModel.memberTypeId = this.memberTypeId;
      this.memberGroupDetailsModel.memberTypeName = this.memberTypeName;
      this.memberGroupDetailsModel.isNewMember = this.showForm;
      this.savingBankApplicationModel.groupDetailsDTO = this.memberGroupDetailsModel;
      this.savingBankApplicationModel.memberTypeName = this.memberTypeName;
      this.addButton = !this.groupForm.valid;
    }
    if (this.memberTypeName == "Institution") {
      this.institutionFlag = true;
      this.isDisableFlag = !(this.institutionForm.valid &&(this.membershipInstitutionDetailsModel.institutionPromoterList != null && this.membershipInstitutionDetailsModel.institutionPromoterList != undefined && this.membershipInstitutionDetailsModel.institutionPromoterList.length >0))
      this.membershipInstitutionDetailsModel.memberTypeId = this.memberTypeId;
      this.membershipInstitutionDetailsModel.memberTypeName = this.memberTypeName;
      this.membershipInstitutionDetailsModel.isNewMember = this.showForm;
      this.savingBankApplicationModel.memberTypeName = this.memberTypeName;
      this.savingBankApplicationModel.institutionDTO = this.membershipInstitutionDetailsModel;
      this.addButton = !this.institutionForm.valid;
  }
   
    this.savingBankApplicationService.changeData({
      formValid: this.memberCreationForm.valid ? true : false || (this.institutionForm.valid) ? true : false || (this.groupForm.valid) ? true : false,
      data: this.savingBankApplicationModel,
      isDisable: this.isDisableFlag,
      stepperIndex: 0,
    });
  }
  /**
   * @implements update save
   * @author jyothi.naidana
   */
  save() {
    this.updateData();
  }

  /**
   * @implements on Change Relation Type
   * @author jyothi.naidana
   */
  onChangeRelationTypeChange(event: any) {
    const filteredItem = this.relationTypesList.find(item => item.value === event.value);
    this.membershipBasicRequiredDetails.relationTypeName = filteredItem.label;

  }
  /**
   * @implements get getAll relation Types
   * @author jyothi.naidana
   */
  getAllRelationTypes() {
    this.savingBankApplicationService.getAllRelationTypes().subscribe((res: any) => {
      this.responseModel = res;
      if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
        this.relationTypesList = this.responseModel.data;
        this.relationTypesList = this.relationTypesList.filter((obj: any) => obj != null).map((relationType: { name: any; id: any; }) => {
          return { label: relationType.name, value: relationType.id };
        });
      }
    });
  }
  /**
   * @implements get getAll Occupation Types
   * @author jyothi.naidana
   */
  getAllOccupationTypes() {
    this.savingBankApplicationService.getAllAccountTypesList().subscribe((res: any) => {
      this.responseModel = res;
      if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
        this.occupationTypeList = this.responseModel.data;
        this.occupationTypeList = this.occupationTypeList.filter((obj: any) => obj != null).map((relationType: { name: any; id: any; }) => {
          return { label: relationType.name, value: relationType.id };
        });

      }
    });
  }
  /**
   * @implements get getAll Qualification Types
   * @author jyothi.naidana
   */
  getAllQualificationType() {
    this.savingBankApplicationService.getQualificationTypes().subscribe((res: any) => {
      this.responseModel = res;
      if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
        this.qualificationTypes = this.responseModel.data;
        this.qualificationTypes = this.qualificationTypes.filter((obj: any) => obj != null).map((relationType: { name: any; id: any; }) => {
          return { label: relationType.name, value: relationType.id };
        });
      }
    });
  }

  /**
   * @implements get castes list
   * @author jyothi.naidana
   */
  getCastesList() {
    this.savingBankApplicationService.getCastes().subscribe((res: any) => {
      this.responseModel = res;
      if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
        this.castesList = this.responseModel.data;
        this.castesList = this.castesList.filter((obj: any) => obj != null).map((relationType: { name: any; id: any; }) => {
          return { label: relationType.name, value: relationType.id };
        });
      }
    });
  }

 
 /**
   * @implements get membership detaild by admission Number
   * @param admissionNumber 
   * @author jyothi.naidana
   */
  getMemberDetailsByAdmissionNumber(admisionNumber: any) {
    this.savingBankApplicationService.getMemberByAdmissionNumber(admisionNumber).subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel != null && this.responseModel != undefined) {
        if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
          if (this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
            this.membershipBasicRequiredDetails = this.responseModel.data[0];
            if (this.membershipBasicRequiredDetails.dob != null && this.membershipBasicRequiredDetails.dob != undefined) {
              this.membershipBasicRequiredDetails.dobVal = this.datePipe.transform(this.membershipBasicRequiredDetails.dob, this.orgnizationSetting.datePipe);
            }
            if (this.membershipBasicRequiredDetails.admissionDate != null && this.membershipBasicRequiredDetails.admissionDate != undefined) {
              this.membershipBasicRequiredDetails.admissionDateVal = this.datePipe.transform(this.membershipBasicRequiredDetails.admissionDate, this.orgnizationSetting.datePipe);
            }
            if(this.membershipBasicRequiredDetails.memberTypeId != undefined && this.membershipBasicRequiredDetails.memberTypeId){
              this.memberTypeId = this.membershipBasicRequiredDetails.memberTypeId;
            }
            if (this.membershipBasicRequiredDetails.photoCopyPath != null && this.membershipBasicRequiredDetails.photoCopyPath != undefined) {
              this.membershipBasicRequiredDetails.multipartFileListForPhotoCopy = this.fileUploadService.getFile(this.membershipBasicRequiredDetails.photoCopyPath ,ERP_TRANSACTION_CONSTANTS.DEMANDDEPOSITS + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.membershipBasicRequiredDetails.photoCopyPath  );
            }
            if (this.membershipBasicRequiredDetails.signatureCopyPath != null && this.membershipBasicRequiredDetails.signatureCopyPath != undefined) {
              this.membershipBasicRequiredDetails.multipartFileListForsignatureCopyPath = this.fileUploadService.getFile(this.membershipBasicRequiredDetails.signatureCopyPath ,ERP_TRANSACTION_CONSTANTS.DEMANDDEPOSITS + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.membershipBasicRequiredDetails.signatureCopyPath  );
            }
            this.savingBankApplicationModel.memberShipBasicDetailsDTO = this.membershipBasicRequiredDetails;
            this.savingBankApplicationModel.memberTypeName = this.membershipBasicRequiredDetails.memberTypeName;
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
  /**
   * @implements get group detaild by admission Number
   * @param admissionNumber 
   * @author jyothi.naidana
   */
  getGroupByAdmissionNumber(admissionNumber: any) {
    this.savingBankApplicationService.getGroupByAdmissionNumber(admissionNumber).subscribe((response: any) => {
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
           
              if (this.memberGroupDetailsModel.groupPromoterList != null && this.memberGroupDetailsModel.groupPromoterList != undefined && this.memberGroupDetailsModel.groupPromoterList.length > 0) {
                this.promoterDetails = this.memberGroupDetailsModel.groupPromoterList;
                let i = 0;
                for( let groupPromoters of this.promoterDetails){
                  i = i+1;
                  groupPromoters.uniqueId = i;
                  if(groupPromoters.dob != null && groupPromoters.dob != undefined){
                    groupPromoters.memDobVal = this.datePipe.transform(groupPromoters.dob, this.orgnizationSetting.datePipe);
                  }
                  if(groupPromoters.startDate != null && groupPromoters.startDate != undefined){
                    groupPromoters.startDateVal = this.datePipe.transform(groupPromoters.startDate, this.orgnizationSetting.datePipe);
                  }
                  if(groupPromoters.genderId != null && groupPromoters.genderId != undefined){
                    let Obj = this.genderList.filter(obj => obj.value == groupPromoters.genderId);
                    if(Obj != null && Obj != undefined ){
                      groupPromoters.genderName = Obj[0].label ;
                    }
                  }
                }
              }
              if(this.memberGroupDetailsModel.memberTypeName != null && this.memberGroupDetailsModel.memberTypeName != undefined){
                this.savingBankApplicationModel.memberTypeName = this.memberGroupDetailsModel.memberTypeName;
              }
              if(this.memberGroupDetailsModel != null && this.memberGroupDetailsModel != undefined){
              this.savingBankApplicationModel.groupDetailsDTO = this.memberGroupDetailsModel;
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
  /**
   * @implements get institution details by admission Number
   * @param admissionNumber 
   * @author jyothi.naidana
   */
  getInstitutionByAdmissionNumber(admissionNumber: any) {
    this.savingBankApplicationService.getInstitutionDetailsByAdmissionNumber(admissionNumber).subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel != null && this.responseModel != undefined) {
        if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
          if (this.responseModel.data.length > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
            this.membershipInstitutionDetailsModel = this.responseModel.data[0];

            if (this.membershipInstitutionDetailsModel.registrationDate != null && this.membershipInstitutionDetailsModel.registrationDate != undefined) {
              this.membershipInstitutionDetailsModel.registrationDateVal = this.datePipe.transform(this.membershipInstitutionDetailsModel.registrationDate, this.orgnizationSetting.datePipe);
            }
            if (this.membershipInstitutionDetailsModel.admissionDate != null && this.membershipInstitutionDetailsModel.admissionDate != undefined) {
              this.membershipInstitutionDetailsModel.admissionDateVal = this.datePipe.transform(this.membershipInstitutionDetailsModel.admissionDate, this.orgnizationSetting.datePipe);
            }
            if(this.membershipInstitutionDetailsModel.memberTypeId != null && this.membershipInstitutionDetailsModel.memberTypeId != undefined){
              this.memberTypeId = this.memberTypeId;
            }
            if (this.membershipInstitutionDetailsModel.institutionPromoterList.length > 0){
              this.institutionPromoter = this.membershipInstitutionDetailsModel.institutionPromoterList;
              let i = 0;
              for( let institution of this.institutionPromoter){
                i = i+1;
                institution.uniqueId = i;
                if(institution.dob != null && institution.dob != undefined){
                  institution.memDobVal = this.datePipe.transform(institution.dob, this.orgnizationSetting.datePipe);
                }
                if(institution.startDate != null && institution.startDate != undefined){
                  institution.startDateVal = this.datePipe.transform(institution.startDate, this.orgnizationSetting.datePipe);
                }
                if(institution.genderId != null && institution.genderId != undefined){
                  let Obj = this.genderList.filter(obj => obj.value == institution.genderId);
                  if(Obj != null && Obj != undefined ){
                    institution.genderName = Obj[0].label ;
                  }
                }
              }
            }
            this.savingBankApplicationModel.memberTypeName = this.membershipInstitutionDetailsModel.memberTypeName;
            this.savingBankApplicationModel.institutionDTO = this.membershipInstitutionDetailsModel;
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

  /**
   * @implements onChange member Type
   * @param event 
   * @author jyothi.naidana
   */
  OnChangeMemberType(event: any) {
    const filteredItem = this.memberTypeList.find((item: { value: any; }) => item.value === event.value);
    this.memberTypeName = filteredItem.label;
    if (event.value == 1) {
      this.individualFlag = true;
      this.institutionFlag = false;
      this.groupFlag = false;
      this.membershipBasicRequiredDetails.memberTypeId = 1;
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
    if (!this.memberGroupDetailsModel.groupPromotersDTOList) {
      this.memberGroupDetailsModel.groupPromotersDTOList = []; // Initialize it as an empty array
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
      this.memberGroupDetailsModel.groupPromoterList = this.promoterDetails;
    }else{
      this.promoterDetails.push(rowData);
      this.memberGroupDetailsModel.groupPromoterList = this.promoterDetails;
    }
    this.updateData();
  }

  /**
   * @implements cancle prmoters
   * @author jyothi.naidana
   * @param falg 
   */
  cancelPromoter(falg:Boolean) {
    this.addButton = false;
    this.groupPromoters = false;
    this.EditDeleteDisable = false;
    this.promoterDetails;
  }
  
  /**
   * @implements edit promoters
   * @param rowData 
   * @author jyothi.naidana
   */
  editPromoter(rowData: any) {
    this.cancleButtonFlag = true;
    this.addButton = true;
    this.EditDeleteDisable = true;
    this.groupPromoters = true;
    this.promoterDetailsModel = new promoterDetailsModel();
    this.promoterDetailsModel = this.promoterDetails.find((obj:any) => (obj != null && obj != undefined) && obj.uniqueId === rowData.uniqueId );
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
    this.promoterDetailsModel = new promoterDetailsModel();
    this.promoterDetailsModel.uniqueId = this.promoterDetails.length + 1
    this.promoterDetailsForm.reset();
    this.onChangeExistedPrmoter(false);
    this.admissionNumberDropDown = false;
  }
  /**
   * @implements get all operator Details
   * @author jyothi.naidana
   */
  getAllOperatorTypes() {
    this.commonComponent.startSpinner();
    this.savingBankApplicationService.getAllOperationTypes().subscribe((res: any) => {
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
    this.institutionPromoterDetailsModel = new InstitutionPromoterDetailsModel();
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
    this.institutionPromoterDetailsModel = new InstitutionPromoterDetailsModel();
    this.institutionPromoterDetailsModel.uniqueId = uniqueId; 
    this.promoterDetailsForm.reset();
    this.admissionNumberDropDown = false;
    
  }

  /**
   * @implements get All member types 
   * @author jyothi.naidana
   */
  getAllMemberType() {
    this.membershipServiceService.getAllMemberTypes().subscribe((data: any) => {
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

  /**
   * @implements membership module data
   * @author jyothi.naidana
   */
  membershipDataFromSbModule() {
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
   * @author jyothi.naidana
   */
  fileUploader(event: any, fileUpload: FileUpload, filePathName: any) {
    this.isFileUploaded = applicationConstants.FALSE;
    this.multipleFilesList = [];
    if(this.isEdit && this.membershipBasicRequiredDetails.filesDTOList == null || this.membershipBasicRequiredDetails.filesDTOList == undefined){
      this.membershipBasicRequiredDetails.filesDTOList = [];
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
         // Add to filesDTOList array
        if (filePathName === "individualPhotoCopy") {
          this.membershipBasicRequiredDetails.filesDTOList.push(files);
          this.membershipBasicRequiredDetails.photoCopyPath = null;
          this.membershipBasicRequiredDetails.multipartFileListForPhotoCopy = [];
          this.membershipBasicRequiredDetails.filesDTOList[this.membershipBasicRequiredDetails.filesDTOList.length - 1].fileName = "Individual_Member_Photo_copy" + "_" + timeStamp + "_" + file.name;
          this.membershipBasicRequiredDetails.photoCopyPath = "Individual_Member_Photo_copy" + "_" + timeStamp + "_" + file.name; // This will set the last file's name as docPath
        }
        if (filePathName === "individualSighnedCopy") {
          this.membershipBasicRequiredDetails.filesDTOList.push(files);
          this.membershipBasicRequiredDetails.multipartFileListForsignatureCopyPath = [];
          this.membershipBasicRequiredDetails.signatureCopyPath = null;
          this.membershipBasicRequiredDetails.filesDTOList[this.membershipBasicRequiredDetails.filesDTOList.length - 1].fileName = "Individual_Member_signed_copy" + "_" + timeStamp + "_" + file.name;
          this.membershipBasicRequiredDetails.signatureCopyPath = "Individual_Member_signed_copy" + "_" + timeStamp + "_" + file.name; // This will set the last file's name as docPath
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
        // this.updateData();
      }
      reader.readAsDataURL(file);
    }
  }

  /**
   * @implements onFileremove from file value
   * @param fileName 
   * @author jyothi.naidana
   */
  fileRemoeEvent(fileName: any) {
      if (this.membershipBasicRequiredDetails.filesDTOList != null && this.membershipBasicRequiredDetails.filesDTOList != undefined && this.membershipBasicRequiredDetails.filesDTOList.length > 0) {
        if (fileName == "individualPhotoCopy") {
        let removeFileIndex = this.membershipBasicRequiredDetails.filesDTOList.findIndex((obj: any) => obj && obj.fileName === this.membershipBasicRequiredDetails.photoCopyPath);
        let obj = this.membershipBasicRequiredDetails.filesDTOList.find((obj: any) => obj && obj.fileName === this.membershipBasicRequiredDetails.photoCopyPath);
        this.membershipBasicRequiredDetails.filesDTOList.splice(removeFileIndex, 1);
        this.membershipBasicRequiredDetails.photoCopyPath = null;
      }
      if (fileName == "individualSighnedCopy") {
        let removeFileIndex = this.membershipBasicRequiredDetails.filesDTOList.findIndex((obj: any) => obj && obj.fileName === this.membershipBasicRequiredDetails.signatureCopyPath);
        let obj = this.membershipBasicRequiredDetails.filesDTOList.find((obj: any) => obj && obj.fileName === this.membershipBasicRequiredDetails.signatureCopyPath);
        this.membershipBasicRequiredDetails.filesDTOList.splice(removeFileIndex, 1);
        this.membershipBasicRequiredDetails.signatureCopyPath = null;
      }
    }
  }

  /**
   * @implements date converstions
   * @author jyothi.naidana
   */
  dateConverstion() {

    if(this.memberGroupDetailsModel.admissionDateVal != undefined && this.memberGroupDetailsModel.registrationDateVal != undefined){
      if( new Date(this.memberGroupDetailsModel.admissionDateVal) <  new Date(this.memberGroupDetailsModel.registrationDateVal)){
        this.groupForm.get('registrationDate')?.reset();
        this.groupForm.get('admissionDate')?.reset();
        this.groupForm.updateValueAndValidity();
        this.msgs = [{ severity: 'warn', detail: applicationConstants.REGISTRATION_DATE_SHOULD_LESSTHAN_ADMISSION_DATE }];
        setTimeout(() => {
          this.msgs = [];        
        }, 2000);
      }
    }

    if (this.memberGroupDetailsModel != null && this.memberGroupDetailsModel != undefined) {
      if (this.memberGroupDetailsModel.admissionDateVal != null && this.memberGroupDetailsModel.admissionDateVal != undefined) {
        this.memberGroupDetailsModel.admissionDate = this.commonFunctionsService.getUTCEpoch(new Date(this.memberGroupDetailsModel.admissionDateVal));
      }
      if (this.memberGroupDetailsModel.registrationDateVal != null && this.memberGroupDetailsModel.registrationDateVal != undefined) {
        this.memberGroupDetailsModel.registrationDate = this.commonFunctionsService.getUTCEpoch(new Date(this.memberGroupDetailsModel.registrationDateVal));
      }
    }
    if (this.membershipBasicRequiredDetails != null && this.membershipBasicRequiredDetails != undefined) {
      if (this.membershipBasicRequiredDetails.admissionDateVal != null && this.membershipBasicRequiredDetails.admissionDateVal != undefined) {
        this.membershipBasicRequiredDetails.admissionDate = this.commonFunctionsService.getUTCEpoch(new Date(this.membershipBasicRequiredDetails.admissionDateVal));
      }
      if (this.membershipBasicRequiredDetails.dobVal != null && this.membershipBasicRequiredDetails.dobVal != undefined) {
        this.membershipBasicRequiredDetails.dob = this.commonFunctionsService.getUTCEpoch(new Date(this.membershipBasicRequiredDetails.dobVal));
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
        this.membershipBasicRequiredDetails = this.responseModel.data[0];
       this.promoterDetailsModel.name  = this.membershipBasicRequiredDetails.name,
       this.promoterDetailsModel.surname  = this.membershipBasicRequiredDetails.surname;
       this.promoterDetailsModel.aadharNumber  = this.membershipBasicRequiredDetails.aadharNumber;
       this.promoterDetailsModel.dob  = this.membershipBasicRequiredDetails.dob;
       if(this.promoterDetailsModel.dob != null && this.promoterDetailsModel.dob != undefined)
        this.promoterDetailsModel.memDobVal = this.datePipe.transform(this.promoterDetailsModel.dob, this.orgnizationSetting.datePipe);
       this.promoterDetailsModel.age  = this.membershipBasicRequiredDetails.age;
       this.promoterDetailsModel.genderId  = this.membershipBasicRequiredDetails.genderId;
       this.promoterDetailsModel.martialId  = this.membershipBasicRequiredDetails.martialId;
       this.promoterDetailsModel.mobileNumber  = this.membershipBasicRequiredDetails.mobileNumber;
       this.promoterDetailsModel.emailId  = this.membershipBasicRequiredDetails.emailId;
       this.promoterDetailsModel.startDate  = this.membershipBasicRequiredDetails.admissionDate;
       if(this.promoterDetailsModel.startDate != null && this.promoterDetailsModel.startDate != undefined)
        this.promoterDetailsModel.startDateVal = this.datePipe.transform(this.promoterDetailsModel.startDate, this.orgnizationSetting.datePipe);
       this.promoterDetailsModel.operatorTypeId  = this.membershipBasicRequiredDetails.occupationId;
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
