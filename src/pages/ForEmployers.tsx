import React from 'react';
import { Link } from 'react-router-dom';
import './ForEmployers.css'; // Assuming there's a CSS file for styling

const ForEmployers = () => {
  return (
    <div className="for-employers-page">
      <h1>Employer Services</h1>
      <p>Welcome to our employer services page. Here, you can find information about our job posting options, analytics, company profile, branding, and more.</p>
      <div className="pricing-table">
        <table className="table">
          <thead>
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Plan</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Features</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            <tr>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10">
                    <img className="h-10 w-10 rounded-full" src="/images/plan1.png" alt="Plan 1" />
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">Basic</div>
                    <div className="text-sm text-gray-500">For small businesses</div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-700">Job posting</div>
                <div className="text-sm text-gray-700">Analytics</div>
                <div className="text-sm text-gray-700">Limited company profile</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium text-gray-900">Free</td>
            </tr>
            <tr>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10">
                    <img className="h-10 w-10 rounded-full" src="/images/plan2.png" alt="Plan 2" />
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">Standard</div>
                    <div className="text-sm text-gray-500">For medium-sized businesses</div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-700">Job posting</div>
                <div className="text-sm text-gray-700">Analytics</div>
                <div className="text-sm text-gray-700">Company profile</div>
                <div className="text-sm text-gray-700">Branding</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium text-gray-900">$99/month</td>
            </tr>
            <tr>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10">
                    <img className="h-10 w-10 rounded-full" src="/images/plan3.png" alt="Plan 3" />
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">Premium</div>
                    <div className="text-sm text-gray-500">For large businesses</div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-700">Job posting</div>
                <div className="text-sm text-gray-700">Analytics</div>
                <div className="text-sm text-gray-700">Company profile</div>
                <div className="text-sm text-gray-700">Branding</div>
                <div className="text-sm text-gray-700">Advanced analytics</div>
                <div className="text-sm text-gray-700">Customizable company page</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium text-gray-900">$499/month</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="cta">
        <Link to="/signup" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Sign Up Now</Link>
      </div>
    </div>
  );
};

export default ForEmployers;
