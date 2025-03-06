import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Container } from '../components/ui/Container';
import { Search, FileText, Award, BookOpen, Zap, Briefcase, Star, Shield } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export function ForEmployees() {
  const { user, profile } = useAuth();
  const navigate = useNavigate();

  const handleSignUpClick = () => {
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
      icon: <Search className="w-8 h-8 text-indigo-600" />,
      title: "Smart Job Matching",
      description: "Our AI-powered algorithm matches you with jobs that align with your skills, experience, and career goals."
    },
    {
      icon: <FileText className="w-8 h-8 text-indigo-600" />,
      title: "Skill Assessment",
      description: "Discover your strengths and areas for improvement through our interactive games and assessments."
    },
    {
      icon: <Award className="w-8 h-8 text-indigo-600" />,
      title: "Verified Profile",
      description: "Stand out with a verified profile that showcases your skills, experience, and assessment results."
    },
    {
      icon: <BookOpen className="w-8 h-8 text-indigo-600" />,
      title: "Interview Preparation",
      description: "Access resources and tips to help you prepare for interviews and negotiate offers."
    },
    {
      icon: <Zap className="w-8 h-8 text-indigo-600" />,
      title: "One-Click Apply",
      description: "Apply to multiple jobs with a single click, saving you time and effort in your job search."
    },
    {
      icon: <Briefcase className="w-8 h-8 text-indigo-600" />,
      title: "Career Insights",
      description: "Get personalized insights and recommendations to help you advance your career."
    }
  ];

  const premiumPlans = [
    {
      name: "Basic",
      price: "49",
      period: "month",
      features: [
        "Professional Resume Review",
        "Cover Letter Templates",
        "5 Premium Applications",
        "Basic Career Coaching",
        "Email Support"
      ]
    },
    {
      name: "Pro",
      price: "99",
      period: "month",
      popular: true,
      features: [
        "Complete Resume Makeover",
        "Custom Cover Letter Writing",
        "Unlimited Premium Applications",
        "2 Mock Interview Sessions",
        "Salary Negotiation Training",
        "Priority Support"
      ]
    },
    {
      name: "Career Accelerator",
      price: "249",
      period: "month",
      features: [
        "Executive Resume & LinkedIn Optimization",
        "Personal Branding Strategy",
        "Unlimited Premium Applications",
        "5 Mock Interview Sessions",
        "Advanced Salary Negotiation Coaching",
        "Dedicated Career Coach",
        "24/7 VIP Support"
      ]
    }
  ];

  return (
    <Container>
      {/* Hero Section */}
      <div className="text-center py-16">
        <Star className="w-16 h-16 text-indigo-600 mx-auto mb-6" />
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Accelerate Your Career Journey
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          HireFusion helps you showcase your true potential and connect with employers who value your unique skills and talents.
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

      {/* Premium Plans Section */}
      <div className="py-16">
        <div className="text-center mb-12">
          <Shield className="w-12 h-12 text-indigo-600 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Premium Career Services</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Invest in your career with our premium services designed to help you stand out and land your dream job.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {premiumPlans.map((plan, index) => (
            <div 
              key={index} 
              className={`bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-8 relative ${plan.popular ? 'border-2 border-indigo-500' : ''}`}
            >
              {plan.popular && (
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-indigo-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                  Most Popular
                </div>
              )}
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
              <div className="flex items-baseline mb-4">
                <span className="text-4xl font-bold text-indigo-600">${plan.price}</span>
                <span className="text-gray-500 ml-2">/{plan.period}</span>
              </div>
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center">
                    <Star className="w-5 h-5 text-indigo-600 mr-2" />
                    <span className="text-gray-600">{feature}</span>
                  </li>
                ))}
              </ul>
              <button
                onClick={handleSignUpClick}
                className={`block w-full text-center py-3 rounded-md transition-colors duration-200 ${
                  plan.popular 
                    ? 'bg-indigo-600 text-white hover:bg-indigo-700' 
                    : 'bg-white border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-50'
                }`}
              >
                {user ? 'Get Started' : 'Sign Up'}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="py-16 bg-gray-50 rounded-lg mb-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Success Stories
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Hear from job seekers who found their dream roles through HireFusion.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <p className="text-gray-600 italic mb-4">
              "The premium resume makeover service completely transformed my job search. I went from zero callbacks to five interviews in just two weeks!"
            </p>
            <div className="flex items-center">
              <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold">
                JD
              </div>
              <div className="ml-3">
                <p className="text-sm font-semibold">James Davis</p>
                <p className="text-xs text-gray-500">Software Engineer</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <p className="text-gray-600 italic mb-4">
              "The mock interview sessions were incredibly valuable. They helped me identify my weaknesses and gave me the confidence I needed to ace my interviews."
            </p>
            <div className="flex items-center">
              <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold">
                SL
              </div>
              <div className="ml-3">
                <p className="text-sm font-semibold">Sarah Lee</p>
                <p className="text-xs text-gray-500">Marketing Manager</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <p className="text-gray-600 italic mb-4">
              "The salary negotiation coaching helped me secure a 20% higher offer than I initially received. The investment in the premium plan paid for itself many times over!"
            </p>
            <div className="flex items-center">
              <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold">
                MJ
              </div>
              <div className="ml-3">
                <p className="text-sm font-semibold">Michael Johnson</p>
                <p className="text-xs text-gray-500">Product Manager</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="text-center py-16 bg-indigo-50 rounded-lg mb-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Ready to Take Your Career to the Next Level?
        </h2>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Join thousands of professionals who have accelerated their careers with HireFusion.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <button
            onClick={handleSignUpClick}
            className="inline-block bg-indigo-600 text-white px-8 py-3 rounded-md hover:bg-indigo-700 transition-colors"
          >
            {user ? 'Go to Dashboard' : 'Sign Up Now'}
          </button>
          <Link
            to="/jobs"
            className="inline-block bg-white border-2 border-indigo-600 text-indigo-600 px-8 py-3 rounded-md hover:bg-indigo-50 transition-colors"
          >
            Browse Jobs
          </Link>
        </div>
      </div>
    </Container>
  );
}