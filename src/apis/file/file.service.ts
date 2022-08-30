import { Storage } from '@google-cloud/storage';
import { Injectable } from '@nestjs/common';
import { getToday } from 'src/commons/libraries/utills';
import { IUpload } from 'src/commons/type/context';
import { v4 as uuidv4 } from 'uuid';

const { PROJECT_ID, KEY_FILENAME, BUCKET_NAME } = process.env;

@Injectable()
export class FileService {
  async upload({ files }: IUpload) {
    const waitedFiles = await Promise.all(files);

    const storage = new Storage({
      projectId: PROJECT_ID,
      keyFilename: KEY_FILENAME,
    }).bucket(BUCKET_NAME);

    const result = await Promise.all(
      waitedFiles.map(
        (el) =>
          new Promise((resolve, reject) => {
            const fname = `${getToday()}/${uuidv4()}/origin/${el.filename}`;
            el.createReadStream()
              .pipe(storage.file(fname).createWriteStream())
              .on('finish', () => resolve(`${BUCKET_NAME}/${fname}`))
              .on('error', () => reject('이미지 업로드 실패'));
          }),
      ),
    );
    console.log(result);
    return result;
  }
}
