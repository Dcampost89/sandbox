const createSpreadsheet = name => {
  let newSpreadSheet = SpreadsheetApp.create(name);
  return newSpreadSheet;
};

const readDataFromSpreadsheet = (spreadSheet, sheet) => {
  const desiredSheet = spreadSheet.getSheetByName(sheet);
  let data = [];
  if (desiredSheet) {
    data = desiredSheet.getDataRange().getValues();
    data.shift();
  }
  return data;
};

const readSpreadsheetDataFromKey = (data: string[], key: string) => {
  let value = data.filter(row => {
    return row[0] === key;
  });
  return value.length > 0 ? value[0][1] : null;
};

const setFormSubmitTrigger = (handlerFunction: string, formId: string) => {
  ScriptApp.newTrigger(handlerFunction)
    .forForm(formId)
    .onFormSubmit()
    .create();
};

const findFileAndRemove = fileName => {
  const fileIterator = DriveApp.getFilesByName(fileName);
  if (fileIterator.hasNext()) {
    const fileToRemove = fileIterator.next();
    DriveApp.removeFile(fileToRemove);
  }
};

const displayAlert = msg => {
  SpreadsheetApp.getUi().alert(msg);
};

export {
  createSpreadsheet,
  readDataFromSpreadsheet,
  readSpreadsheetDataFromKey,
  setFormSubmitTrigger,
  displayAlert,
  findFileAndRemove
};
