// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Preloader
    const preloader = document.getElementById('preloader');
    
    window.addEventListener('load', function() {
      preloader.classList.add('fade-out');
      setTimeout(() => {
        preloader.style.display = 'none';
      }, 500);
    });
  
    // Header scroll effect
    const header = document.getElementById('header');
    
    window.addEventListener('scroll', function() {
      if (window.scrollY > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    });
  
    // Mobile Menu
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileMenuClose = document.getElementById('mobile-menu-close');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
    
    if (mobileMenuBtn && mobileMenu && mobileMenuClose) {
      mobileMenuBtn.addEventListener('click', function() {
        mobileMenu.classList.add('active');
        document.body.style.overflow = 'hidden';
      });
      
      mobileMenuClose.addEventListener('click', function() {
        mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
      });
      
      mobileNavLinks.forEach(link => {
        link.addEventListener('click', function() {
          mobileMenu.classList.remove('active');
          document.body.style.overflow = '';
        });
      });
    }
  
    // Modal functionality
    function setupModal(triggerBtn, modal, closeBtn) {
      if (!triggerBtn || !modal || !closeBtn) return;
      
      triggerBtn.addEventListener('click', function() {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
      });
      
      closeBtn.addEventListener('click', function() {
        modal.classList.remove('active');
        document.body.style.overflow = '';
      });
      
      modal.addEventListener('click', function(e) {
        if (e.target === modal) {
          modal.classList.remove('active');
          document.body.style.overflow = '';
        }
      });
    }
    
    // Setup all modals
    const modals = [
      { trigger: 'login-btn', modal: 'login-modal', close: 'login-modal-close' },
      { trigger: 'mobile-login-btn', modal: 'login-modal', close: 'login-modal-close' },
      { trigger: 'signup-btn', modal: 'signup-modal', close: 'signup-modal-close' },
      { trigger: 'mobile-signup-btn', modal: 'signup-modal', close: 'signup-modal-close' },
      { trigger: 'watch-demo-btn', modal: 'video-modal', close: 'video-modal-close' }
    ];
    
    modals.forEach(modalConfig => {
      setupModal(
        document.getElementById(modalConfig.trigger),
        document.getElementById(modalConfig.modal),
        document.getElementById(modalConfig.close)
      );
    });
    
    // Switch between login and signup
    const switchToSignup = document.getElementById('switch-to-signup');
    const switchToLogin = document.getElementById('switch-to-login');
    const loginModal = document.getElementById('login-modal');
    const signupModal = document.getElementById('signup-modal');
    
    if (switchToSignup && switchToLogin && loginModal && signupModal) {
      switchToSignup.addEventListener('click', function(e) {
        e.preventDefault();
        loginModal.classList.remove('active');
        setTimeout(() => {
          signupModal.classList.add('active');
        }, 300);
      });
      
      switchToLogin.addEventListener('click', function(e) {
        e.preventDefault();
        signupModal.classList.remove('active');
        setTimeout(() => {
          loginModal.classList.add('active');
        }, 300);
      });
    }
  
    // Form submissions
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');
    
    if (loginForm) {
      loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Simulate login
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        
        if (email && password) {
          // Show success notification
          showNotification('Login Successful', 'Welcome back to ShopSmart AI!', 'success');
          
          // Close modal
          loginModal.classList.remove('active');
          document.body.style.overflow = '';
        } else {
          // Show error notification
          showNotification('Login Failed', 'Please fill in all required fields', 'error');
        }
      });
    }
    
    if (signupForm) {
      signupForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Simulate signup
        const name = document.getElementById('signup-name').value;
        const email = document.getElementById('signup-email').value;
        const password = document.getElementById('signup-password').value;
        const businessType = document.getElementById('business-type').value;
        const terms = document.getElementById('terms')?.checked;
        
        if (name && email && password && businessType && terms) {
          // Show success notification
          showNotification('Account Created', 'Welcome to ShopSmart AI! Let\'s set up your business.', 'success');
          
          // Close modal
          signupModal.classList.remove('active');
          document.body.style.overflow = '';
        } else {
          // Show error notification
          showNotification('Signup Failed', 'Please fill in all required fields and accept the terms', 'error');
        }
      });
    }
  
    // Testimonial Slider
    const testimonialTrack = document.getElementById('testimonial-track');
    const testimonialDots = document.querySelectorAll('.testimonial-dot');
    const prevBtn = document.getElementById('prev-testimonial');
    const nextBtn = document.getElementById('next-testimonial');
    
    if (testimonialTrack && testimonialDots.length && prevBtn && nextBtn) {
      let currentSlide = 0;
      const slideCount = document.querySelectorAll('.testimonial-slide').length;
      
      function goToSlide(index) {
        if (index < 0) index = slideCount - 1;
        if (index >= slideCount) index = 0;
        
        testimonialTrack.style.transform = `translateX(-${index * 100}%)`;
        currentSlide = index;
        
        // Update dots
        testimonialDots.forEach((dot, i) => {
          dot.classList.toggle('active', i === currentSlide);
        });
      }
      
      prevBtn.addEventListener('click', function() {
        goToSlide(currentSlide - 1);
      });
      
      nextBtn.addEventListener('click', function() {
        goToSlide(currentSlide + 1);
      });
      
      testimonialDots.forEach((dot, index) => {
        dot.addEventListener('click', function() {
          goToSlide(index);
        });
      });
      
      // Auto slide
      let testimonialInterval = setInterval(() => {
        goToSlide(currentSlide + 1);
      }, 5000);
      
      // Pause auto slide on hover
      testimonialTrack.addEventListener('mouseenter', () => {
        clearInterval(testimonialInterval);
      });
      
      testimonialTrack.addEventListener('mouseleave', () => {
        testimonialInterval = setInterval(() => {
          goToSlide(currentSlide + 1);
        }, 5000);
      });
    }
  
    // Scroll to top button
    const scrollTopBtn = document.getElementById('scroll-top');
    
    if (scrollTopBtn) {
      window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
          scrollTopBtn.classList.add('active');
        } else {
          scrollTopBtn.classList.remove('active');
        }
      });
      
      scrollTopBtn.addEventListener('click', function() {
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      });
    }
  
    // Chatbot functionality - IMPROVED WITH BILINGUAL SUPPORT
    const chatbotButton = document.getElementById('chatbot-button');
    const chatbotContainer = document.getElementById('chatbot-container');
    const chatbotClose = document.getElementById('chatbot-close');
    const chatbotMessages = document.getElementById('chatbot-messages');
    const chatbotInput = document.getElementById('chatbot-input');
    const chatbotSend = document.getElementById('chatbot-send');
    
    if (chatbotButton && chatbotContainer && chatbotMessages && chatbotInput && chatbotSend) {
      // Add language toggle buttons to the chatbot header
      const chatbotHeader = document.querySelector('.chatbot-header');
      if (chatbotHeader) {
        // Create language toggle container
        const langToggle = document.createElement('div');
        langToggle.className = 'language-toggle';
        langToggle.innerHTML = `
          <button id="lang-en" class="language-btn active">EN</button>
          <button id="lang-hi" class="language-btn">हिंदी</button>
        `;
        
        // Insert before the actions div
        const chatbotActions = chatbotHeader.querySelector('.chatbot-actions');
        if (chatbotActions) {
          chatbotHeader.insertBefore(langToggle, chatbotActions);
        } else {
          chatbotHeader.appendChild(langToggle);
        }
      }
      
      // Get language buttons
      const langEn = document.getElementById('lang-en');
      const langHi = document.getElementById('lang-hi');
      
      // Set default language
      let currentLanguage = 'en';
      
      // Language toggle functionality
      if (langEn && langHi) {
        langEn.addEventListener('click', function() {
          currentLanguage = 'en';
          langEn.classList.add('active');
          langHi.classList.remove('active');
          
          // Show language change message
          addBotMessage('Language changed to English');
        });
        
        langHi.addEventListener('click', function() {
          currentLanguage = 'hi';
          langHi.classList.add('active');
          langEn.classList.remove('active');
          
          // Show language change message
          addBotMessage('भाषा हिंदी में बदल दी गई है');
        });
      }
      
      chatbotButton.addEventListener('click', function() {
        chatbotContainer.classList.add('active');
        const notification = chatbotButton.querySelector('.chatbot-notification');
        if (notification) {
          notification.style.display = 'none';
        }
      });
  
      chatbotClose.addEventListener('click', function() {
        chatbotContainer.classList.remove('active');
      });
      
      function addUserMessage(message) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message message-user';
        messageDiv.innerHTML = `
          <div class="message-content">${message}</div>
          <div class="message-avatar">
            <img src="https://via.placeholder.com/40x40?text=👤" alt="User Avatar">
          </div>
        `;
        chatbotMessages.appendChild(messageDiv);
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
      }
      
      function addBotMessage(message) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message message-bot';
        messageDiv.innerHTML = `
          <div class="message-avatar">
            <img src="bot.jpg" alt="Bot Avatar">
          </div>
          <div class="message-content">${message}</div>
        `;
        chatbotMessages.appendChild(messageDiv);
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
      }
      
      function showTypingIndicator() {
        const typingDiv = document.createElement('div');
        typingDiv.className = 'message message-bot';
        typingDiv.innerHTML = `
          <div class="message-avatar">
            <img src="user.jpg" alt="Bot Avatar">
          </div>
          <div class="message-content">
            <div class="typing-indicator">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        `;
        chatbotMessages.appendChild(typingDiv);
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
        return typingDiv;
      }
      
      function getBotResponse(message, language) {
        // Responses in both languages
        const responses = {
          en: {
            'hello': 'Hello! How can I help you with your business today?',
            'hi': 'Hi there! How can I assist you with ShopSmart AI?',
            'setup': 'Setting up your store is easy! Just click on "Get Started" and our AI will guide you through the process.',
            'pricing': 'Our platform is completely free to use! We believe in helping businesses grow without adding financial burden.',
            'features': 'ShopSmart AI offers AI-powered store setup, inventory management, sales analytics, and much more!',
            'payment': 'We support multiple payment methods including UPI, credit/debit cards, and net banking.',
            'help': 'I can help you with store setup, inventory management, sales optimization, and more. What do you need assistance with?',
            'inventory': 'Our AI-powered inventory management system helps you track stock levels, predict demand, and prevent overstocking or stockouts.',
            'sync': 'You can easily sync your offline store inventory with your online store using our barcode scanning feature or by uploading invoices.',
            'barcode': 'Yes, our app allows you to scan product barcodes to quickly add items to your inventory or check prices.',
            'analytics': 'Our analytics dashboard provides insights on sales trends, customer behavior, and inventory performance to help you make data-driven decisions.',
            'notification': 'Our push notification system keeps you informed about inventory levels, sales performance, and customer activity in real-time.',
            'login': 'Login to access exclusive deals and offers.',
            'logout': 'You have successfully logged out.',
            'forgot_password': 'Forgot your password? Reset it easily.',
            'product': 'Discover high-quality products at the best prices.',
            'cart': 'Your cart is ready! Complete your purchase now.',
            'wishlist': 'Add your favorite products to your wishlist.',
            'orders': 'Track your orders and delivery status in real time.',
            'checkout': 'Proceed to secure checkout and confirm your order.',
            'payment_success': 'Payment successful! Your order is on the way.',
            'payment_failed': 'Payment failed. Please try again.',
            'delivery_update': 'Your order will be delivered soon!',
            'returns': 'Easily return products with our hassle-free policy.',
            'offers': 'Limited-time offers just for you!',
            'discount': 'Grab exciting discounts on your favorite products.',
            'notifications': 'Get instant notifications for new arrivals and offers.',
            'customer_support': 'Need help? Our support team is here for you.',
            'product_review': 'Leave a review and share your experience.',
            'top_rated_products': 'Explore top-rated products loved by customers.',
            'limited_stock': 'Hurry! Limited stock available for these products.',
            'flash_sales': 'Don’t miss our limited-time flash sales!',
            'secure_payment': 'Shop with confidence with our secure payment system.',
            'personalized_recommendations': 'Get personalized product recommendations for you.',
            'gift_packs': 'Find perfect gift packs for every occasion.',
            'customer_reviews': 'Read customer reviews before making a purchase.',
            'bulk_orders': 'Get special discounts on bulk orders.',
            'store_locator': 'Find our nearest store for a better shopping experience.',
            'subscription': 'Subscribe for updates on new products and exclusive deals.',
            'signup': 'Sign up now and start exploring our products!'
 
            
          },
          hi: {
            'hello': 'नमस्ते! आज मैं आपके व्यापार में कैसे मदद कर सकता हूँ?',
            'hi': 'नमस्ते! मैं ShopSmart AI के साथ आपकी कैसे सहायता कर सकता हूँ?',
            'setup': 'अपना स्टोर सेटअप करना आसान है! बस "Get Started" पर क्लिक करें और हमारा AI आपको प्रक्रिया के माध्यम से मार्गदर्शन करेगा।',
            'pricing': 'हमारा प्लेटफॉर्म पूरी तरह से मुफ्त है! हम व्यवसायों को वित्तीय बोझ जोड़े बिना बढ़ने में मदद करने में विश्वास रखते हैं।',
            'features': 'ShopSmart AI AI-संचालित स्टोर सेटअप, इन्वेंटरी मैनेजमेंट, सेल्स एनालिटिक्स और बहुत कुछ प्रदान करता है!',
            'payment': 'हम UPI, क्रेडिट/डेबिट कार्ड और नेट बैंकिंग सहित कई भुगतान विधियों का समर्थन करते हैं।',
            'help': 'मैं आपको स्टोर सेटअप, इन्वेंटरी मैनेजमेंट, सेल्स ऑप्टिमाइजेशन और अधिक में मदद कर सकता हूँ। आपको किस चीज़ में सहायता चाहिए?',
            'inventory': 'हमारी AI-संचालित इन्वेंटरी मैनेजमेंट सिस्टम आपको स्टॉक लेवल ट्रैक करने, डिमांड की भविष्यवाणी करने और ओवरस्टॉकिंग या स्टॉकआउट को रोकने में मदद करता है।',
            'sync': 'आप हमारे बारकोड स्कैनिंग फीचर का ���पयोग करके या इनवॉइस अपलोड करके अपने ऑफलाइन स्टोर इन्वेंटरी को अपने ऑनलाइन स्टोर के साथ आसानी से सिंक कर सकते हैं।',
            'barcode': 'हां, हमारा ऐप आपको अपने इन्वेंटरी में आइटम जोड़ने या कीमतें चेक करने के लिए प्रोडक्ट बारकोड स्कैन करने की अनुमति देता है।',
            'analytics': 'हमारा एनालिटिक्स डैशबोर्ड आपको डेटा-संचालित निर्णय लेने में मदद करने के लिए सेल्स ट्रेंड्स, कस्टमर बिहेवियर और इन्वेंटरी परफॉरमेंस पर इनसाइट्स प्रदान करता है।',
            'notification': 'हमारा पुश नोटिफिकेशन सिस्टम आपको इन्वेंटरी लेवल, सेल्स परफॉरमेंस और कस्टमर एक्टिविटी के बारे में रीयल-टाइम में सूचित रखता है।',
            'signup': 'अभी साइन अप करें और हमारे उत्पादों का अन्वेषण करें!',
            'login': 'विशेष सौदों और ऑफ़र तक पहुँचने के लिए लॉगिन करें।',
            'logout': 'आपने सफलतापूर्वक लॉगआउट कर लिया है।',
            'forgot_password': 'अपना पासवर्ड भूल गए? इसे आसानी से रीसेट करें।',
            'product': 'बेहतरीन कीमतों पर उच्च गुणवत्ता वाले उत्पाद खोजें।',
            'cart': 'आपका कार्ट तैयार है! अपनी खरीदारी अभी पूरी करें।',
            'wishlist': 'अपने पसंदीदा उत्पादों को अपनी विशलिस्ट में जोड़ें।',
            'orders': 'अपने ऑर्डर और डिलीवरी की स्थिति को वास्तविक समय में ट्रैक करें।',
            'checkout': 'सुरक्षित चेकआउट के लिए आगे बढ़ें और अपना ऑर्डर पुष्टि करें।',
            'payment_success': 'भुगतान सफल! आपका ऑर्डर रास्ते में है।',
            'payment_failed': 'भुगतान विफल। कृपया पुनः प्रयास करें।',
            'delivery_update': 'आपका ऑर्डर जल्द ही डिलीवर किया जाएगा!',
            'returns': 'हमारी परेशानी मुक्त नीति के साथ उत्पादों को आसानी से लौटाएं।',
            'offers': 'केवल आपके लिए सीमित समय के ऑफ़र!',
            'discount': 'अपने पसंदीदा उत्पादों पर रोमांचक छूट पाएं।',
            'notifications': 'नए आगमन और ऑफ़र के लिए त्वरित सूचनाएँ प्राप्त करें।',
            'customer_support': 'मदद चाहिए? हमारी सहायता टीम आपके लिए यहाँ है।',
            'product_review': 'समीक्षा दें और अपना अनुभव साझा करें।',
            'top_rated_products': 'ग्राहकों द्वारा पसंद किए गए शीर्ष रेटेड उत्पादों का अन्वेषण करें।',
            'limited_stock': 'जल्दी करें! इन उत्पादों के लिए सीमित स्टॉक उपलब्ध है।',
            'flash_sales': 'हमारी सीमित समय की फ्लैश बिक्री को मिस न करें!',
            'secure_payment': 'हमारी सुरक्षित भुगतान प्रणाली के साथ आत्मविश्वास से खरीदारी करें।',
            'personalized_recommendations': 'आपके लिए व्यक्तिगत उत्पाद अनुशंसा प्राप्त करें।',
            'gift_packs': 'हर अवसर के लिए आदर्श उपहार पैक खोजें।',
            'customer_reviews': 'खरीदारी से पहले ग्राहक समीक्षाएँ पढ़ें।',
            'bulk_orders': 'थोक ऑर्डर पर विशेष छूट प्राप्त करें।',
            'store_locator': 'बेहतर खरीदारी अनुभव के लिए हमारा निकटतम स्टोर खोजें।',
            'subscription': 'नए उत्पादों और विशेष सौदों पर अपडेट के लिए सदस्यता लें।'
            
          }
        };
        
        // Check for keywords in the message
        const lowerMessage = message.toLowerCase();
        for (const [keyword, response] of Object.entries(responses[language])) {
          if (lowerMessage.includes(keyword)) {
            return response;
          }
        }
        
        // Default response
        return language === 'en' 
          ? "I'm not sure I understand. Can you please rephrase your question or ask about our features like inventory management, store setup, or sales analytics?" 
          : "मुझे समझ नहीं आया। क्या आप अपना प्रश्न दोबारा पूछ सकते हैं या हमारे फीचर्स जैसे इन्वेंटरी मैनेजमेंट, स्टोर सेटअप, या सेल्स एनालिटिक्स के बारे में पूछ सकते हैं?";
      }
      
      function handleSendMessage() {
        const message = chatbotInput.value.trim();
        if (message) {
          // Add user message
          addUserMessage(message);
          chatbotInput.value = '';
          
          // Show typing indicator
          const typingIndicator = showTypingIndicator();
          
          // Simulate typing delay
          setTimeout(() => {
            // Remove typing indicator
            typingIndicator.remove();
            
            // Add bot response
            const botResponse = getBotResponse(message, currentLanguage);
            addBotMessage(botResponse);
          }, 1000 + Math.random() * 1000);
        }
      }
      
      chatbotSend.addEventListener('click', handleSendMessage);
      
      chatbotInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          handleSendMessage();
        }
      });
      
      // Initial welcome message
      setTimeout(() => {
        const welcomeMessage = currentLanguage === 'en'
          ? 'Hello! I\'m the ShopSmart AI assistant. How can I help you today?'
          : 'नमस्ते! मैं ShopSmart AI सहायक हूँ। आज मैं आपकी कैसे मदद कर सकता हूँ?';
        
        // Clear any existing messages
        chatbotMessages.innerHTML = '';
        
        // Add welcome message
        addBotMessage(welcomeMessage);
      }, 500);
    }
  
    // Notification System
    const notification = document.getElementById('notification');
    const notificationClose = document.getElementById('notification-close');
    
    if (notification && notificationClose) {
      // Show notification after 5 seconds
      setTimeout(() => {
        notification.classList.add('active');
      }, 5000);
      
      notificationClose.addEventListener('click', () => {
        notification.classList.remove('active');
      });
      
      // Automatically hide notification after 10 seconds
      setTimeout(() => {
        notification.classList.remove('active');
      }, 15000);
    }
  
    // Cookie Consent
    const cookieConsent = document.getElementById('cookie-consent');
    const cookieAccept = document.getElementById('cookie-accept');
    const cookieSettings = document.getElementById('cookie-settings');
    
    if (cookieConsent && cookieAccept && cookieSettings) {
      // Show cookie consent after 2 seconds
      setTimeout(() => {
        cookieConsent.classList.add('active');
      }, 2000);
      
      cookieAccept.addEventListener('click', () => {
        cookieConsent.classList.remove('active');
        // Set cookie
        document.cookie = "cookie_consent=accepted; max-age=31536000; path=/";
      });
      
      cookieSettings.addEventListener('click', () => {
        cookieConsent.classList.remove('active');
        // Show settings modal (could be implemented)
        showNotification('Cookie Settings', 'Cookie settings functionality would be shown here', 'info');
      });
    }
  
    // Custom Notification Function
    window.showNotification = function(title, message, type = 'info') {
      // Create notification element
      const notifEl = document.createElement('div');
      notifEl.className = 'notification custom-notification';
      
      // Set icon based on type
      let iconClass = 'fa-info-circle';
      let bgColor = 'linear-gradient(135deg, var(--primary), var(--secondary))';
      
      if (type === 'success') {
        iconClass = 'fa-check-circle';
        bgColor = 'linear-gradient(135deg, var(--success), #20c997)';
      } else if (type === 'error') {
        iconClass = 'fa-exclamation-circle';
        bgColor = 'linear-gradient(135deg, var(--danger), #e03131)';
      } else if (type === 'warning') {
        iconClass = 'fa-exclamation-triangle';
        bgColor = 'linear-gradient(135deg, var(--warning), #f08c00)';
      }
      
      notifEl.innerHTML = `
        <div class="notification-icon" style="background: ${bgColor}">
          <i class="fas ${iconClass}"></i>
        </div>
        <div class="notification-content">
          <div class="notification-title">${title}</div>
          <div class="notification-message">${message}</div>
        </div>
        <button class="notification-close">
          <i class="fas fa-times"></i>
        </button>
      `;
      
      // Add to DOM
      document.body.appendChild(notifEl);
      
      // Show notification
      setTimeout(() => {
        notifEl.classList.add('active');
      }, 10);
      
      // Add close event
      const closeBtn = notifEl.querySelector('.notification-close');
      closeBtn.addEventListener('click', () => {
        notifEl.classList.remove('active');
        setTimeout(() => {
          notifEl.remove();
        }, 300);
      });
      
      // Auto remove after 5 seconds
      setTimeout(() => {
        notifEl.classList.remove('active');
        setTimeout(() => {
          notifEl.remove();
        }, 300);
      }, 5000);
    };
  
    // Set current year in footer
    const currentYearElement = document.getElementById('current-year');
    if (currentYearElement) {
      currentYearElement.textContent = new Date().getFullYear();
    }
  
    // Animate elements on scroll
    const animateElements = document.querySelectorAll('.feature-card, .step, .benefit-card');
    
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.1 });
      
      animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        observer.observe(el);
      });
    }
  
    // Get Started and CTA buttons
    const ctaBtn = document.getElementById('cta-btn');
    const getStartedBtn = document.getElementById('get-started-btn');
    
    if (ctaBtn && signupModal) {
      ctaBtn.addEventListener('click', function() {
        signupModal.classList.add('active');
        document.body.style.overflow = 'hidden';
      });
    }
    
    if (getStartedBtn && signupModal) {
      getStartedBtn.addEventListener('click', function() {
        signupModal.classList.add('active');
        document.body.style.overflow = 'hidden';
      });
    }
  });