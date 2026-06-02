# Publications

Each `.md` file in this directory corresponds to one paper. `publications.html` reads the front matter from these files in the browser and renders the publication list automatically.

To add a new paper, copy any existing file as a template and update the fields:

```md
---
title: Paper title
authors: Author list, with **name** used for highlighting
venue: Conference or journal name
year: 2025
group: 2025
image: ./assets/img/example.webp
alt: Image alt text
badges: CVPR 2025|default;Oral|highlight
links: PDF|https://example.com/paper.pdf;Code|https://github.com/example/repo
---
```

Notes:

- `group` controls the collapsible section, such as `2025`, `2024`, or `Earlier`.
- `badges` uses semicolons to separate multiple labels, with the format `Text|style`.
- `links` uses semicolons to separate multiple links, with the format `Button Label|URL`.
- Display order is controlled by the `publicationFiles` array in `assets/js/publications.js`.
