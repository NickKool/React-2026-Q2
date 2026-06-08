import React, { useEffect } from 'react';
import { useSubmissionStore } from '@/entities/submission/model/store';

export const SubmissionCards: React.FC = () => {
  const { submissions, latestSubmissionId, setLatestSubmissionId } = useSubmissionStore();

  useEffect(() => {
    if (latestSubmissionId) {
      const timer = setTimeout(() => {
        setLatestSubmissionId(null); 
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [latestSubmissionId, setLatestSubmissionId]);

  if (submissions.length === 0) {
    return (
      <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-xl text-gray-400 font-medium">
        Submission history is empty. Open a form and submit your first profile!
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {submissions.map((item) => {
        const isNew = item.id === latestSubmissionId;

        return (
          <div
            key={item.id}
            data-testid="submission-card"
            className={`p-5 rounded-xl border shadow-sm flex flex-col transition-all duration-1000 ease-out ${
              isNew 
                ? 'bg-yellow-50 border-yellow-400 ring-4 ring-yellow-100 scale-[1.01]' 
                : 'bg-white border-gray-200'
            }`}
          >
            <div className="flex items-center space-x-4 mb-4">
              <img
                src={item.imageBas64}
                alt={`Avatar of ${item.name}`}
                className="w-12 h-12 rounded-full object-cover border border-gray-200 bg-gray-50"
              />
              <div>
                <h4 className="font-bold text-gray-900 text-base leading-tight">{item.name}</h4>
                <p className="text-xs text-gray-500">Age: {item.age}</p>
              </div>
            </div>

            <div className="text-sm text-gray-600 space-y-1.5 flex-1">
              <p>
                <span className="text-gray-400 font-medium">Email:</span> {item.email}
              </p>
              <p>
                <span className="text-gray-400 font-medium">Gender:</span>{' '}
                {item.gender === 'male' ? 'Male' : 'Female'}
              </p>
              <p>
                <span className="text-gray-400 font-medium">Country:</span> {item.country}
              </p>
            </div>

            <div className="mt-4 pt-2 border-t border-gray-100 text-[10px] text-gray-400 text-right font-mono">
              ID: {item.id.slice(0, 8)}...
            </div>
          </div>
        );
      })}
    </div>
  );
};
