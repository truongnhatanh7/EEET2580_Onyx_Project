const faqContainer = document.querySelector(".faq__wrapper");
animationDetails();

async function animationDetails() {
    await getFaqContent();
    document.querySelectorAll(".faq__card").forEach((el) => {
        new Accordion(el);
        // el.addEventListener("click", onClick(event));
    });
}
async function getFaqContent() {
    const response = await (await fetch("http://localhost:5501/assets/js/faq.json")).json();
    response.map(card => {
        faqContainer.innerHTML += `
        <details class="faq__card flex flex-center">
                <summary class="flex flex-center-leftside">${card["title"]}</summary>

                <div class="faq__card-content flex flex-center">
                    <p>${card["detail"].reduce((totalLine, line, index) => {
                        return totalLine + (index === 0? (line) : ("<br>" + line));
                    }, "")}</p>

                    ${card["img"] == ""? "" : `<img src="${card["img"]}" alt="Setup in faq">`}
                </div>
            </details>`;
    });

}
class Accordion {
    constructor(el) {
      // Store the <details> element
      this.el = el;
      // Store the <summary> element
      this.summary = el.querySelector('summary');
      // Store the <div class="content"> element
      this.content = el.querySelector('.faq__card-content');
  
      // Store the animation object (so we can cancel it if needed)
      this.animation = null;
      // Store if the element is closing
      this.isClosing = false;
      // Store if the element is expanding
      this.isExpanding = false;
      // Detect user clicks on the summary element
      this.summary.addEventListener('click', async (e) => {
          await this.closeOtherDetails(this.el);
          this.onClick(e);
        });
    }
  
    onClick(e) {
      // Stop default behaviour from the browser
      e.preventDefault();
      // Add an overflow on the <details> to avoid content overflowing
      this.el.style.overflow = 'hidden';
      // Check if the element is being closed or is already closed
      if (this.isClosing || !this.el.open) {
        this.open();
      // Check if the element is being openned or is already open
      } else if (this.isExpanding || this.el.open) {
        this.shrink();
      }
    }
  
    shrink() {
      // Set the element as "being closed"
      this.isClosing = true;
      
      // Store the current height of the element
      const startHeight = `${this.el.offsetHeight}px`;
      // Calculate the height of the summary
      const endHeight = `${this.summary.offsetHeight}px`;
      
      // If there is already an animation running
      if (this.animation) {
        // Cancel the current animation
        this.animation.cancel();
      }
      
      // Start a WAAPI animation
      this.animation = this.el.animate({
        // Set the keyframes from the startHeight to endHeight
        height: [startHeight, endHeight]
      }, {
        duration: 400,
        easing: 'ease-out'
      });
      
      // When the animation is complete, call onAnimationFinish()
      this.animation.onfinish = () => this.onAnimationFinish(false);
      // If the animation is cancelled, isClosing variable is set to false
      this.animation.oncancel = () => this.isClosing = false;
    }
  
    open() {
      // Apply a fixed height on the element
      this.el.style.height = `${this.el.offsetHeight}px`;
      // Force the [open] attribute on the details element
      this.el.open = true;
      // Wait for the next frame to call the expand function
      window.requestAnimationFrame(() => this.expand());
    }
  
    expand() {
      // expanding state true
      this.isExpanding = true;
      const startHeight = `${this.el.offsetHeight}px`;
      const endHeight = `${this.summary.offsetHeight + this.content.offsetHeight}px`;
      
      // If there is already an animation running
      if (this.animation) {
        // Cancel the current animation
        this.animation.cancel();
      }
      
      // Start a WAAPI animation
      this.animation = this.el.animate({
        // Set the keyframes from the startHeight to endHeight
        height: [startHeight, endHeight]
      }, {
        duration: 400,
        easing: 'ease-out'
      });
      // When the animation is complete, call onAnimationFinish()
      this.animation.onfinish = () => this.onAnimationFinish(true);
      // If the animation is cancelled, isExpanding variable is set to false
      this.animation.oncancel = () => this.isExpanding = false;
    }
  
    onAnimationFinish(open) {
      this.el.open = open;
      this.animation = null;

      // reset
      this.isClosing = false;
      this.isExpanding = false;
      
      // remove overflow hidden and the fixed height
      this.el.style.height = this.el.style.overflow = '';
    }
    closeOtherDetails(currentTarget) {
        document.querySelectorAll(".faq__card").forEach(detail => {
            if (detail !== currentTarget) {
              detail.removeAttribute("open");
            }
          });
    }
}
  
