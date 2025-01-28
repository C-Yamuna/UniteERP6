import { Component } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Responsemodel } from 'src/app/shared/responsemodel';
import { MembershipBasicDetails, MembershipGroupDetails, MemInstitutionDetails } from '../ci-membership-details/shared/membership-details.model';
import { CiLoanApplication } from '../ci-product-details/shared/ci-loan-application.model';
import { CiLoanKyc } from './shared/ci-kyc.model';
import { CommonComponent } from 'src/app/shared/common.component';
import { FileUploadService } from 'src/app/shared/file-upload.service';
import { EncryptDecryptService } from 'src/app/shared/encrypt-decrypt.service';
import { CommonFunctionsService } from 'src/app/shared/commonfunction.service';
import { DatePipe } from '@angular/common';
import { applicationConstants } from 'src/app/shared/applicationConstants';
import { FileUpload } from 'primeng/fileupload';
import { FileUploadModel } from 'src/app/layout/mainmenu/shared/file-upload-model.model';
import { CiLoanApplicationService } from '../ci-product-details/shared/ci-loan-application.service';
import { CiKycService } from './shared/ci-kyc.service';
import { MembershipDetailsService } from '../ci-membership-details/shared/membership-details.service';
import { ERP_TRANSACTION_CONSTANTS } from 'src/app/transcations/erp-transaction-constants';

@Component({
  selector: 'app-ci-kyc',
  templateUrl: './ci-kyc.component.html',
  styleUrls: ['./ci-kyc.component.css']
})
export class CiKycComponent {
  kycForm: FormGroup;
  responseModel!: Responsemodel;
  orgnizationSetting:any;
  accountId:any;
  isEdit:Boolean = false;
  msgs: any[] = [];
  kycModelList: any[] = [];
  isKycEdit:Boolean = false;
  addButtonDisabled:boolean = false;
  admissionNumber:any;
  multipartFileList: any[] = [];
  uploadFileData: any;
  documentNameList: any[] = [];
  editDocIndex:any;
  addNewKycDoc:Boolean = false;
  memberTypeName: any;
  ciLoanApplicationId: any;
  memberTypeId: any;
  isMemberCreation: any;
  documentsData: any[] = [];
  uploadFlag: boolean = true;
  createLoan: any;
  buttonDisabled: boolean = false;
  editDocumentOfKycFalg: boolean = false;
  noKYCData: boolean = false;
  isFileUploaded: boolean = false;
  displayDialog: boolean = false;
  deleteId: any;
  addKycButton: boolean = false;
  addDocumentOfKycFalg: boolean = false;
  editButtonDisable: boolean = false;
  veiwCardHide: boolean = false;
  editIndex: any;
  showForm: any;
  memberId: any;
  institutionPromoter: any[]= [];
  individualFlag : boolean = false;
  groupFlag : boolean = false;
  institutionFlag : boolean = false;

  membershipBasicDetailsModel: MembershipBasicDetails = new MembershipBasicDetails();
  membershipGroupDetailsModel: MembershipGroupDetails = new MembershipGroupDetails();
  membershipInstitutionDetailsModel: MemInstitutionDetails = new MemInstitutionDetails();
  ciLoanApplicationModel: CiLoanApplication = new CiLoanApplication;
  ciLoanKycModel: CiLoanKyc = new CiLoanKyc();



  constructor(private router: Router, 
    private formBuilder: FormBuilder, 
    private ciLoanApplicationService: CiLoanApplicationService,
    private ciKycService: CiKycService, 
    private membershipDetailsService: MembershipDetailsService,
    private commonComponent: CommonComponent,
     private activateRoute: ActivatedRoute, 
     private encryptDecryptService: EncryptDecryptService,
     private fileUploadService : FileUploadService,
     private commonFunctionsService: CommonFunctionsService, 
     private datePipe: DatePipe) {
    this.kycForm = this.formBuilder.group({
      'documentNumber': new FormControl('', [Validators.required, Validators.pattern(/^[^\s]+(\s.*)?$/)]),
      'kycDocumentTypeName': new FormControl('', Validators.required),
      // 'nameAsPerDocument' : new FormControl('', Validators.required),
      'kycFilePath': new FormControl(''),
    });
  }

  
  ngOnInit(): void {
    this.orgnizationSetting = this.commonComponent.orgnizationSettings();
    this.showForm = this.commonFunctionsService.getStorageValue(applicationConstants.B_CLASS_MEMBER_CREATION);
    if (this.documentsData.length >= 1) {
      this.uploadFlag = true;
    }
    this.activateRoute.queryParams.subscribe(params => {
      if (params['id'] != undefined ) {
        let queryParams = this.encryptDecryptService.decrypt(params['id']);
        this.ciLoanApplicationId = Number(queryParams);
        this.getLoanApplicationDetailsById(this.ciLoanApplicationId);
        this.isEdit = true;
        
      } else {
        this.isEdit = false;
      }
    });
    this.buttonDisabled = false;
    this.getAllKycTypes();
    this.updateData();
  }
  
  //get all kyc types 
  //@Bhargavi
  getAllKycTypes() {
    this.ciKycService.getAllKycTypes().subscribe((res: any) => {
      this.responseModel = res;
      if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
        this.documentNameList = this.responseModel.data.filter((kyc: any) => kyc.status == applicationConstants.ACTIVE).map((count: any) => {
          return { label: count.name, value: count.id }
        });
        let filteredObj = this.documentNameList.find((data: any) => null != data && this.ciLoanKycModel.kycDocumentTypeId != null && data.value == this.ciLoanKycModel.kycDocumentTypeId);
            if (filteredObj != null && undefined != filteredObj)
              this.ciLoanKycModel.kycDocumentTypeName = filteredObj.label;
      }
    });
  }

 
//image upload and document path save
//@Bhargavi
  imageUploader(event: any, fileUpload: FileUpload) {
    this.isFileUploaded = applicationConstants.FALSE;
    this.multipartFileList = [];
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
        let index = this.multipartFileList.findIndex(x => x.fileName == files.fileName);
        if (index === -1) {
          this.multipartFileList.push(files);
          this.ciLoanKycModel.filesDTOList.push(files); // Add to filesDTOList array
        }
        let timeStamp = this.commonComponent.getTimeStamp();
        this.ciLoanKycModel.filesDTOList[0].fileName = "CI_LOAN_KYC_" + this.ciLoanApplicationId + "_" +timeStamp+ "_"+ file.name ;
        this.ciLoanKycModel.kycFilePath = "CI_LOAN_KYC_" + this.ciLoanApplicationId + "_" +timeStamp+"_"+ file.name; // This will set the last file's name as docPath
        let index1 = event.files.findIndex((x: any) => x === file);
        fileUpload.remove(event, index1);
        fileUpload.clear();
      }
      reader.readAsDataURL(file);
    }
  }

  //update save
  // @Bhargavi
  save() {
    this.updateData();
  }
  //update data to main stepper component
  // @Bhargavi
  updateData() {
    this.ciLoanKycModel.ciLoanApplicationId = this.ciLoanApplicationId;
    this.ciLoanKycModel.admissionNumber = this.admissionNumber;
    this.ciLoanKycModel.memberTypeName  = this.memberTypeName;
    this.ciLoanKycModel.memberType  = this.memberTypeId;
    this.ciLoanKycModel.memberId  = this.memberId;
    this.ciLoanApplicationService.changeData({
      formValid: !this.kycForm.valid ? true : false,
      data: this.ciLoanKycModel,
      isDisable: this.buttonDisabled,
      stepperIndex: 1,
    });
  }

  //delete kyc 
  // @Bhargavi
  delete(rowDataId: any) {
    this.ciKycService.deleteCiLoanKycDetails(rowDataId).subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
        this.kycModelList = this.responseModel.data;
          this.getAllKycsDetailsRdKycDetails(this.ciLoanApplicationId);
          this.commonComponent.stopSpinner();
        this.msgs = [{ severity: 'success', summary: applicationConstants.STATUS_SUCCESS, detail: this.responseModel.statusMsg }];
        setTimeout(() => {
          this.msgs = [];
        }, 3000);
      }
      else{
        this.commonComponent.stopSpinner();
        this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_SUCCESS, detail: this.responseModel.statusMsg }];
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

  //get all kyc details by rd acc id
  // @Bhargavi
  getAllKycsDetailsRdKycDetails(id: any) {
    this.ciKycService.getKycDetailsByCiLoanApplicationId(id).subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel != null && this.responseModel != undefined) {
        if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
          if (this.responseModel.data.length > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
            this.kycModelList = this.responseModel.data;
            if (this.kycModelList != null && this.kycModelList != undefined) {
              this.editDocumentOfKycFalg = true;
              for (let kyc of this.kycModelList) {
                  if(kyc.kycFilePath != null && kyc.kycFilePath != undefined){
                    kyc.multipartFileList = this.fileUploadService.getFile(kyc.kycFilePath ,ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.FILES + "/" + kyc.kycFilePath);
                  }
              }
              this.buttonDisabled = false;
              this.updateData();
            }
          }
          else{
            this.addDocumentOfKycFalg = true;
            this.buttonDisabled = true;
            this.updateData();
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

  //add save
  // @Bhargavi
  saveKyc(row: any) {
    this.ciLoanKycModel.ciLoanApplicationId = this.ciLoanApplicationId;
    this.ciLoanKycModel.admissionNumber = this.admissionNumber;
    this.ciLoanKycModel.memberTypeName  = this.memberTypeName;
    this.ciLoanKycModel.memberType  = this.memberTypeId;
    this.ciLoanKycModel.memberId  = this.memberId;
    if(this.documentNameList != null && this.documentNameList != undefined && this.documentNameList.length > 0){
      let filteredObj = this.documentNameList.find((data: any) => null != data && this.ciLoanKycModel.kycDocumentTypeId != null && data.value == this.ciLoanKycModel.kycDocumentTypeId);
      if (filteredObj != null && undefined != filteredObj && filteredObj.label != null && filteredObj.label != undefined){
        this.ciLoanKycModel.kycDocumentTypeName = filteredObj.label;
      }
    }
    this.ciLoanKycModel.status  = applicationConstants.ACTIVE;
    this.ciKycService.addCiLoanKycDetails(this.ciLoanKycModel).subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
        this.ciLoanKycModel = this.responseModel.data[0];
        this.msgs = [{ severity: 'success', summary: applicationConstants.STATUS_SUCCESS, detail: this.responseModel.statusMsg }];
        setTimeout(() => {
          this.msgs = [];
        }, 1200);
      }else {
        this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: this.responseModel.statusMsg }];
        setTimeout(() => {
          this.msgs = [];
        }, 3000);
      }
      this.addKycButton = false;
      this.buttonDisabled = false;
      this.getAllKycsDetailsRdKycDetails(this.ciLoanApplicationId);
    }, error => {
      this.commonComponent.stopSpinner();
      this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: applicationConstants.SERVER_DOWN_ERROR }];
      setTimeout(() => {
        this.msgs = [];
      }, 3000);
    });
    this.addDocumentOfKycFalg = false;
    this.editButtonDisable = false;
  }
  //add kyc cancle
  // @Bhargavi
  cancelKyc() {
    this.kycModelList = [];
    this.addKycButton = false;
    this.editButtonDisable = false;
   
      this.getAllKycsDetailsRdKycDetails(this.ciLoanApplicationId);
   
  }
  
   //rd account details  
  // @Bhargavi
  getLoanApplicationDetailsById(id: any) {
    this.ciLoanApplicationService.getLoanApplicationDetailsByLoanApplicationId(id).subscribe((data: any) => {
      this.responseModel = data;
      if (this.responseModel != null && this.responseModel != undefined) {
        if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
          if (this.responseModel.data.length > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
            if(this.responseModel.data[0].admissionNo != null && this.responseModel.data[0].admissionNo != undefined){
              this.admissionNumber = this.responseModel.data[0].admissionNo;
            }
            if(this.responseModel.data[0].memberTypeName != null && this.responseModel.data[0].memberTypeName != undefined){
              this.memberTypeName = this.responseModel.data[0].memberTypeName;
              this.membershipDataFromRdModule();
            }
              
            if(this.responseModel.data[0].memberTypeId != null && this.responseModel.data[0].memberTypeId != undefined)
              this.memberTypeId = this.responseModel.data[0].memberTypeId;
            this.getAllKycsDetailsRdKycDetails(this.ciLoanApplicationId);
           
          }
        }else {
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

  //add kyc 
  // @Bhargavi
  addKyc(event: any) {
    this.getAllKycTypes();
    this.multipartFileList = [];
    this.addDocumentOfKycFalg = !this.addDocumentOfKycFalg;
    this.buttonDisabled = true;
    this.editButtonDisable = true;
    this.ciLoanKycModel = new CiLoanKyc;
    this.getAllKycsDetailsRdKycDetails(this.ciLoanApplicationId);
    this.updateData();
  }

   //add cancle 
  // @Bhargavi
  cancel() {
    this.addDocumentOfKycFalg = !this.addDocumentOfKycFalg;
    this.buttonDisabled = false;
    this.editButtonDisable = false;
    this.getAllKycsDetailsRdKycDetails(this.ciLoanApplicationId);
    this.updateData();
  }
  
  onClick() {
    this.addDocumentOfKycFalg = true;
  }
  //click on edit and populate data on form and save & next disable purpose
  // @Bhargavi
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
    this.getKycById(modelData.id);
    this.updateData();

  }
  //edit cancle
  // @Bhargavi
  editCancle() {
    this.editDocumentOfKycFalg = true;
    this.buttonDisabled = false;
    this.editButtonDisable = false;
    this.getAllKycsDetailsRdKycDetails(this.ciLoanApplicationId);
    this.updateData();
  }

   //edit kyc save
  // @Bhargavi
  editsave(row: any) {
    this.ciLoanKycModel.ciLoanApplicationId = this.ciLoanApplicationId;
    this.ciLoanKycModel.admissionNumber = this.admissionNumber;
    this.ciLoanKycModel.memberTypeName  = this.memberTypeName;
    this.ciLoanKycModel.memberType  = this.memberTypeId;
    this.ciLoanKycModel.memberId  = this.memberId;
    if(this.documentNameList != null && this.documentNameList != undefined && this.documentNameList.length > 0){
      let filteredObj = this.documentNameList.find((data: any) => null != data && this.ciLoanKycModel.kycDocumentTypeId != null && data.value == this.ciLoanKycModel.kycDocumentTypeId);
      if (filteredObj != null && undefined != filteredObj && filteredObj.label != null && filteredObj.label != undefined){
        this.ciLoanKycModel.kycDocumentTypeName = filteredObj.label;
      }
    }
    this.editDocumentOfKycFalg = true;
    this.buttonDisabled = false;
    this.editButtonDisable = false;
    this.ciKycService.updateCiLoanKycDetails(this.ciLoanKycModel).subscribe((response: any) => {
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
      this.getAllKycsDetailsRdKycDetails(this.ciLoanApplicationId);
      this.updateData();
    }, error => {
      this.commonComponent.stopSpinner();
      this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: applicationConstants.SERVER_DOWN_ERROR }];
      setTimeout(() => {
        this.msgs = [];
      }, 3000);
    });

  }

  //get kyc details by kyc id for edit purpose
  // @Bhargavi
  getKycById(id: any) {
    this.ciKycService.getCiLoanKycDetailsById(id).subscribe((data: any) => {
      this.responseModel = data;
      if (this.responseModel != null && this.responseModel != undefined) {
        if (this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
          if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
            if (this.responseModel.data.length > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
              this.ciLoanKycModel = this.responseModel.data[0];
              if (this.ciLoanKycModel.kycFilePath != undefined) {
                if(this.ciLoanKycModel.kycFilePath != null && this.ciLoanKycModel.kycFilePath != undefined){
                  this.ciLoanKycModel.multipartFileList = this.fileUploadService.getFile(this.ciLoanKycModel.kycFilePath ,ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.ciLoanKycModel.kycFilePath);

                }
              }
            }
          }
        }
      }
    });
  }

  getMemberDetailsByAdmissionNumber(admisionNumber: any) {
    this.membershipDetailsService.getMembershipBasicDetailsByAdmissionNumber(admisionNumber).subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel != null && this.responseModel != undefined) {
        if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
          if (this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
            this.membershipBasicDetailsModel = this.responseModel.data[0];
            if (this.membershipBasicDetailsModel.dob != null && this.membershipBasicDetailsModel.dob != undefined) {
              this.membershipBasicDetailsModel.dob = this.datePipe.transform(this.membershipBasicDetailsModel.dob, this.orgnizationSetting.datePipe);
            }
            if (this.membershipBasicDetailsModel.admissionDate != null && this.membershipBasicDetailsModel.admissionDate != undefined) {
              this.membershipBasicDetailsModel.admissionDate = this.datePipe.transform(this.membershipBasicDetailsModel.admissionDate, this.orgnizationSetting.datePipe);
            }
            this.memberId = this.membershipBasicDetailsModel.id;
            
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
  //@Bhargavi
  getGroupByAdmissionNumber(admissionNumber: any) {
    this.membershipDetailsService.getMemberGroupByAdmissionNumber(admissionNumber).subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel != null && this.responseModel != undefined) {
        if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
          if (this.responseModel.data.length > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
            this.membershipGroupDetailsModel = this.responseModel.data[0];
            if (this.membershipGroupDetailsModel.registrationDate != null && this.membershipGroupDetailsModel.registrationDate != undefined) {
              this.membershipGroupDetailsModel.registrationDate = this.datePipe.transform(this.membershipGroupDetailsModel.registrationDate, this.orgnizationSetting.datePipe);
            }
            if (this.membershipGroupDetailsModel.admissionDate != null && this.membershipGroupDetailsModel.admissionDate != undefined) {
              this.membershipGroupDetailsModel.admissionDate = this.datePipe.transform(this.membershipGroupDetailsModel.admissionDate, this.orgnizationSetting.datePipe);
            }
              this.memberId = this.membershipGroupDetailsModel.id;
            for(let promoter of this.membershipGroupDetailsModel.groupPromoterList){
            if (promoter.dob != null && promoter.dob != undefined) {
              promoter.memberDobVal = this.datePipe.transform(this.membershipInstitutionDetailsModel.registrationDate, this.orgnizationSetting.datePipe);
            }
            if (promoter.startDate != null && promoter.startDate != undefined) {
              promoter.startDateVal = this.datePipe.transform(this.membershipInstitutionDetailsModel.admissionDate, this.orgnizationSetting.datePipe);
            }
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
  //@Bhargavi
  getInstitutionByAdmissionNumber(admissionNumber: any) {
    this.membershipDetailsService.getMemberIstitutionByAdmissionNumber(admissionNumber).subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel != null && this.responseModel != undefined) {
        if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
          if (this.responseModel.data.length > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
            this.membershipInstitutionDetailsModel = this.responseModel.data[0];
            if (this.membershipInstitutionDetailsModel.registrationDate != null && this.membershipInstitutionDetailsModel.registrationDate != undefined) {
              this.membershipInstitutionDetailsModel.registrationDate = this.datePipe.transform(this.membershipInstitutionDetailsModel.registrationDate, this.orgnizationSetting.datePipe);
            }
            if (this.membershipInstitutionDetailsModel.admissionDate != null && this.membershipInstitutionDetailsModel.admissionDate != undefined) {
              this.membershipInstitutionDetailsModel.admissionDate = this.datePipe.transform(this.membershipInstitutionDetailsModel.admissionDate, this.orgnizationSetting.datePipe);
            }
            this.memberId = this.membershipInstitutionDetailsModel.id;
            if (this.membershipInstitutionDetailsModel.institutionPromoterList.length > 0){
              this.institutionPromoter = this.membershipInstitutionDetailsModel.institutionPromoterList;
            
            for(let promoter of this.membershipInstitutionDetailsModel.institutionPromoterList){
              if (promoter.dob != null && promoter.dob != undefined) {
                promoter.memberDobVal = this.datePipe.transform(this.membershipInstitutionDetailsModel.registrationDate, this.orgnizationSetting.datePipe);
              }
              if (promoter.startDate != null && promoter.startDate != undefined) {
                promoter.startDateVal = this.datePipe.transform(this.membershipInstitutionDetailsModel.admissionDate, this.orgnizationSetting.datePipe);
              }
            }
          }
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

  membershipDataFromRdModule(){
    if (this.memberTypeName == "Individual") {
      this.individualFlag = true;
      this.getMemberDetailsByAdmissionNumber(this.admissionNumber);
    } else if (this.memberTypeName == "Group") {
      this.groupFlag = true;
      this.getGroupByAdmissionNumber(this.admissionNumber);
    } else if (this.memberTypeName == "Institution") {
      this.institutionFlag = true;
      this.getInstitutionByAdmissionNumber(this.admissionNumber);
    }
    
  }

  
  kycModelDuplicateCheck(kycDocTypeId:any){
    if(this.kycModelList != null && this.kycModelList != undefined && this.kycModelList.length > 0){
    let duplicate = this.kycModelList.find((obj:any) => obj && obj.kycDocumentTypeId === kycDocTypeId );
    if (duplicate != null && duplicate != undefined) {
      this.kycForm.reset();
      this.msgs = [];
      this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: "duplicate Kyc Types"}];
      setTimeout(() => {
        this.msgs = [];
      }, 3000);
    } 
  }
  }

   /**
   * @author Bhargavi
   * @implements on click delete
   */
   deletDilogBox(rowData:any){
    this.displayDialog = true;
    if(rowData.id != null && rowData.id != undefined){
      this.deleteId = rowData.id;
    }
   
  }

  /**
   * @author Bhargavi
   * @implements cancle delete dialog box
   */
  cancelForDialogBox() {
    this.displayDialog = false;
  }

  /**
   * @author Bhargavi
   * @implements submit delete diloge 
   */
  submitDelete(){
    if(this.deleteId != null && this.deleteId != undefined){
      this.delete(this.deleteId);
    }
      this.displayDialog = false;
  }

  /**
   * @implements onFile remove
   * @author Bhargavi
   */
  fileRemoeEvent(){
    if(this.ciLoanKycModel.filesDTOList != null && this.ciLoanKycModel.filesDTOList != undefined && this.ciLoanKycModel.filesDTOList.length > 0){
     let removeFileIndex = this.ciLoanKycModel.filesDTOList.findIndex((obj:any) => obj && obj.fileName === this.ciLoanKycModel.kycFilePath);
     if(removeFileIndex != null && removeFileIndex != undefined){
       this.ciLoanKycModel.filesDTOList[removeFileIndex] = null;
       this.ciLoanKycModel.kycFilePath = null;
     }
    }
   }
}
