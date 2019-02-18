import { readDataFromSpreadsheet, readSpreadsheetDataFromKey } from "./utils";
import { SHEETS, TITLES } from "./constants";

export class FolderStructure {
  rootFolder: any;
  currentFolder: any;
  generalDataFile: any;

  constructor() {
    this.generalDataFile = SpreadsheetApp.getActive();
    this.rootFolder = this.setRootFolder();
    this.currentFolder = this.rootFolder;
  }

  private setRootFolder() {
    const data: [] = readDataFromSpreadsheet(
      this.generalDataFile,
      SHEETS.GENERAL
    );
    const rootFolderURL: string = readSpreadsheetDataFromKey(
      data,
      TITLES.ROOT_FOLDER
    );
    const breadcrumbs: string[] = rootFolderURL.split("/");
    let rootFolder;
    for (let i = 0; i < breadcrumbs.length; i++) {
      const folder: any = DriveApp.getFoldersByName(breadcrumbs[i]);
      if (!folder.hasNext()) {
        rootFolder = null;
        break;
      } else {
        rootFolder = folder.next();
      }
    }
    return rootFolder;
  }

  public saveFileInFolder(id: string) {
    const formFile = DriveApp.getFileById(id);
    this.currentFolder.addFile(formFile);
    DriveApp.removeFile(formFile);
  }

  public createFolder(name: string) {
    this.rootFolder.createFolder(name);
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
