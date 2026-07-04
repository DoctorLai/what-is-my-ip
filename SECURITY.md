# Security Policy

## Supported versions

Only the latest published release of the **Show My IP Addresses** extension
receives security updates. Please make sure you are running the newest version
from the [Chrome Web Store](https://chrome.google.com/webstore/detail/show-my-ip-addresses-exte/opljiobgnagdjikipnagigiacllolpaj)
before reporting an issue.

| Version | Supported          |
| ------- | ------------------ |
| 1.1.x   | :white_check_mark: |
| < 1.1   | :x:                |

## Reporting a vulnerability

**Please do not open a public GitHub issue for security vulnerabilities.**

Instead, report it privately using one of the following channels:

1. **GitHub Security Advisories (preferred).** Go to the
   [Security tab](https://github.com/DoctorLai/what-is-my-ip/security/advisories/new)
   and open a private vulnerability report.
2. **Email.** Write to **dr.zhihua.lai@gmail.com** with the subject
   `[what-is-my-ip] security`.

Please include:

- A description of the vulnerability and its potential impact.
- Step-by-step instructions to reproduce it.
- The extension version and your Chrome/Chromium version.
- Any relevant logs, screenshots, or proof-of-concept code.

### What to expect

- We aim to acknowledge your report within **72 hours**.
- We will keep you informed as we investigate and work on a fix.
- Once a fix is released, we are happy to credit you in the release notes
  (let us know if you prefer to stay anonymous).

## Scope

This extension is intentionally minimal. It requests only the `storage`
permission and talks to two IP-lookup endpoints declared in
[`show-ip/manifest.json`](show-ip/manifest.json). Reports that are most relevant
include, for example:

- Ways the extension could leak your IP history or local addresses beyond the
  documented behaviour.
- Cross-site scripting or code-injection in the popup UI.
- Supply-chain issues in the bundled third-party libraries.

Thank you for helping keep the project and its users safe!
