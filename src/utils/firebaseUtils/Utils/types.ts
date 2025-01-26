export enum PlayServicesAvailabilityStatusCodes {
  API_UNAVAILABLE = 16,
  CANCELED = 13,
  DEVELOPER_ERROR = 10,
  DRIVE_EXTERNAL_STORAGE_REQUIRED = 1500,
  INTERNAL_ERROR = 8,
  INTERRUPTED = 15,
  INVALID_ACCOUNT = 5,
  LICENSE_CHECK_FAILED = 11,
  NETWORK_ERROR = 7,
  RESOLUTION_REQUIRED = 6,
  RESTRICTED_PROFILE = 20,
  SERVICE_DISABLED = 3,
  SERVICE_INVALID = 9,
  SERVICE_MISSING = 1,
  SERVICE_MISSING_PERMISSION = 19,
  SERVICE_UPDATING = 18,
  SERVICE_VERSION_UPDATE_REQUIRED = 2,
  SIGN_IN_FAILED = 17,
  SIGN_IN_REQUIRED = 4,
  SUCCESS = 0,
  TIMEOUT = 14,
}

export interface PlayServicesAvailability {
  status: PlayServicesAvailabilityStatusCodes;
  isAvailable: boolean;
  hasResolution: boolean | undefined;
  isUserResolvableError: boolean | undefined;
  error: string | undefined;
}
