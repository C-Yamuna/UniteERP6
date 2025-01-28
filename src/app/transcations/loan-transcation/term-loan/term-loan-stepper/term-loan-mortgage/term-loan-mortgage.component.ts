import { Component, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SelectItem } from 'primeng/api';
import { Table } from 'primeng/table';
import { applicationConstants } from 'src/app/shared/applicationConstants';
import { Responsemodel } from 'src/app/shared/responsemodel';
import { TermApplication, TermLoanProductDefinition } from '../term-loan-application-details/shared/term-application.model';
import { MemberGroupDetailsModel, MembershipBasicRequiredDetails, MembershipInstitutionDetailsModel } from '../term-loan-new-membership/shared/term-loan-new-membership.model';
import { TermBondLoanMortgage, TermGoldLoanMortgage, TermLandLoanMortgage, TermOtherLoanMortgage, TermStorageLoanMortgage, TermVehicleLoanMortgage } from './shared/term-loan-mortgage.model';
import { CommonFunctionsService } from 'src/app/shared/commonfunction.service';
import { EncryptDecryptService } from 'src/app/shared/encrypt-decrypt.service';
import { CommonComponent } from 'src/app/shared/common.component';
import { TermApplicationService } from '../term-loan-application-details/shared/term-application.service';
import { TermLoanMortgageService } from './shared/term-loan-mortgage.service';

@Component({
  selector: 'app-term-loan-mortgage',
  templateUrl: './term-loan-mortgage.component.html',
  styleUrls: ['./term-loan-mortgage.component.css']
})
export class TermLoanMortgageComponent {
  termGoldMortgageForm: FormGroup;
  termLandMortgageForm: FormGroup;
  termBondMortgageForm: FormGroup;
  termVehicleMortgageForm: FormGroup;
  termStorageMortgageForm: FormGroup;
  termOtherMortgageForm: FormGroup;

  selectCollateralType: any;
  collateraltypeOptionsList: any[] = [];

  showGoldform: boolean = false;
  showLandform: boolean = false;
  showBondform: boolean = false;
  showVehicleform: boolean = false;
  showStorageform: boolean = false;
  showOtherform: boolean = false;
  accountOpeningDateVal: any;
  minBalence: any;
  accountType: any;
  productName: any;
  carratsList: any[] = [];
  gender: any[] | undefined;
  maritalstatus: any[] | undefined;
  checked: boolean = false;
  responseModel!: Responsemodel;
  productsList: any[] = [];
  operationTypesList: any[] = [];
  schemeTypesList: any[] = [];
  orgnizationSetting: any;
  msgs: any[] = [];
  columns: any[] = [];
  insuranceVendorDetailsList: any[] = [];
  occupationTypesList: any[] = [];
  gendersList: any[] = [];
  relationshipTypesList: any[] = [];

  isMemberCreation: boolean = false;
  membershipBasicRequiredDetailsModel: MembershipBasicRequiredDetails = new MembershipBasicRequiredDetails();
  memberGroupDetailsModel: MemberGroupDetailsModel = new MemberGroupDetailsModel();
  membershipInstitutionDetailsModel: MembershipInstitutionDetailsModel = new MembershipInstitutionDetailsModel();

  termGoldLoanMortgageModel: TermGoldLoanMortgage = new TermGoldLoanMortgage();
  termLandLoanMortgageModel: TermLandLoanMortgage = new TermLandLoanMortgage();
  termBondLoanMortgageModel: TermBondLoanMortgage = new TermBondLoanMortgage();
  termVehicleLoanMortgageModel: TermVehicleLoanMortgage = new TermVehicleLoanMortgage();
  termStorageLoanMortgageModel: TermStorageLoanMortgage = new TermStorageLoanMortgage();
  termOtherLoanMortgageModel: TermOtherLoanMortgage = new TermOtherLoanMortgage();
  termLoanApplicationModel: TermApplication = new TermApplication();

  memberTypeName: any;
  termLoanApplicationId: any;
  isEdit: boolean = false;
  admissionNumber: any;

  institutionPromoter: any[] = [];
  visible: boolean = false;
  isFormValid: Boolean = false;

  @ViewChild('gold', { static: false }) private gold!: Table;
  @ViewChild('land', { static: false }) private land!: Table;
  @ViewChild('bond', { static: false }) private bond!: Table;
  @ViewChild('vehicle', { static: false }) private vehicle!: Table;
  @ViewChild('storage', { static: false }) private storage!: Table;
  @ViewChild('other', { static: false }) private other!: Table;

  addButton: boolean = false;
  newRow: any;
  EditDeleteDisable: boolean = false;

  goldLoanMortgageColumns: any[] = [];
  landLoanMortgageColumns: any[] = [];
  bondLoanMortgageColumns: any[] = [];
  vehicleLoanMortgageColumns: any[] = [];
  storageLoanMortgageColumns: any[] = [];
  otherLoanMortgageColumns: any[] = [];

  isSameCollateral: Boolean = false;

  collateralType: any;
  landTypesList: any[] = [];

  addButtonService: boolean = false;
  termGoldLoanMortgageModelList: any[] = [];
  termLandLoanMortgageList: any[] = [];
  termBondLoanMortgageList: any[] = [];
  termVehicleLoanMortgageList: any[] = [];
  termStorageLoanMortgageList: any[] = [];
  termOtherLoanMortgageList: any[] = [];

  editDeleteDisable: boolean = false;
  landTypeName: any;

  constructor(private formBuilder: FormBuilder,
    private commonFunctionsService: CommonFunctionsService,
    private encryptDecryptService: EncryptDecryptService, private commonComponent: CommonComponent,
    private activateRoute: ActivatedRoute,
    private termLoanMortgageService: TermLoanMortgageService,
    private termLoanApplicationsService: TermApplicationService
  ) {

    this.termGoldMortgageForm = this.formBuilder.group({
      itemName: new FormControl('', Validators.required),
      netWeight: new FormControl('', Validators.required),
      grossWeight: new FormControl('', Validators.required),
      carats: new FormControl('', Validators.required),
      value: new FormControl('', Validators.required),
      remarks: new FormControl(''),
    })

    this.termLandMortgageForm = this.formBuilder.group({
      passbookNumber: new FormControl('', Validators.required),
      surveyNo: new FormControl('', Validators.required),
      landTypeName: new FormControl('', Validators.required),
      landUnits: new FormControl('', Validators.required),
      landSubUnits: new FormControl('', Validators.required),
      value: new FormControl('', Validators.required),
      declaredLandUnits: new FormControl('', Validators.required),
      declaredLandSubUnits: new FormControl('', Validators.required),
      // documentPath: new FormControl(''),
      remarks: new FormControl(''),
    })

    this.termBondMortgageForm = this.formBuilder.group({
      bondNumber: new FormControl('', Validators.required),
      faceValue: new FormControl('', Validators.required),
      surrenderValue: new FormControl('', Validators.required),
      // bondPath: new FormControl('', Validators.required),
      // pledgedFilePath: new FormControl('', Validators.required),
      maturityDate: new FormControl('', Validators.required),
      remarks: new FormControl('')
    })

    this.termVehicleMortgageForm = this.formBuilder.group({
      vechileName: new FormControl('', Validators.required),
      rcNumber: new FormControl('', Validators.required),
      // rcFilePath: new FormControl('', Validators.required),
      value: new FormControl('', Validators.required),
      brand: new FormControl('', Validators.required),
      remarks: new FormControl(''),
    })

    this.termStorageMortgageForm = this.formBuilder.group({
      name: new FormControl('', Validators.required),
      quantity: new FormControl('', Validators.required),
      totalWeight: new FormControl('', Validators.required),
      netWeight: new FormControl('', Validators.required),
      value: new FormControl('', Validators.required),
      remarks: new FormControl('')
    })

    this.termOtherMortgageForm = this.formBuilder.group({
      name: new FormControl('', Validators.required),
      noOfUnits: new FormControl('', Validators.required),
      value: new FormControl('', Validators.required),
      remarks: new FormControl('')
    })

  }

  ngOnInit() {
    this.isMemberCreation = this.commonFunctionsService.getStorageValue('b-class-member_creation');
    this.orgnizationSetting = this.commonComponent.orgnizationSettings();
    this.landTypesList = [
      { label: 'Dry Land', value: 1 },
      { label: 'Wet Land', value: 2 },
    ];
    //this.getAllLandTypes();
    this.collateraltypeOptionsList = [
      { label: 'Gold', value: 1 },
      { label: 'Land', value: 2 },
      { label: 'Bond', value: 3 },
      { label: 'Vehicle', value: 4 },
      { label: 'Storage', value: 5 },
      { label: 'Other', value: 6 }
    ];

    this.carratsList = [
      { label: 'Select', value: 'Select' },
      { label: '22', value: '22' },
      { label: '24', value: '24' },
    ];

    this.goldLoanMortgageColumns = [
      { field: 'itemName', header: 'ITEM NAME' },
      { field: 'netWeight', header: 'NET WEIGHT IN GRAMS' },
      { field: 'grossWeight', header: 'GROSS WEIGHT IN GRAMS' },
      { field: 'value', header: 'VALUE' },
      { field: 'remarks', header: 'REMARKS' },
      { field: 'Action', header: 'ACTION' },
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
      { field: 'remarks', header: 'REMARKS' },
      { field: 'Action', header: 'ACTION' },
    ];

    this.bondLoanMortgageColumns = [
      { field: 'itemName', header: 'ITEM NAME' },
      { field: 'netWeight', header: 'NET WEIGHT IN GRAMS' },
      { field: 'grossWeight', header: 'GROSS WEIGHT IN GRAMS' },
      { field: 'value', header: 'VALUE' },
      { field: 'remarks', header: 'REMARKS' },
      { field: 'Action', header: 'ACTION' },
    ];

    this.vehicleLoanMortgageColumns = [
      { field: 'itemName', header: 'ITEM NAME' },
      { field: 'netWeight', header: 'NET WEIGHT IN GRAMS' },
      { field: 'grossWeight', header: 'GROSS WEIGHT IN GRAMS' },
      { field: 'value', header: 'VALUE' },
      { field: 'remarks', header: 'REMARKS' },
      { field: 'Action', header: 'ACTION' },
    ];

    this.storageLoanMortgageColumns = [
      { field: 'itemName', header: 'ITEM NAME' },
      { field: 'netWeight', header: 'NET WEIGHT IN GRAMS' },
      { field: 'grossWeight', header: 'GROSS WEIGHT IN GRAMS' },
      { field: 'value', header: 'VALUE' },
      { field: 'remarks', header: 'REMARKS' },
      { field: 'Action', header: 'ACTION' },
    ];

    this.otherLoanMortgageColumns = [
      { field: 'itemName', header: 'ITEM NAME' },
      { field: 'netWeight', header: 'NET WEIGHT IN GRAMS' },
      { field: 'grossWeight', header: 'GROSS WEIGHT IN GRAMS' },
      { field: 'value', header: 'VALUE' },
      { field: 'remarks', header: 'REMARKS' },
      { field: 'Action', header: 'ACTION' },
    ];

    this.activateRoute.queryParams.subscribe(params => {
      if (params['id'] != undefined) {
        let queryParams = this.encryptDecryptService.decrypt(params['id']);
        this.termLoanApplicationId = Number(queryParams);
        // this.isEdit = true;
        this.getTermApplicationByTermAccId(this.termLoanApplicationId);
      } else {
        this.isEdit = false;
      }
    });

    this.termGoldMortgageForm.valueChanges.subscribe((data: any) => {
      this.updateData();
      // if (this.termGoldMortgageForm.valid) {
      //   this.save();
      // }
    });

    this.termLandMortgageForm.valueChanges.subscribe((data: any) => {
      this.updateData();
      // if (this.termLandMortgageForm.valid) {
      //   this.save();
      // }
    });

    this.termBondMortgageForm.valueChanges.subscribe((data: any) => {
      this.updateData();
      // if (this.termBondMortgageForm.valid) {
      //   this.save();
      // }
    });

    this.termVehicleMortgageForm.valueChanges.subscribe((data: any) => {
      this.updateData();
      // if (this.termVehicleMortgageForm.valid) {
      //   this.save();
      // }
    });

    this.termStorageMortgageForm.valueChanges.subscribe((data: any) => {
      this.updateData();
      // if (this.termStorageMortgageForm.valid) {
      //   this.save();
      // }
    });

    this.termOtherMortgageForm.valueChanges.subscribe((data: any) => {
      this.updateData();
      // if (this.termOtherMortgageForm.valid) {
      //   this.save();
      // }
    });

  }

  save() {
    this.updateData();
  }

  updateData() {
    if (this.collateralType == 1) {
      this.showGoldform = true;
      this.termGoldLoanMortgageModel.collateralType = this.collateralType;
      this.termLoanApplicationsService.changeData({
        formValid: this.termGoldMortgageForm.valid,
        data: this.termGoldLoanMortgageModel,
        isDisable: !this.termGoldMortgageForm.valid ? applicationConstants.TRUE : applicationConstants.FALSE,
        stepperIndex: 7,
      });
    } else if (this.collateralType == 2) {
      this.termLandLoanMortgageModel.collateralType = this.collateralType;
      // this.termLandLoanMortgageModel.landTypeName = this.landTypeName;
      this.termLoanApplicationsService.changeData({
        formValid: !this.termLandMortgageForm.valid ? true : false,
        data: this.termLandLoanMortgageModel,
        isDisable: applicationConstants.FALSE,
        stepperIndex: 7,
      });
    } else if (this.collateralType == 3) {
      this.termBondLoanMortgageModel.collateralType = this.collateralType;
      this.termLoanApplicationsService.changeData({
        formValid: !this.termBondMortgageForm.valid ? true : false,
        data: this.termBondLoanMortgageModel,
        isDisable: !this.termBondMortgageForm.valid ? applicationConstants.TRUE : applicationConstants.FALSE,
        stepperIndex: 7,
      });
    } else if (this.collateralType == 4) {
      this.termVehicleLoanMortgageModel.collateralType = this.collateralType;
      this.termLoanApplicationsService.changeData({
        formValid: !this.termVehicleMortgageForm.valid ? true : false,
        data: this.termVehicleLoanMortgageModel,
        isDisable: !this.termVehicleMortgageForm.valid ? applicationConstants.TRUE : applicationConstants.FALSE,
        stepperIndex: 7,
      });
    } else if (this.collateralType == 5) {
      this.termStorageLoanMortgageModel.collateralType = this.collateralType;
      this.termLoanApplicationsService.changeData({
        formValid: !this.termStorageMortgageForm.valid ? true : false,
        data: this.termStorageLoanMortgageModel,
        isDisable: !this.termStorageMortgageForm.valid ? applicationConstants.TRUE : applicationConstants.FALSE,
        stepperIndex: 7,
      });
    } else if (this.collateralType == 6) {
      this.termOtherLoanMortgageModel.collateralType = this.collateralType;
      this.termLoanApplicationsService.changeData({
        formValid: !this.termOtherMortgageForm.valid ? true : false,
        data: this.termOtherLoanMortgageModel,
        isDisable: !this.termOtherMortgageForm.valid ? applicationConstants.TRUE : applicationConstants.FALSE,
        stepperIndex: 7,
      });
    } else {
      this.termLoanApplicationsService.changeData({
        formValid: false,
        data: null,
        isDisable: true,
        stepperIndex: 7,
      });
    }
  }

  // getAllLandTypes() {
    
  //   this.commonComponent.startSpinner();
  //   this, this.termLoanMortgageService.getAllLandTypes().subscribe(response => {
  //     this.responseModel = response;
  //     if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
  //       this.commonComponent.stopSpinner();
  //       this.landTypesList = this.responseModel.data.filter((landType: { status: number; }) => landType.status == 1).map((landType: any) => {
  //         return { label: landType.name, value: landType.id };
  //       });
  //     }
  //   },
  //     error => {
  //       this.msgs = [];
  //       this.commonComponent.stopSpinner();
  //       this.msgs.push({ severity: 'error', detail: applicationConstants.WE_COULDNOT_PROCESS_YOU_ARE_REQUEST });
  //     })
  // }

  // onChangeLandType(event: any) {
  //   if (event != null && event != undefined) {
  //     const filteredItem = this.landTypesList.find((item: { value: any; }) => item.value === event);
  //     this.landTypeName = filteredItem.label;
  //   }
  // }

  getTermApplicationByTermAccId(termLoanApplicationId: any) {
    this.commonFunctionsService
    this.termLoanApplicationsService.getTermApplicationByTermAccId(termLoanApplicationId).subscribe((data: any) => {
      this.responseModel = data;
      if (this.responseModel != null && this.responseModel != undefined) {
        if (this.responseModel != null && this.responseModel != undefined) {
          if (this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {

            if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
              if (this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
                this.termLoanApplicationModel = this.responseModel.data[0];

                if (this.termLoanApplicationModel.collateralType != undefined) {
                  this.collateralType = this.termLoanApplicationModel.collateralType;
                  if (this.termLoanApplicationModel.collateralType == 1) {
                    this.getTermGoldLoanMortgageDetailsBytermLoanApplicationId(termLoanApplicationId);
                  } else if (this.termLoanApplicationModel.collateralType == 2) {
                    this.getTermLandLoanMortgageDetailsBytermLoanApplicationId(termLoanApplicationId);
                  } else if (this.termLoanApplicationModel.collateralType == 3) {
                    this.getTermBondLoanMortgageDetailsBytermLoanApplicationId(termLoanApplicationId);
                  } else if (this.termLoanApplicationModel.collateralType == 4) {
                    this.getTermVehicleLoanMortgageDetailsBytermLoanApplicationId(termLoanApplicationId);
                  } else if (this.termLoanApplicationModel.collateralType == 5) {
                    this.getTermStorageLoanMortgageDetailsBytermLoanApplicationId(termLoanApplicationId);
                  } else if (this.termLoanApplicationModel.collateralType == 6) {
                    this.getTermOtherLoanMortgageDetailsBytermLoanApplicationId(termLoanApplicationId);
                  }
                }
                //  this.updateData();
              }
            }
          }
        }
      }
    });
  }

  onChange(event: any) {
    this.getFormBasedOnCollateralType(event);
    this.collateralType = event;
  }

  getFormBasedOnCollateralType(collateralType: any) {
    this.termGoldLoanMortgageModel = new TermGoldLoanMortgage();
    this.termLandLoanMortgageModel = new TermLandLoanMortgage();
    this.termBondLoanMortgageModel = new TermBondLoanMortgage();
    this.termVehicleLoanMortgageModel = new TermVehicleLoanMortgage();
    this.termStorageLoanMortgageModel = new TermStorageLoanMortgage();
    this.termOtherLoanMortgageModel = new TermOtherLoanMortgage();

    this.isSameCollateral = false;

    if (collateralType == 1) {
      this.collateralType = collateralType;
      this.termGoldLoanMortgageModel.termLoanApplicationId = this.termLoanApplicationId;
      this.termGoldLoanMortgageModel.collateralType = this.collateralType;
      this.showGoldform = true;
      this.showLandform = false;
      this.showBondform = false;
      this.showVehicleform = false;
      this.showStorageform = false;
      this.showOtherform = false;
    } else if (collateralType == 2) {
      this.collateralType = collateralType;
      this.termLandLoanMortgageModel.termLoanApplicationId = this.termLoanApplicationId;
      this.termLandLoanMortgageModel.collateralType = this.collateralType;
      this.showGoldform = false;
      this.showLandform = true;
      this.showBondform = false;
      this.showStorageform = false;
      this.showOtherform = false;
    } else if (collateralType == 3) {
      this.collateralType = collateralType;
      this.termBondLoanMortgageModel.termLoanApplicationId = this.termLoanApplicationId;
      this.termBondLoanMortgageModel.collateralType = this.collateralType;
      this.showGoldform = false;
      this.showLandform = false;
      this.showBondform = true;
      this.showVehicleform = false;
      this.showStorageform = false;
      this.showOtherform = false;
    } else if (collateralType == 4) {
      this.collateralType = collateralType;
      this.termVehicleLoanMortgageModel.termLoanApplicationId = this.termLoanApplicationId;
      this.termVehicleLoanMortgageModel.collateralType = this.collateralType;
      this.showGoldform = false;
      this.showLandform = false;
      this.showBondform = false;
      this.showVehicleform = true;
      this.showStorageform = false;
      this.showOtherform = false;
    } else if (collateralType == 5) {
      this.collateralType = collateralType;
      this.termStorageLoanMortgageModel.termLoanApplicationId = this.termLoanApplicationId;
      this.termStorageLoanMortgageModel.collateralType = this.collateralType;
      this.showGoldform = false;
      this.showLandform = false;
      this.showBondform = false;
      this.showVehicleform = false;
      this.showStorageform = true;
      this.showOtherform = false;
    } else if (collateralType == 6) {
      this.collateralType = collateralType;
      this.termOtherLoanMortgageModel.termLoanApplicationId = this.termLoanApplicationId;
      this.termOtherLoanMortgageModel.collateralType = this.collateralType;
      this.showGoldform = false;
      this.showLandform = false;
      this.showBondform = false;
      this.showVehicleform = false;
      this.showStorageform = false;
      this.showOtherform = true;
    } else {
      this.showGoldform = false;
      this.showLandform = false;
      this.showBondform = false;
      this.showVehicleform = false;
      this.showStorageform = false;
      this.showOtherform = false;
    }
    this.updateData();
  }

  getEditFormBasedOnCollateralType(collateralType: any) {
    if (collateralType == 1) {
      this.showGoldform = true;
      this.showLandform = false;
      this.showBondform = false;
      this.showVehicleform = false;
      this.showStorageform = false;
      this.showOtherform = false;
      // this.termGoldLoanMortgageModelList = this.termGoldLoanMortgageModel.siLoanGoldMortgageDetailsDTOList;
    } else if (collateralType == 2) {
      this.showGoldform = false;
      this.showLandform = true;
      this.showBondform = false;
      this.showVehicleform = false;
      this.showStorageform = false;
      this.showOtherform = false;
      // this.termLandLoanMortgageModelList = this.termLandLoanMortgageModel.siLoanLandMortgageDetailsDTOList;
    } else if (collateralType == 3) {
      this.showGoldform = false;
      this.showLandform = false;
      this.showBondform = true;
      this.showVehicleform = false;
      this.showStorageform = false;
      this.showOtherform = false;
      // this.termBondLoanMortgageModelList = this.termBondLoanMortgageModel.siBondsMortgageDetailsDTOList;
    } else if (collateralType == 4) {
      this.showGoldform = false;
      this.showLandform = false;
      this.showBondform = false;
      this.showVehicleform = true;
      this.showStorageform = false;
      this.showOtherform = false;
      // this.termVehicleLoanMortgageModelList = this.termVehicleLoanMortgageModel.siLoanVehicleMortgageDetailsDTOList;
    } else if (collateralType == 5) {
      this.showGoldform = false;
      this.showLandform = false;
      this.showBondform = false;
      this.showVehicleform = false;
      this.showStorageform = true;
      this.showOtherform = false;
      // this.termStorageLoanMortgageModelList = this.termStorageLoanMortgageModel.siStorageMortgageDetailsDTOList;
    } else if (collateralType == 6) {
      this.showGoldform = false;
      this.showLandform = false;
      this.showBondform = false;
      this.showVehicleform = false;
      this.showStorageform = false;
      this.showOtherform = true;
      // this.termOtherLoanMortgageModelList = this.termOtherLoanMortgageModel.siOtherMortgageDetailsDTOList;
    }
    this.updateData();
  }

  //Get Gold Loan Mortgage detial by termLoanApplicationId and AdmissionNumber
  getTermGoldLoanMortgageDetailsBytermLoanApplicationId(termLoanApplicationId: any) {
    this.termLoanMortgageService.getTermGoldLoanMortagageDetailsById(termLoanApplicationId).subscribe((data: any) => {
      this.responseModel = data;
      if (this.responseModel != null && this.responseModel != undefined) {
        this.isEdit = true;
        if (this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
          if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
            this.termGoldLoanMortgageModelList = this.responseModel.data;
            if (this.termLoanApplicationModel.collateralType != null && this.termLoanApplicationModel.collateralType != undefined)
              this.getEditFormBasedOnCollateralType(this.termLoanApplicationModel.collateralType);

            // this.updateData();
          }
        }
      }
    });
  }

  //Get Land Loan Mortgage detial by termLoanApplicationId and AdmissionNumber
  getTermLandLoanMortgageDetailsBytermLoanApplicationId(termLoanApplicationId: any) {
    this.commonFunctionsService
    this.termLoanMortgageService.getTermLandLoanMortagageDetailsById(termLoanApplicationId).subscribe((data: any) => {
      this.responseModel = data;
      if (this.responseModel != null && this.responseModel != undefined) {
        this.isEdit = true;
        if (this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
          if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
            this.termLandLoanMortgageList = this.responseModel.data;
            if (this.termLoanApplicationModel.collateralType != null && this.termLoanApplicationModel.collateralType != undefined)
              this.getEditFormBasedOnCollateralType(this.termLoanApplicationModel.collateralType);

            // this.updateData();
          }
        }
      }
    });
  }

  //Get BOnd Loan Mortgage detial by termLoanApplicationId and AdmissionNumber
  getTermBondLoanMortgageDetailsBytermLoanApplicationId(termLoanApplicationId: any) {
    this.commonFunctionsService
    this.termLoanMortgageService.getTermBondLoanMortagageDetailsById(termLoanApplicationId).subscribe((data: any) => {
      this.responseModel = data;
      if (this.responseModel != null && this.responseModel != undefined) {
        this.isEdit = true;
        if (this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
          if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
            this.termBondLoanMortgageList = this.responseModel.data;
            if (this.termLoanApplicationModel.collateralType != null && this.termLoanApplicationModel.collateralType != undefined)
              this.getEditFormBasedOnCollateralType(this.termLoanApplicationModel.collateralType);

            this.updateData();
          }
        }
      }
    });
  }

  //Get Vehicle Loan Mortgage detial by termLoanApplicationId and AdmissionNumber
  getTermVehicleLoanMortgageDetailsBytermLoanApplicationId(termLoanApplicationId: any) {
    this.commonFunctionsService
    this.termLoanMortgageService.getTermVehicleLoanMortagageDetailsById(termLoanApplicationId).subscribe((data: any) => {
      this.responseModel = data;
      if (this.responseModel != null && this.responseModel != undefined) {
        this.isEdit = true;
        if (this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
          if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
            this.termVehicleLoanMortgageList = this.responseModel.data;
            if (this.termLoanApplicationModel.collateralType != null && this.termLoanApplicationModel.collateralType != undefined)
              this.getEditFormBasedOnCollateralType(this.termLoanApplicationModel.collateralType);

            this.updateData();
          }
        }
      }
    });
  }

  //Get Storage Loan Mortgage detial by termLoanApplicationId and AdmissionNumber
  getTermStorageLoanMortgageDetailsBytermLoanApplicationId(termLoanApplicationId: any) {
    this.commonFunctionsService
    this.termLoanMortgageService.getTermStorageLoanMortagageDetailsById(termLoanApplicationId).subscribe((data: any) => {
      this.responseModel = data;
      if (this.responseModel != null && this.responseModel != undefined) {
        this.isEdit = true;
        if (this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
          if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
            this.termStorageLoanMortgageList = this.responseModel.data;
            if (this.termLoanApplicationModel.collateralType != null && this.termLoanApplicationModel.collateralType != undefined)
              this.getEditFormBasedOnCollateralType(this.termLoanApplicationModel.collateralType);

            this.updateData();
          }
        }
      }
    });
  }

  //Get Other Loan Mortgage detial by termLoanApplicationId and AdmissionNumber
  getTermOtherLoanMortgageDetailsBytermLoanApplicationId(termLoanApplicationId: any) {
    this.commonFunctionsService
    this.termLoanMortgageService.getTermOtherLoanMortagageDetailsById(termLoanApplicationId).subscribe((data: any) => {
      this.responseModel = data;
      if (this.responseModel != null && this.responseModel != undefined) {
        this.isEdit = true;
        if (this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
          if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
            this.termOtherLoanMortgageList = this.responseModel.data;
            if (this.termLoanApplicationModel.collateralType != null && this.termLoanApplicationModel.collateralType != undefined)
              this.getEditFormBasedOnCollateralType(this.termLoanApplicationModel.collateralType);

            this.updateData();
          }
        }
      }
    });
  }

  getTermLoanMortgageDetailsBytermLoanApplicationId(termLoanApplicationId: any) {
    this.termLoanMortgageService.getTermGoldLoanMortagageDetailsById(termLoanApplicationId).subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel != null && this.responseModel != undefined) {
        if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
          if (this.responseModel.data != null && this.responseModel.data != undefined && this.responseModel.data.length > 0) {
            this.termGoldLoanMortgageModel = this.responseModel.data[0];
            this.termLoanApplicationsService.changeData({
              formValid: this.termGoldMortgageForm.valid,
              data: this.termGoldLoanMortgageModel,
              isDisable: (!this.termGoldMortgageForm.valid),
              stepperIndex: 5,
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

  addGoldLoanMortgage() {
    this.termGoldLoanMortgageModel = new TermGoldLoanMortgage();
    this.addButtonService = true;
    this.editDeleteDisable = true;
    /**
     * for update validation
     */
    this.updateData();
    this.gold._first = 0;
    this.gold.value.unshift({ itemName: '', netWeight: '', grossWeight: '', carats: '', value: '', remarks: '' });
    this.gold.initRowEdit(this.gold.value[0]);
  }

  addLandLoanMortgage() {
    this.termLandLoanMortgageModel = new TermLandLoanMortgage();
    this.addButtonService = true;
    this.editDeleteDisable = true;
    /**
     * for update validation
     */
    this.updateData();
    this.land._first = 0;
    this.land.value.unshift({ passbookNumber: '', surveyNo: '', landType: '', landUnits: '', landSubUnits: '', value: '', declaredLandUnits: '', declaredLandSubUnits: '', remarks: '' });
    this.land.initRowEdit(this.land.value[0]);
  }

  addBondLoanMortgage() {
    this.termBondLoanMortgageModel = new TermBondLoanMortgage();
    this.addButtonService = true;
    this.editDeleteDisable = true;
    /**
     * for update validation
     */
    this.updateData();
    this.bond._first = 0;
    this.bond.value.unshift({ bondNumber: '', faceValue: '', surrenderValue: '', maturityDate: '', remarks: '' });
    this.bond.initRowEdit(this.bond.value[0]);
  }

  addVehicleLoanMortgage() {
    this.termVehicleLoanMortgageModel = new TermVehicleLoanMortgage();
    this.addButtonService = true;
    this.editDeleteDisable = true;
    /**
     * for update validation
     */
    this.updateData();
    this.vehicle._first = 0;
    this.vehicle.value.unshift({ vechileName: '', rcNumber: '', value: '', brand: '', remarks: '' });
    this.vehicle.initRowEdit(this.vehicle.value[0]);
  }

  addStorageLoanMortgage() {
    this.termStorageLoanMortgageModel = new TermStorageLoanMortgage();
    this.addButtonService = true;
    this.editDeleteDisable = true;
    /**
     * for update validation
     */
    this.updateData();
    this.storage._first = 0;
    this.storage.value.unshift({ name: '', quantity: '', totalWeight: '', netWeight: '', value: '', remarks: '' });
    this.storage.initRowEdit(this.storage.value[0]);
  }

  addOtherLoanMortgage() {
    this.termOtherLoanMortgageModel = new TermOtherLoanMortgage();
    this.addButtonService = true;
    this.editDeleteDisable = true;
    /**
     * for update validation
     */
    this.updateData();
    this.other._first = 0;
    this.other.value.unshift({ name: '', noOfUnits: '', value: '', remarks: '' });
    this.other.initRowEdit(this.other.value[0]);
  }

  saveGoldLoanMortgage(row: any) {
    this.addButtonService = false;
    this.editDeleteDisable = false;
    this.termGoldLoanMortgageModel = row;
    this.termGoldLoanMortgageModel.termLoanApplicationId = this.termLoanApplicationId;
    this.termGoldLoanMortgageModel.admissionNo = this.termLoanApplicationModel.admissionNo;
    this.termGoldLoanMortgageModel.status = applicationConstants.ACTIVE;
    this.updateData();
    if (row.id != null && row.id != undefined) {
      this.termLoanMortgageService.updateTermGoldLoanMortagageDetails(this.termGoldLoanMortgageModel).subscribe((response: any) => {
        this.responseModel = response;
        if (this.responseModel != null && this.responseModel != undefined) {
          if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
            if (this.responseModel.data != null && this.responseModel.data != undefined && this.responseModel.data.length > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
              this.termGoldLoanMortgageModel = this.responseModel.data;
              this.addButtonService = false;
              if (this.responseModel.data[0].termLoanApplicationId != null && this.responseModel.data[0].termLoanApplicationId != undefined) {
                this.getTermGoldLoanMortgageDetailsBytermLoanApplicationId(this.responseModel.data[0].termLoanApplicationId);
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
    else {
      this.termLoanMortgageService.addTermGoldLoanMortagageDetails(this.termGoldLoanMortgageModel).subscribe((response: any) => {
        this.responseModel = response;
        if (this.responseModel != null && this.responseModel != undefined) {
          if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
            if (this.responseModel.data != null && this.responseModel.data != undefined && this.responseModel.data.length > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
              this.termGoldLoanMortgageModel = this.responseModel.data;
              this.addButtonService = false;
              if (this.responseModel.data[0].termLoanApplicationId != null && this.responseModel.data[0].sbAccId != undefined) {
                this.getTermGoldLoanMortgageDetailsBytermLoanApplicationId(this.responseModel.data[0].termLoanApplicationId);
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
  }

  saveLandLoanMortgage(row: any) {
    this.addButtonService = false;
    this.editDeleteDisable = false;
    this.termLandLoanMortgageModel = row;
    this.termLandLoanMortgageModel.admissionNo = this.termLoanApplicationModel.admissionNo;
    this.termLandLoanMortgageModel.termLoanApplicationId = this.termLoanApplicationId;
    this.termLandLoanMortgageModel.status = applicationConstants.ACTIVE;
    this.updateData();
    if (row.id != null && row.id != undefined) {
      this.termLoanMortgageService.updateTermLandLoanMortagageDetails(this.termLandLoanMortgageModel).subscribe((response: any) => {
        this.responseModel = response;
        if (this.responseModel != null && this.responseModel != undefined) {
          if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
            if (this.responseModel.data != null && this.responseModel.data != undefined && this.responseModel.data.length > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
              this.termLandLoanMortgageModel = this.responseModel.data;
              this.addButtonService = false;
              if (this.responseModel.data[0].termLoanApplicationId != null && this.responseModel.data[0].termLoanApplicationId != undefined) {
                this.getTermLandLoanMortgageDetailsBytermLoanApplicationId(this.responseModel.data[0].termLoanApplicationId);
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
    else {
      this.termLoanMortgageService.addTermLandLoanMortagageDetails(this.termLandLoanMortgageModel).subscribe((response: any) => {
        this.responseModel = response;
        if (this.responseModel != null && this.responseModel != undefined) {
          if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
            if (this.responseModel.data != null && this.responseModel.data != undefined && this.responseModel.data.length > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
              this.termLandLoanMortgageModel = this.responseModel.data;
              this.addButtonService = false;
              if (this.responseModel.data[0].termLoanApplicationId != null && this.responseModel.data[0].sbAccId != undefined) {
                this.getTermLandLoanMortgageDetailsBytermLoanApplicationId(this.responseModel.data[0].termLoanApplicationId);
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
  }

  saveBondLoanMortgage(row: any) {
    this.addButtonService = false;
    this.editDeleteDisable = false;
    this.termBondLoanMortgageModel = row;
    this.termBondLoanMortgageModel.termLoanApplicationId = this.termLoanApplicationId;
    this.termBondLoanMortgageModel.admissionNo = this.termLoanApplicationModel.admissionNo;
    this.termBondLoanMortgageModel.status = applicationConstants.ACTIVE;
    this.updateData();
    if (row.id != null && row.id != undefined) {
      this.termLoanMortgageService.updateTermBondLoanMortagageDetails(this.termBondLoanMortgageModel).subscribe((response: any) => {
        this.responseModel = response;
        if (this.responseModel != null && this.responseModel != undefined) {
          if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
            if (this.responseModel.data != null && this.responseModel.data != undefined && this.responseModel.data.length > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
              this.termBondLoanMortgageModel = this.responseModel.data;
              this.addButtonService = false;
              if (this.responseModel.data[0].termLoanApplicationId != null && this.responseModel.data[0].termLoanApplicationId != undefined) {
                this.getTermBondLoanMortgageDetailsBytermLoanApplicationId(this.responseModel.data[0].termLoanApplicationId);
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
    else {
      this.termLoanMortgageService.addTermBondLoanMortagageDetails(this.termBondLoanMortgageModel).subscribe((response: any) => {
        this.responseModel = response;
        if (this.responseModel != null && this.responseModel != undefined) {
          if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
            if (this.responseModel.data != null && this.responseModel.data != undefined && this.responseModel.data.length > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
              this.termBondLoanMortgageModel = this.responseModel.data;
              this.addButtonService = false;
              if (this.responseModel.data[0].termLoanApplicationId != null && this.responseModel.data[0].sbAccId != undefined) {
                this.getTermBondLoanMortgageDetailsBytermLoanApplicationId(this.responseModel.data[0].termLoanApplicationId);
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
  }

  saveVehicleLoanMortgage(row: any) {
    this.addButtonService = false;
    this.editDeleteDisable = false;
    this.termVehicleLoanMortgageModel = row;
    this.termVehicleLoanMortgageModel.termLoanApplicationId = this.termLoanApplicationId;
    this.termVehicleLoanMortgageModel.admissionNo = this.termLoanApplicationModel.admissionNo;
    this.termVehicleLoanMortgageModel.status = applicationConstants.ACTIVE;
    this.updateData();
    if (row.id != null && row.id != undefined) {
      this.termLoanMortgageService.updateTermVehicleLoanMortagageDetails(this.termVehicleLoanMortgageModel).subscribe((response: any) => {
        this.responseModel = response;
        if (this.responseModel != null && this.responseModel != undefined) {
          if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
            if (this.responseModel.data != null && this.responseModel.data != undefined && this.responseModel.data.length > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
              this.termVehicleLoanMortgageModel = this.responseModel.data;
              this.addButtonService = false;
              if (this.responseModel.data[0].termLoanApplicationId != null && this.responseModel.data[0].termLoanApplicationId != undefined) {
                this.getTermVehicleLoanMortgageDetailsBytermLoanApplicationId(this.responseModel.data[0].termLoanApplicationId);
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
    else {
      this.termLoanMortgageService.addTermVehicleLoanMortagageDetails(this.termVehicleLoanMortgageModel).subscribe((response: any) => {
        this.responseModel = response;
        if (this.responseModel != null && this.responseModel != undefined) {
          if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
            if (this.responseModel.data != null && this.responseModel.data != undefined && this.responseModel.data.length > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
              this.termVehicleLoanMortgageModel = this.responseModel.data;
              this.addButtonService = false;
              if (this.responseModel.data[0].termLoanApplicationId != null && this.responseModel.data[0].sbAccId != undefined) {
                this.getTermVehicleLoanMortgageDetailsBytermLoanApplicationId(this.responseModel.data[0].termLoanApplicationId);
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
  }

  saveStorageLoanMortgage(row: any) {
    this.addButtonService = false;
    this.editDeleteDisable = false;
    this.termStorageLoanMortgageModel = row;
    this.termStorageLoanMortgageModel.termLoanApplicationId = this.termLoanApplicationId;
    this.termStorageLoanMortgageModel.admissionNo = this.termLoanApplicationModel.admissionNo;
    this.termStorageLoanMortgageModel.status = applicationConstants.ACTIVE;
    this.updateData();
    if (row.id != null && row.id != undefined) {
      this.termLoanMortgageService.updateTermStorageLoanMortagageDetails(this.termStorageLoanMortgageModel).subscribe((response: any) => {
        this.responseModel = response;
        if (this.responseModel != null && this.responseModel != undefined) {
          if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
            if (this.responseModel.data != null && this.responseModel.data != undefined && this.responseModel.data.length > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
              this.termStorageLoanMortgageModel = this.responseModel.data;
              this.addButtonService = false;
              if (this.responseModel.data[0].termLoanApplicationId != null && this.responseModel.data[0].termLoanApplicationId != undefined) {
                this.getTermStorageLoanMortgageDetailsBytermLoanApplicationId(this.responseModel.data[0].termLoanApplicationId);
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
    else {
      this.termLoanMortgageService.addTermStorageLoanMortagageDetails(this.termStorageLoanMortgageModel).subscribe((response: any) => {
        this.responseModel = response;
        if (this.responseModel != null && this.responseModel != undefined) {
          if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
            if (this.responseModel.data != null && this.responseModel.data != undefined && this.responseModel.data.length > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
              this.termStorageLoanMortgageModel = this.responseModel.data;
              this.addButtonService = false;
              if (this.responseModel.data[0].termLoanApplicationId != null && this.responseModel.data[0].sbAccId != undefined) {
                this.getTermStorageLoanMortgageDetailsBytermLoanApplicationId(this.responseModel.data[0].termLoanApplicationId);
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
  }

  saveOtherLoanMortgage(row: any) {
    this.addButtonService = false;
    this.editDeleteDisable = false;
    this.termOtherLoanMortgageModel = row;
    this.termOtherLoanMortgageModel.termLoanApplicationId = this.termLoanApplicationId;
    this.termOtherLoanMortgageModel.admissionNo = this.termLoanApplicationModel.admissionNo;
    this.termOtherLoanMortgageModel.status = applicationConstants.ACTIVE;
    this.updateData();
    if (row.id != null && row.id != undefined) {
      this.termLoanMortgageService.updateTermOtherLoanMortagageDetails(this.termOtherLoanMortgageModel).subscribe((response: any) => {
        this.responseModel = response;
        if (this.responseModel != null && this.responseModel != undefined) {
          if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
            if (this.responseModel.data != null && this.responseModel.data != undefined && this.responseModel.data.length > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
              this.termOtherLoanMortgageModel = this.responseModel.data;
              this.addButtonService = false;
              if (this.responseModel.data[0].termLoanApplicationId != null && this.responseModel.data[0].termLoanApplicationId != undefined) {
                this.getTermOtherLoanMortgageDetailsBytermLoanApplicationId(this.responseModel.data[0].termLoanApplicationId);
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
    else {
      this.termLoanMortgageService.addTermOtherLoanMortagageDetails(this.termOtherLoanMortgageModel).subscribe((response: any) => {
        this.responseModel = response;
        if (this.responseModel != null && this.responseModel != undefined) {
          if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
            if (this.responseModel.data != null && this.responseModel.data != undefined && this.responseModel.data.length > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
              this.termOtherLoanMortgageModel = this.responseModel.data;
              this.addButtonService = false;
              if (this.responseModel.data[0].termLoanApplicationId != null && this.responseModel.data[0].sbAccId != undefined) {
                this.getTermOtherLoanMortgageDetailsBytermLoanApplicationId(this.responseModel.data[0].termLoanApplicationId);
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
  }

  cancelGoldLoanMortgage() {
    this.termGoldLoanMortgageModelList = [];
    this.addButtonService = false;
    this.editDeleteDisable = false;
    this.getTermGoldLoanMortgageDetailsBytermLoanApplicationId(this.termLoanApplicationId);
  }

  cancelLandLoanMortgage() {
    this.termLandLoanMortgageList = [];
    this.addButtonService = false;
    this.editDeleteDisable = false;
    this.getTermLandLoanMortgageDetailsBytermLoanApplicationId(this.termLoanApplicationId);
  }

  cancelBondLoanMortgage() {
    this.termBondLoanMortgageList = [];
    this.addButtonService = false;
    this.editDeleteDisable = false;
    this.getTermBondLoanMortgageDetailsBytermLoanApplicationId(this.termLoanApplicationId);
  }

  cancelVehicleLoanMortgage() {
    this.termVehicleLoanMortgageList = [];
    this.addButtonService = false;
    this.editDeleteDisable = false;
    this.getTermVehicleLoanMortgageDetailsBytermLoanApplicationId(this.termLoanApplicationId);
  }

  cancelStorageLoanMortgage() {
    this.termStorageLoanMortgageList = [];
    this.addButtonService = false;
    this.editDeleteDisable = false;
    this.getTermStorageLoanMortgageDetailsBytermLoanApplicationId(this.termLoanApplicationId);
  }

  cancelOtherLoanMortgage() {
    this.termOtherLoanMortgageList = [];
    this.addButtonService = false;
    this.editDeleteDisable = false;
    this.getTermOtherLoanMortgageDetailsBytermLoanApplicationId(this.termLoanApplicationId);
  }


  editGoldLoanMortgage(rowData: any) {
    this.addButtonService = true;
    this.editDeleteDisable = true;
    this.updateData();
    this.termLoanMortgageService.getTermGoldLoanMortagageDetailsById(rowData.id).subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel != null && this.responseModel != undefined) {
        if (this.responseModel.status != null && this.responseModel.status != undefined && this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
          if (this.responseModel.data != null && this.responseModel.data != undefined && this.responseModel.data.length > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
            this.termGoldLoanMortgageModel = this.responseModel.data[0];
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

  editLandLoanMortgage(rowData: any) {
    this.addButtonService = true;
    this.editDeleteDisable = true;
    
    this.termLoanMortgageService.getTermLandLoanMortagageDetailsById(rowData.id).subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel != null && this.responseModel != undefined) {
        if (this.responseModel.status != null && this.responseModel.status != undefined && this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
          if (this.responseModel.data != null && this.responseModel.data != undefined && this.responseModel.data.length > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
            this.termLandLoanMortgageModel = this.responseModel.data[0];
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
      this.updateData();
    }, error => {
      this.commonComponent.stopSpinner();
      this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: applicationConstants.SERVER_DOWN_ERROR }];
      setTimeout(() => {
        this.msgs = [];
      }, 3000);
    });
  }

  editBondLoanMortgage(rowData: any) {
    this.addButtonService = true;
    this.editDeleteDisable = true;
    this.updateData();
    this.termLoanMortgageService.getTermBondLoanMortagageDetailsById(rowData.id).subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel != null && this.responseModel != undefined) {
        if (this.responseModel.status != null && this.responseModel.status != undefined && this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
          if (this.responseModel.data != null && this.responseModel.data != undefined && this.responseModel.data.length > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
            this.termBondLoanMortgageModel = this.responseModel.data[0];
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

  editVehicleLoanMortgage(rowData: any) {
    this.addButtonService = true;
    this.editDeleteDisable = true;
    this.updateData();
    this.termLoanMortgageService.getTermVehicleLoanMortagageDetailsById(rowData.id).subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel != null && this.responseModel != undefined) {
        if (this.responseModel.status != null && this.responseModel.status != undefined && this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
          if (this.responseModel.data != null && this.responseModel.data != undefined && this.responseModel.data.length > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
            this.termVehicleLoanMortgageModel = this.responseModel.data[0];
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

  editStorageLoanMortgage(rowData: any) {
    this.addButtonService = true;
    this.editDeleteDisable = true;
    this.updateData();
    this.termLoanMortgageService.getTermStorageLoanMortagageDetailsById(rowData.id).subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel != null && this.responseModel != undefined) {
        if (this.responseModel.status != null && this.responseModel.status != undefined && this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
          if (this.responseModel.data != null && this.responseModel.data != undefined && this.responseModel.data.length > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
            this.termStorageLoanMortgageModel = this.responseModel.data[0];
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

  editOtherLoanMortgage(rowData: any) {
    this.addButtonService = true;
    this.editDeleteDisable = true;
    this.updateData();
    this.termLoanMortgageService.getTermOtherLoanMortagageDetailsById(rowData.id).subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel != null && this.responseModel != undefined) {
        if (this.responseModel.status != null && this.responseModel.status != undefined && this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
          if (this.responseModel.data != null && this.responseModel.data != undefined && this.responseModel.data.length > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
            this.termOtherLoanMortgageModel = this.responseModel.data[0];
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

  deleteGoldLoanMortgage(row: any) {
    this.termLoanMortgageService.deleteTermGoldLoanMortagageDetails(row.id).subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
        this.termGoldLoanMortgageModelList = this.responseModel.data;
        this.getTermGoldLoanMortgageDetailsBytermLoanApplicationId(this.termLoanApplicationId);
      }
    });
  }

  deleteLandLoanMortgage(row: any) {
    this.termLoanMortgageService.deleteTermLandLoanMortagageDetails(row.id).subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
        this.termLandLoanMortgageList = this.responseModel.data;
        this.getTermLandLoanMortgageDetailsBytermLoanApplicationId(this.termLoanApplicationId);
      }
    });
  }

  deleteBondLoanMortgage(row: any) {
    this.termLoanMortgageService.deleteTermBondLoanMortagageDetails(row.id).subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
        this.termBondLoanMortgageList = this.responseModel.data;
        this.getTermBondLoanMortgageDetailsBytermLoanApplicationId(this.termLoanApplicationId);
      }
    });
  }

  deleteVehicleLoanMortgage(row: any) {
    this.termLoanMortgageService.deleteTermVehicleLoanMortagageDetails(row.id).subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
        this.termVehicleLoanMortgageList = this.responseModel.data;
        this.getTermVehicleLoanMortgageDetailsBytermLoanApplicationId(this.termLoanApplicationId);
      }
    });
  }

  deleteStorageLoanMortgage(row: any) {
    this.termLoanMortgageService.deleteTermStorageLoanMortagageDetails(row.id).subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
        this.termStorageLoanMortgageList = this.responseModel.data;
        this.getTermStorageLoanMortgageDetailsBytermLoanApplicationId(this.termLoanApplicationId);
      }
    });
  }

  deleteOtherLoanMortgage(row: any) {
    this.termLoanMortgageService.deleteTermOtherLoanMortagageDetails(row.id).subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
        this.termOtherLoanMortgageList = this.responseModel.data;
        this.getTermOtherLoanMortgageDetailsBytermLoanApplicationId(this.termLoanApplicationId);
      }
    });
  }
}
