import { exiftool } from 'exiftool-vendored';
import { doesFileSupportExif } from './does-file-support-exif';
import { promises as fspromises } from 'fs';
import { MediaFileInfo } from '../models/media-file-info';
import { resolve } from 'path';
import {GoogleMetadata} from "../models/google-metadata";

const { unlink, copyFile } = fspromises;

type InputMetaData = {
  timeTaken: string | null;
  geo: GoogleMetadata['geoData'] | null;
  description: GoogleMetadata['description'] | null;
}

export async function updateExifMetadata(fileInfo: MediaFileInfo, metaData: InputMetaData, errorDir: string): Promise<void> {
  if (!doesFileSupportExif(fileInfo.outputFilePath)) {
    return;
  }

  try {
    const {geo, timeTaken, description} = metaData;
    await exiftool.write(fileInfo.outputFilePath, {
      DateTimeOriginal: timeTaken || undefined,
      GPSLatitude: geo?.latitude,
      GPSLongitude: geo?.longitude,
      Description: description || undefined,
    });
    await unlink(`${fileInfo.outputFilePath}_original`); // exiftool will rename the old file to {filename}_original, we can delete that

  } catch (error) {
    console.log(error, "error")
    await copyFile(fileInfo.outputFilePath,  resolve(errorDir, fileInfo.mediaFileName));
    if (fileInfo.jsonFileExists && fileInfo.jsonFileName && fileInfo.jsonFilePath) {
      await copyFile(fileInfo.jsonFilePath, resolve(errorDir, fileInfo.jsonFileName));
    }
  }
}
