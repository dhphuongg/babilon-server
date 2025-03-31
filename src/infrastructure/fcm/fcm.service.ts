import { Logger } from '@nestjs/common';
import * as firebaseAdmin from 'firebase-admin';
import * as path from 'path';

// eslint-disable-next-line @typescript-eslint/no-require-imports
const serviceAccount = require(
  path.join(
    process.cwd(),
    process.env.FIREBASE_KEY_PATH || 'firebase-admin-sdk.json',
  ),
);

export class FcmService {
  private readonly logger = new Logger(FcmService.name);
  private firebaseApp: firebaseAdmin.app.App;

  constructor() {
    console.log(
      '========================= Fcm Service Initialized =========================',
    );
    this.firebaseApp = firebaseAdmin.initializeApp(
      {
        credential: firebaseAdmin.credential.cert(
          serviceAccount as firebaseAdmin.ServiceAccount,
        ),
      },
      'Babilon FCM Service',
    );
  }

  async sendNotificationToMultipleDevices(
    multicastMessage: firebaseAdmin.messaging.MulticastMessage,
  ) {
    try {
      const response = await this.firebaseApp
        .messaging()
        .sendEachForMulticast(multicastMessage);
      this.logger.log('FCM response: ', response);
      return response;
    } catch (error) {
      this.logger.error(error);
    }
  }
}
