/* Wagwell — shared behaviour for every page
   - Language (English / हिन्दी / मराठी) for the navigation and any [data-i18n] text
   - Dark mode and three text sizes
   Preferences are remembered in localStorage (wrapped in try/catch so private
   browsing still works — the page just falls back to defaults). */
(function () {
  const STRINGS = {
    en: { emerg: '24/7 emergency line', lang: 'Language', size: 'Text size', dark: 'Dark mode', light: 'Light mode',
      home: 'Home', urgent: 'Urgent check', vets: 'Find a vet', book: 'Book', health: 'Health hub', signin: 'Sign in', bookBtn: 'Book a visit',
      kicker: 'Pet care · Vet booking', heroTitle: 'Healthy tails. Happy humans.',
      heroSub: 'Get emergency help in seconds, or book a routine visit in three steps — in clinic, on video or at home.',
      doorA: 'Something’s wrong', doorAText: 'Answer a few quick questions. We’ll tell you how urgent it is and show clinics that are open right now.', doorACta: 'Check urgency',
      doorB: 'Routine care', doorBText: 'Check-ups, vaccines, dental and grooming. See the price and the next free slot before you commit.', doorBCta: 'Book a visit',
      authTitle: 'Every wag, on record.', authSub: 'Sign in with your mobile number — no password to remember.', signInUp: 'Sign in or sign up', sendCode: 'Send code', enterCode: 'Enter the code', verify: 'Verify and continue', mobile: 'Mobile number' },
    hi: { emerg: '24/7 आपातकालीन लाइन', lang: 'भाषा', size: 'अक्षर आकार', dark: 'डार्क मोड', light: 'लाइट मोड',
      home: 'होम', urgent: 'तुरंत जाँच', vets: 'वेट खोजें', book: 'बुक करें', health: 'हेल्थ हब', signin: 'साइन इन', bookBtn: 'विज़िट बुक करें',
      kicker: 'पालतू देखभाल · वेट बुकिंग', heroTitle: 'स्वस्थ पालतू, खुश परिवार।',
      heroSub: 'कुछ ही सेकंड में आपातकालीन मदद पाएँ, या तीन आसान चरणों में नियमित विज़िट बुक करें — क्लिनिक में, वीडियो पर या घर पर।',
      doorA: 'कुछ ठीक नहीं है', doorAText: 'कुछ आसान सवालों के जवाब दें। हम बताएँगे कि स्थिति कितनी गंभीर है और अभी खुले क्लिनिक दिखाएँगे।', doorACta: 'गंभीरता जाँचें',
      doorB: 'नियमित देखभाल', doorBText: 'चेक-अप, टीके, दाँतों की देखभाल और ग्रूमिंग। बुक करने से पहले कीमत और अगला खाली समय देखें।', doorBCta: 'विज़िट बुक करें',
      authTitle: 'हर पूँछ की हलचल, रिकॉर्ड में।', authSub: 'अपने मोबाइल नंबर से साइन इन करें — कोई पासवर्ड याद रखने की ज़रूरत नहीं।', signInUp: 'साइन इन या साइन अप', sendCode: 'कोड भेजें', enterCode: 'कोड डालें', verify: 'पुष्टि करें और आगे बढ़ें', mobile: 'मोबाइल नंबर' },
    mr: { emerg: '२४/७ आपत्कालीन लाइन', lang: 'भाषा', size: 'अक्षर आकार', dark: 'डार्क मोड', light: 'लाइट मोड',
      home: 'मुख्यपृष्ठ', urgent: 'तातडीची तपासणी', vets: 'पशुवैद्य शोधा', book: 'बुक करा', health: 'आरोग्य केंद्र', signin: 'साइन इन', bookBtn: 'भेट बुक करा',
      kicker: 'पाळीव प्राण्यांची काळजी · पशुवैद्य बुकिंग', heroTitle: 'निरोगी पाळीव प्राणी, आनंदी कुटुंब.',
      heroSub: 'काही सेकंदांत आपत्कालीन मदत मिळवा, किंवा तीन सोप्या टप्प्यांत नियमित भेट बुक करा — क्लिनिकमध्ये, व्हिडिओवर किंवा घरी.',
      doorA: 'काहीतरी ठीक नाही', doorAText: 'काही सोप्या प्रश्नांची उत्तरे द्या. परिस्थिती किती तातडीची आहे ते आम्ही सांगू आणि आत्ता उघडे असलेले क्लिनिक दाखवू.', doorACta: 'तातडी तपासा',
      doorB: 'नियमित काळजी', doorBText: 'तपासणी, लसीकरण, दातांची काळजी आणि ग्रूमिंग. बुक करण्यापूर्वी किंमत आणि पुढची रिकामी वेळ पाहा.', doorBCta: 'भेट बुक करा',
      authTitle: 'प्रत्येक शेपटीची हालचाल, नोंदीत.', authSub: 'तुमच्या मोबाइल नंबरने साइन इन करा — कोणताही पासवर्ड लक्षात ठेवायची गरज नाही.', signInUp: 'साइन इन किंवा साइन अप', sendCode: 'कोड पाठवा', enterCode: 'कोड टाका', verify: 'पडताळा आणि पुढे चला', mobile: 'मोबाइल नंबर' }
  };

  const store = {
    get(k, d) { try { return localStorage.getItem('wagwell.' + k) || d; } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem('wagwell.' + k, v); } catch (e) { /* storage blocked — ignore */ } }
  };
  const root = document.documentElement;
  const prefs = { lang: store.get('lang', 'en'), theme: store.get('theme', 'light'), size: store.get('size', '1') };

  function apply() {
    const t = STRINGS[prefs.lang] || STRINGS.en;
    root.lang = prefs.lang;
    root.dataset.theme = prefs.theme;
    root.dataset.size = prefs.size;
    document.querySelectorAll('[data-i18n]').forEach((el) => { const v = t[el.dataset.i18n]; if (v) el.textContent = v; });
    document.querySelectorAll('.js-lang').forEach((sel) => { sel.value = prefs.lang; });
    document.querySelectorAll('.js-theme').forEach((b) => { b.textContent = prefs.theme === 'dark' ? t.light : t.dark; b.setAttribute('aria-pressed', prefs.theme === 'dark'); });
    document.querySelectorAll('.js-size').forEach((b) => b.setAttribute('aria-pressed', b.dataset.size === prefs.size));
    document.querySelectorAll('.js-lang-btn').forEach((b) => b.setAttribute('aria-pressed', b.dataset.lang === prefs.lang));
  }
  function set(k, v) { prefs[k] = v; store.set(k, v); apply(); }

  document.addEventListener('change', (e) => { if (e.target.matches('.js-lang')) set('lang', e.target.value); });
  document.addEventListener('click', (e) => {
    const theme = e.target.closest('.js-theme'); if (theme) set('theme', prefs.theme === 'dark' ? 'light' : 'dark');
    const size = e.target.closest('.js-size'); if (size) set('size', size.dataset.size);
    const lb = e.target.closest('.js-lang-btn'); if (lb) set('lang', lb.dataset.lang);
  });
  apply();
  window.Wagwell = { prefs };
})();
