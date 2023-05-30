import { GoogleMetadata } from '../models/google-metadata';
import { promises as fspromises } from "fs"
import { FileInfo } from '../models/file-info';

const { readFile } = fspromises;

export async function readGeoFromGoogleJson(mediaFile: FileInfo): Promise<GoogleMetadata['geoData']|null> {
  if (!mediaFile.jsonFilePath || !mediaFile.jsonFileExists) {
    return null;
  }

  const jsonContents = await readFile(mediaFile.jsonFilePath, 'utf8');
  const googleJsonMetadata = JSON.parse(jsonContents) as GoogleMetadata;
  const isCoordExist = (value?: number) => typeof value === 'number' && value !== 0.0;

  if (
    isCoordExist(googleJsonMetadata?.geoData?.latitude) ||
    isCoordExist(googleJsonMetadata?.geoData?.longitude) ||
    isCoordExist(googleJsonMetadata?.geoData?.altitude) ||
    isCoordExist(googleJsonMetadata?.geoData?.latitudeSpan) ||
    isCoordExist(googleJsonMetadata?.geoData?.longitudeSpan)
  ) {
    return {
      latitude: googleJsonMetadata?.geoData?.latitude,
      longitude: googleJsonMetadata?.geoData?.longitude,
      altitude: googleJsonMetadata?.geoData?.altitude,
      latitudeSpan: googleJsonMetadata?.geoData?.latitudeSpan,
      longitudeSpan: googleJsonMetadata?.geoData?.longitudeSpan,
    }
  } else {
    return null;
  }
}
