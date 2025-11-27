import sharp from "sharp";
import File from "../../entities/File";
import IFileGateway from "./IFileGateway";

import B2 from "backblaze-b2";
import { UploadFileDTO } from "../../types/UploadFileDTO";

const { APPLICATION_KEY_ID, APPLICATION_KEY, BUCKET_ID, BASE_URL_BACKBLAZE } =
  process.env;

const b2 = new B2({
  applicationKeyId: APPLICATION_KEY_ID!,
  applicationKey: APPLICATION_KEY!,
});

export default class BackBlazeFileGateway implements IFileGateway {
  async upload({ name, buffer, mimetype }: UploadFileDTO): Promise<File> {
    try {
      await b2.authorize();

      // ⭐ PROCESSAMENTO EM MEMÓRIA
      const resizedBuffer = await sharp(buffer)
        .resize(800, null, {
          fit: "inside",
          withoutEnlargement: true,
        })
        .jpeg({
          quality: 85,
          mozjpeg: true,
          chromaSubsampling: "4:4:4",
        })
        .toBuffer();

      // ⭐ PEGAR URL DE UPLOAD
      const {
        data: { uploadUrl, authorizationToken },
      } = await b2.getUploadUrl({
        bucketId: BUCKET_ID!,
      });

      // ⭐ UPLOAD EM MEMÓRIA
      const { data } = await b2.uploadFile({
        uploadUrl,
        uploadAuthToken: authorizationToken,
        fileName: name,
        data: resizedBuffer,
        info: {
          fileContentType: mimetype, // <-- CORRETO
        },
      });

      // ⭐ RETORNAR ENTIDADE
      return new File(data.fileName, `${BASE_URL_BACKBLAZE}/${data.fileName}`);
    } catch (error) {
      console.error(error);
      throw new Error("Failed to upload to Backblaze");
    }
  }
}
