document.addEventListener('DOMContentLoaded', () => {
  // ==========================================
  // 🧭 HEADER TRANSFORM & SCROLL DETECTION
  // ==========================================
  const header = document.querySelector('.site-header');
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav a');
  
  const handleScroll = () => {
    // Add scrolled class to header
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    // Dynamic nav link active state based on viewport position
    let currentSection = '';
    const scrollPosition = window.scrollY + 120; // offset for header height

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        currentSection = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      const href = link.getAttribute('href');
      if (href === `#${currentSection}` || (currentSection === '' && href === '#')) {
        link.classList.add('active');
      }
    });
  };

  window.addEventListener('scroll', handleScroll);
  handleScroll(); // Initial call

  // ==========================================
  // 📱 MOBILE MENU INTERACTION
  // ==========================================
  const menuBtn = document.getElementById('menuBtn');
  const nav = document.getElementById('nav');

  if (menuBtn && nav) {
    menuBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      nav.classList.toggle('open');
      
      // Toggle menu button icon (hamburger vs close)
      if (nav.classList.contains('open')) {
        menuBtn.innerHTML = '&#x2715;'; // Close symbol (X)
      } else {
        menuBtn.innerHTML = '&#x2630;'; // Hamburger symbol (≡)
      }
    });

    // Close menu when clicking outside of it
    document.addEventListener('click', (e) => {
      if (nav.classList.contains('open') && !nav.contains(e.target) && e.target !== menuBtn) {
        nav.classList.remove('open');
        menuBtn.innerHTML = '&#x2630;';
      }
    });

    // Close mobile nav after clicking any nav link
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        nav.classList.remove('open');
        menuBtn.innerHTML = '&#x2630;';
      });
    });
  }

  // ==========================================
  // 📈 ANIMATE SKILL BARS ON ENTER VIEWPORT
  // ==========================================
  const skillBars = document.querySelectorAll('.skill-bar');
  
  const skillObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const bar = entry.target;
        const widthVal = bar.getAttribute('data-width');
        bar.style.width = widthVal;
        observer.unobserve(bar); // Stop observing after animation triggers
      }
    });
  }, { threshold: 0.1 });

  skillBars.forEach(bar => {
    skillObserver.observe(bar);
  });

  // ==========================================
  // 📨 CONTACT FORM SUBMISSION (WEB3FORMS AJAX)
  // ==========================================
  const contactForm = document.getElementById('contactForm');
  const submitBtn = document.getElementById('submitBtn');
  const formResult = document.getElementById('formResult');

  if (contactForm && submitBtn && formResult) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // Update button state and clear previous messages
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending...';
      formResult.className = 'form-result info';
      formResult.textContent = 'Sending your message, please wait...';
      formResult.style.display = 'block';

      const formData = new FormData(contactForm);
      const jsonObject = Object.fromEntries(formData);
      const json = JSON.stringify(jsonObject);

      fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: json
      })
      .then(async (response) => {
        let resData = await response.json();
        if (response.status === 200) {
          formResult.className = 'form-result success';
          formResult.textContent = resData.message || 'Thank you! Your message was sent successfully.';
          contactForm.reset();
        } else {
          formResult.className = 'form-result error';
          formResult.textContent = resData.message || 'Something went wrong. Please try again.';
        }
      })
      .catch((error) => {
        console.error('Submission Error:', error);
        formResult.className = 'form-result error';
        formResult.textContent = 'Failed to connect. Please check your internet connection and try again.';
      })
      .finally(() => {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Send Message';
        setTimeout(() => {
          formResult.style.display = 'none';
        }, 6000); // Hide result message after 6 seconds
      });
    });
  }

  // Restrict Mobile Number input to numeric values only
  const phoneInput = document.getElementById('phone');
  if (phoneInput) {
    phoneInput.addEventListener('input', (e) => {
      e.target.value = e.target.value.replace(/[^0-9]/g, '');
    });
  }
});

