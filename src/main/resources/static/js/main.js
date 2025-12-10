const API_URL = '/api/';
let currentUser = null;

document.addEventListener('DOMContentLoaded', () => {
    currentUser = JSON.parse(localStorage.getItem('user'));

    if (!currentUser) {
        window.location.href = 'index.html';
        return;
    }

    document.getElementById('user-display').textContent = `Welcome, ${currentUser.username}`;
    loadDocuments();

    // File Upload Drag & Drop
    const dropZone = document.getElementById('drop-zone');
    const fileInput = document.getElementById('file-input');

    dropZone.addEventListener('click', () => fileInput.click());

    fileInput.addEventListener('change', () => {
        if (fileInput.files.length > 0) {
            document.getElementById('selected-file-name').textContent = fileInput.files[0].name;
        }
    });

    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.style.borderColor = '#4a90e2';
    });

    dropZone.addEventListener('dragleave', () => {
        dropZone.style.borderColor = '#ddd';
    });

    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.style.borderColor = '#ddd';
        if (e.dataTransfer.files.length > 0) {
            fileInput.files = e.dataTransfer.files;
            document.getElementById('selected-file-name').textContent = fileInput.files[0].name;
        }
    });

    // Upload Form Submit
    document.getElementById('upload-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const file = fileInput.files[0];
        const tags = document.getElementById('file-tags').value;
        const alertBox = document.getElementById('upload-alert');

        if (!file) {
            showAlert(alertBox, 'Please select a file', 'error');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);
        formData.append('tags', tags);

        try {
            const response = await fetch(API_URL + 'documents/upload', {
                method: 'POST',
                headers: {
                    'Authorization': 'Bearer ' + currentUser.token
                },
                body: formData
            });

            const data = await response.json();

            if (response.ok) {
                showAlert(alertBox, 'File uploaded successfully!', 'success');
                document.getElementById('upload-form').reset();
                document.getElementById('selected-file-name').textContent = '';
                loadDocuments();
            } else {
                showAlert(alertBox, data.message || 'Upload failed', 'error');
            }
        } catch (error) {
            showAlert(alertBox, 'An error occurred', 'error');
        }
    });

    // Search
    document.getElementById('search-input').addEventListener('input', function (e) {
        const term = e.target.value.toLowerCase();
        const rows = document.querySelectorAll('#documents-table-body tr');

        rows.forEach(row => {
            const text = row.textContent.toLowerCase();
            row.style.display = text.includes(term) ? '' : 'none';
        });
    });
});

function logout() {
    localStorage.removeItem('user');
    window.location.href = 'index.html';
}

function showSection(sectionId) {
    // Hide all sections
    document.getElementById('documents-section').classList.add('hidden');
    document.getElementById('upload-section').classList.add('hidden');
    document.getElementById('activity-section').classList.add('hidden');

    // Show selected
    document.getElementById(`${sectionId}-section`).classList.remove('hidden');

    // Update sidebar active state
    document.querySelectorAll('.sidebar a').forEach(a => a.classList.remove('active'));
    event.target.classList.add('active');

    if (sectionId === 'documents') loadDocuments();
    if (sectionId === 'activity') loadActivity();
}

async function loadDocuments() {
    try {
        const response = await fetch(API_URL + 'documents', {
            headers: { 'Authorization': 'Bearer ' + currentUser.token }
        });
        const files = await response.json();
        const tbody = document.getElementById('documents-table-body');
        tbody.innerHTML = '';

        files.forEach(file => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${file.name}</td>
                <td>${file.type}</td>
                <td>${formatBytes(file.size)}</td>
                <td>${new Date(file.uploadDate).toLocaleDateString()}</td>
                <td>
                    <a href="${file.url}" class="action-btn btn-download">Download</a>
                    <button onclick="deleteFile('${file.url}')" class="action-btn btn-delete">Delete</button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    } catch (error) {
        console.error('Error loading documents:', error);
    }
}

async function deleteFile(url) {
    if (!confirm('Are you sure you want to delete this file?')) return;

    // Extract ID from URL
    const id = url.split('/').pop();

    try {
        const response = await fetch(API_URL + `documents/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': 'Bearer ' + currentUser.token }
        });

        if (response.ok) {
            loadDocuments();
        } else {
            alert('Failed to delete file');
        }
    } catch (error) {
        console.error('Error deleting file:', error);
    }
}

async function loadActivity() {
    try {
        const response = await fetch(API_URL + 'activity', {
            headers: { 'Authorization': 'Bearer ' + currentUser.token }
        });
        const logs = await response.json();
        const container = document.getElementById('activity-list');
        container.innerHTML = '';

        logs.forEach(log => {
            const div = document.createElement('div');
            div.className = 'activity-item';
            div.innerHTML = `
                <div>
                    <strong>${log.action}</strong>: ${log.details}
                </div>
                <div class="activity-time">
                    ${new Date(log.timestamp).toLocaleString()}
                </div>
            `;
            container.appendChild(div);
        });
    } catch (error) {
        console.error('Error loading activity:', error);
    }
}

function formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

function showAlert(element, message, type) {
    element.textContent = message;
    element.className = `alert alert-${type}`;
    element.classList.remove('hidden');
}
