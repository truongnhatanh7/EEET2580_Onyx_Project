const faqContainer = document.querySelector(".faq__wrapper");

animateDetails();
// scroll to appear back to top button
let backToTopButton = document.querySelector("#button");


// functions
// back to top button action
function backToTopClick() {
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
}

async function animateDetails() {
    // take array of contents and create faq elements
    await getFaqContent();

    // create animation when using faq card
    document.querySelectorAll(".faq__card").forEach((element, index) => {
        new DetailObject(element);
    });


}
async function getFaqContent() {
    // fetch json and create element from content array
    const response = [
      {
        "title": "Login to the application ",
        "detail": [
              "Click on the login button in the navigation bar",
              "From the login page, type your registered username in the Username field",
              "Type the registered password in the Password field.",
              "Select the Log in button.",
              "In contrast, if the user has not registered for the account, select the signup button and fill in all the fields of the registration form then click the Sign up button for logging in.",
              "You can now create a new task list for your project."
        ],
        "img": "./assets/img/faq/faq-login.svg",
        "alt": "Login in Faq"
      },
      {
          "title": "How to set up your workspace",
          "detail": [
              "Log-in to your dashboard using your ONYX Account",
              "Select “+” card to add new workspace",
              "Enter a new name for your workspace.",
              "Click at the newly created workspace.",
              "You can now create a new task list for your project."
          ],
          "img": "./assets/img/faq/faq-setup.svg",
          "alt": "Set Up in Faq"
      },
      {
          "title": "How to create workspace list?",
          "detail": [
              "Log-in to your dashboard using your ONYX",
              "Select a workspace to continue",
              "An option to create new list will appeare",
              "Enter a name and hit create"
          ],
          "img": "./assets/img/faq/faq-create.svg",
          "alt": "Create Workspace in Faq"
      },
      {
          "title": "How to add new task within workspace list?",
          "detail": [
            "From the list, select the Add task button.",
            "Type the name in the Enter new task field.",
            "Click the Create button for creating a new task."
          ],
          "img": "./assets/img/faq/faq-addtask.svg",
          "alt": "Add new task within workspace list"
      },
      {
        "title": "Edit a task within the workspace list",
        "detail": [
          "From the list, find the task you want to make a change to and select the edit button.",
          "Type the new name for the task.",
          "Click the Save button for saving the new name."
        ],
        "img": "./assets/img/faq/faq-edittask.svg",
        "alt": "Edit Task in within workspace list in FAQ"
      },
      {
        "title": "Drag and Drop a task to another list",
        "detail": [
          "From the list, find the task you want to move ",
          "Hold a click on the task",
          "Then, drag the task to the list where you want to place it",
          "Drop a task into the list"
        ],
        "img": "./assets/img/faq/faq-drag.svg",
        "alt": "Drag Drop task in faq"
      },
      {
        "title": "How to delete task within the list",
        "detail": [
          "From the list, find the task you want to make a change to and select the button.",
          "Click the Delete task button for deleting the task."
        ],
        "img": "./assets/img/faq/faq-deletetask.svg",
        "alt": "Delete Task in faq"
      },
      {
        "title": "How to invite collaborators?",
        "detail": [
          "From the workspace, select the avatar icon in the top right corner.",
          "Select the Project status",
          "In the Project status dialogue, type the username of the collaborators that you want to add.",
          "Select Add button for adding a new collaborator.",
          "In contrast, click the X button next to the collaborator's name to remove them from the project. "
        ],
        "img": "./assets/img/faq/faq-addcollab.svg",
        "alt": "Invite collab in faq"
      },
      {
        "title": "Sign out of the project",
        "detail": [
          "From the dashboard, select the avatar icon in the top right corner.",
          "Select the Sign-out button for logging out of the project."
        ],
        "img": "./assets/img/faq/faq-signout.svg",
        "alt": "Sign out in faq"
      }
  ]
  // create elements
    response.map(card => {
        faqContainer.innerHTML += `
        <details class="faq__card flex flex-center">
        <summary class="flex flex-center-leftside">${card["title"]}</summary>
        
        <div class="faq__card-content flex flex-center">
        <p>${card["detail"].reduce((totalLine, line, index) => {
            return totalLine + (index === 0? ("- " + line) : ("<br> - " + line));
        }, "")}</p>

        ${(card["img"] == "" || !card.hasOwnProperty('img'))? "" : `<img src="${card["img"]}" alt="Setup in faq">`}
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
      // this.content.style.animation = null;

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
      // if (this.content.style.animation) {
      if (this.animation) {
        // cancel the current animation
        this.animation.cancel();
        // this.content.style.animation = null;
      }
      
      // animation
      this.animation = this.element.animate({
        // keyframes from start to end height
        height: [startHeight, endHeight]
      }, {
        duration: 100,
        easing: 'ease-out'
      });
      // this.content.style.animation = "faq-slide-up 2s";
      
      // when the animation is complete
      this.animation.onfinish = () => this.onAnimationFinish(false);
      // this.content.onanimationend = () => this.onAnimationFinish(false);

      // if animation is cancelled, isClosing false
      this.animation.oncancel = () => this.isClosing = false;
      // this.content.onanimationcancel = () => this.isClosing = false;
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
      // if (this.content.style.animation) {
      if (this.animation) {
        // cancel animation
        this.animation.cancel();
        // this.content.style.animation = null;
      }
      
      // add animation
      this.animation = this.element.animate({
        // keyframes
        height: [startHeight, endHeight]
      }, {
        duration: 100,
        easing: 'ease-out'
      });
      // this.content.style.animation = "faq-slide-down 2s";
      

      this.animation.onfinish = () => this.onAnimationFinish(true);
      // this.content.onanimationend = () => this.onAnimationFinish(true);
      
      // if animation is cancelled
      this.animation.oncancel = () => this.isExpanding = false;
      // this.content.onanimationcancel = () => this.isExpanding = false;
    }
  
    onAnimationFinish(open) {
      this.element.open = open;
      // this.content.style.animation = null;
      this.animation = null;

      // reset
      this.isClosing = false;
      this.isExpanding = false;
      
      // remove overflow hidden and the fixed height
      this.element.style.height = this.element.style.overflow = '';
    }

    // close other cards when open 1 card
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
  document.querySelectorAll(".faq__card summary").forEach(summary => {
        summaryContent = summary.textContent;
        // if not found in input
        if (!summaryContent.toUpperCase().includes(filter)) {
            summary.parentElement.classList.add('disable');
        } else {
          // found in input
          summary.parentElement.classList.remove('disable');
        }
    });
}
