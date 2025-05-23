export const mockCourses = [
  {
    id: 'course-1',
    title: 'Solar System Exploration',
    description: 'Discover the wonders of our solar system and learn about the planets, moons, and other celestial bodies.',
    grade_level: 'Middle School',
    subject: 'Astronomy',
    thumbnail: 'https://images.pexels.com/photos/39561/solar-flare-sun-eruption-energy-39561.jpeg',
    created_date: '2023-05-15',
    xp_value: 250,
    size_category: 'Medium',
    recommended_age: '11-14',
    lessons: [
      {
        id: 'lesson-1-1',
        title: 'Introduction to the Solar System',
        content: 'Overview of our cosmic neighborhood and the objects it contains.',
        resource_links: ['https://solarsystem.nasa.gov/', 'https://spaceplace.nasa.gov/menu/solar-system/'],
        sequence_order: 1,
        lesson_contents: [
          {
            id: 'content-1-1-1',
            subheading: 'What is the Solar System?',
            text: 'Our solar system consists of the Sun, eight planets, dwarf planets, moons, asteroids, comets, and more.',
            image_path: 'https://images.pexels.com/photos/41953/earth-blue-planet-globe-planet-41953.jpeg',
            fun_fact: 'If the Sun were the size of a basketball, Earth would be the size of a pea!',
            sequence_order: 1
          },
          {
            id: 'content-1-1-2',
            subheading: 'The Sun: Our Star',
            text: 'The Sun is a G-type main-sequence star that contains 99.86% of the mass in the solar system.',
            image_path: 'https://images.pexels.com/photos/76969/cold-front-warm-front-hurricane-felix-76969.jpeg',
            fun_fact: 'The Sun produces enough energy in one second to meet Earth\'s power needs for almost 500,000 years.',
            sequence_order: 2
          }
        ]
      },
      {
        id: 'lesson-1-2',
        title: 'The Rocky Planets',
        content: 'Exploring Mercury, Venus, Earth, and Mars - the inner, rocky planets of our solar system.',
        resource_links: ['https://science.nasa.gov/mercury/', 'https://science.nasa.gov/venus/'],
        sequence_order: 2,
        lesson_contents: [
          {
            id: 'content-1-2-1',
            subheading: 'Mercury: The Closest Planet',
            text: 'Mercury is the smallest and innermost planet in the Solar System, with extreme temperature variations.',
            image_path: 'https://images.pexels.com/photos/73910/mars-mars-rover-space-travel-robot-73910.jpeg',
            fun_fact: 'A day on Mercury (176 Earth days) is longer than its year (88 Earth days)!',
            sequence_order: 1
          }
        ]
      }
    ]
  },
  {
    id: 'course-2',
    title: 'Space Exploration History',
    description: 'Learn about the fascinating history of human space exploration from early rockets to modern space stations.',
    grade_level: 'High School',
    subject: 'History of Science',
    thumbnail: 'https://images.pexels.com/photos/2152/sky-earth-space-working.jpg',
    created_date: '2023-06-20',
    xp_value: 350,
    size_category: 'Large',
    recommended_age: '15-18',
    lessons: [
      {
        id: 'lesson-2-1',
        title: 'The Space Race',
        content: 'The competition between the United States and the Soviet Union for spaceflight supremacy.',
        resource_links: ['https://history.nasa.gov/spacerace.html'],
        sequence_order: 1,
        lesson_contents: [
          {
            id: 'content-2-1-1',
            subheading: 'Sputnik and the Dawn of the Space Age',
            text: 'On October 4, 1957, the Soviet Union launched Sputnik 1, the first artificial satellite, shocking the world.',
            image_path: 'https://images.pexels.com/photos/355935/pexels-photo-355935.jpeg',
            fun_fact: 'Sputnik was only 23 inches in diameter but changed the course of human history!',
            sequence_order: 1
          }
        ]
      }
    ]
  },
  {
    id: 'course-3',
    title: 'Astronomy Basics',
    description: 'Introduction to astronomy concepts, stargazing, and understanding celestial phenomena.',
    grade_level: 'Elementary',
    subject: 'Science',
    thumbnail: 'https://images.pexels.com/photos/1169754/pexels-photo-1169754.jpeg',
    created_date: '2023-07-05',
    xp_value: 150,
    size_category: 'Small',
    recommended_age: '8-10',
    lessons: [
      {
        id: 'lesson-3-1',
        title: 'Stargazing for Beginners',
        content: 'Learn how to identify stars, constellations, and planets in the night sky.',
        resource_links: ['https://spaceplace.nasa.gov/starfinder/'],
        sequence_order: 1,
        lesson_contents: [
          {
            id: 'content-3-1-1',
            subheading: 'Getting Started with Stargazing',
            text: 'All you need to begin is your eyes, a dark sky, and some patience. No expensive equipment required!',
            image_path: 'https://images.pexels.com/photos/1257860/pexels-photo-1257860.jpeg',
            fun_fact: 'The human eye can see about 6,000 stars on a clear, dark night!',
            sequence_order: 1
          }
        ]
      }
    ]
  }
];