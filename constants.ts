const FORM_TYPES = {
  ENGINEER: "engineer",
  PROJECT_MANAGER: "project-manager",
  DELIVERY_MANAGER: "delivery-manager"
};

const SPREADSHEET_COLUMS = [
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
  "M",
  "N",
  "O",
  "P",
  "Q",
  "R",
  "S",
  "T",
  "U",
  "V",
  "W",
  "X",
  "Y",
  "Z"
];

const SHEETS = {
  ENGINEERS: "Engineers",
  PROJECTS: "Projects",
  GENERAL: "General",
  ANSWERS: "Answers",
  PROJECT_MANEGERS: "ProjectManagers",
  FORM_RESPONSES: "Responses",
  QUESTIONS: {
    ENGINEER_WEEK_2: "EngineersW2",
    PROJECT_MANAGER_WEEK_2: "ProjectManagersW2"
  }
};

const FILES = {
  ROOT_FOLDER: "Sandbox",
  QUESTIONS_FILE: "HealthReportsQuestions"
};

const TITLES = {
  TITLE: "Title",
  DESCRIPTION: "Description",
  PROJECT_FIELD: "Project",
  CONFIRM_MESSAGE: "Gracias por llenar el formulario",
  SECTION_TITLE: "Project Health",
  TEXT_FIELD:
    "if you answered 'Strongly Disagree' or 'Disagree', can you say a bit more?",
  SUM: "SUM",
  EMAIL: "Email Address",
  FORMS: {
    ENGINEER_FORM_WEEK_2: "Health Report Engineers - W2",
    PROJECT_MANAGER_WEEK_2: "Health Report Project Managers - W2"
  }
};

export { FORM_TYPES, SPREADSHEET_COLUMS, SHEETS, FILES, TITLES };
