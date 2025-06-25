// Load Three.js from CDN if not using local file
// document.write('<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"><\/script>');

document.addEventListener('DOMContentLoaded', function() {
    // Remove loader when page is loaded
    setTimeout(() => {
        document.querySelector('.loader').style.opacity = '0';
        setTimeout(() => {
            document.querySelector('.loader').style.display = 'none';
        }, 500);
    }, 1500);

    // Mobile menu toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    menuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        menuToggle.classList.toggle('active');
    });

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            navLinks.classList.remove('active');
            menuToggle.classList.remove('active');
            
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Animate skill bars on scroll
    const skillBars = document.querySelectorAll('.skill-level');
    
    function animateSkillBars() {
        skillBars.forEach(bar => {
            const level = bar.getAttribute('data-level');
            bar.style.width = level + '%';
        });
    }

    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                
                if (entry.target.classList.contains('skill-item')) {
                    animateSkillBars();
                }
                
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('section, .skill-item').forEach(section => {
        observer.observe(section);
    });

    // Initialize 3D scene
    init3DScene();
    initCubeScene();

    // Load projects dynamically
    loadProjects();
});

// 3D Scene in Hero Section
function init3DScene() {
    const container = document.getElementById('3d-container');
    if (!container) return;

    // Check if Three.js is loaded
    if (typeof THREE === 'undefined') {
        console.error('Three.js is not loaded');
        return;
    }

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    // Add lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);

    // Add a 3D model or object
    const geometry = new THREE.TorusKnotGeometry(1, 0.4, 100, 16);
    const material = new THREE.MeshPhongMaterial({ 
        color: 0x6c63ff,
        shininess: 100,
        wireframe: false
    });
    const torusKnot = new THREE.Mesh(geometry, material);
    scene.add(torusKnot);

    camera.position.z = 5;

    // Handle window resize
    window.addEventListener('resize', () => {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    });

    // Animation loop
    function animate() {
        requestAnimationFrame(animate);
        torusKnot.rotation.x += 0.005;
        torusKnot.rotation.y += 0.01;
        renderer.render(scene, camera);
    }
    
    animate();
}

// 3D Cube in About Section
function initCubeScene() {
    const container = document.getElementById('cube-container');
    if (!container) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    // Add lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);

    // Create a cube with different colors on each face
    const materials = [
        new THREE.MeshBasicMaterial({ color: 0x6c63ff }), // right
        new THREE.MeshBasicMaterial({ color: 0x4d44db }), // left
        new THREE.MeshBasicMaterial({ color: 0x8a85ff }), // top
        new THREE.MeshBasicMaterial({ color: 0x5a52e6 }), // bottom
        new THREE.MeshBasicMaterial({ color: 0x7d76ff }), // front
        new THREE.MeshBasicMaterial({ color: 0x6b62ff })  // back
    ];
    
    const geometry = new THREE.BoxGeometry(2, 2, 2);
    const cube = new THREE.Mesh(geometry, materials);
    scene.add(cube);

    camera.position.z = 5;

    // Handle window resize
    window.addEventListener('resize', () => {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    });

    // Make cube interactive
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };
    
    container.addEventListener('mousedown', () => isDragging = true);
    container.addEventListener('mouseup', () => isDragging = false);
    container.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        
        const deltaMove = {
            x: e.offsetX - previousMousePosition.x,
            y: e.offsetY - previousMousePosition.y
        };
        
        cube.rotation.y += deltaMove.x * 0.01;
        cube.rotation.x += deltaMove.y * 0.01;
        
        previousMousePosition = { x: e.offsetX, y: e.offsetY };
    });

    container.addEventListener('touchstart', (e) => {
        isDragging = true;
        previousMousePosition = { 
            x: e.touches[0].clientX, 
            y: e.touches[0].clientY 
        };
    });

    container.addEventListener('touchend', () => isDragging = false);
    
    container.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        
        const deltaMove = {
            x: e.touches[0].clientX - previousMousePosition.x,
            y: e.touches[0].clientY - previousMousePosition.y
        };
        
        cube.rotation.y += deltaMove.x * 0.01;
        cube.rotation.x += deltaMove.y * 0.01;
        
        previousMousePosition = { 
            x: e.touches[0].clientX, 
            y: e.touches[0].clientY 
        };
    });

    // Animation loop
    function animate() {
        requestAnimationFrame(animate);
        
        if (!isDragging) {
            cube.rotation.x += 0.005;
            cube.rotation.y += 0.01;
        }
        
        renderer.render(scene, camera);
    }
    
    animate();
}

// Load projects data
function loadProjects() {
    const projects = [
        {
            title: "3D Web Application",
            description: "A fully interactive 3D web application built with Three.js",
            image: "https://via.placeholder.com/600x400?text=Project+1",
            links: [
                { text: "View Demo", url: "#" },
                { text: "GitHub", url: "#" }
            ]
        },
        {
            title: "Responsive Dashboard",
            description: "Modern responsive dashboard with real-time analytics",
            image: "https://via.placeholder.com/600x400?text=Project+2",
            links: [
                { text: "View Demo", url: "#" },
                { text: "GitHub", url: "#" }
            ]
        },
        {
            title: "E-commerce Platform",
            description: "Full-stack e-commerce platform with payment integration",
            image: "https://via.placeholder.com/600x400?text=Project+3",
            links: [
                { text: "View Demo", url: "#" },
                { text: "GitHub", url: "#" }
            ]
        }
    ];

    const projectsGrid = document.querySelector('.projects-grid');
    
    projects.forEach(project => {
        const projectCard = document.createElement('div');
        projectCard.className = 'project-card slide-up';
        projectCard.innerHTML = `
            <div class="project-card-inner">
                <div class="project-card-front">
                    <img src="${project.image}" alt="${project.title}" class="project-img">
                    <div class="project-info">
                        <h3 class="project-title">${project.title}</h3>
                        <p class="project-desc">${project.description}</p>
                        <div class="project-links">
                            ${project.links.map(link => 
                                `<a href="${link.url}">${link.text}</a>`
                            ).join('')}
                        </div>
                    </div>
                </div>
                <div class="project-card-back">
                    <h3>${project.title}</h3>
                    <p>${project.description}</p>
                    <div class="project-links">
                        ${project.links.map(link => 
                            `<a href="${link.url}" style="color: white;">${link.text}</a>`
                        ).join('')}
                    </div>
                </div>
            </div>
        `;
        projectsGrid.appendChild(projectCard);
    });
}

// Add this to your main.js file
document.addEventListener('DOMContentLoaded', function() {
  const cvDownloadBtn = document.getElementById('cvDownloadBtn');
  
  // Replace with your actual CV file path
  const cvFilePath = './cv.pdf';
  
  cvDownloadBtn.addEventListener('click', function(e) {
    e.preventDefault();
    
    // Create temporary download link
    const link = document.createElement('a');
    link.href = cvFilePath;
    link.download = 'E_P_K_Kalhara_CV.pdf'; // Set your desired filename
    
    // Trigger download
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Add visual feedback
    cvDownloadBtn.classList.add('download-active');
    setTimeout(() => {
      cvDownloadBtn.classList.remove('download-active');
    }, 1000);
  });
});