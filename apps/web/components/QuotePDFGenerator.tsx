// @ts-nocheck
'use client'

import React from 'react'
import { Document, Page, Text, View, StyleSheet, PDFDownloadLink, Font } from '@react-pdf/renderer'

// PDF styles
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#fff',
    padding: 30,
    fontFamily: 'Helvetica'
  },
  header: {
    marginBottom: 20,
    borderBottom: 2,
    borderBottomColor: '#e2e8f0',
    paddingBottom: 10
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 5
  },
  subtitle: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 10
  },
  section: {
    marginBottom: 15,
    padding: 10,
    backgroundColor: '#f8fafc',
    borderRadius: 4
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#334155',
    marginBottom: 8,
    borderBottom: 1,
    borderBottomColor: '#e2e8f0',
    paddingBottom: 4
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5
  },
  label: {
    fontSize: 10,
    color: '#64748b',
    fontWeight: 'bold',
    width: '40%'
  },
  value: {
    fontSize: 10,
    color: '#1e293b',
    width: '60%'
  },
  description: {
    fontSize: 10,
    color: '#475569',
    lineHeight: 1.4,
    marginTop: 5
  },
  footer: {
    marginTop: 'auto',
    paddingTop: 20,
    borderTop: 1,
    borderTopColor: '#e2e8f0',
    textAlign: 'center'
  },
  footerText: {
    fontSize: 8,
    color: '#64748b'
  },
  estimateSection: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#f1f5f9',
    borderRadius: 4,
    border: 1,
    borderColor: '#cbd5e1'
  },
  estimateTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 10,
    textAlign: 'center'
  },
  estimateAmount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#059669',
    textAlign: 'center',
    marginBottom: 5
  },
  estimateNote: {
    fontSize: 8,
    color: '#64748b',
    textAlign: 'center',
    fontStyle: 'italic'
  }
})

interface QuoteData {
  requestId: string
  customer: {
    firstName: string
    lastName: string
    email: string
    phone: string
    company?: string
  }
  product: {
    type: string
    quantity: string
    size?: string
    paperType?: string
    finish?: string
    turnaround: string
    notes?: string
  }
  estimate?: {
    amount: number
    currency: string
    validUntil: string
    notes?: string
  }
  createdAt: string
}

// PDF Document Component
const QuotePDF = ({ data }: { data: QuoteData }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Print Quote</Text>
        <Text style={styles.subtitle}>Quote ID: {data.requestId}</Text>
        <Text style={styles.subtitle}>Generated: {new Date(data.createdAt).toLocaleDateString()}</Text>
      </View>

      {/* Customer Information */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Customer Information</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Name:</Text>
          <Text style={styles.value}>{data.customer.firstName} {data.customer.lastName}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Email:</Text>
          <Text style={styles.value}>{data.customer.email}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Phone:</Text>
          <Text style={styles.value}>{data.customer.phone}</Text>
        </View>
        {data.customer.company && (
          <View style={styles.row}>
            <Text style={styles.label}>Company:</Text>
            <Text style={styles.value}>{data.customer.company}</Text>
          </View>
        )}
      </View>

      {/* Product Specifications */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Product Specifications</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Product Type:</Text>
          <Text style={styles.value}>{data.product.type}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Quantity:</Text>
          <Text style={styles.value}>{data.product.quantity}</Text>
        </View>
        {data.product.size && (
          <View style={styles.row}>
            <Text style={styles.label}>Size:</Text>
            <Text style={styles.value}>{data.product.size}</Text>
          </View>
        )}
        {data.product.paperType && (
          <View style={styles.row}>
            <Text style={styles.label}>Paper Type:</Text>
            <Text style={styles.value}>{data.product.paperType}</Text>
          </View>
        )}
        {data.product.finish && (
          <View style={styles.row}>
            <Text style={styles.label}>Finish:</Text>
            <Text style={styles.value}>{data.product.finish}</Text>
          </View>
        )}
        <View style={styles.row}>
          <Text style={styles.label}>Turnaround:</Text>
          <Text style={styles.value}>{data.product.turnaround}</Text>
        </View>
        {data.product.notes && (
          <View>
            <Text style={styles.label}>Additional Notes:</Text>
            <Text style={styles.description}>{data.product.notes}</Text>
          </View>
        )}
      </View>

      {/* Estimate Section */}
      {data.estimate && (
        <View style={styles.estimateSection}>
          <Text style={styles.estimateTitle}>Quote Estimate</Text>
          <Text style={styles.estimateAmount}>
            {data.estimate.currency === 'USD' ? '$' : data.estimate.currency}{data.estimate.amount.toLocaleString()}
          </Text>
          <Text style={styles.estimateNote}>
            Valid until: {new Date(data.estimate.validUntil).toLocaleDateString()}
          </Text>
          {data.estimate.notes && (
            <Text style={styles.description}>{data.estimate.notes}</Text>
          )}
        </View>
      )}

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          DigiPrint Plus - Professional Printing Services
        </Text>
        <Text style={styles.footerText}>
          Thank you for choosing our services. Contact us for any questions about this quote.
        </Text>
      </View>
    </Page>
  </Document>
)

interface QuotePDFGeneratorProps {
  data: QuoteData
  fileName?: string
  children?: React.ReactNode
}

export const QuotePDFGenerator: React.FC<QuotePDFGeneratorProps> = ({ 
  data, 
  fileName = `quote-${data.requestId}.pdf`,
  children 
}) => {
  return (
    <PDFDownloadLink 
      document={<QuotePDF data={data} />} 
      fileName={fileName}
    >
      {({ blob, url, loading, error }) => {
        if (loading) return 'Generating PDF...'
        if (error) return 'Error generating PDF'
        return children || 'Download Quote PDF'
      }}
    </PDFDownloadLink>
  )
}

export default QuotePDFGenerator
