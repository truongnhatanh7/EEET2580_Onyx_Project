const faqContainer = document.querySelector(".faq__wrapper");
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
getFaqContent();
// document.addEventListener("DOMContentLoaded", async() => {
//     try {
//         const data = await getFaqContent();
//     }
//     catch (error) {
//         console.log("Error!");
//         console.log(error);
//     }
// })