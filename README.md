# EEET2580_Onyx_Project
# Project Title
**ONYX Task Management Software**

The objective of Onyx application is to fulfill task organization's intentions to have a better working plan towards resulting in a better outcome for business owners and allows users to collaborate remotely, hence, facilitating the digital transformation amongst businesses.

## Description

Onyx is a collaboration tool for companies which organizes projects into boards and follows the Kanban board paradigm. The application function can be simplified as giving a user with a project workspace that they can create multiple to-dos lists from which to create corresponding tasks to maximize productivity. Furthermore, the application allows Users to invite collaborators to allocate works and drag and drop tasks into respective lists to track progress.

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