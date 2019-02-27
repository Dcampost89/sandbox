import { Form } from "./Form";
import { FormResponsesHandler } from "./FormResponsesHandler";
import { FolderStructure } from "./FolderStructure";
import { Email } from "./Email";
import { FORM_TYPES, SHEETS, TITLES } from "./constants";
import { setFormSubmitTrigger, readDataFromSpreadsheet } from "./utils";

function createEngineersW2Form() {
  const folderStructure = new FolderStructure();
  if (!folderStructure.getRootFolder()) {
    Logger.log("The root folder was not found");
    return;
  }
  // const newForm = new Form(
  //   TITLES.FORMS.ENGINEER_FORM_WEEK_2,
  //   SHEETS.QUESTIONS.ENGINEER_WEEK_2,
  //   FORM_TYPES.ENGINEER,
  //   folderStructure.getRootFolder()
  // );

  // folderStructure.saveFileInFolder(newForm.getFormId());
  // folderStructure.saveFileInFolder(newForm.getFormResponsesFile());

  // setFormSubmitTrigger("engineersFormResponsesHandler", newForm.getFormId());

  // const engineers = readDataFromSpreadsheet(
  //   SpreadsheetApp.getActive(),
  //   SHEETS.ENGINEERS
  // );
  // const recipients = engineers.map(row => row[1]).join(",");
  // const email = new Email(
  //   recipients,
  //   "Project Health Check for Wizeline Teams",
  //   "engineers_email.html",
  //   newForm.getFormUrl()
  // );
  // email.sendEmail();
}

function createProjectManagerW2Form() {
  const folderStructure = new FolderStructure();
  if (!folderStructure.getRootFolder()) {
    Logger.log("The root folder was not found");
    return;
  }
  const newForm = new Form(
    TITLES.FORMS.PROJECT_MANAGER_WEEK_2,
    SHEETS.QUESTIONS.PROJECT_MANAGER_WEEK_2,
    FORM_TYPES.PROJECT_MANAGER,
    folderStructure.getRootFolder()
  );

  folderStructure.saveFileInFolder(newForm.getFormId());
  folderStructure.saveFileInFolder(newForm.getFormResponsesFile());

  setFormSubmitTrigger(
    "projectManagersFormResponsesHandler",
    newForm.getFormId()
  );

  const projectManagers = readDataFromSpreadsheet(
    SpreadsheetApp.getActive(),
    SHEETS.PROJECT_MANEGERS
  );
  const recipients = projectManagers.map(row => row[1]).join(",");

  const email = new Email(
    recipients,
    "Project Health Check for Wizeline Teams",
    "pm_dm_email.html",
    newForm.getFormUrl()
  );
  email.sendEmail();
}

function createDeliveryManagerForm() {
  const folderStructure = new FolderStructure();
  if (!folderStructure.getRootFolder()) {
    Logger.log("The root folder was not found");
    return;
  }

  const newForm = new Form(
    TITLES.FORMS.DELIVERY_MANAGER,
    SHEETS.QUESTIONS.DELIVERY_MANAGER,
    FORM_TYPES.DELIVERY_MANAGER,
    folderStructure.getRootFolder()
  );

  folderStructure.saveFileInFolder(newForm.getFormId());
  folderStructure.saveFileInFolder(newForm.getFormResponsesFile());

  setFormSubmitTrigger(
    "deliveryManagersFormResponsesHandler",
    newForm.getFormId()
  );

  const deliveryManagers = readDataFromSpreadsheet(
    SpreadsheetApp.getActive(),
    SHEETS.DELIVERY_MANAGERS
  );
  const recipients = deliveryManagers.map(row => row[1]).join(",");

  const email = new Email(
    recipients,
    "Project Health Check for Wizeline Teams",
    "pm_dm_email.html",
    newForm.getFormUrl()
  );
  email.sendEmail();
}

function engineersFormResponsesHandler(e) {
  const form = e.source;
  const responsesHandler = new FormResponsesHandler(
    form.getId(),
    FORM_TYPES.ENGINEER
  );
  responsesHandler.onFormSubmitHandler(e);
}

function projectManagersFormResponsesHandler(e) {
  const form = e.source;
  const responsesHandler = new FormResponsesHandler(
    form.getId(),
    FORM_TYPES.PROJECT_MANAGER
  );
  responsesHandler.onFormSubmitHandler(e);
}

function deliveryManagersFormResponsesHandler(e) {
  const form = e.source;
  const responsesHandler = new FormResponsesHandler(
    form.getId(),
    FORM_TYPES.DELIVERY_MANAGER
  );
  responsesHandler.onFormSubmitHandler(e);
}
