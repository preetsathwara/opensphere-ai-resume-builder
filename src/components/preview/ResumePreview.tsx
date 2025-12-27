import { useResume } from '@/context/ResumeContext';
import { ResumeData } from '@/types/resume';

export function MinimalTemplate({ resume }: { resume: ResumeData }) {
  const { personalInfo, summary, workExperience, education, skills, projects } = resume;

  return (
    <div className="font-sans text-[11pt] leading-relaxed text-gray-800 bg-white p-8" style={{ fontFamily: 'Arial, sans-serif' }}>
      {/* Header */}
      <header className="text-center mb-6 border-b-2 border-gray-300 pb-4">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">{personalInfo.fullName || 'Your Name'}</h1>
        {personalInfo.title && <p className="text-lg text-gray-600 mb-2">{personalInfo.title}</p>}
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-sm text-gray-600">
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <span>{personalInfo.phone}</span>}
          {personalInfo.location && <span>{personalInfo.location}</span>}
          {personalInfo.linkedin && <span>{personalInfo.linkedin}</span>}
        </div>
      </header>

      {/* Summary */}
      {summary && (
        <section className="mb-5">
          <h2 className="text-sm font-bold uppercase tracking-wider text-gray-900 border-b border-gray-300 pb-1 mb-2">Professional Summary</h2>
          <p className="text-sm">{summary}</p>
        </section>
      )}

      {/* Experience */}
      {workExperience.length > 0 && (
        <section className="mb-5">
          <h2 className="text-sm font-bold uppercase tracking-wider text-gray-900 border-b border-gray-300 pb-1 mb-2">Experience</h2>
          {workExperience.map((exp) => (
            <div key={exp.id} className="mb-4">
              <div className="flex justify-between items-baseline">
                <h3 className="font-bold text-sm">{exp.position}</h3>
                <span className="text-xs text-gray-600">{exp.startDate} - {exp.endDate || 'Present'}</span>
              </div>
              <p className="text-sm text-gray-600 italic">{exp.company}{exp.location && `, ${exp.location}`}</p>
              {exp.bullets.length > 0 && (
                <ul className="list-disc list-inside mt-1 text-sm space-y-0.5">
                  {exp.bullets.filter(b => b.trim()).map((bullet, i) => (
                    <li key={i}>{bullet}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </section>
      )}

      {/* Education */}
      {education.length > 0 && (
        <section className="mb-5">
          <h2 className="text-sm font-bold uppercase tracking-wider text-gray-900 border-b border-gray-300 pb-1 mb-2">Education</h2>
          {education.map((edu) => (
            <div key={edu.id} className="mb-3">
              <div className="flex justify-between items-baseline">
                <h3 className="font-bold text-sm">{edu.degree} {edu.field && `in ${edu.field}`}</h3>
                <span className="text-xs text-gray-600">{edu.startDate} - {edu.endDate}</span>
              </div>
              <p className="text-sm text-gray-600 italic">{edu.institution}{edu.location && `, ${edu.location}`}</p>
              {edu.gpa && <p className="text-sm">GPA: {edu.gpa}</p>}
            </div>
          ))}
        </section>
      )}

      {/* Skills */}
      {skills.length > 0 && (
        <section className="mb-5">
          <h2 className="text-sm font-bold uppercase tracking-wider text-gray-900 border-b border-gray-300 pb-1 mb-2">Skills</h2>
          {skills.map((cat) => (
            <p key={cat.id} className="text-sm mb-1">
              <strong>{cat.category}:</strong> {cat.skills.join(', ')}
            </p>
          ))}
        </section>
      )}

      {/* Projects */}
      {projects.length > 0 && (
        <section>
          <h2 className="text-sm font-bold uppercase tracking-wider text-gray-900 border-b border-gray-300 pb-1 mb-2">Projects</h2>
          {projects.map((proj) => (
            <div key={proj.id} className="mb-3">
              <h3 className="font-bold text-sm">{proj.name}</h3>
              {proj.technologies.length > 0 && (
                <p className="text-xs text-gray-600">{proj.technologies.join(' • ')}</p>
              )}
              {proj.description && <p className="text-sm mt-1">{proj.description}</p>}
            </div>
          ))}
        </section>
      )}
    </div>
  );
}

export function ResumePreview() {
  const { resume } = useResume();
  
  return (
    <div id="resume-preview" className="resume-preview shadow-xl rounded-lg overflow-hidden">
      <MinimalTemplate resume={resume} />
    </div>
  );
}
