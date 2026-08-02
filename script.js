let stepCount = 0;
let isTracking = false;
let lastAcceleration = { x: 0, y: 0, z: 0 };
const threshold = 11;

const userCard = document.getElementById('userCard');
const trackerCard = document.getElementById('trackerCard');
const userForm = document.getElementById('userForm');
const welcomeMsg = document.getElementById('welcomeMsg');
const editUserBtn = document.getElementById('editUserBtn');

const stepDisplay = document.getElementById('stepCount');
const caloriesDisplay = document.getElementById('calories');
const distanceDisplay = document.getElementById('distance');
const startBtn = document.getElementById('startBtn');
const resetBtn = document.getElementById('resetBtn');
const endBtn = document.getElementById('endBtn');

// حفظ البيانات والانتقال
userForm.addEventListener('submit', (e) => {
e.preventDefault();
const name = document.getElementById('userName').value;
const isResident = document.getElementById('userResident').value;

welcomeMsg.textContent = `مرحباً بك يا ${name} 👋`;
userCard.classList.add('hidden');
trackerCard.classList.remove('hidden');
});

// زر تعديل البيانات
editUserBtn.addEventListener('click', () => {
trackerCard.classList.add('hidden');
userCard.classList.remove('hidden');
});

// زر بدء / إيقاف التتبع
startBtn.addEventListener('click', async () => {
if (!isTracking) {
if (typeof DeviceMotionEvent !== 'undefined' && typeof DeviceMotionEvent.requestPermission === 'function') {
try {
const response = await DeviceMotionEvent.requestPermission();
if (response === 'granted') {
startTracking();
} else {
alert('تم رفض الوصول لحساسات الحركة');
}
} catch (error) {
console.error(error);
}
} else {
startTracking();
}
} else {
stopTracking();
}
});

function startTracking() {
isTracking = true;
startBtn.innerHTML = '<i class="fa-solid fa-pause"></i> إيقاف مؤقت';
startBtn.style.backgroundColor = '#f39c12';
window.addEventListener('devicemotion', handleMotion);
}

function stopTracking() {
isTracking = false;
startBtn.innerHTML = '<i class="fa-solid fa-play"></i> بدء التتبع';
startBtn.style.backgroundColor = '#2ecc71';
window.removeEventListener('devicemotion', handleMotion);
}

// حساب حركة الخطوات
function handleMotion(event) {
const acc = event.accelerationIncludingGravity;
if (!acc) return;

const deltaX = Math.abs(acc.x - lastAcceleration.x);
const deltaY = Math.abs(acc.y - lastAcceleration.y);
const deltaZ = Math.abs(acc.z - lastAcceleration.z);

if (deltaX + deltaY + deltaZ > threshold) {
stepCount++;
updateDisplay();
}

lastAcceleration = { x: acc.x, y: acc.y, z: acc.z };
}

function updateDisplay() {
stepDisplay.textContent = stepCount;
caloriesDisplay.textContent = Math.round(stepCount * 0.04);
distanceDisplay.textContent = (stepCount * 0.0008).toFixed(2);
}

// زر إعادة الضبط
resetBtn.addEventListener('click', () => {
stepCount = 0;
updateDisplay();
});

// زر إنهاء الرحلة
endBtn.addEventListener('click', () => {
stopTracking();
const calories = Math.round(stepCount * 0.04);
const distance = (stepCount * 0.0008).toFixed(2);
alert(`🎉 أحسنت! تم إنهاء الرحلة بنجاح.\n\n📊 الملخص:\n• الخطوات: ${stepCount}\n• السعرات: ${calories} سعرة\n• المسافة: ${distance} كم`);

stepCount = 0;
updateDisplay();
});

