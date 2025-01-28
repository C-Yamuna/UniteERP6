export class MembershipBasicDetails {

	id : any;

	memberTypeId : any;

	surname : any;

	name : any;

	dob : any;

	age : any;

	genderId : any;

	martialId : any;

	relationId : any;

	relativeName : any;

	qualificationId : any;

	occupationId : any;

	aadharNumber : any;

	panNumber : any;

	mobileNumber : any;

	emailId : any;

	casteId : any;

	communityId : any;

	mcrNumber : any;

	admissionDate : any;

	admissionNumber : any;

	admissionFee : any;

	memStatus : any;

	memStartDate : any;

	isMemClosed : any;

	closureComments : any;

	pacsId : any;

	pacsCode : any;

	memClosingDate : any;

	shareCapital : any;

	branchId : any;

	surnameLocalLang : any;

	nameLocalLang : any;

	isMinor : any;

	totalLandInUnits : any;

	totalLandInSubUnits : any;

	dependentsCount : any;

	assetCount : any;

	isNominee : any;

	memberName : any;

	genderName : any;

	maritalStatusName : any;

	relationTypeName : any;

	occupationName : any;

	memberTypeName : any;

	qualificationName : any;

	communityName : any;

	casteName : any;

	statusName : any;

	status : any;

	approvedComments : any;

	approvedBy : any;

	approvedOn : any;

	subProductId : any;

	memStatusChangedDate : any;

	subProductName : any;

	memberClassType : any;

	memberClassTypeName : any;

	mcrDocumentCopy : any;

	siLoanCommunicationDTOList : any;

	siLoanKycDetailsDTOList : any;

	memberShipCommunicationDetailsDTOList : any;

	memberShipKycDetailsDTOList : any;

	tempAdmissionNumber : any;

	gender : any;

	photoCopyPath : any;

	signatureCopyPath : any;

	isKycApproved : any;

	filesDTOList : any;

	isNewMember : any;

	memStatusName : any;

    multipartFileListForPhotoCopy: any;

    multipartFileListForsignatureCopyPath: any;

    ciLoanCommunicationDTOList:any;

    ciLoanKycDetailsList:any;

    isStaff:any;

    memberShipCommunicationDetailsDTO:any;
    admissionDateVal: any;
    dobVal: any;
}

export class MembershipGroupDetails {

    id : any;

    memberTypeId : any;

    groupName : any;

    registrationDate : any;

    registrationNumber : any;

    groupTypeId : any;

    admissionDate : any;

    admissionNumber : any;
    
    tempAdmissionNumber : any;

    name : any;

    mobileNumber : any;

    emailId : any;

    panNumber : any;

    gstNumber : any;

    tanNumber : any;

    groupStatus : any;

    isGroupClosed : any;

    closureDate : any;

    closureComments : any;

    promoterCount : any;

    pacsId : any;

    pacsCode : any;

    branchId : any;
    
    memberTypeName : any;
    
    groupStatusName : any;
    
    status : any;
    
    statusName : any;
    
    pocName : any;
    
    subProductId : any;

	subProductName : any;

	isKycCompleted : any;

	memStatusChangedDate : any;

	memberClassType : any;

	memberClassTypeName : any;
	
	pocNumber : any;
    
    groupPromotersDTOList : any;
    
    groupKycList : any;
    
    siLoanKycDetailsDTOList : any;

	isNewMember : any;
    
	isKycApproved : any;

    filesDTOList:any;

    signatureCopyPath:any;
  admissionDateVal: any;
  registrationDateVal: any;
  groupPromoterList: any;
}

export class MemInstitutionDetails {

    id : any;

    memberTypeId : any;

    institutionName : any;

    registrationDate : any;

    registrationNumber : any;

    admissionDate : any;

    admissionNumber : any;
    
    tempAdmissionNumber : any;

    name : any;

    mobileNumber : any;

    panNumber : any;

    pan : any;

    gstNumber : any;

    tanNumber : any;

    institution : any;

    status : any;

    pacsId : any;

    pacsCode : any;

    isInstAccountClosed : any;

    closureDate : any;

    closureComments : any;

    incorporationTypeId : any;

    branchId : any;

    emailId : any;

    promoterCount : any;
        
    memberTypeName : any;
    
    statusName : any;
    
    isInstAccountClosedName : any;
    
    pocName : any;
    
    institutionStatus : any;
    
    pocNumber : any;
    
    memberClassType : any;
    
    isKycCompleted : any;
    
    institutionPromoterDetailsDTOList : any;
    
    institutionKycDetailsDTOList : any;

    institutionStatusName : any;

    isNewMember:any;

    filesDTOList:any;

    signatureCopyPath: any;
    admissionDateVal: any;
    registrationDateVal: any;
    institutionPromoterList: any;
}


export class GroupPromoterDetails {

    id : any;

    groupId : any;

    operatorTypeId : any;

    surname : any;

    name : any;

    dob : any;

    age : any;

    aadharNumber : any;

    mobileNumber : any;

    emailId : any;

    docFilePath : any;

    pacsId : any;

    pacsCode : any;

    startDate : any;

    genderId : any;

    martialId : any;

    endDate : any;

    branchId : any;

    isGroupLeader : any;
    
    operationTypeName : any;
    
    genderName : any;
    
    maritalStatusName : any;
    
    status : any;
    
    statusName : any;
    uniqueId: any;
    filesDTOList: any;
    uploadImage: any;
    uploadSignature: any;
    memDobVal: any;
    startDateVal: any;
    filesDTO: any;

    isExistingMember : any;

    admissionNumber:any;

    authorizedSignatory: any;
    
    multipartFileListForSignatureCopyPath:any;

    multipartFileListForPhotoCopyPath:any;


}

export class InstitutionPromoterDetails {

    id : any;

    institutionId : any;

    operatorTypeId : any;

    surname : any;

    name : any;
    
    isExistingMember :any;

    admissionNumber :any;

    dob : any;

    memDobVal:any;

    age : any;

    genderId : any;

    martialId : any;

    aadharNumber : any;

    mobileNumber : any;

    emailId : any;

    docFilePath : any;

    pacsId : any;

    pacsCode : any;

    startDate : any;

    startDateVal : any;

    endDate : any;

    endDateVal : any;

    branchId : any;
    
    operatorTypeName : any;
    
    genderTypeName : any;
    
    maritalStatusName : any;
    
    status : any;
    
    statusName : any;
  filesDTOList: any ;
  uploadImage: any;
  uploadSignature: any;

  filesDTO: any;

  uniqueId :any;

  authorizedSignatory: any;

  multipartFileListForSignatureCopyPath:any;

  multipartFileListForPhotoCopyPath:any;
}