
import React, { useState } from 'react';
import { useAppContext, CompanyInfo } from '../context/AppContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ChevronRight } from 'lucide-react';

const CompanyForm: React.FC = () => {
  const { companyInfo, setCompanyInfo, setStep } = useAppContext();
  const [newCharacteristic, setNewCharacteristic] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleCharacteristicKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && newCharacteristic.trim()) {
      e.preventDefault();
      if (companyInfo.characteristics.includes(newCharacteristic.trim())) {
        return;
      }
      setCompanyInfo({
        ...companyInfo,
        characteristics: [...companyInfo.characteristics, newCharacteristic.trim()]
      });
      setNewCharacteristic('');
    }
  };

  const removeCharacteristic = (characteristic: string) => {
    setCompanyInfo({
      ...companyInfo,
      characteristics: companyInfo.characteristics.filter(c => c !== characteristic)
    });
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!companyInfo.name.trim()) {
      newErrors.name = 'Company name is required';
    }
    
    if (!companyInfo.industry.trim()) {
      newErrors.industry = 'Industry is required';
    }
    
    if (!companyInfo.description.trim()) {
      newErrors.description = 'Company description is required';
    } else if (companyInfo.description.trim().length < 20) {
      newErrors.description = 'Please provide a more detailed description';
    }
    
    if (companyInfo.characteristics.length === 0) {
      newErrors.characteristics = 'Please add at least one characteristic';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      setStep(2);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto fade-in">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Tell us about your company</CardTitle>
        <CardDescription>
          This information will help us generate accurate customer personas for your business
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="company-name" className="text-sm font-medium">
              Company Name
            </label>
            <Input
              id="company-name"
              placeholder="e.g., Acme Inc."
              value={companyInfo.name}
              onChange={(e) => setCompanyInfo({ ...companyInfo, name: e.target.value })}
              className={errors.name ? "border-red-500" : ""}
            />
            {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
          </div>

          <div className="space-y-2">
            <label htmlFor="industry" className="text-sm font-medium">
              Industry
            </label>
            <Input
              id="industry"
              placeholder="e.g., Technology, Healthcare, Finance"
              value={companyInfo.industry}
              onChange={(e) => setCompanyInfo({ ...companyInfo, industry: e.target.value })}
              className={errors.industry ? "border-red-500" : ""}
            />
            {errors.industry && <p className="text-sm text-red-500">{errors.industry}</p>}
          </div>

          <div className="space-y-2">
            <label htmlFor="characteristics" className="text-sm font-medium">
              Company Characteristics
            </label>
            <Input
              id="characteristics"
              placeholder="e.g., Innovative, Reliable, Sustainable (press Enter to add)"
              value={newCharacteristic}
              onChange={(e) => setNewCharacteristic(e.target.value)}
              onKeyDown={handleCharacteristicKeyDown}
              className={errors.characteristics ? "border-red-500" : ""}
            />
            {errors.characteristics && <p className="text-sm text-red-500">{errors.characteristics}</p>}
            
            <div className="flex flex-wrap gap-2 mt-2">
              {companyInfo.characteristics.map((characteristic, index) => (
                <Badge key={index} variant="secondary" className="text-xs py-1 px-3">
                  {characteristic}
                  <button
                    type="button"
                    onClick={() => removeCharacteristic(characteristic)}
                    className="ml-2 text-gray-500 hover:text-gray-700"
                  >
                    ×
                  </button>
                </Badge>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium">
              Company Description
            </label>
            <Textarea
              id="description"
              placeholder="Briefly describe what your company does and the products/services you offer..."
              value={companyInfo.description}
              onChange={(e) => setCompanyInfo({ ...companyInfo, description: e.target.value })}
              className={`min-h-[100px] ${errors.description ? "border-red-500" : ""}`}
            />
            {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button onClick={handleSubmit} className="gap-2">
          Generate Persona
          <ChevronRight size={16} />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CompanyForm;
