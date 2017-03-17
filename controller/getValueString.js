var util = require('../models/util.js')

module.exports = function (types, data) {
  var valuesStr = ''
  switch (types) {
    case 'Basic Sources':
      console.log(data)
      let volumeData = util.isEmpty(data.Volume) ? 'null' : data.Volume
      let issueData = util.isEmpty(data.Issue) ? 'null' : data.Issue
      let pageFromData = util.isEmpty(data.PageFrom) ? 'null' : data.PageFrom
      let pageToData = util.isEmpty(data.PageTo) ? 'null' : data.PageTo
      valuesStr = [
        data.ReportID, data.Reporter, data.Disease,
        data.Country, data.DocumentCategory, data.Journal,
        data.Title, data.Authors, data.YearOfPub, volumeData,
        issueData, pageFromData, pageToData, data.AuthorContactNeeded,
        data.OpenAccess, data.Checked, data.Note1
      ]
      break
    case 'Survey Description':
      valuesStr = [
        data.SurveyID, data.BasicSourcesReportID, data.DataType,
        data.SurveyType, data.MonthStart, data.MonthFinish, data.YearStart,
        data.YearFinish, data.Note2
      ]
      break
    case 'Location Information':
      valuesStr = [data.LocationID, data.SurveyDescriptionBasicSourcesReportID,
        data.SurveyDescriptionSurveyID, data.ADM1, data.ADM2,
        data.ADM3, data.PointName, data.PointType, data.Latitude,
        data.Longitude, data.GeoReferenceSources, data.Note3
      ]
      break
    case 'Disease Data':
      valuesStr = [data.DiseaseID, data.LocationInformationLocationID,
        data.Species, data.DiagnosticSymptoms, data.DiagnosticBlood,
        data.DiagnosticSkin, data.DiagnosticStool, data.NumSamples,
        data.NumSpecimen, data.AgeLower, data.AgeUpper,
        data.NumExamine, data.NumPositive, data.PercentPositive,
        data.NumExamineMale, data.NumPositiveMale, data.PercentPositiveMale,
        data.NumExamineFemale, data.NumPositiveFemale, data.PercentPositiveFemale,
        data.Note4, data.LocationInformationLocationID1, data.LReportID,
        data.LocationInformationSurveyDescriptionSurveyID
      ]
      break
    case 'Intervention Data':
      valuesStr = [
        data.InterventionID, data.Group, data.MonthsAfterBaseline,
        data.Drug, data.FrequencyPerYear, data.PeriodMonths, data.Coverage,
        data.OtherMethod, data.INumExamine, data.INumPositive, data.IPercentPositive,
        data.INumExamineMale, data.INumPositiveMale, data.IPercentPositiveMale,
        data.INumExamineFemale, data.INumPositiveFemale, data.IPercentPositiveFemale,
        data.Note5, data.DiseaseDataDiseaseID, data.DiseaseDataLocationInformationLocationID1,
        data.DiseaseDataLReportID, data.DiseaseDataLocationInformationSurveyDescriptionSurveyID
      ]
      break
  }
  return valuesStr
}
