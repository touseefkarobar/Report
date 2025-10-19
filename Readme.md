# Report App

A minimal starter README for initializing a report-generation application that assembles data and templates into PDF/HTML reports.

## Summary
Generate exportable reports (HTML, PDF) from JSON or database sources using templates. This repo provides structure, scripts, and configuration to get started quickly.

## Features
- Template-driven report rendering (HTML/Handlebars, Nunjucks, etc.)
- PDF export (Puppeteer or wkhtmltopdf)
- Config-driven data sources and output locations
- CLI and/or HTTP endpoint for report generation

## Quick start (Node.js example)
1. Initialize repo
    - git init
    - mkdir src templates config data public
2. Create package.json
    - npm init -y
3. Install common dependencies
    - npm install express dotenv handlebars puppeteer
4. Add npm scripts to package.json
    - "dev": "node src/server.js"
    - "build-report": "node src/generateReport.js"

## Recommended project layout
- src/                 — application source (server, workers, generators)
- templates/           — report templates (HTML, partials, styles)
- data/                — sample data / fixtures
- config/              — environment and runtime configs
- public/              — static assets (CSS, images)
- scripts/             — build or deployment scripts
- README.md            — this file

## Example config (config/default.json)
{
  "port": 3000,
  "outputDir": "reports",
  "template": "templates/report.hbs"
}

(Use dotenv or your preferred config library to override in environments.)

## Basic usage
- Development server:
  - npm run dev
  - Open http://localhost:3000 and use the UI or POST JSON to /generate
- Generate a report via CLI:
  - node src/generateReport.js --input data/sample.json --template templates/report.hbs --output reports/report.pdf

## Tips
- Keep templates small and composable (partials for headers/footers)
- Produce both HTML and PDF outputs for debugging (render HTML first)
- Store generated reports in a time-stamped subfolder for traceability

## Contributing
- Follow a consistent coding style
- Add unit tests for data transformations
- Document template context keys for template authors

## License
Choose an appropriate license (MIT, Apache-2.0, etc.) and add a LICENSE file.

Start by creating minimal files: src/server.js, src/generateReport.js, a template in templates/, and a sample data JSON in data/. Iterate from there.