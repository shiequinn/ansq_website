// Hamburger menu toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navMenu.classList.toggle('active');
});

// Initialize Swiper instance
let reviewSwiper;

function initReviewSwiper() {
  if (reviewSwiper) {
    reviewSwiper.destroy(true, true);
  }
  reviewSwiper = new Swiper('.mySwiper', {
    slidesPerView: 1,
    spaceBetween: 20,
    loop: true,
  autoplay: {
    delay: 3000,
    disableOnInteraction: false,
  },
  pagination: {
    el: '.swiper-pagination',
    clickable: true
  },
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },
  });
}

// Create a slide element for a review
function createReviewSlide(review) {
  const slide = document.createElement('div');
  slide.className = 'swiper-slide review-item';

  // Generate star icons based on rating
  let starsHTML = '';
  for (let i = 1; i <= 5; i++) {
    starsHTML += `<span class="${i <= review.rating ? 'filled' : 'empty'}">&#9733;</span>`;
  }

  slide.innerHTML = `
    <div class="review-content">
      <p class="client-name">${review.name}</p>
      <p class="client-position">${review.position}</p>
      <p class="client-review">"${review.review}"</p>
      <div class="client-rating">${starsHTML}</div>
    </div>
  `;
  return slide;
}

// Load reviews, create slides, and initialize Swiper
async function loadReviews() {
  const reviewWrapper = document.querySelector('#reviewWrapper');
  reviewWrapper.innerHTML = ''; // Clear existing slides

  let reviews = [];
  try {
    const response = await fetch('http://ansq_website.onrender.com');
    if (response.ok) {
      reviews = await response.json();
    }
  } catch (err) {
    console.error('Failed to fetch reviews:', err);
  }

  // Add sample review if none exist
  if (reviews.length === 0) {
    reviews = [{
      name: 'John Doe',
      position: 'Sample Position',
      review: 'This is a sample review for testing.',
      rating: 4,
    }];
  }

  // Append slides
  reviews.forEach((review) => {
    reviewWrapper.appendChild(createReviewSlide(review));
  });

  // Reinitialize Swiper
  initReviewSwiper();
}

// Load reviews after DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  loadReviews();

  // Star rating interactivity setup
  const stars = document.querySelectorAll('.star-rating .star');
  const ratingInput = document.getElementById('ratingInput');
  let selectedRating = 0;

  function highlightStars(rating) {
    stars.forEach((star, index) => {
      if (index < rating) {
        star.classList.add('filled');
        star.setAttribute('aria-checked', 'true');
      } else {
        star.classList.remove('filled');
        star.setAttribute('aria-checked', 'false');
      }
    });
  }

  function resetStars() {
    selectedRating = 0;
    highlightStars(0);
  }

  stars.forEach((star, index) => {
    star.addEventListener('mouseover', () => highlightStars(index + 1));
    star.addEventListener('mouseout', () => highlightStars(selectedRating));
    star.addEventListener('click', () => {
      selectedRating = index + 1;
      highlightStars(selectedRating);
      if (ratingInput) ratingInput.value = selectedRating;
    });
  });

  // Handle review form submission
  document.getElementById('clientReviewForm').addEventListener('submit', async(e) => {
    e.preventDefault();

    const name = document.getElementById('clientName').value.trim();
    const position = document.getElementById('clientPosition').value.trim();
    const reviewText = document.getElementById('clientReview').value.trim();
    const rating = parseInt(document.getElementById('ratingInput')?.value || '0');

    if (rating === 0) {
      alert('Please select a rating');
      return;
    }

    const newReview = {
      name,
      position,
      review: reviewText,
      rating,
    };
try {
    const response = await fetch('http://ansq_website.onrender.com', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newReview)
    });
    if (!response.ok) {
      throw new Error('Failed to post review');
    }
  // Reset form
    document.getElementById('clientReviewForm').reset();
    resetStars();
    alert('Review submitted successfully');

    // Reload reviews
    await loadReviews();
  } catch (err) {
    console.error(err);
    alert('Failed to post review');
  }
  });

 // Service section toggle
const titles = document.querySelectorAll('.service-title');

titles.forEach(title => {
  title.addEventListener('click', () => {
    const description = title.nextElementSibling;
    const isOpen = description.classList.contains('show');

    document.querySelectorAll('.service-description')
      .forEach(desc => desc.classList.remove('show'));

    document.querySelectorAll('.service-title')
      .forEach(t => t.classList.remove('active'));

    if (!isOpen) {
      description.classList.add('show');
      title.classList.add('active');
    }
  });
});
});
