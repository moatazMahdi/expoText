export type RemoteConfigFingerPrint = {
  text: string;
  pattern: string;
  flags: string;
};

type Replacements = {
  text: string;
  pattern: RegExp;
};

let replacements: Replacements[];

export function setFingerprints(fingerprints: RemoteConfigFingerPrint[]) {
  replacements = fingerprints.map(({ text, pattern, flags }) => {
    return { text, pattern: new RegExp(pattern, flags) };
  });
}

// allowing JSON notation to simplify copy-pasting to Remote Config
setFingerprints([
  {
    text: '<uuidv4>',
    pattern: '[0-9a-z]{8}-[0-9a-z]{4}-[0-9a-z]{4}-[0-9a-z]{4}-[0-9a-z]{12}',
    flags: 'gi',
  },
  { text: '<anid>', pattern: '12[0-9]{22}', flags: 'g' },
  {
    text: '<smarthub.trace>',
    pattern: '"@smarthub.traceId":"[^"]+"',
    flags: 'g',
  },
  { text: '<serial>', pattern: 'serial number [^ ]+', flags: 'g' },
  {
    text: '<dateTime>',
    pattern: '\\d{4}\\d{2}\\d{2}T\\d{2}\\d{2}\\d{2}Z',
    flags: 'g',
  },
  // The standard (IEEE 802) format for printing MAC-48 addresses
  {
    text: '<mac>',
    pattern: '(?:[a-fA-F0-9]{2}[:-]){5}[a-fA-F0-9]{2}',
    flags: 'g',
  },
  {
    text: '$1 <code> $2',
    pattern: '(The household invitation with code:).*(could not be found.)',
    flags: 'g',
  },
  {
    text: '$1',
    pattern:
      '^(Exception while fetching data \\(/qiviconRegisterGateway\\) : 400 Bad Request).+$',
    flags: 'g',
  },
  {
    text: '$1',
    pattern:
      '^(Exception while fetching data \\(/qiviconRegisterGateway\\) : 500 Internal Server Error).+$',
    flags: 'g',
  },
  {
    text: '$1',
    pattern:
      '^(Exception while fetching data \\(/qiviconRegisterGateway\\) : Exception while activating gateway).+$',
    flags: 'g',
  },
  {
    text: '$1',
    pattern:
      '^(Exception while fetching data \\(/qiviconReplaceGateway\\) : Error while replacing gateway).+$',
    flags: 'g',
  },
  {
    text: '$1',
    pattern:
      '^(Exception while fetching data \\(/qiviconReplaceGateway\\) : Cannot find connection for).+$',
    flags: 'g',
  },
  {
    text: '$1',
    pattern:
      '^(Exception while fetching data \\([^)]+\\) : Failed JSON-RPC).+$',
    flags: 'g',
  },
  {
    text: '$1',
    pattern:
      '^(Exception while fetching data \\([^)]+\\) : There is no thing with ID).+$',
    flags: 'g',
  },
  {
    text: 'failed to connect to $1',
    pattern: '^Failed to connect to ([^/]+)/.*$',
    flags: 'gi',
  },
  {
    text: 'failed to connect to $1',
    pattern: '^Failed to connect to /([0-9.]+).*$',
    flags: 'gi',
  },
  {
    text: '$1 $2',
    pattern: '^([^:]+:).*(Software caused connection abort)$',
    flags: 'g',
  },
  { text: '$1 <id>', pattern: '^(no client found with id).+$', flags: 'g' },
]);

/**
 * Convert specific errors to generic errors to help Sentry Server properly group issues
 */
export function fingerprintErrorMessage(input: string): string {
  return replacements.reduce((text, item) => {
    return text.replace(item.pattern, item.text);
  }, String(input));
}
