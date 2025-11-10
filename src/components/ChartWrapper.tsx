import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts'

type Data = { name: string; value: number }

export default function ChartWrapper({ data }: { data: Data[] }) {
  return (
    <div className="w-full h-64 card p-3">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 8, bottom: 8, left: 8 }}>
          <XAxis dataKey="name" stroke="#94a3b8"/>
          <YAxis allowDecimals={false} stroke="#94a3b8"/>
          <Tooltip />
          <Bar dataKey="value" fill="#2d85ff" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}


