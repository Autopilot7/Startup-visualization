"use client"

import React from 'react'
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

// Updated sample data with P0/P1/P2 priorities
const startupData = {
  categories: [
    { name: 'Technology', count: 50, active: 40, inactive: 10, p0: 15, p1: 20, p2: 15 },
    { name: 'Travel', count: 30, active: 25, inactive: 5, p0: 10, p1: 15, p2: 5 },
    { name: 'Healthcare', count: 40, active: 35, inactive: 5, p0: 20, p1: 15, p2: 5 },
    { name: 'Finance', count: 25, active: 20, inactive: 5, p0: 10, p1: 10, p2: 5 },
    { name: 'Education', count: 35, active: 30, inactive: 5, p0: 15, p1: 15, p2: 5 },
    { name: 'Social Media', count: 20, active: 15, inactive: 5, p0: 5, p1: 10, p2: 5 },
    { name: 'Others', count: 15, active: 10, inactive: 5, p0: 5, p1: 5, p2: 5 },
  ],
  batches: [
    { 
      name: 'AY 22-23', 
      Technology: { active: 15, inactive: 5, p0: 5, p1: 10, p2: 5 },
      Travel: { active: 8, inactive: 2, p0: 3, p1: 5, p2: 2 },
      Healthcare: { active: 12, inactive: 3, p0: 6, p1: 6, p2: 3 },
      Finance: { active: 6, inactive: 2, p0: 3, p1: 3, p2: 2 },
      Education: { active: 10, inactive: 2, p0: 4, p1: 5, p2: 3 },
      'Social Media': { active: 5, inactive: 2, p0: 2, p1: 3, p2: 2 },
      Others: { active: 3, inactive: 2, p0: 1, p1: 2, p2: 2 }
    },
    { 
      name: 'AY 23-24', 
      Technology: { active: 20, inactive: 5, p0: 8, p1: 12, p2: 5 },
      Travel: { active: 12, inactive: 3, p0: 5, p1: 7, p2: 3 },
      Healthcare: { active: 15, inactive: 3, p0: 7, p1: 8, p2: 3 },
      Finance: { active: 8, inactive: 2, p0: 4, p1: 4, p2: 2 },
      Education: { active: 13, inactive: 3, p0: 6, p1: 7, p2: 3 },
      'Social Media': { active: 7, inactive: 2, p0: 3, p1: 4, p2: 2 },
      Others: { active: 5, inactive: 2, p0: 2, p1: 3, p2: 2 }
    },
    { 
      name: 'AY 24-25', 
      Technology: { active: 25, inactive: 5, p0: 10, p1: 15, p2: 5 },
      Travel: { active: 16, inactive: 4, p0: 7, p1: 9, p2: 4 },
      Healthcare: { active: 18, inactive: 4, p0: 9, p1: 9, p2: 4 },
      Finance: { active: 10, inactive: 2, p0: 5, p1: 5, p2: 2 },
      Education: { active: 17, inactive: 3, p0: 8, p1: 9, p2: 3 },
      'Social Media': { active: 9, inactive: 2, p0: 4, p1: 5, p2: 2 },
      Others: { active: 6, inactive: 2, p0: 2, p1: 4, p2: 2 }
    },
  ]
}

const COLORS = {
  Technology: 'hsl(var(--chart-1))',
  Travel: 'hsl(var(--chart-2))',
  Healthcare: 'hsl(var(--chart-3))',
  Finance: 'hsl(var(--chart-4))',
  Education: 'hsl(var(--chart-5))',
  'Social Media': 'hsl(var(--chart-6))',
  Others: 'hsl(var(--chart-7))',
}

const CustomPieTooltip = ({ active, payload }: { active?: boolean, payload?: Array<any> }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload
    return (
      <div className="bg-white p-2 border rounded shadow">
        <p className="font-bold">{data.name}</p>
        <p>Total: {data.count}</p>
        <p>Active: {data.active}</p>
        <p>Inactive: {data.inactive}</p>
        <p>P0: {data.p0}</p>
        <p>P1: {data.p1}</p>
        <p>P2: {data.p2}</p>
      </div>
    )
  }
  return null
}

const CustomBarTooltip = ({ active, payload, label }: { active?: boolean, payload?: Array<any>, label?: string }) => {
  if (active && payload && payload.length) {
    const categoryData = payload[0].payload[payload[0].name]
    return (
      <div className="bg-white p-2 border rounded shadow">
        <p className="font-bold">{label} - {payload[0].name}</p>
        <p>Active: {categoryData.active}</p>
        <p>Inactive: {categoryData.inactive}</p>
        <p>P0: {categoryData.p0}</p>
        <p>P1: {categoryData.p1}</p>
        <p>P2: {categoryData.p2}</p>
      </div>
    )
  }
  return null
}

export default function StartupCharts() {
  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Startup Categories</CardTitle>
          <CardDescription>Distribution of startups across different categories</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={startupData.categories}
                  dataKey="count"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={150}
                  label
                >
                  {startupData.categories.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[entry.name as keyof typeof COLORS] || COLORS.Others} />
                  ))}
                </Pie>
                <Tooltip content={<CustomPieTooltip />} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Startups Across Batches</CardTitle>
          <CardDescription>Number of startups in each category across different batches</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={startupData.batches}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip content={<CustomBarTooltip />} />
                <Legend />
                {Object.entries(COLORS).map(([category, color]) => (
                  <Bar 
                    key={category} 
                    dataKey={(entry) => entry[category]?.active + entry[category]?.inactive} 
                    stackId="a" 
                    fill={color} 
                    name={category}
                  />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

