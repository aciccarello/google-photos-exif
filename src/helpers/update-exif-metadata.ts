import { exiftool } from "exiftool-vendored";
import { doesFileSupportExif } from "./does-file-support-exif";
import { promises as fspromises } from "fs";
import { FileInfo } from "../models/file-info";
import { resolve } from "path";
import { GoogleMetadata } from "../models/google-metadata";

const { unlink, copyFile } = fspromises;

type InputMetaData = {
  timeTaken: string | null;
  geo: GoogleMetadata["geoData"] | null;
  description: GoogleMetadata["description"] | null;
};

export async function updateExifMetadata(
  fileInfo: FileInfo,
  metaData: InputMetaData,
  errorDir: string
): Promise<void> {
  const { outputFilePath } = fileInfo;
  if (!outputFilePath || !doesFileSupportExif(outputFilePath)) {
    return;
  }

  try {
    const { geo, timeTaken, description } = metaData;
    await exiftool.write(outputFilePath, {
      DateTimeOriginal: timeTaken || undefined,
      GPSLatitude: geo?.latitude,
      GPSLongitude: geo?.longitude,
      Description: description || undefined,
    });
    await unlink(`${outputFilePath}_original`); // exiftool will rename the old file to {filename}_original, we can delete that
  } catch (error) {
    console.log("Error updating  file", error);
    await copyFile(outputFilePath, resolve(errorDir, fileInfo.fileName));
    if (
      fileInfo.jsonFileExists &&
      fileInfo.jsonFileHasSize &&
      fileInfo.jsonFileName &&
      fileInfo.jsonFilePath
    ) {
      await copyFile(
        fileInfo.jsonFilePath,
        resolve(errorDir, fileInfo.jsonFileName)
      );
    }
  }
}
