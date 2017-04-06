export default {
  totalCols: {
    basicSourceView: [
      'ReportID', 'Reporter', 'Disease',
      'Country', 'DocumentCategory', 'Journal',
      'Title', 'Authors', 'YearOfPub',
      'Volume', 'Issue', 'PageFrom',
      'PageTo', 'AuthorContactNeeded', 'OpenAccess',
      'Checked', 'Note1'
    ],
    surveyView: [
      'SurveyID', 'BasicSourcesReportID', 'DataType',
      'SurveyType', 'MonthStart', 'MonthFinish',
      'YearStart', 'YearFinish', 'Note2'
    ],
    locationView: [
      'LocationID',
      'SurveyDescriptionBasicSourcesReportID',
      'SurveyDescriptionSurveyID',
      'ADM1', 'ADM2', 'ADM3',
      'PointName', 'PointType',
      'Latitude', 'Longitude',
      'GeoReferenceSources', 'Note3'
    ],
    diseaseView: [
      'DiseaseID', 'LocationInformationLocationID', 'Species',
      'DiagnosticSymptoms', 'DiagnosticBlood', 'DiagnosticSkin',
      'DiagnosticStool', 'NumSamples', 'NumSpecimen',
      'AgeLower', 'AgeUpper',
      'NumExamine', 'NumPositive', 'PercentPositive',
      'NumExamineMale', 'NumPositiveMale', 'PercentPositiveMale',
      'NumExamineFemale', 'NumPositiveFemale', 'PercentPositiveFemale',
      'Note4', 'LocationInformationLocationID1', 'LReportID',
      'LocationInformationSurveyDescriptionSurveyID'
    ],
    interventionView: [
      'InterventionID', 'Group', 'MonthsAfterBaseline',
      'Drug', 'FrequencyPerYear', 'PeriodMonths',
      'Coverage', 'OtherMethod', 'INumExamine',
      'INumPositive', 'IPercentPositive', 'INumExamineMale',
      'INumPositiveMale', 'IPercentPositiveMale', 'INumExamineFemale',
      'INumPositiveFemale', 'IPercentPositiveFemale', 'Note5',
      'DiseaseDataDiseaseID',
      'DiseaseDataLocationInformationLocationID1',
      'DiseaseDataLReportID',
      'DiseaseDataLocationInformationSurveyDescriptionSurveyID'
    ]
  }
}
