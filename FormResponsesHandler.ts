import { readDataFromSpreadsheet, readSpreadsheetDataFromKey } from "./utils";
import { FORM_TYPES, SHEETS, TITLES, SPREADSHEET_COLUMS } from "./constants";

export class FormResponsesHandler {
  formId: string;
  formType: string;
  colums: string[];
  formResponsesFile: any;

  constructor(formId, formType) {
    this.formId = formId;
    this.formType = formType;
  }

  public onFormSubmitHandler(e: any) {
    const form = e.source;
    const formResponses = e.response;
    const itemResponses = formResponses.getItemResponses();

    this.formResponsesFile = SpreadsheetApp.openById(form.getDestinationId());
    const responsesSheet = this.getResponsesSheet(itemResponses);

    if (this.formType == FORM_TYPES.ENGINEER) {
      const newRowToAppend = this.fetchEngineersFormResponses(itemResponses);
      responsesSheet.appendRow(newRowToAppend);
      this.setSumColumColorFormat(responsesSheet);
    } else {
      const respondentEmail = formResponses.getRespondentEmail();
      const newRowsToAppend = this.fetchPmAndDmFormResponses(
        itemResponses,
        respondentEmail
      );
      newRowsToAppend.forEach(element => {
        responsesSheet.appendRow(element);
        this.setSumColumColorFormat(responsesSheet);
      });
    }
  }

  private fetchEngineersFormResponses(responses: any[]) {
    const row: any[] = [];
    let total: number = 0;
    responses.forEach(element => {
      const resp: any = element.getResponse();
      if (element.getItem().getType() == "MULTIPLE_CHOICE") {
        const value = this.getResponseNumericValue(resp);
        row.push(value);
        total += value;
      } else {
        row.push(resp);
      }
    });
    row.push(total);
    return row;
  }

  private fetchPmAndDmFormResponses(responses: any[], respondentEmail: string) {
    const rows: any[][] = [];
    const engineers = this.fetchEngineersByProject(responses[0].getResponse());
    for (let i = 0; i < engineers.length; i++) {
      const row: any[] = [];
      let total: number = 0;
      row.push(respondentEmail);
      row.push(engineers[i][1]);
      responses.forEach(element => {
        let resp: any = element.getResponse();
        const respType: string = element.getItem().getType();
        if (respType == "GRID") {
          resp = resp[i];
          const value = this.getResponseNumericValue(resp);
          total += value;
          row.push(value);
        } else if (respType == "MULTIPLE_CHOICE") {
          const value = this.getResponseNumericValue(resp);
          total += value;
          row.push(value);
        } else {
          row.push(resp);
        }
      });
      row.push(total);
      rows.push(row);
    }
    return rows;
  }

  private setSumColumColorFormat(sheet: any) {
    const data = sheet.getDataRange().getValues();
    const lastRow = data.length;
    const lastColum = data[0].length - 1;
    const letterRange = SPREADSHEET_COLUMS[lastColum] + lastRow;
    const range = sheet.getRange(letterRange);

    let maxRange: number;
    let minRange: number;

    switch (this.formType) {
      case FORM_TYPES.PROJECT_MANAGER:
        maxRange = 33;
        minRange = 24;
      case FORM_TYPES.DELIVERY_MANAGER:
        maxRange = 28;
        minRange = 20;
      default:
        maxRange = 18;
        minRange = 11;
    }

    const greenRule = SpreadsheetApp.newConditionalFormatRule()
      .whenNumberGreaterThanOrEqualTo(maxRange)
      .setBackground("#32CD32")
      .setRanges([range])
      .build();

    const yellowRule = SpreadsheetApp.newConditionalFormatRule()
      .whenNumberBetween(minRange + 1, maxRange - 1)
      .setBackground("#FFFFE0")
      .setRanges([range])
      .build();

    const redRule = SpreadsheetApp.newConditionalFormatRule()
      .whenNumberLessThanOrEqualTo(minRange)
      .setBackground("#F08080")
      .setRanges([range])
      .build();

    const rules = sheet.getConditionalFormatRules();
    rules.push(greenRule);
    rules.push(yellowRule);
    rules.push(redRule);
    sheet.setConditionalFormatRules(rules);
  }

  private getResponsesSheet(responses: any[]) {
    let sheet: any;
    sheet = this.formResponsesFile.getSheetByName(SHEETS.FORM_RESPONSES);
    if (!sheet) {
      sheet = this.formResponsesFile.insertSheet(SHEETS.FORM_RESPONSES);
      const row = [];
      if (this.formType != FORM_TYPES.ENGINEER) {
        row.push(SHEETS.ENGINEERS);
        row.push(SHEETS.PROJECT_MANEGERS);
      }
      responses.forEach(element => {
        const question = element.getItem().getTitle();
        row.push(question);
      });
      row.push(TITLES.SUM);
      sheet.appendRow(row);
    }
    return sheet;
  }

  private getResponseNumericValue(response: string) {
    const spreadsheet = SpreadsheetApp.getActive();
    const responsesList = readDataFromSpreadsheet(spreadsheet, SHEETS.ANSWERS);
    const responseValue = readSpreadsheetDataFromKey(responsesList, response);
    return +responseValue;
  }

  private fetchEngineersByProject(project: string) {
    const spreadsheet = SpreadsheetApp.getActive();
    const engineersList = readDataFromSpreadsheet(
      spreadsheet,
      SHEETS.ENGINEERS
    );
    return engineersList.filter(row => row[2] === project);
  }
}
