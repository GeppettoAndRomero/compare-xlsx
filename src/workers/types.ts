/**
 * Compatibility types for the stamped, unused ToastNotification component.
 * Workbook comparison does not create worker jobs.
 */

export type ProcessingPhase = 'decode' | 'resize' | 'encode' | 'complete';
export type JobStatus = 'pending' | 'processing' | 'succeeded' | 'failed';

export interface ConversionJob {
  file: File;
  status: JobStatus;
  phase?: ProcessingPhase;
  progress: number;
}
