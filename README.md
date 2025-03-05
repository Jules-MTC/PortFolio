<p align="center">
   <img src="https://raw.githubusercontent.com/Jules-MTC/PortFolio/int/assets/favicon.ico" width="100" alt="project-logo">
</p>
<p align="center">
      <h1 align="center">Portfolio Website</h1>
</p>
<p align="center">
      <em><code>► This is my portfolio website</code></em>
</p>
<p align="center">
   <img src="https://img.shields.io/github/license/Jules-MTC/PortFolio?style=default&logo=opensourceinitiative&logoColor=white&color=0080ff" alt="license">
   <img src="https://img.shields.io/github/last-commit/Jules-MTC/PortFolio?style=default&logo=git&logoColor=white&color=0080ff" alt="last-commit">
   <img src="https://img.shields.io/github/languages/top/Jules-MTC/PortFolio?style=default&color=0080ff" alt="repo-top-language">
   <img src="https://img.shields.io/github/languages/count/Jules-MTC/PortFolio?style=default&color=0080ff" alt="repo-language-count">
<p>
<p align="center">
   <!-- default option, no dependency badges. -->
</p>

<br><!-- TABLE OF CONTENTS -->
<details>
   <summary>Table of Contents</summary><br>

- [ Overview](#-overview)
- [ Features](#-features)
- [ Repository Structure](#-repository-structure)
- [ Modules](#-modules)
- [ Getting Started](#-getting-started)
   - [ Installation](#-installation)
   - [ Usage](#-usage)
- [ Project Roadmap](#-project-roadmap)
- [ Contributing](#-contributing)
- [ License](#-license)
- [ Acknowledgments](#-acknowledgments)
</details>
<hr>

##  Overview

<code>► This project is a personal portfolio created to showcase my skills, experiences and projects in the field of web development. The portfolio is designed as a dynamic website with a backend, developed using JavaScript (Node.js), CSS, and HTML.</code>

---

##  Features

<code>► Skills Showcase: A dedicated section to showcase my skills in different areas such as web development, graphic design, etc.</code>

<code>► Project Portfolio: An interactive gallery showcasing my recent projects with detailed descriptions, screenshots and links to GitHub repositories or online demos.</code>

<code>► Contact Form: A contact form allowing visitors to contact me directly by email. The form is secure with anti-spam features.</code>

<code>► Responsive Design: The site is designed to be fully responsive, providing an optimal user experience on all devices, from desktop to smartphones.</code>

<code>► Robust backend: The backend is built with Express.js for efficient HTTP request handling and database communication. Security features such as data validation and protection against CSRF attacks are implemented.</code>

<code>► Environment Management: Environment variables are managed securely using Dotenv, ensuring the confidentiality of sensitive information such as email IDs.</code>

---

##  Repository Structure

```sh
└── PortFolio/
      ├── LICENSE
      ├── README.md
      ├── assets
      │   ├── dossier-portfolio.ico:Zone.Identifier
      │   ├── dossier-portfolio.png:Zone.Identifier
      │   ├── favicon.ico
      │   ├── img
      │   └── old-favicon.ico
      ├── backend
      │   └── server.js
      ├── css
      │   └── styles.css
      ├── index.html
      ├── js
      │   └── scripts.js
      ├── package-lock.json
      ├── package.json
      ├── release.config.js
      └── scripts
            └── setup.js
```

---

##  Modules

<details closed><summary>.</summary>

| File                                                                                      | Summary                         |
| ---                                                                                       | ---                             |
| [package.json](https://github.com/Jules-MTC/PortFolio/blob/master/package.json)           | <code>► This package.json file defines scripts and dependencies</code> |
| [package-lock.json](https://github.com/Jules-MTC/PortFolio/blob/master/package-lock.json) | <code>► The package-lock.json file records exact dependencies and their specific versions to ensure reproducibility of installations</code> |
| [release.config.js](https://github.com/Jules-MTC/PortFolio/blob/master/release.config.js) | <code>► The release.config.js file is used to configure the automatic code versioning and release process.</code> |
| [index.html](https://github.com/Jules-MTC/PortFolio/blob/master/index.html)               | <code>► The index.html file is the home page of the Portfolio website.</code> |

</details>

<details closed><summary>scripts</summary>

| File                                                                            | Summary                         |
| ---                                                                             | ---                             |
| [setup.js](https://github.com/Jules-MTC/PortFolio/blob/master/scripts/setup.js) | <code>► The setup.js file is used to configure and initialize.</code> |

</details>

<details closed><summary>css</summary>

| File                                                                            | Summary                         |
| ---                                                                             | ---                             |
| [styles.css](https://github.com/Jules-MTC/PortFolio/blob/master/css/styles.css) | <code>► The styles.css file contains CSS styles for presentation and formatting.</code> |

</details>

<details closed><summary>js</summary>

| File                                                                           | Summary                         |
| ---                                                                            | ---                             |
| [scripts.js](https://github.com/Jules-MTC/PortFolio/blob/master/js/scripts.js) | <code>► The scripts.js file contains JavaScript scripts to add interactive features.</code> |

</details>

<details closed><summary>backend</summary>

| File                                                                              | Summary                         |
| ---                                                                               | ---                             |
| [server.js](https://github.com/Jules-MTC/PortFolio/blob/master/backend/server.js) | <code>► The server.js file is the entry point to your backend server.</code> |

</details>

---

##  Getting Started

**System Requirements:**

* **JavaScript**: `version 1.0.2`

###  Installation

<h4>From <code>source with the setup file</code></h4>

> 1. Clone the PortFolio repository:
>
> ```console
> $ git clone https://github.com/Jules-MTC/PortFolio
> ```
>
> 2. Change to the project directory:
> ```console
> $ cd PortFolio
> ```
> 3. Change to the scripts directory:
> ```console
> $ cd scripts
> ```
>
> 4. Run the setup:
> ```console
> $ npm run setup
> ```
<h4>From <code>source, if the setup file doesn't work</code></h4>

> 1. Clone the PortFolio repository:
>
> ```console
> $ git clone https://github.com/Jules-MTC/PortFolio
> ```
>
> 2. Change to the project directory:
> ```console
> $ cd PortFolio
> ```
>
> 3. Install the dependencies:
> ```console
> $ npm install
> ```

###  Usage

<h4>From <code>source</code></h4>

> Run PortFolio back-end using the command below:
> ```console
> $ sudo node ./backend/server.js
> ```

---

##  Project Roadmap

- [X] `► Update readme`
- [X] `► Add section and button to download my cv`
- [X] `► Add contact form`
- [X] `► Translate in french`
- [X] `► Configure DNS`
- [X] `► Add https`
- [X] `► Add this project on the website`
- [X] `► Add auto deploy don't to do the release`
- [X] `► New design`
- [ ] `► Upgrade design confirmation and error message in form contact`
- [ ] `► Dark mode`
- [ ] `► Upgrade svg projects`
- [ ] `► Update repository structure`
- [ ] `► Add project date`
- [ ] `► Add project tag`

---

##  Contributing

Contributions are welcome! Here are several ways you can contribute:

- **[Report Issues](https://github.com/Jules-MTC/PortFolio/issues)**: Submit bugs found or log feature requests for the `PortFolio` project.
- **[Submit Pull Requests](https://github.com/Jules-MTC/PortFolio/blob/main/CONTRIBUTING.md)**: Review open PRs, and submit your own PRs.
- **[Join the Discussions](https://github.com/Jules-MTC/PortFolio/discussions)**: Share your insights, provide feedback, or ask questions.

<details closed>
<summary>Contributing Guidelines</summary>

1. **Fork the Repository**: Start by forking the project repository to your github account.
2. **Clone Locally**: Clone the forked repository to your local machine using a git client.
    ```sh
    git clone https://github.com/Jules-MTC/PortFolio
    ```
3. **Create a New Branch**: Always work on a new branch, giving it a descriptive name.
    ```sh
    git checkout -b new-feature-x
    ```
4. **Make Your Changes**: Develop and test your changes locally.
5. **Commit Your Changes**: Commit with a clear message describing your updates.
    ```sh
    git commit -m 'Implemented new feature x.'
    ```
6. **Push to github**: Push the changes to your forked repository.
    ```sh
    git push origin new-feature-x
    ```
7. **Submit a Pull Request**: Create a PR against the original project repository. Clearly describe the changes and their motivations.
8. **Review**: Once your PR is reviewed and approved, it will be merged into the main branch. Congratulations on your contribution!
</details>

<details closed>
<summary>Contributor Graph</summary>
<br>
<p align="center">
    <a href="https://github.com{/Jules-MTC/PortFolio/}graphs/contributors">
         <img src="https://contrib.rocks/image?repo=Jules-MTC/PortFolio">
    </a>
</p>
</details>

---

##  License

This project is protected under the [The Unlicense](https://https://choosealicense.com/licenses/unlicense/) License. For more details, refer to the [LICENSE](https://choosealicense.com/licenses/) file.

---

[**Return**](#-overview)

---
