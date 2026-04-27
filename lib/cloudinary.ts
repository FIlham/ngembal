import { v2 as cloudinary } from "cloudinary";
import { env } from "./env";

cloudinary.config({
    cloud_name: env.CLOUDINARY_CLOUD_NAME,
    api_key: env.CLOUDINARY_API_KEY,
    api_secret: env.CLOUDINARY_API_SECRET,
});

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_MIME_TYPES = [
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/gif",
];

/**
 * Validate file by checking magic numbers (file signature)
 */
function validateFileSignature(buffer: Buffer): boolean {
    // Check JPEG
    if (
        buffer.length >= 3 &&
        buffer[0] === 0xff &&
        buffer[1] === 0xd8 &&
        buffer[2] === 0xff
    ) {
        return true;
    }

    // Check PNG
    if (
        buffer.length >= 4 &&
        buffer[0] === 0x89 &&
        buffer[1] === 0x50 &&
        buffer[2] === 0x4e &&
        buffer[3] === 0x47
    ) {
        return true;
    }

    // Check GIF (GIF87a or GIF89a)
    if (
        buffer.length >= 4 &&
        buffer[0] === 0x47 &&
        buffer[1] === 0x49 &&
        buffer[2] === 0x46 &&
        (buffer[3] === 0x37 || buffer[3] === 0x38)
    ) {
        return true;
    }

    // Check WebP (RIFF....WEBP)
    if (
        buffer.length >= 12 &&
        buffer[0] === 0x52 &&
        buffer[1] === 0x49 &&
        buffer[2] === 0x46 &&
        buffer[3] === 0x46 &&
        buffer[8] === 0x57 &&
        buffer[9] === 0x45 &&
        buffer[10] === 0x42 &&
        buffer[11] === 0x50
    ) {
        return true;
    }

    return false;
}

export async function uploadImage(
    data: File | URL | string,
    transform?: boolean,
) {
    let fileURI = "";

    if (data instanceof File) {
        // Validate MIME type
        if (!ALLOWED_MIME_TYPES.includes(data.type)) {
            return {
                success: false,
                imageUrl: null,
                error: "Invalid file type. Only JPEG, PNG, WebP, and GIF are allowed.",
            };
        }

        // Validate file size
        if (data.size > MAX_FILE_SIZE) {
            return {
                success: false,
                imageUrl: null,
                error: `File size exceeds ${MAX_FILE_SIZE / (1024 * 1024)}MB limit.`,
            };
        }

        try {
            const arrayBuffer = await data.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);

            // Validate file signature
            if (!validateFileSignature(buffer)) {
                return {
                    success: false,
                    imageUrl: null,
                    error: "File signature validation failed. File may be corrupted or of incorrect type.",
                };
            }

            const base64Data = buffer.toString("base64");
            fileURI = `data:${data.type};base64,${base64Data}`;
        } catch (_error) {
            return {
                success: false,
                imageUrl: null,
                error: "Failed to process file.",
            };
        }
    } else {
        fileURI = data instanceof URL ? data.href : data;

        // Basic URL validation for external images
        try {
            new URL(fileURI);
        } catch {
            return {
                success: false,
                imageUrl: null,
                error: "Invalid image URL.",
            };
        }
    }

    const transformation = transform && [
        { width: 500, height: 500, crop: "fill" },
        { quality: "auto", fetch_format: "auto" },
    ];

    try {
        const result = await cloudinary.uploader.upload(fileURI, {
            folder: "ngembal/profiles",
            transformation,
            resource_type: "image",
        });
        return {
            success: true,
            imageUrl: result.secure_url,
        };
    } catch (error) {
        if (process.env.NODE_ENV === "development") {
            console.error("Cloudinary upload error:", error);
        }
        return {
            success: false,
            imageUrl: null,
            error: "Failed to upload image. Please try again.",
        };
    }
}
