/* import {
  readDataFromSpreadsheet,
  readSpreadsheetDataFromKey,
  createSpreadsheet
} from "./utils"; */

import { FORM_TYPES, SHEETS, FILES, TITLES } from "./constants";

export class Form {
  title: string;
  questions: [string];
  questionsSheetName: string;
  rootFolder: any;
  form: any;
  formDataFile: any;
  formQuestionsFile: any;
  formResponsesFile: any;
  formType: string;

  constructor(title, questionsSheetName, type) {
    this.title = title;
    this.questionsSheetName = questionsSheetName;
    this.formType = type;
    this.init();
  }

  private init() {
    this.rootFolder = DriveApp.getFoldersByName(FILES.ROOT_FOLDER).next();
    this.formDataFile = SpreadsheetApp.getActive();
    const formQuestions = this.rootFolder
      .getFilesByName(FILES.QUESTIONS_FILE)
      .next();
    this.formQuestionsFile = SpreadsheetApp.openById(formQuestions.getId());
    this.formResponsesFile = createSpreadsheet(`${this.title}-Responses`);
    this.fetchFormQuestions();
    this.createForm();
  }

  private createForm() {
    const data = readDataFromSpreadsheet(this.formDataFile, SHEETS.GENERAL);
    const title = readSpreadsheetDataFromKey(data, TITLES.TITLE);
    const desc = readSpreadsheetDataFromKey(data, TITLES.DESCRIPTION);
    this.form = FormApp.create(this.title)
      .setTitle(title)
      .setDescription(desc)
      .setConfirmationMessage(TITLES.CONFIRM_MESSAGE)
      .setDestination(
        FormApp.DestinationType.SPREADSHEET,
        this.formResponsesFile.getId()
      );
    if (this.formType === FORM_TYPES.ENGINEER) {
      this.form.setCollectEmail(true);
    }
    this.createFormSections();
    this.saveFormInRootFolder();
  }

  private createFormSections() {
    const projectsListField = this.form
      .addListItem()
      .setTitle(TITLES.PROJECT_FIELD);
    const projectsList = this.fetchProjectsList();
    const choices = [];
    if (this.formType === FORM_TYPES.ENGINEER) {
      const section = this.generateFormSectionContent(TITLES.SECTION_TITLE);
      projectsList.forEach(project => {
        choices.push(projectsListField.createChoice(project[0], section));
      });
    } else {
      projectsList.forEach(project => {
        const section = this.generateFormSectionContent(project[0]);
        choices.push(projectsListField.createChoice(project[0], section));
      });
    }
    projectsListField.setChoices(choices);
  }

  private generateFormSectionContent(title) {
    const section = this.form
      .addPageBreakItem()
      .setTitle(title)
      .setGoToPage(FormApp.PageNavigationType.SUBMIT);
    if (this.formType === FORM_TYPES.ENGINEER) {
      this.form
        .addTextItem()
        .setTitle(TITLES.EMAIL)
        .setRequired(true);
      this.questions.forEach(question => {
        this.addMultipleChoiceField(question);
        this.addTextField(TITLES.TEXT_FIELD);
      });
    } else {
      this.questions.forEach((question, index) => {
        if (index > 1) {
          this.addTableField(question);
        } else {
          this.addMultipleChoiceField(question);
        }
        this.addTextField(TITLES.TEXT_FIELD);
      });
    }
    return section;
  }

  private saveFormInRootFolder() {
    const formFile = DriveApp.getFileById(this.form.getId());
    const formResponsesFile = DriveApp.getFileById(
      this.formResponsesFile.getId()
    );
    this.rootFolder.addFile(formFile);
    this.rootFolder.addFile(formResponsesFile);
    DriveApp.removeFile(formFile);
    DriveApp.removeFile(formResponsesFile);
  }

  public getFormId() {
    return this.form.getId();
  }

  public getFormUrl() {
    return this.form.getPublishedUrl();
  }

  public getFormType() {
    return this.formType;
  }

  private fetchProjectsList() {
    const projects = readDataFromSpreadsheet(
      this.formDataFile,
      SHEETS.PROJECTS
    );
    return projects;
  }

  private fetchEngineersByProject(project) {
    const engineersList = readDataFromSpreadsheet(
      this.formDataFile,
      SHEETS.ENGINEERS
    );
    return engineersList.filter(row => row[2] === project);
  }

  private fetchFormQuestions() {
    const questions = readDataFromSpreadsheet(
      this.formQuestionsFile,
      this.questionsSheetName
    );

    this.questions = questions.map(row => row[0]);
  }

  private fetchFormQuestionsAnswers() {
    const answers = readDataFromSpreadsheet(this.formDataFile, SHEETS.ANSWERS);
    return answers;
  }

  private addMultipleChoiceField(title) {
    const question = this.form.addMultipleChoiceItem().setTitle(title);
    const answers = this.fetchFormQuestionsAnswers();
    const choices = [];
    answers.forEach(row => {
      choices.push(question.createChoice(row[0]));
    });
    question.setChoices(choices).setRequired(true);
    return question;
  }

  private addTableField(title) {
    const question = this.form.addGridItem().setTitle(title);
    const engineers = this.fetchEngineersByProject(title);
    const answers = this.fetchFormQuestionsAnswers();
    const rows = engineers.map(row => row[0]);
    const colums = answers.map(row => row[0]);
    question
      .setRows(rows)
      .setColumns(colums)
      .setRequired(true);
    return question;
  }

  private addTextField(title) {
    this.form.addTextItem().setTitle(title);
  }
}
