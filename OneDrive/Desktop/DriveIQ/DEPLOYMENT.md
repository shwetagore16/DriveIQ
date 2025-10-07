# 🌐 DriveIQ Deployment Guide

Complete guide for deploying DriveIQ to production.

---

## 📋 Deployment Options

### Backend Deployment
- [Railway](#deploy-backend-to-railway) ⭐ Recommended
- [Heroku](#deploy-backend-to-heroku)
- [AWS EC2](#deploy-backend-to-aws-ec2)
- [Local Network](#deploy-on-local-network)

### Frontend Deployment
- [Vercel](#deploy-frontend-to-vercel) ⭐ Recommended
- [Netlify](#deploy-frontend-to-netlify)
- [GitHub Pages](#deploy-frontend-to-github-pages)

---

## 🚂 Deploy Backend to Railway

**Railway** offers free hosting with automatic HTTPS.

### Step 1: Prepare Project
```bash
cd backend
# Ensure these files exist:
# - app.py
# - requirements.txt
# - Procfile
```

### Step 2: Create Railway Account
1. Go to [railway.app](https://railway.app/)
2. Sign up with GitHub
3. Click "New Project"

### Step 3: Deploy
1. Click "Deploy from GitHub repo"
2. Select your DriveIQ repository
3. Set **Root Directory**: `backend`
4. Railway will auto-detect Python and deploy

### Step 4: Configure Environment Variables (Optional)
If using Firebase:
1. Go to your project → Variables
2. Add variable: `GOOGLE_APPLICATION_CREDENTIALS_JSON`
3. Paste your Firebase JSON content as the value

### Step 5: Get Your Backend URL
```
https://your-app-name.up.railway.app
```

### Step 6: Update ESP8266 Firmware
```cpp
const char* BACKEND_URL = "https://your-app-name.up.railway.app/api/vehicle-data";
```

---

## 🚀 Deploy Backend to Heroku

### Prerequisites
```bash
# Install Heroku CLI
# Windows: Download from heroku.com
# Mac: brew tap heroku/brew && brew install heroku
```

### Deploy Steps
```bash
cd backend

# Login to Heroku
heroku login

# Create app
heroku create driveiq-backend

# Add Python buildpack
heroku buildpacks:set heroku/buildpack-python

# Deploy
git init
git add .
git commit -m "Initial commit"
git push heroku main

# View logs
heroku logs --tail
```

### Backend URL
```
https://driveiq-backend.herokuapp.com
```

---

## ☁️ Deploy Backend to AWS EC2

### Step 1: Launch EC2 Instance
1. Go to AWS Console → EC2
2. Launch Ubuntu 22.04 instance
3. Configure security group:
   - Port 22 (SSH)
   - Port 5000 (Flask)
   - Port 80 (HTTP)
   - Port 443 (HTTPS)

### Step 2: SSH into Instance
```bash
ssh -i your-key.pem ubuntu@your-ec2-ip
```

### Step 3: Install Dependencies
```bash
sudo apt update
sudo apt install python3-pip python3-venv nginx -y

# Clone or upload your project
# Example: scp -i your-key.pem -r backend ubuntu@your-ec2-ip:~/
```

### Step 4: Setup Application
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
pip install gunicorn
```

### Step 5: Create Systemd Service
```bash
sudo nano /etc/systemd/system/driveiq.service
```

Paste:
```ini
[Unit]
Description=DriveIQ Flask Backend
After=network.target

[Service]
User=ubuntu
WorkingDirectory=/home/ubuntu/backend
Environment="PATH=/home/ubuntu/backend/venv/bin"
ExecStart=/home/ubuntu/backend/venv/bin/gunicorn --workers 3 --bind 0.0.0.0:5000 app:app

[Install]
WantedBy=multi-user.target
```

### Step 6: Start Service
```bash
sudo systemctl daemon-reload
sudo systemctl start driveiq
sudo systemctl enable driveiq
sudo systemctl status driveiq
```

### Step 7: Configure Nginx (Optional)
```bash
sudo nano /etc/nginx/sites-available/driveiq
```

Paste:
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://127.0.0.1:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

Enable:
```bash
sudo ln -s /etc/nginx/sites-available/driveiq /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

---

## 🏠 Deploy on Local Network

### For Home/Office Network

1. **Find Your PC's IP:**
   ```bash
   # Windows
   ipconfig
   
   # Mac/Linux
   ifconfig
   ```

2. **Run Backend:**
   ```bash
   cd backend
   python app.py
   # Server running on http://0.0.0.0:5000
   ```

3. **Configure Firewall:**
   - Windows: Allow port 5000 in Windows Firewall
   - Mac: System Preferences → Security → Firewall → Options
   - Linux: `sudo ufw allow 5000`

4. **Update ESP8266:**
   ```cpp
   const char* BACKEND_URL = "http://192.168.1.XXX:5000/api/vehicle-data";
   ```

5. **Access Dashboard:**
   - Same device: `http://localhost:3000`
   - Other devices: `http://192.168.1.XXX:3000`

---

## ▲ Deploy Frontend to Vercel

**Vercel** is perfect for React apps with zero configuration.

### Step 1: Install Vercel CLI
```bash
npm install -g vercel
```

### Step 2: Build & Deploy
```bash
cd frontend

# Update backend URL in src/App.js
# const BACKEND_URL = 'https://your-backend-url.com';

# Login
vercel login

# Deploy
vercel --prod
```

### Step 3: Custom Domain (Optional)
1. Go to Vercel dashboard
2. Select your project → Settings → Domains
3. Add your custom domain

---

## 🌍 Deploy Frontend to Netlify

### Method 1: Drag & Drop
```bash
cd frontend
npm run build
# Drag the 'build' folder to netlify.com/drop
```

### Method 2: CLI
```bash
npm install -g netlify-cli

cd frontend
npm run build

netlify login
netlify deploy --prod --dir=build
```

### Configure Backend URL
Create `frontend/.env.production`:
```
REACT_APP_BACKEND_URL=https://your-backend-url.com
```

Update `src/App.js`:
```javascript
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';
```

---

## 📄 Deploy Frontend to GitHub Pages

### Step 1: Update package.json
```json
{
  "homepage": "https://yourusername.github.io/driveiq",
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d build"
  }
}
```

### Step 2: Install gh-pages
```bash
cd frontend
npm install --save-dev gh-pages
```

### Step 3: Deploy
```bash
npm run deploy
```

### Step 4: Configure GitHub
1. Go to repository → Settings → Pages
2. Source: `gh-pages` branch
3. Visit: `https://yourusername.github.io/driveiq`

---

## 🔒 SSL/HTTPS Setup

### For Custom Domain (Let's Encrypt)
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com
sudo systemctl reload nginx
```

### For Cloudflare (Free SSL)
1. Add your domain to Cloudflare
2. Update nameservers
3. Enable "Always Use HTTPS"
4. SSL mode: "Flexible" or "Full"

---

## 🔐 Security Best Practices

### Backend Security
```python
# Add to app.py:
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address

limiter = Limiter(
    app,
    key_func=get_remote_address,
    default_limits=["200 per day", "50 per hour"]
)

@app.route('/api/vehicle-data', methods=['POST'])
@limiter.limit("100 per hour")
def receive_vehicle_data():
    # Your code
```

### Environment Variables
Create `.env` file (never commit):
```
FIREBASE_CREDENTIALS_PATH=/path/to/credentials.json
SECRET_KEY=your-secret-key-here
```

### CORS Configuration
```python
# Restrict origins in production:
CORS(app, resources={
    r"/api/*": {
        "origins": ["https://yourdomain.com"]
    }
})
```

---

## 📊 Monitoring & Logging

### Backend Logging
```python
import logging

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('driveiq.log'),
        logging.StreamHandler()
    ]
)
```

### Error Tracking
- **Sentry**: Real-time error tracking
- **LogRocket**: Session replay
- **Google Analytics**: User analytics

---

## 🧪 Production Testing

### Checklist
- [ ] Backend health check responds: `/api/health`
- [ ] HTTPS working (no mixed content)
- [ ] CORS configured correctly
- [ ] Firebase/database connected
- [ ] ESP8266 can reach backend
- [ ] Dashboard loads without errors
- [ ] Real-time updates working
- [ ] Dark mode toggle works
- [ ] Responsive on mobile

### Load Testing
```bash
# Install Apache Bench
sudo apt install apache2-utils

# Test backend
ab -n 1000 -c 10 https://your-backend.com/api/health
```

---

## 🔄 CI/CD Pipeline

### GitHub Actions Example
Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy DriveIQ

on:
  push:
    branches: [ main ]

jobs:
  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Railway
        run: |
          # Railway CLI deployment
          
  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Vercel
        run: |
          npm install -g vercel
          cd frontend && vercel --prod --token=${{ secrets.VERCEL_TOKEN }}
```

---

## 📱 Mobile Access

### Access from Phone
1. **Same WiFi Network:**
   - Find PC IP: `ipconfig` / `ifconfig`
   - Open browser: `http://192.168.1.XXX:3000`

2. **Remote Access (ngrok):**
   ```bash
   # Install ngrok
   ngrok http 3000
   # Use the generated URL
   ```

---

## 🆘 Troubleshooting Deployment

### Backend Not Starting
```bash
# Check logs
heroku logs --tail  # Heroku
railway logs        # Railway

# Test locally first
python app.py
```

### Frontend Build Fails
```bash
# Clear cache
rm -rf node_modules package-lock.json
npm install
npm run build
```

### CORS Errors in Production
- Update Flask CORS origins
- Check browser console for exact error
- Verify backend URL in frontend

### ESP8266 Can't Reach Backend
- Use HTTPS if available
- Check firewall rules
- Verify URL is correct
- Test with `curl` first

---

## 💰 Cost Estimates

| Service | Free Tier | Paid |
|---------|-----------|------|
| **Railway** | $5 credit/month | $5/month per service |
| **Heroku** | 550 dyno hours/month | $7/month |
| **Vercel** | 100GB bandwidth | $20/month |
| **Netlify** | 100GB bandwidth | $19/month |
| **Firebase** | 50K reads/day | Pay as you go |
| **AWS EC2** | 750 hours/month (1yr) | $5-10/month |

**Recommended Free Setup:**
- Backend: Railway (Free)
- Frontend: Vercel (Free)
- Database: Firebase (Free tier)
- **Total: $0/month** for small usage

---

## 🎯 Production Checklist

- [ ] Backend deployed and accessible
- [ ] Frontend deployed and accessible
- [ ] Firebase/database configured
- [ ] ESP8266 firmware updated with production URL
- [ ] HTTPS enabled
- [ ] CORS properly configured
- [ ] Environment variables secured
- [ ] Monitoring/logging enabled
- [ ] Error tracking configured
- [ ] Backups scheduled (database)
- [ ] Domain name configured (optional)
- [ ] Documentation updated

---

<div align="center">

**Your DriveIQ system is now live! 🎉**

Need help? Check the main README or open an issue.

</div>
