import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MembershipBasicDetails, MembershipGroupDetails, MemInstitutionDetails } from '../ci-membership-details/shared/membership-details.model';
import { Responsemodel } from 'src/app/shared/responsemodel';
import { CiLoanApplication } from '../ci-product-details/shared/ci-loan-application.model';
import { CiLoanCommunication } from './shared/ci-communication.model';
import { CommonComponent } from 'src/app/shared/common.component';
import { EncryptDecryptService } from 'src/app/shared/encrypt-decrypt.service';
import { CommonFunctionsService } from 'src/app/shared/commonfunction.service';
import { StatesService } from 'src/app/configurations/common-config/state/shared/states.service';
import { DatePipe } from '@angular/common';
import { applicationConstants } from 'src/app/shared/applicationConstants';
import { CiLoanApplicationService } from '../ci-product-details/shared/ci-loan-application.service';
import { MembershipDetailsService } from '../ci-membership-details/shared/membership-details.service';

@Component({
  selector: 'app-ci-communication',
  templateUrl: './ci-communication.component.html',
  styleUrls: ['./ci-communication.component.css']
})
export class CiCommunicationComponent {
  responseModel!: Responsemodel;
  communicationForm: any;
  sameAsPermanentAddress: boolean = false;
  subDistrictList: any[] = [];
  villageList: any[] = [];
  districtsList: any[] = [];
  statesList: any[] = [];
  permanentStatesList: any[] = [];
  permanentDistrictList: any[] = [];
  permanentSubDistrictList: any[] = [];
  permanentVillageList: any[] = [];
  msgs: any[] = [];
  checked: Boolean = false;
  isEdit: Boolean = false;
  accountId: any;
  ciLoanApplicationId: any
  admissionNumber: any;
  membershipBasicDetailsModel: MembershipBasicDetails = new MembershipBasicDetails();
  membershipGroupDetailsModel: MembershipGroupDetails = new MembershipGroupDetails();
  membershipInstitutionDetailsModel: MemInstitutionDetails = new MemInstitutionDetails();
  ciLoanApplicationModel: CiLoanApplication = new CiLoanApplication;
  ciLoanCommunicationModel: CiLoanCommunication = new CiLoanCommunication();
  orgnizationSetting: any;
  accountNumber: any;
  memberTypeName: any;
  showForm: boolean = false;
  id:any;




  constructor(private router: Router, private formBuilder: FormBuilder, 
    private ciLoanApplicationService: CiLoanApplicationService,
    private membershipDetailsService: MembershipDetailsService,
    private commonComponent: CommonComponent, 
    private activateRoute: ActivatedRoute,
    private encryptDecryptService: EncryptDecryptService, 
    private statesService: StatesService,
    private commonFunctionsService: CommonFunctionsService, 
    private datePipe: DatePipe) {
    this.communicationForm = this.formBuilder.group({
      stateName: ['',Validators.required],
      districtName: ['',Validators.required],
      subDistrictName: ['',Validators.required],
      villageName: ['',Validators.required],
      address1: ['',Validators.required],
      pinCode: ['', [Validators.pattern(applicationConstants.PINCODE_PATTERN), Validators.compose([Validators.required])]],
      permanentStateName: ['',Validators.required],
      permanentDistrictName: ['',Validators.required],
      permanentSubDistrictName: ['',Validators.required],
      permanentVillageName: ['',Validators.required],
      permanentAddress1: ['',Validators.required],
      permanentPinCode:['', [Validators.pattern(applicationConstants.PINCODE_PATTERN), Validators.compose([Validators.required])]],
      isSameAddress: ['']
    })
  }

  ngOnInit() {
    this.orgnizationSetting = this.commonComponent.orgnizationSettings();
    this.showForm = this.commonFunctionsService.getStorageValue(applicationConstants.B_CLASS_MEMBER_CREATION);
    this.activateRoute.queryParams.subscribe(params => {
      if (params['id'] != undefined) {
        if (params['id'] != undefined) {
          let id = Number(this.encryptDecryptService.decrypt(params['id']));
          this.ciLoanApplicationId = Number(id);
          this.getCiLoanApplicationsById();
        }
      }
    });
    this.communicationForm.valueChanges.subscribe((data: any) => {
      this.updateData();
      if (this.communicationForm.valid) {
        this.save();
      }
    });
    this.getAllStatesList();
    this.getAllPermanentStatesList();

  }

  updateData() {
    if (this.ciLoanApplicationId != null && this.ciLoanApplicationId != undefined)
      this.ciLoanCommunicationModel.ciLoanApplicationId = this.ciLoanApplicationId;
    if(this.accountNumber != null && this.accountNumber != undefined)
      this. ciLoanCommunicationModel.accountNumber = this.accountNumber;
    this. ciLoanCommunicationModel.memberType = this.ciLoanApplicationModel.memberTypeId;
    this.ciLoanApplicationService.changeData({
      formValid: !this.communicationForm.valid ? true : false,
      data: this.ciLoanCommunicationModel,
      isDisable: (!this.communicationForm.valid),
      stepperIndex: 2,
    });
  }
  save() {
    this.updateData();
  }


  getCiLoanApplicationsById() {
    this.ciLoanApplicationService.getLoanApplicationDetailsByLoanApplicationId(this.ciLoanApplicationId).subscribe((data: any) => {
      this.responseModel = data;
      if (this.responseModel != null && this.responseModel != undefined) {
        if (this.responseModel.data != null && this.responseModel.data != undefined) {
          if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
            if (this.responseModel.data[0] != null && this.responseModel.data[0] != undefined && this.responseModel.data.length > 0) {
              if (this.responseModel.data[0].admissionNo != null && this.responseModel.data[0].admissionNo != undefined)
                this.admissionNumber = this.responseModel.data[0].admissionNo;
              if (this.responseModel.data[0].accountNumber != null && this.responseModel.data[0].accountNumber != undefined)
                this.accountNumber = this.responseModel.data[0].accountNumber;
              if (this.responseModel.data[0].memberTypeName != null && this.responseModel.data[0].memberTypeName != undefined)
                this.memberTypeName = this.responseModel.data[0].memberTypeName;
              this.ciLoanApplicationModel = this.responseModel.data[0];
              if (this.ciLoanApplicationModel != null && this.ciLoanApplicationModel != undefined)
                if (this.ciLoanApplicationModel.ciLoanCommunicationDTO != null && this.ciLoanApplicationModel.ciLoanCommunicationDTO != undefined
                 ) {
                  this.ciLoanCommunicationModel = this.ciLoanApplicationModel.ciLoanCommunicationDTO;
                  this.setAllFields();
                }
                else {
                  if (this.memberTypeName == "Individual")
                    this.getmembershipBasicDetailsByAdmissionNumber(this.admissionNumber);
                  else if (this.memberTypeName == "Group")
                    this.getGroupDetailsByAdmissionNumber(this.admissionNumber);
                  else if (this.memberTypeName == "Institution")
                    this.getInstitutionDetailsByAdmissionNumber(this.admissionNumber);
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
      }, 2000);
    });
  }


  setAllFields() {
    if (this.ciLoanCommunicationModel.isSameAddress != null && this.ciLoanCommunicationModel.isSameAddress != undefined) {
      if (this.ciLoanCommunicationModel.isSameAddress == true) {
        this.communicationForm.get('permanentStateName').disable();
        this.communicationForm.get('permanentDistrictName').disable();
        this.communicationForm.get('permanentSubDistrictName').disable();
        this.communicationForm.get('permanentVillageName').disable();
        this.communicationForm.get('permanentAddress1').disable();
        this.communicationForm.get('permanentPinCode').disable();
        this.RegAddressToComAddress();
      }
    }
    if (this.ciLoanCommunicationModel.stateId != null)
      this.getAllDistrictsByStateId(this.ciLoanCommunicationModel.stateId, false)
    if (this.ciLoanCommunicationModel.districtId != null)
      this.getAllSubDistrictByDistrictId(this.ciLoanCommunicationModel.districtId, false)
    if (this.ciLoanCommunicationModel.subDistrictId != null)
      this.getAllVillagesBySubDistrictId(this.ciLoanCommunicationModel.subDistrictId, false)

    if (this.ciLoanCommunicationModel.permanentStateId != null)
      this.getAllPermanentDistrictsByStateId(this.ciLoanCommunicationModel.permanentStateId, false)
    if (this.ciLoanCommunicationModel.permanentDistrictId != null)
      this.getAllPermanentSubDistrictByDistrictId(this.ciLoanCommunicationModel.permanentDistrictId, false)
    if (this.ciLoanCommunicationModel.permanentSubDistrictId != null)
      this.getAllPermanentVillagesBySubDistrictId(this.ciLoanCommunicationModel.permanentSubDistrictId, false)
  }

  getmembershipBasicDetailsByAdmissionNumber(admissionNumber: any) {
    this.membershipDetailsService.getMembershipBasicDetailsByAdmissionNumber(admissionNumber).subscribe((data: any) => {
      this.responseModel = data;
      if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
        if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
          if (this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
            this.membershipBasicDetailsModel = this.responseModel.data[0];
            if (this.responseModel.data[0].memberShipCommunicationDetailsDTO != null && this.responseModel.data[0].memberShipCommunicationDetailsDTO != undefined){
              this.ciLoanCommunicationModel = this.responseModel.data[0].memberShipCommunicationDetailsDTO;
              this.ciLoanCommunicationModel.memberShipId = null;
              this.ciLoanCommunicationModel.memberType = this.responseModel.data[0].memberTypeId;
              // if (this.responseModel.data[0].memberShipCommunicationDetailsDTO.admissionNumber != null && this.responseModel.data[0].memberShipCommunicationDetailsDTO.admissionNumber != undefined)
              //   this.ciLoanCommunicationModel.admissionNumber = this.responseModel.data[0].memberShipCommunicationDetailsDTO.admissionNumber;
              this.setAllFields();
            }
            this.updateData();
          }
        }
      } else {
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

  getGroupDetailsByAdmissionNumber(admissionNUmber: any) {
    this.membershipDetailsService.getMemberGroupByAdmissionNumber(admissionNUmber).subscribe((data: any) => {
      this.responseModel = data;
      if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
        if (this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
          this.membershipGroupDetailsModel = this.responseModel.data[0];
          if (this.responseModel.data[0].groupCommunicationList != null && this.responseModel.data[0].groupCommunicationList != undefined &&
            this.responseModel.data[0].groupCommunicationList[0] != null && this.responseModel.data[0].groupCommunicationList[0] != undefined) {
            this.ciLoanCommunicationModel = this.responseModel.data[0].groupCommunicationList[0];
            this.ciLoanCommunicationModel.memberShipId = null;
            if (this.ciLoanCommunicationModel.memberType != null && this.ciLoanCommunicationModel.memberType != undefined)
              this.memberTypeName = this.ciLoanCommunicationModel.memberType;
            this.ciLoanCommunicationModel.memberType = this.responseModel.data[0].memberTypeId;
            this.ciLoanCommunicationModel.pinCode = this.responseModel.data[0].groupCommunicationList[0].pincode;
            this.ciLoanCommunicationModel.permanentPinCode = this.responseModel.data[0].groupCommunicationList[0].permanentPincode;
            this.setAllFields();
          }
          this.updateData();
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

  //Get Institution Details from Membership Module by AdmissionNumber
  getInstitutionDetailsByAdmissionNumber(admissionNumber: any) {
    this.membershipDetailsService.getMemberIstitutionByAdmissionNumber(admissionNumber).subscribe((data: any) => {
      this.responseModel = data;
      if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
        if (this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
          this.membershipInstitutionDetailsModel = this.responseModel.data[0];
          this.ciLoanCommunicationModel.memberShipId = null;
          if (this.responseModel.data[0].institutionCommunicationDTOList != null && this.responseModel.data[0].institutionCommunicationDTOList != undefined &&
            this.responseModel.data[0].institutionCommunicationDTOList[0] != null && this.responseModel.data[0].institutionCommunicationDTOList[0] != undefined) {
            this.ciLoanCommunicationModel = this.responseModel.data[0].institutionCommunicationDTOList[0];
            if (this.ciLoanCommunicationModel.memberType != null && this.ciLoanCommunicationModel.memberType != undefined)
              this.memberTypeName = this.ciLoanCommunicationModel.memberType;
            this.ciLoanCommunicationModel.memberType = this.responseModel.data[0].memberTypeId;
            this.setAllFields();
          }
          this.updateData();
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


  getAllStatesList() {
    this.ciLoanApplicationService.getstatesList().subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel != null && this.responseModel != undefined) {
        if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
          if (this.responseModel.data.length > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
            this.statesList = this.responseModel.data;
            this.statesList = this.responseModel.data.filter((obj: any) => obj != null).map((state: { name: any; id: any; }) => {
              return { label: state.name, value: state.id };
            });
            this.sameAsRegisterAddress();
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

  getAllDistrictsByStateId(id: any, isResetIds: any) {
    if (isResetIds) {
      this.communicationForm.get('districtName').reset();
      this.communicationForm.get('subDistrictName').reset();
      this.communicationForm.get('villageName').reset();
      this.districtsList = [];
      this.subDistrictList = [];
      this.villageList = [];
    }
    this.ciLoanApplicationService.getDistrictsByStateId(id).subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
        this.districtsList = this.responseModel.data;
        this.districtsList = this.districtsList.filter((obj: any) => obj != null).map((relationType: { name: any; id: any; }) => {
          return { label: relationType.name, value: relationType.id };
        });
        const state = this.statesList.find((item: { value: any; }) => item.value === id);
        this.ciLoanCommunicationModel.stateName = state.label;
        this.sameAsRegisterAddress();
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

  getAllSubDistrictByDistrictId(id: any, isResetIds: any) {
    if (isResetIds) {
      this.communicationForm.get('subDistrictName').reset();
      this.communicationForm.get('villageName').reset();
      this.subDistrictList = [];
      this.villageList = [];
    }
    this.ciLoanApplicationService.getSubDistrictByDistrictId(id).subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
        this.subDistrictList = this.responseModel.data;
        this.subDistrictList = this.subDistrictList.filter((obj: any) => obj != null).map((relationType: { name: any; id: any; }) => {
          return { label: relationType.name, value: relationType.id };
        });
        const district = this.districtsList.find((item: { value: any; }) => item.value === id);
        this.ciLoanCommunicationModel.districtName = district.label;
        this.sameAsRegisterAddress();
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

  getAllVillagesBySubDistrictId(id: any, isResetIds: any) {
    if (isResetIds) {
      this.communicationForm.get('villageName').reset();
      this.villageList = [];
    }
    this.ciLoanApplicationService.getvillagesBySubDistrictId(id).subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel != null && this.responseModel != undefined) {
        if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
          if (this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
            this.villageList = this.responseModel.data;
            this.villageList = this.villageList.filter((obj: any) => obj != null).map((relationType: { name: any; id: any; }) => {
              return { label: relationType.name, value: relationType.id };
            });
            const subDistrictName = this.subDistrictList.find((item: { value: any; }) => item.value === id);
            this.ciLoanCommunicationModel.subDistrictName = subDistrictName.label;
            this.sameAsRegisterAddress();
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

  getVillage(id: any) {
    const villageName = this.villageList.find((item: { value: any; }) => item.value === id);
    this.ciLoanCommunicationModel.villageName = villageName.label;
    this.sameAsRegisterAddress();
  }

  getAllPermanentStatesList() {
    this.ciLoanApplicationService.getstatesList().subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel != null && this.responseModel != undefined) {
        if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
          if (this.responseModel.data.length > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
            this.permanentStatesList = this.responseModel.data;
            this.permanentStatesList = this.responseModel.data.filter((obj: any) => obj != null).map((state: { name: any; id: any; }) => {
              return { label: state.name, value: state.id };
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

  getAllPermanentDistrictsByStateId(id: any, isResetIds: any) {
    if (isResetIds) {
      this.communicationForm.get('permanentDistrictName').reset();
      this.communicationForm.get('permanentSubDistrictName').reset();
      this.communicationForm.get('permanentVillageName').reset();
      this.permanentDistrictList = [];
      this.permanentSubDistrictList = [];
      this.permanentVillageList = [];
    }
    this.ciLoanApplicationService.getDistrictsByStateId(id).subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
        this.permanentDistrictList = this.responseModel.data;
        this.permanentDistrictList = this.permanentDistrictList.filter((obj: any) => obj != null).map((relationType: { name: any; id: any; }) => {
          return { label: relationType.name, value: relationType.id };
        });
        const perState = this.permanentStatesList.find((item: { value: any; }) => item.value === id);
        this.ciLoanCommunicationModel.permanentStateName = perState.label;
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

  getAllPermanentSubDistrictByDistrictId(id: any, isResetIds: any) {
    if (isResetIds) {
      this.communicationForm.get('permanentSubDistrictName').reset();
      this.communicationForm.get('permanentVillageName').reset();
      this.permanentSubDistrictList = [];
      this.permanentVillageList = [];
    }
    this.ciLoanApplicationService.getSubDistrictByDistrictId(id).subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
        this.permanentSubDistrictList = this.responseModel.data;
        this.permanentSubDistrictList = this.permanentSubDistrictList.filter((obj: any) => obj != null).map((relationType: { name: any; id: any; }) => {
          return { label: relationType.name, value: relationType.id };
        });
        const perDistrict = this.permanentDistrictList.find((item: { value: any; }) => item.value === id);
        this.ciLoanCommunicationModel.permanentDistrictName = perDistrict.label;
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

  getAllPermanentVillagesBySubDistrictId(id: any, isResetIds: any) {
    if (isResetIds) {
      this.communicationForm.get('permanentVillageName').reset();
      this.permanentVillageList = [];
    }
    this.ciLoanApplicationService.getvillagesBySubDistrictId(id).subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel != null && this.responseModel != undefined) {
        if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
          if (this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
            this.permanentVillageList = this.responseModel.data;
            this.permanentVillageList = this.permanentVillageList.filter((obj: any) => obj != null).map((relationType: { name: any; id: any; }) => {
              return { label: relationType.name, value: relationType.id };
            });
            const persubDistrictName = this.permanentSubDistrictList.find((item: { value: any; }) => item.value === id);
            this.ciLoanCommunicationModel.permanentSubDistrictName = persubDistrictName.label;
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

  getPermanentVillage(id: any) {
    const perVillage = this.permanentVillageList.find((item: { value: any; }) => item.value === id);
    this.ciLoanCommunicationModel.permanentVillageName = perVillage.label;
  }

  sameAsRegisterAddress() {
    if (this.ciLoanCommunicationModel.isSameAddress == true) {
      this.ciLoanCommunicationModel.permanentStateId = this.ciLoanCommunicationModel.stateId;
      if (this.ciLoanCommunicationModel.districtId != this.ciLoanCommunicationModel.permanentDistrictId) {
        this.ciLoanCommunicationModel.permanentDistrictId = null;
        this.getAllPermanentDistrictsByStateId(this.ciLoanCommunicationModel.permanentStateId, false);
        this.ciLoanCommunicationModel.permanentDistrictId = this.ciLoanCommunicationModel.districtId;
      }
      if (this.ciLoanCommunicationModel.subDistrictId != this.ciLoanCommunicationModel.permanentSubDistrictId) {
        this.ciLoanCommunicationModel.permanentSubDistrictId = null;
        this.getAllPermanentSubDistrictByDistrictId(this.ciLoanCommunicationModel.permanentDistrictId, false);
        this.ciLoanCommunicationModel.permanentSubDistrictId = this.ciLoanCommunicationModel.subDistrictId;
      }
      if (this.ciLoanCommunicationModel.villageId != this.ciLoanCommunicationModel.permanentVillageId) {
        this.ciLoanCommunicationModel.permanentVillageId = null;
        this.getAllPermanentVillagesBySubDistrictId(this.ciLoanCommunicationModel.permanentSubDistrictId, false);
        this.ciLoanCommunicationModel.permanentVillageId = this.ciLoanCommunicationModel.villageId;
      }
    }
  }

  sameAsPerAddr(isSameAddress: any) {
    if (isSameAddress) {
      this.ciLoanCommunicationModel.isSameAddress = applicationConstants.TRUE;
      this.communicationForm.get('permanentStateName').disable();
      this.communicationForm.get('permanentDistrictName').disable();
      this.communicationForm.get('permanentSubDistrictName').disable();
      this.communicationForm.get('permanentVillageName').disable();
      this.communicationForm.get('permanentAddress1').disable();
      this.communicationForm.get('permanentPinCode').disable();


      this.ciLoanCommunicationModel.permanentStateId = this.ciLoanCommunicationModel.stateId;
      if (this.ciLoanCommunicationModel.districtId != this.ciLoanCommunicationModel.permanentDistrictId) {
        this.ciLoanCommunicationModel.permanentDistrictId = null;
        this.getAllPermanentDistrictsByStateId(this.ciLoanCommunicationModel.permanentStateId, false);
        this.ciLoanCommunicationModel.permanentDistrictId = this.ciLoanCommunicationModel.districtId;
      }
      if (this.ciLoanCommunicationModel.subDistrictId != this.ciLoanCommunicationModel.permanentSubDistrictId) {
        this.ciLoanCommunicationModel.permanentSubDistrictId = null;
        this.getAllPermanentSubDistrictByDistrictId(this.ciLoanCommunicationModel.permanentDistrictId, false);
        this.ciLoanCommunicationModel.permanentSubDistrictId = this.ciLoanCommunicationModel.subDistrictId;
      }
      if (this.ciLoanCommunicationModel.villageId != this.ciLoanCommunicationModel.permanentVillageId) {
        this.ciLoanCommunicationModel.permanentVillageId = null;
        this.getAllPermanentVillagesBySubDistrictId(this.ciLoanCommunicationModel.permanentSubDistrictId, false);
        this.ciLoanCommunicationModel.permanentVillageId = this.ciLoanCommunicationModel.villageId;
      }

      this.ciLoanCommunicationModel.permanentAddress1 = this.ciLoanCommunicationModel.address1;
      this.ciLoanCommunicationModel.permanentPinCode = this.ciLoanCommunicationModel.pinCode;
    }
    else {
      this.ciLoanCommunicationModel.isSameAddress = applicationConstants.FALSE;

      this.communicationForm.get('permanentStateName').enable();
      this.communicationForm.get('permanentDistrictName').enable();
      this.communicationForm.get('permanentSubDistrictName').enable();
      this.communicationForm.get('permanentVillageName').enable();
      this.communicationForm.get('permanentAddress1').enable();
      this.communicationForm.get('permanentPinCode').enable();

      this.communicationForm.get('permanentStateName').reset();
      this.communicationForm.get('permanentDistrictName').reset();
      this.communicationForm.get('permanentSubDistrictName').reset();
      this.communicationForm.get('permanentVillageName').reset();
      this.communicationForm.get('permanentAddress1').reset();
      this.communicationForm.get('permanentPinCode').reset();
      this.permanentDistrictList = [];
      this.permanentSubDistrictList = [];
      this.permanentVillageList = [];


      this.communicationForm.get('permanentStateName').enable();
      this.communicationForm.get('permanentDistrictName').enable();
      this.communicationForm.get('permanentSubDistrictName').enable();
      this.communicationForm.get('permanentVillageName').enable();
      this.communicationForm.get('permanentAddress1').enable();
      this.communicationForm.get('permanentPinCode').enable();

      this.ciLoanCommunicationModel.permanentStateId = null;
      this.ciLoanCommunicationModel.permanentDistrictId = null;
      this.ciLoanCommunicationModel.permanentSubDistrictId = null;
      this.ciLoanCommunicationModel.permanentVillageId = null;
      this.ciLoanCommunicationModel.permanentAddress1 = null;
      this.ciLoanCommunicationModel.permanentPinCode = null;
    }
    this.updateData();
  }

  RegAddressToComAddress() {
    if (this.ciLoanCommunicationModel.isSameAddress == true) {
      this.ciLoanCommunicationModel.permanentAddress1 = this.ciLoanCommunicationModel.address1;
      this.ciLoanCommunicationModel.permanentPinCode = this.ciLoanCommunicationModel.pinCode;
    }
  }
}
