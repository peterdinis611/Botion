import { getApiBaseUrl } from "@/lib/api-base";
import { getToken } from "@/lib/auth";

export type UploadedFile = {
  id: string;
  originalName: string;
  storedName: string;
  mimeType: string;
  size: number;
  uploadedAt: string;
};

export async function uploadFile(file: File): Promise<UploadedFile> {
  const token = getToken();
  if (!token) {
    throw new Error("You must be signed in to upload files.");
  }

  const body = new FormData();
  body.append("file", file);

  const res = await fetch(`${getApiBaseUrl()}/files/upload`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || `Upload failed (${res.status})`);
  }

  return res.json() as Promise<UploadedFile>;
}
