const answers = {
  '1-1': {check:v=>norm(v)==='11100', solve:1},
  '1-2': {check:v=>norm(v)==='13', solve:1},
  '1-3': {check:v=>norm(v)==='937', solve:1},
  '2-1': {check:v=>norm(v)==='sos', solve:1},
  '2-2': {check:v=>{const n=parseFloat(v.replace(',','.')); return !isNaN(n) && Math.abs(n-214748364.8)<1500;}, solve:1},
  '2-3': {check:v=>{const n=parseFloat(v.replace(',','.')); return !isNaN(n) && Math.abs(n-14.375)<0.15;}, solve:1},
  '3-1': {check:v=>{const nums=v.match(/\d+/g); return nums && nums.length>=2 && nums.includes('79') && nums.includes('75');}, solve:1},
  '3-2': {check:v=>norm(v)==='ok', solve:1},
  '3-3': {check:v=>norm(v)==='131056', solve:1},
};
function norm(v){return (v||'').trim().toLowerCase().replace(/^0+(?=\d)/,'');}

const order = ['intro','l1','l2','l3','end'];
let solved = {};
let timeLeft = 45*60;
let timerRunning = false;
let timerId = null;

function show(id){
  document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active'));
  document.getElementById('screen-'+id).classList.add('active');
  updateProgress(id);
  window.scrollTo({top:0,behavior:'smooth'});
}
function updateProgress(id){
  const idx = order.indexOf(id);
  document.getElementById('progressFill').style.width = (idx/(order.length-1)*100)+'%';
}
function startMission(){
  show('l1');
  if(!timerRunning){
    timerRunning = true;
    timerId = setInterval(tick,1000);
  }
}
function tick(){
  timeLeft--;
  if(timeLeft<=0){timeLeft=0; clearInterval(timerId);}
  renderTimer();
}
function renderTimer(){
  const m = Math.floor(timeLeft/60), s = timeLeft%60;
  const box = document.getElementById('timerBox');
  box.textContent = String(m).padStart(2,'0')+':'+String(s).padStart(2,'0');
  box.classList.toggle('calm', timeLeft>5*60);
}
renderTimer();

function check(key){
  const input = document.getElementById('in-'+key);
  const fb = document.getElementById('fb-'+key);
  const val = input.value;
  if(!val.trim()){ fb.textContent='Escribe una respuesta antes de verificar.'; fb.className='feedback err'; return; }
  if(answers[key].check(val)){
    fb.textContent='✔ Correcto. Bloqueo superado.';
    fb.className='feedback ok';
    solved[key]=true;
    document.querySelector('[data-card="'+key+'"]').classList.add('solved');
    input.disabled = true;
    document.querySelector('[data-card="'+key+'"] button').disabled = true;
    onSolve(key);
  } else {
    fb.textContent='✘ Valor incorrecto. Revisa tu cálculo e inténtalo de nuevo.';
    fb.className='feedback err';
  }
}
function onSolve(key){
  if(key==='1-3' && solved['1-1'] && solved['1-2'] && solved['1-3']) setTimeout(()=>show('l2'),700);
  if(key==='2-3' && solved['2-1'] && solved['2-2'] && solved['2-3']) setTimeout(()=>show('l3'),700);
  if(key==='3-1'){
    document.getElementById('in-3-2').disabled=false;
    document.getElementById('btn-3-2').disabled=false;
    document.querySelector('[data-card="3-2"]').style.opacity=1;
    document.getElementById('lock-3-2').style.display='none';
  }
  if(key==='3-2'){
    document.getElementById('in-3-3').disabled=false;
    document.getElementById('btn-3-3').disabled=false;
    document.querySelector('[data-card="3-3"]').style.opacity=1;
    document.getElementById('lock-3-3').style.display='none';
  }
  if(key==='3-3'){
    clearInterval(timerId);
    document.getElementById('finalTime').textContent = document.getElementById('timerBox').textContent;
    setTimeout(()=>show('end'),700);
  }
}