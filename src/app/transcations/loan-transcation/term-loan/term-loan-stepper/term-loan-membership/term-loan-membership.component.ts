import { Component, ViewChild } from '@angular/core';
import { applicationConstants } from 'src/app/shared/applicationConstants';
import { InstitutionPromoterDetailsModel, MemberGroupDetailsModel, MembershipBasicRequiredDetails, MembershipInstitutionDetailsModel, promoterDetailsModel } from '../term-loan-new-membership/shared/term-loan-new-membership.model';
import { TermApplication } from '../term-loan-application-details/shared/term-application.model';
import { Responsemodel } from 'src/app/shared/responsemodel';
import { TermLoanCommunication } from '../term-loans-communication/shared/term-loan-communication.model';
import { TermLoanKyc } from '../term-loans-kyc/shared/term-loan-kyc.model';
import { Table } from 'primeng/table';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { FileUploadService } from 'src/app/shared/file-upload.service';
import { CommonFunctionsService } from 'src/app/shared/commonfunction.service';
import { EncryptDecryptService } from 'src/app/shared/encrypt-decrypt.service';
import { TermLoanNewMembershipService } from '../term-loan-new-membership/shared/term-loan-new-membership.service';
import { TermLoanCommunicationService } from '../term-loans-communication/shared/term-loan-communication.service';
import { TermLoanKycService } from '../term-loans-kyc/shared/term-loan-kyc.service';
import { TermApplicationService } from '../term-loan-application-details/shared/term-application.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonComponent } from 'src/app/shared/common.component';
import { DatePipe } from '@angular/common';
import { ERP_TRANSACTION_CONSTANTS } from 'src/app/transcations/erp-transaction-constants';
import { FileUpload } from 'primeng/fileupload';
import { FileUploadModel } from 'src/app/layout/mainmenu/shared/file-upload-model.model';

@Component({
  selector: 'app-term-loan-membership',
  templateUrl: './term-loan-membership.component.html',
  styleUrls: ['./term-loan-membership.component.css']
})
export class TermLoanMembershipComponent {
  applicationList: any[] = [];
  accountList: any[] = [];
  genderList: any[] = [];
  maritalstatusList: any[] = [];
  
  membershipBasicRequiredDetails: MembershipBasicRequiredDetails = new MembershipBasicRequiredDetails();
  memberGroupDetailsModel: MemberGroupDetailsModel = new MemberGroupDetailsModel();
  membershipInstitutionDetailsModel: MembershipInstitutionDetailsModel = new MembershipInstitutionDetailsModel();
  promoterDetailsModel: promoterDetailsModel = new promoterDetailsModel();
  institutionPromoterDetailsModel: InstitutionPromoterDetailsModel = new InstitutionPromoterDetailsModel();
  termLoanApplicationModel: TermApplication = new TermApplication();
  termLoanCommunicationModel: TermLoanCommunication = new TermLoanCommunication();
  termLoanKycModel: TermLoanKyc = new TermLoanKyc();

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
  isDisableFlag: boolean = false;
  disableMemberType: boolean = false;
  promoterDetailsForm: any;
  institutionPromoter: any[] = [];
  addButton: boolean = false;
  EditDeleteDisable: boolean = false;
  newRow: any;
  promoterDetails: any[] = [];
  memberTypeId : any;
  msgs: any[] = [];
  operatorTypeList: any[] = [];
  admisionNumber: any;
  kycForm: any;
  sameAsPermanentAddress: boolean = false;
  statesList: any[] = [];
  districtsList: any[] = [];
  mandalsList: any[] = [];
  villageList: any[] = [];

  //member module fields
  allTypesOfmembershipList: any;
  pacsId: any;
  branchId: any;
  admissionNUmber: any;
  permenentAllTypesOfmembershipList: any;
  loanId: any;
  documentsData: any[] = [];
  uploadFlag: boolean = true;

  //kyc feilds
  kyc: any;
  accountType: any;
  applicationType: any;
  minBalence: any;
  accountOpeningDateVal: any;
  documentTypeList: any[] = [];
  kycModelList: any[] = [];
  adhaarFilesList: any[] = [];
  signFilesList: any[] = [];
  panFilesList: any[] = [];
  uploadFileData: any;
  isFileUploaded: boolean = false;
  columns: any[] = [];
  
  displayPosition: boolean = false;
  documentNameList: any[] = [];
  position: any;
  buttonDisabled: boolean = false;

  filesList: any[] = [];
  exerciseFileList: any[] = [];
  lastDot = applicationConstants.LAST_DOT;
  memberId: any;
  kycListByMemberId: any[] = [];
  typeFlag: boolean = false;
  addKycButton: boolean = false;
  addDocumentOfKycFalg: boolean = false;
  editDocumentOfKycFalg: boolean = false;
  veiwCardHide: boolean = false;

  @ViewChild('cv', { static: false })
  private cv!: Table;
  editIndex: any;
  afterEditCancleFalg: boolean = false;
  editButtonDisable: boolean = false;

  multipleFilesList: any[] = [];
  filesDTOList: any[] = [];
  productName: any;
  admissionNumber: any;
  memberName: any;
  mobileNumer: any;
  aadharNumber: any;
  qualificationName: any;
  panNumber: any;
  editFlag: any;
  kycDuplicate: boolean = false;
  
  
  constructor(private router: Router, 
    private formBuilder: FormBuilder,  private termLoanApplicationsService: TermApplicationService,
     private commonComponent: CommonComponent, private activateRoute: ActivatedRoute,
      private encryptDecryptService: EncryptDecryptService,
       private commonFunctionsService: CommonFunctionsService, 
       private datePipe: DatePipe, private termLoanCommunicationService: TermLoanCommunicationService,
       private membershipService: TermLoanNewMembershipService, private termLoanKycService: TermLoanKycService, 
        private fileUploadService : FileUploadService) {
    this.kycForm = this.formBuilder.group({
      'docNumber': ['', [Validators.required]],
      'docTypeName': ['', [Validators.required]],
      'nameAsPerDocument': new FormControl('', Validators.required),
      'fileUpload': new FormControl(''),
    });
  }
  
  ngOnInit(): void {
    this.kycModelList =[] ;
    this.pacsId = 1;
    this.branchId = 1;
    this.orgnizationSetting = this.commonComponent.orgnizationSettings()
    if (this.documentsData.length >= 1) {
      this.uploadFlag = true;
    }
    this.activateRoute.queryParams.subscribe(params => {
      if (params['id'] != undefined || params['admissionNo'] ) {
        this.commonComponent.startSpinner();
        
        if(params['admissionNo'] != undefined){
            this.admissionNumber = this.encryptDecryptService.decrypt(params['admissionNo']);
            if(this.admissionNumber != null && this.admissionNumber != undefined){
              this.getMemberDetailsByMemberId(this.admissionNumber);
              this.getGroupDetailsById(this.admissionNumber);
              this.getInstitutionDetailsById(this.admissionNumber);
          }
        }
        else {
          if(params['id'] != undefined){
            this.loanId = Number(this.encryptDecryptService.decrypt(params['id']));
              this.getTermApplicationByTermAccId(this.loanId );
          }
        }
        this.disableMemberType = true;
        this.isEdit = true;
      }
      else {
        let val = this.commonFunctionsService.getStorageValue(applicationConstants.B_CLASS_MEMBER_CREATION);
        this.updateData();
        if(!this.showForm){
          this.individualFlag = true;
        }
      }
    });
      this.kycForm.valueChanges.subscribe((data: any) => {
        this.updateData();
        if (this.kycForm.valid) {
          this.save();
        }
      });
      this.getAllKycTypes();
  }

  /**
   * @implements getsbAccountApplicationdetails By AccountId
   * @param id 
  
   */
  getTermApplicationByTermAccId(id: any) {
    this.termLoanApplicationsService.getTermApplicationByTermAccId(id).subscribe((data: any) => {
      this.responseModel = data;
      if (this.responseModel != null && this.responseModel != undefined) {
        if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
          if (this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
              if (this.responseModel.data != null && this.responseModel.data != undefined && this.responseModel.data.length > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
                this.admissionNumber = this.responseModel.data[0].admissionNo;
                this.memberTypeName = this.responseModel.data[0].memberTypeName;
                this.termLoanApplicationModel = this.responseModel.data[0];
                if(this.termLoanApplicationModel.termLoanKycDetailsDTOList != null &&  this.termLoanApplicationModel.termLoanKycDetailsDTOList != undefined && this.termLoanApplicationModel.termLoanKycDetailsDTOList.length>0 ){
                    this.kycModelList = this.termLoanApplicationModel.termLoanKycDetailsDTOList.filter((obj: any) => obj != null && obj.status == applicationConstants.ACTIVE);
                    for(let kyc of this.kycModelList){
                      kyc.multipartFileList = this.fileUploadService.getFile(kyc.kycFilePath ,ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.FILES + "/" + kyc.kycFilePath);
                      if(kyc.multipartFileList == null || kyc.multipartFileList == undefined || kyc.multipartFileList.length ==0){
                        kyc.multipartFileList = this.fileUploadService.getFile(kyc.kycFilePath ,ERP_TRANSACTION_CONSTANTS.MEMBERSHIP + ERP_TRANSACTION_CONSTANTS.FILES + "/" + kyc.kycFilePath);
                      }
                    }
                }
                this.updateData();
              }
            }
        }
        else{
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
  
 /**
  * @implements updateData To parent component'
 
  */
  updateData() {
    if(this.kycModelList != null && this.kycModelList != undefined && this.kycModelList.length > 0){
      this.kycDuplicate = this.kycModelDuplicateCheck(this.kycModelList);
      if(this.kycDuplicate){
        this.isDisableFlag = true;
      }
      else{
        this.isDisableFlag = false;
      }
    }else{
      this.isDisableFlag = true;
    }
    this.termLoanApplicationsService.changeData({
      formValid: !this.kycForm.valid ? true : false ,
      data: this.termLoanApplicationModel,
      isDisable: this.isDisableFlag,
      stepperIndex: 0,
    });
  }
  save() {
    this.updateData();
  }

 
 /**
 
  * @param admissionNumber 
  * @implements get institution Details From memember module by admission Number
  */
  getInstitutionDetailsById(admissionNumber: any) {
    this.kycModelList = [];
    this.membershipService.getMemberIstitutionByAdmissionNumber(admissionNumber).subscribe((data: any) => {
      this.responseModel = data;
      if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
        if (this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
            this.membershipInstitutionDetailsModel = this.responseModel.data[0];
            this.memberTypeName = this.membershipInstitutionDetailsModel.memberTypeName;
            this.termLoanApplicationModel.memberTypeName = this.membershipInstitutionDetailsModel.memberTypeName;
            this.termLoanApplicationModel.memberInstitutionDTO  = this.membershipInstitutionDetailsModel;
            if(this.membershipInstitutionDetailsModel.institutionKycDetailsDTOList != null && this.membershipInstitutionDetailsModel.institutionKycDetailsDTOList != undefined && this.membershipInstitutionDetailsModel.institutionKycDetailsDTOList.length > 0){
              this.kycModelList = this.membershipInstitutionDetailsModel.institutionKycDetailsDTOList.filter((obj: any) => obj != null && obj.status == applicationConstants.ACTIVE);
              this.kycModelDuplicateCheck(this.kycModelList);
              for(let kyc of this.kycModelList){
                this.termLoanKycModel.multipartFileList = this.fileUploadService.getFile(kyc.kycFilePath ,ERP_TRANSACTION_CONSTANTS.MEMBERSHIP + ERP_TRANSACTION_CONSTANTS.FILES + "/" + kyc.kycFilePath);
                // kyc.filesDTOList[0] = this.termLoanKycModel.multipartFileList;
              }
              this.termLoanApplicationModel.termLoanKycDetailsDTOList = this.membershipInstitutionDetailsModel.institutionKycDetailsDTOList;
            }
            if (this.membershipInstitutionDetailsModel.memberTypeId == null ||  this.membershipInstitutionDetailsModel.memberTypeId == undefined) {
              this.membershipInstitutionDetailsModel.memberTypeId = applicationConstants.INSTITUTION_MEMBER_TYPE_ID;
            }
            this.admissionNumber = this.membershipInstitutionDetailsModel.admissionNo;
            this.termLoanApplicationModel.memberTypeId = this.membershipInstitutionDetailsModel.memberTypeId;
            this.membershipInstitutionDetailsModel.isNewMember = this.showForm;
            this.termLoanApplicationModel.memberInstitutionDTO = this.membershipInstitutionDetailsModel;
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

  
  /**
  
   * @param admissionNUmber 
   * @implements get group details from member module
   */
  getGroupDetailsById(admissionNUmber: any) {
    this.kycModelList = [];
    this.membershipService.getMemberGroupByAdmissionNumber(admissionNUmber).subscribe((data: any) => {
      this.responseModel = data;
      if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
        if (this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
            this.memberGroupDetailsModel = this.responseModel.data[0];
            this.memberTypeName = this.responseModel.data[0].memberTypeName;

            if (this.memberGroupDetailsModel.name != null && this.memberGroupDetailsModel.name != undefined) {
              this.memberGroupDetailsModel.groupName = this.memberGroupDetailsModel.name;
            }
  
            if (this.memberGroupDetailsModel.registrationDate != null && this.memberGroupDetailsModel.registrationDate != undefined) {
              this.memberGroupDetailsModel.registrationDateVal = this.datePipe.transform(this.memberGroupDetailsModel.registrationDate, this.orgnizationSetting.datePipe);
            }
            if (this.memberGroupDetailsModel.admissionDate != null && this.memberGroupDetailsModel.admissionDate != undefined) {
              this.memberGroupDetailsModel.admissionDateVal = this.datePipe.transform(this.memberGroupDetailsModel.admissionDate, this.orgnizationSetting.datePipe);
            }
            if (this.memberGroupDetailsModel.memberTypeId == null ||  this.memberGroupDetailsModel.memberTypeId == undefined) {
              this.memberGroupDetailsModel.memberTypeId = applicationConstants.GROUP_MEMBER_TYPE_ID;
            }
            if(this.memberGroupDetailsModel.groupKycList != null && this.memberGroupDetailsModel.groupKycList != undefined){
              this.kycModelList = this.memberGroupDetailsModel.groupKycList.filter((obj: any) => obj != null && obj.status == applicationConstants.ACTIVE);
              this.kycModelDuplicateCheck(this.kycModelList);
              for(let kyc of this.kycModelList){
                this.termLoanKycModel.multipartFileList = this.fileUploadService.getFile(kyc.kycFilePath ,ERP_TRANSACTION_CONSTANTS.MEMBERSHIP + ERP_TRANSACTION_CONSTANTS.FILES + "/" + kyc.kycFilePath);
              }              
               this.termLoanApplicationModel.termLoanKycDetailsDTOList = this.memberGroupDetailsModel.groupKycList.filter((obj: any) => obj != null && obj.status == applicationConstants.ACTIVE);
            }
            this.admissionNumber = this.memberGroupDetailsModel.admissionNumber;
            this.memberGroupDetailsModel.isNewMember = this.showForm;
            this.termLoanApplicationModel.memberTypeName = this.memberGroupDetailsModel.memberTypeName;
            this.termLoanApplicationModel.memberName = this.memberGroupDetailsModel.groupName;
            this.termLoanApplicationModel.memberTypeId = this.memberGroupDetailsModel.memberTypeId;
            this.termLoanApplicationModel.memberGroupDetailsDTO  = this.memberGroupDetailsModel;
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

  
  
  /**
   * @implements member module data by member admission Number
   * @param admissionNumber 
  
   */
  getMemberDetailsByMemberId(admissionNumber: any) {
    this.kycModelList = [];
    this.membershipService.getMembershipBasicDetailsByAdmissionNumber(admissionNumber).subscribe((data: any) => {
      this.responseModel = data;
      if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
        if (this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
          this.membershipBasicRequiredDetails = this.responseModel.data[0];
          this.membershipBasicRequiredDetails.memberShipCommunicationDetailsDTOList = this.responseModel.data[0].memberShipCommunicationDetailsDTOList;
         
          if (this.membershipBasicRequiredDetails.dob != null && this.membershipBasicRequiredDetails.dob != undefined) {
            this.membershipBasicRequiredDetails.dobVal = this.datePipe.transform(this.membershipBasicRequiredDetails.dob, this.orgnizationSetting.datePipe);
          }
          if (this.membershipBasicRequiredDetails.admissionNumber != null && this.membershipBasicRequiredDetails.admissionNumber != undefined) {
            this.admissionNumber = this.membershipBasicRequiredDetails.admissionNumber;
          }
         
         
          if (this.membershipBasicRequiredDetails.admissionDate != null && this.membershipBasicRequiredDetails.admissionDate != undefined) {
            this.membershipBasicRequiredDetails.admissionDateVal = this.datePipe.transform(this.membershipBasicRequiredDetails.admissionDate, this.orgnizationSetting.datePipe);
          }
          if(this.membershipBasicRequiredDetails.memberShipCommunicationDetailsDTOList != null && this.membershipBasicRequiredDetails.memberShipCommunicationDetailsDTOList != undefined && this.membershipBasicRequiredDetails.memberShipCommunicationDetailsDTOList > 0 && this.membershipBasicRequiredDetails.memberShipCommunicationDetailsDTOList[0] != null && this.membershipBasicRequiredDetails.memberShipCommunicationDetailsDTOList[0] != undefined){
            this.termLoanCommunicationModel = this.membershipBasicRequiredDetails.memberShipCommunicationDetailsDTOList[0];
            this.termLoanApplicationModel.termLoanCommunicationDTO = this.membershipBasicRequiredDetails.memberShipCommunicationDetailsDTOList;
          }
          if (this.membershipBasicRequiredDetails.memberTypeId == null ||  this.membershipBasicRequiredDetails.memberTypeId == undefined) {
            this.membershipBasicRequiredDetails.memberTypeId = applicationConstants.INDIVIDUAL_MEMBER_TYPE_ID;
          }
          if (this.membershipBasicRequiredDetails.photoCopyPath != null && this.membershipBasicRequiredDetails.photoCopyPath != undefined) {
            this.membershipBasicRequiredDetails.filesDTOList = [];
            this.membershipBasicRequiredDetails.multipartFileListForPhotoCopy = this.fileUploadService.getFile(this.membershipBasicRequiredDetails.photoCopyPath ,ERP_TRANSACTION_CONSTANTS.MEMBERSHIP + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.membershipBasicRequiredDetails.photoCopyPath  );
          }
          if (this.membershipBasicRequiredDetails.signatureCopyPath != null && this.membershipBasicRequiredDetails.signatureCopyPath != undefined) {
            this.membershipBasicRequiredDetails.multipartFileListForsignatureCopyPath = this.fileUploadService.getFile(this.membershipBasicRequiredDetails.signatureCopyPath ,ERP_TRANSACTION_CONSTANTS.MEMBERSHIP + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.membershipBasicRequiredDetails.signatureCopyPath  );
          }
          if(this.membershipBasicRequiredDetails.memberShipKycDetailsDTOList != null && this.membershipBasicRequiredDetails.memberShipKycDetailsDTOList != undefined && this.membershipBasicRequiredDetails.memberShipKycDetailsDTOList.length > 0){
            this.kycModelList = this.membershipBasicRequiredDetails.memberShipKycDetailsDTOList.filter((obj: any) => obj != null && obj.status == applicationConstants.ACTIVE);
            this.kycModelDuplicateCheck(this.kycModelList);
           for(let kyc of this.kycModelList){
            kyc.multipartFileList = this.fileUploadService.getFile(kyc.kycFilePath ,ERP_TRANSACTION_CONSTANTS.MEMBERSHIP + ERP_TRANSACTION_CONSTANTS.FILES + "/" + kyc.kycFilePath);
            kyc.filesDTOList = [];
          }
            this.termLoanApplicationModel.termLoanKycDetailsDTOList = this.membershipBasicRequiredDetails.memberShipKycDetailsDTOList;
          }
          this.termLoanApplicationModel.memberTypeName = this.membershipBasicRequiredDetails.memberTypeName;
          this.membershipBasicRequiredDetails.isNewMember = this.showForm;
          this.termLoanApplicationModel.individualMemberDetailsDTO  = this.membershipBasicRequiredDetails;
          this.updateData();
          // this.savingCommuncationDetailsSet(this.membershipBasicRequiredDetails.memberShipCommunicationDetailsDTOList[0]);
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
   * @implements add kyc 
   * @param event 
  
   */
  addKyc(event: any) {
    this.getAllKycTypes();
    this.multipleFilesList = [];
    this.addDocumentOfKycFalg = !this.addDocumentOfKycFalg;
    this.buttonDisabled = true;
    this.editButtonDisable = true;
    this.termLoanKycModel = new TermLoanKyc;
    this.updateData();
  }
 
  
  /**
   * @implements get all kyc types  
  
   */
  getAllKycTypes() {
    this.termLoanKycService.getAllKYCTypes().subscribe((res: any) => {
      this.responseModel = res;
      if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
        this.documentNameList = this.responseModel.data.filter((kyc: any) => kyc.status == applicationConstants.ACTIVE).map((count: any) => {
          return { label: count.name, value: count.id }
        });
        let filteredObj = this.documentNameList.find((data: any) => null != data && data.value == this.termLoanKycModel.kycDocumentTypeId);
            if (filteredObj != null && undefined != filteredObj)
              this.termLoanKycModel.kycDocumentTypeName = filteredObj.label;
      }
    });
  }

  
  /**
   * @implements image uploader
   * @param event 
   * @param fileUpload 
  
   */
  imageUploader(event: any, fileUpload: FileUpload) {
    this.isFileUploaded = applicationConstants.FALSE;
    this.multipleFilesList = [];
    this.termLoanKycModel.filesDTOList = [];
    this.termLoanKycModel.multipartFileList =[];
    this.termLoanKycModel.kycFilePath = null;
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

        let index = this.multipleFilesList.findIndex(x => x.fileName == files.fileName);
        if (index === -1) {
          this.multipleFilesList.push(files);
          this.termLoanKycModel.filesDTOList.push(files); // Add to filesDTOList array
          this.termLoanKycModel.multipartFileList = this.termLoanKycModel.filesDTOList;
        }
        
        let timeStamp = this.commonComponent.getTimeStamp();
        this.termLoanKycModel.filesDTOList[0].fileName = "TERM_LOAN_KYC_" + this.loanId + "_" +timeStamp+ "_"+ file.name ;
        this.termLoanKycModel.kycFilePath = "TERM_LOAN_KYC_" + this.loanId + "_" +timeStamp+"_"+ file.name; // This will set the last file's name as docPath
        let index1 = event.files.findIndex((x: any) => x === file);
        this.addOrEditKycTempList(this.termLoanKycModel);
        fileUpload.remove(event, index1);
        fileUpload.clear();
      }
      reader.readAsDataURL(file);
    }
  }

/**
 * @implements delete kyc
 * @param rowData 

 */
  delete(rowData: any) {
    this.termLoanKycService.deleteTermLoanKYCDetails(rowData.id).subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
        this.kycModelList = this.responseModel.data;
          this.getAllKycsDetailsKycDetails(this.admissionNumber);
      }
    });
  }

  /**
   * @implements get all kyc from db details
   * @param admissionNumber 
   */
  getAllKycsDetailsKycDetails(admissionNumber: any) {
    this.kycModelList = [];
    this.termLoanKycService.getKycBytermAccId(admissionNumber).subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel != null && this.responseModel != undefined) {
        if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
          if (this.responseModel.data.length > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
            this.kycModelList = this.responseModel.data;
            if (this.kycModelList != null && this.kycModelList != undefined) {
              this.editDocumentOfKycFalg = true;
              for (let kyc of this.kycModelList) {
                let multipleFilesList = [];
                let file = new FileUploadModel();
                file.imageValue = ERP_TRANSACTION_CONSTANTS.DEMANDDEPOSITS + ERP_TRANSACTION_CONSTANTS.FILES + "/" + kyc.kycFilePath;
                let objects = kyc.kycFilePath.split('.');
                file.fileType = objects[objects.length - 1];
                let name = kyc.kycFilePath.replace(/ /g, "_");
                file.fileName = name
                multipleFilesList.push(file);
                kyc.multipartFileList = multipleFilesList;
              }
            }
          }
        }
      }
      // this.getSbAccountDetailsById(sbAccId);
    }, error => {
      this.commonComponent.stopSpinner();
      this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: applicationConstants.SERVER_DOWN_ERROR }];
      setTimeout(() => {
        this.msgs = [];
      }, 3000);
    });
  }
  
  /**
   * @implements cancle Kyc for edit
 
   */
  cancelKyc() {
    this.kycModelList = [];
    this.addKycButton = false;
    this.editButtonDisable = false;
    this.getAllKycsDetailsKycDetails(this.admissionNumber);
  }

   /**
   * @implements cancle Kyc for add
 
   */
  cancel() {
    this.addDocumentOfKycFalg = !this.addDocumentOfKycFalg;
    this.buttonDisabled = false;
    this.editButtonDisable = false;
    // this.getAllKycsDetailsKycDetails(this.admissionNumber);
    this.updateData();
  }
   /**
   * @implements onClick
 
   */
  onClick() {
    this.addDocumentOfKycFalg = true;
  }

  
  /**
   * @implements click on edit and populate data on form and save & next disable purpose
 
   * @param index
   * @param modelData
   */
  toggleEditForm(index: number, modelData: any): void {
    if (this.editIndex === index) {
      this.editIndex = index;
    } else {
      this.editIndex = index;
    }
    this.editButtonDisable = true;
    this.buttonDisabled = true;
    this.veiwCardHide = false;
    this.editDocumentOfKycFalg = false;
    this.addDocumentOfKycFalg = false;
    this.getAllKycTypes();
    this.addOrEditKycTempList(modelData);
    // this.getKycById(modelData.id);
    this.updateData();
  }

   /**
   * @implements edit cancle
  
   */
  editCancle() {
    // this.kycModelList = [];
    this.editDocumentOfKycFalg = true;
    this.buttonDisabled = false;
    this.editButtonDisable = false;
    // this.getAllKycsDetailsKycDetails(this.admissionNumber);
    this.updateData();
  }

  /**
  
   * @param row 
   * @implements save kyc details (append to kyc list)
   */
  editsave(row: any) {
    this.termLoanKycModel.termLoanApplicationId = this.loanId;
    this.termLoanKycModel.admissionNumber = this.admissionNumber;
    if(this.documentNameList != null && this.documentNameList != undefined && this.documentNameList.length > 0){
      let filteredObj = this.documentNameList.find((data: any) => null != data && this.termLoanKycModel.kycDocumentTypeId != null && data.value == this.termLoanKycModel.kycDocumentTypeId);
      if (filteredObj != null && undefined != filteredObj && filteredObj.label != null && filteredObj.label != undefined){
        this.termLoanKycModel.kycDocumentTypeName = filteredObj.label;
      }
    }
    this.editDocumentOfKycFalg = true;
    this.buttonDisabled = false;
    this.editButtonDisable = false;
    this.termLoanKycService.updateTermLoanKYCDetails(this.termLoanKycModel).subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
        // this.kycModelList = this.responseModel.data;
        this.msgs = [{ severity: 'success', summary: applicationConstants.STATUS_SUCCESS, detail: this.responseModel.statusMsg }];
          setTimeout(() => {
            this.msgs = [];
          }, 1200);
      }
      else {
        this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: this.responseModel.statusMsg }];
        setTimeout(() => {
          this.msgs = [];
        }, 3000);
      }
      this.addKycButton = false;
      this.buttonDisabled = false;
      this.updateData();
    }, error => {
      this.commonComponent.stopSpinner();
      this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: applicationConstants.SERVER_DOWN_ERROR }];
      setTimeout(() => {
        this.msgs = [];
      }, 3000);
    });

  }
  // editsave(row: any) {
  //   this.editDocumentOfKycFalg = true;
  //   this.buttonDisabled = false;
  //   this.editButtonDisable = false;
  //   this.editDocumentOfKycFalg = true;
  //   this.buttonDisabled = false;
  //   this.editButtonDisable = false;

  //   const existingIndex = this.kycModelList.findIndex(
  //   promoter => promoter.kycDocumentTypeId === row.kycDocumentTypeId);//finding the kyc obj in list for replace the updated data
  //   this.kycModelList[existingIndex]= null;
    
  //   row.kycFilePath = this.termLoanKycModel.kycFilePath ;
  //   row.multipartFileList = this.termLoanKycModel.multipartFileList;
  //   row.kycDocumentTypeId = this.termLoanKycModel.kycDocumentTypeId;
  //   row.kycDocumentTypeName = this.termLoanKycModel.kycDocumentTypeName;
  //   row.filesDTOList = this.termLoanKycModel.filesDTOList;
  //   this.kycModelList[existingIndex] = row;

  //   // this.kycModelList[existingIndex].push(row);

  //   this.addKycButton = false;
  //   this.buttonDisabled = false;
  // }

  /**
  
   * @param id
   * @implements jyothi.naidana 
   */
  getKycById(id: any) {
    this.kycModelList = [];
    this.termLoanKycService.getTermLoanKYCDetails(id).subscribe((data: any) => {
      this.responseModel = data;
      if (this.responseModel != null && this.responseModel != undefined) {
        if (this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
          if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
            if (this.responseModel.data.length > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
              this.termLoanKycModel = this.responseModel.data[0];
              if (this.termLoanKycModel.kycFilePath != undefined) {
                for(let kyc of this.kycModelList){
                  this.termLoanKycModel.multipartFileList = this.fileUploadService.getFile(kyc.kycFilePath ,ERP_TRANSACTION_CONSTANTS.MEMBERSHIP + ERP_TRANSACTION_CONSTANTS.FILES + "/" + kyc.kycFilePath);
                 }
              }
            }
          }
        }
      }
    });
  }

  /**
   * @implements add or edit kyc temp List
   * @param rowData 
   */
  addOrEditKycTempList(rowData : any){
    const kyc = this.kycModelList.findIndex(obj => obj && obj.kycDocumentTypeId === rowData.kycDocumentTypeId );
    if(this.termLoanKycModel.kycFilePath != null || this.termLoanKycModel.kycFilePath != undefined){
      rowData.kycFilePath = this.termLoanKycModel.kycFilePath;
      if(this.termLoanKycModel.multipartFileList != null && this.termLoanKycModel.multipartFileList != undefined && this.termLoanKycModel.multipartFileList.length >0){
        rowData.multipartFileList =  this.termLoanKycModel.multipartFileList;

      }
    }
    this.kycModelList[kyc] = rowData;
    // let kycObj = this.kycModelList.find(obj => obj && obj.kycDocumentTypeId === rowData.kycDocumentTypeId );
    this.termLoanKycModel = rowData;
  }

  /**
   * @implements duplicate kyc type
   * @param kycDocType 
   * @returns 
   */
  kycModelDuplicateCheck(kycDocType: any) {
    let filteredObj = this.documentNameList.find((data: any) => null != data && data.value == kycDocType);
    if (filteredObj != null && undefined != filteredObj)
        this.termLoanKycModel.kycDocumentTypeName = filteredObj.label;//Kyc Type Name Check

    //duplicate check
    let duplicate = false;
    const uniqueIds = new Set<number>();
    const duplicateIds = new Set<number>();
    if (this.kycModelList != null && this.kycModelList != undefined && this.kycModelList.length > 0) {
      for (let item of this.kycModelList) {
        if (item != null && item != undefined && item.kycDocumentTypeId != null && item.kycDocumentTypeId != undefined) {
          if (uniqueIds.has(item.kycDocumentTypeId)) {
            duplicateIds.add(item.kycDocumentTypeId);
          } else {
            uniqueIds.add(item.kycDocumentTypeId);
          }
        }
        if (duplicateIds.size > 0) {
          duplicate = true;
          this.kycForm.reset();
          this.msgs = [];
          this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: "duplicate Kyc Types" }];
          setTimeout(() => {
            this.msgs = [];
          }, 1500);
        }
      }
    }

    return duplicate;
  }
  
}
