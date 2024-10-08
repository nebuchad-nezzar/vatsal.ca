// import { GitHubIconOutline } from '@/components/icons';
// import { LinkedInIcon } from '@/components/icons/LinkedInIcon';
// import { XIcon } from '@/components/icons/XIcon';
// import { InstagramIcon } from '@/components/icons';

export const RESUME_DATA = {
	name: 'Vatsal Sharma',
	initials: 'VS',
	location: 'Toronto, Canada, GMT-4',
	locationLink: 'https://bitly.cx/x3cv',
	about: 'Curious, Coder, Crossfitter, Coffee and beer hobbyist, Late bloomer & Nerd',
	summary:
		'Hello 👋🏼. This is my home on the internet 🏡. I want it to be simple, but I want to use it as my playground. I like to follow my curiosity so this will be a organised mess!',
	// 'I am trying my best to improve a little bit every day. I am super courious and love to be a little nerd. I think there are so many things to being a good engineer other than just code. A well designed product is a product that is easy to use',
	avatarUrl: 'https://i.postimg.cc/sDB1NH6z/avatar2.jpg',
	personalWebsiteUrl: 'https://vatsal.ca',
	contact: {
		email: 'vatswork10@gmail.com',
		social: [
			{
				name: 'GitHub',
				url: 'https://github.com/nebuchad-nezzar',
				// icon: GitHubIconOutline
			},
			{
				name: 'LinkedIn',
				url: 'https://www.linkedin.com/in/vats1910/',
				// icon: LinkedInIcon
			},
			{
				name: 'X',
				url: 'https://x.com/vats360',
				// icon: XIcon
			},
			{
				name: 'Instagram',
				url: 'https://www.instagram.com/vats360/',
				// icon: InstagramIcon
			}
		]
	},
	education: [
		{
		  school: "Northeastern University",
		  href: "https://www.northeastern.edu/",
		  degree: "MS in Data Science",
		  logoUrl: "/Northeastern.png",
		  start: "2023",
		  end: "2025",
		  description:"Coursework: Proabablity Theory, Adavance Statistics, Machine Learning Algorithms, Predictive Analysis, Data Visualisation",
		},
		{
		  school: "Manipal University",
		  href: "https://jaipur.manipal.edu/",
		  degree: "Bachelor's Degree of Computer Science",
		  logoUrl: "/manipal.jpg",
		  start: "2016",
		  end: "2020",
		  description:"Coursework: C++, Operating Systems, DBMS, Networking, Python, SQL, Geographic Information Sytem(GIS), Data Science, Intermediate Robotics, Advanced Algorithms, Data Structures, Linux, Computer Architecture, Computer Visiona and Image Processing",
		},
		{
		  school: "Amity International School",
		  href: "https://amityglobalschoolnoida.com/",
		  degree: "High School",
		  logoUrl: "/Amity.png",
		  start: "2002",
		  end: "2016",
		  description:"Coursework: Physics, Chemistry and Mathematics",
		},
	  ],
	work: [
		{
		  company: "Hexaware",
		  href: "https://atomic.finance",
		  badges: [],
		  location: "Remote",
		  title: "Backend Engineer",
		  logoUrl: "/hexaware.png",
		  start: "May 2021",
		  end: "Oct 2022",
		  description:
			"Implemented the Bitcoin discreet log contract (DLC) protocol specifications as an open source Typescript SDK. Dockerized all microservices and setup production kubernetes cluster. Architected a data lake using AWS S3 and Athena for historical backtesting of bitcoin trading strategies. Built a mobile app using react native and typescript.",
		},
		{
		  company: "Aindra Labs",
		  badges: [],
		  href: "https://shopify.com",
		  location: "Remote",
		  title: "R&D Intern",
		  logoUrl: "/Aindra.png",
		  start: "January 2021",
		  end: "April 2021",
		  description:
			"Implemented a custom Kubernetes controller in Go to automate the deployment of MySQL and ProxySQL custom resources in order to enable 2,000+ internal developers to instantly deploy their app databases to production. Wrote several scripts in Go to automate MySQL database failovers while maintaining master-slave replication topologies and keeping Zookeeper nodes consistent with changes.",
		},
		{
		  company: "LTIMindtree",
		  badges: [],
		  href: "https://www.ltimindtree.com/",
		  location: "Remote",
		  title: "Machine Learning Intern",
		  logoUrl: "/L&T.png",
		  start: "January 2021",
		  end: "April 2021",
		  description:
			"Implemented a custom Kubernetes controller in Go to automate the deployment of MySQL and ProxySQL custom resources in order to enable 2,000+ internal developers to instantly deploy their app databases to production. Wrote several scripts in Go to automate MySQL database failovers while maintaining master-slave replication topologies and keeping Zookeeper nodes consistent with changes.",
		},
		{
		  company: "Exzeo",
		  badges: [],
		  href: "https://exzeo.com/",
		  location: "Remote",
		  title: "Data Science Intern",
		  logoUrl: "/Exzeo.png",
		  start: "January 2021",
		  end: "April 2021",
		  description:
			"Implemented a custom Kubernetes controller in Go to automate the deployment of MySQL and ProxySQL custom resources in order to enable 2,000+ internal developers to instantly deploy their app databases to production. Wrote several scripts in Go to automate MySQL database failovers while maintaining master-slave replication topologies and keeping Zookeeper nodes consistent with changes.",
		},
	  ],
	  publication: [
		{
			company: "Concurrency Control in Transactions for E-Wallet",
			href: "https://www.researchgate.net/publication/351292037_An_Algorithm_for_Concurrency_control_in_Transactions_for_E-Wallet",
			badges: [],
			location: "Remote",
			title: "Co-Author",
			logoUrl: "/ResearchGate.png",
			start: "May 2021",
		  description:
			"This paper explores the enhancement of e-wallet transactions through a Concurrency Transaction Controller (CTC) algorithm to prevent duplicate transactions. By incorporating a security token mechanism, the proposed method ensures reliable and singular transaction processing despite network issues or rapid clicks. The study highlights the importance of compliance with RBI regulations and the impact on users, banks, and issuers. Results demonstrate a significant reduction in duplicate transactions, improving transaction reliability and business efficiency.",
		},
	],
	//   publication: [
	// 	{
	// 	  title: "Concurrency Control in Transactions for E-Wallet",
	// 	  href: "https://www.researchgate.net/publication/351292037_An_Algorithm_for_Concurrency_control_in_Transactions_for_E-Wallet",
	// 	  badges: [],
	// 	  location: "Remote",
	// 	  designation: "Co-Author",
	// 	  logoUrl: "/ResearchGate.png",
	// 	  start: "May 2021",
	// 	  description:
	// 		"This paper explores the enhancement of e-wallet transactions through a Concurrency Transaction Controller (CTC) algorithm to prevent duplicate transactions. By incorporating a security token mechanism, the proposed method ensures reliable and singular transaction processing despite network issues or rapid clicks. The study highlights the importance of compliance with RBI regulations and the impact on users, banks, and issuers. Results demonstrate a significant reduction in duplicate transactions, improving transaction reliability and business efficiency.",
	// 	},
	// ],
	//   ],
	
} as const;
