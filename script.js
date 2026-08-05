// إعدادات Firebase الخاصة بمشروعك
const firebaseConfig = {
  apiKey: "ضع_API_KEY_الخاص_بك_هنا",
  authDomain: "wallking-project.firebaseapp.com",
  projectId: "wallking-project",
  storageBucket: "wallking-project.appspot.com",
  messagingSenderId: "ضع_الرقم_هنا",
  appId: "ضع_ID_التطبيق_هنا"
};

let db = null;
try {
    if (typeof firebase !== 'undefined') {
        firebase.initializeApp(firebaseConfig);
        db = firebase.firestore();
    }
} catch (e) {
    console.log("Firebase not initialized yet");
}

let stepCount = 0;
let isTracking = false;
let lastAcceleration = { x: 0, y: 0, z: 0 };
const threshold = 11; 
let currentUserId = null;
let lastMilestone = 0;

// رسائل تحفيزية كل 2,000 خطوة
const motivationalMessages = [
    "بداية رائعة! أتممت 2,000 خطوة، واصل خطاك! 🏃‍♂️✨",
    "إنجاز مميز! وصلت إلى 4,000 خطوة، أنشط مما تتوقع! 🔥💪",
    "منتصف الطريق! 6,000 خطوة، لياقتك وصحتك في تصاعد! 🌟🎯",
    "بطل! أتممت 8,000 خطوة، اقتربت جداً من هدف اليوم! 🚀👏",
    "مذهل! أتممت 10,000 خطوة وحققت الهدف اليومي بنجاح! 🎉🏆"
];

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

// إرسال النموذج وتخزين البيانات في Firebase
userForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const name = document.getElementById('userName').value;
    const age = document.getElementById('userAge').value;
    const gender = document.querySelector('input[name="userGender"]:checked')?.value || "ذكر";
    const isResident = document.querySelector('input[name="userResident"]:checked')?.value || "نعم";

    // إخفاء بطاقة التسجيل وإظهار واجهة التتبع فوراً
    welcomeMsg.textContent = `مرحباً بك يا ${name} 👋`;
    userCard.classList.add('hidden');
    trackerCard.classList.remove('hidden');

    // حفظ المستند في Firebase
    if (db) {
        try {
            const docRef = await db.collection("users").add({
                name: name,
                age: Number(age),
                gender: gender,
                isResident: isResident,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                totalSteps: 0,
                totalTrips: 0
            });
            currentUserId = docRef.id;
        } catch (error) {
            console.error("خطأ في حفظ Firebase: ", error);
        }
    }
});

editUserBtn.addEventListener('click', () => {
    trackerCard.classList.add('hidden');
    userCard.classList.remove('hidden');
});

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
    startBtn.style.backgroundColor = '#f39c12';
    window.addEventListener('devicemotion', handleMotion);
}

function stopTracking() {
    isTracking = false;
    startBtn.innerHTML = '<i class="fa-solid fa-play"></i> بدء التتبع';
    startBtn.style.backgroundColor = '#2ecc71';
    window.removeEventListener('devicemotion', handleMotion);
}

function handleMotion(event) {
    const acc = event.accelerationIncludingGravity;
    if (!acc) return;

    const deltaX = Math.abs(acc.x - lastAcceleration.x);
    const deltaY = Math.abs(acc.y - lastAcceleration.y);
    const deltaZ = Math.abs(acc.z - lastAcceleration.z);

    if (deltaX + deltaY + deltaZ > threshold) {
        stepCount++;
        updateDisplay();
        checkMilestones();
    }

    lastAcceleration = { x: acc.x, y: acc.y, z: acc.z };
}

function checkMilestones() {
    if (stepCount >= 2000 && Math.floor(stepCount / 2000) > lastMilestone) {
        lastMilestone = Math.floor(stepCount / 2000);
        let index = lastMilestone - 1;
        let message = motivationalMessages[index] || `عظيم جداً! أتممت ${stepCount} خطوة بنجاح! 🎉`;
        alert(message);
    }
}

function updateDisplay() {
    stepDisplay.textContent = stepCount;
    caloriesDisplay.textContent = Math.round(stepCount * 0.04);
    distanceDisplay.textContent = (stepCount * 0.0008).toFixed(2);
}

resetBtn.addEventListener('click', () => {
    stepCount = 0;
    lastMilestone = 0;
    updateDisplay();
});

endBtn.addEventListener('click', async () => {
    stopTracking();
    const calories = Math.round(stepCount * 0.04);
    const distance = (stepCount * 0.0008).toFixed(2);
    
    alert(`🎉 أحسنت! تم إنهاء الرحلة بنجاح.\n\n📊 الملخص:\n• الخطوات: ${stepCount}\n• السعرات الحرارية: ${calories} سعرة\n• المسافة: ${distance} كم`);
    
    if (currentUserId && db) {
        try {
            await db.collection("users").doc(currentUserId).update({
                totalSteps: firebase.firestore.FieldValue.increment(stepCount),
                totalTrips: firebase.firestore.FieldValue.increment(1),
                lastTripDate: firebase.firestore.FieldValue.serverTimestamp()
            });

            await db.collection("trips").add({
                userId: currentUserId,
                steps: stepCount,
                calories: calories,
                distance: Number(distance),
                date: firebase.firestore.FieldValue.serverTimestamp()
            });
        } catch (error) {
            console.error("خطأ حفظ الرحلة: ", error);
        }
    }

    stepCount = 0;
    lastMilestone = 0;
    updateDisplay();
});
