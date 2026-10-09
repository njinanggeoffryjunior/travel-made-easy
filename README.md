# Travel Made Easy

Aim to help people around the world to find out what is best for them in Italy in terms of education or research.
First version: Italy, field education and research. One Expo (React Native) codebase runs on web, iOS and Android.

Live site: https://njinanggeoffryjunior.github.io/travel-made-easy/ (updates automatically on every push to `main`).

## Run it

```bash
npm install
npm run web       # opens in the browser
npm start         # scan the QR code with Expo Go on your phone
```

## How it works

- `src/data/questions.ts`: the eight profile questions.
- `src/data/italy.ts`: Italy content (routes from bachelor's to faculty and teaching, visa notes, institutions) and the scoring rule for each route.
- `src/lib/recommend.ts`: scores every route for a profile and ranks countries by their best route.
- `src/app/`: screens (Expo Router): home, questionnaire, results, route details.

To add a country, create a `Country` object like `italy` and add it to `countries`.
Facts change yearly; update `lastReviewed` when you check the content.
