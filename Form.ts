import {
  readDataFromSpreadsheet,
  readSpreadsheetDataFromKey,
  createSpreadsheet
} from "./utils";

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

  constructor(title, questionsSheetName, type, rootFolder) {
    this.title = title;
    this.questionsSheetName = questionsSheetName;
    this.formType = type;
    this.rootFolder = rootFolder;
    this.formDataFile = SpreadsheetApp.getActive();
    this.init();
  }

  private init() {
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
    this.createFormSections();
  }

  private createFormSections() {
    if (this.formType == FORM_TYPES.ENGINEER) {
      this.form
        .addTextItem()
        .setTitle(TITLES.EMAIL)
        .setRequired(true);
      const projectsListField = this.form
        .addListItem()
        .setTitle(TITLES.PROJECT_FIELD);
      const projectsList = this.fetchProjectsList();
      const choices = [];
      const section = this.generateFormSectionContent(TITLES.SECTION_TITLE);
      projectsList.forEach(project => {
        choices.push(projectsListField.createChoice(project[0], section));
      });
      projectsListField.setChoices(choices);
    } else {
      const projectsListField = this.form
        .addListItem()
        .setTitle(TITLES.PROJECT_FIELD);
      const projectsList = this.fetchProjectsList();
      const choices = [];
      projectsList.forEach(project => {
        const section = this.generateFormSectionContent(project[0]);
        choices.push(projectsListField.createChoice(project[0], section));
      });
      projectsListField.setChoices(choices);
    }
  }

  private generateFormSectionContent(title) {
    const section = this.form
      .addPageBreakItem()
      .setTitle(title)
      .setGoToPage(FormApp.PageNavigationType.SUBMIT);
    if (this.formType == FORM_TYPES.ENGINEER) {
      for (let i = 0; i < this.questions.length - 1; i++) {
        this.addMultipleChoiceField(this.questions[i]);
        this.addTextField(TITLES.TEXT_FIELD);
      }
      this.form
        .addTextItem()
        .setTitle(this.questions[this.questions.length - 1])
        .setRequired(true);
    } else {
      this.questions.forEach((question, index) => {
        if (index > 1) {
          this.addTableField(question, title);
        } else {
          this.addMultipleChoiceField(question);
        }
        this.addTextField(TITLES.TEXT_FIELD);
      });
    }
    return section;
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

  public getFormResponsesFile() {
    return this.formResponsesFile.getId();
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

  private addTableField(title, project) {
    const question = this.form.addGridItem().setTitle(title);
    const engineers = this.fetchEngineersByProject(project);
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
