import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
gsap.registerPlugin(ScrollTrigger);
let dispose: (()=>void) | undefined;

function init() {
  dispose?.();
  const cleanups: (()=>void)[]=[];
  const controller=new AbortController();
  const {signal}=controller;
  const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const listen=(el:EventTarget,type:string,handler:EventListener)=>el.addEventListener(type,handler,{signal});
  const header=document.querySelector<HTMLElement>('.site-header');
  const updateHeader=()=>header?.classList.toggle('is-scrolled',window.scrollY>24);
  window.addEventListener('scroll',updateHeader,{passive:true,signal});
  updateHeader();
  const menu=document.querySelector<HTMLElement>('#mobile-menu');
  const toggle=document.querySelector<HTMLButtonElement>('.menu-toggle');
  const setMenu=(open:boolean)=>{
    toggle?.setAttribute('aria-expanded',String(open));toggle?.setAttribute('aria-label',open?'Close navigation':'Open navigation');
    menu?.classList.toggle('open',open);if(menu)menu.inert=!open;
    document.body.classList.toggle('menu-open',open);
    document.querySelector<HTMLElement>('main')?.setAttribute('inert', '');
    if(!open)document.querySelector<HTMLElement>('main')?.removeAttribute('inert');
    if(open)setTimeout(()=>{if(!signal.aborted)menu?.querySelector<HTMLAnchorElement>('a')?.focus();},100);
  };
  if(toggle)listen(toggle,'click',()=>setMenu(toggle.getAttribute('aria-expanded')!=='true'));
  listen(document,'keydown',((e:KeyboardEvent)=>{
    if(toggle?.getAttribute('aria-expanded')!=='true')return;
    if(e.key==='Escape'){setMenu(false);toggle.focus();}
    if(e.key==='Tab'){
      const focusables=[toggle,...Array.from(menu?.querySelectorAll<HTMLElement>('a')||[])].filter(Boolean) as HTMLElement[];
      const first=focusables[0],last=focusables.at(-1);
      if(e.shiftKey&&document.activeElement===first){e.preventDefault();last?.focus();}
      else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first?.focus();}
    }
  }) as EventListener);
  listen(window,'resize',()=>{if(window.innerWidth>800&&toggle?.getAttribute('aria-expanded')==='true')setMenu(false)});
  menu?.querySelectorAll('a').forEach(a=>listen(a,'click',()=>setMenu(false)));

  document.querySelectorAll<HTMLElement>('.comparison').forEach(el=>{
    const range=el.querySelector<HTMLInputElement>('input')!;
    listen(range,'input',()=>{el.style.setProperty('--position',range.value+'%');range.setAttribute('aria-valuetext',`${range.value}% before, ${100-Number(range.value)}% after`);});
  });
  const filters=document.querySelectorAll<HTMLButtonElement>('[data-filter]');
  filters.forEach(button=>listen(button,'click',()=>{
    filters.forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
    let count=0;
    document.querySelectorAll<HTMLElement>('.project-card').forEach(card=>{const visible=button.dataset.filter==='all'||button.dataset.filter===card.dataset.category;card.hidden=!visible;if(visible){count++;if(!reduced)gsap.fromTo(card,{opacity:.4,y:15},{opacity:1,y:0,duration:.4,clearProps:'all'});}});
    const status=document.querySelector('.filter-status');if(status)status.textContent=`Showing ${count} ${button.dataset.filter==='all'?'':button.dataset.filter+' '}projects.`;
    ScrollTrigger.refresh();
  }));
  document.querySelectorAll<HTMLAnchorElement>('[data-service-image]').forEach(link=>{
    const update=()=>{const img=document.querySelector<HTMLImageElement>('.service-preview img');if(img){img.src=link.dataset.serviceImage!;img.removeAttribute('srcset');img.alt=`${link.querySelector('h3')?.textContent} — ${link.getAttribute('href')?.includes('custom-homes')?'concept architectural photograph':'Sigura portfolio photograph'}`;}};
    listen(link,'mouseenter',update);listen(link,'focus',update);
  });

  const form=document.querySelector<HTMLFormElement>('#estimate-form');
  if(form){
    const fields=Array.from(form.querySelectorAll<HTMLInputElement|HTMLSelectElement|HTMLTextAreaElement>('[required]'));
    const validate=(field:typeof fields[number])=>{
      const valid=field.checkValidity();field.setAttribute('aria-invalid',String(!valid));
      const error=document.getElementById(`${field.id}-error`);
      if(error)error.textContent=valid?'':field.validity.valueMissing?'Please complete this field.':field.type==='email'?'Enter a valid email address.':field.id==='phone'?'Enter a phone number with 7–25 characters.':field.id==='description'?'Please describe your project in at least 20 characters.':'Please provide at least two characters.';
      return valid;
    };
    fields.forEach(field=>listen(field,'input',()=>{if(field.getAttribute('aria-invalid')==='true')validate(field);document.getElementById('email-review')!.hidden=true;}));
    listen(form,'submit',(event)=>{
      event.preventDefault();const valid=fields.map(validate).every(Boolean);
      const status=document.getElementById('form-status')!;
      if(!valid){status.textContent='Please check the highlighted fields. Nothing has been sent.';fields.find(f=>!f.checkValidity())?.focus();return;}
      const data=new FormData(form);
      const body=['Project inquiry for Sigura Construction','',...['name','email','phone','location','service','budget','timeline','description'].map(key=>`${({name:'Name',email:'Email',phone:'Phone',location:'Project location',service:'Service',budget:'Budget',timeline:'Timeline',description:'Project description'} as Record<string,string>)[key]}: ${data.get(key)||'To discuss'}`)].join('\n');
      document.getElementById('email-text')!.textContent=body;
      document.querySelector<HTMLAnchorElement>('#email-draft')!.href=`mailto:info@siguraconstruction.com?subject=${encodeURIComponent('Project inquiry — '+data.get('name'))}&body=${encodeURIComponent(body)}`;
      document.getElementById('email-review')!.hidden=false;
      status.textContent='Your draft is ready below. Nothing has been sent.';
      document.getElementById('email-review')!.scrollIntoView({behavior:reduced?'instant':'smooth',block:'nearest'});
    });
    const copy=document.getElementById('copy-inquiry');if(copy)listen(copy,'click',async()=>{try{await navigator.clipboard.writeText(document.getElementById('email-text')!.textContent!);copy.textContent='Inquiry copied';}catch{document.getElementById('form-status')!.textContent='Copy was unavailable. Select and copy the inquiry text below.'}});
  }

  let lenis:Lenis|undefined;
  const ticker=(time:number)=>lenis?.raf(time*1000);
  const context=gsap.context(()=>{
    if(reduced)return;
    lenis=new Lenis({duration:.85,smoothWheel:true,anchors:true});
    lenis.on('scroll',ScrollTrigger.update);gsap.ticker.add(ticker);
    const intro=document.querySelector<HTMLElement>('.intro');
    let first=false;try{first=!!intro&&!sessionStorage.getItem('sigura-entered');sessionStorage.setItem('sigura-entered','true')}catch{first=false}
    if(first&&intro){
      intro.classList.add('playing');
      gsap.fromTo('.intro path',{strokeDasharray:1000,strokeDashoffset:1000},{strokeDashoffset:0,duration:1.1,ease:'power2.out'});
      gsap.fromTo('.intro>span',{opacity:0,y:15},{opacity:1,y:0,duration:.5,delay:.3});
      gsap.to(intro,{yPercent:-100,duration:.65,delay:1.1,ease:'power3.inOut',onComplete:()=>intro.remove()});
    } else intro?.remove();
    const delay=first?1.2:0;
    if(document.querySelector('[data-title] .title-line'))gsap.fromTo('[data-title] .title-line',{y:40,opacity:.15,clipPath:'inset(0 0 80% 0)'},{y:0,opacity:1,clipPath:'inset(0 0 0% 0)',stagger:.12,duration:1,ease:'power3.out',delay,clearProps:'all'});
    if(document.querySelector('.hero-photo'))gsap.fromTo('.hero-photo',{scale:1.07},{scale:1,duration:2.2,delay,ease:'power2.out'});
    if(document.querySelector('.hero-lower'))gsap.fromTo('.hero-lower',{y:15,opacity:.4},{y:0,opacity:1,duration:.8,delay:delay+.25,clearProps:'all'});
    document.querySelectorAll<HTMLElement>('[data-reveal="mask"]').forEach(el=>gsap.fromTo(el,{clipPath:'inset(12% 0 0 0)'},{clipPath:'inset(0% 0 0 0)',duration:1.2,ease:'power3.out',scrollTrigger:{trigger:el,start:'top 95%',once:true}}));
    document.querySelectorAll<HTMLElement>('.section-heading h2,.intro-heading h2,.vision h2,.closing h2').forEach(el=>gsap.fromTo(el,{y:25},{y:0,duration:1,ease:'power3.out',scrollTrigger:{trigger:el,start:'top 94%',once:true}}));
    if(document.querySelector('.hero-photo'))gsap.to('.hero-photo',{yPercent:9,ease:'none',scrollTrigger:{trigger:'.home-hero',start:'top top',end:'bottom top',scrub:true}});
    if(document.querySelector('.history-stat'))gsap.fromTo('.history-stat',{borderColor:'transparent'},{borderColor:'#d7d3c9',duration:1.5,scrollTrigger:{trigger:'.history-stat',start:'top 90%',once:true}});
    document.querySelectorAll('.process-list>a,.process-timeline article').forEach(el=>gsap.fromTo(el,{borderTopColor:'transparent',x:10},{borderTopColor:'#d7d3c9',x:0,duration:.8,scrollTrigger:{trigger:el,start:'top 92%',once:true}}));
    if(window.matchMedia('(pointer:fine)').matches)document.querySelectorAll<HTMLElement>('.button').forEach(el=>{
      listen(el,'mousemove',((event:MouseEvent)=>{const rect=el.getBoundingClientRect();gsap.to(el,{x:(event.clientX-rect.left-rect.width/2)*.05,y:(event.clientY-rect.top-rect.height/2)*.08,duration:.3});}) as EventListener);
      listen(el,'mouseleave',()=>gsap.to(el,{x:0,y:0,duration:.4}));
    });
  });
  const model=document.querySelector<HTMLElement>('[data-model]');
  if(model){
    const range=model.querySelector<HTMLInputElement>('#model-progress')!;
    listen(range,'input',()=>model.style.setProperty('--build',String(Number(range.value)/150)));
    const reset=model.querySelector('.model-reset');if(reset)listen(reset,'click',()=>{range.value='50';model.style.setProperty('--build','.33')});
    if(reduced||window.innerWidth<=540){const label=model.querySelector('.model-top span:last-child');if(label)label.textContent='LIGHTWEIGHT STUDY';}
    // Lazy import keeps Three.js out of the critical render path.
    const observer=new IntersectionObserver(entries=>{if(entries.some(e=>e.isIntersecting)){observer.disconnect();if(!reduced&&window.innerWidth>540)import('./model').then(({createModel})=>{if(!signal.aborted)cleanups.push(createModel(model));}).catch(()=>{/* The SVG fallback remains visible. */});}}, {rootMargin:'300px'});
    observer.observe(model);cleanups.push(()=>observer.disconnect());
  }
  const refresh=()=>ScrollTrigger.refresh();document.querySelectorAll('img').forEach(img=>{if(!img.complete)listen(img,'load',refresh)});
  document.fonts.ready.then(()=>{if(!signal.aborted)refresh()});
  dispose=()=>{controller.abort();context.revert();gsap.killTweensOf(document.querySelectorAll('.button,.project-card'));gsap.ticker.remove(ticker);lenis?.destroy();cleanups.forEach(fn=>fn());document.body.classList.remove('menu-open');};
}
document.addEventListener('astro:page-load',init);
document.addEventListener('astro:before-swap',()=>dispose?.());
