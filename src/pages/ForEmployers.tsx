import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Container } from '../components/ui/Container';
import { Brain, Users, GamepadIcon, Calendar, Video, CheckCircle, Rocket } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export function ForEmployers() {
  const { user, profile } = useAuth();
  const navigate = useNavigate();

  const handleStartHiringClick = () => {
    if (user) {
      // If user is already logged in, redirect to appropriate dashboard
      navigate(profile?.role === 'employer' ? '/employer-dashboard' : '/employee-dashboard');
    } else {
      // If not logged in, redirect to login page
      navigate('/login');
    }
  };

  const benefits = [
    {
      icon: <Users className="w-8 h-8 text-indigo-600" />,
      title: "Find Top Talent",
      description: "Access a curated pool of pre-screened candidates matched to your requirements using our advanced algorithms."
    },
    {
      icon: <GamepadIcon className="w-8 h-8 text-indigo-600" />,
      title: "Game Theory Assessments",
      description: "Evaluate candidates through scientifically-backed psychometric tests and game-based assessments."
    },
    {
      icon: <Calendar className="w-8 h-8 text-indigo-600" />,
      title: "Smart Scheduling",
      description: "Effortlessly coordinate interviews with automated scheduling that syncs with your calendar."
    },
    {
      icon: <Video className="w-8 h-8 text-indigo-600" />,
      title: "Integrated Interviews",
      description: "Conduct structured interviews directly on our platform with built-in evaluation tools."
    },
    {
      icon: <CheckCircle className="w-8 h-8 text-indigo-600" />,
      title: "End-to-End Hiring",
      description: "Complete the entire hiring process from posting to offer acceptance in one unified platform."
    },
    {
      icon: <Rocket className="w-8 h-8 text-indigo-600" />,
      title: "Coming Soon: Onboarding",
      description: "Streamline employee onboarding with automated workflows and documentation management."
    }
  ];

  const plans = [
    {
      name: "Starter",
      price: "499",
      hires: "5",
      features: [
        "Up to 5 active job postings",
        "Basic assessments",
        "Interview scheduling",
        "Standard support"
      ]
    },
    {
      name: "Growth",
      price: "999",
      hires: "15",
      features: [
        "Up to 15 active job postings",
        "Advanced assessments",
        "Interview scheduling & hosting",
        "Priority support",
        "Custom hiring workflow"
      ]
    },
    {
      name: "Enterprise",
      price: "Custom",
      hires: "Unlimited",
      features: [
        "Unlimited job postings",
        "Custom assessments",
        "Full platform access",
        "Dedicated account manager",
        "API access",
        "Custom integrations"
      ]
    }
  ];

  return (
    <Container>
      {/* Hero Section */}
      <div className="text-center py-16">
        <Brain className="w-16 h-16 text-indigo-600 mx-auto mb-6" />
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Transform Your Hiring Process
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          HireFusion combines game theory, psychology, and technology to help you find and hire the perfect candidates.
        </p>
      </div>

      {/* Benefits Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 py-12">
        {benefits.map((benefit, index) => (
          <div key={index} className="p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <div className="mb-4">{benefit.icon}</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">{benefit.title}</h3>
            <p className="text-gray-600">{benefit.description}</p>
          </div>
        ))}
      </div>

      {/* Pricing Section */}
      <div className="py-16">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Simple, Transparent Pricing</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <div key={index} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
              <div className="flex items-baseline mb-4">
                <span className="text-4xl font-bold text-indigo-600">${plan.price}</span>
                <span className="text-gray-500 ml-2">/month</span>
              </div>
              <p className="text-gray-600 mb-6">Up to {plan.hires} hires/month</p>
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-indigo-600 mr-2" />
                    <span className="text-gray-600">{feature}</span>
                  </li>
                ))}
              </ul>
              <button
                onClick={handleStartHiringClick}
                className="block w-full text-center bg-indigo-600 text-white py-3 rounded-md hover:bg-indigo-700 transition-colors"
              >
                {user ? 'Get Started' : 'Sign Up'}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="text-center py-16 bg-indigo-50 rounded-lg mb-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Ready to Transform Your Hiring?
        </h2>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Join leading companies using HireFusion to build outstanding teams.
        </p>
        <button
          onClick={handleStartHiringClick}
          className="inline-block bg-indigo-600 text-white px-8 py-3 rounded-md hover:bg-indigo-700 transition-colors"
        >
          {user ? 'Go to Dashboard' : 'Start Hiring Today'}
        </button>
      </div>
    </Container>
  );
}