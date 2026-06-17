/* ============================================
   NEXAVO AGENCY - CONTACT.JS
   Advanced Form Handling, Validation, AJAX, Notifications
   ============================================ */

class ContactFormHandler {
    constructor() {
        this.form = document.getElementById('contactForm');
        this.feedbackDiv = document.getElementById('contactFeedback');
        this.submitButton = null;
        this.init();
    }
    
    init() {
        if (!this.form) return;
        
        this.submitButton = this.form.querySelector('button[type="submit"]');
        this.setupValidation();
        this.setupEventListeners();
        this.addRealTimeValidation();
    }
    
    setupEventListeners() {
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        
        // Clear feedback on input
        const inputs = this.form.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('input', () => {
                if (this.feedbackDiv) {
                    this.feedbackDiv.innerHTML = '';
                    this.feedbackDiv.className = 'form-feedback';
                }
                this.removeErrorStyle(input);
            });
        });
    }
    
    setupValidation() {
        // Add validation rules
        this.validationRules = {
            name: {
                required: true,
                minLength: 2,
                maxLength: 50,
                pattern: /^[a-zA-Z\s\u0600-\u06FF]+$/,
                message: 'Please enter a valid name (2-50 characters, letters only)'
            },
            email: {
                required: true,
                pattern: /^[^\s@]+@([^\s@.,]+\.)+[^\s@.,]{2,}$/,
                message: 'Please enter a valid email address'
            },
            subject: {
                required: false,
                maxLength: 100,
                message: 'Subject must be less than 100 characters'
            },
            message: {
                required: true,
                minLength: 10,
                maxLength: 1000,
                message: 'Message must be between 10 and 1000 characters'
            }
        };
    }
    
    addRealTimeValidation() {
        const nameInput = this.form.querySelector('input[placeholder*="Name"]');
        const emailInput = this.form.querySelector('input[placeholder*="Email"]');
        const subjectInput = this.form.querySelector('input[placeholder="Subject"]');
        const messageInput = this.form.querySelector('textarea');
        
        if (nameInput) {
            nameInput.addEventListener('blur', () => this.validateField(nameInput, 'name'));
        }
        if (emailInput) {
            emailInput.addEventListener('blur', () => this.validateField(emailInput, 'email'));
        }
        if (subjectInput) {
            subjectInput.addEventListener('blur', () => this.validateField(subjectInput, 'subject'));
        }
        if (messageInput) {
            messageInput.addEventListener('blur', () => this.validateField(messageInput, 'message'));
        }
    }
    
    validateField(field, fieldName) {
        const value = field.value.trim();
        const rules = this.validationRules[fieldName];
        
        if (!rules) return true;
        
        // Required check
        if (rules.required && !value) {
            this.showFieldError(field, `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required`);
            return false;
        }
        
        // Min length check
        if (rules.minLength && value.length < rules.minLength) {
            this.showFieldError(field, rules.message || `Minimum ${rules.minLength} characters required`);
            return false;
        }
        
        // Max length check
        if (rules.maxLength && value.length > rules.maxLength) {
            this.showFieldError(field, rules.message || `Maximum ${rules.maxLength} characters allowed`);
            return false;
        }
        
        // Pattern check
        if (rules.pattern && !rules.pattern.test(value)) {
            this.showFieldError(field, rules.message);
            return false;
        }
        
        this.removeErrorStyle(field);
        return true;
    }
    
    showFieldError(field, message) {
        field.classList.add('error');
        
        // Remove existing error message
        const existingError = field.parentElement?.querySelector('.field-error');
        if (existingError) existingError.remove();
        
        // Create error message
        const errorDiv = document.createElement('div');
        errorDiv.className = 'field-error';
        errorDiv.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;
        errorDiv.style.cssText = `
            color: #FF3E6C;
            font-size: 0.75rem;
            margin-top: 5px;
            display: flex;
            align-items: center;
            gap: 5px;
        `;
        
        if (field.parentElement) {
            field.parentElement.appendChild(errorDiv);
        } else {
            field.insertAdjacentElement('afterend', errorDiv);
        }
    }
    
    removeErrorStyle(field) {
        field.classList.remove('error');
        const errorDiv = field.parentElement?.querySelector('.field-error');
        if (errorDiv) errorDiv.remove();
    }
    
    validateForm() {
        let isValid = true;
        
        const nameInput = this.form.querySelector('input[placeholder*="Name"]');
        const emailInput = this.form.querySelector('input[placeholder*="Email"]');
        const subjectInput = this.form.querySelector('input[placeholder="Subject"]');
        const messageInput = this.form.querySelector('textarea');
        
        if (nameInput && !this.validateField(nameInput, 'name')) isValid = false;
        if (emailInput && !this.validateField(emailInput, 'email')) isValid = false;
        if (subjectInput && !this.validateField(subjectInput, 'subject')) isValid = false;
        if (messageInput && !this.validateField(messageInput, 'message')) isValid = false;
        
        return isValid;
    }
    
    async handleSubmit(e) {
        e.preventDefault();
        
        // Validate form
        if (!this.validateForm()) {
            this.showFeedback('Please fix the errors above before submitting.', 'error');
            return;
        }
        
        // Disable button and show loading state
        this.setLoading(true);
        
        // Collect form data
        const formData = {
            name: this.form.querySelector('input[placeholder*="Name"]')?.value.trim() || '',
            email: this.form.querySelector('input[placeholder*="Email"]')?.value.trim() || '',
            subject: this.form.querySelector('input[placeholder="Subject"]')?.value.trim() || 'New Contact Inquiry',
            message: this.form.querySelector('textarea')?.value.trim() || '',
            timestamp: new Date().toISOString(),
            page: window.location.pathname
        };
        
        // Here you can replace with actual API endpoint
        // For Netlify, you can use Netlify Forms (add netlify attribute to form)
        
        try {
            // Simulate API call (replace with actual fetch to your backend)
            const result = await this.sendToAPI(formData);
            
            if (result.success) {
                this.showFeedback('✓ Message sent successfully! We\'ll get back to you within 24 hours.', 'success');
                this.form.reset();
                
                // Track conversion (Google Analytics)
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'form_submission', {
                        'event_category': 'Contact',
                        'event_label': 'Contact Form'
                    });
                }
                
                // Optional: Send to Slack/Discord webhook
                this.sendToWebhook(formData);
            } else {
                throw new Error(result.message || 'Failed to send message');
            }
        } catch (error) {
            console.error('Form submission error:', error);
            this.showFeedback('❌ Something went wrong. Please try again or email us directly.', 'error');
        } finally {
            this.setLoading(false);
        }
    }
    
    async sendToAPI(formData) {
        // For Netlify deployment, uncomment and configure:
        /*
        const response = await fetch('/api/contact', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });
        return await response.json();
        */
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Store in localStorage for demo (shows recent submissions)
        this.storeSubmission(formData);
        
        return { success: true, message: 'Message sent successfully' };
    }
    
    storeSubmission(formData) {
        const submissions = JSON.parse(localStorage.getItem('nexavo_contact_submissions') || '[]');
        submissions.unshift(formData);
        // Keep only last 10 submissions
        if (submissions.length > 10) submissions.pop();
        localStorage.setItem('nexavo_contact_submissions', JSON.stringify(submissions));
    }
    
    async sendToWebhook(formData) {
        // Optional: Send to Discord/Slack webhook for notifications
        const webhookUrl = ''; // Add your webhook URL here if needed
        
        if (!webhookUrl) return;
        
        try {
            await fetch(webhookUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    content: `📬 **New Contact Form Submission**\n**Name:** ${formData.name}\n**Email:** ${formData.email}\n**Subject:** ${formData.subject}\n**Message:** ${formData.message.substring(0, 200)}`
                })
            });
        } catch (e) {
            console.log('Webhook notification failed:', e);
        }
    }
    
    setLoading(isLoading) {
        if (!this.submitButton) return;
        
        if (isLoading) {
            this.submitButton.disabled = true;
            this.submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        } else {
            this.submitButton.disabled = false;
            this.submitButton.innerHTML = 'Send Message <i class="fas fa-paper-plane"></i>';
        }
    }
    
    showFeedback(message, type) {
        if (!this.feedbackDiv) return;
        
        this.feedbackDiv.innerHTML = message;
        this.feedbackDiv.className = `form-feedback form-feedback-${type}`;
        this.feedbackDiv.style.cssText = `
            margin-top: 1rem;
            padding: 12px;
            border-radius: 12px;
            text-align: center;
            animation: fadeUp 0.3s ease;
            ${type === 'success' ? 'background: rgba(16, 185, 129, 0.1); color: #10B981; border: 1px solid #10B981;' : ''}
            ${type === 'error' ? 'background: rgba(255, 62, 108, 0.1); color: #FF3E6C; border: 1px solid #FF3E6C;' : ''}
        `;
        
        // Auto-hide after 5 seconds for success
        if (type === 'success') {
            setTimeout(() => {
                if (this.feedbackDiv) {
                    this.feedbackDiv.style.opacity = '0';
                    setTimeout(() => {
                        if (this.feedbackDiv) {
                            this.feedbackDiv.innerHTML = '';
                            this.feedbackDiv.className = 'form-feedback';
                            this.feedbackDiv.style.cssText = '';
                        }
                    }, 300);
                }
            }, 5000);
        }
    }
}

// ========== GOOGLE MAPS INTEGRATION (Optional) ==========
class GoogleMapsHandler {
    constructor() {
        this.initMap();
    }
    
    initMap() {
        // Check if Google Maps is loaded and map container exists
        if (typeof google === 'undefined' || !document.getElementById('map')) return;
        
        const location = { lat: 31.5497, lng: 74.3436 }; // Lahore coordinates
        
        const map = new google.maps.Map(document.getElementById('map'), {
            zoom: 12,
            center: location,
            styles: [
                {
                    featureType: 'all',
                    elementType: 'all',
                    stylers: [{ saturation: -100 }, { lightness: -20 }, { visibility: 'on' }]
                },
                {
                    featureType: 'water',
                    elementType: 'geometry',
                    stylers: [{ color: '#1a2a4a' }]
                },
                {
                    featureType: 'landscape',
                    elementType: 'geometry',
                    stylers: [{ color: '#0A0C12' }]
                }
            ]
        });
        
        const marker = new google.maps.Marker({
            position: location,
            map: map,
            title: 'Nexavo Agency - Lahore',
            icon: {
                path: google.maps.SymbolPath.CIRCLE,
                scale: 10,
                fillColor: '#3E64FF',
                fillOpacity: 1,
                strokeColor: '#ffffff',
                strokeWeight: 2
            },
            animation: google.maps.Animation.BOUNCE
        });
        
        const infoWindow = new google.maps.InfoWindow({
            content: '<div style="color:#000"><strong>Nexavo Agency</strong><br>Lahore, Pakistan<br>Remote Worldwide</div>'
        });
        
        marker.addListener('click', () => {
            infoWindow.open(map, marker);
        });
    }
}

// ========== RECAPTCHA INTEGRATION (Optional) ==========
class ReCaptchaHandler {
    constructor(siteKey) {
        this.siteKey = siteKey;
        this.loadRecaptcha();
    }
    
    loadRecaptcha() {
        if (!this.siteKey) return;
        
        // Load Google reCAPTCHA script
        const script = document.createElement('script');
        script.src = `https://www.google.com/recaptcha/api.js?render=${this.siteKey}`;
        script.async = true;
        script.defer = true;
        document.head.appendChild(script);
        
        script.onload = () => {
            grecaptcha.ready(() => {
                grecaptcha.execute(this.siteKey, { action: 'submit' }).then(token => {
                    const tokenInput = document.createElement('input');
                    tokenInput.type = 'hidden';
                    tokenInput.name = 'recaptcha_token';
                    tokenInput.value = token;
                    document.getElementById('contactForm')?.appendChild(tokenInput);
                });
            });
        };
    }
}

// ========== INITIALIZE ==========
document.addEventListener('DOMContentLoaded', () => {
    // Initialize contact form handler
    const contactHandler = new ContactFormHandler();
    
    // Add CSS for error styling
    const style = document.createElement('style');
    style.textContent = `
        input.error, textarea.error, select.error {
            border-color: #FF3E6C !important;
            box-shadow: 0 0 0 2px rgba(255, 62, 108, 0.2) !important;
        }
        
        .form-feedback-success {
            background: rgba(16, 185, 129, 0.1);
            color: #10B981;
            border: 1px solid #10B981;
        }
        
        .form-feedback-error {
            background: rgba(255, 62, 108, 0.1);
            color: #FF3E6C;
            border: 1px solid #FF3E6C;
        }
        
        @keyframes fadeUp {
            from {
                opacity: 0;
                transform: translateY(10px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
    `;
    document.head.appendChild(style);
    
    // Initialize Google Maps if element exists
    if (document.getElementById('map') && typeof google !== 'undefined') {
        new GoogleMapsHandler();
    }
    
    // Add floating contact button (optional)
    const contactBtn = document.querySelector('.floating-contact-btn');
    if (contactBtn) {
        contactBtn.addEventListener('click', () => {
            document.getElementById('contactForm')?.scrollIntoView({ behavior: 'smooth' });
        });
    }
});

// ========== EXPORT FOR MODULE USE ==========
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ContactFormHandler, GoogleMapsHandler, ReCaptchaHandler };
}