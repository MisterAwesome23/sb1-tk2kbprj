import React, { useState } from 'react';
import { Container } from '../components/ui/Container';
import { GamepadIcon, RefreshCw, ArrowRight, Book, X } from 'lucide-react';
import { MBTI_QUESTIONS, PERSONALITY_TYPES } from '../lib/constants';

interface Answer {
  questionId: number;
  value: string;
}

export function Games() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [personalityType, setPersonalityType] = useState<string>('');
  const [showAllTypes, setShowAllTypes] = useState(false);

  const progress = ((currentQuestion + 1) / MBTI_QUESTIONS.length) * 100;

  const handleAnswer = (value: string) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = {
      questionId: MBTI_QUESTIONS[currentQuestion].id,
      value
    };
    setAnswers(newAnswers);

    if (currentQuestion < MBTI_QUESTIONS.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      calculateResults(newAnswers);
    }
  };

  const calculateResults = (finalAnswers: Answer[]) => {
    const dimensions = {
      E: 0, I: 0,
      S: 0, N: 0,
      T: 0, F: 0,
      J: 0, P: 0
    };

    finalAnswers.forEach((answer) => {
      dimensions[answer.value as keyof typeof dimensions]++;
    });

    const type = [
      dimensions.E > dimensions.I ? 'E' : 'I',
      dimensions.S > dimensions.N ? 'S' : 'N',
      dimensions.T > dimensions.F ? 'T' : 'F',
      dimensions.J > dimensions.P ? 'J' : 'P'
    ].join('');

    setPersonalityType(type);
    setShowResults(true);
  };

  const resetTest = () => {
    setCurrentQuestion(0);
    setAnswers([]);
    setShowResults(false);
    setPersonalityType('');
    setShowAllTypes(false);
  };

  const AllTypesModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white p-4 border-b flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">All MBTI Personality Types</h2>
          <button
            onClick={() => setShowAllTypes(false)}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="p-6 grid md:grid-cols-2 gap-6">
          {Object.entries(PERSONALITY_TYPES).map(([type, info]) => (
            <div key={type} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
              <h3 className="text-xl font-bold text-indigo-600 mb-2">
                {type} - {info.name}
              </h3>
              <p className="text-gray-600 mb-3">{info.description}</p>
              <div className="mb-3">
                <h4 className="font-semibold mb-1">Key Characteristics:</h4>
                <ul className="list-disc list-inside text-gray-600">
                  {info.characteristics.map((trait, index) => (
                    <li key={index}>{trait}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-1">Famous People:</h4>
                <p className="text-gray-600">{info.famousPeople.join(', ')}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  if (!showResults && MBTI_QUESTIONS.length === 0) {
    return (
      <Container>
        <div className="text-center py-12">
          <p>Loading questions...</p>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <div className="max-w-2xl mx-auto py-12">
        {!showResults ? (
          <>
            <div className="text-center mb-8">
              <GamepadIcon className="w-12 h-12 text-indigo-600 mx-auto mb-4" />
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                MBTI Personality Test
              </h1>
              <p className="text-gray-600">
                Discover your personality type through this quick assessment
              </p>
            </div>

            <div className="mb-8">
              <div className="h-2 bg-gray-200 rounded-full">
                <div
                  className="h-2 bg-indigo-600 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-sm text-gray-600 mt-2">
                Question {currentQuestion + 1} of {MBTI_QUESTIONS.length}
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
              <h2 className="text-xl font-semibold mb-6">
                {MBTI_QUESTIONS[currentQuestion].text}
              </h2>
              <div className="space-y-4">
                {MBTI_QUESTIONS[currentQuestion].options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswer(option.value)}
                    className="w-full text-left p-4 rounded-lg border border-gray-200 hover:border-indigo-500 hover:bg-indigo-50 transition-colors duration-200"
                  >
                    <div className="flex items-center">
                      <span className="flex-grow">{option.text}</span>
                      <ArrowRight className="w-5 h-5 text-gray-400" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </>
        ) : (
          <div className="bg-white rounded-lg shadow-sm p-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-indigo-600 mb-4">
                Your Personality Type: {personalityType}
              </h2>
              <p className="text-xl text-gray-700 mb-6">
                {PERSONALITY_TYPES[personalityType as keyof typeof PERSONALITY_TYPES]?.description}
              </p>
            </div>

            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-3">Key Characteristics:</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                {PERSONALITY_TYPES[personalityType as keyof typeof PERSONALITY_TYPES]?.characteristics.map((trait, index) => (
                  <li key={index}>{trait}</li>
                ))}
              </ul>
            </div>

            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-3">Famous People with Your Type:</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                {PERSONALITY_TYPES[personalityType as keyof typeof PERSONALITY_TYPES]?.famousPeople.map((person, index) => (
                  <li key={index}>{person}</li>
                ))}
              </ul>
            </div>

            <div className="flex flex-col space-y-4">
              <button
                onClick={() => setShowAllTypes(true)}
                className="w-full flex items-center justify-center px-4 py-2 border border-indigo-600 text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-indigo-50 transition-colors duration-200"
              >
                <Book className="w-5 h-5 mr-2" />
                View All Personality Types
              </button>
              
              <button
                onClick={resetTest}
                className="w-full flex items-center justify-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition-colors duration-200"
              >
                <RefreshCw className="w-5 h-5 mr-2" />
                Take Test Again
              </button>
            </div>
          </div>
        )}
      </div>
      {showAllTypes && <AllTypesModal />}
    </Container>
  );
}
