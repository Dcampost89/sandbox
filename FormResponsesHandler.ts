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
    Logger.log("onFormSubmitHandler");
    const form = e.source;
    const formResponses = e.response;
    const itemResponses = formResponses.getItemResponses();

    itemResponses.forEach(element => {
      Logger.log(
        "question %s of type %s answer %s",
        element.getItem().getTitle(),
        element.getItem().getType(),
        element.getResponse()
      );
    });

    this.formResponsesFile = SpreadsheetApp.openById(form.getDestinationId());
    const responsesSheet = this.getResponsesSheet(itemResponses);

    if (this.formType == FORM_TYPES.ENGINEER) {
      const newRowToAppend = this.fetchEngineersFormResponses(itemResponses);
      responsesSheet.appendRow(newRowToAppend);
    } else {
      const newRowsToAppend = this.fetchPmAndDmFormResponses(itemResponses);
      newRowsToAppend.forEach(element => {
        responsesSheet.appendRow(element);
      });
    }
    this.setSumColumColorFormat(responsesSheet);
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

  private fetchPmAndDmFormResponses(responses: any[]) {
    const rows: any[][] = [];
    const engineers = this.fetchEngineersByProject(responses[0].getResponse());
    for (let i = 0; i < engineers.length; i++) {
      const row: any[] = [];
      let total: number = 0;
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

    const greenRule = SpreadsheetApp.newConditionalFormatRule()
      .whenNumberGreaterThanOrEqualTo(33)
      .setBackground("#32CD32")
      .setRanges([range])
      .build();

    const yellowRule = SpreadsheetApp.newConditionalFormatRule()
      .whenNumberBetween(25, 32)
      .setBackground("#FFFFE0")
      .setRanges([range])
      .build();

    const redRule = SpreadsheetApp.newConditionalFormatRule()
      .whenNumberLessThanOrEqualTo(24)
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
        row.push(TITLES.EMAIL);
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
