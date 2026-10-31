const pages = [...document.querySelectorAll('.page')];
const navItems = [...document.querySelectorAll('.nav-item')];
const titles = {overview:'Overview', pathway:'My pathway', events:'Events', fair:'Career fair guide', handshake:'Handshake'};
function showPage(name){
  pages.forEach(p=>p.classList.toggle('active-page',p.id===`page-${name}`));
  navItems.forEach(n=>n.classList.toggle('active',n.dataset.page===name));
  document.getElementById('crumb-current').textContent=titles[name]||'Overview';
  window.scrollTo({top:0,behavior:'smooth'});
}
navItems.forEach(n=>n.addEventListener('click',()=>showPage(n.dataset.page)));
document.querySelectorAll('[data-goto]').forEach(b=>b.addEventListener('click',()=>showPage(b.dataset.goto)));
document.getElementById('open-fair').addEventListener('click',()=>showPage('fair'));
document.getElementById('fair-card-button').addEventListener('click',()=>showPage('fair'));
const modal=document.getElementById('survey-modal');
function openModal(){modal.classList.add('open')}
function closeModal(){modal.classList.remove('open')}
document.getElementById('start-survey').addEventListener('click',openModal);
document.getElementById('edit-profile').addEventListener('click',openModal);
document.getElementById('pathway-personalize').addEventListener('click',openModal);
document.getElementById('edit-goals').addEventListener('click',openModal);
document.getElementById('view-profile').addEventListener('click',openModal);
document.querySelectorAll('[data-close]').forEach(b=>b.addEventListener('click',closeModal));
modal.addEventListener('click',e=>{if(e.target===modal)closeModal()});
document.querySelectorAll('.choice').forEach(c=>c.addEventListener('click',()=>{document.querySelectorAll('.choice').forEach(x=>x.classList.remove('selected'));c.classList.add('selected')}));
const toast=document.getElementById('toast');
function showToast(message='Saved — your prototype preferences have been updated.'){toast.textContent=message;toast.classList.add('show');setTimeout(()=>toast.classList.remove('show'),2600)}
document.getElementById('save-survey').addEventListener('click',()=>{closeModal();showToast();});
document.getElementById('login-button').addEventListener('click',()=>showToast('Demo account: jjohn@hawk.illinoistech.edu'));
document.getElementById('handshake-link').addEventListener('click',()=>showToast('External Handshake link would open here.'));
document.getElementById('hs-open-2').addEventListener('click',()=>showToast('External Handshake link would open here.'));
document.getElementById('all-notifications').addEventListener('click',()=>showToast('Showing the latest sample notifications.'));
document.getElementById('more-questions').addEventListener('click',()=>showToast('Try asking about intern projects, mentorship, and team technologies.'));
document.querySelectorAll('.apply-button').forEach(b=>b.addEventListener('click',()=>showToast('Sample job details would open here.')));
document.querySelectorAll('.event-card-action .outline-button').forEach(b=>b.addEventListener('click',()=>{b.textContent=b.textContent.includes('Saved')?'Save event ☆':'Saved ✓';showToast('Event saved to your calendar.')}));

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
  if(day===27){cell.insertAdjacentHTML('beforeend','<span class="day-event green-event">Career coaching</span>');}
  if(day===29){cell.insertAdjacentHTML('beforeend','<span class="day-event">Resume workshop</span>');}
  if(day===31){cell.insertAdjacentHTML('beforeend','<span class="day-event orange-event">Portfolio check-in</span>');}
  if(day===3){cell.insertAdjacentHTML('beforeend','<span class="day-event">Resume Lab</span>');}
  if(day===5){cell.insertAdjacentHTML('beforeend','<span class="day-event orange-event" data-fair-event>Fall Career Fair</span>');}
  if(day===6){cell.insertAdjacentHTML('beforeend','<span class="day-event green-event">Cloud & Software</span>');}
  if(day===10){cell.insertAdjacentHTML('beforeend','<span class="day-event">Alumni Connections</span>');}
  if(day===12){cell.insertAdjacentHTML('beforeend','<span class="day-event">Interview Practice</span>');}
  if(day===17){cell.insertAdjacentHTML('beforeend','<span class="day-event green-event">Career Drop-in</span>');}
  days.push(cell);
}
days.forEach(d=>calendar.appendChild(d));
calendar.addEventListener('click',e=>{if(e.target.closest('[data-fair-event]'))showPage('fair')});
document.querySelectorAll('.check-item input').forEach(c=>c.addEventListener('change',()=>showToast('Checklist updated.')));
