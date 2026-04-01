document.addEventListener("DOMContentLoaded", () => {
    
    // 1. Sticky Navbar
    const navbar = document.getElementById("navbar");
    window.addEventListener("scroll", () => {
        if (window.scrollY > 50) {
            navbar.classList.add("scrolled");
        } else {
            navbar.classList.remove("scrolled");
        }
    });

    // 2. Scroll Reveal Animations using Intersection Observer
    const revealElements = document.querySelectorAll(".reveal-up");
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("active");
                observer.unobserve(entry.target);
            }
        });
    }, {
        root: null,
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    });

    revealElements.forEach(el => revealObserver.observe(el));

    // 3. EMI Calculator Logic
    const priceSlider = document.getElementById("price-slider");
    const dpSlider = document.getElementById("dp-slider");
    const tenureSlider = document.getElementById("tenure-slider");
    const interestRate = document.getElementById("interest-rate").value;
    
    const priceVal = document.getElementById("price-val");
    const dpVal = document.getElementById("dp-val");
    const tenureVal = document.getElementById("tenure-val");
    const emiResult = document.getElementById("emi-result");

    const formatCurrency = (num) => {
        return num.toLocaleString('en-IN');
    };

    const calculateEMI = () => {
        const p = parseFloat(priceSlider.value) - parseFloat(dpSlider.value);
        if (p <= 0) {
            emiResult.innerText = "₹ 0";
            return;
        }
        const r = parseFloat(interestRate) / 12 / 100;
        const n = parseFloat(tenureSlider.value) * 12;

        // EMI Formula: P x R x (1+R)^N / [(1+R)^N-1]
        const emi = (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
        
        emiResult.innerText = `₹ ${formatCurrency(Math.round(emi))}`;
    };

    // Update values on slide
    priceSlider.addEventListener("input", (e) => {
        priceVal.innerText = formatCurrency(parseInt(e.target.value));
        // Auto adjust downpayment max to price
        dpSlider.max = parseInt(e.target.value) * 0.9; // max 90% dp
        calculateEMI();
    });

    dpSlider.addEventListener("input", (e) => {
        dpVal.innerText = formatCurrency(parseInt(e.target.value));
        calculateEMI();
    });

    tenureSlider.addEventListener("input", (e) => {
        tenureVal.innerText = e.target.value;
        calculateEMI();
    });

    // Initial Calculation
    calculateEMI();

    // 4. Countdown Timer Logic
    // Set timer to essentially loop a false scarcity of 2 days 14 hours ahead from current time
    let countdownDate = new Date().getTime() + (2 * 24 * 60 * 60 * 1000) + (14 * 60 * 60 * 1000);
    
    const countTimer = setInterval(() => {
        const now = new Date().getTime();
        const distance = countdownDate - now;

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        document.getElementById("days").innerText = days.toString().padStart(2, '0');
        document.getElementById("hours").innerText = hours.toString().padStart(2, '0');
        document.getElementById("minutes").innerText = minutes.toString().padStart(2, '0');
        document.getElementById("seconds").innerText = seconds.toString().padStart(2, '0');

        if (distance < 0) {
            clearInterval(countTimer);
            document.getElementById("countdown").innerHTML = "Offer Expired";
        }
    }, 1000);

    // 5. Modal Logic
    const modal = document.getElementById("lead-form-modal");
    const openBtns = document.querySelectorAll(".open-modal-btn");
    const closeBtn = document.getElementById("close-modal-btn");

    openBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            modal.showModal();
            document.body.style.overflow = "hidden"; // Prevent background scroll
        });
    });

    closeBtn.addEventListener("click", () => {
        modal.close();
        document.body.style.overflow = "auto";
    });

    // Close when clicking outside
    modal.addEventListener("click", (e) => {
        const dialogDimensions = modal.getBoundingClientRect();
        if (
            e.clientX < dialogDimensions.left ||
            e.clientX > dialogDimensions.right ||
            e.clientY < dialogDimensions.top ||
            e.clientY > dialogDimensions.bottom
        ) {
            modal.close();
            document.body.style.overflow = "auto";
        }
    });

    // 6. Form Submission Logic
    const handleFormSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const name = formData.get("name");
        const phone = formData.get("phone");
        
        // Disable button visually
        const btn = e.target.querySelector("button[type='submit']");
        const ogText = btn.innerText;
        btn.innerText = "Processing...";
        btn.disabled = true;

        // Simulate API call to CRM Webhook
        setTimeout(() => {
            alert(`Thanks ${name}! Our luxury expert will call you shortly on ${phone}.`);
            
            // Redirect to WhatsApp via API
            const waMsg = encodeURIComponent(`Hi, I am ${name}. I just registered on the website for Aura Residences and want more details.`);
            window.open(`https://wa.me/919137938034?text=${waMsg}`, "_blank");
            
            // Reset form
            e.target.reset();
            btn.innerText = ogText;
            btn.disabled = false;
            
            if (modal.open) {
                modal.close();
                document.body.style.overflow = "auto";
            }
        }, 1500);
    };

    document.getElementById("sidebar-lead-form").addEventListener("submit", handleFormSubmit);
    document.getElementById("popup-lead-form").addEventListener("submit", handleFormSubmit);

});
