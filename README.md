# 🛡️ TimeGuard — Time Tracker & Focus Shield

> 🌐 For the Turkish version of this documentation, please see [README.tr.md](README.tr.md).

---

TimeGuard is a sleek, modern, and privacy-first browser extension designed to help you regain control over your digital life. Available for both **Firefox** and **Google Chrome** (Manifest V3), TimeGuard tracks the time you spend on various websites, lets you establish daily limits, and gracefully blocks access once those boundaries are reached—substituting digital noise with a state of mindful, focused calm.

---

## 💡 Why TimeGuard? (The Science of Focus)

Modern websites, particularly social media platforms, are meticulously engineered to capture and monopolize your attention. Using sophisticated **dopamine loop rewards** (infinite scroll, notifications, variable payoffs), they keep you engaged far longer than you consciously intend. 

### The Cost of Digital Distraction
* **The Attention Splinter**: According to research from the University of California, Irvine, it takes an average of **23 minutes and 15 seconds** to return to a deep task after a single distraction.
* **The Dopamine Debt**: Endlessly scrolling short-form videos exhausts your brain's dopamine receptors, leading to decreased motivation, attention fatigue, and increased anxiety.
* **Continuous Partial Attention**: Living in a state of constant interruption prevents your brain from reaching the state of **Deep Work**—the environment where true creativity, problem-solving, and intellectual breakthroughs occur.

> 💬 *“If you don't control your time, someone else will control it for you.”*  
> — **Nelson Mandela**

> 💬 *“Deep work is not some nostalgic affectation of writers and early-twentieth-century philosophers. It's instead an indispensable skill in our modern economy.”*  
> — **Cal Newport (Author of Deep Work)**

> 💬 *“It is not that we have a short time to live, but that we waste a lot of it.”*  
> — **Seneca**

---

## ✨ Features

* 📊 **Live Ticking Dashboard**: See your daily total browsing time and active tab timer ticking second-by-second in real-time.
* ⏳ **Limit Statuses (Remaining Time)**: The popup filters exclusively for your blocklisted domains and shows exactly how much time you have **left** before being blocked.
* 🎨 **Premium Aesthetics**: An exquisite glassmorphism (frosted glass) interface with vibrant gradients, smooth transitions, and dynamic light/dark theme synchronization.
* 🌐 **Turkish & English Support**: Seamlessly switch languages directly from the dashboard. All UI text, date formats, and motivational messages will dynamically adapt.
* 🧘 **Meditative Block Screen**: When a limit is exceeded, you are redirected to a beautiful, calming block page displaying randomized, deep-focus quotes and encouraging you to step away and rest.
* 🔒 **100% Offline & Private**: No data is transmitted to external servers. All statistics and limit parameters remain securely stored inside your browser's local memory.

---

## 📂 Repository Structure

The repository is divided into two optimized standalone builds:
* **`firefox_version/`**: Configured for Firefox MV3 Event Pages using standard background scripts for perfect background longevity.
* **`chrome_version/`**: Adapted for Google Chrome MV3 Service Workers, equipped with a periodic `chrome.alarms` scheduler to prevent background sleep issues.

---

## 🚀 Installation & Setup

### For Firefox
1. Open Firefox and type **`about:debugging`** in the address bar.
2. Click **"This Firefox"** on the left menu.
3. Click the **"Load Temporary Add-on..."** button.
4. Select the **`firefox_version/manifest.json`** file from this project directory.

### For Google Chrome
1. Open Google Chrome and navigate to **`chrome://extensions`**.
2. Enable **"Developer mode"** in the top-right corner.
3. Click the **"Load unpacked"** button in the top-left corner.
4. Select the **`chrome_version`** folder from this project directory.

---
*Created with 💜 to guard your most precious resource — your time.*
