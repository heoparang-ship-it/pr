import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"
import { randomUUID } from "crypto"

const s3 = new S3Client({
  region: process.env.AWS_REGION || "ap-northeast-2",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
})

const BUCKET = process.env.AWS_S3_BUCKET || "artful-uploads"

export async function createPresignedUrl(
  userId: string,
  category: string,
  fileName: string,
  fileType: string
) {
  const ext = fileName.split(".").pop() || "jpg"
  const key = `${category}/${userId}/${randomUUID()}.${ext}`

  const command = new PutObjectCommand({
    Bucket: BUCKET,
    Key: key,
    ContentType: fileType,
  })

  const uploadUrl = await getSignedUrl(s3, command, { expiresIn: 300 })
  const imageUrl = `https://${BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`

  return { uploadUrl, imageUrl }
}

export async function deleteS3Object(imageUrl: string) {
  try {
    const url = new URL(imageUrl)
    const key = url.pathname.slice(1) // remove leading /
    await s3.send(new DeleteObjectCommand({ Bucket: BUCKET, Key: key }))
  } catch {
    // 외부 URL이거나 삭제 실패 시 무시
  }
}
