# what-is-my-ip

[![CI](https://github.com/doctorlai/what-is-my-ip/actions/workflows/ci.yml/badge.svg)](https://github.com/doctorlai/what-is-my-ip/actions/workflows/ci.yml)
[![Manifest V3](https://img.shields.io/badge/manifest-v3-blue.svg)](show-ip/manifest.json)
[![Code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://prettier.io)
[![License: MIT](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![Chrome Web Store](https://img.shields.io/chrome-web-store/v/opljiobgnagdjikipnagigiacllolpaj.svg)](https://chrome.google.com/webstore/detail/show-my-ip-addresses-exte/opljiobgnagdjikipnagigiacllolpaj)
[![Users](https://img.shields.io/chrome-web-store/users/opljiobgnagdjikipnagigiacllolpaj.svg)](https://chrome.google.com/webstore/detail/show-my-ip-addresses-exte/opljiobgnagdjikipnagigiacllolpaj)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](#contributing)

A lightweight **Chrome extension** that shows both your **external (public)** and **local (internal)** IP addresses in a single click. Each address is labelled by family (**IPv4 / IPv6**) and scope (**public / private**), and your previous public IPs are remembered so you can spot when your address changes.

![screenshot](https://helloacm.com/static/what-is-my-ip.jpg)

## Features

- 🌐 Public IP via two independent APIs (with automatic fallback).
- 🏠 Local IPs discovered over WebRTC — no extra permissions needed.
- 🏷️ Each address tagged `IPv4/IPv6` and `public/private`.
- 🕑 Remembers previous public IPs so you can detect changes.
- 📋 One-click copy-to-clipboard for every field.
- 🌍 Localised in 20+ languages (en, zh, fr, de, es, it, pt, ru, ja, ko, ar, hi, and more).

## Install

- **Chrome Web Store:** <https://chrome.google.com/webstore/detail/show-my-ip-addresses-exte/opljiobgnagdjikipnagigiacllolpaj>
- **Web tool:** <https://helloacm.com/what-is-my-ip/>
- **From source:** `chrome://extensions` → enable _Developer mode_ → _Load unpacked_ → select the [show-ip](show-ip) folder.

## Development

```bash
npm install        # install dev tooling
npm test           # run unit tests
npm run coverage   # tests + coverage report
npm run lint       # ESLint
npm run format     # Prettier (write)
npm run validate   # lint + format check + tests
npm run build      # package show-ip/ into dist/show-ip-<version>.zip
```

The browser-independent logic lives in [show-ip/js/iputils.js](show-ip/js/iputils.js) as a UMD module so it runs unchanged in the extension and under Jest. DOM/Chrome wiring stays in [show-ip/js/ip.js](show-ip/js/ip.js).

## Project structure

```text
show-ip/            Extension source (manifest v3)
  js/iputils.js     Pure, tested helpers (validation, classification, parsing)
  js/ip.js          Popup logic / DOM wiring
tests/              Jest unit tests
scripts/build.js    Zip packager for the Web Store
.github/workflows/  CI: lint, format check, tests on Node 18/20/22
```

## Contributing

PRs welcome. Please run `npm run validate` before submitting.

## Support

- Buy me a coffee: <https://www.paypal.me/doctorlai/3> · <https://justyy.com/out/buymeacoffee>

## Related posts

- [Adding Clipboard Support to Chrome Extension: Show My IP Addresses](https://helloacm.com/adding-clipboard-support-to-chrome-extension-show-my-ip-addresses-external-and-local/)

## License

[MIT](LICENSE)
