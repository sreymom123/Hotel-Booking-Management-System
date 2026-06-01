import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  TrendingUp, 
  TrendingDown, 
  Calendar, 
  Star, 
  ArrowRight, 
  ChevronRight,
  Info
} from 'lucide-react';

export default function ReportsView() {
  const [timePeriod, setTimePeriod] = useState<'ytd' | '12m'>('12m');
  const [hoveredDataPoint, setHoveredDataPoint] = useState<{ month: string, revenue: string, x: number, y: number } | null>({
    month: 'July',
    revenue: '$142,500',
    x: 400,
    y: 140
  });

  const kpis = {
    ytd: [
      { label: 'Total Revenue', value: '$1,482,000', change: '12.5% vs last year', pos: true },
      { label: 'Avg. Occupancy', value: '84.2%', change: '3.1% vs last month', pos: true },
      { label: 'RevPAR', value: '$214.50', change: '0.8% vs last month', pos: false },
      { label: 'ADR', value: '$254.80', change: '5.2% vs last year', pos: true },
    ],
    '12m': [
      { label: 'Total Revenue', value: '$1,920,500', change: '14.8% vs last year', pos: true },
      { label: 'Avg. Occupancy', value: '86.5%', change: '4.2% vs last month', pos: true },
      { label: 'RevPAR', value: '$225.10', change: '1.2% vs last month', pos: true },
      { label: 'ADR', value: '$260.40', change: '6.5% vs last year', pos: true },
    ]
  };

  const chartPoints = [
    { month: 'Jan', revenue: '$110,000', cx: 100, cy: 220 },
    { month: 'Mar', revenue: '$124,000', cx: 250, cy: 190 },
    { month: 'May', revenue: '$132,000', cx: 400, cy: 140 }, // July is adjacent
    { month: 'Jul', revenue: '$142,500', cx: 550, cy: 110 },
    { month: 'Sep', revenue: '$135,000', cx: 700, cy: 150 },
    { month: 'Nov', revenue: '$151,000', cx: 850, cy: 100 }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-8 pb-10 font-sans"
    >
      {/* Header section with toggle buttons */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-on-surface">Performance Analytics</h2>
          <p className="text-sm text-on-surface-variant mt-1 leading-none">Comprehensive breakdown of hotel revenue and operational metrics.</p>
        </div>
        <div className="flex gap-2 select-none">
          <button 
            onClick={() => setTimePeriod('ytd')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
              timePeriod === 'ytd' 
                ? 'bg-primary-container text-white border-primary-container shadow-sm'
                : 'bg-[#ffffff] text-on-surface-variant hover:bg-surface-container border-outline-variant'
            }`}
          >
            Year-to-Date
          </button>
          
          <button 
            onClick={() => setTimePeriod('12m')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg border transition-all cursor-pointer flex items-center gap-2 ${
              timePeriod === '12m' 
                ? 'bg-primary-container text-white border-primary-container shadow-sm'
                : 'bg-[#ffffff] text-on-surface-variant hover:bg-surface-container border-outline-variant'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            Last 12 Months
          </button>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {kpis[timePeriod].map((kpi, idx) => (
          <div key={idx} className="bg-surface-container-lowest p-6 border border-outline-variant rounded-xl shadow-sm">
            <p className="text-[11px] font-semibold text-on-surface-variant uppercase tracking-wider">{kpi.label}</p>
            <h3 className="text-2xl font-bold text-on-surface mt-2 leading-none">{kpi.value}</h3>
            <div className={`flex items-center gap-1 mt-3 ${kpi.pos ? 'text-status-available' : 'text-rose-600'}`}>
              {kpi.pos ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
              <span className="text-[11px] font-semibold">{kpi.change}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Visual Analytics Segment */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Line Chart Area */}
        <div className="lg:col-span-2 bg-surface-container-lowest p-6 border border-outline-variant rounded-xl shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h4 className="text-sm font-semibold text-on-surface">Monthly Revenue Trends</h4>
            <div className="flex gap-4 select-none">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-status-occupied" />
                <span className="text-[11px] font-semibold text-on-surface-variant">Current Year</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#cbd5e1]" />
                <span className="text-[11px] font-semibold text-on-surface-variant">Previous Year</span>
              </div>
            </div>
          </div>

          {/* Line Chart Grid Canvas */}
          <div className="h-[280px] border border-outline-variant/40 rounded-xl relative overflow-hidden bg-slate-50/50">
            {/* Interactive Tooltip helper */}
            <p className="absolute top-3 left-4 text-[10px] font-semibold text-on-surface-variant flex items-center gap-1">
              <Info className="w-3.5 h-3.5 text-primary-container" />
              Hover points to view historical stats:
            </p>

            <svg className="w-full h-full pt-8 px-4" viewBox="0 0 1000 250">
              {/* Grid Lines */}
              <line x1="0" y1="50" x2="1000" y2="50" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="0" y1="110" x2="1000" y2="110" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="0" y1="170" x2="1000" y2="170" stroke="#f1f5f9" strokeWidth="1" />

              {/* Previous Year Area Plot */}
              <path 
                d="M50,220 Q180,210 320,230 T600,195 T850,170 T1000,180 L1000,250 L50,250 Z" 
                fill="#cbd5e1" 
                opacity="0.25" 
              />
              {/* Previous Year Line */}
              <path 
                d="M50,220 Q180,210 320,230 T600,195 T850,170 T1000,180" 
                fill="none" 
                stroke="#cbd5e1" 
                strokeWidth="2.5" 
                strokeDasharray="4"
              />

              {/* Current Year Line Plot */}
              <path 
                d="M50,200 Q200,140 380,180 T680,110 T880,70 T1000,90" 
                fill="none" 
                stroke="#1a2b4b" 
                strokeWidth="3.5" 
                strokeLinecap="round"
              />

              {/* Interactive SVG Circles */}
              {chartPoints.map((p, idx) => (
                <circle 
                  key={idx}
                  cx={p.cx} 
                  cy={p.cy} 
                  r={hoveredDataPoint?.month === p.month ? "8" : "5"}
                  fill="#1a2b4b" 
                  stroke="white" 
                  strokeWidth="2"
                  className="cursor-pointer transition-all duration-150"
                  onMouseEnter={() => setHoveredDataPoint({ month: p.month, revenue: p.revenue, x: p.cx, y: p.cy })}
                />
              ))}
            </svg>

            {/* Simulated Tooltip element based on Hover state */}
            {hoveredDataPoint && (
              <div 
                className="absolute bg-primary-container text-white p-3 rounded-lg shadow-lg select-none transition-all duration-150 border border-slate-700 pointer-events-none"
                style={{ 
                  left: `${Math.min(800, hoveredDataPoint.x - 60)}px`, 
                  top: `${Math.min(180, hoveredDataPoint.y - 65)}px` 
                }}
              >
                <p className="text-[10px] font-semibold text-slate-300 uppercase tracking-wider">{hoveredDataPoint.month} Summary</p>
                <p className="font-mono text-xs font-bold text-white mt-0.5">{hoveredDataPoint.revenue}</p>
              </div>
            )}
          </div>

          <div className="flex justify-between mt-4 px-6 text-xs font-semibold text-on-surface-variant">
            <span>Jan</span>
            <span>Mar</span>
            <span>May</span>
            <span>Jul</span>
            <span>Sep</span>
            <span>Nov</span>
          </div>
        </div>

        {/* Popularity Progress bars and interior photo */}
        <div className="bg-surface-container-lowest p-6 border border-outline-variant rounded-xl shadow-sm flex flex-col justify-between">
          <div>
            <h4 className="text-sm font-semibold text-on-surface mb-6">Room Type Popularity</h4>
            <div className="space-y-4">
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-on-surface-variant">Deluxe Suite</span>
                  <span className="text-on-surface">42%</span>
                </div>
                <div className="w-full bg-surface-container-low h-2 rounded-full overflow-hidden">
                  <div className="bg-status-occupied h-full rounded-full" style={{ width: '42%' }} />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-on-surface-variant">Executive King</span>
                  <span className="text-on-surface">28%</span>
                </div>
                <div className="w-full bg-surface-container-low h-2 rounded-full overflow-hidden">
                  <div className="bg-status-occupied h-full rounded-full" style={{ width: '28%' }} />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-on-surface-variant">Standard Queen</span>
                  <span className="text-on-surface">18%</span>
                </div>
                <div className="w-full bg-[#efedf0] h-2 rounded-full overflow-hidden">
                  <div className="bg-status-occupied h-full rounded-full" style={{ width: '18%' }} />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-on-surface-variant">Penthouse</span>
                  <span className="text-on-surface">12%</span>
                </div>
                <div className="w-full bg-[#efedf0] h-2 rounded-full overflow-hidden">
                  <div className="bg-status-occupied h-full rounded-full" style={{ width: '12%' }} />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-outline-variant/60">
            <img 
              alt="Luxury Room Interior" 
              className="w-full h-24 object-cover rounded-lg shadow-sm border border-outline-variant/30 brightness-95 hover:brightness-100 transition-all cursor-pointer"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCQ8l6d3bREDsefp5v-0bcmqVpaGxSoY3X-np-eDqTIv12IRrU5cb7pf1fJc148cqmBVRB1vX_RU0WVVPKLXPiaFJ0eerRyO4OmPr0-mgsxCyQ1pgaSc2jyK-Zhxag2oQ_SNCwpr0ZQhttaDY9lnvGLSe079f_zNsglesOJbfWf4OVMpivBz7k1Mv-qBNl7sEtPyGQFwe1T3xIXTeVFd_w0ojv2I4ur_xen0Xf7Co7wUMeNumPDWHcG8m5Xu9X2GTcfdx_uSUuf5jA"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      </div>

      {/* Table Section: Top Performing Months */}
      <div className="bg-surface-container-lowest border border-outline-variant rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-outline-variant flex justify-between items-center bg-[#efedf0]/30">
          <h4 className="text-sm font-semibold text-on-surface">Top Performing Months (2023-2024)</h4>
          <button onClick={() => alert("Loading historical statistics database... Complete.")} className="text-[#006b5e] text-xs font-semibold hover:underline flex items-center gap-1 cursor-pointer">
            View Detailed Log
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <table className="w-full text-left">
          <thead>
            <tr className="bg-[#efedf0]/50 border-b border-outline-variant">
              <th className="px-6 py-3.5 text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Month</th>
              <th className="px-6 py-3.5 text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Revenue</th>
              <th className="px-6 py-3.5 text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Occupancy</th>
              <th className="px-6 py-3.5 text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Guest Rating</th>
              <th className="px-6 py-3.5 text-xs font-semibold text-on-surface-variant uppercase tracking-wider text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/60">
            <tr className="hover:bg-[#efedf0]/10 transition-all">
              <td className="px-6 py-4 text-xs font-semibold text-on-surface">
                <div className="flex items-center gap-2 select-none">
                  <span className="w-2.5 h-2.5 rounded-full bg-status-occupied" />
                  December 2023
                </div>
              </td>
              <td className="px-6 py-4 font-mono text-xs text-on-surface">$182,450.00</td>
              <td className="px-6 py-4 font-mono text-xs text-on-surface">96.4%</td>
              <td className="px-6 py-4 select-none">
                <div className="flex items-center gap-1 text-xs">
                  <Star className="w-4 h-4 fill-status-cleaning text-status-cleaning" />
                  <span className="font-semibold text-on-surface">4.9</span>
                </div>
              </td>
              <td className="px-6 py-4 text-right">
                <span className="bg-status-available/10 text-status-available px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">High Peak</span>
              </td>
            </tr>

            <tr className="hover:bg-[#efedf0]/10 transition-all">
              <td className="px-6 py-4 text-xs font-semibold text-on-surface">
                <div className="flex items-center gap-2 select-none">
                  <span className="w-2.5 h-2.5 rounded-full bg-status-occupied" />
                  July 2023
                </div>
              </td>
              <td className="px-6 py-4 font-mono text-xs text-on-surface">$165,200.00</td>
              <td className="px-6 py-4 font-mono text-xs text-on-surface">92.1%</td>
              <td className="px-6 py-4 select-none">
                <div className="flex items-center gap-1 text-xs">
                  <Star className="w-4 h-4 fill-status-cleaning text-status-cleaning" />
                  <span className="font-semibold text-on-surface">4.7</span>
                </div>
              </td>
              <td className="px-6 py-4 text-right">
                <span className="bg-status-available/10 text-status-available px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">Peak</span>
              </td>
            </tr>

            <tr className="hover:bg-[#efedf0]/10 transition-all">
              <td className="px-6 py-4 text-xs font-semibold text-on-surface">
                <div className="flex items-center gap-2 select-none">
                  <span className="w-2.5 h-2.5 rounded-full bg-status-occupied" />
                  August 2023
                </div>
              </td>
              <td className="px-6 py-4 font-mono text-xs text-on-surface">$158,900.00</td>
              <td className="px-6 py-4 font-mono text-xs text-on-surface">89.8%</td>
              <td className="px-6 py-4 select-none">
                <div className="flex items-center gap-1 text-xs">
                  <Star className="w-4 h-4 fill-status-cleaning text-status-cleaning" />
                  <span className="font-semibold text-on-surface">4.8</span>
                </div>
              </td>
              <td className="px-6 py-4 text-right">
                <span className="bg-[#081b3a]/10 text-[#081b3a] px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">Above Avg</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
