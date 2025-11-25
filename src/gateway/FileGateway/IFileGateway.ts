import File from "../../entities/File";

export default interface IFileGateway {
  upload(file: File): Promise<File>;
}
