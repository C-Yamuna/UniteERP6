import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SelectItem } from 'primeng/api/public_api';
import { MemberGroupDetailsModel, MembershipBasicRequiredDetails, MembershipInstitutionDetailsModel } from '../term-loan-new-membership/shared/term-loan-new-membership.model';
import { TermApplication } from '../term-loan-application-details/shared/term-application.model';
import { TermLoanGuardianDetails, TermLoanNominee } from './shared/term-loan-nominee.model';
import { Responsemodel } from 'src/app/shared/responsemodel';
import { CommonComponent } from 'src/app/shared/common.component';
import { CommonFunctionsService } from 'src/app/shared/commonfunction.service';
import { FileUploadService } from 'src/app/shared/file-upload.service';
import { DatePipe } from '@angular/common';
import { EncryptDecryptService } from 'src/app/shared/encrypt-decrypt.service';
import { TermLoanNomineeService } from './shared/term-loan-nominee.service';
import { TermApplicationService } from '../term-loan-application-details/shared/term-application.service';
import { applicationConstants } from 'src/app/shared/applicationConstants';
import { ERP_TRANSACTION_CONSTANTS } from 'src/app/transcations/erp-transaction-constants';
import { FileUpload } from 'primeng/fileupload';
import { FileUploadModel } from 'src/app/layout/mainmenu/shared/file-upload-model.model';

@Component({
  selector: 'app-term-loans-nominee',
  templateUrl: './term-loans-nominee.component.html',
  styleUrls: ['./term-loans-nominee.component.css']
})
export class TermLoansNomineeComponent {
  nomineeForm: FormGroup;
  guarantorDetailsForm: any;
  nominee: any;
  nomineeList: any;
  checked: any;
  newNominee: boolean = false;
  sameAsMembershipNominee: boolean = false;
  noNominee: boolean = false;
  responseModel!: Responsemodel;
  msgs: any[] = [];
  termLoanNomineeModel: TermLoanNominee = new TermLoanNominee();
  termLoanGuardianDetailsModel:TermLoanGuardianDetails = new TermLoanGuardianDetails();
  termLoanApplicationModel: TermApplication = new TermApplication();
  membershipBasicRequiredDetailsModel: MembershipBasicRequiredDetails = new MembershipBasicRequiredDetails();
  memberGroupDetailsModel: MemberGroupDetailsModel = new MemberGroupDetailsModel();
  membershipInstitutionDetailsModel: MembershipInstitutionDetailsModel = new MembershipInstitutionDetailsModel();
  fileName: any;
  termLoanApplicationId: any;
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
  constructor(private formBuilder: FormBuilder,
    private commonComponent: CommonComponent, private activateRoute: ActivatedRoute, private encryptDecryptService: EncryptDecryptService,
    private commonFunctionsService: CommonFunctionsService, private datePipe: DatePipe,
    private termLoanApplicationsService: TermApplicationService,
    private termLoanNomineeService: TermLoanNomineeService, private fileUploadService: FileUploadService) {

      this.nomineeForm = this.formBuilder.group({
        relationName:['', ],
        nomineeName: ['', ],
        // age: new FormControl(['', [Validators.pattern(applicationConstants.ALLOW_NEW_NUMBERS), Validators.maxLength(40), Validators.pattern(/^[^\s]+(\s.*)?$/), Validators.compose([Validators.required])]],),
        aadhaar: ['', ],
        mobileNumber:['', ],
        email: ['', ],
        dateOfBirth: new FormControl('', ),
        remarks: new FormControl('', ),
        // 'nomineeAddres': new FormControl('', Validators.required),
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
            this.termLoanApplicationId = Number(queryParams);
            this.getTermApplicationByTermAccId(this.termLoanApplicationId);
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
      if (this.age <= 18) {
        this.termLoanGuardianDetailsModel.termLoanApplicationId = this.termLoanApplicationId ;
        this.termLoanGuardianDetailsModel.accountNumber = this.accountNumber;
        this.termLoanNomineeModel.termMemberGuardianDetailsDTO = this.termLoanGuardianDetailsModel;
      }
      else {
        this.termLoanNomineeModel.termMemberGuardianDetailsDTO = null;
      }
      this.termLoanNomineeModel.termLoanApplicationId = this.termLoanApplicationId;
      this.termLoanApplicationsService.changeData({
        formValid: !this.nomineeForm.valid ? true : false,
        data: this.termLoanNomineeModel,
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
        this.samAsMemberNimineeType(flag);
      }
      else if (event == 3) {//no nominee
        this.noNimineeType(flag);
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
  
    /**
     * @implements memberType Check For Guardian And Nominee typwe List
    
     */
    memberTypeCheck(memberTypeName : any){
      if(memberTypeName != "Individual"){
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
  
    //nominee details by term loan account id
    getNomineeDetailsByTermAccId(termLoanApplicationId: any) {
      this.termLoanNomineeService.getNomineeDetailsByTermAccId(termLoanApplicationId).subscribe((response: any) => {
        this.responseModel = response;
        if (this.responseModel != null && this.responseModel != undefined) {
          if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
            if (this.responseModel.data.length > 0 &&  this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
              this.termLoanNomineeModel = this.responseModel.data[0];
              if (this.termLoanNomineeModel.nomineeDob != null && this.termLoanNomineeModel.nomineeDob != undefined) {
                this.termLoanNomineeModel.nomineeDobVal = this.datePipe.transform(this.termLoanNomineeModel.nomineeDob, this.orgnizationSetting.datePipe);
              }
              if (this.termLoanNomineeModel.nomineeType!= 0) {
                  this.onChange(this.termLoanNomineeModel.nomineeType, this.flag);
              }
              this.nomineeEdit = true;
            }
            this.updateData();
          }
          else {
            this.msgs = [];
            this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: this.responseModel.statusMsg }];
            setTimeout(() => {
              this.msgs = [];
            }, 2000);
          }
        }
        
      })
    }
    //get term loan account details for header data  
    getTermApplicationByTermAccId(id: any) {
      this.termLoanApplicationsService.getTermApplicationByTermAccId(id).subscribe((data: any) => {
        this.responseModel = data;
        if (this.responseModel != null && this.responseModel != undefined) {
          if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
            if (this.responseModel.data.length > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
              this.termLoanApplicationModel = this.responseModel.data[0];
              if(this.responseModel.data[0].memberTypeName != null && this.responseModel.data[0].memberTypeName != undefined){
                this.memberTypeName = this.responseModel.data[0].memberTypeName;
                this.memberTypeCheck(this.memberTypeName);
              }
              if(this.responseModel.data[0].admissionNo != null && this.responseModel.data[0].admissionNo != undefined){
                this.admissionNumber = this.responseModel.data[0].admissionNo;
              }
              if(this.responseModel.data[0].accountNumber != null && this.responseModel.data[0].accountNumber != undefined){
                this.accountNumber = this.responseModel.data[0].accountNumber;
                if(this.historyFLag){
                  this.getNomineeHistoryByTermAccountNumber(this.accountNumber);
                }
              }
              if(this.responseModel.data[0].individualMemberDetailsDTO.age != null && this.responseModel.data[0].individualMemberDetailsDTO.age != undefined){
                this.age = this.responseModel.data[0].individualMemberDetailsDTO.age;
                if(this.age < 18){
                  this.guarntorDetailsFalg = true;
                }
              }
              if(this.responseModel.data[0].termLoanNomineeDetailsDTO != null && this.responseModel.data[0].termLoanNomineeDetailsDTO != undefined){
                this.termLoanNomineeModel = this.responseModel.data[0].termLoanNomineeDetailsDTO;
                if(this.termLoanNomineeModel.nomineeFilePath != null && this.termLoanNomineeModel.nomineeFilePath != undefined){
                  this.termLoanNomineeModel.multipartFileList =  this.fileUploadService.getFile(this.termLoanNomineeModel.nomineeFilePath , ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.termLoanNomineeModel.nomineeFilePath);
                }
              }
              if(this.responseModel.data[0].termMemberGuardianDetailsDTO != null && this.responseModel.data[0].termMemberGuardianDetailsDTO != undefined){
                this.termLoanGuardianDetailsModel = this.responseModel.data[0].termMemberGuardianDetailsDTO;
                if(this.termLoanGuardianDetailsModel.uploadFilePath != null && this.termLoanGuardianDetailsModel.uploadFilePath != undefined){
                  this.termLoanGuardianDetailsModel.guardainSighnedMultipartFiles =  this.fileUploadService.getFile(this.termLoanGuardianDetailsModel.uploadFilePath , ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.termLoanGuardianDetailsModel.uploadFilePath);
                }
              }
              if(this.termLoanNomineeModel.nomineeType != null && this.termLoanNomineeModel.nomineeType != undefined){
                this.onChange(this.termLoanNomineeModel.nomineeType, this.flag);
                // this.nomineeTypeDisable = true;
                // if(this.termLoanNomineeModel.nomineeType == 1 || this.termLoanNomineeModel.nomineeType == 2){
                //     this.newNominee = true;
                //     this.noNominee = false;
                //     this.sameAsMemberGuardain = false;
                // }
                // else if(this.termLoanNomineeModel.nomineeType == 3){
                //   this.newNominee = false;
                //   this.noNominee = true;
                //   this.sameAsMemberGuardain = false;
                // }
              }
              if( this.guarntorDetailsFalg && this.termLoanGuardianDetailsModel.guardianType != null && this.termLoanGuardianDetailsModel.guardianType != undefined){
                this.onChangeGuardain(this.termLoanGuardianDetailsModel.guardianType , this.flag);
                // this.guardainTypeDisable = true;
                // if(this.termLoanGuardianDetailsModel.guardianType == 1 || this.termLoanGuardianDetailsModel.guardianType == 2){
                //   this.sameAsMemberGuardain = true;
                //   this.courtAppointedGuardain = false;
                //   this.noGuardain  = false;
                //   this.guardainFormValidation();
                // }
                // else if(this.termLoanGuardianDetailsModel.guardianType == 3){
                //   this.courtAppointedGuardain = true;
                //   this.sameAsMemberGuardain = false;
                //   this.noGuardain  = true;
                //   this.guardaindisable();
                // }
              }
              else if(this.guarntorDetailsFalg){
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
  
    //get guardian details by account Number
 
    getGuardianDetails(accountNumber: any) {
      this.termLoanNomineeService.getguardianDetailsByTermAccId(accountNumber).subscribe((response: any) => {
        this.responseModel = response;
        if (this.responseModel != null && this.responseModel != undefined) {
          if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
            if (this.responseModel.data.length > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
              this.termLoanGuardianDetailsModel = this.responseModel.data[0];
              if (this.termLoanGuardianDetailsModel.guardianDob != null && this.termLoanGuardianDetailsModel.guardianDob != undefined) {
                this.termLoanGuardianDetailsModel.guardianDobVal = this.datePipe.transform(this.termLoanGuardianDetailsModel.guardianDob, this.orgnizationSetting.datePipe);
              }
              if(this.termLoanGuardianDetailsModel.guardianType != null && this.termLoanGuardianDetailsModel.guardianType != undefined){
                this.onChangeGuardain(this.termLoanGuardianDetailsModel.guardianType , this.flag);
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
    getMemberDetailsByAdmissionNumber(admisionNumber: any) {
      this.termLoanApplicationsService.getMemberByAdmissionNumber(admisionNumber).subscribe((response: any) => {
        this.responseModel = response;
        if (this.responseModel != null && this.responseModel != undefined) {
          if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
            if (this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
              this.membershipBasicRequiredDetailsModel = this.responseModel.data[0];
              if (this.membershipBasicRequiredDetailsModel.dob != null && this.membershipBasicRequiredDetailsModel.dob != undefined) {
                this.membershipBasicRequiredDetailsModel.dobVal = this.datePipe.transform(this.membershipBasicRequiredDetailsModel.dob, this.orgnizationSetting.datePipe);
              }
              if (this.membershipBasicRequiredDetailsModel.admissionDate != null && this.membershipBasicRequiredDetailsModel.admissionDate != undefined) {
                this.membershipBasicRequiredDetailsModel.admissionDateVal = this.datePipe.transform(this.membershipBasicRequiredDetailsModel.admissionDate, this.orgnizationSetting.datePipe);
              }
              if(this.membershipBasicRequiredDetailsModel.age != null && this.membershipBasicRequiredDetailsModel.age != undefined){
                
              }
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
              if (this.memberGroupDetailsModel.groupPromotersDTOList.length > 0) {
                this.promoterDetails = this.memberGroupDetailsModel.groupPromotersDTOList;
                this.promoterDetails = this.memberGroupDetailsModel.groupPromotersDTOList.map((member: any) => {
                  member.memDobVal = this.datePipe.transform(member.dob, this.orgnizationSetting.datePipe);
                  member.startDateVal = this.datePipe.transform(member.startDate, this.orgnizationSetting.datePipe);
                  return member;
                });
              }
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
              if (this.membershipInstitutionDetailsModel.institutionPromoterList.length > 0)
                this.institutionPromoter = this.membershipInstitutionDetailsModel.institutionPromoterList;
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
     * @implements load membermodule data
    
     */
    loadMembershipData(){
      if (this.memberTypeName == "Individual") {
        this.getMemberDetailsByAdmissionNumber(this.admissionNumber);
      } else if (this.memberTypeName == "Group") {
        this.getGroupByAdmissionNumber(this.admissionNumber);
      } else if (this.memberTypeName == "Institution") {
        this.getInstitutionByAdmissionNumber(this.admissionNumber);
      }
    }
  
    /**
     * @implements getNominee from member module
     * @param admissionNumber 
    
     */
    getNomineeFromMemberModule(admissionNumber : any){
      this.termLoanNomineeService.getNomineeFromMemberModuleByAdmissionNumber(admissionNumber).subscribe((response: any) => {
        this.responseModel = response;
        if (this.responseModel != null && this.responseModel != undefined) {
          if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
            if (this.responseModel.data.length > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
              this.termLoanNomineeModel = this.responseModel.data[0];
              if (this.termLoanNomineeModel.nomineeDob != null && this.termLoanNomineeModel.nomineeDob != undefined) {
                this.termLoanNomineeModel.nomineeDobVal = this.datePipe.transform(this.termLoanNomineeModel.nomineeDob, this.orgnizationSetting.datePipe);
              }
              // if (this.termLoanNomineeModel.nominatedDate != null && this.termLoanNomineeModel.nominatedDate != undefined) {
              //   this.termLoanNomineeModel.nominatedDateVal = this.datePipe.transform(this.termLoanNomineeModel.nominatedDateVal, this.orgnizationSetting.datePipe);
              // }
              if(this.responseModel.data[0].email != null && this.responseModel.data[0].email != undefined){
                this.termLoanNomineeModel.nomineeEmailId = this.responseModel.data[0].email;
              }
              if(this.responseModel.data[0].relationTypeId != null && this.responseModel.data[0].relationTypeId != undefined){
                this.termLoanNomineeModel.relationTypeId = this.responseModel.data[0].relationTypeId;
                this.getAllRelationTypes();
              }
              if(this.responseModel.data[0].relationTypeName != null && this.responseModel.data[0].relationTypeName != undefined){
                this.termLoanNomineeModel.relationTypeName = this.responseModel.data[0].relationTypeName;
              }
              if(this.responseModel.data[0].nomineeAadharNumber != null && this.responseModel.data[0].nomineeAadharNumber != undefined){
                this.termLoanNomineeModel.nomineeAadharNumber = this.responseModel.data[0].nomineeAadharNumber;
              }
              if(this.responseModel.data[0].nomineeMobileNumber != null && this.responseModel.data[0].nomineeMobileNumber != undefined){
                this.termLoanNomineeModel.nomineeMobileNumber = this.responseModel.data[0].nomineeMobileNumber;
              }
              if(this.responseModel.data[0].nomineeName != null && this.responseModel.data[0].nomineeName != undefined){
                this.termLoanNomineeModel.nomineeName = this.responseModel.data[0].nomineeName;
              }
              // if(this.responseModel.data[0].nomineeFilePath != null && this.responseModel.data[0].nomineeFilePath != undefined){
              //   this.termLoanNomineeModel.addressProofCopyPath = this.responseModel.data[0].nomineeFilePath;
              // }
              
              this.termLoanNomineeModel.nomineeType = 2;
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
      this.termLoanNomineeService.getGardianFromMemberModuleByAdmissionNumber(admissionNumber).subscribe((response: any) => {
        this.responseModel = response;
        if (this.responseModel != null && this.responseModel != undefined) {
          if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
            if (this.responseModel.data.length > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
              if (this.responseModel.data[0].guardianDob != null && this.responseModel.data[0].guardianDob != undefined) {
                this.termLoanGuardianDetailsModel.guardianDobVal = this.datePipe.transform(this.responseModel.data[0].guardianDob, this.orgnizationSetting.datePipe);
              }
              if (this.responseModel.data[0].guardianName != null && this.responseModel.data[0].guardianName != undefined) {
                this.termLoanGuardianDetailsModel.guardianName = this.responseModel.data[0].guardianName;
              }
              if (this.responseModel.data[0].guardianAadharNumber != null && this.responseModel.data[0].guardianAadharNumber != undefined) {
                this.termLoanGuardianDetailsModel.guardianAadharNumber = this.responseModel.data[0].guardianAadharNumber;
              }
              if (this.responseModel.data[0].guardianMobileNumber != null && this.responseModel.data[0].guardianMobileNumber != undefined) {
                this.termLoanGuardianDetailsModel.guardianMobileNumber = this.responseModel.data[0].guardianMobileNumber;
              }
              if (this.responseModel.data[0].guardianEmailId != null && this.responseModel.data[0].guardianEmailId != undefined) {
                this.termLoanGuardianDetailsModel.guardianEmailId = this.responseModel.data[0].guardianEmailId;
              }
              if (this.responseModel.data[0].relationshipTypeId != null && this.responseModel.data[0].relationshipTypeId != undefined) {
                this.termLoanGuardianDetailsModel.relationshipTypeId = this.responseModel.data[0].relationshipTypeId;
              }
              if (this.responseModel.data[0].guardianDob != null && this.responseModel.data[0].guardianDob != undefined) {
                this.termLoanGuardianDetailsModel.guardianDobVal = this.responseModel.data[0].guardianDob;
              }
              if (this.responseModel.data[0].guardianAge != null && this.responseModel.data[0].guardianAge != undefined) {
                this.termLoanGuardianDetailsModel.guardianAge = this.responseModel.data[0].guardianAge;
              }
              if (this.responseModel.data[0].guardianAge != null && this.responseModel.data[0].guardianAge != undefined) {
                this.termLoanGuardianDetailsModel.guardianAge = this.responseModel.data[0].guardianAge;
              }
              if (this.responseModel.data[0].guardianAge != null && this.responseModel.data[0].guardianAge != undefined) {
                this.termLoanGuardianDetailsModel.guardianAge = this.responseModel.data[0].guardianAge;
              }
  
              this.updateData();
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
      if(this.termLoanNomineeModel != null && this.termLoanNomineeModel != undefined && this.isEdit && this.termLoanNomineeModel.filesDTOList == null || this.termLoanNomineeModel.filesDTOList == undefined){
          this.termLoanNomineeModel.filesDTOList = [];
      }
      if(this.isEdit && this.termLoanGuardianDetailsModel != null && this.termLoanGuardianDetailsModel != undefined && this.termLoanGuardianDetailsModel.filesDTO == null || this.termLoanGuardianDetailsModel.filesDTO == undefined){
        this.termLoanGuardianDetailsModel.filesDTO = [];
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
            this.termLoanNomineeModel.filesDTOList.push(files); 
            this.termLoanNomineeModel.nomineeFilePath = null;
            this.termLoanNomineeModel.filesDTOList = files;
            this.termLoanNomineeModel.filesDTOList[this.termLoanNomineeModel.filesDTOList.length-1].fileName = "TERM_LOAN_NOMINEE" + this.termLoanApplicationId + "_" + timeStamp + "_" + file.name;
            this.termLoanNomineeModel.nomineeFilePath = "TERM_LOAN_NOMINEE" + this.termLoanApplicationId + "_" +timeStamp+"_"+ file.name; 
          }
          if (filePathName === "Guardain") {
            this.termLoanGuardianDetailsModel.filesDTO.push(files); 
            this.termLoanGuardianDetailsModel.uploadFilePath = null;
            this.termLoanGuardianDetailsModel.filesDTO = files;
            this.termLoanGuardianDetailsModel.filesDTO.fileName = "TERM_LOAN_GUARDAIN" + "_" + timeStamp + "_" + file.name;
            this.termLoanGuardianDetailsModel.uploadFilePath = "TERM_LOAN_GUARDAIN" + "_" + timeStamp + "_" + file.name; 
          }
          this.updateData();
        }
        reader.readAsDataURL(file);
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
    getNomineeHistoryByTermAccountNumber(accountNumber: any) {
      this.termLoanNomineeService.getNomineeDetailsByTermAccId(accountNumber).subscribe((response: any) => {
        this.responseModel = response;
        if (this.responseModel != null && this.responseModel != undefined) {
          if (this.responseModel.status != null && this.responseModel.status != undefined && this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
            if (this.responseModel.data != null && this.responseModel.data != undefined && this.responseModel.data.length > 0) {
              this.nomineeHistoryList = this.responseModel.data;
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
        if(this.termLoanNomineeModel.filesDTOList != null && this.termLoanNomineeModel.filesDTOList != undefined){
          let removeFileIndex = this.termLoanNomineeModel.filesDTOList.findIndex((obj:any) => obj && obj.fileName === this.termLoanNomineeModel.nomineeFilePath);
          this.termLoanNomineeModel.filesDTOList[removeFileIndex] = null;
          this.termLoanNomineeModel.nomineeFilePath = null;
        }
      }
      if(fileName == "Guardain"){
        if(this.termLoanGuardianDetailsModel.filesDTO != null && this.termLoanGuardianDetailsModel.filesDTO != undefined){
          let removeFileIndex = this.termLoanGuardianDetailsModel.filesDTO.findIndex((obj:any) => obj && obj.fileName === this.termLoanGuardianDetailsModel.uploadFilePath);
          this.termLoanGuardianDetailsModel.filesDTO[removeFileIndex] = null;
          this.termLoanGuardianDetailsModel.uploadFilePath = null;
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
          if(this.termLoanNomineeModel != null && this.termLoanNomineeModel != undefined && this.termLoanNomineeModel.id  != null && this.termLoanNomineeModel.id  != undefined){
            nomineeId = this.termLoanNomineeModel.id ;
          }
          this.termLoanNomineeModel = new TermLoanNominee();
          if(nomineeId != null && nomineeId != undefined){
            this.termLoanNomineeModel.id = nomineeId;
          }
        }
        this.termLoanNomineeModel.nomineeType = 1;
        this.nomineeValidatorsRequired();
    }
  
    /**
     * @implements sameAsmemberNominee onChange
     * @param flag 
    
     */
    samAsMemberNimineeType(flag:boolean){
      this.newNominee = true;
      this.noNominee = false;
      //onchange on update
      if(flag){
        let nomineeId = null;
        if(this.termLoanNomineeModel != null && this.termLoanNomineeModel != undefined && this.termLoanNomineeModel.id  != null && this.termLoanNomineeModel.id  != undefined){
          nomineeId = this.termLoanNomineeModel.id ;
        }
        this.termLoanNomineeModel = new TermLoanNominee();
        if(nomineeId != null && nomineeId != undefined){
          this.termLoanNomineeModel.id = nomineeId;
        }
        if(this.admissionNumber != null && this.admissionNumber != undefined){
          this.getNomineeFromMemberModule(this.admissionNumber);
        }
      }
      this.termLoanNomineeModel.nomineeType = 2;
      this.nomineeFormValidation();
    }
  
    /**
     * @implements noNimineeType OnChange
     * @param flag 
    
     */
    noNimineeType(flag : boolean){
      this.noNominee = true;
      this.newNominee = false;
      this.sameAsMembershipNominee = false;
      if(flag){
        let nomineeId = null;//onchange on update
        let remarks = null;
        let nomineeFilePath = null;
        if(this.termLoanNomineeModel != null && this.termLoanNomineeModel != undefined){
          if(this.termLoanNomineeModel.id  != null && this.termLoanNomineeModel.id  != undefined){
            nomineeId = this.termLoanNomineeModel.id ;
          }
          if(this.termLoanNomineeModel.remarks  != null && this.termLoanNomineeModel.remarks  != undefined){
            remarks = this.termLoanNomineeModel.remarks ;
          }
          if(this.termLoanNomineeModel.nomineeFilePath  != null && this.termLoanNomineeModel.nomineeFilePath  != undefined){
            nomineeFilePath = this.termLoanNomineeModel.nomineeFilePath ;
            this.termLoanNomineeModel.nomineeFilePath = this.fileUploadService.getFile(this.termLoanNomineeModel.nomineeFilePath , ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.termLoanNomineeModel.nomineeFilePath);
          }
        }
        this.termLoanNomineeModel = new TermLoanNominee();
        if(nomineeId != null && nomineeId != undefined){
          this.termLoanNomineeModel.id = nomineeId;
        }
        if(remarks != null && remarks != undefined){
          this.termLoanNomineeModel.remarks = remarks;
        }
        this.termLoanNomineeModel.nomineeType = 3;
        if(nomineeFilePath != null && nomineeFilePath != undefined){
        this.termLoanNomineeModel.nomineeFilePath = nomineeFilePath;
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
          if(this.termLoanGuardianDetailsModel != null && this.termLoanGuardianDetailsModel != undefined && this.termLoanGuardianDetailsModel.id  != null && this.termLoanGuardianDetailsModel.id  != undefined){
            guardainId = this.termLoanGuardianDetailsModel.id ;
          }
          this.termLoanGuardianDetailsModel = new TermLoanGuardianDetails();
          this.termLoanGuardianDetailsModel.id = guardainId;
        }
        this.termLoanGuardianDetailsModel.guardianType = 1;
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
        if(this.termLoanGuardianDetailsModel != null && this.termLoanGuardianDetailsModel != undefined && this.termLoanGuardianDetailsModel.id  != null && this.termLoanGuardianDetailsModel.id  != undefined){
          guardainId = this.termLoanGuardianDetailsModel.id ;
        }
        this.termLoanGuardianDetailsModel = new TermLoanGuardianDetails();
        this.termLoanGuardianDetailsModel.id = guardainId;
        this.getGaurdainFromMemberModule(this.admissionNumber);//get from member module
      }
      this.termLoanGuardianDetailsModel.guardianType = 2;
      this.guardaindisable();
    }
  
    noGuardainaType(flag:boolean){
  
      this.courtAppointedGuardain = true;
      this.sameAsMemberGuardain = false;
      this.noGuardain  = true;
      //onchange on update
      let guardainId = null;
      let remarks = null;
      if(flag){
        let gaurdianSignedCopyPath = null;
        if(this.termLoanGuardianDetailsModel != null && this.termLoanGuardianDetailsModel != undefined){
          if(this.termLoanGuardianDetailsModel.id  != null && this.termLoanGuardianDetailsModel.id  != undefined){
            guardainId = this.termLoanGuardianDetailsModel.id ;
          }
          // if(this.termLoanGuardianDetailsModel.remarks  != null && this.termLoanGuardianDetailsModel.remarks  != undefined){
          //   remarks = this.termLoanGuardianDetailsModel.remarks ;
          // }
          if(this.termLoanGuardianDetailsModel.uploadFilePath  != null && this.termLoanGuardianDetailsModel.uploadFilePath  != undefined){
            gaurdianSignedCopyPath = this.termLoanGuardianDetailsModel.uploadFilePath ;
            this.termLoanGuardianDetailsModel.guardainSighnedMultipartFiles =this.fileUploadService.getFile(this.termLoanGuardianDetailsModel.uploadFilePath , ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.termLoanGuardianDetailsModel.uploadFilePath);
          }
        }
    
        this.termLoanGuardianDetailsModel = new TermLoanGuardianDetails();
        if(guardainId != null && guardainId != undefined){
          this.termLoanGuardianDetailsModel.id = guardainId;
        }
        // if(remarks != null && remarks != undefined){
        //   this.termLoanGuardianDetailsModel.remarks = remarks;
        // }
      }
      this.termLoanGuardianDetailsModel.guardianType = 3;
      this.guardaindisable();
    }
}
