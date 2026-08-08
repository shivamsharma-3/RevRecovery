import React, { useState, useEffect } from 'react';
import { X, ChevronRight, ChevronLeft, CheckCircle2 } from 'lucide-react';
import { useScrollLock } from '@/hooks/use-scroll-lock';

const TOUR_STEPS = [
  {
    title: 'Import your denials',
    description:
      'Export your denied or outstanding claims report from your practice management system as CSV, then import it under Claims. Column names do not need to match — we map them for you.',
    target: 'center'
  },
  {
    title: 'Triage them in one pass',
    description:
      'Hit "Triage with AI" and every claim gets a recovery probability, a root cause, and a specific next step — including the ones we tell you not to appeal because they are contractual.',
    target: 'center'
  },
  {
    title: 'Work the top of the list',
    description:
      'Claims sort by expected value, so a 55% likely $4,000 claim outranks a 90% likely $80 one. Open any claim to draft an appeal letter, or export the worklist for your billing staff.',
    target: 'center'
  }
];

export default function OnboardingTour() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  useScrollLock(isOpen);

  useEffect(() => {
    // Check if user has seen the tour
    const hasSeenTour = localStorage.getItem('revrecover_tour_seen');
    if (!hasSeenTour) {
      // Small delay to let the dashboard load
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    localStorage.setItem('revrecover_tour_seen', 'true');
  };

  const handleNext = () => {
    if (currentStep < TOUR_STEPS.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      handleClose();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  if (!isOpen) return null;

  const step = TOUR_STEPS[currentStep];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-300">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-teal-600 text-white">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center font-bold text-sm">
              {currentStep + 1}/{TOUR_STEPS.length}
            </div>
            <h3 className="text-lg font-bold font-headline">{step.title}</h3>
          </div>
          <button 
            onClick={handleClose}
            className="p-2 hover:bg-white/20 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-8">
          <p className="text-slate-600 text-base leading-relaxed mb-8">
            {step.description}
          </p>
          
          <div className="flex items-center justify-between">
            <div className="flex gap-1.5">
              {TOUR_STEPS.map((_, idx) => (
                <div 
                  key={idx} 
                  className={`h-2 rounded-full transition-all ${
                    idx === currentStep ? 'w-6 bg-teal-600' : 'w-2 bg-slate-200'
                  }`}
                />
              ))}
            </div>
            
            <div className="flex gap-3">
              {currentStep > 0 && (
                <button 
                  onClick={handlePrev}
                  className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl font-bold hover:bg-slate-50 transition-all text-sm"
                >
                  Back
                </button>
              )}
              <button 
                onClick={handleNext}
                className="px-6 py-2 bg-teal-600 text-white rounded-xl font-bold hover:bg-teal-700 transition-all shadow-lg shadow-teal-900/20 text-sm flex items-center gap-2"
              >
                {currentStep === TOUR_STEPS.length - 1 ? (
                  <>Get Started <CheckCircle2 className="w-4 h-4" /></>
                ) : (
                  <>Next <ChevronRight className="w-4 h-4" /></>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
