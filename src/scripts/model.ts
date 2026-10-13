import * as THREE from 'three';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
export function createModel(host:HTMLElement):()=>void {
  let renderer:THREE.WebGLRenderer;
  try{renderer=new THREE.WebGLRenderer({antialias:true,alpha:true,powerPreference:'low-power'});}catch{return ()=>{};}
  renderer.setPixelRatio(Math.min(window.devicePixelRatio,1.5));renderer.setClearColor(0x1a1d1c,0);
  renderer.domElement.setAttribute('aria-label','Interactive architectural house model, changing from blueprint to built form');renderer.domElement.setAttribute('role','img');host.prepend(renderer.domElement);
  const fallback=host.querySelector<HTMLElement>('.model-fallback');if(fallback)fallback.style.visibility='hidden';
  const scene=new THREE.Scene();const camera=new THREE.PerspectiveCamera(32,1,.1,100);camera.position.set(10,7.2,11);camera.lookAt(0,.6,0);
  const ambient=new THREE.AmbientLight(0xe6e3da,2);scene.add(ambient);const sun=new THREE.DirectionalLight(0xffe4bf,3);sun.position.set(3,8,5);scene.add(sun);const fill=new THREE.DirectionalLight(0xa2b5b0,1.5);fill.position.set(-4,3,-5);scene.add(fill);
  const house=new THREE.Group();scene.add(house);house.rotation.y=-.25;
  const solids:THREE.MeshStandardMaterial[]=[];const geometries:THREE.BufferGeometry[]=[];const materials:THREE.Material[]=[];
  function box(w:number,h:number,d:number,x:number,y:number,z:number,color:number){
    const geometry=new THREE.BoxGeometry(w,h,d);geometries.push(geometry);
    const material=new THREE.MeshStandardMaterial({color,roughness:.83,transparent:true,opacity:.6});materials.push(material);solids.push(material);
    const mesh=new THREE.Mesh(geometry,material);mesh.position.set(x,y,z);house.add(mesh);
    const edges=new THREE.EdgesGeometry(geometry);geometries.push(edges);const lineMaterial=new THREE.LineBasicMaterial({color:0xbba88a,transparent:true,opacity:.85});materials.push(lineMaterial);const lines=new THREE.LineSegments(edges,lineMaterial);lines.position.copy(mesh.position);house.add(lines);return mesh;
  }
  box(7,.16,5,0,-.3,0,0x65635b);box(5.5,.12,3.7,0,-.12,0,0xc2b49a);
  box(5.2,2.1,.12,0,1,-1.7,0xd1cabb);box(.12,2.1,3.4,-2.55,1,0,0xc4bca9);box(1.55,2.1,.12,1.85,1,1.65,0xc0ab87);
  box(5.7,.14,3.9,0,2.15,0,0xe0d7c5);box(2.2,.14,2.4,1.5,2.7,-.4,0xd1c7b5);box(.12,.55,2,2.5,2.42,-.4,0xc1b6a1);box(2,.55,.12,1.5,2.42,-1.4,0xc1b6a1);
  for(const x of [-2.4,-1.3,-.2,.9])box(.06,2,.06,x,1,1.63,0x635b50);
  const glass=box(3.4,1.8,.04,-.75,.95,1.62,0x536b68);glass.material=new THREE.MeshStandardMaterial({color:0x617b76,transparent:true,opacity:.27,roughness:.2});materials.push(glass.material as THREE.Material);
  for(let i=0;i<8;i++)box(.055,1.9,.09,1.2+i*.16,1,1.75,0x987551);
  box(1.7,.12,.5,-1.2,-.2,2.1,0x958e7a);box(1.9,.12,.5,-1.2,-.32,2.45,0x958e7a);
  const grid=new THREE.GridHelper(12,24,0x6c6f61,0x3e443b);grid.position.y=-.45;scene.add(grid);
  let targetX=0,targetY=0,visible=true,frame=0;
  const state={progress:.5};const range=host.querySelector<HTMLInputElement>('#model-progress')!;
  function render(){solids.forEach(m=>m.opacity=.03+state.progress*.94);(glass.material as THREE.MeshStandardMaterial).opacity=.05+state.progress*.25;house.rotation.y+=(-.25+targetX-house.rotation.y)*.06;house.rotation.x+=(targetY-house.rotation.x)*.06;renderer.render(scene,camera);}
  const onMove=(event:PointerEvent)=>{const r=host.getBoundingClientRect();targetX=((event.clientX-r.left)/r.width-.5)*.45;targetY=((event.clientY-r.top)/r.height-.5)*.1;};
  const onLeave=()=>{targetX=0;targetY=0;};
  const onRange=()=>{state.progress=Number(range.value)/100;};
  const onReset=()=>{targetX=0;targetY=0;state.progress=.5;range.value='50';};
  host.addEventListener('pointermove',onMove);host.addEventListener('pointerleave',onLeave);range.addEventListener('input',onRange);host.querySelector('.model-reset')?.addEventListener('click',onReset);
  const resize=new ResizeObserver(()=>{const w=host.clientWidth,h=host.clientHeight;renderer.setSize(w,h);camera.aspect=w/h;camera.updateProjectionMatrix();render();});resize.observe(host);
  const scroll=ScrollTrigger.create({trigger:host,start:'top bottom',end:'bottom top',onUpdate:self=>{if(document.activeElement!==range){state.progress=.1+self.progress*.9;range.value=String(Math.round(state.progress*100));}}});
  const observer=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting});observer.observe(host);
  const onVisibility=()=>{visible=!document.hidden;};document.addEventListener('visibilitychange',onVisibility);
  // Cap at 30 fps; pause rendering outside the viewport or in background tabs.
  let last=0;function animate(time:number){frame=requestAnimationFrame(animate);if(visible&&!document.hidden&&time-last>33){last=time;render();}}frame=requestAnimationFrame(animate);
  const onLost=(event:Event)=>{event.preventDefault();cancelAnimationFrame(frame);renderer.domElement.style.display='none';if(fallback)fallback.style.visibility='visible';};renderer.domElement.addEventListener('webglcontextlost',onLost);
  return ()=>{cancelAnimationFrame(frame);scroll.kill();resize.disconnect();observer.disconnect();host.removeEventListener('pointermove',onMove);host.removeEventListener('pointerleave',onLeave);range.removeEventListener('input',onRange);host.querySelector('.model-reset')?.removeEventListener('click',onReset);document.removeEventListener('visibilitychange',onVisibility);renderer.domElement.removeEventListener('webglcontextlost',onLost);gsap.killTweensOf(state);geometries.forEach(g=>g.dispose());materials.forEach(m=>m.dispose());grid.geometry.dispose();(grid.material as THREE.Material).dispose();renderer.dispose();renderer.domElement.remove();if(fallback)fallback.style.visibility='visible';};
}
