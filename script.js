let stepCount = 0;
let isTracking = false;
let lastAcceleration = { x: 0, y: 0, z: 0 };
const threshold = 11; // حد حساسية الحركة لاحتساب الخطوة

const stepDisplay = document.getElementById('stepCount');
const caloriesDisplay = document.getElementById('calories');
const distanceDisplay = document.getElementById('distance');
const startBtn = document.getElementById('startBtn');
const resetBtn = document.getElementById('resetBtn');
const permissionNotice = document.getElementById('permissionNotice');

// زر بدء/إيقاف التتبع
startBtn.addEventListener('click', async () => {
if (!isTracking) {
// طلب الأذن لـ iOS Devices (آيفون)
if (typeof DeviceMotionEvent !== 'undefined' && typeof DeviceMotionEvent.requestPermission === 'function') {
try {
const response = await DeviceMotionEvent.requestPermission();
if (response === 'granted') {
startTracking();
} else {
alert("تم رفض الوصول لحساسات الحركة.");
}
} catch (error) {
console.error(error);
}
} else {
// للأجهزة الأخرى (أندرويد)
startTracking();
}
} else {
stopTracking();
}
});

function startTracking() {
isTracking = true;
startBtn.innerHTML = '<i class="fa-solid fa-pause"></i> إيقاف مؤقت';
startBtn.style.backgroundColor = '#e74c3c';
window.addEventListener('devicemotion', handleMotion);
}

function stopTracking() {
isTracking = false;
startBtn.innerHTML = '<i class="fa-solid fa-play"></i> استئناف';
startBtn.style.backgroundColor = '#2ecc71';
window.removeEventListener('devicemotion', handleMotion);
}

// معادلة التقاط الخطوة بناء على التسارع
function handleMotion(event) {
const acc = event.accelerationIncludingGravity;
if (!acc) return;

let deltaX = Math.abs(acc.x - lastAcceleration.x);
let deltaY = Math.abs(acc.y - lastAcceleration.y);
let deltaZ = Math.abs(acc.z - lastAcceleration.z);

// إذا تجاوزت الحركة الحد المطلوب يعتبر الخطوة تم تسجيلها
if ((deltaX + deltaY + deltaZ) > threshold) {
stepCount++;
updateUI();
}

lastAcceleration = { x: acc.x, y: acc.y, z: acc.z };
}

// تحديث القيم وحساب المسافة والسعرات
function updateUI() {
stepDisplay.innerText = stepCount;
// معدل تقريبي: الخطوة الواحدة ~ 0.04 سعرة حرارية
const calories = (stepCount * 0.04).toFixed(1);
caloriesDisplay.innerText = calories;

// معدل تقريبي: الخطوة الواحدة ~ 0.78 متر (0.00078 كم)
const distance = (stepCount * 0.00078).toFixed(2);
distanceDisplay.innerText = distance;
}

// زر إعادة الضبط
resetBtn.addEventListener('click', () => {
stepCount = 0;
updateUI();
});

