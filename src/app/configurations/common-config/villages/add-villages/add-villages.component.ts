import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonConfigConstants } from '../../common-config-constants';
import { Village } from '../shared/village.model';
import { Responsemodel } from 'src/app/shared/responsemodel';
import { SubDistrictService } from '../../sub-district/shared/sub-district.service';
import { CommonFunctionsService } from 'src/app/shared/commonfunction.service';
import { CommonComponent } from 'src/app/shared/common.component';
import { DistrictService } from '../../district/shared/district.service';
import { EncryptDecryptService } from 'src/app/shared/encrypt-decrypt.service';
import { StatesService } from '../../state/shared/states.service';
import { applicationConstants } from 'src/app/shared/applicationConstants';
import { VillagesService } from '../shared/villages.service';
import { DivisionService } from '../../division/shared/division.service';
import { BlockService } from '../../block/shared/block.service';

@Component({
  selector: 'app-add-villages',
  templateUrl: './add-villages.component.html',
  styleUrls: ['./add-villages.component.css']
})
export class AddVillagesComponent implements OnInit{

  subDistrict: any[] = [];
  villageForm: FormGroup;
  statusList: any[] = [];
  stateListData: any[] = [];
  districtListData: any[] = [];
  subdistrictListData: any[] = [];
  villagesModel: Village = new Village();
  responseModel!: Responsemodel;
  msgs: any[] = [];
  isEdit: any;
  countrylist:any[] = [];
  divisionList: any[] = [];
  blockList : any[] = [];

  constructor(private router: Router, private formBuilder: FormBuilder,private villageService : VillagesService,
    private subdistrictService: SubDistrictService,private divisionService: DivisionService,private blockService: BlockService,
    private commonfunctionservice: CommonFunctionsService, private activateRoute: ActivatedRoute,
    private encryptService: EncryptDecryptService, private commonComponent: CommonComponent,
    private stateService: StatesService, private districtService: DistrictService,
  ) {
    this.villageForm = this.formBuilder.group({
      countryCode: new FormControl('', [Validators.required]),
      stateName: new FormControl('',[Validators.required]),
      districtName: new FormControl('',[Validators.required]),
      subDistrictName: new FormControl('',[Validators.required]),
      divisionName :  new FormControl(),
      blockName : new FormControl(),
      name:  new FormControl('', [Validators.pattern(applicationConstants.NEW_NAME_VALIDATIONS),Validators.required]),
    
      goiCode: new FormControl('',),
      shortCode:new FormControl('',),
      statusName:new FormControl('',[Validators.required]),
      description: new FormControl('',),

    })
  }

  ngOnInit(): void {
    this.statusList = this.commonComponent.status();
    this.activateRoute.queryParams.subscribe(params => {
      if (params['id'] != undefined) {
        this.commonComponent.startSpinner();
        let id = this.encryptService.decrypt(params['id']);
        this.isEdit = true;
        this.villageService.getVillageById(id).subscribe(res => {
          this.responseModel = res;
          this.villagesModel = this.responseModel.data[0];
        
          if (this.villagesModel != null && this.villagesModel != undefined) {
            if (this.villagesModel.countryId != null && this.villagesModel.countryId != undefined) {
              this.getAllstatesByCountryId(this.villagesModel.countryId);
            }

            if (this.villagesModel.stateId != null && this.villagesModel.stateId != undefined) {
              this.getAllDistrictsByStateId(this.villagesModel.stateId);
            }
            if (this.villagesModel.districtId != null && this.villagesModel.districtId != undefined) {
              this.getAllSubDistrictsByDistrictId(this.villagesModel.districtId);
            }
           
          }
  
          this.commonComponent.stopSpinner();
          if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
            this.villagesModel = this.responseModel.data[0];
          } else {
            this.commonComponent.stopSpinner();
  
            this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: this.responseModel.statusMsg }];
            setTimeout(() => {
              this.msgs = [];
            }, 2000);
          }
        });
      } else {
        this.isEdit = false;
        this.villagesModel.status = this.statusList[0].value;
      }
    })
    this.getAllCountry();
    this.getAllDivision();
    this.getAllBlock();
  }
  navigateToBack(){
    this.router.navigate([CommonConfigConstants.VILLAGES]);   
  }
  getAllCountry() {
    // this.commonComponent.startSpinner();
    this.stateService.getAllcountry().subscribe((data: any) => {
      this.responseModel = data;
      if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
        this.countrylist = this.responseModel.data;
        this.countrylist = this.countrylist.filter((activity: any) => activity != null).map((act: { name: any; id: any; }) => {
          return { label: act.name, value: act.id };
        });
        //this.commonComponent.stopSpinner();
      } else {
        // this.commonComponent.stopSpinner();
        this.msgs = [];
        this.msgs = [{ severity: 'error', detail: this.responseModel.statusMsg }];
      }
    }, error => {
      //this.commonComponent.stopSpinner();
      this.msgs = [];
      this.msgs = [{ severity: "error", summary: 'Failed', detail: applicationConstants.WE_COULDNOT_PROCESS_YOU_ARE_REQUEST }];
    });
  }
  getAllstatesByCountryId(countryId: any) {
    // this.commonComponent.startSpinner();
    this.stateService.getStateByCountryId(this.villagesModel.countryId).subscribe((data: any) => {
      this.responseModel = data;
      if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
        this.stateListData = this.responseModel.data;
        this.stateListData = this.stateListData.filter((activity: any) => activity.status == applicationConstants.ACTIVE).map((state: { name: any; id: any; }) => {
          return { label: state.name, value: state.id };
        });
        //this.commonComponent.stopSpinner();
      } else {
        // this.commonComponent.stopSpinner();
        this.msgs = [];
        this.msgs = [{ severity: 'error', detail: this.responseModel.statusMsg }];
      }
    }, error => {
      //this.commonComponent.stopSpinner();
      this.msgs = [];
      this.msgs = [{ severity: "error", summary: 'Failed', detail: applicationConstants.WE_COULDNOT_PROCESS_YOU_ARE_REQUEST }];
    });
  }
  getAllDistrictsByStateId(stateId: any) {
    // this.commonComponent.startSpinner();
    this.districtService.getDistrictByStateId(this.villagesModel.stateId).subscribe((data: any) => {
      this.responseModel = data;
      if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
        this.districtListData = this.responseModel.data;
        this.districtListData = this.districtListData.filter((activity: any) => activity.status == applicationConstants.ACTIVE).map((district: { name: any; id: any; }) => {
          return { label: district.name, value: district.id };
        });
        //this.commonComponent.stopSpinner();
      } else {
        // this.commonComponent.stopSpinner();
        this.msgs = [];
        this.msgs = [{ severity: 'error', detail: this.responseModel.statusMsg }];
      }
    }, error => {
      //this.commonComponent.stopSpinner();
      this.msgs = [];
      this.msgs = [{ severity: "error", summary: 'Failed', detail: applicationConstants.WE_COULDNOT_PROCESS_YOU_ARE_REQUEST }];
    });
  }
  getAllSubDistrictsByDistrictId(districtId: any) {
    // this.commonComponent.startSpinner();
    this.subdistrictService.getSubDistrictByDistrictId(this.villagesModel.districtId).subscribe((data: any) => {
      this.responseModel = data;
      if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
        this.subdistrictListData = this.responseModel.data;
        this.subdistrictListData = this.subdistrictListData.filter((activity: any) => activity.status == applicationConstants.ACTIVE).map((subdistrict: { name: any; id: any; }) => {
          return { label: subdistrict.name, value: subdistrict.id };
        });
        //this.commonComponent.stopSpinner();
      } else {
        // this.commonComponent.stopSpinner();
        this.msgs = [];
        this.msgs = [{ severity: 'error', detail: this.responseModel.statusMsg }];
      }
    }, error => {
      //this.commonComponent.stopSpinner();
      this.msgs = [];
      this.msgs = [{ severity: "error", summary: 'Failed', detail: applicationConstants.WE_COULDNOT_PROCESS_YOU_ARE_REQUEST }];
    });
  }

  getAllDivision() {
    this.divisionService.getAllDivision().subscribe((data: any) => {
      this.responseModel = data;
      if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
        this.divisionList = this.responseModel.data;
        this.divisionList = this.divisionList.filter((activity: any) => activity.status == applicationConstants.ACTIVE).map((division: { name: any; id: any; }) => {
          return { label: division.name, value: division.id };
        });
      } else {
        this.msgs = [];
        this.msgs = [{ severity: 'error', detail: this.responseModel.statusMsg }];
      }
    }, error => {
      //this.commonComponent.stopSpinner();
      this.msgs = [];
      this.msgs = [{ severity: "error", summary: 'Failed', detail: applicationConstants.WE_COULDNOT_PROCESS_YOU_ARE_REQUEST }];
    });
  }

  getAllBlock() {
    this.blockService.getAllBlock().subscribe((data: any) => {
      this.responseModel = data;
      if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
        this.blockList = this.responseModel.data;
        this.blockList = this.blockList.filter((activity: any) => activity.status == applicationConstants.ACTIVE).map((block: { name: any; id: any; }) => {
          return { label: block.name, value: block.id };
        });
      } else {
        this.msgs = [];
        this.msgs = [{ severity: 'error', detail: this.responseModel.statusMsg }];
      }
    }, error => {
      //this.commonComponent.stopSpinner();
      this.msgs = [];
      this.msgs = [{ severity: "error", summary: 'Failed', detail: applicationConstants.WE_COULDNOT_PROCESS_YOU_ARE_REQUEST }];
    });
  }

  addOrUpdate() {
    //this.commonComponent.startSpinner();
    if (this.isEdit) {
      this.villageService.updateVillage(this.villagesModel).subscribe((response: any) => {
        this.responseModel = response;
        if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
          //this.commonComponent.stopSpinner();
          this.msgs = [{ severity: 'success', summary: applicationConstants.STATUS_SUCCESS, detail: this.responseModel.statusMsg }];
          setTimeout(() => {
            this.msgs = [];
            this.navigateToBack();
          }, 2000);
        } else {
          // this.commonComponent.stopSpinner();
          this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: this.responseModel.statusMsg }];
          setTimeout(() => {
            this.msgs = [];
          }, 2000);
        }
      },
        error => {
          //this.commonComponent.stopSpinner();
          this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: this.responseModel.statusMsg }];
          setTimeout(() => {
            this.msgs = [];
          }, 2000);
        });
    } else {
      this.villageService.addVillage(this.villagesModel).subscribe((response: any) => {
        this.responseModel = response;
        if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
          // this.commonComponent.stopSpinner();
          this.msgs = [{ severity: 'success', summary: applicationConstants.STATUS_SUCCESS, detail: this.responseModel.statusMsg }];
          setTimeout(() => {
            this.msgs = [];
            this.navigateToBack();
          }, 2000);
        } else {
          //this.commonComponent.stopSpinner();
          this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: this.responseModel.statusMsg }];
          setTimeout(() => {
            this.msgs = [];
          }, 2000);
        }
      },
        error => {
          // this.commonComponent.stopSpinner();
          this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: this.responseModel.statusMsg }];
          setTimeout(() => {
            this.msgs = [];
          }, 2000);
        });
    }
  }
}
