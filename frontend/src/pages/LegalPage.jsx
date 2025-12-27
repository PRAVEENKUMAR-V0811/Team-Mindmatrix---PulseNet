const content = {
  privacy: {
    title: "Privacy Protocol",
    body: "PulseNet follows the Digital Personal Data Protection (DPDP) Act of India. We ensure that patient PII (Personally Identifiable Information) is encrypted at rest. AI analysis is performed on anonymized tokens. No patient data is used to train public LLM models."
  },
  guidelines: {
    title: "Medical Guidelines",
    body: "This tool is a Clinical Decision Support System (CDSS), NOT a replacement for a qualified doctor. All AI-generated diagnoses must be validated by a medical professional. If red-flag symptoms (Sepsis, Cardiac Arrest, Stroke) are detected, immediate referral to a Tertiary Care Center is mandatory."
  },
  terms: {
    title: "Terms of Use",
    body: "By using PulseNet, clinics agree to maintain medical confidentiality. PulseNet AI is not liable for clinical decisions made based on its suggestions. Usage is restricted to registered primary health centers and verified medical practitioners in India."
  }
};

export default function LegalPage({ type }) {
  const page = content[type];
  return (
    <div className="max-w-3xl mx-auto px-6 py-20">
      <h1 className="text-4xl font-black text-gray-900 mb-8">{page.title}</h1>
      <div className="prose prose-blue text-gray-600 leading-loose">
        <p className="bg-blue-50 p-6 rounded-3xl border border-blue-100 text-blue-900 font-medium mb-6">
          Last Updated: December 2025
        </p>
        <p className="whitespace-pre-line">{page.body}</p>
      </div>
    </div>
  );
}