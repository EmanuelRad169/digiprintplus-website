import React, { useState } from 'react'
import { Stack, Button, Card, Text, Flex } from '@sanity/ui'
import { DownloadIcon } from '@sanity/icons'
import { useClient } from 'sanity'

interface QuoteData {
  requestId: string
  contact: {
    firstName: string
    lastName: string
    email: string
    phone: string
    company?: string
  }
  jobSpecs: {
    productType: string
    quantity: string
    size?: string
    paperType?: string
    finish?: string
    turnaround: string
    additionalNotes?: string
  }
  estimate?: {
    amount: number
    currency: string
    validUntil: string
    notes?: string
  }
}

export const QuotePDFGenerator = ({ document }: { document: any }) => {
  const [generating, setGenerating] = useState(false)
  const client = useClient()

  const generateQuotePDF = async () => {
    setGenerating(true)
    
    try {
      // For now, we'll just create a simple text file as placeholder
      // In production, you'd want to integrate with a proper PDF generation service
      const quoteData: QuoteData = {
        requestId: document.requestId,
        contact: document.contact,
        jobSpecs: document.jobSpecs,
        estimate: document.estimate,
      }

      // Create simple quote content
      const content = `Quote Request: ${quoteData.requestId}
      
Customer: ${quoteData.contact.firstName} ${quoteData.contact.lastName}
Email: ${quoteData.contact.email}
Phone: ${quoteData.contact.phone}
${quoteData.contact.company ? `Company: ${quoteData.contact.company}` : ''}

Product: ${quoteData.jobSpecs.productType}
Quantity: ${quoteData.jobSpecs.quantity}
${quoteData.jobSpecs.size ? `Size: ${quoteData.jobSpecs.size}` : ''}
${quoteData.jobSpecs.paperType ? `Paper: ${quoteData.jobSpecs.paperType}` : ''}
${quoteData.jobSpecs.finish ? `Finish: ${quoteData.jobSpecs.finish}` : ''}
Turnaround: ${quoteData.jobSpecs.turnaround}
${quoteData.jobSpecs.additionalNotes ? `Notes: ${quoteData.jobSpecs.additionalNotes}` : ''}

${quoteData.estimate ? `
QUOTE ESTIMATE: ${quoteData.estimate.currency === 'USD' ? '$' : quoteData.estimate.currency}${quoteData.estimate.amount}
Valid until: ${quoteData.estimate.validUntil}
${quoteData.estimate.notes ? `Notes: ${quoteData.estimate.notes}` : ''}
` : ''}

Generated: ${new Date().toLocaleString()}
`
      
      // Convert to blob
      const blob = new Blob([content], { type: 'text/plain' })
      
      // Upload as an asset
      const asset = await client.assets.upload('file', blob, {
        filename: `quote-${document.requestId}.txt`,
        contentType: 'text/plain',
      })

      // Update the document
      await client
        .patch(document._id)
        .set({
          quotePDF: {
            _type: 'file',
            asset: {
              _type: 'reference',
              _ref: asset._id,
            },
          },
        })
        .commit()

      console.log('Quote file generated successfully')
    } catch (error) {
      console.error('Error generating quote file:', error)
    } finally {
      setGenerating(false)
    }
  }

  if (!document.contact || !document.jobSpecs) {
    return (
      <Card padding={4} radius={2} shadow={1}>
        <Text size={1} muted>
          Complete the contact information and job specifications to generate a quote file.
        </Text>
      </Card>
    )
  }

  return (
    <Card padding={4} radius={2} shadow={1}>
      <Stack space={3}>
        <Text weight="semibold">Quote File Generator</Text>
        
        {document.quotePDF ? (
          <Flex align="center" gap={3}>
            <Text size={1} muted>
              Quote file attached
            </Text>
            <Button
              text="Download"
              tone="primary"
              icon={DownloadIcon}
              onClick={() => {
                const url = document.quotePDF.asset?.url
                if (url && typeof window !== 'undefined') {
                  window.open(url, '_blank')
                }
              }}
            />
          </Flex>
        ) : (
          <Button
            text={generating ? "Generating..." : "Generate Quote File"}
            tone="primary"
            disabled={generating}
            onClick={generateQuotePDF}
          />
        )}
        
        <Text size={1} muted>
          This will generate a quote file based on the current information and attach it to this request.
        </Text>
      </Stack>
    </Card>
  )
}

export default QuotePDFGenerator
