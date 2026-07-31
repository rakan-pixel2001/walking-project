let stepCount = 0;
let isTracking = false;
let lastAcceleration = { x: 0, y: 0, z: 0 };
const threshold = 11;

const welcomePage = document.getElementById('welcomePage');
const appContainer = document.getElementById('appContainer');
const userForm = document.getElementById('userForm');
const welcomeMessage = document.getElementById('welcomeMessage');
const editProfileBtn = document.getElementById('editProfileBtn');

const stepDisplay = document.getElementById('stepCount');
const caloriesDisplay = document.getElementById('calories');
const distanceDisplay = document.getElementById('distance');
const startBtn = document.getElementById('startBtn');
const resetBtn = document.getElementById('resetBtn');

// الفحص عند التحميل
window.addEventListener('load', () => {
checkUserData();
});

function checkUserData() {
const userData = JSON.parse(localStorage.getItem('userData'));
if (userData && userData.name) {
welcomePage.classList.add('hidden');
appContainer.classList.remove('hidden');
welcomeMessage.innerText = `مرحباً بك يا ${userData.name} 👋`;
} else {
welcomePage.classList.remove('hidden');
appContainer.classList.add('hidden');
}
}

// حفظ بيانات المستخدم وانتقال الصفحة
userForm.addEventListener('submit', (e) => {
e.preventDefault();
const name = document.getElementById('userName').value;
const age = document.getElementById('userAge').value;
const gender = document.getElementById('userGender').value;

if (name && age && gender) {
const userData = { name, age, gender };
localStorage.setItem('userData', JSON.stringify(userData));
checkUserData();
}
});

// العودة لصفحة تعديل البيانات
editProfileBtn.addEventListener('click', () => {
welcomePage.classList.remove('hidden');
appContainer.classList.add('hidden');
});

// تتبع الحركة
startBtn.addEventListener('click', async () => {
if (!isTracking) {
if (typeof DeviceMotionEvent !== 'undefined' && typeof DeviceMotionEvent.requestPermission === 'function') {
try {
const response = await DeviceMotionEvent.requestPermission();
if (response === 'granted') {
startTracking();
} else {
alert("يرجى إعطاء الإذن لحساسات الحركة ليتمكن التطبيق من حساب الخطوات.");
}
} catch (error) {
console.error(error);
startTracking();
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
startBtn.style.backgroundColor = '#e74c3c';
window.addEventListener('devicemotion', handleMotion);
}

function stopTracking() {
isTracking = false;
startBtn.innerHTML = '<i class="fa-solid fa-play"></i> استئناف';
startBtn.style.backgroundColor = '#2ecc71';
window.removeEventListener('devicemotion', handleMotion);
}

function handleMotion(event) {
const acc = event.accelerationIncludingGravity;
if (!acc) return;

let deltaX = Math.abs(acc.x - lastAcceleration.x);
let deltaY = Math.abs(acc.y - lastAcceleration.y);
let deltaZ = Math.abs(acc.z - lastAcceleration.z);

if ((deltaX + deltaY + deltaZ) > threshold) {
stepCount++;
updateUI();
}

lastAcceleration = { x: acc.x, y: acc.y, z: acc.z };
}

function updateUI() {
stepDisplay.innerText = stepCount;
caloriesDisplay.innerText = (stepCount * 0.04).toFixed(1);
distanceDisplay.innerText = (stepCount * 0.00078).toFixed(2);
}

resetBtn.addEventListener('click', () => {
stepCount = 0;
updateUI();
});

