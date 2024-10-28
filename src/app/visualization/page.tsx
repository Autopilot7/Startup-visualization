"use client";
import { useState } from 'react';
import { Bar, BarChart, Line, LineChart, Pie, PieChart, Cell, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Title from "@/components/Title";

// Sample data for the charts
const fundingData = [
  { name: 'Seed', value: 50 },
  { name: 'Series A', value: 30 },
  { name: 'Series B', value: 15 },
  { name: 'Series C', value: 5 },
];

const growthData = [
  { month: 'Jan', users: 1000, revenue: 500 },
  { month: 'Feb', users: 1500, revenue: 750 },
  { month: 'Mar', users: 2000, revenue: 1000 },
  { month: 'Apr', users: 2500, revenue: 1250 },
  { month: 'May', users: 3000, revenue: 1500 },
  { month: 'Jun', users: 3500, revenue: 1750 },
];

const industryData = [
  { name: 'SaaS', value: 400 },
  { name: 'Fintech', value: 300 },
  { name: 'E-commerce', value: 200 },
  { name: 'HealthTech', value: 100 },
  { name: 'EdTech', value: 80 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

export default function Visualization() {
  const [timeRange, setTimeRange] = useState('6m');

  return (
    <div className="p-4 bg-background">
      <Title>Startup Visualization</Title>
      <div className="mt-4 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Funding Rounds Distribution</CardTitle>
            <CardDescription>Percentage of startups in each funding stage</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-full w-full"> 
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={fundingData} width={400} height={300}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Startup Growth Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Startup Growth</CardTitle>
            <CardDescription>User acquisition and revenue over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select time range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1m">Last Month</SelectItem>
                  <SelectItem value="3m">Last 3 Months</SelectItem>
                  <SelectItem value="6m">Last 6 Months</SelectItem>
                  <SelectItem value="1y">Last Year</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="h-full w-full mt-4"> 
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={growthData} width={450} height={300}>
                  <XAxis dataKey="month" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Legend />
                  <Line yAxisId="left" type="monotone" dataKey="users" stroke="#8884d8" />
                  <Line yAxisId="right" type="monotone" dataKey="revenue" stroke="#82ca9d" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Industry Distribution Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Industry Distribution</CardTitle>
            <CardDescription>Breakdown of startups by industry</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-full w-full"> 
              <ResponsiveContainer width="100%" height="100%">
                <PieChart width={500} height={300}>
                  <Pie
                    data={industryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {industryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
