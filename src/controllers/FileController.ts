import File from "../entities/File";
import IFileGateway from "../gateway/FileGateway/IFileGateway";
import { UploadFileDTO } from "../types/UploadFileDTO";

interface IFileController {
  upload(file: UploadFileDTO): Promise<File>;
}

export default class FileController implements IFileController {
  constructor(readonly fileGateway: IFileGateway) {}

  async upload(file: UploadFileDTO): Promise<File> {
    return await this.fileGateway.upload(file);
  }
}
