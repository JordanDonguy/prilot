export const mockPrDescription = `## 🚀 Overview

This pull request introduces **mock data** to support local development and UI testing.
It allows the application to function without relying on live backend endpoints.

---

## ✨ What’s included

- Added mock data files to simulate API responses
- Updated components/pages to consume mock data
- Ensured mock data structure matches expected API contracts

---

## 📁 New / Updated files

\`\`\`txt
src/
 ├── mocks/
 │   ├── books.mock.ts
 │   ├── users.mock.ts
 │   └── comments.mock.ts
 ├── services/
 │   └── api.ts
\`\`\`

---

## 🧪 Example mock data

\`\`\`ts
export const booksMock = [
  {
    id: "1",
    title: "Clean Code",
    author: "Robert C. Martin",
    rating: 4.8,
    comments: []
  }
];
\`\`\`

---

## 🔜 Next steps

- Replace mock data with real API calls
- Remove development-only logic
`;
