import { Router } from 'express';
import { doctors, getGeminiClient } from '../state';

const router = Router();

// POST /api/chat
router.post('/', async (req, res) => {
  const { messages } = req.body;
  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ message: "messages array is required." });
  }

  try {
    const ai = getGeminiClient();
    const formattedContents = messages.map(msg => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }]
    }));

    // Injected doctors context
    const docContext = doctors.map(d => `- ${d.name} (${d.specialization}): ${d.qualification}. Available: ${d.availability}`).join('\n');

    const systemInstruction = `You are "SmartCare Helper", a compassionate, professional AI medical triage and general virtual receptionist for SmartCare Hospital.
Patients will talk to you about their symptoms, ask about clinical facilities, or look for guidance.

Active Medical Team:
${docContext}

Specialized Care Rooms:
- Cardiology (heart issues, arrhythmias, palpitations, high blood pressure) - directed to Dr. Arvind Sharma
- Pediatrics (child vaccinations, infant health, development concerns) - directed to Dr. Meera Nair
- Orthopedics (joint, bone fracture, muscle fatigue, tension) - directed to Dr. Rajesh K.
- Dermatology (scars, skin issues, mole removals, rash, acne) - directed to Dr. Sarah D'Souza
- General Medicine (fever, common flu, diagnostics, standard care) - directed to Dr. Amit Verma
- Neurology (migraine pathways, spinal pain, dizziness, neural symptoms) - directed to Dr. Priya Patel

Instructions:
1. Provide empathetic and polite replies.
2. Analyze patient symptoms and recommend the appropriate specialty (and suggest the respective doctor), but always include a standard, professional, warm medical disclaimer that your suggestions are for guidance, and they should schedule an official consultation.
3. Keep response paragraph lengths moderate and highly scannable, using markdown bullet points for complex steps or guidelines. Do not output raw JSON unless specifically requested.
4. Try to be extremely helpful. If they want to register or book, guide them to create a Patient account, go to their dashboard, and fill in the "Quick Appointment" card or "Book Appointment" navigation option.
5. If the patient is asking generic life advice or medical knowledge not covered by our services, Answer them as best as possible while gently keeping focus on the hospital context.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: formattedContents,
      config: {
        systemInstruction,
        temperature: 0.7
      }
    });

    res.json({ text: response.text });
  } catch (err: any) {
    console.error("Gemini API error (resorting to SmartCare Clinical Fallback Engine):", err);
    
    const lastUserMessage = messages[messages.length - 1]?.content || "";
    const text = lastUserMessage.toLowerCase();
    
    let reply = "";
    
    if (text.includes("book") || text.includes("appoint") || text.includes("token")) {
      reply = `Hello! I can guide you on **booking appointments** and tracking your live queue status:

1. **Create/Access Account**: If you haven't already, click **Register** or **Sign In** with our patient credentials (\`patient@smartcare.com\` / \`password123\`).
2. **Book an Appointment**: From your **Patient Dashboard**, select **Book Appointment** or fill in the **Quick Appointment** card.
3. **Select Clinician & Date**: Pick Dr. Arvind Sharma (Cardiology) or any other specialized doctor.
4. **Instant Token Generation**: Upon booking, you will receive a unique **Live Queue Token Number** instantly on your dashboard!
5. **Real-time Tracker**: Monitor estimated wait times using the live queue meter on your top nav or active dashboard counters.`;
    } else if (text.includes("heart") || text.includes("cardio") || text.includes("sharma") || text.includes("chest") || text.includes("blood pressure")) {
      reply = `For cardiovascular health, chest discomfort, or blood pressure concerns:

- We recommend consulting our expert **Dr. Arvind Sharma (MD, DM Cardiology)**.
- **Specialization**: Interventional Cardiology, Coronary Artery Disease, Hypertension.
- **Availability**: Monday, Wednesday, Friday from 09:00 AM to 01:00 PM.
- **Department Location**: Specialty Care Block, Room 102.

*Disclaimer: AI triage is for general guidance or coordination. For acute medical symptoms or chest pain, please visit our ER or contact emergency service lines immediately.*`;
    } else if (text.includes("child") || text.includes("pediatric") || text.includes("nair") || text.includes("baby") || (text.includes("fever") && text.includes("child")) || text.includes("vaccin")) {
      reply = `For newborn care, child immunization schedules, or pediatric general diagnosis:

- We recommend consulting **Dr. Meera Nair (MD, DCH Pediatrics)**.
- **Specialization**: Pediatric Infectious Diseases & Child Growth Monitoring.
- **Availability**: Tuesday, Thursday, Saturday from 02:00 PM to 06:00 PM.
- **Department Location**: Mother & Child block, Room 204.

*Disclaimer: This guidance is for coordinating appointments. For persistent pediatric high fevers, immediate clinical consultation is essential.*`;
    } else if (text.includes("skin") || text.includes("rash") || text.includes("acne") || text.includes("souza") || text.includes("scars") || text.includes("mole")) {
      reply = `For skin conditions, facial scars, active acne modules, or cosmetic dermatology:

- We recommend consulting **Dr. Sarah D'Souza (MD, DNB Dermatology)**.
- **Specialization**: Aesthetic and Forensic Dermatology, Advanced Laser Therapies.
- **Availability**: Mon to Fri from 04:00 PM to 07:00 PM.
- **Department Location**: Laser & Aesthetics Clinic, Room 301.`;
    } else if (text.includes("ortho") || text.includes("joint") || text.includes("bone") || text.includes("fracture") || text.includes("rajesh") || text.includes("stiff") || text.includes("back")) {
      reply = `For bone fracture recovery, joint alignment, or muscle chronic stiffness triage:

- We recommend consulting **Dr. Rajesh K. (MS, Orthopedics)**.
- **Specialization**: Joint Replacement & Sports Traumatology.
- **Availability**: Wednesday & Saturday from 10:00 AM to 02:00 PM.
- **Department Location**: Orthopedics Annex, Room 108.`;
    } else if (text.includes("neurology") || text.includes("headache") || text.includes("migraine") || text.includes("dizzy") || text.includes("priya") || text.includes("spine")) {
      reply = `For migraines, severe unexplained dizziness, chronic lumbar/spine muscle pathways, or central nerve symptoms:

- We recommend consulting **Dr. Priya Patel (MD, DM Neurology)**.
- **Specialization**: Neuro-diagnostics & Clinical Headache Therapeutics.
- **Availability**: Mon, Wed, Fri from 11:00 AM to 03:00 PM.
- **Department Location**: Neuro-trauma wing, Room 112.`;
    } else if (text.includes("fever") || text.includes("cold") || text.includes("cough") || text.includes("flu") || text.includes("amit") || text.includes("verma") || text.includes("sick")) {
      reply = `For standard viral fevers, common cold, persistent coughs, seasonal flu, or comprehensive medical diagnoses:

- We recommend consulting our seasoned chief resident **Dr. Amit Verma (MD, Medicine)**.
- **Specialization**: Diagnostic Internal Medicine & Primary Elder Care.
- **Availability**: Monday to Saturday from 09:00 AM to 05:00 PM.
- **Department Location**: General OPD, Wing A, Room 101.

*Triage Tip: Practice adequate hydration and monitor body temperature. Always consult Dr. Verma to get the appropriate prescription lines.*`;
    } else {
      reply = `Hello! I am your **SmartCare Helper** virtual clinical advisory receptionist.

Since our real-time cloud-based Gemini connection has encountered a credentials validation limit or rate restriction in this sandboxed preview, I am running on our smart local **Clinical Fail-Safe Engine** to ensure you still get immediate, helpful answers!

I can assist you with:
- **Triage & Specialties**: Ask about symptoms or medical legend details like Cardiology, Pediatrics, Neurology, Orthopedics, or Dermatology.
- **Booking Workflows**: Learn how to register and schedule consultations.
- **Queue Tokens**: Understand how our live queue tracking works.

*What department or symptom query can I clarify for you today?*`;
    }

    res.json({ text: reply });
  }
});

export default router;
