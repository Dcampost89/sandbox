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
  PROJECT_MANEGERS: "Project Managers",
  DELIVERY_MANAGERS: "Delivery Managers",
  FORM_RESPONSES: "Responses",
  QUESTIONS: {
    ENGINEER_WEEK_1: "EngineersW1",
    ENGINEER_WEEK_2: "EngineersW2",
    PROJECT_MANAGER_WEEK_1: "ProjectManagersW1",
    PROJECT_MANAGER_WEEK_2: "ProjectManagersW2",
    DELIVERY_MANAGER: "DeliveryManagers"
  }
};

const FILES = {
  ROOT_FOLDER: "Sandbox",
  QUESTIONS_FILE: "HealthReportsQuestions"
};

const TITLES = {
  TITLE: "Title",
  DESCRIPTION: "Description",
  ROOT_FOLDER: "Root Folder",
  PROJECT_FIELD: "Project",
  CONFIRM_MESSAGE: "Confirmation",
  SECTION_TITLE: "Project Health",
  TEXT_FIELD:
    "If you answered 'Strongly Disagree' or 'Disagree', can you say a bit more?",
  SUM: "SUM",
  EMAIL: "Email Address",
  FORMS: {
    ENGINEER_FORM_WEEK_1: "Health Report Engineers - W1",
    ENGINEER_FORM_WEEK_2: "Health Report Engineers - W2",
    PROJECT_MANAGER_WEEK_1: "Health Report Project Managers - W1",
    PROJECT_MANAGER_WEEK_2: "Health Report Project Managers - W2",
    DELIVERY_MANAGER: "Health Report Delivery Managers"
  }
};

export { FORM_TYPES, SPREADSHEET_COLUMS, SHEETS, FILES, TITLES };
