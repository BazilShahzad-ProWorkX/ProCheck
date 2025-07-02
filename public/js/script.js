const carousel = document.getElementById('testimonial-carousel');
const cardWidth = 315; // Adjust if card width or margin changes

function scrollRight() {
  carousel.scrollBy({ left: cardWidth, behavior: 'smooth' });
}
function scrollLeft() {
  carousel.scrollBy({ left: -cardWidth, behavior: 'smooth' });
}

// Auto scroll one card at a time
let autoScroll;
function startAutoScroll() {
  autoScroll = setInterval(() => {
    if (carousel.scrollLeft + carousel.offsetWidth >= carousel.scrollWidth) {
      carousel.scrollTo({ left: 0, behavior: 'smooth' });
    } else {
      scrollRight();
    }
  }, 4000);
}

// Pause on hover
carousel.addEventListener('mouseover', () => clearInterval(autoScroll));
carousel.addEventListener('mouseout', startAutoScroll);

startAutoScroll();


// VIN number 17 digit check-->index.html

document.getElementById("vinForm").addEventListener("submit", function (e) {
e.preventDefault();
const vin = document.getElementById("vinInput").value.trim();
if (vin.length !== 17) {
    alert("Please enter a valid 17-digit VIN.");
    return;
}
// Default to bike if no type selected, or you can add logic for that too
window.location.href = `form.html?type=bike&vin=${encodeURIComponent(vin)}`;
});
