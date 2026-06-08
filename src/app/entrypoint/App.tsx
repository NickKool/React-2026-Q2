import React, { useState } from 'react';
import { Modal } from '@/shared/ui/modal/Modal';
import { UncontrolledForm } from '@/features/uncontrolled-form/ui/UncontrolledForm';
import { RhfForm } from '@/features/rhf-form/ui/RhfForm';
import { SubmissionCards } from '@/widgets/submission-cards/ui/SubmissionCards';
import '@/app/style/index.css'

export const App: React.FC = () => {
  const [activeModal, setActiveModal] = useState<'uncontrolled' | 'rhf' | null>(null);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 antialiased selection:bg-blue-500 selection:text-white">
      <header className="bg-white border-b sticky top-0 z-40 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-lg font-black text-blue-600 tracking-tight">FORMS</h1>
          <div className="space-x-3">
            <button
              onClick={() => setActiveModal('uncontrolled')}
              className="px-4 py-2 text-xs font-bold rounded-md bg-gray-900 text-white hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 transition"
            >
              DOM / Uncontrolled Form
            </button>
            <button
              onClick={() => setActiveModal('rhf')}
              className="px-4 py-2 text-xs font-bold rounded-md bg-blue-600 text-white hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 transition"
            >
              React Hook Form
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-10">
        <section>
          <h2 className="text-2xl font-extrabold text-gray-900 mb-1">Submitted Profiles History</h2>
          <p className="text-sm text-gray-500 mb-6">
            All successfully submitted forms are synchronized via Zustand store and highlighted.
          </p>
          
          <SubmissionCards />
        </section>
      </main>

      <Modal
        isOpen={activeModal === 'uncontrolled'}
        onClose={() => setActiveModal(null)}
        title="Create Profile (Uncontrolled Approach)"
      >
        <UncontrolledForm onSuccess={() => setActiveModal(null)} />
      </Modal>

      <Modal
        isOpen={activeModal === 'rhf'}
        onClose={() => setActiveModal(null)}
        title="Create Profile (React Hook Form)"
      >
        <RhfForm onSuccess={() => setActiveModal(null)} />
      </Modal>
    </div>
  );
};

export default App;
