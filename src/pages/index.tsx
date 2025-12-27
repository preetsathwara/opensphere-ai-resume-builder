import { ResumeProvider } from '@/context/ResumeContext';
import { Header } from '@/components/Header';
import { PersonalInfoForm } from '@/components/forms/PersonalInfoForm';
import { SummaryForm } from '@/components/forms/SummaryForm';
import { WorkExperienceForm } from '@/components/forms/WorkExperienceForm';
import { EducationForm } from '@components/forms/EducationForm';
import { SkillsForm } from '@/components/forms/SkillsForm';
import { ProjectsForm } from '@/components/forms/ProjectsForm';
import { ResumePreview } from '@/components/preview/ResumePreview';
import { ATSScoreCard } from '@/components/ATSScoreCard';
import { ScrollArea } from '@/components/ui/scroll-area';

function ResumeBuilder() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left: Form */}
          <div className="space-y-4">
            <ATSScoreCard />
            <PersonalInfoForm />
            <SummaryForm />
            <WorkExperienceForm />
            <EducationForm />
            <SkillsForm />
            <ProjectsForm />
          </div>

          {/* Right: Preview */}
          <div className="lg:sticky lg:top-24 lg:h-[calc(100vh-8rem)]">
            <div className="bg-muted/30 rounded-xl p-4 h-full overflow-auto">
              <h2 className="text-sm font-medium text-muted-foreground mb-3 text-center">Live Preview</h2>
              <div className="flex justify-center">
                <div className="transform scale-[0.6] origin-top">
                  <ResumePreview />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

const Index = () => {
  return (
    <ResumeProvider>
      <ResumeBuilder />
    </ResumeProvider>
  );
};

export default Index;
