// ffmpeg
import ffmpegPath from '@ffmpeg-installer/ffmpeg'
import ffprobePath from '@ffprobe-installer/ffprobe'
import ffmpeg from 'fluent-ffmpeg'

ffmpeg.setFfmpegPath(ffmpegPath.path)
ffmpeg.setFfprobePath(ffprobePath.path)

export function useFFMPEG() {
  const recorder = ffmpeg()

  function startRecord(type: 'window' | 'clip') {
    // todo
  }

  function stopRecord() {
    // todo
  }

  function pauseRecord() {
    // todo
  }

  function resumeRecord() {
    // todo
  }

  return {
    recorder,
    startRecord,
    stopRecord,
    pauseRecord,
    resumeRecord,
  }
}
