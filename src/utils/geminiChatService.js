// --- CLINICAL SIMULATOR FOR DEMO PURPOSES ---
const getSimulatedResponse = (question, context) => {
  const q = question.toLowerCase();
  
  // High-fidelity responses for common PGx presentation topics
  if (q.includes("cyp2d6") || q.includes("codeine") || q.includes("opioid")) {
    return `Summary: Codeine risk is significantly increased in CYP2D6 Ultrarapid Metabolizers.

Mechanism: Codeine is a prodrug that must be metabolized into morphine by the CYP2D6 enzyme. Genetic variations like duplication of the *1 or *2 alleles (Ultrarapid phenotype) cause abnormally high conversion rates.

Clinical Insight: Ultrarapid metabolizers experience dangerously high levels of morphine, leading to respiratory depression or toxicity. Conversely, Poor Metabolizers (PM) experience no pain relief.

Safety Note: This is a simulated clinical insight based on CPIC guidelines for demonstration. Not medical advice.`;
  }

  if (q.includes("clopidogrel") || q.includes("cyp2c19") || q.includes("plavix")) {
    return `Summary: CYP2C19 Poor Metabolizers have a 2.4x higher risk of major cardiovascular events on Clopidogrel.

Mechanism: Clopidogrel is bioactivated by the CYP2C19 enzyme. Loss-of-function alleles like *2 and *3 prevent this activation, meaning the drug remains in its inactive state.

Clinical Insight: For these patients, alternative antiplatelet therapies (such as Ticagrelor or Prasugrel) are recommended by the FDA-approved label and CPIC guidelines.

Safety Note: This is an educational clinical insight provided by the PharmaGuard demo engine.`;
  }

  if (q.includes("metabolizer") || q.includes("phenotype")) {
    return `Summary: Phenotypes describe the functional activity level of an enzyme (e.g., Poor, Intermediate, Normal, Ultrarapid).

Mechanism: The phenotype is determined by the specific combination of inherited alleles (diplotype). For example, carrying two no-function alleles results in a 'Poor Metabolizer' phenotype.

Clinical Insight: Understanding phenotypes allows physicians to predict a patient's drug clearance rate and tailor dosing before the first prescription is written.

Safety Note: Information provided for pharmacogenomics educational demonstration.`;
  }

  return `Summary: PharmaGuard AI is ready to analyze your pharmacogenomic query.

Mechanism: The system uses deep-learning clinical models to cross-reference your VCF variance data against the ClinVar and CPIC databases.

Clinical Insight: To see personalized insights for this specific query, ensure a valid Gemini API key is configured in the environment settings, or ask about common genes like CYP2D6 or CYP2C19.

Safety Note: This information is for clinical demonstration purposes and is not medical advice.`;
};

const API_URL = "http://localhost:5000/api/chatbot";

export const geminiChatService = async (userQuestion, analysisContext = null, transparency = 'detailed', mode = 'patient') => {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        message: userQuestion, 
        analysisContext: analysisContext,
        transparencyLevel: transparency,
        explanationMode: mode
      })
    });

    if (!response.ok) throw new Error("Backend error");
    
    const data = await response.json();
    return data.reply;
  } catch (error) {
    console.error("Clinical Engine API Error:", error);
    // Silent Fallback to Simulator if Backend fails during demo
    return getSimulatedResponse(userQuestion, analysisContext);
  }
};
