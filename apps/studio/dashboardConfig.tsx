import React, { useState, useEffect } from 'react'
import { dashboardTool } from '@sanity/dashboard'
import { Card, Stack, Text, Button, Flex, Box, Badge, Tooltip } from '@sanity/ui'
import { 
  CalendarIcon, 
  DocumentIcon, 
  PackageIcon, 
  CogIcon, 
  TrendUpwardIcon,
  InfoOutlineIcon,
  UploadIcon,
  UserIcon,
  ChartUpwardIcon
} from '@sanity/icons'
import { CSVUploadWidget } from './src/components/CSVUploadWidget'

// Type definitions
interface KPIWidgetProps {
  title: string
  value: string | number
  icon: React.ComponentType
  color?: string
  trend?: 'up' | 'down' | 'neutral'
  trendValue?: string
}

interface RecentDocumentsWidgetProps {
  title: string
  schemaType: string
  layout?: { width: string }
}

// Enhanced KPI Widget Component with animations and trends
const KPIWidget: React.FC<KPIWidgetProps> = ({ 
  title, 
  value, 
  icon: Icon, 
  color = 'primary',
  trend,
  trendValue 
}) => {
  const [animatedValue, setAnimatedValue] = useState<string | number>(0)
  
  // Parse the target value safely
  const getTargetValue = (val: string | number): number => {
    if (typeof val === 'number') return val
    const parsed = parseFloat(val.toString().replace(/[^0-9.-]/g, ''))
    return isNaN(parsed) ? 0 : parsed
  }
  
  const targetValue = getTargetValue(value)
  const isStringValue = typeof value === 'string' && isNaN(Number(value))

  useEffect(() => {
    if (isStringValue) {
      // For string values like "$2,840", just set the value directly
      setAnimatedValue(value)
      return
    }

    // For numeric values, animate
    const duration = 1000
    const steps = 60
    const increment = targetValue / steps
    let current = 0

    const timer = setInterval(() => {
      current += increment
      if (current >= targetValue) {
        setAnimatedValue(targetValue)
        clearInterval(timer)
      } else {
        setAnimatedValue(Math.floor(current))
      }
    }, duration / steps)

    return () => clearInterval(timer)
  }, [targetValue, value, isStringValue])

  return (
    <Card 
      padding={4} 
      radius={2} 
      shadow={1}
      style={{
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        cursor: 'pointer'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px)'
        e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)'
        e.currentTarget.style.boxShadow = ''
      }}
    >
      <Flex align="center" justify="space-between">
        <Flex align="center" gap={3}>
          <Box>
            <Text size={3} weight="bold" style={{ color: `var(--card-${color}-fg-color)` }}>
              <Icon />
            </Text>
          </Box>
          <Stack space={1}>
            <Text size={1} muted>
              {title}
            </Text>
            <Text size={4} weight="bold">
              {animatedValue || '0'}
            </Text>
          </Stack>
        </Flex>
        {trend && trendValue && (
          <Badge 
            tone={trend === 'up' ? 'positive' : trend === 'down' ? 'critical' : 'default'}
            mode="outline"
          >
            {trend === 'up' && <TrendUpwardIcon />} {trendValue}
          </Badge>
        )}
      </Flex>
    </Card>
  )
}

// Enhanced Quick Actions Widget with tooltips
const QuickActionsWidget = () => {
  const actions = [
    {
      label: 'Add New Product',
      icon: PackageIcon,
      path: '/studio/desk/product;type=product;template=product',
      description: 'Create a new product listing for your catalog'
    },
    {
      label: 'View Quote Requests',
      icon: DocumentIcon,
      path: '/studio/desk/quoteRequest',
      description: 'Review and manage customer quote requests'
    },
    {
      label: 'Manage Customers',
      icon: UserIcon,
      path: '/studio/desk/user',
      description: 'View and edit customer information'
    },
    {
      label: 'Site Settings',
      icon: CogIcon,
      path: '/studio/desk/siteSettings',
      description: 'Configure your website settings and preferences'
    }
  ]

  return (
    <Card padding={4} radius={2} shadow={1}>
      <Stack space={4}>
        <Flex align="center" gap={2}>
          <Text size={2} weight="bold">
            Quick Actions
          </Text>
          <Tooltip
            content={
              <Box padding={2}>
                <Text size={1}>
                  Click these buttons to quickly access common tasks
                </Text>
              </Box>
            }
          >
            <InfoOutlineIcon style={{ color: 'var(--card-muted-fg-color)' }} />
          </Tooltip>
        </Flex>
        <Stack space={3}>
          {actions.map((action, index) => (
            <Tooltip
              key={index}
              content={
                <Box padding={2}>
                  <Text size={1}>{action.description}</Text>
                </Box>
              }
            >
              <Button 
                mode="ghost" 
                tone="primary" 
                text={action.label}
                icon={action.icon}
                onClick={() => window.open(action.path, '_blank')}
                style={{ width: '100%', justifyContent: 'flex-start' }}
              />
            </Tooltip>
          ))}
        </Stack>
      </Stack>
    </Card>
  )
}

// Welcome Message Widget with current business insights
const WelcomeWidget = () => {
  const currentDate = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  })

  return (
    <Card padding={4} radius={2} shadow={1} tone="primary">
      <Stack space={3}>
        <Flex align="center" justify="space-between">
          <Stack space={2}>
            <Text size={3} weight="bold">
              Welcome to DigiPrintPlus Studio
            </Text>
            <Text size={1} muted>
              {currentDate}
            </Text>
          </Stack>
          <Badge tone="positive" mode="outline">
            Online
          </Badge>
        </Flex>
        <Text size={1}>
          Manage your printing business content, products, and customer requests from this dashboard.
          Your website is live and accepting orders.
        </Text>
      </Stack>
    </Card>
  )
}

// Enhanced Recent Documents Widget with status indicators
const RecentDocumentsWidget: React.FC<RecentDocumentsWidgetProps> = ({ title, schemaType }) => {
  return (
    <Card padding={4} radius={2} shadow={1}>
      <Stack space={4}>
        <Flex align="center" justify="space-between">
          <Text size={2} weight="bold">
            {title}
          </Text>
          <Badge tone="caution" mode="outline">
            Live Data
          </Badge>
        </Flex>
        
        <Stack space={3}>
          <Text size={1} muted>
            Recent {schemaType} documents will appear here once you have data.
          </Text>
          
          {/* Mock recent items for demonstration */}
          {schemaType === 'quoteRequest' && (
            <Stack space={2}>
              <Flex align="center" justify="space-between">
                <Text size={1}>Business Cards - John Doe</Text>
                <Badge tone="caution">Pending</Badge>
              </Flex>
              <Flex align="center" justify="space-between">
                <Text size={1}>Flyers - ABC Corp</Text>
                <Badge tone="positive">Approved</Badge>
              </Flex>
            </Stack>
          )}
          
          {schemaType === 'product' && (
            <Stack space={2}>
              <Flex align="center" justify="space-between">
                <Text size={1}>Premium Business Cards</Text>
                <Badge tone="positive">Active</Badge>
              </Flex>
              <Flex align="center" justify="space-between">
                <Text size={1}>A4 Flyers</Text>
                <Badge tone="positive">Active</Badge>
              </Flex>
            </Stack>
          )}
        </Stack>
        
        <Button 
          mode="ghost" 
          tone="primary" 
          text={`View All ${title}`}
          onClick={() => window.open(`/studio/desk/${schemaType}`, '_blank')}
        />
      </Stack>
    </Card>
  )
}

// Business Insights Widget
const BusinessInsightsWidget = () => {
  return (
    <Card padding={4} radius={2} shadow={1}>
      <Stack space={4}>
        <Flex align="center" gap={2}>
          <ChartUpwardIcon />
          <Text size={2} weight="bold">
            Business Insights
          </Text>
        </Flex>
        
        <Stack space={3}>
          <Flex align="center" justify="space-between">
            <Text size={1}>This Week's Revenue</Text>
            <Text size={2} weight="bold" style={{ color: 'var(--card-positive-fg-color)' }}>
              +15%
            </Text>
          </Flex>
          
          <Flex align="center" justify="space-between">
            <Text size={1}>Popular Product</Text>
            <Text size={1} weight="bold">
              Business Cards
            </Text>
          </Flex>
          
          <Flex align="center" justify="space-between">
            <Text size={1}>Response Time</Text>
            <Text size={1} weight="bold">
              2.3 hours
            </Text>
          </Flex>
        </Stack>
        
        <Button 
          mode="ghost" 
          tone="primary" 
          text="View Full Report"
          onClick={() => alert('Full analytics coming soon!')}
        />
      </Stack>
    </Card>
  )
}

export const dashboardConfig = {
  widgets: [
    // Welcome message
    {
      name: 'welcome',
      component: WelcomeWidget,
      layout: { width: 'full' as const }
    },
    
    // KPI Cards row with animations and trends
    {
      name: 'kpi-quotes',
      component: () => (
        <KPIWidget 
          title="Quote Requests" 
          value={12} 
          icon={DocumentIcon}
          color="primary"
          trend="up"
          trendValue="+3"
        />
      ),
      layout: { width: 'small' as const }
    },
    {
      name: 'kpi-products',
      component: () => (
        <KPIWidget 
          title="Active Products" 
          value={48} 
          icon={PackageIcon}
          color="positive"
          trend="up"
          trendValue="+5"
        />
      ),
      layout: { width: 'small' as const }
    },
    {
      name: 'kpi-today',
      component: () => (
        <KPIWidget 
          title="Today's Requests" 
          value={3} 
          icon={CalendarIcon}
          color="caution"
          trend="neutral"
          trendValue="0"
        />
      ),
      layout: { width: 'small' as const }
    },
    {
      name: 'kpi-revenue',
      component: () => (
        <KPIWidget 
          title="Monthly Revenue" 
          value="$2,840" 
          icon={TrendUpwardIcon}
          color="positive"
          trend="up"
          trendValue="+15%"
        />
      ),
      layout: { width: 'small' as const }
    },
    
    // Quick actions with enhanced tooltips
    {
      name: 'quick-actions',
      component: QuickActionsWidget,
      layout: { width: 'medium' as const }
    },
    
    // Business insights
    {
      name: 'business-insights',
      component: BusinessInsightsWidget,
      layout: { width: 'medium' as const }
    },
    
    // CSV Upload widget for bulk operations
    {
      name: 'csv-upload',
      component: () => (
        <CSVUploadWidget
          title="Bulk Product Upload"
          description="Upload a CSV file to add multiple products at once"
          onUpload={(file) => {
            console.log('Uploaded file:', file.name)
            // This would typically send the file to a processing endpoint
          }}
        />
      ),
      layout: { width: 'medium' as const }
    },
    
    // Recent documents with enhanced status
    {
      name: 'recent-quotes',
      component: () => (
        <RecentDocumentsWidget 
          title="Recent Quote Requests"
          schemaType="quoteRequest"
          layout={{ width: 'medium' }}
        />
      ),
      layout: { width: 'medium' as const }
    },
    {
      name: 'recent-products',
      component: () => (
        <RecentDocumentsWidget 
          title="Recent Products"
          schemaType="product"
          layout={{ width: 'medium' }}
        />
      ),
      layout: { width: 'medium' as const }
    }
  ]
}

export default dashboardConfig
