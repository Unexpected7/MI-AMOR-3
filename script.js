const STORAGE_KEY = 'miAmorLetters';
const ARCHIVE_PASSWORD = 'Dodo726';
let archiveUnlocked = false;

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

// Firebase functions
async function loadLetters() {
    try {
        const db = window.firebaseDB;
        const q = query(collection(db, "letters"), orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);
        const letters = [];
        querySnapshot.forEach((doc) => {
            letters.push({ id: doc.id, ...doc.data() });
        });
        return letters;
    } catch (error) {
        console.error("Error loading letters:", error);
        return [];
    }
}

async function saveLetter(letter) {
    try {
        const db = window.firebaseDB;
        const docRef = await addDoc(collection(db, "letters"), letter);
        return docRef.id;
    } catch (error) {
        console.error("Error saving letter:", error);
        throw error;
    }
}

async function deleteLetterFromDB(letterId) {
    try {
        const db = window.firebaseDB;
        await deleteDoc(doc(db, "letters", letterId));
    } catch (error) {
        console.error("Error deleting letter:", error);
        throw error;
    }
}

async function deleteLetter(letterId) {
    try {
        await deleteLetterFromDB(letterId);
        renderLetters();
    } catch (error) {
        alert('Error deleting letter: ' + error.message);
    }
}

function renderLetters(letters = null) {
    const list = document.querySelector('.letters-list');
    const empty = document.querySelector('.empty-state');

    if (!list) {
        return;
    }

    if (letters === null) {
        // If no letters provided, show loading state
        list.innerHTML = '<div style="text-align: center; padding: 3rem; color: #7a416f;"><div style="display: inline-block; width: 20px; height: 20px; border: 2px solid #ff7a9f; border-radius: 50%; border-top-color: transparent; animation: spin 1s ease-in-out infinite; margin-bottom: 1rem;"></div><br>Loading letters...</div>';
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

    letters.forEach(letter => {
        const card = document.createElement('article');
        card.className = 'letter-card';

        card.innerHTML = `
            <h2>${safeText(letter.name)} → ${safeText(letter.recipient)}</h2>
            <p>${safeText(letter.message).replace(/\n/g, '<br>')}</p>
            <div class="letter-meta">Sent on ${formatTimestamp(letter.createdAt)}</div>
        `;

        const deleteButton = document.createElement('button');
        deleteButton.type = 'button';
        deleteButton.className = 'delete-button';
        deleteButton.textContent = 'Delete letter';
        deleteButton.addEventListener('click', () => {
            if (confirm('Delete this letter?')) {
                deleteLetter(letter.id);
            }
        });

        card.appendChild(deleteButton);
        list.appendChild(card);
    });
}

function clearForm() {
    document.getElementById('authorName').value = '';
    document.getElementById('recipientName').value = '';
    document.getElementById('letterMessage').value = '';
    document.getElementById('authorName').focus();
}

async function handleSubmit(event) {
    event.preventDefault();
    
    // Hide mobile keyboard by blurring active element
    if (document.activeElement) {
        document.activeElement.blur();
    }

    const name = document.getElementById('authorName').value.trim();
    const recipient = document.getElementById('recipientName').value.trim();
    const message = document.getElementById('letterMessage').value.trim();
    
    if (!name || !recipient || !message) {
        alert('Please enter your name, recipient, and your letter.');
        return;
    }

    try {
        const letter = {
            name,
            recipient,
            message,
            createdAt: Date.now()
        };
        
        await saveLetter(letter);
        clearForm();
        // Letters will be updated automatically via real-time listener
    } catch (error) {
        alert('Error saving letter: ' + error.message);
    }
}

function startLetterListener() {
    if (!window.firebaseDB) {
        console.error("Firebase not initialized");
        renderLetters([]);
        return;
    }

    const db = window.firebaseDB;
    const q = query(collection(db, "letters"), orderBy("createdAt", "desc"));

    onSnapshot(q, (querySnapshot) => {
        const letters = [];
        querySnapshot.forEach((doc) => {
            letters.push({ id: doc.id, ...doc.data() });
        });
        renderLetters(letters);
    }, (error) => {
        console.error("Error listening to letters:", error);
        renderLetters([]);
    });
}

function showUnlockOverlay() {
    const overlay = document.getElementById('passwordOverlay');
    if (overlay) {
        overlay.style.display = 'grid';
    }
}

function hideUnlockOverlay() {
    const overlay = document.getElementById('passwordOverlay');
    if (overlay) {
        overlay.style.display = 'none';
    }
}

async function unlockArchive(event) {
    event.preventDefault();
    const passwordInput = document.getElementById('archivePassword');
    const value = passwordInput ? passwordInput.value.trim() : '';

    if (value === ARCHIVE_PASSWORD) {
        archiveUnlocked = true;
        hideUnlockOverlay();
        if (passwordInput) {
            passwordInput.value = '';
        }
        startLetterListener();
        return;
    }

    alert('Incorrect password. Please try again.');
    if (passwordInput) {
        passwordInput.value = '';
        passwordInput.focus();
    }
}

function init() {
    const form = document.getElementById('letterForm');
    if (form) {
        form.addEventListener('submit', handleSubmit);
    }

    const passwordForm = document.getElementById('passwordForm');
    if (passwordForm) {
        showUnlockOverlay();
        passwordForm.addEventListener('submit', unlockArchive);
        const cancelButton = document.getElementById('cancelUnlock');
        if (cancelButton) {
            cancelButton.addEventListener('click', () => {
                window.location.href = 'index.html';
            });
        }
        return;
    }

    startLetterListener();
}

window.addEventListener('DOMContentLoaded', init);
