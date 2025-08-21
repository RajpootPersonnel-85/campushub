import { NextRequest, NextResponse } from "next/server"

// Scaffolded API for FreeConvert integration.
// Expects multipart/form-data with fields: operation, storage, sourceType, toFormat, fromFormat, url? and file?
// In a full implementation, this would create a Job with import -> task (convert/compress/merge) -> export.

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.FREECONVERT_API_KEY
    const formData = await req.formData()
    const operation = String(formData.get("operation") || "")
    const storage = String(formData.get("storage") || "local")
    const fileName = String(formData.get("fileName") || "{timestamp}-{basename}.{ext}")
    const localDir = formData.get("localDir") ? String(formData.get("localDir")) : undefined
    const cdnProvider = formData.get("cdnProvider") ? String(formData.get("cdnProvider")) : undefined
    const bucketOrContainer = formData.get("bucketOrContainer") ? String(formData.get("bucketOrContainer")) : undefined
    const pathPrefix = formData.get("pathPrefix") ? String(formData.get("pathPrefix")) : undefined
    const sourceType = String(formData.get("sourceType") || "upload")
    const toFormat = String(formData.get("toFormat") || "")
    const fromFormat = String(formData.get("fromFormat") || "")
    const url = formData.get("url") ? String(formData.get("url")) : undefined
    const file = formData.get("file") as File | null

    if (!operation) {
      return NextResponse.json({ error: "operation is required" }, { status: 400 })
    }

    if (operation === "convert" && !toFormat) {
      return NextResponse.json({ error: "toFormat is required for convert" }, { status: 400 })
    }

    // For now, do not actually call FreeConvert if no key configured.
    if (!apiKey) {
      // Echo back a mock response so UI can proceed during development.
      return NextResponse.json({
        ok: true,
        provider: "freeconvert",
        message: "FreeConvert API key not configured. Returning mock response.",
        operation,
        storage,
        storageConfig: {
          fileName,
          localDir,
          cdnProvider,
          bucketOrContainer,
          pathPrefix,
        },
        sourceType,
        toFormat,
        fromFormat,
        // In a real flow, you'd get a downloadable URL from export:download task
        downloadUrl: "https://example.com/mock-download-file",
      })
    }

    // TODO: Implement real call sequence using FreeConvert API
    // 1) Create job
    // 2) Create import task (upload/url)
    // 3) Create processing task (convert/compress/merge)
    // 4) Create export task (download or cloud storage depending on `storage`)
    // 5) Run job and poll status or return job id for client to poll via websocket/webhook

    // For now just return a placeholder acknowledging key presence.
    return NextResponse.json({
      ok: true,
      provider: "freeconvert",
      message: "API key detected. Implement job orchestration next.",
      operation,
      storage,
      storageConfig: {
        fileName,
        localDir,
        cdnProvider,
        bucketOrContainer,
        pathPrefix,
      },
      sourceType,
      toFormat,
      fromFormat,
      downloadUrl: "",
    })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || String(err) }, { status: 500 })
  }
}
