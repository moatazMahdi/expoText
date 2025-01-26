import { Alert } from 'react-native';
import axios, { AxiosRequestConfig } from 'axios';
import { decode } from 'base64-arraybuffer';
import RNFS from 'react-native-fs';
import { Settings } from 'settings';
import { uploadSynapsURL, getSynapsResultURL,verifySynapsEkycUrl } from './requests';
import { createCryptoSign } from '../HelpersFunctions';
import {
  UploadResult,
  UploadDocsParams,
  requestUploadPicsParams,
  getOCRParams,
  getNIDOCRParams,
} from './types';
import { CODE_VERSION } from '../ExtendedAxios';

export const requestUploadPicsUrl = async ({
  token,
  id,
  isProfile,
  fileType,
}: requestUploadPicsParams & { fileType: string }) => {
  try {
    const fetchUrl = `${Settings.config.BASE_URL}/s3/generate-presigned-url`;
    const data = isProfile
      ? { imageType: 'profile_picture', fileType }
      : { imageType: 'ocr', id, fileType };
    const cryptoSign = createCryptoSign(data);
    const response = await fetch(fetchUrl, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
        accept: 'application/json',
        Authorization: `Bearer ${token}`,
        'x-signature': cryptoSign,
        'x-version':CODE_VERSION
      },
    });

    const result: UploadResult = await response.json();
    // console.log('requestUploadProfilePicUrl result: ', result);
    if (!result.uploadUrl || !result.fileUrl) {
      const message =
        '[et-file-manager] Error in getting uploadUrl from backend';
      // console.log(message);
      throw new Error(message);
    }
    console.log(
      `[et-file-manager] Presigned upload url fetched successfully: ${result.uploadUrl}`,
    );
    console.log(
      `[et-file-manager] File url fetched successfully: ${result.fileUrl}`,
    );
    return result;
  } catch ({ response }) {
    console.error(response);
  }
};

export const uploadFileToS3 = async (
  url: string,
  fileType: string,
  base64: string,
) => {
  try {
    // console.log('upload called 1 here')
    const arrayBuffer = decode(base64);
    // console.log('upload called arrayBuffer',arrayBuffer)


    const response = await fetch(url, {
      method: 'PUT',
      body: arrayBuffer,
      headers: {
        'Content-Type': fileType,
        'Content-Encoding': 'base64',
        'x-version':CODE_VERSION
      },
    });
    if (response.ok) {
      console.log('[et-file-manager] File was successfully uploaded to s3.');
      return;
    }
    console.log('error in upload');
    throw new Error(`${response.status}: ${response.statusText}`);
  } catch ({ response }) {
    console.log(response);
  }
};

export const uploadDocs = async ({
  token,
  fileType,
  id,
  photoURI,
  base64File,
  isProfile,
  callback,
}: UploadDocsParams) => {
  try {
    const { uploadUrl, fileUrl } = await requestUploadPicsUrl({
      token,
      id,
      isProfile,
      fileType,
    });

    const base64 = base64File ?? (await RNFS.readFile(photoURI, 'base64'));
    await uploadFileToS3(uploadUrl, fileType, base64);

    if (callback) await callback(fileUrl);
    else return fileUrl;
  } catch (error) {
    return '';
  }
};

const getSynapsResult = async (synapsResult: any, token: string) => {
  const data = { uuid: synapsResult.uid };
  const cryptoSign = createCryptoSign(data);

  try {
    var config: AxiosRequestConfig = {
      method: 'POST',
      data: data,
      url: `${Settings.config.BASE_URL}${getSynapsResultURL}`,
      headers: {
        'x-signature': cryptoSign,
        Authorization: `Bearer ${token}`,
        'x-version':CODE_VERSION
      },
    };
    const res = await axios(config);
    return res?.data;
  } catch ({ response }) {
    console.log(response);
  }
};





// Instant Approval Utils
//=======================
const uploadFileToSYNAPS = async (
  fileUrl: string,
  SYNAPS_id: number,
  token: string,
) => {
  const data = {
    imageUrl: fileUrl,
    // run_document_detector: 'true',
    // rtl: 'true',
    project: SYNAPS_id,
  };
  const cryptoSign = createCryptoSign(data);

  try {
    var config: AxiosRequestConfig = {
      method: 'POST',
      data: data,
      url: `${Settings.config.BASE_URL}${uploadSynapsURL}`,
      headers: {
        'x-signature': cryptoSign,
        Authorization: `Bearer ${token}`,
        'x-version':CODE_VERSION
      },
    };
    const res = await axios(config);
    return res?.data;
  } catch ({ response }) {
    Alert.alert(response?.data?.message)
    console.log(response);
  }
};

const getSynapsNIDResult = async ({frontNIDUrl ,backNIDUrl}, token: string) => {
  // console.log('frontNIDUrl',frontNIDUrl)
  // console.log('backNIDUrl',backNIDUrl)


  const data = {
    frontNationalIdUrl: frontNIDUrl,
    backNationalIdUrl:backNIDUrl
    };
  const cryptoSign = createCryptoSign(data);

  try {
    var config: AxiosRequestConfig = {
      method: 'POST',
      data: data,
      url: `${Settings.config.BASE_URL}${verifySynapsEkycUrl}`,
      headers: {
        'x-signature': cryptoSign,
        Authorization: `Bearer ${token}`,
        'x-version':CODE_VERSION
      },
    };
    const res = await axios(config);
    return res?.data;
  } catch ({ response }) {
    console.log(response);
  }
};

export const getOCR = async ({
  token,
  id,
  photoURI,
  fileType,
  SYNAPS_id,
}: getOCRParams) => {
  try {
    const { uploadUrl, fileUrl } = await requestUploadPicsUrl({ id, token });


    const base64File = await RNFS.readFile(photoURI, 'base64');
    // console.log('base64File is ',base64File)
    // console.log('uploadUrl is ',uploadUrl)
    await uploadFileToS3(uploadUrl, fileType, base64File);

    let synapsResult = await uploadFileToSYNAPS(fileUrl, SYNAPS_id, token);

    let ocrResultData;
    const pooling = () => {
      const MAX_TRIES_NUM = 60;
      let i = 0;
      return new Promise((resolve, reject) => {
        var handler = setInterval(loop, 3000);

        async function loop() {
          i += 1;
          ocrResultData = await getSynapsResult(synapsResult, token);
          if (
            !ocrResultData ||
            i > MAX_TRIES_NUM ||
            (i === MAX_TRIES_NUM && !ocrResultData?.completed) ||
            (ocrResultData?.completed &&
              ocrResultData?.extracted_info?.Results?.correctDoc === 'false')
          ) {
            clearInterval(handler);
            resolve('');
          } else if (
            ocrResultData?.completed &&
            ocrResultData?.extracted_info &&
            ocrResultData?.extracted_info?.Results?.correctDoc === 'true'
          ) {
            clearInterval(handler);
            resolve(ocrResultData.extracted_info);
          }
        }
      });
    };

    let resultOCR = await pooling();
    return resultOCR;
  } catch ({ response }) {
    console.log(response);
  }
};

export const getNidOCR = async ({
  token,
  frontNIDId,
  backNIDId,
  frontPhotoURI,
  backPhotoURI,
  fileType,
}: getNIDOCRParams) => {
  try {
    // Start the requests for presigned URLs in parallel
    const [frontUploadResult, backUploadResult] = await Promise.all([
      requestUploadPicsUrl({ id: frontNIDId, token, fileType }),
      requestUploadPicsUrl({ id: backNIDId, token, fileType }),
    ]);
      // console.log('url generated ');
      // console.log('photos',frontPhotoURI,backPhotoURI);

    // Start reading files in parallel
    const [frontBase64File, backBase64File] = await Promise.all([
      RNFS.readFile(frontPhotoURI, 'base64'),
      RNFS.readFile(backPhotoURI, 'base64'),
    ]);

    // console.log('decode is generated')

    // Ensure frontUploadResult and backUploadResult are defined
    if (frontUploadResult && backUploadResult) {
      // console.log('frontUploadResult>>',frontUploadResult)
      // console.log('backUploadResult>>',backUploadResult)

      await Promise.all([
        uploadFileToS3(frontUploadResult.uploadUrl, fileType, frontBase64File),
        uploadFileToS3(backUploadResult.uploadUrl, fileType, backBase64File),
      ]);
    } else {
      throw new Error('Failed to get upload URLs for front or back NID.');
    }

    // Get OCR results
    let resultOCR = await getSynapsNIDResult({
      frontNIDUrl: frontUploadResult?.fileUrl,
      backNIDUrl: backUploadResult?.fileUrl,
    }, token);

    return resultOCR;
  } catch (error) {
    console.error('Error in getNidOCR:', error);
  }
};
