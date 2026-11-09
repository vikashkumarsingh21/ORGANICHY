import { v2 as cloudinary } from "cloudinary";

// Initialize Cloudinary with server-side environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "organichy",
  api_key: process.env.CLOUDINARY_API_KEY || "",
  api_secret: process.env.CLOUDINARY_API_SECRET || "",
  secure: true,
});

export { cloudinary };

export interface CloudinaryUploadResult {
  public_id: string;
  secure_url: string;
  format: string;
  width: number;
  height: number;
  bytes: number;
  folder?: string;
  resource_type?: string;
}

/**
 * Checks whether live Cloudinary credentials are configured
 */
export function isCloudinaryConfigured(): boolean {
  return Boolean(
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET &&
    process.env.CLOUDINARY_CLOUD_NAME
  );
}

/**
 * Upload a file buffer or base64 data to Cloudinary with automatic optimization
 */
export async function uploadToCloudinary(
  fileBuffer: Buffer | string,
  options: {
    folder?: string;
    publicId?: string;
    altText?: string;
    tags?: string[];
  } = {}
): Promise<CloudinaryUploadResult> {
  const folder = options.folder ? `organichy/${options.folder}` : "organichy/general";

  if (!isCloudinaryConfigured()) {
    // Graceful fallback for local development or testing when live API keys are not supplied yet
    const simulatedId = options.publicId || `organichy_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    return {
      public_id: simulatedId,
      secure_url: typeof fileBuffer === "string" && fileBuffer.startsWith("data:image")
        ? fileBuffer
        : "https://images.unsplash.com/photo-1590301157890-4810ed352733?q=80&w=1200&auto=format&fit=crop",
      format: "webp",
      width: 1200,
      height: 1200,
      bytes: Buffer.isBuffer(fileBuffer) ? fileBuffer.length : 245000,
      folder,
      resource_type: "image",
    };
  }

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        public_id: options.publicId,
        resource_type: "image",
        transformation: [
          { quality: "auto:good", fetch_format: "auto" },
        ],
        tags: options.tags || ["organichy", "nutrition"],
      },
      (error, result) => {
        if (error || !result) {
          reject(error || new Error("Cloudinary upload failed with empty result"));
        } else {
          resolve({
            public_id: result.public_id,
            secure_url: result.secure_url,
            format: result.format,
            width: result.width,
            height: result.height,
            bytes: result.bytes,
            folder: result.folder,
            resource_type: result.resource_type,
          });
        }
      }
    );

    if (Buffer.isBuffer(fileBuffer)) {
      uploadStream.end(fileBuffer);
    } else {
      // base64 data URI string
      cloudinary.uploader
        .upload(fileBuffer, {
          folder,
          public_id: options.publicId,
          resource_type: "image",
          transformation: [{ quality: "auto:good", fetch_format: "auto" }],
          tags: options.tags || ["organichy", "nutrition"],
        })
        .then((result) =>
          resolve({
            public_id: result.public_id,
            secure_url: result.secure_url,
            format: result.format,
            width: result.width,
            height: result.height,
            bytes: result.bytes,
            folder: result.folder,
            resource_type: result.resource_type,
          })
        )
        .catch(reject);
    }
  });
}

/**
 * Delete an image asset from Cloudinary
 */
export async function deleteFromCloudinary(publicId: string): Promise<boolean> {
  if (!isCloudinaryConfigured()) {
    return true;
  }

  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result.result === "ok";
  } catch (error) {
    console.error("Cloudinary delete error:", error);
    return false;
  }
}

/**
 * Generate optimized Cloudinary responsive URLs
 */
export function getOptimizedImageUrl(
  urlOrPublicId: string,
  options: {
    width?: number;
    height?: number;
    crop?: "fill" | "thumb" | "scale" | "fit";
    format?: "auto" | "webp" | "avif";
    quality?: "auto" | number;
  } = {}
): string {
  if (!urlOrPublicId) return "";
  if (!urlOrPublicId.includes("cloudinary.com") && urlOrPublicId.startsWith("http")) {
    return urlOrPublicId; // Already a full remote URL (Unsplash, etc.)
  }

  const { width = 800, height, crop = "fill", format = "auto", quality = "auto" } = options;

  let transformations = `f_${format},q_${quality},c_${crop},w_${width}`;
  if (height) transformations += `,h_${height}`;

  if (urlOrPublicId.includes("/upload/")) {
    return urlOrPublicId.replace("/upload/", `/upload/${transformations}/`);
  }

  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "organichy";
  return `https://res.cloudinary.com/${cloudName}/image/upload/${transformations}/${urlOrPublicId}`;
}

