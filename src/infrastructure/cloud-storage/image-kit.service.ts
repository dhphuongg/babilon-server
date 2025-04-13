/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import ImageKit from 'imagekit';

import { Injectable, Logger } from '@nestjs/common';

import {
  VideoUploadDto,
  VideoUploadResponse,
} from 'src/presentation/dtos/request/video';
import { ICloudStorageService, ImageKitConfig } from './interface';

@Injectable()
export class ImageKitService implements ICloudStorageService {
  private readonly logger = new Logger(ImageKitService.name);
  private imageKit: ImageKit;

  constructor(private readonly config: ImageKitConfig) {
    this.imageKit = new ImageKit({
      publicKey: this.config.publicKey,
      privateKey: this.config.privateKey,
      urlEndpoint: this.config.urlEndpoint,
    });
  }

  async uploadVideo(
    videoUploadDto: VideoUploadDto,
  ): Promise<VideoUploadResponse> {
    const { video, userId, isPrivate } = videoUploadDto;
    // get buffer from video path

    this.logger.log('Uploading video to ImageKit...');
    try {
      const result = await this.imageKit.upload({
        file: video.buffer,
        fileName: `${userId}-${video.originalname}`,
        folder: `babilon/videos/${userId}`,
        isPrivateFile: isPrivate,
        transformation: {
          post: [{ type: 'abs', protocol: 'hls', value: 'video' }],
        },
      });
      this.logger.log('Video uploaded successfully');
      return {
        fileId: result.fileId,
        url: result.url,
        hlsUrl: result.url + '/ik-hls.m3u8',
        thumbnail: result.url + '/ik-thumbnail.jpg',
        duration: (result as any).duration,
        height: result.height,
        width: result.width,
        size: result.size,
      };
    } catch (error) {
      this.logger.error('Error uploading video:', error);
      throw new Error('Video upload failed');
    }
  }

  async changeVideoPrivateStatus({
    fileId,
    userId,
    isPrivate,
  }: {
    fileId: string;
    userId: string;
    isPrivate?: boolean;
  }): Promise<VideoUploadResponse> {
    try {
      const file = await this.imageKit.getFileDetails(fileId);

      const newFile = await this.imageKit.upload({
        file: file.url.split('?')[0],
        fileName: file.name,
        folder: `babilon/videos/${userId}`,
        isPrivateFile: isPrivate,
        transformation: {
          post: [{ type: 'abs', protocol: 'hls', value: 'video' }],
        },
        overwriteFile: true,
      });

      await this.imageKit.deleteFile(fileId);

      return {
        fileId: newFile.fileId,
        url: newFile.url,
        hlsUrl: newFile.url + '/ik-hls.m3u8',
        thumbnail: newFile.url + '/ik-thumbnail.jpg',
        duration: (newFile as any).duration,
        height: newFile.height,
        width: newFile.width,
        size: newFile.size,
      };
    } catch (error) {
      this.logger.error('Error when private file:', error);
      throw new Error('Private file failed');
    }
  }

  deleteVideo: (fileId: string) => Promise<void>;
}
