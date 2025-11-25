import sharp from "sharp";
import File from "../../entities/File";
import IFileGateway from "./IFileGateway";

import B2 from "backblaze-b2";
import fsp from "fs/promises";

const { APPLICATION_KEY_ID, APPLICATION_KEY, BUCKET_ID, BASE_URL_BACKBLAZE } =
  process.env;

const b2 = new B2({
  applicationKeyId: APPLICATION_KEY_ID!,
  applicationKey: APPLICATION_KEY!,
});

const unlinkAsync = fsp.unlink;

export default class BackBlazeFileGateway implements IFileGateway {
  async upload(file: File): Promise<File> {
    const { name, path } = file;

    try {
      // Lê e redimensiona antes de enviar
      const resizedBuffer = await sharp(`uploads/${name}`)
        .resize(800, null, {
          fit: "inside",
          withoutEnlargement: true,
          kernel: sharp.kernel.lanczos3,
        })
        .sharpen()
        .jpeg({
          quality: 85,
          mozjpeg: true,
          chromaSubsampling: "4:4:4",
        })
        .toBuffer();
      await b2.authorize();

      const {
        data: { uploadUrl, authorizationToken },
      } = await b2.getUploadUrl({
        bucketId: BUCKET_ID!,
      });

      const { data } = await b2.uploadFile({
        uploadUrl: uploadUrl,
        uploadAuthToken: authorizationToken,
        fileName: name,
        data: resizedBuffer,
      });

      await unlinkAsync(path);

      return {
        name: data.fileName,
        path: `${BASE_URL_BACKBLAZE}/${data.fileName}`,
      };
    } catch (error) {
      throw new Error("Failed to upload!");
    }
  }
}
