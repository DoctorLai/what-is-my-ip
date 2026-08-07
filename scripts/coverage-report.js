'use strict';

const path = require('path');

const categories = [
  ['lines', 'Lines'],
  ['statements', 'Statements'],
  ['functions', 'Functions'],
  ['branches', 'Branches'],
];
const metricFields = ['total', 'covered', 'skipped'];
const MAX_FILES = 250;
const MAX_FILE_PATH_LENGTH = 500;

function metricPercentage(metric) {
  if (metric.total === 0) return 100;
  return Number(((metric.covered / metric.total) * 100).toFixed(2));
}

function percentage(metric) {
  return `${metricPercentage(metric)}%`;
}

function status(metric, target) {
  return metricPercentage(metric) >= target ? '\u{1F535}' : '\u{1F534}';
}

function validateMetric(metric, label) {
  if (!metric || typeof metric !== 'object' || Array.isArray(metric)) {
    throw new TypeError(`${label} must be an object.`);
  }
  for (const field of metricFields) {
    if (!Number.isSafeInteger(metric[field]) || metric[field] < 0) {
      throw new TypeError(`${label}.${field} must be a non-negative integer.`);
    }
  }
  if (metric.covered > metric.total || metric.skipped > metric.total) {
    throw new RangeError(`${label} counts cannot exceed its total.`);
  }
  if (!Number.isFinite(metric.pct) || metric.pct < 0 || metric.pct > 100) {
    throw new RangeError(`${label}.pct must be between 0 and 100.`);
  }
  return metric;
}

function validateTarget(target, label) {
  if (!Number.isFinite(target) || target < 0 || target > 100) {
    throw new RangeError(`${label} threshold must be between 0 and 100.`);
  }
  return target;
}

function hasControlCharacter(value) {
  return [...value].some((character) => {
    const code = character.charCodeAt(0);
    return code <= 31 || code === 127;
  });
}

function validateFilePath(filePath) {
  if (
    typeof filePath !== 'string' ||
    filePath.length === 0 ||
    filePath.length > MAX_FILE_PATH_LENGTH ||
    hasControlCharacter(filePath) ||
    !/^[A-Za-z0-9._/\\ -]+$/.test(filePath)
  ) {
    throw new TypeError('Coverage summary contains an unsafe file path.');
  }
  return filePath;
}

function escapeTableCode(value) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/\|/g, '&#124;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function displayPath(filePath, repository) {
  const normalized = filePath.replace(/\\/g, '/');
  const repositoryName = repository ? repository.split('/').pop() : '';
  const marker = repositoryName ? `/${repositoryName}/` : '';
  const markerIndex = marker ? normalized.lastIndexOf(marker) : -1;
  return markerIndex >= 0
    ? normalized.slice(markerIndex + marker.length)
    : path.basename(normalized);
}

function renderCoverageReport(summary, thresholds, details = {}) {
  if (!summary || !summary.total) {
    throw new TypeError('Coverage summary must include total metrics.');
  }

  const report = [
    '## Coverage Report',
    '',
    '| Status | Category | Percentage | Covered / Total |',
    '| :---: | --- | ---: | ---: |',
  ];

  for (const [key, label] of categories) {
    const metric = validateMetric(summary.total[key], `total.${key}`);
    const target = validateTarget(thresholds[key], key);
    report.push(
      `| ${status(metric, target)} | ${label} | ${percentage(metric)} (\u{1F3AF} ${target}%) | ${metric.covered} / ${metric.total} |`
    );
  }

  const files = Object.entries(summary)
    .filter(([file]) => file !== 'total')
    .sort(([left], [right]) => left.localeCompare(right));
  if (files.length > MAX_FILES) {
    throw new RangeError(`Coverage summary cannot contain more than ${MAX_FILES} files.`);
  }

  report.push('', '<details>', '<summary>File Coverage</summary>', '');
  report.push('| File | Lines | Statements | Functions | Branches |');
  report.push('| --- | ---: | ---: | ---: | ---: |');
  for (const [file, metrics] of files) {
    const name = escapeTableCode(displayPath(validateFilePath(file), details.repository));
    const values = categories.map(([key]) =>
      percentage(validateMetric(metrics[key], `${file}.${key}`))
    );
    report.push(`| <code>${name}</code> | ${values.join(' | ')} |`);
  }
  report.push('', '</details>');

  if (details.runNumber && details.runUrl && details.sha && details.commitUrl) {
    const shortSha = details.sha.slice(0, 7);
    report.push(
      '',
      `Generated in [workflow #${details.runNumber}](${details.runUrl}) for commit [\`${shortSha}\`](${details.commitUrl}) by GitHub Actions.`
    );
  }

  return report.join('\n');
}

module.exports = { renderCoverageReport };
