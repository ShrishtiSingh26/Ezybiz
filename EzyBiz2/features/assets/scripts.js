// DOM Elements
document.addEventListener('DOMContentLoaded', function() {
    // Toggle switches
    const toggleSwitches = document.querySelectorAll('.toggle-switch');
    const masterToggle = document.getElementById('masterToggle');
    
    // Filter elements
    const filterBtn = document.getElementById('filterBtn');
    const filterDropdown = document.getElementById('filterDropdown');
    const filterCheckboxes = document.querySelectorAll('.filter-checkbox');
    
    // Action buttons
    const markAllReadBtn = document.getElementById('markAllReadBtn');
    const clearAllBtn = document.getElementById('clearAllBtn');
    const testNotificationBtn = document.getElementById('testNotificationBtn');
    const saveDndScheduleBtn = document.getElementById('saveDndSchedule');
    
    // Tabs
    const tabButtons = document.querySelectorAll('.tab-btn');
    
    // Notification containers
    const notificationsList = document.getElementById('notificationsList');
    const emptyNotifications = document.getElementById('emptyNotifications');
    const toastContainer = document.getElementById('toastContainer');
    const notificationCount = document.getElementById('notificationCount');
    
    // Preview elements
    const previewType = document.getElementById('previewType');
    const previewNotification = document.getElementById('previewNotification');
    const previewIcon = previewNotification.querySelector('.preview-icon i');
    
    // DND schedule
    const dayCheckboxes = document.querySelectorAll('.day-checkbox');
    
    // Notification state
    let notifications = JSON.parse(localStorage.getItem('notifications')) || [];
    let preferences = JSON.parse(localStorage.getItem('preferences')) || {
        system: true,
        message: true,
        task: true,
        comment: true,
        deadline: true,
        security: true,
        login: true
    };
    let dndSchedule = JSON.parse(localStorage.getItem('dndSchedule')) || {
        active: false,
        start: '22:00',
        end: '07:00',
        days: ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun']
    };
    
    // Initialize the UI
    function initializeUI() {
        // Set toggle switches based on preferences
        toggleSwitches.forEach(toggle => {
            const type = toggle.dataset.type;
            if (type && preferences[type]) {
                toggle.classList.add('active');
            }
        });
        
        // Set master toggle state
        updateMasterToggleState();
        
        // Initialize DND schedule UI
        document.getElementById('dndStart').value = dndSchedule.start;
        document.getElementById('dndEnd').value = dndSchedule.end;
        
        dayCheckboxes.forEach(checkbox => {
            const day = checkbox.dataset.day;
            if (dndSchedule.days.includes(day)) {
                checkbox.classList.add('active');
            }
        });
        
        // Render notifications
        renderNotifications();
        updateNotificationCount();
        
        // Set preview notification type
        updatePreviewNotification();
    }
    
    // Toggle switch functionality
    toggleSwitches.forEach(toggle => {
        toggle.addEventListener('click', function() {
            this.classList.toggle('active');
            
            const type = this.dataset.type;
            if (type) {
                preferences[type] = this.classList.contains('active');
                savePreferences();
                updateMasterToggleState();
            }
        });
    });
    
    // Master toggle functionality
    masterToggle.addEventListener('click', function() {
        const isActive = this.classList.contains('active');
        
        // Toggle to opposite state
        if (isActive) {
            this.classList.remove('active');
            document.getElementById('toggleAllBtn').querySelector('span').textContent = 'Enable All';
            // Turn off all toggles
            toggleSwitches.forEach(toggle => {
                const type = toggle.dataset.type;
                if (type) {
                    toggle.classList.remove('active');
                    preferences[type] = false;
                }
            });
        } else {
            this.classList.add('active');
            document.getElementById('toggleAllBtn').querySelector('span').textContent = 'Disable All';
            // Turn on all toggles
            toggleSwitches.forEach(toggle => {
                const type = toggle.dataset.type;
                if (type) {
                    toggle.classList.add('active');
                    preferences[type] = true;
                }
            });
        }
        
        savePreferences();
    });
    
    // Update master toggle state based on individual toggles
    function updateMasterToggleState() {
        const allActive = Object.values(preferences).every(value => value === true);
        const allInactive = Object.values(preferences).every(value => value === false);
        
        if (allActive) {
            masterToggle.classList.add('active');
            document.getElementById('toggleAllBtn').querySelector('span').textContent = 'Disable All';
        } else if (allInactive) {
            masterToggle.classList.remove('active');
            document.getElementById('toggleAllBtn').querySelector('span').textContent = 'Enable All';
        } else {
            // If mixed state, set to active but could customize further
            masterToggle.classList.remove('active');
            document.getElementById('toggleAllBtn').querySelector('span').textContent = 'Enable All';
        }
    }
    
    // Filter dropdown toggle
    filterBtn.addEventListener('click', function() {
        filterDropdown.classList.toggle('active');
    });
    
    // Close filter dropdown when clicking elsewhere
    document.addEventListener('click', function(event) {
        if (!event.target.closest('.filter-dropdown') && filterDropdown.classList.contains('active')) {
            filterDropdown.classList.remove('active');
        }
    });
    
    // Filter checkbox functionality
    filterCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            renderNotifications();
        });
    });
    
    // Mark all as read functionality
    markAllReadBtn.addEventListener('click', function() {
        if (notifications.length > 0) {
            notifications = notifications.map(notification => {
                return { ...notification, read: true };
            });
            
            saveNotifications();
            renderNotifications();
            updateNotificationCount();
            showToast('All notifications marked as read', 'system');
        }
    });
    
    // Clear all notifications functionality
    clearAllBtn.addEventListener('click', function() {
        if (notifications.length > 0) {
            notifications = [];
            saveNotifications();
            renderNotifications();
            updateNotificationCount();
            showToast('All notifications cleared', 'system');
        }
    });
    
    // Tab functionality
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            tabButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            renderNotifications();
        });
    });
    
    // Preview type change
    previewType.addEventListener('change', function() {
        updatePreviewNotification();
    });
    
    // Test notification functionality
    testNotificationBtn.addEventListener('click', function() {
        const type = previewType.value;
        const title = getNotificationTitle(type);
        const message = getNotificationMessage(type);
        
        // Create and add notification
        addNotification(type, title, message);
        
        // Show toast
        showToast(message, type);
    });
    
    // Day checkbox functionality
    dayCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('click', function() {
            this.classList.toggle('active');
        });
    });
    
    // Save DND schedule
    saveDndScheduleBtn.addEventListener('click', function() {
        const startTime = document.getElementById('dndStart').value;
        const endTime = document.getElementById('dndEnd').value;
        const selectedDays = [];
        
        dayCheckboxes.forEach(checkbox => {
            if (checkbox.classList.contains('active')) {
                selectedDays.push(checkbox.dataset.day);
            }
        });
        
        dndSchedule = {
            active: selectedDays.length > 0,
            start: startTime,
            end: endTime,
            days: selectedDays
        };
        
        localStorage.setItem('dndSchedule', JSON.stringify(dndSchedule));
        showToast('Do Not Disturb schedule saved', 'system');
    });
    
    // Render notifications based on current filters and tab
    function renderNotifications() {
        // Get active tab
        const activeTab = document.querySelector('.tab-btn.active').dataset.tab;
        
        // Get active filters
        const activeFilters = Array.from(filterCheckboxes)
            .filter(checkbox => checkbox.checked)
            .map(checkbox => checkbox.dataset.type);
        
        // Filter notifications
        let filteredNotifications = notifications.filter(notification => {
            // Filter by type
            const typeMatch = activeFilters.includes(notification.type);
            
            // Filter by read status based on active tab
            let statusMatch = true;
            if (activeTab === 'unread') {
                statusMatch = !notification.read;
            } else if (activeTab === 'read') {
                statusMatch = notification.read;
            }
            
            return typeMatch && statusMatch;
        });
        
        // Sort by date (newest first)
        filteredNotifications.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        
        // Clear current list
        while (notificationsList.firstChild && notificationsList.firstChild !== emptyNotifications) {
            notificationsList.removeChild(notificationsList.firstChild);
        }
        
        // Show empty state if no notifications
        if (filteredNotifications.length === 0) {
            emptyNotifications.style.display = 'flex';
        } else {
            emptyNotifications.style.display = 'none';
            
            // Render notifications
            filteredNotifications.forEach(notification => {
                const notificationElement = createNotificationElement(notification);
                notificationsList.insertBefore(notificationElement, emptyNotifications);
            });
        }
    }
    
    // Create a notification element
    function createNotificationElement(notification) {
        const { id, type, title, message, read, timestamp } = notification;
        
        // Create element
        const element = document.createElement('div');
        element.className = `notification-item ${read ? 'read' : 'unread'}`;
        element.dataset.id = id;
        
        // Format time
        const time = formatTime(timestamp);
        
        // Get icon for type
        const icon = getNotificationIcon(type);
        
        // HTML structure
        element.innerHTML = `
            <div class="notification-icon ${type}">
                <i class="${icon}"></i>
            </div>
            <div class="notification-content">
                <div class="notification-header">
                    <span class="notification-title">${title}</span>
                    <span class="notification-time">${time}</span>
                </div>
                <div class="notification-message">${message}</div>
                <div class="notification-actions-btns">
                    ${!read ? `<button class="notification-btn mark-read-btn" data-id="${id}">
                        <i class="fa-solid fa-check"></i> Mark as Read
                    </button>` : ''}
                    <button class="notification-btn delete-btn" data-id="${id}">
                        <i class="fa-solid fa-trash"></i> Delete
                    </button>
                </div>
            </div>
        `;
        
        // Add event listeners
        setTimeout(() => {
            const markReadBtn = element.querySelector('.mark-read-btn');
            if (markReadBtn) {
                markReadBtn.addEventListener('click', function(e) {
                    e.stopPropagation();
                    markAsRead(id);
                });
            }
            
            const deleteBtn = element.querySelector('.delete-btn');
            if (deleteBtn) {
                deleteBtn.addEventListener('click', function(e) {
                    e.stopPropagation();
                    deleteNotification(id);
                });
            }
            
            // Click on notification to mark as read
            element.addEventListener('click', function() {
                if (!read) {
                    markAsRead(id);
                }
            });
        }, 0);
        
        return element;
    }
    
    // Mark notification as read
    function markAsRead(id) {
        notifications = notifications.map(notification => {
            if (notification.id === id) {
                return { ...notification, read: true };
            }
            return notification;
        });
        
        saveNotifications();
        renderNotifications();
        updateNotificationCount();
    }
    
    // Delete notification
    function deleteNotification(id) {
        notifications = notifications.filter(notification => notification.id !== id);
        saveNotifications();
        renderNotifications();
        updateNotificationCount();
        showToast('Notification deleted', 'system');
    }
    
    // Add a new notification
    function addNotification(type, title, message) {
        const newNotification = {
            id: Date.now().toString(),
            type,
            title,
            message,
            read: false,
            timestamp: new Date().toISOString()
        };
        
        notifications.unshift(newNotification);
        saveNotifications();
        renderNotifications();
        updateNotificationCount();
    }
    
    // Show a toast notification
    function showToast(message, type) {
        const title = getNotificationTitle(type);
        const icon = getNotificationIcon(type);
        
        const toast = document.createElement('div');
        toast.className = 'notification-toast';
        toast.innerHTML = `
            <div class="notification-toast-icon toast-icon ${type}">
                <i class="${icon}"></i>
            </div>
            <div class="notification-toast-content">
                <div class="notification-toast-title">${title}</div>
                <div class="notification-toast-message">${message}</div>
            </div>
            <div class="notification-toast-progress"></div>
        `;
        
        toastContainer.appendChild(toast);
        
        // Remove toast after animation completes
        setTimeout(() => {
            toast.remove();
        }, 5000);
    }
    
    // Update the notification preview
    function updatePreviewNotification() {
        const type = previewType.value;
        const title = getNotificationTitle(type);
        const message = getNotificationMessage(type);
        const icon = getNotificationIcon(type);
        
        // Update preview content
        previewNotification.querySelector('.preview-icon').className = `preview-icon ${type}`;
        previewIcon.className = icon;
        previewNotification.querySelector('h4').textContent = title;
        previewNotification.querySelector('p').textContent = message;
    }
    
    // Update notification count badge
    function updateNotificationCount() {
        const unreadCount = notifications.filter(notification => !notification.read).length;
        notificationCount.textContent = unreadCount;
        
        if (unreadCount > 0) {
            notificationCount.style.display = 'flex';
        } else {
            notificationCount.style.display = 'none';
        }
    }
    
    // Save notifications to localStorage
    function saveNotifications() {
        localStorage.setItem('notifications', JSON.stringify(notifications));
    }
    
    // Save preferences to localStorage
    function savePreferences() {
        localStorage.setItem('preferences', JSON.stringify(preferences));
    }
    
    // Helper functions
    function getNotificationIcon(type) {
        const icons = {
            system: 'fa-solid fa-bullhorn',
            message: 'fa-solid fa-envelope',
            task: 'fa-solid fa-tasks',
            comment: 'fa-solid fa-comment-dots',
            deadline: 'fa-solid fa-calendar-check',
            security: 'fa-solid fa-shield-alt',
            login: 'fa-solid fa-user-shield'
        };
        
        return icons[type] || 'fa-solid fa-bell';
    }
    
    function getNotificationTitle(type) {
        const titles = {
            system: 'System Alert',
            message: 'New Message',
            task: 'Task Update',
            comment: 'New Comment',
            deadline: 'Deadline Reminder',
            security: 'Security Alert',
            login: 'Login Activity'
        };
        
        return titles[type] || 'Notification';
    }
    
    function getNotificationMessage(type) {
        const messages = {
            system: 'Important system update is now available.',
            message: 'You have received a new message from the team.',
            task: 'Your task "Project Review" has been updated.',
            comment: 'Someone commented on your recent post.',
            deadline: 'Project deadline is approaching in 48 hours.',
            security: 'Unusual account activity detected.',
            login: 'New login detected from a different location.'
        };
        
        return messages[type] || 'You have a new notification.';
    }
    
    function formatTime(timestamp) {
        const date = new Date(timestamp);
        const now = new Date();
        const diffMs = now - date;
        const diffSec = Math.floor(diffMs / 1000);
        const diffMin = Math.floor(diffSec / 60);
        const diffHour = Math.floor(diffMin / 60);
        const diffDay = Math.floor(diffHour / 24);
        
        if (diffSec < 60) {
            return 'Just now';
        } else if (diffMin < 60) {
            return `${diffMin}m ago`;
        } else if (diffHour < 24) {
            return `${diffHour}h ago`;
        } else if (diffDay < 7) {
            return `${diffDay}d ago`;
        } else {
            return date.toLocaleDateString();
        }
    }
    
    // Generate sample notifications if none exist
    function generateSampleNotifications() {
        if (notifications.length === 0) {
            const types = ['system', 'message', 'task', 'comment', 'deadline', 'security', 'login'];
            const now = new Date();
            
            // Generate a few notifications of different types and times
            for (let i = 0; i < 5; i++) {
                const type = types[Math.floor(Math.random() * types.length)];
                const title = getNotificationTitle(type);
                const message = getNotificationMessage(type);
                
                // Create timestamp between now and 7 days ago
                const timestamp = new Date(now - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000)).toISOString();
                
                notifications.push({
                    id: Date.now().toString() + i,
                    type,
                    title,
                    message,
                    read: Math.random() > 0.5, // Randomly set as read or unread
                    timestamp
                });
            }
            
            saveNotifications();
        }
    }
    
    // Initialize the sample data and UI
    generateSampleNotifications();
    initializeUI();
    
    // Simulate a real-time notification after a delay
    setTimeout(() => {
        const randomTypes = ['message', 'task', 'deadline'];
        const randomIndex = Math.floor(Math.random() * randomTypes.length);
        const type = randomTypes[randomIndex];
        const title = getNotificationTitle(type);
        const message = getNotificationMessage(type);
        
        addNotification(type, title, message);
        showToast(message, type);
    }, 10000); // Show after 10 seconds
});
