import { DynamicModule, Provider } from '@nestjs/common';

import { CLOUD_STORAGE_PROVIDER, CloudStorageConfig } from './interface';
import { CloudinaryService } from './cloudinary.service';

export class CloudStorageModule {
  static forRoot(config: CloudStorageConfig): DynamicModule {
    const provider: Provider = {
      provide: CLOUD_STORAGE_PROVIDER,
      useFactory: () => {
        if (config.type === 'cloudinary') {
          return new CloudinaryService(config);
        } else if (config.type === 'imageKit') {
          throw new Error('ImageKit is not supported yet');
        }
        throw new Error('Invalid cloud storage configuration');
      },
    };
    return {
      module: CloudStorageModule,
      providers: [provider],
      exports: [provider],
      global: true,
    };
  }
}
