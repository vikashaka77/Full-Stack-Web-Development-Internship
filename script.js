let slides = document.querySelectorAll(".slide");
let index = 0;

function showNextSlide() {
  slides[index].classList.remove("active");
  index = (index + 1) % slides.length;
  slides[index].classList.add("active");
}

setInterval(showNextSlide, 5000); // change every 5 seconds

// ------------------ Slider ------------------


function showNextSlide() {
  slides[index].classList.remove("active");
  index = (index + 1) % slides.length;
  slides[index].classList.add("active");
}

setInterval(showNextSlide, 5000); // change every 5 seconds

// ------------------ Sign Up Modal ------------------
const signupBtn = document.getElementById('signup-btn');
const modal = document.getElementById('signup-modal');
const closeBtn = document.querySelector('.modal .close');

// Open modal
signupBtn.addEventListener('click', () => {
  modal.style.display = 'block';
});

// Close modal when clicking X
closeBtn.addEventListener('click', () => {
  modal.style.display = 'none';
});

// Close modal when clicking outside modal content
window.addEventListener('click', (e) => {
  if(e.target === modal) {
    modal.style.display = 'none';
  }
});

// Optional: handle form submission
const signupForm = document.getElementById('signup-form');
signupForm.addEventListener('submit', (e) => {
  e.preventDefault();
  alert('Thank you for signing up!');
  modal.style.display = 'none';
  signupForm.reset();
});
