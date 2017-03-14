module.exports = {
  //  设置统一的表格格式
  getBasicSources (originObj) {
    return {
      ReportID: originObj['ReportID'],
      Reporter: originObj['Reporter'],
      Disease: originObj['Disease'],
      Country: originObj['Country'],
      DocumentCategory: originObj['Document Category'],
      Journal: originObj['Journal'],
      Title: originObj['Title'],
      Authors: originObj['Authors'],
      YearOfPub: originObj['Year of Pub'],
      Volume: originObj['Volume'],
      Issue: originObj['Issue'],
      PageFrom: originObj['Page from'],
      PageTo: originObj['Page to'],
      AuthorContactNeeded: originObj['Author contact needed'],
      OpenAccess: originObj['Open access'],
      Checked: originObj['checked'],
      Note1: originObj['note1']
    }
  },
  getSurvey (originObj) {
    return {
      SurveyID: originObj['SurveyID'],
      BasicSourcesReportID: originObj['Basic sources_ReportID'],
      DataType: originObj['Data type'],
      SurveyType: originObj['Survey type'],
      MonthStart: originObj['Month start'],
      MonthFinish: originObj['Month finish'],
      YearStart: originObj['Year start'],
      YearFinish: originObj['Year finish'],
      Note2: originObj['note2']
    }
  },
  getLocation (originObj) {
    return {
      LocationID: originObj['LocationID'],
      SurveyDescriptionBasicSourcesReportID: originObj['Survey description_Basic sources_ReportID'],
      SurveyDescriptionSurveyID: originObj['Survey description_SurveyID'],
      ADM1: originObj['ADM1'],
      ADM2: originObj['ADM2'],
      ADM3: originObj['ADM3'],
      PointName: originObj['Point name'],
      PointType: originObj['Point type'],
      Latitude: originObj['Latitude'],
      Longitude: originObj['Longitude'],
      GeoReferenceSources: originObj['Geo-reference sources'],
      Note3: originObj['note3']
    }
  },
  getDisease (originObj) {
    return {
      DiseaseID: originObj['DiseaseID'],
      LocationInformationLocationID: originObj['Location information_LocationID'],
      Species: originObj['Species'],
      DiagnosticSymptoms: originObj['Diagnostic_symptoms'],
      DiagnosticBlood: originObj['Diagnostic_blood'],
      DiagnosticSkin: originObj['Diagnostic_skin'],
      DiagnosticStool: originObj['Diagnostic_stool'],
      NumSamples: originObj['Num_samples'],
      NumSpecimen: originObj['Num_specimen'],
      AgeLower: originObj['AgeLower'],
      AgeUpper: originObj['AgeUpper'],
      NumExamine: originObj['Num_examine'],
      NumPositive: originObj['Num_positive'],
      PercentPositive: originObj['Percent_positive'],
      NumExamineMale: originObj['Num_examine_male'],
      NumPositiveMale: originObj['Num_positive_male'],
      PercentPositiveMale: originObj['Percent_positive_male'],
      NumExamineFemale: originObj['Num_examine_female'],
      NumPositiveFemale: originObj['Num_positive_female'],
      PercentPositiveFemale: originObj['Percent_positive_female'],
      Note4: originObj['note4'],
      LocationInformationLocationID1: originObj['Location information_LocationID1'],
      LReportID: originObj['L_ReportID'],
      LocationInformationSurveyDescriptionSurveyID: originObj['Location information_Survey description_SurveyID']
    }
  },
  getIntervention (originObj) {
    return {
      InterventionID: originObj['InterventionID'],
      Group: originObj['Group'],
      MonthsAfterBaseline: originObj['Months after baseline'],
      Drug: originObj['Drug'],
      FrequencyPerYear: originObj['Frequency per year'],
      PeriodMonths: originObj['Period (months)'],
      Coverage: originObj['Coverage'],
      OtherMethod: originObj['Other method'],
      INumExamine: originObj['I_Num_examine'],
      INumPositive: originObj['I_Num_positive'],
      IPercentPositive: originObj['I_Percent_positive'],
      INumExamineMale: originObj['I_Num_examine_male'],
      INumPositiveMale: originObj['I_Num_positive_male'],
      IPercentPositiveMale: originObj['I_Percent_positive_male'],
      INumExamineFemale: originObj['I_Num_examine_female'],
      INumPositiveFemale: originObj['I_Num_positive_female'],
      IPercentPositiveFemale: originObj['I_Percent_positive_female'],
      Note5: originObj['note5'],
      DiseaseDataDiseaseID: originObj['Disease data_DiseaseID'],
      DiseaseDataLocationInformationLocationID1: originObj['Disease data_Location information_LocationID1'],
      DiseaseDataLReportID: originObj['Disease data_L_ReportID'],
      DiseaseDataLocationInformationSurveyDescriptionSurveyID: originObj['Disease data_Location information_Survey description_SurveyID']
    }
  }
}
