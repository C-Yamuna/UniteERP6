import { Component } from '@angular/core';
import { Responsemodel } from 'src/app/shared/responsemodel';
import { MembershipBasicDetails, MembershipGroupDetails, MemInstitutionDetails } from './shared/membership-details.model';
import { CiLoanApplication } from '../ci-product-details/shared/ci-loan-application.model';
import { CiLoanKyc } from '../ci-kyc/shared/ci-kyc.model';
import { CiLoanCommunication } from '../ci-communication/shared/ci-communication.model';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { CommonComponent } from 'src/app/shared/common.component';
import { EncryptDecryptService } from 'src/app/shared/encrypt-decrypt.service';
import { CommonFunctionsService } from 'src/app/shared/commonfunction.service';
import { DatePipe } from '@angular/common';
import { FileUploadService } from 'src/app/shared/file-upload.service';
import { CiLoanApplicationService } from '../ci-product-details/shared/ci-loan-application.service';
import { CiKycService } from '../ci-kyc/shared/ci-kyc.service';
import { applicationConstants } from 'src/app/shared/applicationConstants';
import { ERP_TRANSACTION_CONSTANTS } from 'src/app/transcations/erp-transaction-constants';
import { MembershipDetailsService } from './shared/membership-details.service';
import { FileUpload } from 'primeng/fileupload';
import { FileUploadModel } from 'src/app/layout/mainmenu/shared/file-upload-model.model';

@Component({
  selector: 'app-ci-membership-details',
  templateUrl: './ci-membership-details.component.html',
  styleUrls: ['./ci-membership-details.component.css']
})
export class CiMembershipDetailsComponent {
  msgs: any[] = [];
  kycForm: any;
  pacsId: any;
  branchId: any;
  orgnizationSetting: any;
  documentsData: any[] = [];
  uploadFlag: boolean = true;
  ciLoanApplicationId: any;
  admissionNumber: any;
  disableMemberType: boolean = false;
  isEdit: boolean = false;
  showForm: Boolean = false;
  individualFlag: boolean = false;
  groupFlag: boolean = false;
  institutionFlag: boolean = false;
  responseModel!: Responsemodel;
  memberTypeName: any;
  memberTypeId: any;
  isDisableFlag: boolean = false;
  documentNameList: any[] = [];
  editIndex: any;
  isFileUploaded: boolean = false;
  uploadFileData: any;

  membershipBasicDetailsModel: MembershipBasicDetails = new MembershipBasicDetails();
  membershipGroupDetailsModel: MembershipGroupDetails = new MembershipGroupDetails();
  membershipInstitutionDetailsModel: MemInstitutionDetails = new MemInstitutionDetails();
  ciLoanApplicationModel: CiLoanApplication = new CiLoanApplication;
  ciLoanKycModel: CiLoanKyc = new CiLoanKyc();
  ciLoanCommunicationModel: CiLoanCommunication = new CiLoanCommunication();

  editButtonDisable: boolean = false;
  buttonDisabled: boolean = false;
  kycDuplicate: boolean = false;
  multipleFilesList:any[]=[];
  editDocumentOfKycFalg: boolean = false;
  ciLoanKycDetailsList: any[] = [];
  veiwCardHide: boolean = false;;



  constructor(private router: Router,
    private formBuilder: FormBuilder,
    private ciLoanApplicationService: CiLoanApplicationService,
    private commonComponent: CommonComponent,
    private activateRoute: ActivatedRoute,
    private encryptDecryptService: EncryptDecryptService,
    private commonFunctionsService: CommonFunctionsService,
    private datePipe: DatePipe,
    private fileUploadService : FileUploadService,
    private ciKycService:CiKycService,
    private membershipDetailsService: MembershipDetailsService) {
    this.kycForm = this.formBuilder.group({
      'documentNumber': new FormControl('', [Validators.required, Validators.pattern(/^[^\s]+(\s.*)?$/)]),
      'kycDocumentTypeName': new FormControl('', Validators.required),
      'nameAsPerDocument' : new FormControl('', Validators.required),
      'fileUpload': new FormControl('')
    });
  }

   //author bhargavi
   ngOnInit(): void {
    this.ciLoanKycDetailsList =[] ;
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
        }
        
      if(this.admissionNumber != null && this.admissionNumber != undefined){
          this.getMemberDetailsByAdmissionNumber(this.admissionNumber);
          this.getGroupDetailsByAdmissionNumber(this.admissionNumber);
          this.getInstitutionDetailsByAdmissionNumber(this.admissionNumber);
      }
      else {
        if(params['id'] != undefined){
          this.ciLoanApplicationId = Number(this.encryptDecryptService.decrypt(params['id']));
            this.getCiLoanApplicationsById(this.ciLoanApplicationId);
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
   * @implements getfdAccountApplicationdetails By AccountId
   * @param id 
   * @author bhargavi
   */
  getCiLoanApplicationsById(id:any) {
    this.ciLoanApplicationService.getLoanApplicationDetailsByLoanApplicationId(id).subscribe((data: any) => {
      this.responseModel = data;
      if (this.responseModel != null && this.responseModel != undefined) {
        if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
          if (this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
              if (this.responseModel.data != null && this.responseModel.data != undefined && this.responseModel.data.length > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
                this.admissionNumber = this.responseModel.data[0].adminssionNumber;
                this.memberTypeName = this.responseModel.data[0].memberTypeName;;
                this.ciLoanApplicationModel = this.responseModel.data[0];
                if(this.ciLoanApplicationModel.ciLoanKycDetailsList != null &&  this.ciLoanApplicationModel.ciLoanKycDetailsList != undefined && this.ciLoanApplicationModel.ciLoanKycDetailsList.length>0 ){
                    this.ciLoanKycDetailsList = this.ciLoanApplicationModel.ciLoanKycDetailsList;
                    for(let kyc of this.ciLoanKycDetailsList){
                        kyc.multipartFileList = this.fileUploadService.getFile(kyc.kycFilePath ,ERP_TRANSACTION_CONSTANTS.MEMBERSHIP + ERP_TRANSACTION_CONSTANTS.FILES + "/" + kyc.kycFilePath);
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
  * @author bhargavi
  */
  updateData() {
    if(this.ciLoanKycDetailsList != null && this.ciLoanKycDetailsList != undefined && this.ciLoanKycDetailsList.length > 0){
      this.kycDuplicate = this.ciLoanKycModelDuplicateCheck(this.ciLoanKycDetailsList);
      if(this.kycDuplicate){
        this.isDisableFlag = true;
      }
      else{
        this.isDisableFlag = false;
      }
    }else{
      this.isDisableFlag = true;
    }
    this.ciLoanApplicationService.changeData({
      formValid: !this.kycForm.valid ? true : false ,
      data: this.ciLoanApplicationModel,
      isDisable: this.isDisableFlag,
      stepperIndex: 0,
    });
  }
  save() {
    this.updateData();
  }

 
  //get member module institution details
  //author bhargavi
  getInstitutionDetailsByAdmissionNumber(admissionNumber: any) {
    this.ciLoanKycDetailsList = [];
    this.membershipDetailsService.getMemberIstitutionByAdmissionNumber(admissionNumber).subscribe((data: any) => {
      this.responseModel = data;
      if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
        if (this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
            this.membershipInstitutionDetailsModel = this.responseModel.data[0];
            this.memberTypeName = this.membershipInstitutionDetailsModel.memberTypeName;
            this.ciLoanApplicationModel.memberTypeName = this.membershipInstitutionDetailsModel.memberTypeName;
            this.ciLoanApplicationModel.memberInstitutionDTO  = this.membershipInstitutionDetailsModel;
            if(this.membershipInstitutionDetailsModel.institutionKycDetailsDTOList != null && this.membershipInstitutionDetailsModel.institutionKycDetailsDTOList != undefined && this.membershipInstitutionDetailsModel.institutionKycDetailsDTOList.length > 0){
              this.ciLoanKycDetailsList = this.membershipInstitutionDetailsModel.institutionKycDetailsDTOList;
              this.ciLoanKycModelDuplicateCheck(this.ciLoanKycDetailsList);
              for(let kyc of this.ciLoanKycDetailsList){
                kyc.multipartFileList = this.fileUploadService.getFile(kyc.kycFilePath ,ERP_TRANSACTION_CONSTANTS.MEMBERSHIP + ERP_TRANSACTION_CONSTANTS.FILES + "/" + kyc.kycFilePath);
              }
              this.ciLoanApplicationModel.ciLoanKycDetailsList = this.membershipGroupDetailsModel.groupKycList;
            }
            if (this.membershipInstitutionDetailsModel.memberTypeId == null ||  this.membershipInstitutionDetailsModel.memberTypeId == undefined) {
              this.membershipInstitutionDetailsModel.memberTypeId = applicationConstants.INSTITUTION_MEMBER_TYPE_ID;
            }
            this.admissionNumber = this.membershipInstitutionDetailsModel.admissionNumber;
            this.ciLoanApplicationModel.memberTypeId = this.membershipInstitutionDetailsModel.memberTypeId;
            this.membershipInstitutionDetailsModel.isNewMember = this.showForm;
            this.ciLoanApplicationModel.memberInstitutionDTO = this.membershipInstitutionDetailsModel;
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
  //get group details from member module
  //author bhargavi
  getGroupDetailsByAdmissionNumber(admissionNUmber: any) {
    this.ciLoanKycDetailsList = [];
    this.membershipDetailsService.getMemberGroupByAdmissionNumber(admissionNUmber).subscribe((data: any) => {
      this.responseModel = data;
      if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
        if (this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
            this.membershipGroupDetailsModel = this.responseModel.data[0];
            this.memberTypeName = this.responseModel.data[0].memberTypeName;
            if (this.membershipGroupDetailsModel.registrationDate != null && this.membershipGroupDetailsModel.registrationDate != undefined) {
              this.membershipGroupDetailsModel.registrationDate = this.datePipe.transform(this.membershipGroupDetailsModel.registrationDate, this.orgnizationSetting.datePipe);
            }
            if (this.membershipGroupDetailsModel.admissionDate != null && this.membershipGroupDetailsModel.admissionDate != undefined) {
              this.membershipGroupDetailsModel.admissionDate = this.datePipe.transform(this.membershipGroupDetailsModel.admissionDate, this.orgnizationSetting.datePipe);
            }
            if (this.membershipGroupDetailsModel.memberTypeId == null ||  this.membershipGroupDetailsModel.memberTypeId == undefined) {
              this.membershipGroupDetailsModel.memberTypeId = applicationConstants.GROUP_MEMBER_TYPE_ID;
            }
            if(this.membershipGroupDetailsModel.groupKycList != null && this.membershipGroupDetailsModel. groupKycList != undefined){
              this.ciLoanKycDetailsList = this.membershipGroupDetailsModel. groupKycList;
              for(let kyc of this.ciLoanKycDetailsList){
                kyc.multipartFileList = this.fileUploadService.getFile(kyc.kycFilePath ,ERP_TRANSACTION_CONSTANTS.MEMBERSHIP + ERP_TRANSACTION_CONSTANTS.FILES + "/" + kyc.kycFilePath);
              }              
               this.ciLoanApplicationModel.ciLoanKycDetailsList = this.membershipGroupDetailsModel. groupKycList;
            }
            this.admissionNumber = this.membershipGroupDetailsModel.admissionNumber;
            this.membershipGroupDetailsModel.isNewMember = this.showForm;
            this.ciLoanApplicationModel.memberTypeName = this.membershipGroupDetailsModel.memberTypeName;
            this.ciLoanApplicationModel.memberTypeId = this.membershipGroupDetailsModel.memberTypeId;
            this.ciLoanApplicationModel.memberGroupDetailsDTO = this.membershipGroupDetailsModel;
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

  
  //member module data by member admission Number
  getMemberDetailsByAdmissionNumber(admissionNumber: any) {
    this.ciLoanKycDetailsList = [];
    this.membershipDetailsService.getMembershipBasicDetailsByAdmissionNumber(admissionNumber).subscribe((data: any) => {
      this.responseModel = data;
      if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
        if (this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
          this.membershipBasicDetailsModel = this.responseModel.data[0];
          this.membershipBasicDetailsModel.ciLoanCommunicationDTOList = this.responseModel.data[0].ciLoanCommunicationDTOList;
         
          if (this.membershipBasicDetailsModel.dob != null && this.membershipBasicDetailsModel.dob != undefined) {
            this.membershipBasicDetailsModel.dob = this.datePipe.transform(this.membershipBasicDetailsModel.dob, this.orgnizationSetting.datePipe);
          }
          if (this.membershipBasicDetailsModel.admissionNumber != null && this.membershipBasicDetailsModel.admissionNumber != undefined) {
            this.admissionNumber = this.membershipBasicDetailsModel.admissionNumber;
          }
          if (this.membershipBasicDetailsModel.admissionDate != null && this.membershipBasicDetailsModel.admissionDate != undefined) {
            this.membershipBasicDetailsModel.admissionDate = this.datePipe.transform(this.membershipBasicDetailsModel.admissionDate, this.orgnizationSetting.datePipe);
          }
          if(this.membershipBasicDetailsModel.ciLoanCommunicationDTOList!= null && this.membershipBasicDetailsModel. ciLoanCommunicationDTOList != undefined){
            this.ciLoanCommunicationModel = this.membershipBasicDetailsModel. ciLoanCommunicationDTOList;
            this.ciLoanApplicationModel.ciLoanCommunicationDTOList = this.membershipBasicDetailsModel.ciLoanCommunicationDTOList;
          }
          if (this.membershipBasicDetailsModel.memberTypeId == null ||  this.membershipBasicDetailsModel.memberTypeId == undefined) {
            this.membershipBasicDetailsModel.memberTypeId = applicationConstants.INDIVIDUAL_MEMBER_TYPE_ID;
          }
          if (this.membershipBasicDetailsModel.photoCopyPath != null && this.membershipBasicDetailsModel.photoCopyPath != undefined) {
            this.membershipBasicDetailsModel.multipartFileListForPhotoCopy = this.fileUploadService.getFile(this.membershipBasicDetailsModel.photoCopyPath ,ERP_TRANSACTION_CONSTANTS.MEMBERSHIP + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.membershipBasicDetailsModel.photoCopyPath  );
          }
          if (this.membershipBasicDetailsModel.signatureCopyPath != null && this.membershipBasicDetailsModel.signatureCopyPath != undefined) {
            this.membershipBasicDetailsModel.multipartFileListForsignatureCopyPath = this.fileUploadService.getFile(this.membershipBasicDetailsModel.signatureCopyPath ,ERP_TRANSACTION_CONSTANTS.MEMBERSHIP + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.membershipBasicDetailsModel.signatureCopyPath  );
          }
          if(this.membershipBasicDetailsModel.memberShipKycDetailsDTOList != null && this.membershipBasicDetailsModel.memberShipKycDetailsDTOList != undefined && this.membershipBasicDetailsModel.memberShipKycDetailsDTOList.length > 0){
            this.ciLoanKycDetailsList = this.membershipBasicDetailsModel.memberShipKycDetailsDTOList;
           this.ciLoanKycDetailsList  = this.ciLoanKycDetailsList.filter(obj => null != obj && null !=obj.status && obj.status === applicationConstants.ACTIVE ).map((kyc:any)=>{
            kyc.multipartFileList = this.fileUploadService.getFile(kyc.kycFilePath ,ERP_TRANSACTION_CONSTANTS.MEMBERSHIP + ERP_TRANSACTION_CONSTANTS.FILES + "/" + kyc.kycFilePath);
            return kyc;
          });
            this.ciLoanApplicationModel.ciLoanKycDetailsList = this.membershipBasicDetailsModel.memberShipKycDetailsDTOList;
          }
          this.ciLoanApplicationModel.memberTypeName = this.membershipBasicDetailsModel.memberTypeName;
          this.membershipBasicDetailsModel.isNewMember = this.showForm;
          this.ciLoanApplicationModel.individualMemberDetailsDTO  = this.membershipBasicDetailsModel;
          this.updateData();
          // this.savingCommuncationDetailsSet(this.membershipBasicDetailsModel. ciLoanCommunicationDTOList[0]);
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

  //get all kyc types 
  //@bhargavi
  getAllKycTypes() {
    this.ciKycService.getAllKycTypes().subscribe((res: any) => {
      this.responseModel = res;
      if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
        this.documentNameList = this.responseModel.data.filter((kyc: any) => kyc.status == applicationConstants.ACTIVE).map((count: any) => {
          return { label: count.name, value: count.id }
        });
        let filteredObj = this.documentNameList.find((data: any) => null != data && data.value == this. ciLoanKycModel.kycDocumentTypeId);
            if (filteredObj != null && undefined != filteredObj)
              this. ciLoanKycModel.kycDocumentTypeName = filteredObj.label;
      }
    });
  }

  OnChangeMemberType(documentTypeId :any){
    if(this.documentNameList != null && this.documentNameList != undefined && this.documentNameList.length > 0){
    let filteredObj = this.documentNameList.find((data: any) => null != data && data.value == documentTypeId);
    if (filteredObj != null && undefined != filteredObj && filteredObj.label != null && filteredObj.label != undefined){
          this. ciLoanKycModel.kycDocumentTypeName = filteredObj.label;
    }
  }
  if(this.ciLoanKycDetailsList != null && this.ciLoanKycDetailsList != undefined && this.ciLoanKycDetailsList.length > 0){
    this.kycDuplicate = this.ciLoanKycModelDuplicateCheck(this.ciLoanKycDetailsList);
  }
    this.updateData();
  }
  //image upload and document path save
  //@bhargavi
  imageUploader(event: any, fileUpload: FileUpload) {
    this.isFileUploaded = applicationConstants.FALSE;
    this.multipleFilesList = [];
    this.ciLoanKycModel.filesDTOList = [];
    this.ciLoanKycModel.kycFilePath = null;
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
          this.ciLoanKycModel.filesDTOList.push(files); // Add to filesDTOList array
        }
        let timeStamp = this.commonComponent.getTimeStamp();
        this.ciLoanKycModel.filesDTOList[0].fileName = "CI_KYC_" + this.ciLoanApplicationId + "_" +timeStamp+ "_"+ file.name ;
        this.ciLoanKycModel.kycFilePath = "CI_KYC_" + this.ciLoanApplicationId + "_" +timeStamp+"_"+ file.name; // This will set the last file's name as kycFilePath
        let index1 = event.files.findIndex((x: any) => x === file);
        fileUpload.remove(event, index1);
        fileUpload.clear();
      }
      reader.readAsDataURL(file);
    }
  }

  fileRemoveEvent() {
    this.ciLoanKycModel.multipartFileList = [];
    if (this.ciLoanKycModel.filesDTOList != null && this.ciLoanKycModel.filesDTOList != undefined) {
      this.ciLoanKycModel.kycFilePath = null;
      this.ciLoanKycModel.filesDTOList = null;
    }
  }

//delete kyc 
  // @bhargavi
  delete(rowData: any) {
    this.ciKycService.deleteCiLoanKycDetails(rowData.id).subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
        this.ciLoanKycDetailsList = this.responseModel.data;
          this.getAllKycsDetailsCiKycDetails(this.admissionNumber);
      }
    });
  }

  //get all kyc details by fd acc id
  // @bhargavi
  getAllKycsDetailsCiKycDetails(admissionNumber: any) {
    this.ciLoanKycDetailsList = [];
    this.ciKycService.getCiLoanKycDetailsByAdmissionNumber(admissionNumber).subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel != null && this.responseModel != undefined) {
        if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
          if (this.responseModel.data.length > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
            this.ciLoanKycDetailsList = this.responseModel.data;

            if(this.ciLoanKycModel.kycFilePath != null && this.ciLoanKycModel.kycFilePath != undefined){
              this.ciLoanKycModel.multipartFileList = this.fileUploadService.getFile(this.ciLoanKycModel.kycFilePath ,ERP_TRANSACTION_CONSTANTS.MEMBERSHIP + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.ciLoanKycModel.kycFilePath);
  
            }
            if (this.ciLoanKycDetailsList != null && this.ciLoanKycDetailsList != undefined) {
              this.editDocumentOfKycFalg = true;
              for (let kyc of this.ciLoanKycDetailsList) {
                let multipleFilesList = [];
                let file = new FileUploadModel();
                file.imageValue = ERP_TRANSACTION_CONSTANTS.TERMDEPOSITS + ERP_TRANSACTION_CONSTANTS.FILES + "/" + kyc.kycFilePath;
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
      // this.getSbAccountDetailsById(ciLoanApplicationId);
    }, error => {
      this.commonComponent.stopSpinner();
      this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: applicationConstants.SERVER_DOWN_ERROR }];
      setTimeout(() => {
        this.msgs = [];
      }, 3000);
    });
  }
  
  //add kyc cancle
  // @bhargavi
  cancelKyc() {
    this.ciLoanKycDetailsList = [];
    // this.addKycButton = false;
    this.editButtonDisable = false;
    this.getAllKycsDetailsCiKycDetails(this.admissionNumber);
  }

   //add cancle 
  // @bhargavi
  cancel() {
    this.buttonDisabled = false;
    this.editButtonDisable = false;
    this.updateData();
  }
  //click on edit and populate data on form and save & next disable purpose
  // @bhargavi
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
    this.getAllKycTypes();
    this.addOrEditKycTempList(modelData);
    this.updateData();
  }
  //edit cancle
  // @bhargavi
  editCancle() {
    this.editDocumentOfKycFalg = true;
    this.buttonDisabled = false;
    this.editButtonDisable = false;
    this.updateData();
  }
 
  editsave(row: any) {
      this.ciLoanKycModel.ciLoanApplicationId = this.ciLoanApplicationId;
      this.ciLoanKycModel.admissionNumber = this.admissionNumber;
      this.ciLoanKycModel.memberTypeName = this.memberTypeName;
      this.ciLoanKycModel.memberType = this.memberTypeId;
      // this.ciLoanKycModel.memberId = this.m;
      if (this.documentNameList != null && this.documentNameList != undefined && this.documentNameList.length > 0) {
        let filteredObj = this.documentNameList.find((data: any) => null != data && this.ciLoanKycModel.kycDocumentTypeId != null && data.value == this.ciLoanKycModel.kycDocumentTypeId);
        if (filteredObj != null && undefined != filteredObj && filteredObj.label != null && filteredObj.label != undefined) {
          this.ciLoanKycModel.kycDocumentTypeName = filteredObj.label;
        }
      }
      this.editDocumentOfKycFalg = true;
      this.buttonDisabled = false;
      this.editButtonDisable = false;
      this.ciKycService.updateCiLoanKycDetails(this.ciLoanKycModel).subscribe((response: any) => {
        this.responseModel = response;
        if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
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
        // this.addKycButton = false;
        this.buttonDisabled = false;
        if(this.ciLoanApplicationId != null && this.ciLoanApplicationId != undefined)
        {
          this.getCiLoanApplicationsById(this.ciLoanApplicationId);

        }
        this.updateData();
      }, error => {
        this.commonComponent.stopSpinner();
        this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: applicationConstants.SERVER_DOWN_ERROR }];
        setTimeout(() => {
          this.msgs = [];
        }, 3000);
      });
    // }
    
  }

  //get kyc details by kyc id for edit purpose
  // @bhargavi
  getKycById(id: any) {
    this.ciLoanKycDetailsList = [];
    this.ciKycService.getKycDetailsByCiLoanApplicationId(id).subscribe((data: any) => {
      this.responseModel = data;
      if (this.responseModel != null && this.responseModel != undefined) {
        if (this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
          if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
            if (this.responseModel.data.length > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
              this. ciLoanKycModel = this.responseModel.data[0];
              if (this. ciLoanKycModel.kycFilePath != undefined) {
                for(let kyc of this.ciLoanKycDetailsList){
                  this. ciLoanKycModel.multipartFileList = this.fileUploadService.getFile(kyc.kycFilePath ,ERP_TRANSACTION_CONSTANTS.MEMBERSHIP + ERP_TRANSACTION_CONSTANTS.FILES + "/" + kyc.kycFilePath);
                 }
              }
            }
          }
        }
      }
    });
  }

  addOrEditKycTempList(rowData : any){
    const kyc = this.ciLoanKycDetailsList.find(obj => obj && obj.kycDocumentTypeId === rowData.kycDocumentTypeId );
    this. ciLoanKycModel = kyc;
  }

  ciLoanKycModelDuplicateCheck(ciLoanKycDetailsList: any) {
    let duplicate = false;
    const uniqueIds = new Set<number>();
    const duplicateIds = new Set<number>();
    if (this.ciLoanKycDetailsList != null && this.ciLoanKycDetailsList != undefined && this.ciLoanKycDetailsList.length > 0) {
      for (let item of this.ciLoanKycDetailsList) {
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
