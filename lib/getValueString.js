var util = require('../models/util.js')

function handleNullableElement (ele) {
  if (util.isEmpty(ele)) {
    return 'null'
  } else {
    return ele
  }
}

module.exports = function (types, data) {
  var valuesStr = ''
  switch (types) {
    case 0:
    case 'Basic Sources':
      let volumeData = util.isEmpty(data.Volume) ? 'null' : data.Volume
      let issueData = util.isEmpty(data.Issue) ? 'null' : data.Issue
      let pageFromData = util.isEmpty(data.PageFrom) ? 'null' : data.PageFrom
      let pageToData = util.isEmpty(data.PageTo) ? 'null' : data.PageTo
      valuesStr = [
        data.ReportID, data.Reporter, data.Disease,
        data.Country, data.DocumentCategory, data.Journal,
        data.Title, data.Authors, data.YearOfPub, volumeData,
        issueData, pageFromData, pageToData, data.AuthorContactNeeded,
        data.OpenAccess, handleNullableElement(data.Checked), handleNullableElement(data.Note1)
      ]
      break
    case 1:
    case 'Survey Description':
      valuesStr = [
        data.SurveyID, data.BasicSourcesReportID, data.DataType,
        data.SurveyType, handleNullableElement(data.MonthStart),
        handleNullableElement(data.MonthFinish),
        handleNullableElement(data.YearStart),
        handleNullableElement(data.YearFinish),
        handleNullableElement(data.Note2)
      ]
      break
    case 2:
    case 'Location Information':
      valuesStr = [
        data.LocationID, data.SurveyDescriptionBasicSourcesReportID,
        data.SurveyDescriptionSurveyID,
        handleNullableElement(data.ADM1), handleNullableElement(data.ADM2),
        handleNullableElement(data.ADM3), handleNullableElement(data.PointName),
        handleNullableElement(data.PointType), handleNullableElement(data.Latitude),
        handleNullableElement(data.Longitude), handleNullableElement(data.GeoReferenceSources),
        handleNullableElement(data.Note3)
      ]
      break
    case 3:
    case 'Disease Data':
      valuesStr = [data.DiseaseID, data.LocationInformationLocationID,
        data.Species, handleNullableElement(data.DiagnosticSymptoms),
        handleNullableElement(data.DiagnosticBlood),
        handleNullableElement(data.DiagnosticSkin),
        handleNullableElement(data.DiagnosticStool),
        handleNullableElement(data.NumSamples),
        handleNullableElement(data.NumSpecimen),
        handleNullableElement(data.AgeLower),
        handleNullableElement(data.AgeUpper),
        handleNullableElement(data.NumExamine),
        handleNullableElement(data.NumPositive),
        handleNullableElement(data.PercentPositive),
        handleNullableElement(data.NumExamineMale),
        handleNullableElement(data.NumPositiveMale),
        handleNullableElement(data.PercentPositiveMale),
        handleNullableElement(data.NumExamineFemale),
        handleNullableElement(data.NumPositiveFemale),
        handleNullableElement(data.PercentPositiveFemale),
        handleNullableElement(data.Note4), data.LocationInformationLocationID1, data.LReportID,
        data.LocationInformationSurveyDescriptionSurveyID
      ]
      break
    case 4:
    case 'Intervention Data':
      valuesStr = [
        data.InterventionID, handleNullableElement(data.Group),
        handleNullableElement(data.MonthsAfterBaseline),
        handleNullableElement(data.Drug),
        handleNullableElement(data.FrequencyPerYear),
        handleNullableElement(data.PeriodMonths),
        handleNullableElement(data.Coverage),
        handleNullableElement(data.OtherMethod),
        handleNullableElement(data.INumExamine),
        handleNullableElement(data.INumPositive),
        handleNullableElement(data.IPercentPositive),
        handleNullableElement(data.INumExamineMale),
        handleNullableElement(data.INumPositiveMale),
        handleNullableElement(data.IPercentPositiveMale),
        handleNullableElement(data.INumExamineFemale),
        handleNullableElement(data.INumPositiveFemale),
        handleNullableElement(data.IPercentPositiveFemale),
        handleNullableElement(data.Note5),
        data.DiseaseDataDiseaseID, data.DiseaseDataLocationInformationLocationID1,
        data.DiseaseDataLReportID, data.DiseaseDataLocationInformationSurveyDescriptionSurveyID
      ]
      break
  }
  return valuesStr
}
