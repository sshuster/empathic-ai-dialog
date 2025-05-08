
import { useAppContext } from '../context/AppContext';
import CompanyForm from '../components/CompanyForm';
import PersonaCard from '../components/PersonaCard';
import ChatExperience from '../components/ChatExperience';

const Index = () => {
  const { step } = useAppContext();

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted py-12 px-4">
      <header className="max-w-4xl mx-auto mb-10">
        <h1 className="text-3xl md:text-4xl font-bold text-center">
          {step === 1 && "Empathic AI Customer Personas"}
          {step === 2 && "Meet Your Customer Persona"}
          {step === 3 && "Chat Experience"}
        </h1>
        <p className="mt-3 text-muted-foreground text-center mx-auto max-w-2xl">
          {step === 1 && "Generate realistic customer personas and understand their needs through interactive conversations."}
          {step === 2 && "Get to know your customer persona and their challenges related to your products or services."}
          {step === 3 && "Help your customer persona solve their challenges by responding to their messages."}
        </p>
      </header>
      
      <main className="max-w-4xl mx-auto">
        {step === 1 && <CompanyForm />}
        {step === 2 && <PersonaCard />}
        {step === 3 && <ChatExperience />}
      </main>
      
      <footer className="mt-12 text-center text-sm text-muted-foreground">
        <p>© 2025 Empathic AI Dialog • AI-Powered Customer Persona Generator</p>
      </footer>
    </div>
  );
};

export default Index;
