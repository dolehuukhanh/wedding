/* ===== Wedding Invitation - Main Script ===== */

(function () {
    'use strict';

    // ===== CONFIG =====
    const WEDDING_DATE = new Date('2026-06-09T09:00:00+07:00');

    // ===== INTRO SCREEN - NEW SEQUENCE =====
    const introScreen = document.getElementById('introScreen');
    const introClouds = document.getElementById('introClouds');
    const doorContainer = document.querySelector('.door-container');
    const envelopeWrapper = document.getElementById('envelopeWrapper');
    const envelope = document.getElementById('envelope');
    const mainContent = document.getElementById('mainContent');

    // Auto-play intro sequence with realistic clouds
    function startIntroSequence() {
        // Step 1: After 1.1s, clouds start to open (slower, more dramatic)
        setTimeout(() => {
            introClouds.classList.add('open');
            if (doorContainer) {
                doorContainer.classList.add('open');
            }
        }, 1100);
        
        // Envelope sẽ hiển thị và chờ user click - KHÔNG tự động ẩn
    }

    // Start intro sequence on page load
    startIntroSequence();

    // Handle envelope click/touch to open and show main content
    if (envelope) {
        const openEnvelope = () => {
            // Prevent multiple clicks
            if (envelope.classList.contains('opening')) return;
            
            // Add opening class to trigger envelope opening animation
            envelope.classList.add('opening');

            // After envelope opens, transition to main content
            setTimeout(() => {
                introScreen.classList.add('hidden');
                mainContent.style.display = 'block';

                // Trigger main content fade in
                setTimeout(() => {
                    mainContent.classList.add('visible');
                }, 50);
            }, 1200);
        };

        // Support both click and touch events
        envelope.addEventListener('click', openEnvelope);
        envelope.addEventListener('touchend', (e) => {
            e.preventDefault();
            openEnvelope();
        });
    }

    // Create falling stars and sakura petals effect (only on intro screen)
    function createPetal() {
        if (introScreen && !introScreen.classList.contains('hidden')) {
            const petal = document.createElement("span");
            
            // Randomly choose between star and sakura (50/50)
            const isStar = Math.random() > 0.5;
            petal.className = isStar ? "petal star" : "petal sakura";
            
            petal.style.left = Math.random() * 100 + "vw";
            petal.style.animationDuration = Math.random() * 4 + 6 + "s";
            petal.style.opacity = Math.random() * 0.4 + 0.5;
            petal.style.setProperty("--drift", (Math.random() * 200 - 100) + "px");
            petal.style.setProperty("--rotation", (Math.random() * 360 + 360) + "deg");
            
            // Random colors for stars and sakura
            if (isStar) {
                const starColors = [
                    'rgba(255,215,0,.85)',
                    'rgba(255,255,255,.9)',
                    'rgba(255,192,203,.85)',
                    'rgba(173,216,230,.85)'
                ];
                const color = starColors[Math.floor(Math.random() * starColors.length)];
                petal.style.setProperty("--petal-color", color);
            } else {
                const sakuraColors = [
                    'rgba(255,182,193,.85)',
                    'rgba(255,192,203,.9)',
                    'rgba(255,228,225,.85)',
                    'rgba(255,240,245,.9)'
                ];
                const color = sakuraColors[Math.floor(Math.random() * sakuraColors.length)];
                petal.style.setProperty("--petal-color", color);
            }
            
            introScreen.appendChild(petal);

            setTimeout(() => {
                petal.remove();
            }, 10500);
        }
    }

    // Start petal animations after clouds open
    setTimeout(() => {
        setInterval(createPetal, 350);
    }, 1100);

    // ===== SMOOTH SCROLL =====
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', e => {
            e.preventDefault();
            const target = document.querySelector(anchor.getAttribute('href'));
            if (target) target.scrollIntoView({ behavior: 'smooth' });
        });
    });

    // ===== NAVIGATION SHOW ON SCROLL =====
    const nav = document.getElementById('nav');
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
        const y = window.scrollY;
        nav.classList.toggle('visible', y > window.innerHeight * 0.5);
        lastScroll = y;
    });

    // ===== INTERSECTION OBSERVER - REVEAL ON SCROLL =====
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

    // ===== COUNTDOWN TIMER =====
    function updateCountdown() {
        const now = new Date();
        const diff = WEDDING_DATE - now;
        if (diff <= 0) {
            document.getElementById('cdDays').textContent = '0';
            document.getElementById('cdHours').textContent = '00';
            document.getElementById('cdMins').textContent = '00';
            document.getElementById('cdSecs').textContent = '00';
            return;
        }
        const d = Math.floor(diff / 86400000);
        const h = Math.floor((diff % 86400000) / 3600000);
        const m = Math.floor((diff % 3600000) / 60000);
        const s = Math.floor((diff % 60000) / 1000);
        document.getElementById('cdDays').textContent = String(d);
        document.getElementById('cdHours').textContent = String(h).padStart(2, '0');
        document.getElementById('cdMins').textContent = String(m).padStart(2, '0');
        document.getElementById('cdSecs').textContent = String(s).padStart(2, '0');
    }
    updateCountdown();
    setInterval(updateCountdown, 1000);

    // ===== LIGHTBOX =====
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const galleryItems = document.querySelectorAll('.gallery__item');
    let currentImg = 0;

    galleryItems.forEach((item, i) => {
        item.addEventListener('click', () => {
            currentImg = i;
            lightboxImg.src = item.dataset.src;
            lightbox.classList.add('active');
        });
    });
    document.getElementById('lightboxClose').addEventListener('click', () => lightbox.classList.remove('active'));
    document.getElementById('lightboxPrev').addEventListener('click', () => {
        currentImg = (currentImg - 1 + galleryItems.length) % galleryItems.length;
        lightboxImg.src = galleryItems[currentImg].dataset.src;
    });
    document.getElementById('lightboxNext').addEventListener('click', () => {
        currentImg = (currentImg + 1) % galleryItems.length;
        lightboxImg.src = galleryItems[currentImg].dataset.src;
    });
    lightbox.addEventListener('click', e => { if (e.target === lightbox) lightbox.classList.remove('active'); });
    document.addEventListener('keydown', e => {
        if (!lightbox.classList.contains('active')) return;
        if (e.key === 'Escape') lightbox.classList.remove('active');
        if (e.key === 'ArrowLeft') document.getElementById('lightboxPrev').click();
        if (e.key === 'ArrowRight') document.getElementById('lightboxNext').click();
    });

    // ===== GOOGLE SHEETS CONFIG =====
    // Hướng dẫn: Tạo Google Apps Script Web App để nhận và đọc dữ liệu
    // 1. Mở Google Sheets → Extensions → Apps Script
    // 2. Paste đoạn code bên dưới vào Apps Script, Deploy as Web App
    // 3. Khi Deploy, chọn "Anyone" có thể truy cập
    // 4. Thay URL bên dưới bằng URL Web App của bạn
    /*
    // === Google Apps Script Code (paste vào Apps Script) ===
    function doPost(e) {
      var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
      var data;
      try {
        data = JSON.parse(e.postData.contents);
      } catch(err) {
        data = e.parameter;
      }
      sheet.appendRow([
        new Date(),
        data.type || '',
        data.name || '',
        data.attend || '',
        data.side || '',
        data.guests || '',
        data.message || ''
      ]);
      return ContentService.createTextOutput(JSON.stringify({status:'ok'}))
        .setMimeType(ContentService.MimeType.JSON);
    }

    function doGet(e) {
      var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
      var action = e.parameter.action;
      
      if (action === 'getWishes') {
        var data = sheet.getDataRange().getValues();
        var wishes = [];
        
        // Bỏ qua dòng header (dòng 1)
        for (var i = 1; i < data.length; i++) {
          var row = data[i];
          // Chỉ lấy những dòng có type = 'wish'
          if (row[1] === 'wish' && row[2] && row[6]) {
            wishes.push({
              name: row[2],
              msg: row[6]
            });
          }
        }
        
        // Đảo ngược để lời chúc mới nhất lên đầu
        wishes.reverse();
        
        return ContentService.createTextOutput(JSON.stringify({
          status: 'ok',
          wishes: wishes
        })).setMimeType(ContentService.MimeType.JSON);
      }
      
      return ContentService.createTextOutput(JSON.stringify({status:'ok'}))
        .setMimeType(ContentService.MimeType.JSON);
    }
    */
    const GOOGLE_SHEET_URL = 'https://script.google.com/macros/s/AKfycbxrSJyldPqtIqNWBIMHqBEnXdXIwqdg1kgB9KZ_Rq62QpLRfOaTDQFtmc5sGv0Iznhl/exec';

    function sendToSheet(data) {
        if (!GOOGLE_SHEET_URL || GOOGLE_SHEET_URL === 'YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL') {
            console.log('[Sheet] Chưa cấu hình URL. Data:', data);
            return;
        }
        fetch(GOOGLE_SHEET_URL, {
            method: 'POST',
            mode: 'no-cors',
            body: JSON.stringify(data)
        }).catch(err => console.warn('Sheet error:', err));
    }

    // Load lời chúc từ Google Sheets
    async function loadWishesFromSheet() {
        if (!GOOGLE_SHEET_URL || GOOGLE_SHEET_URL === 'YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL') {
            console.log('[Sheet] Chưa cấu hình URL để load wishes');
            return;
        }
        
        try {
            const response = await fetch(GOOGLE_SHEET_URL + '?action=getWishes');
            const result = await response.json();
            
            if (result.status === 'ok' && result.wishes) {
                // Lưu vào localStorage để cache
                localStorage.setItem('wedding_wishes', JSON.stringify(result.wishes));
                renderWishesCredits();
                console.log('[Sheet] Đã load', result.wishes.length, 'lời chúc từ Google Sheets');
            }
        } catch (err) {
            console.warn('[Sheet] Không thể load wishes:', err);
            // Fallback: dùng localStorage nếu có
            renderWishesCredits();
        }
    }

    // ===== RSVP FORM =====
    document.getElementById('rsvpForm').addEventListener('submit', e => {
        e.preventDefault();
        const form = e.target;
        const attend = form.querySelector('input[name="rsvpAttend"]:checked');
        const side = form.querySelector('input[name="rsvpSide"]:checked');
        sendToSheet({
            type: 'rsvp',
            name: document.getElementById('rsvpName').value.trim(),
            attend: attend ? attend.value : '',
            side: side ? side.value : '',
            guests: document.getElementById('rsvpGuests').value,
            message: document.getElementById('rsvpMessage').value.trim()
        });
        document.getElementById('rsvpForm').style.display = 'none';
        document.getElementById('rsvpSuccess').style.display = 'block';
    });

    // ===== MOBILE GALLERY SLIDER =====
    const galleryMobileSlider = document.getElementById('galleryMobileSlider');
    const galleryMainImg = document.getElementById('galleryMainImg');
    const galleryThumbnails = document.querySelectorAll('.gallery__thumb');
    let currentGalleryIndex = 0;
    let galleryAutoSlideInterval;

    // Click main image to open lightbox
    if (galleryMainImg) {
        galleryMainImg.addEventListener('click', () => {
            lightboxImg.src = galleryMainImg.src;
            lightbox.classList.add('active');
        });
    }

    // Click thumbnail to change main image
    galleryThumbnails.forEach((thumb, index) => {
        thumb.addEventListener('click', (e) => {
            e.preventDefault(); // Prevent default behavior
            currentGalleryIndex = index;
            updateGalleryImage();
            resetGalleryAutoSlide();
        });
    });

    function updateGalleryImage() {
        const newSrc = galleryThumbnails[currentGalleryIndex].dataset.src;
        galleryMainImg.style.opacity = '0.5';
        
        setTimeout(() => {
            galleryMainImg.src = newSrc;
            galleryMainImg.style.opacity = '1';
        }, 250);

        // Update active thumbnail
        galleryThumbnails.forEach((thumb, i) => {
            thumb.classList.toggle('active', i === currentGalleryIndex);
        });

        // Scroll thumbnail into view WITHOUT scrolling the page
        const thumbnailsContainer = document.getElementById('galleryThumbnails');
        const activeThumb = galleryThumbnails[currentGalleryIndex];
        
        if (thumbnailsContainer && activeThumb) {
            const containerRect = thumbnailsContainer.getBoundingClientRect();
            const thumbRect = activeThumb.getBoundingClientRect();
            const scrollLeft = activeThumb.offsetLeft - (containerRect.width / 2) + (thumbRect.width / 2);
            
            thumbnailsContainer.scrollTo({
                left: scrollLeft,
                behavior: 'smooth'
            });
        }
    }

    function nextGalleryImage() {
        currentGalleryIndex = (currentGalleryIndex + 1) % galleryThumbnails.length;
        updateGalleryImage();
    }

    function startGalleryAutoSlide() {
        galleryAutoSlideInterval = setInterval(nextGalleryImage, 5000);
    }

    function resetGalleryAutoSlide() {
        clearInterval(galleryAutoSlideInterval);
        startGalleryAutoSlide();
    }

    // Start auto-slide if mobile slider is visible
    if (galleryMobileSlider && window.innerWidth <= 768) {
        startGalleryAutoSlide();
    }

    // ===== GUESTBOOK CREDITS =====
    const guestbookCredits = document.getElementById('guestbookCredits');
    
    function renderWishesCredits() {
        const wishes = JSON.parse(localStorage.getItem('wedding_wishes') || '[]');
        guestbookCredits.innerHTML = wishes.map(w => `
            <div class="guestbook__credits-item">
                <p class="guestbook__credits-name">${escapeHtml(w.name)}</p>
                <p class="guestbook__credits-msg">${escapeHtml(w.msg)}</p>
                <div class="guestbook__credits-divider"></div>
            </div>
        `).join('');

        // Adjust animation duration based on content length
        const itemCount = wishes.length;
        const duration = Math.max(30, itemCount * 10); // 10s per wish, min 30s
        guestbookCredits.style.animationDuration = `${duration}s`;
    }

    function escapeHtml(str) {
        const d = document.createElement('div');
        d.textContent = str;
        return d.innerHTML;
    }

    // Initialize wishes - Load từ Google Sheets khi trang load
    loadWishesFromSheet();

    document.getElementById('guestbookForm').addEventListener('submit', e => {
        e.preventDefault();
        const name = document.getElementById('wishName').value.trim();
        const msg = document.getElementById('wishMessage').value.trim();
        if (!name || !msg) return;
        
        // Gửi lên Google Sheets
        sendToSheet({ type: 'wish', name, message: msg, attend: '', side: '', guests: '' });
        
        // Cập nhật localStorage ngay lập tức để hiển thị
        const wishes = JSON.parse(localStorage.getItem('wedding_wishes') || '[]');
        wishes.unshift({ name, msg });
        localStorage.setItem('wedding_wishes', JSON.stringify(wishes));
        
        renderWishesCredits();
        e.target.reset();

        // Show success message
        alert('Cảm ơn lời chúc của bạn! ❤️');
        
        // Reload lại từ Sheets sau 2 giây để đồng bộ
        setTimeout(() => {
            loadWishesFromSheet();
        }, 2000);
    });

    // ===== MUSIC PLAYLIST =====
    const music = document.getElementById('bgMusic');
    const musicBtn = document.getElementById('musicToggle');
    let musicPlaying = false;
    let currentTrack = 0;

    // Playlist nhạc đám cưới
    const playlist = [
        'music/AThousandYears.mp3'
    ];

    function loadTrack(index) {
        music.src = playlist[index];
        music.load();
    }

    // Chọn bài tiếp theo ngẫu nhiên (khác bài đang phát)
    function nextRandomTrack() {
        if (playlist.length <= 1) return 0;
        let next;
        do {
            next = Math.floor(Math.random() * playlist.length);
        } while (next === currentTrack);
        return next;
    }

    // Khi bài hết, chuyển sang bài ngẫu nhiên khác
    music.addEventListener('ended', () => {
        currentTrack = nextRandomTrack();
        loadTrack(currentTrack);
        music.play().catch(() => {});
    });

    // Auto-play khi user tương tác lần đầu (browser yêu cầu)
    function autoPlayMusic() {
        if (musicPlaying) return;
        music.play().then(() => {
            musicPlaying = true;
            musicBtn.classList.add('playing');
        }).catch(() => {});
    }

    // Bài đầu tiên cũng ngẫu nhiên
    currentTrack = Math.floor(Math.random() * playlist.length);
    loadTrack(currentTrack);

    // Thử play ngay (có tiếng). Nếu trình duyệt chặn -> fallback muted autoplay.
    function tryPlayUnmuted() {
        music.muted = false;
        return music.play().then(() => {
            musicPlaying = true;
            musicBtn.classList.add('playing');
        });
    }

    function tryPlayMuted() {
        music.muted = true;
        music.play().then(() => {
            musicPlaying = true;
            musicBtn.classList.add('playing');
        }).catch(() => {});
    }

    tryPlayUnmuted().catch(() => tryPlayMuted());

    // Khi user tương tác lần đầu -> bật tiếng (nếu đang muted) hoặc play (nếu bị chặn)
    function unlockAudio() {
        if (music.muted) music.muted = false;
        if (music.paused) {
            music.play().then(() => {
                musicPlaying = true;
                musicBtn.classList.add('playing');
            }).catch(() => {});
        } else {
            musicPlaying = true;
            musicBtn.classList.add('playing');
        }
        ['click', 'touchstart', 'scroll', 'keydown', 'mousemove'].forEach(ev => {
            document.removeEventListener(ev, unlockAudio);
        });
    }
    ['click', 'touchstart', 'scroll', 'keydown', 'mousemove'].forEach(ev => {
        document.addEventListener(ev, unlockAudio, { passive: true });
    });

    musicBtn.addEventListener('click', () => {
        if (musicPlaying) { music.pause(); musicBtn.classList.remove('playing'); }
        else { music.play().catch(() => {}); musicBtn.classList.add('playing'); }
        musicPlaying = !musicPlaying;
    });

    // ===== FALLING SPARKLES & HEARTS =====
    const canvas = document.getElementById('petalCanvas');
    const ctx = canvas.getContext('2d');
    let particles = [];
    const PARTICLE_COUNT = 80; // Tăng số lượng

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    class Particle {
        constructor(type) {
            this.type = type || (Math.random() > 0.3 ? 'star' : 'heart'); // 70% sao, 30% trái tim
            this.reset(true);
        }
        reset(init) {
            this.x = Math.random() * canvas.width;
            this.y = init ? Math.random() * canvas.height * -1 : -30;
            this.size = Math.random() * 8 + 5;
            this.speedY = Math.random() * 1.2 + 0.5; // Chậm hơn
            this.speedX = Math.random() * 0.8 - 0.4;
            this.opacity = Math.random() * 0.7 + 0.3;
            this.color = ['#d4a5a5', '#e8c5c5', '#f5d5d5', '#fce8eb', '#ffb3d9'][Math.floor(Math.random() * 5)];
            this.twinkle = Math.random() * Math.PI * 2;
            this.twinkleSpeed = Math.random() * 0.05 + 0.02;
            this.rotation = Math.random() * Math.PI * 2;
            this.rotationSpeed = (Math.random() - 0.5) * 0.03;
        }
        update() {
            this.y += this.speedY;
            this.x += this.speedX + Math.sin(this.y * 0.02) * 0.8;
            this.twinkle += this.twinkleSpeed;
            this.rotation += this.rotationSpeed;
            if (this.y > canvas.height + 30) this.reset(false);
        }
        draw() {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.rotation);
            
            // Twinkling effect
            const twinkleOpacity = this.opacity * (0.5 + Math.sin(this.twinkle) * 0.5);
            ctx.globalAlpha = twinkleOpacity;
            
            if (this.type === 'star') {
                // Draw sparkle/star shape
                ctx.fillStyle = this.color;
                ctx.beginPath();
                for (let i = 0; i < 5; i++) {
                    const angle = (i * 4 * Math.PI) / 5;
                    const x = Math.cos(angle) * this.size;
                    const y = Math.sin(angle) * this.size;
                    if (i === 0) ctx.moveTo(x, y);
                    else ctx.lineTo(x, y);
                }
                ctx.closePath();
                ctx.fill();
                
                // Add glow effect
                ctx.shadowBlur = 12;
                ctx.shadowColor = this.color;
                ctx.fill();
            } else {
                // Draw heart shape
                ctx.fillStyle = this.color;
                ctx.beginPath();
                const topCurveHeight = this.size * 0.3;
                ctx.moveTo(0, topCurveHeight);
                // Left side
                ctx.bezierCurveTo(
                    0, 0,
                    -this.size / 2, 0,
                    -this.size / 2, topCurveHeight
                );
                ctx.bezierCurveTo(
                    -this.size / 2, (topCurveHeight + this.size) / 2,
                    0, (topCurveHeight + this.size) / 1.5,
                    0, this.size
                );
                // Right side
                ctx.bezierCurveTo(
                    0, (topCurveHeight + this.size) / 1.5,
                    this.size / 2, (topCurveHeight + this.size) / 2,
                    this.size / 2, topCurveHeight
                );
                ctx.bezierCurveTo(
                    this.size / 2, 0,
                    0, 0,
                    0, topCurveHeight
                );
                ctx.closePath();
                ctx.fill();
                
                // Add glow effect
                ctx.shadowBlur = 12;
                ctx.shadowColor = this.color;
                ctx.fill();
            }
            
            ctx.restore();
        }
    }

    for (let i = 0; i < PARTICLE_COUNT; i++) particles.push(new Particle());

    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => { p.update(); p.draw(); });
        requestAnimationFrame(animateParticles);
    }
    animateParticles();

})();

