var publicationFiles = [
    './publications/2026-RADAR.md',
    './publications/2026-RunawayEvil.md',
    './publications/2026-UCOD-MKD.md',
    './publications/2026-J-TLAT.md',
    './publications/2026-NEURERASE.md',
    './publications/2026-Category-Guided UCOD with SAM3.md',
    './publications/2025-saferbench.md',
    './publications/2025-good-yueming.md',
    './publications/2025-VFAT-WS.md',
    './publications/2025-frequency-domain-distributed-perturbations.md',
    './publications/2025-image-level-memorization.md',
    './publications/2025-concept-corrector.md',
    './publications/2024-social-biases-diffusion.md',
    './publications/2024-3d-aware-adversarial-makeup.md',
    './publications/2023-deltaedit.md',
    './publications/2021-sogan.md'
];

function escapeHtml(value) {
    return String(value || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function parseFrontMatter(markdown) {
    var match = markdown.match(/^---\s*\n([\s\S]*?)\n---\s*/);
    if (!match) return null;

    var data = {};
    match[1].split('\n').forEach(function (line) {
        var trimmed = line.trim();
        if (!trimmed || trimmed.charAt(0) === '#') return;

        var separatorIndex = trimmed.indexOf(':');
        if (separatorIndex === -1) return;

        var key = trimmed.slice(0, separatorIndex).trim();
        var value = trimmed.slice(separatorIndex + 1).trim();
        data[key] = value;
    });

    return data;
}

function parseBadgeList(value) {
    if (!value) return [];

    return value.split(';').map(function (item) {
        var parts = item.split('|');
        return {
            text: (parts[0] || '').trim(),
            tone: (parts[1] || 'default').trim()
        };
    }).filter(function (item) {
        return item.text !== '';
    });
}

function parseLinkList(value) {
    if (!value) return [];

    return value.split(';').map(function (item) {
        var parts = item.split('|');
        return {
            label: (parts[0] || '').trim(),
            url: (parts[1] || '').trim()
        };
    }).filter(function (item) {
        return item.label !== '' && item.url !== '';
    });
}

function formatAuthors(authors) {
    return escapeHtml(authors || '').replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
}

function createPublicationItem(publication) {
    var badges = parseBadgeList(publication.badges).map(function (badge) {
        var toneClass = badge.tone === 'highlight' ? ' oral' : '';
        return '<span class="pub-venue-badge' + toneClass + '">' + escapeHtml(badge.text) + '</span>';
    }).join('\n');

    var links = parseLinkList(publication.links).map(function (link) {
        return '<a class="pub-link" href="' + escapeHtml(link.url) + '" target="_blank" rel="noopener noreferrer">' + escapeHtml(link.label) + '</a>';
    }).join('\n');

    return '<div class="pub-item">'
        + '<div class="pub-thumb"><img src="' + escapeHtml(publication.image) + '" alt="' + escapeHtml(publication.alt || publication.title) + '"></div>'
        + '<div class="pub-content">'
        + '<div class="pub-title">' + escapeHtml(publication.title) + '</div>'
        + '<div class="pub-authors">' + formatAuthors(publication.authors) + '</div>'
        + '<div class="pub-venue">' + badges + '</div>'
        + '<div class="pub-links">' + links + '</div>'
        + '</div>'
        + '</div>';
}

function createPublicationGroup(groupName, publications, expanded) {
    var groupId = 'pubs-' + groupName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    var listHtml = publications.map(createPublicationItem).join('');

    return '<div class="pub-year-group">'
        + '<button class="pub-year-header" data-bs-toggle="collapse" data-bs-target="#' + groupId + '" aria-expanded="' + (expanded ? 'true' : 'false') + '">'
        + '<span class="year-label">' + escapeHtml(groupName) + '</span>'
        + '<span class="year-count">' + publications.length + ' papers</span>'
        + '<i class="bi bi-chevron-down chevron"></i>'
        + '</button>'
        + '<div id="' + groupId + '" class="collapse' + (expanded ? ' show' : '') + '">'
        + '<div class="pub-list">' + listHtml + '</div>'
        + '</div>'
        + '</div>';
}

function compareGroups(a, b) {
    var aYear = parseInt(a, 10);
    var bYear = parseInt(b, 10);
    var aIsYear = !isNaN(aYear);
    var bIsYear = !isNaN(bYear);

    if (aIsYear && bIsYear) return bYear - aYear;
    if (aIsYear) return -1;
    if (bIsYear) return 1;
    if (a === 'Earlier') return 1;
    if (b === 'Earlier') return -1;
    return a.localeCompare(b);
}

function bindPublicationCollapse() {
    document.querySelectorAll('.pub-year-header').forEach(function (button) {
        button.addEventListener('click', function () {
            var expanded = button.getAttribute('aria-expanded') === 'true';
            button.setAttribute('aria-expanded', expanded ? 'false' : 'true');
        });

        var targetId = button.getAttribute('data-bs-target');
        var target = document.querySelector(targetId);
        if (!target) return;

        target.addEventListener('show.bs.collapse', function () {
            button.setAttribute('aria-expanded', 'true');
        });
        target.addEventListener('hide.bs.collapse', function () {
            button.setAttribute('aria-expanded', 'false');
        });
    });
}

function renderPublications(publications) {
    var container = document.getElementById('publications-container');
    if (!container) return;

    if (!publications.length) {
        container.innerHTML = '<div class="pub-empty">No publication records found.</div>';
        return;
    }

    var groups = {};
    publications.forEach(function (publication) {
        var groupName = publication.group || String(publication.year || 'Other');
        if (!groups[groupName]) groups[groupName] = [];
        groups[groupName].push(publication);
    });

    var groupNames = Object.keys(groups).sort(compareGroups);
    var html = groupNames.map(function (groupName, index) {
        return createPublicationGroup(groupName, groups[groupName], index === 0);
    }).join('');

    container.innerHTML = html;
    bindPublicationCollapse();
}

function getFallbackPublications() {
    if (typeof publicationFallbackData === 'undefined' || !publicationFallbackData) {
        return [];
    }

    return publicationFiles.map(function (path, index) {
        var publication = publicationFallbackData[path];
        if (!publication) return null;

        var item = {};
        Object.keys(publication).forEach(function (key) {
            item[key] = publication[key];
        });
        item.__order = index;
        return item;
    }).filter(function (item) {
        return item !== null;
    });
}

function renderFallbackPublications() {
    var publications = getFallbackPublications();
    if (!publications.length) return false;

    renderPublications(publications);
    return true;
}

function loadPublications() {
    var container = document.getElementById('publications-container');
    if (!container) return;

    if (window.location.protocol === 'file:') {
        if (renderFallbackPublications()) return;
    }

    Promise.all(publicationFiles.map(function (path, index) {
        return fetch(path)
            .then(function (response) {
                if (!response.ok) throw new Error('Failed to load ' + path);
                return response.text();
            })
            .then(function (markdown) {
                var publication = parseFrontMatter(markdown);
                if (!publication) throw new Error('Invalid front matter in ' + path);
                publication.__order = index;
                return publication;
            });
    })).then(function (publications) {
        publications.sort(function (a, b) {
            return a.__order - b.__order;
        });
        renderPublications(publications);
    }).catch(function (error) {
        console.error(error);
        if (!renderFallbackPublications()) {
            container.innerHTML = '<div class="pub-empty">Unable to load publications from markdown files.</div>';
        }
    });
}

document.addEventListener('DOMContentLoaded', loadPublications);
