"use server"

import {S3Client, ListObjectsV2Command, PutObjectCommand} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3Client = new S3Client({
    region: "auto",
    endpoint: process.env.S3_ENDPOINT!,
    credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY!,
        secretAccessKey: process.env.S3_SECRET_KEY!
    }
})

const IMAGE_EXTENSIONS = new Set(["jpg", "jpeg", "png", "webp", "gif", "avif"]);

export async function getUploadPresignedUrl(fileName: string, contentType: string) {
    const key = `${Date.now()}-${fileName}`;
    const command = new PutObjectCommand({
        Bucket: process.env.S3_BUCKET_NAME!,
        Key: key,
        ContentType: contentType,
    });

    const presignedUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
    const publicUrl = `${process.env.S3_PUBLIC_URL}/${key}`;

    return { presignedUrl, publicUrl };
}

export async function getDiegos(): Promise<string[]> {
    const command = new ListObjectsV2Command({
        Bucket: process.env.S3_BUCKET_NAME!,
    });

    const response = await s3Client.send(command);
    const objects = response.Contents ?? [];

    console.log(objects);

    return objects
        .map((obj) => obj.Key!)
        .filter((key) => {
            const ext = key.split(".").pop()?.toLowerCase() ?? "";
            return IMAGE_EXTENSIONS.has(ext);
        })
        .map((key) => `${process.env.S3_PUBLIC_URL}/${key}`);
}