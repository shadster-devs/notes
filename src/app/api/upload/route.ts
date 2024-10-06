import { put } from '@vercel/blob'
import { NextResponse } from 'next/server'
import { toast } from 'sonner'

export const runtime = 'edge'

export async function POST(req: Request) {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    toast.error("Missing BLOB_READ_WRITE_TOKEN. Don't forget to add that to your .env file.")
    return new Response(
        "Missing BLOB_READ_WRITE_TOKEN. Don't forget to add that to your .env file.",
        {
          status: 401
        }
    )
  }

  try {
    const file = req.body || ''
    const filename = req.headers.get('x-vercel-filename') || 'file.txt'
    const contentType = req.headers.get('content-type') || 'text/plain'
    const fileType = `.${contentType.split('/')[1]}`

    // construct final filename based on content-type if not provided
    const finalName = filename.includes(fileType)
        ? filename
        : `${filename}${fileType}`

    const blob = await put(finalName, file, {
      contentType,
      access: 'public'
    })

    toast.success('File uploaded successfully', {
      description: `File URL: ${blob.url}`,
    })

    return NextResponse.json(blob)
  } catch (error) {
    toast.error('File upload failed', {
      description: error instanceof Error ? error.message : 'An unknown error occurred',
    })
    return new Response(
        "File upload failed. " + (error instanceof Error ? error.message : 'An unknown error occurred'),
        {
          status: 500
        }
    )
  }
}