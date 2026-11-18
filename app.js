// ==============================================================
// VERSELY — app.js
// Modern Poetry Canvas Workspace & Creative Studio
// Interactive Drag-and-Drop Text Box System with Grouping & Delete
// ==============================================================

document.addEventListener('DOMContentLoaded', () => {

  // ------------------------------------------------------------
  // DOM Elements
  // ------------------------------------------------------------
  const landingView = document.getElementById('landing-view');
  const canvasView = document.getElementById('canvas-view');
  const letsCreateBtn = document.getElementById('lets-create-btn');
  const writeVerseBtn = document.getElementById('write-verse-btn');
  const canvasLogoBtn = document.getElementById('canvas-logo-btn');
  const btnExitCanvas = document.getElementById('btn-exit-canvas');
  const btnNewCanvas = document.getElementById('btn-new-canvas');

  // Breadcrumbs & Canvas Container
  const breadcrumbTitle = document.getElementById('breadcrumb-title');
  const breadcrumbFormText = document.getElementById('breadcrumb-form-text');
  const canvasCard = document.getElementById('canvas-card');
  const canvasContent = document.getElementById('canvas-content');
  const canvasBgLayer = document.getElementById('canvas-bg-layer');
  const canvasOverlayLayer = document.getElementById('canvas-overlay-layer');
  const workspace = document.getElementById('canvas-workspace');

  // Toolbar & Creation Buttons
  const btnAddTextbox = document.getElementById('btn-add-textbox');
  const btnAddHeading = document.getElementById('btn-add-heading');
  const btnAddStanza = document.getElementById('btn-add-stanza');
  const btnSidebarAddText = document.getElementById('btn-sidebar-add-text');
  const btnGroupToggle = document.getElementById('btn-group-toggle');
  const btnGroupText = document.getElementById('btn-group-text');

  // Stats
  const statLines = document.getElementById('stat-lines');
  const statWords = document.getElementById('stat-words');
  const statSyllables = document.getElementById('stat-syllables');

  // Left Drawer
  const sidebarLeft = document.getElementById('canvas-sidebar-left');
  const btnToggleSidebar = document.getElementById('btn-toggle-sidebar');
  const formNavItems = document.querySelectorAll('.sidebar-nav-item');
  const btnMuseSpark = document.getElementById('btn-muse-spark');
  const musePromptText = document.getElementById('muse-prompt-text');
  const btnSidebarCopy = document.getElementById('btn-sidebar-copy');
  const btnSidebarDownloadTxt = document.getElementById('btn-sidebar-download-txt');
  const btnSidebarClear = document.getElementById('btn-sidebar-clear');

  // Bottom Canvas Controls
  const btnCanvasSave = document.getElementById('btn-canvas-save');
  const saveBtnText = document.getElementById('save-btn-text');
  const btnCanvasFullscreen = document.getElementById('btn-canvas-fullscreen');

  // Right Accordion Panels
  const accordionPanels = document.querySelectorAll('.accordion-panel');
  const selectFont = document.getElementById('select-font');
  const sliderFontSize = document.getElementById('slider-font-size');
  const valFontSize = document.getElementById('val-font-size');
  const sliderLineHeight = document.getElementById('slider-line-height');
  const valLineHeight = document.getElementById('val-line-height');
  const alignButtons = document.querySelectorAll('.btn-align');

  // Background Adjustments
  const bgModeTabs = document.querySelectorAll('.bg-tab');
  const bgThumbButtons = document.querySelectorAll('.bg-thumb-btn');
  const userBgFileInput = document.getElementById('user-bg-file-input');
  const activeBgLabel = document.getElementById('active-bg-label');
  const sliderBgOverlay = document.getElementById('slider-bg-overlay');
  const valBgOverlay = document.getElementById('val-bg-overlay');
  const sliderBgBlur = document.getElementById('slider-bg-blur');
  const valBgBlur = document.getElementById('val-bg-blur');

  // Media & Sound
  const ambianceButtons = document.querySelectorAll('.btn-ambiance');
  const ambianceControls = document.getElementById('ambiance-controls');
  const btnSoundPlay = document.getElementById('btn-sound-play');
  const sliderSoundVol = document.getElementById('slider-sound-vol');



  // Export Modal & Toast
  const btnExportTrigger = document.getElementById('btn-export-trigger');
  const exportModal = document.getElementById('export-modal');
  const btnCloseExport = document.getElementById('btn-close-export');
  const btnExportImageCard = document.getElementById('btn-export-image-card');
  const btnExportTextFile = document.getElementById('btn-export-text-file');
  const btnExportCopyClipboard = document.getElementById('btn-export-copy-clipboard');
  const toastNotification = document.getElementById('toast-notification');

  // ------------------------------------------------------------
  // State
  // ------------------------------------------------------------
  let activeBackground = 'dotgrid';
  let customBgDataUrl = null;
  let activeAudio = null;
  let audioContext = null;
  let audioGainNode = null;
  let isPlayingSound = false;
  let activeSoundType = null;

  // Selected Text Boxes (Supports Multi-Select & Grouping)
  let selectedTextBoxes = [];
  let boxCounter = 0;

  // Dragging & Resizing State
  let isDragging = false;
  let isResizing = false;
  let dragTarget = null;
  let dragStartX = 0;
  let dragStartY = 0;
  let dragInitialPositions = [];
  let initialWidth = 0;

  // Prompts for The Muse
  const musePrompts = [
    '"Write of an autumn leaf that refused to fall until the first star appeared."',
    '"Describe a silence so heavy it pressed fingerprints onto the air."',
    '"Write about a letter left unopened beneath an old wooden floorboard."',
    '"Capture the taste of a memory you haven\'t lived yet."',
    '"Tell the story of two lighthouses talking across a stormy sea."',
    '"Write a confession disguised as an observation about the weather."',
    '"Describe an hour that felt wider than the day it lived in."',
    '"Speak to the version of you that stayed behind at the train station."'
  ];



  // Pre-scaffolded Templates
  const poetryTemplates = {
    'haiku': {
      title: 'Echoes of Spring',
      form: 'Haiku',
      boxes: [
        {
          x: 60,
          y: 40,
          width: 480,
          fontSize: '32px',
          fontFamily: "'Dancing Script', cursive",
          isHeading: true,
          content: 'Echoes of Spring'
        },
        {
          x: 60,
          y: 110,
          width: 500,
          fontSize: '22px',
          fontFamily: "'Dancing Script', cursive",
          content: `Green leaves drink the dawn,\nSoft wind through the quiet trees,\nNothing left to say.`
        }
      ]
    },
    'sonnet': {
      title: 'Sonnet of the Quiet Hours',
      form: 'Sonnet',
      boxes: [
        {
          x: 60,
          y: 35,
          width: 540,
          fontSize: '30px',
          fontFamily: "'Playfair Display', Georgia, serif",
          isHeading: true,
          content: 'Sonnet of the Quiet Hours'
        },
        {
          x: 60,
          y: 95,
          width: 620,
          fontSize: '18px',
          fontFamily: "'EB Garamond', Georgia, serif",
          content: `When evening draws its veil across the skies,
And restless whispers fade into the deep,
A sudden stillness falls on weary eyes,
Before the quiet world resigns to sleep.

The shadows lengthen on the study floor,
Where ink and parchment keep a gentle truce,
A memory knocks gently at the door,
And unmade vows find pardon and excuse.

No grand trumpet sounds the closing day,
Just stars that bloom like embers in the frost,
A silver silence guides the drift away,
To reckon all the little moments lost.

So let the dark take back what daylight knew,
And leave the night to dreams, and dreams to you.`
        }
      ]
    },
    'limerick': {
      title: 'A Wandering Pen',
      form: 'Limerick',
      boxes: [
        {
          x: 60,
          y: 40,
          width: 460,
          fontSize: '28px',
          fontFamily: "'Playfair Display', Georgia, serif",
          isHeading: true,
          content: 'A Wandering Pen'
        },
        {
          x: 60,
          y: 100,
          width: 480,
          fontSize: '20px',
          fontFamily: "'Playfair Display', Georgia, serif",
          content: `There once was a writer of verse,
Whose rhythms were delightfully terse.
With a quill in his hand,
He would sketch on the sand,
And praise every stanza rehearse!`
        }
      ]
    },
    'couplets': {
      title: 'Two By Two',
      form: 'Couplets',
      boxes: [
        {
          x: 60,
          y: 40,
          width: 460,
          fontSize: '28px',
          fontFamily: "'Playfair Display', Georgia, serif",
          isHeading: true,
          content: 'Two By Two'
        },
        {
          x: 60,
          y: 100,
          width: 520,
          fontSize: '20px',
          fontFamily: "'Playfair Display', Georgia, serif",
          content: `The river knows the secret of the stone,
And carries wisdom that was once unknown.

The candlelight will flicker in the chill,
While all the sleeping houses slumber still.`
        }
      ]
    },
    'free-verse': {
      title: 'Whisper your soul',
      form: 'Free Verse',
      boxes: [
        {
          x: 60,
          y: 40,
          width: 480,
          fontSize: '32px',
          fontFamily: "'Playfair Display', Georgia, serif",
          isHeading: true,
          content: 'Whisper your soul'
        },
        {
          x: 60,
          y: 110,
          width: 540,
          fontSize: '20px',
          fontFamily: "'Playfair Display', Georgia, serif",
          content: `The autumn wind carries the scent of cedar and old paper.
A quiet room,
a sudden thought,
and suddenly the world makes a little more sense.`
        }
      ]
    }
  };

  // ------------------------------------------------------------
  // Toast Helper
  // ------------------------------------------------------------
  function showToast(message) {
    if (!toastNotification) return;
    toastNotification.textContent = message;
    toastNotification.classList.add('show');
    setTimeout(() => {
      toastNotification.classList.remove('show');
    }, 2400);
  }

  // ------------------------------------------------------------
  // Navigation Transitions (Landing <-> Canvas)
  // ------------------------------------------------------------
  function openCanvasView() {
    landingView.classList.add('fade-out');
    setTimeout(() => {
      landingView.classList.add('hidden');
      landingView.classList.remove('fade-out');
      canvasView.classList.remove('hidden');
      loadSavedDraft();
      updateMetrics();
    }, 200);
  }

  function returnToLanding() {
    canvasView.classList.add('hidden');
    landingView.classList.remove('hidden');
    stopAmbianceSound();
  }

  if (letsCreateBtn) {
    letsCreateBtn.addEventListener('click', (e) => {
      e.preventDefault();
      openCanvasView();
    });
  }

  if (writeVerseBtn) {
    writeVerseBtn.addEventListener('click', (e) => {
      e.preventDefault();
      openCanvasView();
    });
  }

  if (canvasLogoBtn) canvasLogoBtn.addEventListener('click', returnToLanding);
  if (btnExitCanvas) btnExitCanvas.addEventListener('click', returnToLanding);

  // ------------------------------------------------------------
  // Interactive Text Box Engine (Multi-Select, Grouping, Dragging)
  // ------------------------------------------------------------

  function createTextBox(options = {}) {
    removeEmptyState();

    boxCounter++;
    const id = options.id || `tb-${Date.now()}-${boxCounter}`;
    const x = options.x !== undefined ? options.x : 60;
    const y = options.y !== undefined ? options.y : Math.min(60 + (boxCounter - 1) * 70, 360);
    const width = options.width || (options.isHeading ? 480 : 420);
    const fontSize = options.fontSize || (options.isHeading ? '30px' : (sliderFontSize ? `${sliderFontSize.value}px` : '20px'));
    const fontFamily = options.fontFamily || (selectFont ? selectFont.value : "'Playfair Display', Georgia, serif");
    const textAlign = options.textAlign || 'left';
    const content = options.content !== undefined ? options.content : '';
    const isHeading = !!options.isHeading;
    const placeholder = options.placeholder || (isHeading ? 'Poem title…' : 'Write your verse here…');
    const groupId = options.groupId || null;

    const box = document.createElement('div');
    box.className = `canvas-text-box ${isHeading ? 'is-heading' : ''} ${groupId ? 'is-grouped' : ''}`;
    box.id = id;
    if (groupId) box.dataset.groupId = groupId;

    box.style.left = `${x}px`;
    box.style.top = `${y}px`;
    box.style.width = `${width}px`;
    box.style.fontFamily = fontFamily;
    box.style.fontSize = fontSize;
    box.style.textAlign = textAlign;

    // Mini Floating Toolbar
    const toolbar = document.createElement('div');
    toolbar.className = 'text-box-toolbar';
    updateToolbarContent(toolbar, groupId);

    // Editable Surface
    const editor = document.createElement('div');
    editor.className = 'text-box-editor';
    editor.contentEditable = 'true';
    editor.spellcheck = false;
    editor.setAttribute('data-placeholder', placeholder);
    editor.innerText = content;

    // Resize Handle
    const resizeHandle = document.createElement('div');
    resizeHandle.className = 'text-box-resize-handle';
    resizeHandle.title = 'Drag to resize width';

    box.appendChild(toolbar);
    box.appendChild(editor);
    box.appendChild(resizeHandle);
    canvasContent.appendChild(box);

    // Event Handlers
    setupBoxEvents(box, editor, toolbar, resizeHandle);

    selectTextBox(box, false);
    updateMetrics();
    saveDraftLocal();

    return box;
  }

  function updateToolbarContent(toolbar, groupId) {
    toolbar.innerHTML = `
      <div class="text-box-drag-handle" title="Click and drag to move (Group moves together)">
        <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
          <circle cx="8" cy="6" r="2"/><circle cx="16" cy="6" r="2"/>
          <circle cx="8" cy="12" r="2"/><circle cx="16" cy="12" r="2"/>
          <circle cx="8" cy="18" r="2"/><circle cx="16" cy="18" r="2"/>
        </svg>
        <span>Move</span>
      </div>
      ${groupId ? '<span class="tb-badge-group" title="Grouped (Ctrl+G to ungroup)">🔗 Group</span>' : ''}
      <div class="tb-divider"></div>
      <button class="tb-btn tb-btn-dup" title="Duplicate box">⧉</button>
      <button class="tb-btn tb-btn-del" title="Delete box (or press Delete key)">🗑</button>
    `;
  }

  function setupBoxEvents(box, editor, toolbar, resizeHandle) {
    box.addEventListener('mousedown', (e) => {
      // Direct toolbar buttons
      if (e.target.closest('.tb-btn-del')) {
        e.stopPropagation();
        deleteSelectedBoxes([box]);
        return;
      }
      if (e.target.closest('.tb-btn-dup')) {
        e.stopPropagation();
        duplicateTextBox(box);
        return;
      }

      // Resize handle
      if (e.target === resizeHandle) {
        e.stopPropagation();
        startResizing(box, e);
        return;
      }

      // Check for multi-select modifier (Ctrl, Cmd, Shift)
      const isMulti = e.ctrlKey || e.metaKey || e.shiftKey;

      // Drag handle or border click
      const isDragTarget = e.target.closest('.text-box-drag-handle') || (e.target === box && !e.target.closest('.text-box-editor'));

      selectTextBox(box, isMulti);

      if (isDragTarget) {
        e.stopPropagation();
        startDragging(box, e);
        return;
      }

      // If clicked inside editor, keep selection and allow typing
      e.stopPropagation();
    });

    // Editor input events
    editor.addEventListener('input', () => {
      updateMetrics();
      syncBreadcrumbFromBoxes();
      saveDraftLocal();
    });

    // Keydown inside editor
    editor.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        deselectAll();
      } else if (e.key === 'Backspace' && editor.innerText.trim() === '') {
        // If empty backspace, remove box
        e.preventDefault();
        deleteSelectedBoxes([box]);
      } else if (e.key === 'Delete' && editor.innerText.trim() === '') {
        e.preventDefault();
        deleteSelectedBoxes([box]);
      }
    });
  }

  // ------------------------------------------------------------
  // Selection & Grouping Logic
  // ------------------------------------------------------------
  function selectTextBox(box, isMulti = false) {
    const groupId = box.dataset.groupId;

    if (isMulti) {
      // Toggle selection for this box (or its group)
      if (selectedTextBoxes.includes(box)) {
        if (groupId) {
          const groupBoxes = Array.from(canvasContent.querySelectorAll(`.canvas-text-box[data-group-id="${groupId}"]`));
          groupBoxes.forEach(b => {
            b.classList.remove('selected');
            selectedTextBoxes = selectedTextBoxes.filter(item => item !== b);
          });
        } else {
          box.classList.remove('selected');
          selectedTextBoxes = selectedTextBoxes.filter(item => item !== box);
        }
      } else {
        if (groupId) {
          const groupBoxes = Array.from(canvasContent.querySelectorAll(`.canvas-text-box[data-group-id="${groupId}"]`));
          groupBoxes.forEach(b => {
            b.classList.add('selected');
            if (!selectedTextBoxes.includes(b)) selectedTextBoxes.push(b);
          });
        } else {
          box.classList.add('selected');
          selectedTextBoxes.push(box);
        }
      }
    } else {
      // Single selection: if box has groupId, select whole group!
      if (groupId) {
        deselectAll();
        const groupBoxes = Array.from(canvasContent.querySelectorAll(`.canvas-text-box[data-group-id="${groupId}"]`));
        groupBoxes.forEach(b => {
          b.classList.add('selected');
          selectedTextBoxes.push(b);
          canvasContent.appendChild(b);
        });
      } else {
        if (!selectedTextBoxes.includes(box) || selectedTextBoxes.length <= 1) {
          deselectAll();
          selectedTextBoxes = [box];
          box.classList.add('selected');
          canvasContent.appendChild(box);
        }
      }
    }

    updateGroupButtonState();

    // Sync Right Settings Accordion to active box
    if (box) {
      if (selectFont && box.style.fontFamily) selectFont.value = box.style.fontFamily;
      if (sliderFontSize && box.style.fontSize) {
        const px = parseInt(box.style.fontSize) || 20;
        sliderFontSize.value = px;
        if (valFontSize) valFontSize.textContent = `${px}px`;
      }
      if (alignButtons && box.style.textAlign) {
        const align = box.style.textAlign || 'left';
        alignButtons.forEach(b => {
          if (b.getAttribute('data-align') === align) b.classList.add('active');
          else b.classList.remove('active');
        });
      }
    }
  }

  function deselectAll() {
    selectedTextBoxes.forEach(b => b.classList.remove('selected'));
    selectedTextBoxes = [];
    updateGroupButtonState();
  }

  function updateGroupButtonState() {
    if (!btnGroupText) return;
    if (selectedTextBoxes.length >= 2) {
      const allSameGroup = selectedTextBoxes.every(b => b.dataset.groupId && b.dataset.groupId === selectedTextBoxes[0].dataset.groupId);
      btnGroupText.textContent = allSameGroup ? '🔓 Ungroup (Ctrl+G)' : '🔗 Group (Ctrl+G)';
    } else if (selectedTextBoxes.length === 1 && selectedTextBoxes[0].dataset.groupId) {
      btnGroupText.textContent = '🔓 Ungroup (Ctrl+G)';
    } else {
      btnGroupText.textContent = '🔗 Group (Ctrl+G)';
    }
  }

  function groupSelectedBoxes() {
    if (selectedTextBoxes.length < 2) {
      if (selectedTextBoxes.length === 1 && selectedTextBoxes[0].dataset.groupId) {
        ungroupSelectedBoxes();
        return;
      }
      showToast('Select 2 or more text boxes to group (Hold Ctrl + Click)');
      return;
    }

    const groupId = `grp-${Date.now()}`;
    selectedTextBoxes.forEach(box => {
      box.dataset.groupId = groupId;
      box.classList.add('is-grouped');
      const tb = box.querySelector('.text-box-toolbar');
      if (tb) updateToolbarContent(tb, groupId);
    });

    updateGroupButtonState();
    showToast(`Grouped ${selectedTextBoxes.length} text boxes 🔗 (Ctrl+G)`);
    saveDraftLocal();
  }

  function ungroupSelectedBoxes() {
    if (selectedTextBoxes.length === 0) return;

    const groupIds = new Set(selectedTextBoxes.map(b => b.dataset.groupId).filter(Boolean));
    if (groupIds.size === 0) {
      showToast('Selected boxes are not in a group');
      return;
    }

    const allBoxes = canvasContent.querySelectorAll('.canvas-text-box');
    let count = 0;
    allBoxes.forEach(b => {
      if (b.dataset.groupId && groupIds.has(b.dataset.groupId)) {
        delete b.dataset.groupId;
        b.classList.remove('is-grouped');
        const tb = b.querySelector('.text-box-toolbar');
        if (tb) updateToolbarContent(tb, null);
        count++;
      }
    });

    updateGroupButtonState();
    showToast(`Ungrouped ${count} text boxes 🔓`);
    saveDraftLocal();
  }

  if (btnGroupToggle) {
    btnGroupToggle.addEventListener('click', () => {
      const hasGroup = selectedTextBoxes.some(b => !!b.dataset.groupId);
      if (hasGroup && selectedTextBoxes.every(b => b.dataset.groupId && b.dataset.groupId === selectedTextBoxes[0].dataset.groupId)) {
        ungroupSelectedBoxes();
      } else {
        groupSelectedBoxes();
      }
    });
  }

  // ------------------------------------------------------------
  // Delete Key & Backspace Handling
  // ------------------------------------------------------------
  function deleteSelectedBoxes(targetBoxes = null) {
    const toDelete = targetBoxes ? [...targetBoxes] : [...selectedTextBoxes];
    if (toDelete.length === 0) return;

    // If deleting a box that belongs to a group, delete all boxes in that group
    const expandedDelete = new Set(toDelete);
    toDelete.forEach(b => {
      if (b.dataset.groupId) {
        const groupMates = canvasContent.querySelectorAll(`.canvas-text-box[data-group-id="${b.dataset.groupId}"]`);
        groupMates.forEach(gm => expandedDelete.add(gm));
      }
    });

    const finalBoxes = Array.from(expandedDelete);
    finalBoxes.forEach(box => {
      box.style.transition = 'opacity 0.15s ease, transform 0.15s ease';
      box.style.opacity = '0';
      box.style.transform = 'scale(0.95)';
      setTimeout(() => {
        if (box.parentNode) box.parentNode.removeChild(box);
        selectedTextBoxes = selectedTextBoxes.filter(item => item !== box);
        updateMetrics();
        syncBreadcrumbFromBoxes();
        saveDraftLocal();
        checkEmptyState();
      }, 150);
    });

    updateGroupButtonState();
    showToast(finalBoxes.length > 1 ? `Deleted ${finalBoxes.length} text boxes 🗑` : 'Text box deleted 🗑');
  }

  // Global Keyboard Shortcuts (Delete, Ctrl+G, Escape)
  window.addEventListener('keydown', (e) => {
    // Escape to deselect
    if (e.key === 'Escape') {
      deselectAll();
      return;
    }

    // Ctrl + G / Cmd + G to Group / Ungroup
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'g') {
      e.preventDefault();
      if (e.shiftKey) {
        ungroupSelectedBoxes();
      } else {
        const allSameGroup = selectedTextBoxes.length >= 2 && selectedTextBoxes.every(b => b.dataset.groupId && b.dataset.groupId === selectedTextBoxes[0].dataset.groupId);
        if (allSameGroup || (selectedTextBoxes.length === 1 && selectedTextBoxes[0].dataset.groupId)) {
          ungroupSelectedBoxes();
        } else {
          groupSelectedBoxes();
        }
      }
      return;
    }

    // Delete Key
    if (e.key === 'Delete') {
      if (selectedTextBoxes.length > 0) {
        const activeEl = document.activeElement;
        const isEditingText = activeEl && activeEl.classList.contains('text-box-editor');

        if (!isEditingText) {
          e.preventDefault();
          deleteSelectedBoxes();
        } else if (activeEl.innerText.trim() === '') {
          e.preventDefault();
          deleteSelectedBoxes();
        }
      }
      return;
    }

    // Backspace Key (When not actively editing text, or when editor is empty)
    if (e.key === 'Backspace') {
      if (selectedTextBoxes.length > 0) {
        const activeEl = document.activeElement;
        const isEditingText = activeEl && activeEl.classList.contains('text-box-editor');

        if (!isEditingText) {
          e.preventDefault();
          deleteSelectedBoxes();
        } else if (activeEl.innerText.trim() === '') {
          e.preventDefault();
          deleteSelectedBoxes();
        }
      }
    }
  });

  // ------------------------------------------------------------
  // Dragging Grouped & Individual Text Boxes
  // ------------------------------------------------------------
  function startDragging(box, e) {
    isDragging = true;
    dragTarget = box;
    dragStartX = e.clientX;
    dragStartY = e.clientY;

    // Record initial positions for all selected / grouped boxes
    dragInitialPositions = selectedTextBoxes.map(b => ({
      box: b,
      left: parseInt(b.style.left) || 0,
      top: parseInt(b.style.top) || 0
    }));

    document.body.style.userSelect = 'none';
  }

  function startResizing(box, e) {
    isResizing = true;
    dragTarget = box;
    dragStartX = e.clientX;
    initialWidth = box.offsetWidth;
    document.body.style.userSelect = 'none';
  }

  window.addEventListener('mousemove', (e) => {
    if (isDragging && dragTarget && dragInitialPositions.length > 0) {
      const deltaX = e.clientX - dragStartX;
      const deltaY = e.clientY - dragStartY;

      const containerWidth = canvasContent.clientWidth;
      const containerHeight = canvasContent.clientHeight;

      // Find collective boundaries
      let minDeltaX = -Infinity;
      let maxDeltaX = Infinity;
      let minDeltaY = -Infinity;
      let maxDeltaY = Infinity;

      dragInitialPositions.forEach(p => {
        const w = p.box.offsetWidth;
        const h = p.box.offsetHeight;
        minDeltaX = Math.max(minDeltaX, 10 - p.left);
        maxDeltaX = Math.min(maxDeltaX, containerWidth - w - 10 - p.left);
        minDeltaY = Math.max(minDeltaY, 10 - p.top);
        maxDeltaY = Math.min(maxDeltaY, containerHeight - h - 10 - p.top);
      });

      const clampedDeltaX = Math.max(minDeltaX, Math.min(deltaX, maxDeltaX));
      const clampedDeltaY = Math.max(minDeltaY, Math.min(deltaY, maxDeltaY));

      // Move all grouped/selected boxes in lockstep
      dragInitialPositions.forEach(p => {
        p.box.style.left = `${p.left + clampedDeltaX}px`;
        p.box.style.top = `${p.top + clampedDeltaY}px`;
      });

    } else if (isResizing && dragTarget) {
      const deltaX = e.clientX - dragStartX;
      const maxW = canvasContent.clientWidth - (parseInt(dragTarget.style.left) || 0) - 20;
      let newWidth = Math.max(160, Math.min(initialWidth + deltaX, maxW));
      dragTarget.style.width = `${newWidth}px`;
    }
  });

  window.addEventListener('mouseup', () => {
    if (isDragging || isResizing) {
      isDragging = false;
      isResizing = false;
      dragTarget = null;
      dragInitialPositions = [];
      document.body.style.userSelect = '';
      saveDraftLocal();
    }
  });

  // Clicking empty canvas area deselects text boxes
  if (canvasContent) {
    canvasContent.addEventListener('mousedown', (e) => {
      if (e.target === canvasContent || e.target.classList.contains('canvas-empty-state')) {
        deselectAll();
      }
    });

    // Double-click to spawn text box right at click location
    canvasContent.addEventListener('dblclick', (e) => {
      if (e.target === canvasContent) {
        const rect = canvasContent.getBoundingClientRect();
        const x = Math.max(20, Math.min(e.clientX - rect.left, rect.width - 240));
        const y = Math.max(20, Math.min(e.clientY - rect.top, rect.height - 60));
        const box = createTextBox({ x, y, width: 380 });
        const editor = box.querySelector('.text-box-editor');
        if (editor) editor.focus();
        showToast('Text box placed ✨');
      }
    });
  }

  function duplicateTextBox(box) {
    const editor = box.querySelector('.text-box-editor');
    const x = Math.min((parseInt(box.style.left) || 60) + 24, canvasContent.clientWidth - 200);
    const y = Math.min((parseInt(box.style.top) || 60) + 24, canvasContent.clientHeight - 80);
    const width = parseInt(box.style.width) || 400;

    const newBox = createTextBox({
      x,
      y,
      width,
      fontSize: box.style.fontSize,
      fontFamily: box.style.fontFamily,
      textAlign: box.style.textAlign,
      isHeading: box.classList.contains('is-heading'),
      content: editor ? editor.innerText : '',
      groupId: box.dataset.groupId || null
    });

    showToast('Text box duplicated ⧉');
    return newBox;
  }

  // ------------------------------------------------------------
  // Toolbar Buttons (+ Add Text Box, + Heading, + Stanza)
  // ------------------------------------------------------------
  function addSmartTextBox(type = 'default') {
    const existingBoxes = canvasContent.querySelectorAll('.canvas-text-box');
    let x = 60;
    let y = 60;

    if (existingBoxes.length > 0) {
      const lastBox = existingBoxes[existingBoxes.length - 1];
      const lastTop = parseInt(lastBox.style.top) || 60;
      const lastHeight = lastBox.offsetHeight || 60;
      y = Math.min(lastTop + lastHeight + 20, canvasContent.clientHeight - 90);
    }

    let box;
    if (type === 'heading') {
      box = createTextBox({
        x,
        y,
        width: 480,
        fontSize: '32px',
        fontFamily: "'Playfair Display', Georgia, serif",
        isHeading: true,
        placeholder: 'Poem title…'
      });
      showToast('Heading text box added');
    } else if (type === 'stanza') {
      box = createTextBox({
        x,
        y,
        width: 520,
        fontSize: '20px',
        fontFamily: "'Playfair Display', Georgia, serif",
        isHeading: false,
        placeholder: 'Write your stanza here…'
      });
      showToast('Stanza text box added');
    } else {
      box = createTextBox({
        x,
        y,
        width: 420,
        fontSize: sliderFontSize ? `${sliderFontSize.value}px` : '20px',
        fontFamily: selectFont ? selectFont.value : "'Playfair Display', Georgia, serif",
        placeholder: 'Write your verse here…'
      });
      showToast('Text box added');
    }

    const editor = box.querySelector('.text-box-editor');
    if (editor) editor.focus();
  }

  if (btnAddTextbox) btnAddTextbox.addEventListener('click', () => addSmartTextBox('default'));
  if (btnAddHeading) btnAddHeading.addEventListener('click', () => addSmartTextBox('heading'));
  if (btnAddStanza) btnAddStanza.addEventListener('click', () => addSmartTextBox('stanza'));
  if (btnSidebarAddText) btnSidebarAddText.addEventListener('click', () => addSmartTextBox('default'));

  // ------------------------------------------------------------
  // Empty State
  // ------------------------------------------------------------
  function checkEmptyState() {
    const boxes = canvasContent.querySelectorAll('.canvas-text-box');
    if (boxes.length === 0) {
      const empty = document.createElement('div');
      empty.className = 'canvas-empty-state';
      empty.id = 'canvas-empty-state';
      empty.innerHTML = `
        <span class="empty-state-icon">✎</span>
        <span class="empty-state-text">Click to Add Text Box</span>
        <span style="font-size: 0.74rem; color: #8c8270;">or double-click anywhere on the canvas</span>
      `;
      empty.addEventListener('click', () => addSmartTextBox('default'));
      canvasContent.appendChild(empty);
    }
  }

  function removeEmptyState() {
    const empty = document.getElementById('canvas-empty-state');
    if (empty) empty.remove();
  }

  // ------------------------------------------------------------
  // Breadcrumb Sync
  // ------------------------------------------------------------
  function syncBreadcrumbFromBoxes() {
    const boxes = canvasContent.querySelectorAll('.canvas-text-box');
    if (boxes.length === 0) {
      if (breadcrumbTitle) breadcrumbTitle.textContent = 'Untitled Verse';
      return;
    }
    let titleBox = Array.from(boxes).find(b => b.classList.contains('is-heading')) || boxes[0];
    const editor = titleBox.querySelector('.text-box-editor');
    const text = editor ? editor.innerText.split('\n')[0].trim() : '';
    if (breadcrumbTitle) breadcrumbTitle.textContent = text || 'Untitled Verse';
  }

  if (breadcrumbTitle) {
    breadcrumbTitle.addEventListener('input', () => {
      const title = breadcrumbTitle.textContent.trim();
      const firstHeading = canvasContent.querySelector('.canvas-text-box.is-heading .text-box-editor') ||
                           canvasContent.querySelector('.canvas-text-box .text-box-editor');
      if (firstHeading) {
        firstHeading.innerText = title;
        updateMetrics();
        saveDraftLocal();
      }
    });
  }

  // ------------------------------------------------------------
  // Live Metrics (Across All Text Boxes)
  // ------------------------------------------------------------
  function countSyllablesInWord(word) {
    word = word.toLowerCase().trim();
    if (!word || word.length === 0) return 0;
    if (word.length <= 3) return 1;
    word = word.replace(/(?:[^laeiouy]|ed|es|e)$/, '');
    word = word.replace(/^y/, '');
    const matches = word.match(/[aeiouy]{1,2}/g);
    return matches ? matches.length : 1;
  }

  function calculateSyllables(text) {
    const words = text.match(/\b[a-zA-Z]+\b/g) || [];
    return words.reduce((total, w) => total + countSyllablesInWord(w), 0);
  }

  function updateMetrics() {
    const editors = canvasContent.querySelectorAll('.text-box-editor');
    let fullText = '';
    editors.forEach(ed => {
      const t = ed.innerText.trim();
      if (t) fullText += (fullText ? '\n' : '') + t;
    });

    const lines = fullText.split(/\r\n|\r|\n/).filter(line => line.trim().length > 0);
    const lineCount = lines.length;
    const words = fullText.match(/\b\w+\b/g) || [];
    const wordCount = words.length;
    const syllableCount = calculateSyllables(fullText);

    if (statLines) statLines.textContent = `${lineCount} line${lineCount === 1 ? '' : 's'}`;
    if (statWords) statWords.textContent = `${wordCount} word${wordCount === 1 ? '' : 's'}`;
    if (statSyllables) statSyllables.textContent = `~${syllableCount} syllable${syllableCount === 1 ? '' : 's'}`;
  }

  // ------------------------------------------------------------
  // Local Session Persistence (Save & Load Groups + Text Boxes)
  // ------------------------------------------------------------
  function saveDraftLocal() {
    try {
      const boxes = [];
      const boxEls = canvasContent.querySelectorAll('.canvas-text-box');
      boxEls.forEach(b => {
        const editor = b.querySelector('.text-box-editor');
        boxes.push({
          id: b.id,
          x: parseInt(b.style.left) || 60,
          y: parseInt(b.style.top) || 60,
          width: parseInt(b.style.width) || 400,
          fontSize: b.style.fontSize || '20px',
          fontFamily: b.style.fontFamily || "'Playfair Display', Georgia, serif",
          textAlign: b.style.textAlign || 'left',
          isHeading: b.classList.contains('is-heading'),
          groupId: b.dataset.groupId || null,
          content: editor ? editor.innerText : ''
        });
      });

      const draft = {
        boxes,
        bg: activeBackground,
        customBg: customBgDataUrl,
        overlay: sliderBgOverlay ? sliderBgOverlay.value : '10',
        blur: sliderBgBlur ? sliderBgBlur.value : '0',
        form: breadcrumbFormText ? breadcrumbFormText.textContent : 'Free Verse'
      };

      localStorage.setItem('versely_boxes_draft', JSON.stringify(draft));
      updateSaveStatus();
    } catch (e) {
      // LocalStorage quota fallback
    }
  }

  const saveStatusText = document.getElementById('save-status-text');
  let saveStatusTimer = null;
  function updateSaveStatus() {
    if (!saveStatusText) return;
    saveStatusText.textContent = 'Saving…';
    saveStatusText.classList.add('saving');
    clearTimeout(saveStatusTimer);
    saveStatusTimer = setTimeout(() => {
      saveStatusText.textContent = 'Saved ✓';
      saveStatusText.classList.remove('saving');
    }, 400);
  }

  function loadSavedDraft() {
    try {
      const saved = localStorage.getItem('versely_boxes_draft');
      if (saved) {
        const draft = JSON.parse(saved);
        if (draft.bg) applyBackground(draft.bg, draft.bg === 'custom' ? draft.customBg : null);
        if (draft.overlay && sliderBgOverlay) {
          sliderBgOverlay.value = draft.overlay;
          if (valBgOverlay) valBgOverlay.textContent = `${draft.overlay}%`;
          canvasView.style.setProperty('--canvas-overlay-opacity', draft.overlay / 100);
        }
        if (draft.blur && sliderBgBlur) {
          sliderBgBlur.value = draft.blur;
          if (valBgBlur) valBgBlur.textContent = `${draft.blur}px`;
          canvasView.style.setProperty('--canvas-blur', `${draft.blur}px`);
        }
        if (draft.form && breadcrumbFormText) {
          breadcrumbFormText.textContent = draft.form;
        }

        if (draft.boxes && draft.boxes.length > 0) {
          canvasContent.innerHTML = '';
          draft.boxes.forEach(b => createTextBox(b));
          deselectAll();
          syncBreadcrumbFromBoxes();
          updateMetrics();
          return;
        }
      }
    } catch (e) {
      console.warn('Could not load draft', e);
    }

    // Default starting template
    loadTemplate(poetryTemplates['free-verse']);
  }

  // ------------------------------------------------------------
  // Bottom Save Button & Fullscreen
  // ------------------------------------------------------------
  if (btnCanvasSave) {
    btnCanvasSave.addEventListener('click', () => {
      saveDraftLocal();
      btnCanvasSave.classList.add('saved');
      saveBtnText.textContent = 'Saved ✓';
      showToast('Verse saved to your device cache ✓');
      setTimeout(() => {
        btnCanvasSave.classList.remove('saved');
        saveBtnText.textContent = 'Save';
      }, 2000);
    });
  }

  if (btnCanvasFullscreen && workspace) {
    btnCanvasFullscreen.addEventListener('click', () => {
      workspace.classList.toggle('focus-mode');
      const isFocus = workspace.classList.contains('focus-mode');
      showToast(isFocus ? 'Focus Mode enabled (Sidebars hidden)' : 'Sidebars restored');
    });
  }

  // ------------------------------------------------------------
  // Left Sidebar: Toggle, Forms & The Muse
  // ------------------------------------------------------------
  if (btnToggleSidebar && sidebarLeft) {
    btnToggleSidebar.addEventListener('click', () => {
      sidebarLeft.classList.toggle('collapsed');
    });
  }

  formNavItems.forEach(item => {
    item.addEventListener('click', () => {
      formNavItems.forEach(b => b.classList.remove('active'));
      item.classList.add('active');
      const formName = item.getAttribute('data-form');
      if (breadcrumbFormText) breadcrumbFormText.textContent = formName;

      const templateKey = item.getAttribute('data-template');
      if (templateKey && poetryTemplates[templateKey]) {
        loadTemplate(poetryTemplates[templateKey]);
      }
    });
  });

  if (btnMuseSpark && musePromptText) {
    btnMuseSpark.addEventListener('click', () => {
      const current = musePromptText.textContent;
      const filtered = musePrompts.filter(p => p !== current);
      const chosen = filtered[Math.floor(Math.random() * filtered.length)];
      musePromptText.style.opacity = '0';
      setTimeout(() => {
        musePromptText.textContent = chosen;
        musePromptText.style.opacity = '1';
      }, 180);
    });
  }

  // ------------------------------------------------------------
  // Export Text & Clear Canvas
  // ------------------------------------------------------------
  function getAllPoemText() {
    const boxes = Array.from(canvasContent.querySelectorAll('.canvas-text-box'));
    boxes.sort((a, b) => (parseInt(a.style.top) || 0) - (parseInt(b.style.top) || 0));

    let title = breadcrumbTitle ? breadcrumbTitle.textContent.trim() : 'Untitled Verse';
    let body = '';

    boxes.forEach(b => {
      const editor = b.querySelector('.text-box-editor');
      if (!editor) return;
      const text = editor.innerText.trim();
      if (!text) return;
      if (b.classList.contains('is-heading')) {
        title = text;
      } else {
        body += (body ? '\n\n' : '') + text;
      }
    });

    return { title, body, full: `${title}\n\n${body}` };
  }

  if (btnSidebarCopy) {
    btnSidebarCopy.addEventListener('click', () => {
      const { full } = getAllPoemText();
      navigator.clipboard.writeText(full).then(() => {
        showToast('Copied verse to clipboard 📋');
      }).catch(() => {
        showToast('Verse copied!');
      });
    });
  }

  function downloadTextFile() {
    const { title, body } = getAllPoemText();
    const content = `${title}\n${'='.repeat(title.length)}\n\n${body}\n\n— Created on Versely`;
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${title.toLowerCase().replace(/[^a-z0-9]+/g, '_')}.txt`;
    link.click();
    URL.revokeObjectURL(url);
    showToast('Poem downloaded as text file 📄');
    if (exportModal) exportModal.style.display = 'none';
  }

  if (btnSidebarDownloadTxt) btnSidebarDownloadTxt.addEventListener('click', downloadTextFile);

  if (btnSidebarClear) {
    btnSidebarClear.addEventListener('click', () => {
      if (confirm('Are you sure you want to clear your current verse?')) {
        canvasContent.innerHTML = '';
        checkEmptyState();
        updateMetrics();
        syncBreadcrumbFromBoxes();
        saveDraftLocal();
        showToast('Canvas cleared');
      }
    });
  }

  if (btnNewCanvas) {
    btnNewCanvas.addEventListener('click', () => {
      const boxes = canvasContent.querySelectorAll('.canvas-text-box');
      if (boxes.length > 0 && !confirm('Start a fresh canvas? Any unsaved edits will be replaced.')) {
        return;
      }
      canvasContent.innerHTML = '';
      loadTemplate(poetryTemplates['free-verse']);
      showToast('Fresh canvas ready ✨');
    });
  }

  // ------------------------------------------------------------
  // Right Accordion Stack & Settings Controls
  // ------------------------------------------------------------
  accordionPanels.forEach(panel => {
    const header = panel.querySelector('.accordion-header');
    if (header) {
      header.addEventListener('click', () => {
        panel.classList.toggle('open');
      });
    }
  });

  // Typography Controls applied to all selected text boxes
  if (selectFont) {
    selectFont.addEventListener('change', (e) => {
      const font = e.target.value;
      if (selectedTextBoxes.length > 0) {
        selectedTextBoxes.forEach(b => b.style.fontFamily = font);
      } else {
        canvasContent.querySelectorAll('.canvas-text-box').forEach(b => {
          b.style.fontFamily = font;
        });
      }
      saveDraftLocal();
    });
  }

  if (sliderFontSize && valFontSize) {
    sliderFontSize.addEventListener('input', (e) => {
      const px = e.target.value;
      valFontSize.textContent = `${px}px`;
      if (selectedTextBoxes.length > 0) {
        selectedTextBoxes.forEach(b => b.style.fontSize = `${px}px`);
      } else {
        canvasContent.querySelectorAll('.canvas-text-box:not(.is-heading)').forEach(b => {
          b.style.fontSize = `${px}px`;
        });
      }
      saveDraftLocal();
    });
  }

  if (sliderLineHeight && valLineHeight) {
    sliderLineHeight.addEventListener('input', (e) => {
      const lh = e.target.value;
      valLineHeight.textContent = lh;
      if (selectedTextBoxes.length > 0) {
        selectedTextBoxes.forEach(b => b.style.lineHeight = lh);
      } else {
        canvasContent.querySelectorAll('.canvas-text-box').forEach(b => {
          b.style.lineHeight = lh;
        });
      }
      saveDraftLocal();
    });
  }

  alignButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      alignButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const align = btn.getAttribute('data-align');
      if (selectedTextBoxes.length > 0) {
        selectedTextBoxes.forEach(b => b.style.textAlign = align);
      } else {
        canvasContent.querySelectorAll('.canvas-text-box').forEach(b => {
          b.style.textAlign = align;
        });
      }
      saveDraftLocal();
    });
  });

  // ------------------------------------------------------------
  // Background Adjustment & Custom Image Uploading
  // ------------------------------------------------------------
  function applyBackground(bgKey, customUrl = null) {
    activeBackground = bgKey;
    if (!canvasBgLayer) return;

    canvasBgLayer.style.backgroundImage = '';
    canvasBgLayer.style.backgroundColor = '';
    canvasBgLayer.style.backgroundSize = '';
    canvasBgLayer.style.backgroundPosition = '';
    canvasBgLayer.style.backgroundRepeat = '';
    canvasView.style.setProperty('--canvas-text-color', '#1a1a18');

    bgThumbButtons.forEach(b => {
      if (b.getAttribute('data-bg') === bgKey) {
        b.classList.add('active');
      } else {
        b.classList.remove('active');
      }
    });

    if (bgKey === 'dotgrid') {
      canvasBgLayer.style.backgroundColor = '#fdfbf7';
      canvasBgLayer.style.backgroundImage = 'radial-gradient(#d5c9b6 1.3px, transparent 1.3px)';
      canvasBgLayer.style.backgroundSize = '20px 20px';
      canvasBgLayer.style.backgroundRepeat = 'repeat';
      if (activeBgLabel) activeBgLabel.textContent = 'Active: Warm Dot Grid';
    } 
    else if (bgKey === 'parchment') {
      canvasBgLayer.style.backgroundColor = '#f6f0dd';
      canvasBgLayer.style.backgroundImage = 'radial-gradient(#ebdcb9 1px, transparent 1px)';
      canvasBgLayer.style.backgroundSize = '12px 12px';
      if (activeBgLabel) activeBgLabel.textContent = 'Active: Warm Parchment';
    } 
    else if (bgKey === 'night') {
      canvasBgLayer.style.backgroundColor = '#0b1120';
      canvasBgLayer.style.backgroundImage = 'radial-gradient(#c8973e 0.9px, transparent 0.9px), radial-gradient(#94a3b8 0.5px, transparent 0.5px)';
      canvasBgLayer.style.backgroundSize = '40px 40px, 20px 20px';
      canvasView.style.setProperty('--canvas-text-color', '#f8fafc');
      if (activeBgLabel) activeBgLabel.textContent = 'Active: Starry Midnight';
    }
    else if (bgKey === 'custom' && customUrl) {
      canvasBgLayer.style.backgroundImage = `url("${customUrl}")`;
      canvasBgLayer.style.backgroundSize = 'cover';
      canvasBgLayer.style.backgroundPosition = 'center';
      canvasBgLayer.style.backgroundRepeat = 'no-repeat';
      if (activeBgLabel) activeBgLabel.textContent = 'Active: Custom Image';
    }
    else {
      const resolvedUrl = (window.CURATED_BG_DATA && window.CURATED_BG_DATA[bgKey]) ? window.CURATED_BG_DATA[bgKey] : bgKey;
      canvasBgLayer.style.backgroundImage = `url("${resolvedUrl}")`;
      canvasBgLayer.style.backgroundSize = 'cover';
      canvasBgLayer.style.backgroundPosition = 'center';
      canvasBgLayer.style.backgroundRepeat = 'no-repeat';

      if (bgKey.includes('dark_doodles') || bgKey.includes('exact_bg')) {
        canvasView.style.setProperty('--canvas-text-color', '#ffffff');
      }

      const cleanName = bgKey.split('/').pop().replace(/\.[^/.]+$/, '').replace(/_/g, ' ');
      if (activeBgLabel) activeBgLabel.textContent = `Active: ${cleanName}`;
    }

    saveDraftLocal();
  }

  bgThumbButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const bg = btn.getAttribute('data-bg');
      applyBackground(bg);
      showToast('Background updated');
    });
  });

  if (userBgFileInput) {
    userBgFileInput.addEventListener('change', (e) => {
      const file = e.target.files && e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        customBgDataUrl = event.target.result;
        applyBackground('custom', customBgDataUrl);
        if (activeBgLabel) activeBgLabel.textContent = `Active: ${file.name}`;
        showToast('Custom background loaded 🖼');
      };
      reader.readAsDataURL(file);
    });
  }

  bgModeTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      bgModeTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const mode = tab.getAttribute('data-bg-mode');
      if (mode === 'dotgrid') {
        applyBackground('dotgrid');
      } else if (mode === 'solid') {
        canvasBgLayer.style.backgroundImage = 'none';
        canvasBgLayer.style.backgroundColor = '#fdfbf7';
        if (activeBgLabel) activeBgLabel.textContent = 'Active: Warm Ivory Solid';
      }
    });
  });

  if (sliderBgOverlay && valBgOverlay) {
    sliderBgOverlay.addEventListener('input', (e) => {
      const pct = e.target.value;
      valBgOverlay.textContent = `${pct}%`;
      canvasView.style.setProperty('--canvas-overlay-opacity', pct / 100);
      saveDraftLocal();
    });
  }

  if (sliderBgBlur && valBgBlur) {
    sliderBgBlur.addEventListener('input', (e) => {
      const px = e.target.value;
      valBgBlur.textContent = `${px}px`;
      canvasView.style.setProperty('--canvas-blur', `${px}px`);
      saveDraftLocal();
    });
  }

  // ------------------------------------------------------------
  // Media & Ambient Sound (Web Audio API Synthesizer)
  // ------------------------------------------------------------
  function initAudioContext() {
    if (!audioContext) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        audioContext = new AudioCtx();
        audioGainNode = audioContext.createGain();
        audioGainNode.gain.value = 0.4;
        audioGainNode.connect(audioContext.destination);
      }
    }
    if (audioContext && audioContext.state === 'suspended') {
      audioContext.resume();
    }
  }

  function startAmbianceSound(type) {
    initAudioContext();
    if (!audioContext) return;
    stopAmbianceSound();

    activeSoundType = type;
    isPlayingSound = true;

    const bufferSize = audioContext.sampleRate * 2;
    const noiseBuffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
    const output = noiseBuffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      if (type === 'rain') {
        output[i] = (Math.random() * 2 - 1) * 0.15;
      } else if (type === 'vinyl') {
        const isCrack = Math.random() < 0.003;
        output[i] = isCrack ? (Math.random() * 2 - 1) * 0.5 : (Math.random() * 2 - 1) * 0.02;
      } else if (type === 'fire') {
        const isPop = Math.random() < 0.005;
        output[i] = isPop ? (Math.random() * 2 - 1) * 0.4 : (Math.random() * 2 - 1) * 0.08;
      } else {
        output[i] = (Math.random() * 2 - 1) * 0.06;
      }
    }

    const whiteNoise = audioContext.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    const filter = audioContext.createBiquadFilter();
    if (type === 'rain') {
      filter.type = 'lowpass';
      filter.frequency.value = 1000;
    } else if (type === 'fire') {
      filter.type = 'bandpass';
      filter.frequency.value = 450;
    } else if (type === 'vinyl') {
      filter.type = 'highpass';
      filter.frequency.value = 800;
    } else {
      filter.type = 'lowpass';
      filter.frequency.value = 600;
    }

    whiteNoise.connect(filter);
    filter.connect(audioGainNode);
    whiteNoise.start(0);
    activeAudio = whiteNoise;

    if (ambianceControls) ambianceControls.style.display = 'flex';
    if (btnSoundPlay) btnSoundPlay.textContent = 'Pause Sound';

    ambianceButtons.forEach(btn => {
      if (btn.getAttribute('data-sound') === type) {
        btn.classList.add('playing');
      } else {
        btn.classList.remove('playing');
      }
    });

    showToast(`Playing ${type} ambiance 🎧`);
  }

  function stopAmbianceSound() {
    if (activeAudio) {
      try {
        activeAudio.stop();
        activeAudio.disconnect();
      } catch (e) {}
      activeAudio = null;
    }
    isPlayingSound = false;
    ambianceButtons.forEach(btn => btn.classList.remove('playing'));
    if (btnSoundPlay) btnSoundPlay.textContent = 'Play Sound';
  }

  ambianceButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const sound = btn.getAttribute('data-sound');
      if (activeSoundType === sound && isPlayingSound) {
        stopAmbianceSound();
      } else {
        startAmbianceSound(sound);
      }
    });
  });

  if (btnSoundPlay) {
    btnSoundPlay.addEventListener('click', () => {
      if (isPlayingSound) {
        stopAmbianceSound();
      } else if (activeSoundType) {
        startAmbianceSound(activeSoundType);
      } else {
        startAmbianceSound('rain');
      }
    });
  }

  if (sliderSoundVol) {
    sliderSoundVol.addEventListener('input', (e) => {
      const vol = e.target.value / 100;
      if (audioGainNode) audioGainNode.gain.value = vol;
    });
  }

  // ------------------------------------------------------------
  // Poetic Templates (Loads Structured Draggable Text Boxes)
  // ------------------------------------------------------------
  function loadTemplate(tpl) {
    if (!tpl) return;
    canvasContent.innerHTML = '';
    removeEmptyState();

    if (breadcrumbFormText) breadcrumbFormText.textContent = tpl.form;

    formNavItems.forEach(item => {
      if (item.getAttribute('data-form') === tpl.form) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });

    if (tpl.boxes && tpl.boxes.length > 0) {
      tpl.boxes.forEach(b => createTextBox(b));
    }

    deselectAll();
    syncBreadcrumbFromBoxes();
    updateMetrics();
    saveDraftLocal();
    showToast(`Loaded ${tpl.form} template`);
  }

  // ------------------------------------------------------------
  // Export Modal & Generators (Image Card & .txt)
  // ------------------------------------------------------------
  if (btnExportTrigger && exportModal) {
    btnExportTrigger.addEventListener('click', () => {
      exportModal.style.display = 'flex';
    });
  }

  if (btnCloseExport && exportModal) {
    btnCloseExport.addEventListener('click', () => {
      exportModal.style.display = 'none';
    });
  }

  if (exportModal) {
    exportModal.addEventListener('click', (e) => {
      if (e.target === exportModal) exportModal.style.display = 'none';
    });
  }

  if (btnExportTextFile) btnExportTextFile.addEventListener('click', downloadTextFile);

  if (btnExportCopyClipboard) {
    btnExportCopyClipboard.addEventListener('click', () => {
      const { full } = getAllPoemText();
      navigator.clipboard.writeText(full).then(() => {
        showToast('Verse copied to clipboard 📋');
        if (exportModal) exportModal.style.display = 'none';
      });
    });
  }

  // Helper: Draw image scaled with "cover" aspect ratio cropping
  function drawImageCover(ctx, img, targetWidth, targetHeight) {
    const imgRatio = img.naturalWidth / img.naturalHeight;
    const targetRatio = targetWidth / targetHeight;
    let sx = 0, sy = 0, sWidth = img.naturalWidth, sHeight = img.naturalHeight;

    if (imgRatio > targetRatio) {
      sWidth = img.naturalHeight * targetRatio;
      sx = (img.naturalWidth - sWidth) / 2;
    } else {
      sHeight = img.naturalWidth / targetRatio;
      sy = (img.naturalHeight - sHeight) / 2;
    }

    ctx.drawImage(img, sx, sy, sWidth, sHeight, 0, 0, targetWidth, targetHeight);
  }

  // Helper: Wrap a paragraph into lines strictly bounded by maxWidth
  function wrapParagraphToLines(ctx, text, maxWidth) {
    if (!text) return [''];

    // Preserve optional leading indentation for poetry stanzas
    const leadingSpacesMatch = text.match(/^[ ]+/);
    const leadingSpaces = leadingSpacesMatch ? leadingSpacesMatch[0] : '';
    const trimmed = text.trim();
    if (!trimmed) return [''];

    const words = trimmed.split(/\s+/);
    const lines = [];
    let currentLine = leadingSpaces + words[0];

    for (let i = 1; i < words.length; i++) {
      const word = words[i];
      const testLine = currentLine + ' ' + word;
      const testWidth = ctx.measureText(testLine).width;

      if (testWidth <= maxWidth) {
        currentLine = testLine;
      } else {
        lines.push(currentLine);
        currentLine = word;
      }
    }

    if (currentLine) {
      lines.push(currentLine);
    }

    // Fallback: If any unbroken word is still wider than maxWidth, break character by character
    const safeLines = [];
    for (const line of lines) {
      if (ctx.measureText(line).width <= maxWidth) {
        safeLines.push(line);
      } else {
        let sub = '';
        for (const ch of line) {
          if (ctx.measureText(sub + ch).width > maxWidth && sub.length > 0) {
            safeLines.push(sub);
            sub = ch;
          } else {
            sub += ch;
          }
        }
        if (sub) safeLines.push(sub);
      }
    }

    return safeLines;
  }

  // HTML5 Canvas Aesthetic Image Card Generator (Matches Exact Canvas Dimensions, No Watermark, Reliable Background)
  if (btnExportImageCard) {
    btnExportImageCard.addEventListener('click', async () => {
      // Ensure web fonts are completely loaded for precise canvas font measurement
      if (document.fonts && document.fonts.ready) {
        try {
          await document.fonts.ready;
        } catch (_) {}
      }

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      // 1. DYNAMICALLY MATCH THE EXACT CANVAS DIMENSIONS (1:1 PIXEL MATCH)
      const cardRect = canvasCard ? canvasCard.getBoundingClientRect() : null;
      const cardWidth = Math.round((cardRect && cardRect.width > 50 ? cardRect.width : (canvasCard ? canvasCard.clientWidth : 820)) || 820);
      const cardHeight = Math.round((cardRect && cardRect.height > 50 ? cardRect.height : (canvasCard ? canvasCard.clientHeight : 580)) || 580);

      // Exact canvas dimensions 1:1 (no distortion, matches on-screen canvas)
      const width = cardWidth;
      const height = cardHeight;

      canvas.width = width;
      canvas.height = height;

      function renderBoxesOnCanvas() {
        // Overlay tint layer (only if user has tint slider > 0)
        const overlayPct = sliderBgOverlay ? (parseFloat(sliderBgOverlay.value) / 100) : 0;
        const isNight = activeBackground === 'night';
        const isDarkDoodles = typeof activeBackground === 'string' && (activeBackground.includes('dark_doodles') || activeBackground.includes('exact_bg'));

        if (overlayPct > 0.01) {
          ctx.fillStyle = (isNight || isDarkDoodles)
            ? `rgba(11, 17, 32, ${overlayPct})`
            : `rgba(253, 251, 247, ${overlayPct})`;
          ctx.fillRect(0, 0, width, height);
        }

        // 2. DRAW EACH TEXT BOX WITH FAITHFUL POSITIONING AND NO OVERLAPPING
        const boxes = Array.from(canvasContent.querySelectorAll('.canvas-text-box'));

        boxes.forEach(box => {
          const editor = box.querySelector('.text-box-editor');
          if (!editor) return;

          const rawText = editor.innerText || '';
          if (!rawText.trim()) return;

          const editorRect = editor.getBoundingClientRect();

          // Calculate exact 1:1 coordinates relative to canvasCard
          let boxX = cardRect ? (editorRect.left - cardRect.left) : 60;
          let boxY = cardRect ? (editorRect.top - cardRect.top) : 60;
          let maxLineWidth = editorRect.width;

          // Robust fallbacks if bounding rect was zero
          if (!editorRect.width || editorRect.width < 10) {
            boxX = (parseInt(box.style.left) || 60) + (canvasContent.offsetLeft || 0) + 12;
            boxY = (parseInt(box.style.top) || 60) + (canvasContent.offsetTop || 0) + 8;
            maxLineWidth = Math.max(80, (box.offsetWidth || 300) - 24);
          }

          const computed = window.getComputedStyle(editor);
          const isHeading = box.classList.contains('is-heading');
          const fontSizePx = parseFloat(computed.fontSize) || (isHeading ? 30 : 20);
          const fontFamily = box.style.fontFamily || computed.fontFamily || "'Playfair Display', Georgia, serif";
          const fontWeight = isHeading ? '600' : (computed.fontWeight || '400');
          const fontStyle = computed.fontStyle || 'normal';
          const textAlign = box.style.textAlign || computed.textAlign || 'left';

          // Color selection
          let color = (isNight || isDarkDoodles) ? '#f8fafc' : '#1a1a18';
          if (computed.color && computed.color !== 'rgba(0, 0, 0, 0)' && computed.color !== 'transparent') {
            color = computed.color;
          }
          if (isHeading && !(isNight || isDarkDoodles)) {
            color = '#111110';
          }

          ctx.font = `${fontStyle} ${fontWeight} ${Math.round(fontSizePx)}px ${fontFamily}`;
          ctx.fillStyle = color;
          ctx.textBaseline = 'top';

          // Line height calculation
          let computedLh = parseFloat(computed.lineHeight);
          if (!computedLh || isNaN(computedLh)) {
            const lhMult = parseFloat(box.style.lineHeight) || (isHeading ? 1.3 : 1.6);
            computedLh = fontSizePx * lhMult;
          }
          const lineHeight = Math.round(computedLh);

          // Split into paragraphs (preserves user-typed stanza breaks)
          const paragraphs = rawText.split(/\r?\n/);
          let currentY = boxY;

          paragraphs.forEach(para => {
            if (para.trim() === '') {
              // Stanza blank line spacing
              currentY += Math.round(lineHeight * 0.75);
              return;
            }

            // Word-wrap paragraph lines strictly inside maxLineWidth
            const lines = wrapParagraphToLines(ctx, para, maxLineWidth);

            lines.forEach(line => {
              if (textAlign === 'center') {
                ctx.textAlign = 'center';
                ctx.fillText(line, boxX + maxLineWidth / 2, currentY);
              } else if (textAlign === 'right') {
                ctx.textAlign = 'right';
                ctx.fillText(line, boxX + maxLineWidth, currentY);
              } else {
                ctx.textAlign = 'left';
                ctx.fillText(line, boxX, currentY);
              }
              currentY += lineHeight;
            });
          });
        });

        // 3. TRIGGER DOWNLOAD
        const { title } = getAllPoemText();
        const imgUrl = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = imgUrl;
        const cleanTitle = (title || 'verse').toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '');
        link.download = `${cleanTitle || 'verse'}_canvas.png`;
        link.click();
        showToast('Canvas image downloaded 🖼');
        if (exportModal) exportModal.style.display = 'none';
      }

      // 4. DRAW BACKGROUND WITH ACCURATE COVER CROPPING AND OFFLINE DATA URL SUPPORT
      let bgSrc = null;
      if (activeBackground === 'custom' && customBgDataUrl) {
        bgSrc = customBgDataUrl;
      } else if (window.CURATED_BG_DATA && window.CURATED_BG_DATA[activeBackground]) {
        bgSrc = window.CURATED_BG_DATA[activeBackground];
      } else if (typeof activeBackground === 'string' && (activeBackground.startsWith('images/') || activeBackground.startsWith('data:'))) {
        bgSrc = activeBackground;
      }

      if (bgSrc) {
        const bgImg = new Image();
        bgImg.onload = () => {
          drawImageCover(ctx, bgImg, width, height);
          renderBoxesOnCanvas();
        };
        bgImg.onerror = () => {
          if (window.CURATED_BG_DATA && window.CURATED_BG_DATA[activeBackground]) {
            const fallbackImg = new Image();
            fallbackImg.onload = () => {
              drawImageCover(ctx, fallbackImg, width, height);
              renderBoxesOnCanvas();
            };
            fallbackImg.onerror = () => {
              ctx.fillStyle = '#fdfbf7';
              ctx.fillRect(0, 0, width, height);
              renderBoxesOnCanvas();
            };
            fallbackImg.src = window.CURATED_BG_DATA[activeBackground];
            return;
          }
          ctx.fillStyle = '#fdfbf7';
          ctx.fillRect(0, 0, width, height);
          renderBoxesOnCanvas();
        };
        bgImg.src = bgSrc;
      } else if (activeBackground === 'night') {
        // Starry Midnight theme
        ctx.fillStyle = '#0b1120';
        ctx.fillRect(0, 0, width, height);

        // Slate sub-dots
        ctx.fillStyle = 'rgba(148, 163, 184, 0.45)';
        const step1 = 20;
        for (let x = step1; x < width - 5; x += step1) {
          for (let y = step1; y < height - 5; y += step1) {
            ctx.beginPath();
            ctx.arc(x, y, 0.9, 0, Math.PI * 2);
            ctx.fill();
          }
        }

        // Gold accent stars
        ctx.fillStyle = 'rgba(200, 151, 62, 0.8)';
        const step2 = 40;
        for (let x = step2; x < width - 5; x += step2) {
          for (let y = step2; y < height - 5; y += step2) {
            ctx.beginPath();
            ctx.arc(x, y, 1.35, 0, Math.PI * 2);
            ctx.fill();
          }
        }

        renderBoxesOnCanvas();
      } else if (activeBackground === 'parchment') {
        // Warm Parchment theme
        ctx.fillStyle = '#f6f0dd';
        ctx.fillRect(0, 0, width, height);

        ctx.fillStyle = '#c8bfa6';
        const step = 24;
        for (let x = step; x < width - 5; x += step) {
          for (let y = step; y < height - 5; y += step) {
            ctx.beginPath();
            ctx.arc(x, y, 1.2, 0, Math.PI * 2);
            ctx.fill();
          }
        }

        renderBoxesOnCanvas();
      } else {
        // Warm Ivory Dot Grid (Landing page color theme)
        ctx.fillStyle = '#fdfbf7';
        ctx.fillRect(0, 0, width, height);

        const isSolid = canvasBgLayer && canvasBgLayer.style.backgroundImage === 'none';
        if (!isSolid) {
          ctx.fillStyle = '#d5c9b6';
          const step = 20;
          for (let x = step; x < width - 5; x += step) {
            for (let y = step; y < height - 5; y += step) {
              ctx.beginPath();
              ctx.arc(x, y, 1.25, 0, Math.PI * 2);
              ctx.fill();
            }
          }
        }

        renderBoxesOnCanvas();
      }
    });
  }

});
