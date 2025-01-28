import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { FileUpload } from 'primeng/fileupload';
import { CommonCategoryService } from 'src/app/configurations/membership-config/membership-common-category/shared/common-category.service';
import { FileUploadModel } from 'src/app/layout/mainmenu/shared/file-upload-model.model';
import { applicationConstants } from 'src/app/shared/applicationConstants';
import { CommonComponent } from 'src/app/shared/common.component';
import { CommonFunctionsService } from 'src/app/shared/commonfunction.service';
import { EncryptDecryptService } from 'src/app/shared/encrypt-decrypt.service';
import { FileUploadService } from 'src/app/shared/file-upload.service';
import { Responsemodel } from 'src/app/shared/responsemodel';
import { CommonStatusData, MemberShipTypesData } from 'src/app/transcations/common-status-data.json';
import { ERP_TRANSACTION_CONSTANTS } from 'src/app/transcations/erp-transaction-constants';
import { Membershiptransactionconstant } from 'src/app/transcations/membership-transcation/membership-transaction-constant';
import { InstitutionBasicDetailsModel, InstituteCommunicationModel, InstiteKycDetailsModel, InstitutePromoterDetails } from 'src/app/transcations/membership-transcation/shared/institution-details.model';
import { MemInstitutionService } from 'src/app/transcations/membership-transcation/shared/mem-institution.service';
import { MemberBasicDetails, MemberNomineeDetails, MemberGuardianDetailsModel, MemberLandDetailsModel, MembershipFamilyDetailsModel, MemberCommunicationDeatilsModel, MemberKycDetailsModel, MembershipAssetsDetailsModel } from 'src/app/transcations/membership-transcation/shared/member-basic-details.model';
import { MemberGroupBasicDetails, GroupCommunicationModel, GroupKycDeatilsModel, promoterDetailsModel } from 'src/app/transcations/membership-transcation/shared/member-group-details-model';
import { MembershipBasicDetailsService } from 'src/app/transcations/membership-transcation/shared/membership-basic-details.service';
import { MembershipGroupDetailsService } from 'src/app/transcations/membership-transcation/shared/membership-group-details.service';

@Component({
  selector: 'app-member-approval',
  templateUrl: './member-approval.component.html',
  styleUrls: ['./member-approval.component.css']
})
export class MemberApprovalComponent {
  memberBasicDetailsModel: MemberBasicDetails = new MemberBasicDetails();
  memberNomineeDetailsModel: MemberNomineeDetails = new MemberNomineeDetails();
  memberGuardianDetailsDetailsModel: MemberGuardianDetailsModel = new MemberGuardianDetailsModel();
  memberLandDetailsModel: MemberLandDetailsModel = new MemberLandDetailsModel();
  membershipFamilyDetailsModel: MembershipFamilyDetailsModel = new MembershipFamilyDetailsModel();
  memberCommunicationDetailsModel: MemberCommunicationDeatilsModel = new MemberCommunicationDeatilsModel();
  memberKycDetailsModel: MemberKycDetailsModel = new MemberKycDetailsModel();
  membershipAssetsDetailsModel: MembershipAssetsDetailsModel = new MembershipAssetsDetailsModel();


  memberGroupBasicDetails: MemberGroupBasicDetails = new MemberGroupBasicDetails();
  groupCommunicationModel: GroupCommunicationModel = new GroupCommunicationModel();
  groupKycDeatilsModel: GroupKycDeatilsModel = new GroupKycDeatilsModel();
  promoterDetailsModel: promoterDetailsModel = new promoterDetailsModel();


  institutionBasicDetailsModel: InstitutionBasicDetailsModel = new InstitutionBasicDetailsModel();
  instituteCommunicationModel: InstituteCommunicationModel = new InstituteCommunicationModel();
  institeKycDetailsModel: InstiteKycDetailsModel = new InstiteKycDetailsModel();
  institutePromoterDetails: InstitutePromoterDetails = new InstitutePromoterDetails();



  statusList: any[] = [];

  responseModel!: Responsemodel;
  msgs: any[] = [];

  isEdit: any;
  buttonDisabled?: any;
  orgnizationSetting: any;
  countryList: any[] = [];
  memberLandDetails: any;
  selectedMemberType: any;
  memberPromoterDetails: any[] = [];
  groupPromoterList: any[] = [];
  memberLandDetailsList: any[] = [];
  memberFamilyDetails: any[] = [];
  membershipFamilyDetailsList: any[] = [];
  membershipAssetsDetailsList: any[] = [];
  memberAssetDetails: any
  institutePromoterList: any;
  editbtn: Boolean = true;
  addressOne: any;
  addressTwo: any;
  kycGridList: any[]=[];
  groupKycGridList: any[]=[];
  institutionKycList:any[]=[];
  guardainEnableFlag: boolean = false;
  photoCopyFlag: boolean = true;
  signatureCopyFlag: boolean = true;
  memberPhotoCopyZoom: boolean = false;
  membreIndividualFlag: boolean = false;
  memberGroupBasicDetailsFlag:boolean =false;
  memberInstitutionBasicDetailsFlag:boolean =false;
  promoterFlag:boolean =false;
  showForm: boolean = false;

  isShowSubmit: boolean =applicationConstants.FALSE;
  showFormkyc: boolean = false;
  multipleFilesList: any;
  uploadFileData: any;
  isFileUploaded: any;
  previewButton:  boolean = false;
  isDisableSubmit: boolean = false;
  membershiForm: FormGroup;
  memStatus:any;

  constructor(private commonComponent: CommonComponent, private formBuilder: FormBuilder, private membershipBasicDetailsService: MembershipBasicDetailsService,
    private activateRoute: ActivatedRoute, private encryptService: EncryptDecryptService, private datePipe: DatePipe,
    private router: Router, private commonFunctionsService: CommonFunctionsService,private fileUploadService :FileUploadService,
    private memberShipGroupDetailsService: MembershipGroupDetailsService,private encryptDecryptService: EncryptDecryptService,
    private memInistitutionsService: MemInstitutionService,private translate:TranslateService,private commonFunctionService:CommonFunctionsService,
    private commonStatusService:CommonCategoryService) {
      this.membershiForm = this.formBuilder.group({
        status: new FormControl(''),
        remarks: new FormControl(''),
  })
  }

  ngOnInit() {
    this.memStatus = null;
    this.memberLandDetails = [
      { field: 'passbookNumber', header: 'ERP.PASSBOOK_NUMBER' },
      { field: 'surveyNumber', header: 'ERP.SURVEY_NO' },
      { field: 'landInUnits', header: 'ERP.LAND_IN_UNITS' },
      { field: 'landInSubUnits', header: 'ERP.LAND_IN_SUB_UNITS' },
      { field: 'soilTypeName', header: 'ERP.LAND_TYPE' },
      { field: 'waterSourceName', header: 'ERP.WATER_SOURCE_TYPES' },
      { field: 'uploadFilePath', header: 'MEMBERSHIP_TRANSACTION.DOCUMENT_COPY' }
      
    ];

    this.memberFamilyDetails = [
      { field: 'relationTypeName', header: 'ERP.RELATION_TYPE' },
      { field: 'surname', header: 'ERP.SURNAME' },
      { field: 'name', header: 'ERP.NAME' },
      { field: 'dob', header: 'ERP.DATE_OF_BIRTH' },
      { field: 'age', header: 'ERP.AGE' },
      { field: 'qualificationName', header: 'ERP.QUALIFICATION' },
      { field: 'aadharNumber', header: 'ERP.AADHAR_NUMBER' },
      { field: 'mobileNumber', header: 'ERP.MOBILE_NUMBER' },
      // { field: 'docFilePath', header: 'ERP.UPLOAD_DOCUMENT' }
    ];


    this.memberPromoterDetails = [
      { field: 'name', header: 'ERP.NAME' },
      { field: 'operatorTypeName', header: 'ERP.TYPE_OF_OPERATOR' },
       { field: 'authorizedSignatoryName', header: 'MEMBERSHIP_TRANSACTION.AUTHORIZED_SIGNATORY' },
      { field: 'dob', header: 'ERP.DATE_OF_BIRTH' },
      { field: 'age', header: 'ERP.AGE' },
      { field: 'genderTypeName', header: 'ERP.GENDER' },
      { field: 'maritalStatusName', header: 'ERP.MARITAL_STATUS' },
      { field: 'mobileNumber', header: 'ERP.MOBILE_NUMBER' },
      { field: 'emailId', header: 'ERP.EMAIL' },
      { field: 'aadharNumber', header: 'ERP.AADHAR_NUMBER' },
      { field: 'startDate', header: 'ERP.START_DATE' },
      { field: 'uploadImage', header: 'ERP.UPLOAD_IMAGE' },
      { field: 'uploadSignature', header: 'ERP.UPLOAD_SIGNATURE' }

    ];


    this.memberAssetDetails = [
      { field: 'assetTypeName', header: 'ERP.ASSET_TYPES' },
      { field: 'assetName', header: 'ERP.ASSET_NAME' },
      { field: 'registeredNumber', header: 'ERP.REGISTERED_NUMBER' },
      { field: 'registeredDate', header: 'ERP.REGISTERED_DATE' },
      { field: 'initialValue', header: 'ERP.INITIAL_VALUE' },
      { field: 'currentValue', header: 'ERP.CURRENT_VALUE' },
      { field: 'depreciationPercentage', header: 'MEMBERSHIPCONFIG.DEPRECIATION_PERCENTAGE' },
      // { field: 'assetFilePath', header: 'ERP.UPLOAD_DOCUMENT' },

    ];
    this.getAllStatusList();
    this.orgnizationSetting = this.commonComponent.orgnizationSettings();
    this.commonFunctionsService.data.subscribe((res: any) => {
      if (res) {
        this.translate.use(res);
      } else {
        this.translate.use(this.commonFunctionService.getStorageValue('language'));
      }
    });
    
    this.activateRoute.queryParams.subscribe(params => {
      if (params['id'] != undefined) {
        this.commonComponent.startSpinner();
        let id = this.encryptService.decrypt(params['id']);
        if(params['type'] != undefined){
          let type = this.encryptService.decrypt(params['type']);
          this.selectedMemberType = type;
          if (this.selectedMemberType === MemberShipTypesData.INDIVIDUAL)
            this.getMembershipDetails(id);
          else if (this.selectedMemberType === MemberShipTypesData.GROUP) {
            this.getGroupDetails(id);
          }
          else if (this.selectedMemberType === MemberShipTypesData.INSTITUTION) {
            this.getInstitutionDetails(id);
          }
        }
        this.isEdit = true;
      } 
    });
  }
  getMembershipDetails(id: any) {
    this.membershipBasicDetailsService.getMembershipBasicDetailsById(id).subscribe(res => {
      this.responseModel = res;
      this.commonComponent.stopSpinner();

      if (this.responseModel.status == applicationConstants.STATUS_SUCCESS && this.responseModel.data && this.responseModel.data.length > 0) {
        this.memberBasicDetailsModel = this.responseModel.data[0];
        if(this.memberBasicDetailsModel.statusName == CommonStatusData.CREATED || this.memberBasicDetailsModel.statusName == CommonStatusData.SUBMISSION_FOR_APPROVAL){
          this.isDisableSubmit = true;
        }
        else{
          this.isDisableSubmit = false;
        }
        if (this.memberBasicDetailsModel.photoCopyPath != null && this.memberBasicDetailsModel.photoCopyPath != undefined) {
          this.memberBasicDetailsModel.multipartFileListForPhotoCopy = this.fileUploadService.getFile(this.memberBasicDetailsModel.photoCopyPath ,ERP_TRANSACTION_CONSTANTS.MEMBERSHIP + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.memberBasicDetailsModel.photoCopyPath  );
        }
        if (this.memberBasicDetailsModel.signatureCopyPath != null && this.memberBasicDetailsModel.signatureCopyPath != undefined) {
          this.memberBasicDetailsModel.multipartFileListForsignatureCopyPath = this.fileUploadService.getFile(this.memberBasicDetailsModel.signatureCopyPath ,ERP_TRANSACTION_CONSTANTS.MEMBERSHIP + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.memberBasicDetailsModel.signatureCopyPath  );
        }
        if (this.memberBasicDetailsModel.mcrDocumentCopy != null && this.memberBasicDetailsModel.mcrDocumentCopy != undefined) {
          this.memberBasicDetailsModel.multipartFileListForMCRCopyPath = this.fileUploadService.getFile(this.memberBasicDetailsModel.mcrDocumentCopy ,ERP_TRANSACTION_CONSTANTS.MEMBERSHIP + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.memberBasicDetailsModel.mcrDocumentCopy  );
        }
        if (this.memberBasicDetailsModel.photoCopyPath != null && this.memberBasicDetailsModel.photoCopyPath != undefined) {
          this.memberBasicDetailsModel.multipartFileListForPhotoCopy = this.fileUploadService.getFile(this.memberBasicDetailsModel.photoCopyPath ,ERP_TRANSACTION_CONSTANTS.MEMBERSHIP + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.memberBasicDetailsModel.photoCopyPath  );
        }
        if (this.memberBasicDetailsModel.signedCopyPath != null && this.memberBasicDetailsModel.signedCopyPath != undefined) {
          this.memberBasicDetailsModel.multipartFileListsignedCopyPath = this.fileUploadService.getFile(this.memberBasicDetailsModel.signedCopyPath ,ERP_TRANSACTION_CONSTANTS.MEMBERSHIP + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.memberBasicDetailsModel.signedCopyPath  );
        }
        if (this.memberBasicDetailsModel.admissionDateVal != undefined && this.memberBasicDetailsModel.admissionDateVal != null) {
          this.memberBasicDetailsModel.admissionDate = this.commonFunctionsService.getUTCEpoch(new Date(this.memberBasicDetailsModel.admissionDateVal));
        }

        if (this.memberBasicDetailsModel.admissionDate != null) {
          this.memberBasicDetailsModel.admissionDateVal = this.datePipe.transform(this.memberBasicDetailsModel.admissionDate, this.orgnizationSetting.datePipe);
        }

        if (this.memberBasicDetailsModel.dob != null) {
          this.memberBasicDetailsModel.memDobVal = this.datePipe.transform(this.memberBasicDetailsModel.dob, this.orgnizationSetting.datePipe);
        }

        if (this.memberBasicDetailsModel.memberShipNomineeDetailsDTOList != null && this.memberBasicDetailsModel.memberShipNomineeDetailsDTOList.length > 0) {
          this.memberNomineeDetailsModel = this.memberBasicDetailsModel.memberShipNomineeDetailsDTOList[0];
          if(this.memberNomineeDetailsModel.nomineeFilePath != null && this.memberNomineeDetailsModel.nomineeFilePath != undefined)
            this.memberNomineeDetailsModel.multipartFileList = this.fileUploadService.getFile(this.memberNomineeDetailsModel.nomineeFilePath ,ERP_TRANSACTION_CONSTANTS.MEMBERSHIP + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.memberNomineeDetailsModel.nomineeFilePath);

        }
        if (this.memberBasicDetailsModel.age != null && this.memberBasicDetailsModel.age != undefined && this.memberBasicDetailsModel.age < 18) {
          this.guardainEnableFlag = true;
        }
        if (this.memberBasicDetailsModel.memberShipGuadianDetailsDTOList != null && this.memberBasicDetailsModel.memberShipGuadianDetailsDTOList != undefined && this.memberBasicDetailsModel.memberShipGuadianDetailsDTOList.length > 0 && this.memberBasicDetailsModel.memberShipGuadianDetailsDTOList[0] != null && this.memberBasicDetailsModel.memberShipGuadianDetailsDTOList[0] != undefined) {
          this.memberGuardianDetailsDetailsModel = this.memberBasicDetailsModel.memberShipGuadianDetailsDTOList[0];
        }

        if (this.memberBasicDetailsModel.memberShipGuadianDetailsDTOList != null && this.memberBasicDetailsModel.memberShipGuadianDetailsDTOList.length > 0) {
          this.memberGuardianDetailsDetailsModel = this.memberBasicDetailsModel.memberShipGuadianDetailsDTOList[0];
          if(this.memberGuardianDetailsDetailsModel.uploadFilePath != null && this.memberGuardianDetailsDetailsModel.uploadFilePath != undefined)
            this.memberGuardianDetailsDetailsModel.multipartsFileList = this.fileUploadService.getFile(this.memberGuardianDetailsDetailsModel.uploadFilePath ,ERP_TRANSACTION_CONSTANTS.MEMBERSHIP + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.memberGuardianDetailsDetailsModel.uploadFilePath);

        }

        if (this.memberBasicDetailsModel.memberShipLandDetailsDTOList != null && this.memberBasicDetailsModel.memberShipLandDetailsDTOList.length > 0) {
          this.memberLandDetailsList = this.memberBasicDetailsModel.memberShipLandDetailsDTOList;
          this.memberLandDetailsList = this.memberLandDetailsList.map((member:any) =>{
            if(member.uploadFilePath != null && member.uploadFilePath != undefined)
              member.multipleFilesList = this.fileUploadService.getFile(member.uploadFilePath ,ERP_TRANSACTION_CONSTANTS.MEMBERSHIP + ERP_TRANSACTION_CONSTANTS.FILES + "/" + member.uploadFilePath);

            return member;
          }
          );
        }

        if (this.memberBasicDetailsModel.memberShipFamilyDetailsDTOList != null && this.memberBasicDetailsModel.memberShipFamilyDetailsDTOList.length > 0) {
          this.membershipFamilyDetailsList = this.memberBasicDetailsModel.memberShipFamilyDetailsDTOList
          this.membershipFamilyDetailsList =    this.membershipFamilyDetailsList.filter((obj:any) => null != obj && obj.dob != null).map((family:any)=>{
            family.dob = this.datePipe.transform(family.dob, this.orgnizationSetting.datePipe);
            if (family.docFilePath != null && family.docFilePath != undefined) {
              family.multipleFilesList = this.fileUploadService.getFile(family.docFilePath, ERP_TRANSACTION_CONSTANTS.MEMBERSHIP + ERP_TRANSACTION_CONSTANTS.FILES + "/" + family.docFilePath);
            }
            return family;
          });
        }

        if (this.memberBasicDetailsModel.memberShipCommunicationDetailsDTO != null && this.memberBasicDetailsModel.memberShipCommunicationDetailsDTO != undefined) {
          this.memberCommunicationDetailsModel = this.memberBasicDetailsModel.memberShipCommunicationDetailsDTO;
        }
      if(this.memberBasicDetailsModel.memberShipKycDetailsDTOList != null &&  this.memberBasicDetailsModel.memberShipKycDetailsDTOList != undefined && this.memberBasicDetailsModel.memberShipKycDetailsDTOList.length > 0){
        this.kycGridList = this.memberBasicDetailsModel.memberShipKycDetailsDTOList;
        this.kycGridList  = this.kycGridList.filter(obj => null != obj && null !=obj.status && obj.status === applicationConstants.ACTIVE ).map((kyc:any)=>{
          this.showFormkyc = false;
          kyc.multipartFileList = this.fileUploadService.getFile(kyc.kycFilePath ,ERP_TRANSACTION_CONSTANTS.MEMBERSHIP + ERP_TRANSACTION_CONSTANTS.FILES + "/" + kyc.kycFilePath);
          return kyc;
        });
      }
      else{
        this.showFormkyc = true;
      }
        if (this.memberBasicDetailsModel.memberShipAssertDetailsDTOList != null && this.memberBasicDetailsModel.memberShipAssertDetailsDTOList.length > 0) {
          this.membershipAssetsDetailsList = this.memberBasicDetailsModel.memberShipAssertDetailsDTOList;
          this.membershipAssetsDetailsList = this.membershipAssetsDetailsList.filter((obj:any) => null != obj ).map((asset:any)=>{
            asset.registeredDate = this.datePipe.transform(asset.registeredDate, this.orgnizationSetting.datePipe);
            if(asset.assetFilePath != null && asset.assetFilePath != undefined)
              asset.multipartFileList = this.fileUploadService.getFile(asset.assetFilePath ,ERP_TRANSACTION_CONSTANTS.MEMBERSHIP + ERP_TRANSACTION_CONSTANTS.FILES + "/" + asset.assetFilePath);
            return asset;
          });

        }
      }
    });
  }

  getGroupDetails(id: any) {
    this.memberShipGroupDetailsService.getMembershipGroupDetailsById(id).subscribe(res => {
      this.responseModel = res;
      this.commonComponent.stopSpinner();

      if (this.responseModel.status == applicationConstants.STATUS_SUCCESS && this.responseModel.data && this.responseModel.data.length > 0) {
        this.memberGroupBasicDetails = this.responseModel.data[0];
        if(this.memberGroupBasicDetails.statusName == CommonStatusData.CREATED || this.memberGroupBasicDetails.statusName == CommonStatusData.SUBMISSION_FOR_APPROVAL){
          this.isDisableSubmit = true;
        }
        else{
          this.isDisableSubmit = false;
        }

        if (this.memberGroupBasicDetails.resolutionCopyPath != null && this.memberGroupBasicDetails.resolutionCopyPath != undefined) {
          this.memberGroupBasicDetails.multipartFileListForsignatureCopyPath = this.fileUploadService.getFile(this.memberGroupBasicDetails.resolutionCopyPath ,ERP_TRANSACTION_CONSTANTS.MEMBERSHIP + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.memberGroupBasicDetails.resolutionCopyPath);
        }
        if (this.memberGroupBasicDetails.admissionDate != null) {
          this.memberGroupBasicDetails.admissionDateVal = this.datePipe.transform(this.memberGroupBasicDetails.admissionDate, this.orgnizationSetting.datePipe);
        }
        if (this.memberGroupBasicDetails.registrationDate != null) {
          this.memberGroupBasicDetails.registrationDateVal = this.datePipe.transform(this.memberGroupBasicDetails.registrationDate, this.orgnizationSetting.datePipe);
        }
        if (this.memberGroupBasicDetails.signedCopyPath != null && this.memberGroupBasicDetails.signedCopyPath != undefined) {
          this.memberGroupBasicDetails.multipartFileListsignedCopyPath = this.fileUploadService.getFile(this.memberGroupBasicDetails.signedCopyPath ,ERP_TRANSACTION_CONSTANTS.MEMBERSHIP + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.memberGroupBasicDetails.signedCopyPath  );
        }
        if (this.memberGroupBasicDetails.groupCommunicationList != null && this.memberGroupBasicDetails.groupCommunicationList.length > 0) {
          this.groupCommunicationModel = this.memberGroupBasicDetails.groupCommunicationList[0];
        }
        if (this.memberGroupBasicDetails.groupPromoterList != null && this.memberGroupBasicDetails.groupPromoterList.length > 0) {
          this.groupPromoterList = this.memberGroupBasicDetails.groupPromoterList;
          this.groupPromoterList =    this.groupPromoterList.filter((obj:any) => null != obj && obj.dob != null).map((promoter:any)=>{
            promoter.dob = this.datePipe.transform(promoter.dob, this.orgnizationSetting.datePipe);
            promoter.startDate = this.datePipe.transform(promoter.startDate, this.orgnizationSetting.datePipe);

            if (promoter.uploadImage != null && promoter.uploadImage != undefined) {
              this.photoCopyFlag =true;
              promoter.multipartFileListForPhotoCopy = this.fileUploadService.getFile(promoter.uploadImage ,ERP_TRANSACTION_CONSTANTS.MEMBERSHIP + ERP_TRANSACTION_CONSTANTS.FILES + "/" + promoter.uploadImage );
            }
            else{
              this.photoCopyFlag = false;
            }
            if (promoter.uploadSignature != null && promoter.uploadSignature != undefined) {
              promoter.multipartFileListForsignatureCopyPath = this.fileUploadService.getFile(promoter.uploadSignature ,ERP_TRANSACTION_CONSTANTS.MEMBERSHIP + ERP_TRANSACTION_CONSTANTS.FILES + "/" + promoter.uploadSignature  );
            }
            return promoter;
          });
        }
        if(this.memberGroupBasicDetails.groupKycList != null &&  this.memberGroupBasicDetails.groupKycList != undefined && this.memberGroupBasicDetails.groupKycList.length > 0){
          this.groupKycGridList = this.memberGroupBasicDetails.groupKycList;
          this.groupKycGridList  = this.groupKycGridList.filter(obj => null != obj && null !=obj.status && obj.status === applicationConstants.ACTIVE).map((kyc:any)=>{
            this.showFormkyc = false;
            kyc.multipartFileList = this.fileUploadService.getFile(kyc.kycFilePath ,ERP_TRANSACTION_CONSTANTS.MEMBERSHIP + ERP_TRANSACTION_CONSTANTS.FILES + "/" + kyc.kycFilePath);
            return kyc;
          });
        }
        else{
          this.showFormkyc = true;
        }
      }
    });
  }

  getInstitutionDetails(id: any) {
    if(id != undefined && id != null){
    this.memInistitutionsService.getMemInstitutionById(id).subscribe(res => {
      this.responseModel = res;
      this.commonComponent.stopSpinner();

      if (this.responseModel.status == applicationConstants.STATUS_SUCCESS && this.responseModel.data && this.responseModel.data.length > 0) {
        this.institutionBasicDetailsModel = this.responseModel.data[0];

        if(this.institutionBasicDetailsModel.statusName == CommonStatusData.CREATED || this.institutionBasicDetailsModel.statusName == CommonStatusData.SUBMISSION_FOR_APPROVAL){
          this.isDisableSubmit = true;
        }
        else{
          this.isDisableSubmit = false;
        }

        if (this.institutionBasicDetailsModel.resolutionCopyPath != null && this.institutionBasicDetailsModel.resolutionCopyPath != undefined) {
          this.institutionBasicDetailsModel.multipartFileListForPhotoCopy = this.fileUploadService.getFile(this.institutionBasicDetailsModel.resolutionCopyPath ,ERP_TRANSACTION_CONSTANTS.MEMBERSHIP + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.institutionBasicDetailsModel.resolutionCopyPath);
        }

        if (this.institutionBasicDetailsModel.admissionDate != null) {
          this.institutionBasicDetailsModel.admissionDateVal = this.datePipe.transform(this.institutionBasicDetailsModel.admissionDate, this.orgnizationSetting.datePipe);
        }

        if (this.institutionBasicDetailsModel.registrationDate != null) {
          this.institutionBasicDetailsModel.registrationDateVal = this.datePipe.transform(this.institutionBasicDetailsModel.registrationDate, this.orgnizationSetting.datePipe);
        }

        if (this.institutionBasicDetailsModel.institutionCommunicationDTOList != null && this.institutionBasicDetailsModel.institutionCommunicationDTOList.length > 0) {
          this.instituteCommunicationModel = this.institutionBasicDetailsModel.institutionCommunicationDTOList[0];
        }

        if (this.institutionBasicDetailsModel.signedCopyPath != null && this.institutionBasicDetailsModel.signedCopyPath != undefined) {
          this.institutionBasicDetailsModel.multipartFileListsignedCopyPath = this.fileUploadService.getFile(this.institutionBasicDetailsModel.signedCopyPath ,ERP_TRANSACTION_CONSTANTS.MEMBERSHIP + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.institutionBasicDetailsModel.signedCopyPath  );
        }
        if (this.institutionBasicDetailsModel.institutionKycDetailsDTOList != null && this.institutionBasicDetailsModel.institutionKycDetailsDTOList.length > 0) {
          this.institutionKycList = this.institutionBasicDetailsModel.institutionKycDetailsDTOList;
          this.institutionKycList  = this.institutionKycList.filter(obj => null != obj && null !=obj.status && obj.status === applicationConstants.ACTIVE).map((kyc:any)=>{
            this.showFormkyc = false;
            kyc.multipartFileList = this.fileUploadService.getFile(kyc.kycFilePath ,ERP_TRANSACTION_CONSTANTS.MEMBERSHIP + ERP_TRANSACTION_CONSTANTS.FILES + "/" + kyc.kycFilePath);
            return kyc;
          });
        }
        else{
          this.showFormkyc = true;
        }
        
        if (this.institutionBasicDetailsModel.institutionPromoterList != null && this.institutionBasicDetailsModel.institutionPromoterList.length > 0) {
          this.institutePromoterList = this.institutionBasicDetailsModel.institutionPromoterList;
          this.institutePromoterList =  this.institutePromoterList.filter((obj:any) => null != obj && obj.dob != null).map((promoter:any)=>{
            promoter.dob = this.datePipe.transform(promoter.dob, this.orgnizationSetting.datePipe);
            promoter.startDate = this.datePipe.transform(promoter.startDate, this.orgnizationSetting.datePipe);

            if (promoter.uploadImage != null && promoter.uploadImage != undefined) {
              promoter.multipartFileListForPhotoCopy = this.fileUploadService.getFile(promoter.uploadImage ,ERP_TRANSACTION_CONSTANTS.MEMBERSHIP + ERP_TRANSACTION_CONSTANTS.FILES + "/" + promoter.uploadImage );
            }
            if (promoter.uploadSignature != null && promoter.uploadSignature != undefined) {
              promoter.multipartFileListForsignatureCopyPath = this.fileUploadService.getFile(promoter.uploadSignature ,ERP_TRANSACTION_CONSTANTS.MEMBERSHIP + ERP_TRANSACTION_CONSTANTS.FILES + "/" + promoter.uploadSignature  );
            }
            return promoter;
          });
        }
      }
    });
  }
  }
  back() {
      this.router.navigate([Membershiptransactionconstant.MEMBERSHIP_APPROVAL_DETAILS]);
  }
  
  submit() {
    this.msgs = [];
    // this.memberBasicDetailsModel.memStatus = 3;
    if (this.memberBasicDetailsModel.memberShipAssertDetailsDTOList != null && this.memberBasicDetailsModel.memberShipAssertDetailsDTOList.length > 0) {
      this.membershipAssetsDetailsList = this.memberBasicDetailsModel.memberShipAssertDetailsDTOList;
      this.membershipAssetsDetailsList = this.membershipAssetsDetailsList.filter((obj:any) => null != obj ).map((asset:any)=>{
        asset.registeredDate = this.datePipe.transform(asset.registeredDate, this.orgnizationSetting.datePipe);
        asset.registeredDate = this.commonFunctionService.getUTCEpoch(new Date( asset.registeredDate))
        return asset;
      });

    }
    if (this.memberBasicDetailsModel.memberShipFamilyDetailsDTOList != null && this.memberBasicDetailsModel.memberShipFamilyDetailsDTOList.length > 0) {
      this.membershipFamilyDetailsList = this.memberBasicDetailsModel.memberShipFamilyDetailsDTOList
      this.membershipFamilyDetailsList = this.membershipFamilyDetailsList.filter((obj:any) => null != obj && obj.dob != null).map((family:any)=>{
        family.dob = this.datePipe.transform(family.dob, this.orgnizationSetting.datePipe);
        family.dob = this.commonFunctionService.getUTCEpoch(new Date( family.dob))
        return family;
      });
    }
     
    this.membershipBasicDetailsService.submitForApproval(this.memberBasicDetailsModel).subscribe(response => {
      this.responseModel = response;
      this.memberBasicDetailsModel =response;
      this.msgs = [];
      if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
        this.commonComponent.stopSpinner();
        this.msgs.push({ severity: 'success', detail: this.responseModel.statusMsg });
        // setTimeout(() => {
          this.router.navigate([Membershiptransactionconstant.MEMBERSHIP_APPROVAL_DETAILS]);
          // }, 300);
      } else {
        this.commonComponent.stopSpinner();
        this.msgs.push({ severity: 'error', detail: this.responseModel.statusMsg });
      }
    }, error => {
      this.msgs = [];
      this.commonComponent.stopSpinner();
      this.msgs.push({ severity: 'error', detail: applicationConstants.WE_COULDNOT_PROCESS_YOU_ARE_REQUEST });
    });

  }
  submitForGroup() {
    this.msgs = [];
    if (this.memberGroupBasicDetails.groupPromoterList != null && this.memberGroupBasicDetails.groupPromoterList.length > 0) {
      this.groupPromoterList = this.memberGroupBasicDetails.groupPromoterList;
      this.groupPromoterList =    this.groupPromoterList.filter((obj:any) => null != obj && obj.dob != null).map((promoter:any)=>{
        promoter.dob = this.datePipe.transform(promoter.dob, this.orgnizationSetting.datePipe);
        promoter.startDate = this.datePipe.transform(promoter.startDate, this.orgnizationSetting.datePipe);
        promoter.dob = this.commonFunctionService.getUTCEpoch(new Date( promoter.dob))
        promoter.startDate = this.commonFunctionService.getUTCEpoch(new Date( promoter.startDate))
        return promoter;
      });
    }
     
    this.memberShipGroupDetailsService.submitForApproval(this.memberGroupBasicDetails).subscribe(response => {
      this.responseModel = response;
      this.memberGroupBasicDetails =response;
      this.msgs = [];
      if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
        this.commonComponent.stopSpinner();
        this.msgs.push({ severity: 'success', detail: this.responseModel.statusMsg });
        // setTimeout(() => {
          this.router.navigate([Membershiptransactionconstant.MEMBERSHIP_APPROVAL_DETAILS]);
          // }, 300);
      } else {
        this.commonComponent.stopSpinner();
        this.msgs.push({ severity: 'error', detail: this.responseModel.statusMsg });
      }
    }, error => {
      this.msgs = [];
      this.commonComponent.stopSpinner();
      this.msgs.push({ severity: 'error', detail: applicationConstants.WE_COULDNOT_PROCESS_YOU_ARE_REQUEST });
    });

  }

  submitForInstitution() {
    this.msgs = [];
    if (this.institutionBasicDetailsModel.institutionPromoterList != null && this.institutionBasicDetailsModel.institutionPromoterList.length > 0) {
      this.institutePromoterList = this.institutionBasicDetailsModel.institutionPromoterList;
      this.institutePromoterList =    this.institutePromoterList.filter((obj:any) => null != obj && obj.dob != null).map((promoter:any)=>{
        promoter.dob = this.datePipe.transform(promoter.dob, this.orgnizationSetting.datePipe);
        promoter.startDate = this.datePipe.transform(promoter.startDate, this.orgnizationSetting.datePipe);
        promoter.dob = this.commonFunctionService.getUTCEpoch(new Date( promoter.dob))
        promoter.startDate = this.commonFunctionService.getUTCEpoch(new Date( promoter.startDate))
        return promoter;
      });
    }
    this.memInistitutionsService.submitForApproval(this.institutionBasicDetailsModel).subscribe(response => {
      this.responseModel = response;
      this.institutionBasicDetailsModel =response;
      this.msgs = [];
      if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
        this.commonComponent.stopSpinner();
        this.msgs.push({ severity: 'success', detail: this.responseModel.statusMsg });
        // setTimeout(() => {
          this.router.navigate([Membershiptransactionconstant.MEMBERSHIP_APPROVAL_DETAILS]);
          // }, 300);
      } else {
        this.commonComponent.stopSpinner();
        this.msgs.push({ severity: 'error', detail: this.responseModel.statusMsg });
      }
    }, error => {
      this.msgs = [];
      this.commonComponent.stopSpinner();
      this.msgs.push({ severity: 'error', detail: applicationConstants.WE_COULDNOT_PROCESS_YOU_ARE_REQUEST });
    });

  }
  /**
   * @author k.yamuna
   * @implement onclose popup
   */
  closePhotoCopy() {
    this.memberPhotoCopyZoom = false;
  }

  /**
   * @implement Image Zoom POp up
   * @author k.yamuna
   */
  onClickMemberPhotoCopy(){
    this.memberPhotoCopyZoom = true;
  }

  /**
   * @author k.yamuna
   * @implements close photo dialogue
   */
  closePhoto(){
    this.memberPhotoCopyZoom = false;
  }
   /**
   * @author k.yamuna
   * @implements individula for view more details
   */
  onClickMemberIndividualMoreDetails(){
    this.membreIndividualFlag = true;
    if(this.memberBasicDetailsModel.subProductId == 1){
      this.showForm = true
    }
    else{
      this.showForm = false
    }
  
  }
  //group view more POp up flag
  viewMoreGroupDetails()
  {
    this.memberGroupBasicDetailsFlag= true;
  }
   //group view more POp up flag
   viewMoreInstitutionDetails()
   {
     this.memberInstitutionBasicDetailsFlag= true;
   }
  fileUploader(event: any, fileUpload: FileUpload) {
    this.isFileUploaded = applicationConstants.FALSE;
    this.multipleFilesList = [];
    if (this.isEdit && this.memberBasicDetailsModel.filesDTOList == null || this.memberBasicDetailsModel.filesDTOList == undefined) {
      this.memberBasicDetailsModel.filesDTOList = [];
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
        this.memberBasicDetailsModel.multipartFileListsignedCopyPath = [];
        this.memberBasicDetailsModel.filesDTOList.push(files);
        this.memberBasicDetailsModel.signedCopyPath = null;
        this.memberBasicDetailsModel.filesDTOList[this.memberBasicDetailsModel.filesDTOList.length - 1].fileName = "Member_Signed_Copy" + "_" + timeStamp + "_" + file.name;
        this.memberBasicDetailsModel.signedCopyPath = "Member_Signed_Copy" + "_" + timeStamp + "_" + file.name;
      }
      reader.readAsDataURL(file);
    }
  }

  fileUploaderForGroup(event: any, fileUpload: FileUpload) {
    this.isFileUploaded = applicationConstants.FALSE;
    this.multipleFilesList = [];
    if (this.isEdit && this.memberGroupBasicDetails.filesDTOList == null || this.memberGroupBasicDetails.filesDTOList == undefined) {
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
        this.memberGroupBasicDetails.multipartFileListsignedCopyPath = [];
        this.memberGroupBasicDetails.filesDTOList.push(files);
        this.memberGroupBasicDetails.signedCopyPath = null;
        this.memberGroupBasicDetails.filesDTOList[this.memberGroupBasicDetails.filesDTOList.length - 1].fileName = "Group_Signed_Copy" + "_" + timeStamp + "_" + file.name;
        this.memberGroupBasicDetails.signedCopyPath = "Group_Signed_Copy" + "_" + timeStamp + "_" + file.name;
      }
      reader.readAsDataURL(file);
    }
  }
  fileUploaderForInstitution(event: any, fileUpload: FileUpload) {
    this.isFileUploaded = applicationConstants.FALSE;
    this.multipleFilesList = [];
    if (this.isEdit && this.institutionBasicDetailsModel.filesDTOList == null || this.institutionBasicDetailsModel.filesDTOList == undefined) {
      this.institutionBasicDetailsModel.filesDTOList = [];
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
        this.institutionBasicDetailsModel.multipartFileListsignedCopyPath = [];
        this.institutionBasicDetailsModel.filesDTOList.push(files);
        this.institutionBasicDetailsModel.signedCopyPath = null;
        this.institutionBasicDetailsModel.filesDTOList[this.institutionBasicDetailsModel.filesDTOList.length - 1].fileName = "Institution_Signed_Copy" + "_" + timeStamp + "_" + file.name;
        this.institutionBasicDetailsModel.signedCopyPath = "Institution_Signed_Copy" + "_" + timeStamp + "_" + file.name;
      }
      reader.readAsDataURL(file);
    }
  }

  /**
   * @implements onFileremove from file value
   * @param fileName 
   * @author k.yamuna
   */
fileRemoveEventForInstitution() {
  if (this.institutionBasicDetailsModel.filesDTOList != null && this.institutionBasicDetailsModel.filesDTOList != undefined && this.institutionBasicDetailsModel.filesDTOList.length > 0) {
      let removeFileIndex = this.institutionBasicDetailsModel.filesDTOList.findIndex((obj: any) => obj && obj.fileName === this.institutionBasicDetailsModel.signedCopyPath);
      this.institutionBasicDetailsModel.filesDTOList.splice(removeFileIndex, 1);
      this.institutionBasicDetailsModel.signedCopyPath = null;
    }
  }

  /**
   * @implements onFileremove from file value
   * @param fileName 
   * @author k.yamuna
   */
fileRemoveEvent() {
  if (this.memberBasicDetailsModel.filesDTOList != null && this.memberBasicDetailsModel.filesDTOList != undefined && this.memberBasicDetailsModel.filesDTOList.length > 0) {
      let removeFileIndex = this.memberBasicDetailsModel.filesDTOList.findIndex((obj: any) => obj && obj.fileName === this.memberBasicDetailsModel.signedCopyPath);
      this.memberBasicDetailsModel.filesDTOList.splice(removeFileIndex, 1);
      this.memberBasicDetailsModel.signedCopyPath = null;
    }
  }

  fileRemoveEventForGroup() {
    if (this.memberGroupBasicDetails.filesDTOList != null && this.memberGroupBasicDetails.filesDTOList != undefined && this.memberGroupBasicDetails.filesDTOList.length > 0) {
        let removeFileIndex = this.memberGroupBasicDetails.filesDTOList.findIndex((obj: any) => obj && obj.fileName === this.memberGroupBasicDetails.signedCopyPath);
        this.memberGroupBasicDetails.filesDTOList.splice(removeFileIndex, 1);
        this.memberGroupBasicDetails.signedCopyPath = null;
      }
    }

    //submit button validation based on status for individual
    getMemStatus(){
        if(this.memberBasicDetailsModel.memStatus != null && this.memberBasicDetailsModel.memStatus != undefined){
           this.isDisableSubmit = false;
        }
        else{
          this.isDisableSubmit = true;
        }
    }

    //for submit button validation based on status for Group
    getGroupStatus(){
      if(this.memberGroupBasicDetails.groupStatus != null && this.memberGroupBasicDetails.groupStatus != undefined){
         this.isDisableSubmit = false;
      }
      else{
        this.isDisableSubmit = true;
      }
    }

  //for submit button validation based on status for Institution
  getInstitutionStatus(){
    if(this.institutionBasicDetailsModel.institutionStatus != null && this.institutionBasicDetailsModel.institutionStatus != undefined){
       this.isDisableSubmit = false;
    }
    else{
      this.isDisableSubmit = true;
    }
  }

    getAllStatusList() {
      this.commonStatusService.getAllCommonStatus().subscribe((response: any) => {
        this.responseModel = response;
        if (this.responseModel != null && this.responseModel != undefined) {
          if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
            if (this.responseModel.data != null && this.responseModel.data != undefined && this.responseModel.data.length > 0 ) {
              this.statusList = this.responseModel.data;
              this.statusList = this.responseModel.data.filter((obj: any) => obj != null && obj.name != CommonStatusData.IN_PROGRESS && obj.name != CommonStatusData.CREATED && obj.name != CommonStatusData.SUBMISSION_FOR_APPROVAL).map((state: { name: any; id: any; }) => {
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

