import { GoogleMetadata } from '../models/google-metadata';
import { promises as fspromises } from "fs"
import { FileInfo } from '../models/file-info'

const { readFile } = fspromises;

export async function readDescriptionFromGoogleJson(mediaFile: FileInfo): Promise<GoogleMetadata['description']|null> {
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
