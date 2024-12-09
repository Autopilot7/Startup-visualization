import StartupCharts from '@/components/chart/StartupCharts'
import Title from "@/components/Title";

export default function Visualization() {
  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col sm:flex-row justify-items-start gap-4 mb-6">
        <Title>Visualization</Title>
      </div>
      <StartupCharts />
    </div>
  )
}

