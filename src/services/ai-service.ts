
import { CompanyInfo, Persona, Message } from '../context/AppContext';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Generate a consistent avatar URL based on the persona name
const generateAvatarUrl = (name: string, gender: string) => {
  const seed = encodeURIComponent(`${name}-${gender}`);
  return `https://api.dicebear.com/7.x/personas/svg?seed=${seed}`;
};

// Sample industries for more realistic persona generation
const industries = {
  'technology': ['software engineer', 'product manager', 'data scientist', 'UX designer'],
  'healthcare': ['doctor', 'nurse', 'healthcare administrator', 'medical researcher'],
  'finance': ['financial analyst', 'accountant', 'investment banker', 'financial advisor'],
  'retail': ['store manager', 'retail associate', 'merchandiser', 'buyer'],
  'education': ['teacher', 'professor', 'educational administrator', 'guidance counselor'],
  'manufacturing': ['production manager', 'quality control specialist', 'manufacturing engineer'],
  'hospitality': ['hotel manager', 'chef', 'event coordinator', 'concierge'],
  'marketing': ['marketing manager', 'content creator', 'social media specialist', 'brand strategist']
};

// Mock AI service for persona generation
export const generatePersona = async (companyInfo: CompanyInfo): Promise<Persona> => {
  // In a real application, this would call an AI API
  await delay(2000); // Simulate API call delay
  
  const industry = companyInfo.industry.toLowerCase();
  let jobTitles = ['professional', 'manager', 'specialist', 'consultant'];
  
  // Select job titles based on industry if available
  if (industry in industries) {
    jobTitles = industries[industry as keyof typeof industries];
  }
  
  const genders = ['male', 'female', 'non-binary'];
  const gender = genders[Math.floor(Math.random() * genders.length)];
  
  const firstNames = {
    male: ['James', 'John', 'Robert', 'Michael', 'William', 'David', 'Richard', 'Joseph', 'Thomas', 'Charles', 'Christopher', 'Daniel', 'Matthew', 'Anthony', 'Mark', 'Donald', 'Steven', 'Paul', 'Andrew', 'Joshua'],
    female: ['Mary', 'Patricia', 'Jennifer', 'Linda', 'Elizabeth', 'Barbara', 'Susan', 'Jessica', 'Sarah', 'Karen', 'Lisa', 'Nancy', 'Betty', 'Sandra', 'Margaret', 'Ashley', 'Kimberly', 'Emily', 'Donna', 'Michelle'],
    'non-binary': ['Alex', 'Jordan', 'Taylor', 'Sam', 'Riley', 'Casey', 'Avery', 'Skyler', 'Dakota', 'Parker', 'Phoenix', 'Hayden', 'Quinn', 'Reese', 'Emerson', 'Morgan', 'Blake', 'Cameron', 'Jamie', 'Rowan']
  };
  
  const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin'];
  
  const firstName = firstNames[gender as keyof typeof firstNames][Math.floor(Math.random() * firstNames[gender as keyof typeof firstNames].length)];
  const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
  
  const cities = ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia', 'San Antonio', 'San Diego', 'Dallas', 'San Jose', 'Austin', 'Jacksonville', 'Fort Worth', 'Columbus', 'San Francisco', 'Charlotte', 'Indianapolis', 'Seattle', 'Denver', 'Washington'];
  
  const interestCategories = [
    ['reading', 'writing', 'literature', 'poetry', 'books', 'journalism'],
    ['hiking', 'camping', 'outdoor activities', 'national parks', 'nature photography'],
    ['cooking', 'baking', 'food blogging', 'trying new restaurants', 'wine tasting'],
    ['painting', 'drawing', 'sculpture', 'digital art', 'graphic design'],
    ['programming', 'web development', 'artificial intelligence', 'data science', 'blockchain'],
    ['yoga', 'meditation', 'mindfulness', 'personal development', 'wellness'],
    ['traveling', 'backpacking', 'cultural experiences', 'languages', 'geography'],
    ['music production', 'playing instruments', 'concerts', 'music theory', 'singing'],
    ['finance', 'investing', 'cryptocurrency', 'personal finance', 'real estate'],
    ['gaming', 'esports', 'virtual reality', 'game development', 'tabletop games']
  ];
  
  // Select 2-3 interest categories
  const numInterestCats = Math.floor(Math.random() * 2) + 2;
  const selectedCategoryIndices = new Set<number>();
  while (selectedCategoryIndices.size < numInterestCats) {
    selectedCategoryIndices.add(Math.floor(Math.random() * interestCategories.length));
  }
  
  let interests: string[] = [];
  selectedCategoryIndices.forEach(index => {
    const category = interestCategories[index];
    const numInterests = Math.floor(Math.random() * 2) + 1;
    for (let i = 0; i < numInterests; i++) {
      interests.push(category[Math.floor(Math.random() * category.length)]);
    }
  });
  
  // Generate challenges based on the company info
  const genericChallenges = [
    `Finding a reliable ${companyInfo.industry} solution that fits my budget`,
    `Struggling with current ${companyInfo.industry} options that are too complicated`,
    `Need a ${companyInfo.industry} service that can grow with my needs`,
    `Looking for better customer support in the ${companyInfo.industry} space`,
    `Finding time to research the best ${companyInfo.industry} options available`
  ];
  
  // Add some customized challenges based on company characteristics
  let customChallenges: string[] = [];
  if (companyInfo.characteristics.length > 0) {
    customChallenges = companyInfo.characteristics.map(char => {
      return `Looking for a ${companyInfo.industry} solution that is more ${char.toLowerCase()}`;
    });
  }
  
  const challenges = [...genericChallenges, ...customChallenges].slice(0, 3);
  
  const persona: Persona = {
    name: `${firstName} ${lastName}`,
    age: Math.floor(Math.random() * 30) + 25, // Age between 25-54
    gender,
    location: cities[Math.floor(Math.random() * cities.length)],
    jobTitle: jobTitles[Math.floor(Math.random() * jobTitles.length)],
    interests,
    challenges,
    avatar: generateAvatarUrl(`${firstName} ${lastName}`, gender)
  };
  
  return persona;
};

// Mock AI service for chat responses
export const generateChatResponse = async (
  message: string,
  persona: Persona,
  companyInfo: CompanyInfo,
  messageHistory: Message[]
): Promise<string> => {
  // In a real application, this would call an AI API with the message history and persona info
  await delay(1500); // Simulate API call delay
  
  const companyName = companyInfo.name;
  const companyIndustry = companyInfo.industry;
  const personaName = persona.name;
  const personaJobTitle = persona.jobTitle;
  const personaChallenge = persona.challenges[0];
  
  // Simple rule-based response generation
  const messageContent = message.toLowerCase();
  
  // Check the conversation stage
  const conversationStage = messageHistory.filter(msg => msg.sender === 'persona').length;
  
  // Generate different responses based on conversation stage
  if (conversationStage === 0) {
    // First persona message - they've already introduced their challenge
    if (messageContent.includes('help') || messageContent.includes('assist') || messageContent.includes('solution')) {
      return `Thanks for offering to help! I've been dealing with ${personaChallenge.toLowerCase()} for a while now. Does ${companyName} have something that could address this?`;
    } else if (messageContent.includes('tell me more') || messageContent.includes('explain') || messageContent.includes('details')) {
      return `Sure! As a ${personaJobTitle}, I need something that's reliable but also easy to use. My current solution just isn't cutting it. What makes ${companyName}'s approach different?`;
    } else {
      return `I appreciate your response! I'm really hoping to find a better solution soon. As someone in ${persona.jobTitle}, time is always limited. Does ${companyName} offer something that's quick to implement?`;
    }
  } else if (conversationStage === 1) {
    // Second persona message
    if (messageContent.includes('price') || messageContent.includes('cost') || messageContent.includes('expensive')) {
      return `That's interesting. Price is definitely a factor for me, but I'm also concerned about the learning curve. How long would it take someone like me to get comfortable with ${companyName}'s solution?`;
    } else if (messageContent.includes('feature') || messageContent.includes('benefit') || messageContent.includes('advantage')) {
      return `Those features sound promising! I'm curious though - I've tried other ${companyIndustry} solutions before and ran into integration issues. How flexible is your system when it comes to working with other tools I already use?`;
    } else {
      return `That's good to know! I've been burned before by companies that promise a lot but don't deliver on support. What kind of customer service does ${companyName} provide after I become a customer?`;
    }
  } else {
    // Third persona message - moving toward a decision
    if (messageContent.includes('demo') || messageContent.includes('try') || messageContent.includes('free')) {
      return `A demo would be perfect! I'd like to see firsthand how it works. Could you also send me some case studies of other ${personaJobTitle}s who have used ${companyName}'s solution? That would really help me make my decision.`;
    } else if (messageContent.includes('team') || messageContent.includes('colleague') || messageContent.includes('manager')) {
      return `I'll need to discuss this with my team, but it sounds promising! Could you email me more information that I can share with them? I think they'd be particularly interested in how ${companyName} addresses ${personaChallenge.toLowerCase()}.`;
    } else {
      return `This has been very helpful. I think ${companyName} might be what I've been looking for. What would be the next steps if I wanted to move forward? I'd like to resolve this ${personaChallenge.toLowerCase()} sooner rather than later.`;
    }
  }
};
