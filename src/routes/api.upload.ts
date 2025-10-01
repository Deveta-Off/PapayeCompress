import { createFileRoute } from '@tanstack/react-router'
import sharp from 'sharp'

export const Route = createFileRoute('/api/upload')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const formData = await request.formData()

          const file = formData.get('file') as Blob
          const formDataQuality = formData.get('quality')
          let quality = 50 // Default quality setting

          // Missing fields errors
          if (!file || !(file instanceof Blob)) {
            throw new Error(
              "Aucun fichier uploadé ou le fichier n'est pas valide",
            )
          }
          if (!formDataQuality) {
            console.warn('Qualité non spécifiée, 50% par défaut')
          } else {
            try {
              quality = parseInt(formDataQuality.toString(), 10) || 50
            } catch (e) {
              throw new Error('Erreur lors de la réception de la qualité')
            }
          }

          if (quality <= 0) {
            throw new Error('La qualité doit être supérieure à 0%')
          }
          if (quality > 100) {
            throw new Error('La qualité doit être inférieure à 100%')
          }

          // Fetching metadata, initializing sharp
          const fileBuffer = Buffer.from(await file.arrayBuffer())
          let sharpInstance = await sharp(fileBuffer)
          let imageFormat
          let imageSize
          try {
            const metadata = await sharpInstance.metadata()
            imageFormat = metadata.format
            imageSize = metadata.size
          } catch (e) {
            if (e instanceof Error) {
              const msg = e.message
              if (msg === 'Input image exceeds pixel limit')
                throw new Error(
                  "L'image dépasse la limite de pixels autorisée.",
                )
              if (msg === 'Input buffer contains unsupported image format')
                throw new Error("Le format d'image n'est pas supporté.")
            }
            throw new Error(
              'Format de fichier non supporté ou fichier corrompu.',
            )
          }

          // Checking if the file (format, size) is valid
          if (
            !imageFormat ||
            !['jpeg', 'png', 'webp', 'avif'].includes(imageFormat)
          ) {
            throw new Error(`Format de fichier non supporté: ${imageFormat}`)
          }
          if (!imageSize || imageSize > 2e7) {
            throw new Error(
              'Taille du fichier inconnue ou trop volumineuse ! (>20Mb)',
            )
          }

          // Actually doing the compression depending on the format
          switch (imageFormat) {
            case 'jpeg':
              sharpInstance = sharpInstance.jpeg({ quality })
              break
            case 'png':
              sharpInstance = sharpInstance.png({
                quality,
              })
              break
            case 'webp':
              sharpInstance = sharpInstance.webp({ quality })
              break
            case 'avif':
              sharpInstance = sharpInstance.avif({ quality })
              break
          }

          const buffer = await sharpInstance.toBuffer()

          const uint8 = new Uint8Array(buffer)

          // Returning the compressed image to client
          return new Response(uint8, {
            headers: {
              'Content-Type': `image/${imageFormat}`,
              'Content-Length': buffer.length.toString(),
            },
          })
        } catch (e: unknown) {
          // Error handling and sending to client
          console.log(e)
          const errorMessage =
            e instanceof Error ? e.message : 'Erreur inconnue'
          return new Response(JSON.stringify({ error: errorMessage }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
          })
        }
      },
    },
  },
})
