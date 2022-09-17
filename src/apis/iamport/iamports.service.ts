import axios from 'axios';
import { Injectable, UnprocessableEntityException } from '@nestjs/common';

@Injectable()
export class IamportsService {
  async requestAccessToken() {
    return await axios({
      url: 'https://api.iamport.kr/users/getToken',
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      data: {
        imp_key: process.env.IMP_CLIENT_KEY,
        imp_secret: process.env.IMP_CLIENT_SECRET,
      },
    });
  }

  async verifyImpUid({ impUid, amount, accessToken }) {
    let importData: any;
    try {
      importData = await axios({
        url: `https://api.iamport.kr/payments/${impUid}`,
        method: 'get',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      });
    } catch (err) {
      throw new UnprocessableEntityException('존재하지 않는 결제정보입니다.');
    }

    if (importData.data.response.amount !== amount)
      throw new UnprocessableEntityException('금액이 잘못 입력되었습니다.');
  }

  async cancelPay({ impUid, amount, accessToken, reason }) {
    const getCancelData = await axios({
      url: 'https://api.iamport.kr/payments/cancel',
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      data: {
        reason: reason,
        imp_uid: impUid,
        amount: amount,
      },
    });

    const { response } = getCancelData.data; // refund result

    return response;
  }
}
