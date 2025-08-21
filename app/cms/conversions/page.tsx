"use client"

import { useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"

const PROVIDERS = [
  { key: "freeconvert", label: "FreeConvert.com", limits: "20 files/day, API key required" },
  { key: "online-convert", label: "Online-Convert.com", limits: "30 files/day, 100MB, API key required" },
  { key: "convertio", label: "Convertio", limits: "25 files/day, API key required" },
]

const OPERATIONS = [
  { key: "convert", label: "Convert" },
  { key: "compress", label: "Compress" },
  { key: "merge", label: "Merge" },
]

const STORAGE_TARGETS = [
  { key: "local", label: "Local (CMS storage)" },
  { key: "cdn", label: "CDN/Cloud (e.g., S3/Azure/GCS)" },
]

export default function CmsConversionsPage() {
  const { toast } = useToast()
  const [provider, setProvider] = useState<string>("freeconvert")
  const [operation, setOperation] = useState<string>("convert")
  const [storage, setStorage] = useState<string>("local")
  // Storage details
  const [localDir, setLocalDir] = useState<string>("/uploads/conversions")
  const [fileName, setFileName] = useState<string>("{timestamp}-{basename}.{ext}")
  const [cdnProvider, setCdnProvider] = useState<string>("s3") // s3|azure|gcs
  const [bucketOrContainer, setBucketOrContainer] = useState<string>("")
  const [pathPrefix, setPathPrefix] = useState<string>("conversions/")
  const [sourceType, setSourceType] = useState<string>("upload") // upload | url
  const [url, setUrl] = useState("")
  const [file, setFile] = useState<File | null>(null)
  const [fromFormat, setFromFormat] = useState<string>("")
  const [toFormat, setToFormat] = useState<string>("")
  const [running, setRunning] = useState(false)
  const [resultUrl, setResultUrl] = useState<string>("")

  const providerInfo = useMemo(() => PROVIDERS.find(p => p.key === provider)?.limits ?? "", [provider])

  async function startConversion() {
    setResultUrl("")
    if (sourceType === "url" && !url) {
      toast({ title: "Enter file URL", description: "Please provide a source URL.", variant: "destructive" })
      return
    }
    if (sourceType === "upload" && !file) {
      toast({ title: "Select a file", description: "Please choose a file to upload.", variant: "destructive" })
      return
    }
    if (operation === "convert" && !toFormat) {
      toast({ title: "Select target format", description: "Please choose output format.", variant: "destructive" })
      return
    }

    try {
      setRunning(true)
      if (provider === "freeconvert") {
        // For uploads, we first send metadata; in a real impl we'd stream to storage or signed URL
        const formData = new FormData()
        formData.set("operation", operation)
        formData.set("storage", storage)
        // storage config
        formData.set("fileName", fileName)
        if (storage === "local") {
          formData.set("localDir", localDir)
        }
        if (storage === "cdn") {
          formData.set("cdnProvider", cdnProvider)
          formData.set("bucketOrContainer", bucketOrContainer)
          formData.set("pathPrefix", pathPrefix)
        }
        formData.set("sourceType", sourceType)
        formData.set("toFormat", toFormat)
        formData.set("fromFormat", fromFormat)
        if (sourceType === "url") formData.set("url", url)
        if (sourceType === "upload" && file) formData.set("file", file)

        const res = await fetch("/api/conversions/freeconvert", { method: "POST", body: formData })
        const data = await res.json()
        if (!res.ok) {
          throw new Error(data?.error || "Conversion failed")
        }
        setResultUrl(data?.downloadUrl || "")
        toast({ title: "Job queued", description: data?.message || "Conversion started." })
      } else {
        toast({ title: "Provider not configured", description: "Only FreeConvert is scaffolded right now.", variant: "destructive" })
      }
    } catch (err: any) {
      toast({ title: "Failed", description: err.message || String(err), variant: "destructive" })
    } finally {
      setRunning(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Conversions</h1>
        <div className="text-xs text-muted-foreground">{providerInfo}</div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-3 p-4 border rounded-md">
          <label className="text-sm">Provider</label>
          <Select value={provider} onValueChange={setProvider}>
            <SelectTrigger><SelectValue placeholder="Select provider" /></SelectTrigger>
            <SelectContent>
              {PROVIDERS.map(p => <SelectItem key={p.key} value={p.key}>{p.label}</SelectItem>)}
            </SelectContent>
          </Select>

          <label className="text-sm">Operation</label>
          <Select value={operation} onValueChange={setOperation}>
            <SelectTrigger><SelectValue placeholder="Select operation" /></SelectTrigger>
            <SelectContent>
              {OPERATIONS.map(o => <SelectItem key={o.key} value={o.key}>{o.label}</SelectItem>)}
            </SelectContent>
          </Select>

          {operation === "convert" && (
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-sm">From</label>
                <Input placeholder="e.g., jpg, mp4" value={fromFormat} onChange={(e) => setFromFormat(e.target.value)} />
              </div>
              <div>
                <label className="text-sm">To</label>
                <Input placeholder="e.g., pdf, mp3" value={toFormat} onChange={(e) => setToFormat(e.target.value)} />
              </div>
            </div>
          )}

          <label className="text-sm">Storage Target</label>
          <Select value={storage} onValueChange={setStorage}>
            <SelectTrigger><SelectValue placeholder="Select storage" /></SelectTrigger>
            <SelectContent>
              {STORAGE_TARGETS.map(s => <SelectItem key={s.key} value={s.key}>{s.label}</SelectItem>)}
            </SelectContent>
          </Select>

          {/* Storage configuration */}
          {storage === "local" && (
            <div className="space-y-2">
              <label className="text-sm">Local Directory</label>
              <Input placeholder="/uploads/conversions" value={localDir} onChange={(e) => setLocalDir(e.target.value)} />
              <label className="text-sm">File Name Template</label>
              <Input placeholder="{timestamp}-{basename}.{ext}" value={fileName} onChange={(e) => setFileName(e.target.value)} />
              <div className="text-xs text-muted-foreground">
                Tokens: {"{timestamp}"}, {"{basename}"}, {"{ext}"}
              </div>
            </div>
          )}
          {storage === "cdn" && (
            <div className="space-y-2">
              <label className="text-sm">CDN Provider</label>
              <Select value={cdnProvider} onValueChange={setCdnProvider}>
                <SelectTrigger><SelectValue placeholder="Select CDN" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="s3">Amazon S3</SelectItem>
                  <SelectItem value="azure">Azure Blob Storage</SelectItem>
                  <SelectItem value="gcs">Google Cloud Storage</SelectItem>
                </SelectContent>
              </Select>
              <label className="text-sm">Bucket/Container</label>
              <Input placeholder="my-bucket" value={bucketOrContainer} onChange={(e) => setBucketOrContainer(e.target.value)} />
              <label className="text-sm">Path Prefix</label>
              <Input placeholder="conversions/" value={pathPrefix} onChange={(e) => setPathPrefix(e.target.value)} />
              <label className="text-sm">File Name Template</label>
              <Input placeholder="{timestamp}-{basename}.{ext}" value={fileName} onChange={(e) => setFileName(e.target.value)} />
              <div className="text-xs text-muted-foreground">
                Example S3 path: s3://my-bucket/{"{pathPrefix}"}{"{fileName}"}
              </div>
            </div>
          )}
        </div>

        <div className="space-y-3 p-4 border rounded-md">
          <label className="text-sm">Source</label>
          <Select value={sourceType} onValueChange={setSourceType}>
            <SelectTrigger><SelectValue placeholder="Select source" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="upload">Upload</SelectItem>
              <SelectItem value="url">From URL</SelectItem>
            </SelectContent>
          </Select>

          {sourceType === "upload" ? (
            <div className="space-y-2">
              <input
                type="file"
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              />
              {file ? <div className="text-xs text-muted-foreground">{file.name} ({Math.round(file.size/1024)} KB)</div> : null}
            </div>
          ) : (
            <Input placeholder="https://example.com/file.pdf" value={url} onChange={(e) => setUrl(e.target.value)} />
          )}

          <div className="pt-2">
            <Button onClick={startConversion} disabled={running}>{running ? "Processing..." : "Start"}</Button>
          </div>

          {resultUrl ? (
            <div className="text-sm">
              <div className="text-muted-foreground mb-1">Result</div>
              <a className="text-primary underline" href={resultUrl} target="_blank" rel="noreferrer">Download file</a>
            </div>
          ) : null}
        </div>
      </div>

      <div className="p-4 border rounded-md text-xs text-muted-foreground">
        Note: Only FreeConvert is wired with a scaffold API in this build. Other providers can be added similarly.
      </div>
    </div>
  )
}
