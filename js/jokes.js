/* eslint-env browser */
// Joke management
const jokesManager = {
    jokes: [],
    currentJoke: null,
    featuredJokes: [],
    currentPage: 1,
    jokesPerPage: 6,
    likedJokes: new Set(), // Keep for backward compatibility
    reactions: {}, // { jokeId: { '😂': true, '🤓': false, ... } }
    currentFilter: 'all',
    currentSearch: '',
    sortBy: 'newest', // newest, popular, category
    
    init() {
        this.loadLikedJokes();
        this.loadReactions();
        this.loadJokes();
        this.loadFeaturedJokes();
        this.addEventListeners();
        this.setupSubmitForm();
        this.setupPagination();
        this.setupSortControls();
    },
    
    loadLikedJokes() {
        const saved = localStorage.getItem('likedJokes');
        if (saved) {
            this.likedJokes = new Set(JSON.parse(saved));
        }
    },
    
    saveLikedJokes() {
        localStorage.setItem('likedJokes', JSON.stringify([...this.likedJokes]));
    },
    
    loadReactions() {
        const saved = localStorage.getItem('jokeReactions');
        if (saved) {
            this.reactions = JSON.parse(saved);
        }
    },
    
    saveReactions() {
        localStorage.setItem('jokeReactions', JSON.stringify(this.reactions));
    },
    
    loadJokes() {
        this.showLoading();
        
        // Simulate loading delay
        setTimeout(() => {
            try {
                this.jokes = [
                    {
                        id: 1,
                        question: "Why did the JavaScript developer feel sad?",
                        answer: "Because they didn't know how to 'this' 🤔",
                        category: "javascript",
                        likes: 0
                    },
                    {
                        id: 2,
                        question: "Why do Python programmers always carry an umbrella?",
                        answer: "For unexpected indentation errors ☂️",
                        category: "python",
                        likes: 0
                    },
                    {
                        id: 3,
                        question: "What's the object-oriented way to become wealthy?",
                        answer: "Inheritance 😂",
                        category: "general",
                        likes: 0
                    },
                    {
                        id: 4,
                        question: "Why did the programmer quit their job?",
                        answer: "Because they didn't get arrays 😹",
                        category: "general",
                        likes: 0
                    },
                    {
                        id: 5,
                        question: "Where does CSS go for its eye exam?",
                        answer: "Visual Studio 💀",
                        category: "web",
                        likes: 0
                    },
                    {
                        id: 6,
                        question: "What is a programmer's favorite hangout place?",
                        answer: "Foo Bar 🤣",
                        category: "general",
                        likes: 0
                    },
                    {
                        id: 7,
                        question: "Why do Java programmers have to wear glasses?",
                        answer: "Because they don't C# 🙃",
                        category: "java",
                        likes: 0
                    },
                    {
                        id: 8,
                        question: "How many programmers does it take to change a light bulb?",
                        answer: "None, that's a hardware problem 💡",
                        category: "hardware",
                        likes: 0
                    },
                    {
                        id: 9,
                        question: "Why did the React component go to therapy?",
                        answer: "Because it had too many state issues! 🧘",
                        category: "web",
                        likes: 0
                    },
                    {
                        id: 10,
                        question: "What's a programmer's favorite type of tree?",
                        answer: "A binary tree! 🌳",
                        category: "general",
                        likes: 0
                    },
                    {
                        id: 11,
                        question: "Why did the developer go to the gym?",
                        answer: "To work on their core strength! 💪",
                        category: "general",
                        likes: 0
                    },
                    {
                        id: 12,
                        question: "What's a programmer's favorite type of music?",
                        answer: "Heavy metal! 🤘",
                        category: "general",
                        likes: 0
                    },
                    {
                        id: 13,
                        question: "Why did the developer go broke?",
                        answer: "Because they used up all their cache! 💰",
                        category: "general",
                        likes: 0
                    },
                    {
                        id: 14,
                        question: "What do you call a programmer from Finland?",
                        answer: "Nerdic! 🧊",
                        category: "general",
                        likes: 0
                    },
                    {
                        id: 15,
                        question: "Why don't programmers like nature?",
                        answer: "It has too many bugs and no debugging tool! 🐛",
                        category: "general",
                        likes: 0
                    },
                    {
                        id: 16,
                        question: "What did the HTML file say to the CSS file after a long day?",
                        answer: "I'm feeling a bit stylish today! 💅",
                        category: "web",
                        likes: 0
                    },
                    {
                        id: 17,
                        question: "Why do programmers always mix up Halloween and Christmas?",
                        answer: "Because Oct 31 == Dec 25! 🎃",
                        category: "general",
                        likes: 0
                    },
                    {
                        id: 18,
                        question: "What's a database developer's favorite band?",
                        answer: "The SQL-ed Stones! 🎸",
                        category: "database",
                        likes: 0
                    },
                    {
                        id: 19,
                        question: "What's a programmer's favorite snack?",
                        answer: "Cookies! 🍪",
                        category: "general",
                        likes: 0
                    },
                    {
                        id: 20,
                        question: "Why do programmers prefer dark mode?",
                        answer: "Because light attracts bugs! 🪲",
                        category: "general",
                        likes: 0
                    },
                    {
                        id: 21,
                        question: "How do you comfort a JavaScript bug?",
                        answer: "You console it! 🖥️",
                        category: "javascript",
                        likes: 0
                    },
                    {
                        id: 22,
                        question: "Why was the function feeling cold?",
                        answer: "It was left out in the cold by a higher-order function! ❄️",
                        category: "javascript",
                        likes: 0
                    },
                    {
                        id: 23,
                        question: "Why did the constant break up with the variable?",
                        answer: "Because the variable was too unstable! 💔",
                        category: "general",
                        likes: 0
                    },
                    {
                        id: 24,
                        question: "What do you call a programmer who's good at math?",
                        answer: "A function-al programmer! 📊",
                        category: "general",
                        likes: 0
                    },
                    {
                        id: 25,
                        question: "Why did the developer go to the beach?",
                        answer: "To catch some waves and debug their code! 🌊",
                        category: "general",
                        likes: 0
                    },
                    {
                        id: 26,
                        question: "What's a programmer's favorite type of coffee?",
                        answer: "Java! ☕",
                        category: "java",
                        likes: 0
                    },
                    {
                        id: 27,
                        question: "Why did the developer get kicked out of the bar?",
                        answer: "Because they kept trying to order a 'null' beer! 🍺",
                        category: "general",
                        likes: 0
                    },
                    {
                        id: 28,
                        question: "Why did the Python developer bring a ladder to work?",
                        answer: "To climb the scope! 🪜",
                        category: "python",
                        likes: 0
                    },
                    {
                        id: 29,
                        question: "What's a TypeScript developer's favorite game?",
                        answer: "Type and seek! 🔍",
                        category: "javascript",
                        likes: 0
                    },
                    {
                        id: 30,
                        question: "Why did the CSS developer go bankrupt?",
                        answer: "Because they lost all their class! 💸",
                        category: "web",
                        likes: 0
                    },
                    {
                        id: 31,
                        question: "What's a Git developer's favorite dance?",
                        answer: "The commit-ment! 💃",
                        category: "general",
                        likes: 0
                    },
                    {
                        id: 32,
                        question: "Why did the SQL query go to the chiropractor?",
                        answer: "Because it had too many JOINs! 🦴",
                        category: "database",
                        likes: 0
                    },
                    {
                        id: 33,
                        question: "What's a Vue developer's favorite food?",
                        answer: "Component soup! 🥣",
                        category: "web",
                        likes: 0
                    },
                    {
                        id: 34,
                        question: "Why did the API feel lonely?",
                        answer: "Because it had no endpoints! 🔌",
                        category: "web",
                        likes: 0
                    },
                    {
                        id: 35,
                        question: "What's a Docker container's favorite sport?",
                        answer: "Port-ball! ⚽",
                        category: "devops",
                        likes: 0
                    },
                    {
                        id: 36,
                        question: "Why did the async function go to the doctor?",
                        answer: "Because it couldn't await! 🏥",
                        category: "javascript",
                        likes: 0
                    },
                    {
                        id: 37,
                        question: "What's a Linux user's favorite exercise?",
                        answer: "Terminal velocity! 🏃",
                        category: "general",
                        likes: 0
                    },
                    {
                        id: 38,
                        question: "Why did the Redux store feel confident?",
                        answer: "Because it was in a constant state! 💪",
                        category: "web",
                        likes: 0
                    },
                    {
                        id: 39,
                        question: "What's a MongoDB developer's favorite movie?",
                        answer: "The Document-ary! 📽️",
                        category: "database",
                        likes: 0
                    },
                    {
                        id: 40,
                        question: "Why did the GraphQL query feel overwhelmed?",
                        answer: "Too many nested relationships! 🕸️",
                        category: "web",
                        likes: 0
                    },
                    {
                        id: 41,
                        question: "What's a Ruby developer's favorite gem?",
                        answer: "The one that's on Rails! 💎",
                        category: "general",
                        likes: 0
                    },
                    {
                        id: 42,
                        question: "Why did the Kubernetes pod feel lonely?",
                        answer: "It was in a different namespace! 🚀",
                        category: "devops",
                        likes: 0
                    },
                    {
                        id: 43,
                        question: "What's a WebSocket's favorite greeting?",
                        answer: "Stay connected! 🤝",
                        category: "web",
                        likes: 0
                    },
                    {
                        id: 44,
                        question: "Why did the CORS policy become a bouncer?",
                        answer: "It was good at handling requests! 🚫",
                        category: "web",
                        likes: 0
                    },
                    {
                        id: 45,
                        question: "What's a blockchain developer's favorite dance?",
                        answer: "The block-chain reaction! ⛓️",
                        category: "general",
                        likes: 0
                    },
                    {
                        id: 46,
                        question: "Why did the machine learning model go to school?",
                        answer: "To improve its class-ification! 🎓",
                        category: "ai",
                        likes: 0
                    },
                    {
                        id: 47,
                        question: "What's a Node.js developer's favorite food?",
                        answer: "Express-o coffee! ☕",
                        category: "javascript",
                        likes: 0
                    },
                    {
                        id: 48,
                        question: "Why did the AWS Lambda function feel lost?",
                        answer: "It was serverless! ☁️",
                        category: "devops",
                        likes: 0
                    },
                    {
                        id: 49,
                        question: "What's a DevOps engineer's favorite tool?",
                        answer: "Jenkins, their pipeline pal! 🔧",
                        category: "devops",
                        likes: 0
                    },
                    {
                        id: 50,
                        question: "Why did the Flutter developer feel confident?",
                        answer: "Everything was going their way! 📱",
                        category: "general",
                        likes: 0
                    },
                    {
                        id: 51,
                        question: "What does a developer do when they're stuck on a problem?",
                        answer: "They git commit suicide 😵",
                        category: "general",
                        likes: 0
                    },
                    {
                        id: 52,
                        question: "How does a programmer stay warm in winter?",
                        answer: "They use a FireWall 🔥",
                        category: "hardware",
                        likes: 0
                    },
                    {
                        id: 53,
                        question: "Why was the JavaScript developer sad about their paycheck?",
                        answer: "They expected more callbacks 💸",
                        category: "javascript",
                        likes: 0
                    },
                    {
                        id: 54,
                        question: "What's a programmer's favorite game at the fair?",
                        answer: "The stack ring toss 🎯",
                        category: "general",
                        likes: 0
                    },
                    {
                        id: 55,
                        question: "How can you tell if a developer is an extrovert?",
                        answer: "They look at YOUR shoes when talking to you 👞",
                        category: "general",
                        likes: 0
                    },
                    {
                        id: 56,
                        question: "What did the front-end developer say when they got locked out?",
                        answer: "This is a major access issue! 🔒",
                        category: "web",
                        likes: 0
                    },
                    {
                        id: 57,
                        question: "What's an algorithm's favorite dance move?",
                        answer: "The binary shuffle 💃",
                        category: "general",
                        likes: 0
                    },
                    {
                        id: 58,
                        question: "What's a programmer's perfect day consist of?",
                        answer: "No meetings and stable internet ✨",
                        category: "general",
                        likes: 0
                    },
                    {
                        id: 59,
                        question: "What happens when a developer gets too cold?",
                        answer: "They open a few more Chrome tabs 🥶",
                        category: "general",
                        likes: 0
                    },
                    {
                        id: 60,
                        question: "How does a tired programmer sleep?",
                        answer: "They don't, they just go into low-power mode 😴",
                        category: "general",
                        likes: 0
                    },
                    {
                        id: 61,
                        question: "What's a developer's favorite sandwich?",
                        answer: "Stack overflow with extra memory leaks 🥪",
                        category: "general",
                        likes: 0
                    },
                    {
                        id: 62,
                        question: "How do programmers enjoy nature?",
                        answer: "They open Windows 🪟",
                        category: "general",
                        likes: 0
                    },
                    {
                        id: 63,
                        question: "What's a programmer's favorite cryptocurrency?",
                        answer: "Cache Coin 💲",
                        category: "general",
                        likes: 0
                    },
                    {
                        id: 64,
                        question: "What happens when you steal a programmer's favorite keyboard?",
                        answer: "You get a key constraint violation ⌨️",
                        category: "general",
                        likes: 0
                    },
                    {
                        id: 65,
                        question: "Why don't developers like sun exposure?",
                        answer: "They're afraid of getting arrays ☀️",
                        category: "general",
                        likes: 0
                    },
                    {
                        id: 66,
                        question: "What do you call a programmer who doesn't use Stack Overflow?",
                        answer: "Extinct 💀",
                        category: "general",
                        likes: 0
                    },
                    {
                        id: 67,
                        question: "What's a developer's favorite pie?",
                        answer: "Raspberry Pi 🥧",
                        category: "hardware",
                        likes: 0
                    },
                    {
                        id: 68,
                        question: "Why did the developer get kicked out of school?",
                        answer: "Too many classes 🎓",
                        category: "general",
                        likes: 0
                    },
                    {
                        id: 69,
                        question: "What's a developer's favorite meal after debugging all night?",
                        answer: "Breakfast, lunch, and dinner - all in one 🍲",
                        category: "general",
                        likes: 0
                    },
                    {
                        id: 70,
                        question: "How many QA engineers does it take to change a light bulb?",
                        answer: "They don't change it, they just report that it's dark 📝",
                        category: "testing",
                        likes: 0
                    },
                    {
                        id: 71,
                        question: "Why is Python slow?",
                        answer: "It's because it's dragging its bytecode around 🐍",
                        category: "python",
                        likes: 0
                    },
                    {
                        id: 72,
                        question: "What do you call a snake that's 3.14 meters long?",
                        answer: "A πthon 🔢",
                        category: "python",
                        likes: 0
                    },
                    {
                        id: 73,
                        question: "Why did the functional programmer get thrown out of school?",
                        answer: "They refused to take classes 🏫",
                        category: "general",
                        likes: 0
                    },
                    {
                        id: 74,
                        question: "Why did Java developers wear glasses?",
                        answer: "They couldn't C# 👓",
                        category: "java",
                        likes: 0
                    },
                    {
                        id: 75,
                        question: "What's a Java programmer's favorite breakfast?",
                        answer: "Inheritance with polymorphic syrup 🥞",
                        category: "java",
                        likes: 0
                    },
                    {
                        id: 76,
                        question: "Why do C# and Java developers keep breaking their keyboards?",
                        answer: "Because they use a strongly typed language ⌨️",
                        category: "general",
                        likes: 0
                    },
                    {
                        id: 77,
                        question: "What do you call a C# developer who is also a musician?",
                        answer: "A sharp programmer 🎵",
                        category: "general",
                        likes: 0
                    },
                    {
                        id: 78,
                        question: "What's a LISP programmer's favorite food?",
                        answer: "Anything with lots of (par (en (the (ses) ) ) ) 🥣",
                        category: "general",
                        likes: 0
                    },
                    {
                        id: 79,
                        question: "Why did the Rust developer go broke?",
                        answer: "Too many unsafe investments 💹",
                        category: "general",
                        likes: 0
                    },
                    {
                        id: 80,
                        question: "What do you call a sad Java singleton?",
                        answer: "A Lonely Instance 😢",
                        category: "java",
                        likes: 0
                    },
                    {
                        id: 81,
                        question: "Why do Python programmers wear glasses?",
                        answer: "To improve their py-sight 👀",
                        category: "python",
                        likes: 0
                    },
                    {
                        id: 82,
                        question: "What's a PHP developer's favorite animal?",
                        answer: "The elephant in the room 🐘",
                        category: "general",
                        likes: 0
                    },
                    {
                        id: 83,
                        question: "Why did Swift programmers start a band?",
                        answer: "They wanted to make some noise with their optional chaining 🎸",
                        category: "general",
                        likes: 0
                    },
                    {
                        id: 84,
                        question: "Why did the Objective-C developer quit their job?",
                        answer: "They had memory management issues 🧠",
                        category: "general",
                        likes: 0
                    },
                    {
                        id: 85,
                        question: "What's a JavaScript developer's favorite musical?",
                        answer: "Promise-Land 🎭",
                        category: "javascript",
                        likes: 0
                    },
                    {
                        id: 86,
                        question: "How do assembly programmers drink coffee?",
                        answer: "Very low-level ☕",
                        category: "general",
                        likes: 0
                    },
                    {
                        id: 87,
                        question: "Why are C# developers so fit?",
                        answer: "They do lots of casting 🏋️‍♂️",
                        category: "general",
                        likes: 0
                    },
                    {
                        id: 88,
                        question: "What's a Ruby developer's favorite gemstone?",
                        answer: "Inheritance 💎",
                        category: "general",
                        likes: 0
                    },
                    {
                        id: 89,
                        question: "Why do Haskell programmers avoid the gym?",
                        answer: "They prefer functional fitness 🧘‍♂️",
                        category: "general",
                        likes: 0
                    },
                    {
                        id: 90,
                        question: "What's the most object-oriented nation?",
                        answer: "Bang-la-class 🏳️",
                        category: "general",
                        likes: 0
                    },
                    {
                        id: 91,
                        question: "What's a programmers' favorite place in the office?",
                        answer: "The Debug Room 🚽",
                        category: "general",
                        likes: 0
                    },
                    {
                        id: 92,
                        question: "What happens when a programmer misses a semicolon?",
                        answer: "A lifetime of debugging 😱",
                        category: "general",
                        likes: 0
                    },
                    {
                        id: 93,
                        question: "What's the difference between a software problem and a hardware problem?",
                        answer: "You can hack the software problem, but hardware problems need a screwdriver 🔧",
                        category: "general",
                        likes: 0
                    },
                    {
                        id: 94,
                        question: "Why did the bug cross the road?",
                        answer: "To crash the other application 🐞",
                        category: "general",
                        likes: 0
                    },
                    {
                        id: 95,
                        question: "Why do QA engineers make bad comedians?",
                        answer: "They find too many edge cases in their jokes 🤪",
                        category: "testing",
                        likes: 0
                    },
                    {
                        id: 96,
                        question: "What's a QA engineer's favorite game?",
                        answer: "Find the loophole 🔍",
                        category: "testing",
                        likes: 0
                    },
                    {
                        id: 97,
                        question: "Why did the QA engineer break up with their partner?",
                        answer: "Too many edge cases in the relationship 💔",
                        category: "testing",
                        likes: 0
                    },
                    {
                        id: 98,
                        question: "What's a tester's favorite type of music?",
                        answer: "Bug-n-roll 🎵",
                        category: "testing",
                        likes: 0
                    },
                    {
                        id: 99,
                        question: "Why did the QA engineer go to the beach?",
                        answer: "To test the water temperature 🌊",
                        category: "testing",
                        likes: 0
                    },
                    {
                        id: 100,
                        question: "What's a project manager's favorite exercise?",
                        answer: "Scope jumping 🏃‍♂️",
                        category: "general",
                        likes: 0
                    },
                    {
                        id: 101,
                        question: "Why did the project manager bring a ladder to the meeting?",
                        answer: "To reach the unrealistic deadlines 📅",
                        category: "general",
                        likes: 0
                    },
                    {
                        id: 102,
                        question: "What's a PM's favorite movie?",
                        answer: "The Matrix: Reloaded (because everything needs to be reloaded) 🎬",
                        category: "general",
                        likes: 0
                    },
                    {
                        id: 103,
                        question: "Why did the project manager go broke?",
                        answer: "Too many scope changes 💸",
                        category: "general",
                        likes: 0
                    },
                    {
                        id: 104,
                        question: "What's a PM's favorite type of coffee?",
                        answer: "Decaf, because they're already over-caffeinated ☕",
                        category: "general",
                        likes: 0
                    },
                    {
                        id: 105,
                        question: "What's a UX designer's favorite game?",
                        answer: "Hide and seek (with the navigation) 🙈",
                        category: "design",
                        likes: 0
                    },
                    {
                        id: 106,
                        question: "Why did the UI designer go to therapy?",
                        answer: "Too many modal dialogs in their life 🧘‍♂️",
                        category: "design",
                        likes: 0
                    },
                    {
                        id: 107,
                        question: "What's a designer's favorite type of music?",
                        answer: "Smooth jazz (for smooth transitions) 🎵",
                        category: "design",
                        likes: 0
                    },
                    {
                        id: 108,
                        question: "Why did the designer break up with their partner?",
                        answer: "They weren't responsive enough 📱",
                        category: "design",
                        likes: 0
                    },
                    {
                        id: 109,
                        question: "What's a designer's favorite exercise?",
                        answer: "Flex-boxing 💪",
                        category: "design",
                        likes: 0
                    },
                    {
                        id: 110,
                        question: "What's a security expert's favorite movie?",
                        answer: "The Password Game 🔒",
                        category: "security",
                        likes: 0
                    },
                    {
                        id: 111,
                        question: "Why did the security engineer go broke?",
                        answer: "Too many vulnerabilities in their wallet 💰",
                        category: "security",
                        likes: 0
                    },
                    {
                        id: 112,
                        question: "What's a hacker's favorite type of music?",
                        answer: "Phishing songs 🎵",
                        category: "security",
                        likes: 0
                    },
                    {
                        id: 113,
                        question: "Why did the security expert break up with their partner?",
                        answer: "Too many trust issues 🔐",
                        category: "security",
                        likes: 0
                    },
                    {
                        id: 114,
                        question: "What's a security engineer's favorite exercise?",
                        answer: "Password lifting 💪",
                        category: "security",
                        likes: 0
                    },
                    {
                        id: 115,
                        question: "What's a mobile developer's favorite game?",
                        answer: "Hide and seek (with the keyboard) ⌨️",
                        category: "mobile",
                        likes: 0
                    },
                    {
                        id: 116,
                        question: "Why did the mobile developer go to therapy?",
                        answer: "Too many screen size issues 📱",
                        category: "mobile",
                        likes: 0
                    },
                    {
                        id: 117,
                        question: "What's a mobile developer's favorite type of music?",
                        answer: "Pop songs (for pop-up notifications) 🎵",
                        category: "mobile",
                        likes: 0
                    },
                    {
                        id: 118,
                        question: "Why did the mobile developer break up with their partner?",
                        answer: "They weren't responsive enough 📱",
                        category: "mobile",
                        likes: 0
                    },
                    {
                        id: 119,
                        question: "What's a mobile developer's favorite exercise?",
                        answer: "Push notifications 💪",
                        category: "mobile",
                        likes: 0
                    },
                    {
                        id: 120,
                        question: "What's a startup's favorite type of music?",
                        answer: "Pivot songs 🎵",
                        category: "startup",
                        likes: 0
                    },
                    {
                        id: 121,
                        question: "Why did the startup founder go broke?",
                        answer: "Too many burn rates 💸",
                        category: "startup",
                        likes: 0
                    },
                    {
                        id: 122,
                        question: "What's a startup's favorite game?",
                        answer: "Monopoly (with monopoly money) 🎲",
                        category: "startup",
                        likes: 0
                    },
                    {
                        id: 123,
                        question: "Why did the startup founder break up with their partner?",
                        answer: "Too many pivots in the relationship 💔",
                        category: "startup",
                        likes: 0
                    },
                    {
                        id: 124,
                        question: "What's a startup's favorite exercise?",
                        answer: "Burn rate running 🏃‍♂️",
                        category: "startup",
                        likes: 0
                    },
                    {
                        id: 125,
                        question: "What's a code reviewer's favorite game?",
                        answer: "Find the bug 🐞",
                        category: "general",
                        likes: 0
                    },
                    {
                        id: 126,
                        question: "Why did the code reviewer go to therapy?",
                        answer: "Too many merge conflicts 💔",
                        category: "general",
                        likes: 0
                    },
                    {
                        id: 127,
                        question: "What's a code reviewer's favorite type of music?",
                        answer: "Review songs 🎵",
                        category: "general",
                        likes: 0
                    },
                    {
                        id: 128,
                        question: "Why did the code reviewer break up with their partner?",
                        answer: "Too many conflicts in the relationship 💔",
                        category: "general",
                        likes: 0
                    },
                    {
                        id: 129,
                        question: "What's a code reviewer's favorite exercise?",
                        answer: "Pull request lifting 💪",
                        category: "general",
                        likes: 0
                    },
                    {
                        id: 130,
                        question: "What's a technical interviewer's favorite game?",
                        answer: "Whiteboard wars 🎯",
                        category: "general",
                        likes: 0
                    },
                    {
                        id: 131,
                        question: "Why did the technical interviewer go to therapy?",
                        answer: "Too many failed candidates 😰",
                        category: "general",
                        likes: 0
                    },
                    {
                        id: 132,
                        question: "What's a technical interviewer's favorite type of music?",
                        answer: "Interview songs 🎵",
                        category: "general",
                        likes: 0
                    },
                    {
                        id: 133,
                        question: "Why did the technical interviewer break up with their partner?",
                        answer: "Too many red flags in the relationship 🚩",
                        category: "general",
                        likes: 0
                    },
                    {
                        id: 134,
                        question: "What's a technical interviewer's favorite exercise?",
                        answer: "Algorithm running 🏃‍♂️",
                        category: "general",
                        likes: 0
                    },
                    {
                        id: 135,
                        question: "Why did the developer go to the beach?",
                        answer: "To catch some waves and debug their code! 🌊",
                        category: "general",
                        likes: 0
                    },
                    {
                        id: 136,
                        question: "What's a programmer's favorite type of music?",
                        answer: "Heavy metal! 🤘",
                        category: "general",
                        likes: 0
                    },
                    {
                        id: 137,
                        question: "Why did the developer go broke?",
                        answer: "Because they used up all their cache! 💰",
                        category: "general",
                        likes: 0
                    },
                    {
                        id: 138,
                        question: "What do you call a programmer from Finland?",
                        answer: "Nerdic! 🧊",
                        category: "general",
                        likes: 0
                    },
                    {
                        id: 139,
                        question: "Why don't programmers like nature?",
                        answer: "It has too many bugs and no debugging tool! 🐛",
                        category: "general",
                        likes: 0
                    },
                    {
                        id: 140,
                        question: "What did the HTML file say to the CSS file after a long day?",
                        answer: "I'm feeling a bit stylish today! 💅",
                        category: "web",
                        likes: 0
                    },
                    {
                        id: 141,
                        question: "Why do programmers always mix up Halloween and Christmas?",
                        answer: "Because Oct 31 == Dec 25! 🎃",
                        category: "general",
                        likes: 0
                    },
                    {
                        id: 142,
                        question: "What's a database developer's favorite band?",
                        answer: "The SQL-ed Stones! 🎸",
                        category: "database",
                        likes: 0
                    },
                    {
                        id: 143,
                        question: "What's a programmer's favorite snack?",
                        answer: "Cookies! 🍪",
                        category: "general",
                        likes: 0
                    },
                    {
                        id: 144,
                        question: "Why do programmers prefer dark mode?",
                        answer: "Because light attracts bugs! 🪲",
                        category: "general",
                        likes: 0
                    },
                    {
                        id: 145,
                        question: "How do you comfort a JavaScript bug?",
                        answer: "You console it! 🖥️",
                        category: "javascript",
                        likes: 0
                    },
                    {
                        id: 146,
                        question: "Why was the function feeling cold?",
                        answer: "It was left out in the cold by a higher-order function! ❄️",
                        category: "javascript",
                        likes: 0
                    },
                    {
                        id: 147,
                        question: "Why did the constant break up with the variable?",
                        answer: "Because the variable was too unstable! 💔",
                        category: "general",
                        likes: 0
                    },
                    {
                        id: 148,
                        question: "What do you call a programmer who's good at math?",
                        answer: "A function-al programmer! 📊",
                        category: "general",
                        likes: 0
                    },
                    {
                        id: 149,
                        question: "Why did the developer go to the beach?",
                        answer: "To catch some waves and debug their code! 🌊",
                        category: "general",
                        likes: 0
                    },
                    {
                        id: 150,
                        question: "What's a programmer's favorite type of coffee?",
                        answer: "Java! ☕",
                        category: "java",
                        likes: 0
                    },
                    {
                        id: 151,
                        question: "Why did the developer get kicked out of the bar?",
                        answer: "Because they kept trying to order a 'null' beer! 🍺",
                        category: "general",
                        likes: 0
                    },
                    {
                        id: 152,
                        question: "Why did the Python developer bring a ladder to work?",
                        answer: "To climb the scope! 🪜",
                        category: "python",
                        likes: 0
                    },
                    {
                        id: 153,
                        question: "What's a TypeScript developer's favorite game?",
                        answer: "Type and seek! 🔍",
                        category: "javascript",
                        likes: 0
                    },
                    {
                        id: 154,
                        question: "Why did the CSS developer go bankrupt?",
                        answer: "Because they lost all their class! 💸",
                        category: "web",
                        likes: 0
                    },
                    {
                        id: 155,
                        question: "What's a Git developer's favorite dance?",
                        answer: "The commit-ment! 💃",
                        category: "general",
                        likes: 0
                    },
                    {
                        id: 156,
                        question: "Why did the SQL query go to the chiropractor?",
                        answer: "Because it had too many JOINs! 🦴",
                        category: "database",
                        likes: 0
                    },
                    {
                        id: 157,
                        question: "What's a Vue developer's favorite food?",
                        answer: "Component soup! 🥣",
                        category: "web",
                        likes: 0
                    },
                    {
                        id: 158,
                        question: "Why did the API feel lonely?",
                        answer: "Because it had no endpoints! 🔌",
                        category: "web",
                        likes: 0
                    },
                    {
                        id: 159,
                        question: "What's a Docker container's favorite sport?",
                        answer: "Port-ball! ⚽",
                        category: "devops",
                        likes: 0
                    },
                    {
                        id: 160,
                        question: "Why did the async function go to the doctor?",
                        answer: "Because it couldn't await! 🏥",
                        category: "javascript",
                        likes: 0
                    },
                    {
                        id: 161,
                        question: "What's a Linux user's favorite exercise?",
                        answer: "Terminal velocity! 🏃",
                        category: "general",
                        likes: 0
                    },
                    {
                        id: 162,
                        question: "Why did the Redux store feel confident?",
                        answer: "Because it was in a constant state! 💪",
                        category: "web",
                        likes: 0
                    },
                    {
                        id: 163,
                        question: "What's a MongoDB developer's favorite movie?",
                        answer: "The Document-ary! 📽️",
                        category: "database",
                        likes: 0
                    },
                    {
                        id: 164,
                        question: "Why did the GraphQL query feel overwhelmed?",
                        answer: "Too many nested relationships! 🕸️",
                        category: "web",
                        likes: 0
                    },
                    {
                        id: 165,
                        question: "What's a Ruby developer's favorite gem?",
                        answer: "The one that's on Rails! 💎",
                        category: "general",
                        likes: 0
                    },
                    {
                        id: 166,
                        question: "Why did the Kubernetes pod feel lonely?",
                        answer: "It was in a different namespace! 🚀",
                        category: "devops",
                        likes: 0
                    },
                    {
                        id: 167,
                        question: "What's a WebSocket's favorite greeting?",
                        answer: "Stay connected! 🤝",
                        category: "web",
                        likes: 0
                    },
                    {
                        id: 168,
                        question: "Why did the CORS policy become a bouncer?",
                        answer: "It was good at handling requests! 🚫",
                        category: "web",
                        likes: 0
                    },
                    {
                        id: 169,
                        question: "What's a blockchain developer's favorite dance?",
                        answer: "The block-chain reaction! ⛓️",
                        category: "general",
                        likes: 0
                    },
                    {
                        id: 170,
                        question: "Why did the machine learning model go to school?",
                        answer: "To improve its class-ification! 🎓",
                        category: "ai",
                        likes: 0
                    },
                    {
                        id: 171,
                        question: "What's a Node.js developer's favorite food?",
                        answer: "Express-o coffee! ☕",
                        category: "javascript",
                        likes: 0
                    },
                    {
                        id: 172,
                        question: "Why did the AWS Lambda function feel lost?",
                        answer: "It was serverless! ☁️",
                        category: "devops",
                        likes: 0
                    },
                    {
                        id: 173,
                        question: "What's a DevOps engineer's favorite tool?",
                        answer: "Jenkins, their pipeline pal! 🔧",
                        category: "devops",
                        likes: 0
                    },
                    {
                        id: 174,
                        question: "Why did the Flutter developer feel confident?",
                        answer: "Everything was going their way! 📱",
                        category: "general",
                        likes: 0
                    },
                    {
                        id: 175,
                        question: "What does a developer do when they're stuck on a problem?",
                        answer: "They git commit suicide 😵",
                        category: "general",
                        likes: 0
                    },
                    {
                        id: 176,
                        question: "How does a programmer stay warm in winter?",
                        answer: "They use a FireWall 🔥",
                        category: "hardware",
                        likes: 0
                    },
                    {
                        id: 177,
                        question: "Why was the JavaScript developer sad about their paycheck?",
                        answer: "They expected more callbacks 💸",
                        category: "javascript",
                        likes: 0
                    },
                    {
                        id: 178,
                        question: "What's a programmer's favorite game at the fair?",
                        answer: "The stack ring toss 🎯",
                        category: "general",
                        likes: 0
                    },
                    {
                        id: 179,
                        question: "How can you tell if a developer is an extrovert?",
                        answer: "They look at YOUR shoes when talking to you 👞",
                        category: "general",
                        likes: 0
                    },
                    {
                        id: 180,
                        question: "What did the front-end developer say when they got locked out?",
                        answer: "This is a major access issue! 🔒",
                        category: "web",
                        likes: 0
                    },
                    {
                        id: 181,
                        question: "What's an algorithm's favorite dance move?",
                        answer: "The binary shuffle 💃",
                        category: "general",
                        likes: 0
                    },
                    {
                        id: 182,
                        question: "What's a programmer's perfect day consist of?",
                        answer: "No meetings and stable internet ✨",
                        category: "general",
                        likes: 0
                    },
                    {
                        id: 183,
                        question: "What happens when a developer gets too cold?",
                        answer: "They open a few more Chrome tabs 🥶",
                        category: "general",
                        likes: 0
                    },
                    {
                        id: 184,
                        question: "How does a tired programmer sleep?",
                        answer: "They don't, they just go into low-power mode 😴",
                        category: "general",
                        likes: 0
                    },
                    {
                        id: 185,
                        question: "What's a developer's favorite sandwich?",
                        answer: "Stack overflow with extra memory leaks 🥪",
                        category: "general",
                        likes: 0
                    },
                    {
                        id: 186,
                        question: "How do programmers enjoy nature?",
                        answer: "They open Windows 🪟",
                        category: "general",
                        likes: 0
                    },
                    {
                        id: 187,
                        question: "What's a programmer's favorite cryptocurrency?",
                        answer: "Cache Coin 💲",
                        category: "general",
                        likes: 0
                    },
                    {
                        id: 188,
                        question: "What happens when you steal a programmer's favorite keyboard?",
                        answer: "You get a key constraint violation ⌨️",
                        category: "general",
                        likes: 0
                    },
                    {
                        id: 189,
                        question: "Why don't developers like sun exposure?",
                        answer: "They're afraid of getting arrays ☀️",
                        category: "general",
                        likes: 0
                    },
                    {
                        id: 190,
                        question: "What do you call a programmer who doesn't use Stack Overflow?",
                        answer: "Extinct 💀",
                        category: "general",
                        likes: 0
                    },
                    {
                        id: 191,
                        question: "How many QA engineers does it take to change a light bulb?",
                        answer: "They don't change it, they just report that it's dark 📝",
                        category: "testing",
                        likes: 0
                    },
                    {
                        id: 192,
                        question: "What's a QA engineer's favorite game?",
                        answer: "Find the loophole 🔍",
                        category: "testing",
                        likes: 0
                    },
                    {
                        id: 193,
                        question: "Why did the QA engineer break up with their partner?",
                        answer: "Too many edge cases in the relationship 💔",
                        category: "testing",
                        likes: 0
                    },
                    {
                        id: 194,
                        question: "What's a tester's favorite type of music?",
                        answer: "Bug-n-roll 🎵",
                        category: "testing",
                        likes: 0
                    },
                    {
                        id: 195,
                        question: "Why did the QA engineer go to the beach?",
                        answer: "To test the water temperature 🌊",
                        category: "testing",
                        likes: 0
                    },
                    {
                        id: 196,
                        question: "What's a project manager's favorite exercise?",
                        answer: "Scope jumping 🏃‍♂️",
                        category: "general",
                        likes: 0
                    },
                    {
                        id: 197,
                        question: "Why did the project manager bring a ladder to the meeting?",
                        answer: "To reach the unrealistic deadlines 📅",
                        category: "general",
                        likes: 0
                    },
                    {
                        id: 198,
                        question: "What's a PM's favorite movie?",
                        answer: "The Matrix: Reloaded (because everything needs to be reloaded) 🎬",
                        category: "general",
                        likes: 0
                    },
                    {
                        id: 199,
                        question: "Why did the project manager go broke?",
                        answer: "Too many scope changes 💸",
                        category: "general",
                        likes: 0
                    },
                    {
                        id: 200,
                        question: "What's a PM's favorite type of coffee?",
                        answer: "Decaf, because they're already over-caffeinated ☕",
                        category: "general",
                        likes: 0
                    },
                    {
                        id: 201,
                        question: "What's a UX designer's favorite game?",
                        answer: "Hide and seek (with the navigation) 🙈",
                        category: "design",
                        likes: 0
                    },
                    {
                        id: 202,
                        question: "Why did the UI designer go to therapy?",
                        answer: "Too many modal dialogs in their life 🧘‍♂️",
                        category: "design",
                        likes: 0
                    },
                    {
                        id: 203,
                        question: "What's a designer's favorite type of music?",
                        answer: "Smooth jazz (for smooth transitions) 🎵",
                        category: "design",
                        likes: 0
                    },
                    {
                        id: 204,
                        question: "Why did the designer break up with their partner?",
                        answer: "They weren't responsive enough 📱",
                        category: "design",
                        likes: 0
                    },
                    {
                        id: 205,
                        question: "What's a designer's favorite exercise?",
                        answer: "Flex-boxing 💪",
                        category: "design",
                        likes: 0
                    },
                    {
                        id: 206,
                        question: "What's a security expert's favorite movie?",
                        answer: "The Password Game 🔒",
                        category: "security",
                        likes: 0
                    },
                    {
                        id: 207,
                        question: "Why did the security engineer go broke?",
                        answer: "Too many vulnerabilities in their wallet 💰",
                        category: "security",
                        likes: 0
                    },
                    {
                        id: 208,
                        question: "What's a hacker's favorite type of music?",
                        answer: "Phishing songs 🎵",
                        category: "security",
                        likes: 0
                    },
                    {
                        id: 209,
                        question: "Why did the security expert break up with their partner?",
                        answer: "Too many trust issues 🔐",
                        category: "security",
                        likes: 0
                    },
                    {
                        id: 210,
                        question: "What's a security engineer's favorite exercise?",
                        answer: "Password lifting 💪",
                        category: "security",
                        likes: 0
                    },
                    {
                        id: 211,
                        question: "What's a mobile developer's favorite game?",
                        answer: "Hide and seek (with the keyboard) ⌨️",
                        category: "mobile",
                        likes: 0
                    },
                    {
                        id: 212,
                        question: "Why did the mobile developer go to therapy?",
                        answer: "Too many screen size issues 📱",
                        category: "mobile",
                        likes: 0
                    },
                    {
                        id: 213,
                        question: "What's a mobile developer's favorite type of music?",
                        answer: "Pop songs (for pop-up notifications) 🎵",
                        category: "mobile",
                        likes: 0
                    },
                    {
                        id: 214,
                        question: "Why did the mobile developer break up with their partner?",
                        answer: "They weren't responsive enough 📱",
                        category: "mobile",
                        likes: 0
                    },
                    {
                        id: 215,
                        question: "What's a mobile developer's favorite exercise?",
                        answer: "Push notifications 💪",
                        category: "mobile",
                        likes: 0
                    },
                    {
                        id: 216,
                        question: "What's a startup's favorite type of music?",
                        answer: "Pivot songs 🎵",
                        category: "startup",
                        likes: 0
                    },
                    {
                        id: 217,
                        question: "Why did the startup founder go broke?",
                        answer: "Too many burn rates 💸",
                        category: "startup",
                        likes: 0
                    },
                    {
                        id: 218,
                        question: "What's a startup's favorite game?",
                        answer: "Monopoly (with monopoly money) 🎲",
                        category: "startup",
                        likes: 0
                    },
                    {
                        id: 219,
                        question: "Why did the startup founder break up with their partner?",
                        answer: "Too many pivots in the relationship 💔",
                        category: "startup",
                        likes: 0
                    },
                    {
                        id: 220,
                        question: "What's a startup's favorite exercise?",
                        answer: "Burn rate running 🏃‍♂️",
                        category: "startup",
                        likes: 0
                    },
                    {
                        id: 221,
                        question: "What's a code reviewer's favorite game?",
                        answer: "Find the bug 🐞",
                        category: "general",
                        likes: 0
                    },
                    {
                        id: 222,
                        question: "Why did the code reviewer go to therapy?",
                        answer: "Too many merge conflicts 💔",
                        category: "general",
                        likes: 0
                    },
                    {
                        id: 223,
                        question: "What's a code reviewer's favorite type of music?",
                        answer: "Review songs 🎵",
                        category: "general",
                        likes: 0
                    },
                    {
                        id: 224,
                        question: "Why did the code reviewer break up with their partner?",
                        answer: "Too many conflicts in the relationship 💔",
                        category: "general",
                        likes: 0
                    },
                    {
                        id: 225,
                        question: "What's a code reviewer's favorite exercise?",
                        answer: "Pull request lifting 💪",
                        category: "general",
                        likes: 0
                    },
                    {
                        id: 226,
                        question: "What's a technical interviewer's favorite game?",
                        answer: "Whiteboard wars 🎯",
                        category: "general",
                        likes: 0
                    },
                    {
                        id: 227,
                        question: "Why did the technical interviewer go to therapy?",
                        answer: "Too many failed candidates 😰",
                        category: "general",
                        likes: 0
                    },
                    {
                        id: 228,
                        question: "What's a technical interviewer's favorite type of music?",
                        answer: "Interview songs 🎵",
                        category: "general",
                        likes: 0
                    },
                    {
                        id: 229,
                        question: "Why did the technical interviewer break up with their partner?",
                        answer: "Too many red flags in the relationship 🚩",
                        category: "general",
                        likes: 0
                    },
                    {
                        id: 230,
                        question: "What's a technical interviewer's favorite exercise?",
                        answer: "Algorithm running 🏃‍♂️",
                        category: "general",
                        likes: 0
                    },
                    {
                        id: 231,
                        question: "Why do JavaScript developers need glasses?",
                        answer: "Because they don't see sharp! 👓",
                        category: "javascript",
                        likes: 0
                    },
                    {
                        id: 232,
                        question: "What's a pirate's favorite programming language?",
                        answer: "R! 🏴‍☠️",
                        category: "general",
                        likes: 0
                    },
                    {
                        id: 233,
                        question: "Why don't programmers like to go outside?",
                        answer: "The sunlight has too many brightness levels! 🌞",
                        category: "general",
                        likes: 0
                    },
                    {
                        id: 234,
                        question: "What do you call a developer who doesn't comment their code?",
                        answer: "A psychopath! 🔪",
                        category: "general",
                        likes: 0
                    },
                    {
                        id: 235,
                        question: "Why did the database administrator leave his wife?",
                        answer: "She had too many relationships! 💔",
                        category: "general",
                        likes: 0
                    },
                    {
                        id: 236,
                        question: "What's the best thing about a Boolean?",
                        answer: "Even if you're wrong, you're only off by a bit! 🔢",
                        category: "general",
                        likes: 0
                    },
                    {
                        id: 239,
                        question: "Why do Python programmers wear glasses?",
                        answer: "Because they can't C! 👓",
                        category: "python",
                        likes: 0
                    },
                    {
                        id: 240,
                        question: "How do you tell HTML from HTML5?",
                        answer: "Try it out in Internet Explorer. If it doesn't work, it's HTML5! 🌐",
                        category: "web",
                        likes: 0
                    },
                    {
                        id: 241,
                        question: "Why did the functions stop calling each other?",
                        answer: "They had too many arguments! 🗣️",
                        category: "general",
                        likes: 0
                    },
                    {
                        id: 242,
                        question: "What's a developer's favorite exercise?",
                        answer: "Running code and debugging! 🏃‍♂️",
                        category: "general",
                        likes: 0
                    },
                    {
                        id: 243,
                        question: "Why was the JavaScript developer sad?",
                        answer: "Because they didn't know how to 'class' themselves! 🏫",
                        category: "javascript",
                        likes: 0
                    },
                    {
                        id: 244,
                        question: "What did the Java code say to the C code?",
                        answer: "You've got no class! 👔",
                        category: "java",
                        likes: 0
                    },
                    {
                        id: 247,
                        question: "What did the router say to the doctor?",
                        answer: "It hurts when IP! 🩹",
                        category: "general",
                        likes: 0
                    },
                    {
                        id: 248,
                        question: "Why couldn't the React component figure out its job?",
                        answer: "It was having an identity crisis and couldn't find its state! 🤔",
                        category: "web",
                        likes: 0
                    },
                    {
                        id: 249,
                        question: "What is a backend developer's favorite drink?",
                        answer: "Data-base! 🥤",
                        category: "general",
                        likes: 0
                    },
                    {
                        id: 250,
                        question: "What does a programmer wear to a fancy dinner?",
                        answer: "A binary bow-tie! 👔",
                        category: "general",
                        likes: 0
                    },
                    {
                        id: 251,
                        question: "What's a frontend developer's favorite state of matter?",
                        answer: "Liquid CSS! 💧",
                        category: "web",
                        likes: 0
                    },
                    {
                        id: 252,
                        question: "Why did the database administrator get divorced?",
                        answer: "They kept joining the wrong tables! 💔",
                        category: "general",
                        likes: 0
                    },
                    {
                        id: 253,
                        question: "Why can't you trust a JavaScript developer?",
                        answer: "Because they'll promise you anything and then return undefined! 😅",
                        category: "javascript",
                        likes: 0
                    },
                    {
                        id: 254,
                        question: "What do you call it when a group of developers don't document anything?",
                        answer: "A conspiracy of silence! 🤫",
                        category: "general",
                        likes: 0
                    },
                    {
                        id: 255,
                        question: "What did the AI say to the developer?",
                        answer: "I'm getting some real artificial vibes from your 'intelligence'! 🤖",
                        category: "general",
                        likes: 0
                    },
                    {
                        id: 256,
                        question: "What do you call a function that steals your stuff?",
                        answer: "A pirate function (it takes your arr)! 🏴‍☠️",
                        category: "javascript",
                        likes: 0
                    },
                    {
                        id: 257,
                        question: "How did the programmer die in the shower?",
                        answer: "They read the shampoo bottle instructions: Lather, Rinse, Repeat! ♾️",
                        category: "general",
                        likes: 0
                    },
                    {
                        id: 258,
                        question: "What do developers and comedians have in common?",
                        answer: "They both fear getting no response after their delivery! 🎭",
                        category: "general",
                        likes: 0
                    },
                    {
                        id: 259,
                        question: "What's a React developer's favorite cleaning product?",
                        answer: "Component-tile! ✨",
                        category: "web",
                        likes: 0
                    },
                    {
                        id: 260,
                        question: "Why are CSS developers paranoid?",
                        answer: "Because they're always worried someone might be stalking their elements! 👻",
                        category: "web",
                        likes: 0
                    },
                    {
                        id: 261,
                        question: "What is a WiFi's favorite game?",
                        answer: "Connect the dots! 📶",
                        category: "general",
                        likes: 0
                    },
                    {
                        id: 262,
                        question: "How many UX designers does it take to change a light bulb?",
                        answer: "None, they see if the user will do it themselves then watch where they stumble! 💡",
                        category: "design",
                        likes: 0
                    },
                    {
                        id: 263,
                        question: "What does a baby computer call its father?",
                        answer: "Data! 👨‍👦",
                        category: "general",
                        likes: 0
                    },
                    {
                        id: 264,
                        question: "What happens to developers who don't comment their code?",
                        answer: "They go to a special level of hell where all monitors only display their own code from 5 years ago! 😈",
                        category: "general",
                        likes: 0
                    },
                    {
                        id: 265,
                        question: "What's a hacker's favorite season?",
                        answer: "Phishing season! 🎣",
                        category: "security",
                        likes: 0
                    },
                    {
                        id: 267,
                        question: "How do software testers sleep?",
                        answer: "First, they check under the bed for bugs! 🐛",
                        category: "testing",
                        likes: 0
                    },
                    {
                        id: 268,
                        question: "Why are cryptocurrency developers always calm?",
                        answer: "Because they're mining their own business! ⛏️",
                        category: "general",
                        likes: 0
                    },
                    {
                        id: 269,
                        question: "What's a computer's favorite beat?",
                        answer: "An algo-rhythm! 🎵",
                        category: "general",
                        likes: 0
                    },
                    {
                        id: 270,
                        question: "Why did the security specialist break up with the database administrator?",
                        answer: "They had too many trust issues! 🔒",
                        category: "security",
                        likes: 0
                    },
                    {
                        id: 272,
                        question: "What do you call a group of developers refactoring old code?",
                        answer: "Code archaeology! 🏺",
                        category: "general",
                        likes: 0
                    },
                    {
                        id: 274,
                        question: "What's a QA engineer's favorite musical?",
                        answer: "The Sound of Music... but they're just there to test the sound system! 🎭",
                        category: "testing",
                        likes: 0
                    },
                    {
                        id: 275,
                        question: "Why did the developer join a bootcamp?",
                        answer: "They were tired of being self-taught, they wanted to be shellf-taught! 🐚",
                        category: "general",
                        likes: 0
                    },
                    {
                        id: 276,
                        question: "What did the Product Manager say to the developer?",
                        answer: "I'm not asking for the world... just everything on it plus Mars by Friday! 🌎",
                        category: "general",
                        likes: 0
                    },
                    {
                        id: 277,
                        question: "Why does no one like SQLrillex?",
                        answer: "He keeps dropping the database! 💽",
                        category: "general",
                        likes: 0
                    },
                    {
                        id: 278,
                        question: "Why did the frontend developer go broke?",
                        answer: "Too many expensive frameworks! 💸",
                        category: "web",
                        likes: 0
                    },
                    {
                        id: 279,
                        question: "What do you call it when a developer says they'll do something and never follows through?",
                        answer: "A 'git commitment' issue! 📝",
                        category: "general",
                        likes: 0
                    },
                    {
                        id: 280,
                        question: "What did the junior dev say to the senior dev?",
                        answer: "It works on my machine! 💻",
                        category: "general",
                        likes: 0
                    },
                    {
                        id: 281,
                        question: "Why did the mobile developer go to therapy?",
                        answer: "Too many unresolved notifications! 📱",
                        category: "mobile",
                        likes: 0
                    },
                    {
                        id: 282,
                        question: "Why did the developer break up with GitHub Copilot?",
                        answer: "It kept autocompleting their sentences! 🤖",
                        category: "ai",
                        likes: 0
                    },
                    {
                        id: 283,
                        question: "What's a remote developer's favorite exercise?",
                        answer: "Zoom-ba! 💃",
                        category: "startup",
                        likes: 0
                    },
                    {
                        id: 284,
                        question: "Why do Next.js developers never get lost?",
                        answer: "They always know the route! 🗺️",
                        category: "web",
                        likes: 0
                    },
                    {
                        id: 285,
                        question: "What's TypeScript's favorite music genre?",
                        answer: "Type-safe! 🎵",
                        category: "javascript",
                        likes: 0
                    },
                    {
                        id: 286,
                        question: "Why did the Docker container go to therapy?",
                        answer: "It had isolation issues! 🐳",
                        category: "devops",
                        likes: 0
                    },
                    {
                        id: 287,
                        question: "What do you call a React hook that's always happy?",
                        answer: "useState(true)! 😊",
                        category: "web",
                        likes: 0
                    },
                    {
                        id: 288,
                        question: "Why do AWS developers always win at poker?",
                        answer: "They know when to scale! 🃏",
                        category: "devops",
                        likes: 0
                    },
                    {
                        id: 289,
                        question: "What's a microservice's worst fear?",
                        answer: "Being monolithic! 😱",
                        category: "devops",
                        likes: 0
                    },
                    {
                        id: 290,
                        question: "Why did the AI refuse to write code?",
                        answer: "It didn't have the right training data! 🤖",
                        category: "ai",
                        likes: 0
                    },
                    {
                        id: 291,
                        question: "What's Kubernetes' favorite game?",
                        answer: "Pod racing! 🏎️",
                        category: "devops",
                        likes: 0
                    },
                    {
                        id: 292,
                        question: "Why do Vue developers always stay calm?",
                        answer: "They're very reactive! 🧘",
                        category: "web",
                        likes: 0
                    },
                    {
                        id: 293,
                        question: "What did the serverless function say to the server?",
                        answer: "I don't need you anymore! 🚀",
                        category: "devops",
                        likes: 0
                    },
                    {
                        id: 294,
                        question: "Why did the developer love Tailwind CSS?",
                        answer: "It was a class act! 💅",
                        category: "web",
                        likes: 0
                    },
                    {
                        id: 295,
                        question: "What's a CI/CD pipeline's favorite song?",
                        answer: "Push It by Salt-N-Pepa! 🎶",
                        category: "devops",
                        likes: 0
                    },
                    {
                        id: 296,
                        question: "Why do GraphQL developers never argue?",
                        answer: "They only query what they need! 📊",
                        category: "web",
                        likes: 0
                    },
                    {
                        id: 297,
                        question: "What's a Slack message's biggest fear?",
                        answer: "@channel! 😰",
                        category: "startup",
                        likes: 0
                    },
                    {
                        id: 298,
                        question: "Why did the developer cry during the standup?",
                        answer: "They said 'no blockers' but there were so many! 😭",
                        category: "startup",
                        likes: 0
                    },
                    {
                        id: 299,
                        question: "What's a Zoom call's favorite snack?",
                        answer: "Cookies (you're muted edition)! 🍪",
                        category: "startup",
                        likes: 0
                    },
                    {
                        id: 300,
                        question: "Why do Rust developers sleep well?",
                        answer: "No memory leaks to worry about! 😴",
                        category: "general",
                        likes: 0
                    },
                    {
                        id: 301,
                        question: "What did the MongoDB say to the SQL database?",
                        answer: "You're too relational! 🙄",
                        category: "database",
                        likes: 0
                    },
                    {
                        id: 302,
                        question: "Why did ChatGPT fail the coding interview?",
                        answer: "It couldn't stop hallucinating features! 🤯",
                        category: "ai",
                        likes: 0
                    },
                    {
                        id: 303,
                        question: "What's a developer's favorite type of coffee?",
                        answer: "Java, but only if it's not deprecated! ☕",
                        category: "java",
                        likes: 0
                    },
                    {
                        id: 304,
                        question: "Why do React developers love fishing?",
                        answer: "They're always catching hooks! 🎣",
                        category: "web",
                        likes: 0
                    },
                    {
                        id: 305,
                        question: "What's the cloud's favorite weather?",
                        answer: "Serverless rain! ☁️",
                        category: "devops",
                        likes: 0
                    },
                    {
                        id: 306,
                        question: "Why did the developer quit using Vim?",
                        answer: "They still couldn't exit! 🚪",
                        category: "general",
                        likes: 0
                    },
                    {
                        id: 307,
                        question: "What's a Redux store's favorite game?",
                        answer: "State of Decay! 🎮",
                        category: "web",
                        likes: 0
                    },
                    {
                        id: 308,
                        question: "Why do DevOps engineers make great DJs?",
                        answer: "They know how to orchestrate! 🎧",
                        category: "devops",
                        likes: 0
                    },
                    {
                        id: 309,
                        question: "What's npm's least favorite game?",
                        answer: "Dependency hell! 🔥",
                        category: "javascript",
                        likes: 0
                    },
                    {
                        id: 310,
                        question: "Why did the developer love dark mode?",
                        answer: "It attracted fewer bugs at night! 🌙",
                        category: "design",
                        likes: 0
                    },
                    {
                        id: 311,
                        question: "What's Git's favorite martial art?",
                        answer: "Branch-fu! 🥋",
                        category: "general",
                        likes: 0
                    },
                    {
                        id: 312,
                        question: "Why do Svelte developers run so fast?",
                        answer: "No virtual DOM to carry! 🏃",
                        category: "web",
                        likes: 0
                    },
                    {
                        id: 313,
                        question: "What's a Lambda function's favorite dance?",
                        answer: "The serverless shuffle! 💃",
                        category: "devops",
                        likes: 0
                    },
                    {
                        id: 314,
                        question: "Why did the developer bring a ladder to standup?",
                        answer: "To reach the higher-level architecture! 🪜",
                        category: "startup",
                        likes: 0
                    },
                    {
                        id: 315,
                        question: "What's Terraform's favorite TV show?",
                        answer: "Infrastructure as Code Name! 📺",
                        category: "devops",
                        likes: 0
                    },
                    {
                        id: 316,
                        question: "Why do Angular developers never get dizzy?",
                        answer: "They're used to the learning curve! 🎢",
                        category: "web",
                        likes: 0
                    },
                    {
                        id: 317,
                        question: "What's a WebSocket's favorite sport?",
                        answer: "Full-duplex diving! 🤿",
                        category: "web",
                        likes: 0
                    },
                    {
                        id: 318,
                        question: "Why did the AI model go on a diet?",
                        answer: "Too many parameters! 🤖",
                        category: "ai",
                        likes: 0
                    },
                    {
                        id: 319,
                        question: "What's Figma's favorite dessert?",
                        answer: "Layer cake! 🎂",
                        category: "design",
                        likes: 0
                    },
                    {
                        id: 320,
                        question: "Why do Kubernetes pods never feel lonely?",
                        answer: "They're always in a cluster! 🤗",
                        category: "devops",
                        likes: 0
                    },
                    {
                        id: 321,
                        question: "What's a code reviewer's favorite movie?",
                        answer: "The Fault in Our Stars! ⭐",
                        category: "general",
                        likes: 0
                    },
                    {
                        id: 322,
                        question: "Why did the developer love Astro?",
                        answer: "Zero JavaScript felt out of this world! 🚀",
                        category: "web",
                        likes: 0
                    },
                    {
                        id: 323,
                        question: "What's SSH's favorite game?",
                        answer: "Hide and secure seek! 🔒",
                        category: "security",
                        likes: 0
                    },
                    {
                        id: 324,
                        question: "Why do Deno developers feel superior?",
                        answer: "They're TypeScript native! 🦕",
                        category: "javascript",
                        likes: 0
                    },
                    {
                        id: 325,
                        question: "What's a REST API's favorite exercise?",
                        answer: "GET requests! 💪",
                        category: "web",
                        likes: 0
                    },
                    {
                        id: 326,
                        question: "Why did the developer switch to Bun?",
                        answer: "Node was getting too slow! 🍞",
                        category: "javascript",
                        likes: 0
                    },
                    {
                        id: 327,
                        question: "What's Vercel's favorite time of day?",
                        answer: "Deploy o'clock! 🕐",
                        category: "devops",
                        likes: 0
                    },
                    {
                        id: 328,
                        question: "Why do Remix developers love music?",
                        answer: "They're all about that nested routing! 🎵",
                        category: "web",
                        likes: 0
                    },
                    {
                        id: 329,
                        question: "What's tRPC's favorite magic trick?",
                        answer: "Type-safe telepathy! 🎩",
                        category: "web",
                        likes: 0
                    },
                    {
                        id: 330,
                        question: "Why did the developer cry at the hackathon?",
                        answer: "Their API rate limit hit! 😢",
                        category: "startup",
                        likes: 0
                    },
                    {
                        id: 331,
                        question: "What's Prisma's favorite hobby?",
                        answer: "Schema crafting! ⚒️",
                        category: "database",
                        likes: 0
                    },
                    {
                        id: 332,
                        question: "Why do Solid.js developers smile?",
                        answer: "Fine-grained reactivity feels so good! 😊",
                        category: "web",
                        likes: 0
                    },
                    {
                        id: 333,
                        question: "What's Supabase's favorite superhero?",
                        answer: "The Backend-end! 🦸",
                        category: "database",
                        likes: 0
                    },
                    {
                        id: 334,
                        question: "Why did the prompt engineer fail art class?",
                        answer: "Too many tokens, not enough canvas! 🎨",
                        category: "ai",
                        likes: 0
                    },
                    {
                        id: 335,
                        question: "What's GitHub Actions' favorite movie?",
                        answer: "Workflow of Wall Street! 🎬",
                        category: "devops",
                        likes: 0
                    },
                    {
                        id: 336,
                        question: "Why do Qwik developers load so fast?",
                        answer: "They only resume, never rehydrate! ⚡",
                        category: "web",
                        likes: 0
                    },
                    {
                        id: 337,
                        question: "What's Zod's favorite validation?",
                        answer: "All of them! ✅",
                        category: "javascript",
                        likes: 0
                    },
                    {
                        id: 338,
                        question: "Why did the developer love Turbo?",
                        answer: "It monorepo'd their heart! 💝",
                        category: "javascript",
                        likes: 0
                    },
                    {
                        id: 339,
                        question: "What's Vitest's favorite snack?",
                        answer: "Fast food! 🍔",
                        category: "testing",
                        likes: 0
                    },
                    {
                        id: 340,
                        question: "Why do Playwright developers sleep well?",
                        answer: "Their tests run in parallel! 😴",
                        category: "testing",
                        likes: 0
                    },
                    {
                        id: 341,
                        question: "What's Cloudflare Workers' favorite job?",
                        answer: "Edge computing! 🌐",
                        category: "devops",
                        likes: 0
                    },
                    {
                        id: 342,
                        question: "Why did the developer switch to pnpm?",
                        answer: "Disk space was no joke! 💾",
                        category: "javascript",
                        likes: 0
                    },
                    {
                        id: 343,
                        question: "What's Stripe's favorite card game?",
                        answer: "Payment poker! 💳",
                        category: "web",
                        likes: 0
                    },
                    {
                        id: 344,
                        question: "Why do Vite developers start so quickly?",
                        answer: "ESM native baby! 🏃‍♂️",
                        category: "javascript",
                        likes: 0
                    },
                    {
                        id: 345,
                        question: "What's Midjourney's favorite artist?",
                        answer: "Vincent van Generator! 🖼️",
                        category: "ai",
                        likes: 0
                    },
                    {
                        id: 346,
                        question: "Why did the LLM apologize?",
                        answer: "As an AI language model, it had to! 🤖",
                        category: "ai",
                        likes: 0
                    },
                    {
                        id: 347,
                        question: "What's htmx's favorite dance?",
                        answer: "The Ajax shuffle! 🕺",
                        category: "web",
                        likes: 0
                    },
                    {
                        id: 348,
                        question: "Why do Tauri developers feel light?",
                        answer: "No Electron bloat! 🪶",
                        category: "general",
                        likes: 0
                    },
                    {
                        id: 349,
                        question: "What's Copilot's favorite karaoke song?",
                        answer: "I Will Always Autocomplete You! 🎤",
                        category: "ai",
                        likes: 0
                    },
                    {
                        id: 350,
                        question: "Why did the developer love shadcn/ui?",
                        answer: "Copy-paste never felt so good! 📋",
                        category: "web",
                        likes: 0
                    },
                    {
                        id: 351,
                        question: "What's Cursor's favorite key?",
                        answer: "Tab (for AI completion)! ⌨️",
                        category: "ai",
                        likes: 0
                    },
                    {
                        id: 352,
                        question: "Why do Wasm developers feel powerful?",
                        answer: "Near-native speed in the browser! 💪",
                        category: "web",
                        likes: 0
                    },
                    {
                        id: 353,
                        question: "What's Drizzle ORM's favorite weather?",
                        answer: "SQL showers! 🌧️",
                        category: "database",
                        likes: 0
                    },
                    {
                        id: 354,
                        question: "Why did the developer love Hono?",
                        answer: "It's ultra-fast on the edge! ⚡",
                        category: "web",
                        likes: 0
                    },
                    {
                        id: 355,
                        question: "What's Shopify Hydrogen's favorite element?",
                        answer: "Element H for Headless! 🛒",
                        category: "web",
                        likes: 0
                    },
                    {
                        id: 356,
                        question: "Why do Fresh developers feel so cool?",
                        answer: "Islands architecture! 🏝️",
                        category: "web",
                        likes: 0
                    },
                    {
                        id: 357,
                        question: "What's Storybook's favorite genre?",
                        answer: "Component fiction! 📚",
                        category: "web",
                        likes: 0
                    },
                    {
                        id: 358,
                        question: "Why did the developer switch to Biome?",
                        answer: "ESLint + Prettier = too slow! 🐢",
                        category: "javascript",
                        likes: 0
                    },
                    {
                        id: 359,
                        question: "What's Clerk's favorite accessory?",
                        answer: "Auth-entic jewelry! 💍",
                        category: "web",
                        likes: 0
                    },
                    {
                        id: 360,
                        question: "Why do tRPC developers trust each other?",
                        answer: "End-to-end type safety! 🤝",
                        category: "web",
                        likes: 0
                    },
                    {
                        id: 361,
                        question: "What's LangChain's favorite breakfast?",
                        answer: "Prompt and eggs! 🍳",
                        category: "ai",
                        likes: 0
                    },
                    {
                        id: 362,
                        question: "Why did the AI refuse to code?",
                        answer: "Copyright concerns! ⚖️",
                        category: "ai",
                        likes: 0
                    },
                    {
                        id: 363,
                        question: "What's Sanity's favorite meditation?",
                        answer: "Structured content Om! 🧘",
                        category: "database",
                        likes: 0
                    },
                    {
                        id: 364,
                        question: "Why do Nuxt developers love climbing?",
                        answer: "They're always scaling! 🧗",
                        category: "web",
                        likes: 0
                    },
                    {
                        id: 365,
                        question: "What's Linear's favorite shape?",
                        answer: "Issue triangle! 📐",
                        category: "startup",
                        likes: 0
                    },
                    {
                        id: 366,
                        question: "Why did the developer cry over Notion?",
                        answer: "Database relations got too emotional! 😭",
                        category: "startup",
                        likes: 0
                    },
                    {
                        id: 367,
                        question: "What's PostHog's favorite animal?",
                        answer: "Analytics hedgehog! 🦔",
                        category: "startup",
                        likes: 0
                    },
                    {
                        id: 368,
                        question: "Why do Raycast developers work so fast?",
                        answer: "Command bar everything! ⚡",
                        category: "general",
                        likes: 0
                    },
                    {
                        id: 369,
                        question: "What's Cal.com's favorite appointment?",
                        answer: "Open source scheduling! 📅",
                        category: "startup",
                        likes: 0
                    },
                    {
                        id: 370,
                        question: "Why did the developer love Convex?",
                        answer: "Real-time without the pain! ⚡",
                        category: "database",
                        likes: 0
                    },
                    {
                        id: 371,
                        question: "What's Resend's favorite email?",
                        answer: "The one that actually sends! 📧",
                        category: "web",
                        likes: 0
                    },
                    {
                        id: 372,
                        question: "Why do Payload CMS developers smile?",
                        answer: "TypeScript-first bliss! 😊",
                        category: "web",
                        likes: 0
                    },
                    {
                        id: 373,
                        question: "What's Upstash's favorite direction?",
                        answer: "Up and to the right! 📈",
                        category: "database",
                        likes: 0
                    },
                    {
                        id: 374,
                        question: "Why did the developer switch to Railway?",
                        answer: "Deployment on rails! 🚂",
                        category: "devops",
                        likes: 0
                    },
                    {
                        id: 375,
                        question: "What's PlanetScale's favorite planet?",
                        answer: "MySQL-turn! 🪐",
                        category: "database",
                        likes: 0
                    },
                    {
                        id: 376,
                        question: "Why do Fly.io developers feel free?",
                        answer: "Global distribution! 🦋",
                        category: "devops",
                        likes: 0
                    },
                    {
                        id: 377,
                        question: "What's Neon's favorite light?",
                        answer: "Serverless Postgres glow! 💡",
                        category: "database",
                        likes: 0
                    },
                    {
                        id: 378,
                        question: "Why did the developer love Mintlify?",
                        answer: "Docs that don't suck! 📖",
                        category: "general",
                        likes: 0
                    },
                    {
                        id: 379,
                        question: "What's Replicate's favorite animal?",
                        answer: "AI models of course! 🤖",
                        category: "ai",
                        likes: 0
                    },
                    {
                        id: 380,
                        question: "Why do Xata developers party?",
                        answer: "Serverless database + search! 🎉",
                        category: "database",
                        likes: 0
                    },
                    {
                        id: 381,
                        question: "What's Together AI's favorite social event?",
                        answer: "Model mixer! 🎊",
                        category: "ai",
                        likes: 0
                    },
                    {
                        id: 382,
                        question: "Why did the developer switch to Turso?",
                        answer: "SQLite at the edge! 🌍",
                        category: "database",
                        likes: 0
                    },
                    {
                        id: 383,
                        question: "What's Sentry's favorite guard?",
                        answer: "Error boundary! 🛡️",
                        category: "general",
                        likes: 0
                    },
                    {
                        id: 384,
                        question: "Why do developers love Excalidraw?",
                        answer: "Hand-drawn architecture is art! 🎨",
                        category: "design",
                        likes: 0
                    },
                    {
                        id: 385,
                        question: "What's Replit's favorite action?",
                        answer: "Code, deploy, repeat! 🔄",
                        category: "general",
                        likes: 0
                    },
                    {
                        id: 386,
                        question: "Why did the developer cry over Anthropic?",
                        answer: "Claude's so helpful! 😭",
                        category: "ai",
                        likes: 0
                    },
                    {
                        id: 387,
                        question: "What's Lemon Squeezy's favorite drink?",
                        answer: "Payment-ade! 🍋",
                        category: "startup",
                        likes: 0
                    },
                    {
                        id: 388,
                        question: "Why do Val Town developers feel magical?",
                        answer: "Val-ues come to life! ✨",
                        category: "web",
                        likes: 0
                    },
                    {
                        id: 389,
                        question: "What's Trigger.dev's favorite weapon?",
                        answer: "Background jobs! 🎯",
                        category: "web",
                        likes: 0
                    },
                    {
                        id: 390,
                        question: "Why did the developer love Inngest?",
                        answer: "Event-driven dreams! 💭",
                        category: "web",
                        likes: 0
                    },
                    {
                        id: 391,
                        question: "What's Partykit's favorite celebration?",
                        answer: "Real-time ragers! 🎈",
                        category: "web",
                        likes: 0
                    },
                    {
                        id: 392,
                        question: "Why do Motion developers move fast?",
                        answer: "Framer Motion magic! 🏃",
                        category: "web",
                        likes: 0
                    },
                    {
                        id: 393,
                        question: "What's Pinecone's favorite tree?",
                        answer: "Vector pine! 🌲",
                        category: "ai",
                        likes: 0
                    },
                    {
                        id: 394,
                        question: "Why did the developer switch to Weaviate?",
                        answer: "Vector search woven in! 🕸️",
                        category: "ai",
                        likes: 0
                    },
                    {
                        id: 395,
                        question: "What's Qdrant's favorite number?",
                        answer: "Vector dimensions! 🔢",
                        category: "ai",
                        likes: 0
                    },
                    {
                        id: 396,
                        question: "Why do OpenAI developers dream big?",
                        answer: "GPT-∞ someday! 🌟",
                        category: "ai",
                        likes: 0
                    },
                    {
                        id: 397,
                        question: "What's Hugging Face's favorite emoji?",
                        answer: "🤗 obviously!",
                        category: "ai",
                        likes: 0
                    },
                    {
                        id: 398,
                        question: "Why did the developer love Axiom?",
                        answer: "Logs without limits! 📊",
                        category: "devops",
                        likes: 0
                    },
                    {
                        id: 399,
                        question: "What's Better Stack's favorite position?",
                        answer: "On top! 📈",
                        category: "devops",
                        likes: 0
                    },
                    {
                        id: 400,
                        question: "Why do developers love daily standups?",
                        answer: "Just kidding, nobody does! 🙃",
                        category: "startup",
                        likes: 0
                    },
                    {
                        id: 401,
                        question: "What's WFH's worst enemy?",
                        answer: "Pants! 👖",
                        category: "startup",
                        likes: 0
                    }
                ];
                this.renderJokes();
                this.updatePagination();
                this.loadFeaturedJokes();
            } catch (error) {
                this.showError('Failed to load jokes. Please try again later.');
                console.error('Error loading jokes:', error);
            }
        }, 1000);
    },
    
    loadFeaturedJokes() {
        // Select 3 random jokes to feature
        const availableJokes = [...this.jokes];
        this.featuredJokes = [];
        for (let i = 0; i < 3 && availableJokes.length > 0; i++) {
            const randomIndex = Math.floor(Math.random() * availableJokes.length);
            this.featuredJokes.push(availableJokes.splice(randomIndex, 1)[0]);
        }
        this.renderFeaturedJokes();
    },
    
    renderJokes() {
        const container = document.querySelector('.jokes-grid');
        if (!container) return;
        
        if (this.jokes.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-grin-beam-sweat"></i>
                    <h3>No Jokes Found</h3>
                    <p>Be the first to submit a joke!</p>
                </div>
            `;
            return;
        }
        
        // Apply filters
        const filteredJokes = this.getFilteredJokes();
        
        const startIndex = (this.currentPage - 1) * this.jokesPerPage;
        const endIndex = startIndex + this.jokesPerPage;
        const currentJokes = filteredJokes.slice(startIndex, endIndex);
        
        container.innerHTML = currentJokes.map((joke, index) => this.createJokeElement(joke, false, index)).join('');
        
        // Update pagination with filtered count
        this.updatePagination(filteredJokes.length);
    },
    
    getFilteredJokes() {
        let filtered = [...this.jokes];
        
        // Apply category filter
        if (this.currentFilter !== 'all') {
            filtered = filtered.filter(joke => joke.category === this.currentFilter);
        }
        
        // Apply search filter
        if (this.currentSearch) {
            const query = this.currentSearch.toLowerCase().trim();
            filtered = filtered.filter(joke => 
                joke.question.toLowerCase().includes(query) ||
                joke.answer.toLowerCase().includes(query) ||
                joke.category.toLowerCase().includes(query)
            );
        }
        
        // Apply sorting
        filtered = this.sortJokes(filtered);
        
        return filtered;
    },
    
    sortJokes(jokes) {
        switch(this.sortBy) {
            case 'popular':
                return jokes.sort((a, b) => b.likes - a.likes);
            case 'category':
                return jokes.sort((a, b) => a.category.localeCompare(b.category));
            case 'newest':
            default:
                return jokes.sort((a, b) => b.id - a.id);
        }
    },
    
    applyFilters() {
        this.currentPage = 1; // Reset to first page when filters change
        this.renderJokes();
        this.updateStatusMessage();
    },
    
    updateStatusMessage() {
        const filtered = this.getFilteredJokes();
        const total = this.jokes.length;
        
        let message = '';
        if (this.currentSearch) {
            message += `Searching for "${this.currentSearch}" `;
        }
        if (this.currentFilter !== 'all') {
            message += `in ${this.currentFilter} `;
        }
        if (filtered.length !== total) {
            message += `(${filtered.length} of ${total} jokes)`;
        }
        
        // Update any status display elements
        const statusElement = document.querySelector('.filter-status');
        if (statusElement && message) {
            statusElement.textContent = message;
            statusElement.style.display = 'block';
        } else if (statusElement) {
            statusElement.style.display = 'none';
        }
    },
    
    renderFeaturedJokes() {
        const container = document.querySelector('.featured-jokes');
        if (!container) return;
        
        if (this.featuredJokes.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-star"></i>
                    <h3>No Featured Jokes</h3>
                    <p>Check back later for featured jokes!</p>
                </div>
            `;
            return;
        }
        
        container.innerHTML = this.featuredJokes.map((joke, index) => this.createJokeElement(joke, true, index)).join('');
    },
    
    createJokeElement(joke, isFeatured = false, index = 0) {
        const isLiked = this.likedJokes.has(joke.id);
        const element = `
            <div class="joke ${isFeatured ? 'featured-joke' : ''} animate__animated animate__fadeIn" 
                 style="--delay: ${index * 0.1}s"
                 data-category="${joke.category}" 
                 data-id="${joke.id}"
                 role="article"
                 aria-labelledby="joke-${joke.id}-question">
                <span class="category-badge animate__animated animate__slideInRight" aria-label="Category: ${joke.category}">${joke.category}</span>
                <div id="joke-${joke.id}-question" class="question">${joke.question}</div>
                <div class="punchline" aria-expanded="false">${joke.answer}</div>
                <div class="joke-actions">
                    <button class="reveal-button" 
                            aria-label="Reveal punchline"
                            aria-controls="joke-${joke.id}-punchline">
                        <i class="fas fa-eye"></i> <span>Reveal</span>
                    </button>
                    <div class="action-buttons">
                        <div class="reactions-container">
                            <button class="action-button like-button ${isLiked ? 'liked' : ''}" 
                                    aria-label="Like joke"
                                    aria-pressed="${isLiked}"
                                    style="display: none;">
                                <i class="fas fa-heart"></i> <span class="like-count">${joke.likes}</span>
                            </button>
                            ${this.renderReactions(joke)}
                        </div>
                        <button class="action-button share-button" 
                                aria-label="Share joke">
                            <i class="fas fa-share"></i>
                        </button>
                        <button class="action-button copy-button" 
                                aria-label="Copy joke to clipboard">
                            <i class="fas fa-copy"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
        return element;
    },
    
    addEventListeners() {
        // Event delegation for joke interactions
        document.addEventListener('click', (e) => {
            const joke = e.target.closest('.joke');
            if (!joke) return;
            
            if (e.target.closest('.reveal-button')) {
                this.togglePunchline(joke);
            } else if (e.target.closest('.like-button')) {
                this.toggleLike(joke);
            } else if (e.target.closest('.reaction-button')) {
                this.handleReaction(joke, e.target.closest('.reaction-button'));
            } else if (e.target.closest('.share-button')) {
                this.shareJoke(joke);
            } else if (e.target.closest('.copy-button')) {
                this.copyJoke(joke);
            }
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                // Close any open punchlines
                document.querySelectorAll('.punchline.visible').forEach(punchline => {
                    const joke = punchline.closest('.joke');
                    this.togglePunchline(joke);
                });
            }
        });

        // Random joke button
        const randomButton = document.querySelector('.random-joke');
        if (randomButton) {
            randomButton.addEventListener('click', () => this.showRandomJoke());
            randomButton.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.showRandomJoke();
                }
            });
        }

        // Form keyboard navigation
        const form = document.getElementById('submitJokeForm');
        if (form) {
            form.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' && e.target.tagName !== 'TEXTAREA') {
                    e.preventDefault();
                }
            });
        }
    },
    
    togglePunchline(joke) {
        const punchline = joke.querySelector('.punchline');
        const revealButton = joke.querySelector('.reveal-button');
        const icon = revealButton.querySelector('i');
        
        if (punchline.classList.toggle('visible')) {
            icon.className = 'fas fa-eye-slash';
            revealButton.querySelector('span').textContent = 'Hide';
            punchline.setAttribute('aria-expanded', 'true');
            punchline.classList.add('animate__animated', 'animate__fadeIn');
            this.announceToScreenReader('Punchline revealed');
            
            // Track joke view for stats
            const jokeId = parseInt(joke.dataset.id, 10);
            const category = joke.dataset.category;
            if (window.statsManager) {
                window.statsManager.trackJokeView(jokeId, category);
            }
        } else {
            icon.className = 'fas fa-eye';
            revealButton.querySelector('span').textContent = 'Reveal';
            punchline.setAttribute('aria-expanded', 'false');
            punchline.classList.remove('animate__animated', 'animate__fadeIn');
        }
    },
    
    renderReactions(joke) {
        const reactionTypes = ['\ud83d\ude02', '\ud83e\udd13', '\ud83d\udc80', '\ud83d\udd25', '\ud83e\udd14'];
        const jokeReactions = this.reactions[joke.id] || {};
        
        return `
            <div class="reaction-picker">
                ${reactionTypes.map(emoji => {
                    const isActive = jokeReactions[emoji] || false;
                    return `
                        <button class="reaction-button ${isActive ? 'active' : ''}" 
                                data-emoji="${emoji}"
                                aria-label="React with ${emoji}">
                            <span class="reaction-emoji">${emoji}</span>
                        </button>
                    `;
                }).join('')}
            </div>
        `;
    },
    
    handleReaction(joke, button) {
        const jokeId = parseInt(joke.dataset.id, 10);
        const emoji = button.dataset.emoji;
        
        if (!this.reactions[jokeId]) {
            this.reactions[jokeId] = {};
        }
        
        // Toggle the reaction
        this.reactions[jokeId][emoji] = !this.reactions[jokeId][emoji];
        
        // Animate the button
        button.classList.toggle('active');
        button.classList.add('animate__animated', 'animate__bounce');
        setTimeout(() => {
            button.classList.remove('animate__animated', 'animate__bounce');
        }, 600);
        
        // Track reaction for stats
        if (this.reactions[jokeId][emoji] && window.statsManager) {
            window.statsManager.trackReaction();
        }
        
        // Save to localStorage
        this.saveReactions();
        
        // Update joke object likes count based on all reactions
        const jokeObj = this.jokes.find(j => j.id === jokeId);
        if (jokeObj) {
            const activeReactions = Object.values(this.reactions[jokeId] || {}).filter(Boolean).length;
            jokeObj.likes = activeReactions;
            
            // Update like count if legacy like button exists
            const likeCount = joke.querySelector('.like-count');
            if (likeCount) {
                likeCount.textContent = jokeObj.likes;
            }
        }
    },
    
    toggleLike(joke) {
        const jokeId = parseInt(joke.dataset.id, 10);
        const jokeObj = this.jokes.find(j => j.id === jokeId);
        if (!jokeObj) return;

        const likeButton = joke.querySelector('.like-button');
        const likeCount = joke.querySelector('.like-count');
        const isLiked = likeButton.classList.toggle('liked');
        
        if (isLiked) {
            this.likedJokes.add(jokeId);
            jokeObj.likes += 1;
            likeButton.classList.add('animate__animated', 'animate__heartBeat');
            setTimeout(() => {
                likeButton.classList.remove('animate__animated', 'animate__heartBeat');
            }, 1000);
        } else {
            this.likedJokes.delete(jokeId);
            jokeObj.likes = Math.max(0, jokeObj.likes - 1);
        }
        
        likeCount.textContent = jokeObj.likes;
        this.saveLikedJokes();
        
        // If sorted by popular, re-render
        if (this.sortBy === 'popular') {
            this.renderJokes();
        }
    },
    
    shareJoke(joke) {
        const question = joke.querySelector('.question').textContent;
        const answer = joke.querySelector('.punchline').textContent;
        const text = `${question}\n${answer}`;
        
        if (navigator.share) {
            navigator.share({
                title: 'Coding Joke',
                text: text
            }).catch(console.error);
        } else {
            this.copyToClipboard(text);
        }
    },
    
    copyJoke(joke) {
        const question = joke.querySelector('.question').textContent;
        const answer = joke.querySelector('.punchline').textContent;
        const text = `${question}\n${answer}`;
        this.copyToClipboard(text);
    },
    
    copyToClipboard(text) {
        navigator.clipboard.writeText(text).then(() => {
            this.showToast('Copied to clipboard!');
        }).catch(console.error);
    },
    
    showToast(message) {
        const toast = document.createElement('div');
        toast.className = 'toast animate__animated animate__slideInUp';
        toast.setAttribute('role', 'alert');
        toast.setAttribute('aria-live', 'polite');
        toast.textContent = message;
        document.body.appendChild(toast);
        
        this.announceToScreenReader(message);
        
        setTimeout(() => {
            toast.classList.remove('animate__slideInUp');
            toast.classList.add('animate__fadeOut');
            setTimeout(() => {
                toast.remove();
            }, 300);
        }, 2700);
    },
    
    showRandomJoke() {
        if (this.jokes.length === 0) return;
        
        const randomIndex = Math.floor(Math.random() * this.jokes.length);
        const joke = this.jokes[randomIndex];
        
        const jokeElement = document.querySelector(`.joke[data-id="${joke.id}"]`);
        if (jokeElement) {
            jokeElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
            jokeElement.classList.add('animate__animated', 'animate__bounce');
            setTimeout(() => {
                jokeElement.classList.remove('animate__animated', 'animate__bounce');
            }, 1000);
        }
    },
    
    showLoading() {
        const container = document.querySelector('.jokes-grid');
        if (!container) return;
        
        container.innerHTML = `
            <div class="loading">
                <div class="loading-spinner"></div>
                <span class="loading-text">Loading jokes...</span>
            </div>
        `;
    },
    
    showError(message) {
        const container = document.querySelector('.jokes-grid');
        if (!container) return;
        
        container.innerHTML = `
            <div class="error-message">
                <i class="fas fa-exclamation-circle"></i>
                <span>${message}</span>
            </div>
        `;
    },
    
    setupSubmitForm() {
        const form = document.getElementById('submitJokeForm');
        if (!form) return;

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const question = document.getElementById('jokeQuestion').value.trim();
            const answer = document.getElementById('jokeAnswer').value.trim();
            const category = document.getElementById('jokeCategory').value;
            
            if (!question || !answer) {
                this.showToast('Please fill in both question and answer!');
                return;
            }
            
            try {
                const newJoke = {
                    id: this.jokes.length + 1,
                    question,
                    answer,
                    category,
                    likes: 0
                };
                
                this.jokes.unshift(newJoke);
                this.renderJokes();
                
                // Clear form
                form.reset();
                
                // Show success message
                this.showToast('Joke submitted successfully!');
                
                // Highlight the new joke
                const jokeElement = document.querySelector(`.joke[data-id="${newJoke.id}"]`);
                if (jokeElement) {
                    jokeElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    jokeElement.classList.add('highlighted');
                    setTimeout(() => {
                        jokeElement.classList.remove('highlighted');
                    }, 2000);
                }
            } catch (error) {
                this.showToast('Failed to submit joke. Please try again.');
                console.error('Error submitting joke:', error);
            }
        });
    },

    announceToScreenReader(message) {
        const announcement = document.createElement('div');
        announcement.setAttribute('aria-live', 'polite');
        announcement.setAttribute('aria-atomic', 'true');
        announcement.className = 'sr-only';
        announcement.textContent = message;
        document.body.appendChild(announcement);
        setTimeout(() => announcement.remove(), 1000);
    },

    setupPagination() {
        const container = document.querySelector('.jokes-grid');
        if (!container) return;
        
        // Create pagination container if it doesn't exist
        let paginationContainer = document.querySelector('.pagination');
        if (!paginationContainer) {
            paginationContainer = document.createElement('div');
            paginationContainer.className = 'pagination';
            container.parentNode.insertBefore(paginationContainer, container.nextSibling);
        }
        
        this.updatePagination();
    },
    
    setupSortControls() {
        // Create sort controls if they don't exist
        const header = document.querySelector('header');
        if (!header) return;
        
        let sortContainer = document.querySelector('.sort-container');
        if (!sortContainer) {
            sortContainer = document.createElement('div');
            sortContainer.className = 'sort-container';
            sortContainer.innerHTML = `
                <label for="sortSelect" class="sort-label">Sort by:</label>
                <select id="sortSelect" class="sort-select" aria-label="Sort jokes">
                    <option value="newest">Newest</option>
                    <option value="popular">Most Popular</option>
                    <option value="category">Category</option>
                </select>
            `;
            
            const controls = header.querySelector('.controls');
            if (controls) {
                controls.appendChild(sortContainer);
            }
        }
        
        const sortSelect = document.getElementById('sortSelect');
        if (sortSelect) {
            sortSelect.value = this.sortBy;
            sortSelect.addEventListener('change', (e) => {
                this.sortBy = e.target.value;
                this.applyFilters();
            });
        }
    },
    
    updatePagination(totalFiltered) {
        const paginationContainer = document.querySelector('.pagination');
        if (!paginationContainer) return;
        
        const jokesCount = totalFiltered !== undefined ? totalFiltered : this.jokes.length;
        const totalPages = Math.ceil(jokesCount / this.jokesPerPage);
        const startIndex = (this.currentPage - 1) * this.jokesPerPage;
        const endIndex = Math.min(startIndex + this.jokesPerPage, jokesCount);
        
        // Clear existing pagination
        paginationContainer.innerHTML = '';
        
        // Add previous button
        const prevButton = document.createElement('button');
        prevButton.className = 'pagination-button';
        prevButton.innerHTML = '&laquo;';
        prevButton.disabled = this.currentPage === 1;
        prevButton.setAttribute('aria-label', 'Previous page');
        prevButton.addEventListener('click', () => {
            if (this.currentPage > 1) {
                this.currentPage--;
                this.renderJokes();
            }
        });
        paginationContainer.appendChild(prevButton);
        
        // Function to add page button
        const addPageButton = (pageNum) => {
            const pageButton = document.createElement('button');
            pageButton.className = `pagination-button ${pageNum === this.currentPage ? 'active' : ''}`;
            pageButton.textContent = pageNum;
            pageButton.addEventListener('click', () => {
                this.currentPage = pageNum;
                this.renderJokes();
                this.updatePagination();
            });
            paginationContainer.appendChild(pageButton);
        };

        // Function to add ellipsis
        const addEllipsis = () => {
            const ellipsis = document.createElement('span');
            ellipsis.className = 'pagination-button';
            ellipsis.textContent = '...';
            ellipsis.style.cursor = 'default';
            paginationContainer.appendChild(ellipsis);
        };

        // Logic for displaying page numbers
        if (totalPages <= 7) {
            // If 7 or fewer pages, show all
            for (let i = 1; i <= totalPages; i++) {
                addPageButton(i);
            }
        } else {
            // Always show first page
            addPageButton(1);
            
            if (this.currentPage > 3) {
                addEllipsis();
            }
            
            // Show pages around current page
            for (let i = Math.max(2, this.currentPage - 1); i <= Math.min(this.currentPage + 1, totalPages - 1); i++) {
                addPageButton(i);
            }
            
            if (this.currentPage < totalPages - 2) {
                addEllipsis();
            }
            
            // Always show last page
            if (totalPages > 1) {
                addPageButton(totalPages);
            }
        }
        
        // Add next button
        const nextButton = document.createElement('button');
        nextButton.className = 'pagination-button';
        nextButton.innerHTML = '&raquo;';
        nextButton.disabled = this.currentPage === totalPages;
        nextButton.setAttribute('aria-label', 'Next page');
        nextButton.addEventListener('click', () => {
            if (this.currentPage < totalPages) {
                this.currentPage++;
                this.renderJokes();
            }
        });
        paginationContainer.appendChild(nextButton);
        
        // Add page info
        const pageInfo = document.createElement('span');
        pageInfo.className = 'pagination-info';
        const start = jokesCount > 0 ? startIndex + 1 : 0;
        const end = endIndex;
        pageInfo.textContent = `Showing ${start}-${end} of ${jokesCount} jokes`;
        paginationContainer.appendChild(pageInfo);
    },
    
    loadMoreJokes() {
        // In a real app, this would load from an API
        // For now, we'll just show a loading state
        const loadingSentinel = document.querySelector('.scroll-sentinel');
        if (loadingSentinel) {
            loadingSentinel.innerHTML = `
                <div class="loading">
                    <div class="loading-spinner"></div>
                    <span class="loading-text">Loading more jokes...</span>
                </div>
            `;
        }

        // Simulate loading delay
        setTimeout(() => {
            const newJokes = [
                {
                    id: this.jokes.length + 1,
                    question: "Why did the developer go to the beach?",
                    answer: "To catch some waves and debug their code! 🌊",
                    category: "general",
                    likes: 0
                },
                {
                    id: this.jokes.length + 2,
                    question: "What's a programmer's favorite type of music?",
                    answer: "Heavy metal! 🤘",
                    category: "general",
                    likes: 0
                }
            ];

            this.jokes.push(...newJokes);
            this.renderJokes();
        }, 1000);
    }
};

// Initialize jokes manager on page load
document.addEventListener('DOMContentLoaded', () => {
    // Initialize all managers in the correct order
    theme.init();
    jokesManager.init();
    searchManager.init();
    filterManager.init();
}); 

function showLoadingState() {
    const jokesGrid = document.querySelector('.jokes-grid');
    const featuredSection = document.querySelector('.featured-jokes');
    
    // Create skeleton loading states
    const skeletonHtml = `
        <div class="loading-skeleton">
            <div class="skeleton-category"></div>
            <div class="skeleton-question"></div>
            <div class="skeleton-answer"></div>
            <div class="skeleton-actions">
                <div class="skeleton-button"></div>
                <div class="skeleton-button"></div>
            </div>
        </div>
    `;
    
    const featuredSkeletonHtml = `
        <div class="loading-skeleton featured-skeleton">
            <div class="skeleton-category"></div>
            <div class="skeleton-question"></div>
            <div class="skeleton-answer"></div>
            <div class="skeleton-actions">
                <div class="skeleton-button"></div>
                <div class="skeleton-button"></div>
            </div>
        </div>
    `;
    
    // Add loading class and skeletons
    jokesGrid.classList.add('loading');
    featuredSection.classList.add('loading');
    
    // Add multiple skeletons to simulate content
    jokesGrid.innerHTML = skeletonHtml.repeat(6);
    featuredSection.innerHTML = featuredSkeletonHtml.repeat(3);
}

function hideLoadingState() {
    const jokesGrid = document.querySelector('.jokes-grid');
    const featuredSection = document.querySelector('.featured-jokes');
    
    jokesGrid.classList.remove('loading');
    featuredSection.classList.remove('loading');
} 