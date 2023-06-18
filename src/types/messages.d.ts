import { RunDataActiveRun } from '../../../nodecg-speedcontrol/src/types/schemas';
import { Cropper } from './custom';
import { Total, WindowInfo } from './generated';

export type MessageMap = {
  updateBids: {};
  startCountdown: { data: string };
  stopCountdown: {};
  updateDonations: {};
  setDonationAsRead: { data: number };
  makeHighlight: {};
  startHostCountdown: { data: string };
  stopHostCountdown: {};
  toggleAlert: {};
  updateMilestones: {};
  switchToIntermission: {};
  switchFromHostScreen: {};
  videoPlayerFinished: {};
  playIntermissionVideo: { data: boolean };
  refreshWindows: { data: number };
  crop: { data: { cropperIndex: number; windowInfo: WindowInfo } };
  crop4By3: { data: number };
  resetCrop: { data: number };
  addCropper: {};
  modifyCropper: { data: { cropperIndex: number; newCropper: Cropper } };
  removeCropper: { data: number };
  createVoDTimeStamp: { data: { timestamp: number; run: RunDataActiveRun; recordingName: string } };
  updateTotal: {};
  setTotal: { data: { type: string; newValue: number } };
  showNames: {};
  hideNames: {};
  'bids:updating': {};
  'bids:updated': {};
  'milestones:updating': {};
  'milestones:updated': {};
  'donationsToRead:updating': {};
  'donationsToRead:updated': {};
  secondaryTimerStart: {};
  secondaryTimerFinish: {};
  secondaryTimerReset: { data: boolean };
  secondaryTimerPause: {};
  windowsRefreshed: { data: { cropperIndex: number; windows: WindowInfo[] } };
  'total:manuallyUpdated': { data: Total };
};