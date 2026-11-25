const pages = [...document.querySelectorAll('.page')];
const navItems = [...document.querySelectorAll('.nav-item')];
const titles = {overview:'Overview', pathway:'My pathway', applications:'Applications', events:'Events', support:'Career support', privacy:'Privacy & sharing', fair:'Career fair guide', handshake:'Opportunities'};
document.querySelectorAll('.school-seal, .nav-icon, .external, .help-icon, .notification-dot, .pulse, .check-circle, .empty-circle, .stat-icon, .task-symbol, .rec-icon, .step-check, .company-logo, .alumni-avatar, .sharing-audience-icon, .privacy-lock-icon, .notif-icon, .unread-dot, .login-dot, .chevron')
  .forEach(icon=>icon.setAttribute('aria-hidden','true'));
function showPage(name){
  pages.forEach(p=>p.classList.toggle('active-page',p.id===`page-${name}`));
  navItems.forEach(n=>{
    const active=n.dataset.page===name;
    n.classList.toggle('active',active);
    if(active)n.setAttribute('aria-current','page');
    else n.removeAttribute('aria-current');
  });
  const title=titles[name]||'Overview';
  document.getElementById('crumb-current').textContent=title;
  document.title=`${title} | Illinois Tech Career Hub`;
  window.scrollTo({top:0,behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});
}
navItems.forEach(n=>{if(n.classList.contains('active'))n.setAttribute('aria-current','page')});
navItems.forEach(n=>n.addEventListener('click',()=>showPage(n.dataset.page)));
document.querySelectorAll('[data-goto]').forEach(b=>b.addEventListener('click',()=>showPage(b.dataset.goto)));
document.getElementById('open-fair').addEventListener('click',()=>showPage('fair'));
document.getElementById('fair-card-button').addEventListener('click',()=>showPage('fair'));
const modal=document.getElementById('survey-modal');
let dialogOpener=null;
function openDialog(backdrop,initialFocus){
  dialogOpener=document.activeElement;
  backdrop.classList.add('open');
  const target=initialFocus||backdrop.querySelector('.modal-close');
  if(target)target.focus();
}
function closeDialog(backdrop){
  backdrop.classList.remove('open');
  if(dialogOpener&&dialogOpener.isConnected)dialogOpener.focus();
  dialogOpener=null;
}
function handleDialogKeydown(event,backdrop){
  if(!backdrop.classList.contains('open'))return;
  if(event.key==='Escape'){
    event.preventDefault();
    closeDialog(backdrop);
    return;
  }
  if(event.key!=='Tab')return;
  const focusable=[...backdrop.querySelectorAll('a[href],button:not(:disabled),input:not(:disabled),select:not(:disabled),textarea:not(:disabled),[tabindex]:not([tabindex="-1"])')]
    .filter(element=>element.getClientRects().length>0);
  if(!focusable.length){
    event.preventDefault();
    return;
  }
  const first=focusable[0],last=focusable[focusable.length-1];
  if(event.shiftKey&&document.activeElement===first){
    event.preventDefault();
    last.focus();
  }else if(!event.shiftKey&&document.activeElement===last){
    event.preventDefault();
    first.focus();
  }
}
document.querySelectorAll('.modal-backdrop').forEach(backdrop=>{
  backdrop.addEventListener('keydown',event=>handleDialogKeydown(event,backdrop));
  backdrop.addEventListener('click',event=>{if(event.target===backdrop)closeDialog(backdrop)});
});
function openModal(){openDialog(modal,modal.querySelector('.choice'))}
function closeModal(){closeDialog(modal)}
document.getElementById('start-survey').addEventListener('click',openModal);
document.getElementById('edit-profile').addEventListener('click',openModal);
document.getElementById('pathway-personalize').addEventListener('click',openModal);
document.getElementById('edit-goals').addEventListener('click',openModal);
document.getElementById('view-profile').addEventListener('click',openModal);
document.querySelectorAll('[data-close]').forEach(b=>b.addEventListener('click',closeModal));
document.querySelectorAll('.choice').forEach(c=>c.addEventListener('click',()=>{
  document.querySelectorAll('.choice').forEach(x=>{
    const selected=x===c;
    x.classList.toggle('selected',selected);
    x.setAttribute('aria-pressed',String(selected));
  });
}));
const toast=document.getElementById('toast');
function showToast(message='Saved — your prototype preferences have been updated.'){toast.textContent=message;toast.classList.add('show');setTimeout(()=>toast.classList.remove('show'),2600)}
document.getElementById('save-survey').addEventListener('click',()=>{closeModal();showToast();});
document.getElementById('login-button').addEventListener('click',()=>showToast('Demo account: jjohn@hawk.illinoistech.edu'));
document.getElementById('handshake-link').addEventListener('click',()=>showToast('External Handshake link would open here.'));
document.getElementById('hs-open-2').addEventListener('click',()=>showToast('External Handshake link would open here.'));
document.getElementById('all-notifications').addEventListener('click',()=>showToast('Showing the latest sample notifications.'));
document.getElementById('more-questions').addEventListener('click',()=>showToast('Try asking about intern projects, mentorship, and team technologies.'));
document.querySelectorAll('.apply-button').forEach(b=>b.addEventListener('click',()=>showToast('Sample job details would open here.')));
document.querySelectorAll('.event-card-action button[aria-pressed]').forEach(button=>button.addEventListener('click',()=>{
  const saved=button.getAttribute('aria-pressed')!=='true';
  button.setAttribute('aria-pressed',String(saved));
  button.textContent=saved?'Saved ✓':'Save event ☆';
  showToast(saved?'Event saved in this prototype.':'Event removed from your saved list.');
}));
document.querySelectorAll('.employer-details').forEach(button=>button.addEventListener('click',()=>{
  const company=button.closest('.employer-row').querySelector('.employer-info strong').textContent;
  showToast(`${company} employer details would open here.`);
}));

const eventCards=[...document.querySelectorAll('.event-card')];
const search=document.getElementById('event-search'), major=document.getElementById('major-filter'), type=document.getElementById('type-filter');
function filterEvents(){
  const q=search.value.toLowerCase(), m=major.value, t=type.value;
  let count=0;
  eventCards.forEach(card=>{
    const matches=(m==='all'||card.dataset.major===m||card.dataset.major==='All majors') &&
      (t==='all'||card.dataset.type===t) && card.dataset.search.includes(q);
    card.style.display=matches?'flex':'none'; if(matches)count++;
  });
  document.getElementById('event-result-count').textContent=`${count} event${count===1?'':'s'}`;
}
[search,major,type].forEach(el=>el.addEventListener('input',filterEvents));
document.getElementById('reset-filters').addEventListener('click',()=>{search.value='';major.value='all';type.value='all';filterEvents()});

const calendar=document.getElementById('calendar-grid');
const weekdays=calendar.querySelectorAll('.weekday');
const days=[...weekdays];
const firstOffset=4; // October 1, 2026 is Thursday
for(let i=0;i<35;i++){
  const day=i-firstOffset+1;
  const cell=document.createElement('div');cell.className='day-cell';
  if(day<1||day>31){cell.classList.add('muted-day');cell.innerHTML=`<span class="day-number">${day<1?30+day:day-31}</span>`;}
  else{cell.innerHTML=`<span class="day-number">${day}</span>`;}
  if(day===31)cell.classList.add('today');
  if(day===27){cell.insertAdjacentHTML('beforeend','<span class="day-event green-event">Advising: Career coaching</span>');}
  if(day===29){cell.insertAdjacentHTML('beforeend','<span class="day-event">Workshop: Resume review</span>');}
  if(day===31){cell.insertAdjacentHTML('beforeend','<span class="day-event orange-event">Portfolio: Portfolio check-in</span>');}
  if(day===3){cell.insertAdjacentHTML('beforeend','<span class="day-event">Workshop: Resume Lab</span>');}
  if(day===5){cell.insertAdjacentHTML('beforeend','<span class="day-event orange-event">Career fair: Fall Career Fair</span>');}
  if(day===6){cell.insertAdjacentHTML('beforeend','<span class="day-event green-event">Info session: Cloud & Software</span>');}
  if(day===10){cell.insertAdjacentHTML('beforeend','<span class="day-event">Networking: Alumni Connections</span>');}
  if(day===12){cell.insertAdjacentHTML('beforeend','<span class="day-event">Workshop: Interview Practice</span>');}
  if(day===17){cell.insertAdjacentHTML('beforeend','<span class="day-event green-event">Advising: Career drop-in</span>');}
  days.push(cell);
}
days.forEach(d=>calendar.appendChild(d));
document.querySelectorAll('.check-item input').forEach(c=>c.addEventListener('change',()=>showToast('Checklist updated.')));

function readPrototypeData(key, fallback, isValid) {
  try {
    const stored = localStorage.getItem(key);
    if (stored === null) return fallback;
    const value = JSON.parse(stored);
    if (isValid(value)) return value;
    showToast('Saved prototype data was invalid and has been reset.');
  } catch (error) {
    showToast('Saved prototype data could not be read in this browser.');
  }
  return fallback;
}

function writePrototypeData(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    showToast('This browser blocked saving. Your change will not persist after refresh.');
    return false;
  }
}

const privacyAudienceFields = {
  advisors:['profile','skills','applications'],
  employers:['profile','skills','contact'],
  alumni:['profile','skills']
};
const privacyAudienceNames = {
  advisors:'Career Services advisors',
  employers:'employers',
  alumni:'alumni and mentors'
};
const privacySettingKey = 'careerhub-privacy-settings';

function createDefaultPrivacySettings() {
  return Object.fromEntries(Object.keys(privacyAudienceFields).map(audience => [
    audience,
    {enabled:false, fields:[], grantedAt:null, revokedAt:null, updatedAt:null}
  ]));
}

function isValidPrivacySettings(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value) &&
    Object.keys(value).length === Object.keys(privacyAudienceFields).length &&
    Object.keys(privacyAudienceFields).every(audience => {
      const setting = value[audience];
      return setting && typeof setting.enabled === 'boolean' &&
        Array.isArray(setting.fields) &&
        setting.fields.every(field => privacyAudienceFields[audience].includes(field)) &&
        new Set(setting.fields).size === setting.fields.length &&
        ['grantedAt','revokedAt','updatedAt'].every(key =>
          setting[key] === null ||
          (typeof setting[key] === 'string' && Number.isFinite(Date.parse(setting[key])))
        );
    });
}

let privacySettings = readPrototypeData(
  privacySettingKey,
  createDefaultPrivacySettings(),
  isValidPrivacySettings
);

function formatPrivacyDate(dateValue) {
  return new Date(dateValue).toLocaleString(undefined, {
    month:'short', day:'numeric', year:'numeric', hour:'numeric', minute:'2-digit'
  });
}

function renderPrivacySettings() {
  const enabledAudiences = Object.keys(privacyAudienceFields)
    .filter(audience => privacySettings[audience].enabled);

  document.querySelectorAll('[data-share-toggle]').forEach(toggle => {
    const audience = toggle.dataset.shareToggle;
    const setting = privacySettings[audience];
    toggle.checked = setting.enabled;
    toggle.disabled = setting.fields.length === 0;
  });
  document.querySelectorAll('[data-share-field]').forEach(fieldInput => {
    const {shareField:audience} = fieldInput.dataset;
    fieldInput.checked = privacySettings[audience].fields.includes(fieldInput.value);
  });
  Object.keys(privacyAudienceFields).forEach(audience => {
    const setting = privacySettings[audience];
    const card = document.querySelector(`[data-sharing-card="${audience}"]`);
    const status = card.querySelector('[data-share-status]');
    status.textContent = setting.enabled
      ? `On · ${setting.fields.length} ${setting.fields.length === 1 ? 'field' : 'fields'}`
      : setting.fields.length
        ? `Off · ${setting.fields.length} selected`
        : 'Off';
    status.classList.toggle('is-enabled', setting.enabled);
    card.classList.toggle('is-sharing', setting.enabled);

    const updated = card.querySelector('[data-share-updated]');
    if (setting.enabled && setting.grantedAt) {
      updated.textContent = `Consent granted ${formatPrivacyDate(setting.grantedAt)}`;
      if (setting.updatedAt && setting.updatedAt !== setting.grantedAt) {
        updated.textContent += ` · Scope updated ${formatPrivacyDate(setting.updatedAt)}`;
      }
    } else if (setting.revokedAt) {
      updated.textContent = `Sharing turned off ${formatPrivacyDate(setting.revokedAt)}`;
    } else if (setting.fields.length && setting.updatedAt) {
      updated.textContent = `Scope selected ${formatPrivacyDate(setting.updatedAt)} · sharing is off`;
    } else {
      updated.textContent = 'No sharing consent recorded';
    }
  });

  const summaryStatus = document.getElementById('privacy-summary-status');
  const summaryDetail = document.getElementById('privacy-summary-detail');
  if (enabledAudiences.length) {
    summaryStatus.textContent = `Sharing is on with ${enabledAudiences.length} ${enabledAudiences.length === 1 ? 'audience' : 'audiences'}`;
    summaryDetail.textContent = enabledAudiences.map(audience => {
      const setting = privacySettings[audience];
      return `${privacyAudienceNames[audience]} (${setting.fields.length} selected ${setting.fields.length === 1 ? 'field' : 'fields'})`;
    }).join(' · ');
  } else {
    summaryStatus.textContent = 'Nothing is being shared';
    summaryDetail.textContent = 'You have not enabled sharing with any audience.';
  }
}

function savePrivacySettings(nextSettings, message) {
  if (!writePrototypeData(privacySettingKey, nextSettings)) {
    renderPrivacySettings();
    return false;
  }
  privacySettings = nextSettings;
  renderPrivacySettings();
  showToast(message);
  return true;
}

document.querySelectorAll('[data-share-field]').forEach(fieldInput => {
  fieldInput.addEventListener('change', () => {
    const audience = fieldInput.dataset.shareField;
    const current = privacySettings[audience];
    const fields = fieldInput.checked
      ? [...current.fields, fieldInput.value]
      : current.fields.filter(field => field !== fieldInput.value);
    const now = new Date().toISOString();
    const enabled = current.enabled && fields.length > 0;
    const nextSettings = {
      ...privacySettings,
      [audience]:{
        ...current,
        fields,
        enabled,
        updatedAt:now,
        revokedAt:current.enabled && !enabled ? now : current.revokedAt
      }
    };
    const message = current.enabled && !enabled
      ? `Sharing with ${privacyAudienceNames[audience]} was turned off because no fields remain selected.`
      : 'Your sharing scope was updated.';
    savePrivacySettings(nextSettings, message);
  });
});

document.querySelectorAll('[data-share-toggle]').forEach(toggle => {
  toggle.addEventListener('change', () => {
    const audience = toggle.dataset.shareToggle;
    const current = privacySettings[audience];
    if (toggle.checked && current.fields.length === 0) {
      renderPrivacySettings();
      showToast('Choose at least one field before enabling sharing.');
      return;
    }
    const now = new Date().toISOString();
    const nextSettings = {
      ...privacySettings,
      [audience]:{
        ...current,
        enabled:toggle.checked,
        grantedAt:toggle.checked ? now : current.grantedAt,
        revokedAt:toggle.checked ? null : now,
        updatedAt:now
      }
    };
    savePrivacySettings(
      nextSettings,
      toggle.checked
        ? `Sharing consent enabled for ${privacyAudienceNames[audience]}.`
        : `Sharing with ${privacyAudienceNames[audience]} is off.`
    );
  });
});

document.getElementById('revoke-all-sharing').addEventListener('click', () => {
  const now = new Date().toISOString();
  let revoked = false;
  const nextSettings = Object.fromEntries(Object.keys(privacyAudienceFields).map(audience => {
    const current = privacySettings[audience];
    if (current.enabled) revoked = true;
    return [audience, {
      ...current,
      enabled:false,
      revokedAt:current.enabled ? now : current.revokedAt,
      updatedAt:current.enabled ? now : current.updatedAt
    }];
  }));
  if (!revoked) {
    showToast('Sharing is already off for all audiences.');
    return;
  }
  savePrivacySettings(nextSettings, 'Sharing was turned off for all audiences.');
});
renderPrivacySettings();

const defaultApplications = [
  {id:'sample-northstar', company:'Northstar Technologies', role:'Software Engineering Intern', location:'Chicago, IL · Hybrid', status:'Applied', deadline:'2026-11-25'},
  {id:'sample-vertex', company:'Vertex AI Labs', role:'Machine Learning Engineering Intern', location:'Remote', status:'Interview', deadline:'2026-11-27'},
  {id:'sample-gridline', company:'Gridline Systems', role:'Backend Engineering Intern', location:'Chicago, IL', status:'Saved', deadline:'2026-12-02'}
];
const applicationStatuses = ['Saved','Applied','Interview','Offer','Not selected'];
const applicationList = document.getElementById('application-list');
const applicationForm = document.getElementById('application-form');
const applicationModal = document.getElementById('application-modal');
let applications = readPrototypeData('careerhub-applications', defaultApplications, value =>
  Array.isArray(value) && value.every(item =>
    item && typeof item.id === 'string' && typeof item.company === 'string' &&
    typeof item.role === 'string' && applicationStatuses.includes(item.status)
  )
);
let applicationFilter = 'all';

function formatPrototypeDate(dateValue) {
  if (!dateValue) return 'No follow-up date';
  const [year, month, day] = dateValue.split('-').map(Number);
  return new Date(year, month - 1, day).toLocaleDateString(undefined, {month:'short', day:'numeric'});
}

function renderApplications() {
  const activeStatuses = ['Saved','Applied','Interview'];
  const filtered = applications.filter(item => {
    if (applicationFilter === 'all') return true;
    if (applicationFilter === 'active') return activeStatuses.includes(item.status);
    return item.status === applicationFilter;
  });
  document.getElementById('application-active-count').textContent =
    applications.filter(item => activeStatuses.includes(item.status)).length;
  document.getElementById('application-interview-count').textContent =
    applications.filter(item => item.status === 'Interview').length;
  document.getElementById('application-offer-count').textContent =
    applications.filter(item => item.status === 'Offer').length;
  applicationList.replaceChildren();

  if (!filtered.length) {
    const empty = document.createElement('div');
    empty.className = 'application-empty panel';
    empty.textContent = 'No applications in this view yet. Add one to start tracking your search.';
    applicationList.appendChild(empty);
    return;
  }

  filtered.forEach(item => {
    const card = document.createElement('article');
    card.className = 'application-card panel';
    const logo = document.createElement('div');
    logo.className = 'company-logo application-logo';
    logo.textContent = item.company.trim().charAt(0).toUpperCase() || '?';

    const details = document.createElement('div');
    details.className = 'application-details';
    const status = document.createElement('span');
    status.className = 'application-status-tag';
    status.textContent = item.status;
    const role = document.createElement('h3');
    role.textContent = item.role;
    const company = document.createElement('p');
    company.textContent = item.company + (item.location ? ' · ' + item.location : '');
    const followUp = document.createElement('small');
    followUp.textContent = item.deadline ? 'Follow up by ' + formatPrototypeDate(item.deadline) : 'No follow-up date set';
    details.append(status, role, company, followUp);

    const actions = document.createElement('div');
    actions.className = 'application-actions';
    const statusSelect = document.createElement('select');
    statusSelect.className = 'application-status-select';
    statusSelect.setAttribute('aria-label', 'Update status for ' + item.role + ' at ' + item.company);
    applicationStatuses.forEach(value => {
      const option = document.createElement('option');
      option.value = value;
      option.textContent = value;
      option.selected = value === item.status;
      statusSelect.appendChild(option);
    });
    statusSelect.addEventListener('change', () => {
      item.status = statusSelect.value;
      const saved = writePrototypeData('careerhub-applications', applications);
      renderApplications();
      if (saved) showToast('Application status updated.');
    });
    actions.appendChild(statusSelect);
    card.append(logo, details, actions);
    applicationList.appendChild(card);
  });
}

document.querySelectorAll('[data-application-filter]').forEach(button => {
  button.addEventListener('click', () => {
    applicationFilter = button.dataset.applicationFilter;
    document.querySelectorAll('[data-application-filter]').forEach(filterButton => {
      const selected = filterButton === button;
      filterButton.classList.toggle('active', selected);
      filterButton.setAttribute('aria-pressed', String(selected));
    });
    renderApplications();
  });
  button.setAttribute('aria-pressed', String(button.classList.contains('active')));
});

const openApplicationButton = document.getElementById('open-application-modal');
openApplicationButton.addEventListener('click', () => {
  openDialog(applicationModal,document.getElementById('application-company'));
});
document.querySelectorAll('[data-close-application]').forEach(button => {
  button.addEventListener('click', () => closeDialog(applicationModal));
});
applicationForm.addEventListener('submit', event => {
  event.preventDefault();
  const data = new FormData(applicationForm);
  const company = String(data.get('company') || '').trim();
  const role = String(data.get('role') || '').trim();
  if (!company || !role) {
    showToast('Enter both a company and a role.');
    return;
  }
  applications.unshift({
    id:'application-' + Date.now() + '-' + Math.random().toString(36).slice(2, 8),
    company,
    role,
    location:String(data.get('location') || '').trim(),
    status:String(data.get('status') || 'Saved'),
    deadline:String(data.get('deadline') || '')
  });
  const saved = writePrototypeData('careerhub-applications', applications);
  applicationFilter = 'all';
  document.querySelectorAll('[data-application-filter]').forEach(button => {
    const selected = button.dataset.applicationFilter === 'all';
    button.classList.toggle('active', selected);
    button.setAttribute('aria-pressed', String(selected));
  });
  renderApplications();
  applicationForm.reset();
  closeDialog(applicationModal);
  if (saved) showToast('Application added to your tracker.');
});
renderApplications();

const skillPlan = readPrototypeData('careerhub-skill-plan', [], value =>
  Array.isArray(value) && value.every(skill => typeof skill === 'string')
);
function renderSkillPlan() {
  document.querySelectorAll('[data-skill-action]').forEach(button => {
    const skill = button.dataset.skillAction;
    const planned = skillPlan.includes(skill);
    button.textContent = planned ? '✓ In your plan' : '＋ Add to plan';
    button.setAttribute('aria-pressed', String(planned));
  });
  document.getElementById('skill-plan-status').textContent = skillPlan.length
    ? skillPlan.length + ' skill' + (skillPlan.length === 1 ? '' : 's') + ' in your focus plan.'
    : 'Your focus plan is saved in this browser.';
}
document.querySelectorAll('[data-skill-action]').forEach(button => {
  button.addEventListener('click', () => {
    const skill = button.dataset.skillAction;
    const index = skillPlan.indexOf(skill);
    if (index >= 0) skillPlan.splice(index, 1);
    else skillPlan.push(skill);
    const saved = writePrototypeData('careerhub-skill-plan', skillPlan);
    renderSkillPlan();
    if (saved) showToast(index >= 0 ? 'Skill removed from your focus plan.' : 'Skill added to your focus plan.');
  });
});
renderSkillPlan();

const resourceChecks = readPrototypeData('careerhub-resource-checks', [], value =>
  Array.isArray(value) && value.every(id => typeof id === 'string')
);
document.querySelectorAll('[data-resource-check]').forEach(checkbox => {
  checkbox.checked = resourceChecks.includes(checkbox.dataset.resourceCheck);
  checkbox.addEventListener('change', () => {
    const checked = [...document.querySelectorAll('[data-resource-check]:checked')]
      .map(input => input.dataset.resourceCheck);
    const saved = writePrototypeData('careerhub-resource-checks', checked);
    if (saved) showToast('Checklist progress saved.');
  });
});

const appointmentForm = document.getElementById('appointment-form');
const appointmentDate = document.getElementById('appointment-date');
const appointmentConfirmation = document.getElementById('appointment-confirmation');
const today = new Date();
today.setMinutes(today.getMinutes() - today.getTimezoneOffset());
appointmentDate.min = today.toISOString().slice(0, 10);
let appointmentRequest = readPrototypeData('careerhub-appointment-request', null, value =>
  value === null || (value && typeof value.topic === 'string' && typeof value.date === 'string' && typeof value.time === 'string')
);
function renderAppointmentRequest() {
  appointmentConfirmation.replaceChildren();
  if (!appointmentRequest) return;
  const heading = document.createElement('strong');
  heading.textContent = 'Request saved in this prototype';
  const description = document.createElement('p');
  description.textContent = appointmentRequest.topic + ' · ' + formatPrototypeDate(appointmentRequest.date) +
    ' at ' + appointmentRequest.time + '. Contact Career Services to confirm a real appointment.';
  appointmentConfirmation.append(heading, description);
}
appointmentForm.addEventListener('submit', event => {
  event.preventDefault();
  if (!appointmentForm.reportValidity()) return;
  const data = new FormData(appointmentForm);
  appointmentRequest = {
    topic:String(data.get('topic')),
    date:String(data.get('date')),
    time:String(data.get('time'))
  };
  if (writePrototypeData('careerhub-appointment-request', appointmentRequest)) {
    renderAppointmentRequest();
    showToast('Appointment request saved in this prototype.');
  }
});
renderAppointmentRequest();

const mentorModal = document.getElementById('mentor-modal');
const mentorMessage = document.getElementById('mentor-message');
document.querySelectorAll('.mentor-draft').forEach(button => {
  button.addEventListener('click', () => {
    const name = button.dataset.mentorName;
    const focus = button.dataset.mentorFocus;
    mentorMessage.value = 'Hi ' + name + ',\n\nI am a Computer Science student at Illinois Tech exploring ' +
      focus + '. I came across your profile and would love to hear about your experience and any advice ' +
      'you might have for someone starting out. Would you be open to a brief conversation?\n\nThank you!';
    openDialog(mentorModal,mentorMessage);
  });
});
document.querySelectorAll('[data-close-mentor]').forEach(button => {
  button.addEventListener('click', () => closeDialog(mentorModal));
});
document.getElementById('select-mentor-message').addEventListener('click', () => {
  mentorMessage.select();
  showToast('Message selected. Press Ctrl+C or Command+C to copy it.');
});
