:root {
--primary-color: #2ecc71;
--secondary-color: #e74c3c;
--bg-color: #f4f7f6;
--card-bg: #ffffff;
--text-color: #2c3e50;
}

body {
font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
background-color: var(--bg-color);
color: var(--text-color);
margin: 0;
padding: 15px;
display: flex;
justify-content: center;
align-items: center;
min-height: 100vh;
box-sizing: border-box;
}

/* تصميم الشعارين بالترتيب المطلوبة (يسار ويمين) */
.logos-header {
display: flex;
justify-content: space-between;
align-items: center;
width: 100%;
margin-bottom: 20px;
}

.header-logo {
height: 65px;
width: auto;
object-fit: contain;
}

/* صفحة البداية */
.welcome-screen {
width: 100%;
max-width: 400px;
}

.welcome-card {
background: var(--card-bg);
border-radius: 20px;
padding: 25px;
box-shadow: 0 10px 25px rgba(0,0,0,0.08);
text-align: center;
}

.welcome-card h2 {
color: var(--text-color);
margin-top: 10px;
margin-bottom: 5px;
}

.welcome-card p {
color: #7f8c8d;
font-size: 0.9rem;
margin-bottom: 20px;
}

.input-group {
text-align: right;
margin-bottom: 15px;
}

.input-group label {
display: block;
font-size: 0.85rem;
font-weight: bold;
margin-bottom: 5px;
color: #34495e;
}

.input-group input, .input-group select {
width: 100%;
padding: 12px;
border: 1px solid #dfe6e9;
border-radius: 10px;
font-size: 0.95rem;
box-sizing: border-box;
outline: none;
background: #f8f9fa;
}

.btn-full {
width: 100%;
margin-top: 10px;
}

/* الصفحة الرئيسية للتطبيق */
.container {
max-width: 400px;
width: 100%;
text-align: center;
}

header h1 {
font-size: 1.5rem;
color: #2c3e50;
margin-top: 5px;
margin-bottom: 5px;
}

.btn-small {
background: transparent;
border: 1px solid var(--primary-color);
color: var(--primary-color);
padding: 4px 12px;
border-radius: 15px;
cursor: pointer;
font-size: 0.8rem;
margin-bottom: 15px;
}

.card {
background: var(--card-bg);
border-radius: 15px;
padding: 20px;
margin-bottom: 15px;
box-shadow: 0 4px 15px rgba(0,0,0,0.05);
}

.step-display {
font-size: 4rem;
font-weight: bold;
color: var(--primary-color);
margin: 10px 0;
}

.stats-grid {
display: grid;
grid-template-columns: 1fr 1fr;
gap: 15px;
}

.stat-item {
display: flex;
flex-direction: column;
align-items: center;
}

.stat-item i {
font-size: 1.5rem;
margin-bottom: 5px;
}

.icon-fire { color: #e67e22; }
.icon-route { color: #3498db; }

.stat-value {
font-size: 1.5rem;
font-weight: bold;
}

.stat-label {
font-size: 0.85rem;
color: #7f8c8d;
}

.controls {
display: flex;
gap: 10px;
}

.btn {
flex: 1;
padding: 12px;
border: none;
border-radius: 10px;
font-size: 1rem;
font-weight: bold;
cursor: pointer;
transition: 0.3s;
}

.btn-primary { background-color: var(--primary-color); color: white; }
.btn-secondary { background-color: #95a5a6; color: white; }

/* الحقوق بالأسفل */
.app-footer {
margin-top: 35px;
padding-top: 15px;
font-size: 0.9rem;
font-weight: 600;
color: #7f8c8d;
border-top: 1px solid #e0e0e0;
letter-spacing: 0.5px;
}

.hidden { display: none !important; }
