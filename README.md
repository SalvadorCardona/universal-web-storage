# ssr-safe-storage

A typed `localStorage` wrapper that keeps working outside the browser.

Values are serialised as JSON going in and parsed coming out, so you store
objects rather than strings. During server-side rendering — or in a test runner
without a DOM — the same calls fall through to an in-memory store instead of
throwing on a missing `localStorage`.

```ts
import { getInStorage, setInStorage, removeInStorage } from "ssr-safe-storage"

setInStorage("preferences", { theme: "dark", density: "compact" })

const preferences = getInStorage<{ theme: string }>("preferences")
// → { theme: "dark", density: "compact" }

removeInStorage("preferences")
```

## Installation

```bash
pnpm add ssr-safe-storage
```

No dependencies.

## API

| Function | Purpose |
| --- | --- |
| `getInStorage<T>(key)` | Reads and parses a value |
| `setInStorage(key, data)` | Serialises and writes a value |
| `removeInStorage(key)` | Removes a key |

`getInStorage` distinguishes two empty cases: it returns `null` when the key was
never set, and `undefined` when the value stored for it was itself `undefined`.
That distinction matters when absence and "explicitly nothing" mean different
things to the caller.

## The in-memory fallback

Outside the browser, reads and writes go to a plain object living for the
duration of the process. It is not shared between requests and it is not a
server-side persistence layer — it exists so the calling code can stay identical
on both sides instead of being wrapped in `typeof window` checks.

## Development

```bash
pnpm install
pnpm test
pnpm typecheck
pnpm lint
pnpm build
```

## License

MIT
