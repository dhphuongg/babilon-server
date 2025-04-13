/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Injectable, Logger } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';

import { CloudinaryConfig, ICloudStorageService } from './interface';
import {
  VideoUploadDto,
  VideoUploadResponse,
} from 'src/presentation/dtos/request/video';

@Injectable()
export class CloudinaryService implements ICloudStorageService {
  private readonly logger = new Logger(CloudinaryService.name);

  constructor(config: CloudinaryConfig) {
    cloudinary.config({
      cloud_name: config.cloudName,
      api_key: config.apiKey,
      api_secret: config.apiSecret,
    });
  }

  async uploadVideo(
    videoUploadDto: VideoUploadDto,
  ): Promise<VideoUploadResponse> {
    const { video, userId, isPrivate } = videoUploadDto;

    const result: any = await new Promise((resolve) => {
      cloudinary.uploader
        .upload_stream(
          {
            resource_type: 'video',
            public_id: `${userId}-${video.originalname}`,
            folder: `babilon/videos/${userId}`,
            type: isPrivate ? 'private' : 'upload',
            eager: [{ transformation: [{ format: 'm3u8' }] }],
          },
          (error, uploadResult) => {
            const thumbnail = cloudinary.url(`${uploadResult?.public_id}.jpg`, {
              resource_type: 'video',
              transformation: [
                {
                  width: uploadResult?.width,
                  height: uploadResult?.height,
                  crop: 'fill',
                },
                { start_offset: '3' }, // grab frame at 3 seconds
              ],
            });

            if (error) {
              this.logger.error('Error uploading video:', error);
              throw new Error('Error uploading video');
            }

            return resolve({ ...uploadResult, thumbnail });
          },
        )
        .end(video.buffer);
    });

    return {
      fileId: result.public_id,
      url: result.secure_url,
      hlsUrl: result.playback_url,
      thumbnail: result.thumbnail,
      duration: result.duration,
      height: result.height,
      width: result.width,
      size: result.bytes,
    };
  }

  async changeVideoPrivateStatus({
    fileId,
    isPrivate,
  }: {
    fileId: string;
    userId: string;
    isPrivate?: boolean;
  }): Promise<VideoUploadResponse> {
    await cloudinary.api.update(fileId, {
      type: isPrivate ? 'private' : 'upload',
      resource_type: 'video',
    });

    const result: any = await cloudinary.api.resource(fileId);

    return {
      fileId: result.public_id,
      url: result.secure_url,
      hlsUrl: result.playback_url,
      thumbnail: result.thumbnail,
      duration: result.duration,
      height: result.height,
      width: result.width,
      size: result.bytes,
    };
  }

  async deleteVideo(fileId: string): Promise<void> {
    await cloudinary.uploader.destroy(fileId, { resource_type: 'video' });
  }
}
