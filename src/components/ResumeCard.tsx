import React, { useState, useCallback } from 'react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { Eye, Download, Target, Bot } from 'lucide-react';
import ATSModal from './AtsModal';
import { ATSScoring } from '../utils/atsScoring';
import type { GeneratedResume, JobDescription } from '../types';
import { ResumePDF } from './ResumePDF';

const getProviderColor = (provider: string) => {
  const colors = {
    'mistral': 'bg-green-500',
    'llama': 'bg-orange-500',
    'gemini': 'bg-blue-500',
    'deepseek': 'bg-purple-500',
  };
  return (colors as Record<string, string>)[provider] || 'bg-gray-500';
};

const getProviderIcon = () => Bot;
const ProviderIcon = getProviderIcon();

type ResumeCardProps = {
  resume: GeneratedResume;
  jobDescription: JobDescription;
  userProfile: any;
  selectedResume: string | null;
  setSelectedResume: (id: string | null) => void;
  formatResumeContent: (content: any) => React.ReactNode;
};

export default function ResumeCard({
  resume,
  jobDescription,
  userProfile,
  selectedResume,
  setSelectedResume,
  formatResumeContent,
}: ResumeCardProps) {
  const [atsLoading, setAtsLoading] = useState(false);
  const [atsResult, setAtsResult] = useState<any | null>(null);
  const [atsError, setAtsError] = useState<string | null>(null);
  const [openModal, setOpenModal] = useState(false);

  // debug helper (prefix with resume id for multi-card clarity)
  const log = (...args: any[]) => {
    // protect if resume or resume.id missing
    const id = (resume && (resume as any).id) ? (resume as any).id : 'unknown';
    // eslint-disable-next-line no-console
    console.log(`[ResumeCard ${id}]`, ...args);
  };

  /**
   * checkATS - does the actual network call (or cached util)
   * force=true bypasses the early return that opens the modal when atsResult exists.
   */
  const checkATS = useCallback(
    async (force = false) => {
      log('checkATS called', { force, atsResultPresent: !!atsResult });

      // If not forcing and we already have a result, just open the modal.
      if (!force && atsResult) {
        log('Existing atsResult -> opening modal');
        setOpenModal(true);
        return;
      }

      setAtsError(null);
      setAtsLoading(true);
      try {
        log('Calling ATSScoring.generateATS with resume and jobDescription...');
        const result = await ATSScoring.generateATS(resume, jobDescription, { force: true });
        log('ATSScoring returned', result);
        setAtsResult(result);
        setOpenModal(true);
      } catch (err) {
        log('generateATS errored', err);
        setAtsError('Failed to check ATS');
      } finally {
        setAtsLoading(false);
        log('checkATS finished (loading false)');
      }
    },
    // deps: include powerful inputs so latest values are used
    // atsResult included intentionally so the callback can read it
    [resume, jobDescription, atsResult]
  );

  // button handlers (match MouseEventHandler signature implicitly)
  const handleCheckATS = () => {
    log('handleCheckATS click');
    void checkATS(false);
  };

  const handleRecheck = () => {
    log('handleRecheck click - clearing state and forcing check');
    setAtsResult(null);
    setAtsError(null);
    setOpenModal(false);
    void checkATS(true);
  };

  const renderAtsArea = () => {
    if (atsLoading) {
      return (
        <button
          className="w-full bg-emerald-500/80 text-white py-2 px-3 rounded-lg text-sm flex items-center justify-center"
          disabled
        >
          <svg className="animate-spin w-4 h-4 mr-2" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
          </svg>
          Checking...
        </button>
      );
    }

    if (atsResult) {
      const color =
        atsResult.score >= 85 ? 'bg-emerald-600' :
        atsResult.score >= 70 ? 'bg-amber-500' :
        'bg-red-500';

      return (
        <div className="mt-3 flex items-center justify-between space-x-3">
          <button
            onClick={() => {
              log('Open modal from score button');
              setOpenModal(true);
            }}
            className={`${color} text-white py-2 px-3 rounded-lg text-sm flex items-center space-x-2 flex-1`}
          >
            <span className="font-semibold">{atsResult.score}%</span>
            <span className="text-xs opacity-90">ATS Score</span>
          </button>

          <button
            onClick={handleRecheck}
            className="ml-2 bg-gray-100 text-gray-700 py-2 px-3 rounded-lg hover:bg-gray-200 text-sm"
          >
            Re-check
          </button>
        </div>
      );
    }

    return (
      <div className="mt-3">
        <button
          onClick={handleCheckATS}
          className="w-full bg-emerald-600 text-white py-2 px-3 rounded-lg hover:bg-emerald-700 text-sm flex items-center justify-center space-x-2"
        >
          <Target className="w-4 h-4" />
          <span>Check ATS</span>
        </button>
      </div>
    );
  };

  const sanitize = (str?: string) =>
    str?.trim().replace(/\s+/g, "-"); // turn spaces into hyphens

  const company = sanitize(jobDescription?.company);
  const userName = sanitize(userProfile?.personalInfo?.name);

  let fileName = "resume.pdf";

  if (company && userName) {
    fileName = `${company}-${userName}-resume.pdf`;
  } else if (company) {
    fileName = `${company}-resume.pdf`;
  } else if (userName) {
    fileName = `${userName}-resume.pdf`;
  }

  return (
    <div key={(resume as any).id} className="bg-white rounded-xl shadow-lg border-2 border-gray-200">
      <div className="p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className={`${getProviderColor((resume as any).aiProvider)} p-2 rounded-lg`}>
            <ProviderIcon className="w-5 h-5 text-white" />
          </div>
          <h3 className="font-semibold text-gray-900">{(resume as any).aiProvider}</h3>
        </div>

        <div className="flex space-x-2">
          <button
            onClick={() =>
              setSelectedResume(selectedResume === (resume as any).id ? null : (resume as any).id)
            }
            className="flex-1 bg-gray-100 text-gray-700 py-2 px-3 rounded-lg hover:bg-gray-200 text-sm"
          >
            <Eye className="w-4 h-4 inline" /> Preview
          </button>

          <PDFDownloadLink
            document={<ResumePDF resume={(resume as any).content} userProfile={userProfile} />}
            fileName={fileName}
          >
            {({ loading }) => (
              <button className="bg-blue-600 text-white py-2 px-3 rounded-lg hover:bg-blue-700 text-sm flex items-center space-x-1">
                <Download className="w-4 h-4" />
                <span>{loading ? 'Preparing...' : 'Export PDF'}</span>
              </button>
            )}
          </PDFDownloadLink>
        </div>

        {renderAtsArea()}
        {atsError && <p className="mt-2 text-sm text-red-600">{atsError}</p>}
      </div>

      {selectedResume === (resume as any).id && (
        <div className="border-t border-gray-200 bg-gray-50 p-6">
          {formatResumeContent((resume as any).content)}
        </div>
      )}

      {openModal && atsResult && (
        <ATSModal
          open={openModal}
          onClose={() => setOpenModal(false)}
          resume={resume}
          job={jobDescription}
          analysis={atsResult}
        />
      )}
    </div>
  );
}
