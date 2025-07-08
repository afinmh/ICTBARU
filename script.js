// Typing animation for splash
function typeText(text, element, speed = 150) {
  return new Promise((resolve) => {
    let i = 0;
    element.textContent = '';
    
    function type() {
      if (i < text.length) {
        element.textContent += text.charAt(i);
        i++;
        setTimeout(type, speed);
      } else {
        // Remove cursor after typing is complete
        setTimeout(() => {
          element.classList.remove('typing-text');
          resolve();
        }, 1000);
      }
    }
    
    type();
  });
}

// Start typing animation
async function startSplash() {
  const typingElement = document.getElementById('typingText');
  
  // Wait 1.5 seconds before starting typing animation
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  await typeText('ICT LABORATORY', typingElement, 120);
  
  // Wait a bit then fade out
  setTimeout(() => {
    document.getElementById('splash').classList.add('fade-out');
    
    // Start main content after splash fade out
    setTimeout(() => {
      loadAndStart();
    }, 1000);
  }, 800);
}

// List gambar 1–16
const imageList = Array.from({ length: 16 }, (_, i) => i + 1);

// Check file extensions (.webp, .jpg, .JPG)
function resolveImagePath(num) {
  const pathWebp = `img/${num}.webp`;
  const pathJpgLower = `img/${num}.jpg`;
  const pathJpgUpper = `img/${num}.JPG`;
  
  return new Promise(resolve => {
    // Try WebP first (best compression)
    const imgWebp = new Image();
    imgWebp.src = pathWebp;
    imgWebp.onload = () => resolve(pathWebp);
    imgWebp.onerror = () => {
      // Fallback to .jpg
      const imgJpgLower = new Image();
      imgJpgLower.src = pathJpgLower;
      imgJpgLower.onload = () => resolve(pathJpgLower);
      imgJpgLower.onerror = () => {
        // Fallback to .JPG
        const imgJpgUpper = new Image();
        imgJpgUpper.src = pathJpgUpper;
        imgJpgUpper.onload = () => resolve(pathJpgUpper);
        imgJpgUpper.onerror = () => resolve(null);
      };
    };
  });
}

// Load images and start marquee
async function loadAndStart() {
  const images = await Promise.all(imageList.map(resolveImagePath));
  const groups = [
    images.slice(0, 4),
    images.slice(4, 8),
    images.slice(8, 12),
    images.slice(12, 16)
  ];

  groups.forEach((group, i) => {
    const track = document.getElementById(`track${i+1}`);
    group.concat(group).forEach(src => {
      if (!src) return;
      const img = document.createElement('img');
      img.src = src;
      track.appendChild(img);
    });
  });

  // Start marquee animation
  document.querySelectorAll('.marquee-row').forEach(row => {
    row.classList.add('start-animation');
  });
  
  // Setup parallax scroll
  setupParallaxScroll();
}

// Parallax scroll effect
function setupParallaxScroll() {
  const marqueeParallax = document.getElementById('marqueeParallax');
  const heroSection = document.getElementById('heroSection');
  let ticking = false;
  
  function updateParallax() {
    const scrollY = window.scrollY;
    const windowHeight = window.innerHeight;
    
    // Calculate scroll progress (0 to 1)
    const scrollProgress = Math.min(scrollY / windowHeight, 1);
    
    // Always reset classes first for smooth transitions
    marqueeParallax.classList.remove('shrink', 'compact', 'blur');
    heroSection.classList.remove('visible');
    
    // Apply effects based on scroll progress with smooth transitions
    if (scrollProgress > 0) {
      // Stage 1: Shrink gaps immediately when scrolling starts (0-50% scroll)
      marqueeParallax.classList.add('shrink');
    }
    
    if (scrollProgress >= 0.5 && scrollProgress < 0.75) {
      // Stage 2: Complete compaction (50-75% scroll)
      marqueeParallax.classList.remove('shrink');
      marqueeParallax.classList.add('compact');
    }
    else if (scrollProgress >= 0.75) {
      // Stage 3: Blur and show hero (75-100% scroll)
      marqueeParallax.classList.add('compact', 'blur');
      heroSection.classList.add('visible');
    }
    // When scrollProgress < 0.2, all classes are removed (default state)
    
    ticking = false;
  }
  
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(updateParallax);
      ticking = true;
    }
  });
}

// Initialize application
document.addEventListener('DOMContentLoaded', () => {
  // Start splash animation immediately
  startSplash();
});
