import React, { useState } from 'react'
import { Card, Stack, Text, Button, Flex, Box, TextInput } from '@sanity/ui'
import { UploadIcon, CheckmarkIcon, CloseIcon } from '@sanity/icons'

interface CSVUploadWidgetProps {
  title: string
  description: string
  onUpload: (file: File) => void
}

export const CSVUploadWidget: React.FC<CSVUploadWidgetProps> = ({ 
  title, 
  description, 
  onUpload 
}) => {
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    
    const files = Array.from(e.dataTransfer.files)
    const csvFile = files.find(file => file.name.endsWith('.csv'))
    
    if (csvFile) {
      handleFileUpload(csvFile)
    }
  }

  const handleFileUpload = async (file: File) => {
    setIsUploading(true)
    setUploadStatus('idle')
    
    try {
      // Simulate upload process
      await new Promise(resolve => setTimeout(resolve, 2000))
      onUpload(file)
      setUploadStatus('success')
    } catch (error) {
      setUploadStatus('error')
    } finally {
      setIsUploading(false)
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && file.name.endsWith('.csv')) {
      handleFileUpload(file)
    }
  }

  return (
    <Card padding={4} radius={2} shadow={1}>
      <Stack space={4}>
        <Text size={2} weight="bold">
          {title}
        </Text>
        <Text size={1} muted>
          {description}
        </Text>
        
        <Box
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          style={{
            border: `2px dashed ${isDragging ? 'var(--card-accent-fg-color)' : 'var(--card-border-color)'}`,
            borderRadius: '8px',
            padding: '24px',
            textAlign: 'center',
            backgroundColor: isDragging ? 'var(--card-accent-bg-color)' : 'transparent',
            transition: 'all 0.2s ease'
          }}
        >
          <Stack space={3}>
            <Flex justify="center">
              <UploadIcon style={{ fontSize: '24px' }} />
            </Flex>
            <Flex justify="center">
              <Text size={1}>
                Drag & drop your CSV file here, or{' '}
                <label style={{ color: 'var(--card-accent-fg-color)', cursor: 'pointer' }}>
                  browse files
                  <input
                    type="file"
                    accept=".csv"
                    onChange={handleFileSelect}
                    style={{ display: 'none' }}
                  />
                </label>
              </Text>
            </Flex>
            
            {isUploading && (
              <Text size={1} muted>
                Uploading...
              </Text>
            )}
            
            {uploadStatus === 'success' && (
              <Flex align="center" gap={2}>
                <CheckmarkIcon style={{ color: 'var(--card-positive-fg-color)' }} />
                <Text size={1} style={{ color: 'var(--card-positive-fg-color)' }}>
                  Upload successful!
                </Text>
              </Flex>
            )}
            
            {uploadStatus === 'error' && (
              <Flex align="center" gap={2}>
                <CloseIcon style={{ color: 'var(--card-critical-fg-color)' }} />
                <Text size={1} style={{ color: 'var(--card-critical-fg-color)' }}>
                  Upload failed. Please try again.
                </Text>
              </Flex>
            )}
          </Stack>
        </Box>
      </Stack>
    </Card>
  )
}
