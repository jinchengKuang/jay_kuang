/**
 * Portfolio Application Logic
 * 
 * This script handles the fetching of dynamic content from 'content.json'
 * and renders it into the DOM. It assumes specific ID targets exist in the HTML.
 */

/**
 * Main entry point: Loads content from the JSON file and triggers rendering.
 * Called immediately when the script executes.
 */
async function loadContent() {
    try {
        // Fetch the JSON file containing all portfolio data
        const response = await fetch('content.json');

        // Check for network errors
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Parse JSON response
        const data = await response.json();

        // Render each section of the portfolio
        renderSite(data.site, data.profile);
        renderProfile(data.profile);
        renderTerminal(data.terminal);
        renderEducation(data.education);
        renderExperience(data.experience);
        renderSkills(data.skills);
        renderProjects(data.projects);
        renderContact(data.contact, data.profile);
        renderFooter(data.footer);

        // Setup Scroll Animations and Dot Navigation
        setupScrollSystem();

    } catch (error) {
        console.error('Could not load content:', error);
    }
}

/**
 * Renders global site elements (Title, Logo, Navigation).
 * @param {Object} site - Site data object.
 * @param {Object} profile - Profile data object.
 */
function renderSite(site, profile) {
    if (!site) return;

    // Set Browser Title and Logo
    document.getElementById('site-title').innerText = site.title;
    document.getElementById('site-logo').innerText = site.logo;

    // Render Desktop Navigation Links
    const navHtml = site.nav.map(link => `
        <a class="text-sm font-medium hover:text-primary transition-colors" href="${link.url}">${link.name}</a>
    `).join('');
    document.getElementById('nav-links').innerHTML = navHtml;

    // Render Mobile Navigation Links
    const mobileNavHtml = site.nav.map(link => `
        <a class="text-lg font-medium hover:text-primary transition-colors py-2 border-b border-slate-100 dark:border-slate-800 last:border-0" href="${link.url}" onclick="toggleMenu()">${link.name}</a>
    `).join('');
    document.getElementById('mobile-nav-links').innerHTML = mobileNavHtml;

    // Render Dot Navigation
    const dotNav = document.getElementById('dot-nav');
    if (dotNav) {
        dotNav.innerHTML = site.nav.map(link => {
            const id = link.url === '#' ? 'home' : link.url.replace('#', '');
            return `<div class="dot" data-id="${id}" data-label="${link.name}" onclick="document.getElementById('${id}').scrollIntoView({behavior: 'smooth'})"></div>`;
        }).join('');
    }

    // Navbar Resume Links
    if (profile && profile.resume_url) {
        document.getElementById('nav-resume-link').href = profile.resume_url;
        document.getElementById('nav-resume-link').setAttribute('download', '');
        document.getElementById('nav-resume-text').innerText = "Resume";
        document.getElementById('mobile-resume-link').href = profile.resume_url;
        document.getElementById('mobile-resume-link').setAttribute('download', '');
    }

    // Setup Menu Toggle
    const menuToggle = document.getElementById('menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');

    window.toggleMenu = () => {
        mobileMenu.classList.toggle('hidden');
        const icon = menuToggle.querySelector('.material-symbols-outlined');
        icon.innerText = mobileMenu.classList.contains('hidden') ? 'menu' : 'close';
    };

    menuToggle.onclick = toggleMenu;
}

/**
 * Renders the Hero section (Name, Title, Bio, and CTA buttons).
 * @param {Object} profile - The profile data object.
 */
function renderProfile(profile) {
    if (!profile) return;

    // Build the Action Buttons (LinkedIn, GitHub) if URLs exist
    let actions = ``;
    if (profile.github_url || profile.linkedin_url) {
        actions = `<div class="flex flex-wrap gap-4 pt-4">`;

        // LinkedIn Button
        if (profile.linkedin_url) {
            actions += `<a class="group flex items-center gap-3 bg-white dark:bg-surface-dark border border-slate-200 dark:border-slate-800 px-4 py-2 rounded-xl hover:border-primary/50 transition-all shadow-sm" href="${profile.linkedin_url}" target="_blank">
                <div class="size-8 bg-slate-50 dark:bg-slate-900 rounded-lg flex items-center justify-center group-hover:text-primary transition-colors text-slate-600 dark:text-slate-400">
                    <svg class="size-5 fill-current" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"></path></svg>
                </div>
                <span class="font-bold text-sm text-slate-900 dark:text-white">LinkedIn</span>
            </a>`;
        }

        // GitHub Button
        if (profile.github_url) {
            actions += `<a class="group flex items-center gap-3 bg-white dark:bg-surface-dark border border-slate-200 dark:border-slate-800 px-4 py-2 rounded-xl hover:border-primary/50 transition-all shadow-sm" href="${profile.github_url}" target="_blank">
                <div class="size-8 bg-slate-50 dark:bg-slate-900 rounded-lg flex items-center justify-center group-hover:text-primary transition-colors text-slate-600 dark:text-slate-400">
                    <svg class="size-5 fill-current" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"></path></svg>
                </div>
                <span class="font-bold text-sm text-slate-900 dark:text-white">GitHub</span>
            </a>`;
        }
        actions += `</div>`;
    }

    // Construct the Hero HTML
    const html = `
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 text-xs font-mono font-bold">
            <span class="relative flex h-2 w-2">
                <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span class="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            ${profile.availability}
        </div>
        <h1 class="text-5xl lg:text-7xl font-black tracking-tight leading-tight text-slate-900 dark:text-white">
            ${profile.title_prefix || "Software"} <span class="text-primary">${profile.role_highlight || "Architect"}</span> ${profile.title_suffix || "&amp; Engineer."}
        </h1>
        <p class="text-lg text-slate-600 dark:text-slate-400 max-w-lg leading-relaxed">
            ${profile.hero_text}
        </p>
        ${actions}
    `;

    // Inject into DOM
    document.getElementById('hero-content').innerHTML = html;
}

/**
 * Renders the "Terminal" styled card content.
 * @param {Object} term - The terminal data object.
 */
function renderTerminal(term) {
    if (!term) return;

    // Set terminal title bar text
    document.getElementById('terminal-title').innerText = `${term.user} — ${term.machine} — ${term.dimensions}`;

    // Create HTML for initialization messages
    const messages = term.init_messages.map(msg =>
        `<p class="${msg.style}">${msg.text}</p>`
    ).join('');

    // Create the "JSON response" block
    const bioBlock = `
        <p class="pt-2"><span class="text-primary">➜</span> <span class="text-cyan-600 dark:text-cyan-400">~</span> ${term.bio_command}</p>
        <pre class="text-amber-700 dark:text-amber-200">${JSON.stringify(term.bio_json, null, 2)}</pre>
    `;

    // Blinking cursor effect
    const cursor = `
         <p class="pt-2 flex items-center gap-1">
            <span class="text-primary">➜</span> <span class="text-cyan-600 dark:text-cyan-400">~</span>
            <span class="w-2 h-4 bg-slate-400 animate-pulse"></span>
        </p>
    `;

    const initCmd = `<p><span class="text-primary">➜</span> <span class="text-cyan-600 dark:text-cyan-400">~</span> ${term.init_command}</p>`;

    document.getElementById('terminal-body').innerHTML = initCmd + messages + bioBlock + cursor;
}

/**
 * Renders Education and Certification sections.
 * @param {Object} edu - Education data object.
 */
function renderEducation(edu) {
    if (!edu) return;

    document.getElementById('edu-heading').innerText = edu.heading;

    // Render Degrees
    const degreesHtml = edu.degrees.map(d => `
        <div class="relative flex items-start group">
            <div class="absolute left-0 top-0 size-10 rounded-full bg-slate-200 dark:bg-slate-800 border-4 border-white dark:border-background-dark flex items-center justify-center z-10 group-hover:bg-primary group-hover:shadow-lg transition-all duration-300">
                <span class="material-symbols-outlined text-slate-500 dark:text-slate-400 text-sm group-hover:text-white transition-colors">school</span>
            </div>
            
            <div class="flex-1 pl-12 text-left">
                <div>
                    <h4 class="text-xl font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors">${d.degree}</h4>
                    <p class="text-primary font-mono font-medium">${d.school}</p>
                    <p class="text-slate-500 text-sm mt-1">${d.year}</p>
                </div>
                <ul class="text-sm text-slate-600 dark:text-slate-400 space-y-1 list-disc list-inside mt-2">
                    ${d.details.map(i => `<li>${i}</li>`).join('')}
                </ul>
            </div>
        </div>
    `).join('');
    document.getElementById('education-degrees').innerHTML = degreesHtml;

    // Conditional Certifications Rendering
    const certsContainer = document.getElementById('certifications-container');
    const eduGrid = document.getElementById('education-grid');

    if (edu.certifications && edu.certifications.length > 0) {
        certsContainer.classList.remove('hidden');
        if (eduGrid) eduGrid.classList.add('lg:grid-cols-2');

        document.getElementById('certs-heading').innerText = edu.certs_heading;
        const certsHtml = edu.certifications.map((c) => `
            <div class="flex items-center justify-between py-3 border-b border-slate-200 dark:border-slate-800 last:border-0">
                <span class="font-medium text-slate-800 dark:text-slate-200">${c.name}</span>
                <span class="text-xs font-mono text-slate-500 uppercase">${c.issued}</span>
            </div>
        `).join('');
        document.getElementById('education-certs').innerHTML = certsHtml;
    } else {
        if (certsContainer) certsContainer.classList.add('hidden');
        if (eduGrid) eduGrid.classList.remove('lg:grid-cols-2');
    }
}

/**
 * Renders the Experience timeline.
 * @param {Object} exp - Experience data object.
 */
function renderExperience(exp) {
    if (!exp) return;

    document.getElementById('exp-heading').innerText = exp.heading;

    let html = '';
    exp.items.forEach((job, index) => {
        html += `
        <div class="relative flex items-start group">
            <div class="absolute left-0 top-0 size-10 rounded-full bg-slate-200 dark:bg-slate-800 border-4 border-white dark:border-background-dark flex items-center justify-center z-10 group-hover:bg-primary group-hover:shadow-lg transition-all duration-300">
                <span class="material-symbols-outlined text-slate-500 dark:text-slate-400 text-sm group-hover:text-white transition-colors">
                    ${job.icon}
                </span>
            </div>
            
            <div class="flex-1 pl-12 text-left">
                <div>
                    <h3 class="text-xl font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors">${job.role}</h3>
                    <p class="text-primary font-mono font-medium">${job.company}</p>
                    <p class="text-slate-500 text-sm mt-1">${job.period}</p>
                </div>
                <p class="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mt-2">
                    ${job.description}
                </p>
            </div>
        </div>
        `;
    });
    document.getElementById('experience-list').innerHTML = html;
}

/**
 * Renders the Skills grid.
 * @param {Object} skills - Skills data object.
 */
/**
 * Helper to get icon HTML for a skill.
 */
function getSkillIcon(skill) {
    // We'll use devicon classes where possible, or high-quality material icons.
    // To ensure "black and white", we use -plain or -line variants and avoid color classes.
    const skillMap = {
        'Python': '<i class="devicon-python-plain"></i>',
        'JavaScript': '<i class="devicon-javascript-plain"></i>',
        'TypeScript': '<i class="devicon-typescript-plain"></i>',
        'Java': '<i class="devicon-java-plain"></i>',
        'SQL': '<i class="devicon-mysql-plain"></i>', // Common representation for SQL
        'React': '<i class="devicon-react-original"></i>',
        'Next': '<i class="devicon-nextjs-plain"></i>',
        'Node': '<i class="devicon-nodejs-plain"></i>',
        'Express': '<i class="devicon-express-original"></i>',
        'Jest': '<i class="devicon-jest-plain"></i>',
        'Selenium': '<i class="devicon-selenium-original"></i>',
        'GitLab': '<i class="devicon-gitlab-plain"></i>',
        'Jenkins': '<i class="devicon-jenkins-line"></i>',
        'Docker': '<i class="devicon-docker-plain"></i>',
        'REST APIs': '<span class="material-symbols-outlined text-[18px]">api</span>',
        'CI/CD': '<span class="material-symbols-outlined text-[18px]">all_inclusive</span>', // Loop icon common for CI/CD
        'JUnit': '<i class="devicon-junit-plain"></i>',
        'Splunk': `<svg class="size-4 fill-current" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
            <path d="M5.396 11.93V0l53.207 26.698V37.49L5.396 64V52.26L46.675 32z" />
        </svg>`
    };

    // Note: CSS will handle the "Black and White" requirement by making all icons slate/neutral.
    return skillMap[skill] || '<span class="material-symbols-outlined text-[18px]">terminal</span>';
}

function renderSkills(skills) {
    if (!skills) return;

    document.getElementById('skills-heading').innerText = skills.heading;
    document.getElementById('skills-desc').innerText = skills.description;

    const html = skills.categories.map(cat => `
        <div class="space-y-4">
            <h3 class="text-sm font-bold font-mono text-primary uppercase tracking-widest flex items-center gap-2">
                <span class="material-symbols-outlined text-lg">${cat.icon}</span> ${cat.category}
            </h3>
            <div class="flex flex-wrap gap-3">
                ${cat.items.map(s => `
                    <div class="skill-badge">
                        ${getSkillIcon(s)}
                        ${s}
                    </div>
                `).join('')}
            </div>
        </div>
    `).join('');
    document.getElementById('skills-grid').innerHTML = html;
}

/**
 * Renders the Projects grid.
 * @param {Object} projects - Projects data object.
 */
function renderProjects(projects) {
    if (!projects) return;

    document.getElementById('projects-heading').innerText = projects.heading;
    document.getElementById('projects-desc').innerText = projects.description;

    const html = projects.items.map(p => `
        <div class="group bg-white dark:bg-surface-dark border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden hover:border-primary/50 transition-all hover:shadow-xl shadow-sm">
            <div class="aspect-video bg-slate-200 dark:bg-slate-900 overflow-hidden">
                <img class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100" src="${p.image}" alt="${p.title}"/>
            </div>
            <div class="p-6 space-y-4">
                <div class="flex justify-between items-start">
                    <h3 class="text-xl font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors">${p.title}</h3>
                    <div class="flex gap-2">
                        ${p.links.map(l => `<span class="material-symbols-outlined text-slate-400 hover:text-primary cursor-pointer text-xl">${l.type === 'link' ? 'link' : 'code'}</span>`).join('')}
                    </div>
                </div>
                <p class="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">
                    ${p.description}
                </p>
                <div class="flex flex-wrap gap-2">
                    ${p.tags.map(t => `
                        <span class="px-2 py-1 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 text-[10px] font-mono font-bold rounded">${t}</span>
                    `).join('')}
                </div>
            </div>
        </div>
    `).join('');
    document.getElementById('projects-grid').innerHTML = html;
}

/**
 * Renders the Contact section and social links.
 * @param {Object} contact - Contact data object.
 * @param {Object} profile - Profile data object.
 */
function renderContact(contact, profile) {
    if (!contact) return;

    // Set headers and labels
    document.getElementById('cta-title').innerText = contact.cta_title;
    document.getElementById('cta-desc').innerText = contact.cta_desc;
    document.getElementById('connect-label').innerText = contact.connect_label;

    // Set form labels and placeholders
    document.getElementById('label-name').innerText = contact.form.labels.name;
    document.getElementById('label-email').innerText = contact.form.labels.email;
    document.getElementById('label-message').innerText = contact.form.labels.message;
    document.getElementById('submit-text').innerText = contact.form.labels.submit;

    document.getElementById('name').placeholder = contact.form.placeholders.name;
    document.getElementById('email').placeholder = contact.form.placeholders.email;
    document.getElementById('message').placeholder = contact.form.placeholders.message;

    // Connect Code Snippet (Hardcoded default if not in JSON, but I added it for future)
    const codeSnippet = `func main() {
    client := NewContactClient()
    msg := &Message{
        From: "Recruiter",
        Body: "We're hiring!",
    }
    err := client.Send(msg)
    if err != nil {
        panic(err)
    }
}`;
    document.getElementById('contact-code').innerText = codeSnippet;

    // Generate social links
    const linksHtml = contact.links.map(link => `
        <a class="group flex items-center gap-3 bg-white dark:bg-surface-dark border border-slate-200 dark:border-slate-800 px-4 py-2 rounded-xl hover:border-primary/50 transition-all shadow-sm" href="${link.url}" target="_blank">
            <div class="size-8 bg-slate-50 dark:bg-slate-900 rounded-lg flex items-center justify-center group-hover:text-primary transition-colors text-slate-600 dark:text-slate-400">
                <svg class="size-5 fill-current" viewBox="0 0 24 24"><path d="${link.icon_svg_path}"></path></svg>
            </div>
            <span class="font-bold text-sm text-slate-900 dark:text-white">${link.name}</span>
        </a>
    `).join('');

    // Dynamic resume button in contact section
    const resumeUrl = profile && profile.resume_url ? profile.resume_url : '#';
    const downloadBtn = `
         <a class="bg-primary hover:bg-primary/90 text-white px-5 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 shadow-sm" href="${resumeUrl}" download target="_blank">
            <span class="material-symbols-outlined text-sm">download</span>
            Resume
        </a>
    `;

    document.getElementById('social-links').innerHTML = linksHtml + downloadBtn;

    // Setup form handler
    setupFormHandler(contact.form);
}

/**
 * Handles the contact form submission.
 */
function setupFormHandler(formConfig) {
    const form = document.getElementById('contact-form');
    if (!form) return;

    form.onsubmit = async (e) => {
        e.preventDefault();

        const btn = document.getElementById('submit-btn-content');
        const originalBtnHtml = btn.innerHTML;

        // Loading State
        btn.disabled = true;
        btn.innerHTML = `<span class="material-symbols-outlined animate-spin text-sm">progress_activity</span> Sending...`;

        try {
            if (formConfig.action) {
                const formData = new FormData(form);
                const response = await fetch(formConfig.action, {
                    method: 'POST',
                    body: formData,
                    headers: { 'Accept': 'application/json' }
                });

                if (response.ok) {
                    showToast(formConfig.success_message, 'success');
                    form.reset();
                } else {
                    showToast(formConfig.error_message, 'error');
                }
            } else {
                await new Promise(resolve => setTimeout(resolve, 1500));
                showToast(formConfig.success_message, 'success');
                form.reset();
            }
        } catch (error) {
            console.error('Submission Error:', error);
            showToast(formConfig.error_message, 'error');
        } finally {
            btn.disabled = false;
            btn.innerHTML = originalBtnHtml;
        }
    };
}

/**
 * Displays a toast notification.
 */
function showToast(message, type) {
    const toast = document.getElementById('toast');
    const icon = document.getElementById('toast-icon');
    const msg = document.getElementById('toast-message');

    if (type === 'success') {
        toast.className = `fixed bottom-4 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-xl shadow-2xl transition-all duration-300 z-[200] flex items-center gap-3 bg-emerald-600`;
        icon.innerText = 'check_circle';
    } else {
        toast.className = `fixed bottom-4 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-xl shadow-2xl transition-all duration-300 z-[200] flex items-center gap-3 bg-red-600`;
        icon.innerText = 'error';
    }

    msg.innerText = message;
    requestAnimationFrame(() => {
        toast.classList.remove('opacity-0', 'translate-y-10', 'pointer-events-none');
    });

    setTimeout(() => {
        toast.classList.add('opacity-0', 'translate-y-10', 'pointer-events-none');
    }, 4000);
}

/**
 * Renders the Footer information.
 */
function renderFooter(footer) {
    if (!footer) return;
    document.getElementById('footer-logo').innerText = footer.logo;
    document.getElementById('footer-text').innerText = footer.text;
    document.getElementById('status-label').innerText = footer.status_label;
    document.getElementById('status-text').innerText = footer.status;
    document.getElementById('version-text').innerText = footer.version;
}

/**
 * Initializes Intersection Observer for scroll animations and dot navigation updates.
 */
function setupScrollSystem() {
    const sections = document.querySelectorAll('section.reveal');
    const dots = document.querySelectorAll('#dot-nav .dot');

    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Reveal section animation
                entry.target.classList.add('active');

                // Update active dot navigation
                const sectionId = entry.target.id;
                dots.forEach(dot => {
                    if (dot.dataset.id === sectionId) {
                        dot.classList.add('active');
                    } else {
                        dot.classList.remove('active');
                    }
                });
            } else {
                // Remove active class to make animation repeatable
                entry.target.classList.remove('active');
            }
        });
    }, observerOptions);

    sections.forEach(section => observer.observe(section));

    // Initial check in case some sections are already in view
    setTimeout(() => {
        sections.forEach(section => {
            const rect = section.getBoundingClientRect();
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                section.classList.add('active');
            }
        });
    }, 100);
}

// Start the content loading process
loadContent();
