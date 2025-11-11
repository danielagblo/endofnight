'use client'

import { useState, useRef, useCallback } from 'react'
import { Upload, X, Image as ImageIcon } from 'lucide-react'

interface ImageUploadProps {
  images: string[]
  onImagesChange: (images: string[]) => void
  maxImages?: number
}

export default function ImageUpload({ images, onImagesChange, maxImages = 20 }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const resetInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const processFiles = useCallback(
    async (fileList: FileList | File[]) => {
      setError(null)

      const files = Array.from(fileList)
      if (!files.length) return

      const remainingSlots = maxImages - images.length
      if (remainingSlots <= 0) return

      const validImages = files
        .filter((file) => file.type.startsWith('image/'))
        .slice(0, remainingSlots)

      if (!validImages.length) {
        setError('Only image files are supported.')
        resetInput()
        return
      }

      const formData = new FormData()
      validImages.forEach((file) => formData.append('files', file))

      setUploading(true)
      setError(null)

      try {
        const response = await fetch('/api/uploads', {
          method: 'POST',
          body: formData,
        })

        if (!response.ok) {
          const data = await response.json().catch(() => ({}))
          const message = typeof data.error === 'string' ? data.error : 'Failed to upload images.'
          throw new Error(message)
        }

        const data = await response.json()
        const uploadedUrls: string[] = Array.isArray(data.urls) ? data.urls : []
        if (!uploadedUrls.length) {
          throw new Error('No images were uploaded.')
        }

        onImagesChange([...images, ...uploadedUrls])
      } catch (uploadError) {
        console.error('Image upload failed:', uploadError)
        setError(uploadError instanceof Error ? uploadError.message : 'Failed to upload images.')
      } finally {
        setUploading(false)
        resetInput()
      }
    },
    [images, maxImages, onImagesChange],
  )

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = event.target
    if (!files) return
    processFiles(files)
  }

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    setDragActive(false)
    if (images.length >= maxImages) return
    const { files } = event.dataTransfer
    if (!files?.length) return
    processFiles(files)
  }

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    if (images.length >= maxImages) return
    setDragActive(true)
  }

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    const relatedTarget = event.relatedTarget as HTMLElement | null
    if (relatedTarget && event.currentTarget.contains(relatedTarget)) {
      return
    }
    setDragActive(false)
  }

  const openFileDialog = () => {
    if (uploading) return
    fileInputRef.current?.click()
  }

  const helperText =
    images.length >= maxImages
      ? `Maximum of ${maxImages} images reached.`
      : uploading
        ? 'Uploading...'
        : 'PNG, JPG, GIF up to 10MB each'

  const uploadCtaClasses = [
    'w-full border-2 border-dashed rounded-lg p-6 transition-colors flex flex-col items-center justify-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2',
    dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-500',
    uploading ? 'cursor-not-allowed opacity-70' : 'cursor-pointer',
  ].join(' ')

  const handleRemoveImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index)
    onImagesChange(newImages)
  }

  const handleReorder = (fromIndex: number, toIndex: number) => {
    const newImages = [...images]
    const [removed] = newImages.splice(fromIndex, 1)
    newImages.splice(toIndex, 0, removed)
    onImagesChange(newImages)
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Property Images ({images.length} / {maxImages})
        </label>
        <p className="text-sm text-gray-500 mb-4">
          Upload multiple images. The first image will be used as the main/featured image.
        </p>
        
        {images.length < maxImages && (
          <div
            role="button"
            tabIndex={0}
            className={uploadCtaClasses}
            onClick={openFileDialog}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault()
                openFileDialog()
              }
            }}
            aria-disabled={uploading}
            aria-label="Upload property images"
          >
            <Upload size={32} className="text-gray-400" />
            <span className="text-sm font-medium text-gray-700">
              {uploading ? 'Uploading images...' : 'Click to upload images or drag and drop'}
            </span>
            <span className="text-xs text-gray-500">{helperText}</span>
            {dragActive && (
              <span className="text-xs text-blue-600 font-medium">
                Drop the images here to upload
              </span>
            )}
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
          disabled={images.length >= maxImages || uploading}
        />

        {error && (
          <p className="text-sm text-red-600 mt-2" role="alert">
            {error}
          </p>
        )}
      </div>

      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {images.map((image, index) => (
            <div
              key={index}
              className="relative group aspect-square rounded-lg overflow-hidden border-2 border-gray-200"
            >
              {index === 0 && (
                <div className="absolute top-2 left-2 bg-blue-600 text-white text-xs font-semibold px-2 py-1 rounded z-10">
                  Main
                </div>
              )}
              <img
                src={image}
                alt={`Property image ${index + 1}`}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-full transition-colors"
                  title="Remove image"
                >
                  <X size={16} />
                </button>
                {index > 0 && (
                  <button
                    type="button"
                    onClick={() => handleReorder(index, 0)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded text-xs font-semibold transition-colors"
                    title="Set as main image"
                  >
                    Set Main
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {images.length === 0 && (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
          <ImageIcon size={48} className="mx-auto text-gray-400 mb-4" />
          <p className="text-gray-500">No images uploaded yet</p>
        </div>
      )}
    </div>
  )
}

