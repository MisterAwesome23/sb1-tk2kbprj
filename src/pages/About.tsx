import React from 'react';
import { Container } from '../components/ui/Container';
import { Brain, Users, BarChart, Puzzle, Heart, Zap, Shield, Award } from 'lucide-react';

export function About() {
  const features = [
    {
      icon: <Brain className="w-12 h-12 text-indigo-600" />,
      title: "Game Theory Assessment",
      description: "Our platform leverages advanced game theory principles to evaluate both candidates and teams, providing deeper insights into workplace dynamics."
    },
    {
      icon: <Users className="w-12 h-12 text-indigo-600" />,
      title: "Team Dynamics",
      description: "We analyze team compatibility and dynamics to ensure new hires contribute positively to existing team structures."
    },
    {
      icon: <BarChart className="w-12 h-12 text-indigo-600" />,
      title: "AI-Driven Insights",
      description: "Get data-driven insights into candidate-team fit, reducing bias and improving hiring decisions through our advanced matching engine."
    },
    {
      icon: <Puzzle className="w-12 h-12 text-indigo-600" />,
      title: "End-to-End Hiring",
      description: "From job posting to onboarding, our platform streamlines the entire hiring process for both employers and job seekers."
    }
  ];

  const milestones = [
    {
      phase: "Phase 1: MVP Enhancement",
      timeline: "0-3 months",
      items: [
        "Refine existing features and UI/UX",
        "Implement basic AI integrations for resume parsing",
        "Stabilize personality/negotiation game and feedback loop"
      ]
    },
    {
      phase: "Phase 2: Advanced Employer Features",
      timeline: "3-6 months",
      items: [
        "Add in-platform interview scheduling",
        "Introduce advanced analytics for employers",
        "Expand paid services for employees"
      ]
    },
    {
      phase: "Phase 3: AI Personalization",
      timeline: "6-12 months",
      items: [
        "Develop in-house ML models for deeper matching",
        "Automate feedback generation using historical data",
        "Expand game library with new assessments"
      ]
    },
    {
      phase: "Phase 4: Scaling & Partnerships",
      timeline: "12+ months",
      items: [
        "Broaden integrations (Slack, Microsoft Teams)",
        "Grow to serve multiple regions/industries",
        "Add enterprise-level features"
      ]
    }
  ];

  return (
    <Container>
      {/* Support Section */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl p-8 mb-16">
        <div className="max-w-3xl mx-auto text-center">
          <Heart className="w-12 h-12 mx-auto mb-4 animate-pulse" />
          <h2 className="text-3xl font-bold mb-4">Support HireFusion</h2>
          <p className="text-lg mb-6 opacity-90">
            Help us revolutionize the hiring process and create better workplace matches. Your support enables us to continue developing innovative solutions.
          </p>
          <a
            href="https://buy.stripe.com/test_7sI6se5xUgsf0nufYY"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-8 py-3 border-2 border-white rounded-full text-lg font-semibold hover:bg-white hover:text-indigo-600 transition-colors duration-200"
          >
            <Heart className="w-5 h-5 mr-2" />
            Support Our Mission
          </a>
        </div>
      </div>

      <div className="py-12 max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">About HireFusion</h1>
          <p className="text-xl text-gray-600">
            Revolutionizing hiring through game theory and behavioral science
          </p>
        </div>

        <div className="prose prose-lg mx-auto mb-16">
          <p>
            HireFusion is a cutting-edge platform designed to streamline the hiring process for both job seekers and employers. 
            By combining game theory principles with behavioral science, we provide unprecedented insights into team dynamics 
            and workplace compatibility.
          </p>
          <p>
            Our mission is to reduce wasted time for job seekers and companies alike, simplify the end-to-end hiring process, 
            and provide helpful AI-driven insights for better hiring decisions.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {features.map((feature, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>

        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">Our Target Audience</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center mb-4">
                <Award className="w-10 h-10 text-indigo-600 mr-3" />
                <h3 className="text-xl font-semibold">For Job Seekers</h3>
              </div>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start">
                  <span className="text-indigo-600 mr-2">•</span>
                  <span>New college graduates looking to break into the workforce</span>
                </li>
                <li className="flex items-start">
                  <span className="text-indigo-600 mr-2">•</span>
                  <span>Individuals who need profile improvement or skill-building services</span>
                </li>
                <li className="flex items-start">
                  <span className="text-indigo-600 mr-2">•</span>
                  <span>Professionals seeking objective assessment of their skills</span>
                </li>
              </ul>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center mb-4">
                <Shield className="w-10 h-10 text-indigo-600 mr-3" />
                <h3 className="text-xl font-semibold">For Employers</h3>
              </div>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start">
                  <span className="text-indigo-600 mr-2">•</span>
                  <span>Early-stage startups with recent funding</span>
                </li>
                <li className="flex items-start">
                  <span className="text-indigo-600 mr-2">•</span>
                  <span>Companies wanting a streamlined, cost-effective hiring funnel</span>
                </li>
                <li className="flex items-start">
                  <span className="text-indigo-600 mr-2">•</span>
                  <span>Organizations seeking data-driven hiring decisions</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">Development Roadmap</h2>
          <div className="space-y-8">
            {milestones.map((milestone, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center mb-4">
                  <Zap className="w-8 h-8 text-indigo-600 mr-3" />
                  <div>
                    <h3 className="text-xl font-semibold">{milestone.phase}</h3>
                    <p className="text-sm text-indigo-600">{milestone.timeline}</p>
                  </div>
                </div>
                <ul className="space-y-2 text-gray-600">
                  {milestone.items.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-start">
                      <span className="text-indigo-600 mr-2">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gray-50 p-8 rounded-lg">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Technology Stack</h2>
          <p className="text-gray-600 mb-6">
            HireFusion is built using modern, scalable technologies to ensure a seamless experience for all users:
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Frontend</h3>
              <ul className="space-y-1 text-gray-600">
                <li>• React with TypeScript</li>
                <li>• Tailwind CSS for responsive design</li>
                <li>• Modern component architecture</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Backend</h3>
              <ul className="space-y-1 text-gray-600">
                <li>• Supabase (PostgreSQL)</li>
                <li>• Secure authentication</li>
                <li>• Real-time data synchronization</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">AI & Machine Learning</h3>
              <ul className="space-y-1 text-gray-600">
                <li>• Integration with third-party AI services</li>
                <li>• Custom matching algorithms</li>
                <li>• Behavioral analysis models</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Security</h3>
              <ul className="space-y-1 text-gray-600">
                <li>• Data encryption at rest and in transit</li>
                <li>• Role-based access control</li>
                <li>• Regular security audits</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
}