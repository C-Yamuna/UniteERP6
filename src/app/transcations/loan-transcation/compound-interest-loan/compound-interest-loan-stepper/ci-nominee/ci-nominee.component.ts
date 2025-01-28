import { Component } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SelectItem } from 'primeng/api';
import { Responsemodel } from 'src/app/shared/responsemodel';
import { MembershipBasicDetails, MembershipGroupDetails, MemInstitutionDetails } from '../ci-membership-details/shared/membership-details.model';
import { CiLoanApplication } from '../ci-product-details/shared/ci-loan-application.model';
import { CiLoanNominee } from './shared/ci-loan-nominee.model';
import { CiLoanGuardian } from './shared/ci-loan-guardian.model';
import { CommonComponent } from 'src/app/shared/common.component';
import { EncryptDecryptService } from 'src/app/shared/encrypt-decrypt.service';
import { CommonFunctionsService } from 'src/app/shared/commonfunction.service';
import { DatePipe } from '@angular/common';
import { FileUploadService } from 'src/app/shared/file-upload.service';
import { applicationConstants } from 'src/app/shared/applicationConstants';
import { CiLoanApplicationService } from '../ci-product-details/shared/ci-loan-application.service';
import { CiLoanNomineeService } from './shared/ci-loan-nominee.service';
import { CiLoanGuardianService } from './shared/ci-loan-guardian.service';
import { ERP_TRANSACTION_CONSTANTS } from 'src/app/transcations/erp-transaction-constants';
import { MembershipDetailsService } from '../ci-membership-details/shared/membership-details.service';
import { FileUpload } from 'primeng/fileupload';
import { FileUploadModel } from 'src/app/layout/mainmenu/shared/file-upload-model.model';
import { MemberShipTypesData } from 'src/app/transcations/common-status-data.json';

@Component({
  selector: 'app-ci-nominee',
  templateUrl: './ci-nominee.component.html',
  styleUrls: ['./ci-nominee.component.css']
})
export class CiNomineeComponent {
  nomineeForm: FormGroup;
  guarantorDetailsForm: any;
  nominee: any;
  nomineeList: any[] = [];
  checked: any;
  newNominee: boolean = false;
  sameAsMembershipNominee: boolean = false;
  noNominee: boolean = false;
  responseModel!: Responsemodel;
  msgs: any[] = [];

  membershipBasicDetailsModel: MembershipBasicDetails = new MembershipBasicDetails();
  membershipGroupDetailsModel: MembershipGroupDetails = new MembershipGroupDetails();
  membershipInstitutionDetailsModel: MemInstitutionDetails = new MemInstitutionDetails();
  ciLoanApplicationModel: CiLoanApplication = new CiLoanApplication;
  ciLoanNomineeModel: CiLoanNominee = new CiLoanNominee();
  ciLoanGuardianModel: CiLoanGuardian = new CiLoanGuardian();
  fileName: any;
  ciLoanApplicationId: any;
  isEdit: boolean = false;
  age: any;
  guarntorDetailsFalg: boolean = false;
  relationTypesList: any[] = [];
  flagForNomineeTypeValue: any;
  accountOpeningDateVal: any;
  applicationType: any;
  accountType: any;
  minBalence: any;
  orgnizationSetting: any;
  accountNumber: any;
  productName: any;
  statesList: any;
  districtsList: any;
  mandalsList: any;
  villageList: any;
  guadianTypesList: any[] = [];
  guardain :any;
  showForm: any;
  memberTypeName: any;
  institutionPromoter: any;
  promoterDetails: any;
  admissionNumber: any;
  nomineeEdit : Boolean = false;
  nomineeHistoryList : any[] = [];
  nomineeFields: any[] = [];
  courtAppointedGuardain :any;
  multipleFilesList: any;
  uploadFileData: any;
  isFileUploaded: any;
  sameAsMemberGuardain: boolean = false;
  noGuardain: boolean = true;
  nomineeTypeDisable: boolean = false;
  guardainTypeDisable: boolean = false;
  historyFLag: boolean = false;
  flag: boolean = false;
  relationshipTypeName: any;
  relationshipTypeId: any;
  guardianName: any;
  guardianAadharNumber: any;
  guardianMobileNumber: any;
  guardianEmailId: any;
  memberFilePath: any;
  depositDate: any;


  constructor(private router: Router, 
     private formBuilder: FormBuilder,
     private commonComponent: CommonComponent, 
     private activateRoute: ActivatedRoute, 
     private encryptDecryptService: EncryptDecryptService, 
     private commonFunctionsService: CommonFunctionsService, 
     private datePipe: DatePipe , 
     private membershipDetailsService: MembershipDetailsService,
     private ciLoanApplicationService: CiLoanApplicationService,
     private ciLoanNomineeService:CiLoanNomineeService,
     private ciLoanGuardianService:CiLoanGuardianService,
     private fileUploadService :FileUploadService) {
    this.nomineeForm = this.formBuilder.group({
      relationName:['', ],
      nomineeName: ['', ],
      aadhaar: ['', ],
      mobileNumber:['', ],
      email: ['', ],
      dateOfBirth: new FormControl('', ),
      remarks: new FormControl('', ),
      nomineeType: ['', Validators.required],

      //guardian form fields
      relationNameOfGuardian: ['', ],
      guardianName: ['', ],
      guardianAge: ['', ],
      guardianAadhar: ['', ],
      guardianMobile: ['', ],
      guardianEmail: ['', ],
      guardianAddress: ['', ],
      guardainType: [''],
      fileUpload : ['', ],
      guardianRemarks: new FormControl('', ),

    });
    this.nomineeFields = [
      { field: 'name', header: 'Name' },
      { field: 'accountNumber', header: 'Account Number' },
      { field: 'aadharNumber', header: 'Aadhar Number' },
      { field: 'mobileNumber', header: 'Mobile Number' },
      { field: 'nomineeEmail',header:'Email'},
      { field: 'statusName', header: 'Status' },
    ]

  }

  // @bhargavi
  ngOnInit(): void {
    this.orgnizationSetting = this.commonComponent.orgnizationSettings();
    this.showForm = this.commonFunctionsService.getStorageValue(applicationConstants.B_CLASS_MEMBER_CREATION);
    if(this.showForm){
      this.nomineeList = [
        { label: 'New Nominee', value: 1 },
        { label: 'No Nominee', value: 3 },
      ]
    }
    else{
      this.nomineeList = [
        { label: 'New Nominee', value: 1 },
        { label: 'Same As Membership Nominee', value: 2 },
        { label: 'No Nominee', value: 3 },
      ]
    }
   if(this.showForm){
    this.guadianTypesList = [
      { label: 'New Guardain', value: 1 },
      { label: 'No Guardain', value: 3 },
    ]
   }else{
    this.guadianTypesList= [
      { label: 'New Guardain', value: 1 },
      { label: 'Same as Member Guardain', value: 2 },
      { label: 'No Guardain', value: 3 },
    ];
   }
    this.activateRoute.queryParams.subscribe(params => {
      if (params['id'] != undefined || params['preview'] != undefined) {
        if(params['preview'] != undefined && params['preview'] != null){
          let edit = this.encryptDecryptService.decrypt(params['preview']);
          this.historyFLag = true;
        }
        if(params['id'] != undefined && params['id'] != null){
          let queryParams = this.encryptDecryptService.decrypt(params['id']);
          this.ciLoanApplicationId = Number(queryParams);
          this.getCiLoanApplicationsById(this.ciLoanApplicationId);
          this.isEdit = true;
        }
        
        
      } else {
        this.isEdit = false;
      }
    });
    this.nomineeForm.valueChanges.subscribe((data: any) => {
      this.updateData();
      if (this.nomineeForm.valid) {
        this.save();
      }
    });
    this.getAllRelationTypes();
  }
  //update model data to stepper component
  updateData() {
    if(this.relationTypesList != null && this.relationTypesList != undefined && this.relationTypesList.length > 0){
      let nominee = this.relationTypesList.find((data: any) => null != data && this.ciLoanNomineeModel.relationTypeId != null && data.value == this.ciLoanNomineeModel.relationTypeId);
      if (nominee != null && undefined != nominee && nominee.label != null && nominee.label != undefined) {
        this.ciLoanNomineeModel.relationTypeName = nominee.label;
      }
     
    }
    if (this.age <= 18) {
      this.ciLoanGuardianModel.ciLoanApplicationId = this.ciLoanApplicationId ;
      this.ciLoanGuardianModel.accountNumber = this.accountNumber;
      let guardain = this.relationTypesList.find((data: any) => null != data && this.ciLoanGuardianModel.relationshipTypeId != null && data.value == this.ciLoanGuardianModel.relationshipTypeId);
      if (guardain != null && undefined != guardain  && guardain.label != undefined) {
        this.ciLoanGuardianModel.relationshipTypeName = guardain.label;
      }
      this.ciLoanNomineeModel.ciLoanGuardian = this.ciLoanGuardianModel;
    }
    else {
      this.ciLoanNomineeModel.ciLoanGuardian = null;
    }
    this.ciLoanNomineeModel.accountNumber = this.accountNumber;
    this.ciLoanNomineeModel.ciLoanApplicationId = this.ciLoanApplicationId;
    this.ciLoanApplicationService.changeData({
      formValid: !this.nomineeForm.valid ? true : false,
      data: this.ciLoanNomineeModel,
      isDisable: (!this.nomineeForm.valid),
      // isDisable:false,
      stepperIndex: 5,
    });
  }
  save() {
    this.updateData();
  }
  //on change nominee type need to update validation
  onChange(event: any ,flag :boolean) {
    if (event == 1) {//new nominee
      this.newNomineeType(flag);
    }
    else if (event == 2) {//same as membership nominee
      this.samAsMemberNomineeType(flag);
    }
    else if (event == 3) {//no nominee
      this.noNomineeType(flag);
    } 
  }

  /**
   * @implements onChange Guardain Type 
   * @param event guardain Type
   */
  onChangeGuardain(event: any , flag :boolean) {
    if (event == 1) {//new guardain
      this.newGuardainType(flag);
    }
   else if (event == 2) {//same as member guardain
      this.sameAsMemberGuardianType(flag);
    }
    else if (event == 3) {//no guardain
      this.noGuardainaType(flag);
    }
  }

  //get fd account details for header data  
  getCiLoanApplicationsById(id: any) {
    this.ciLoanApplicationService.getLoanApplicationDetailsByLoanApplicationId(id).subscribe((data: any) => {
      this.responseModel = data;
      if (this.responseModel != null && this.responseModel != undefined) {
        if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
          if (this.responseModel.data.length > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
            if (this.responseModel.data[0].depositDate != null && this.responseModel.data[0].depositDate != undefined) {
              this.depositDate = this.datePipe.transform(this.responseModel.data[0].depositDate, this.orgnizationSetting.datePipe);
            }
            if (this.responseModel.data[0].memberTypeName != null && this.responseModel.data[0].memberTypeName != undefined) {
              this.memberTypeName = this.responseModel.data[0].memberTypeName;
              this.memberTypeCheck(this.memberTypeName);
            }
            if (this.responseModel.data[0].admissionNo != null && this.responseModel.data[0].admissionNo != undefined) {
              this.admissionNumber = this.responseModel.data[0].admissionNo;
            }
            if (this.responseModel.data[0].accountNumber != null && this.responseModel.data[0].accountNumber != undefined) {
              this.accountNumber = this.responseModel.data[0].accountNumber;
              if (this.historyFLag) {
                // this.getNomineeHistoryByRdAccountNumber(this.accountNumber);
              }
            }
            this.ciLoanApplicationModel = this.responseModel.data[0];
            if (this.ciLoanApplicationModel != null && this.ciLoanApplicationModel != undefined) {
              if (this.ciLoanApplicationModel.ciLoanNomineeDetailsDTOList != null && this.ciLoanApplicationModel.ciLoanNomineeDetailsDTOList != undefined)
                // this.ciLoanApplicationModel.ciLoanNomineeDetailsDTOList[0] != null && this.ciLoanApplicationModel.ciLoanNomineeDetailsDTOList[0] != undefined)
                this.ciLoanNomineeModel = this.ciLoanApplicationModel.ciLoanNomineeDetailsDTOList;
              if (this.ciLoanNomineeModel.nomineeFilePath != null && this.ciLoanNomineeModel.nomineeFilePath != undefined) {
                this.ciLoanNomineeModel.nomineeMultiPartList = this.fileUploadService.getFile(this.ciLoanNomineeModel.nomineeFilePath, ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.ciLoanNomineeModel.nomineeFilePath);
              }
              if (this.ciLoanApplicationModel.ciMemberGuardianDetailsDTO != null && this.ciLoanApplicationModel.ciMemberGuardianDetailsDTO != undefined)
                // this.ciLoanApplicationModel.ciMemberGuardianDetailsDTO[0] != null && this.ciLoanApplicationModel.ciMemberGuardianDetailsDTO[0] != undefined)
                this.ciLoanGuardianModel = this.ciLoanApplicationModel.ciMemberGuardianDetailsDTO;

              if (this.ciLoanGuardianModel.uploadFilePath != null && this.ciLoanGuardianModel.uploadFilePath != undefined) {
                this.ciLoanGuardianModel.guardainMultipartList = this.fileUploadService.getFile(this.ciLoanGuardianModel.uploadFilePath, ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.ciLoanGuardianModel.uploadFilePath);
              }

              if (this.ciLoanNomineeModel.nomineeType != null && this.ciLoanNomineeModel.nomineeType != undefined) {
                this.onChange(this.ciLoanNomineeModel.nomineeType, this.flag);
              }

            if (this.responseModel.data[0].individualMemberDetailsDTO.age != null && this.responseModel.data[0].individualMemberDetailsDTO.age != undefined) {
              this.age = this.responseModel.data[0].individualMemberDetailsDTO.age;
              if (this.age < 18) {
                this.guarntorDetailsFalg = true;
              }
            }
            if (this.guarntorDetailsFalg && this.ciLoanGuardianModel.guardianType != null && this.ciLoanGuardianModel.guardianType != undefined) {
              this.onChangeGuardain(this.ciLoanGuardianModel.guardianType, this.flag);
            }
            }
            else if (this.guarntorDetailsFalg) {
              const controlName = this.nomineeForm.get('guardainType');
              if (controlName) {
                controlName.setValidators([
                  Validators.required,
                ]);
                controlName.updateValueAndValidity();
              }
            }
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
    }, error => {
      this.commonComponent.stopSpinner();
      this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: applicationConstants.SERVER_DOWN_ERROR }];
      setTimeout(() => {
        this.msgs = [];
      }, 3000);
    });
  }

  /**
   * @implements member Type Check
   * @param memberType 
   * @param data 
   */
  memberTypeCheck(memberType: any) {
    if (memberType != MemberShipTypesData.INDIVIDUAL) {
      this.nomineeList = [
        { label: 'New Nominee', value: 1 },
        { label: 'No Nominee', value: 3 },
      ]
      this.guadianTypesList = [
        { label: 'New Guardain', value: 1 },
        { label: 'No Guardain', value: 3 },
      ]
    }
    
  }
  //get all relation types list
  getAllRelationTypes() {
    this.ciLoanApplicationService.getAllRelationTypes().subscribe((res: any) => {
      this.responseModel = res;
      if (this.responseModel != null && this.responseModel != undefined) {
        if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
          if (this.responseModel.data.length > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
            this.relationTypesList = this.responseModel.data
            this.relationTypesList = this.responseModel.data.filter((nominee: any) => nominee.status == applicationConstants.ACTIVE).map((count: any) => {
              return { label: count.name, value: count.id }
            });
          let  nominee= this.relationTypesList.find((data: any) => null != data && this.ciLoanNomineeModel.relationTypeId  != null && data.value == this.ciLoanNomineeModel.relationTypeId);
          if (nominee != null && undefined != nominee && nominee.label != null && nominee.label != undefined){
                this.ciLoanNomineeModel.relationTypeName = nominee.label;
            }
            let  guardain= this.relationTypesList.find((data: any) => null != data && this.ciLoanGuardianModel.relationshipTypeId  != null && data.value == this.ciLoanGuardianModel.relationshipTypeId);
            if (guardain != null && undefined != guardain && nominee.label != null && guardain.label != undefined){
                this.ciLoanGuardianModel.relationshipTypeName = guardain.label;
            }
          }
        }
      }
    });
  }

  //get guardian details by account Number
  getGuardianDetails(accountNumber: any) {
    this.ciLoanGuardianService.getCiLoanGuardianDetailsById(accountNumber).subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel != null && this.responseModel != undefined) {
        if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
          if (this.responseModel.data.length > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
            this.ciLoanGuardianModel = this.responseModel.data[0];
            if (this.ciLoanGuardianModel.guardianDob != null && this.ciLoanGuardianModel.guardianDob != undefined) {
              this.ciLoanGuardianModel.guardianDob = this.datePipe.transform(this.ciLoanGuardianModel.guardianDob, this.orgnizationSetting.datePipe);
            }
            if(this.ciLoanGuardianModel.guardianType != null && this.ciLoanGuardianModel.guardianType != undefined){
              this.onChangeGuardain(this.ciLoanGuardianModel.guardianType , this.flag);
            }
            this.updateData();
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
    });
  }

  /**
   * @implements getNominee from member module
   * @param admissionNumber 
   */
  getMemberNomineDetailsByAdmissionNumber(admissionNumber : any){
    this.membershipDetailsService.getMembershipBasicDetailsByAdmissionNumber(admissionNumber).subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel != null && this.responseModel != undefined) {
        if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
          if (this.responseModel.data.length > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
            this.membershipBasicDetailsModel = this.responseModel.data[0];
            if (this.responseModel.data[0].memberShipNomineeDetailsDTOList != null && this.responseModel.data[0].memberShipNomineeDetailsDTOList != undefined &&
              this.responseModel.data[0].memberShipNomineeDetailsDTOList[0] != null && this.responseModel.data[0].memberShipNomineeDetailsDTOList[0] != undefined) {
              this.ciLoanNomineeModel = this.responseModel.data[0].memberShipNomineeDetailsDTOList[0];
            }
            if(this.responseModel.data[0].memberShipNomineeDetailsDTOList[0].relationTypeId != null && this.responseModel.data[0].memberShipNomineeDetailsDTOList[0].relationTypeId != undefined){
              this.ciLoanNomineeModel.relationTypeId = this.responseModel.data[0].memberShipNomineeDetailsDTOList[0].relationTypeId;
              // this.getAllRelationTypes();
            }
            if (this.responseModel.data[0].memberShipNomineeDetailsDTOList[0].relationshipTypeName != null && this.responseModel.data[0].memberShipNomineeDetailsDTOList[0].relationshipTypeName != undefined) {
              this.ciLoanNomineeModel.relationTypeName = this.responseModel.data[0].memberShipNomineeDetailsDTOList[0].relationshipTypeName;
            }
            if (this.responseModel.data[0].memberShipNomineeDetailsDTOList[0].nomineeName != null && this.responseModel.data[0].memberShipNomineeDetailsDTOList[0].nomineeName != undefined) {
              this.ciLoanNomineeModel.nomineeName = this.responseModel.data[0].memberShipNomineeDetailsDTOList[0].nomineeName;
            }
            if (this.responseModel.data[0].memberShipNomineeDetailsDTOList[0].nomineeAadharNumber != null && this.responseModel.data[0].memberShipNomineeDetailsDTOList[0].nomineeAadharNumber != undefined) {
              this.ciLoanNomineeModel.nomineeAadharNumber = this.responseModel.data[0].memberShipNomineeDetailsDTOList[0].nomineeAadharNumber;
            }
            if (this.responseModel.data[0].memberShipNomineeDetailsDTOList[0].nomineeMobileNumber != null && this.responseModel.data[0].memberShipNomineeDetailsDTOList[0].nomineeMobileNumber != undefined) {
              this.ciLoanNomineeModel.nomineeMobileNumber = this.responseModel.data[0].memberShipNomineeDetailsDTOList[0].nomineeMobileNumber;
            }
            if (this.responseModel.data[0].memberShipNomineeDetailsDTOList[0].nomineeEmailId != null && this.responseModel.data[0].memberShipNomineeDetailsDTOList[0].nomineeEmailId != undefined) {
              this.ciLoanNomineeModel.nomineeEmailId = this.responseModel.data[0].memberShipNomineeDetailsDTOList[0].nomineeEmailId;
            }
            if (this.responseModel.data[0].memberShipNomineeDetailsDTOList[0].nomineeFilePath != null && this.responseModel.data[0].memberShipNomineeDetailsDTOList[0].nomineeFilePath != undefined) {
              this.ciLoanNomineeModel.nomineeMultiPartList = this.fileUploadService.getFile(this.responseModel.data[0].memberShipNomineeDetailsDTOList[0].nomineeFilePath , 
                ERP_TRANSACTION_CONSTANTS.MEMBERSHIP + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.responseModel.data[0].memberShipNomineeDetailsDTOList[0].nomineeFilePath );
            }
            this.ciLoanNomineeModel.nomineeType = 2;
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
   * @implements get guardain from member module
   * @param admissionNumber
   */
  getGaurdainFromMemberModule(admissionNumber : any){
    this.membershipDetailsService.getGardianDetailsFromMemberModuleByAdmissionNumber(admissionNumber).subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel != null && this.responseModel != undefined) {
        if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
          if (this.responseModel.data[0].relationshipTypeId != null && this.responseModel.data[0].relationshipTypeId != undefined) {
            this.ciLoanGuardianModel.relationshipTypeId = this.responseModel.data[0].relationshipTypeId;
          }
          if (this.responseModel.data[0].relationshipTypeName != null && this.responseModel.data[0].relationshipTypeName != undefined) {
            this.ciLoanGuardianModel.relationshipTypeName = this.responseModel.data[0].relationshipTypeName;
            
          }
          if (this.responseModel.data[0].guardianName != null && this.responseModel.data[0].guardianName != undefined) {
            this.ciLoanGuardianModel.guardianName = this.responseModel.data[0].guardianName;
            
          }
          if (this.responseModel.data[0].guardianAadharNumber != null && this.responseModel.data[0].guardianAadharNumber != undefined) {
            this.ciLoanGuardianModel.guardianAadharNumber = this.responseModel.data[0].guardianAadharNumber;
          }
          if (this.responseModel.data[0].guardianMobileNumber != null && this.responseModel.data[0].guardianMobileNumber != undefined) {
            this.ciLoanGuardianModel.guardianMobileNumber = this.responseModel.data[0].guardianMobileNumber;
          }
          if (this.responseModel.data[0].guardianEmailId != null && this.responseModel.data[0].guardianEmailId != undefined) {
            this.ciLoanGuardianModel.guardianEmailId = this.responseModel.data[0].guardianEmailId;
          }
          if (this.responseModel.data[0].uploadFilePath != null && this.responseModel.data[0].uploadFilePath != undefined) {
            this.ciLoanGuardianModel.guardainMultipartList = this.fileUploadService.getFile(this.responseModel.data[0].uploadFilePath, ERP_TRANSACTION_CONSTANTS.MEMBERSHIP + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.responseModel.data[0].uploadFilePath);
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
   * @implements fileUpload service
   * @param event 
   * @param fileUpload 
   * @param filePathName 
   */
  fileUploader(event: any, fileUpload: FileUpload , filePathName:any) {
    this.isFileUploaded = applicationConstants.FALSE;
    this.multipleFilesList = [];
    if(this.ciLoanNomineeModel != null && this.ciLoanNomineeModel != undefined && this.isEdit && this.ciLoanNomineeModel.filesDTOList == null || this.ciLoanNomineeModel.filesDTOList == undefined){
        this.ciLoanNomineeModel.filesDTOList = [];
    }
    if(this.isEdit && this.ciLoanGuardianModel != null && this.ciLoanGuardianModel != undefined && this.ciLoanGuardianModel.filesDTO == null || this.ciLoanGuardianModel.filesDTO == undefined){
      this.ciLoanGuardianModel.filesDTO = [];
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
        if (filePathName === "Nominee") {
          this.ciLoanNomineeModel.filesDTOList.push(files); 
          this.ciLoanNomineeModel.nomineeFilePath = null;
          this.ciLoanNomineeModel.filesDTOList[this.ciLoanNomineeModel.filesDTOList.length-1].fileName = "CI_LOAN_NOMINEE" + this.ciLoanApplicationId + "_" + timeStamp + "_" + file.name;
          this.ciLoanNomineeModel.nomineeFilePath = "CI_LOAN_NOMINEE" + this.ciLoanApplicationId + "_" +timeStamp+"_"+ file.name; 
        }
        if (filePathName === "Guardain") {
          this.ciLoanGuardianModel.filesDTO.push(files); 
          this.ciLoanGuardianModel.uploadFilePath = null;
          this.ciLoanGuardianModel.filesDTO[this.ciLoanGuardianModel.filesDTO.length-1].fileName = "CI_LOAN_GUARDAIN" + "_" + timeStamp + "_" + file.name;
          this.ciLoanGuardianModel.uploadFilePath = "CI_LOAN_GUARDAIN" + "_" + timeStamp + "_" + file.name; 
        }
        this.updateData();
      }
      reader.readAsDataURL(file);
    }
  }


  onImageSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.fileName = file.name;
    }
  }
/**
 * @implements gurdaind from validation
 */
  guardainFormValidation() {
    if (this.age <= 18) {
    this.nomineeForm.get('relationNameOfGuardian')?.enable();
    this.nomineeForm.get('guardianName')?.enable();
    this.nomineeForm.get('guardianAadhar')?.enable();
    this.nomineeForm.get('guardianMobile')?.enable();
    this.nomineeForm.get('guardianEmail')?.enable();
   

      this.guarntorDetailsFalg = true;
      const controlName = this.nomineeForm.get('relationNameOfGuardian');
      if (controlName) {
        controlName.setValidators([
          Validators.required,
        ]);
        controlName.updateValueAndValidity();
      }
      const controlTow = this.nomineeForm.get('guardianName');
      if (controlTow) {
        controlTow.setValidators([
          Validators.required,
          Validators.pattern(applicationConstants.NAME_PATTERN)
        ]);
        controlTow.updateValueAndValidity();
      }
      const controlFour = this.nomineeForm.get('guardianAadhar');
      if (controlFour) {
        controlFour.setValidators([
          Validators.required,
          Validators.pattern(applicationConstants.AADHAR_PATTERN)
        ]);
        controlFour.updateValueAndValidity();
      }
      const controlFive = this.nomineeForm.get('guardianMobile');
      if (controlFive) {
        controlFive.setValidators([
          Validators.required,
          Validators.pattern(applicationConstants.MOBILE_PATTERN)
        ]);
        controlFive.updateValueAndValidity();
      }
      this.updateData();
    }
  }

  /**
   * @implements getNomineeHistory
   * @param accountNumber 
   */
  // getNomineeHistoryByRdAccountNumber(accountNumber: any) {
  //   this.ciLoanNomineeService.getNomineeByAccountNumber(accountNumber).subscribe((response: any) => {
  //     this.responseModel = response;
  //     if (this.responseModel != null && this.responseModel != undefined) {
  //       if (this.responseModel.status != null && this.responseModel.status != undefined && this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
  //         if (this.responseModel.data != null && this.responseModel.data != undefined && this.responseModel.data.length > 0) {
  //           this.nomineeHistoryList = this.responseModel.data;
  //         }
  //       }
  //       else {
  //         this.msgs = [];
  //         this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: this.responseModel.statusMsg }];
  //         setTimeout(() => {
  //           this.msgs = [];
  //         }, 2000);
  //       }
  //     }
  //   },
  //     error => {
  //       this.msgs = [];
  //       this.commonComponent.stopSpinner();
  //       this.msgs = [{ severity: 'error', detail: applicationConstants.SERVER_DOWN_ERROR }];
  //       setTimeout(() => {
  //         this.msgs = [];
  //       }, 2000);
  //     });
  // }

  /**
   * @implements gurdain form validation based on guardain type
   */
  guardaindisable(){
    this.nomineeForm.get('relationNameOfGuardian')?.disable();
    this.nomineeForm.get('guardianName')?.disable();
    this.nomineeForm.get('guardianAadhar')?.disable();
    this.nomineeForm.get('guardianMobile')?.disable();
    this.nomineeForm.get('guardianEmail')?.disable();
    this.updateData();
  }

  /**
   * @implements nominee form validation
   */
  nomineeFormValidation() {
    this.nomineeForm.get('relationName')?.disable();
    this.nomineeForm.get('nomineeName')?.disable();
    this.nomineeForm.get('aadhaar')?.disable();
    this.nomineeForm.get('mobileNumber')?.disable();
    this.nomineeForm.get('email')?.disable();
    this.nomineeForm.get('fileUpload')?.disable();
    this.updateData();
  }
  /**
   * @implements nominee required valdation
   */
  nomineeValidatorsRequired(){
    this.nomineeForm.get('relationName')?.enable();
    this.nomineeForm.get('nomineeName')?.enable();
    this.nomineeForm.get('aadhaar')?.enable();
    this.nomineeForm.get('mobileNumber')?.enable();
    this.nomineeForm.get('email')?.enable();
    this.nomineeForm.get('fileUpload')?.enable();
    const controlName = this.nomineeForm.get('relationName');
    if (controlName) {
      controlName.setValidators([
        Validators.required,
      ]);
      controlName.updateValueAndValidity();
    }
    
    const controlTow = this.nomineeForm.get('nomineeName');
    if (controlTow) {
      controlTow.setValidators([
        Validators.required,
        Validators.pattern(applicationConstants.NAME_PATTERN)
      ]);
      controlTow.updateValueAndValidity();
    }
    const controlFour = this.nomineeForm.get('aadhaar');
    if (controlFour) {
      controlFour.setValidators([
        Validators.required,
        Validators.pattern(applicationConstants.AADHAR_PATTERN)
      ]);
      controlFour.updateValueAndValidity();
    }
    const controlFive = this.nomineeForm.get('mobileNumber');
    if (controlFive) {
      controlFive.setValidators([
        Validators.required,
        Validators.pattern(applicationConstants.MOBILE_PATTERN)
      ]);
      controlFive.updateValueAndValidity();
    }
    this.updateData();
  }

  /**
   * @implements nominee not required validation 
   */
  nomineeValidatorsFormNotRequired(){
    const controlName = this.nomineeForm.get('relationName');
    if (controlName) {
      controlName.setValidators(null); // Set the required validator null
      controlName.updateValueAndValidity();
    }

    const controlTow = this.nomineeForm.get('nomineeName');
    if (controlTow) {
      controlTow.setValidators(null); // Set the required validator null
      controlTow.updateValueAndValidity();
    }
    const controlFour = this.nomineeForm.get('aadhaar');
    if (controlFour) {
      controlFour.setValidators(null); // Set the required validator null
      controlFour.updateValueAndValidity();
    }
    const controlFive = this.nomineeForm.get('mobileNumber');
    if (controlFive) {
      controlFive.setValidators(null); // Set the required validator null
      controlFive.updateValueAndValidity();
    }
    this.updateData();
  }

  /**
   * @implements onFileremove from file value
   * @param fileName 
   */
  fileRemoeEvent(fileName :any){
    if(fileName == "Nominee"){
      if(this.ciLoanNomineeModel.filesDTOList != null && this.ciLoanNomineeModel.filesDTOList != undefined && this.ciLoanNomineeModel.filesDTOList.length > 0){
        let removeFileIndex = this.ciLoanNomineeModel.filesDTOList.findIndex((obj:any) => obj && obj.fileName === this.ciLoanNomineeModel.nomineeFilePath);
        this.ciLoanNomineeModel.filesDTOList[removeFileIndex] = null;
        this.ciLoanNomineeModel.nomineeFilePath = null;
      }
    }
    if(fileName == "Guardain"){
      if(this.ciLoanGuardianModel.filesDTO != null && this.ciLoanGuardianModel.filesDTO != undefined && this.ciLoanGuardianModel.filesDTO.length > 0){
        let removeFileIndex = this.ciLoanGuardianModel.filesDTO.findIndex((obj:any) => obj && obj.fileName === this.ciLoanGuardianModel.kycFilePath);
        this.ciLoanGuardianModel.filesDTO[removeFileIndex] = null;
        this.ciLoanGuardianModel.kycFilePath = null;
      }
    }
  }
/**
 * @implements onChange new Nominee
 * @param flag 
 */
  newNomineeType(flag:boolean){
    this.newNominee = true;
      this.noNominee = false;
      //onchange on update
      if(flag){
        let nomineeId = null;
        if(this.ciLoanNomineeModel != null && this.ciLoanNomineeModel != undefined && this.ciLoanNomineeModel.id  != null && this.ciLoanNomineeModel.id  != undefined){
          nomineeId = this.ciLoanNomineeModel.id ;
        }
        this.ciLoanNomineeModel = new CiLoanNominee();
        if(nomineeId != null && nomineeId != undefined){
          this.ciLoanNomineeModel.id = nomineeId;
        }
      }
      this.ciLoanNomineeModel.nomineeType = 1;
      this.nomineeValidatorsRequired();
  }

  /**
   * @implements sameAsmemberNominee onChange
   * @param flag 
   */
  samAsMemberNomineeType(flag:boolean){
    this.newNominee = true;
    this.noNominee = false;
    //onchange on update
    if(flag){
      let nomineeId = null;
      if(this.ciLoanNomineeModel != null && this.ciLoanNomineeModel != undefined && this.ciLoanNomineeModel.id  != null && this.ciLoanNomineeModel.id  != undefined){
        nomineeId = this.ciLoanNomineeModel.id ;
      }
      this.ciLoanNomineeModel = new CiLoanNominee();
      if(nomineeId != null && nomineeId != undefined){
        this.ciLoanNomineeModel.id = nomineeId;
      }
      if(this.admissionNumber != null && this.admissionNumber != undefined){
        this.getMemberNomineDetailsByAdmissionNumber(this.admissionNumber);
      }
    }
    this.ciLoanNomineeModel.nomineeType = 2;
    this.nomineeFormValidation();
  }

  /**
   * @implements noNomineeType OnChange
   * @param flag 
   */
  noNomineeType(flag : boolean){
    this.noNominee = true;
    this.newNominee = false;
    this.sameAsMembershipNominee = false;
    if(flag){
      let nomineeId = null;//onchange on update

      let signedCopyPath = null;
      if(this.ciLoanNomineeModel != null && this.ciLoanNomineeModel != undefined){
        if(this.ciLoanNomineeModel.id  != null && this.ciLoanNomineeModel.id  != undefined){
          nomineeId = this.ciLoanNomineeModel.id ;
        }
        if(this.ciLoanNomineeModel.nomineeFilePath  != null && this.ciLoanNomineeModel.nomineeFilePath  != undefined){
          signedCopyPath = this.ciLoanNomineeModel.nomineeFilePath ;
          this.ciLoanNomineeModel.nomineeFilePath = this.fileUploadService.getFile(this.ciLoanNomineeModel.nomineeFilePath , ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.ciLoanNomineeModel.nomineeFilePath);
        }
      }
      this.ciLoanNomineeModel = new CiLoanNominee();
      if(nomineeId != null && nomineeId != undefined){
        this.ciLoanNomineeModel.id = nomineeId;
      }
      this.ciLoanNomineeModel.nomineeType = 3;
      if(signedCopyPath != null && signedCopyPath != undefined){
      this.ciLoanNomineeModel.nomineeFilePath = signedCopyPath;
      }
    }
    this.nomineeValidatorsFormNotRequired();
    // this.newNominee = false;
  }

  /**
   * @implements new guardain Onchage
   * @param flag 
   */
  newGuardainType(flag : boolean){
    this.courtAppointedGuardain = false;
      this.sameAsMemberGuardain = true;
      this.noGuardain  = false;
      //onchange on update
      if(flag){
        let guardainId = null;
        if(this.ciLoanGuardianModel != null && this.ciLoanGuardianModel != undefined && this.ciLoanGuardianModel.id  != null && this.ciLoanGuardianModel.id  != undefined){
          guardainId = this.ciLoanGuardianModel.id ;
        }
        this.ciLoanGuardianModel = new CiLoanGuardian();
        this.ciLoanGuardianModel.id = guardainId;
      }
      this.ciLoanGuardianModel.guardianType = 1;
      this.guardainFormValidation();
  }
/**
 * @implements sameAsMember gurdain Onchage
 * @param flag 
 */
  sameAsMemberGuardianType(flag:boolean){
    this.sameAsMemberGuardain = true;
    this.courtAppointedGuardain = false;
    this.noGuardain  = false;
    //onchange on update
    if(flag){
      let guardainId = null;
      if(this.ciLoanGuardianModel != null && this.ciLoanGuardianModel != undefined && this.ciLoanGuardianModel.id  != null && this.ciLoanGuardianModel.id  != undefined){
        guardainId = this.ciLoanGuardianModel.id ;
      }
      this.ciLoanGuardianModel = new CiLoanGuardian();
      this.ciLoanGuardianModel.id = guardainId;
      this.getGaurdainFromMemberModule(this.admissionNumber);//get from member module
    }
    this.ciLoanGuardianModel.guardianType = 2;
    this.guardaindisable();
  }

  noGuardainaType(flag:boolean){
    this.courtAppointedGuardain = true;
    this.sameAsMemberGuardain = false;
    this.noGuardain  = true;
    //onchange on update
    let guardainId = null;
    if(flag){
      let uploadFilePath = null;
      if(this.ciLoanGuardianModel != null && this.ciLoanGuardianModel != undefined){
        if(this.ciLoanGuardianModel.id  != null && this.ciLoanGuardianModel.id  != undefined){
          guardainId = this.ciLoanGuardianModel.id ;
        }
       
        if(this.ciLoanGuardianModel.kycFilePath  != null && this.ciLoanGuardianModel.kycFilePath  != undefined){
          uploadFilePath = this.ciLoanGuardianModel.kycFilePath ;
          this.ciLoanGuardianModel.guardainMultipartList =this.fileUploadService.getFile(this.ciLoanGuardianModel.kycFilePath , ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.ciLoanGuardianModel.kycFilePath);
        }
      } 
      this.ciLoanGuardianModel = new CiLoanGuardian();
      if(guardainId != null && guardainId != undefined){
        this.ciLoanGuardianModel.id = guardainId;
      }
     
    }
    this.ciLoanGuardianModel.guardianType = 3;
    this.guardaindisable();
  }
}
