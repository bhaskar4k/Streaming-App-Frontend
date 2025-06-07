export const ResponseTypeColor = {
  SUCCESS: 1,
  WARNING: 2,
  INFO: 3,
  ERROR: 4
}

export class Dropdown {
  id: string | undefined;
  text: string | undefined;

  constructor(id: string | undefined, text: string | undefined) {
    this.id = id;
    this.text = text;
  }
}

export enum VideoVisibility{
  PUBLIC = 1,
  PRIVATE = 0
}

export const VideoVisibilityDescriptions: Record<VideoVisibility, string> = {
  [VideoVisibility.PUBLIC]: 'Public',
  [VideoVisibility.PRIVATE]: 'Private',
};

export enum VideoProcessingStatus {
  IN_QUEUE = 1,
  PROCESSING = 2,
  PROCESSED = 3,
  PROCESSING_FAILED = 4,
}

export const VideoProcessingStatusDescriptions: Record<VideoProcessingStatus, string> = {
  [VideoProcessingStatus.IN_QUEUE]: 'In Queue',
  [VideoProcessingStatus.PROCESSING]: 'Processing',
  [VideoProcessingStatus.PROCESSED]: 'Processed',
  [VideoProcessingStatus.PROCESSING_FAILED]: 'Processing Failed',
};



export type ResponseTypeColor = typeof ResponseTypeColor[keyof typeof ResponseTypeColor];