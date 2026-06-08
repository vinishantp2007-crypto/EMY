document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================================================
       1. CANVAS PARTICLES ANIMATION
       ========================================================================== */
    const canvas = document.getElementById('particles-canvas');
    const ctx = canvas.getContext('2d');

    let particles = [];
    const maxParticles = 60;
    const connectionDistance = 120;
    
    // Mouse interaction variables
    let mouse = {
        x: null,
        y: null,
        radius: 150
    };

    window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });

    window.addEventListener('mouseout', () => {
        mouse.x = null;
        mouse.y = null;
    });

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.vx = (Math.random() - 0.5) * 0.6;
            this.vy = (Math.random() - 0.5) * 0.6;
            this.radius = Math.random() * 2 + 1;
            this.baseColor = 'rgba(0, 245, 255, 0.4)';
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            // Bounce off edges
            if (this.x < 0 || this.x > canvas.width) this.vx = -this.vx;
            if (this.y < 0 || this.y > canvas.height) this.vy = -this.vy;

            // Mouse proximity repulsion
            if (mouse.x !== null && mouse.y !== null) {
                let dx = this.x - mouse.x;
                let dy = this.y - mouse.y;
                let dist = Math.hypot(dx, dy);
                if (dist < mouse.radius) {
                    let force = (mouse.radius - dist) / mouse.radius;
                    let angle = Math.atan2(dy, dx);
                    this.x += Math.cos(angle) * force * 2;
                    this.y += Math.sin(angle) * force * 2;
                }
            }
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = this.baseColor;
            ctx.fill();
        }
    }

    function initParticles() {
        particles = [];
        for (let i = 0; i < maxParticles; i++) {
            particles.push(new Particle());
        }
    }
    initParticles();

    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Update & draw particles
        particles.forEach(p => {
            p.update();
            p.draw();
        });

        // Draw connections
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                let dx = particles[i].x - particles[j].x;
                let dy = particles[i].y - particles[j].y;
                let dist = Math.hypot(dx, dy);

                if (dist < connectionDistance) {
                    // Line opacity depends on distance
                    let alpha = (1 - (dist / connectionDistance)) * 0.15;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    
                    // Create gradient lines (cyan to purple)
                    let grad = ctx.createLinearGradient(particles[i].x, particles[i].y, particles[j].x, particles[j].y);
                    grad.addColorStop(0, `rgba(0, 245, 255, ${alpha})`);
                    grad.addColorStop(1, `rgba(138, 43, 226, ${alpha})`);
                    
                    ctx.strokeStyle = grad;
                    ctx.lineWidth = 1;
                    ctx.stroke();
                }
            }
        }

        requestAnimationFrame(animateParticles);
    }
    animateParticles();


    /* ==========================================================================
       2. TYPING EFFECT IN HERO
       ========================================================================== */
    const typedTextElement = document.getElementById('typed-text');
    const phrases = [
        "Cloud Computing Architecture",
        "DevOps Automation & CI/CD",
        "Full Stack Web Development",
        "Software Engineering Solutions"
    ];
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;

    function typeEffect() {
        const currentPhrase = phrases[phraseIndex];
        
        if (isDeleting) {
            typedTextElement.textContent = currentPhrase.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 50; // faster deletion
        } else {
            typedTextElement.textContent = currentPhrase.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 100; // normal typing
        }

        if (!isDeleting && charIndex === currentPhrase.length) {
            isDeleting = true;
            typingSpeed = 2000; // Pause at end of phrase
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
            typingSpeed = 500; // Short pause before typing next
        }

        setTimeout(typeEffect, typingSpeed);
    }
    
    // Start typing animation after a brief delay
    setTimeout(typeEffect, 1000);


    /* ==========================================================================
       3. NAVIGATION STICKY & ACTIVE HIGHLIGHT
       ========================================================================== */
    const header = document.getElementById('main-header');
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');

    // Sticky Header
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Active Nav Link highlighting
        let currentSectionId = '';
        sections.forEach(sec => {
            const secTop = sec.offsetTop - 120;
            const secHeight = sec.clientHeight;
            if (window.scrollY >= secTop && window.scrollY < secTop + secHeight) {
                currentSectionId = sec.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').slice(1) === currentSectionId) {
                link.classList.add('active');
            }
        });
    });


    /* ==========================================================================
       4. MOBILE MENU TOGGLE
       ========================================================================== */
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const navMenu = document.getElementById('nav-menu');

    mobileMenuToggle.addEventListener('click', () => {
        mobileMenuToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close menu when clicking a nav link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenuToggle.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });


    /* ==========================================================================
       5. SKILLS INTERACTIVE TABS & PROGRESS ANIMATIONS
       ========================================================================== */
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');

    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Deactivate all
            tabButtons.forEach(b => b.classList.remove('active'));
            tabPanes.forEach(pane => pane.classList.remove('active'));

            // Activate current
            btn.classList.add('active');
            const targetPaneId = `pane-${btn.getAttribute('data-tab')}`;
            const targetPane = document.getElementById(targetPaneId);
            targetPane.classList.add('active');

            // Trigger animations on active panel components
            animateSkillsPanel(targetPane);
        });
    });

    // Helper to animate progress meters inside a tab panel
    function animateSkillsPanel(pane) {
        // Linear Progress Bars
        const progressBars = pane.querySelectorAll('.skill-progress');
        progressBars.forEach(bar => {
            const targetPercent = bar.style.getPropertyValue('--percent');
            bar.style.width = targetPercent;
        });

        // Circular progress rings
        const circleArcs = pane.querySelectorAll('circle.fg');
        circleArcs.forEach(circle => {
            const targetPercent = parseInt(circle.style.getPropertyValue('--percent'), 10);
            const r = parseInt(circle.getAttribute('r'), 10);
            const circumference = 2 * Math.PI * r;
            const offset = circumference - (targetPercent / 100) * circumference;
            circle.style.strokeDasharray = circumference;
            circle.style.strokeDashoffset = offset;
        });
    }


    /* ==========================================================================
       6. SCROLL REVEAL & AUTOMATIC SKILL LOAD
       ========================================================================== */
    const revealElements = document.querySelectorAll('.scroll-reveal');

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                
                // If it is the technical skills section container, animate initial active tab automatically
                if (entry.target.classList.contains('skills-content')) {
                    const activePane = entry.target.querySelector('.tab-pane.active');
                    animateSkillsPanel(activePane);
                }
                
                // Stop observing this element once animated
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));
    
    // Make sure we also observe skills-content separately if needed
    const skillsContent = document.querySelector('.skills-content');
    if (skillsContent) revealObserver.observe(skillsContent);


    /* ==========================================================================
       7. PROJECT GRID FILTERING
       ========================================================================== */
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Active state
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            projectCards.forEach(card => {
                const category = card.getAttribute('data-category');
                
                if (filterValue === 'all' || category === filterValue) {
                    card.style.display = 'flex';
                    // Trigger animate entry
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'scale(1)';
                    }, 50);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.85)';
                    // Delay display change to complete transition
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        });
    });


    /* ==========================================================================
       8. DEVOPS CI/CD PIPELINE SIMULATOR
       ========================================================================== */
    const triggerBtn = document.getElementById('trigger-pipeline-btn');
    const consoleLogs = document.getElementById('console-logs');
    
    const steps = {
        commit: document.getElementById('step-commit'),
        build: document.getElementById('step-build'),
        docker: document.getElementById('step-docker'),
        deploy: document.getElementById('step-deploy')
    };

    const connectors = {
        1: document.getElementById('connector-1').querySelector('.connector-progress'),
        2: document.getElementById('connector-2').querySelector('.connector-progress'),
        3: document.getElementById('connector-3').querySelector('.connector-progress')
    };

    let isPipelineRunning = false;

    // Custom logger helper
    function addConsoleLine(text, type = 'info', delay = 0) {
        return new Promise(resolve => {
            setTimeout(() => {
                const line = document.createElement('div');
                line.className = `console-line ${type}`;
                
                // Prefix log symbols
                let prefix = '[INFO]';
                if (type === 'cmd') prefix = 'vinisha-user@cloud-host:~$';
                else if (type === 'success') prefix = '[SUCCESS]';
                else if (type === 'warn') prefix = '[WARN]';
                
                line.innerHTML = `<span style="color: var(--text-muted)">${prefix}</span> ${text}`;
                consoleLogs.appendChild(line);
                consoleLogs.scrollTop = consoleLogs.scrollHeight;
                resolve();
            }, delay);
        });
    }

    function clearConsole() {
        consoleLogs.innerHTML = '';
    }

    function resetPipelineVisuals() {
        // Reset steps
        Object.values(steps).forEach(step => {
            step.className = 'pipeline-step';
            step.querySelector('.step-timer').textContent = 'Pending';
            // Restore static spinner icon
            step.querySelector('.step-status').innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i>';
        });

        // Reset progress lines
        Object.values(connectors).forEach(conn => {
            conn.style.transition = 'none';
            conn.style.width = '0';
        });
    }

    async function runPipeline() {
        if (isPipelineRunning) return;
        isPipelineRunning = true;
        triggerBtn.disabled = true;
        triggerBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Execution Running...';

        clearConsole();
        resetPipelineVisuals();

        try {
            // --- STEP 1: GIT COMMIT ---
            steps.commit.classList.add('active');
            steps.commit.querySelector('.step-timer').textContent = 'Running...';
            await addConsoleLine('git push origin main', 'cmd', 200);
            await addConsoleLine('Initializing Webhook for repository: vinisha-t/be-cse-cloud-app', 'info', 400);
            await addConsoleLine('New webhook event captured (Ref: refs/heads/main). SHA: 9fa2c4b', 'info', 400);
            await addConsoleLine('Agent matching: pipeline runner container provisioned successfully.', 'info', 500);
            
            // Mark step 1 completed
            steps.commit.classList.remove('active');
            steps.commit.classList.add('success');
            steps.commit.querySelector('.step-status').innerHTML = '<i class="fa-solid fa-check"></i>';
            steps.commit.querySelector('.step-timer').textContent = '0.9s';
            await addConsoleLine('Code committed successfully.', 'success', 200);

            // Connect Step 1 -> Step 2
            connectors[1].style.transition = 'width 1s linear';
            connectors[1].style.width = '100%';
            await new Promise(r => setTimeout(r, 1000));

            // --- STEP 2: BUILD & TEST ---
            steps.build.classList.add('active');
            steps.build.querySelector('.step-timer').textContent = 'Running...';
            await addConsoleLine('Starting test & build verification run...', 'info', 100);
            await addConsoleLine('Installing package dependencies (Languages: Java JDK, Python v3, C libraries)...', 'info', 500);
            await addConsoleLine('Compiling modules: MainController.java, data_processor.py...', 'info', 600);
            await addConsoleLine('Executing unit test suites...', 'info', 400);
            await addConsoleLine('Running Python PyTest suites: 8 test cases resolved successfully.', 'info', 400);
            await addConsoleLine('Running Java JUnit controllers: 6 assertions completed.', 'info', 300);
            await addConsoleLine('Total coverage: 92.4% codebase integration verified.', 'success', 300);

            // Mark step 2 completed
            steps.build.classList.remove('active');
            steps.build.classList.add('success');
            steps.build.querySelector('.step-status').innerHTML = '<i class="fa-solid fa-check"></i>';
            steps.build.querySelector('.step-timer').textContent = '2.6s';
            await addConsoleLine('Build artifacts generated successfully.', 'success', 200);

            // Connect Step 2 -> Step 3
            connectors[2].style.transition = 'width 1.2s linear';
            connectors[2].style.width = '100%';
            await new Promise(r => setTimeout(r, 1200));

            // --- STEP 3: DOCKERIZE ---
            steps.docker.classList.add('active');
            steps.docker.querySelector('.step-timer').textContent = 'Running...';
            await addConsoleLine('docker build -t ecr.aws/vinisha-app:latest .', 'cmd', 200);
            await addConsoleLine('Step 1/4 : FROM alpine-java-python:latest', 'info', 300);
            await addConsoleLine('Step 2/4 : COPY build/libs/app.jar /opt/app.jar', 'info', 400);
            await addConsoleLine('Step 3/4 : EXPOSE 8080', 'info', 200);
            await addConsoleLine('Step 4/4 : CMD ["java", "-jar", "/opt/app.jar"]', 'info', 200);
            await addConsoleLine('Successfully built container image: sha256:4b91f2c418e', 'success', 300);
            await addConsoleLine('Pushing container layers to AWS ECR registry...', 'info', 400);
            await addConsoleLine('Layer 1/3 (50.2MB): Pushed', 'info', 300);
            await addConsoleLine('Layer 2/3 (12.4MB): Pushed', 'info', 200);
            await addConsoleLine('Layer 3/3 (1.2KB): Pushed', 'info', 100);

            // Mark step 3 completed
            steps.docker.classList.remove('active');
            steps.docker.classList.add('success');
            steps.docker.querySelector('.step-status').innerHTML = '<i class="fa-solid fa-check"></i>';
            steps.docker.querySelector('.step-timer').textContent = '2.4s';
            await addConsoleLine('AWS Container Registry update complete.', 'success', 200);

            // Connect Step 3 -> Step 4
            connectors[3].style.transition = 'width 1s linear';
            connectors[3].style.width = '100%';
            await new Promise(r => setTimeout(r, 1000));

            // --- STEP 4: AWS CLOUD DEPLOY ---
            steps.deploy.classList.add('active');
            steps.deploy.querySelector('.step-timer').textContent = 'Running...';
            await addConsoleLine('Updating AWS ECS task definitions...', 'info', 300);
            await addConsoleLine('Service cluster update: cloud-cluster-vpc initiated...', 'info', 400);
            await addConsoleLine('Replacing task container... waiting for health check probes...', 'info', 600);
            await addConsoleLine('Elastic Load Balancer (ELB): Target group checks passing [2/2 healthy]', 'success', 600);
            await addConsoleLine('Routing update completed: traffic forwarded to newly deployed task version.', 'info', 400);

            // Mark step 4 completed
            steps.deploy.classList.remove('active');
            steps.deploy.classList.add('success');
            steps.deploy.querySelector('.step-status').innerHTML = '<i class="fa-solid fa-check"></i>';
            steps.deploy.querySelector('.step-timer').textContent = '2.3s';
            
            await addConsoleLine('=========================================', 'info', 200);
            await addConsoleLine('PIPELINE SUCCESSFUL! APPLICATION IS LIVE.', 'success', 200);
            await addConsoleLine('Hosting Endpoint: https://vinisha-app.aws.cloud', 'success', 100);
            await addConsoleLine('=========================================', 'info', 100);

        } catch (error) {
            addConsoleLine(`Pipeline failed: ${error}`, 'warn');
        } finally {
            isPipelineRunning = false;
            triggerBtn.disabled = false;
            triggerBtn.innerHTML = '<i class="fa-solid fa-play"></i> Trigger Deploy Pipeline';
        }
    }

    triggerBtn.addEventListener('click', runPipeline);


    /* ==========================================================================
       9. CONTACT FORM INTERACTION
       ========================================================================== */
    const contactForm = document.getElementById('portfolio-contact-form');
    const successPanel = document.getElementById('form-success-msg');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Simulating API loading state
            const submitBtn = document.getElementById('form-submit-btn');
            const originalHtml = submitBtn.innerHTML;
            
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Sending...';

            setTimeout(() => {
                // Hide form, show success
                contactForm.classList.add('hidden');
                successPanel.classList.remove('hidden');
            }, 1500);
        });
    }
});
