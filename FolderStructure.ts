import { readDataFromSpreadsheet, readSpreadsheetDataFromKey } from "./utils";
import { SHEETS, TITLES } from "./constants";

const months: string[] = [
  "enero",
  "febrero",
  "marzo",
  "abril",
  "mayo",
  "junio",
  "julio",
  "agosto",
  "septiembre",
  "octubre",
  "noviembre",
  "diciembre"
];

export class FolderStructure {
  rootFolder: any;
  currentFolder: any;
  generalDataFile: any;

  constructor() {
    this.generalDataFile = SpreadsheetApp.getActive();
    this.rootFolder = this.setRootFolder();
    this.init();
  }

  init() {
    const today = new Date();
    const currentDay: number = today.getDate();
    const currentMonth: number = today.getMonth();
    const newFolderName = `${months[currentMonth]}/${currentDay}`;
    this.currentFolder = this.createFolder(newFolderName);
  }

  private setRootFolder() {
    const currentFile = DriveApp.getFileById(this.generalDataFile.getId());
    const parentFoldersIterator = currentFile.getParents();
    const rootFolder = parentFoldersIterator.next();
    // const data: [] = readDataFromSpreadsheet(
    //   this.generalDataFile,
    //   SHEETS.GENERAL
    // );
    // const rootFolderURL: string = readSpreadsheetDataFromKey(
    //   data,
    //   TITLES.ROOT_FOLDER
    // );
    // Logger.log("rootFolderUrl %s", rootFolderURL);
    // const breadcrumbs: string[] = rootFolderURL.split("/");
    // let rootFolder;
    // for (let i = 1; i < breadcrumbs.length; i++) {
    //   const folder: any = !rootFolder
    //     ? DriveApp.getFoldersByName(breadcrumbs[i])
    //     : rootFolder.getFoldersByName(breadcrumbs[i]);
    //   if (!folder.hasNext()) {
    //     rootFolder = null;
    //     break;
    //   } else {
    //     rootFolder = folder.next();
    //   }
    // }
    return rootFolder;
  }

  public saveFileInFolder(id: string) {
    const formFile = DriveApp.getFileById(id);
    this.currentFolder.addFile(formFile);
    DriveApp.removeFile(formFile);
  }

  public createFolder(name: string) {
    return this.rootFolder.createFolder(name);
  }

  public getRootFolder() {
    return this.rootFolder;
  }

  private moveToFolder(name: string) {
    const folder = this.currentFolder.getFoldersByName(name);
    if (folder.hasNext()) {
      this.currentFolder = folder.next();
      return true;
    } else {
      return false;
    }
  }

  private moveBackToRoot() {
    this.currentFolder = this.rootFolder;
  }
}
