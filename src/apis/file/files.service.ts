import { Storage } from '@google-cloud/storage';
import { Injectable } from '@nestjs/common';
import { getToday } from 'src/commons/libraries/utills';
import { IUpload } from 'src/commons/type/context';
import { v4 as uuidv4 } from 'uuid';

const { PROJECT_ID, KEY_FILENAME, BUCKET_NAME } = process.env;

@Injectable()
export class FileService {
  async uploadImage({ file }: IUpload) {
    const myfile = await file[0];
    const fname = `${getToday()}/${uuidv4()}/origin/${myfile.filename}`;

    const storage = new Storage({
      projectId: PROJECT_ID,
      keyFilename: KEY_FILENAME,
    })
      .bucket(BUCKET_NAME)
      .file(fname);

    const result = await new Promise((resolve, reject) => {
      myfile
        .createReadStream()
        .pipe(storage.createWriteStream())
        .on('finish', () => resolve(fname))
        .on('error', () => reject('이미지 업로드에 실패했습니다'));
    });

    return result;
  }
}
