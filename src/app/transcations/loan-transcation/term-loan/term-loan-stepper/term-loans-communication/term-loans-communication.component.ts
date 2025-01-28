import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { applicationConstants } from 'src/app/shared/applicationConstants';
import { TermApplicationService } from '../term-loan-application-details/shared/term-application.service';
import { CommonComponent } from 'src/app/shared/common.component';
import { EncryptDecryptService } from 'src/app/shared/encrypt-decrypt.service';
import { TermLoanCommunicationService } from './shared/term-loan-communication.service';
import { CommonFunctionsService } from 'src/app/shared/commonfunction.service';
import { TermLoanNewMembershipService } from '../term-loan-new-membership/shared/term-loan-new-membership.service';
import { Responsemodel } from 'src/app/shared/responsemodel';
import { TermApplication } from '../term-loan-application-details/shared/term-application.model';
import { TermLoanCommunication } from './shared/term-loan-communication.model';
import { TermLoanKyc } from '../term-loans-kyc/shared/term-loan-kyc.model';
import { MemberGroupDetailsModel, MembershipBasicRequiredDetails, MembershipInstitutionDetailsModel } from '../term-loan-new-membership/shared/term-loan-new-membership.model';

@Component({
  selector: 'app-term-loans-communication',
  templateUrl: './term-loans-communication.component.html',
  styleUrls: ['./term-loans-communication.component.css']
})
export class TermLoansCommunicationComponent {
  checked: boolean = false;
  communicationForm: any;
  communication: any;
  membershipBasicRequiredDetailsModel: MembershipBasicRequiredDetails = new MembershipBasicRequiredDetails();
  memberGroupDetailsModel: MemberGroupDetailsModel = new MemberGroupDetailsModel();
  membershipInstitutionDetailsModel: MembershipInstitutionDetailsModel = new MembershipInstitutionDetailsModel();
  termLoanKycModel: TermLoanKyc = new TermLoanKyc();
  termLoanCommunicationModel: TermLoanCommunication = new TermLoanCommunication();
  termLoanApplicationModel: TermApplication = new TermApplication();
  sameAsPermanentAddress: boolean = false;
  responseModel!: Responsemodel;
  accountType: any;
  applicationType: any;
  msgs: any[] = [];
  accountOpeningDateVal: any;
  savedId: any;
  isEdit: any;
  flagForLabelName: any;
  accountOpeningDate: any;
  minBalence: any;
  loanAccId: any;
  statesList: any[] = [];
  districtsList: any[] = [];
  mandalsList: any[] = [];
  villageList: any[] = [];
  orgnizationSetting: any;
  productName: any;
  admissionNumber: any;
  memberTypeId: any;
  memberTypeName: any;
  memberName: any;
  mobileNumber: any;
  qualificationName: any;
  aadharNumber: any;

  individualFlag: boolean = false;
  groupFlag: boolean = false;
  institutionFlag: boolean = false;
  promoterDetails: any[] = [];
  institutionPromoter: any[] = [];
  mobileNumer: any;
  panNumber: any;

  permanentStatesList: any[] = [];
  permanentDistrictList: any[] = [];
  permanentMandalsList: any[] = [];
  permanentVillagesList: any[] = [];


  constructor(private router: Router,
    private formBuilder: FormBuilder,
    private termLoanApplicationsService: TermApplicationService,
    private commonComponent: CommonComponent,
    private activateRoute: ActivatedRoute,
    private encryptDecryptService: EncryptDecryptService,
    private termLoanCommunicationService: TermLoanCommunicationService,
    private commonFunctionsService: CommonFunctionsService,
    private membershipService: TermLoanNewMembershipService,) {
      this.communicationForm = this.formBuilder.group({
        state: new FormControl('', Validators.required),
        district: new FormControl('', Validators.required),
        mandal: new FormControl('', Validators.required),
        village: new FormControl('', Validators.required),
        pinCode: ['', [Validators.pattern(applicationConstants.PINCODE_PATTERN), Validators.compose([Validators.required])]],
        regesteredAddressOne: [{ value: '' }],
        permanentState: new FormControl('', Validators.required),
        permanentDistrict: new FormControl('', Validators.required),
        permanentSubDistrict: new FormControl('', Validators.required),
        permanentVillage: new FormControl('', Validators.required),
        permanentPinCode: ['', [Validators.pattern(applicationConstants.PINCODE_PATTERN), Validators.compose([Validators.required])]],
        permanentAddressOne: [{ value: '' }],
        checked: [{ value: '' }],
      })
    }
  
    ngOnInit(): void {
      this.orgnizationSetting = this.commonComponent.orgnizationSettings();
      this.activateRoute.queryParams.subscribe(params => {
        if (params['id'] != undefined || params['admissionNumber'] != undefined) {
          if (params['id'] != undefined) {
            let id = this.encryptDecryptService.decrypt(params['id']);
            this.loanAccId = Number(id);
            if (params['admissionNumber'] != undefined) {
              this.admissionNumber = this.encryptDecryptService.decrypt(params['admissionNumber']);
            }
            this.getTermApplicationByTermAccId(this.loanAccId);
          }
          // this.isEdit = true;
          if (this.termLoanApplicationModel != null && this.termLoanApplicationModel != null)
            this.flagForLabelName = true;
        } else {
          this.isEdit = false;
          this.flagForLabelName = false;
        }
  
      });
      this.communicationForm.valueChanges.subscribe((data: any) => {
        this.updateData();
      });
      this.getAllStates();
    }
  
    save() {
      this.updateData();
    }
  
    updateData() {
      if (this.statesList != null && this.statesList != undefined && this.statesList.length > 0) {
        let permanentState = this.statesList.find((data: any) => null != data && this.termLoanCommunicationModel.stateId != null && data.value == this.termLoanCommunicationModel.permanentStateId);
        if (permanentState != null && undefined != permanentState) {
          this.termLoanCommunicationModel.permanentStateName = permanentState.label;
        }
      }
      this.termLoanApplicationsService.changeData({
        formValid: this.communicationForm.valid,
        data: this.termLoanCommunicationModel,
        isDisable: !this.communicationForm.valid ? applicationConstants.TRUE : applicationConstants.FALSE,
        stepperIndex: 2,
      });
    }
  
    //member module data by member admission Number
    getMemberDetailsByAdmissionNumber(admissionNumber: any) {
      this.membershipService.getMembershipBasicDetailsByAdmissionNumber(admissionNumber).subscribe((data: any) => {
        this.responseModel = data;
        if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
          if (this.responseModel.data.length > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
            this.membershipBasicRequiredDetailsModel = this.responseModel.data[0];
            if (this.responseModel.data[0].memberShipCommunicationDetailsDTO != null && this.responseModel.data[0].memberShipCommunicationDetailsDTO != undefined){
              this.termLoanCommunicationModel = this.responseModel.data[0].memberShipCommunicationDetailsDTO;
            // this.responseModel.data[0].memberShipCommunicationDetailsDTO;
            // if (this.responseModel.data[0].memberShipCommunicationDetailsDTO.length > 0 && this.responseModel.data[0].memberShipCommunicationDetailsDTO[0] != null && this.responseModel.data[0].memberShipCommunicationDetailsDTO[0] != undefined) {
            //   this.termLoanCommunicationModel = this.responseModel.data[0].memberShipCommunicationDetailsDTO[0];
            }
            if (this.responseModel.data[0].admissionNumber != null && this.responseModel.data[0].admissionNumber != undefined) {
              this.termLoanCommunicationModel.admissionNumber = this.responseModel.data[0].admissionNumber;
            }
            if (this.responseModel.data[0].memberTypeName != null && this.responseModel.data[0].memberTypeName != undefined) {
              this.termLoanCommunicationModel.memberTypeName = this.responseModel.data[0].memberTypeName;
            }
            if (this.responseModel.data[0].memberTypeId != null && this.responseModel.data[0].memberTypeId != undefined) {
              this.termLoanCommunicationModel.memberType = this.responseModel.data[0].memberTypeId;
            }
            if (this.termLoanCommunicationModel.isSameAddress != null && this.termLoanCommunicationModel.isSameAddress != undefined) {
              this.sameAsPerAddr();
            }
            this.loadMasterDataListMemberModule(this.termLoanCommunicationModel);
            this.termLoanCommunicationModel.id = null;
          }
        }
        this.updateData();
      }, error => {
        this.commonComponent.stopSpinner();
        this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: applicationConstants.SERVER_DOWN_ERROR }];
        setTimeout(() => {
          this.msgs = [];
        }, 3000);
      });
    }
  
    //member module data by member admissionNumber
    getMemberGroupDetailsByGroupAdmissionNumber(admissionNumber: any) {
      this.membershipService.getMemberGroupByAdmissionNumber(admissionNumber).subscribe((data: any) => {
        this.responseModel = data;
        if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
          if (this.responseModel.data.length > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
            this.responseModel.data[0].groupCommunicationList;
            if (this.responseModel.data[0].groupCommunicationList.length > 0 && this.responseModel.data[0].groupCommunicationList[0] != null && this.responseModel.data[0].groupCommunicationList[0] != undefined) {
              this.termLoanCommunicationModel = this.responseModel.data[0].groupCommunicationList[0];
              this.loadMasterDataListMemberModule(this.termLoanCommunicationModel);
            }
            if (this.responseModel.data[0].admissionNumber != null && this.responseModel.data[0].admissionNumber != undefined) {
              this.termLoanCommunicationModel.admissionNumber = this.responseModel.data[0].admissionNumber;
            }
            if (this.responseModel.data[0].memberTypeName != null && this.responseModel.data[0].memberTypeName != undefined) {
              this.termLoanApplicationModel.memberTypeName = this.responseModel.data[0].memberTypeName;
            }
            if (this.responseModel.data[0].memberTypeId != null && this.responseModel.data[0].memberTypeId != undefined) {
              this.termLoanCommunicationModel.memberType = this.responseModel.data[0].memberTypeId;
            }
  
            this.termLoanCommunicationModel.id = null;
            if (this.termLoanCommunicationModel.isSameAddress != null && this.termLoanCommunicationModel.isSameAddress != undefined) {
              this.sameAsPerAddr();
            }
          }
          this.updateData();
        }
      }, error => {
        this.commonComponent.stopSpinner();
        this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: applicationConstants.SERVER_DOWN_ERROR }];
        setTimeout(() => {
          this.msgs = [];
        }, 3000);
      });
    }
  
    //member module data by member admission Number
    getMemberInstitutionDetailsByAdmissionNumber(admissionNumber: any) {
      this.membershipService.getMemberIstitutionByAdmissionNumber(admissionNumber).subscribe((data: any) => {
        this.responseModel = data;
        if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
          if (this.responseModel.data.length > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
            this.responseModel.data[0].institutionCommunicationDTOList;
            if (this.responseModel.data[0].institutionCommunicationDTOList.length > 0 && this.responseModel.data[0].institutionCommunicationDTOList.length > 0 && this.responseModel.data[0].institutionCommunicationDTOList[0] != null && this.responseModel.data[0].institutionCommunicationDTOList[0] != undefined) {
              this.termLoanCommunicationModel = this.responseModel.data[0].institutionCommunicationDTOList[0];
              this.loadMasterDataListMemberModule(this.termLoanCommunicationModel);
            }
            if (this.responseModel.data[0].admissionNumber != null && this.responseModel.data[0].admissionNumber != undefined) {
              this.termLoanCommunicationModel.admissionNumber = this.responseModel.data[0].admissionNumber;
            }
            if (this.responseModel.data[0].memberTypeName != null && this.responseModel.data[0].memberTypeName != undefined) {
              this.termLoanApplicationModel.memberTypeName = this.responseModel.data[0].memberTypeName;
            }
            if (this.responseModel.data[0].memberTypeId != null && this.responseModel.data[0].memberTypeId != undefined) {
              this.termLoanCommunicationModel.memberType = this.responseModel.data[0].memberTypeId;
            }
            this.termLoanCommunicationModel.id = null;
            if (this.termLoanCommunicationModel.isSameAddress != null && this.termLoanCommunicationModel.isSameAddress != undefined) {
              this.sameAsPerAddr();
            }
          }
          this.updateData();
        }
      }, error => {
        this.commonComponent.stopSpinner();
        this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: applicationConstants.SERVER_DOWN_ERROR }];
        setTimeout(() => {
          this.msgs = [];
        }, 3000);
      });
    }
  
    getTermApplicationByTermAccId(id: any) {
      this.termLoanApplicationsService.getTermApplicationByTermAccId(id).subscribe((data: any) => {
        this.responseModel = data;
        if (this.responseModel != null && this.responseModel != undefined) {
          if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
            if (this.responseModel.data.length > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
              this.termLoanApplicationModel = this.responseModel.data[0];

              if(this.responseModel.data[0].admissionNo != null && this.responseModel.data[0].admissionNo != undefined){
                this.termLoanCommunicationModel.admissionNumber  =  this.responseModel.data[0].admissionNo;
                this.admissionNumber  =  this.responseModel.data[0].admissionNo;
              }
              if (this.termLoanApplicationModel.termLoanCommunicationDTO != null && this.termLoanApplicationModel.termLoanCommunicationDTO != undefined) {
                this.isEdit = true;
                this.termLoanCommunicationModel = this.termLoanApplicationModel.termLoanCommunicationDTO;
  
                if (this.termLoanCommunicationModel.memberTypeName != null && this.termLoanCommunicationModel.memberTypeName != undefined)
                  this.termLoanCommunicationModel.memberTypeName = this.termLoanCommunicationModel.memberTypeName;
  
                if (this.termLoanCommunicationModel.memberShipId != null && this.termLoanCommunicationModel.memberShipId != undefined)
                  this.termLoanCommunicationModel.memberType = this.termLoanCommunicationModel.memberShipId;
  
                if (this.termLoanCommunicationModel.isSameAddress != null && this.termLoanCommunicationModel.isSameAddress != undefined) {
                  this.sameAsPerAddr();
                }
  
                this.loadMasterAddressDetails(this.termLoanCommunicationModel);
                this.updateData();
              }
              else {
                this.isEdit = false;
                if (this.termLoanApplicationModel.admissionNo != null && this.termLoanApplicationModel.admissionNo) {
                  this.getMemberDetailsByAdmissionNumber(this.termLoanApplicationModel.admissionNo);
                  this.getMemberGroupDetailsByGroupAdmissionNumber(this.termLoanApplicationModel.admissionNo);
                  this.getMemberInstitutionDetailsByAdmissionNumber(this.termLoanApplicationModel.admissionNo);
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
  
    sameAsPerAddr() {
      if (this.termLoanCommunicationModel.isSameAddress != undefined && this.termLoanCommunicationModel.isSameAddress != null) {
        if (this.termLoanCommunicationModel.isSameAddress) {
          this.communicationForm.get('permanentState').disable();
          this.communicationForm.get('permanentDistrict').disable();
          this.communicationForm.get('permanentSubDistrict').disable();
          this.communicationForm.get('permanentVillage').disable();
          this.communicationForm.get('permanentPinCode').disable();
          this.communicationForm.get('permanentAddressOne').disable();
  
          if (this.termLoanCommunicationModel != null && this.termLoanCommunicationModel != undefined) {
            if (this.termLoanCommunicationModel.stateId != null && this.termLoanCommunicationModel.stateId != undefined) {
              this.termLoanCommunicationModel.permanentStateId = this.termLoanCommunicationModel.stateId;
  
              this.permanentDistrictList = this.districtsList.filter((obj: any) => obj != null).map((permanantDistrict: { label: any; value: any; }) => {
                return { label: permanantDistrict.label, value: permanantDistrict.value };
              });
  
              let permanentState = this.statesList.find((data: any) => null != data && this.termLoanCommunicationModel.permanentStateId != null && data.value == this.termLoanCommunicationModel.permanentStateId);
              if (permanentState != null && undefined != permanentState) {
                this.termLoanCommunicationModel.permanentStateName = permanentState.label;
              }
            }
            if (this.termLoanCommunicationModel.districtId != null && this.termLoanCommunicationModel.districtId != undefined) {
              this.termLoanCommunicationModel.permanentDistrictId = this.termLoanCommunicationModel.districtId;
  
              this.permanentMandalsList = this.mandalsList.filter((obj: any) => obj != null).map((permanantMandal: { label: any; value: any; }) => {
                return { label: permanantMandal.label, value: permanantMandal.value };
              });
  
              let permanentDistrict = this.districtsList.find((data: any) => null != data && this.termLoanCommunicationModel.permanentDistrictId != null && data.value == this.termLoanCommunicationModel.permanentDistrictId);
              if (permanentDistrict != null && undefined != permanentDistrict) {
                this.termLoanCommunicationModel.permanentDistrictName = permanentDistrict.label;
              }
            }
            if (this.termLoanCommunicationModel.subDistrictId != null && this.termLoanCommunicationModel.subDistrictId != undefined) {
              this.termLoanCommunicationModel.permanentSubDistrictId = this.termLoanCommunicationModel.subDistrictId;
  
              this.permanentVillagesList = this.villageList.filter((obj: any) => obj != null).map((permanantVillage: { label: any; value: any; }) => {
                return { label: permanantVillage.label, value: permanantVillage.value };
              });
  
              let permanentSubDistrict = this.mandalsList.find((data: any) => null != data && this.termLoanCommunicationModel.permanentSubDistrictId != null && data.value == this.termLoanCommunicationModel.permanentSubDistrictId);
              if (permanentSubDistrict != null && undefined != permanentSubDistrict) {
                this.termLoanCommunicationModel.permanentSubDistrictName = permanentSubDistrict.label;
              }
            }
  
            if (this.termLoanCommunicationModel.villageId != null && this.termLoanCommunicationModel.villageId != undefined) {
              this.termLoanCommunicationModel.permanentVillageId = this.termLoanCommunicationModel.villageId;
  
              let permanentVillage = this.villageList.find((data: any) => null != data && this.termLoanCommunicationModel.permanentVillageId != null && data.value == this.termLoanCommunicationModel.permanentVillageId);
              if (permanentVillage != null && undefined != permanentVillage) {
                this.termLoanCommunicationModel.permanentVillageName = permanentVillage.label;
              }
            }
  
            if (this.termLoanCommunicationModel.pinCode != null && this.termLoanCommunicationModel.pinCode != undefined) {
              this.termLoanCommunicationModel.permanentPinCode = this.termLoanCommunicationModel.pinCode;
            }
  
            if (this.termLoanCommunicationModel.address1 != null && this.termLoanCommunicationModel.address1 != undefined)
              this.termLoanCommunicationModel.permanentAddress1 = this.termLoanCommunicationModel.address1;
          }
        } else {
          this.communicationForm.get('permanentState').enable();
          this.communicationForm.get('permanentDistrict').enable();
          this.communicationForm.get('permanentSubDistrict').enable();
          this.communicationForm.get('permanentVillage').enable();
          this.communicationForm.get('permanentPinCode').enable();
          this.communicationForm.get('permanentAddressOne').enable();
  
          this.termLoanCommunicationModel.permanentStateId = null;
          this.termLoanCommunicationModel.permanentDistrictId = null;
          this.termLoanCommunicationModel.permanentSubDistrictId = null;
          this.termLoanCommunicationModel.permanentVillageId = null;
          this.termLoanCommunicationModel.permanentPinCode = null;
          this.termLoanCommunicationModel.permanentAddress1 = null;
  
          this.permanentDistrictList = [];
          this.permanentMandalsList = [];
          this.permanentVillagesList = [];
        }
      }
    }
  
    getAllStates() {
      this.termLoanCommunicationService.getAllStates().subscribe((response: any) => {
        this.responseModel = response;
        if (this.responseModel != null && this.responseModel != undefined) {
          if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
            if (this.responseModel.data.length > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
              this.statesList = this.responseModel.data;
              this.statesList = this.responseModel.data.filter((obj: any) => obj != null).map((state: { name: any; id: any; }) => {
                return { label: state.name, value: state.id };
              });
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
  
    getAllDisttricts() {
      this.termLoanCommunicationService.getAllDisttricts().subscribe((response: any) => {
        this.responseModel = response;
        if (this.responseModel != null && this.responseModel != undefined) {
          if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
            if (this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
              this.districtsList = this.responseModel.data;
              this.districtsList = this.districtsList.filter((obj: any) => obj != null).map((district: { name: any; id: any; }) => {
                return { label: district.name, value: district.id };
              });
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
  
    getAllMandals() {
      this.termLoanCommunicationService.getAllMandals().subscribe((response: any) => {
        this.responseModel = response;
        if (this.responseModel != null && this.responseModel != undefined) {
          if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
            if (this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
              this.mandalsList = this.responseModel.data;
              this.mandalsList = this.mandalsList.filter((obj: any) => obj != null).map((mandal: { name: any; id: any; }) => {
                return { label: mandal.name, value: mandal.id };
              });
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
  
    getAllVillages() {
      this.termLoanCommunicationService.getAllVillages().subscribe((response: any) => {
        this.responseModel = response;
        if (this.responseModel != null && this.responseModel != undefined) {
          if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
            if (this.responseModel.data.length > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
              this.villageList = this.responseModel.data;
              this.villageList = this.villageList.filter((obj: any) => obj != null).map((village: { name: any; id: any; }) => {
                return { label: village.name, value: village.id };
              });
            }
          }
          else {
            this.commonComponent.stopSpinner();
            this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: this.responseModel.statusMsg }];
            setTimeout(() => {
              this.msgs = [];
            }, 3000);
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
  
    getDistrictsByStateId(id: any) {
      this.termLoanCommunicationModel.districtId = null;
      this.termLoanCommunicationModel.subDistrictId = null;
      this.termLoanCommunicationModel.villageId = null;
  
      this.districtsList = [];
      this.mandalsList = [];
      this.villageList = [];
      this.termLoanCommunicationService.getDistrictsByStateId(id).subscribe((response: any) => {
        this.responseModel = response;
        if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
          if (this.responseModel.data.length > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
            this.districtsList = this.responseModel.data;
            this.districtsList = this.districtsList.filter((obj: any) => obj != null).map((district: { name: any; id: any; }) => {
              return { label: district.name, value: district.id };
            });
            let state = this.statesList.find((data: any) => null != data && this.termLoanCommunicationModel.stateId != null && data.value == this.termLoanCommunicationModel.stateId);
            if (state != null && undefined != state && state.label != null && state.label != undefined) {
              this.termLoanCommunicationModel.stateName = state.label;
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
  
    getMandalsByDistrctId(id: any) {
      this.termLoanCommunicationModel.villageId = null;
      this.termLoanCommunicationService.getMandalsByDistrictId(id).subscribe((response: any) => {
        this.responseModel = response;
        if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
          if (this.responseModel.data.length > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
            this.mandalsList = this.responseModel.data;
            this.mandalsList = this.mandalsList.filter((obj: any) => obj != null).map((mandal: { name: any; id: any; }) => {
              return { label: mandal.name, value: mandal.id };
            });
            let district = this.districtsList.find((data: any) => null != data && this.termLoanCommunicationModel.districtId != null && data.value == this.termLoanCommunicationModel.districtId);
            if (district != null && undefined != district && district.label != null && district.label != undefined)
              this.termLoanCommunicationModel.districtName = district.label;
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
  
    getAllVillagesByMandalId(id: any) {
      this.termLoanCommunicationService.getvillagesByMandalId(id).subscribe((response: any) => {
        this.responseModel = response;
        if (this.responseModel != null && this.responseModel != undefined) {
          if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
            if (this.responseModel.data.length > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
              this.villageList = this.responseModel.data;
              this.villageList = this.villageList.filter((obj: any) => obj != null).map((village: { name: any; id: any; }) => {
                return { label: village.name, value: village.id };
              });
              let subDistrict = this.mandalsList.find((data: any) => null != data && this.termLoanCommunicationModel.subDistrictId != null && data.value == this.termLoanCommunicationModel.subDistrictId);
              if (subDistrict != null && undefined != subDistrict)
                this.termLoanCommunicationModel.subDistrictName = subDistrict.label;
            }
          }
          else {
            this.commonComponent.stopSpinner();
            this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: this.responseModel.statusMsg }];
            setTimeout(() => {
              this.msgs = [];
            }, 3000);
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
  
    getPermanentDistrictByPermanetStateId(id: any) {
      this.termLoanCommunicationService.getDistrictsByStateId(id).subscribe((response: any) => {
        this.responseModel = response;
        if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
          if (this.responseModel.data != null && this.responseModel.data != undefined) {
            this.permanentDistrictList = this.responseModel.data;
            this.permanentDistrictList = this.permanentDistrictList.filter((obj: any) => obj != null).map((permanantDistrict: { name: any; id: any; }) => {
              return { label: permanantDistrict.name, value: permanantDistrict.id };
            });
            let permanentState = this.permanentStatesList.find((data: any) => null != data && this.termLoanCommunicationModel.permanentStateId != null && data.value == this.termLoanCommunicationModel.permanentStateId);
            if (permanentState != null && undefined != permanentState) {
              this.termLoanCommunicationModel.permanentStateName = permanentState.label;
            }
            this.getPermanentMandalsByPermanentDistrctId(this.termLoanCommunicationModel.permanentDistrictId);
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
  
    getPermanentMandalsByPermanentDistrctId(id: any) {
      this.termLoanCommunicationService.getMandalsByDistrictId(id).subscribe((response: any) => {
        this.responseModel = response;
        if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
          if (this.responseModel.data != null && this.responseModel.data != undefined && this.responseModel.data.length > 0) {
            this.permanentMandalsList = this.responseModel.data;
            this.permanentMandalsList = this.permanentMandalsList.filter((obj: any) => obj != null).map((permanantMandal: { name: any; id: any; }) => {
              return { label: permanantMandal.name, value: permanantMandal.id };
            });
            let permanentDistrict = this.permanentDistrictList.find((data: any) => null != data && this.termLoanCommunicationModel.permanentDistrictId != null && data.value == this.termLoanCommunicationModel.permanentDistrictId);
            if (permanentDistrict != null && undefined != permanentDistrict)
              this.termLoanCommunicationModel.permanentDistrictName = permanentDistrict.label;
  
            this.getPermanentVillagesByPermanetMandalId(this.termLoanCommunicationModel.permanentSubDistrictId);
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
  
    getPermanentVillagesByPermanetMandalId(id: any) {
      this.termLoanCommunicationService.getvillagesByMandalId(id).subscribe((response: any) => {
        this.responseModel = response;
        if (this.responseModel != null && this.responseModel != undefined) {
          if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
            if (this.responseModel.data != null && this.responseModel.data != undefined && this.responseModel.data.length > 0) {
              this.permanentVillagesList = this.responseModel.data;
              this.permanentVillagesList = this.permanentVillagesList.filter((obj: any) => obj != null).map((permanantVillage: { name: any; id: any; }) => {
                return { label: permanantVillage.name, value: permanantVillage.id };
              });
              let permanentSubDistrict = this.permanentMandalsList.find((data: any) => null != data && this.termLoanCommunicationModel.permanentSubDistrictId != null && data.value == this.termLoanCommunicationModel.permanentSubDistrictId);
              if (permanentSubDistrict != null && undefined != permanentSubDistrict)
                this.termLoanCommunicationModel.permanentSubDistrictName = permanentSubDistrict.label;
  
              let permanentVillage = this.permanentVillagesList.find((data: any) => null != data && this.termLoanCommunicationModel.permanentVillageId != null && data.value == this.termLoanCommunicationModel.permanentVillageId);
              if (permanentVillage != null && undefined != permanentVillage)
                this.termLoanCommunicationModel.permanentVillageName = permanentVillage.label;
            }
          }
          else {
            this.commonComponent.stopSpinner();
            this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: this.responseModel.statusMsg }];
            setTimeout(() => {
              this.msgs = [];
            }, 3000);
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
  
    onChangeState(stateId: any) {
      this.getDistrictsByStateId(stateId);
    }
  
    onChangeDistrict(districtId: any) {
      this.getMandalsByDistrctId(districtId);
    }
  
    onChangeMandal(mandalId: any) {
      this.getAllVillagesByMandalId(mandalId);
    }
  
    onChangeVillage(villageId: any) {
      let village = this.villageList.find((data: any) => null != data && villageId != null && data.value == villageId);
      if (village != null && undefined != village)
        this.termLoanCommunicationModel.villageName = village.label;
    }
  
    onChangePermanentState(permanentStateId: any) {
      this.permanentDistrictList = [];
      this.permanentMandalsList = [];
      this.permanentVillagesList = [];
      this.termLoanCommunicationModel.permanentDistrictId = null;
      this.termLoanCommunicationModel.permanentSubDistrictId = null;
      this.termLoanCommunicationModel.permanentVillageId = null;
      this.getPermanentDistrictByPermanetStateId(permanentStateId);
    }
  
    onChangePermanentDistrict(permanentDistrictId: any) {
      this.permanentMandalsList = [];
      this.permanentVillagesList = [];
      this.termLoanCommunicationModel.permanentSubDistrictId = null;
      this.termLoanCommunicationModel.permanentVillageId = null;
      this.getPermanentMandalsByPermanentDistrctId(permanentDistrictId);
    }
  
    onChangePermanentSubDistrict(permanentSubDistrictId: any) {
      this.permanentVillagesList = [];
      this.termLoanCommunicationModel.permanentVillageId = null;
      this.getPermanentVillagesByPermanetMandalId(permanentSubDistrictId);
    }
  
    onChangePermanentVillage(permanentVillageId: any) {
      let permanentVillage = this.permanentVillagesList.find((data: any) => null != data && permanentVillageId != null && data.value == permanentVillageId);
      if (permanentVillage != null && undefined != permanentVillage) {
        this.termLoanCommunicationModel.permanentVillageName = permanentVillage.label;
      }
    }
  
    loadMasterAddressDetails(obj: any) {
      this.getAllDisttricts();
      this.getAllMandals();
      this.getAllVillages();
      if (obj != null && obj != undefined) {
        if (obj.permanentStateId != null && obj.permanentStateId != undefined)
          this.getPermanentDistrictByPermanetStateId(obj.permanentStateId);
  
        if (obj.permanentDistrictId != null && obj.permanentDistrictId != undefined)
          this.getPermanentMandalsByPermanentDistrctId(obj.permanentDistrictId);
  
        if (obj.permanentSubDistrictId != null && obj.permanentSubDistrictId != undefined)
          this.getPermanentVillagesByPermanetMandalId(obj.permanentSubDistrictId);
  
        if (obj.permanentVillageId != null && obj.permanentVillageId != undefined)
          this.onChangePermanentVillage(obj.permanentVillageId);
      }
    }
  
    loadMasterDataListMemberModule(obj: any) {
      this.getAllDisttricts();
      this.getAllMandals();
      this.getAllVillages();
      if (obj != null && obj != undefined) {
        if (obj.permanentStateId != null && obj.permanentStateId != undefined) {
          this.termLoanCommunicationModel.permanentStateId = obj.permanentStateId;
          this.getPermanentDistrictByPermanetStateId(obj.permanentStateId);
        }
        if (obj.permanentDistrictId != null && obj.permanentDistrictId != undefined) {
          this.termLoanCommunicationModel.permanentDistrictId = obj.permanentDistrictId;
          this.getPermanentMandalsByPermanentDistrctId(obj.permanentDistrictId);
        }
        if (obj.permanentSubDistrictId != null && obj.permanentSubDistrictId != undefined) {
          this.termLoanCommunicationModel.permanentSubDistrictId = obj.permanentSubDistrictId;
          this.getPermanentVillagesByPermanetMandalId(obj.permanentSubDistrictId);
        }
        if (obj.permanentVillageId != null && obj.permanentVillageId != undefined) {
          this.termLoanCommunicationModel.permanentVillageId = obj.permanentVillageId;
          this.onChangePermanentVillage(obj.permanentVillageId);
        }
        if (obj.permanentPincode != null && obj.permanentPincode != undefined)
          this.termLoanCommunicationModel.permanentPinCode = obj.permanentPincode;
  
        if (obj.pincode != null && obj.pincode != undefined)
          this.termLoanCommunicationModel.pinCode = obj.pincode;
  
        if (obj.permanentAddress1 != null)
          this.termLoanCommunicationModel.permanentAddress1 = obj.permanentAddress1;
      }
    }
  
    appendPinCodeToPermanent() {
      if (this.termLoanCommunicationModel != null && this.termLoanCommunicationModel != undefined && this.termLoanCommunicationModel.isSameAddress != null && this.termLoanCommunicationModel.isSameAddress != undefined && this.termLoanCommunicationModel.isSameAddress) {
        if (this.termLoanCommunicationModel.pinCode != null && this.termLoanCommunicationModel.pinCode != undefined) {
          this.termLoanCommunicationModel.permanentPinCode = this.termLoanCommunicationModel.pinCode;
        }
        if (this.termLoanCommunicationModel.address1 != null && this.termLoanCommunicationModel.address1 != undefined) {
          this.termLoanCommunicationModel.permanentAddress1 = this.termLoanCommunicationModel.address1;
        }
      }
    }
}
