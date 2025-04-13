import {
  VideoUploadDto,
  VideoUploadResponse,
} from 'src/presentation/dtos/request/video';

export const CLOUD_STORAGE_PROVIDER = 'CLOUD_STORAGE_PROVIDER';

export type CloudinaryConfig = {
  type: 'cloudinary';
  cloudName?: string;
  apiKey?: string;
  apiSecret?: string;
};

export type ImageKitConfig = {
  type: 'imageKit';
  publicKey: string;
  privateKey: string;
  urlEndpoint: string;
};

export type CloudStorageConfig = CloudinaryConfig | ImageKitConfig;

export interface ICloudStorageService {
  uploadVideo: (videoUploadDto: VideoUploadDto) => Promise<VideoUploadResponse>;

  changeVideoPrivateStatus: (operations: {
    fileId: string;
    userId: string;
    isPrivateFile: boolean;
  }) => Promise<VideoUploadResponse>;

  deleteVideo: (fileId: string) => Promise<void>;
}
