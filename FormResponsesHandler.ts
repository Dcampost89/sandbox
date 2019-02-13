import { readDataFromSpreadsheet, readSpreadsheetDataFromKey } from "./utils";
import { FORM_TYPES, SHEETS, TITLES } from "./constants";

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
        "question %s answer %s",
        element.getItem().getTitle(),
        element.getResponse()
      );
    });

    this.formResponsesFile = SpreadsheetApp.openById(form.getDestinationId());
    const responsesSheet = this.getResponsesSheet(itemResponses);

    if (this.formType === FORM_TYPES.ENGINEER) {
      const newRowToAppend = this.fetchEngineersFormResponses(itemResponses);
      responsesSheet.appendRow(newRowToAppend);
    } else {
      const newRowsToAppend = this.fetchPmAndDmFormResponses(itemResponses);
      newRowsToAppend.forEach(element => {
        responsesSheet.push(element);
      });
    }
  }

  private fetchEngineersFormResponses(responses: any[]) {
    const row: any[] = [];
    let total: number = 0;
    responses.forEach(element => {
      if (element.getItem().getType() !== "TEXT") {
        const value = this.getResponseNumericValue(element.getResponse());
        row.push(value);
        total += value;
      } else {
        row.push(element.getResponse());
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
      responses.forEach(element => {
        let resp: any = element.getResponse();
        const respType = element.getItem().getType();
        if (respType === "GRID") {
          resp = resp[i];
        }
        if (respType !== "TEXT") {
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

  private getResponsesSheet(responses: any[]) {
    let sheet: any;
    sheet = this.formResponsesFile.getSheetByName(SHEETS.FORM_RESPONSES);
    if (!sheet) {
      sheet = this.formResponsesFile.insertSheet(SHEETS.FORM_RESPONSES);
      const row = [];
      if (this.formType !== FORM_TYPES.ENGINEER) {
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
