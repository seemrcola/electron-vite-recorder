import path, { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import ffmpegPath from '@ffmpeg-installer/ffmpeg'
import ffprobePath from '@ffprobe-installer/ffprobe'
import ffmpeg from 'fluent-ffmpeg'
import type { Express, Request, Response } from 'express'

ffmpeg.setFfmpegPath(ffmpegPath.path)
ffmpeg.setFfprobePath(ffprobePath.path)

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

console.log(__dirname)

// 拿到静态资源目录
const DIR = path.join(__dirname, 'temp')
const FRAME_COUNT = 30

function useFrame(app: Express) {
  app.post('/frame', (req: Request, res: Response) => {
    // 最重要的参数就是 文件路径
    const { filePath } = req.body
    /**
     * 使用ffmpeg来处理这个视频路径
     * 根据这个视频 按时长平均读取出30帧 处理成120*80的png图片
     * 将这个图片保存到 temp 文件夹下
     * 处理成base64字符串返回给前端
     */
    getDuration(filePath)
  })
}

// 获取视频时长
function getDuration(filePath: string) {
  // 使用ffprobe获取视频时长
  ffmpeg.ffprobe(filePath, (err, metadata) => {
    if (err)
      return console.log(err)

    // 获取视频宽高
    const { width, height } = metadata.streams[0]
    // 获取时长
    const duration = metadata.format.duration!
    // 根据时长计算出30帧的间隔
    const interval = duration / FRAME_COUNT
    // 每间隔一个interval读取一帧
    const frames = []
    for (let i = 0; i < FRAME_COUNT; i++) {
      const p = getFrame(filePath, i, i * interval, width, height)
      frames.push(p)
    }
    Promise.all(frames).then((res) => {
      // todo
      console.log(res)
    })
  })
}

function getFrame(filePath: string, i: number, time: number, width: number, height: number) {
  return new Promise((resolve, reject) => {
    // 使用 ffmpeg 截取图片
    ffmpeg(filePath)
      .screenshots({
        count: 1,
        folder: DIR,
        filename: `image_${i}.png`,
        timestamps: [time],
        size: `${width}x${height}`, // 可以根据需要指定图片尺寸
      })
      .on('end', () => {
        console.log(`Image ${i} generated successfully.`)
        resolve(true)
      })
      .on('error', (err) => {
        console.error(`Error generating image ${i}:`, err)
        reject(err)
      })
  })
}

export {
  useFrame,
}
