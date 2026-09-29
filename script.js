const answers = {
  '1-1': {check:v=>norm(v)==='101111', solve:1},
  '1-2': {check:v=>norm(v)==='56', solve:1},
  '1-3': {check:v=>norm(v)==='764', solve:1},
  '2-1': {check:v=>norm(v)==='exito', solve:1},
  '2-2': {check: v => v.trim()==='134217728', solve: 1},
  '2-3': {check: v => v.trim()==='256', solve: 1},
  '3-1': {check:v=>{const nums=v.match(/\d+/g); return nums && nums.length>=2 && nums.includes('87') && nums.includes('73')  && nums.includes('78');}, solve:1},
  '3-2': {check:v=>norm(v)==='win', solve:1},
  '3-3': {check:v=>norm(v)==='65512', solve:1},
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
function onSolve(key) {

  // NIVEL 1 → NIVEL 2
  if (
    key === '1-3' &&
    solved['1-1'] &&
    solved['1-2'] &&
    solved['1-3']
  ) {
    setTimeout(function() {
      show('l2');
    }, 700);
  }


  // NIVEL 2 → NIVEL 3
  if (
    key === '2-3' &&
    solved['2-1'] &&
    solved['2-2'] &&
    solved['2-3']
  ) {
    setTimeout(function() {
      show('l3');
    }, 700);
  }


  // CANDADO 1 → CANDADO 2
  if (key === '3-1') {
    document.getElementById('in-3-2').disabled = false;
    document.getElementById('btn-3-2').disabled = false;

    document.querySelector('[data-card="3-2"]').style.opacity = '1';
    document.getElementById('lock-3-2').style.display = 'none';
  }


  // CANDADO 2 → CANDADO 3
  if (key === '3-2') {
    document.getElementById('in-3-3').disabled = false;
    document.getElementById('btn-3-3').disabled = false;

    document.querySelector('[data-card="3-3"]').style.opacity = '1';
    document.getElementById('lock-3-3').style.display = 'none';
  }


  // CANDADO 3 → FINAL
  if (key === '3-3') {

  clearInterval(timerId);

  const timer = document.getElementById('timerBox');
  const finalTime = document.getElementById('finalTime');

  if (finalTime && timer) {
    finalTime.textContent = timer.textContent;
  }

  // Ocultar todas las pantallas
  document.querySelectorAll('.screen').forEach(function(screen) {
    screen.classList.remove('active');
  });

  // Mostrar pantalla final
  const finalScreen = document.getElementById('screen-end');

  if (finalScreen) {
    finalScreen.classList.add('active');
    document.getElementById('progressFill').style.width = '100%';

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  } else {
    alert('ERROR: No se encuentra la sección screen-end');
  }
}
