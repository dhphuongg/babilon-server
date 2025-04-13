/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { ConfigService } from '@nestjs/config';
import ImageKit from 'imagekit';

import { EnvironmentConfig } from '../config/environment.config';
import { Injectable, Logger } from '@nestjs/common';

import {
  VideoUploadDto,
  VideoUploadResponse,
} from 'src/presentation/dtos/request/video';

@Injectable()
export class ImageKitService {
  private readonly logger = new Logger(ImageKitService.name);
  private imageKit: ImageKit;

  constructor(
    private readonly configService: ConfigService<EnvironmentConfig>,
  ) {
    this.imageKit = new ImageKit({
      publicKey:
        this.configService.get('imageKit.publicKey', { infer: true }) || '',
      privateKey:
        this.configService.get('imageKit.privateKey', { infer: true }) || '',
      urlEndpoint:
        this.configService.get('imageKit.urlEndpoint', { infer: true }) || '',
    });
  }

  async uploadVideo(
    videoUploadDto: VideoUploadDto,
  ): Promise<VideoUploadResponse> {
    const { video, userId, isPrivateFile } = videoUploadDto;
    // get buffer from video path

    this.logger.log('Uploading video to ImageKit...');
    try {
      const result = await this.imageKit.upload({
        file: video.buffer,
        fileName: `${userId}-${video.originalname}`,
        folder: `babilon/videos/${userId}`,
        isPrivateFile,
        transformation: {
          post: [{ type: 'abs', protocol: 'hls', value: 'video' }],
        },
      });
      this.logger.log('Video uploaded successfully');
      return {
        fileId: result.fileId,
        url: result.url,
        thumbnail: result.url + '/ik-thumbnail.jpg',
        duration: (result as any).duration,
        height: result.height,
        width: result.width,
        size: result.size,
        filePath: result.filePath,
      };
    } catch (error) {
      this.logger.error('Error uploading video:', error);
      throw new Error('Video upload failed');
    }
  }

  async changeVideoPrivateStatus({
    fileId,
    userId,
    isPrivateFile,
  }: {
    fileId: string;
    userId: string;
    isPrivateFile: boolean;
  }): Promise<VideoUploadResponse> {
    try {
      const file = await this.imageKit.getFileDetails(fileId);

      const newFile = await this.imageKit.upload({
        file: file.url.split('?')[0],
        fileName: file.name,
        folder: `babilon/videos/${userId}`,
        isPrivateFile,
        transformation: {
          post: [{ type: 'abs', protocol: 'hls', value: 'video' }],
        },
        overwriteFile: true,
      });

      await this.imageKit.deleteFile(fileId);

      return {
        fileId: newFile.fileId,
        url: newFile.url,
        thumbnail: newFile.url + '/ik-thumbnail.jpg',
        duration: (newFile as any).duration,
        height: newFile.height,
        width: newFile.width,
        size: newFile.size,
        filePath: newFile.filePath,
      };
    } catch (error) {
      this.logger.error('Error when private file:', error);
      throw new Error('Private file failed');
    }
  }
}
