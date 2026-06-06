// smooth orbit navigation - FIXED
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        
        if (targetId === '#' || targetId === '') return;
        
        const target = document.querySelector(targetId);
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// navigation glow effect
window.addEventListener('scroll', function() {
    const nav = document.querySelector('nav');
    if (nav) {
        if (window.scrollY > 100) {
            nav.style.backgroundColor = 'rgba(5, 11, 20, 0.98)';
        } else {
            nav.style.backgroundColor = 'rgba(5, 11, 20, 0.95)';
        }
    }
});