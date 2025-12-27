import { useResume } from '@/context/ResumeContext';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Mail, Phone, MapPin, Linkedin, Globe } from 'lucide-react';

export function PersonalInfoForm() {
  const { resume, dispatch } = useResume();
  const { personalInfo } = resume;

  const updateField = (field: string, value: string) => {
    dispatch({
      type: 'UPDATE_RESUME',
      payload: {
        personalInfo: { ...personalInfo, [field]: value },
      },
    });
  };

  return (
    <Card className="animate-fade-in">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-base">
          <User className="h-4 w-4 text-primary" />
          Personal Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name</Label>
            <Input
              id="fullName"
              placeholder="Preet Sathwara"
              value={personalInfo.fullName}
              onChange={(e) => updateField('fullName', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="title">Professional Title</Label>
            <Input
              id="title"
              placeholder="Software Engineer"
              value={personalInfo.title}
              onChange={(e) => updateField('title', e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="flex items-center gap-1.5">
              <Mail className="h-3.5 w-3.5 text-muted-foreground" />
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="preet@example.com"
              value={personalInfo.email}
              onChange={(e) => updateField('email', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone" className="flex items-center gap-1.5">
              <Phone className="h-3.5 w-3.5 text-muted-foreground" />
              Phone
            </Label>
            <Input
              id="phone"
              type="tel"
              placeholder="+91 (123) 456-7890"
              value={personalInfo.phone}
              onChange={(e) => updateField('phone', e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="location" className="flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
            Location
          </Label>
          <Input
            id="location"
            placeholder="Gujarat, India"
            value={personalInfo.location}
            onChange={(e) => updateField('location', e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="linkedin" className="flex items-center gap-1.5">
              <Linkedin className="h-3.5 w-3.5 text-muted-foreground" />
              LinkedIn
            </Label>
            <Input
              id="linkedin"
              placeholder="linkedin.com/in/johndoe"
              value={personalInfo.linkedin || ''}
              onChange={(e) => updateField('linkedin', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="website" className="flex items-center gap-1.5">
              <Globe className="h-3.5 w-3.5 text-muted-foreground" />
              Website
            </Label>
            <Input
              id="website"
              placeholder="xyz.com"
              value={personalInfo.website || ''}
              onChange={(e) => updateField('website', e.target.value)}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
