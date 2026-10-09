// Drawings shown on the /art page and in the homepage teaser.
// To add one: put the image in public/art/ and add a line below.
// The first 3 drawings are used in the homepage teaser.
// Optional `position` sets which part of the image stays visible in the 4:5 frame
// (CSS object-position, e.g. '25% center' keeps the left side). The lightbox always shows it whole.

export const drawings = [
  { file: '/art/itachi-uchiha.jpg', title: 'Itachi Uchiha' },
  { file: '/art/naruto-uzumaki.jpg', title: 'Naruto Uzumaki' },
  { file: '/art/horse.jpg', title: 'Horse', position: '25% center' },
  { file: '/art/spider-man.jpg', title: 'Spider-Man' },
  { file: '/art/thor.jpg', title: 'Thor' },
  { file: '/art/portrait-1.jpg', title: 'Portrait', position: 'center 30%' },
  { file: '/art/shivaji-maharaj.jpg', title: 'Chhatrapati Shivaji Maharaj', position: 'center 30%' },
  { file: '/art/portrait-2.jpg', title: 'Portrait' },
]
