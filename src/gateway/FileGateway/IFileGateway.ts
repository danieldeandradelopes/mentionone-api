// IFileGateway.ts
import File from "../../entities/File";
import { UploadFileDTO } from "../../types/UploadFileDTO";

export default interface IFileGateway {
  upload(file: UploadFileDTO): Promise<File>;
}
