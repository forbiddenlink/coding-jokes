# 😂 Coding Jokes

> A modern, interactive web application that showcases a collection of programming-related jokes with 2025 design trends. Built with vanilla HTML, CSS, and JavaScript, featuring 3D effects, emoji reactions, achievements, and personal stats tracking!

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](http://makeapullrequest.com)

[Live Demo](https://coding-jokes.vercel.app/) | [Report Bug](https://github.com/forbiddenlink/coding-jokes/issues) | [Request Feature](https://github.com/forbiddenlink/coding-jokes/issues)

## ✨ Features

### Core Functionality
- 🎭 **400+ Programming Jokes** - Now with AI, Copilot, remote work, modern frameworks!
- 🔍 **Real-time Search** with debouncing for optimal performance
- 🏷️ **Category Filtering** - JavaScript, Python, Java, Web Dev, DevOps, AI/ML, and more
- 🔄 **Smart Sorting** - by newest, most popular, or category
- 🎲 **Random Joke Generator** for quick laughs
- 😂 **Emoji Reactions** - React with 😂🤓💀🔥🤔 (not just likes!)
- 📝 **Submit Your Own Jokes** with instant feedback
- 📋 **Copy & Share** functionality for spreading the joy

### 🎮 Gamification & Engagement (NEW!)
- 🏆 **Achievement System** - Unlock 10 unique achievements
- 📊 **Personal Stats Dashboard** - Track your journey
  - Total reactions given
  - Jokes viewed
  - Favorite category
  - Achievement progress
- 🎯 **Smart Achievements**:
  - 😂 First Laugh - React to your first joke
  - 🔍 Joke Explorer - View 10 different jokes
  - 🎓 Category Master - Explore 5 categories
  - 🔥 Reaction Enthusiast - Give 20 reactions
  - 🤓 Joke Connoisseur - View 50 jokes
  - 🌙 Night Owl - Browse after midnight
  - 🌅 Early Bird - Browse before 7 AM
  - 🎮 Weekend Coder - Browse on weekends
  - 💎 Collector - React to 10 jokes
  - 🌟 All Categories - Explore all 14 categories
- 🎉 **Achievement Notifications** with smooth animations
- 💾 **Full Progress Persistence** via localStorage

### 🎨 Modern Design (2025 Trends)
- 🎯 **3D Card Effects** - Depth, tilt, and perspective on hover
- ✨ **Playful Elements** - Hand-drawn style accents, rotated badges
- 🌈 **Gradient Backgrounds** - Beautiful, modern color transitions
- 💫 **Micro-interactions** - Satisfying button animations and shine effects
- 🎪 **Smooth Animations** - Bounce, fade, slide powered by Animate.css
- 🎭 **Enhanced Depth Shadows** - Multi-layer shadow effects

### User Experience
- 🌓 **Dark/Light Mode** with smooth transitions and persistence
- 📱 **Fully Responsive Design** - optimized for all devices
- ⚡ **Fast & Performant** - optimized rendering and interactions
- ♿ **Accessibility First** - ARIA labels, skip links, keyboard navigation
- 💾 **Complete Data Persistence** - reactions, stats, achievements saved
- 🎯 **Smart Pagination** with filtered navigation
- 🎪 **Featured Jokes Section** with rotating highlights

### Technical Excellence
- 🏗️ **Modular Architecture** - jokes, search, filters, stats, theme
- 🎨 **CSS Custom Properties** - easy theming and customization
- 📦 **ES6+ JavaScript** - modern, clean code
- 🔧 **Vite Build Tool** - lightning-fast development and builds
- 🎯 **SEO Optimized** - OG tags, Twitter cards, semantic HTML
- 🎭 **Print Friendly** - jokes look great on paper too!

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/forbiddenlink/coding-jokes.git

# Navigate to project directory
cd coding-jokes

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will open at `http://localhost:5173`

### Build for Production

```bash
# Create optimized production build
npm run build

# Preview production build locally
npm run preview
```

Production domain is configured as `https://coding-jokes.vercel.app/` in canonical and sitemap metadata.

## 📁 Project Structure

```
coding-jokes/
├── index.html              # Main HTML file with semantic structure
├── index.css              # Comprehensive styling with CSS variables
├── js/
│   ├── jokes.js          # Joke management, rendering, and persistence
│   ├── search.js         # Search functionality with debouncing
│   ├── filters.js        # Category filtering logic
│   └── theme.js          # Dark/light mode management
├── package.json           # Project metadata and dependencies
├── vite.config.js         # Vite configuration
└── README.md             # You are here!
```

## 🎨 Features in Detail

### Search & Filter System
The app features an intelligent search and filter system that works together seamlessly:
- **Real-time search** across questions, answers, and categories
- **Combined filtering** - search results respect category filters
- **Debounced input** to reduce unnecessary renders
- **Visual feedback** showing current filters and result counts

### Sorting Options
Sort jokes to find exactly what you're looking for:
- **Newest First** - see the latest additions
- **Most Popular** - discover community favorites
- **By Category** - organize alphabetically

### Persistence Layer
Your preferences and interactions are saved:
- Liked jokes persist across sessions
- Theme preference is remembered
- All stored locally - no backend required!

### Accessibility Features
Built with accessibility in mind:
- Semantic HTML5 structure
- ARIA labels and roles throughout
- Keyboard navigation support
- Skip links for easier navigation
- High contrast color schemes
- Screen reader announcements for dynamic content
- Focus management for modals and overlays

## 🎭 Joke Categories

- 💛 JavaScript
- 🐍 Python  
- ☕ Java
- 🌐 Web Development
- 🧪 Testing & QA
- 🎨 Design & UX
- 🔒 Security
- 📱 Mobile Development
- 🚀 Startup & Tech Industry
- 🤖 AI & Machine Learning
- 💾 Database
- ⚙️ DevOps
- 🔧 Hardware
- 💻 General Programming

## 🛠️ Technologies Used

- **HTML5** - Semantic markup
- **CSS3** - Modern styling with custom properties, Grid, and Flexbox
- **JavaScript (ES6+)** - Vanilla JS with modern features
- **Vite** - Build tool and dev server
- **Font Awesome** - Icon library
- **Google Fonts** - Typography (Space Grotesk & Inter)
- **Animate.css** - Animation library

## 🤝 Contributing

Contributions are what make the open-source community amazing! Any contributions you make are **greatly appreciated**.

### How to Contribute

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Adding New Jokes

Want to add more jokes? Great! You can either:
1. Use the submit form on the website
2. Edit `js/jokes.js` directly and submit a PR

Please ensure jokes are:
- Programming or tech-related
- Appropriate and inclusive
- Properly categorized
- Original or properly attributed

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 👏 Acknowledgments

- Original concept developed as part of the Scrimba Frontend Developer Career Path
- Enhanced and expanded by Elizabeth Stein
- Jokes contributed by the developer community
- Icons by Font Awesome
- Fonts by Google Fonts

## 📧 Contact

Elizabeth Stein - [@forbiddenlink](https://github.com/forbiddenlink)

Project Link: [https://github.com/forbiddenlink/coding-jokes](https://github.com/forbiddenlink/coding-jokes)

---

<div align="center">

**[⬆ back to top](#-coding-jokes)**

Made with ❤️ by developers, for developers

If you found this project helpful, please consider giving it a ⭐!

</div>


## Features

- 🎭 Browse programming jokes across multiple categories
- 🔍 Search functionality to find specific jokes
- 🌓 Dark/Light mode toggle
- 🎲 Random joke generator
- 📝 Submit your own jokes
- 🏷️ Category filtering
- ♿ Accessibility features including skip links and ARIA labels
- 📱 Responsive design for all devices

## Project Structure

```
.
├── index.html          # Main HTML file
├── index.css          # Main stylesheet
├── css/               # Additional CSS files
├── js/                # JavaScript modules
│   ├── theme.js      # Theme switching functionality
│   ├── jokes.js      # Joke management and display
│   ├── search.js     # Search functionality
│   └── filters.js    # Category filtering
├── package.json       # Project dependencies
└── vite.config.js     # Vite configuration
```

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Open your browser and navigate to `http://localhost:3000`

## Building for Production

To create a production build:

```bash
npm run build
```

To preview the production build:

```bash
npm run preview
```

## Technologies Used

- HTML5
- CSS3
- JavaScript (ES6+)
- Vite (Build tool)
- Font Awesome (Icons)
- Google Fonts (Typography)
- Animate.css (Animations)

## Accessibility

This project follows web accessibility best practices:
- Semantic HTML structure
- ARIA labels and roles
- Skip links for keyboard navigation
- High contrast color schemes
- Responsive design for all screen sizes

## Contributing

Feel free to submit your own programming jokes through the submission form on the website!

## License

This project is open source and available under the MIT License.
