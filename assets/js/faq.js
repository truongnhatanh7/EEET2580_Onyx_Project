const faqContainer = document.querySelector(".faq__wrapper");
animationDetails();

// functions
async function animationDetails() {
    await getFaqContent();

    // animation on details
    document.querySelectorAll(".faq__card").forEach((el, index) => {
        new DetailObject(el);
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
class DetailObject {
    constructor(element) {
      // detail
      this.element = element;
      // summary
      this.summary = element.querySelector('summary');
      // summary text content
      this.summaryContent = this.summary.textContent || this.summary.innerText;
      // content p
      this.content = element.querySelector('.faq__card-content');
  
      // Store the animation object (so we can cancel it if needed)
      this.animation = null;
      // Store if the element is closing
      this.isClosing = false;
      // Store if the element is expanding
      this.isExpanding = false;
      // Detect user clicks on the summary element
      this.summary.addEventListener('click', async (event) => {
          await this.closeOtherDetails(this.element);
          this.onClick(event);
        });
    }
  
    onClick(event) {
      // Stop default behaviour from the browser
      event.preventDefault();
      // Add an overflow on the <details> to avoid content overflowing
      this.element.style.overflow = 'hidden';
      // Check if the element is being closed or is already closed
      if (this.isClosing || !this.element.open) {
        this.open();
      // Check if the element is being openned or is already open
      } else if (this.isExpanding || this.element.open) {
        this.shrink();
      }
    }
  
    shrink() {
      // Set the element as "being closed"
      this.isClosing = true;
      
      // Store the current height of the element
      const startHeight = `${this.element.offsetHeight}px`;
      // Calculate the height of the summary
      const endHeight = `${this.summary.offsetHeight}px`;
      
      // If there is already an animation running
      if (this.animation) {
        // Cancel the current animation
        this.animation.cancel();
      }
      
      // Start a WAAPI animation
      this.animation = this.element.animate({
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
      this.element.style.height = `${this.element.offsetHeight}px`;
      // Force the [open] attribute on the details element
      this.element.open = true;
      // Wait for the next frame to call the expand function
      window.requestAnimationFrame(() => this.expand());
    }
  
    expand() {
      // expanding state true
      this.isExpanding = true;
      const startHeight = `${this.element.offsetHeight}px`;
      const endHeight = `${this.summary.offsetHeight + this.content.offsetHeight}px`;
      
      // if animation is running
      if (this.animation) {
        // cancel animation
        this.animation.cancel();
      }
      
      // add animation
      this.animation = this.element.animate({
        // keyframes
        height: [startHeight, endHeight]
      }, {
        duration: 400,
        easing: 'ease-out'
      });
      

      this.animation.onfinish = () => this.onAnimationFinish(true);
      // if animation is cancelled
      this.animation.oncancel = () => this.isExpanding = false;
    }
  
    onAnimationFinish(open) {
      this.element.open = open;
      this.animation = null;

      // reset
      this.isClosing = false;
      this.isExpanding = false;
      
      // remove overflow hidden and the fixed height
      this.element.style.height = this.element.style.overflow = '';
    }
    closeOtherDetails(currentTarget) {
        document.querySelectorAll(".faq__card").forEach(detail => {
            if (detail !== currentTarget) {
              detail.removeAttribute("open");
            }
          });
    }
}
 
// search on input
function filterFaqCard() {
    let input = document.querySelector(".faq__find");
    let filter = input.value.toUpperCase();
    let summaryList = document.querySelectorAll(".faq__card summary");
    console.log(summaryList);
    summaryList.forEach(summary => {
        summaryContent = summary.textContent || summary.innerText;
        if (summaryContent.toUpperCase().indexOf(filter) > -1) {
            summary.style.display = "";
        } else {
            summary.style.display = "none";
        }
    });
}
