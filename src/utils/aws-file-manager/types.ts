export interface UploadResult {
  uploadUrl: string;
  fileUrl: string;
}
export interface requestUploadPicsParams {
  token: string;
  id?: string;
  isProfile?: boolean;
  imageType?: string;
}
export interface getOCRParams {
  token: string;
  id: string;
  photoURI: string;
  fileType: string;
  SYNAPS_id: number;
}

export interface getNIDOCRParams {
  token: string;
  frontNIDId: string;
  backNIDId:string;
  frontPhotoURI: string;
  backPhotoURI: string;
  fileType: string;
}

//photoURI or base64File is required
//if there is no isProfile so id is required
export interface UploadDocsParams {
  token: string;
  fileType: string;
  photoURI?: string;
  base64File?: string;
  isProfile?: boolean;
  id?: string;
  callback?: (fileUrl: string) => any;
}
