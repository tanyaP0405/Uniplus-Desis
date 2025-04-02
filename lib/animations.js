
/**
 * Apply animations to elements with a stagger effect
 * @param {NodeList} elements - Elements to animate
 * @param {string} animation - Animation class to apply
 * @param {number} staggerDelay - Delay between animations in seconds
 */
export const applyAnimations = (elements, animation, staggerDelay = 0.1) => {
  if (!elements || elements.length === 0) return;
  
  elements.forEach((el, index) => {
    // Add animation class for CSS animations
    el.classList.add(animation);
    
    // Add stagger delay
    el.style.animationDelay = `${index * staggerDelay}s`;
    
    // Remove animation class after animation completes to allow re-animation
    el.addEventListener('animationend', () => {
      el.classList.remove(`animate-${animation}`);
      el.style.animationDelay = '';
    }, { once: true });
  });
};

/**
 * Scroll element into view with smooth animation
 * @param {string} elementId - ID of the element to scroll to
 * @param {number} offset - Offset from the top in pixels
 */
export const smoothScrollTo = (elementId, offset = 0) => {
  const element = document.getElementById(elementId);
  if (!element) return;
  
  const y = element.getBoundingClientRect().top + window.pageYOffset + offset;
  
  window.scrollTo({
    top: y,
    behavior: 'smooth'
  });
};

/**
 * Add scroll-triggered animations
 * Used for elements that should animate when they enter the viewport
 */
export const initScrollAnimations = () => {
  const animatedElements = document.querySelectorAll('.animate-on-scroll');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-in');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1
  });
  
  animatedElements.forEach(el => {
    observer.observe(el);
  });
  
  return () => {
    animatedElements.forEach(el => {
      observer.unobserve(el);
    });
  };
};
