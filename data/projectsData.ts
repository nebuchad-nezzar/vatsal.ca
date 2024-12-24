const projectsData = [
    {
        title: 'Volatilty Analyzer',
        tags: ['Quant', 'Options'],
        description:
        'The Options Volatility Visualizer is a sophisticated tool designed for advanced options traders, institutional investors, and quantitative analysts. It provides in-depth insights into market volatility through interactive 3D/4D volatility surfaces, Monte Carlo simulations, and historical implied volatility analysis. The platform also offers robust Greeks analysis, multi-asset support, and VIX integration (in development), empowering users to model options, assess risks, and interpret volatility trends. With its data-driven approach, the tool helps traders optimize strategies, manage risk, and make informed, precise decisions in dynamic markets.',
        imgSrc: '/Volatility.png',
        href: 'https://volatilty-visualizer-v1.vercel.app/',
    },
    {
        title: 'InvestLens ',
        tags: ['R', 'RShiny', 'Analytics', 'Data Science', 'Dashboard'],
        description:
        'InvestLens is a sophisticated real estate market analytics dashboard built with RShiny, the dashboard enables data-driven investment decisions through comprehensive market analysis. Users can identify trends, compare markets across multiple Canadian cities, calculate mortgage scenarios, and visualize complex market patterns through heat maps and interactive charts. The applications intuitive interface and responsive design make it an invaluable tool for real estate market analysis, investment planning, and mortgage comparison shopping. project demonstrates proficiency in full-stack data analysis, from data processing and statistical analysis to interactive visualization and web application development.',
        imgSrc: '/static/images/realestate.jpg',
        href: 'https://vatsal1910.shinyapps.io/Real-Estate-Dashboard-Texas/',
    },
    {
        title: 'Video Analytics',
        tags: ['Machine Learning', 'Python', 'SSD-Architecture', 'YOLO', 'OpenCV'],
        description:
        'Built a video surveillance system based on the SSD MobileNet architecture, utilizing centroid tracking for object detection. The system logs all data into a separate Excel file and includes IP camera configuration capabilities. I deployed various algorithms, including RCNN, YOLOv4, DeepSort, and RetinaNet, and compared their performance during the research phase. The system provides real-time alerts via email, ensuring timely notifications. Notably, I achieved a frame rate of 51-64 FPS on the CPU, showcasing the efficiency of the implementation. This project highlights my ability to integrate advanced computer vision techniques for effective surveillance solutions.',
        imgSrc: '/videoana.webp',
        href: '',
    },
    {
        title: 'Customer Behavior of NYC Taxi Ride Prediction',
        tags: ['Data Science', 'Feature Engineering', 'Machine Learning', 'Time Series Analysis'],
        description:
        'Analyzed historical taxi ride data to predict customer behavior and ride demand across New York City. Using machine learning models, I identified key factors like peak hours, high-demand areas, and weather effects, optimizing resource allocation for taxi services and improving overall customer experience by ensuring better availability during high-demand periods',
        imgSrc: '/taxi.jpg',
        href: '',
    },
    {
        title: 'Personal Portfolio v2.0',
        tags: ['Web Development', 'Next.js', 'TypeScript', 'Tailwind CSS'],
        description:
            'Built with Next.js, TypeScript, Tailwind CSS, and deployed through Vercel, this bleeding-edge website is both an information security blog and a personal website for my cybersecurity shenanigans and web development ramblings.',
        imgSrc: '/static/images/showcase-card.png',
        href: 'https://vatsal.ca',
    },
    {
            title: 'Detecting Parkinson Disease using ML Techniques ',
            tags: ['Machine Learning', 'EDA', 'Feature Engineering', 'React',],
            description:
            'An in-depth Data science project on the Validity of Parkinson disease via voiced data and handwritten data. Performed data cleaning, EDA, and Feature Engineering, and deployed various Machine learning algorithms along with data visualizations. Achieved accuracy of 96%. Also built an application for the same, that tests and alerts you if you have the disease or not based on the handwritten test, it also prescribes a list of doctors.',
            imgSrc: '/MRI.png',
            href: '',
        },
        {
            title: 'Meetings',
            tags: ['WebRTC', 'Next.js', 'TypeScript', 'TailwindCSS'],
            description:
            'Built a Video Conferencing application for 1: N users, using WebRTC framework written in ReactJS and deployed using ngrok. Demonstrated manual exchange of SDP and ICE Candidate between Peer Connections works in between two Browsers from two different devices.',
            imgSrc: '/videoconf.jpg',
            href: '',
        },
        {
            title: 'Personal Portfolio v1.0',
            tags: ['Web Development', 'Next.js', 'TypeScript', 'Tailwind CSS'],
            description:
                'Built with Next.js, TypeScript, Tailwind CSS, and deployed through Vercel, this bleeding-edge website is both an information security blog and a personal website for my cybersecurity shenanigans and web development ramblings.',
            imgSrc: '/v1.png',
            href: '',
        },
]

export default projectsData
