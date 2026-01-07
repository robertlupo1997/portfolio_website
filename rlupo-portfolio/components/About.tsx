import React from 'react';

const skills = [
  { title: "Machine Learning", tools: ["PyTorch", "XGBoost", "Scikit-learn"] },
  { title: "Data Engineering", tools: ["DuckDB", "SQL", "Airflow"] },
  { title: "Computer Vision", tools: ["OpenCV", "Grounding DINO", "SAM 2"] },
  { title: "Web Development", tools: ["React", "FastAPI", "Streamlit"] }
];

const About: React.FC = () => {
  return (
    <section id="about" className="py-24 px-4 md:px-8 bg-black text-[#F0F0F0]">
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mb-24">
        <div>
           <h2 className="text-6xl md:text-8xl font-black font-display tracking-tighter uppercase leading-[0.8]">
             Data<br/><span className="text-orange-600">Driven.</span>
           </h2>
        </div>
        <div className="flex flex-col justify-end">
           <p className="text-xl md:text-2xl leading-relaxed font-light opacity-90">
             I am Robert Lupo, a Machine Learning Engineer based in New York. I specialize in building predictive models and data pipelines that drive business decisions. My work bridges the gap between raw data and actionable insights.
           </p>
        </div>
      </div>

      <div className="border-t border-white/20 pt-12">
        <h3 className="font-mono text-sm uppercase opacity-50 mb-8">( Expertise )</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {skills.map((skill, i) => (
            <div key={i} className="group hover:bg-white/5 p-6 border border-white/10 transition-colors">
              <div className="text-orange-600 font-mono text-xs mb-4">0{i + 1}</div>
              <h4 className="text-2xl font-bold font-display uppercase mb-6">{skill.title}</h4>
              <ul className="space-y-2">
                {skill.tools.map(tool => (
                  <li key={tool} className="font-mono text-sm opacity-70 border-b border-white/10 pb-1 flex justify-between">
                    <span>{tool}</span>
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity text-orange-600">+</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

    </section>
  );
};

export default About;