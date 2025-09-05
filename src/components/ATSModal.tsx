import { X } from 'lucide-react';
import { GeneratedResume, JobDescription } from '../types';

export default function ATSModal({
  open,
  onClose,
  resume,
  job,
  analysis,
}: {
  open: boolean;
  onClose: () => void;
  resume: GeneratedResume;
  job: JobDescription;
  analysis: any;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative z-50 w-full max-w-3xl mx-4 bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <div>
            <h3 className="text-lg font-semibold">ATS Analysis</h3>
            <p className="text-sm text-gray-500">Score and recommendations for {resume.aiProvider}</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-4xl font-bold">{analysis.score}%</div>
              <div className="text-sm text-gray-500">Overall ATS score</div>
            </div>

            <div className="text-right">
              <div className="text-sm text-gray-600">Keyword match</div>
              <div className="text-xl font-medium">{analysis.keywordMatch}%</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="font-semibold mb-2">Missing Keywords</div>
              {analysis.missingKeywords && analysis.missingKeywords.length ? (
                <ul className="list-disc pl-5 text-sm space-y-1">
                  {analysis.missingKeywords.map((k: string, i: number) => (
                    <li key={i}>{k}</li>
                  ))}
                </ul>
              ) : (
                <div className="text-sm text-gray-500">No major missing keywords detected.</div>
              )}
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="font-semibold mb-2">Recommendations</div>
              {analysis.recommendations && analysis.recommendations.length ? (
                <ul className="list-disc pl-5 text-sm space-y-1">
                  {analysis.recommendations.map((r: string, i: number) => (
                    <li key={i}>{r}</li>
                  ))}
                </ul>
              ) : (
                <div className="text-sm text-gray-500">No additional recommendations.</div>
              )}
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="font-semibold mb-2">Format compliance</div>
            <div className="text-sm">{analysis.formatCompliance ?? 'N/A'}% compliant with common ATS format rules</div>
          </div>

          <div className="bg-white p-4 rounded-lg border">
            <div className="font-semibold mb-2">Detailed analysis</div>
            <pre className="text-xs text-gray-700 max-h-40 overflow-auto whitespace-pre-wrap">{JSON.stringify(analysis.details ?? analysis, null, 2)}</pre>
          </div>

          <div className="flex justify-end space-x-2">
            <a
              href="#"
              onClick={onClose}
              className="py-2 px-4 rounded-lg text-sm bg-gray-100 text-gray-700 hover:bg-gray-200"
            >
              Close
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
