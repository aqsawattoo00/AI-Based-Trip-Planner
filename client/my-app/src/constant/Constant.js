export const LOGO_TEXT = "Hassaan";

export const NAV_LINKS = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Services", href: "/services" },
  // { name: "Contact Us", href: "/Contact us" },
  { name: "AI Trip Planning", href: "/ai-planning" },
  { name: "Projects", href: "/projects" },

];
//about page 

export const heroSectionData = [
  { value: "5000+", label: "Trips Planned" },
  { value: "PKR:1000", label: "Budget Optimized" },
  { value: "98%", label: "Client Satisfaction" },
  { value: "1000+", label: "Destination Partners" },
];

export const teamMembers = [
  {
    name: 'Hassaan',
    role: 'AI Lead & Co-Founder',
    image: '👨‍💼',
    bio: 'Former Google AI researcher passionate about revolutionizing trip planning.',
    gradient: 'from-blue-500 to-green-500'
  },
  {
    name: 'Aysha',
    role: 'Travel Specialist',
    image: '👩‍💻',
    bio: '10+ years in luxury travel planning, now combining expertise with AI.',
    gradient: 'from-orange-500 to-purple-500'
  },
  {
    name: 'Dr. Fatima',
    role: 'Data Science Director',
    image: '👩‍🔬',
    bio: 'PhD in Machine Learning, dedicated to creating perfect travel experiences.',
    gradient: 'from-blue-500 to-green-500'
  },
  {
    name: 'Tabassum',
    role: 'Product Design Lead',
    image: '🎨',
    bio: 'Award-winning designer creating magical user experiences.',
    gradient: 'from-orange-500 to-purple-500'
  }
];

export const features = [
  {
    icon: '🤖',
    title: 'AI-Powered Planning',
    description: 'Smart algorithms that learn your preferences and create personalized trip plans',
    color: 'from-blue-500 to-green-500'
  },
  {
    icon: '💰',
    title: 'Budget Optimization',
    description: 'Intelligent budget allocation based on market rates and your priorities',
    color: 'from-orange-500 to-purple-500'
  },
  {
    icon: '📅',
    title: 'Smart Timeline',
    description: 'Automated planning schedule with intelligent reminders and task management',
    color: 'from-blue-500 to-green-500'
  },

  {
    icon: '🎨',
    title: 'Itinerary Designer',
    description: 'AI-generated trip itineraries, route plans, and activity suggestions',
    color: 'from-orange-500 to-purple-500'
  },
  {
    icon: '📊',
    title: 'Analytics Dashboard',
    description: 'Real-time insights and recommendations for your trip planning',
    color: 'from-blue-500 to-green-500'
  }
];


export const howToWork = [
  {
    number: '01',
    title: 'Login/Signup',
    description: 'Create an account or login to your account',
    icon: '💭'
  },
  {
    number: '02',
    title: 'Click Start AI Trip Planner button',
    description: 'In the home dashboard or navbar you can see the Start AI Trip Planner button',
    icon: '🤖'
  },
  {
    number: '03',
    title: 'Put the details',
    description: 'Fill all in the details about your trip, preferences, and budget etc',
    icon: '📋'
  },
  {
    number: '04',
    title: 'Generate Plan',
    description: 'Receive a personalized trip plan with destination recommendations',
    icon: '✨'
  }
];


export const faqs = [
  {
    question: 'How does AI trip planning work?',
    answer: 'Our AI analyzes your preferences, budget, and group size to create a personalized trip plan. It uses machine learning algorithms trained on thousands of successful trips to provide the best recommendations for destinations, hotels, and itineraries.'
  },
  {
    question: 'Is it really free to start?',
    answer: 'Yes! You can start with a free consultation and basic planning features. This includes AI recommendations, budget calculator, and basic timeline. Premium features are available for detailed planning and booking coordination starting at $49/month.'
  },
  {
    question: 'Can I make changes to the AI plan?',
    answer: 'Absolutely! You have full control to customize every aspect of your plan. The AI adapts to your changes and provides updated recommendations in real-time. Think of it as your personal travel assistant that learns from your choices.'
  },
  {
    question: 'How is my data protected?',
    answer: 'We take data security seriously. All your information is encrypted and stored securely. We never share your data with third parties without your consent. Our platform is GDPR compliant and uses bank-level security.'
  },
  {
    question: 'What if I need human assistance?',
    answer: 'Our AI is designed to work alongside our travel experts. You can schedule a consultation with our travel specialists at any time. Premium plans include dedicated support from trip planners.'
  }
];

export const footerLinks = {
  company: [
    { name: 'About Us', path: '/about' },
    { name: 'How It Works', path: '/how-it-works' },
    { name: 'Features', path: '/features' },
    { name: 'FAQs', path: '/faqs' },
    { name: 'Testimonials', path: '/testimonials' },

    // { name: 'Careers', path: '/careers' },
    // { name: 'Blog', path: '/blog' }
  ],
  services: [
    { name: 'Our Services', path: '/services' },
    { name: 'Get In Touch', path: '/services#get-in-touch-form' },
    { name: 'Create Testimonials', path: '/create-testimonials' },
    // { name: 'Budget Tools', path: '/services#budget' },
    // { name: 'Timeline Manager', path: '/services#timeline' }
  ],
  support: [
    { name: 'Privacy Policy', path: '/privacy' },
    { name: 'Terms of Service', path: '/terms' }
  ]
};
//Services Section 

export const services = [
  {
    icon: '🎯',
    title: 'AI Trip Planning',
    description: 'Personalized trip plans based on your preferences, budget, and group size.',
    features: ['Smart budget allocation', 'Timeline optimization', 'Group management'],
    color: 'from-blue-500 to-green-500'
  },
  {
    icon: '🏨',
    title: 'Hotel & Stay Matching',
    description: 'AI-powered accommodation recommendations tailored to your style and budget.',
    features: ['Hotel suggestions', 'Guest house matching', 'Camping options'],
    color: 'from-orange-500 to-purple-500'
  },
  {
    icon: '📅',
    title: 'Smart Timeline',
    description: 'Automated planning timeline with smart reminders and task tracking.',
    features: ['Countdown tracker', 'Task automation', 'Booking coordination'],
    color: 'from-blue-500 to-green-500'
  },
  {
    icon: '💰',
    title: 'Budget Optimizer',
    description: 'AI analyzes market rates to optimize your trip budget allocation.',
    features: ['Expense tracking', 'Cost predictions', 'Savings recommendations'],
    color: 'from-orange-500 to-purple-500'
  },
  {
    icon: '🎨',
    title: 'Itinerary Designer',
    description: 'AI-generated trip itineraries, route plans, and activity suggestions.',
    features: ['Route planning', 'Activity suggestions', 'Sightseeing spots'],
    color: 'from-blue-500 to-green-500'
  },
  {
    icon: '📊',
    title: 'Analytics Dashboard',
    description: 'Real-time insights and recommendations for your trip planning.',
    features: ['Booking tracking', 'Budget analytics', 'Destination comparisons'],
    color: 'from-orange-500 to-purple-500'
  }
];






//Journey Milestones

export const milestones = [
  { year: '2023', title: 'Company Founded', description: 'Started with a vision to transform trip planning' },
  { year: '2024', title: 'AI Platform Launch', description: 'Launched our first AI-powered planning tools' },
  { year: '2025', title: '500+ Trips', description: 'Helped plan over 500 dream trips' },
  { year: '2026', title: 'Global Expansion', description: 'Expanded services to 50+ countries' }
];

// aiPlanningUserData



export const aiPlanningUserData = {
  sections: [
    {
      sectionId: "trip_basic_info",
      sectionTitle: "Trip Basic Information",
      questions: [
        {
          id: "startingCity",
          question: "Starting City (From)",
          type: "text",
          placeholder: "e.g., Lahore, Karachi, Islamabad",
          required: true,
        },
        {
          id: "destination",
          question: "Destination (To)",
          type: "text",
          placeholder: "e.g., Murree, Hunza, Skardu",
          required: true,
        },
        {
          id: "tripType",
          question: "Trip Type",
          type: "radio",
          options: ["Solo", "Couple", "Family", "Friends Group"],
          required: true,
        },
        {
          id: "numberOfPeople",
          question: "Number of People",
          type: "number",
          required: true,
        },
        {
          id: "tripDuration",
          question: "Trip Duration (Days)",
          type: "number",
          required: true,
        },
      ],
    },

    {
      sectionId: "budget_preferences",
      sectionTitle: "Budget & Travel Style",
      questions: [
        {
          id: "budgetRange",
          question: "Budget Range (PKR)",
          type: "text",
          placeholder: 'Select Budget Range',
          required: true,
        },
        {
          id: "travelStyle",
          question: "Travel Style",
          type: "radio",
          options: ["Budget", "Standard", "Luxury"],
          required: true,
        },
        {
          id: "transportPreference",
          question: "Preferred Transport",
          type: "checkbox",
          options: ["Bus", "Train", "Car", "Flight"],
        },
        {
          id: "hotelType",
          question: "Accommodation Type",
          type: "checkbox",
          options: [
            "Budget Hotel",
            "Standard Hotel",
            "Luxury Hotel",
            "Guest House",
            "Camping"
          ],
        },
      ],
    },

    {
      sectionId: "preferences",
      sectionTitle: "Travel Preferences",
      questions: [
        {
          id: "environmentPreference",
          question: "Preferred Environment",
          type: "checkbox",
          options: [
            "Snow",
            "Mountains",
            "Greenery",
            "Desert",
            "Beach"
          ],
        },
        {
          id: "activities",
          question: "Activities You Like",
          type: "checkbox",
          options: [
            "Sightseeing",
            "Hiking",
            "Boating",
            "Camping",
            "Photography",
            "Shopping",
            "Food Exploration"
          ],
        },
        {
          id: "foodPreference",
          question: "Food Preference",
          type: "radio",
          options: ["Desi", "Fast Food", "Both"],
        },
        {
          id: "familyFriendly",
          question: "Family Friendly Plan Required?",
          type: "radio",
          options: ["Yes", "No"],
        },
      ],
    },

    {
      sectionId: "travel_details",
      sectionTitle: "Travel Details",
      questions: [
        {
          id: "travelMonth",
          question: "Travel Month",
          type: "text",
          placeholder: 'Enter travel month',
          required: true,
        },
        {
          id: "flexibleDates",
          question: "Are your dates flexible?",
          type: "radio",
          options: ["Yes", "No"],
        },

      ],
    },

    {
      sectionId: "special_requirements",
      sectionTitle: "Special Requirements",
      questions: [
        {
          id: "customRequests",
          question: "Any Special Requests",
          type: "textarea",
          placeholder: "e.g., wheelchair access, honeymoon setup, etc.",
        },
      ],
    },
  ],
};
