import { Form } from "./Form";
import { FormResponsesHandler } from "./FormResponsesHandler";
import { Email } from "./Email";
import { FORM_TYPES, SHEETS, TITLES } from "./constants";
import { setFormSubmitTrigger, readDataFromSpreadsheet } from "./utils";

function createEngineersW2Form() {
  const newForm = new Form(
    TITLES.FORMS.ENGINEER_FORM_WEEK_2,
    SHEETS.QUESTIONS.ENGINEER_WEEK_2,
    FORM_TYPES.ENGINEER
  );

  setFormSubmitTrigger("engineersFormResponsesHandler", newForm.getFormId());

  const engineers = readDataFromSpreadsheet(
    SpreadsheetApp.getActive(),
    SHEETS.ENGINEERS
  );
  const recipients = engineers.map(row => row[1]).join(",");
  const email = new Email(
    recipients,
    "Project Health Check for Wizeline Teams",
    "engineers_email.html",
    newForm.getFormUrl()
  );
  email.sendEmail();
}

function createProjectManagerW2Form() {
  const newForm = new Form(
    TITLES.FORMS.PROJECT_MANAGER_WEEK_2,
    SHEETS.QUESTIONS.PROJECT_MANAGER_WEEK_2,
    FORM_TYPES.PROJECT_MANAGER
  );

  setFormSubmitTrigger("pmAndDmFormResponsesHandler", newForm.getFormId());
}

function engineersFormResponsesHandler(e) {
  Logger.log("engineersFormResponsesHandler");
  const form = e.source;
  const responsesHandler = new FormResponsesHandler(
    form.getId(),
    FORM_TYPES.ENGINEER
  );
  responsesHandler.onFormSubmitHandler(e);
}

function pmAndDmFormResponsesHandler(e) {
  Logger.log("pmAndDmFormResponsesHandler");
  const form = e.source;
  const responsesHandler = new FormResponsesHandler(
    form.getId(),
    FORM_TYPES.PROJECT_MANAGER
  );
  responsesHandler.onFormSubmitHandler(e);
}
