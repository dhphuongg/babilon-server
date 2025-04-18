export interface EnvironmentConfig {
  port: number;
  nodeEnv: string;
  jwt: {
    secret: string;
    accessTokenExpirationTime: string;
    refreshTokenExpirationTime: string;
  };
  mail: {
    host: string;
    port: number;
    user: string;
    password: string;
    defaultFrom: string;
    secure: boolean;
  };
  redis: {
    host: string;
    port: number;
    password: string;
  };
  imageKit: {
    publicKey: string;
    privateKey: string;
    urlEndpoint: string;
  };
  cloudinary: {
    cloudName: string;
    apiKey: string;
    apiSecret: string;
  };
}

export const defaultConfig: EnvironmentConfig = {
  port: 3000,
  nodeEnv: 'development',
  jwt: {
    secret: 'your-secret-key',
    accessTokenExpirationTime: '1d',
    refreshTokenExpirationTime: '30d',
  },
  mail: {
    host: 'smtp.gmail.com',
    port: 587,
    user: '',
    password: '',
    defaultFrom: 'noreply@bablion.com',
    secure: false,
  },
  redis: {
    host: 'localhost',
    port: 6379,
    password: '',
  },
  imageKit: {
    publicKey: '',
    privateKey: '',
    urlEndpoint: '',
  },
  cloudinary: {
    cloudName: '',
    apiKey: '',
    apiSecret: '',
  },
};

export const environmentConfig = () => ({
  port: parseInt(process.env.PORT || '3000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  jwt: {
    secret: process.env.JWT_SECRET || defaultConfig.jwt.secret,
    accessTokenExpirationTime:
      process.env.ACCESS_TOKEN_EXPIRATION_TIME ||
      defaultConfig.jwt.accessTokenExpirationTime,
    refreshTokenExpirationTime:
      process.env.REFRESH_TOKEN_EXPIRATION_TIME ||
      defaultConfig.jwt.refreshTokenExpirationTime,
  },
  mail: {
    host: process.env.MAIL_HOST || defaultConfig.mail.host,
    port: parseInt(
      process.env.MAIL_PORT || String(defaultConfig.mail.port),
      10,
    ),
    user: process.env.MAIL_USER || defaultConfig.mail.user,
    password: process.env.MAIL_PASSWORD || defaultConfig.mail.password,
    defaultFrom: process.env.MAIL_FROM || defaultConfig.mail.defaultFrom,
    secure: process.env.MAIL_SECURE === 'true' || defaultConfig.mail.secure,
  },
  redis: {
    host: process.env.REDIS_HOST || defaultConfig.redis.host,
    port: parseInt(
      process.env.REDIS_PORT || String(defaultConfig.redis.port),
      10,
    ),
    password: process.env.REDIS_PASSWORD || defaultConfig.redis.password,
  },
  imageKit: {
    publicKey:
      process.env.IMAGE_KIT_PUBLIC_KEY || defaultConfig.imageKit.publicKey,
    privateKey:
      process.env.IMAGE_KIT_PRIVATE_KEY || defaultConfig.imageKit.privateKey,
    urlEndpoint:
      process.env.IMAGE_KIT_URL_ENDPOINT || defaultConfig.imageKit.urlEndpoint,
  },
  cloudinary: {
    cloudName:
      process.env.CLOUDINARY_CLOUD_NAME || defaultConfig.cloudinary.cloudName,
    apiKey: process.env.CLOUDINARY_API_KEY || defaultConfig.cloudinary.apiKey,
    apiSecret:
      process.env.CLOUDINARY_API_SECRET || defaultConfig.cloudinary.apiSecret,
  },
});
