import React from 'react';
import { useNavigate } from 'react-router-dom';

const frontendSections = [
  { name: 'Pages', path: '/admin/frontend/pages' },
  { name: 'Banner Section', path: '/admin/frontend/banner' },
  { name: 'About Section', path: '/admin/frontend/about' },
  { name: 'Feature Section', path: '/admin/frontend/feature' },
  { name: 'Plan Section', path: '/admin/frontend/plan' },
  { name: 'Howitwork Section', path: '/admin/frontend/howitwork' },
  { name: 'Faq Section', path: '/admin/frontend/faq' },
  { name: 'Transaction Section', path: '/admin/frontend/transaction' },
  { name: 'Investor Section', path: '/admin/frontend/investor' },
  { name: 'Testimonial Section', path: '/admin/frontend/testimonial' },
  { name: 'Affiliate Section', path: '/admin/frontend/affiliate' },
  { name: 'Blog Section', path: '/admin/frontend/blog' },
  { name: 'Newsletter Section', path: '/admin/frontend/newsletter' },
  { name: 'Contact Section', path: '/admin/frontend/contact' },
  { name: 'Footer Section', path: '/admin/frontend/footer' },
  { name: 'Service Section', path: '/admin/frontend/service' },
  { name: 'Privacy Policy Section', path: '/admin/frontend/privacy-policy', active: true }
];

export default function Frontend() {
  const navigate = useNavigate();

  const handleSectionClick = (path: string) => {
    if (path === '/admin/frontend/privacy-policy') {
      navigate('/admin/privacy-policy');
    } else {
      alert(`Frontend section: ${path}`);
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Frontend Management</h1>
        <p className="text-gray-600">Manage website frontend content sections</p>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="divide-y divide-gray-200">
          {frontendSections.map((section, index) => (
            <button
              key={index}
              onClick={() => handleSectionClick(section.path)}
              className={`w-full text-left px-6 py-4 hover:bg-gray-50 transition-colors ${
                section.active ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-500' : 'text-gray-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-medium">{section.name}</span>
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}