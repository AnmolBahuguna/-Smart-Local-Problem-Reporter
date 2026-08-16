/**
 * suggestions.js — Rule-Based Auto-Suggestion Engine
 * Maps complaint categories to structured action suggestions.
 * Returns prioritized, actionable guidance for each civic issue type.
 */

const Suggestions = (() => {

  const rules = {
    'cat_1': {  // Pothole / Road Damage
      title: 'Pothole & Road Damage — Immediate Actions',
      icon: '🛣️',
      urgency: 'high',
      authority: 'Public Works Department (PWD)',
      contact: '1800-425-1520 | pwd.karnataka.gov.in',
      steps: [
        { text: '<strong>Barricade the area</strong> — Place rocks or branches around the pothole to warn two-wheelers. Call your local ward office immediately to request temporary marking.' },
        { text: '<strong>File PWD complaint</strong> — Visit <strong>pwd.karnataka.gov.in/grievance</strong> or call <strong>1800-425-1520</strong>. Reference your complaint ID for faster tracking.' },
        { text: '<strong>Document evidence</strong> — Take photos showing the size (place a coin/bottle for scale). This strengthens your complaint and speeds up inspection.' },
        { text: '<strong>Alert neighbours</strong> — Share complaint details on local WhatsApp groups so multiple reports are filed, increasing priority assignment.' },
        { text: '<strong>Escalate if no action in 7 days</strong> — Contact your ward councillor or file on <strong>pgportal.gov.in</strong> with your reference number.' },
      ],
    },
    'cat_2': {  // Street Light
      title: 'Street Light Issue — Action Steps',
      icon: '💡',
      urgency: 'medium',
      authority: 'BESCOM (Electricity Supply Co.)',
      contact: '1912 | bescom.org/consumer-care',
      steps: [
        { text: '<strong>Call BESCOM helpline 1912</strong> — Available 24/7. Provide the pole number (usually printed on the pole) and your exact location.' },
        { text: '<strong>File online complaint</strong> — Visit <strong>bescom.org</strong> → "Consumer Services" → "Lodge Complaint". Note the acknowledgement number.' },
        { text: '<strong>Note the pole number</strong> — Each street light pole has a unique ID. Including this in your complaint ensures faster dispatch of the right team.' },
        { text: '<strong>Request temporary lighting</strong> — Contact your ward office for emergency generator-based temporary lighting if the area is accident-prone.' },
        { text: '<strong>Escalate after 48 hours</strong> — If unresolved, email the BESCOM Superintending Engineer or tag @BESCOMofficial on social media with your complaint number.' },
      ],
    },
    'cat_3': {  // Water Supply
      title: 'Water Supply Issue — Action Steps',
      icon: '💧',
      urgency: 'high',
      authority: 'BWSSB (Water Supply & Sewerage Board)',
      contact: '1916 | bwssb.gov.in',
      steps: [
        { text: '<strong>Call BWSSB helpline 1916</strong> — 24/7 water emergency line. Report your area, locality name, and how long supply has been disrupted.' },
        { text: '<strong>Request emergency water tanker</strong> — BWSSB provides free tanker service during supply outages. Coordinate with your apartment association for bulk ordering.' },
        { text: '<strong>File online complaint</strong> — Visit <strong>bwssb.gov.in</strong> → "Online Complaint" and track resolution with your complaint ID.' },
        { text: '<strong>Check for pipeline work</strong> — Sometimes disruption is due to scheduled maintenance. Check BWSSB\'s social media or your area notice board.' },
        { text: '<strong>Conserve what you have</strong> — Prioritize drinking water. Collect water during late-night/early-morning hours when pressure is typically better.' },
      ],
    },
    'cat_4': {  // Garbage Collection
      title: 'Garbage Collection — Action Steps',
      icon: '♻️',
      urgency: 'medium',
      authority: 'BBMP Solid Waste Management',
      contact: 'Sahaaya: 1533 | bbmp.gov.in',
      steps: [
        { text: '<strong>Call BBMP Sahaaya helpline 1533</strong> — Free 24/7 civic helpline. Provide your ward number, street name, and number of days missed.' },
        { text: '<strong>Use BBMP SAHAAYA app</strong> — Download from Play Store/App Store. Report under "Solid Waste" category with exact GPS pin of garbage location.' },
        { text: '<strong>Segregate your waste</strong> — Keep dry and wet waste separate. BBMP may refuse to collect mixed garbage as per Solid Waste Management Rules 2016.' },
        { text: '<strong>Contact your Pourakarmikas directly</strong> — Ask your apartment association for the contact number of your area\'s designated garbage collector.' },
        { text: '<strong>Escalate to Ward Health Inspector</strong> — If collection is repeatedly missed, file a complaint with the Ward Health Inspector through your local office.' },
      ],
    },
    'cat_5': {  // Sewage / Drainage
      title: 'Sewage & Drainage — Action Steps',
      icon: '🚰',
      urgency: 'high',
      authority: 'BWSSB Sewerage Division',
      contact: '1916 (Sewerage Wing) | bwssb.gov.in',
      steps: [
        { text: '<strong>Call BWSSB 1916 immediately</strong> — For sewage overflow, this is treated as an emergency. Request a "Drain Cleaning Unit" dispatch.' },
        { text: '<strong>Avoid the contaminated area</strong> — Sewage water carries pathogens. Keep children and pets away. Use rubber boots if you must walk through.' },
        { text: '<strong>Do not drain more water into blocked lines</strong> — Minimize water use (washing, flushing) until the blockage is cleared to prevent overflow.' },
        { text: '<strong>File complaint with photo evidence</strong> — Take photos showing water level and location. Report on <strong>bwssb.gov.in</strong> under "Sewerage Complaint".' },
        { text: '<strong>For flooding: Call BBMP Control Room</strong> — During heavy rain, call BBMP at <strong>080-22975555</strong> for emergency road/drain dewatering support.' },
      ],
    },
    'cat_6': {  // Noise Pollution
      title: 'Noise Pollution — Action Steps',
      icon: '🔇',
      urgency: 'low',
      authority: 'Local Police / KSPCB',
      contact: '100 (Police) | kspcb.karnataka.gov.in',
      steps: [
        { text: '<strong>Note time and nature of noise</strong> — Record time, source, and estimated decibel level. Permissible limits: Day (6am–10pm): 55 dB residential, Night: 45 dB.' },
        { text: '<strong>Speak to the source first</strong> — If it\'s a neighbour or nearby shop, a polite conversation often resolves the issue without escalation.' },
        { text: '<strong>Call local police non-emergency line</strong> — For persistent noise, call <strong>080-22942222</strong> (Bangalore City Police non-emergency). For emergencies: 100.' },
        { text: '<strong>File complaint with KSPCB</strong> — Karnataka State Pollution Control Board handles industrial/commercial noise. Visit <strong>kspcb.karnataka.gov.in</strong>.' },
        { text: '<strong>For events/loudspeakers</strong> — Events after 10 PM require police permission. Complain with event details to the local police station.' },
      ],
    },
    'cat_7': {  // Stray Animals
      title: 'Stray Animal Issue — Action Steps',
      icon: '🐾',
      urgency: 'medium',
      authority: 'BBMP Animal Welfare / CUPA',
      contact: 'BBMP: 080-22975555 | CUPA: 98451 05554',
      steps: [
        { text: '<strong>Do not provoke or corner the animal</strong> — Back away slowly. Avoid direct eye contact with aggressive dogs. Do not run.' },
        { text: '<strong>Call BBMP Animal Squad</strong> — Contact <strong>080-22975555</strong> to report aggressive strays for catch-neuter-return (CNR) processing.' },
        { text: '<strong>Contact CUPA for injured animals</strong> — Compassion Unlimited Plus Action: <strong>98451 05554</strong>. They provide rescue and medical care.' },
        { text: '<strong>For dog bites: Go to hospital immediately</strong> — Anti-rabies vaccination must be administered within 24 hours. Government hospitals provide it free.' },
        { text: '<strong>Support CNR programs</strong> — Sterilization is the long-term solution. You can sponsor a dog\'s CNR through registered NGOs like CUPA.' },
      ],
    },
    'cat_8': {  // Illegal Construction
      title: 'Illegal Construction — Action Steps',
      icon: '⚖️',
      urgency: 'medium',
      authority: 'BBMP Town Planning Authority',
      contact: 'BBMP: 1533 | bbmp.gov.in/town-planning',
      steps: [
        { text: '<strong>Document the construction</strong> — Photograph and video the site. Note dimensions, location, number of floors, and whether any setbacks are violated.' },
        { text: '<strong>Check if permits exist</strong> — Ask the builder to show the approved building plan (it must be displayed at the site). Note the plan number if visible.' },
        { text: '<strong>File complaint with BBMP Town Planning</strong> — Visit <strong>bbmp.gov.in</strong> → "Town Planning" → "Complaint". Attach photos and location details.' },
        { text: '<strong>Contact Assistant Executive Engineer (AEE)</strong> — Your ward\'s AEE has authority to issue stop-work notices. Get contact from your ward office.' },
        { text: '<strong>File RTI if no action in 15 days</strong> — File an RTI application to BBMP asking about the complaint status and building approval details.' },
      ],
    },
    'cat_9': {  // Park / Public Space
      title: 'Park & Public Space — Action Steps',
      icon: '🌿',
      urgency: 'low',
      authority: 'BBMP Parks Department',
      contact: 'BBMP Sahaaya: 1533',
      steps: [
        { text: '<strong>Report to BBMP Sahaaya 1533</strong> — Select "Parks & Gardens" category. Describe the specific issue (broken equipment, encroachment, poor maintenance).' },
        { text: '<strong>Contact your Ward Councillor</strong> — Parks fall under ward jurisdiction. Councillors can allocate ward funds for maintenance. Attend monthly ward meetings.' },
        { text: '<strong>Engage the RWA (Residents Welfare Association)</strong> — Form a park committee to take over maintenance under BBMP\'s "Amara Park" adoption program.' },
        { text: '<strong>For encroachment: File emergency complaint</strong> — Encroachment on public parks is illegal. File immediately with BBMP and local revenue authorities.' },
        { text: '<strong>Use BBMP\'s Hasiru Usiru program</strong> — Citizens can adopt trees and parks for maintenance, often getting recognition from the municipal corporation.' },
      ],
    },
    'cat_10': {  // Traffic / Signage
      title: 'Traffic & Signage — Action Steps',
      icon: '🚦',
      urgency: 'medium',
      authority: 'Bangalore Traffic Police / BBMP',
      contact: 'Traffic: 080-22868444 | BBMP: 1533',
      steps: [
        { text: '<strong>Report to Bangalore Traffic Police</strong> — Call <strong>080-22868444</strong> or tweet @BlrCityPolice with the location and nature of the traffic issue.' },
        { text: '<strong>Use the Kaveri app</strong> — Bangalore Traffic Police\'s official app allows you to report traffic violations and signal issues with GPS tagging.' },
        { text: '<strong>For damaged/missing signage</strong> — File complaint with BBMP (1533) as road signage falls under their Road Infrastructure department.' },
        { text: '<strong>For signal timing issues</strong> — Contact BATA (Bangalore Traffic Improvement Project). Signal timing is managed separately from physical maintenance.' },
        { text: '<strong>Document dangerous locations</strong> — Record accident-prone spots with photos. Share with local media and traffic police for priority attention.' },
      ],
    },
    'cat_11': {  // Electricity / Power Cut
      title: 'Power Cut & Electrical Issue — Action Steps',
      icon: '⚡',
      urgency: 'high',
      authority: 'BESCOM',
      contact: '1912 | bescom.org',
      steps: [
        { text: '<strong>Call BESCOM 1912 immediately</strong> — Available 24/7 for power outages and electrical emergencies. Provide your area, landmark, and account/connection number.' },
        { text: '<strong>Check BESCOM outage schedule</strong> — Visit <strong>bescom.org</strong> → "Planned Maintenance" to see if the outage is scheduled (maintenance work).' },
        { text: '<strong>Check your meter/fuse box first</strong> — Sometimes a tripped MCB or blown fuse causes localized cuts. Reset MCBs if only your premises is affected.' },
        { text: '<strong>Report fallen power lines immediately</strong> — Keep everyone at least 10 metres away. Call 1912 AND 100. Do not attempt to touch or move wires.' },
        { text: '<strong>Track complaint on BESCOM portal</strong> — Log in to <strong>bescom.org</strong> with your account number to track real-time complaint status and restoration estimates.' },
      ],
    },
    'cat_12': {  // Other
      title: 'General Civic Issue — Action Steps',
      icon: '📋',
      urgency: 'low',
      authority: 'Ward Office / BBMP',
      contact: 'BBMP Sahaaya: 1533 | pgportal.gov.in',
      steps: [
        { text: '<strong>Contact BBMP Sahaaya helpline 1533</strong> — This is your first point of contact for all civic issues in Bangalore. Available in Kannada and English.' },
        { text: '<strong>Visit your Ward Office</strong> — Ward offices handle most local civic grievances. Bring ID proof and a written complaint for official acknowledgement.' },
        { text: '<strong>File on pgportal.gov.in</strong> — The Government of India\'s public grievance portal routes complaints to the right authority and tracks resolution.' },
        { text: '<strong>Use the Bruhat Bengaluru app</strong> — BBMP\'s official citizen app for reporting issues, tracking complaints, and accessing civic services.' },
        { text: '<strong>Document everything</strong> — Keep copies of all complaints filed, acknowledgement numbers, and photos. This creates an audit trail for escalation.' },
      ],
    },
  };

  function getSuggestion(categoryId) {
    return rules[categoryId] || rules['cat_12'];
  }

  function renderSuggestionPanel(categoryId) {
    const s = getSuggestion(categoryId);
    const urgencyClass = { high: 'danger', medium: 'warning', low: 'info' }[s.urgency] || 'info';
    const urgencyLabel = { high: 'High Priority', medium: 'Medium Priority', low: 'Low Priority' }[s.urgency];

    const stepsHtml = s.steps.map((step, i) => `
      <div class="suggestion-item">
        <div class="suggestion-num">${i + 1}</div>
        <div class="suggestion-text">${step.text}</div>
      </div>
    `).join('');

    return `
      <div class="suggestion-panel">
        <div class="suggestion-header">
          <span class="suggestion-icon">${s.icon}</span>
          <div>
            <h4>${s.title}</h4>
            <div style="display:flex;gap:8px;align-items:center;margin-top:4px;flex-wrap:wrap;">
              <span class="badge badge-${urgencyClass === 'danger' ? 'rejected' : urgencyClass === 'warning' ? 'pending' : 'info'}">${urgencyLabel}</span>
              <span style="font-size:0.78rem;color:var(--c-text-2);">📍 ${s.authority} — ${s.contact}</span>
            </div>
          </div>
        </div>
        ${stepsHtml}
      </div>
    `;
  }

  return { getSuggestion, renderSuggestionPanel };
})();
