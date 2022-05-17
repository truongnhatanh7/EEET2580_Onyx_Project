# EEET2580_Onyx_Project
# Project Title
**ONYX Task Management Software**

The objective of Onyx application is to fulfill task organization's intentions to have a better working plan towards resulting in a better outcome for business owners and allows users to collaborate remotely, hence, facilitating the digital transformation amongst businesses.

## Description

Onyx is a product of the Group Assignment of the course EEET2580 - Enterprise Application Development, the topic ideas have been proposed to lecturer and approved. Our objective in this project is to utilize materials learnt in web technologies such as Spring Framework, Hibernate and Spring MVC in order to deliver a full stack web-application.

Inspired by project management tools (Trello, Jira, etc.) that allow users to organize their projects subject to the SDLC paradigms (Waterfall, Agile, Scrum, etc.) by generating backlogs, assigning tasks, arranging team members, and tracking collaborators' progress. Due to the complexity of current project management tools, as well as limitations in technology usage and understanding, the team decided to develop a simpler application based on the Kanban board model that also included essential features such as backlog management, collaborator invitation, drag-and-drop progress tracking.
## Getting Started

### Dependencies

* Working on OS platforms: Windows 10, MacOS and Ubuntu (Linux)
* Link to Back-end: [Onyx Back-end](https://github.com/truongnhatanh7/Onyx_Backend)

### Installing

* Download the zip file **EEET2580_Onyx_Project-main.zip** for Front-end usage and **Onyx_Backend-master.zip** for Back-end usage.
* Download Postgres to setup the database at [here](https://www.postgresql.org/download/).
* Create database in Postgres, name it as: onyx2
* Go to application.properties file in Back-end folder with the following path (Onyx_Backend > src > main > resources) and configure the **spring.datasource.url** field with **jdbc:postgresql://localhost:5432/onyx2**.

### Executing program

* To start the Back-end server, run the file **Onyx2Application.java**.
* To start the Front-end, run open the **index.html** file in Front-end folder by Live-Server.

## Help

During the application usage, there is a **FAQ** tab at the Homepage which guide the user of utilizing features.

## Version
* 2.0

    * Final Release for users
* 1.0

    * Initial Release for test usage (only Developers)
## Authors

The Onyx application is built by talented students at SSET program.

* **Leader/Fullstack developer**: Anh Truong ([@truongnhatanh7](https://github.com/truongnhatanh7))

* **Designer/Frontend developer**: Phi Thai ([@PhiThai1309](https://github.com/PhiThai1309))

* **Designer/Frontend developer**: Nhung Tran ([@Puppychan](https://github.com/Puppychan))

* **Backend developer**: Nhat Bui ([@nhat117](https://github.com/nhat117))

* **Tester**: Tri Lai ([@Tri-Lai](https://github.com/Tri-Lai))

## Acknowledgments
These below website is used to code learning, inspiration and improvement on both Front-end and Back-end
* [Baeldung](https://www.baeldung.com/spring-boot)
* [Loda](https://loda.me/courses/spring-boot)
* [F8 Official](https://www.youtube.com/c/F8VNOfficial)
* [Web Dev Simplified](https://www.youtube.com/c/WebDevSimplified)