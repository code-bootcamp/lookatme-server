import { Storage } from '@google-cloud/storage';
import { Injectable } from '@nestjs/common';
import { getToday } from 'src/commons/libraries/utills';
import { IUpload } from 'src/commons/type/context';
import { v4 as uuidv4 } from 'uuid';

const { PROJECT_ID, KEY_FILENAME, BUCKET_NAME } = process.env;

@Injectable()
export class FileService {
  async uploadImage({ file }: IUpload) {
    const image = file[0];
    const fname = `${getToday()}/${uuidv4()}/origin/${image.filename}`;

    const storage = new Storage({
      projectId: PROJECT_ID,
      keyFilename: KEY_FILENAME,
    })
      .bucket(BUCKET_NAME)
      .file(fname);

    const imgUrl = await new Promise((resolve, reject) => {
      image
        .createReadStream()
        .pipe(storage.createWriteStream())
        .on('finish', () => resolve(fname))
        .on('error', () => reject('파일 업로드에 실패했습니다'));
    });
    console.log(imgUrl);
    return imgUrl;
  }
}
