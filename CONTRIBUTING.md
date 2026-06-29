# Contributing to what-is-my-ip

Thanks for taking the time to contribute! This is a small Chrome (Manifest V3)
extension, so the workflow is intentionally lightweight.

## Getting started

1. **Fork** the repository and clone your fork.
2. Install the development tooling:

   ```bash
   npm install
   ```

3. Load the extension while you work: open `chrome://extensions`, enable
   **Developer mode**, click **Load unpacked**, and select the
   [`show-ip`](show-ip) folder. Reload the extension after each change.

## Project layout

| Path                    | Purpose                                          |
| ----------------------- | ------------------------------------------------ |
| `show-ip/`              | The extension itself (Manifest V3).              |
| `show-ip/js/iputils.js` | Pure, dependency-free helpers — **unit tested**. |
| `show-ip/js/ip.js`      | Popup logic / DOM + Chrome API wiring.           |
| `show-ip/_locales/`     | Translations (`messages.json` per locale).       |
| `tests/`                | Jest unit tests.                                 |
| `scripts/build.js`      | Packages `show-ip/` into a Web Store `.zip`.     |

Keep browser-independent logic in `iputils.js` so it can be tested in Node.
Anything that touches the DOM, jQuery, or `chrome.*` APIs belongs in `ip.js`.

## Useful commands

```bash
npm test            # run unit tests
npm run coverage    # tests + coverage (enforces the coverage threshold)
npm run lint        # ESLint
npm run lint:fix    # ESLint with autofix
npm run format      # Prettier (write)
npm run check       # lint + format check + coverage — run before opening a PR
npm run build       # package show-ip/ into dist/show-ip-<version>.zip
```

## Before you open a pull request

- Run `npm run check` and make sure it passes.
- Add or update tests for any behaviour you change in `iputils.js`.
- If you add or remove a network endpoint in `ip.js`, update
  `host_permissions` in [`show-ip/manifest.json`](show-ip/manifest.json) — a test
  enforces that they stay in sync.
- If you add a new user-visible string, update the locale files under
  `show-ip/_locales/`.

## Commit messages

This project loosely follows [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add refresh button to the popup
fix: correct IPv6 link-local detection
chore: bump dependencies
docs: clarify install steps
```

## Reporting bugs & requesting features

Please use the GitHub issue templates under
[`.github/ISSUE_TEMPLATE`](.github/ISSUE_TEMPLATE). Include your Chrome version
and steps to reproduce for bug reports.

## Code of conduct

Be respectful and constructive. By contributing, you agree that your
contributions are licensed under the [MIT License](LICENSE).
