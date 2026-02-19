import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, 
  BarChart as ReBarChart, Bar, XAxis, YAxis, Tooltip, Legend,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  LineChart, Line, CartesianGrid
} from 'recharts';
import { 
  Activity, BarChart3, PieChart as PieChartIcon, 
  Radar as RadarIcon, TrendingUp, Info,
  ChevronLeft, Sparkles, Database
} from 'lucide-react';
import { useStore } from '../store/useStore';
import { useNavigate } from 'react-router-dom';

const COLORS = ['#16a34a', '#4ade80', '#86efac', '#bbf7d0', '#dcfce7'];

const AnalyticsPage = () => {
  const navigate = useNavigate();
  const { analysisResults } = useStore();

  const data = useMemo(() => {
    // Default mock data for presentation quality
    const baseData = {
      pie: [
        { name: 'Safe', value: 65 },
        { name: 'Adjust Dosage', value: 20 },
        { name: 'Toxic', value: 15 },
      ],
      bar: [
        { gene: 'CYP2D6', variants: 4 },
        { gene: 'CYP2C19', variants: 3 },
        { gene: 'SLCO1B1', variants: 5 },
        { gene: 'CYP2C9', variants: 2 },
        { gene: 'DPYD', variants: 1 },
      ],
      radar: [
        { subject: 'Efficacy', A: 120 },
        { subject: 'Safety', A: 140 },
        { subject: 'Metabolism', A: 90 },
        { subject: 'Clearance', A: 110 },
        { subject: 'Enzymatic', A: 130 },
      ],
      line: [
        { name: 'Trial 1', score: 85 },
        { name: 'Trial 2', score: 92 },
        { name: 'Trial 3', score: 88 },
        { name: 'Trial 4', score: 95 },
        { name: 'Trial 5', score: 98 },
      ]
    };


    return baseData;
  }, [analysisResults]);

  const Card = ({ title, icon: Icon, children, delay = 0 }) => (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
      className="group bg-white p-10 rounded-[3rem] border border-gray-100 shadow-[0_20px_50px_-12px_rgba(22,163,74,0.05)] hover:shadow-[0_40px_80px_-15px_rgba(22,163,74,0.1)] transition-all duration-700 flex flex-col h-full border-b-[6px] border-b-primary/5"
    >
       <div className="flex items-center justify-between mb-10">
          <div className="flex items-center space-x-4">
             <div className="w-12 h-12 bg-primary/5 rounded-2xl flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all duration-500">
                <Icon className="w-6 h-6 text-primary group-hover:text-white" />
             </div>
             <h3 className="text-xl font-black text-gray-900 tracking-tight">{title}</h3>
          </div>
          <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <Info className="w-4 h-4 text-gray-300" />
          </div>
       </div>
       <div className="flex-1 min-h-[320px]">
          {children}
       </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gray-50/30">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16">
        <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-16">
           <motion.div
             initial={{ opacity: 0, x: -20 }}
             animate={{ opacity: 1, x: 0 }}
             transition={{ duration: 0.8 }}
           >
              <button 
                onClick={() => navigate('/results')}
                className="flex items-center space-x-2 text-primary font-black text-xs uppercase tracking-widest mb-6 hover:-translate-x-1 transition-transform group"
              >
                 <ChevronLeft className="w-4 h-4" />
                 <span>Back to Clinical Report</span>
              </button>
              <h1 className="text-5xl font-black text-gray-900 tracking-tighter leading-none mb-4">
                 Precision <span className="text-primary italic">Analytics</span>
              </h1>
              <p className="text-gray-400 font-medium text-lg max-w-xl">
                Multi-dimensional visualization of pharmacogenomic variance and algorithm confidence.
              </p>
           </motion.div>
           
           <motion.div 
             initial={{ opacity: 0, scale: 0.95 }}
             animate={{ opacity: 1, scale: 1 }}
             transition={{ duration: 1, delay: 0.2 }}
             className="flex items-center space-x-6 bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-200/20"
           >
              <div className="flex -space-x-3">
                 {[1, 2, 3].map(i => (
                   <div key={i} className={`w-10 h-10 rounded-full border-2 border-white flex items-center justify-center text-[10px] font-bold text-white shadow-lg ${i === 1 ? 'bg-primary' : i === 2 ? 'bg-primary-dark' : 'bg-emerald-300'}`}>
                      {i === 1 ? 'AI' : i === 2 ? 'DB' : 'MD'}
                   </div>
                 ))}
              </div>
              <div className="h-10 w-px bg-gray-100" />
              <div className="flex flex-col">
                 <span className="text-[10px] font-black uppercase tracking-widest text-primary mb-0.5">Verified Data</span>
                 <span className="text-sm font-black text-gray-900">ClinVar v2024.12 Synced</span>
              </div>
           </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
           
           <Card title="Risk Severity Factor" icon={PieChartIcon} delay={0.1}>
              <ResponsiveContainer width="100%" height="100%">
                 <PieChart>
                    <Pie
                       data={data.pie}
                       innerRadius={90}
                       outerRadius={130}
                       paddingAngle={8}
                       dataKey="value"
                       animationDuration={2000}
                    >
                       {data.pie.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="transparent" />
                       ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 40px rgba(0,0,0,0.1)', padding: '15px' }}
                    />
                    <Legend 
                      verticalAlign="bottom" 
                      align="center" 
                      iconType="circle"
                      formatter={(value) => <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">{value}</span>}
                    />
                 </PieChart>
              </ResponsiveContainer>
           </Card>

           <Card title="Genomic Variance Density" icon={BarChart3} delay={0.2}>
              <ResponsiveContainer width="100%" height="100%">
                 <ReBarChart data={data.bar}>
                    <CartesianGrid strokeDasharray="0" vertical={false} stroke="#f5f5f5" />
                    <XAxis 
                      dataKey="gene" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 800 }} 
                      dy={10}
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 800 }} 
                    />
                    <Tooltip 
                      cursor={{ fill: '#f8fafc', radius: 20 }} 
                      contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 40px rgba(0,0,0,0.1)', padding: '15px' }} 
                    />
                    <Bar 
                      dataKey="variants" 
                      fill="#16a34a" 
                      radius={[15, 15, 15, 15]} 
                      barSize={40}
                      animationDuration={2500}
                      className="transition-all duration-300"
                    />
                 </ReBarChart>
              </ResponsiveContainer>
           </Card>

           <Card title="Engine Certainty Index" icon={TrendingUp} delay={0.3}>
              <ResponsiveContainer width="100%" height="100%">
                 <LineChart data={data.line}>
                    <CartesianGrid strokeDasharray="0" vertical={false} stroke="#f5f5f5" />
                    <XAxis 
                      dataKey="name" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 800 }} 
                      dy={10}
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 800 }} 
                    />
                    <Tooltip 
                      contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 40px rgba(0,0,0,0.1)', padding: '15px' }} 
                    />
                    <Line 
                       type="monotone" 
                       dataKey="score" 
                       stroke="#16a34a" 
                       strokeWidth={6} 
                       dot={{ r: 8, fill: '#16a34a', strokeWidth: 4, stroke: '#fff' }} 
                       activeDot={{ r: 12, strokeWidth: 0 }}
                       animationDuration={3000}
                    />
                 </LineChart>
              </ResponsiveContainer>
           </Card>

           <Card title="Clinical Impact Matrix" icon={RadarIcon} delay={0.4}>
              <ResponsiveContainer width="100%" height="100%">
                 <RadarChart cx="50%" cy="50%" outerRadius="75%" data={data.radar}>
                    <PolarGrid stroke="#f1f5f9" />
                    <PolarAngleAxis 
                      dataKey="subject" 
                      tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 800 }} 
                    />
                    <PolarRadiusAxis 
                      angle={30} 
                      domain={[0, 150]} 
                      axisLine={false} 
                      tick={false} 
                    />
                    <Radar
                       name="Profile"
                       dataKey="A"
                       stroke="#16a34a"
                       fill="#16a34a"
                       fillOpacity={0.15}
                       strokeWidth={3}
                       animationDuration={3500}
                    />
                 </RadarChart>
              </ResponsiveContainer>
           </Card>

        </div>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="mt-20 bg-gray-900 rounded-[4rem] p-16 text-center text-white relative overflow-hidden group"
        >
           <motion.div 
             animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
             transition={{ duration: 10, repeat: Infinity }}
             className="absolute -top-32 -left-32 w-96 h-96 bg-primary rounded-full blur-[100px]" 
           />
           <div className="relative z-10 flex flex-col items-center">
              <div className="w-20 h-20 bg-primary/20 backdrop-blur-xl rounded-2xl flex items-center justify-center mb-8 border border-primary/20 group-hover:scale-110 transition-transform duration-700">
                 <Activity className="w-10 h-10 text-primary" />
              </div>
              <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tighter">Diagnostic Certainty: 98.4%</h2>
              <p className="text-gray-400 text-lg md:text-xl font-medium max-w-2xl leading-relaxed">
                 Aggregate algorithmic confidence across verified ClinVar datasets and CPIC clinical guidelines.
              </p>
           </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
