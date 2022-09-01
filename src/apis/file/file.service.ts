import { Storage } from '@google-cloud/storage';
import { Injectable } from '@nestjs/common';
import { getToday } from 'src/commons/libraries/utills';
import { IUpload } from 'src/commons/type/context';
import { v4 as uuidv4 } from 'uuid';

const { PROJECT_ID, KEY_FILENAME, BUCKET_NAME } = process.env;
const prefix = 'https://storage.googleapis.com/';

@Injectable()
export class FileService {
  async uploadProductImage({ files }: IUpload) {
    const productImage = await files[0];
    const fname = `${getToday()}/${uuidv4()}/origin/${productImage.filename}`;

    const storage = new Storage({
      projectId: PROJECT_ID,
      keyFilename: KEY_FILENAME,
    })
      .bucket(BUCKET_NAME)
      .file(fname);

    const result = await new Promise((resolve, reject) => {
      productImage
        .createReadStream()
        .pipe(storage.createWriteStream())
        .on('finish', () => resolve(`${BUCKET_NAME}/${fname}`))
        .on('error', () => reject('이미지 업로드에 실패했습니다.'));
    });
    return prefix + result;
  }

  async uploadBoardImage({ files }) {
    const imageUrls = [];
    const boardImages = await Promise.all(files);

    const storage = new Storage({
      projectId: PROJECT_ID,
      keyFilename: KEY_FILENAME,
    }).bucket(BUCKET_NAME);

    const result = await Promise.all(
      boardImages.map(
        (el) =>
          new Promise((resolve, reject) => {
            const fname = `${getToday()}/${uuidv4()}/origin/${el.filename}`;
            el.createReadStream()
              .pipe(storage.file(fname).createWriteStream())
              .on('finish', () => resolve(`${BUCKET_NAME}/${fname}`))
              .on('error', () => reject('실패'));
          }),
      ),
    );
    for (const el of result) {
      imageUrls.push(prefix + el);
    }
    return imageUrls;
  }
}
