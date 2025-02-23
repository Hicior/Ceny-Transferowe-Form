// script.js
document.addEventListener("DOMContentLoaded", function() {
    /* ======================================== */
    /*         Global Variables & Setup       */
    /* ======================================== */
    const wrapper = document.querySelector('.ceny-transferowe-wrapper');
    const cards = wrapper.querySelectorAll('.card');
    let currentCardIndex = -1; // Start at -1 to account for intro card
    let totalQuestions = 8;
  
    /* ======================================== */
    /*            Event Listeners             */
    /* ======================================== */
    // Start button handler
    wrapper.querySelector('#start-button').addEventListener('click', function() {
      wrapper.querySelector('#intro-card').classList.remove('active');
      currentCardIndex = 0;
      showCard(currentCardIndex);
    });
  
    // Radio button change handlers
    wrapper.querySelectorAll('input[type="radio"]').forEach(radio => {
      radio.addEventListener('change', (e) => {
        handleAnswer(e.target.name, e.target.value);
      });
    });
  
    /* ======================================== */
    /*             Main Functions             */
    /* ======================================== */
    
    // Function to display the appropriate card and update progress bar
    function showCard(index) {
      wrapper.classList.add('transitioning');
  
      // Reset all cards and mark previous ones
      cards.forEach((card, i) => {
        card.classList.remove('active', 'previous');
        if (i < index && i > 0) { // Skip intro card when marking previous
          card.classList.add('previous');
        }
      });
  
      if (index >= -1 && index < cards.length) {
        // Update progress bar visibility and progress
        const progressBar = wrapper.querySelector('.progress-bar');
        if (index === -1) {
          progressBar.style.display = 'none';
        } else {
          progressBar.style.display = 'block';
          const progress = ((index + 1) / totalQuestions) * 100;
          wrapper.querySelector('.progress').style.width = `${progress}%`;
        }
  
        // Show active card (handling intro separately)
        if (index === -1) {
          wrapper.querySelector('#intro-card').classList.add('active');
        } else {
          const questionCards = Array.from(cards).filter(card => card.id !== 'intro-card');
          if (questionCards[index]) {
            questionCards[index].classList.add('active');
          }
        }
      }
  
      setTimeout(() => {
        wrapper.classList.remove('transitioning');
      }, 500);
    }
  
    // Function to handle answers and navigate through cards
    function handleAnswer(questionName, answer) {
      const nextIndex = currentCardIndex + 1;
  
      // Special handling for Q1
      if (questionName === 'q1') {
        if (answer === 'NIE') {
          // Skip Q2-Q5 if answer is NO
          currentCardIndex = 5; // Jump to Q6
        } else {
          currentCardIndex = nextIndex;
        }
      }
      // Special handling for Q6
      else if (questionName === 'q6') {
        if (answer === 'NIE') {
          // Show result if NO
          showResult();
          return;
        } else {
          currentCardIndex = nextIndex;
        }
      }
      // Handle final question Q8
      else if (questionName === 'q8') {
        showResult();
        return;
      }
      else {
        currentCardIndex = nextIndex;
      }
  
      showCard(currentCardIndex);
    }
  
    // Function to display the result based on user's answers
    function showResult() {
      let obligation = false;
      const fields = ["q2", "q3", "q4", "q5", "q7", "q8"];
      fields.forEach(fieldId => {
        const selected = wrapper.querySelector(`input[name="${fieldId}"]:checked`);
        if(selected && selected.value === "TAK") {
          obligation = true;
        }
      });
  
      wrapper.classList.add('transitioning');
      wrapper.style.opacity = '0';
      wrapper.style.transform = 'scale(0.98)';
      wrapper.style.transition = 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
  
      setTimeout(() => {
        // Replace wrapper content with result markup
        wrapper.innerHTML = `
          <div class="result-content">
            ${obligation ? `
              <div class="result-header">
                <div class="result-icon negative">!</div>
                <h2>Wymagana dokumentacja</h2>
              </div>
              <div class="result-section">
                <h3>Wynik ankiety</h3>
                <p>Wynik ankiety wskazuje, że masz obowiązek dokumentacyjny w zakresie cen transferowych.</p>
              </div>
              <div class="result-section">
                <h3>Następne kroki</h3>
                <p>Zalecamy dokonanie weryfikacji, jakiego rodzaju dokumentacja powinna zostać sporządzona.</p>
              </div>
              <div class="result-section">
                <h3>Potrzebujesz pomocy?</h3>
                <p>Skorzystaj z formularza kontaktowego lub umów konsultację.</p>
                <div class="button-group">
                  <a href="https://mentzen.pl/dane-kontaktowe/" class="button-link" target="_blank">Formularz Kontaktowy</a>
                  <a href="https://mentzen.pl/konsultacje-online/" class="button-link" target="_blank">Umów Konsultację</a>
                </div>
              </div>
            ` : `
              <div class="result-header">
                <div class="result-icon positive">✓</div>
                <h2>Brak obowiązku dokumentacyjnego</h2>
              </div>
              <div class="result-section">
                <h3>Wynik ankiety</h3>
                <p>Wynik ankiety wskazuje, że nie masz obowiązków dokumentacyjnych w zakresie cen transferowych.</p>
              </div>
              <div class="result-section">
                <h3>Potrzebujesz pomocy?</h3>
                <p>Skorzystaj z formularza kontaktowego lub umów konsultację.</p>
                <div class="button-group">
                  <a href="https://mentzen.pl/dane-kontaktowe/" class="button-link" target="_blank">Formularz Kontaktowy</a>
                  <a href="https://mentzen.pl/konsultacje-online/" class="button-link" target="_blank">Umów Konsultację</a>
                </div>
              </div>
            `}
          </div>
        `;
  
        // Fade in new content
        requestAnimationFrame(() => {
          wrapper.style.opacity = '1';
          wrapper.style.transform = 'scale(1)';
        });
  
        // Remove transitioning class after animation completes
        setTimeout(() => {
          wrapper.classList.remove('transitioning');
        }, 500);
      }, 500);
    }
  
    /* ======================================== */
    /*           Initialize Application       */
    /* ======================================== */
    // Show the intro card initially
    showCard(-1);
  });  