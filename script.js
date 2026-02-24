// Cloud Platform - Full Functionality

// State Management
const state = {
    files: [
        { id: 1, name: 'index.html', type: 'html', size: '2.4 KB', modified: '2024-01-15' },
        { id: 2, name: 'styles.css', type: 'css', size: '1.8 KB', modified: '2024-01-15' },
        { id: 3, name: 'script.js', type: 'js', size: '3.2 KB', modified: '2024-01-15' },
        { id: 4, name: 'config.json', type: 'json', size: '0.5 KB', modified: '2024-01-14' },
        { id: 5, name: 'README.txt', type: 'txt', size: '1.2 KB', modified: '2024-01-13' },
        { id: 6, name: 'assets', type: 'folder', size: '-', modified: '2024-01-12' },
        { id: 7, name: 'components', type: 'folder', size: '-', modified: '2024-01-11' },
    ],
    deployments: [
        { id: 1, url: 'https://myproject.yourcloud.com', date: '2024-01-15 14:30', status: 'success' },
        { id: 2, url: 'https://yourcloud.com/old-project', date: '2024-01-10 09:15', status: 'success' },
        { id: 3, url: 'https://test.yourcloud.com', date: '2024-01-08 16:45', status: 'pending' },
    ],
    storage: {
        used: 2.4,
        total: 3,
        unit: 'GB'
    },
    currentPath: '/',
    selectedFile: null,
    user: {
        name: 'John Doe',
        email: 'john@example.com',
        verified: true
    }
};

// DOM Elements
const elements = {
    navLinks: document.querySelectorAll('.nav-link'),
    sections: document.querySelectorAll('.section'),
    fileGrid: document.getElementById('fileGrid'),
    historyList: document.getElementById('historyList'),
    userMenuBtn: document.getElementById('userMenuBtn'),
    userDropdown: document.getElementById('userDropdown'),
    modalOverlay: document.getElementById('modalOverlay'),
    contextMenu: document.getElementById('contextMenu'),
    toastContainer: document.getElementById('toastContainer'),
    mainFileSelect: document.getElementById('mainFileSelect'),
    manualFileSelect: document.getElementById('manualFileSelect'),
    urlInputs: document.querySelectorAll('input[name="urlType"]'),
    subdomainInput: document.getElementById('subdomainInput'),
    pathInput: document.getElementById('pathInput')
};

// Utility Functions
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
    });
}

function generateId() {
    return Date.now() + Math.random().toString(36).substr(2, 9);
}

// Toast Notifications
function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    const icons = {
        success: '<svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/></svg>',
        error: '<svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/></svg>',
        warning: '<svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/></svg>'
    };
    
    toast.innerHTML = `
        <div class="toast-icon">${icons[type]}</div>
        <div class="toast-message">${message}</div>
        <button class="toast-close">&times;</button>
    `;
    
    elements.toastContainer.appendChild(toast);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        toast.style.animation = 'slideIn 0.3s ease reverse';
        setTimeout(() => toast.remove(), 300);
    }, 5000);
    
    // Close button functionality
    toast.querySelector('.toast-close').addEventListener('click', () => {
        toast.remove();
    });
}

// Navigation
function initNavigation() {
    elements.navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const section = link.dataset.section;
            
            // Update active nav link
            elements.navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            
            // Show corresponding section
            elements.sections.forEach(s => s.classList.remove('active'));
            document.getElementById(`${section}-section`).classList.add('active');
        });
    });
}

// User Menu
function initUserMenu() {
    elements.userMenuBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        elements.userDropdown.classList.toggle('active');
    });
    
    document.addEventListener('click', () => {
        elements.userDropdown.classList.remove('active');
    });
    
    // Dropdown actions
    elements.userDropdown.querySelectorAll('.dropdown-item').forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const action = item.dataset.action;
            
            switch(action) {
                case 'profile':
                    elements.navLinks[3].click();
                    document.querySelector('[data-tab="profile"]').click();
                    break;
                case 'settings':
                    elements.navLinks[3].click();
                    document.querySelector('[data-tab="security"]').click();
                    break;
                case 'logout':
                    showToast('Logging out...', 'warning');
                    setTimeout(() => {
                        showToast('Logged out successfully', 'success');
                    }, 1000);
                    break;
            }
        });
    });
}

// File Management
function getFileIcon(type) {
    const icons = {
        html: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M1.5 0h21l-1.91 21.563L11.977 24l-8.564-2.438L1.5 0zm7.031 9.75l-.232-2.718 10.059.003.23-2.622L5.412 4.41l.698 8.01h9.126l-.326 3.426-2.91.804-2.955-.81-.188-2.11H6.248l.33 4.171L12 19.351l5.379-1.443.744-8.157H8.531z"/></svg>',
        css: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M1.5 0h21l-1.91 21.563L11.977 24l-8.565-2.438L1.5 0zm17.09 4.413L5.41 4.41l.213 2.622 10.125.002-.255 2.716h-6.64l.24 2.573h6.182l-.366 3.523-2.91.804-2.956-.81-.188-2.11h-2.61l.29 3.855L12 19.288l5.373-1.53L18.59 4.414z"/></svg>',
        js: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M0 0h24v24H0V0zm22.034 18.276c-.175-1.095-.888-2.015-3.003-2.873-.736-.345-1.554-.585-1.797-1.14-.091-.33-.105-.51-.046-.705.15-.646.915-.84 1.515-.66.39.12.75.42.976.9 1.034-.676 1.034-.676 1.755-1.125-.27-.42-.404-.601-.586-.78-.63-.705-1.469-1.065-2.834-1.034l-.705.089c-.676.165-1.32.525-1.71 1.005-1.14 1.291-.811 3.541.569 4.471 1.365 1.02 3.361 1.244 3.616 2.205.24 1.17-.87 1.545-1.966 1.41-.811-.18-1.26-.586-1.755-1.336l-1.83 1.051c.21.48.45.689.81 1.109 1.74 1.756 6.09 1.666 6.871-1.004.029-.09.24-.705.074-1.65l.046.067zm-8.983-7.245h-2.248c0 1.938-.009 3.864-.009 5.805 0 1.232.063 2.363-.138 2.711-.33.689-1.18.601-1.566.48-.396-.196-.597-.466-.83-.855-.063-.105-.11-.196-.127-.196l-1.825 1.125c.305.63.75 1.172 1.324 1.517.855.51 2.004.675 3.207.405.783-.226 1.458-.691 1.811-1.411.51-.93.402-2.07.397-3.346.012-2.054 0-4.109 0-6.179l.004-.056z"/></svg>',
        json: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M5.759 3.975h1.783V5.76H5.759v4.458A1.783 1.783 0 0 1 3.975 12a1.783 1.783 0 0 1 1.784 1.783v4.459h1.783v1.783H5.759c-.954-.24-1.784-.803-1.784-1.783v-3.567a1.783 1.783 0 0 0-1.783-1.783H1.3v-1.783h.892a1.783 1.783 0 0 0 1.783-1.784V5.758c0-.98.83-1.543 1.784-1.783zm12.482 0c.954.24 1.784.803 1.784 1.783v3.567a1.783 1.783 0 0 0 1.783 1.784h.892v1.783h-.892a1.783 1.783 0 0 0-1.783 1.783v3.567c0 .98-.83 1.543-1.784 1.783h-1.783v-1.783h1.783v-4.459A1.783 1.783 0 0 1 20.025 12a1.783 1.783 0 0 1-1.784-1.783V5.759h-1.783V3.975h1.783z"/></svg>',
        txt: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm4 18H6V4h7v5h5v11z"/></svg>',
        folder: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z"/></svg>'
    };
    
    return icons[type] || icons.txt;
}

function renderFiles() {
    elements.fileGrid.innerHTML = '';
    
    state.files.forEach(file => {
        const fileItem = document.createElement('div');
        fileItem.className = 'file-item';
        fileItem.dataset.id = file.id;
        
        fileItem.innerHTML = `
            <div class="file-icon ${file.type}">
                ${getFileIcon(file.type)}
            </div>
            <div class="file-name">${file.name}</div>
            <div class="file-info">${file.size} • ${formatDate(file.modified)}</div>
            <div class="file-actions">
                <button class="file-action-btn" data-action="edit" title="Edit">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
                        <path d="M11.5 2.5L9 0L2 7V9H4L11.5 2.5ZM10.5 1.5L12 3L10.5 4.5L9 3L10.5 1.5ZM1 10V13H4L11 6L8 3L1 10Z"/>
                    </svg>
                </button>
                <button class="file-action-btn" data-action="download" title="Download">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
                        <path d="M7 1V9M7 9L4 6M7 9L10 6M1 12H13" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                    </svg>
                </button>
                <button class="file-action-btn" data-action="delete" title="Delete">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
                        <path d="M3 3H11M4 3V11C4 11.5523 4.44772 12 5 12H9C9.55228 12 10 11.5523 10 11V3M5 3V2C5 1.44772 5.44772 1 6 1H8C8.55228 1 9 1.44772 9 2V3"/>
                    </svg>
                </button>
            </div>
        `;
        
        // Event listeners
        fileItem.addEventListener('click', (e) => {
            if (!e.target.closest('.file-action-btn')) {
                handleFileClick(file);
            }
        });
        
        fileItem.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            showContextMenu(e, file);
        });
        
        fileItem.querySelectorAll('.file-action-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                handleFileAction(file, btn.dataset.action);
            });
        });
        
        elements.fileGrid.appendChild(fileItem);
    });
}

function handleFileClick(file) {
    if (file.type === 'folder') {
        showToast(`Opening folder: ${file.name}`, 'success');
    } else {
        openFileEditor(file);
    }
}

function handleFileAction(file, action) {
    switch(action) {
        case 'edit':
            openFileEditor(file);
            break;
        case 'download':
            showToast(`Downloading ${file.name}...`, 'success');
            break;
        case 'delete':
            deleteFile(file.id);
            break;
    }
}

function showContextMenu(e, file) {
    state.selectedFile = file;
    
    elements.contextMenu.style.left = `${e.pageX}px`;
    elements.contextMenu.style.top = `${e.pageY}px`;
    elements.contextMenu.classList.add('active');
    
    document.addEventListener('click', hideContextMenu);
}

function hideContextMenu() {
    elements.contextMenu.classList.remove('active');
    document.removeEventListener('click', hideContextMenu);
}

// Context Menu Actions
elements.contextMenu.querySelectorAll('.context-menu-item').forEach(item => {
    item.addEventListener('click', () => {
        const action = item.dataset.action;
        if (state.selectedFile) {
            handleFileAction(state.selectedFile, action);
        }
    });
});

// File Operations
function deleteFile(fileId) {
    if (confirm('Are you sure you want to delete this file?')) {
        state.files = state.files.filter(f => f.id !== fileId);
        renderFiles();
        showToast('File deleted successfully', 'success');
        updateStorageDisplay();
    }
}

function createFile(name, type) {
    const newFile = {
        id: generateId(),
        name: `${name}.${type}`,
        type: type,
        size: '0 KB',
        modified: new Date().toISOString().split('T')[0]
    };
    
    state.files.unshift(newFile);
    renderFiles();
    showToast(`File ${newFile.name} created successfully`, 'success');
}

function createFolder(name) {
    const newFolder = {
        id: generateId(),
        name: name,
        type: 'folder',
        size: '-',
        modified: new Date().toISOString().split('T')[0]
    };
    
    state.files.unshift(newFolder);
    renderFiles();
    showToast(`Folder ${name} created successfully`, 'success');
}

// File Editor
function openFileEditor(file) {
    const modal = document.getElementById('fileEditorModal');
    const fileName = document.getElementById('editorFileName');
    const codeEditor = document.getElementById('codeEditor');
    
    fileName.textContent = `Edit: ${file.name}`;
    
    // Simulate file content
    const sampleContent = {
        html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Website</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <h1>Hello World!</h1>
    <script src="script.js"></script>
</body>
</html>`,
        css: `/* Main Styles */
body {
    font-family: Arial, sans-serif;
    margin: 0;
    padding: 20px;
    background-color: #f5f5f5;
}

h1 {
    color: #333;
}`,
        js: `// Main JavaScript
console.log('Hello, World!');

function init() {
    console.log('Application initialized');
}

document.addEventListener('DOMContentLoaded', init);`,
        json: `{
    "name": "My Project",
    "version": "1.0.0",
    "description": "A sample project"
}`,
        txt: `This is a sample text file.
You can edit this content.`
    };
    
    codeEditor.value = sampleContent[file.type] || '';
    state.selectedFile = file;
    
    openModal('fileEditorModal');
}

// Modal Functions
function openModal(modalId) {
    const modal = document.querySelector(`#${modalId}`);
    if (modal) {
        elements.modalOverlay.classList.add('active');
        modal.style.display = 'flex';
    }
}

function closeModal(modalId) {
    const modal = document.querySelector(`#${modalId}`);
    if (modal) {
        modal.style.display = 'none';
        elements.modalOverlay.classList.remove('active');
    }
}

function closeAllModals() {
    elements.modalOverlay.classList.remove('active');
    document.querySelectorAll('.modal').forEach(modal => {
        modal.style.display = 'none';
    });
}

// Modal Event Listeners
document.querySelectorAll('.modal-close').forEach(btn => {
    btn.addEventListener('click', () => {
        const modalId = btn.dataset.close;
        closeModal(modalId);
    });
});

document.querySelectorAll('[data-close]').forEach(btn => {
    btn.addEventListener('click', () => {
        const modalId = btn.dataset.close;
        closeModal(modalId);
    });
});

elements.modalOverlay.addEventListener('click', (e) => {
    if (e.target === elements.modalOverlay) {
        closeAllModals();
    }
});

// Button Event Listeners
document.getElementById('uploadFileBtn').addEventListener('click', () => {
    openModal('uploadFileModal');
});

document.getElementById('uploadFolderBtn').addEventListener('click', () => {
    showToast('Folder upload feature - select a folder', 'success');
});

document.getElementById('uploadZipBtn').addEventListener('click', () => {
    showToast('ZIP upload with auto-extract - coming soon', 'warning');
});

document.getElementById('newFileBtn').addEventListener('click', () => {
    openModal('newFileModal');
});

document.getElementById('newFolderBtn').addEventListener('click', () => {
    openModal('newFolderModal');
});

document.getElementById('previewBtn').addEventListener('click', () => {
    showToast('Opening project preview...', 'success');
    window.open('about:blank', '_blank');
});

// Create File
document.getElementById('createFileBtn').addEventListener('click', () => {
    const name = document.getElementById('newFileName').value.trim();
    const type = document.getElementById('newFileType').value;
    
    if (name) {
        createFile(name, type);
        closeModal('newFileModal');
        document.getElementById('newFileName').value = '';
    } else {
        showToast('Please enter a file name', 'error');
    }
});

// Create Folder
document.getElementById('createFolderBtn').addEventListener('click', () => {
    const name = document.getElementById('newFolderName').value.trim();
    
    if (name) {
        createFolder(name);
        closeModal('newFolderModal');
        document.getElementById('newFolderName').value = '';
    } else {
        showToast('Please enter a folder name', 'error');
    }
});

// Save File
document.getElementById('saveFileBtn').addEventListener('click', () => {
    if (state.selectedFile) {
        showToast(`File ${state.selectedFile.name} saved successfully`, 'success');
        closeModal('fileEditorModal');
    }
});

// Save As
document.getElementById('saveAsBtn').addEventListener('click', () => {
    showToast('Save As feature - enter new filename', 'success');
});

// File Upload Area
const uploadArea = document.getElementById('fileUploadArea');
const fileInput = document.getElementById('fileInput');

uploadArea.addEventListener('click', () => {
    fileInput.click();
});

uploadArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadArea.style.borderColor = '#4F46E5';
    uploadArea.style.background = '#EEF2FF';
});

uploadArea.addEventListener('dragleave', () => {
    uploadArea.style.borderColor = '#E5E7EB';
    uploadArea.style.background = 'transparent';
});

uploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadArea.style.borderColor = '#E5E7EB';
    uploadArea.style.background = 'transparent';
    
    const files = e.dataTransfer.files;
    handleFileUpload(files);
});

fileInput.addEventListener('change', (e) => {
    const files = e.target.files;
    handleFileUpload(files);
});

function handleFileUpload(files) {
    Array.from(files).forEach(file => {
        const fileType = file.name.split('.').pop().toLowerCase();
        const supportedTypes = ['html', 'css', 'js', 'json', 'txt'];
        
        if (supportedTypes.includes(fileType)) {
            const newFile = {
                id: generateId(),
                name: file.name,
                type: fileType,
                size: formatFileSize(file.size),
                modified: new Date().toISOString().split('T')[0]
            };
            
            state.files.unshift(newFile);
            showToast(`File ${file.name} uploaded successfully`, 'success');
        } else {
            showToast(`File type ${fileType} not supported`, 'error');
        }
    });
    
    renderFiles();
    updateStorageDisplay();
    closeModal('uploadFileModal');
}

// Deployment System
function renderDeploymentHistory() {
    elements.historyList.innerHTML = '';
    
    state.deployments.forEach(deployment => {
        const historyItem = document.createElement('div');
        historyItem.className = 'history-item';
        
        const statusClass = deployment.status === 'success' ? 'success' : 'pending';
        const statusText = deployment.status === 'success' ? 'Deployed' : 'Pending';
        
        historyItem.innerHTML = `
            <div class="history-info">
                <div class="history-url">${deployment.url}</div>
                <div class="history-date">${deployment.date}</div>
            </div>
            <div class="history-status">
                <span class="status-badge ${statusClass}">${statusText}</span>
                <button class="btn btn-secondary rollback-btn" data-id="${deployment.id}">Rollback</button>
            </div>
        `;
        
        historyItem.querySelector('.rollback-btn').addEventListener('click', () => {
            showToast(`Rolling back to deployment ${deployment.id}...`, 'warning');
            setTimeout(() => {
                showToast('Rollback completed successfully', 'success');
            }, 2000);
        });
        
        elements.historyList.appendChild(historyItem);
    });
}

// Main File Selection
elements.mainFileSelect.addEventListener('change', () => {
    if (elements.mainFileSelect.value === 'manual') {
        elements.manualFileSelect.style.display = 'block';
    } else {
        elements.manualFileSelect.style.display = 'none';
    }
});

// URL Type Selection
elements.urlInputs.forEach(input => {
    input.addEventListener('change', () => {
        if (input.value === 'subdomain') {
            elements.subdomainInput.disabled = false;
            elements.pathInput.disabled = true;
        } else {
            elements.subdomainInput.disabled = true;
            elements.pathInput.disabled = false;
        }
    });
});

// Deploy Button
document.getElementById('deployBtn').addEventListener('click', () => {
    const subdomain = elements.subdomainInput.value.trim();
    const path = elements.pathInput.value.trim();
    const customDomain = document.getElementById('customDomainInput').value.trim();
    
    let url = '';
    if (elements.urlInputs[0].checked && subdomain) {
        url = `https://${subdomain}.yourcloud.com`;
    } else if (elements.urlInputs[1].checked && path) {
        url = `https://yourcloud.com/${path}`;
    } else if (customDomain) {
        url = `https://${customDomain}`;
    } else {
        showToast('Please enter a project URL', 'error');
        return;
    }
    
    // Simulate deployment
    showToast('Deploying your project...', 'warning');
    
    setTimeout(() => {
        const newDeployment = {
            id: generateId(),
            url: url,
            date: new Date().toLocaleString('en-US', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit'
            }),
            status: 'success'
        };
        
        state.deployments.unshift(newDeployment);
        renderDeploymentHistory();
        showToast('Deployment successful!', 'success');
        
        // Clear inputs
        elements.subdomainInput.value = '';
        elements.pathInput.value = '';
        document.getElementById('customDomainInput').value = '';
    }, 2000);
});

// Storage Management
function updateStorageDisplay() {
    const storageIndicator = document.querySelector('.storage-indicator');
    const used = state.storage.used.toFixed(1);
    const total = state.storage.total;
    
    storageIndicator.innerHTML = `
        <span class="storage-used">${used} GB</span>
        <span class="storage-separator">/</span>
        <span class="storage-total">${total} GB</span>
    `;
    
    // Update storage meter
    const meterFill = document.querySelector('.meter-fill');
    const percentage = (state.storage.used / state.storage.total) * 100;
    meterFill.style.width = `${percentage}%`;
    
    // Update meter info
    const meterInfo = document.querySelector('.meter-info');
    const remaining = (state.storage.total - state.storage.used).toFixed(1);
    meterInfo.innerHTML = `
        <span>${used} GB Used</span>
        <span>${remaining} GB Available</span>
    `;
}

// Account Tabs
document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const tabId = btn.dataset.tab;
        
        // Update active tab button
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        // Show corresponding tab content
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        document.getElementById(`${tabId}-tab`).classList.add('active');
    });
});

// Account Form Actions
document.querySelectorAll('#profile-tab .btn-primary').forEach(btn => {
    btn.addEventListener('click', () => {
        showToast('Profile updated successfully', 'success');
    });
});

document.querySelectorAll('#security-tab .btn-primary').forEach(btn => {
    btn.addEventListener('click', () => {
        showToast('Password updated successfully', 'success');
    });
});

document.querySelector('#security-tab .btn-secondary').addEventListener('click', () => {
    showToast('2FA setup initiated - check your email', 'success');
});

document.querySelector('#danger-tab .btn-danger').addEventListener('click', () => {
    if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
        showToast('Account deletion request submitted', 'warning');
    }
});

// Upgrade Plan Buttons
document.querySelectorAll('.plan-card .btn-primary').forEach(btn => {
    btn.addEventListener('click', () => {
        const planName = btn.closest('.plan-card').querySelector('.plan-name').textContent;
        showToast(`Upgrade to ${planName} plan - coming soon`, 'success');
    });
});

// Initialize Application
function init() {
    initNavigation();
    initUserMenu();
    renderFiles();
    renderDeploymentHistory();
    updateStorageDisplay();
    
    console.log('Cloud Platform initialized successfully');
}

// Start the application
document.addEventListener('DOMContentLoaded', init);