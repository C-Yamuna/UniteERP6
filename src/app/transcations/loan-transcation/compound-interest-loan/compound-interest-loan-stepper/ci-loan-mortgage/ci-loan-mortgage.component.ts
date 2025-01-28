import { Component, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SelectItem } from 'primeng/api';
import { Table } from 'primeng/table';
import { CommonComponent } from 'src/app/shared/common.component';
import { CommonFunctionsService } from 'src/app/shared/commonfunction.service';
import { EncryptDecryptService } from 'src/app/shared/encrypt-decrypt.service';
import { Responsemodel } from 'src/app/shared/responsemodel';
import { CiLoanMortgageService } from './shared/ci-loan-mortgage.service';
import { CiLoanApplicationService } from '../ci-product-details/shared/ci-loan-application.service';
import { applicationConstants } from 'src/app/shared/applicationConstants';
import { MembershipBasicDetails, MembershipGroupDetails, MemInstitutionDetails } from '../ci-membership-details/shared/membership-details.model';
import { CiLoanApplication } from '../ci-product-details/shared/ci-loan-application.model';
import { CiBondsMortgageLoan, CiGoldMortgageLoan, CiLandMortgageLoan, CiOthersMortgageLoan, CiStorageMortgageLoan, CiVehicleMortgageLoan } from './shared/ci-loan-mortgage.model';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-ci-loan-mortgage',
  templateUrl: './ci-loan-mortgage.component.html',
  styleUrls: ['./ci-loan-mortgage.component.css']
})
export class CiLoanMortgageComponent {
  ciGoldMortgageForm: FormGroup;
  ciLandMortgageForm: FormGroup;
  ciBondMortgageForm: FormGroup;
  ciVehicleMortgageForm: FormGroup;
  ciStorageMortgageForm: FormGroup;
  ciOtherMortgageForm: FormGroup;

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

  membershipBasicDetailsModel: MembershipBasicDetails = new MembershipBasicDetails();
  membershipGroupDetailsModel: MembershipGroupDetails = new MembershipGroupDetails();
  membershipInstitutionDetailsModel: MemInstitutionDetails = new MemInstitutionDetails();
  ciLoanApplicationModel: CiLoanApplication = new CiLoanApplication;
  ciGoldMortgageLoanModel: CiGoldMortgageLoan = new CiGoldMortgageLoan();
  ciLandMortgageLoanModel: CiLandMortgageLoan = new CiLandMortgageLoan();
  ciBondsMortgageLoanModel: CiBondsMortgageLoan = new CiBondsMortgageLoan();
  ciVehicleMortgageLoanModel: CiVehicleMortgageLoan = new CiVehicleMortgageLoan();
  ciStorageMortgageLoanModel: CiStorageMortgageLoan = new CiStorageMortgageLoan();
  ciOthersMortgageLoanModel: CiOthersMortgageLoan = new CiOthersMortgageLoan();

  memberTypeName: any;
  ciLoanApplicationId: any;
  isEdit: boolean = false;
  admissionNumber: any;

  ciGoldMortgageLoanModelList: any[] = [];
  ciLandMortgageLoanModelList: any[] = [];
  ciBondsMortgageLoanModelList: any[] = [];
  ciVehicleMortgageLoanModelList: any[] = [];
  ciStorageMortgageLoanModelList: any[] = [];
  ciOthersMortgageLoanModelList: any[] = [];

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
  ciGoldLoanMortgageList: any[] = [];
  ciLandLoanMortgageList: any[] = [];
  ciBondLoanMortgageList: any[] = [];
  ciVehicleLoanMortgageList: any[] = [];
  ciStorageLoanMortgageList: any[] = [];
  ciOtherLoanMortgageList: any[] = [];

  editDeleteDisable: boolean = false;
  landTypeName: any;

  constructor(private formBuilder: FormBuilder,
    private commonFunctionsService: CommonFunctionsService,
    private encryptDecryptService: EncryptDecryptService, private commonComponent: CommonComponent,
    private activateRoute: ActivatedRoute,
    private ciLoanMortgageService:CiLoanMortgageService,
    private ciLoanApplicationService: CiLoanApplicationService,private datePipe: DatePipe
  ) {

    this.ciGoldMortgageForm = this.formBuilder.group({
      itemName: new FormControl('', Validators.required),
      netWeight: new FormControl('', Validators.required),
      grossWeight: new FormControl('', Validators.required),
      carats: new FormControl('', Validators.required),
      value: new FormControl('', Validators.required),
      remarks: new FormControl(''),
    })

    this.ciLandMortgageForm = this.formBuilder.group({
      passbookNumber: new FormControl('', Validators.required),
      surveyNo: new FormControl('', Validators.required),
      landType: new FormControl('', Validators.required),
      landUnits: new FormControl('', Validators.required),
      landSubUnits: new FormControl('', Validators.required),
      value: new FormControl('', Validators.required),
      declaredLandUnits: new FormControl('', Validators.required),
      declaredLandSubUnits: new FormControl('', Validators.required),
      // documentPath: new FormControl(''),
      remarks: new FormControl(''),
    })

    this.ciBondMortgageForm = this.formBuilder.group({
      bondNumber: new FormControl('', Validators.required),
      faceValue: new FormControl('', Validators.required),
      surrenderValue: new FormControl('', Validators.required),
      // bondPath: new FormControl('', Validators.required),
      // pledgedFilePath: new FormControl('', Validators.required),
      maturityDate: new FormControl('', Validators.required),
      remarks: new FormControl('')
    })

    this.ciVehicleMortgageForm = this.formBuilder.group({
      vechileName: new FormControl('', Validators.required),
      rcNumber: new FormControl('', Validators.required),
      // rcFilePath: new FormControl('', Validators.required),
      value: new FormControl('', Validators.required),
      brand: new FormControl('', Validators.required),
      remarks: new FormControl(''),
    })

    this.ciStorageMortgageForm = this.formBuilder.group({
      name: new FormControl('', Validators.required),
      quantity: new FormControl('', Validators.required),
      totalWeight: new FormControl('', Validators.required),
      netWeight: new FormControl('', Validators.required),
      value: new FormControl('', Validators.required),
      remarks: new FormControl('')
    })

    this.ciOtherMortgageForm = this.formBuilder.group({
      name: new FormControl('', Validators.required),
      noOfUnits: new FormControl('', Validators.required),
      value: new FormControl('', Validators.required),
      remarks: new FormControl('')
    })

  }

  ngOnInit() {
    this.isMemberCreation = this.commonFunctionsService.getStorageValue('b-class-member_creation');
    this.orgnizationSetting = this.commonComponent.orgnizationSettings()
    this.getAllLandTypes();
    this.collateraltypeOptionsList = [
      { label: 'Gold', value: 1 },
      { label: 'Land', value: 2 },
      { label: 'Bond', value: 3 },
      { label: 'Vehicle', value: 4 },
      { label: 'Storage', value: 5 },
      { label: 'Other', value: 6 }
    ];

    this.carratsList = [
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
      { field: 'landType', header: 'LAND TYPE' },
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
        this.ciLoanApplicationId = Number(queryParams);
        // this.isEdit = true;
        this.getCiLoanApplicationsById(this.ciLoanApplicationId);
      } else {
        this.isEdit = false;
      }
    });

    this.ciGoldMortgageForm.valueChanges.subscribe((data: any) => {
      this.updateData();
      // if (this.ciGoldMortgageForm.valid) {
      //   this.save();
      // }
    });

    this.ciLandMortgageForm.valueChanges.subscribe((data: any) => {
      this.updateData();
      // if (this.ciLandMortgageForm.valid) {
      //   this.save();
      // }
    });

    this.ciBondMortgageForm.valueChanges.subscribe((data: any) => {
      this.updateData();
      // if (this.ciBondMortgageForm.valid) {
      //   this.save();
      // }
    });

    this.ciVehicleMortgageForm.valueChanges.subscribe((data: any) => {
      this.updateData();
      // if (this.ciVehicleMortgageForm.valid) {
      //   this.save();
      // }
    });

    this.ciStorageMortgageForm.valueChanges.subscribe((data: any) => {
      this.updateData();
      // if (this.ciStorageMortgageForm.valid) {
      //   this.save();
      // }
    });

    this.ciOtherMortgageForm.valueChanges.subscribe((data: any) => {
      this.updateData();
      // if (this.ciOtherMortgageForm.valid) {
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
      this.ciGoldMortgageLoanModel.collateralType = this.collateralType;
      this.ciLoanApplicationService.changeData({
        formValid: this.ciGoldMortgageForm.valid,
        data: this.ciGoldMortgageLoanModel,
        isDisable:  applicationConstants.FALSE,
        stepperIndex: 7,
      });
    } else if (this.collateralType == 2) {
      this.ciLandMortgageLoanModel.collateralType = this.collateralType;
      this.ciLandMortgageLoanModel.landTypeName = this.landTypeName;
      this.ciLoanApplicationService.changeData({
        formValid: !this.ciLandMortgageForm.valid ? true : false,
        data: this.ciLandMortgageLoanModel,
        isDisable:  applicationConstants.FALSE,
        stepperIndex: 7,
      });
    } else if (this.collateralType == 3) {
      this.ciBondsMortgageLoanModel.collateralType = this.collateralType;
      this.ciLoanApplicationService.changeData({
        formValid: !this.ciBondMortgageForm.valid ? true : false,
        data: this.ciBondsMortgageLoanModel,
        isDisable:  applicationConstants.FALSE,
        stepperIndex: 7,
      });
    } else if (this.collateralType == 4) {
      this.ciVehicleMortgageLoanModel.collateralType = this.collateralType;
      this.ciLoanApplicationService.changeData({
        formValid: !this.ciVehicleMortgageForm.valid ? true : false,
        data: this.ciVehicleMortgageLoanModel,
        isDisable:  applicationConstants.FALSE,
        stepperIndex: 7,
      });
    } else if (this.collateralType == 5) {
      this.ciStorageMortgageLoanModel.collateralType = this.collateralType;
      this.ciLoanApplicationService.changeData({
        formValid: !this.ciStorageMortgageForm.valid ? true : false,
        data: this.ciStorageMortgageLoanModel,
        isDisable:  applicationConstants.FALSE,
        stepperIndex: 7,
      });
    } else if (this.collateralType == 6) {
      this.ciOthersMortgageLoanModel.collateralType = this.collateralType;
      this.ciLoanApplicationService.changeData({
        formValid: !this.ciOtherMortgageForm.valid ? true : false,
        data: this.ciOthersMortgageLoanModel,
        isDisable:  applicationConstants.FALSE,
        stepperIndex: 7,
      });
    } else {
      this.ciLoanApplicationService.changeData({
        formValid: false,
        data: null,
        isDisable: true,
        stepperIndex: 7,
      });
    }
  }

  getAllLandTypes() {
    this.commonComponent.startSpinner();
    this.ciLoanMortgageService.getAllLandTypes().subscribe(response => {
      this.responseModel = response;
      if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
        this.commonComponent.stopSpinner();
        this.landTypesList = this.responseModel.data.filter((landType: { status: number; }) => landType.status == 1).map((landType: any) => {
          return { label: landType.name, value: landType.id };
        });
      }
    },
      error => {
        this.msgs = [];
        this.commonComponent.stopSpinner();
        this.msgs.push({ severity: 'error', detail: applicationConstants.WE_COULDNOT_PROCESS_YOU_ARE_REQUEST });
      })
  }

  onChangeLandType(event: any) {
    if (event != null && event != undefined) {
      const filteredItem = this.landTypesList.find((item: { value: any; }) => item.value === event);
      this.landTypeName = filteredItem.label;
    }
  }

  /**
   * @implements get Collaterals by application id
   * @param ciLoanApplicationId 
   */
  getCiLoanApplicationsById(ciLoanApplicationId: any) {
    this.commonFunctionsService
    this.ciLoanApplicationService.getLoanApplicationDetailsByLoanApplicationId(ciLoanApplicationId).subscribe((data: any) => {
      this.responseModel = data;
      if (this.responseModel != null && this.responseModel != undefined) {
        if (this.responseModel != null && this.responseModel != undefined) {
          if (this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {

            if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
              if (this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
                this.ciLoanApplicationModel = this.responseModel.data[0];

                if (this.ciLoanApplicationModel.collateralType != undefined) {
                  this.collateralType = this.ciLoanApplicationModel.collateralType;
                  if (this.ciLoanApplicationModel.collateralType == 1) {
                    this.getCIGoldLoanMortgageDetailsByciLoanApplicationId(ciLoanApplicationId ,false);
                  } else if (this.ciLoanApplicationModel.collateralType == 2) {
                    this.getCILandLoanMortgageDetailsByciLoanApplicationId(ciLoanApplicationId ,false);
                  } else if (this.ciLoanApplicationModel.collateralType == 3) {
                    this.getCIBondLoanMortgageDetailsByciLoanApplicationId(ciLoanApplicationId ,false);
                  } else if (this.ciLoanApplicationModel.collateralType == 4) {
                    this.getCIVehicleLoanMortgageDetailsByciLoanApplicationId(ciLoanApplicationId , false);
                  } else if (this.ciLoanApplicationModel.collateralType == 5) {
                    this.getCIStorageLoanMortgageDetailsByciLoanApplicationId(ciLoanApplicationId,false) ;
                  } else if (this.ciLoanApplicationModel.collateralType == 6) {
                    this.getCIOtherLoanMortgageDetailsByciLoanApplicationId(ciLoanApplicationId ,false);
                  }
                }
                // this.updateData();
              }
            }
          }
        }
      }
    });
  }

  /**
   * @implements onChange of Collateral
   * @param event 
   * @author jyothi.naidana
   */
  onChange(event: any) {
    this.getFormBasedOnCollateralType(event);
    this.collateralType = event;
    this.updateCollateralInCiApplicationDetails();
  }

  getFormBasedOnCollateralType(collateralType: any) {
    this.ciGoldMortgageLoanModel = new CiGoldMortgageLoan();
    this.ciLandMortgageLoanModel = new CiLandMortgageLoan();
    this.ciBondsMortgageLoanModel = new CiBondsMortgageLoan();
    this.ciVehicleMortgageLoanModel = new CiVehicleMortgageLoan();
    this.ciStorageMortgageLoanModel = new CiStorageMortgageLoan();
    this.ciOthersMortgageLoanModel = new CiOthersMortgageLoan();

    this.isSameCollateral = false;

    if (collateralType == 1) {
      this.collateralType = collateralType;
      this.ciGoldMortgageLoanModel.ciLoanApplicationId = this.ciLoanApplicationId;
      this.ciGoldMortgageLoanModel.collateralType = this.collateralType;
      this.showGoldform = true;
      this.showLandform = false;
      this.showBondform = false;
      this.showVehicleform = false;
      this.showStorageform = false;
      this.showOtherform = false;
    } else if (collateralType == 2) {
      this.collateralType = collateralType;
      this.ciLandMortgageLoanModel.ciLoanApplicationId = this.ciLoanApplicationId;
      this.ciLandMortgageLoanModel.collateralType = this.collateralType;
      this.showGoldform = false;
      this.showLandform = true;
      this.showBondform = false;
      this.showStorageform = false;
      this.showOtherform = false;
    } else if (collateralType == 3) {
      this.collateralType = collateralType;
      this.ciBondsMortgageLoanModel.ciLoanApplicationId = this.ciLoanApplicationId;
      this.ciBondsMortgageLoanModel.collateralType = this.collateralType;
      this.showGoldform = false;
      this.showLandform = false;
      this.showBondform = true;
      this.showVehicleform = false;
      this.showStorageform = false;
      this.showOtherform = false;
    } else if (collateralType == 4) {
      this.collateralType = collateralType;
      this.ciVehicleMortgageLoanModel.ciLoanApplicationId = this.ciLoanApplicationId;
      this.ciVehicleMortgageLoanModel.collateralType = this.collateralType;
      this.showGoldform = false;
      this.showLandform = false;
      this.showBondform = false;
      this.showVehicleform = true;
      this.showStorageform = false;
      this.showOtherform = false;
    } else if (collateralType == 5) {
      this.collateralType = collateralType;
      this.ciStorageMortgageLoanModel.ciLoanApplicationId = this.ciLoanApplicationId;
      this.ciStorageMortgageLoanModel.collateralType = this.collateralType;
      this.showGoldform = false;
      this.showLandform = false;
      this.showBondform = false;
      this.showVehicleform = false;
      this.showStorageform = true;
      this.showOtherform = false;
    } else if (collateralType == 6) {
      this.collateralType = collateralType;
      this.ciOthersMortgageLoanModel.ciLoanApplicationId = this.ciLoanApplicationId;
      this.ciOthersMortgageLoanModel.collateralType = this.collateralType;
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
      // this.ciGoldMortgageLoanModelList = this.ciGoldMortgageLoanModel.CILoanGoldMortgageDetailsDTOList;
    } else if (collateralType == 2) {
      this.showGoldform = false;
      this.showLandform = true;
      this.showBondform = false;
      this.showVehicleform = false;
      this.showStorageform = false;
      this.showOtherform = false;
      // this.ciLandMortgageLoanModelList = this.ciLandMortgageLoanModel.CILoanLandMortgageDetailsDTOList;
    } else if (collateralType == 3) {
      this.showGoldform = false;
      this.showLandform = false;
      this.showBondform = true;
      this.showVehicleform = false;
      this.showStorageform = false;
      this.showOtherform = false;
      // this.ciBondsMortgageLoanModelList = this.ciBondsMortgageLoanModel.CIBondsMortgageDetailsDTOList;
    } else if (collateralType == 4) {
      this.showGoldform = false;
      this.showLandform = false;
      this.showBondform = false;
      this.showVehicleform = true;
      this.showStorageform = false;
      this.showOtherform = false;
      // this.ciVehicleMortgageLoanModelList = this.ciVehicleMortgageLoanModel.CILoanVehicleMortgageDetailsDTOList;
    } else if (collateralType == 5) {
      this.showGoldform = false;
      this.showLandform = false;
      this.showBondform = false;
      this.showVehicleform = false;
      this.showStorageform = true;
      this.showOtherform = false;
      // this.ciStorageMortgageLoanModelList = this.ciStorageMortgageLoanModel.CIStorageMortgageDetailsDTOList;
    } else if (collateralType == 6) {
      this.showGoldform = false;
      this.showLandform = false;
      this.showBondform = false;
      this.showVehicleform = false;
      this.showStorageform = false;
      this.showOtherform = true;
      // this.ciOthersMortgageLoanModelList = this.ciOthersMortgageLoanModel.CIOtherMortgageDetailsDTOList;
    }
    this.updateData();
  }

  //Get Gold Loan Mortgage detial by ciLoanApplicationId and AdmissionNumber
  getCIGoldLoanMortgageDetailsByciLoanApplicationId(ciLoanApplicationId: any , flag :Boolean) {
    this.ciLoanMortgageService.getCiGoldMortgageLoanDetailsByApplicationId(ciLoanApplicationId).subscribe((data: any) => {
      this.responseModel = data;
      if (this.responseModel != null && this.responseModel != undefined) {
        this.isEdit = true;
        if (this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
          if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
            this.ciGoldLoanMortgageList = this.responseModel.data;
            if (this.ciLoanApplicationModel.collateralType != null && this.ciLoanApplicationModel.collateralType != undefined)
              this.getEditFormBasedOnCollateralType(this.ciLoanApplicationModel.collateralType);
            this.ciLoanApplicationModel.collateralType = this.collateralType;
            // this.updateData();
          }
        }
        else if(!flag){
          this.ciLoanApplicationModel.collateralType = null;
        }
      }
    });
  }

  //Get Land Loan Mortgage detial by ciLoanApplicationId and AdmissionNumber
  getCILandLoanMortgageDetailsByciLoanApplicationId(ciLoanApplicationId: any ,flag :any) {
    this.commonFunctionsService
    this.ciLoanMortgageService.getCiLandMortgageLoanDetailsByApplicationId(ciLoanApplicationId).subscribe((data: any) => {
      this.responseModel = data;
      if (this.responseModel != null && this.responseModel != undefined) {
        this.isEdit = true;
        if (this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
          if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
            this.ciLandLoanMortgageList = this.responseModel.data;
            if (this.ciLoanApplicationModel.collateralType != null && this.ciLoanApplicationModel.collateralType != undefined)
              this.getEditFormBasedOnCollateralType(this.ciLoanApplicationModel.collateralType);
            this.ciLoanApplicationModel.collateralType = this.collateralType;
            // this.updateData();
          }
        }
        else if(!flag){
          this.ciLoanApplicationModel.collateralType = null;
          
        }
      }
    });
  }

  //Get BOnd Loan Mortgage detial by ciLoanApplicationId and AdmissionNumber
  getCIBondLoanMortgageDetailsByciLoanApplicationId(ciLoanApplicationId: any , flag :Boolean) {
    this.commonFunctionsService
    this.ciLoanMortgageService.getCiBondMortgageLoanDetailsByApplicationId(ciLoanApplicationId).subscribe((data: any) => {
      this.responseModel = data;
      if (this.responseModel != null && this.responseModel != undefined) {
        this.isEdit = true;
        if (this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
          if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
            this.ciBondLoanMortgageList = this.responseModel.data.map((bond: any) => {
              bond.maturityDateVal =  this.datePipe.transform(bond.maturityDate, this.orgnizationSetting.datePipe);
              return bond;
            }
          );
            if (this.ciLoanApplicationModel.collateralType != null && this.ciLoanApplicationModel.collateralType != undefined)
              this.getEditFormBasedOnCollateralType(this.ciLoanApplicationModel.collateralType);
            this.ciLoanApplicationModel.collateralType = this.collateralType;
            this.updateData();
          }
        }
        else if(!flag){
          this.ciLoanApplicationModel.collateralType = null;
          
        }
      }
    });
  }

  //Get Vehicle Loan Mortgage detial by ciLoanApplicationId and AdmissionNumber
  getCIVehicleLoanMortgageDetailsByciLoanApplicationId(ciLoanApplicationId: any ,flag :boolean) {
    this.commonFunctionsService
    this.ciLoanMortgageService.getCiVehicleMortgageLoanDetailsByApplicationId(ciLoanApplicationId).subscribe((data: any) => {
      this.responseModel = data;
      if (this.responseModel != null && this.responseModel != undefined) {
        this.isEdit = true;
        if (this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
          if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
            this.ciVehicleLoanMortgageList = this.responseModel.data;
            if (this.ciLoanApplicationModel.collateralType != null && this.ciLoanApplicationModel.collateralType != undefined)
              this.getEditFormBasedOnCollateralType(this.ciLoanApplicationModel.collateralType);
            this.ciLoanApplicationModel.collateralType = this.collateralType;
            this.updateData();
          }
        }
        else if(!flag){
          this.ciLoanApplicationModel.collateralType = null;
          
        }
      }
    });
  }

  //Get Storage Loan Mortgage detial by ciLoanApplicationId and AdmissionNumber
  getCIStorageLoanMortgageDetailsByciLoanApplicationId(ciLoanApplicationId: any , flag :Boolean) {
    this.commonFunctionsService
    this.ciLoanMortgageService.getCiStorageMortgageLoanDetailsByApplicationId(ciLoanApplicationId).subscribe((data: any) => {
      this.responseModel = data;
      if (this.responseModel != null && this.responseModel != undefined) {
        this.isEdit = true;
        if (this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
          if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
            this.ciStorageLoanMortgageList = this.responseModel.data;
            if (this.ciLoanApplicationModel.collateralType != null && this.ciLoanApplicationModel.collateralType != undefined)
              this.getEditFormBasedOnCollateralType(this.ciLoanApplicationModel.collateralType);
            this.ciLoanApplicationModel.collateralType = this.collateralType;
            this.updateData();
          }
        }
        else if(!flag){
          this.ciLoanApplicationModel.collateralType = null;
         
        }
      }
    });
  }

  //Get Other Loan Mortgage detial by ciLoanApplicationId and AdmissionNumber
  getCIOtherLoanMortgageDetailsByciLoanApplicationId(ciLoanApplicationId: any , flag :Boolean) {
    this.commonFunctionsService
    this.ciLoanMortgageService.getCiOthersMortgageLoanDetailsByApplicationId(ciLoanApplicationId).subscribe((data: any) => {
      this.responseModel = data;
      if (this.responseModel != null && this.responseModel != undefined) {
        this.isEdit = true;
        if (this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
          if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
            this.ciOtherLoanMortgageList = this.responseModel.data;
            if (this.ciLoanApplicationModel.collateralType != null && this.ciLoanApplicationModel.collateralType != undefined)
              this.getEditFormBasedOnCollateralType(this.ciLoanApplicationModel.collateralType);
            this.ciLoanApplicationModel.collateralType = this.collateralType;
            this.updateData();
          }
        }
        else if(!flag){
          this.ciLoanApplicationModel.collateralType = null;
          // this.collateralType = null;
        }
      }
    });
  }

  /**
   * un-Used Function
   * @param ciLoanApplicationId 
   */
  getCILoanMortgageDetailsByciLoanApplicationId(ciLoanApplicationId: any) {
    this.ciLoanMortgageService.getCiBondMortgageLoanDetailsByApplicationId(ciLoanApplicationId).subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel != null && this.responseModel != undefined) {
        if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
          if (this.responseModel.data != null && this.responseModel.data != undefined && this.responseModel.data.length > 0) {
            this.ciGoldMortgageLoanModel = this.responseModel.data[0];
            this.ciLoanApplicationService.changeData({
              formValid: this.ciGoldMortgageForm.valid,
              data: this.ciGoldMortgageLoanModel,
              isDisable: (!this.ciGoldMortgageForm.valid),
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
    this.ciGoldMortgageLoanModel = new CiGoldMortgageLoan();
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
    this.ciLandMortgageLoanModel = new CiLandMortgageLoan();
    this.addButtonService = true;
    this.editDeleteDisable = true;
    /**
     * for update validation
     */
    this.updateData();
    this.land._first = 0;
    this.land.value.unshift({id:0, passbookNumber: '', surveyNo: '', landType: '', landUnits: '', landSubUnits: '', value: '', declaredLandUnits: '', declaredLandSubUnits: '', remarks: '' });
    this.land.initRowEdit(this.land.value[0]);
  }

  addBondLoanMortgage() {
    this.ciBondsMortgageLoanModel = new CiBondsMortgageLoan();
    this.addButtonService = true;
    this.editDeleteDisable = true;
    /**
     * for update validation
     */
    this.updateData();
    this.bond._first = 0;
    this.bond.value.unshift({id:0, bondNumber: '', faceValue: '', surrenderValue: '', maturityDate: '', remarks: '' });
    this.bond.initRowEdit(this.bond.value[0]);
  }

  addVehicleLoanMortgage() {
    this.ciVehicleMortgageLoanModel = new CiVehicleMortgageLoan();
    this.addButtonService = true;
    this.editDeleteDisable = true;
    /**
     * for update validation
     */
    this.updateData();
    this.vehicle._first = 0;
    this.vehicle.value.unshift({id:0, vechileName: '', rcNumber: '', value: '', brand: '', remarks: '' });
    this.vehicle.initRowEdit(this.vehicle.value[0]);
  }

  addStorageLoanMortgage() {
    this.ciStorageMortgageLoanModel = new CiStorageMortgageLoan();
    this.addButtonService = true;
    this.editDeleteDisable = true;
    /**
     * for update validation
     */
    this.updateData();
    this.storage._first = 0;
    this.storage.value.unshift({id:0, name: '', quantity: '', totalWeight: '', netWeight: '', value: '', remarks: '' });
    this.storage.initRowEdit(this.storage.value[0]);
  }

  addOtherLoanMortgage() {
    this.ciOthersMortgageLoanModel = new CiOthersMortgageLoan();
    this.addButtonService = true;
    this.editDeleteDisable = true;
    /**
     * for update validation
     */
    this.updateData();
    this.other._first = 0;
    this.other.value.unshift({id:0, name: '', noOfUnits: '', value: '', remarks: '' });
    this.other.initRowEdit(this.other.value[0]);
  }

  saveGoldLoanMortgage(row: any) {
    this.addButtonService = false;
    this.editDeleteDisable = false;
    this.ciGoldMortgageLoanModel = row;
    this.ciGoldMortgageLoanModel.ciLoanApplicationId = this.ciLoanApplicationId;
    this.ciGoldMortgageLoanModel.admissionNo = this.ciLoanApplicationModel.admissionNo;
    // this.ciGoldMortgageLoanModel.status = applicationConstants.ACTIVE;
    this.updateData();
    if (row.id != null && row.id != undefined) {
      this.ciLoanMortgageService.updateCiGoldMortgageLoanDetails(this.ciGoldMortgageLoanModel).subscribe((response: any) => {
        this.responseModel = response;
        if (this.responseModel != null && this.responseModel != undefined) {
          if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
            if (this.responseModel.data != null && this.responseModel.data != undefined && this.responseModel.data.length > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
              this.ciGoldMortgageLoanModel = this.responseModel.data;
              this.addButtonService = false;
              if (this.responseModel.data[0].ciLoanApplicationId != null && this.responseModel.data[0].ciLoanApplicationId != undefined) {
                this.getCIGoldLoanMortgageDetailsByciLoanApplicationId(this.responseModel.data[0].ciLoanApplicationId ,false);
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
      this.ciLoanMortgageService.addCiGoldMortgageLoanDetails(this.ciGoldMortgageLoanModel).subscribe((response: any) => {
        this.responseModel = response;
        if (this.responseModel != null && this.responseModel != undefined) {
          if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
            if (this.responseModel.data != null && this.responseModel.data != undefined && this.responseModel.data.length > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
              this.ciGoldMortgageLoanModel = this.responseModel.data;
              this.addButtonService = false;
              if (this.responseModel.data[0].ciLoanApplicationId != null && this.responseModel.data[0].ciLoanApplicationId != undefined) {
                this.getCIGoldLoanMortgageDetailsByciLoanApplicationId(this.responseModel.data[0].ciLoanApplicationId , false);
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
    this.ciLandMortgageLoanModel = row;
    this.ciLandMortgageLoanModel.admissionNo = this.ciLoanApplicationModel.admissionNo;
    this.ciLandMortgageLoanModel.ciLoanApplicationId = this.ciLoanApplicationId;
    // this.ciLandMortgageLoanModel.status = applicationConstants.ACTIVE;
    this.updateData();
    if (row.id != null && row.id != undefined) {
      this.ciLoanMortgageService.updateCiLandMortgageLoanDetails(this.ciLandMortgageLoanModel).subscribe((response: any) => {
        this.responseModel = response;
        if (this.responseModel != null && this.responseModel != undefined) {
          if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
            if (this.responseModel.data != null && this.responseModel.data != undefined && this.responseModel.data.length > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
              this.ciLandMortgageLoanModel = this.responseModel.data;
              this.addButtonService = false;
              if (this.responseModel.data[0].ciLoanApplicationId != null && this.responseModel.data[0].ciLoanApplicationId != undefined) {
                this.getCILandLoanMortgageDetailsByciLoanApplicationId(this.responseModel.data[0].ciLoanApplicationId ,false);
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
      this.ciLoanMortgageService.addCiLandMortgageLoanDetails(this.ciLandMortgageLoanModel).subscribe((response: any) => {
        this.responseModel = response;
        if (this.responseModel != null && this.responseModel != undefined) {
          if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
            if (this.responseModel.data != null && this.responseModel.data != undefined && this.responseModel.data.length > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
              this.ciLandMortgageLoanModel = this.responseModel.data;
              this.addButtonService = false;
              if (this.responseModel.data[0].ciLoanApplicationId != null && this.responseModel.data[0].ciLoanApplicationId != undefined) {
                this.getCILandLoanMortgageDetailsByciLoanApplicationId(this.responseModel.data[0].ciLoanApplicationId ,false);
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
    this.ciBondsMortgageLoanModel = row;
    this.ciBondsMortgageLoanModel.ciLoanApplicationId = this.ciLoanApplicationId;
    this.ciBondsMortgageLoanModel.admissionNo = this.ciLoanApplicationModel.admissionNo;
    this.ciBondsMortgageLoanModel.maturityDate = this.commonFunctionsService.getUTCEpoch(new Date(row.maturityDateVal));
    // this.ciBondsMortgageLoanModel.status = applicationConstants.ACTIVE;
    this.updateData();
    if (row.id != null && row.id != undefined) {
      this.ciLoanMortgageService.updateCiBondMortgageLoanDetails(this.ciBondsMortgageLoanModel).subscribe((response: any) => {
        this.responseModel = response;
        if (this.responseModel != null && this.responseModel != undefined) {
          if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
            if (this.responseModel.data != null && this.responseModel.data != undefined && this.responseModel.data.length > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
              this.ciBondsMortgageLoanModel = this.responseModel.data;
              this.addButtonService = false;
              if (this.responseModel.data[0].ciLoanApplicationId != null && this.responseModel.data[0].ciLoanApplicationId != undefined) {
                this.getCIBondLoanMortgageDetailsByciLoanApplicationId(this.responseModel.data[0].ciLoanApplicationId ,false);
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
      this.ciLoanMortgageService.addCiBondMortgageLoanDetails(this.ciBondsMortgageLoanModel).subscribe((response: any) => {
        this.responseModel = response;
        if (this.responseModel != null && this.responseModel != undefined) {
          if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
            if (this.responseModel.data != null && this.responseModel.data != undefined && this.responseModel.data.length > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
              this.ciBondsMortgageLoanModel = this.responseModel.data;
              this.addButtonService = false;
              if (this.responseModel.data[0].ciLoanApplicationId != null && this.responseModel.data[0].ciLoanApplicationId != undefined) {
                this.getCIBondLoanMortgageDetailsByciLoanApplicationId(this.responseModel.data[0].ciLoanApplicationId ,false);
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
    this.ciVehicleMortgageLoanModel = row;
    this.ciVehicleMortgageLoanModel.ciLoanApplicationId = this.ciLoanApplicationId;
    this.ciVehicleMortgageLoanModel.admissionNo = this.ciLoanApplicationModel.admissionNo;
    // this.ciVehicleMortgageLoanModel.status = applicationConstants.ACTIVE;
    this.updateData();
    if (row.id != null && row.id != undefined) {
      this.ciLoanMortgageService.updateCiVehicleMortgageLoanDetails(this.ciVehicleMortgageLoanModel).subscribe((response: any) => {
        this.responseModel = response;
        if (this.responseModel != null && this.responseModel != undefined) {
          if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
            if (this.responseModel.data != null && this.responseModel.data != undefined && this.responseModel.data.length > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
              this.ciVehicleMortgageLoanModel = this.responseModel.data;
              this.addButtonService = false;
              if (this.responseModel.data[0].ciLoanApplicationId != null && this.responseModel.data[0].ciLoanApplicationId != undefined) {
                this.getCIVehicleLoanMortgageDetailsByciLoanApplicationId(this.responseModel.data[0].ciLoanApplicationId , false);
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
      this.ciLoanMortgageService.addCiVehicleMortgageLoanDetails(this.ciVehicleMortgageLoanModel).subscribe((response: any) => {
        this.responseModel = response;
        if (this.responseModel != null && this.responseModel != undefined) {
          if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
            if (this.responseModel.data != null && this.responseModel.data != undefined && this.responseModel.data.length > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
              this.ciVehicleMortgageLoanModel = this.responseModel.data;
              this.addButtonService = false;
              if (this.responseModel.data[0].ciLoanApplicationId != null && this.responseModel.data[0].ciLoanApplicationId != undefined) {
                this.getCIVehicleLoanMortgageDetailsByciLoanApplicationId(this.responseModel.data[0].ciLoanApplicationId , false);
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
    this.ciStorageMortgageLoanModel = row;
    this.ciStorageMortgageLoanModel.ciLoanApplicationId = this.ciLoanApplicationId;
    this.ciStorageMortgageLoanModel.admissionNo = this.ciLoanApplicationModel.admissionNo;
    // this.ciStorageMortgageLoanModel.status = applicationConstants.ACTIVE;
    this.updateData();
    if (row.id != null && row.id != undefined) {
      this.ciLoanMortgageService.updateCiStorageMortgageLoanDetails(this.ciStorageMortgageLoanModel).subscribe((response: any) => {
        this.responseModel = response;
        if (this.responseModel != null && this.responseModel != undefined) {
          if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
            if (this.responseModel.data != null && this.responseModel.data != undefined && this.responseModel.data.length > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
              this.ciStorageMortgageLoanModel = this.responseModel.data;
              this.addButtonService = false;
              if (this.responseModel.data[0].ciLoanApplicationId != null && this.responseModel.data[0].ciLoanApplicationId != undefined) {
                this.getCIStorageLoanMortgageDetailsByciLoanApplicationId(this.responseModel.data[0].ciLoanApplicationId , false);
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
      this.ciLoanMortgageService.addCiStorageMortgageLoanDetails(this.ciStorageMortgageLoanModel).subscribe((response: any) => {
        this.responseModel = response;
        if (this.responseModel != null && this.responseModel != undefined) {
          if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
            if (this.responseModel.data != null && this.responseModel.data != undefined && this.responseModel.data.length > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
              this.ciStorageMortgageLoanModel = this.responseModel.data;
              this.addButtonService = false;
              if (this.responseModel.data[0].ciLoanApplicationId != null && this.responseModel.data[0].ciLoanApplicationId != undefined) {
                this.getCIStorageLoanMortgageDetailsByciLoanApplicationId(this.responseModel.data[0].ciLoanApplicationId ,false);
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
    this.ciOthersMortgageLoanModel = row;
    this.ciOthersMortgageLoanModel.ciLoanApplicationId = this.ciLoanApplicationId;
    // this.ciOthersMortgageLoanModel.admissionNo = this.ciLoanApplicationModel.admissionNo;
    // this.ciOthersMortgageLoanModel.status = applicationConstants.ACTIVE;
    this.updateData();
    if (row.id != null && row.id != undefined) {
      this.ciLoanMortgageService.updateCiOthersMortgageLoanDetails(this.ciOthersMortgageLoanModel).subscribe((response: any) => {
        this.responseModel = response;
        if (this.responseModel != null && this.responseModel != undefined) {
          if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
            if (this.responseModel.data != null && this.responseModel.data != undefined && this.responseModel.data.length > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
              this.ciOthersMortgageLoanModel = this.responseModel.data;
              this.addButtonService = false;
              if (this.responseModel.data[0].ciLoanApplicationId != null && this.responseModel.data[0].ciLoanApplicationId != undefined) {
                this.getCIOtherLoanMortgageDetailsByciLoanApplicationId(this.responseModel.data[0].ciLoanApplicationId ,false);
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
      this.ciLoanMortgageService.addCiOthersMortgageLoanDetails(this.ciOthersMortgageLoanModel).subscribe((response: any) => {
        this.responseModel = response;
        if (this.responseModel != null && this.responseModel != undefined) {
          if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
            if (this.responseModel.data != null && this.responseModel.data != undefined && this.responseModel.data.length > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
              this.ciOthersMortgageLoanModel = this.responseModel.data;
              this.addButtonService = false;
              if (this.responseModel.data[0].ciLoanApplicationId != null && this.responseModel.data[0].ciLoanApplicationId != undefined) {
                this.getCIOtherLoanMortgageDetailsByciLoanApplicationId(this.responseModel.data[0].ciLoanApplicationId ,false);
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
    this.ciGoldLoanMortgageList = [];
    this.addButtonService = false;
    this.editDeleteDisable = false;
    this.getCIGoldLoanMortgageDetailsByciLoanApplicationId(this.ciLoanApplicationId ,false);
  }

  cancelLandLoanMortgage() {
    this.ciLandLoanMortgageList = [];
    this.addButtonService = false;
    this.editDeleteDisable = false;
    this.getCILandLoanMortgageDetailsByciLoanApplicationId(this.ciLoanApplicationId ,false);
  }

  cancelBondLoanMortgage() {
    this.ciBondLoanMortgageList = [];
    this.addButtonService = false;
    this.editDeleteDisable = false;
    this.getCIBondLoanMortgageDetailsByciLoanApplicationId(this.ciLoanApplicationId ,false);
  }

  cancelVehicleLoanMortgage() {
    this.ciVehicleLoanMortgageList = [];
    this.addButtonService = false;
    this.editDeleteDisable = false;
    this.getCIVehicleLoanMortgageDetailsByciLoanApplicationId(this.ciLoanApplicationId , false);
  }

  cancelStorageLoanMortgage() {
    this.ciStorageLoanMortgageList = [];
    this.addButtonService = false;
    this.editDeleteDisable = false;
    this.getCIStorageLoanMortgageDetailsByciLoanApplicationId(this.ciLoanApplicationId ,false);
  }

  cancelOtherLoanMortgage() {
    this.ciOtherLoanMortgageList = [];
    this.addButtonService = false;
    this.editDeleteDisable = false;
    this.getCIOtherLoanMortgageDetailsByciLoanApplicationId(this.ciLoanApplicationId ,false);
  }


  editGoldLoanMortgage(rowData: any) {
    this.addButtonService = true;
    this.editDeleteDisable = true;
    this.updateData();
    this.ciLoanMortgageService.getCiGoldMortgageLoanDetailsById(rowData.id).subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel != null && this.responseModel != undefined) {
        if (this.responseModel.status != null && this.responseModel.status != undefined && this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
          if (this.responseModel.data != null && this.responseModel.data != undefined && this.responseModel.data.length > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
            this.ciGoldMortgageLoanModel = this.responseModel.data[0];
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
    this.updateData();
    this.ciLoanMortgageService.getCiLandMortgageLoanDetailsById(rowData.id).subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel != null && this.responseModel != undefined) {
        if (this.responseModel.status != null && this.responseModel.status != undefined && this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
          if (this.responseModel.data != null && this.responseModel.data != undefined && this.responseModel.data.length > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
            this.ciLandMortgageLoanModel = this.responseModel.data[0];
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

  editBondLoanMortgage(rowData: any) {
    this.addButtonService = true;
    this.editDeleteDisable = true;
    this.updateData();
    this.ciLoanMortgageService.getCiBondMortgageLoanDetailsById(rowData.id).subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel != null && this.responseModel != undefined) {
        if (this.responseModel.status != null && this.responseModel.status != undefined && this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
          if (this.responseModel.data != null && this.responseModel.data != undefined && this.responseModel.data.length > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
            this.ciBondsMortgageLoanModel = this.responseModel.data[0];
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
    this.ciLoanMortgageService.getCiVehicleMortgageLoanDetailsById(rowData.id).subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel != null && this.responseModel != undefined) {
        if (this.responseModel.status != null && this.responseModel.status != undefined && this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
          if (this.responseModel.data != null && this.responseModel.data != undefined && this.responseModel.data.length > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
            this.ciVehicleMortgageLoanModel = this.responseModel.data[0];
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
    this.ciLoanMortgageService.getCiStorageMortgageLoanDetailsById(rowData.id).subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel != null && this.responseModel != undefined) {
        if (this.responseModel.status != null && this.responseModel.status != undefined && this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
          if (this.responseModel.data != null && this.responseModel.data != undefined && this.responseModel.data.length > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
            this.ciStorageMortgageLoanModel = this.responseModel.data[0];
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
    this.ciLoanMortgageService.getCiOthersMortgageLoanDetailsById(rowData.id).subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel != null && this.responseModel != undefined) {
        if (this.responseModel.status != null && this.responseModel.status != undefined && this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
          if (this.responseModel.data != null && this.responseModel.data != undefined && this.responseModel.data.length > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
            this.ciOthersMortgageLoanModel = this.responseModel.data[0];
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
    this.ciLoanMortgageService.deleteCiGoldMortgageLoanDetails(row.id).subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
        this.ciGoldLoanMortgageList = this.responseModel.data;
        this.getCIGoldLoanMortgageDetailsByciLoanApplicationId(this.ciLoanApplicationId ,false);
      }
    });
  }

  deleteLandLoanMortgage(row: any) {
    this.ciLoanMortgageService.deleteCiLandMortgageLoanDetails(row.id).subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
        this.ciLandLoanMortgageList = this.responseModel.data;
        this.getCILandLoanMortgageDetailsByciLoanApplicationId(this.ciLoanApplicationId ,false);
      }
    });
  }

  deleteBondLoanMortgage(row: any) {
    this.ciLoanMortgageService.deleteCiBondMortgageLoanDetails(row.id).subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
        this.ciBondLoanMortgageList = this.responseModel.data;
        this.getCIBondLoanMortgageDetailsByciLoanApplicationId(this.ciLoanApplicationId ,false);
      }
    });
  }

  deleteVehicleLoanMortgage(row: any) {
    this.ciLoanMortgageService.deleteCiVehicleMortgageLoanDetails(row.id).subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
        this.ciVehicleLoanMortgageList = this.responseModel.data;
        this.getCIVehicleLoanMortgageDetailsByciLoanApplicationId(this.ciLoanApplicationId , false);
      }
    });
  }

  deleteStorageLoanMortgage(row: any) {
    this.ciLoanMortgageService.deleteCiStorageMortgageLoanDetails(row.id).subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
        this.ciStorageLoanMortgageList = this.responseModel.data;
        this.getCIStorageLoanMortgageDetailsByciLoanApplicationId(this.ciLoanApplicationId ,false);
      }
    });
  }

  deleteOtherLoanMortgage(row: any) {
    this.ciLoanMortgageService.deleteCiOthersMortgageLoanDetails(row.id).subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
        this.ciOtherLoanMortgageList = this.responseModel.data;
        this.getCIOtherLoanMortgageDetailsByciLoanApplicationId(this.ciLoanApplicationId ,false);
      }
    });
  }


  /**
   * @implements update collateral in ci application Details
   * @author jyothi.naidana
   */
  updateCollateralInCiApplicationDetails() {
    this.ciLoanApplicationModel.collateralType = this.collateralType;
    this.ciLoanApplicationService.updateCiLoanApplications(this.ciLoanApplicationModel).subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
        if (this.responseModel.data.length > 0 && this.responseModel.data[0] != undefined && this.responseModel.data[0] != null) {
          if (this.responseModel.data[0].id != undefined && this.responseModel.data[0].id != null) {
            this.ciLoanApplicationModel = this.responseModel.data[0];
            this.ciLoanApplicationModel.collateralType = null; //to make collateral type in enable mode till atleast on record created
          }
        }
        // this.msgs = [{ severity: 'success', summary: applicationConstants.STATUS_SUCCESS, detail: this.responseModel.statusMsg }];
        // setTimeout(() => {
        //   this.msgs = [];
        // }, 1200);
      } else {
        // this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: this.responseModel.statusMsg }];
        // setTimeout(() => {
        //   this.msgs = [];
        // }, 3000);
      }
    }, error => {
      // this.commonComponent.stopSpinner();
      // this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: applicationConstants.SERVER_DOWN_ERROR }];
      // setTimeout(() => {
      //   this.msgs = [];
      // }, 3000);
    }
  );
  }
}
