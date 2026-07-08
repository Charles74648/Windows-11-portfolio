/**
 * Windows 11 Developer Portfolio
 * Minimal Vanilla JavaScript for desktop components.
 * Kept clear, structured, and commented for an ICT beginner.
 */

// Helper to get system owner name dynamically
function getSystemOwnerName() {
  return localStorage.getItem('system-owner-name') || 'DEV CHARLES WEB';
}

document.addEventListener('DOMContentLoaded', () => {
  // Initialize the Custom Windows 11 BIOS & OS Boot Sequence
  initBootSequence();

  // Initialize the System Tray Clock and Date
  initClock();
  
  // Initialize the Start Menu toggle and power events
  initStartMenu();
  
  // Initialize App Window status & sync triggers
  initWindowSystem();
  
  // Enable Bootstrap Tooltips if any are present
  initTooltips();

  // Initialize interactive app features (contact form & CV downloader)
  initAppFeatures();

  // Initialize Quick Settings panel toggles and sliders
  initQuickSettings();

  // Initialize window dragging, resizing, and layered focus (bringing to front)
  initDraggableAndLayering();

  // Initialize Search filter logic inside the Start Menu
  initSearchFilter();

  // Initialize Recycle Bin empty & joke restore event handlers
  initRecycleBin();

  // Initialize Lock Screen Landing Page
  initLockScreen();

  // Initialize Calendar & Notification Center Panel
  initNotificationCenter();

  // Initialize Settings Application Tab functionality
  initSettingsApp();
});

/**
 * Updates the taskbar system clock and date to reflect the current local time.
 */
function initClock() {
  const clockTime = document.getElementById('clock-time');
  const clockDate = document.getElementById('clock-date');

  // Verify that the elements exist on the page before trying to update them
  if (!clockTime || !clockDate) return;

  function updateDateTime() {
    const now = new Date();

    // 1. Format the Time (e.g., "11:24 AM")
    let hours = now.getHours();
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // Convert 0 to 12
    const timeString = `${hours}:${minutes} ${ampm}`;

    // 2. Format the Date (e.g., "7/4/2026")
    const month = now.getMonth() + 1; // Months are 0-11 in JS, so we add 1
    const day = now.getDate();
    const year = now.getFullYear();
    const dateString = `${month}/${day}/${year}`;

    // 3. Render to the DOM elements
    clockTime.textContent = timeString;
    clockDate.textContent = dateString;
  }

  // Run once immediately so the clock doesn't show placeholder text on load
  updateDateTime();

  // Run every 1000 milliseconds (1 second) to keep the time precise
  setInterval(updateDateTime, 1000);
}

/**
 * Initializes Bootstrap 5 tooltips across the desktop.
 * Tooltips provide helpful Windows-like app labels on hover.
 */
function initTooltips() {
  // Grab all elements with data-bs-toggle="tooltip"
  const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
  
  // Initialize each tooltip using Bootstrap's construction syntax
  [...tooltipTriggerList].map(tooltipTriggerEl => {
    // Check if bootstrap library is loaded on the window
    if (window.bootstrap) {
      return new window.bootstrap.Tooltip(tooltipTriggerEl, {
        delay: { show: 600, hide: 100 } // Add a slight realistic hover delay
      });
    }
  });
}

/**
 * Handles toggling the Windows 11 Start Menu and its power operations.
 */
function initStartMenu() {
  const startButton = document.getElementById('start-menu-button');
  const startMenu = document.getElementById('start-menu');

  if (!startButton || !startMenu) return;

  // Toggle Start Menu visibility on Start button click
  startButton.addEventListener('click', (event) => {
    // Prevent the click event from bubble-propagating to the document level
    event.stopPropagation();
    
    // Toggle the class that shows/hides our floating Start Menu
    startMenu.classList.toggle('show');
    
    // Toggle active state styling (indicator dot & background) on the taskbar Start button
    startButton.classList.toggle('is-active');
  });

  // Prevent clicks inside the Start Menu from closing it
  startMenu.addEventListener('click', (event) => {
    event.stopPropagation();
  });

  // Close the Start Menu when clicking anywhere else on the screen (e.g., desktop background)
  document.addEventListener('click', () => {
    if (startMenu.classList.contains('show')) {
      startMenu.classList.remove('show');
      startButton.classList.remove('is-active');
    }
  });

  // Bind Power buttons for interactive restart/shutdown experiences
  const powerRestart = document.getElementById('power-restart');
  const powerShutdown = document.getElementById('power-shutdown');
  const systemOverlay = document.getElementById('system-overlay');
  const overlayContent = document.getElementById('overlay-content');

  if (!systemOverlay || !overlayContent) return;

  // Restart click handler
  if (powerRestart) {
    powerRestart.addEventListener('click', (e) => {
      e.preventDefault();
      // Hide the start menu
      startMenu.classList.remove('show');
      startButton.classList.remove('is-active');
      
      // Update overlay text & show it
      overlayContent.innerHTML = `
        <div class="spinner-border text-light mb-3" role="status"></div>
        <h3 class="fw-normal">Restarting</h3>
      `;
      systemOverlay.classList.add('show');

      // Simulate a quick reboot delay of 2.5 seconds, then refresh the page
      setTimeout(() => {
        window.location.reload();
      }, 2500);
    });
  }

  // Shutdown click handler
  if (powerShutdown) {
    powerShutdown.addEventListener('click', (e) => {
      e.preventDefault();
      // Hide the start menu
      startMenu.classList.remove('show');
      startButton.classList.remove('is-active');

      // Show shutting down sequence
      overlayContent.innerHTML = `
        <div class="spinner-border text-light mb-3" role="status"></div>
        <h3 class="fw-normal">Shutting down</h3>
      `;
      systemOverlay.classList.add('show');

      // After 2.5 seconds, show the safe-to-turn-off state with a boot up button
      setTimeout(() => {
        overlayContent.innerHTML = `
          <h1 class="display-6 mb-4">It is now safe to turn off your computer portfolio.</h1>
          <button class="btn btn-primary d-flex align-items-center gap-2 px-4 py-2" id="reboot-btn">
            <i class="bi bi-power"></i> Power On
          </button>
        `;
        
        // Add click listener to the newly rendered Power On button to reboot the system
        const rebootBtn = document.getElementById('reboot-btn');
        if (rebootBtn) {
          rebootBtn.addEventListener('click', () => {
            overlayContent.innerHTML = `
              <div class="spinner-border text-light mb-3" role="status"></div>
              <h3 class="fw-normal">Starting Windows 11 Portfolio</h3>
            `;
            setTimeout(() => {
              window.location.reload();
            }, 1500);
          });
        }
      }, 2500);
    });
  }

  // Lock click handler
  const powerLock = document.getElementById('power-lock');
  if (powerLock) {
    powerLock.addEventListener('click', (e) => {
      e.preventDefault();
      // Hide start menu
      startMenu.classList.remove('show');
      startButton.classList.remove('is-active');
      
      // Call window lock
      if (typeof window.lockSystem === 'function') {
        window.lockSystem();
      }
    });
  }
}

/**
 * Syncs app window states with the taskbar icon indicator dots
 * and automatically closes the Start Menu when an app launches.
 */
function initWindowSystem() {
  const startMenu = document.getElementById('start-menu');
  const startButton = document.getElementById('start-menu-button');

  const apps = [
    { modalId: 'about-modal', btnId: 'taskbar-about-btn' },
    { modalId: 'projects-modal', btnId: 'taskbar-projects-btn' },
    { modalId: 'skills-modal', btnId: 'taskbar-skills-btn' },
    { modalId: 'resume-modal', btnId: 'taskbar-resume-btn' },
    { modalId: 'contact-modal', btnId: 'taskbar-contact-btn' },
    { modalId: 'recycle-modal', btnId: '' }
  ];

  apps.forEach(app => {
    const modalEl = document.getElementById(app.modalId);
    const taskbarBtn = document.getElementById(app.btnId);

    if (modalEl) {
      modalEl.addEventListener('show.bs.modal', () => {
        // Add active dot styling on its taskbar icon
        if (taskbarBtn) {
          taskbarBtn.classList.add('is-active');
        }
        
        // Auto-close the Start Menu if it is open (since user opened an app)
        if (startMenu && startMenu.classList.contains('show')) {
          startMenu.classList.remove('show');
          if (startButton) {
            startButton.classList.remove('is-active');
          }
        }
      });

      modalEl.addEventListener('hide.bs.modal', () => {
        // Remove active dot styling from taskbar icon
        if (taskbarBtn) {
          taskbarBtn.classList.remove('is-active');
        }
      });
    }
  });
}

/**
 * Initializes custom portfolio features:
 * 1. Contact Form: builds and launches a dynamic mailto URI on form submit
 * 2. Resume CV Downloader: generates and prompts download of a clean text CV as a fallback
 */
function initAppFeatures() {
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const name = document.getElementById('contact-name').value;
      const email = document.getElementById('contact-email').value;
      const subject = document.getElementById('contact-subject').value;
      const message = document.getElementById('contact-message').value;
      
      // Build the mailto url safely
      const mailtoSubject = encodeURIComponent(`[Portfolio Contact] ${subject}`);
      const mailtoBody = encodeURIComponent(
        `Hi ${getSystemOwnerName()},\n\n${message}\n\nBest regards,\n${name}\nEmail: ${email}`
      );
      
      const mailtoUrl = `mailto:adeosuncharles15@gmail.com?subject=${mailtoSubject}&body=${mailtoBody}`;
      
      // Open the mail client
      window.location.href = mailtoUrl;
    });
  }

  // Resume Download Button
  const downloadBtn = document.getElementById('download-cv-btn');
  if (downloadBtn) {
    downloadBtn.addEventListener('click', () => {
      const mockPdfContent = `
========================================
             CHARLES' CV / RESUME
========================================
London, UK | +44 20 7946 0958 | adeosuncharles15@gmail.com

SUMMARY:
First-year ICT student focusing on front-end web technologies, fluid grids, and beautiful visual aesthetics with Bootstrap.

TECHNICAL SKILLS:
Languages: HTML5, CSS3, JavaScript (ES6), TypeScript, Python
Frameworks: Bootstrap 5, Tailwind CSS, React, Express
Tools: Git, GitHub, Vite, npm, Bash, VS Code

EXPERIENCE & PROJECTS:
- Windows 11 Desktop Interactive Portfolio (2026)
- Tasty Recipes Catalog Application (2025)

EDUCATION:
BSc in Information and Communications Technology
University College London (UCL) | 2025 - Present
      `.trim();

      const blob = new Blob([mockPdfContent], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Resume_${getSystemOwnerName().replace(/\s+/g, '_')}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    });
  }
}

/**
 * Windows 11 Toast Notification Engine
 */
function showNotificationToast(title, message, iconClass = 'bi-info-circle-fill') {
  let container = document.getElementById('win11-toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'win11-toast-container';
    container.style.cssText = `
      position: fixed;
      bottom: 60px;
      right: 12px;
      z-index: 1000000;
      display: flex;
      flex-direction: column;
      gap: 10px;
      pointer-events: none;
    `;
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.style.cssText = `
    width: 320px;
    background-color: rgba(243, 243, 243, 0.9);
    backdrop-filter: blur(20px);
    border: 1px solid rgba(0,0,0,0.1);
    border-radius: 8px;
    box-shadow: 0 10px 25px rgba(0,0,0,0.15);
    padding: 12px 16px;
    display: flex;
    align-items: flex-start;
    gap: 12px;
    opacity: 0;
    transform: translateX(100px);
    transition: all 0.3s cubic-bezier(0.1, 0.9, 0.2, 1);
    pointer-events: auto;
  `;

  toast.innerHTML = `
    <div style="font-size: 1.2rem; color: var(--win-blue); margin-top: 2px;">
      <i class="bi ${iconClass}"></i>
    </div>
    <div style="flex: 1; line-height: 1.3;">
      <div style="font-size: 12px; font-weight: 600; color: var(--win-text-dark);">${title}</div>
      <div style="font-size: 11px; color: var(--win-text-muted); margin-top: 2px;">${message}</div>
    </div>
    <button style="background: none; border: none; font-size: 11px; color: var(--win-text-muted); padding: 0; margin-left: 6px; cursor: default;" class="win-toast-close">
      <i class="bi bi-x-lg"></i>
    </button>
  `;

  // Bind close button action
  toast.querySelector('.win-toast-close').addEventListener('click', () => {
    toast.remove();
  });

  container.appendChild(toast);

  // Animate in
  setTimeout(() => {
    toast.style.opacity = '1';
    toast.style.transform = 'translateX(0)';
  }, 10);

  // Auto remove after 4 seconds
  setTimeout(() => {
    if (toast.parentNode) {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(100px)';
      setTimeout(() => {
        toast.remove();
      }, 300);
    }
  }, 4000);
}

/**
 * Synthesizes a beautiful double-tone Windows chime using Web Audio API
 */
function playWindowsChime(volumePercentage) {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    
    const ctx = new AudioContext();
    const volume = volumePercentage / 100;
    
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc1.type = 'sine';
    osc2.type = 'sine';
    
    osc1.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
    osc1.frequency.exponentialRampToValueAtTime(659.25, ctx.currentTime + 0.1); // E5
    
    osc2.frequency.setValueAtTime(659.25, ctx.currentTime + 0.08); // E5
    osc2.frequency.exponentialRampToValueAtTime(783.99, ctx.currentTime + 0.2); // G5 (harmonic chime)

    gainNode.gain.setValueAtTime(0, ctx.currentTime);
    gainNode.gain.linearRampToValueAtTime(volume * 0.12, ctx.currentTime + 0.05);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.45);

    osc1.connect(gainNode);
    osc2.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc1.start(ctx.currentTime);
    osc1.stop(ctx.currentTime + 0.3);
    
    osc2.start(ctx.currentTime + 0.08);
    osc2.stop(ctx.currentTime + 0.45);
  } catch (err) {
    console.warn('Audio context chime blocked or failed:', err);
  }
}

/**
 * Initializes the Quick Settings panel (WiFi, BT, Dark theme, Brightness/Volume)
 */
function initQuickSettings() {
  const systray = document.getElementById('systray-capsule');
  const qsPanel = document.getElementById('quick-settings');

  if (!systray || !qsPanel) return;

  // Toggle Quick Settings panel on taskbar tray click
  systray.addEventListener('click', (e) => {
    e.stopPropagation();
    qsPanel.classList.toggle('show');
    systray.classList.toggle('is-active');

    // Close notification center if open
    const ncPanel = document.getElementById('notification-center');
    if (ncPanel && ncPanel.classList.contains('show')) {
      ncPanel.classList.remove('show');
    }

    // Close start menu if open
    const startMenu = document.getElementById('start-menu');
    const startButton = document.getElementById('start-menu-button');
    if (startMenu && startMenu.classList.contains('show')) {
      startMenu.classList.remove('show');
      if (startButton) startButton.classList.remove('is-active');
    }
  });

  // Prevent panel closes when clicking inside
  qsPanel.addEventListener('click', (e) => {
    e.stopPropagation();
  });

  // Close when clicking outside on the desktop
  document.addEventListener('click', () => {
    if (qsPanel.classList.contains('show')) {
      qsPanel.classList.remove('show');
      systray.classList.remove('is-active');
    }
  });

  // Wi-Fi toggle
  const wifiBtn = document.getElementById('qs-wifi-btn');
  const systrayWifi = document.getElementById('systray-wifi');
  const lockWifi = document.getElementById('lock-control-wifi');
  if (wifiBtn) {
    wifiBtn.addEventListener('click', () => {
      wifiBtn.classList.toggle('active');
      const isActive = wifiBtn.classList.contains('active');
      if (systrayWifi) {
        if (isActive) {
          systrayWifi.className = 'bi bi-wifi';
          systrayWifi.style.opacity = '1';
          showNotificationToast('Wi-Fi Connected', 'Connected to secure guest network.', 'bi-wifi');
        } else {
          systrayWifi.className = 'bi bi-wifi-off';
          systrayWifi.style.opacity = '0.5';
          showNotificationToast('Wi-Fi Disconnected', 'Internet connection severed.', 'bi-wifi-off');
        }
      }
      // Sync Lock Screen Wi-Fi icon
      if (lockWifi) {
        if (isActive) {
          lockWifi.innerHTML = '<i class="bi bi-wifi"></i>';
          lockWifi.setAttribute('title', 'Internet: Connected');
        } else {
          lockWifi.innerHTML = '<i class="bi bi-wifi-off" style="opacity: 0.5;"></i>';
          lockWifi.setAttribute('title', 'Internet: Disconnected');
        }
      }
    });
  }

  // Bluetooth toggle
  const btBtn = document.getElementById('qs-bluetooth-btn');
  if (btBtn) {
    btBtn.addEventListener('click', () => {
      btBtn.classList.toggle('active');
      const isActive = btBtn.classList.contains('active');
      if (isActive) {
        showNotificationToast('Bluetooth Enabled', 'Searching for wireless peripherals...', 'bi-bluetooth');
      } else {
        showNotificationToast('Bluetooth Disabled', 'Bluetooth adapter turned off.', 'bi-bluetooth');
      }
    });
  }

  // Dark Theme toggle
  const darkBtn = document.getElementById('qs-dark-btn');
  if (darkBtn) {
    const currentTheme = localStorage.getItem('theme');
    if (currentTheme === 'dark') {
      document.body.classList.add('dark-theme');
      darkBtn.classList.add('active');
    }

    darkBtn.addEventListener('click', () => {
      document.body.classList.toggle('dark-theme');
      const isDark = document.body.classList.contains('dark-theme');
      if (isDark) {
        darkBtn.classList.add('active');
        localStorage.setItem('theme', 'dark');
        showNotificationToast('Dark Theme Applied', 'Welcome to the dark side.', 'bi-moon-stars-fill');
      } else {
        darkBtn.classList.remove('active');
        localStorage.setItem('theme', 'light');
        showNotificationToast('Light Theme Applied', 'Bright screen, energized eyes.', 'bi-brightness-high');
      }
    });
  }

  // Volume Slider
  const volSlider = document.getElementById('qs-volume-slider');
  const volVal = document.getElementById('qs-volume-val');
  const volIcon = document.getElementById('qs-volume-icon');
  const systrayVol = document.getElementById('systray-volume');

  if (volSlider && volVal && volIcon) {
    volSlider.addEventListener('input', (e) => {
      const val = e.target.value;
      volVal.textContent = val + '%';
      
      let iconClass = 'bi-volume-up-fill';
      if (val == 0) {
        iconClass = 'bi-volume-mute-fill';
      } else if (val < 33) {
        iconClass = 'bi-volume-down-fill';
      } else {
        iconClass = 'bi-volume-up-fill';
      }

      volIcon.className = `bi ${iconClass}`;
      if (systrayVol) systrayVol.className = `bi ${iconClass}`;
    });

    volSlider.addEventListener('change', () => {
      playWindowsChime(volSlider.value);
    });
  }

  // Brightness Slider
  const brightSlider = document.getElementById('qs-brightness-slider');
  const brightVal = document.getElementById('qs-brightness-val');
  const overlay = document.getElementById('brightness-overlay');

  if (brightSlider && brightVal) {
    brightSlider.addEventListener('input', (e) => {
      const val = e.target.value;
      brightVal.textContent = val + '%';
      
      const opacity = (100 - val) * 0.006; 
      if (overlay) {
        overlay.style.backgroundColor = `rgba(0, 0, 0, ${opacity})`;
      }
    });
  }
}

/**
 * Makes Windows 11 modals draggable via mouse & touch, and manages layering (z-index)
 */
function initDraggableAndLayering() {
  const titlebars = document.querySelectorAll('.win11-titlebar');
  let topZIndex = 1050;

  function bringToFront(modalEl) {
    topZIndex++;
    modalEl.style.zIndex = topZIndex;
  }

  // Bring clicked window to the front when clicking anywhere inside
  document.querySelectorAll('.win11-modal').forEach(modal => {
    modal.addEventListener('mousedown', () => {
      bringToFront(modal);
    });
    modal.addEventListener('touchstart', () => {
      bringToFront(modal);
    }, { passive: true });
  });

  // Enable dragging on title bars
  titlebars.forEach(titlebar => {
    titlebar.style.cursor = 'move';
    
    titlebar.addEventListener('mousedown', (e) => {
      if (e.target.closest('.win11-control-btn')) return;

      const modal = titlebar.closest('.win11-modal');
      const dialog = modal.querySelector('.modal-dialog');
      
      // If dialog is currently maximized, disable drag behavior
      if (dialog.classList.contains('modal-fullscreen')) return;

      bringToFront(modal);

      let pos1 = 0, pos2 = 0, pos3 = e.clientX, pos4 = e.clientY;

      if (!dialog.style.left) {
        const rect = dialog.getBoundingClientRect();
        dialog.style.position = 'absolute';
        dialog.style.margin = '0';
        dialog.style.left = rect.left + 'px';
        dialog.style.top = rect.top + 'px';
      }

      function elementDrag(e) {
        e.preventDefault();
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;

        const newLeft = dialog.offsetLeft - pos1;
        const newTop = dialog.offsetTop - pos2;

        dialog.style.left = Math.max(0, Math.min(window.innerWidth - 100, newLeft)) + 'px';
        dialog.style.top = Math.max(0, Math.min(window.innerHeight - 100, newTop)) + 'px';
      }

      function closeDragElement() {
        document.removeEventListener('mouseup', closeDragElement);
        document.removeEventListener('mousemove', elementDrag);
      }

      document.addEventListener('mouseup', closeDragElement);
      document.addEventListener('mousemove', elementDrag);
    });

    // Touch Support for mobile dragging
    titlebar.addEventListener('touchstart', (e) => {
      if (e.target.closest('.win11-control-btn')) return;

      const modal = titlebar.closest('.win11-modal');
      const dialog = modal.querySelector('.modal-dialog');
      
      if (dialog.classList.contains('modal-fullscreen')) return;

      bringToFront(modal);

      const touch = e.touches[0];
      let pos1 = 0, pos2 = 0, pos3 = touch.clientX, pos4 = touch.clientY;

      if (!dialog.style.left) {
        const rect = dialog.getBoundingClientRect();
        dialog.style.position = 'absolute';
        dialog.style.margin = '0';
        dialog.style.left = rect.left + 'px';
        dialog.style.top = rect.top + 'px';
      }

      function elementTouchDrag(e) {
        const touch = e.touches[0];
        pos1 = pos3 - touch.clientX;
        pos2 = pos4 - touch.clientY;
        pos3 = touch.clientX;
        pos4 = touch.clientY;

        const newLeft = dialog.offsetLeft - pos1;
        const newTop = dialog.offsetTop - pos2;

        dialog.style.left = Math.max(0, Math.min(window.innerWidth - 100, newLeft)) + 'px';
        dialog.style.top = Math.max(0, Math.min(window.innerHeight - 100, newTop)) + 'px';
      }

      function closeTouchDragElement() {
        document.removeEventListener('touchend', closeTouchDragElement);
        document.removeEventListener('touchmove', elementTouchDrag);
      }

      document.addEventListener('touchend', closeTouchDragElement);
      document.addEventListener('touchmove', elementTouchDrag, { passive: false });
    });
  });

  // Enable maximizing via titlebar maximize button
  const maxBtns = document.querySelectorAll('.win11-control-btn[aria-label="Maximize"]');
  maxBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const modal = btn.closest('.win11-modal');
      const dialog = modal.querySelector('.modal-dialog');
      
      if (dialog.classList.contains('modal-fullscreen')) {
        dialog.classList.remove('modal-fullscreen');
        if (dialog.dataset.prevLeft) {
          dialog.style.position = 'absolute';
          dialog.style.margin = '0';
          dialog.style.left = dialog.dataset.prevLeft;
          dialog.style.top = dialog.dataset.prevTop;
          dialog.style.width = '';
          dialog.style.height = '';
        } else {
          dialog.style.position = '';
          dialog.style.margin = '';
          dialog.style.left = '';
          dialog.style.top = '';
        }
        btn.innerHTML = '<i class="bi bi-square"></i>';
        btn.setAttribute('title', 'Maximize');
      } else {
        dialog.dataset.prevLeft = dialog.style.left || '';
        dialog.dataset.prevTop = dialog.style.top || '';
        
        dialog.classList.add('modal-fullscreen');
        dialog.style.position = 'fixed';
        dialog.style.margin = '0';
        dialog.style.left = '0';
        dialog.style.top = '0';
        dialog.style.width = '100vw';
        dialog.style.height = 'calc(100vh - 48px)';
        
        btn.innerHTML = '<i class="bi bi-files"></i>';
        btn.setAttribute('title', 'Restore Down');
      }
    });
  });
}

/**
 * Implements real-time app filtering (search) inside the Start Menu
 */
function initSearchFilter() {
  const searchInput = document.querySelector('.start-search-input');
  const gridItems = document.querySelectorAll('.start-pinned-grid .start-grid-item');
  const recommendedSection = document.querySelector('.start-recommended-section');
  const pinnedGrid = document.querySelector('.start-pinned-grid');

  if (!searchInput || !pinnedGrid) return;

  const noResults = document.createElement('div');
  noResults.className = 'col-12 text-center py-4 text-muted d-none';
  noResults.id = 'start-search-no-results';
  noResults.innerHTML = `
    <i class="bi bi-search" style="font-size: 1.5rem; color: var(--win-text-muted);"></i>
    <p class="small mt-2 mb-0" style="font-size: 11.5px;">No matches found.</p>
  `;
  pinnedGrid.parentElement.appendChild(noResults);

  searchInput.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase().trim();

    if (query === '') {
      gridItems.forEach(item => item.classList.remove('d-none'));
      if (recommendedSection) recommendedSection.classList.remove('d-none');
      noResults.classList.add('d-none');
      return;
    }

    if (recommendedSection) recommendedSection.classList.add('d-none');

    let visibleCount = 0;
    gridItems.forEach(item => {
      const label = item.querySelector('.start-grid-label').textContent.toLowerCase();
      if (label.includes(query)) {
        item.classList.remove('d-none');
        visibleCount++;
      } else {
        item.classList.add('d-none');
      }
    });

    if (visibleCount === 0) {
      noResults.classList.remove('d-none');
    } else {
      noResults.classList.add('d-none');
    }
  });

  searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const firstVisible = Array.from(gridItems).find(item => !item.classList.contains('d-none'));
      if (firstVisible) {
        firstVisible.click();
        searchInput.value = '';
        searchInput.dispatchEvent(new Event('input'));
      }
    }
  });
}

/**
 * Handles Recycle Bin clearing and funny easter-egg restore button responses
 */
function initRecycleBin() {
  const emptyBtn = document.getElementById('empty-bin-btn');
  const itemsContainer = document.getElementById('recycle-items-container');
  const emptyState = document.getElementById('recycle-empty-state');
  const restoreBtns = document.querySelectorAll('.restore-project-btn');
  const recycleBinIcon = document.getElementById('recycle-bin-icon');
  const startRecycleIcon = document.getElementById('start-recycle-icon');
  const desktopRecycleBtn = document.getElementById('desktop-recycle-btn');

  restoreBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const card = btn.closest('.recycle-project-card');
      const filename = card.querySelector('.fw-semibold').textContent;
      
      showNotificationToast(
        'System Protection', 
        `Access Denied: "${filename}" belongs in the graveyard. Restoring it could corrupt your CSS skills!`, 
        'bi-shield-fill-exclamation'
      );
    });
  });

  if (emptyBtn) {
    emptyBtn.addEventListener('click', () => {
      const cards = document.querySelectorAll('.recycle-project-card');
      if (cards.length === 0) return;

      emptyBtn.disabled = true;

      // Staggered fade animation
      cards.forEach((card, index) => {
        setTimeout(() => {
          card.classList.add('removing');
        }, index * 100);
      });

      setTimeout(() => {
        if (itemsContainer) itemsContainer.classList.add('d-none');
        if (emptyState) {
          emptyState.classList.remove('d-none');
          emptyState.classList.add('d-flex');
        }

        // Toggle trash cans to empty state visually
        if (recycleBinIcon) {
          recycleBinIcon.className = 'bi bi-trash3';
        }
        if (startRecycleIcon) {
          startRecycleIcon.className = 'bi bi-trash3';
        }
        if (desktopRecycleBtn) {
          desktopRecycleBtn.setAttribute('title', 'Recycle Bin (Empty)');
          if (window.bootstrap) {
            const tooltip = window.bootstrap.Tooltip.getInstance(desktopRecycleBtn);
            if (tooltip) tooltip.setContent({ '.tooltip-inner': 'Recycle Bin (Empty)' });
          }
        }

        showNotificationToast(
          'Recycle Bin',
          'Graveyard cleared. 4 old files permanently dissolved.',
          'bi-trash3'
        );
      }, cards.length * 100 + 400);
    });
  }
}

/**
 * Initializes the Windows 11 Lock Screen / Landing Page
 */
function initLockScreen() {
  const lockScreen = document.getElementById('lock-screen');
  const mainView = document.getElementById('lock-screen-main-view');
  const signinView = document.getElementById('lock-screen-signin-view');
  const pinInput = document.getElementById('lock-pin-input');
  const pinRevealBtn = document.getElementById('lock-pin-reveal-btn');
  const pinSubmitBtn = document.getElementById('lock-pin-submit-btn');
  const backBtn = document.getElementById('lock-screen-back-btn');
  const timeEl = document.getElementById('lock-screen-time');
  const dateEl = document.getElementById('lock-screen-date');
  const promptEl = document.getElementById('lock-screen-prompt');
  const keypad = document.getElementById('signin-keypad');

  if (!lockScreen) return;

  window.lockSystem = function() {
    lockScreen.style.display = '';
    lockScreen.classList.remove('fade-out');
    lockScreen.classList.remove('blurred-bg');
    
    if (mainView) mainView.classList.remove('slide-up-hide');
    if (signinView) {
      signinView.classList.add('d-none');
      signinView.classList.remove('fade-in-show');
    }
    if (pinInput) {
      pinInput.value = '';
      pinInput.disabled = false;
    }
    
    const pinSubmitBtn = document.getElementById('lock-pin-submit-btn');
    const hintEl = document.getElementById('signin-hint');
    
    if (pinSubmitBtn) {
      pinSubmitBtn.disabled = false;
      const icon = pinSubmitBtn.querySelector('i');
      if (icon) icon.className = 'bi bi-arrow-right';
    }
    if (hintEl) {
      hintEl.textContent = 'Type any 4-digit PIN or click Sign In to unlock';
      hintEl.style.color = '';
    }
  };

  let openContactAfterUnlock = false;

  // Click handler for notification widget on Lock Screen
  const lockWidgetNotify = document.getElementById('lock-widget-notify');
  if (lockWidgetNotify) {
    lockWidgetNotify.addEventListener('click', (e) => {
      e.stopPropagation();
      openContactAfterUnlock = true;
      revealSignIn();
    });
  }

  // 1. Clock and Date Engine for Lock Screen
  function updateLockDateTime() {
    if (!timeEl || !dateEl) return;
    const now = new Date();

    // Time: e.g. "11:24"
    let hours = now.getHours();
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const hour12 = hours % 12 || 12;
    timeEl.textContent = `${hour12}:${minutes}`;

    // Date: e.g. "Wednesday, July 8"
    const options = { weekday: 'long', month: 'long', day: 'numeric' };
    dateEl.textContent = now.toLocaleDateString('en-US', options);
  }

  updateLockDateTime();
  setInterval(updateLockDateTime, 1000);

  // 2. State transition functions
  function revealSignIn() {
    if (mainView && !mainView.classList.contains('slide-up-hide')) {
      lockScreen.classList.add('blurred-bg');
      mainView.classList.add('slide-up-hide');
      
      setTimeout(() => {
        if (signinView) {
          signinView.classList.remove('d-none');
          signinView.classList.add('fade-in-show');
        }
        setTimeout(() => {
          if (pinInput) pinInput.focus();
        }, 100);
      }, 150);
    }
  }

  function hideSignIn() {
    if (signinView && !signinView.classList.contains('d-none')) {
      signinView.classList.add('d-none');
      signinView.classList.remove('fade-in-show');
      lockScreen.classList.remove('blurred-bg');
      if (mainView) mainView.classList.remove('slide-up-hide');
      if (pinInput) pinInput.value = '';
    }
  }

  // 3. Click / Tap to reveal sign in
  lockScreen.addEventListener('click', (e) => {
    // If signin is hidden and not clicking a power control dropdown/item, click anywhere to slide it up!
    if (signinView && signinView.classList.contains('d-none')) {
      revealSignIn();
    }
  });

  // Prevent event bubbling on interactive controls
  if (signinView) {
    signinView.addEventListener('click', (e) => {
      e.stopPropagation();
    });
  }

  // Back button
  if (backBtn) {
    backBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      hideSignIn();
    });
  }

  // 4. Keyboard Listener
  document.addEventListener('keydown', (e) => {
    // Only intercept keys if the lock screen is active
    if (lockScreen && !lockScreen.classList.contains('fade-out') && lockScreen.style.display !== 'none') {
      if (signinView && signinView.classList.contains('d-none')) {
        revealSignIn();
      } else {
        // Esc key returns to clock screen
        if (e.key === 'Escape') {
          hideSignIn();
        }
        // Enter submits PIN
        else if (e.key === 'Enter') {
          submitPIN();
        }
        // Focus the PIN input if any other character is pressed
        else if (pinInput && document.activeElement !== pinInput) {
          pinInput.focus();
        }
      }
    }
  });

  // 5. PIN input reveal
  if (pinRevealBtn && pinInput) {
    pinRevealBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const icon = pinRevealBtn.querySelector('i');
      if (pinInput.type === 'password') {
        pinInput.type = 'text';
        if (icon) icon.className = 'bi bi-eye-slash';
      } else {
        pinInput.type = 'password';
        if (icon) icon.className = 'bi bi-eye';
      }
      pinInput.focus();
    });
  }

  // 6. Submit PIN
  function submitPIN() {
    if (!pinInput || pinInput.disabled) return;
    
    const enteredPin = pinInput.value;
    const correctPin = localStorage.getItem('lockscreen-pin') || '1234';
    
    // Disable inputs and show loading feedback
    const hintEl = document.getElementById('signin-hint');
    const submitBtnIcon = pinSubmitBtn ? pinSubmitBtn.querySelector('i') : null;
    
    pinInput.disabled = true;
    if (pinSubmitBtn) pinSubmitBtn.disabled = true;
    
    if (hintEl) {
      hintEl.textContent = 'Verifying security credentials...';
      hintEl.style.color = '#38bdf8';
    }
    if (submitBtnIcon) {
      submitBtnIcon.className = 'spinner-border spinner-border-sm text-light';
    }

    // Play chime & fade out after successful simulated auth
    setTimeout(() => {
      if (enteredPin !== correctPin) {
        // Incorrect PIN!
        pinInput.disabled = false;
        if (pinSubmitBtn) pinSubmitBtn.disabled = false;
        if (submitBtnIcon) {
          submitBtnIcon.className = 'bi bi-arrow-right';
        }
        if (hintEl) {
          hintEl.textContent = 'Incorrect PIN. Default is 1234.';
          hintEl.style.color = '#ef4444';
        }
        // Visual feedback
        pinInput.style.transform = 'translateX(10px)';
        setTimeout(() => { pinInput.style.transform = 'translateX(-10px)'; }, 100);
        setTimeout(() => { pinInput.style.transform = 'translateX(5px)'; }, 200);
        setTimeout(() => { pinInput.style.transform = 'translateX(-5px)'; }, 300);
        setTimeout(() => { pinInput.style.transform = ''; }, 400);
        
        pinInput.value = '';
        pinInput.focus();
        return;
      }

      // Play system chime
      playWindowsChime(75);

      // Add fade out class
      lockScreen.classList.add('fade-out');

      // Re-enable inputs for potential future locking
      setTimeout(() => {
        lockScreen.style.display = 'none';
        
        // Show greeting toast
        showNotificationToast(
          'Windows Hello',
          `Logged in successfully! Welcome to ${getSystemOwnerName()}'s Developer Portfolio.`,
          'bi-shield-fill-check'
        );

        // If they unlocked after clicking the lock screen message widget, open the contact modal!
        if (openContactAfterUnlock) {
          setTimeout(() => {
            const contactBtn = document.getElementById('desktop-contact-btn');
            if (contactBtn) {
              contactBtn.click();
              showNotificationToast(
                'New Message',
                `${getSystemOwnerName()}: Thanks for opening my message! Send me an email using this form.`,
                'bi-chat-left-dots-fill'
              );
            }
          }, 800);
          openContactAfterUnlock = false;
        }
      }, 600);
    }, 1200);
  }

  if (pinSubmitBtn) {
    pinSubmitBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      submitPIN();
    });
  }

  // 7. Touch/Click Keypad Support
  if (keypad && pinInput) {
    keypad.querySelectorAll('.keypad-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (pinInput.disabled) return;

        const val = btn.getAttribute('data-val');
        if (val === 'del') {
          pinInput.value = pinInput.value.slice(0, -1);
        } else if (val === 'clear') {
          pinInput.value = '';
        } else {
          if (pinInput.value.length < 4) {
            pinInput.value += val;
          }
        }
        pinInput.focus();
      });
    });
  }

  // 8. Lock Screen Bottom Right Controls
  const lockPowerRestart = document.getElementById('lock-power-restart');
  const lockPowerShutdown = document.getElementById('lock-power-shutdown');
  const lockWifi = document.getElementById('lock-control-wifi');
  const qsWifiBtn = document.getElementById('qs-wifi-btn');

  if (lockPowerRestart) {
    lockPowerRestart.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const sysRestart = document.getElementById('power-restart');
      if (sysRestart) sysRestart.click();
    });
  }

  if (lockPowerShutdown) {
    lockPowerShutdown.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const sysShutdown = document.getElementById('power-shutdown');
      if (sysShutdown) sysShutdown.click();
    });
  }

  if (lockWifi && qsWifiBtn) {
    lockWifi.addEventListener('click', (e) => {
      e.stopPropagation();
      qsWifiBtn.click(); // Syncs state, plays toast notification
      
      // Update lock icon visual state
      const isActive = qsWifiBtn.classList.contains('active');
      if (isActive) {
        lockWifi.innerHTML = '<i class="bi bi-wifi"></i>';
        lockWifi.setAttribute('title', 'Internet: Connected');
      } else {
        lockWifi.innerHTML = '<i class="bi bi-wifi-off" style="opacity: 0.5;"></i>';
        lockWifi.setAttribute('title', 'Internet: Disconnected');
      }
    });
  }

  // 9. Keep Lock Screen controls dropdown open correctly
  const lockPowerToggle = document.getElementById('lock-control-power');
  if (lockPowerToggle) {
    lockPowerToggle.addEventListener('click', (e) => {
      e.stopPropagation();
    });
  }
}

/**
 * Initializes the Windows 11 Calendar & Notification Center
 */
function initNotificationCenter() {
  const clockCapsule = document.getElementById('clock-capsule');
  const notifyCapsule = document.querySelector('.notification-capsule');
  const ncPanel = document.getElementById('notification-center');
  const qsPanel = document.getElementById('quick-settings');
  const systray = document.getElementById('systray-capsule');
  const startMenu = document.getElementById('start-menu');
  const startButton = document.getElementById('start-menu-button');

  if (!ncPanel) return;

  // 1. Toggle Notification Center panel
  function toggleNC(e) {
    if (e) e.stopPropagation();
    ncPanel.classList.toggle('show');

    // Close other panels if open
    if (ncPanel.classList.contains('show')) {
      if (qsPanel && qsPanel.classList.contains('show')) {
        qsPanel.classList.remove('show');
        if (systray) systray.classList.remove('is-active');
      }
      if (startMenu && startMenu.classList.contains('show')) {
        startMenu.classList.remove('show');
        if (startButton) startButton.classList.remove('is-active');
      }
    }
  }

  if (clockCapsule) clockCapsule.addEventListener('click', toggleNC);
  if (notifyCapsule) notifyCapsule.addEventListener('click', toggleNC);

  // Prevent event bubbling when clicking inside
  ncPanel.addEventListener('click', (e) => {
    e.stopPropagation();
  });

  // Close when clicking on the desktop
  document.addEventListener('click', () => {
    if (ncPanel.classList.contains('show')) {
      ncPanel.classList.remove('show');
    }
  });

  // 2. Notification Management
  const clearAllBtn = document.getElementById('nc-clear-all-btn');
  const ncList = document.getElementById('nc-list');
  const ncEmptyState = document.getElementById('nc-empty-state');
  const notifyBadge = document.querySelector('.notification-badge');

  function updateNotificationBadge() {
    if (!ncList || !notifyBadge || !notifyCapsule) return;
    const remainingCount = ncList.querySelectorAll('.nc-item').length;
    
    if (remainingCount > 0) {
      notifyBadge.style.display = 'flex';
      notifyBadge.style.alignItems = 'center';
      notifyBadge.style.justifyContent = 'center';
      notifyBadge.style.fontSize = '9px';
      notifyBadge.style.color = '#ffffff';
      notifyBadge.style.background = 'var(--win-blue)';
      notifyBadge.style.borderRadius = '50%';
      notifyBadge.style.width = '14px';
      notifyBadge.style.height = '14px';
      notifyBadge.style.top = '2px';
      notifyBadge.style.right = '2px';
      notifyBadge.textContent = remainingCount;
      notifyCapsule.setAttribute('title', `${remainingCount} unread notifications`);
    } else {
      notifyBadge.style.display = 'none';
      notifyCapsule.setAttribute('title', 'No new notifications');
      if (ncEmptyState) ncEmptyState.classList.remove('d-none');
      if (clearAllBtn) clearAllBtn.style.display = 'none';
    }
  }

  // Initialize count badge on load
  updateNotificationBadge();

  // Clear All Notifications
  if (clearAllBtn) {
    clearAllBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const items = ncList.querySelectorAll('.nc-item');
      items.forEach(item => {
        item.style.opacity = '0';
        item.style.transform = 'scale(0.9)';
      });
      setTimeout(() => {
        if (ncList) ncList.innerHTML = '';
        updateNotificationBadge();
        showNotificationToast('Notifications Cleared', 'All system alerts have been dismissed.', 'bi-bell-slash');
      }, 200);
    });
  }

  // Individual notification close buttons
  if (ncList) {
    ncList.addEventListener('click', (e) => {
      const closeBtn = e.target.closest('.nc-close-btn');
      if (closeBtn) {
        e.stopPropagation();
        const targetId = closeBtn.getAttribute('data-target');
        const item = document.getElementById(targetId);
        if (item) {
          item.style.opacity = '0';
          item.style.transform = 'scale(0.9)';
          setTimeout(() => {
            item.remove();
            updateNotificationBadge();
          }, 200);
        }
      }
    });
  }

  // Reply Button Event
  const replyBtn = document.getElementById('nc-reply-btn');
  if (replyBtn) {
    replyBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      ncPanel.classList.remove('show');
      
      const contactBtn = document.getElementById('desktop-contact-btn');
      if (contactBtn) {
        contactBtn.click();
      }
    });
  }

  // 3. Dynamic Calendar Engine
  let currentCalDate = new Date();

  function renderCalendar(date) {
    const calendarDays = document.getElementById('nc-cal-days');
    const calendarMonthYear = document.getElementById('nc-calendar-month-year');
    if (!calendarDays || !calendarMonthYear) return;

    calendarDays.innerHTML = '';

    const year = date.getFullYear();
    const month = date.getMonth();

    const monthNames = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    calendarMonthYear.textContent = `${monthNames[month]} ${year}`;

    const firstDayIndex = new Date(year, month, 1).getDay();
    const lastDay = new Date(year, month + 1, 0).getDate();
    const prevLastDay = new Date(year, month, 0).getDate();

    // Previous month filler days
    for (let x = firstDayIndex; x > 0; x--) {
      const dayEl = document.createElement('div');
      dayEl.className = 'nc-cal-day other-month text-muted opacity-50';
      dayEl.textContent = prevLastDay - x + 1;
      calendarDays.appendChild(dayEl);
    }

    // Current month days
    const today = new Date();
    for (let i = 1; i <= lastDay; i++) {
      const dayEl = document.createElement('div');
      dayEl.className = 'nc-cal-day';
      dayEl.textContent = i;

      if (i === today.getDate() && month === today.getMonth() && year === today.getFullYear()) {
        dayEl.classList.add('today');
      }

      dayEl.addEventListener('click', (e) => {
        e.stopPropagation();
        calendarDays.querySelectorAll('.nc-cal-day').forEach(d => d.classList.remove('active'));
        dayEl.classList.add('active');
      });

      calendarDays.appendChild(dayEl);
    }

    // Next month filler days (grid size 42)
    const totalCells = calendarDays.children.length;
    const remainingCells = 42 - totalCells;
    for (let j = 1; j <= remainingCells; j++) {
      const dayEl = document.createElement('div');
      dayEl.className = 'nc-cal-day other-month text-muted opacity-50';
      dayEl.textContent = j;
      calendarDays.appendChild(dayEl);
    }
  }

  // Draw initial calendar
  renderCalendar(currentCalDate);

  // Bind navigation triggers
  const prevBtn = document.getElementById('nc-cal-prev');
  const nextBtn = document.getElementById('nc-cal-next');

  if (prevBtn) {
    prevBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      currentCalDate.setMonth(currentCalDate.getMonth() - 1);
      renderCalendar(currentCalDate);
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      currentCalDate.setMonth(currentCalDate.getMonth() + 1);
      renderCalendar(currentCalDate);
    });
  }
}

/**
 * Initializes and manages all interactive tabs & controls inside the Windows 11 Settings App
 */
function initSettingsApp() {
  const settingsModal = document.getElementById('skills-modal');
  if (!settingsModal) return;

  // --- 1. DYNAMIC SYSTEM OWNER DISPLAY NAME ---
  const nameInput = document.getElementById('settings-name-input');
  const nameSaveBtn = document.getElementById('settings-name-save');
  const pcNameDisplay = document.getElementById('settings-pc-name');

  // Load and apply system owner name globally on load
  const initialName = getSystemOwnerName();
  updateOwnerNameDOM(initialName);

  if (nameInput) {
    nameInput.value = initialName;
  }

  if (nameSaveBtn && nameInput) {
    nameSaveBtn.addEventListener('click', () => {
      const newName = nameInput.value.trim();
      if (!newName) {
        showNotificationToast('Settings Error', 'Owner identity cannot be empty.', 'bi-exclamation-triangle-fill');
        return;
      }
      if (newName.length > 25) {
        showNotificationToast('Settings Error', 'Name is too long (max 25 chars).', 'bi-exclamation-triangle-fill');
        return;
      }
      
      localStorage.setItem('system-owner-name', newName);
      updateOwnerNameDOM(newName);
      
      showNotificationToast(
        'Settings Saved',
        `Identity globally renamed to: ${newName}.`,
        'bi-person-check-fill'
      );
    });
  }

  function updateOwnerNameDOM(name) {
    // Update all elements with .settings-user-display class
    document.querySelectorAll('.settings-user-display').forEach(el => {
      el.textContent = name;
    });

    // Sync computer/device name
    if (pcNameDisplay) {
      const sanitized = name.toUpperCase().replace(/[^A-Z0-9]/g, '-').replace(/-+/g, '-');
      pcNameDisplay.textContent = `DEV-${sanitized || 'USER'}-PC`;
    }
  }


  // --- 2. PERSONALIZATION: LIGHT/DARK THEME & DESKTOP WALLPAPERS ---
  const btnThemeLight = document.getElementById('settings-theme-light');
  const btnThemeDark = document.getElementById('settings-theme-dark');
  const qsDarkBtn = document.getElementById('qs-dark-btn');

  // Sync theme selection buttons with initial state
  updateThemeSettingsUI();

  if (btnThemeLight) {
    btnThemeLight.addEventListener('click', () => {
      if (document.body.classList.contains('dark-theme')) {
        if (qsDarkBtn) {
          qsDarkBtn.click(); // Uses standard toggle mechanism with alert
        } else {
          document.body.classList.remove('dark-theme');
          localStorage.setItem('theme', 'light');
        }
      }
      updateThemeSettingsUI();
    });
  }

  if (btnThemeDark) {
    btnThemeDark.addEventListener('click', () => {
      if (!document.body.classList.contains('dark-theme')) {
        if (qsDarkBtn) {
          qsDarkBtn.click(); // Uses standard toggle mechanism with alert
        } else {
          document.body.classList.add('dark-theme');
          localStorage.setItem('theme', 'dark');
        }
      }
      updateThemeSettingsUI();
    });
  }

  // Also sync when the quick settings toggle is clicked
  if (qsDarkBtn) {
    qsDarkBtn.addEventListener('click', () => {
      setTimeout(updateThemeSettingsUI, 50);
    });
  }

  function updateThemeSettingsUI() {
    const isDark = document.body.classList.contains('dark-theme');
    if (btnThemeLight && btnThemeDark) {
      if (isDark) {
        btnThemeDark.className = 'btn btn-sm btn-primary flex-grow-1';
        btnThemeLight.className = 'btn btn-sm btn-outline-secondary flex-grow-1';
      } else {
        btnThemeDark.className = 'btn btn-sm btn-outline-secondary flex-grow-1';
        btnThemeLight.className = 'btn btn-sm btn-primary flex-grow-1';
      }
    }
  }

  // WALLPAPER GRADIENTS DEFINITIONS
  const wallpapers = {
    'wp-bloom-light': 'radial-gradient(circle at 80% 20%, rgba(212, 233, 255, 0.8) 0%, transparent 45%), radial-gradient(circle at 20% 80%, rgba(245, 220, 245, 0.8) 0%, transparent 55%), radial-gradient(circle at 50% 50%, rgba(220, 240, 255, 0.7) 0%, transparent 70%), linear-gradient(135deg, #f3f4f6 0%, #e0e7ff 100%)',
    'wp-bloom-dark': 'radial-gradient(circle at 80% 20%, rgba(20, 40, 80, 0.9) 0%, transparent 45%), radial-gradient(circle at 20% 80%, rgba(50, 20, 50, 0.9) 0%, transparent 55%), radial-gradient(circle at 50% 50%, rgba(10, 20, 40, 0.8) 0%, transparent 70%), linear-gradient(135deg, #0b0f19 0%, #1e1b4b 100%)',
    'wp-sunset': 'radial-gradient(circle at 80% 20%, rgba(255, 100, 100, 0.8) 0%, transparent 45%), radial-gradient(circle at 20% 80%, rgba(150, 50, 150, 0.7) 0%, transparent 55%), linear-gradient(135deg, #2e1065 0%, #0c041e 100%)',
    'wp-emerald': 'radial-gradient(circle at 80% 20%, rgba(52, 211, 153, 0.7) 0%, transparent 50%), radial-gradient(circle at 20% 80%, rgba(16, 185, 129, 0.5) 0%, transparent 50%), linear-gradient(135deg, #05190b 0%, #064e3b 100%)'
  };

  // Load wallpaper from storage on load
  const savedWallpaper = localStorage.getItem('desktop-wallpaper');
  if (savedWallpaper && wallpapers[savedWallpaper]) {
    document.body.style.background = wallpapers[savedWallpaper];
    highlightActiveWallpaper(savedWallpaper);
  }

  // Add click listeners to wallpaper thumbs
  Object.keys(wallpapers).forEach(wpId => {
    const thumb = document.getElementById(wpId);
    if (thumb) {
      thumb.addEventListener('click', () => {
        document.body.style.background = wallpapers[wpId];
        localStorage.setItem('desktop-wallpaper', wpId);
        highlightActiveWallpaper(wpId);
        showNotificationToast('Wallpaper Updated', `Desktop theme style switched.`, 'bi-image-fill');
      });
    }
  });

  function highlightActiveWallpaper(activeId) {
    Object.keys(wallpapers).forEach(wpId => {
      const thumb = document.getElementById(wpId);
      if (thumb) {
        if (wpId === activeId) {
          thumb.style.borderColor = 'var(--win-blue)';
          thumb.style.borderWidth = '2px';
          thumb.style.boxShadow = '0 0 8px rgba(0, 120, 215, 0.4)';
        } else {
          thumb.style.borderColor = '';
          thumb.style.borderWidth = '';
          thumb.style.boxShadow = '';
        }
      }
    });
  }


  // --- 3. TASKBAR ALIGNMENT BEHAVIOR ---
  const taskbarAlignSelect = document.getElementById('settings-taskbar-align');
  const taskbarContainer = document.querySelector('.win11-taskbar');

  // Load alignment on load
  const savedAlign = localStorage.getItem('taskbar-alignment') || 'center';
  if (taskbarAlignSelect) {
    taskbarAlignSelect.value = savedAlign;
  }
  applyTaskbarAlignment(savedAlign);

  if (taskbarAlignSelect) {
    taskbarAlignSelect.addEventListener('change', (e) => {
      const align = e.target.value;
      localStorage.setItem('taskbar-alignment', align);
      applyTaskbarAlignment(align);
      showNotificationToast('Taskbar Alignment', `Taskbar icons aligned to the ${align}.`, 'bi-layout-sidebar');
    });
  }

  function applyTaskbarAlignment(align) {
    if (!taskbarContainer) return;
    if (align === 'left') {
      taskbarContainer.classList.add('taskbar-aligned-left');
    } else {
      taskbarContainer.classList.remove('taskbar-aligned-left');
    }
  }


  // --- 4. NETWORK & WI-FI & AIRPLANE MODE SYNCHRONIZATION ---
  const settingsWifiToggle = document.getElementById('settings-wifi-toggle');
  const settingsWifiStatus = document.getElementById('settings-wifi-status');
  const settingsAirplaneToggle = document.getElementById('settings-airplane-toggle');
  const qsWifiBtn = document.getElementById('qs-wifi-btn');
  const lockWifi = document.getElementById('lock-control-wifi');

  // Sync state initially
  syncNetworkUIState();

  if (settingsWifiToggle) {
    settingsWifiToggle.addEventListener('change', () => {
      const isChecked = settingsWifiToggle.checked;
      
      if (isChecked && settingsAirplaneToggle && settingsAirplaneToggle.checked) {
        // Turning Wi-Fi back on disables Airplane Mode
        settingsAirplaneToggle.checked = false;
        showNotificationToast('Airplane Mode', 'Airplane mode deactivated.', 'bi-airplane');
      }

      // Toggle quick settings Wi-Fi state
      if (qsWifiBtn) {
        const isQsActive = qsWifiBtn.classList.contains('active');
        if (isChecked !== isQsActive) {
          qsWifiBtn.click(); // Simulates clicking to trigger the original tray notifications
        }
      }
      syncNetworkUIState();
    });
  }

  if (settingsAirplaneToggle) {
    settingsAirplaneToggle.addEventListener('change', () => {
      const isChecked = settingsAirplaneToggle.checked;
      if (isChecked) {
        // Enable airplane mode: disable Wi-Fi toggle and disconnect
        if (settingsWifiToggle && settingsWifiToggle.checked) {
          settingsWifiToggle.checked = false;
          // Trigger click if quick settings WiFi is currently active
          if (qsWifiBtn && qsWifiBtn.classList.contains('active')) {
            qsWifiBtn.click();
          }
        }
        showNotificationToast('Airplane Mode Enabled', 'Wireless adapters turned off.', 'bi-airplane-fill');
      } else {
        // Disable airplane mode: turn Wi-Fi back on
        if (settingsWifiToggle && !settingsWifiToggle.checked) {
          settingsWifiToggle.checked = true;
          if (qsWifiBtn && !qsWifiBtn.classList.contains('active')) {
            qsWifiBtn.click();
          }
        }
        showNotificationToast('Airplane Mode Disabled', 'Wireless networks restored.', 'bi-airplane');
      }
      syncNetworkUIState();
    });
  }

  // Also sync when the tray Wi-Fi is toggled directly
  if (qsWifiBtn) {
    qsWifiBtn.addEventListener('click', () => {
      setTimeout(syncNetworkUIState, 50);
    });
  }

  if (lockWifi) {
    lockWifi.addEventListener('click', () => {
      setTimeout(syncNetworkUIState, 50);
    });
  }

  function syncNetworkUIState() {
    const isWifiActive = qsWifiBtn ? qsWifiBtn.classList.contains('active') : true;

    if (settingsWifiToggle) {
      settingsWifiToggle.checked = isWifiActive;
    }

    if (settingsWifiStatus) {
      if (isWifiActive) {
        settingsWifiStatus.textContent = 'Connected to DEV-WIFI-6E (Secure, Internet Access)';
        settingsWifiStatus.className = 'x-small text-success mt-1';
      } else {
        settingsWifiStatus.textContent = 'Disconnected. No networks available.';
        settingsWifiStatus.className = 'x-small text-danger mt-1';
      }
    }
  }


  // --- 5. ACCOUNTS & SECURITY: CHANGE LOCK PIN ---
  const pinInputNew = document.getElementById('settings-pin-new');
  const pinSaveBtn = document.getElementById('settings-pin-save');
  const pinStatusEl = document.getElementById('settings-pin-status');

  if (pinSaveBtn && pinInputNew) {
    pinSaveBtn.addEventListener('click', () => {
      const val = pinInputNew.value.trim();
      if (val.length !== 4 || isNaN(val)) {
        if (pinStatusEl) {
          pinStatusEl.textContent = '❌ PIN must be exactly 4 numeric digits!';
          pinStatusEl.className = 'x-small mt-2 text-danger fw-medium';
        }
        showNotificationToast('PIN Error', 'PIN must be exactly 4 digits.', 'bi-shield-exclamation');
        return;
      }

      localStorage.setItem('lockscreen-pin', val);
      pinInputNew.value = '';
      if (pinStatusEl) {
        pinStatusEl.textContent = '✅ PIN updated successfully!';
        pinStatusEl.className = 'x-small mt-2 text-success fw-medium';
        setTimeout(() => {
          pinStatusEl.textContent = '';
        }, 4000);
      }
      showNotificationToast('PIN Code Saved', 'Your system lock screen PIN is now updated.', 'bi-shield-check');
    });
  }


  // --- 6. WINDOWS UPDATE DYNAMIC PROGRESS BAR ---
  const updateCheckBtn = document.getElementById('settings-update-check-btn');
  const updateStatus = document.getElementById('settings-update-status');
  const updateProgressWrapper = document.getElementById('settings-update-progress');
  const updateProgressInner = document.getElementById('settings-update-progress-inner');
  const updateAlert = document.getElementById('settings-update-alert');

  if (updateCheckBtn) {
    updateCheckBtn.addEventListener('click', () => {
      updateCheckBtn.disabled = true;
      updateCheckBtn.textContent = 'Checking...';
      
      if (updateAlert) updateAlert.classList.add('d-none');
      if (updateProgressWrapper) updateProgressWrapper.classList.remove('d-none');
      if (updateProgressInner) updateProgressInner.style.width = '0%';

      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.floor(Math.random() * 15) + 5;
        if (progress >= 100) {
          progress = 100;
          clearInterval(interval);

          // Complete update checks
          setTimeout(() => {
            if (updateProgressWrapper) updateProgressWrapper.classList.add('d-none');
            
            if (updateAlert) {
              updateAlert.innerHTML = '<i class="bi bi-check-circle-fill me-1"></i>You\'re up to date (Checked just now)';
              updateAlert.className = 'x-small text-success fw-medium';
              updateAlert.classList.remove('d-none');
            }

            if (updateStatus) {
              const now = new Date();
              const formattedTime = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
              updateStatus.textContent = `Last checked: Today, ${formattedTime}`;
            }

            updateCheckBtn.disabled = false;
            updateCheckBtn.textContent = 'Check for updates';

            showNotificationToast('Windows Update', 'Your developer environment has the latest code patches.', 'bi-arrow-clockwise');
          }, 300); // quick end transitions
        }
        if (updateProgressInner) {
          updateProgressInner.style.width = `${progress}%`;
        }
      }, 150);
    });
  }
}

/**
 * Handles the custom Windows 11 BIOS & OS Boot Sequence on initial page load
 */
function initBootSequence() {
  const bootScreen = document.getElementById('boot-screen');
  const biosView = document.getElementById('boot-bios-view');
  const osView = document.getElementById('boot-os-view');
  const biosLog = document.getElementById('bios-log');
  const osStatus = document.getElementById('boot-os-status');

  if (!bootScreen || !biosView || !osView || !biosLog || !osStatus) return;

  // Personalize the BIOS header with current system owner name
  const biosTitle = bootScreen.querySelector('.bios-header span');
  if (biosTitle) {
    biosTitle.textContent = `${getSystemOwnerName().toUpperCase()} BIOS v3.5`;
  }

  const logs = [
    'Initializing hardware subsystems...',
    'Checking NVMe storage drives... HEALTHY',
    'Starting Google Cloud Run hypervisor interface... OK',
    'Allocating 64GB of host virtual memory... DONE',
    'Compiling reactive desktop UI system files...',
    'Resolving local area network configuration... CONNECTED',
    'Invoking Windows 11 Boot Manager...'
  ];

  let logIndex = 0;
  let logTimeouts = [];
  let osTimeouts = [];
  let hasSkipped = false;

  // Function to skip the entire boot sequence
  function skipBoot() {
    if (hasSkipped) return;
    hasSkipped = true;

    // Clear all timeouts
    logTimeouts.forEach(t => clearTimeout(t));
    osTimeouts.forEach(t => clearTimeout(t));

    // Hide boot screen with transition
    bootScreen.classList.add('fade-out');
    
    // Play Windows Startup Chime!
    playWindowsChime(50);

    // Remove event listeners
    document.removeEventListener('keydown', handleKeyDown);
    bootScreen.removeEventListener('click', skipBoot);

    // Clean up from DOM after transition finishes
    setTimeout(() => {
      bootScreen.style.display = 'none';
    }, 600);
  }

  function handleKeyDown(e) {
    if (e.key === 'Escape') {
      skipBoot();
    }
  }

  // Add event listeners for skip
  document.addEventListener('keydown', handleKeyDown);
  bootScreen.addEventListener('click', skipBoot);

  // Phase 1: Output BIOS lines sequentially
  function printLogLine() {
    if (hasSkipped) return;

    if (logIndex < logs.length) {
      const line = document.createElement('p');
      line.className = 'mb-1 text-light';
      line.textContent = `> ${logs[logIndex]}`;
      biosLog.appendChild(line);
      logIndex++;

      // Delay between log prints
      const delay = Math.floor(Math.random() * 150) + 120; // 120-270ms
      const timeout = setTimeout(printLogLine, delay);
      logTimeouts.push(timeout);
    } else {
      // Completed BIOS, wait 600ms and switch to OS loading phase
      const timeout = setTimeout(transitionToOS, 600);
      logTimeouts.push(timeout);
    }
  }

  function transitionToOS() {
    if (hasSkipped) return;

    // Switch views
    biosView.classList.add('d-none');
    osView.classList.remove('d-none');

    // Update status messages during OS load
    const statusMessages = [
      { text: 'Starting Windows 11...', time: 0 },
      { text: 'Loading user profile preferences...', time: 1000 },
      { text: 'Setting up active shell layers...', time: 2000 },
      { text: 'Starting Windows Hello service...', time: 2800 }
    ];

    statusMessages.forEach(msg => {
      const timeout = setTimeout(() => {
        if (!hasSkipped) {
          osStatus.textContent = msg.text;
        }
      }, msg.time);
      osTimeouts.push(timeout);
    });

    // Complete boot sequence
    const completeTimeout = setTimeout(() => {
      skipBoot(); // Invokes the fade-out, chime, and cleanup
    }, 3600);
    osTimeouts.push(completeTimeout);
  }

  // Start sequence
  printLogLine();
}


