import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Table } from 'primeng/table/table';
import { CommonComponent } from 'src/app/shared/common.component';
import { applicationConstants } from 'src/app/shared/applicationConstants';
import { EncryptDecryptService } from 'src/app/shared/encrypt-decrypt.service';
import { Responsemodel } from 'src/app/shared/responsemodel';
import { GroupCommunicationModel, GroupKycDeatilsModel, MemberGroupBasicDetails, promoterDetailsModel } from '../../../shared/member-group-details-model';
import { MemberBasicDetailsStepperService } from '../../../individual/shared/membership-individual-stepper.service';
import { GroupPromotersService } from '../../../shared/group-promoters.service';
import { MembershipGroupDetailsService } from '../../../shared/membership-group-details.service';
import { MembershipBasicDetailsService } from '../../../shared/membership-basic-details.service';
import { DatePipe } from '@angular/common';
import { OperatorTypeService } from 'src/app/configurations/common-config/operator-type/shared/operator-type.service';
import { CommonFunctionsService } from 'src/app/shared/commonfunction.service';
import { FileUpload } from 'primeng/fileupload';
import { FileUploadModel } from 'src/app/layout/mainmenu/shared/file-upload-model.model';
import { FileUploadService } from 'src/app/shared/file-upload.service';
import { ERP_TRANSACTION_CONSTANTS } from 'src/app/transcations/erp-transaction-constants';
import { MemberBasicDetails } from '../../../shared/member-basic-details.model';
import { CommonStatusData, MemberShipTypesData } from 'src/app/transcations/common-status-data.json';

@Component({
  selector: 'app-group-basic-details',
  templateUrl: './group-basic-details.component.html',
  styleUrls: ['./group-basic-details.component.css']
})
export class GroupBasicDetailsComponent implements OnInit{
 
  @ViewChild('dt', { static: false }) private dt!: Table;
  groupBasicDetailsForm:FormGroup;
  promoterDetailsForm:any;
  groupBasicDetails:any;
  tempGroupBasicDetails:any []=[];
  groupBasicDetailsList:any []=[];
  date: any;
  addButton: boolean = false;
  id: any;
  groupBasic: any;
  statusList: any[]=[];
  groupCommunicationModel:GroupCommunicationModel = new GroupCommunicationModel()
  groupKycDeatilsModel:GroupKycDeatilsModel = new GroupKycDeatilsModel();
  memberGroupBasicDetails :MemberGroupBasicDetails = new MemberGroupBasicDetails();
  promoterDetailsModel :promoterDetailsModel = new promoterDetailsModel();
  memberBasicDetailsModel: MemberBasicDetails = new MemberBasicDetails();

  EditDeleteDisable:boolean = false;
  activeIndex: number = 0;
  buttonDisabled: boolean=false;
  promoterDisplayFlag: boolean = false;
  completed = 0;
  branchId: any;
  saveAndContinueFlag: boolean = true;
  isEdit: any;
  responseModel!: Responsemodel;
  savedID: any;
  msgs: any[] = [];
  orgnizationSetting: any;
  communication: any;
  kyc: any;
  land: any;
  nominee: any;
  familydetails: any;
  asset: any;
  basicDetails: any;
  buttonDisbled: boolean =true;
  isSaveContinueEnable: boolean = false;
  nextDisable: boolean = false;
  serviceUrl: any;
  promoterColumns: any[] = [];
  genderList:any[]=[];
  maritalStatusList:any[]=[];
  operatorTypeList:any[]=[];
  promoterDetails:any[]=[];
  memberTypeList:any[]=[];
  newRow: any;
  admissionNumber: any;
  subProductList:any;
  landFlag: boolean = false;
  buttonsFlag: boolean = true;
  multipleFilesList: any;
  uploadFileData: any;
  isFileUploaded: any;
  uploadSignature: boolean= false;
  rowEdit:number =0
  cancleButtonFlag : Boolean = false;
  admissionNumberDropDown: boolean = false;
  allTypesOfmembershipList: any[]=[];
  admissionNumbersList: any[]=[];
  pacsId:any;
  promterTypeDisabled : any;
  groupId: any;
  
  constructor(private commonComponent: CommonComponent,private router:Router, private formBuilder:FormBuilder,
    private memberBasicDetailsStepperService:MemberBasicDetailsStepperService,
    private activateRoute: ActivatedRoute, private encryptService: EncryptDecryptService,
    private membershipGroupDetailsService:MembershipGroupDetailsService,
    private operatorTypeService:OperatorTypeService, private commonFunctionsService: CommonFunctionsService,
    private membershipBasicDetailsService: MembershipBasicDetailsService,
    private groupPromotersService:GroupPromotersService, private datePipe: DatePipe, private fileUploadService :FileUploadService,
  ){
    this.groupBasicDetailsForm = this.formBuilder.group({
      // 'memberTypeId': new FormControl('', Validators.required),
      'subProductId':new FormControl('',Validators.required),
      'name':new FormControl('',[Validators.required,Validators.pattern(applicationConstants.NEW_NAME_PATTERN), Validators.maxLength(40), Validators.pattern(/^[^\s]+(\s.*)?$/)]),
      'registrationNumber': new FormControl('',Validators.required),
      'registrationDate': new FormControl('',Validators.required),
      // 'mobileNumber':new FormControl('',Validators.required),
      'gstNumber':new FormControl('',[Validators.pattern(applicationConstants.GST_NUMBER_PATTERN) ]),
      'admissionDate': new FormControl('',Validators.required),
      'pocName': new FormControl('', [Validators.required,Validators.pattern(applicationConstants.NEW_NAME_PATTERN), Validators.maxLength(40), Validators.pattern(/^[^\s]+(\s.*)?$/)]),
      'pocNumber': new FormControl('',[Validators.required,Validators.pattern(applicationConstants.MOBILE_PATTERN), Validators.maxLength(10)]),
      'panNumber': new FormControl('',[Validators.required,Validators.pattern(applicationConstants.PAN_NUMBER_PATTERN),]),
      'tanNumber': new FormControl('',[Validators.pattern(applicationConstants.TAN_NUMBER)]),
      'resolutionNumber': new FormControl(''),
    })
    this.promoterDetailsForm = this.formBuilder.group({
      'surname': new FormControl('',[Validators.pattern(applicationConstants.NEW_NAME_PATTERN), Validators.maxLength(40), Validators.pattern(/^[^\s]+(\s.*)?$/)]),
      'name':new FormControl('',[Validators.required,Validators.pattern(applicationConstants.NEW_NAME_PATTERN), Validators.maxLength(40), Validators.pattern(/^[^\s]+(\s.*)?$/)]),
      'operatorTypeId': new FormControl('',Validators.required),
      'dob': new FormControl('',Validators.required),
      'age': new FormControl('',Validators.required),
      'genderId': new FormControl(''),
      'martialId': new FormControl(''),
      'mobileNumber': new FormControl('',[Validators.required,Validators.pattern(applicationConstants.MOBILE_PATTERN), Validators.maxLength(10)]),
      'aadharNumber': new FormControl('',[Validators.required,Validators.pattern(applicationConstants.AADHAR_PATTERN), Validators.maxLength(12)]),
      'emailId': new FormControl('', [Validators.required, Validators.pattern(applicationConstants.EMAIL_PATTERN)]),
      'startDate': new FormControl('',Validators.required),
      'authorizedSignatory':new FormControl(''),
      'isExistingMember':new FormControl(''),
      'admissionNumber':new FormControl('')
    })
  }
  ngOnInit(): void {
    // this.addNewEntry();
    this.orgnizationSetting = this.commonComponent.orgnizationSettings();
    this.statusList = this.commonComponent.status();
    this.genderList = this.commonComponent.genderList();
    this.maritalStatusList = this.commonComponent.maritalStatusList();
    this.pacsId =  this.commonFunctionsService.getStorageValue(applicationConstants.PACS_ID);
    this.branchId =  this.commonFunctionsService.getStorageValue(applicationConstants.BRANCH_ID);
  
    this.activateRoute.queryParams.subscribe(params => {
      if (params['id'] != undefined) {
        this.commonComponent.startSpinner();
        let queryParams = params['id'].split('#');
        let id = this.encryptService.decrypt(params['id']);
        this.groupId = id;
  
        if (id != "" && id != null && id != undefined) {
          this.isEdit = true;
          this.getMembershipGroupDetailsById(this.groupId); // Call the method to fetch details
        }
      } else {
        this.isEdit = false;
        // this.getMemberPreviewsDetails();
        this.generateNewAdmissionNumber();
        this.memberGroupBasicDetails.groupStatus = this.statusList[0].value;
      }
    });
  
    this.groupBasicDetailsForm.valueChanges.subscribe((data: any) => {
      this.updateData();
      if (this.groupBasicDetailsForm.valid) {
        this.save();
      }
    });
    this.getAllSubProducts();
   }
  
  updateData() {
    if (this.memberGroupBasicDetails.groupPromoterList != null && this.memberGroupBasicDetails.groupPromoterList != undefined &&
      this.memberGroupBasicDetails.groupPromoterList.length > 0 && this.buttonsFlag ) {
      this.landFlag = true;
    }
    this.promoterDetailsModel.groupId =this.memberGroupBasicDetails.id
    this.memberBasicDetailsStepperService.changeData({
      formValid: this.promoterDetailsForm.valid ,
      data: this.memberGroupBasicDetails,
      savedId:this.id,
      stepperIndex: 0,
      isDisable: !this.landFlag ? true : false,
    });
  }
  getMembershipGroupDetailsById(id: any): void {
    this.membershipGroupDetailsService.getMembershipGroupDetailsById(id).subscribe(res => {
      this.responseModel = res;
      this.commonComponent.stopSpinner();
      if (this.responseModel.status == applicationConstants.STATUS_SUCCESS && this.responseModel.data[0] != null) {
        this.memberGroupBasicDetails = this.responseModel.data[0];
        if (this.memberGroupBasicDetails.admissionDate != null && this.memberGroupBasicDetails.admissionDate != undefined) {
          this.memberGroupBasicDetails.admissionDateVal = this.datePipe.transform(this.memberGroupBasicDetails.admissionDate, this.orgnizationSetting.datePipe);
        }
        if (this.memberGroupBasicDetails.registrationDate != null && this.memberGroupBasicDetails.registrationDate != undefined) {
          this.memberGroupBasicDetails.registrationDateVal = this.datePipe.transform(this.memberGroupBasicDetails.registrationDate, this.orgnizationSetting.datePipe);
        }
        if (this.memberGroupBasicDetails.resolutionCopyPath != null && this.memberGroupBasicDetails.resolutionCopyPath != undefined) {
          this.memberGroupBasicDetails.multipartFileListForsignatureCopyPath = this.fileUploadService.getFile(this.memberGroupBasicDetails.resolutionCopyPath ,ERP_TRANSACTION_CONSTANTS.MEMBERSHIP + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.memberGroupBasicDetails.resolutionCopyPath  );
        }
        if (this.memberGroupBasicDetails.applicationCopyPath != null && this.memberGroupBasicDetails.applicationCopyPath != undefined) {
          this.memberGroupBasicDetails.applicationCopyList = this.fileUploadService.getFile(this.memberGroupBasicDetails.applicationCopyPath ,ERP_TRANSACTION_CONSTANTS.MEMBERSHIP + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.memberGroupBasicDetails.applicationCopyPath  );
        }
        let i = 0;
                this.promoterDetailsModel.groupId = this.memberGroupBasicDetails.id
        if (this.memberGroupBasicDetails.groupPromoterList != null && this.memberGroupBasicDetails.groupPromoterList != undefined &&this.memberGroupBasicDetails.groupPromoterList.length > 0) {
          this.promoterDetails = this.memberGroupBasicDetails.groupPromoterList.map((member: any) => {
            i = i+1;
            member.uniqueId = i;
            member.memDobVal = this.datePipe.transform(member.dob, this.orgnizationSetting.datePipe);
            member.startDateVal = this.datePipe.transform(member.startDate, this.orgnizationSetting.datePipe);
            
            if (member.uploadImage != null && member.uploadImage != undefined) {
              member.multipartFileListForPhotoCopy = this.fileUploadService.getFile(member.uploadImage ,ERP_TRANSACTION_CONSTANTS.MEMBERSHIP + ERP_TRANSACTION_CONSTANTS.FILES + "/" + member.uploadImage );
            }
            if (member.uploadSignature != null && member.uploadSignature != undefined) {
              member.multipartFileListForsignatureCopyPath = this.fileUploadService.getFile(member.uploadSignature ,ERP_TRANSACTION_CONSTANTS.MEMBERSHIP + ERP_TRANSACTION_CONSTANTS.FILES + "/" + member.uploadSignature  );
            }
            if(member.authorizedSignatory != null && member.authorizedSignatory != undefined)
              this.getSignatureUpload(member);
             return member;
          });
          this.buttonsFlag  = true;
          this.landFlag = true;
        }
        else{
          this.buttonsFlag  = false;
          this.landFlag = false;
        }
      }
      this.updateData();
    });
  }
  getAllSubProducts() {
    this.commonComponent.startSpinner();
    this.membershipBasicDetailsService.getAllSubProduct().subscribe((res: any) => {
      this.responseModel = res;
      if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
        if (this.responseModel.data == null || (this.responseModel.data != null && this.responseModel.data.length == 0)) {

          this.msgs = [];
          this.msgs = [{ severity: 'error', detail: applicationConstants.RELATIONSHIP_TYPE_NO_DATA_MESSAGE }];
          setTimeout(() => {
            this.msgs = [];
          }, 2000);
        }
        this.subProductList = this.responseModel.data.filter((customertype:any) => customertype.status == applicationConstants.ACTIVE).map((count:any) => {
          return { label: count.name, value: count.id }
        });
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
 
  save() {
    this.updateData();
  }
    editPromoter(rowData: any) {
      this.getSignatureUpload(rowData);
      this.cancleButtonFlag = true;
      this.addButton = true;
      this.EditDeleteDisable = true;
      this.promoterDisplayFlag = true;
      this.buttonsFlag  = false;
       this.landFlag =false
      this.promoterDetailsModel = rowData
      this.promoterDetailsModel.groupId = this.groupId;
      this.updateData();
      // this.promoterDetailsModel = new promoterDetailsModel();
      this.promoterDetailsModel = this.promoterDetails.find((obj:any) => (obj != null && obj != undefined) && obj.uniqueId === rowData.uniqueId );
      if(this.promoterDetailsModel.isExistingMember){
      this.admissionNumberDropDown = true;
      this.getAllTypeOfMembershipDetails(this.pacsId,this.branchId);
      this.promoterDetailsForm.get('surname').disable();
      this.promoterDetailsForm.get('name').disable();
      // this.promoterDetailsForm.get('operatorTypeId').disable();
      this.promoterDetailsForm.get('dob').disable();
      this.promoterDetailsForm.get('age').disable();
      this.promoterDetailsForm.get('genderId').disable();
      this.promoterDetailsForm.get('martialId').disable();
      this.promoterDetailsForm.get('mobileNumber').disable();
      this.promoterDetailsForm.get('aadharNumber').disable();
      this.promoterDetailsForm.get('emailId').disable();
      this.promoterDetailsForm.get('startDate').disable();
      }
      else{
        this.admissionNumberDropDown = false;
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
        // this.promoterDetailsForm.get('admissionNumber').setValidators(null);
      }
      this.getAllOperatorType();
    }
    onRowEditSave() {
      this.addButton = true;
      this.buttonsFlag  = false;
      this.landFlag =false
      this.promoterDisplayFlag = true;
      this.EditDeleteDisable = true;
      this.cancleButtonFlag = false;
      this.promoterDetailsModel = new promoterDetailsModel();
      this.promoterDetailsModel.uniqueId = this.promoterDetails.length + 1
      this.promoterDetailsForm.reset();
      this.onChangeExistedPrmoter(false);
      this.admissionNumberDropDown = false;
      this. getAllOperatorType();
      this.updateData();
    }
  getAllOperatorType() {
    this.commonComponent.startSpinner();
    this.operatorTypeService.getAllOperationTypes().subscribe((res: any) => {
      this.responseModel = res;
      if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
        if (this.responseModel.data != undefined && this.responseModel.data != null && this.responseModel.data.length > 0) {

          this.operatorTypeList = this.responseModel.data.filter((customertype: any) => customertype.status == applicationConstants.ACTIVE).map((count: any) => {
            return { label: count.name, value: count.id }
          });
          this.commonComponent.stopSpinner();
        }
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
  savePromoterDetails(rowData: any) {
    this.promoterDisplayFlag = false;
   if(rowData.memDobVal != undefined && rowData.memDobVal != null)
      rowData.dob = this.commonFunctionsService.getUTCEpoch(new Date(rowData.memDobVal));
  
    if(rowData.startDateVal != undefined && rowData.startDateVal != null)
      rowData.startDate = this.commonFunctionsService.getUTCEpoch(new Date(rowData.startDateVal));

    if (this.memberGroupBasicDetails.id == null && this.memberGroupBasicDetails.id == undefined) {
      rowData.pacsId = this.pacsId;
      rowData.branchId = this.branchId;
      rowData.status = applicationConstants.ACTIVE;
      if (null != rowData.dob)
        rowData.memDobVal = this.datePipe.transform(rowData.dob, this.orgnizationSetting.datePipe);

      if (null != rowData.startDate)
        rowData.startDateVal = this.datePipe.transform(rowData.startDate, this.orgnizationSetting.datePipe);

      this.operatorTypeList.filter(data => data != null && data.value == rowData.operatorTypeId).map(count => {
        rowData.operatorTypeName = count.label;
      })
      this.genderList.filter(data => data != null && data.value == rowData.genderId).map(count => {
        rowData.genderTypeName = count.label;
      })
    
      this.maritalStatusList.filter(data => data != null && data.value == rowData.martialId).map(count => {
        rowData.maritalStatusName = count.label;
      })
      if (rowData.uploadImage != null && rowData.uploadImage != undefined) {
        rowData.multipartFileListForPhotoCopy = this.fileUploadService.getFile(rowData.uploadImage ,ERP_TRANSACTION_CONSTANTS.MEMBERSHIP + ERP_TRANSACTION_CONSTANTS.FILES + "/" + rowData.uploadImage );
      }
      if (rowData.uploadSignature != null && rowData.uploadSignature != undefined) {
        rowData.multipartFileListForsignatureCopyPath = this.fileUploadService.getFile(rowData.uploadSignature ,ERP_TRANSACTION_CONSTANTS.MEMBERSHIP + ERP_TRANSACTION_CONSTANTS.FILES + "/" + rowData.uploadSignature  );
      }
      this.addButton = false;
      this.EditDeleteDisable = false;

      if (!this.memberGroupBasicDetails.groupPromoterList) {
        this.memberGroupBasicDetails.groupPromoterList = []; // Initialize it as an empty array
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
        this.memberGroupBasicDetails.groupPromoterList = this.promoterDetails;
      }else{
        this.promoterDetails.push(rowData);
        this.memberGroupBasicDetails.groupPromoterList = this.promoterDetails;
      }
      this.buttonsFlag = true;
      this.landFlag = true;
      this.updateData();
    } else {
      this.saveOrUpdatePromoterDetailsDetails(rowData);
    }
  }
  saveOrUpdatePromoterDetailsDetails(rowData: any) {
    rowData.pacsId = this.pacsId;
    rowData.branchId =this.branchId;
    rowData.groupId = this.memberGroupBasicDetails.id;
    rowData.status = applicationConstants.ACTIVE;
    this.addButton = false;
    this.EditDeleteDisable = false;
    if (null != rowData.dob)
      rowData.memDobVal = this.datePipe.transform(rowData.dob, this.orgnizationSetting.datePipe);

    if (null != rowData.startDate)
      rowData.startDateVal = this.datePipe.transform(rowData.startDate, this.orgnizationSetting.datePipe);

    this.operatorTypeList.filter(data => data != null && data.value == rowData.operatorTypeId).map(count => {
      rowData.operatorTypeName = count.label;
    })
    this.genderList.filter(data => data != null && data.value == rowData.genderId).map(count => {
      rowData.genderTypeName = count.label;
    })
  
    this.maritalStatusList.filter(data => data != null && data.value == rowData.martialId).map(count => {
      rowData.maritalStatusName = count.label;
    })
    if (rowData.id != null) {
      this.groupPromotersService.updateGroupPromoters(rowData).subscribe((response: any) => {
        this.responseModel = response;
        if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
          this.buttonsFlag  = true;
          this.landFlag =true;;
          this.updateData();
          this.commonComponent.stopSpinner();
          this.msgs = [{ severity: 'success', summary: applicationConstants.STATUS_SUCCESS, detail: this.responseModel.statusMsg }];
          setTimeout(() => {
            this.msgs = [];
          }, 2000);
        } else {
          this.commonComponent.stopSpinner();
          this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: this.responseModel.statusMsg }];
          setTimeout(() => {
            this.msgs = [];
          }, 2000);
        }
        this.getMembershipGroupDetailsById(rowData.groupId);
      },
        error => {
          this.commonComponent.stopSpinner();
          this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: this.responseModel.statusMsg }];
          setTimeout(() => {
            this.msgs = [];
          }, 2000);
        });
    } else {
      this.groupPromotersService.addGroupPromoters(rowData).subscribe((response: any) => {
        this.responseModel = response;
        if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
          rowData= this.responseModel.data[0]
          if (null != this.responseModel.data[0].dob)
            this.responseModel.data[0].memDobVal = this.datePipe.transform(this.responseModel.data[0].dob, this.orgnizationSetting.datePipe);
          this.buttonsFlag  = true;
          this.landFlag =true;
          this.updateData();
          this.commonComponent.stopSpinner();
          this.msgs = [{ severity: 'success', summary: applicationConstants.STATUS_SUCCESS, detail: this.responseModel.statusMsg }];
          setTimeout(() => {
            this.msgs = [];
          }, 2000);
        } else {
          this.commonComponent.stopSpinner();
          this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: this.responseModel.statusMsg }];
          setTimeout(() => {
            this.msgs = [];
          }, 2000);
        }
        this.getMembershipGroupDetailsById(rowData.groupId);
      },
        error => {
          this.commonComponent.stopSpinner();
          this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: this.responseModel.statusMsg }];
          setTimeout(() => {
            this.msgs = [];
          }, 2000);
        });
    }
  }
  
  generateNewAdmissionNumber(): void {
    this.admissionNumber = this.generateAdmissionNumber();
    this.memberGroupBasicDetails.admissionNumber =this.admissionNumber
  }
  
  generateAdmissionNumber(): string {
    // Generate a random 12-digit number
    const admissionNumber = Math.floor(100000000000 + Math.random() * 900000000000);
    return admissionNumber.toString();
  }

  fileUploader(event: any, fileUpload: FileUpload, filePathName: any) {
    this.isFileUploaded = applicationConstants.FALSE;
    this.multipleFilesList = [];
    if(this.isEdit && this.memberGroupBasicDetails.filesDTOList == null || this.memberGroupBasicDetails.filesDTOList == undefined){
      this.memberGroupBasicDetails.filesDTOList = [];
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
        let timeStamp = this.commonComponent.getTimeStamp();
        if (filePathName === "resolutionCopyPath") {
          this.memberGroupBasicDetails.multipartFileListForsignatureCopyPath = [];
          this.memberGroupBasicDetails.filesDTOList.push(files);
          this.memberGroupBasicDetails.resolutionCopyPath = null;
          this.memberGroupBasicDetails.filesDTOList[this.memberGroupBasicDetails.filesDTOList.length - 1].fileName = "Group_Resolution_Copy" + "_" + timeStamp + "_" + file.name;
          this.memberGroupBasicDetails.resolutionCopyPath = "Group_Resolution_Copy" + "_" + timeStamp + "_" + file.name; 
        }
        if (filePathName === "applicationCopyPath") {
          this.memberGroupBasicDetails.applicationCopyList = [];
          this.memberGroupBasicDetails.filesDTOList.push(files);
          this.memberGroupBasicDetails.applicationCopyPath = null;
          this.memberGroupBasicDetails.filesDTOList[this.memberGroupBasicDetails.filesDTOList.length - 1].fileName = "Group_Application_Copy" + "_" + timeStamp + "_" + file.name;
          this.memberGroupBasicDetails.applicationCopyPath = "Group_Application_Copy" + "_" + timeStamp + "_" + file.name; 
        }
        this.updateData();
      }
      reader.readAsDataURL(file);
    }
  }

  fileUploadersForPromoter(event: any, fileUpload: FileUpload, filePathName: any,rowData:any) {
    this.isFileUploaded = applicationConstants.FALSE;
    this.multipleFilesList = [];
    if(this.isEdit && rowData.filesDTOList == null || rowData.filesDTOList == undefined){
      rowData.filesDTOList = [];
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
        let timeStamp = this.commonComponent.getTimeStamp();
        if (filePathName === "photoCopyPath") {
          rowData.multipartFileListForPhotoCopy = [];
          rowData.filesDTOList.push(files);
          rowData.uploadImage = null;
          rowData.filesDTOList[rowData.filesDTOList.length - 1].fileName = "Group_Promoter_Photo_Copy" + "_" + timeStamp + "_" + file.name;
          rowData.uploadImage = "Group_Promoter_Photo_Copy" + "_" + timeStamp + "_" + file.name; 
        }
        if (filePathName === "signaturePath") {
          rowData.multipartFileListForsignatureCopyPath = [];
          rowData.filesDTOList.push(files);
          rowData.uploadSignature = null;
          rowData.filesDTOList[rowData.filesDTOList.length - 1].fileName = "Group_Promoter_Signature_Copy" + "_" + timeStamp + "_" + file.name;
          rowData.uploadSignature = "Group_Promoter_Signature_Copy" + "_" + timeStamp + "_" + file.name; 
        }
        
        this.updateData();
      }
      reader.readAsDataURL(file);
    }
  }
  fileRemoveEvent() {
    if (this.memberGroupBasicDetails.filesDTOList != null && this.memberGroupBasicDetails.filesDTOList != undefined && this.memberGroupBasicDetails.filesDTOList.length > 0) {
      let removeFileIndex = this.memberGroupBasicDetails.filesDTOList.findIndex((obj: any) => obj && obj.fileName === this.memberGroupBasicDetails.resolutionCopyPath);
      this.memberGroupBasicDetails.filesDTOList.splice(removeFileIndex, 1);
      this.memberGroupBasicDetails.resolutionCopyPath = null;
  }
}
fileRemoveEventForPromoter(fileName: any,rowData:any) {
  if (rowData.filesDTOList != null && rowData.filesDTOList != undefined && rowData.filesDTOList.length > 0) {
    if (fileName == "photoCopyPath") {
    let removeFileIndex = rowData.filesDTOList.findIndex((obj: any) => obj && obj.fileName === rowData.uploadImage);
    rowData.filesDTOList.splice(removeFileIndex, 1);
    rowData.uploadImage = null;
  }
  else if (fileName == "signaturePath") {
    let removeFileIndex = rowData.filesDTOList.findIndex((obj: any) => obj && obj.fileName === rowData.uploadSignature);
    rowData.filesDTOList.splice(removeFileIndex, 1);
    rowData.uploadSignature = null;
  }
}
}
getSignatureUpload(rowdata:any){
  let data = rowdata.authorizedSignatory ;
    if(data == applicationConstants.TRUE){
      this.uploadSignature = false;
    }
    else if(data == applicationConstants.FALSE){
      this.uploadSignature = true;
    }
    else{
        this.uploadSignature = true;
    }
}

admissionDateOnSelect(){
  if(this.memberGroupBasicDetails.admissionDateVal != undefined && this.memberGroupBasicDetails.registrationDateVal != undefined){
    if(this.memberGroupBasicDetails.admissionDateVal < this.memberGroupBasicDetails.registrationDateVal){
      this.groupBasicDetailsForm.get('registrationDate')?.reset();
      this.groupBasicDetailsForm.get('admissionDate')?.reset();
      this.groupBasicDetailsForm.updateValueAndValidity();
      this.msgs = [{ severity: 'warn', detail: applicationConstants.REGISTRATION_DATE_SHOULD_LESSTHAN_ADMISSION_DATE }];
      setTimeout(() => {
        this.msgs = [];        
      }, 2000);
    }
  }
}
  /**
   * @implements cancle prmoters
   * @author K.YAMUNA
   */
  cancelPromoter(falg:Boolean) {
    this.addButton = false;
    this.EditDeleteDisable = false;
    this.buttonsFlag  = true;
    this.promoterDisplayFlag = false;
    this.EditDeleteDisable = false;
    this.promoterDetails;
    this.updateData();
  }

   /**
   * @implements onchange existed prmoter
   * @author k.yamuna
   */
   onChangeExistedPrmoter(isExistingMember :any){
    
    if(isExistingMember){
        this.admissionNumberDropDown = true;
        this.getAllTypeOfMembershipDetails(this.pacsId,this.branchId);
        this.resetFields();
    }
    else {
      this.resetFields();
        this.admissionNumberDropDown = false;
         this.promoterDetailsForm.get('admissionNumber').reset();
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
        // this.promoterDetailsForm.get('admissionNumber').setValidators(null);
    }
  }
    /**
   * @implements reset feilds 
   * @author k.yamuna
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
       * @author k.yamuna
       * @implement get member admission Numbers list
       * @argument pacsId,branchId
       */
    getAllTypeOfMembershipDetails(pacsId: any, branchId: any) {
       this.admissionNumbersList = [];
      this.membershipBasicDetailsService.getAllGridList(pacsId,branchId).subscribe((response: any) => {
        this.responseModel = response;
        if (this.responseModel != null && this.responseModel != undefined) {
          if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
            if (this.responseModel.data.length > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
              this.allTypesOfmembershipList = this.responseModel.data;
              this.admissionNumbersList = this.allTypesOfmembershipList.filter((obj: any) => (obj != null) && obj.memberTypeName == MemberShipTypesData.INDIVIDUAL && obj.statusName == CommonStatusData.APPROVED)
              .map((relationType: any) => {
                return relationType.admissionNumber
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
     * @author k.yamuna
     * @implement get member details for promoter by admission Number
     * @argument admissionNumber
     */
  getMemberDetailsByAdmissionNUmber(admissionNumber: any) {
    this.membershipBasicDetailsService.getMembershipBasicDetailsByAdmissionNumber(admissionNumber).subscribe((data: any) => {
      this.responseModel = data;
      if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
        if (this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
          this.memberBasicDetailsModel = this.responseModel.data[0];
          if( this.memberBasicDetailsModel != null &&  this.memberBasicDetailsModel != undefined){
            this.promoterDetailsModel.name = this.memberBasicDetailsModel.name,
            this.promoterDetailsModel.surname = this.memberBasicDetailsModel.surname;
            this.promoterDetailsModel.aadharNumber = this.memberBasicDetailsModel.aadharNumber;
            this.promoterDetailsModel.dob = this.memberBasicDetailsModel.dob;
            if (this.promoterDetailsModel.dob != null && this.promoterDetailsModel.dob != undefined)
              this.promoterDetailsModel.memDobVal = this.datePipe.transform(this.promoterDetailsModel.dob, this.orgnizationSetting.datePipe);
            this.promoterDetailsModel.age = this.memberBasicDetailsModel.age;
            this.promoterDetailsModel.genderId = this.memberBasicDetailsModel.genderId;
            this.promoterDetailsModel.martialId = this.memberBasicDetailsModel.martialId;
            this.promoterDetailsModel.mobileNumber = this.memberBasicDetailsModel.mobileNumber;
            this.promoterDetailsModel.emailId = this.memberBasicDetailsModel.emailId;
            this.promoterDetailsModel.startDate = this.memberBasicDetailsModel.admissionDate;
            if (this.promoterDetailsModel.startDate != null && this.promoterDetailsModel.startDate != undefined)
              this.promoterDetailsModel.startDateVal = this.datePipe.transform(this.promoterDetailsModel.startDate, this.orgnizationSetting.datePipe);

            this.promoterDetailsForm.get('surname').disable();
            this.promoterDetailsForm.get('name').disable();
            // this.promoterDetailsForm.get('operatorTypeId').disable();
            this.promoterDetailsForm.get('dob').disable();
            this.promoterDetailsForm.get('age').disable();
            this.promoterDetailsForm.get('genderId').disable();
            this.promoterDetailsForm.get('martialId').disable();
            this.promoterDetailsForm.get('mobileNumber').disable();
            this.promoterDetailsForm.get('aadharNumber').disable();
            this.promoterDetailsForm.get('emailId').disable();
            this.promoterDetailsForm.get('startDate').disable();
            // this.promoterDetailsForm.get('admissionNumber').setValidators(Validators.compose([Validators.required]));
          }
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

// Method to validate and handle both DOB and Age fields
datesValidationCheckAgeAndDob(model: any, type: number): void {
  if (type === 2) { 
    if (model.memDobVal) {
      const calculatedAge = this.calculateAge(model.memDobVal);
      model.age = calculatedAge; 
    }
  } else if (type === 1) { 
    if (model.age && model.age > 0) {
      const calculatedDob = this.calculateDobFromAge(model.age);
      model.memDobVal = calculatedDob; 
    } else {
      this.promoterDetailsForm.get('age')?.reset();
      this.msgs = [{ severity: 'warn', detail: "Age should not be zero or negative" }];
      setTimeout(() => {
        this.msgs = [];
      }, 2000);
    }
  }
}

// Method to calculate age from date of birth
calculateAge(dateOfBirth: Date): number {
  if (!dateOfBirth) return 0;
  const today = new Date();
  const birthDate = new Date(dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}

// Method to calculate date of birth from age
calculateDobFromAge(age: number): Date {
  if (isNaN(age) || age <= 0) {
    return new Date(0);
  }
  const today = new Date();
  const birthYear = today.getFullYear() - age;
  const dob = new Date(today); 
  dob.setFullYear(birthYear); 
  dob.setMonth(0); 
  dob.setDate(1); 

  return dob;
}
}
