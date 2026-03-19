/**
 * Specialized Components Showcase Page
 * 
 * Demo page for Phase 3-C specialized components:
 * - Charts (Bar, Line, Pie, Area, Radar)
 * - Statistics cards
 * - Timeline and Activity Feed
 * - Calendar View
 * - Funnel and Heatmap
 * 
 * @version 1.0.0
 * @since Phase 3-C (Steps 166-180/400)
 */

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Button } from '../components/ui/button';
import { BarChartCard } from '../components/crm/BarChartCard';
import { LineChartCard } from '../components/crm/LineChartCard';
import { PieChartCard } from '../components/crm/PieChartCard';
import { AreaChartCard } from '../components/crm/AreaChartCard';
import { RadarChartCard } from '../components/crm/RadarChartCard';
import { StatCard } from '../components/crm/StatCard';
import { MetricCard } from '../components/crm/MetricCard';
import { ProgressCard } from '../components/crm/ProgressCard';
import { Timeline } from '../components/crm/Timeline';
import { ActivityFeed, ActivityItem } from '../components/crm/ActivityFeed';
import { CalendarView, CalendarEvent } from '../components/crm/CalendarView';
import { FunnelChart } from '../components/crm/FunnelChart';
import { HeatmapCard } from '../components/crm/HeatmapCard';
import {
  DollarSign,
  Users,
  ShoppingCart,
  TrendingUp,
  BarChart3,
  Activity,
  Calendar,
  Target,
  Mail,
  Phone,
  Video,
  FileText
} from 'lucide-react';
import { addDays, subDays } from 'date-fns';

export default function SpecializedComponentsShowcase() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  // Mock data for charts
  const revenueData = [
    { name: 'Jan', revenue: 4000, profit: 2400 },
    { name: 'Feb', revenue: 3000, profit: 1398 },
    { name: 'Mar', revenue: 2000, profit: 9800 },
    { name: 'Apr', revenue: 2780, profit: 3908 },
    { name: 'May', revenue: 1890, profit: 4800 },
    { name: 'Jun', revenue: 2390, profit: 3800 },
    { name: 'Jul', revenue: 3490, profit: 4300 },
  ];

  const trafficData = [
    { name: 'Mon', visitors: 400, pageviews: 2400 },
    { name: 'Tue', visitors: 300, pageviews: 1398 },
    { name: 'Wed', visitors: 200, pageviews: 9800 },
    { name: 'Thu', visitors: 278, pageviews: 3908 },
    { name: 'Fri', visitors: 189, pageviews: 4800 },
    { name: 'Sat', visitors: 239, pageviews: 3800 },
    { name: 'Sun', visitors: 349, pageviews: 4300 },
  ];

  const channelData = [
    { name: 'Direct', value: 4500 },
    { name: 'Organic Search', value: 3200 },
    { name: 'Social Media', value: 2800 },
    { name: 'Email', value: 1900 },
    { name: 'Referral', value: 1200 },
  ];

  const performanceData = [
    { category: 'Sales', current: 85, previous: 75 },
    { category: 'Marketing', current: 70, previous: 65 },
    { category: 'Support', current: 90, previous: 85 },
    { category: 'Product', current: 75, previous: 80 },
    { category: 'Operations', current: 80, previous: 70 },
  ];

  // Mock timeline data
  const timelineItems = [
    {
      title: 'Deal Closed',
      description: 'Acme Corp - $50,000',
      timestamp: '2 hours ago',
      icon: DollarSign,
      iconColor: 'bg-green-100 text-green-600'
    },
    {
      title: 'Meeting Scheduled',
      description: 'Product demo with TechStart Inc.',
      timestamp: '5 hours ago',
      icon: Video,
      iconColor: 'bg-blue-100 text-blue-600'
    },
    {
      title: 'Proposal Sent',
      description: 'Q1 Marketing Campaign',
      timestamp: '1 day ago',
      icon: FileText,
      iconColor: 'bg-purple-100 text-purple-600'
    },
    {
      title: 'New Lead',
      description: 'Enterprise inquiry from DataFlow Systems',
      timestamp: '2 days ago',
      icon: Users,
      iconColor: 'bg-amber-100 text-amber-600'
    }
  ];

  // Mock activity data
  const activityItems: ActivityItem[] = [
    {
      id: '1',
      user: { name: 'Sarah Johnson', avatar: '' },
      type: 'deal',
      description: 'closed a deal worth $50,000',
      timestamp: subDays(new Date(), 0),
      badge: { label: 'Deal', variant: 'default' }
    },
    {
      id: '2',
      user: { name: 'Michael Chen', avatar: '' },
      type: 'contact',
      description: 'added 5 new contacts',
      timestamp: subDays(new Date(), 0),
      badge: { label: 'Contact', variant: 'secondary' }
    },
    {
      id: '3',
      user: { name: 'Emily Rodriguez', avatar: '' },
      type: 'task',
      description: 'completed follow-up tasks',
      timestamp: subDays(new Date(), 1),
      badge: { label: 'Task', variant: 'outline' }
    },
    {
      id: '4',
      user: { name: 'David Kim', avatar: '' },
      type: 'meeting',
      description: 'scheduled a meeting with client',
      timestamp: subDays(new Date(), 1)
    },
    {
      id: '5',
      user: { name: 'Lisa Wang', avatar: '' },
      type: 'note',
      description: 'added notes to opportunity',
      timestamp: subDays(new Date(), 2)
    }
  ];

  // Mock calendar events
  const calendarEvents: CalendarEvent[] = [
    {
      id: '1',
      title: 'Product Demo',
      date: new Date(),
      color: 'bg-blue-100 text-blue-800'
    },
    {
      id: '2',
      title: 'Client Meeting',
      date: addDays(new Date(), 1),
      color: 'bg-green-100 text-green-800'
    },
    {
      id: '3',
      title: 'Team Standup',
      date: addDays(new Date(), 2),
      color: 'bg-purple-100 text-purple-800'
    },
    {
      id: '4',
      title: 'Proposal Review',
      date: addDays(new Date(), 5),
      color: 'bg-amber-100 text-amber-800'
    }
  ];

  // Mock funnel data
  const funnelStages = [
    { name: 'Leads', value: 1000, color: '#3b82f6' },
    { name: 'Qualified', value: 750, color: '#10b981' },
    { name: 'Proposals', value: 450, color: '#f59e0b' },
    { name: 'Negotiations', value: 250, color: '#ef4444' },
    { name: 'Closed', value: 150, color: '#8b5cf6' }
  ];

  // Mock heatmap data
  const heatmapData = [
    { x: 'Mon', y: '9AM', value: 20 },
    { x: 'Mon', y: '12PM', value: 45 },
    { x: 'Mon', y: '3PM', value: 70 },
    { x: 'Mon', y: '6PM', value: 30 },
    { x: 'Tue', y: '9AM', value: 35 },
    { x: 'Tue', y: '12PM', value: 60 },
    { x: 'Tue', y: '3PM', value: 85 },
    { x: 'Tue', y: '6PM', value: 40 },
    { x: 'Wed', y: '9AM', value: 50 },
    { x: 'Wed', y: '12PM', value: 75 },
    { x: 'Wed', y: '3PM', value: 90 },
    { x: 'Wed', y: '6PM', value: 55 },
    { x: 'Thu', y: '9AM', value: 40 },
    { x: 'Thu', y: '12PM', value: 65 },
    { x: 'Thu', y: '3PM', value: 80 },
    { x: 'Thu', y: '6PM', value: 45 },
    { x: 'Fri', y: '9AM', value: 30 },
    { x: 'Fri', y: '12PM', value: 55 },
    { x: 'Fri', y: '3PM', value: 70 },
    { x: 'Fri', y: '6PM', value: 25 }
  ];

  // Mock sparkline data
  const sparklineData = Array.from({ length: 30 }, (_, i) => ({
    value: Math.floor(Math.random() * 100) + 50
  }));

  return (
    <div className="container mx-auto py-8 space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Specialized Components Showcase</h1>
        <p className="text-muted-foreground">
          Phase 3-C: Charts, Statistics, Timeline, Calendar, and Advanced Visualizations
        </p>
      </div>

      <Tabs defaultValue="charts" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="charts">Charts</TabsTrigger>
          <TabsTrigger value="stats">Statistics</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
          <TabsTrigger value="calendar">Calendar</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
        </TabsList>

        {/* Charts Tab */}
        <TabsContent value="charts" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Chart Components</CardTitle>
              <CardDescription>
                Various chart types using Recharts library
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Bar Chart */}
              <BarChartCard
                title="Monthly Revenue & Profit"
                description="Revenue and profit comparison by month"
                data={revenueData}
                dataKeys={[
                  { key: 'revenue', color: '#3b82f6', name: 'Revenue' },
                  { key: 'profit', color: '#10b981', name: 'Profit' }
                ]}
                showLegend
                showGrid
              />

              {/* Line Chart */}
              <LineChartCard
                title="Website Traffic"
                description="Daily visitors and pageviews"
                data={trafficData}
                dataKeys={[
                  { key: 'visitors', color: '#8b5cf6', name: 'Visitors' },
                  { key: 'pageviews', color: '#ec4899', name: 'Pageviews' }
                ]}
                showLegend
                showGrid
                showDots
              />

              {/* Grid Layout for Pie and Area */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <PieChartCard
                  title="Traffic Sources"
                  description="Distribution by channel"
                  data={channelData}
                  showLegend
                  showLabels={false}
                  donut
                  centerLabel="Total"
                />

                <AreaChartCard
                  title="Revenue Trends"
                  description="Stacked area chart"
                  data={revenueData}
                  dataKeys={[
                    { key: 'revenue', color: '#3b82f6', name: 'Revenue' },
                    { key: 'profit', color: '#10b981', name: 'Profit' }
                  ]}
                  stacked
                />
              </div>

              {/* Radar Chart */}
              <RadarChartCard
                title="Team Performance"
                description="Multi-dimensional performance comparison"
                data={performanceData}
                dataKeys={[
                  { key: 'current', color: '#3b82f6', name: 'Current' },
                  { key: 'previous', color: '#94a3b8', name: 'Previous' }
                ]}
                showLegend
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Statistics Tab */}
        <TabsContent value="stats" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Statistics Components</CardTitle>
              <CardDescription>
                KPI cards, metrics, and progress indicators
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Stat Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                  title="Total Revenue"
                  value="$45,231"
                  description="Last 30 days"
                  trend={{ value: '+20.1%', direction: 'up' }}
                  icon={DollarSign}
                />
                <StatCard
                  title="New Customers"
                  value="2,350"
                  description="Last 30 days"
                  trend={{ value: '+12.5%', direction: 'up' }}
                  icon={Users}
                />
                <StatCard
                  title="Total Orders"
                  value="1,234"
                  description="Last 30 days"
                  trend={{ value: '-5.2%', direction: 'down' }}
                  icon={ShoppingCart}
                />
                <StatCard
                  title="Conversion Rate"
                  value="3.2%"
                  description="Last 30 days"
                  trend={{ value: '0%', direction: 'neutral' }}
                  icon={TrendingUp}
                />
              </div>

              {/* Metric Cards */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <MetricCard
                  title="Monthly Recurring Revenue"
                  value={45231}
                  previousValue={38900}
                  description="vs. last month"
                  icon={DollarSign}
                  isCurrency
                  chartData={sparklineData}
                  chartColor="#10b981"
                />
                <MetricCard
                  title="Active Users"
                  value={2350}
                  previousValue={2100}
                  description="vs. last month"
                  icon={Users}
                  chartData={sparklineData}
                  chartColor="#3b82f6"
                />
              </div>

              {/* Progress Cards */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ProgressCard
                  title="Q1 Sales Goal"
                  current={87500}
                  goal={100000}
                  description="Target for this quarter"
                  unit="revenue"
                  isCurrency
                  showPercentage
                />
                <ProgressCard
                  title="New Customers Goal"
                  current={234}
                  goal={300}
                  description="Monthly target"
                  unit="customers"
                  showPercentage
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Timeline Tab */}
        <TabsContent value="timeline" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Timeline */}
            <Card>
              <CardHeader>
                <CardTitle>Timeline Component</CardTitle>
                <CardDescription>
                  Chronological event display with icons
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Timeline items={timelineItems} />
              </CardContent>
            </Card>

            {/* Activity Feed */}
            <ActivityFeed
              items={activityItems}
              title="Activity Feed"
              maxItems={10}
              showCard
            />
          </div>
        </TabsContent>

        {/* Calendar Tab */}
        <TabsContent value="calendar" className="space-y-6">
          <CalendarView
            events={calendarEvents}
            selectedDate={selectedDate}
            onSelectDate={setSelectedDate}
            showCard
            title="Calendar View"
          />
        </TabsContent>

        {/* Advanced Tab */}
        <TabsContent value="advanced" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Advanced Visualizations</CardTitle>
              <CardDescription>
                Funnel charts and heatmaps for specialized data
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Funnel Chart */}
              <FunnelChart
                title="Sales Funnel"
                description="Conversion funnel from leads to closed deals"
                stages={funnelStages}
                showConversion
              />

              {/* Heatmap */}
              <HeatmapCard
                title="Activity Heatmap"
                description="User activity by day and time"
                data={heatmapData}
                xLabels={['Mon', 'Tue', 'Wed', 'Thu', 'Fri']}
                yLabels={['9AM', '12PM', '3PM', '6PM']}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
