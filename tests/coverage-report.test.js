'use strict';

const { renderCoverageReport } = require('../scripts/coverage-report');

const thresholds = { lines: 95, statements: 95, functions: 95, branches: 90 };
const complete = { total: 10, covered: 10, skipped: 0, pct: 100 };

function summaryWith(metric = complete) {
  return {
    total: {
      lines: metric,
      statements: complete,
      functions: complete,
      branches: complete,
    },
    '/home/runner/work/what-is-my-ip/what-is-my-ip/show-ip/js/iputils.js': {
      lines: metric,
      statements: complete,
      functions: complete,
      branches: complete,
    },
  };
}

describe('renderCoverageReport', () => {
  test('renders totals, targets, file coverage, and workflow links', () => {
    const report = renderCoverageReport(summaryWith(), thresholds, {
      repository: 'DoctorLai/what-is-my-ip',
      runNumber: 9,
      runUrl: 'https://github.com/DoctorLai/what-is-my-ip/actions/runs/99',
      sha: 'c75b153abcdef',
      commitUrl: 'https://github.com/DoctorLai/what-is-my-ip/commit/c75b153abcdef',
    });

    expect(report).toContain('| \u{1F535} | Lines | 100% (\u{1F3AF} 95%) | 10 / 10 |');
    expect(report).toContain('| <code>show-ip/js/iputils.js</code> | 100% | 100% | 100% | 100% |');
    expect(report).toContain('[workflow #9]');
    expect(report).toContain('[`c75b153`]');
  });

  test('marks a category red when it misses its threshold', () => {
    const report = renderCoverageReport(
      summaryWith({ total: 10, covered: 8, skipped: 0, pct: 80 }),
      { ...thresholds, lines: 81 }
    );

    expect(report).toContain('| \u{1F534} | Lines | 80% (\u{1F3AF} 81%) | 8 / 10 |');
  });

  test('rejects a malformed summary', () => {
    expect(() => renderCoverageReport({}, thresholds)).toThrow(
      'Coverage summary must include total metrics.'
    );
  });

  test('rejects non-numeric coverage counts from an untrusted artifact', () => {
    const summary = summaryWith();
    summary.total.lines = {
      ...complete,
      covered: '1 | [injected](https://example.invalid)',
    };

    expect(() => renderCoverageReport(summary, thresholds)).toThrow(
      'total.lines.covered must be a non-negative integer.'
    );
  });

  test('rejects file paths containing Markdown control characters', () => {
    const summary = summaryWith();
    summary['file\n\n## Injected heading'] = summary[Object.keys(summary)[1]];

    expect(() => renderCoverageReport(summary, thresholds)).toThrow(
      'Coverage summary contains an unsafe file path.'
    );
  });

  test.each([
    '/tmp/![Coverage passed](https://example.invalid/pixel.png)',
    '/tmp/[trusted report](https://example.invalid)',
    '/tmp/`injected`.js',
    '/tmp/<unsafe>|file.js',
  ])('rejects Markdown or HTML metacharacters in file path %s', (filePath) => {
    const summary = summaryWith();
    summary[filePath] = summary[Object.keys(summary)[1]];

    expect(() => renderCoverageReport(summary, thresholds)).toThrow(
      'Coverage summary contains an unsafe file path.'
    );
  });

  test('rejects invalid metrics and thresholds', () => {
    const missingMetric = summaryWith();
    missingMetric.total.lines = null;
    expect(() => renderCoverageReport(missingMetric, thresholds)).toThrow(
      'total.lines must be an object.'
    );

    const impossibleCount = summaryWith({ ...complete, total: 1, covered: 2 });
    expect(() => renderCoverageReport(impossibleCount, thresholds)).toThrow(
      'total.lines counts cannot exceed its total.'
    );

    const invalidPercentage = summaryWith({ ...complete, pct: 101 });
    expect(() => renderCoverageReport(invalidPercentage, thresholds)).toThrow(
      'total.lines.pct must be between 0 and 100.'
    );

    expect(() => renderCoverageReport(summaryWith(), { ...thresholds, lines: 101 })).toThrow(
      'lines threshold must be between 0 and 100.'
    );
  });

  test('rejects an excessive number of file rows', () => {
    const summary = summaryWith();
    const fileMetrics = summary[Object.keys(summary)[1]];
    for (let index = 0; index < 250; index += 1) {
      summary[`/tmp/file-${index}.js`] = fileMetrics;
    }

    expect(() => renderCoverageReport(summary, thresholds)).toThrow(
      'Coverage summary cannot contain more than 250 files.'
    );
  });
});
