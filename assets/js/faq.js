const faqContainer = document.querySelector(".faq__wrapper");

animateDetails();
// scroll to appear back to top button
let backToTopButton = document.querySelector("#button");


// functions
function backToTopClick() {
  // document.querySelector("main").animate({
  //   // keyframes from start to end height
  //   scrollTop: [event.scrollTop, 0]
  // }, {
  //   duration: 400,
  //   easing: 'ease-out'
  // });
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
}
async function animateDetails() {
    await getFaqContent();

    // animation on details
    document.querySelectorAll(".faq__card").forEach((el, index) => {
        new DetailObject(el);
    });


}
async function getFaqContent() {
    // fetch json and create element
    const response = await (await fetch("http://localhost:5501/assets/js/faq.json")).json();
    response.map(card => {
        faqContainer.innerHTML += `
        <details class="faq__card flex flex-center">
        <summary class="flex flex-center-leftside">${card["title"]}</summary>
        
        <div class="faq__card-content flex flex-center">
        <p>${card["detail"].reduce((totalLine, line, index) => {
            return totalLine + (index === 0? ("- " + line) : ("<br> - " + line));
        }, "")}</p>

        ${card["img"] == ""? "" : `<img src="${card["img"]}" alt="Setup in faq">`}
        </div>
        </details>`;
    });

}
// for animation on details + close other details when open 1 detail
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
  
      // store the animation state (can cancel if needed)
      this.animation = null;
      // store closing state
      this.isClosing = false;
      // store expanding state
      this.isExpanding = false;
      // check if user click summary (to expand or close)
      this.summary.addEventListener('click', (event) => {
            //   close other details before display animation on detail
            this.closeOtherDetails(this.element);
            // display animation
            this.onClick(event);
        });
    }
  
    onClick(event) {
      // stop default behavior from browser
      event.preventDefault();
      // add an overflow on the <details> to avoid content overflowing (after closing, content still appear)
      this.element.style.overflow = 'hidden';
      // check if the element is being closed (during animation) or is already closed
      if (this.isClosing || !this.element.open) {
        this.open();
      // check if the element is being openned or is already open
      } else if (this.isExpanding || this.element.open) {
        this.shrink();
      }
    }
  
    shrink() {
      // set the element as "being closed"
      this.isClosing = true;
      
      // store the current height of the element
      const startHeight = `${this.element.offsetHeight}px`;
      // calculate the height of the summary
      const endHeight = `${this.summary.offsetHeight}px`;
      
      // if there is already an animation running
      if (this.animation) {
        // cancel the current animation
        this.animation.cancel();
      }
      
      // animation
      this.animation = this.element.animate({
        // keyframes from start to end height
        height: [startHeight, endHeight]
      }, {
        duration: 200,
        easing: 'ease-out'
      });
      
      // when the animation is complete
      this.animation.onfinish = () => this.onAnimationFinish(false);
      // if animation is cancelled, isClosing false
      this.animation.oncancel = () => this.isClosing = false;
    }
  
    open() {
      // Apply a fixed height on the element
      this.element.style.height = `${this.element.offsetHeight}px`;
      // force the [open] attribute on the details element
      this.element.open = true;
      // wait for the next frame to call the expand function
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
        duration: 200,
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
  summaryList.forEach(summary => {
        summaryContent = summary.textContent;
        if (!summaryContent.toUpperCase().includes(filter)) {
            summary.parentElement.classList.add('disable');
        } else {
          summary.parentElement.classList.remove('disable');
        }
    });
}
