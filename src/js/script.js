/**
 * Windows 11 Developer Portfolio
 * Minimal Vanilla JavaScript for desktop components.
 * Kept clear, structured, and commented for an ICT beginner.
 */

import * as bootstrap from 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import '../css/style.css';

// Ensure bootstrap is available globally on window
if (typeof window !== 'undefined') {
  window.bootstrap = bootstrap;
}

// Helper to get system owner name dynamically
function getSystemOwnerName() {
  try {
    return localStorage.getItem('system-owner-name') || 'DEV CHARLES WEB';
  } catch (e) {
    return 'DEV CHARLES WEB';
  }
}

function initAllDesktopComponents() {
  const tasks = [
    { name: 'BootSequence', fn: initBootSequence },
    { name: 'Clock', fn: initClock },
    { name: 'StartMenu', fn: initStartMenu },
    { name: 'WindowSystem', fn: initWindowSystem },
    { name: 'Tooltips', fn: initTooltips },
    { name: 'AppFeatures', fn: initAppFeatures },
    { name: 'QuickSettings', fn: initQuickSettings },
    { name: 'DraggableAndLayering', fn: initDraggableAndLayering },
    { name: 'SearchFilter', fn: initSearchFilter },
    { name: 'GlobalSearchModal', fn: initGlobalSearchModal },
    { name: 'RecycleBin', fn: initRecycleBin },
    { name: 'LockScreen', fn: initLockScreen },
    { name: 'NotificationCenter', fn: initNotificationCenter },
    { name: 'SettingsApp', fn: initSettingsApp },
    { name: 'DesktopAndContextMenu', fn: initDesktopAndContextMenu },
    { name: 'ProjectsManager', fn: initProjectsManager },
    { name: 'ResumeViewer', fn: initResumeViewer },
    { name: 'EdgeBrowser', fn: initEdgeBrowser },
    { name: 'BuiltInApps', fn: initBuiltInApps }
  ];

  tasks.forEach(task => {
    try {
      task.fn();
    } catch (err) {
      console.warn(`[Windows 11] Error initializing ${task.name}:`, err);
    }
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAllDesktopComponents);
} else {
  initAllDesktopComponents();
}

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
  if (typeof window === 'undefined' || !window.bootstrap || !window.bootstrap.Tooltip) return;
  const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
  [...tooltipTriggerList].forEach(tooltipTriggerEl => {
    try {
      new window.bootstrap.Tooltip(tooltipTriggerEl, {
        delay: { show: 600, hide: 100 }
      });
    } catch (e) {
      // Gracefully ignore tooltip init errors
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
 * Syncs app window states with the taskbar icon indicator dots,
 * manages active focus classes (.is-focused), and allows taskbar icon clicking
 * to focus or minimize open windows like a real Windows PC.
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
    { modalId: 'terminal-modal', btnId: 'taskbar-terminal-btn' },
    { modalId: 'browser-modal', btnId: 'taskbar-browser-btn' },
    { modalId: 'calculator-modal', btnId: 'taskbar-calculator-btn' },
    { modalId: 'notepad-modal', btnId: 'taskbar-notepad-btn' },
    { modalId: 'paint-modal', btnId: '' },
    { modalId: 'search-modal', btnId: 'taskbar-search-btn' },
    { modalId: 'recycle-modal', btnId: '' },
    { modalId: 'project-editor-modal', btnId: '' }
  ];

  let highestZ = 1050;

  function setActiveWindow(modalEl) {
    highestZ += 2;
    modalEl.style.zIndex = highestZ;

    // Remove focus class from all windows
    document.querySelectorAll('.win11-modal').forEach(m => m.classList.remove('is-focused'));
    modalEl.classList.add('is-focused');
  }

  apps.forEach(app => {
    const modalEl = document.getElementById(app.modalId);
    const taskbarBtn = document.getElementById(app.btnId);

    if (modalEl) {
      modalEl.addEventListener('show.bs.modal', () => {
        // Add active dot styling on its taskbar icon
        if (taskbarBtn) {
          taskbarBtn.classList.add('is-active');
        }
        
        setActiveWindow(modalEl);

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
        modalEl.classList.remove('is-focused');
      });

      // Window focus on click
      modalEl.addEventListener('mousedown', () => {
        setActiveWindow(modalEl);
      });
      modalEl.addEventListener('touchstart', () => {
        setActiveWindow(modalEl);
      }, { passive: true });
    }
  });

  // Taskbar button click behavior: if modal already open, clicking its taskbar icon toggles focus/minimize
  apps.forEach(app => {
    if (!app.btnId) return;
    const taskbarBtn = document.getElementById(app.btnId);
    const modalEl = document.getElementById(app.modalId);
    if (taskbarBtn && modalEl) {
      taskbarBtn.addEventListener('click', (e) => {
        if (modalEl.classList.contains('show')) {
          // If modal is already shown and focused, minimize it
          if (modalEl.classList.contains('is-focused')) {
            const bsModal = window.bootstrap?.Modal.getInstance(modalEl);
            if (bsModal) {
              e.preventDefault();
              e.stopPropagation();
              bsModal.hide();
            }
          } else {
            // Bring to focus
            e.preventDefault();
            e.stopPropagation();
            setActiveWindow(modalEl);
          }
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
      const labelEl = item.querySelector('.start-grid-label');
      const label = labelEl ? labelEl.textContent.toLowerCase() : item.textContent.toLowerCase();
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

/**
 * Windows 11 Desktop Context Menu & Selection
 */
function initDesktopAndContextMenu() {
  const desktop = document.querySelector('.win11-desktop');
  const contextMenu = document.getElementById('desktop-context-menu');
  if (!desktop || !contextMenu) return;

  // Right-click event listener on desktop canvas
  desktop.addEventListener('contextmenu', (e) => {
    // If clicked on an active open modal window, don't override its behavior
    if (e.target.closest('.win11-modal.show')) return;

    e.preventDefault();

    const mouseX = e.clientX;
    const mouseY = e.clientY;
    const menuWidth = 230;
    const menuHeight = 280;

    // Clamp coordinates within viewport
    const left = (mouseX + menuWidth > window.innerWidth) ? (window.innerWidth - menuWidth - 10) : mouseX;
    const top = (mouseY + menuHeight > window.innerHeight) ? (window.innerHeight - menuHeight - 10) : mouseY;

    contextMenu.style.left = `${left}px`;
    contextMenu.style.top = `${top}px`;
    contextMenu.classList.add('show');
  });

  // Hide context menu on click anywhere
  document.addEventListener('click', () => {
    if (contextMenu.classList.contains('show')) {
      contextMenu.classList.remove('show');
    }
  });

  // Context Menu Actions
  const ctxRefresh = document.getElementById('ctx-refresh');
  if (ctxRefresh) {
    ctxRefresh.addEventListener('click', () => {
      const desktopIcons = document.querySelectorAll('.desktop-icon');
      desktopIcons.forEach(icon => {
        icon.style.opacity = '0.3';
        icon.style.transform = 'scale(0.95)';
      });
      playWindowsChime(30);
      setTimeout(() => {
        desktopIcons.forEach(icon => {
          icon.style.opacity = '1';
          icon.style.transform = 'scale(1)';
        });
        showNotificationToast('Desktop Refreshed', 'Icons and visual state re-indexed.', 'bi-arrow-clockwise');
      }, 200);
    });
  }

  const ctxNewProject = document.getElementById('ctx-new-project');
  if (ctxNewProject) {
    ctxNewProject.addEventListener('click', () => {
      const btn = document.getElementById('btn-add-new-project');
      if (btn) btn.click();
    });
  }

  const ctxTerminal = document.getElementById('ctx-terminal');
  if (ctxTerminal) {
    ctxTerminal.addEventListener('click', () => {
      const termBtn = document.getElementById('desktop-terminal-btn');
      if (termBtn) termBtn.click();
    });
  }

  const ctxPersonalize = document.getElementById('ctx-personalize');
  if (ctxPersonalize) {
    ctxPersonalize.addEventListener('click', () => {
      const skillsBtn = document.getElementById('desktop-skills-btn');
      if (skillsBtn) skillsBtn.click();
    });
  }
}

/**
 * Projects Showcase Manager (Add / Edit / Remove / Filter / Search Real Projects)
 */
function initProjectsManager() {
  const defaultProjects = [
    {
      id: 'proj-1',
      title: 'Financial Analysis Dashboard',
      category: 'Full-Stack',
      description: 'A responsive administrative analytics control center featuring interactive metrics, real-time tracking, and simple mock charts.',
      tags: ['HTML5', 'CSS3', 'Bootstrap 5', 'TypeScript'],
      image: '/src/assets/images/project_dashboard_1783172997327.jpg',
      liveUrl: 'https://example.com',
      repoUrl: 'https://github.com'
    },
    {
      id: 'proj-2',
      title: 'Recipe Vault App',
      category: 'Frontend',
      description: 'An intuitive cooking companion website that showcases tasty food cards, detailed preparation steps, and easy navigation widgets.',
      tags: ['HTML5', 'CSS3', 'Bootstrap 5', 'JavaScript'],
      image: '/src/assets/images/project_recipes_1783173011418.jpg',
      liveUrl: 'https://example.com',
      repoUrl: 'https://github.com'
    },
    {
      id: 'proj-3',
      title: 'Creative Paint Studio',
      category: 'Frontend',
      description: 'A fully interactive pixel coloring canvas application allowing creative designers to paint, clear grids, and swap colors easily.',
      tags: ['HTML5', 'CSS3', 'Canvas API', 'Bootstrap 5'],
      image: '/src/assets/images/project_paint_1783173024300.jpg',
      liveUrl: 'https://example.com',
      repoUrl: 'https://github.com'
    }
  ];

  function getStoredProjects() {
    try {
      const stored = localStorage.getItem('user-portfolio-projects');
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.warn('Failed to parse stored projects:', e);
    }
    return defaultProjects;
  }

  function saveProjects(projects) {
    localStorage.setItem('user-portfolio-projects', JSON.stringify(projects));
  }

  let currentCategory = 'all';
  let searchQuery = '';

  const container = document.getElementById('projects-list-container');
  const countBadge = document.getElementById('projects-count-badge');
  const searchInput = document.getElementById('project-search-input');
  const filterPills = document.querySelectorAll('#project-category-filters .project-filter-pill');
  const addNewBtn = document.getElementById('btn-add-new-project');
  const editorModalEl = document.getElementById('project-editor-modal');
  const editorForm = document.getElementById('project-editor-form');

  function renderProjects() {
    if (!container) return;
    const allProjects = getStoredProjects();

    const filtered = allProjects.filter(p => {
      const matchesCategory = currentCategory === 'all' || p.category === currentCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q || 
        p.title.toLowerCase().includes(q) || 
        p.description.toLowerCase().includes(q) || 
        (p.tags && p.tags.some(t => t.toLowerCase().includes(q)));
      return matchesCategory && matchesSearch;
    });

    if (countBadge) {
      countBadge.textContent = `${filtered.length} of ${allProjects.length} items`;
    }

    if (filtered.length === 0) {
      container.innerHTML = `
        <div class="col-12 text-center py-5 text-muted">
          <i class="bi bi-folder2-open" style="font-size: 2.5rem; opacity: 0.5;"></i>
          <h5 class="h6 mt-3 text-dark">No matching projects found</h5>
          <p class="small text-muted mb-3">Try adjusting your search terms or click below to add a new project.</p>
          <button class="btn btn-sm btn-primary px-3" id="empty-state-add-btn">
            <i class="bi bi-plus-circle me-1"></i> Add Project
          </button>
        </div>
      `;
      const emptyAdd = document.getElementById('empty-state-add-btn');
      if (emptyAdd && addNewBtn) {
        emptyAdd.addEventListener('click', () => addNewBtn.click());
      }
      return;
    }

    container.innerHTML = filtered.map(p => {
      const tagBadges = (p.tags || []).map(tag => 
        `<span class="badge bg-primary-subtle text-primary border border-primary-subtle rounded-pill" style="font-size: 9px; font-weight: 500;">${tag}</span>`
      ).join(' ');

      return `
        <div class="col" id="card-${p.id}">
          <div class="card h-100 border-light shadow-sm project-card-item">
            <div class="position-relative">
              <img src="${p.image || '/src/assets/images/project_dashboard_1783172997327.jpg'}" class="card-img-top border-bottom" alt="${p.title}" style="height: 135px; object-fit: cover;" referrerPolicy="no-referrer">
              <span class="badge bg-dark bg-opacity-75 text-white position-absolute top-0 end-0 m-2" style="font-size: 9px;">${p.category || 'General'}</span>
            </div>
            
            <div class="card-body d-flex flex-column p-3">
              <div class="d-flex justify-content-between align-items-start mb-1">
                <h5 class="card-title h6 fw-bold mb-0 text-dark">${p.title}</h5>
                <div class="dropdown">
                  <button class="btn btn-sm btn-link text-muted p-0" type="button" data-bs-toggle="dropdown" aria-expanded="false" title="Project options">
                    <i class="bi bi-three-dots-vertical"></i>
                  </button>
                  <ul class="dropdown-menu dropdown-menu-end shadow-sm" style="font-size: 12px;">
                    <li><button class="dropdown-item edit-project-action" data-id="${p.id}"><i class="bi bi-pencil me-2 text-primary"></i>Edit Project</button></li>
                    <li><button class="dropdown-item text-danger delete-project-action" data-id="${p.id}"><i class="bi bi-trash3 me-2"></i>Delete Project</button></li>
                  </ul>
                </div>
              </div>
              
              <p class="card-text text-muted mb-3" style="font-size: 11.5px; line-height: 1.4;">
                ${p.description}
              </p>
              
              <div class="mb-3 d-flex flex-wrap gap-1 mt-auto">
                ${tagBadges}
              </div>
              
              <div class="d-flex gap-2">
                <a href="${p.liveUrl || '#'}" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-sm flex-grow-1 py-1 d-flex align-items-center justify-content-center gap-1" style="font-size: 11px; background-color: var(--win-blue);">
                  <i class="bi bi-globe"></i> Live Demo
                </a>
                <a href="${p.repoUrl || '#'}" target="_blank" rel="noopener noreferrer" class="btn btn-outline-secondary btn-sm py-1 d-flex align-items-center justify-content-center" style="font-size: 11px; width: 40px;" title="Source Code">
                  <i class="bi bi-github"></i>
                </a>
              </div>
            </div>
          </div>
        </div>
      `;
    }).join('');

    // Bind Edit & Delete actions
    container.querySelectorAll('.edit-project-action').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        openEditorForProject(id);
      });
    });

    container.querySelectorAll('.delete-project-action').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        deleteProject(id);
      });
    });
  }

  function deleteProject(id) {
    let projects = getStoredProjects();
    const target = projects.find(p => p.id === id);
    if (!target) return;

    if (confirm(`Are you sure you want to remove "${target.title}" from your projects?`)) {
      projects = projects.filter(p => p.id !== id);
      saveProjects(projects);
      renderProjects();
      showNotificationToast('Project Removed', `"${target.title}" was removed from your portfolio.`, 'bi-trash3-fill');
    }
  }

  function openEditorForProject(id) {
    const projects = getStoredProjects();
    const project = id ? projects.find(p => p.id === id) : null;

    const modalTitle = document.getElementById('project-editor-modal-title');
    const idInput = document.getElementById('proj-edit-id');
    const titleInput = document.getElementById('proj-edit-title');
    const catInput = document.getElementById('proj-edit-category');
    const imgInput = document.getElementById('proj-edit-image');
    const descInput = document.getElementById('proj-edit-desc');
    const tagsInput = document.getElementById('proj-edit-tags');
    const liveInput = document.getElementById('proj-edit-live');
    const repoInput = document.getElementById('proj-edit-repo');

    if (project) {
      if (modalTitle) modalTitle.textContent = 'Edit Project Details';
      if (idInput) idInput.value = project.id;
      if (titleInput) titleInput.value = project.title;
      if (catInput) catInput.value = project.category || 'Full-Stack';
      if (imgInput) imgInput.value = project.image || '/src/assets/images/project_dashboard_1783172997327.jpg';
      if (descInput) descInput.value = project.description;
      if (tagsInput) tagsInput.value = (project.tags || []).join(', ');
      if (liveInput) liveInput.value = project.liveUrl || '';
      if (repoInput) repoInput.value = project.repoUrl || '';
    } else {
      if (modalTitle) modalTitle.textContent = 'Add Your Real Project';
      if (idInput) idInput.value = '';
      if (titleInput) titleInput.value = '';
      if (catInput) catInput.value = 'Full-Stack';
      if (imgInput) imgInput.value = '/src/assets/images/project_dashboard_1783172997327.jpg';
      if (descInput) descInput.value = '';
      if (tagsInput) tagsInput.value = 'React, TypeScript, Tailwind';
      if (liveInput) liveInput.value = 'https://';
      if (repoInput) repoInput.value = 'https://github.com/';
    }

    if (window.bootstrap && editorModalEl) {
      const bsModal = new window.bootstrap.Modal(editorModalEl);
      bsModal.show();
    }
  }

  // Bind Add New Project button
  if (addNewBtn) {
    addNewBtn.addEventListener('click', () => {
      openEditorForProject(null);
    });
  }

  // Handle Form Submission
  if (editorForm) {
    editorForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const id = document.getElementById('proj-edit-id').value;
      const title = document.getElementById('proj-edit-title').value.trim();
      const category = document.getElementById('proj-edit-category').value;
      const image = document.getElementById('proj-edit-image').value;
      const description = document.getElementById('proj-edit-desc').value.trim();
      const rawTags = document.getElementById('proj-edit-tags').value.trim();
      const tags = rawTags.split(',').map(t => t.trim()).filter(Boolean);
      const liveUrl = document.getElementById('proj-edit-live').value.trim();
      const repoUrl = document.getElementById('proj-edit-repo').value.trim();

      let projects = getStoredProjects();

      if (id) {
        // Update existing
        projects = projects.map(p => {
          if (p.id === id) {
            return { ...p, title, category, image, description, tags, liveUrl, repoUrl };
          }
          return p;
        });
        showNotificationToast('Project Updated', `"${title}" has been updated successfully.`, 'bi-check-circle-fill');
      } else {
        // Create new
        const newProj = {
          id: 'proj-' + Date.now(),
          title,
          category,
          image,
          description,
          tags,
          liveUrl,
          repoUrl
        };
        projects.unshift(newProj);
        showNotificationToast('Project Added', `"${title}" is now part of your showcase.`, 'bi-plus-circle-fill');
      }

      saveProjects(projects);
      renderProjects();

      // Close modal
      if (window.bootstrap && editorModalEl) {
        const bsModal = window.bootstrap.Modal.getInstance(editorModalEl);
        if (bsModal) bsModal.hide();
      }
    });
  }

  // Filter pills event listeners
  filterPills.forEach(pill => {
    pill.addEventListener('click', () => {
      filterPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      currentCategory = pill.getAttribute('data-filter');
      renderProjects();
    });
  });

  // Search input event listener
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value;
      renderProjects();
    });
  }

  // Initial render
  renderProjects();
}

/**
 * Microsoft Edge PDF Resume Viewer & Live Customizer
 */
function initResumeViewer() {
  const scrollContainer = document.getElementById('resume-paper-scroll');
  const paperCanvas = document.getElementById('resume-paper-canvas');
  const zoomInBtn = document.getElementById('resume-zoom-in');
  const zoomOutBtn = document.getElementById('resume-zoom-out');
  const zoomResetBtn = document.getElementById('resume-zoom-reset');
  const zoomLabel = document.getElementById('resume-zoom-label');
  const toggleEditBtn = document.getElementById('resume-toggle-edit');
  const editContainer = document.getElementById('resume-edit-container');
  const editForm = document.getElementById('resume-edit-form');
  const cancelEditBtn = document.getElementById('resume-cancel-edit');
  const printBtn = document.getElementById('print-resume-btn');

  if (!paperCanvas) return;

  // Zoom management
  let currentZoom = 100;

  function setZoom(val) {
    currentZoom = Math.max(50, Math.min(150, val));
    if (paperCanvas) {
      paperCanvas.style.transform = `scale(${currentZoom / 100})`;
      paperCanvas.style.transformOrigin = 'top center';
    }
    if (zoomLabel) {
      zoomLabel.textContent = `${currentZoom}%`;
    }
  }

  if (zoomInBtn) {
    zoomInBtn.addEventListener('click', () => setZoom(currentZoom + 10));
  }
  if (zoomOutBtn) {
    zoomOutBtn.addEventListener('click', () => setZoom(currentZoom - 10));
  }
  if (zoomResetBtn) {
    zoomResetBtn.addEventListener('click', () => setZoom(100));
  }

  // Resume In-place editing toggle
  if (toggleEditBtn && editContainer) {
    toggleEditBtn.addEventListener('click', () => {
      const isHidden = editContainer.classList.contains('d-none');
      if (isHidden) {
        editContainer.classList.remove('d-none');
        paperCanvas.classList.add('opacity-50');
      } else {
        editContainer.classList.add('d-none');
        paperCanvas.classList.remove('opacity-50');
      }
    });
  }

  if (cancelEditBtn && editContainer) {
    cancelEditBtn.addEventListener('click', () => {
      editContainer.classList.add('d-none');
      paperCanvas.classList.remove('opacity-50');
    });
  }

  // Form submit to update Resume Live
  if (editForm) {
    editForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('edit-resume-name').value.trim();
      const title = document.getElementById('edit-resume-title').value.trim();
      const location = document.getElementById('edit-resume-location').value.trim();
      const email = document.getElementById('edit-resume-email').value.trim();
      const phone = document.getElementById('edit-resume-phone').value.trim();
      const summary = document.getElementById('edit-resume-summary').value.trim();
      const skills = document.getElementById('edit-resume-skills').value.trim();

      // Update DOM
      const cvName = document.getElementById('cv-display-name');
      const cvTitle = document.getElementById('cv-display-title');
      const cvLoc = document.getElementById('cv-display-location');
      const cvEmail = document.getElementById('cv-display-email');
      const cvPhone = document.getElementById('cv-display-phone');
      const cvSummary = document.getElementById('cv-display-summary');

      if (cvName) cvName.textContent = name;
      if (cvTitle) cvTitle.textContent = title;
      if (cvLoc) cvLoc.textContent = location;
      if (cvEmail) cvEmail.textContent = email;
      if (cvPhone) cvPhone.textContent = phone;
      if (cvSummary) cvSummary.textContent = summary;

      // Save to localStorage
      const resumeData = { name, title, location, email, phone, summary, skills };
      localStorage.setItem('user-custom-resume', JSON.stringify(resumeData));

      // Close edit container
      if (editContainer) {
        editContainer.classList.add('d-none');
        paperCanvas.classList.remove('opacity-50');
      }

      showNotificationToast('Resume Saved', 'Your CV document information has been updated.', 'bi-file-earmark-check-fill');
    });

    // Load saved resume data on start
    try {
      const saved = localStorage.getItem('user-custom-resume');
      if (saved) {
        const d = JSON.parse(saved);
        if (d.name) {
          const cvName = document.getElementById('cv-display-name');
          const editName = document.getElementById('edit-resume-name');
          if (cvName) cvName.textContent = d.name;
          if (editName) editName.value = d.name;
        }
        if (d.title) {
          const cvTitle = document.getElementById('cv-display-title');
          const editTitle = document.getElementById('edit-resume-title');
          if (cvTitle) cvTitle.textContent = d.title;
          if (editTitle) editTitle.value = d.title;
        }
        if (d.location) {
          const cvLoc = document.getElementById('cv-display-location');
          const editLoc = document.getElementById('edit-resume-location');
          if (cvLoc) cvLoc.textContent = d.location;
          if (editLoc) editLoc.value = d.location;
        }
        if (d.email) {
          const cvEmail = document.getElementById('cv-display-email');
          const editEmail = document.getElementById('edit-resume-email');
          if (cvEmail) cvEmail.textContent = d.email;
          if (editEmail) editEmail.value = d.email;
        }
        if (d.phone) {
          const cvPhone = document.getElementById('cv-display-phone');
          const editPhone = document.getElementById('edit-resume-phone');
          if (cvPhone) cvPhone.textContent = d.phone;
          if (editPhone) editPhone.value = d.phone;
        }
        if (d.summary) {
          const cvSummary = document.getElementById('cv-display-summary');
          const editSummary = document.getElementById('edit-resume-summary');
          if (cvSummary) cvSummary.textContent = d.summary;
          if (editSummary) editSummary.value = d.summary;
        }
      }
    } catch (err) {
      console.warn('Could not load custom resume data:', err);
    }
  }

  // Print button
  if (printBtn) {
    printBtn.addEventListener('click', () => {
      window.print();
    });
  }
}

/**
 * Windows 11 Global Search Flyout / Modal (#search-modal)
 */
function initGlobalSearchModal() {
  const searchModal = document.getElementById('search-modal');
  const searchInput = document.getElementById('global-search-input');
  const searchResults = document.getElementById('global-search-results');
  const filterPills = document.querySelectorAll('.search-cat-pill');

  if (!searchInput || !searchResults) return;

  // Search dataset: All apps, projects, and system settings
  const searchItems = [
    { title: 'About Me', desc: 'Personal bio, career objectives & education', cat: 'apps', icon: 'bi-person-circle text-primary', modal: 'about-modal' },
    { title: 'Projects', desc: 'File Explorer with interactive project gallery', cat: 'apps', icon: 'bi-folder-fill text-warning', modal: 'projects-modal' },
    { title: 'Resume (CV)', desc: 'Microsoft Edge PDF Resume viewer & editor', cat: 'apps', icon: 'bi-file-earmark-pdf-fill text-danger', modal: 'resume-modal' },
    { title: 'My Skills', desc: 'Windows Settings: Technical competencies & tools', cat: 'apps', icon: 'bi-award-fill text-info', modal: 'skills-modal' },
    { title: 'Windows Terminal', desc: 'PowerShell command-line interface & CLI utilities', cat: 'apps', icon: 'bi-terminal-fill text-dark', modal: 'terminal-modal' },
    { title: 'Calculator', desc: 'Standard arithmetic & algebraic calculator', cat: 'apps', icon: 'bi-calculator-fill text-secondary', modal: 'calculator-modal' },
    { title: 'Notepad', desc: 'Lightweight text editor, code scratchpad & notes', cat: 'apps', icon: 'bi-file-text-fill text-primary', modal: 'notepad-modal' },
    { title: 'Paint Studio', desc: 'Creative digital drawing canvas & shapes', cat: 'apps', icon: 'bi-palette-fill text-warning', modal: 'paint-modal' },
    { title: 'Microsoft Edge', desc: 'Web browser, search engine & developer links', cat: 'apps', icon: 'bi-globe text-primary', modal: 'browser-modal' },
    { title: 'Contact Me', desc: 'Get in touch, direct messaging & email', cat: 'apps', icon: 'bi-envelope-fill text-primary', modal: 'contact-modal' },
    { title: 'Recycle Bin', desc: 'Manage deleted files & discarded ideas', cat: 'apps', icon: 'bi-trash3-fill text-secondary', modal: 'recycle-modal' },
    { title: 'Add / Edit Project', desc: 'Create real portfolio project entries', cat: 'projects', icon: 'bi-folder-plus text-success', modal: 'project-editor-modal' },
    { title: 'Dark / Light Theme', desc: 'Toggle system visual appearance in Quick Settings', cat: 'settings', icon: 'bi-moon-stars-fill text-warning', action: 'toggle-theme' },
    { title: 'Wi-Fi & Network', desc: 'Manage internet connections in Quick Settings', cat: 'settings', icon: 'bi-wifi text-primary', action: 'open-quick-settings' },
    { title: 'Sound & Volume', desc: 'Adjust master system audio and chimes', cat: 'settings', icon: 'bi-volume-up-fill text-info', action: 'open-quick-settings' },
    { title: 'Display Brightness', desc: 'Adjust screen brightness and contrast overlay', cat: 'settings', icon: 'bi-brightness-high text-warning', action: 'open-quick-settings' }
  ];

  let currentFilter = 'all';

  function renderSearchResults(query = '') {
    const q = query.toLowerCase().trim();
    let filtered = searchItems.filter(item => {
      const matchCat = currentFilter === 'all' || item.cat === currentFilter;
      const matchQuery = !q || item.title.toLowerCase().includes(q) || item.desc.toLowerCase().includes(q);
      return matchCat && matchQuery;
    });

    searchResults.innerHTML = '';

    if (filtered.length === 0) {
      searchResults.innerHTML = `
        <div class="text-center py-5 text-muted">
          <i class="bi bi-search" style="font-size: 2rem; opacity: 0.5;"></i>
          <p class="mt-2 mb-1 fw-semibold small">No matching results for "${query}"</p>
          <span class="x-small text-muted" style="font-size: 11px;">Try searching for "Calculator", "Terminal", "Notepad", "Paint", or "Projects"</span>
        </div>
      `;
      return;
    }

    const group = document.createElement('div');
    group.className = 'd-flex flex-column gap-1.5';

    filtered.forEach((item, index) => {
      const el = document.createElement('div');
      el.className = 'd-flex align-items-center justify-content-between p-2 rounded-3 hover-bg search-result-item';
      el.style.cssText = 'cursor: pointer; transition: background-color 0.15s ease; border: 1px solid transparent;';
      el.dataset.index = index;

      el.innerHTML = `
        <div class="d-flex align-items-center gap-3">
          <div class="d-flex align-items-center justify-content-center bg-white rounded-2 shadow-sm" style="width: 38px; height: 38px; font-size: 1.25rem;">
            <i class="bi ${item.icon}"></i>
          </div>
          <div>
            <div class="fw-semibold text-dark small mb-0">${item.title}</div>
            <div class="text-muted text-truncate" style="font-size: 11px; max-width: 340px;">${item.desc}</div>
          </div>
        </div>
        <div>
          <span class="badge ${item.cat === 'apps' ? 'bg-primary-subtle text-primary' : (item.cat === 'projects' ? 'bg-success-subtle text-success' : 'bg-secondary-subtle text-secondary')} text-capitalize" style="font-size: 10px;">${item.cat}</span>
        </div>
      `;

      el.addEventListener('mouseenter', () => {
        el.style.backgroundColor = 'rgba(255, 255, 255, 0.7)';
        el.style.borderColor = 'rgba(0, 120, 212, 0.2)';
      });
      el.addEventListener('mouseleave', () => {
        el.style.backgroundColor = 'transparent';
        el.style.borderColor = 'transparent';
      });

      el.addEventListener('click', () => {
        // Close search modal
        if (searchModal && window.bootstrap) {
          const bsModal = window.bootstrap.Modal.getInstance(searchModal);
          if (bsModal) bsModal.hide();
        }

        if (item.modal) {
          const targetModal = document.getElementById(item.modal);
          if (targetModal && window.bootstrap) {
            const bs = window.bootstrap.Modal.getOrCreateInstance(targetModal);
            bs.show();
          }
        } else if (item.action === 'toggle-theme') {
          const darkBtn = document.getElementById('qs-dark-btn');
          if (darkBtn) darkBtn.click();
        } else if (item.action === 'open-quick-settings') {
          const systray = document.getElementById('systray-capsule');
          if (systray) systray.click();
        }
      });

      group.appendChild(el);
    });

    searchResults.appendChild(group);
  }

  // Initial render
  renderSearchResults('');

  // Search input handler
  searchInput.addEventListener('input', (e) => {
    renderSearchResults(e.target.value);
  });

  // Enter key launches first result
  searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const first = searchResults.querySelector('.search-result-item');
      if (first) first.click();
    }
  });

  // Filter pills
  filterPills.forEach(pill => {
    pill.addEventListener('click', () => {
      filterPills.forEach(p => {
        p.classList.remove('bg-primary', 'text-white', 'active');
        p.classList.add('bg-white', 'text-dark', 'border');
      });
      pill.classList.remove('bg-white', 'text-dark', 'border');
      pill.classList.add('bg-primary', 'text-white', 'active');

      currentFilter = pill.dataset.cat || 'all';
      renderSearchResults(searchInput.value);
    });
  });

  // Focus input when search modal is opened
  if (searchModal) {
    searchModal.addEventListener('shown.bs.modal', () => {
      searchInput.value = '';
      renderSearchResults('');
      searchInput.focus();
    });
  }
}

/**
 * Microsoft Edge Browser App Window (#browser-modal)
 */
function initEdgeBrowser() {
  const browserModal = document.getElementById('browser-modal');
  const urlForm = document.getElementById('browser-url-form');
  const urlInput = document.getElementById('browser-url-input');
  const tabTitle = document.getElementById('browser-tab-title');
  const homePage = document.getElementById('browser-home-page');
  const contentContainer = document.getElementById('browser-content-container');
  const homeBtn = document.getElementById('browser-home-btn');
  const backBtn = document.getElementById('browser-back-btn');
  const forwardBtn = document.getElementById('browser-forward-btn');
  const refreshBtn = document.getElementById('browser-refresh-btn');
  const quickLinks = document.querySelectorAll('.browser-quick-link');

  if (!browserModal || !urlInput) return;

  function loadUrl(query) {
    let url = query.trim();
    if (!url) return;

    if (!url.startsWith('http://') && !url.startsWith('https://') && !url.includes('.')) {
      // It's a search term
      urlInput.value = `https://www.bing.com/search?q=${encodeURIComponent(url)}`;
      if (tabTitle) tabTitle.textContent = `${url} - Search`;
      showSearchResults(url);
    } else {
      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        url = 'https://' + url;
      }
      urlInput.value = url;
      const host = new URL(url).hostname;
      if (tabTitle) tabTitle.textContent = host;
      showWebpage(url);
    }
  }

  function showSearchResults(query) {
    if (homePage) homePage.classList.add('d-none');
    if (contentContainer) {
      contentContainer.classList.remove('d-none');
      contentContainer.innerHTML = `
        <div class="py-3">
          <div class="d-flex align-items-center gap-2 mb-3 text-muted small">
            <span>All</span>
            <span class="fw-semibold text-primary">Web</span>
            <span>Images</span>
            <span>Videos</span>
            <span>Maps</span>
            <span>News</span>
          </div>
          <h5 class="fw-bold mb-3">Search results for: "${query}"</h5>
          
          <div class="mb-4">
            <div class="text-primary small">https://charles-portfolio.dev/${encodeURIComponent(query)}</div>
            <a href="#" class="h6 fw-bold text-primary d-block mb-1 text-decoration-none" id="search-result-portfolio">${query} - Developer Profile & Projects</a>
            <p class="small text-muted">Explore featured repositories, technical achievements, responsive applications, and full-stack software solutions.</p>
          </div>

          <div class="mb-4">
            <div class="text-primary small">https://github.com/adeosuncharles/${encodeURIComponent(query)}</div>
            <a href="https://github.com" target="_blank" class="h6 fw-bold text-primary d-block mb-1 text-decoration-none">GitHub Repository & Code</a>
            <p class="small text-muted">Open source repositories, pull requests, automated GitHub Actions, and production deployments.</p>
          </div>

          <div class="mb-4">
            <div class="text-primary small">https://developer.mozilla.org/en-US/docs/Web</div>
            <a href="https://developer.mozilla.org" target="_blank" class="h6 fw-bold text-primary d-block mb-1 text-decoration-none">MDN Web Documentation</a>
            <p class="small text-muted">The MDN Web Docs site provides comprehensive documentation on HTML, CSS, JavaScript, Web APIs, and web development.</p>
          </div>
        </div>
      `;

      const portfolioLink = document.getElementById('search-result-portfolio');
      if (portfolioLink) {
        portfolioLink.addEventListener('click', (e) => {
          e.preventDefault();
          const projModal = document.getElementById('projects-modal');
          if (projModal && window.bootstrap) {
            window.bootstrap.Modal.getOrCreateInstance(projModal).show();
          }
        });
      }
    }
  }

  function showWebpage(url) {
    if (homePage) homePage.classList.add('d-none');
    if (contentContainer) {
      contentContainer.classList.remove('d-none');
      contentContainer.innerHTML = `
        <div class="p-4 text-center">
          <div class="spinner-border text-primary mb-3" role="status" id="browser-loading-spinner">
            <span class="visually-hidden">Loading...</span>
          </div>
          <h6 class="fw-bold text-dark">${url}</h6>
          <p class="small text-muted mb-4">Navigating to secure web document...</p>
          <div class="p-4 bg-light rounded-3 border text-start mx-auto" style="max-width: 600px;">
            <div class="d-flex align-items-center gap-2 mb-2">
              <i class="bi bi-shield-check text-success"></i>
              <span class="small fw-bold">Connection is secure (HTTPS)</span>
            </div>
            <p class="x-small text-muted mb-3" style="font-size: 12px;">This Windows 11 simulated browser environment allows exploring developer documentations, repositories, and direct navigation.</p>
            <a href="${url}" target="_blank" class="btn btn-sm btn-primary px-3" style="background-color: var(--win-blue);">
              <i class="bi bi-box-arrow-up-right me-1"></i> Open External Link
            </a>
          </div>
        </div>
      `;
      setTimeout(() => {
        const spinner = document.getElementById('browser-loading-spinner');
        if (spinner) spinner.classList.add('d-none');
      }, 600);
    }
  }

  if (urlForm) {
    urlForm.addEventListener('submit', (e) => {
      e.preventDefault();
      loadUrl(urlInput.value);
    });
  }

  if (homeBtn) {
    homeBtn.addEventListener('click', () => {
      if (homePage) homePage.classList.remove('d-none');
      if (contentContainer) contentContainer.classList.add('d-none');
      urlInput.value = 'https://bing.com';
      if (tabTitle) tabTitle.textContent = 'New Tab - Edge';
    });
  }

  if (refreshBtn) {
    refreshBtn.addEventListener('click', () => {
      loadUrl(urlInput.value);
    });
  }

  quickLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetUrl = link.dataset.url;
      if (targetUrl) loadUrl(targetUrl);
    });
  });

  // Edge home page card shortcuts
  const cardProj = document.getElementById('edge-card-projects');
  const cardResume = document.getElementById('edge-card-resume');
  const cardSkills = document.getElementById('edge-card-skills');

  if (cardProj) {
    cardProj.addEventListener('click', () => {
      const m = document.getElementById('projects-modal');
      if (m && window.bootstrap) window.bootstrap.Modal.getOrCreateInstance(m).show();
    });
  }
  if (cardResume) {
    cardResume.addEventListener('click', () => {
      const m = document.getElementById('resume-modal');
      if (m && window.bootstrap) window.bootstrap.Modal.getOrCreateInstance(m).show();
    });
  }
  if (cardSkills) {
    cardSkills.addEventListener('click', () => {
      const m = document.getElementById('skills-modal');
      if (m && window.bootstrap) window.bootstrap.Modal.getOrCreateInstance(m).show();
    });
  }
}

/**
 * Windows 11 Built-in Apps: Terminal, Calculator, Notepad, Paint Studio
 */
function initBuiltInApps() {
  // =========================================================================
  // 1. TERMINAL APP (PowerShell)
  // =========================================================================
  const termBody = document.getElementById('terminal-body');
  const termInput = document.getElementById('terminal-input');
  const termModal = document.getElementById('terminal-modal');
  const termHistoryContainer = document.getElementById('terminal-history');

  if (termBody && termInput) {
    const cmdHistory = [];
    let historyIdx = -1;

    // Focus input when terminal modal opens
    if (termModal) {
      termModal.addEventListener('shown.bs.modal', () => {
        termInput.focus();
      });
    }

    termInput.addEventListener('keydown', (e) => {
      // Command history navigation (Up / Down arrows)
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (cmdHistory.length > 0) {
          if (historyIdx === -1) historyIdx = cmdHistory.length - 1;
          else if (historyIdx > 0) historyIdx--;
          termInput.value = cmdHistory[historyIdx] || '';
        }
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (cmdHistory.length > 0 && historyIdx !== -1) {
          if (historyIdx < cmdHistory.length - 1) {
            historyIdx++;
            termInput.value = cmdHistory[historyIdx] || '';
          } else {
            historyIdx = -1;
            termInput.value = '';
          }
        }
      } else if (e.key === 'Tab') {
        // Autocomplete support
        e.preventDefault();
        const val = termInput.value.trim().toLowerCase();
        const available = ['help', 'projects', 'resume', 'skills', 'contact', 'calc', 'paint', 'notepad', 'search', 'theme', 'whoami', 'date', 'clear', 'cls', 'matrix', 'weather', 'exit'];
        const match = available.find(c => c.startsWith(val));
        if (match) termInput.value = match;
      } else if (e.key === 'Enter') {
        const cmd = termInput.value.trim();
        termInput.value = '';
        historyIdx = -1;

        if (cmd) cmdHistory.push(cmd);

        // Print entered command line
        const line = document.createElement('div');
        line.className = 'mb-1';
        line.innerHTML = `<span class="terminal-prompt" style="color: #4ec9b0; font-weight: bold;">PS C:\\Users\\Charles\\Portfolio&gt;</span> <span style="color: #ffffff;">${escapeHtml(cmd)}</span>`;
        termBody.insertBefore(line, termInput.parentElement);

        const response = document.createElement('div');
        response.className = 'mb-2';
        response.style.color = '#9cdcfe';

        const lower = cmd.toLowerCase().trim();
        const parts = cmd.split(' ');
        const mainCmd = parts[0].toLowerCase();
        const arg = parts.slice(1).join(' ').trim();

        if (lower === 'help' || lower === '?') {
          response.innerHTML = `
            <div class="mb-1" style="color: #569cd6; font-weight: bold;">Windows PowerShell 10.0 [Developer Edition]</div>
            <table class="table-borderless text-nowrap" style="color: #cccccc; font-size: 12.5px; line-height: 1.6;">
              <tr><td style="color: #4ec9b0; width: 140px;">help / ?</td><td>Show available commands and usage</td></tr>
              <tr><td style="color: #4ec9b0;">projects / dir</td><td>List and open Projects File Explorer</td></tr>
              <tr><td style="color: #4ec9b0;">resume / cv</td><td>View and edit Curriculum Vitae</td></tr>
              <tr><td style="color: #4ec9b0;">skills</td><td>Inspect technical stack & proficiency</td></tr>
              <tr><td style="color: #4ec9b0;">contact</td><td>Open contact form and email client</td></tr>
              <tr><td style="color: #4ec9b0;">calc [expr]</td><td>Perform math (e.g. 'calc 45 * 12 + 8') or open app</td></tr>
              <tr><td style="color: #4ec9b0;">paint</td><td>Launch Paint creative drawing canvas</td></tr>
              <tr><td style="color: #4ec9b0;">notepad [text]</td><td>Launch Notepad text editor</td></tr>
              <tr><td style="color: #4ec9b0;">search [query]</td><td>Open Windows Global Search</td></tr>
              <tr><td style="color: #4ec9b0;">theme [dark|light]</td><td>Switch system theme mode</td></tr>
              <tr><td style="color: #4ec9b0;">whoami</td><td>Display active user and privileges</td></tr>
              <tr><td style="color: #4ec9b0;">date / time</td><td>Show current system timestamp</td></tr>
              <tr><td style="color: #4ec9b0;">echo [text]</td><td>Print text to console output</td></tr>
              <tr><td style="color: #4ec9b0;">matrix</td><td>Activate Matrix digital rain simulation</td></tr>
              <tr><td style="color: #4ec9b0;">weather</td><td>Display local London forecast widget</td></tr>
              <tr><td style="color: #4ec9b0;">history</td><td>View session command history</td></tr>
              <tr><td style="color: #4ec9b0;">cls / clear</td><td>Clear console terminal screen</td></tr>
              <tr><td style="color: #4ec9b0;">exit</td><td>Close terminal window</td></tr>
            </table>
          `;
        } else if (mainCmd === 'projects' || mainCmd === 'dir' || mainCmd === 'ls') {
          const btn = document.getElementById('desktop-projects-btn');
          if (btn) btn.click();
          response.textContent = 'Opening File Explorer: Projects Gallery...';
        } else if (mainCmd === 'resume' || mainCmd === 'cv') {
          const btn = document.getElementById('desktop-resume-btn');
          if (btn) btn.click();
          response.textContent = 'Opening Microsoft Edge Resume PDF Viewer...';
        } else if (mainCmd === 'skills') {
          const btn = document.getElementById('desktop-skills-btn');
          if (btn) btn.click();
          response.textContent = 'Opening System Settings: Technical Competencies...';
        } else if (mainCmd === 'contact') {
          const btn = document.getElementById('desktop-contact-btn');
          if (btn) btn.click();
          response.textContent = 'Opening Contact Dialogue...';
        } else if (mainCmd === 'paint') {
          const btn = document.getElementById('desktop-paint-btn');
          if (btn) btn.click();
          response.textContent = 'Opening Paint Studio...';
        } else if (mainCmd === 'notepad') {
          if (arg) {
            const ta = document.getElementById('notepad-textarea');
            if (ta) {
              ta.value = arg;
              ta.dispatchEvent(new Event('input'));
            }
          }
          const btn = document.getElementById('desktop-notepad-btn');
          if (btn) btn.click();
          response.textContent = 'Opening Notepad...';
        } else if (mainCmd === 'calc') {
          if (arg) {
            try {
              const res = safeEvalExpression(arg);
              response.innerHTML = `<span style="color: #4ec9b0;">Result:</span> <strong style="color: #ffffff;">${res}</strong>`;
            } catch (err) {
              response.style.color = '#ef4444';
              response.textContent = `Math Error: Invalid calculation '${arg}'`;
            }
          } else {
            const btn = document.getElementById('desktop-calculator-btn');
            if (btn) btn.click();
            response.textContent = 'Opening Calculator...';
          }
        } else if (mainCmd === 'search') {
          const searchModalEl = document.getElementById('search-modal');
          if (searchModalEl && window.bootstrap) {
            window.bootstrap.Modal.getOrCreateInstance(searchModalEl).show();
            if (arg) {
              const searchInp = document.getElementById('global-search-input');
              if (searchInp) {
                searchInp.value = arg;
                searchInp.dispatchEvent(new Event('input'));
              }
            }
          }
          response.textContent = `Searching for '${arg || 'apps'}'...`;
        } else if (mainCmd === 'theme') {
          if (arg === 'dark') {
            document.body.classList.add('dark-theme');
            localStorage.setItem('theme', 'dark');
            response.textContent = 'System theme switched to Dark mode.';
          } else if (arg === 'light') {
            document.body.classList.remove('dark-theme');
            localStorage.setItem('theme', 'light');
            response.textContent = 'System theme switched to Light mode.';
          } else {
            document.body.classList.toggle('dark-theme');
            const isDark = document.body.classList.contains('dark-theme');
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
            response.textContent = `System theme toggled to ${isDark ? 'Dark' : 'Light'} mode.`;
          }
        } else if (mainCmd === 'whoami') {
          response.innerHTML = `<span style="color: #4ec9b0;">DEV-PC\\Charles</span> (Built-in Administrator, Full Access)`;
        } else if (mainCmd === 'date' || mainCmd === 'time') {
          response.textContent = new Date().toLocaleString();
        } else if (mainCmd === 'echo') {
          response.textContent = arg;
        } else if (mainCmd === 'history') {
          response.innerHTML = cmdHistory.map((c, i) => `${i + 1}&nbsp;&nbsp;${escapeHtml(c)}`).join('<br>');
        } else if (mainCmd === 'weather') {
          response.innerHTML = `
            <pre style="color: #ffd700; margin: 0; font-family: inherit;">
   \\  /       London, United Kingdom
 _ /""\\ _     21°C • Partly Cloudy
   \\__/       Wind: 9 km/h | Humidity: 62%
   /  \\       Pressure: 1014 hPa
            </pre>
          `;
        } else if (mainCmd === 'matrix') {
          response.style.color = '#22c55e';
          response.innerHTML = `
            <div>Initializing Matrix Neuro-Link...</div>
            <div style="font-size: 11px; opacity: 0.8; letter-spacing: 2px;">
              01000011 01001000 01000001 01010010 01001100 01000101 01010011<br>
              01010111 01001001 01001110 01000100 01001111 01010111 01010011<br>
              01010000 01001111 01010010 01010100 01000110 01001111 01001100
            </div>
            <div style="color: #4ec9b0;">Wake up, Neo... The Matrix has you.</div>
          `;
        } else if (mainCmd === 'cls' || mainCmd === 'clear') {
          const lines = termBody.querySelectorAll('div:not(.d-flex):not(.text-secondary)');
          lines.forEach(l => l.remove());
          return;
        } else if (mainCmd === 'exit') {
          if (termModal && window.bootstrap) {
            const bs = window.bootstrap.Modal.getInstance(termModal);
            if (bs) bs.hide();
          }
          return;
        } else if (cmd === '') {
          return;
        } else {
          response.style.color = '#f87171';
          response.textContent = `'${cmd}' is not recognized as an internal or external command. Type 'help' for available commands.`;
        }

        termBody.insertBefore(response, termInput.parentElement);
        termBody.scrollTop = termBody.scrollHeight;
      }
    });
  }

  // =========================================================================
  // 2. CALCULATOR APP
  // =========================================================================
  const calcDisplay = document.getElementById('calc-display');
  const calcHistory = document.getElementById('calc-history');
  const calcBtns = document.querySelectorAll('.calc-btn');
  const calcMemBtns = document.querySelectorAll('.calc-mem-btn');
  const calcModal = document.getElementById('calculator-modal');

  if (calcDisplay && calcBtns.length > 0) {
    let currentInput = '0';
    let previousExpression = '';
    let memoryValue = 0;
    let shouldResetInput = false;

    function updateCalcUI() {
      calcDisplay.textContent = currentInput;
      if (calcHistory) {
        calcHistory.textContent = previousExpression || '\u00A0';
      }
    }

    function handleCalcInput(val) {
      if (val === 'C') {
        currentInput = '0';
        previousExpression = '';
        shouldResetInput = false;
      } else if (val === 'CE') {
        currentInput = '0';
        shouldResetInput = false;
      } else if (val === '⌫' || val === 'Backspace') {
        if (currentInput.length > 1 && currentInput !== 'Error') {
          currentInput = currentInput.slice(0, -1);
        } else {
          currentInput = '0';
        }
      } else if (val === '±') {
        if (currentInput !== '0' && currentInput !== 'Error') {
          currentInput = currentInput.startsWith('-') ? currentInput.slice(1) : '-' + currentInput;
        }
      } else if (val === '%') {
        const num = parseFloat(currentInput);
        if (!isNaN(num)) {
          currentInput = String(num / 100);
          shouldResetInput = true;
        }
      } else if (val === '1/x') {
        const num = parseFloat(currentInput);
        if (!isNaN(num) && num !== 0) {
          previousExpression = `1 / (${currentInput})`;
          currentInput = String(Number((1 / num).toFixed(8)));
          shouldResetInput = true;
        } else {
          currentInput = 'Error';
        }
      } else if (val === 'x²') {
        const num = parseFloat(currentInput);
        if (!isNaN(num)) {
          previousExpression = `sqr(${currentInput})`;
          currentInput = String(Number((num * num).toFixed(8)));
          shouldResetInput = true;
        }
      } else if (val === '√') {
        const num = parseFloat(currentInput);
        if (!isNaN(num) && num >= 0) {
          previousExpression = `√(${currentInput})`;
          currentInput = String(Number(Math.sqrt(num).toFixed(8)));
          shouldResetInput = true;
        } else {
          currentInput = 'Error';
        }
      } else if (val === '=') {
        try {
          const fullExpr = previousExpression + ' ' + currentInput;
          const result = safeEvalExpression(fullExpr);
          previousExpression = fullExpr + ' =';
          currentInput = result;
          shouldResetInput = true;
        } catch (e) {
          currentInput = 'Error';
          shouldResetInput = true;
        }
      } else if (['+', '−', '-', '×', '*', '÷', '/'].includes(val)) {
        const normalizedOp = val === '*' ? '×' : (val === '/' ? '÷' : (val === '-' ? '−' : val));
        try {
          if (previousExpression && !previousExpression.endsWith('=')) {
            const running = safeEvalExpression(previousExpression + ' ' + currentInput);
            previousExpression = `${running} ${normalizedOp}`;
            currentInput = running;
          } else {
            previousExpression = `${currentInput} ${normalizedOp}`;
          }
          shouldResetInput = true;
        } catch (e) {
          previousExpression = `${currentInput} ${normalizedOp}`;
          shouldResetInput = true;
        }
      } else if (val === '.') {
        if (shouldResetInput) {
          currentInput = '0.';
          shouldResetInput = false;
        } else if (!currentInput.includes('.')) {
          currentInput += '.';
        }
      } else if (/^\d$/.test(val)) {
        if (currentInput === '0' || shouldResetInput || currentInput === 'Error') {
          currentInput = val;
          shouldResetInput = false;
        } else {
          currentInput += val;
        }
      }

      updateCalcUI();
    }

    // Button clicks
    calcBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const key = btn.dataset.key || btn.textContent.trim();
        handleCalcInput(key);
      });
    });

    // Memory operations
    calcMemBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const mem = btn.dataset.mem;
        const current = parseFloat(currentInput) || 0;
        if (mem === 'MC') {
          memoryValue = 0;
          showNotificationToast('Calculator', 'Memory Cleared (MC)', 'bi-calculator');
        } else if (mem === 'MR') {
          currentInput = String(memoryValue);
          shouldResetInput = true;
          updateCalcUI();
        } else if (mem === 'M+') {
          memoryValue += current;
          showNotificationToast('Calculator', `Memory Added: ${memoryValue}`, 'bi-calculator');
        } else if (mem === 'M-') {
          memoryValue -= current;
          showNotificationToast('Calculator', `Memory Subtracted: ${memoryValue}`, 'bi-calculator');
        } else if (mem === 'MS') {
          memoryValue = current;
          showNotificationToast('Calculator', `Memory Stored: ${memoryValue}`, 'bi-calculator');
        }
      });
    });

    // Physical Keyboard Listener when calculator modal is open
    document.addEventListener('keydown', (e) => {
      if (!calcModal || !calcModal.classList.contains('show')) return;
      if (['input', 'textarea'].includes(document.activeElement.tagName.toLowerCase())) return;

      if (/^[0-9]$/.test(e.key)) {
        handleCalcInput(e.key);
      } else if (e.key === '+') {
        handleCalcInput('+');
      } else if (e.key === '-') {
        handleCalcInput('−');
      } else if (e.key === '*') {
        handleCalcInput('×');
      } else if (e.key === '/') {
        e.preventDefault();
        handleCalcInput('÷');
      } else if (e.key === 'Enter' || e.key === '=') {
        e.preventDefault();
        handleCalcInput('=');
      } else if (e.key === 'Backspace') {
        handleCalcInput('⌫');
      } else if (e.key === 'Escape') {
        handleCalcInput('C');
      } else if (e.key === '.') {
        handleCalcInput('.');
      } else if (e.key === '%') {
        handleCalcInput('%');
      }
    });
  }

  // =========================================================================
  // 3. NOTEPAD APP
  // =========================================================================
  const notepadText = document.getElementById('notepad-textarea');
  const notepadStats = document.getElementById('notepad-stats');
  const notepadSaveBtn = document.getElementById('notepad-save-btn');
  const notepadClearBtn = document.getElementById('notepad-clear-btn');
  const notepadNewBtn = document.getElementById('notepad-new-btn');
  const notepadFileInput = document.getElementById('notepad-file-input');
  const notepadWrapBtn = document.getElementById('notepad-wrap-btn');
  const notepadFontInc = document.getElementById('notepad-font-inc');
  const notepadFontDec = document.getElementById('notepad-font-dec');
  const notepadZoomStatus = document.getElementById('notepad-zoom-status');
  const notepadTitle = document.getElementById('notepad-filename-title');

  if (notepadText) {
    let currentFontSize = 13.5;
    let isWordWrap = true;

    // Load from storage
    notepadText.value = localStorage.getItem('notepad-content') || 
      `Windows 11 Developer Notepad\n----------------------------\nName: Charles Adeosun\nRole: ICT Developer & Student\nLocation: London, United Kingdom\n\nNotes / Scratchpad:\n- Responsive Bootstrap 5 desktop layout\n- Interactive Command-Line Terminal\n- Full arithmetic Calculator with memory & keyboard support\n- Paint Studio with shapes, stroke sizes, and undo\n- Global system search flyout with quick application launcher`;

    function updateNotepadStats() {
      const text = notepadText.value;
      const lines = text.split('\n').length;
      const chars = text.length;
      const words = text.trim() ? text.trim().split(/\s+/).length : 0;
      if (notepadStats) {
        notepadStats.textContent = `Ln ${lines}, Col ${chars} | ${words} words, ${chars} chars`;
      }
      localStorage.setItem('notepad-content', text);
    }

    updateNotepadStats();
    notepadText.addEventListener('input', updateNotepadStats);

    // Support Tab key indentation inside textarea
    notepadText.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        e.preventDefault();
        const start = notepadText.selectionStart;
        const end = notepadText.selectionEnd;
        notepadText.value = notepadText.value.substring(0, start) + '  ' + notepadText.value.substring(end);
        notepadText.selectionStart = notepadText.selectionEnd = start + 2;
        updateNotepadStats();
      }
    });

    // New Note
    if (notepadNewBtn) {
      notepadNewBtn.addEventListener('click', () => {
        notepadText.value = '';
        if (notepadTitle) notepadTitle.textContent = 'Untitled - Notepad';
        updateNotepadStats();
        notepadText.focus();
      });
    }

    // Open File via file input
    if (notepadFileInput) {
      notepadFileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (event) => {
            notepadText.value = event.target.result;
            if (notepadTitle) notepadTitle.textContent = `${file.name} - Notepad`;
            updateNotepadStats();
            showNotificationToast('Notepad', `Loaded file: ${file.name}`, 'bi-file-earmark-text-fill');
          };
          reader.readAsText(file);
        }
      });
    }

    // Save Note
    if (notepadSaveBtn) {
      notepadSaveBtn.addEventListener('click', () => {
        const blob = new Blob([notepadText.value], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'Note.txt';
        a.click();
        URL.revokeObjectURL(url);
        showNotificationToast('Notepad', 'File saved as Note.txt', 'bi-file-text-fill');
      });
    }

    // Clear
    if (notepadClearBtn) {
      notepadClearBtn.addEventListener('click', () => {
        notepadText.value = '';
        updateNotepadStats();
      });
    }

    // Word Wrap Toggle
    if (notepadWrapBtn) {
      notepadWrapBtn.addEventListener('click', () => {
        isWordWrap = !isWordWrap;
        notepadText.style.whiteSpace = isWordWrap ? 'pre-wrap' : 'pre';
        notepadWrapBtn.innerHTML = `<i class="bi bi-text-wrap me-1"></i> Wrap: ${isWordWrap ? 'ON' : 'OFF'}`;
      });
    }

    // Font Sizing
    if (notepadFontInc) {
      notepadFontInc.addEventListener('click', () => {
        currentFontSize = Math.min(26, currentFontSize + 2);
        notepadText.style.fontSize = `${currentFontSize}px`;
        if (notepadZoomStatus) notepadZoomStatus.textContent = `${Math.round((currentFontSize / 13.5) * 100)}%`;
      });
    }
    if (notepadFontDec) {
      notepadFontDec.addEventListener('click', () => {
        currentFontSize = Math.max(10, currentFontSize - 2);
        notepadText.style.fontSize = `${currentFontSize}px`;
        if (notepadZoomStatus) notepadZoomStatus.textContent = `${Math.round((currentFontSize / 13.5) * 100)}%`;
      });
    }
  }

  // =========================================================================
  // 4. PAINT STUDIO APP
  // =========================================================================
  const paintCanvas = document.getElementById('paint-canvas');
  const paintModal = document.getElementById('paint-modal');
  const paintClearBtn = document.getElementById('paint-clear-btn');
  const paintColorPicker = document.getElementById('paint-color-picker');
  const paintSizePicker = document.getElementById('paint-size-picker');
  const paintSaveBtn = document.getElementById('paint-save-btn');
  const paintUndoBtn = document.getElementById('paint-undo-btn');
  const paintToolBtns = document.querySelectorAll('.paint-tool-btn');
  const paintSwatches = document.querySelectorAll('.paint-color-swatch');
  const paintCursorPos = document.getElementById('paint-cursor-pos');

  if (paintCanvas) {
    const ctx = paintCanvas.getContext('2d');
    let isDrawing = false;
    let currentTool = 'brush';
    let currentColor = '#000000';
    let currentSize = 4;
    let startX = 0;
    let startY = 0;
    let snapshot = null;
    const undoStack = [];

    // Initialize white background
    function initCanvasBackground() {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, paintCanvas.width, paintCanvas.height);
      saveUndoState();
    }

    function saveUndoState() {
      if (undoStack.length >= 20) undoStack.shift();
      undoStack.push(ctx.getImageData(0, 0, paintCanvas.width, paintCanvas.height));
    }

    initCanvasBackground();

    // Ensure canvas stays sharp on modal show
    if (paintModal) {
      paintModal.addEventListener('shown.bs.modal', () => {
        const rect = paintCanvas.getBoundingClientRect();
        if (paintCursorPos) {
          paintCursorPos.textContent = `Canvas: ${paintCanvas.width} x ${paintCanvas.height} px`;
        }
      });
    }

    // Tool selection
    paintToolBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        paintToolBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentTool = btn.dataset.tool || 'brush';
      });
    });

    // Swatches
    paintSwatches.forEach(swatch => {
      swatch.addEventListener('click', () => {
        paintSwatches.forEach(s => s.classList.remove('active'));
        swatch.classList.add('active');
        currentColor = swatch.dataset.color || '#000000';
        if (paintColorPicker) paintColorPicker.value = currentColor;
      });
    });

    if (paintColorPicker) {
      paintColorPicker.addEventListener('input', (e) => {
        currentColor = e.target.value;
        paintSwatches.forEach(s => s.classList.remove('active'));
      });
    }

    if (paintSizePicker) {
      paintSizePicker.addEventListener('change', (e) => {
        currentSize = parseInt(e.target.value, 10) || 4;
      });
    }

    function getCanvasCoordinates(e) {
      const rect = paintCanvas.getBoundingClientRect();
      const scaleX = paintCanvas.width / rect.width;
      const scaleY = paintCanvas.height / rect.height;

      const clientX = e.clientX !== undefined ? e.clientX : (e.touches && e.touches[0] ? e.touches[0].clientX : 0);
      const clientY = e.clientY !== undefined ? e.clientY : (e.touches && e.touches[0] ? e.touches[0].clientY : 0);

      return {
        x: (clientX - rect.left) * scaleX,
        y: (clientY - rect.top) * scaleY
      };
    }

    function startDraw(e) {
      isDrawing = true;
      const coords = getCanvasCoordinates(e);
      startX = coords.x;
      startY = coords.y;

      ctx.lineWidth = currentSize;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.strokeStyle = currentTool === 'eraser' ? '#ffffff' : currentColor;
      ctx.fillStyle = currentColor;

      snapshot = ctx.getImageData(0, 0, paintCanvas.width, paintCanvas.height);

      if (currentTool === 'brush' || currentTool === 'eraser') {
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(startX, startY);
        ctx.stroke();
      }
    }

    function draw(e) {
      if (!isDrawing) return;
      const coords = getCanvasCoordinates(e);

      if (currentTool === 'brush' || currentTool === 'eraser') {
        ctx.strokeStyle = currentTool === 'eraser' ? '#ffffff' : currentColor;
        ctx.lineWidth = currentTool === 'eraser' ? currentSize * 2 : currentSize;
        ctx.lineTo(coords.x, coords.y);
        ctx.stroke();
      } else {
        // Restore snapshot for live shape preview
        ctx.putImageData(snapshot, 0, 0);

        if (currentTool === 'line') {
          ctx.beginPath();
          ctx.moveTo(startX, startY);
          ctx.lineTo(coords.x, coords.y);
          ctx.stroke();
        } else if (currentTool === 'rect') {
          ctx.strokeRect(startX, startY, coords.x - startX, coords.y - startY);
        } else if (currentTool === 'circle') {
          const radius = Math.sqrt(Math.pow(coords.x - startX, 2) + Math.pow(coords.y - startY, 2));
          ctx.beginPath();
          ctx.arc(startX, startY, radius, 0, 2 * Math.PI);
          ctx.stroke();
        }
      }
    }

    function endDraw() {
      if (isDrawing) {
        isDrawing = false;
        ctx.beginPath();
        saveUndoState();
      }
    }

    // Mouse Listeners
    paintCanvas.addEventListener('mousedown', startDraw);
    paintCanvas.addEventListener('mousemove', draw);
    paintCanvas.addEventListener('mouseup', endDraw);
    paintCanvas.addEventListener('mouseleave', endDraw);

    // Touch Listeners
    paintCanvas.addEventListener('touchstart', (e) => {
      e.preventDefault();
      startDraw(e);
    }, { passive: false });

    paintCanvas.addEventListener('touchmove', (e) => {
      e.preventDefault();
      draw(e);
    }, { passive: false });

    paintCanvas.addEventListener('touchend', (e) => {
      e.preventDefault();
      endDraw();
    }, { passive: false });

    // Undo
    if (paintUndoBtn) {
      paintUndoBtn.addEventListener('click', () => {
        if (undoStack.length > 1) {
          undoStack.pop(); // Remove current
          const prevState = undoStack[undoStack.length - 1];
          ctx.putImageData(prevState, 0, 0);
        }
      });
    }

    // Clear
    if (paintClearBtn) {
      paintClearBtn.addEventListener('click', () => {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, paintCanvas.width, paintCanvas.height);
        saveUndoState();
      });
    }

    // Save PNG
    if (paintSaveBtn) {
      paintSaveBtn.addEventListener('click', () => {
        const link = document.createElement('a');
        link.download = 'MyDrawing.png';
        link.href = paintCanvas.toDataURL('image/png');
        link.click();
        showNotificationToast('Paint Studio', 'Canvas drawing exported as MyDrawing.png', 'bi-palette-fill');
      });
    }
  }
}

/**
 * Safe Mathematical Expression Evaluator (No eval or Function constructor)
 */
function safeEvalExpression(expr) {
  if (!expr) return '0';
  let sanitized = String(expr)
    .replace(/×/g, '*')
    .replace(/÷/g, '/')
    .replace(/−/g, '-')
    .replace(/sqr\(([^)]+)\)/g, '($1 * $1)')
    .replace(/√\(([^)]+)\)/g, 'Math.sqrt($1)')
    .trim();

  // Tokenize numbers and operators
  const tokens = sanitized.match(/-?\d+(\.\d+)?|[+\-*/]/g);
  if (!tokens) return '0';

  // Pass 1: Multiplication and Division
  const pass1 = [];
  let idx = 0;
  while (idx < tokens.length) {
    const t = tokens[idx];
    if (t === '*' || t === '/') {
      const prev = parseFloat(pass1.pop());
      const next = parseFloat(tokens[idx + 1]);
      if (isNaN(prev) || isNaN(next)) throw new Error('Invalid expression');
      const res = t === '*' ? prev * next : (next !== 0 ? prev / next : 0);
      pass1.push(res);
      idx += 2;
    } else {
      pass1.push(t);
      idx++;
    }
  }

  // Pass 2: Addition and Subtraction
  let total = parseFloat(pass1[0]);
  if (isNaN(total)) throw new Error('Invalid expression');
  let j = 1;
  while (j < pass1.length) {
    const op = pass1[j];
    const nextNum = parseFloat(pass1[j + 1]);
    if (isNaN(nextNum)) throw new Error('Invalid expression');
    if (op === '+') total += nextNum;
    else if (op === '-') total -= nextNum;
    j += 2;
  }

  return isFinite(total) ? String(Number(total.toFixed(8))) : 'Error';
}

function escapeHtml(str) {
  return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}



