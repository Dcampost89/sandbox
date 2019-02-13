import { Form } from "./Form";
import { FormResponsesHandler } from "./FormResponsesHandler";
import { FORM_TYPES, SHEETS, TITLES } from "./constants";
import { setFormSubmitTrigger } from "./utils";

function createEngineersW2Form() {
  const newForm = new Form(
    TITLES.ENGINEER_FORM_WEEK_2,
    SHEETS.QUESTIONS.ENGINEER_WEEK_2,
    FORM_TYPES.ENGINEER
  );

  setFormSubmitTrigger("engineersFormResponsesHandler", newForm.getFormId());
}

function engineersFormResponsesHandler(e) {
  Logger.log("formResponseHandler");
  const form = e.source;
  const responsesHandler = new FormResponsesHandler(
    form.getId(),
    FORM_TYPES.ENGINEER
  );

  responsesHandler.onFormSubmitHandler(e);
}
