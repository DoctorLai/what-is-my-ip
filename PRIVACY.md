# Privacy Policy

_Last updated: 2026-07-04_

**Show My IP Addresses (External and Local)** is designed to be private by
default. It contains **no analytics, no trackers, and no advertising SDKs**, and
it does not sell or share any personal data. This document explains exactly what
the extension does with information on your device.

## What the extension accesses

| Data               | Where it comes from                              | Where it goes                                                     |
| ------------------ | ------------------------------------------------ | ----------------------------------------------------------------- |
| Your **public IP** | Fetched from two IP-lookup endpoints (see below) | Displayed in the popup; the newest value is saved to browser sync |
| Your **local IPs** | Discovered in your browser via WebRTC            | Displayed in the popup only — **never sent off your device**      |
| **Previous IPs**   | Derived from the public IPs above                | Stored with `chrome.storage.sync` so you can spot when it changes |

## Network requests

To look up your public IP address, the extension makes a request to the
following endpoints. These are the only hosts listed in `host_permissions`:

- `https://what-is-my-ip.functionapi.workers.dev/`
- `https://api.ipify.org/`

These services return your public IP address. No additional personal
information is transmitted with these requests.

## Local IP discovery

Local (private) IP addresses are discovered entirely inside your browser using
the standard **WebRTC** API. This happens locally and the results are shown only
in the popup. Your local addresses are **never uploaded anywhere**.

## Storage

- The extension stores your **previously seen public IP addresses** using
  `chrome.storage.sync`. If you are signed in to Chrome, this data syncs across
  your own devices via your Google account — it is not accessible to the
  extension author.
- You can erase this history at any time by clicking the **Clear** button in the
  popup.

## Permissions

The extension requests a single Chrome permission:

- **`storage`** — to remember your previous public IP addresses locally.

It does **not** request access to your browsing history, tabs, cookies, or the
content of the pages you visit.

## Data sharing & sale

We do **not** sell, rent, or share your data with third parties. The only data
that leaves your device is the network request needed to determine your public
IP, sent to the endpoints listed above.

## Children's privacy

The extension is a general-purpose utility and does not knowingly collect any
personal information from children.

## Changes to this policy

If this policy changes, the updated version will be committed to this repository
and the "Last updated" date above will be revised.

## Contact

Questions about privacy? Open an issue on
[GitHub](https://github.com/DoctorLai/what-is-my-ip/issues) or email
**dr.zhihua.lai@gmail.com**.
