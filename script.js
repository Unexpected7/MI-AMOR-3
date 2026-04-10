const STORAGE_KEY = 'miAmorLetters';

function safeText(value) {
    return value
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function formatTimestamp(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleString([], {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function loadLetters() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    try {
        const parsed = JSON.parse(stored);
        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
}

function saveLetters(letters) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(letters));
}

function deleteLetter(createdAt) {
    const letters = loadLetters().filter(letter => letter.createdAt !== createdAt);
    saveLetters(letters);
    renderLetters();
}

function renderLetters() {
    const letters = loadLetters();
    const list = document.querySelector('.letters-list');
    const empty = document.querySelector('.empty-state');

    if (!list) {
        return;
    }

    list.innerHTML = '';
    if (letters.length === 0) {
        if (empty) {
            empty.style.display = 'block';
        }
        return;
    }

    if (empty) {
        empty.style.display = 'none';
    }

    letters.slice().reverse().forEach(letter => {
        const card = document.createElement('article');
        card.className = 'letter-card';

        card.innerHTML = `
            <h2>${safeText(letter.name)}’s letter</h2>
            <p>${safeText(letter.message).replace(/\n/g, '<br>')}</p>
            <div class="letter-meta">Sent on ${formatTimestamp(letter.createdAt)}</div>
        `;

        const deleteButton = document.createElement('button');
        deleteButton.type = 'button';
        deleteButton.className = 'delete-button';
        deleteButton.textContent = 'Delete letter';
        deleteButton.addEventListener('click', () => {
            if (confirm('Delete this letter?')) {
                deleteLetter(letter.createdAt);
            }
        });

        card.appendChild(deleteButton);
        list.appendChild(card);
    });
}

function clearForm() {
    document.getElementById('authorName').value = '';
    document.getElementById('letterMessage').value = '';
    document.getElementById('authorName').focus();
}

function handleSubmit(event) {
    event.preventDefault();

    const name = document.getElementById('authorName').value.trim();
    const message = document.getElementById('letterMessage').value.trim();
    if (!name || !message) {
        alert('Please enter both your name and your letter.');
        return;
    }

    const letters = loadLetters();
    letters.push({
        name,
        message,
        createdAt: Date.now()
    });
    saveLetters(letters);
    renderLetters();
    clearForm();
}

function init() {
    const form = document.getElementById('letterForm');
    if (form) {
        form.addEventListener('submit', handleSubmit);
    }
    renderLetters();
}

window.addEventListener('DOMContentLoaded', init);
