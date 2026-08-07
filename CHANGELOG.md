# Changelog

All notable changes to this project are documented in this file. This project
uses [Semantic Versioning](https://semver.org/).

## [Unreleased]

## [1.1.2] - 2026-08-07

### Added

- Pull request coverage reports with totals, thresholds, and per-file details.
- A JavaScript-percentage badge generated from GitHub Linguist data and
  published to the dedicated `badges` branch.
- A repository Node version file and formal support policy.

### Changed

- CI now runs lint and formatting once, tests Node.js 18, 20, and 22, enforces
  coverage on Node.js 22, and builds the Web Store package.
- The extension and package version are now `1.1.2`.
- Vulnerable transitive development dependencies were updated to patched versions.

### Fixed

- New IP addresses are retained after the 50-entry history reaches its cap.
- Invalid IP lookup responses and malformed stored history are ignored safely.
- Links use a high-contrast yellow in dark mode.

Earlier releases are available on the
[GitHub releases page](https://github.com/DoctorLai/what-is-my-ip/releases).
