export class TermApplication {
    id: any;

    pacsId: any;

    pacsCode: any;

    branchId: any;

    termProductId: any;

    sanctionAmount: any;

    accountNumber: any;

    admissionNo: any;

    admissionNoAsperLedger: any;

    applicationDate: any;

    sanctionDate: any;

    ledgerFolioNumber: any;

    cropType: any;

    serveryNo: any;

    totalLandUnits: any;

    toatlLandSubUints: any;

    accountStatus: any;

    foreclosureDate: any;

    loanPeriod: any;

    firstInstallmentDueOn: any;

    installmentAmount: any;

    gestationPeriod: any;

    loanDueDate: any;

    loanApprovedDate: any;

    plannedDisbursements: any;

    remarks: any;

    applicationPath: any;

    completedDisbursements: any;

    insuranceApplicable: any;

    fatherSpouseName: any;

    acNoAsperLedger: any;

    isKycCompleted: any;

    requestedAmount: any;

    effectiveRoi: any;

    memberName: any;

    dccbAccountNumber: any;

    seasonType: any;

    purposeId: any;

    villageId: any;

    villageName: any;

    soilType: any;

    isCapitalization: any;

    totalDisbursedAmount: any;

    filesDTO: any;

    statusName: any;

    gender: any;


    loanMortgageDetailsDTOList: any;

    collateralType: any;

    collateralTypeName: any;

    accountStatusName: any;

    repaymentFrequency: any;

    repaymentFrequencyName: any;

    interestCalculationType: any;

    foreclosureFilePath: any;

    isSameInstallment: any;

    penalInterest: any;

    iod: any;

    purposeName: any;

    operationTypeId: any;

    operationTypeName: any;

    cgstAmount: any;

    sgstAmount: any;

    igstAmount: any;

    totalCharges: any;

    termMemberGuardianDetailsDTO: any;
    termChargesCollectionDetailsDTOList: any;

    termLoanGoldMortgageDetailsDTOList: any;

    termLoanLandMortgageDetailsDTOList: any;

    termLoanVehicleMortgageDetailsDTOList: any;

    termBondsMortgageDetailsDTOList: any;

    termOtherMortgageDetailsDTOList: any;

    termStorageMortgageDetailsDTOList: any;

    termLoanDocumentsDetailsDTOList: any;

    termLoanNomineeDetailsDTO: any;

    termLoanGuarantorDetailsDTOList: any;

    termLoanInsuranceDetailsDTO: any;

    termLoanAppraiserDetailsDTOList: any;

    termFieldVerificationDetailsDTOList: any;

    termLoanDisbursementScheduleDTOList: any;

    termLoanGenealogyTreeDTOList: any;

    landType: any;

    totalOutstandingAmount: any;

    termProductName: any;

    saoLoanApplicationId: any;

    saoLoanAccNumber: any;

    memberTypeId: any;

    memberTypeName: any;

    seasonTypeName: any;

    landTypeName: any;

    cropTypeName: any;

    termLoanCommunicationDTO: any;

    memberGroupDetailsDTO: any;

    memberInstitutionDTO: any;

    termLoanCoApplicantDetailsDTOList: any;

    status: any;

    societyAccountNumber: any;

    resolutionNumber: any;

    borrowingsAcNum: any;

    individualMemberDetailsDTO: any;

    membershipKycDetailsList: any;

    applicationDateVal: any;

    sanctionDateVal: any;

    loanDueDateVal: any;

    accountTypeName: any;

    isNewMember: any;

    termLoanApplicationId: any;

    monthlyIncome: any;

    termLoanKycDetailsDTOList: any;

    multipartFileList: any [] = [];
    

}
export class TermLoanProductDefinition {
    id?: any;

    name?: any;

    description?: any;

    status?: any;

    gestationPeriod?: any;

    interestCalculationType?: any;

    effectiveStartDate?: any;

    endDate?: any;

    eligibleMInAmount?: any;

    eligibleMaxAmount?: any;

    minLoanPeriod?: any;

    maxLoanPeriod?: any;

    demandAlertDays?: any;

    defaulterAlertDays?: any;

    maxLoanAccountsAllowed?: any;

    loanLinkedshareCapitalApplicable?: any;

    noOfGuarantorsRequired?: any;

    isInsuranceAppicable?: any;

    minDaysForRenewel?: any;

    pacsId?: any;

    pacsCode?: any;

    branchId?: any;

    isNpaExceptional?: any;

    interestRateType?: any;

    statusName?: any;

    interestCalculationTypeName?: any;

    nomineeRequired?: any;

    termInterestPolicyConfigDTO?: any;

    termLoanLinkedSharecapitalConfigList?: any;

    termRequiredDocumentsConfigDTOList?: any;

    termProductChargesConfigDTOList?: any;

    termApportionConfigDTOList?: any;

    termProdCollateralsConfigList?: any;

    termProdPurPoseConfgList?: any;

    termProductId?: any;

    termProductName?: any;

    interestPostingFrequency?: any;

    ledgerFolioNumber?: any;

    resolutionNumber?: any;

    termGLHeadMappingDTOList?: any;

    termInterestPolicyConfigDTOList?: any;
    
    interestPostingFrequencyName?: any;
}
export class TermLoanInterestPolicy {
    id?: any;

    termProductId?: any;

    roi?: any;

    penalInterest?: any;

    iodApplicable?: any;

    iod?: any;

    womenConcession?: any;

    employeeConcession?: any;

    seniorCitizenConcession?: any;

    effectiveStartDate?: any;

    endDate?: any;

    status?: any;

    statusName?: any;

    termProductName?: any;

    minSlabAmount?: any;

    maxSlabAmount?: any;
}
export class TermLoanInsuranceDetails {
    id?: any;

    pacsId?: any;

    branchId?: any;

    termProdcutId?: any;

    termLoanApplicationId?: any;

    cropId?: any;

    policyName?: any;

    policyNumber?: any;

    coverage?: any;

    insuranceType?: any;

    vendorId?: any;

    remarks?: any;

    cropName?: any;

    productName?: any;

    status?: any;
    
    statusName?: any;

    sumInsured?: any;

    premium?: any;
}

