# Premium Digital Creator Portfolio

React + Vite + GSAP (ScrollTrigger) + Lenis. Безперервний срібний ланцюг намальований на Canvas 2D
(WebGL не потрібен, тому fallback для пристроїв без WebGL не потрібен).

## 1. Запуск на MacBook (Terminal)

```bash
# Node 18+ (рекомендовано 20). Якщо Node немає:
brew install node@20

cd portfolio
npm install
npm run dev          # http://localhost:5173  (+ адреса для iPhone/Android у тій самій Wi-Fi мережі)
npm run build        # збірка у dist/
npm run preview      # локальна перевірка збірки
```

VS Code: `code .` у папці проєкту.

## 2. Що редагувати

| Що | Де |
|---|---|
| Ім'я, відео, контакти (Telegram, WhatsApp, Instagram, Email) | `src/config.js` |
| Послуги, проєкти, етапи роботи (EN/UA) | `src/data/content.js` |
| Картинки проєктів | `public/assets/projects/` (ім'я файлу вкажи в `content.js`) |
| Відео | `public/assets/hero-money.mp4`, `hero-money-sm.mp4`, `hero-poster.jpg` |
| Маршрут ланцюга | маркери `<i className="cp" data-cp="0.5" data-layer="back" style={{top:'40%'}}>` у компонентах: `data-cp` = позиція по X (0 ліво … 1 право), `data-layer` = `front` (поверх тексту) / `back` (за текстом) |
| SEO | `index.html` (замін `YOUR-DOMAIN.com`), `public/robots.txt`, `public/sitemap.xml` |

Проєкти з `demo: true` мають позначку DEMO. Для реальної роботи постав `demo: false` і свій `url`.

### Відео
- Оригінал (27.5 МБ) НЕ кладіть у `public/`: Cloudflare Pages приймає файли до 25 МБ. Тут лежить стиснута версія (3.3 МБ, 1248×704, 30 fps, без звуку).
- На телефонах вантажиться `hero-money-sm.mp4` (832 px).
- У кліпі є водяний знак Dreamina. Він знаходиться в нижньому правому куті, де відео плавно розчиняється в чорному (маска + градієнт), без обрізання кадру. Щоб замінити на чисту версію: поклади нові файли з тими самими іменами в `public/assets/` і постав `hasWatermark: false` у `src/config.js`.

Стиснення нового відео:
```bash
ffmpeg -i clean.mp4 -an -r 30 -c:v libx264 -preset slow -crf 27 -pix_fmt yuv420p -movflags +faststart public/assets/hero-money.mp4
ffmpeg -i clean.mp4 -an -r 30 -vf scale=832:-2 -c:v libx264 -preset slow -crf 28 -pix_fmt yuv420p -movflags +faststart public/assets/hero-money-sm.mp4
ffmpeg -i clean.mp4 -frames:v 1 -q:v 3 public/assets/hero-poster.jpg
```

## 3. GitHub

1. На github.com: **New repository** → назва `portfolio`, без README/.gitignore.
2. У Terminal, у папці проєкту:
```bash
git init
git add .
git commit -m "Initial portfolio"
git branch -M main
git remote add origin https://github.com/ТВІЙ_ЛОГІН/portfolio.git
git push -u origin main
```
(`node_modules` і `dist` ігноруються через `.gitignore`.)

## 4. Cloudflare Pages + автооновлення

1. dash.cloudflare.com → **Workers & Pages** → **Create** → **Pages** → **Connect to Git**.
2. Авторизуй GitHub і обери репозиторій `portfolio`.
3. Налаштування збірки:
   - Production branch: `main`
   - Framework preset: `Vite` (або None)
   - Build command: `npm run build`
   - Build output directory: `dist`
   - Environment variable: `NODE_VERSION` = `20`
4. **Save and Deploy**. Сайт буде на `https://portfolio-xxx.pages.dev`.
5. Автооновлення вже працює: кожен `git push` у `main` запускає нову збірку й публікацію. Інші гілки та Pull Request отримують окремі preview-адреси.

Оновлення сайту:
```bash
git add .
git commit -m "Update projects"
git push
```
Свій домен: проєкт Pages → **Custom domains**. Потім замін `YOUR-DOMAIN.com` в `index.html`, `robots.txt`, `sitemap.xml`.

## 5. Технічні нотатки
- `prefers-reduced-motion`: без плавного скролу й анімацій, ланцюг статичний, відео на паузі (є кнопка PLAY).
- Відео ставиться на паузу, коли hero поза екраном.
- Шрифт Archivo (змінна ширина) підключається з Google Fonts.
