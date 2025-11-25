import File from "../entities/File";
import IFileGateway from "../gateway/FileGateway/IFileGateway";

interface IFileController {
  upload(file: File): Promise<File>;
}

export default class FileController implements IFileController {
  constructor(readonly fileGateway: IFileGateway) {}

  async upload(file: File): Promise<File> {
    return await this.fileGateway.upload(file);
  }
}
