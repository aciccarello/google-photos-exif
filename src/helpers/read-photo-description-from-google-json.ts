import { GoogleMetadata } from '../models/google-metadata';
import { promises as fspromises } from "fs"
import { MediaFileInfo } from '../models/media-file-info'

const { readFile } = fspromises;

export async function readDescriptionFromGoogleJson(mediaFile: MediaFileInfo): Promise<GoogleMetadata['description']|null> {
  if (!mediaFile.jsonFilePath || !mediaFile.jsonFileExists) {
    return null;
  }

  const jsonContents = await readFile(mediaFile.jsonFilePath, 'utf8');
  const googleJsonMetadata = JSON.parse(jsonContents) as GoogleMetadata;

  if (googleJsonMetadata?.description && googleJsonMetadata?.description.length) {
    return googleJsonMetadata.description
  } else {
    return null;
  }
}
