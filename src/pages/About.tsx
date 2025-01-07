import React from 'react';
import { Container } from '../components/ui/Container';
import { Brain, Users, BarChart, Puzzle } from 'lucide-react';

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
      title: "Objective Insights",
      description: "Get data-driven insights into candidate-team fit, reducing bias and improving hiring decisions."
    },
    {
      icon: <Puzzle className="w-12 h-12 text-indigo-600" />,
      title: "Comprehensive Assessment",
      description: "Evaluate technical skills, soft skills, and team compatibility through our innovative assessment platform."
    }
  ];

  return (
    <Container>
      <div className="py-12 max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">About TGX HireFusion</h1>
          <p className="text-xl text-gray-600">
            Revolutionizing hiring through game theory and behavioral science
          </p>
        </div>

        <div className="prose prose-lg mx-auto mb-16">
          <p>
            TGX HireFusion is a cutting-edge pre-employment assessment tool that transforms 
            the traditional hiring process. By combining game theory principles with 
            behavioral science, we provide unprecedented insights into team dynamics 
            and workplace compatibility.
          </p>
          <p>
            Our platform goes beyond conventional assessments by evaluating both 
            candidates and existing teams, ensuring optimal job fit and fostering 
            more productive work environments.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </Container>
  );
}