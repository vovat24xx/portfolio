/* ============================================================
 *  EDIT ME — all copy for services, projects and process.
 *  Strings can be plain text or { en, uk } for the EN / UA toggle.
 * ============================================================ */

export const NAV = [
  { label: 'Services', href: '#services' },
  { label: 'Work', href: '#work' },
  { label: 'Process', href: '#process' },
  { label: 'Contact', href: '#contact' },
]

export const SERVICES = [
  {
    no: '01',
    title: 'WEBSITE DEVELOPMENT',
    desc: {
      en: 'One-page sites, corporate websites, business-card sites and landing pages.',
      uk: 'Односторінкові сайти, корпоративні сайти, сайти-візитки та landing pages.',
    },
  },
  {
    no: '02',
    title: 'TELEGRAM BOTS',
    desc: {
      en: 'Telegram bots, automation, Telegram Mini Apps and order systems.',
      uk: 'Telegram-боти, автоматизація, Telegram Mini Apps, системи замовлень.',
    },
  },
  {
    no: '03',
    title: 'E-COMMERCE',
    desc: {
      en: 'Online stores, product catalogs, carts, order systems and admin panels.',
      uk: 'Інтернет-магазини, каталоги товарів, кошики, системи замовлень та адміністративні панелі.',
    },
  },
  {
    no: '04',
    title: 'DIGITAL SOLUTIONS',
    desc: {
      en: 'Custom web projects, interactive interfaces and digital products.',
      uk: 'Індивідуальні вебпроєкти, інтерактивні інтерфейси та цифрові продукти.',
    },
  },
]

export const CATEGORIES = [
  { key: 'all', label: 'All' },
  { key: 'business', label: 'Business Websites' },
  { key: 'barber', label: 'Barber Shop Websites' },
  { key: 'ecommerce', label: 'E-commerce' },
  { key: 'miniapp', label: 'Telegram Mini Apps' },
  { key: 'bot', label: 'Telegram Bots' },
]

/*
 * Replace image / title / desc / url with your own work.
 * Images live in /public/assets/projects/ (any .jpg .png .webp .svg).
 * Set demo:false on a real project to remove the DEMO badge.
 */
export const PROJECTS = [
  {
    id: 'p1',
    category: 'business',
    title: 'Business Website — Concept',
    desc: {
      en: 'A corporate website concept: clear structure, strong typography and fast loading.',
      uk: 'Концепт корпоративного сайту: чітка структура, виразна типографіка та швидке завантаження.',
    },
    image: '/assets/projects/demo-business.svg',
    url: '#',
    demo: true,
  },
  {
    id: 'p2',
    category: 'barber',
    title: 'Barber Shop — Concept',
    desc: {
      en: 'A barber shop site with services, prices and online booking.',
      uk: 'Сайт барбершопу з послугами, цінами та онлайн-записом.',
    },
    image: '/assets/projects/demo-barber.svg',
    url: '#',
    demo: true,
  },
  {
    id: 'p3',
    category: 'ecommerce',
    title: 'Online Store — Concept',
    desc: {
      en: 'A store with a product catalog, cart and order flow.',
      uk: 'Магазин із каталогом товарів, кошиком та оформленням замовлення.',
    },
    image: '/assets/projects/demo-ecommerce.svg',
    url: '#',
    demo: true,
  },
  {
    id: 'p4',
    category: 'miniapp',
    title: 'Booking Mini App — Concept',
    desc: {
      en: 'A Telegram Mini App for choosing a service and booking a time slot.',
      uk: 'Telegram Mini App для вибору послуги та запису на зручний час.',
    },
    image: '/assets/projects/demo-miniapp.svg',
    url: '#',
    demo: true,
  },
  {
    id: 'p5',
    category: 'bot',
    title: 'Order Bot — Concept',
    desc: {
      en: 'A Telegram bot that takes orders, answers questions and notifies the owner.',
      uk: 'Telegram-бот, що приймає замовлення, відповідає на запитання та сповіщає власника.',
    },
    image: '/assets/projects/demo-bot.svg',
    url: '#',
    demo: true,
  },
]

export const PROCESS = [
  {
    no: '01',
    title: 'DISCOVERY',
    desc: {
      en: 'Discussing the idea and the needs of the client.',
      uk: 'Обговорення ідеї та потреб клієнта.',
    },
  },
  {
    no: '02',
    title: 'DESIGN',
    desc: {
      en: 'Creating the design and the concept.',
      uk: 'Створення дизайну та концепції.',
    },
  },
  {
    no: '03',
    title: 'DEVELOPMENT',
    desc: {
      en: 'Programming and building the project.',
      uk: 'Програмування та розробка.',
    },
  },
  {
    no: '04',
    title: 'LAUNCH',
    desc: {
      en: 'Testing and launching the project.',
      uk: 'Тестування та запуск проєкту.',
    },
  },
]
