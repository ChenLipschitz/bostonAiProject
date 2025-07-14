export interface Progress {
  SWITCH_INDEX: boolean;
  TOTAL_RECORDS_IN_FEED: number;
  TOTAL_JOBS_FAIL_INDEXED: number;
  TOTAL_JOBS_IN_FEED: number;
  TOTAL_JOBS_SENT_TO_ENRICH: number;
  TOTAL_JOBS_DONT_HAVE_METADATA: number;
  TOTAL_JOBS_DONT_HAVE_METADATA_V2: number;
  TOTAL_JOBS_SENT_TO_INDEX: number;
}

export interface Log {
  _id: string;
  country_code: string;
  currency_code: string;
  progress: Progress;
  status: string;
  timestamp: string;
  transactionSourceName: string;
  noCoordinatesCount: number;
  recordCount: number;
  uniqueRefNumberCount: number;
}

export interface CountryStats {
  [country: string]: number;
}

export interface StatusStats {
  [status: string]: number;
}

export interface ProgressStats {
  totalRecordsInFeed: number;
  totalJobsFailIndexed: number;
  totalJobsInFeed: number;
  totalJobsSentToEnrich: number;
  totalJobsDontHaveMetadata: number;
  totalJobsDontHaveMetadataV2: number;
  totalJobsSentToIndex: number;
}

export interface ChatResponse {
  response: string;
  error?: string;
}