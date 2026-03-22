import {
  type ObsData,
  type TransformProperties,
  type WindowInfo,
} from "@gsps-layouts/types";
import OBSWebSocket from "obs-websocket-js";

type OBSSources = {
  hostAudio: string;
  intermissionVideo: string;
};

type CropperInfo = ObsData["croppers"][number];

export class ObsControl extends OBSWebSocket {
  readonly sources: OBSSources;

  constructor(sources: OBSSources) {
    super();
    this.sources = sources;
  }

  public async getHostAudioMuteStatus(): Promise<boolean> {
    const { inputMuted } = await this.call("GetInputMute", {
      inputName: this.sources.hostAudio,
    });

    return inputMuted;
  }

  public async setHostAudioMuteStatus(muted: boolean): Promise<void> {
    await this.call("SetInputMute", {
      inputName: this.sources.hostAudio,
      inputMuted: muted,
    });
  }

  public async setStudioModeEnabled(enabled: boolean): Promise<void> {
    await this.call("SetStudioModeEnabled", { studioModeEnabled: enabled });
  }

  public async getStudioModeStatus(): Promise<boolean> {
    const { studioModeEnabled } = await this.call("GetStudioModeEnabled");

    return studioModeEnabled;
  }

  public async getCurrentPreviewScene(): Promise<string> {
    const { currentPreviewSceneName } = await this.call(
      "GetCurrentPreviewScene",
    );

    return currentPreviewSceneName;
  }

  public async setCurrentPreviewScene(sceneName: string): Promise<void> {
    await this.call("SetCurrentPreviewScene", { sceneName });
  }

  public async setCurrentProgramScene(sceneName: string): Promise<void> {
    await this.call("SetCurrentProgramScene", { sceneName });
  }

  public async setIntermissionVideo(url: string): Promise<void> {
    await this.call("SetInputSettings", {
      inputName: this.sources.intermissionVideo,
      inputSettings: { input: url },
    });
  }

  public async cropSource({
    cropperInfo,
    windowInfo,
  }: {
    cropperInfo: CropperInfo;
    windowInfo: WindowInfo;
  }) {
    const sceneItemId = await this.call("GetSceneItemId", {
      sceneName: cropperInfo.sceneName,
      sourceName: cropperInfo.sourceName,
    });

    const sceneItemTransform = (
      await this.call("GetSceneItemTransform", {
        sceneName: cropperInfo.sceneName,
        sceneItemId: sceneItemId.sceneItemId,
      })
    ).sceneItemTransform as unknown as TransformProperties;

    const { width, height } = sceneItemTransform;

    const top = windowInfo.y;
    const bottom = height - windowInfo.y - windowInfo.h;
    const left = windowInfo.x;
    const right = width - windowInfo.x - windowInfo.w;

    await this.call("SetSceneItemTransform", {
      sceneName: cropperInfo.sceneName,
      sceneItemId: sceneItemId.sceneItemId,
      sceneItemTransform: {
        cropTop: top,
        cropBottom: bottom,
        cropLeft: left,
        cropRight: right,
      },
    });
  }

  public async crop4By3({ cropperInfo }: { cropperInfo: CropperInfo }) {
    const sceneItemId = await this.call("GetSceneItemId", {
      sceneName: cropperInfo.sceneName,
      sourceName: cropperInfo.sourceName,
    });

    const sceneItemTransform = (
      await this.call("GetSceneItemTransform", {
        sceneName: cropperInfo.sceneName,
        sceneItemId: sceneItemId.sceneItemId,
      })
    ).sceneItemTransform as unknown as TransformProperties;

    const { width } = sceneItemTransform;

    const top = 0;
    const bottom = 0;
    const margin = width / 8;
    const left = margin;
    const right = margin;

    await this.call("SetSceneItemTransform", {
      sceneName: cropperInfo.sceneName,
      sceneItemId: sceneItemId.sceneItemId,
      sceneItemTransform: {
        cropTop: top,
        cropBottom: bottom,
        cropLeft: left,
        cropRight: right,
      },
    });
  }

  public async resetCrop({ cropperInfo }: { cropperInfo: CropperInfo }) {
    const sceneItemId = await this.call("GetSceneItemId", {
      sceneName: cropperInfo.sceneName,
      sourceName: cropperInfo.sourceName,
    });

    await this.call("SetSceneItemTransform", {
      sceneName: cropperInfo.sceneName,
      sceneItemId: sceneItemId.sceneItemId,
      sceneItemTransform: {
        cropTop: 0,
        cropBottom: 0,
        cropLeft: 0,
        cropRight: 0,
      },
    });
  }

  public async getRecordingStatus(): Promise<{
    isRecording: boolean;
    recordingDuration: number;
  }> {
    const { outputActive, outputDuration } = await this.call("GetRecordStatus");

    return { isRecording: outputActive, recordingDuration: outputDuration };
  }

  public async getRecordingPath(): Promise<string> {
    let outputPath = "";

    const { outputs } = await this.call("GetOutputList");

    for (const output of outputs) {
      const settings = await this.call("GetOutputSettings", {
        outputName: output["outputName"] as string,
      });

      if (settings.outputSettings && settings.outputSettings["path"]) {
        outputPath = settings.outputSettings["path"] as string;
      }
    }

    return outputPath;
  }
}
