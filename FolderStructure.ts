import { readDataFromSpreadsheet, readSpreadsheetDataFromKey } from "./utils";
import { SHEETS, TITLES } from "./constants";

const months: string[] = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre"
];

export class FolderStructure {
  rootFolder: any;
  currentFolder: any;
  generalDataFile: any;

  constructor() {
    this.generalDataFile = SpreadsheetApp.getActive();
    this.rootFolder = this.setRootFolder();
    this.currentFolder = this.rootFolder;
    this.init();
  }

  init() {
    const today = new Date();
    const currentYear: number = today.getFullYear();
    const currentMonth: number = today.getMonth();

    const currentMonthFolderName = `${months[currentMonth]}/${currentYear}`;

    if (!this.folderExists(currentMonthFolderName)) {
      this.createFolder(currentMonthFolderName);
    }

    this.moveToFolder(currentMonthFolderName);

    const currentWeekFolderName = this.getCurrentWeekFolderName();
    if (!this.folderExists(currentWeekFolderName)) {
      this.createFolder(currentWeekFolderName);
    }

    this.moveToFolder(currentWeekFolderName);
  }

  private setRootFolder() {
    const currentFile = DriveApp.getFileById(this.generalDataFile.getId());
    const parentFoldersIterator = currentFile.getParents();
    const rootFolder = parentFoldersIterator.next();
    return rootFolder;
  }

  private getCurrentWeekFolderName() {
    const today = new Date();
    const day = today.getDay();
    const date = today.getDate() - day;

    const startDate = new Date(today.setDate(date)).getDate() + 1;
    const endDate = new Date(today.setDate(date + 5)).getDate();

    const currentWeekFolderName = `${startDate}-${endDate}`;

    Logger.log(
      "[getCurrentWeekFolderName] dayOfTheWeek %s",
      currentWeekFolderName
    );

    return currentWeekFolderName;
  }

  private createFolder(newFolder: string) {
    return this.currentFolder.createFolder(newFolder);
  }

  private folderExists(targetFolderName: string) {
    const targetFolder = this.currentFolder.getFoldersByName(targetFolderName);
    return targetFolder.hasNext();
  }

  private fileExists(targetFileName: string) {
    const targetFile = this.currentFolder.getFilesByName(targetFileName);
    return targetFile.hasNext();
  }

  private moveToFolder(targetFolderName: string) {
    const targetFolder = this.currentFolder.getFoldersByName(targetFolderName);
    if (targetFolder.hasNext()) {
      this.currentFolder = targetFolder.next();
    }
  }

  private moveBackToRoot() {
    this.currentFolder = this.rootFolder;
  }

  public getRootFolder() {
    return this.rootFolder;
  }

  public saveFileInFolder(id: string) {
    const formFile = DriveApp.getFileById(id);
    this.currentFolder.addFile(formFile);
    DriveApp.removeFile(formFile);
  }
}
