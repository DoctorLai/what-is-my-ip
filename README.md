# what-is-my-ip

<!-- Build & quality -->

[![CI](https://github.com/DoctorLai/what-is-my-ip/actions/workflows/ci.yml/badge.svg)](https://github.com/DoctorLai/what-is-my-ip/actions/workflows/ci.yml)
[![Node.js](https://img.shields.io/badge/node-%3E%3D18-339933?logo=node.js&logoColor=white)](https://nodejs.org)
[![Manifest V3](https://img.shields.io/badge/manifest-v3-blue.svg)](show-ip/manifest.json)
[![Code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://prettier.io)
[![License](https://img.shields.io/github/license/DoctorLai/what-is-my-ip.svg)](LICENSE)
[![Ask DeepWiki](https://deepwiki.com/badge.svg)](https://deepwiki.com/DoctorLai/what-is-my-ip)

<!-- Repository stats -->

[![GitHub stars](https://img.shields.io/github/stars/DoctorLai/what-is-my-ip.svg?style=flat&logo=github)](https://github.com/DoctorLai/what-is-my-ip/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/DoctorLai/what-is-my-ip.svg?style=flat&logo=github)](https://github.com/DoctorLai/what-is-my-ip/network/members)
[![GitHub watchers](https://img.shields.io/github/watchers/DoctorLai/what-is-my-ip.svg?style=flat&logo=github)](https://github.com/DoctorLai/what-is-my-ip/watchers)
[![GitHub open issues](https://img.shields.io/github/issues/DoctorLai/what-is-my-ip.svg)](https://github.com/DoctorLai/what-is-my-ip/issues)
[![GitHub open PRs](https://img.shields.io/github/issues-pr/DoctorLai/what-is-my-ip.svg)](https://github.com/DoctorLai/what-is-my-ip/pulls)

<!-- Activity & size -->

[![Last commit](https://img.shields.io/github/last-commit/DoctorLai/what-is-my-ip.svg)](https://github.com/DoctorLai/what-is-my-ip/commits)
[![Commit activity](https://img.shields.io/github/commit-activity/m/DoctorLai/what-is-my-ip.svg)](https://github.com/DoctorLai/what-is-my-ip/graphs/commit-activity)
[![Repo size](https://img.shields.io/github/repo-size/DoctorLai/what-is-my-ip.svg)](https://github.com/DoctorLai/what-is-my-ip)
[![Top language](https://img.shields.io/github/languages/top/DoctorLai/what-is-my-ip.svg?logo=javascript)](https://github.com/DoctorLai/what-is-my-ip/search?l=javascript)
[![Code size](https://img.shields.io/github/languages/code-size/DoctorLai/what-is-my-ip.svg)](https://github.com/DoctorLai/what-is-my-ip)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)

<!-- Chrome Web Store -->

[![Chrome Web Store](https://img.shields.io/chrome-web-store/v/opljiobgnagdjikipnagigiacllolpaj.svg?label=chrome%20web%20store)](https://chrome.google.com/webstore/detail/show-my-ip-addresses-exte/opljiobgnagdjikipnagigiacllolpaj)
[![Users](https://img.shields.io/chrome-web-store/users/opljiobgnagdjikipnagigiacllolpaj.svg)](https://chrome.google.com/webstore/detail/show-my-ip-addresses-exte/opljiobgnagdjikipnagigiacllolpaj)
[![Rating](https://img.shields.io/chrome-web-store/rating/opljiobgnagdjikipnagigiacllolpaj.svg)](https://chrome.google.com/webstore/detail/show-my-ip-addresses-exte/opljiobgnagdjikipnagigiacllolpaj)

A lightweight **Chrome extension** that shows both your **external (public)** and **local (internal)** IP addresses in a single click. Each address is labelled by family (**IPv4 / IPv6**) and scope (**public / private**), and your previous public IPs are remembered so you can spot when your address changes.

![screenshot](https://helloacm.com/static/what-is-my-ip.jpg)

## Contents

- [Features](#features)
- [Install](#install)
- [Usage](#usage)
- [Privacy](#privacy)
- [Security](#security)
- [Development](#development)
- [Project structure](#project-structure)
- [Building for the Chrome Web Store](#building-for-the-chrome-web-store)
- [Contributing](#contributing)
- [Support](#support)
- [License](#license)

## Features

- 🌐 Public IP looked up via two independent APIs for redundancy.
- 🏠 Local IPs discovered over WebRTC — no extra permissions needed.
- 🏷️ Each address tagged `IPv4/IPv6` and `public/private`.
- 🕑 Remembers previous public IPs (capped) so you can detect changes.
- 🔄 One-click **Refresh** — with a busy indicator — to re-check without reopening the popup.
- 🌓 Automatic **dark mode** that follows your system theme.
- 📋 One-click copy-to-clipboard for every field.
- 🌍 Store listing localised in 25+ languages (en, zh, es, hi, ar, bn, pt, ru, ja, de, fr, ko, it, ta, te, mr, sw, and more).

## Install

- **Chrome Web Store:** <https://chrome.google.com/webstore/detail/show-my-ip-addresses-exte/opljiobgnagdjikipnagigiacllolpaj>
- **Web tool:** <https://helloacm.com/what-is-my-ip/>
- **From source:** `chrome://extensions` → enable _Developer mode_ → _Load unpacked_ → select the [show-ip](show-ip) folder.

## Usage

1. Click the **Show My IP** toolbar icon to open the popup.
2. Your **external** IP appears at the top, your **local** IP(s) below, and any
   **previously seen** public IPs in the middle.
3. Use the 📋 button on any field to copy it, **Refresh** to re-check, or
   **Clear** to forget the saved history.
4. Tick **Show API Log** to see which lookup endpoint answered.

## Privacy

This extension is intentionally minimal and collects **no analytics**:

- **External IP** is fetched from `what-is-my-ip.functionapi.workers.dev` and
  `api.ipify.org`. Only those endpoints are listed in `host_permissions`.
- **Local IPs** are discovered in your browser via WebRTC and are never sent
  anywhere.
- **Previous public IPs** are stored with `chrome.storage.sync` (so they follow
  your Chrome profile) purely so you can spot changes — clear them anytime with
  the **Clear** button.
- The only Chrome permission requested is `storage`.

See [PRIVACY.md](PRIVACY.md) for the full privacy policy.

## Security

Found a security issue? Please **do not** open a public issue. Follow the
responsible-disclosure process described in [SECURITY.md](SECURITY.md) to report
it privately.

## Development

```bash
npm install        # install dev tooling
npm test           # run unit tests
npm run coverage   # tests + coverage report (enforces a minimum threshold)
npm run lint       # ESLint
npm run format     # Prettier (write)
npm run check      # lint + format check + coverage + build (run before a PR)
npm run build      # package show-ip/ into dist/show-ip-<version>.zip
```

The browser-independent logic lives in [show-ip/js/iputils.js](show-ip/js/iputils.js) as a UMD module so it runs unchanged in the extension and under Jest. DOM/Chrome wiring stays in [show-ip/js/ip.js](show-ip/js/ip.js).

### Testing

Unit tests run in Node with Jest — no browser required, because all testable
logic lives in [show-ip/js/iputils.js](show-ip/js/iputils.js). The suite also
asserts packaging invariants (manifest ↔ `package.json` version sync, network
endpoints ↔ `host_permissions`, and locale integrity). `npm run coverage`
enforces a minimum threshold (95% statements/lines/functions, 90% branches) and
fails the build if coverage drops below it.

## Project structure

```text
show-ip/              Extension source (Manifest V3)
  manifest.json       MV3 manifest (localised name/description)
  main.html           Popup markup + styles
  js/iputils.js       Pure, tested helpers (validation, classification, parsing)
  js/ip.js            Popup logic / DOM + Chrome API wiring
  _locales/           Store-listing translations (25+ languages)
tests/                Jest unit tests (helpers + packaging invariants)
scripts/build.js      Cross-platform zip packager for the Web Store
.github/
  workflows/ci.yml    CI: lint, format check, coverage on Node 18/20/22 + build
  dependabot.yml      Weekly npm + GitHub Actions dependency updates
  ISSUE_TEMPLATE/     Bug report & feature request forms
CONTRIBUTING.md       Contributor guide
SECURITY.md           Security policy & disclosure process
PRIVACY.md            Privacy policy
```

## Building for the Chrome Web Store

```bash
npm run build
```

This reads the version from [show-ip/manifest.json](show-ip/manifest.json) and
writes `dist/show-ip-<version>.zip`. The packager is pure Node (via `archiver`),
so it works on Windows, macOS and Linux without a system `zip` binary. Upload
the resulting zip in the [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole).

## Contributing

PRs welcome! Please read [CONTRIBUTING.md](CONTRIBUTING.md) and run `npm run check`
before submitting.

## Support

- Buy me a coffee: <https://www.paypal.me/doctorlai/3> · <https://justyy.com/out/buymeacoffee>

## Related posts

- [Adding Clipboard Support to Chrome Extension: Show My IP Addresses](https://helloacm.com/adding-clipboard-support-to-chrome-extension-show-my-ip-addresses-external-and-local/)

## License

[MIT](LICENSE)
