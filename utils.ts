const createSpreadsheet = name => {
  let newSpreadSheet = SpreadsheetApp.create(name);
  return newSpreadSheet;
};

const readDataFromSpreadsheet = (spreadSheet, sheet) => {
  let data = spreadSheet
    .getSheetByName(sheet)
    .getDataRange()
    .getValues();
  data.shift();
  return data;
};

const readSpreadsheetDataFromKey = (data: [string], key: string) => {
  let value = data.filter(row => {
    return row[0] === key;
  });
  return value[0][1];
};

const setFormSubmitTrigger = (handlerFunction: string, formId: string) => {
  ScriptApp.newTrigger(handlerFunction)
    .forForm(formId)
    .onFormSubmit()
    .create();
};

export {
  createSpreadsheet,
  readDataFromSpreadsheet,
  readSpreadsheetDataFromKey,
  setFormSubmitTrigger
};
