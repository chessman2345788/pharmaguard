import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Database, Globe, Heart, Activity, Award } from 'lucide-react';

const AboutPage = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-20"
      >
        <span className="text-primary font-bold uppercase tracking-widest text-xs">Our Mission</span>
        <h1 className="text-5xl font-extrabold text-gray-900 mt-4 mb-6 tracking-tight">
          Bridging the Gap Between <br />
          <span className="text-primary">Genomics & Clinical Care</span>
        </h1>
        <p className="max-w-3xl mx-auto text-xl text-gray-500 font-light leading-relaxed">
          PharmaGuard AI was founded on the principle that no patient should suffer from 
          avoidable adverse drug reactions. We use state-of-the-art AI to translate 
          complex genetic data into actionable medical intelligence.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center mb-32">
        <div className="space-y-8">
           <h2 className="text-3xl font-bold text-gray-900">Developed for the Healthcare Future</h2>
           <p className="text-gray-600 leading-relaxed">
             Traditional pharmaceutical models follow a "one size fits all" approach. 
             However, human biology is uniquely diverse. By analyzing the patient's VCF 
             files, PharmaGuard provides a window into how an individual's enzymes 
             will actually process specific medications.
           </p>
           <div className="grid grid-cols-2 gap-6">
              {[
                { icon: ShieldCheck, title: "HIPAA Ready", text: "Enterprise security" },
                { icon: Database, title: "CPIC Sourced", text: "Gold standard data" },
                { icon: Globe, title: "Global Reach", text: "Multi-ethnic data" },
                { icon: Heart, title: "Patient First", text: "Simple insights" },
              ].map((item, i) => (
                <div key={i} className="flex flex-col">
                  <item.icon className="w-8 h-8 text-primary mb-2" />
                  <h4 className="font-bold text-gray-900">{item.title}</h4>
                  <p className="text-gray-500 text-xs">{item.text}</p>
                </div>
              ))}
           </div>
        </div>
        <div className="relative">
           <div className="w-full h-[500px] bg-primary-soft rounded-[3rem] overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center">
                 <Activity className="w-32 h-32 text-primary opacity-20 animate-pulse" />
              </div>
              {/* Mock visualization */}
              <div className="absolute bottom-10 left-10 right-10 bg-white p-8 rounded-3xl shadow-2xl border border-gray-100">
                 <div className="flex items-center space-x-4 mb-4">
                    <Award className="text-amber-500 w-10 h-10" />
                    <div>
                       <h4 className="font-bold">NextGen Health Innovation</h4>
                       <p className="text-xs text-gray-400">Awarded 2026</p>
                    </div>
                 </div>
                 <p className="text-sm text-gray-500 italic">"PharmaGuard is setting a new standard for genomic interpretation in primary care."</p>
              </div>
           </div>
        </div>
      </div>

      <div className="bg-gray-50 rounded-[4rem] p-16 text-center">
         <h2 className="text-3xl font-bold mb-12">The Research Behind the Platform</h2>
         <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { val: "250+", label: "Drugs Analyzed" },
              { val: "1.2M", label: "Variant Pairs" },
              { val: "99.9%", label: "System Uptime" },
              { val: "CPIC v4", label: "Guideline Version" },
            ].map((stat, i) => (
              <div key={i}>
                <div className="text-4xl font-black text-primary mb-2">{stat.val}</div>
                <div className="text-gray-500 font-bold text-sm uppercase tracking-widest">{stat.label}</div>
              </div>
            ))}
         </div>
      </div>
    </div>
  );
};

export default AboutPage;
