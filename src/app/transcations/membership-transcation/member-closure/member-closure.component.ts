import { Component } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { savingsbanktransactionconstant } from '../../savings-bank-transcation/savingsbank-transaction-constant';
import { Membershiptransactionconstant } from '../membership-transaction-constant';
import { CommonFunctionsService } from 'src/app/shared/commonfunction.service';
import { DatePipe } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { CommonComponent } from 'src/app/shared/common.component';
import { applicationConstants } from 'src/app/shared/applicationConstants';
import { Responsemodel } from 'src/app/shared/responsemodel';
import { MemberBasicDetails, MemberCommunicationDeatilsModel } from '../shared/member-basic-details.model';
import { MembershipBasicDetailsService } from '../shared/membership-basic-details.service';
import { EncryptDecryptService } from 'src/app/shared/encrypt-decrypt.service';
import { FileUploadService } from 'src/app/shared/file-upload.service';
import { ERP_TRANSACTION_CONSTANTS } from '../../erp-transaction-constants';

@Component({
  selector: 'app-member-closure',
  templateUrl: './member-closure.component.html',
  styleUrls: ['./member-closure.component.css']
})
export class MemberClosureComponent {
 closureform: FormGroup;
  showForm: boolean = false;
  responseModel!: Responsemodel;
  memberBasicDetailsModel: MemberBasicDetails = new MemberBasicDetails();
  memberCommunicationDetailsModel: MemberCommunicationDeatilsModel = new MemberCommunicationDeatilsModel();
  
  id: any;
  orgnizationSetting: any;
  membreIndividualFlag: boolean = false;
  photoCopyFlag:boolean= false;
  isDisableSubmit: boolean= false;
  applicationList: any[] =[];
  commomCategory:any[]=[];
  statusList:any[]=[];
  memberPhotoCopyZoom: boolean = false;

    
  
  constructor(private router: Router, private formBuilder: FormBuilder,private translate: TranslateService, private commonComponent: CommonComponent,
      private commonFunctionsService: CommonFunctionsService,private membershipBasicDetailsService: MembershipBasicDetailsService,
    private activateRoute: ActivatedRoute, private encryptService: EncryptDecryptService,private datePipe: DatePipe,private fileUploadService :FileUploadService )
  { 
    this.closureform = this.formBuilder.group({
     
    })
  }
  ngOnInit(): void {
    this.orgnizationSetting = this.commonComponent.orgnizationSettings();
    this.commonFunctionsService.setStorageValue('language', 'en');
    this.commonFunctionsService.data.subscribe((res: any) => {
      if (res) {
        this.translate.use(res);
      } else {
        this.translate.use('en');
      }
    });
    this.activateRoute.queryParams.subscribe(params => {
      if (params['id'] != undefined) {
        this.commonComponent.startSpinner();
        let id = this.encryptService.decrypt(params['id']);
        this.id = id;
            this.getMembershipDetails(id);
        }
        
      });
   
      this.applicationList = [
        { label: 'ALL', value: 0 },
        { label: 'Saving Bank', value: 1 },
        { label: 'Term Deposit', value: 2 },
        {label: 'Loans', value: 3 },
        {label: 'Agent Details', value: 4 },
        {label: 'Pigmy Details', value: 5 }

      ];
      this.statusList = [
        { label: "Active", value: true },
        { label: "In-Active", value: false }
      ]
   
  }
  

  isBasicDetails: boolean = false;
  position: string = 'center';
 
  backbutton(){
    this.router.navigate([Membershiptransactionconstant.MEMBERSHIP_TRANSACTION]);
  }
  showBasicDetailsDialog(position: string) {
    this.position = position;
    this.isBasicDetails = true;
}

  getMembershipDetails(id: any) {
    this.membershipBasicDetailsService.getMembershipBasicDetailsById(id).subscribe(res => {
      this.responseModel = res;
      this.commonComponent.stopSpinner();

      if (this.responseModel.status == applicationConstants.STATUS_SUCCESS && this.responseModel.data && this.responseModel.data.length > 0) {
        this.memberBasicDetailsModel = this.responseModel.data[0];
        if (this.memberBasicDetailsModel.admissionDate != null) {
          this.memberBasicDetailsModel.admissionDateVal = this.datePipe.transform(this.memberBasicDetailsModel.admissionDate, this.orgnizationSetting.datePipe);
        }
        if (this.memberBasicDetailsModel.dob != null) {
          this.memberBasicDetailsModel.memDobVal = this.datePipe.transform(this.memberBasicDetailsModel.dob, this.orgnizationSetting.datePipe);
        }
        if (this.memberBasicDetailsModel.memberShipCommunicationDetailsDTO != null && this.memberBasicDetailsModel.memberShipCommunicationDetailsDTO != undefined) {
          this.memberCommunicationDetailsModel = this.memberBasicDetailsModel.memberShipCommunicationDetailsDTO;
        }
        if (this.memberBasicDetailsModel.photoCopyPath != null && this.memberBasicDetailsModel.photoCopyPath != undefined) {
          this.memberBasicDetailsModel.multipartFileListForPhotoCopy = this.fileUploadService.getFile(this.memberBasicDetailsModel.photoCopyPath, ERP_TRANSACTION_CONSTANTS.MEMBERSHIP + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.memberBasicDetailsModel.photoCopyPath);
        }
        if (this.memberBasicDetailsModel.signatureCopyPath != null && this.memberBasicDetailsModel.signatureCopyPath != undefined) {
          this.memberBasicDetailsModel.multipartFileListForsignatureCopyPath = this.fileUploadService.getFile(this.memberBasicDetailsModel.signatureCopyPath, ERP_TRANSACTION_CONSTANTS.MEMBERSHIP + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.memberBasicDetailsModel.signatureCopyPath);
        }
        if (this.memberBasicDetailsModel.mcrDocumentCopy != null && this.memberBasicDetailsModel.mcrDocumentCopy != undefined) {
          this.memberBasicDetailsModel.multipartFileListForMCRCopyPath = this.fileUploadService.getFile(this.memberBasicDetailsModel.mcrDocumentCopy, ERP_TRANSACTION_CONSTANTS.MEMBERSHIP + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.memberBasicDetailsModel.mcrDocumentCopy);
        }
        if (this.memberBasicDetailsModel.photoCopyPath != null && this.memberBasicDetailsModel.photoCopyPath != undefined) {
          this.memberBasicDetailsModel.multipartFileListForPhotoCopy = this.fileUploadService.getFile(this.memberBasicDetailsModel.photoCopyPath, ERP_TRANSACTION_CONSTANTS.MEMBERSHIP + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.memberBasicDetailsModel.photoCopyPath);
        }
        if (this.memberBasicDetailsModel.signedCopyPath != null && this.memberBasicDetailsModel.signedCopyPath != undefined) {
          this.memberBasicDetailsModel.multipartFileListsignedCopyPath = this.fileUploadService.getFile(this.memberBasicDetailsModel.signedCopyPath, ERP_TRANSACTION_CONSTANTS.MEMBERSHIP + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.memberBasicDetailsModel.signedCopyPath);
          this.isDisableSubmit = false;
        }
        else {
          this.isDisableSubmit = true;
        }
      }
    });
  }
  onClickMemberIndividualMoreDetails(){
    this.membreIndividualFlag = true;
    if(this.memberBasicDetailsModel.subProductId == 1){
      this.showForm = true
    }
    else{
      this.showForm = false
    }
  
  }
  onChangeShowCards(){
    this.showForm = false
  }
  onChangeTable(){
    this.showForm = true
  }

  closePhotoCopy() {
    this.memberPhotoCopyZoom = false;
  }
  onClickMemberPhotoCopy(){
    this.memberPhotoCopyZoom = true;
  }
  closePhoto(){
    this.memberPhotoCopyZoom = false;
  }
}
