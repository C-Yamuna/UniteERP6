import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Table } from 'primeng/table';
import { Responsemodel } from 'src/app/shared/responsemodel';
import { InstitutionBasicDetailsModel, InstituteCommunicationModel, InstiteKycDetailsModel, InstitutePromoterDetails } from '../../../shared/institution-details.model';
import { CommonComponent } from 'src/app/shared/common.component';
import { applicationConstants } from 'src/app/shared/applicationConstants';
import { EncryptDecryptService } from 'src/app/shared/encrypt-decrypt.service';
import { MemberBasicDetailsStepperService } from '../../../individual/shared/membership-individual-stepper.service';
import { MembershipBasicDetailsService } from '../../../shared/membership-basic-details.service';
import { TranslateService } from '@ngx-translate/core';
import { MessageService } from 'primeng/api';
import { CommonFunctionsService } from 'src/app/shared/commonfunction.service';
import { InstitutionPromoterDetailsService } from '../../../shared/institution-promoter-details.service';
import { MemInstitutionService } from '../../../shared/mem-institution.service';
import { OperatorTypeService } from 'src/app/configurations/common-config/operator-type/shared/operator-type.service';
import { DatePipe } from '@angular/common';
import { FileUploadModel } from 'src/app/layout/mainmenu/shared/file-upload-model.model';
import { FileUpload } from 'primeng/fileupload';
import { FileUploadService } from 'src/app/shared/file-upload.service';
import { ERP_TRANSACTION_CONSTANTS } from 'src/app/transcations/erp-transaction-constants';
import { MemberBasicDetails } from '../../../shared/member-basic-details.model';
import { MemberShipTypesData } from 'src/app/transcations/common-status-data.json';

@Component({
  selector: 'app-institution-basic-details',
  templateUrl: './institution-basic-details.component.html',
  styleUrls: ['./institution-basic-details.component.css']
})
export class InstitutionBasicDetailsComponent implements OnInit{
  @ViewChild('dt', { static: false }) private dt!: Table;
  @ViewChild('dd', { static: false }) private dd!: Table;
  @ViewChild('dl', { static: false }) private dl!: Table;
  @ViewChild('cv', { static: false }) private cv!: Table;
  @ViewChild('cc', { static: false }) private cc!: Table;
  @ViewChild('bd', { static: false }) private bd!: Table;
 
  instituteBasicDetailsForm:FormGroup;
  institutepromoterDetailsForm:any;

  date: any;
  addButton: boolean = false;
  id: any;
  statusList: any[]=[];
  ginstitutionBasicDetailsModel :InstitutionBasicDetailsModel = new InstitutionBasicDetailsModel();
  instituteCommunicationModel:InstituteCommunicationModel = new InstituteCommunicationModel()
  institutePromoterDetails:InstitutePromoterDetails = new InstitutePromoterDetails();
  memberBasicDetailsModel: MemberBasicDetails = new MemberBasicDetails();
  
 
  EditDeleteDisable:boolean = false;
  activeIndex: number = 0;
  buttonDisabled: boolean=false;
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
  productTypeList:any[]=[];
  newRow: any
  admissionNumber: any;
  subProductList:any[]=[];
  landFlag: boolean = false;
  buttonsFlag: boolean = true;
  multipleFilesList: any;
  uploadFileData: any;
  isFileUploaded: any;
  uploadSignature:boolean = false;
  rowEdit:number = 0;
  institutionId:any;
  cancleButtonFlag : boolean = false;
  admissionNumberDropDown: boolean = false;
  allTypesOfmembershipList: any[]=[];
  admissionNumbersList: any[]=[];
  pacsId:any;
  promterTypeDisabled : any;
  institutionPromoters:boolean = false;
  promoterDisplayFlag: boolean= false;
  promotersList: any[]=[];

  constructor(public messageService: MessageService, private router: Router, private memInstitutionService: MemInstitutionService, private formBuilder:FormBuilder,
    private route: Router, private activateRoute: ActivatedRoute, private encryptDecryptService: EncryptDecryptService,
    private commonComponent: CommonComponent, private translate: TranslateService,
    private operatorTypeService:OperatorTypeService,
    private memberBasicDetailsStepperService: MemberBasicDetailsStepperService,private ref: ChangeDetectorRef,
    private institutionPromoterDetailsService:InstitutionPromoterDetailsService,private encryptService: EncryptDecryptService,
   private datePipe: DatePipe,private membershipBasicDetailsService: MembershipBasicDetailsService,private fileUploadService :FileUploadService
    ,private commonFunctionsService: CommonFunctionsService,
  ) {
    this.instituteBasicDetailsForm = this.formBuilder.group({
      'subProductId':new FormControl('',Validators.required),
      'name':new FormControl('',[Validators.required,Validators.pattern(applicationConstants.NEW_NAME_PATTERN), Validators.maxLength(40), Validators.pattern(/^[^\s]+(\s.*)?$/)]),
      'registrationNumber': new FormControl('',Validators.required),
      'registrationDate': new FormControl('',Validators.required),
      'gstNumber':new FormControl('',[Validators.pattern(applicationConstants.GST_NUMBER_PATTERN) ]),
      'admissionDate': new FormControl('',Validators.required),
      'pocName': new FormControl('', [Validators.required,Validators.pattern(applicationConstants.NEW_NAME_PATTERN), Validators.maxLength(40), Validators.pattern(/^[^\s]+(\s.*)?$/)]),
      'pocNumber': new FormControl('',[Validators.required,Validators.pattern(applicationConstants.MOBILE_PATTERN), Validators.maxLength(10)]),
      'panNumber': new FormControl('',[Validators.required,Validators.pattern(applicationConstants.PAN_NUMBER_PATTERN),]),
      'tanNumber': new FormControl('',[Validators.pattern(applicationConstants.TAN_NUMBER)]),
      'resolutionNumber': new FormControl(''),
    })
    this.institutepromoterDetailsForm = this.formBuilder.group({
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
      'startDate': new FormControl(''),
      'authorizedSignatory': new FormControl(''),
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
         this.institutionId = id;
   
         if (id != "" && id != null && id != undefined) {
           this.isEdit = true;
           this.getMembershipInstitutionDetailsById(this.institutionId); // Call the method to fetch details
         }
       } else {
         this.isEdit = false;
         // this.getMemberPreviewsDetails();
         this.generateNewAdmissionNumber();
         this.ginstitutionBasicDetailsModel.institutionStatus = this.statusList[0].value;
       }
     });
   
     this.instituteBasicDetailsForm.valueChanges.subscribe((data: any) => {
       this.updateData();
       if (this.instituteBasicDetailsForm.valid) {
         this.save();
       }
     });
     this.getAllSubProducts();
    }
   
   updateData() {
     if (this.ginstitutionBasicDetailsModel.institutionPromoterList != null && this.ginstitutionBasicDetailsModel.institutionPromoterList != undefined &&
       this.ginstitutionBasicDetailsModel.institutionPromoterList.length > 0 && this.buttonsFlag ) {
       this.landFlag = true;
     }
     this.institutePromoterDetails.institutionId =this.ginstitutionBasicDetailsModel.id
     this.memberBasicDetailsStepperService.changeData({
       formValid: this.institutepromoterDetailsForm.valid ,
       data: this.ginstitutionBasicDetailsModel,
       savedId:this.id,
       stepperIndex: 0,
       isDisable: !this.landFlag ? true : false,
     });
   }
   getMembershipInstitutionDetailsById(id: any): void {
     this.memInstitutionService.getMemInstitutionById(id).subscribe(res => {
       this.responseModel = res;
       this.commonComponent.stopSpinner();
       if (this.responseModel.status == applicationConstants.STATUS_SUCCESS && this.responseModel.data[0] != null) {
         this.ginstitutionBasicDetailsModel = this.responseModel.data[0];
         if (this.ginstitutionBasicDetailsModel.admissionDate != null && this.ginstitutionBasicDetailsModel.admissionDate != undefined) {
           this.ginstitutionBasicDetailsModel.admissionDateVal = this.datePipe.transform(this.ginstitutionBasicDetailsModel.admissionDate, this.orgnizationSetting.datePipe);
         }
         if (this.ginstitutionBasicDetailsModel.registrationDate != null && this.ginstitutionBasicDetailsModel.registrationDate != undefined) {
           this.ginstitutionBasicDetailsModel.registrationDateVal = this.datePipe.transform(this.ginstitutionBasicDetailsModel.registrationDate, this.orgnizationSetting.datePipe);
         }
         if (this.ginstitutionBasicDetailsModel.resolutionCopyPath != null && this.ginstitutionBasicDetailsModel.resolutionCopyPath != undefined) {
           this.ginstitutionBasicDetailsModel.multipartFileListForPhotoCopy = this.fileUploadService.getFile(this.ginstitutionBasicDetailsModel.resolutionCopyPath ,ERP_TRANSACTION_CONSTANTS.MEMBERSHIP + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.ginstitutionBasicDetailsModel.resolutionCopyPath  );
         }
         if (this.ginstitutionBasicDetailsModel.applicationCopyPath != null && this.ginstitutionBasicDetailsModel.applicationCopyPath != undefined) {
           this.ginstitutionBasicDetailsModel.applicationCopyList = this.fileUploadService.getFile(this.ginstitutionBasicDetailsModel.applicationCopyPath ,ERP_TRANSACTION_CONSTANTS.MEMBERSHIP + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.ginstitutionBasicDetailsModel.applicationCopyPath  );
         }
         let i = 0;
                 this.institutePromoterDetails.institutionId = this.ginstitutionBasicDetailsModel.id
         if (this.ginstitutionBasicDetailsModel.institutionPromoterList != null && this.ginstitutionBasicDetailsModel.institutionPromoterList != undefined &&this.ginstitutionBasicDetailsModel.institutionPromoterList.length > 0) {
           this.promoterDetails = this.ginstitutionBasicDetailsModel.institutionPromoterList.map((member: any) => {
             i = i+1;
             member.uniqueId = i;
             member.memDobVal = this.datePipe.transform(member.dob, this.orgnizationSetting.datePipe);
             member.startDateVal = this.datePipe.transform(member.startDate, this.orgnizationSetting.datePipe);
             
             if (member.uploadImage != null && member.uploadImage != undefined) {
               member.multipartFileListForPhotoCopy = this.fileUploadService.getFile(member.uploadImage ,ERP_TRANSACTION_CONSTANTS.MEMBERSHIP + ERP_TRANSACTION_CONSTANTS.FILES + "/" + member.uploadImage );
             }
             if (member.uploadSignature != null && member.uploadSignature != undefined) {
               member.multipartFileListForPhotoCopy = this.fileUploadService.getFile(member.uploadSignature ,ERP_TRANSACTION_CONSTANTS.MEMBERSHIP + ERP_TRANSACTION_CONSTANTS.FILES + "/" + member.uploadSignature  );
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
        this.buttonsFlag  = false;
       this.landFlag =false
       this.promoterDisplayFlag = true;
       this.institutePromoterDetails = rowData
       this.institutePromoterDetails.institutionId = this.institutionId;
       this.updateData();
      
       // this.institutePromoterDetails = new institutePromoterDetails();
       this.institutePromoterDetails = this.promoterDetails.find((obj:any) => (obj != null && obj != undefined) && obj.uniqueId === rowData.uniqueId );
       if(this.institutePromoterDetails.isExistingMember){
       this.admissionNumberDropDown = true;
       this.getAllTypeOfMembershipDetails(this.pacsId,this.branchId);
       this.institutepromoterDetailsForm.get('surname').disable();
       this.institutepromoterDetailsForm.get('name').disable();
      //  this.institutepromoterDetailsForm.get('operatorTypeId').disable();
       this.institutepromoterDetailsForm.get('dob').disable();
       this.institutepromoterDetailsForm.get('age').disable();
       this.institutepromoterDetailsForm.get('genderId').disable();
       this.institutepromoterDetailsForm.get('martialId').disable();
       this.institutepromoterDetailsForm.get('mobileNumber').disable();
       this.institutepromoterDetailsForm.get('aadharNumber').disable();
       this.institutepromoterDetailsForm.get('emailId').disable();
       this.institutepromoterDetailsForm.get('startDate').disable();
       }
       else{
         this.admissionNumberDropDown = false;
         this.institutepromoterDetailsForm.get('surname').enable();
         this.institutepromoterDetailsForm.get('name').enable();
         this.institutepromoterDetailsForm.get('operatorTypeId').enable();
         this.institutepromoterDetailsForm.get('dob').enable();
         this.institutepromoterDetailsForm.get('age').enable();
         this.institutepromoterDetailsForm.get('genderId').enable();
         this.institutepromoterDetailsForm.get('martialId').enable();
         this.institutepromoterDetailsForm.get('mobileNumber').enable();
         this.institutepromoterDetailsForm.get('aadharNumber').enable();
         this.institutepromoterDetailsForm.get('emailId').enable();
         this.institutepromoterDetailsForm.get('startDate').enable();
        //  this.institutepromoterDetailsForm.get('admissionNumber').setValidators(null);
       }
       this.getAllOperatorType();
     }
     
     onRowEditSave() {
       this.addButton = true;
       this.buttonsFlag  = false;
       this.landFlag =false
       this.promoterDisplayFlag = true;
       this.cancleButtonFlag = false;
       this.EditDeleteDisable = true;
       this.institutePromoterDetails = new InstitutePromoterDetails();
       this.institutePromoterDetails.uniqueId = this.promoterDetails.length + 1
       this.institutepromoterDetailsForm.reset();
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
     rowData.status = applicationConstants.ACTIVE
    if(rowData.memDobVal != undefined && rowData.memDobVal != null)
       rowData.dob = this.commonFunctionsService.getUTCEpoch(new Date(rowData.memDobVal));
   
     if(rowData.startDateVal != undefined && rowData.startDateVal != null)
       rowData.startDate = this.commonFunctionsService.getUTCEpoch(new Date(rowData.startDateVal));
 
     if (this.ginstitutionBasicDetailsModel.id == null && this.ginstitutionBasicDetailsModel.id == undefined) {
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
         rowData.multipartFileListForPhotoCopy = this.fileUploadService.getFile(rowData.uploadSignature ,ERP_TRANSACTION_CONSTANTS.MEMBERSHIP + ERP_TRANSACTION_CONSTANTS.FILES + "/" + rowData.uploadSignature  );
       }
       this.addButton = false;
       this.EditDeleteDisable = false;
 
       if (!this.ginstitutionBasicDetailsModel.institutionPromoterList) {
         this.ginstitutionBasicDetailsModel.institutionPromoterList = []; // Initialize it as an empty array
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
         this.ginstitutionBasicDetailsModel.institutionPromoterList = this.promoterDetails;
       }else{
         this.promoterDetails.push(rowData);
         this.ginstitutionBasicDetailsModel.institutionPromoterList = this.promoterDetails;
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
     rowData.institutionId = this.ginstitutionBasicDetailsModel.id;
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
       this.institutionPromoterDetailsService.updateInstitutionPromoterDetails(rowData).subscribe((response: any) => {
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
         this.getMembershipInstitutionDetailsById(rowData.institutionId);
       },
         error => {
           this.commonComponent.stopSpinner();
           this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: this.responseModel.statusMsg }];
           setTimeout(() => {
             this.msgs = [];
           }, 2000);
         });
     } else {
       this.institutionPromoterDetailsService.addInstitutionPromoterDetails(rowData).subscribe((response: any) => {
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
         this.getMembershipInstitutionDetailsById(rowData.institutionId);
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
     this.ginstitutionBasicDetailsModel.admissionNumber =this.admissionNumber
   }
   
   generateAdmissionNumber(): string {
     // Generate a random 12-digit number
     const admissionNumber = Math.floor(100000000000 + Math.random() * 900000000000);
     return admissionNumber.toString();
   }
 
   fileUploader(event: any, fileUpload: FileUpload, filePathName: any) {
     this.isFileUploaded = applicationConstants.FALSE;
     this.multipleFilesList = [];
     if(this.isEdit && this.ginstitutionBasicDetailsModel.filesDTOList == null || this.ginstitutionBasicDetailsModel.filesDTOList == undefined){
       this.ginstitutionBasicDetailsModel.filesDTOList = [];
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
           this.ginstitutionBasicDetailsModel.multipartFileListForPhotoCopy = [];
           this.ginstitutionBasicDetailsModel.filesDTOList.push(files);
           this.ginstitutionBasicDetailsModel.resolutionCopyPath = null;
           this.ginstitutionBasicDetailsModel.filesDTOList[this.ginstitutionBasicDetailsModel.filesDTOList.length - 1].fileName = "Group_Resolution_Copy" + "_" + timeStamp + "_" + file.name;
           this.ginstitutionBasicDetailsModel.resolutionCopyPath = "Group_Resolution_Copy" + "_" + timeStamp + "_" + file.name; 
         }
         if (filePathName === "applicationCopyPath") {
           this.ginstitutionBasicDetailsModel.applicationCopyList = [];
           this.ginstitutionBasicDetailsModel.filesDTOList.push(files);
           this.ginstitutionBasicDetailsModel.applicationCopyPath = null;
           this.ginstitutionBasicDetailsModel.filesDTOList[this.ginstitutionBasicDetailsModel.filesDTOList.length - 1].fileName = "Group_Application_Copy" + "_" + timeStamp + "_" + file.name;
           this.ginstitutionBasicDetailsModel.applicationCopyPath = "Group_Application_Copy" + "_" + timeStamp + "_" + file.name; 
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
           rowData.uploadImage = "institution_Promoter_Photo_Copy" + "_" + timeStamp + "_" + file.name; 
         }
         if (filePathName === "signaturePath") {
           rowData.multipartFileListForPhotoCopy = [];
           rowData.filesDTOList.push(files);
           rowData.uploadSignature = null;
           rowData.filesDTOList[rowData.filesDTOList.length - 1].fileName = "Institution_Promoter_Signature_Copy" + "_" + timeStamp + "_" + file.name;
           rowData.uploadSignature = "Institution_Promoter_Signature_Copy" + "_" + timeStamp + "_" + file.name; 
         }
         
         this.updateData();
       }
       reader.readAsDataURL(file);
     }
   }
   fileRemoveEvent() {
     if (this.ginstitutionBasicDetailsModel.filesDTOList != null && this.ginstitutionBasicDetailsModel.filesDTOList != undefined && this.ginstitutionBasicDetailsModel.filesDTOList.length > 0) {
       let removeFileIndex = this.ginstitutionBasicDetailsModel.filesDTOList.findIndex((obj: any) => obj && obj.fileName === this.ginstitutionBasicDetailsModel.resolutionCopyPath);
       this.ginstitutionBasicDetailsModel.filesDTOList.splice(removeFileIndex, 1);
       this.ginstitutionBasicDetailsModel.resolutionCopyPath = null;
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
   if(this.ginstitutionBasicDetailsModel.admissionDateVal != undefined && this.ginstitutionBasicDetailsModel.registrationDateVal != undefined){
     if(this.ginstitutionBasicDetailsModel.admissionDateVal < this.ginstitutionBasicDetailsModel.registrationDateVal){
       this.instituteBasicDetailsForm.get('registrationDate')?.reset();
       this.instituteBasicDetailsForm.get('admissionDate')?.reset();
       this.instituteBasicDetailsForm.updateValueAndValidity();
       this.msgs = [{ severity: 'warn', detail: applicationConstants.REGISTRATION_DATE_SHOULD_LESSTHAN_ADMISSION_DATE }];
       setTimeout(() => {
         this.msgs = [];        
       }, 2000);
     }
   }
 }
   /**
    * @implements cancle prmoters
    * @author k.yamuna
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
         this.institutepromoterDetailsForm.get('admissionNumber').reset();
         this.institutepromoterDetailsForm.get('surname').enable();
         this.institutepromoterDetailsForm.get('name').enable();
         this.institutepromoterDetailsForm.get('operatorTypeId').enable();
         this.institutepromoterDetailsForm.get('dob').enable();
         this.institutepromoterDetailsForm.get('age').enable();
         this.institutepromoterDetailsForm.get('genderId').enable();
         this.institutepromoterDetailsForm.get('martialId').enable();
         this.institutepromoterDetailsForm.get('mobileNumber').enable();
         this.institutepromoterDetailsForm.get('aadharNumber').enable();
         this.institutepromoterDetailsForm.get('emailId').enable();
         this.institutepromoterDetailsForm.get('startDate').enable();
        //  this.institutepromoterDetailsForm.get('admissionNumber').setValidators(null);
     }
   }
     /**
    * @implements reset feilds 
    * @author k.yamuna
    */
     resetFields(){
       this.institutepromoterDetailsForm.get('surname').reset();
       this.institutepromoterDetailsForm.get('name').reset();
       this.institutepromoterDetailsForm.get('operatorTypeId').reset();
       this.institutepromoterDetailsForm.get('dob').reset();
       this.institutepromoterDetailsForm.get('age').reset();
       this.institutepromoterDetailsForm.get('genderId').reset();
       this.institutepromoterDetailsForm.get('martialId').reset();
       this.institutepromoterDetailsForm.get('mobileNumber').reset();
       this.institutepromoterDetailsForm.get('aadharNumber').reset();
       this.institutepromoterDetailsForm.get('emailId').reset();
       this.institutepromoterDetailsForm.get('startDate').reset();
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
               this.admissionNumbersList = this.allTypesOfmembershipList.filter((obj: any) => (obj != null) && obj.memberTypeName == MemberShipTypesData.INDIVIDUAL).map((relationType: any) => {
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
             this.institutePromoterDetails.name = this.memberBasicDetailsModel.name,
             this.institutePromoterDetails.surname = this.memberBasicDetailsModel.surname;
             this.institutePromoterDetails.aadharNumber = this.memberBasicDetailsModel.aadharNumber;
             this.institutePromoterDetails.dob = this.memberBasicDetailsModel.dob;
             if (this.institutePromoterDetails.dob != null && this.institutePromoterDetails.dob != undefined)
               this.institutePromoterDetails.memDobVal = this.datePipe.transform(this.institutePromoterDetails.dob, this.orgnizationSetting.datePipe);
             this.institutePromoterDetails.age = this.memberBasicDetailsModel.age;
             this.institutePromoterDetails.genderId = this.memberBasicDetailsModel.genderId;
             this.institutePromoterDetails.martialId = this.memberBasicDetailsModel.martialId;
             this.institutePromoterDetails.mobileNumber = this.memberBasicDetailsModel.mobileNumber;
             this.institutePromoterDetails.emailId = this.memberBasicDetailsModel.emailId;
             this.institutePromoterDetails.startDate = this.memberBasicDetailsModel.admissionDate;
             if (this.institutePromoterDetails.startDate != null && this.institutePromoterDetails.startDate != undefined)
               this.institutePromoterDetails.startDateVal = this.datePipe.transform(this.institutePromoterDetails.startDate, this.orgnizationSetting.datePipe);
            //  this.institutePromoterDetails.operatorTypeId = this.memberBasicDetailsModel.occupationId;
 
             this.institutepromoterDetailsForm.get('surname').disable();
             this.institutepromoterDetailsForm.get('name').disable();
            //  this.institutepromoterDetailsForm.get('operatorTypeId').disable();
             this.institutepromoterDetailsForm.get('dob').disable();
             this.institutepromoterDetailsForm.get('age').disable();
             this.institutepromoterDetailsForm.get('genderId').disable();
             this.institutepromoterDetailsForm.get('martialId').disable();
             this.institutepromoterDetailsForm.get('mobileNumber').disable();
             this.institutepromoterDetailsForm.get('aadharNumber').disable();
             this.institutepromoterDetailsForm.get('emailId').disable();
             this.institutepromoterDetailsForm.get('startDate').disable();
            //  this.institutepromoterDetailsForm.get('admissionNumber').setValidators(Validators.compose([Validators.required]));
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
      this.institutepromoterDetailsForm.get('age')?.reset();
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
 
