document.addEventListener('DOMContentLoaded', function onReady() {
  const cardContainer = document.querySelector('.cardContainer');
  const playlistGridSection = document.querySelector('.spotify-playlist');
  const detailSection = document.querySelector('.playlist-detail');
  const detailCover = detailSection ? detailSection.querySelector('.cover') : null;
  const detailTitle = detailSection ? detailSection.querySelector('.title') : null;
  const detailDesc = detailSection ? detailSection.querySelector('.desc') : null;
  const detailStats = detailSection ? detailSection.querySelector('.stats') : null;
  const detailBody = detailSection ? detailSection.querySelector('.tracklist-body') : null;
  const headerNav = document.querySelector('.header .nav');
  const audio = document.getElementById('audio-player');
  const npCover = document.querySelector('.np-cover');
  const npTitle = document.querySelector('.np-title');
  const npArtist = document.querySelector('.np-artist');
  const btnToggle = document.querySelector('.btn-toggle');
  const toggleIcon = document.querySelector('.toggle-icon');
  const btnPrev = document.querySelector('.btn-prev');
  const btnNext = document.querySelector('.btn-next');
  const btnQueue = document.querySelector('.btn-queue');
  const queuePanel = document.querySelector('.queue-panel');
  const queueList = document.querySelector('.queue-list');
  const progressBar = document.querySelector('.progress-bar');
  const moodButtons = document.querySelectorAll('.mood-btn');
  const moodRecent = document.querySelector('.mood-recent');
  const defaultCover = 'logo2.svg';
  // XP UI
  const xpLevelEl = document.querySelector('.xp-level-num');
  const xpPointsEl = document.querySelector('.xp-points');
  const xpFillEl = document.querySelector('.xp-fill');
  const xpBadgesEl = document.querySelector('.xp-badges');
  const xpResetBtn = document.querySelector('.xp-reset');
  // Mosaic UI - Automatic Drawing System
  const mosaicCanvas = document.querySelector('.mosaic-canvas');
  const mosaicExportBtn = document.querySelector('.mosaic-export');
  const mosaicClearBtn = document.querySelector('.mosaic-clear');
  const MOSAIC_KEY = 'mosaic_tiles_v1';
  const MOSAIC_SIZE = 24; // 24x24 = 576 tiles
  
  // Coloring book state
  let currentDrawing = null;
  let drawingOutline = [];
  let filledTiles = 0;
  let currentFillIndex = 0;
  
  function loadMosaic(){ try { return JSON.parse(localStorage.getItem(MOSAIC_KEY)||'[]'); } catch(e){ return []; } }
  function saveMosaic(arr){ try { localStorage.setItem(MOSAIC_KEY, JSON.stringify(arr)); } catch(e){} }
  
  function drawMosaic(){
    if (!mosaicCanvas) return;
    const ctx = mosaicCanvas.getContext('2d');
    const tiles = loadMosaic();
    const cols = MOSAIC_SIZE, rows = MOSAIC_SIZE;
    const tw = Math.floor(mosaicCanvas.width / cols);
    const th = Math.floor(mosaicCanvas.height / rows);
    ctx.clearRect(0,0,mosaicCanvas.width,mosaicCanvas.height);
    for (let i=0;i<cols*rows;i++){
      const c = tiles[i] || '#1e1e1e';
      const x = (i % cols) * tw;
      const y = Math.floor(i / cols) * th;
      ctx.fillStyle = c;
      ctx.fillRect(x,y,tw,th);
    }
  }
  
  // Color palettes for different moods
  const colorPalettes = {
    chill: ['#87ceeb', '#b0c4de', '#e0f6ff', '#f0f8ff', '#dda0dd', '#98fb98'],
    focus: ['#4fd1c5', '#45b7d1', '#96ceb4', '#a8e6cf', '#88d8c0', '#7fcdcd'],
    party: ['#ff6b6b', '#feca57', '#ff9ff3', '#54a0ff', '#5f27cd', '#ee5a24'],
    melancholy: ['#6366f1', '#a29bfe', '#fd79a8', '#6c5ce7', '#74b9ff', '#a29bfe'],
    default: ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', '#ff9ff3', '#54a0ff', '#5f27cd']
  };
  
  // Simple prototype template
  const drawingTemplates = {
    heart: [
      {x: 10, y: 8}, {x: 11, y: 8}, {x: 12, y: 8}, {x: 13, y: 8},
      {x: 8, y: 9}, {x: 9, y: 9}, {x: 10, y: 9}, {x: 11, y: 9}, {x: 12, y: 9}, {x: 13, y: 9}, {x: 14, y: 9}, {x: 15, y: 9},
      {x: 6, y: 10}, {x: 7, y: 10}, {x: 8, y: 10}, {x: 9, y: 10}, {x: 10, y: 10}, {x: 11, y: 10}, {x: 12, y: 10}, {x: 13, y: 10}, {x: 14, y: 10}, {x: 15, y: 10}, {x: 16, y: 10}, {x: 17, y: 10},
      {x: 4, y: 11}, {x: 5, y: 11}, {x: 6, y: 11}, {x: 7, y: 11}, {x: 8, y: 11}, {x: 9, y: 11}, {x: 10, y: 11}, {x: 11, y: 11}, {x: 12, y: 11}, {x: 13, y: 11}, {x: 14, y: 11}, {x: 15, y: 11}, {x: 16, y: 11}, {x: 17, y: 11}, {x: 18, y: 11}, {x: 19, y: 11},
      {x: 2, y: 12}, {x: 3, y: 12}, {x: 4, y: 12}, {x: 5, y: 12}, {x: 6, y: 12}, {x: 7, y: 12}, {x: 8, y: 12}, {x: 9, y: 12}, {x: 10, y: 12}, {x: 11, y: 12}, {x: 12, y: 12}, {x: 13, y: 12}, {x: 14, y: 12}, {x: 15, y: 12}, {x: 16, y: 12}, {x: 17, y: 12}, {x: 18, y: 12}, {x: 19, y: 12}, {x: 20, y: 12}, {x: 21, y: 12},
      {x: 1, y: 13}, {x: 2, y: 13}, {x: 3, y: 13}, {x: 4, y: 13}, {x: 5, y: 13}, {x: 6, y: 13}, {x: 7, y: 13}, {x: 8, y: 13}, {x: 9, y: 13}, {x: 10, y: 13}, {x: 11, y: 13}, {x: 12, y: 13}, {x: 13, y: 13}, {x: 14, y: 13}, {x: 15, y: 13}, {x: 16, y: 13}, {x: 17, y: 13}, {x: 18, y: 13}, {x: 19, y: 13}, {x: 20, y: 13}, {x: 21, y: 13}, {x: 22, y: 13},
      {x: 0, y: 14}, {x: 1, y: 14}, {x: 2, y: 14}, {x: 3, y: 14}, {x: 4, y: 14}, {x: 5, y: 14}, {x: 6, y: 14}, {x: 7, y: 14}, {x: 8, y: 14}, {x: 9, y: 14}, {x: 10, y: 14}, {x: 11, y: 14}, {x: 12, y: 14}, {x: 13, y: 14}, {x: 14, y: 14}, {x: 15, y: 14}, {x: 16, y: 14}, {x: 17, y: 14}, {x: 18, y: 14}, {x: 19, y: 14}, {x: 20, y: 14}, {x: 21, y: 14}, {x: 22, y: 14}, {x: 23, y: 14},
      {x: 0, y: 15}, {x: 1, y: 15}, {x: 2, y: 15}, {x: 3, y: 15}, {x: 4, y: 15}, {x: 5, y: 15}, {x: 6, y: 15}, {x: 7, y: 15}, {x: 8, y: 15}, {x: 9, y: 15}, {x: 10, y: 15}, {x: 11, y: 15}, {x: 12, y: 15}, {x: 13, y: 15}, {x: 14, y: 15}, {x: 15, y: 15}, {x: 16, y: 15}, {x: 17, y: 15}, {x: 18, y: 15}, {x: 19, y: 15}, {x: 20, y: 15}, {x: 21, y: 15}, {x: 22, y: 15}, {x: 23, y: 15},
      {x: 0, y: 16}, {x: 1, y: 16}, {x: 2, y: 16}, {x: 3, y: 16}, {x: 4, y: 16}, {x: 5, y: 16}, {x: 6, y: 16}, {x: 7, y: 16}, {x: 8, y: 16}, {x: 9, y: 16}, {x: 10, y: 16}, {x: 11, y: 16}, {x: 12, y: 16}, {x: 13, y: 16}, {x: 14, y: 16}, {x: 15, y: 16}, {x: 16, y: 16}, {x: 17, y: 16}, {x: 18, y: 16}, {x: 19, y: 16}, {x: 20, y: 16}, {x: 21, y: 16}, {x: 22, y: 16}, {x: 23, y: 16},
      {x: 0, y: 17}, {x: 1, y: 17}, {x: 2, y: 17}, {x: 3, y: 17}, {x: 4, y: 17}, {x: 5, y: 17}, {x: 6, y: 17}, {x: 7, y: 17}, {x: 8, y: 17}, {x: 9, y: 17}, {x: 10, y: 17}, {x: 11, y: 17}, {x: 12, y: 17}, {x: 13, y: 17}, {x: 14, y: 17}, {x: 15, y: 17}, {x: 16, y: 17}, {x: 17, y: 17}, {x: 18, y: 17}, {x: 19, y: 17}, {x: 20, y: 17}, {x: 21, y: 17}, {x: 22, y: 17}, {x: 23, y: 17},
      {x: 0, y: 18}, {x: 1, y: 18}, {x: 2, y: 18}, {x: 3, y: 18}, {x: 4, y: 18}, {x: 5, y: 18}, {x: 6, y: 18}, {x: 7, y: 18}, {x: 8, y: 18}, {x: 9, y: 18}, {x: 10, y: 18}, {x: 11, y: 18}, {x: 12, y: 18}, {x: 13, y: 18}, {x: 14, y: 18}, {x: 15, y: 18}, {x: 16, y: 18}, {x: 17, y: 18}, {x: 18, y: 18}, {x: 19, y: 18}, {x: 20, y: 18}, {x: 21, y: 18}, {x: 22, y: 18}, {x: 23, y: 18},
      {x: 0, y: 19}, {x: 1, y: 19}, {x: 2, y: 19}, {x: 3, y: 19}, {x: 4, y: 19}, {x: 5, y: 19}, {x: 6, y: 19}, {x: 7, y: 19}, {x: 8, y: 19}, {x: 9, y: 19}, {x: 10, y: 19}, {x: 11, y: 19}, {x: 12, y: 19}, {x: 13, y: 19}, {x: 14, y: 19}, {x: 15, y: 19}, {x: 16, y: 19}, {x: 17, y: 19}, {x: 18, y: 19}, {x: 19, y: 19}, {x: 20, y: 19}, {x: 21, y: 19}, {x: 22, y: 19}, {x: 23, y: 19},
      {x: 0, y: 20}, {x: 1, y: 20}, {x: 2, y: 20}, {x: 3, y: 20}, {x: 4, y: 20}, {x: 5, y: 20}, {x: 6, y: 20}, {x: 7, y: 20}, {x: 8, y: 20}, {x: 9, y: 20}, {x: 10, y: 20}, {x: 11, y: 20}, {x: 12, y: 20}, {x: 13, y: 20}, {x: 14, y: 20}, {x: 15, y: 20}, {x: 16, y: 20}, {x: 17, y: 20}, {x: 18, y: 20}, {x: 19, y: 20}, {x: 20, y: 20}, {x: 21, y: 20}, {x: 22, y: 20}, {x: 23, y: 20},
      {x: 0, y: 21}, {x: 1, y: 21}, {x: 2, y: 21}, {x: 3, y: 21}, {x: 4, y: 21}, {x: 5, y: 21}, {x: 6, y: 21}, {x: 7, y: 21}, {x: 8, y: 21}, {x: 9, y: 21}, {x: 10, y: 21}, {x: 11, y: 21}, {x: 12, y: 21}, {x: 13, y: 21}, {x: 14, y: 21}, {x: 15, y: 21}, {x: 16, y: 21}, {x: 17, y: 21}, {x: 18, y: 21}, {x: 19, y: 21}, {x: 20, y: 21}, {x: 21, y: 21}, {x: 22, y: 21}, {x: 23, y: 21},
      {x: 0, y: 22}, {x: 1, y: 22}, {x: 2, y: 22}, {x: 3, y: 22}, {x: 4, y: 22}, {x: 5, y: 22}, {x: 6, y: 22}, {x: 7, y: 22}, {x: 8, y: 22}, {x: 9, y: 22}, {x: 10, y: 22}, {x: 11, y: 22}, {x: 12, y: 22}, {x: 13, y: 22}, {x: 14, y: 22}, {x: 15, y: 22}, {x: 16, y: 22}, {x: 17, y: 22}, {x: 18, y: 22}, {x: 19, y: 22}, {x: 20, y: 22}, {x: 21, y: 22}, {x: 22, y: 22}, {x: 23, y: 22},
      {x: 0, y: 23}, {x: 1, y: 23}, {x: 2, y: 23}, {x: 3, y: 23}, {x: 4, y: 23}, {x: 5, y: 23}, {x: 6, y: 23}, {x: 7, y: 23}, {x: 8, y: 23}, {x: 9, y: 23}, {x: 10, y: 23}, {x: 11, y: 23}, {x: 12, y: 23}, {x: 13, y: 23}, {x: 14, y: 23}, {x: 15, y: 23}, {x: 16, y: 23}, {x: 17, y: 23}, {x: 18, y: 23}, {x: 19, y: 23}, {x: 20, y: 23}, {x: 21, y: 23}, {x: 22, y: 23}, {x: 23, y: 23}
    ]
  };
  
  function generateNewDrawing() {
    const templates = Object.keys(drawingTemplates);
    const randomTemplate = templates[Math.floor(Math.random() * templates.length)];
    currentDrawing = randomTemplate;
    drawingOutline = drawingTemplates[randomTemplate];
    currentFillIndex = 0;
    filledTiles = 0;
    
    // Clear canvas and show outline
    const emptyTiles = new Array(MOSAIC_SIZE * MOSAIC_SIZE).fill('#1e1e1e');
    saveMosaic(emptyTiles);
    showDrawingOutline();
  }
  
  function showDrawingOutline() {
    if (!mosaicCanvas) return;
    
    const ctx = mosaicCanvas.getContext('2d');
    const tiles = loadMosaic();
    const cols = MOSAIC_SIZE;
    const tw = Math.floor(mosaicCanvas.width / cols);
    const th = Math.floor(mosaicCanvas.height / cols);
    
    // Clear canvas
    ctx.clearRect(0, 0, mosaicCanvas.width, mosaicCanvas.height);
    
    // Draw background
    for (let i = 0; i < cols * MOSAIC_SIZE; i++) {
      const c = tiles[i] || '#1e1e1e';
      const x = (i % cols) * tw;
      const y = Math.floor(i / cols) * th;
      ctx.fillStyle = c;
      ctx.fillRect(x, y, tw, th);
    }
    
    // Draw outline
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1;
    
    drawingOutline.forEach(({x, y}) => {
      const pixelX = x * tw;
      const pixelY = y * th;
      ctx.strokeRect(pixelX, pixelY, tw, th);
    });
  }
  
  function getColorForSong(track, playlist) {
    const title = track.title || '';
    const artist = track.artist || '';
    const playlistId = playlist.id || 'default';
    
    // Generate seed from track data
    const seed = title.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) + 
                 artist.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    
    // Get color palette based on playlist mood
    const colors = colorPalettes[playlistId] || colorPalettes.default;
    
    // Select color based on seed
    const colorIndex = seed % colors.length;
    return colors[colorIndex];
  }
  
  function fillNextBlock(track, playlist) {
    if (!currentDrawing || currentFillIndex >= drawingOutline.length) {
      // Start a new drawing
      generateNewDrawing();
      return;
    }
    
    const color = getColorForSong(track, playlist);
    const tiles = loadMosaic();
    const cols = MOSAIC_SIZE;
    
    // Fill the next block in the outline
    const block = drawingOutline[currentFillIndex];
    const index = block.y * cols + block.x;
    tiles[index] = color;
    saveMosaic(tiles);
    
    // Redraw with filled block
    showDrawingOutline();
    drawFilledBlocks();
    
    currentFillIndex++;
    filledTiles++;
    
    // Add animation effect
    animateBlockFill(block.x, block.y);
  }
  
  function drawFilledBlocks() {
    if (!mosaicCanvas) return;
    
    const ctx = mosaicCanvas.getContext('2d');
    const tiles = loadMosaic();
    const cols = MOSAIC_SIZE;
    const tw = Math.floor(mosaicCanvas.width / cols);
    const th = Math.floor(mosaicCanvas.height / cols);
    
    // Draw filled blocks
    for (let i = 0; i < currentFillIndex; i++) {
      const block = drawingOutline[i];
      const index = block.y * cols + block.x;
      const color = tiles[index];
      if (color && color !== '#1e1e1e') {
        ctx.fillStyle = color;
        ctx.fillRect(block.x * tw, block.y * th, tw, th);
      }
    }
  }
  
  function animateBlockFill(x, y) {
    if (!mosaicCanvas) return;
    
    const ctx = mosaicCanvas.getContext('2d');
    const cols = MOSAIC_SIZE;
    const tw = Math.floor(mosaicCanvas.width / cols);
    const th = Math.floor(mosaicCanvas.height / cols);
    const pixelX = x * tw;
    const pixelY = y * th;
    
    // Flash effect
    let opacity = 1;
    let growing = false;
    
    function flash() {
      ctx.save();
      ctx.globalAlpha = opacity;
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(pixelX, pixelY, tw, th);
      ctx.restore();
      
      if (growing) {
        opacity += 0.1;
        if (opacity >= 1) growing = false;
      } else {
        opacity -= 0.1;
        if (opacity <= 0) {
          showDrawingOutline();
          drawFilledBlocks();
          return;
        }
      }
      
      requestAnimationFrame(flash);
    }
    
    flash();
  }
  
  // Initialize mosaic with first drawing
  generateNewDrawing();
  
  // Clear button
  if (mosaicClearBtn) {
    mosaicClearBtn.addEventListener('click', function() {
      if (confirm('Start a new coloring book drawing?')) {
        generateNewDrawing();
      }
    });
  }
  
  // Export button
  if (mosaicExportBtn && mosaicCanvas) {
    mosaicExportBtn.addEventListener('click', function() {
      const url = mosaicCanvas.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = url; a.download = 'memory-mosaic.png'; a.click();
    });
  }

  // --- Play history (for Memory Lane) ---
  const HISTORY_KEY = 'play_history_v1';
  const LAST_PLAY_KEY = 'last_play_state_v1';
  function loadHistory(){
    try { return JSON.parse(localStorage.getItem(HISTORY_KEY)||'{}'); } catch(e){ return {}; }
  }
  function saveHistory(hist){
    try { localStorage.setItem(HISTORY_KEY, JSON.stringify(hist)); } catch(e){}
  }
  function updatePlayHistory(track){
    const hist = loadHistory();
    const key = encodeURI(track.src);
    const now = Date.now();
    if (!hist[key]){
      hist[key] = { firstPlayed: now, lastPlayed: now, plays: 1, title: track.title||'' };
    } else {
      hist[key].lastPlayed = now;
      hist[key].plays = (hist[key].plays||0) + 1;
      if (!hist[key].title) hist[key].title = track.title||'';
    }
    saveHistory(hist);
  }
  function getMemoryCaption(track){
    const hist = loadHistory();
    const key = encodeURI(track.src);
    const rec = hist[key];
    if (!rec || !rec.firstPlayed) return '';
    const d = new Date(rec.firstPlayed);
    const month = d.toLocaleString(undefined, { month: 'long' });
    return 'First played in ' + month + ' ' + d.getFullYear();
  }

  function guessCoverCandidates(p){
    const candidates = [];
    if (p.cover) candidates.push(p.cover);
    // Try common cover filenames inside a folder matching playlist id
    const baseA = 'songs/' + (p.id || '').trim() + '/';
    candidates.push(
      baseA + 'cover.jpg', baseA + 'cover.jpeg', baseA + 'cover.png',
      baseA + 'playlist.jpg', baseA + 'playlist.jpeg', baseA + 'playlist.png',
      baseA + (p.id||'').trim() + '.jpg', baseA + (p.id||'').trim() + '.jpeg', baseA + (p.id||'').trim() + '.png',
      baseA + 'memory-lane.jpg', baseA + 'memory-lane.jpeg', baseA + 'memory-lane.png'
    );
    // Try common folder name variants for memory lane
    if ((p.id||'') === 'memory-lane'){
      const baseB = 'songs/memory lane/';
      const baseC = 'songs/memorylane/';
      [baseB, baseC].forEach(function(b){
        candidates.push(
          b + 'cover.jpg', b + 'cover.jpeg', b + 'cover.png',
          b + 'playlist.jpg', b + 'playlist.jpeg', b + 'playlist.png',
          b + 'memory-lane.jpg', b + 'memory-lane.jpeg', b + 'memory-lane.png'
        );
      });
    }
    // Also try songs root for Memory Lane custom asset
    if ((p.id||'') === 'memory-lane') {
      const names = [
        '@ab67616d0000b273e1b99462d01597686c1b947f',
        'ab67616d0000b273e1b99462d01597686c1b947f'
      ];
      const exts = ['.jpg','.jpeg','.png'];
      const folders = ['songs/', 'songs/memory-lane/', 'songs/memory lane/', 'songs/memorylane/'];
      folders.forEach(function(folder){
        names.forEach(function(n){
          exts.forEach(function(ext){
            candidates.push(folder + n + ext);
          });
        });
      });
    }
    // If p.cover points inside a folder, try sibling extensions
    if (p.cover && p.cover.lastIndexOf('/') !== -1) {
      const dir = p.cover.slice(0, p.cover.lastIndexOf('/') + 1);
      candidates.push(
        dir + 'cover.jpg', dir + 'cover.jpeg', dir + 'cover.png',
        dir + 'playlist.jpg', dir + 'playlist.jpeg', dir + 'playlist.png',
        dir + (p.id||'').trim() + '.jpg', dir + (p.id||'').trim() + '.jpeg', dir + (p.id||'').trim() + '.png',
        dir + 'memory-lane.jpg', dir + 'memory-lane.jpeg', dir + 'memory-lane.png'
      );
    }
    // Ensure uniqueness while preserving order
    return Array.from(new Set(candidates));
  }

  function resolveCover(p, onDone){
    const list = guessCoverCandidates(p);
    let idx = 0;
    function tryNext(){
      if (idx >= list.length) { onDone(defaultCover); return; }
      const url = list[idx++];
      const img = new Image();
      img.onload = function(){ onDone(url); };
      img.onerror = function(){ tryNext(); };
      img.src = url;
    }
    tryNext();
  }
  let navBack = null, navForward = null;
  if (headerNav) {
    const svgs = headerNav.querySelectorAll('svg');
    navBack = svgs[0];
    navForward = svgs[1];
  }
  const playAllBtn = detailSection ? detailSection.querySelector('.play-all') : null;
  let currentPlaylist = null;
  let currentIndex = -1;

  function playTrack(playlist, index){
    if (!audio || !playlist || !playlist.tracks[index]) return;
    currentPlaylist = playlist;
    currentIndex = index;
    const track = playlist.tracks[index];
    // choose source with fallback (Memory Lane may prefer alt path)
    function setAudioSourceWithFallback(list){
      var i = 0;
      function tryNext(){
        if (i >= list.length){ return; }
        var url = encodeURI(list[i++]);
        audio.onerror = function(){ tryNext(); };
        audio.src = url;
        // attempt to load; play() will be called below and will use current src
      }
      tryNext();
    }
    function buildAltCandidatesForTrack(pl, t){
      var list = [];
      var moodIds = { chill:1, focus:1, party:1, melancholy:1 };
      if (pl && moodIds[pl.id]){
        var folder = 'songs/' + pl.id + '/';
        var base = (t.src||'').split('/').pop();
        if (base) list.push(folder + base);
        var raw = (t.title||'');
        var main = raw.split(' — ')[0] || raw;
        var variants = [];
        variants.push(main);
        variants.push(main.replace(/\s+/g,' '));
        variants.push(main.replace(/[^a-zA-Z0-9\s]/g,'').trim());
        variants.push(raw.replace(/\s*—.*$/,''));
        variants = Array.from(new Set(variants)).filter(Boolean);
        variants.forEach(function(v){
          var a = v.trim();
          if (!a) return;
          list.push(folder + a + '.mp3');
          list.push(folder + a + ' 320 Kbps.mp3');
        });
      }
      if (t.altSrc) list.push(t.altSrc);
      return list;
    }
    var srcList = buildAltCandidatesForTrack(playlist, track);
    if (track.src) srcList.push(track.src);
    // ensure unique
    srcList = Array.from(new Set(srcList));
    setAudioSourceWithFallback(srcList);
    if (npCover) {
      resolveCover(playlist, function(url){ npCover.src = url; });
    }
    const parts = (track.title || '').split(' — ');
    if (npTitle) npTitle.textContent = parts[0] || track.title || '';
    if (npArtist) npArtist.textContent = parts[1] || '';
    audio.play().then(function(){ if (toggleIcon) toggleIcon.textContent = '❙❙'; }).catch(function(){});
    // history
    updatePlayHistory(track);
    // Fill one block in the coloring book
    try {
      fillNextBlock(track, playlist);
    } catch(e){}
    // persist last play state
    try {
      localStorage.setItem(LAST_PLAY_KEY, JSON.stringify({
        pid: playlist.id,
        index: index,
        title: track.title,
        time: Math.floor(audio.currentTime||0)
      }));
    } catch(e){}
    // XP hooks: award for new artist and genre tags
    const artist = (parts[1]||'unknown').trim().toLowerCase();
    const genreTag = (playlist.id||'mix').toLowerCase();
    if (!xpState.artists[artist]){ xpState.artists[artist] = 1; awardXP(2); } else { xpState.artists[artist]++; }
    if (!xpState.genres[genreTag]){ xpState.genres[genreTag] = 1; awardXP(1); } else { xpState.genres[genreTag]++; }
    saveXP();
  }
  
  if (!cardContainer) return;

  // Define playlists based on files present in spotify/songs
  const playlists = [
    {
      id: 'ap-dhillon',
      title: 'AP Dhillon Mix',
      description: 'Handpicked tracks from AP Dhillon and more.',
      cover: 'songs/ap dhillon/37i9dQZF1DZ06evO4029Pj-default.jpg',
      tracks: [
        { title: 'Afsos — Anuv Jain', src: 'songs/ap dhillon/Afsos Anuv Jain 320 Kbps.mp3' },
        { title: 'Stfu — OKAY STFU', src: 'songs/ap dhillon/Stfu Okay Stfu 320 Kbps.mp3' },
        { title: 'Without Me — AP Dhillon', src: 'songs/ap dhillon/Without Me Ap Dhillon 320 Kbps.mp3' }
      ]
    },
    {
      id: 'diljit',
      title: 'Diljit Essentials',
      description: 'Top tracks from Diljit Dosanjh.',
      cover: 'songs/diljit/ab67706f00000002414b70eef9a7369f3b681476.jpeg',
      tracks: [
        { title: 'Don — Diljit Dosanjh', src: 'songs/diljit/Don Diljit Dosanjh 320 Kbps.mp3' },
        { title: 'Magic — Diljit Dosanjh', src: 'songs/diljit/Magic Diljit Dosanjh 320 Kbps.mp3' }
      ]
    },
    {
      id: 'jordan-sandhu',
      title: 'Jordan Sandhu Picks',
      description: 'Vibes from Jordan Sandhu and F.Y.I.',
      cover: 'songs/jordan sandhu/37i9dQZF1DZ06evO2gM94P-default.jpg',
      tracks: [
        { title: 'Big Things — F.Y.I.', src: 'songs/jordan sandhu/Big Things For Your Information 320 Kbps.mp3' },
        { title: 'One In A Million — Jordan Sandhu', src: 'songs/jordan sandhu/One In A Million Jordan Sandhu 320 Kbps.mp3' },
        { title: 'Parshawan — F.Y.I.', src: 'songs/jordan sandhu/Parshawan For Your Information 320 Kbps.mp3' }
      ]
    },
    {
      id: 'karan-aujla',
      title: 'Karan Aujla x P-Pop Culture',
      description: 'Hard-hitting Punjabi bangers.',
      cover: 'songs/Karan aujla/ab67706c0000da84cb831b6b71902a8811b42215.jpeg',
      tracks: [
        { title: '48 — Rhymes', src: 'songs/Karan aujla/48 Rhymes Karan Aujla 320 Kbps.mp3' },
        { title: '7 7 — Magnitude (P Pop Culture)', src: 'songs/Karan aujla/7 7 Magnitude P Pop Culture 320 Kbps.mp3' },
        { title: 'Boyfriend — P Pop Culture', src: 'songs/Karan aujla/Boyfriend P Pop Culture 320 Kbps.mp3' },
        { title: 'Daytona — P Pop Culture', src: 'songs/Karan aujla/Daytona P Pop Culture 320 Kbps.mp3' },
        { title: 'For A Reason — P Pop Culture', src: 'songs/Karan aujla/For A Reason P Pop Culture 320 Kbps.mp3' },
        { title: 'Him — P Pop Culture', src: 'songs/Karan aujla/Him P Pop Culture 320 Kbps.mp3' },
        { title: 'Tell Me — Karan Aujla', src: 'songs/Karan aujla/Tell Me Karan Aujla 320 Kbps.mp3' },
        { title: 'You Are U Tho — P Pop Culture', src: 'songs/Karan aujla/You Are U Tho P Pop Culture 320 Kbps.mp3' }
      ]
    },
    {
      id: 'karan-randhawa',
      title: 'Karan Randhawa — Loverboy',
      description: 'Loverboy era favorites.',
      cover: 'songs/karan randhawa/ab67616d0000b273a6f77b78243117efa96fdcb2.jpeg',
      tracks: [
        { title: 'Bluff — Loverboy', src: 'songs/karan randhawa/Bluff Loverboy 320 Kbps.mp3' },
        { title: 'Gulab — Loverboy', src: 'songs/karan randhawa/Gulab Loverboy 320 Kbps.mp3' },
        { title: 'Haye Oye — Loverboy', src: 'songs/karan randhawa/Haye Oye Loverboy 320 Kbps.mp3' },
        { title: 'Jaan Jaan Ke — Loverboy', src: 'songs/karan randhawa/Jaan Jaan Ke Loverboy 320 Kbps.mp3' },
        { title: 'Ranjna — Loverboy', src: 'songs/karan randhawa/Ranjna Loverboy 320 Kbps.mp3' },
        { title: 'Sohniye — Loverboy', src: 'songs/karan randhawa/Sohniye Loverboy 320 Kbps.mp3' }
      ]
    },
    {
      id: 'taylor-swift',
      title: 'Taylor Swift — evermore (deluxe)',
      description: 'Select tracks from evermore (deluxe).',
      cover: 'songs/taylor swift/ab67706f0000000277e28683d0f0d3558ac87c9d.jpeg',
      tracks: [
        { title: 'Champagne Problems — Taylor Swift', src: 'songs/taylor swift/Champagne Problems Evermore (deluxe Version) 320 Kbps.mp3' },
        { title: 'Willow — Taylor Swift', src: 'songs/taylor swift/Willow Evermore (deluxe Version) 320 Kbps.mp3' }
      ]
    },
    // Mood Playlists (open when a Mood DJ button is clicked)
    {
      id: 'chill',
      title: 'Chill Vibes',
      description: 'Soft tracks to unwind and relax.',
      cover: 'songs/chill/ab67706c0000da84d87be68ccb828811eda67ae5.jpeg',
      tracks: [
        { title: 'Champagne Problems — Taylor Swift', src: 'songs/taylor swift/Champagne Problems Evermore (deluxe Version) 320 Kbps.mp3' },
        { title: 'Willow — Taylor Swift', src: 'songs/taylor swift/Willow Evermore (deluxe Version) 320 Kbps.mp3' },
        { title: 'Afsos — Anuv Jain', src: 'songs/ap dhillon/Afsos Anuv Jain 320 Kbps.mp3' }
      ]
    },
    {
      id: 'focus',
      title: 'Deep Focus',
      description: 'Stay in flow with steady, non-intrusive beats.',
      cover: 'songs/focus/ab67706f000000026020f2f6476db518ef747da4.jpeg',
      tracks: [
        { title: 'Don — Diljit Dosanjh', src: 'songs/diljit/Don Diljit Dosanjh 320 Kbps.mp3' },
        { title: 'Magic — Diljit Dosanjh', src: 'songs/diljit/Magic Diljit Dosanjh 320 Kbps.mp3' },
        { title: 'Stfu — OKAY STFU', src: 'songs/ap dhillon/Stfu Okay Stfu 320 Kbps.mp3' }
      ]
    },
    {
      id: 'party',
      title: 'Party Starter',
      description: 'High-energy tracks to light up the room.',
      cover: 'songs/party/ab67706c0000da844a17d322a602741fe49fcf5a.jpeg',
      tracks: [
        { title: '48 — Rhymes', src: 'songs/Karan aujla/48 Rhymes Karan Aujla 320 Kbps.mp3' },
        { title: 'Boyfriend — P Pop Culture', src: 'songs/Karan aujla/Boyfriend P Pop Culture 320 Kbps.mp3' },
        { title: 'Daytona — P Pop Culture', src: 'songs/Karan aujla/Daytona P Pop Culture 320 Kbps.mp3' }
      ]
    },
    {
      id: 'melancholy',
      title: 'Melancholy Nights',
      description: 'Moody melodies for late-night reflection.',
      cover: 'songs/melancholy/ab67706c0000da8427577bd1aad9449110e5feb0.jpeg',
      tracks: [
        { title: 'Bluff — Loverboy', src: 'songs/karan randhawa/Bluff Loverboy 320 Kbps.mp3' },
        { title: 'Ranjna — Loverboy', src: 'songs/karan randhawa/Ranjna Loverboy 320 Kbps.mp3' },
        { title: 'Sohniye — Loverboy', src: 'songs/karan randhawa/Sohniye Loverboy 320 Kbps.mp3' }
      ]
    }
  ];

  function attachCardClicks(container){
    container.querySelectorAll('.card').forEach(function attach(cardEl){
      cardEl.addEventListener('click', function onClick(){
        var pid = cardEl.getAttribute('data-playlist');
        openPlaylist(pid);
      });
    });
  }

  function renderPlaylistsFrom(list){
    cardContainer.innerHTML = list.map(function mapPlaylist(p) {
      return (
        '<div class="card" data-playlist="' + p.id + '">' +
          '<div class="play">' +
            '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="play-icon">' +
              '<circle cx="12" cy="12" r="12" class="play-bg" />' +
              '<polygon points="9,7 9,17 17,12" class="play-triangle" />' +
            '</svg>' +
          '</div>' +
          '<img data-plid="' + p.id + '" src="' + (p.cover || defaultCover) + '" alt="' + p.title + '" />' +
          '<h2>' + p.title + '</h2>' +
          '<p>' + p.description + '</p>' +
        '</div>'
      );
    }).join('');
    attachCardClicks(cardContainer);
    // Resolve covers asynchronously to handle missing files
    list.forEach(function(p){
      resolveCover(p, function(url){
        const img = cardContainer.querySelector('img[data-plid="' + p.id + '"]');
        if (img) img.src = url;
      });
    });
  }

  function renderPlaylists() {
    renderPlaylistsFrom(playlists);
  }

  renderPlaylists();
  if (playlistGridSection) playlistGridSection.style.display = 'block';

  // --- Memory Lane playlist generation (from melancholy, preferring songs/memory-lane/) ---
  function buildMemoryLane(){
    const melancholy = playlists.find(function(p){ return p.id === 'melancholy'; });
    if (!melancholy) return null;
    const THIRTY_DAYS = 30 * 24 * 60 * 60 * 1000;
    const hist = loadHistory();
    const pool = melancholy.tracks.slice();
    // Prefer tracks not played in >30 days; include some random if few matches
    const aged = pool.filter(function(t){
      const rec = hist[encodeURI(t.src)];
      if (!rec || !rec.lastPlayed) return true; // treat never played as eligible
      return (Date.now() - rec.lastPlayed) > THIRTY_DAYS;
    });
    const source = (aged.length >= 5) ? aged : pool;
    // Shuffle
    const shuffled = source.slice().sort(function(){ return Math.random() - 0.5; });
    const take = shuffled.slice(0, Math.min(15, shuffled.length));
    function preferMemoryLanePath(src){
      const name = src.split('/').pop();
      return 'songs/memory-lane/' + name;
    }
    const tracks = take.map(function(t){
      return {
        title: t.title,
        // keep original source and provide memory-lane variant as alt
        src: t.src,
        altSrc: preferMemoryLanePath(t.src),
        caption: getMemoryCaption(t)
      };
    });
    return {
      id: 'memory-lane',
      title: 'Memory Lane',
      description: 'You haven\'t heard these in a while',
      cover: 'songs/@ab67616d0000b273e1b99462d01597686c1b947f.jpeg',
      tracks: tracks
    };
  }
  // Insert/refresh Memory Lane into playlists and re-render grid
  (function initMemoryLane(){
    const existingIdx = playlists.findIndex(function(p){ return p.id === 'memory-lane'; });
    const built = buildMemoryLane();
    if (built){
      if (existingIdx >= 0) playlists.splice(existingIdx, 1, built); else playlists.push(built);
      renderPlaylistsFrom(playlists);
    }
  })();

  // --- XP/Achievements state ---
  const XP_KEY = 'xp_state_v1';
  const XP_BADGES = [
    { id: 'explorer-1', name: 'Explorer I', req: 5 },
    { id: 'explorer-2', name: 'Explorer II – Indie Scout', req: 12 },
    { id: 'genre-hopper', name: 'Genre Hopper', req: 20 }
  ];
  let xpState = { xp: 0, level: 1, artists: {}, genres: {} };
  try { xpState = Object.assign(xpState, JSON.parse(localStorage.getItem(XP_KEY)||'{}')); } catch(e){}

  function xpForNext(level){ return 20 + (level-1)*20; }
  function saveXP(){ localStorage.setItem(XP_KEY, JSON.stringify(xpState)); }
  function renderXP(){
    if (xpLevelEl) xpLevelEl.textContent = xpState.level;
    if (xpPointsEl) xpPointsEl.textContent = xpState.xp;
    const need = xpForNext(xpState.level);
    const pct = Math.max(0, Math.min(100, (xpState.xp/need)*100));
    if (xpFillEl) xpFillEl.style.width = pct + '%';
    if (xpBadgesEl){
      xpBadgesEl.innerHTML = XP_BADGES.map(function(b){
        const unlocked = xpState.xp >= b.req;
        return '<li class="' + (unlocked?'unlocked':'') + '">' + b.name + '</li>';
      }).join('');
    }
  }
  renderXP();

  // Reset XP/achievements
  if (xpResetBtn) {
    xpResetBtn.addEventListener('click', function(){
      if (!confirm('Reset achievements progress?')) return;
      xpState = { xp: 0, level: 1, artists: {}, genres: {} };
      try { localStorage.removeItem(XP_KEY); } catch(e){}
      saveXP();
      renderXP();
    });
  }

  function awardXP(amount){
    const beforeLevel = xpState.level;
    xpState.xp += amount;
    const need = xpForNext(xpState.level);
    if (xpState.xp >= need){
      xpState.xp -= need;
      xpState.level += 1;
    }
    saveXP();
    renderXP();
    if (xpState.level > beforeLevel) {
      celebrateLevelUp();
    }
  }

  function celebrateLevelUp(){
    try {
      const container = document.createElement('div');
      container.className = 'confetti-container';
      const colors = ['#1db954','#fff','#22c55e','#f59e0b','#6366f1','#4fd1c5'];
      const pieces = 80;
      for (let i = 0; i < pieces; i++) {
        const el = document.createElement('div');
        el.className = 'confetti-piece';
        el.style.left = Math.random() * 100 + 'vw';
        el.style.background = colors[i % colors.length];
        el.style.animationDelay = (Math.random() * 200) + 'ms';
        el.style.transform = 'translateY(-12px) rotate(' + (Math.random()*360) + 'deg)';
        el.style.width = (6 + Math.random()*6) + 'px';
        el.style.height = (10 + Math.random()*10) + 'px';
        container.appendChild(el);
      }
      document.body.appendChild(container);
      setTimeout(function(){
        if (container && container.parentNode) container.parentNode.removeChild(container);
      }, 1600);
    } catch(e){}
  }

  // Mood DJ logic
  const MOOD_KEY = 'mood_dj_recent';
  function setAccentByMood(mood){
    const root = document.documentElement;
    const map = {
      chill: ['#22c55e','linear-gradient(180deg,#1e293b,rgba(0,0,0,0))'],
      focus: ['#4fd1c5','linear-gradient(180deg,#1f2937,rgba(0,0,0,0))'],
      party: ['#f59e0b','linear-gradient(180deg,#3f1f1f,rgba(0,0,0,0))'],
      melancholy: ['#6366f1','linear-gradient(180deg,#1f1f3f,rgba(0,0,0,0))']
    };
    const tuple = map[mood] || ['#1db954','linear-gradient(180deg,#2a2a2a,rgba(0,0,0,0))'];
    root.style.setProperty('--accent', tuple[0]);
    root.style.setProperty('--gradient', tuple[1]);
    // default nav gradient from accent
    root.style.setProperty('--nav-gradient', 'linear-gradient(180deg,'+tuple[0]+', rgba(0,0,0,0))');
  }

  function rememberMood(mood){
    const arr = JSON.parse(localStorage.getItem(MOOD_KEY) || '[]');
    arr.unshift({ mood, ts: Date.now() });
    const pruned = arr.slice(0,5);
    localStorage.setItem(MOOD_KEY, JSON.stringify(pruned));
    // Recent display removed
    if (moodRecent) moodRecent.textContent = '';
  }

  function applyMood(mood){
    setAccentByMood(mood);
    rememberMood(mood);
    // Do not reshuffle the grid; mood buttons should open the specific mood playlist
    // Leave sections as-is; the click handler will call openPlaylist for the matched mood
  }

  if (moodButtons && moodButtons.length){
    function setActiveMoodButton(mood){
      moodButtons.forEach(function(b){ b.classList.toggle('active', b.getAttribute('data-mood') === mood); });
    }
    moodButtons.forEach(function(btn){
      btn.addEventListener('click', function(){
        const mood = btn.getAttribute('data-mood');
        const plId = btn.getAttribute('data-playlist');
        setActiveMoodButton(mood);
        applyMood(mood);
        localStorage.setItem('mood_dj_selected', mood);
        // If a specific mood playlist exists, open it directly
        if (plId) {
          // Expect a playlist with id equal to data-playlist (e.g., 'chill')
          const found = playlists.find(function(p){ return p.id === plId; });
          if (found) {
            openPlaylist(found.id);
            return;
          }
        }
        // fallback: open a playlist whose id matches the mood
        const byMood = playlists.find(function(p){ return p.id === mood; });
        if (byMood) { openPlaylist(byMood.id); }
      });
    });
    // load recent
    try {
      const arr = JSON.parse(localStorage.getItem(MOOD_KEY) || '[]');
      if (moodRecent) moodRecent.textContent = '';
      // Do not auto-select a mood on load
      setActiveMoodButton('');
    } catch(e){}
  }

  function openPlaylist(id){
    // Regenerate Memory Lane on open so it always reflects latest history
    if (id === 'memory-lane') {
      const rebuilt = buildMemoryLane();
      if (rebuilt) {
        const idx = playlists.findIndex(function(x){ return x.id === 'memory-lane'; });
        if (idx >= 0) playlists.splice(idx, 1, rebuilt); else playlists.push(rebuilt);
      }
    }
    var p = playlists.find(function find(x){ return x.id === id; });
    if (!p || !detailSection) return;

    // If opening a Mood DJ playlist, try to load tracks from songs/<mood>/manifest.json
    function ensureMoodTracksLoaded(pl, onDone){
      const moodIds = { chill:1, focus:1, party:1, melancholy:1 };
      if (!pl || !moodIds[pl.id]) { onDone(); return; }
      const manifestUrl = 'songs/' + pl.id + '/manifest.json';
      function fileNameToTitle(name){
        try{
          const base = name.replace(/\.[^/.]+$/, '');
          return base.replace(/[\-_]+/g, ' ').replace(/\s+/g, ' ').trim();
        } catch(e){ return name; }
      }
      try {
        fetch(manifestUrl, { cache: 'no-store' }).then(function(r){ return r.ok ? r.json() : null; }).then(function(data){
          if (data && Array.isArray(data.tracks)){
            pl.tracks = data.tracks.map(function(t){
              if (typeof t === 'string') {
                return { title: fileNameToTitle(t), src: 'songs/' + pl.id + '/' + t };
              }
              const src = (t.src || '').startsWith('songs/') ? t.src : ('songs/' + pl.id + '/' + (t.src||''));
              return { title: t.title || fileNameToTitle(t.src||''), src: src };
            });
          }
          onDone();
        }).catch(function(){ onDone(); });
      } catch(e){ onDone(); }
    }

    ensureMoodTracksLoaded(p, function(){
    // Remember the current playlist for prev/next controls
    currentPlaylist = p;

    // Header/meta
    if (detailCover) {
      resolveCover(p, function(url){
        detailCover.style.backgroundImage = 'url("' + url + '")';
      });
    }
    // Compute header and navbar gradient from cover dominant edge (fast sample)
    try {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = function(){
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = 20; canvas.height = 20;
        ctx.drawImage(img, 0, 0, 20, 20);
        const data = ctx.getImageData(0, 0, 20, 20).data;
        let r=0,g=0,b=0,count=0;
        for (let i=0;i<data.length;i+=4){ r+=data[i]; g+=data[i+1]; b+=data[i+2]; count++; }
        r=Math.round(r/count); g=Math.round(g/count); b=Math.round(b/count);
        const top = `rgba(${r},${g},${b},0.55)`;
        document.documentElement.style.setProperty('--header-bg', `linear-gradient(180deg, ${top}, rgba(0,0,0,0))`);
        // Adapt navbar/accent for Mood DJ playlists and Memory Lane
        if (p.id === 'chill' || p.id === 'focus' || p.id === 'party' || p.id === 'melancholy' || p.id === 'memory-lane') {
          const accent = `rgb(${r},${g},${b})`;
          document.documentElement.style.setProperty('--accent', accent);
          document.documentElement.style.setProperty('--nav-gradient', `linear-gradient(180deg, ${accent}, rgba(0,0,0,0))`);
        }
      };
      // Use resolved url again
      resolveCover(p, function(url){ img.src = url; });
    } catch(e){}
    if (detailTitle) detailTitle.textContent = p.title;
    if (detailDesc) detailDesc.textContent = p.description;
    if (detailStats) detailStats.textContent = p.tracks.length + ' songs';

    // build queue UI
    if (queueList) {
      queueList.innerHTML = p.tracks.map(function(t, i){
        return '<div class="queue-item">' + (i+1) + '. ' + t.title + '</div>';
      }).join('');
    }

    // Tracks
    if (detailBody) {
      detailBody.innerHTML = p.tracks.map(function mapTrack(t, idx){
        const caption = t.caption ? ('<span class="caption">' + t.caption + '</span>') : '';
        return (
          '<div class="track-row" data-index="' + idx + '">' +
            '<span class="index">' +
              '<span class="num">' + (idx+1) + '</span>' +
              '<svg class="play-mini" viewBox="0 0 24 24" aria-hidden="true" focusable="false" width="16" height="16">' +
                '<path fill="currentColor" d="M8 5v14l11-7z"></path>' +
              '</svg>' +
            '</span>' +
            '<span class="title">' + t.title + caption + '</span>' +
            '<span class="album">—</span>' +
            '<span class="duration">3:17</span>' +
          '</div>'
        );
      }).join('');

      // Row click hook
      detailBody.querySelectorAll('.track-row').forEach(function(row){
        row.addEventListener('click', function(){
          setPlayingRow(row);
          const idx = parseInt(row.getAttribute('data-index'), 10);
          playTrack(p, idx);
        });
      });
    }

    // Show detail, hide grid title but keep playbar
    if (playlistGridSection) playlistGridSection.style.display = 'none';
    detailSection.style.display = 'block';

    // push state so browser/nav chevrons can go back
    try { history.pushState({ view: 'detail', id: id }, '', '#'+id); } catch (e) {}
  });
  }

  function showGrid(){
    if (detailSection) detailSection.style.display = 'none';
    if (playlistGridSection) playlistGridSection.style.display = 'block';
    // Reset navbar gradient when not in mood playlist detail
    document.documentElement.style.setProperty('--nav-gradient', '#1f1f1f');
    // Also reset accent to default when leaving a mood page
    document.documentElement.style.setProperty('--accent', '#1db954');
  }

  // Navbar chevrons
  if (navBack) navBack.addEventListener('click', function(){
    if (detailSection && detailSection.style.display !== 'none') {
      showGrid();
      try { history.pushState({ view: 'grid' }, '', '#'); } catch (e) {}
    }
  });
  if (navForward) navForward.addEventListener('click', function(){
    // simple forward: reopen last playlist if hash exists
    const id = (location.hash || '').replace('#','');
    if (id) openPlaylist(id);
  });

  // Browser back/forward support
  window.addEventListener('popstate', function(){
    const id = (location.hash || '').replace('#','');
    if (id) {
      openPlaylist(id);
    } else {
      showGrid();
    }
  });

  // Optional: update progress/time in playbar if present
  const currentTimeEl = document.querySelector('.current-time');
  const totalTimeEl = document.querySelector('.total-time');
  const progressEl = document.querySelector('.progress');
  function formatTime(sec){
    if (!isFinite(sec)) return '0:00';
    const m = Math.floor(sec/60);
    const s = Math.floor(sec%60).toString().padStart(2,'0');
    return m + ':' + s;
  }
  if (audio) {
    audio.addEventListener('loadedmetadata', function(){
      if (totalTimeEl) totalTimeEl.textContent = formatTime(audio.duration);
    });
    audio.addEventListener('timeupdate', function(){
      if (currentTimeEl) currentTimeEl.textContent = formatTime(audio.currentTime);
      if (progressEl && audio.duration) {
        const pct = (audio.currentTime / audio.duration) * 100;
        progressEl.style.width = Math.min(100, Math.max(0, pct)) + '%';
      }
      // throttle-save current time (cheap: every event but with try/catch)
      try {
        const st = JSON.parse(localStorage.getItem(LAST_PLAY_KEY)||'{}');
        if (st && typeof st === 'object') {
          st.time = Math.floor(audio.currentTime||0);
          localStorage.setItem(LAST_PLAY_KEY, JSON.stringify(st));
        }
      } catch(e){}
    });
    audio.addEventListener('play', function(){ if (toggleIcon) toggleIcon.textContent = '❙❙'; });
    audio.addEventListener('pause', function(){ if (toggleIcon) toggleIcon.textContent = '▶'; });
  }

  // play/pause toggle
  if (btnToggle) btnToggle.addEventListener('click', function(){
    if (!audio) return;
    if (audio.paused) {
      // If no source yet, attempt resume from last saved state
      if (!audio.src) {
        try {
          const st = JSON.parse(localStorage.getItem(LAST_PLAY_KEY)||'null');
          if (st && st.pid) {
            // ensure Memory Lane is fresh if resuming it
            if (st.pid === 'memory-lane') {
              const rebuilt = buildMemoryLane();
              if (rebuilt) {
                const idx = playlists.findIndex(function(x){ return x.id === 'memory-lane'; });
                if (idx >= 0) playlists.splice(idx, 1, rebuilt); else playlists.push(rebuilt);
              }
            }
            const pl = playlists.find(function(p){ return p.id === st.pid; }) || playlists[0];
            // open to set header/queue/UI, then play desired index
            openPlaylist(pl.id);
            // wait a tick to ensure DOM updated
            setTimeout(function(){
              playTrack(pl, Math.max(0, Math.min((pl.tracks.length-1), st.index||0)));
              // seek to saved time after metadata
              const to = Math.max(0, st.time||0);
              audio.addEventListener('loadedmetadata', function once(){
                audio.currentTime = Math.min(audio.duration||to, to);
                audio.removeEventListener('loadedmetadata', once);
              });
            }, 0);
          }
        } catch(e){}
      }
      if (toggleIcon) toggleIcon.textContent = '❙❙';
      btnToggle.setAttribute('title', 'Pause');
      audio.play().catch(function(){
        if (toggleIcon) toggleIcon.textContent = '▶';
        btnToggle.setAttribute('title', 'Play');
      });
    } else {
      if (toggleIcon) toggleIcon.textContent = '▶';
      btnToggle.setAttribute('title', 'Play');
      audio.pause();
    }
  });

  // Seek by clicking progress bar
  if (progressBar && audio) {
    progressBar.addEventListener('click', function(e){
      const rect = progressBar.getBoundingClientRect();
      const pct = (e.clientX - rect.left) / rect.width;
      if (audio.duration) audio.currentTime = Math.max(0, Math.min(audio.duration, pct * audio.duration));
    });
  }

  // Queue interactions: click to play; drag to reorder
  if (queueList) {
    queueList.addEventListener('click', function(e){
      const item = e.target.closest('.queue-item');
      if (!item || !currentPlaylist) return;
      const idx = Array.from(queueList.children).indexOf(item);
      if (idx >= 0) playTrack(currentPlaylist, idx);
    });

    // enable drag and drop
    const enableDnD = function(){
      Array.from(queueList.children).forEach(function(el){ el.draggable = true; });
    };
    enableDnD();
    let dragEl = null;
    queueList.addEventListener('dragstart', function(e){ dragEl = e.target.closest('.queue-item'); });
    queueList.addEventListener('dragover', function(e){ e.preventDefault(); });
    queueList.addEventListener('drop', function(e){
      e.preventDefault();
      const dropEl = e.target.closest('.queue-item');
      if (!dragEl || !dropEl || dragEl === dropEl) return;
      if (dragEl.compareDocumentPosition(dropEl) & Node.DOCUMENT_POSITION_FOLLOWING) {
        queueList.insertBefore(dropEl, dragEl);
      } else {
        queueList.insertBefore(dragEl, dropEl);
      }
      // sync playlist order
      if (currentPlaylist) {
        const newTracks = Array.from(queueList.children).map(function(child){
          const title = child.textContent.replace(/^\d+\.\s*/, '');
          return currentPlaylist.tracks.find(function(t){ return t.title === title; }) || currentPlaylist.tracks[0];
        });
        currentPlaylist.tracks = newTracks;
      }
    });
  }

  // prev/next
  if (btnPrev) btnPrev.addEventListener('click', function(){
    if (!currentPlaylist || !currentPlaylist.tracks.length) return;
    const len = currentPlaylist.tracks.length;
    const idx = currentIndex === -1 ? (len - 1) : ((currentIndex - 1 + len) % len);
    playTrack(currentPlaylist, idx);
  });
  if (btnNext) btnNext.addEventListener('click', function(){
    if (!currentPlaylist || !currentPlaylist.tracks.length) return;
    const len = currentPlaylist.tracks.length;
    const idx = currentIndex === -1 ? 0 : ((currentIndex + 1) % len);
    playTrack(currentPlaylist, idx);
  });

  // queue toggle
  if (btnQueue && queuePanel) btnQueue.addEventListener('click', function(){
    queuePanel.style.display = (queuePanel.style.display === 'none' || queuePanel.style.display === '') ? 'block' : 'none';
  });

  // Auto-play next on track end
  if (audio) {
    audio.addEventListener('ended', function(){
      if (!currentPlaylist || !currentPlaylist.tracks.length) return;
      const len = currentPlaylist.tracks.length;
      const idx = currentIndex === -1 ? 0 : ((currentIndex + 1) % len);
      playTrack(currentPlaylist, idx);
    });
  }

  function setPlayingRow(row){
    document.querySelectorAll('.track-row.playing').forEach(function(r){ r.classList.remove('playing'); });
    row.classList.add('playing');
  }

  if (playAllBtn) {
    playAllBtn.addEventListener('click', function(){
      if (!detailBody) return;
      const first = detailBody.querySelector('.track-row');
      if (first) {
        setPlayingRow(first);
        playTrack(currentPlaylist || playlists.find(function(x){ return ('#'+x.id) === location.hash; }) || playlists[0], 0);
      }
    });
  }
});


