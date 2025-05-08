
import React, { useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { generatePersona } from '../services/ai-service';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageCircle, ChevronRight, RefreshCw } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const PersonaCard: React.FC = () => {
  const { companyInfo, persona, setPersona, isGenerating, setIsGenerating, setStep, addMessage } = useAppContext();

  useEffect(() => {
    const generatePersonaData = async () => {
      if (!persona && !isGenerating) {
        setIsGenerating(true);
        try {
          const generatedPersona = await generatePersona(companyInfo);
          setPersona(generatedPersona);
          setIsGenerating(false);
        } catch (error) {
          console.error('Error generating persona:', error);
          setIsGenerating(false);
        }
      }
    };

    generatePersonaData();
  }, [companyInfo, persona, setPersona, isGenerating, setIsGenerating]);

  const handleRegeneratePersona = async () => {
    setIsGenerating(true);
    setPersona(null);
    try {
      const generatedPersona = await generatePersona(companyInfo);
      setPersona(generatedPersona);
      setIsGenerating(false);
    } catch (error) {
      console.error('Error regenerating persona:', error);
      setIsGenerating(false);
    }
  };

  const startChatExperience = () => {
    if (persona) {
      // Add first message from the persona describing their challenge
      const challenge = persona.challenges[0];
      const initialMessage = `Hi there! I'm ${persona.name}, a ${persona.jobTitle} from ${persona.location}. I've been looking for a solution because ${challenge.toLowerCase()}. Can you tell me how ${companyInfo.name} could help me with this?`;
      
      addMessage({
        sender: 'persona',
        text: initialMessage
      });
      
      setStep(3);
    }
  };

  if (isGenerating) {
    return (
      <Card className="w-full max-w-2xl mx-auto text-center py-8 fade-in">
        <CardContent>
          <div className="animate-pulse flex flex-col items-center space-y-4">
            <div className="rounded-full bg-gray-200 h-24 w-24"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>
          <p className="mt-6 text-gray-500">Generating customer persona...</p>
        </CardContent>
      </Card>
    );
  }

  if (!persona) return null;

  return (
    <Card className="w-full max-w-2xl mx-auto fade-in">
      <CardHeader className="flex flex-row items-center gap-4">
        <div className="flex-shrink-0">
          <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-primary">
            <img
              src={persona.avatar}
              alt={persona.name}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
        <div>
          <CardTitle className="text-2xl font-bold">{persona.name}</CardTitle>
          <CardDescription className="text-md">
            {persona.age} • {persona.gender} • {persona.location}
          </CardDescription>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div>
          <h3 className="font-medium mb-2 text-gray-700">Job Title</h3>
          <p>{persona.jobTitle}</p>
        </div>
        
        <div>
          <h3 className="font-medium mb-2 text-gray-700">Interests</h3>
          <div className="flex flex-wrap gap-2">
            {persona.interests.map((interest, index) => (
              <Badge key={index} variant="outline" className="text-xs py-1">
                {interest}
              </Badge>
            ))}
          </div>
        </div>
        
        <div>
          <h3 className="font-medium mb-2 text-gray-700">Challenges</h3>
          <ul className="space-y-2">
            {persona.challenges.map((challenge, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>{challenge}</span>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between items-center">
        <Button variant="outline" onClick={handleRegeneratePersona} className="gap-2">
          <RefreshCw size={16} />
          Regenerate
        </Button>
        
        <Button onClick={startChatExperience} className="gap-2">
          <MessageCircle size={16} />
          Start Chat Experience
          <ChevronRight size={16} />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PersonaCard;
