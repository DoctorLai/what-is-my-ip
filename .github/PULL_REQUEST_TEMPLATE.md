<!--
Thanks for contributing to what-is-my-ip! 🎉
Please fill in the sections below so reviewers can understand your change.
-->

## Summary

<!-- What does this PR do and why? Link any related issues, e.g. "Closes #123". -->

## Type of change

- [ ] 🐛 Bug fix (non-breaking change that fixes an issue)
- [ ] ✨ New feature (non-breaking change that adds functionality)
- [ ] 💥 Breaking change (fix or feature that changes existing behaviour)
- [ ] 🌍 Localisation (new or updated translation under `show-ip/_locales/`)
- [ ] 📝 Documentation only
- [ ] 🧹 Chore / tooling / refactor

## Checklist

- [ ] I ran `npm run check` locally and it passes (lint + format + coverage + build).
- [ ] I added or updated unit tests for any behaviour changed in `show-ip/js/iputils.js`.
- [ ] If I added or removed a network endpoint in `show-ip/js/ip.js`, I updated
      `host_permissions` in `show-ip/manifest.json` (a test enforces they stay in sync).
- [ ] If I added a new user-visible string, I updated the locale files under
      `show-ip/_locales/`.
- [ ] I bumped the `version` in both `package.json` and `show-ip/manifest.json` if needed.
- [ ] My changes follow the project's [Conventional Commits](https://www.conventionalcommits.org/) style.

## How was this tested?

<!-- Describe how you verified the change: unit tests, manual testing in Chrome, etc.
     Include your Chrome/Chromium version if the change is UI/behaviour related. -->

## Screenshots (if applicable)

<!-- Drag & drop before/after screenshots of the popup here. -->
