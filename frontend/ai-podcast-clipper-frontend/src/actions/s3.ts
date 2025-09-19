"use server";

import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from "uuid";
import { env } from "~/env";
import { auth } from "~/server/auth";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { db } from "~/server/db";

export async function generateUploadUrl(fileInfo: {
  filename: string;
  contentType: string;
}): Promise<{
  success: boolean;
  signedUrl: string;
  key: string;
  uploadedFileId: string;
}> {
  const session = await auth();
  if (!session) throw new Error("unauthorized");

  const s3Client = new S3Client({
    region: env.BACKBLAZE_REGION,
    endpoint: `https://s3.${env.BACKBLAZE_REGION}.backblazeb2.com`,
    credentials: {
      accessKeyId: env.BACKBLAZE_ACCESS_KEY_ID,
      secretAccessKey: env.BACKBLAZE_SECRET_ACCESS_KEY,
    },
  });

  const fileExtension = fileInfo.filename.split(".").pop() || "";

  const uniqueId = uuidv4();
  //   uuid/original.mp4
  //  uuid/clip1.mp4
  const key = `${uniqueId}/original.${fileExtension}`;

  const command = new PutObjectCommand({
    Bucket: env.S3_BUCKET_NAME,
    Key: key,
    ContentType: fileInfo.contentType,
  });
  const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 600 });

  const uploadedFIleDbRecord = await db.uploadedFile.create({
    data: {
      userId: session.user.id,
      s3Key: key,
      displayName: fileInfo.filename,
      uploaded: false,
    },
    select: {
      id: true,
    },
  });
  return {
    success: true,
    signedUrl,
    key,
    uploadedFileId: uploadedFIleDbRecord.id,
  };
}
