# NIC Judging and Feedback Portal

Project Backlog Link: https://sarah-mott.atlassian.net/jira/core/projects/WHIT/issues/WHIT-21?jql=project+%3D+%22WHIT%22+ORDER+BY+created+DESC&atlOrigin=eyJpIjoiYmQxMzhjOGQyMGJiNGEyNzhmMDkxOTM5NjgzZTlkZGYiLCJwIjoiaiJ9

NEW LINK FOR SPRINT BACKLOG: https://sarah-mott.atlassian.net/jira/software/projects/NIC/boards/1/backlog?selectedIssue=NIC-25&atlOrigin=eyJpIjoiYjYwZGM3MzE5NzAzNDQ0M2E0OGEyYWU4MTU2N2E2MDYiLCJwIjoiaiJ9 

# Background

Hewitt Learning is looking to develop a site to manage running the National Innovator Challenge competition (NIC). The site is intended to help streamline the process of running the competitions at a large scale. Our project is intended to automate the process
of the competition rundown, instead of doing it manually through spreadsheets.

# Objectives

The objective of this project is design a site that facilitates the easier management of Hewitt's National Innovator Challenge Competitions. Some of the high priority project goals as defined by Hewitt include:

1. Secure role-based access to site competitions, submissions, and feedback.
2. Groups of students (or student guardians) should be able to upload submissions and view judge feedback.
3. Judges should only be able to see assigned student submissions and evaluate the submissions based on a structured rubric.
4. Administrators should be able to edit and control different competition details. Including creating competitions and setting relevant deadlines, manage assigned student groups and judges, and approve submitted judge evaluations.

In addition, these are the secondary objectives as defined by Hewitt:

1. Administrators should be able to view and export statistical data on competitions.
2. The intellectual property of the students should be protected. Judges should not be able to download student submission materials. Additionally secure encryption methods should be used for communication.

Finally, the design process was requested to keep these long-term feature goals in mind:

1. Administrator and judge users should have access to a real-time statistical tracking dashboard for competition progress.
2. Judges should be receive suggestions on what feedback to give a submission based on the assigned score.
3. Students should be able to generate and download award certificates based on their submission evaluations.
4. Competition sponsors and partners should have access to a competition statistical analysis reporting.

Due to the large scale of this project and limited available time of project group members, the narrowed objective of this project is implement the basic role-based site infrastructure. There was also a strong emphasis on leaving the site in a good spot to handoff to Hewitt and other future contributors.

More specifically, the objective is to implement the basic competition workflow. This includes allowing an admin-type user to create and manage competition judges and groups. Also, a guardian-type user should be able to create groups of students for a competition and view judged feedback. Lastly, a judge type user should able to see only assigned submissions for assigned competitions and submit feedback evaluations for those submissions.

In addition, because this site will be used by a wide variety of people, there is an emphasis of ease of use and inclusion. We be use to use contrasting colors, repeated layouts, and large text to allow many users with different backgrounds to easily use the site. At the same time the site makes steps to be inclusive of those different cultures and/or gender orientations. This includes steps replacing references to last names with family names and allowing users to specify pronouns for themselves and students.

# Development Tools

This site is intended to be used on a desktop or laptop computer. As a result, the development framework primarily ulilized tools designed for desktop web development.

## Frontend

The site was built primarily using React. React was chosen due to some group members' previous experience using the framework. In addition, React has a large body of documentation and libraries available for use. As a result, the React component framework AntDesign was selected as a resource to make building the frontend easier. AntDesign was chosen because it has man components available for no price and each component has solid documentation and example code. In addition, AntDesign also has many customizations for global styling, which made the site designing process move faster and result in a better looking website.

## Backend

The backend was built around a MySQL server with a Django api framework. MySQL (and MySQL Workbench) were chosen due to previous team experience with these products. Any backend can be used for this project, but Django is currently configured to run with MySQL. Django was chosen for its extensive documentation and relatively easy implementation of encrypted user info management. In addition to Django the Axios framework is used to automatically handle user authentication keys when making database calls from the frontend.

NOTE: All up to date version numbers can be found in README.md

## Organization

This organization for this project was facilitated primarily using WhitGit, a Whitworth-specific GitLab server, and Jira. WhitGit was use as the primary version control software. Like GitHub, it was used to maintain an up-to-date main branch as well as hold temporary feature branches. WhitGit was chosen by the Whitworth professors to make the project grading process similar. This project was organized through the Scrum system and Jira was the software to facilitate the sprint cycles. A Jira Scrum template was used to create the organization and enable the storage of background and sprint tasks. Jira was chosen as the Scrum manager due to its wide array of features and multiple team members having previous experience using the software for similar projects.

# Site Roles

The website is divided into three different roles: administrator(s), judge(s), and guardian(s)/participant(s). This to ensure that the users with different roles would not have access to information that are not meant to be disclosed. For instance, not all judge will have access to the submissions, only admin can do so. This step is ensured that the information are being kept undisclosed unless admin grant them access. Admin has the control over the competitions and will be the point person to delegate and grant access.

## Administrator

The administrator serves as the main controller for the website and competitions. An admin user should be able to: 1. Create and manage competitions. This includes choosing start/end dates and deadlines for the submission of participants and judges. 2. Create, edit, copy, delete, and assign rubrics to competitions. 3. Assign judges to a competition (accordingly based off their interest). 5. Manage, edit, and approve judge feedback before giving back to the participants.

## Judge

The judge is responsible for giving feedback to competition submissions.
Judge will have access to: 1. See the project(s) they are assigned to. This includes the competition's details. 2. Give feedbacks to the projects (accordingly to the rubric that was created by the admin). 3. See graded and ungraded submissions for the current active competitions. 4. Ability to edit the submissions that they have graded before the deadlines.
Judge will not have access to: 1. The participants' detailed information that are not being disclosed by admin. 2. See other's judges' grades on other submissions. 3. Submissions from participants they are not assigned to.

## Guardian/ Participant

The guardian/ participant is the user who will actually submit work for a competition. The role is intended to be used by a parent/teacher who will sign up for a competition on a student's behalf.
The participant/ guardian will have access to: 1. Sign up for competitions (various times according to the number of students and projects) 2. See details for their active competitions and the upcoming competitions. 3. Submit their work for current competitions and resubmitting work as needed before deadlines or per admin's request. 4. See feedback from past competitions.
The participant/ guardian will not have access to: 1. Access the judge's information. 2. Access the full feedbacks that are not being disclosed by admin.

Please refer to DesignDoc.md for more information on the individual pages of the website.

# Startup Guide
## Requirements
* `Node` - tested with version `v22.14.0`
* `npm` (Node package manager) - tested with version `10.9.2`
* `Python`- tested with version `3.10.7`
* `pip` (Python package manager) - tested with version `23.2.1`
* `MySQL database` - tested with version `8.0.41`
* Additional React packages required are listed within `root\hewitt-nic\package.json`, but this README will walk you through installing these packages and these do not need to be installed beforehand.
* Additional Python packages required are listed within `root\hewitt-nic\django_backend\backend\requirements.txt`, but this README will walk you through installing these packages and these do not need to be installed beforehand. However, it is possible that you run into issues running the backend due to version updates for these Python libraries. Due to this possibility, I have provided a list below of the versions of each python library that we used to test this project:
```
asgiref==3.8.1
Django==5.2.1
django-cors-headers==4.7.0
djangorestframework==3.16.0
djangorestframework_simplejwt==5.5.0
mathplot==0.1
mysqlclient==2.2.7
numpy==2.2.5
pandas==2.2.3
pillow==11.2.1
PyJWT==2.9.0
PyMySQL==1.1.1
python-dateutil==2.9.0.post0
python-dotenv==1.1.0
pytz==2025.2
six==1.17.0
sqlparse==0.5.3
typing_extensions==4.13.2
tzdata==2025.2
```

## Root
Note that in this README, `root` refers to the top level directory, being `nic-judging-and-feedback-portal`

## Starting the Backend
### Creating a Python Virtual Environment
For this project's backend server, we have implemented a Django server (contents of this server can be found at `root\hewitt-nic\django_backend`). We will now walk through how to startup this backend server.
1) Open up a `cmd` (command prompt) terminal at the `root` directory.
2) Run `cd hewitt-nic\django_backend `.
3) Create a Python virtual environment by running `python -m venv env`.
4) After this environment has been created, activate it with `env\Scripts\activate`. Note that when this step completes `(env)` should appear at the very left of the next command prompt. This indicates that you are now operating from within the virtual environment. 
5) Within this virtual environment, run `cd backend` to change directory into the backend.
6) Install Python package dependencies by running `pip install -r requirements.txt`. Note that these Python packages will only be installed within the virtual environment (this is what we want). 

### Starting a Local Database
Note: This section doesn't involve any work in terminals, but you should keep the terminal with the virtual environment running, because we will need it soon! If you accidentally close that terminal, you can activate the virtual environment again by completing steps `1`, `2`, `4`, and `5` in the `Creating a Python Virtual Environment` section above!

1) Next, we need to create a database. Within `MySQL`, create a new local database that is hosted by `localhost`. You can name this database whatever you want. For reference, in our testing, we named this database `hewitt`. This database will store all of the information from our website. From here on out, we will use `db_name` to refer to the name you chose for this database.
2) Create a `.env` file within the `root\hewitt-nic\django_backend\backend\backend` directory. A `.env` file is a file that is named `".env"` which stores local variables that are referenced by certain scripts (in this case, this `.env` will be used by our Django backend code to connect to the database). Open this `.env` file in a text editor and copy the following text into it:
```
DB_NAME='<db_name>'
DB_USER='root'
DB_PWD='<db_password>'
DB_HOST='localhost'
DB_PORT='3306'
```
You will need to make edits to this file! Replace `<db_name>` with the name of your database and `<db_password>` with the password required to access your created database. For local `MySQL` databases, the user should default to `root`, the host will be `localhost`, and the port should be `3306`. But if for whatever reason these are not the values that are associated with your database, update these values within this file as well.

### Creating all Necessary Tables within Local Database
Now that we have a Python virtual environment and a Database running on your local machine, we can use the virtual environment and our Django backend server to populate the database with the needed tables.

1) In your `cmd` terminal running the Python virtual environment, ensure that your current directory is `root\hewitt-nic\django_backend\backend`. If this is not the current directory, navigate to that directory using `cd` in this terminal running the Python virtual environment.
2) In this terminal, run `python manage.py makemigrations`. This will tell the Django backend server to examine your local database and determine what changes need to be made to it for the database to be usable for this project.
3) Run `python manage.py migrate` in the terminal running the Python virtual environment. This will apply the identified changes (called "migrations") to your local Database.

Note that if either steps `2` or `3` fail, this likely indicates that your `.env` is not properly set up. Refer to the previous section of this README, `Starting a Local Database`, for help.

### Running the Backend Django Server
Now, we can finally run the backend Django server! Luckily, there are only two steps to this process.
1) Within your terminal running the Python virtual environment, run `python manage.py runserver`. Doing so should produce text in the terminal like the following:
```
Watching for file changes with StatReloader
Performing system checks...

System check identified no issues (0 silenced).
May 15, 2025 - 20:53:32
Django version 5.2.1, using settings 'backend.settings'
Starting development server at http://127.0.0.1:8000/
Quit the server with CTRL-BREAK.
```
2) Notice that the second to last line of this output reads `Starting development server at <local_url>`. This `<local_url>` is likely `http://127.0.0.1:8000/`, but if something is already running at this location on your computer, this url might be different. Copy this `<local_url>` to your clipboard. Then create another `.env` file under the `root\hewitt-nic`. In this `.env`, type the following:
```
REACT_APP_API_URL='<local_url>'
```
Obviously, replace `<local_url>` with the url you just copied. Finally, delete any trailing backslashes from this url within this `.env` file (this step is CRUCIAL).

This `.env` will be used by our project's frontend to determine where the backend server is running at.

With all of that, the backend setup for our project is completed! Keep this terminal running in the background. As long as this terminal is running, the backend for our project is running. But close this terminal, and the backend will stop running too!

### Rerunning the Backend After Initial Setup
If you happen to close out of the terminal running the backend after you initially ran the backend server, don't worry! Restarting the backend is much easier than starting it for the first time. Just follow these steps:
1) Open up a `cmd` command prompt terminal.
2) Run `cd root/hewitt-nic/django_backend` to navigate into our backend directory.
3) Run `env\Scripts\activate` to activate the Python virtual environment.
4) With this Python virtual environment running, run `cd backend` in this same terminal.
5) Run `python manage.py runserver` to start up the backend server, then keep the terminal open!

## Starting the Frontend
Now that the backend is operational, we can startup the frontend! Thankfully, the process is far simpler than the process to startup the backend.

IMPORTANT NOTE: __Do not close out of the terminal running the backend! We still want the backend running. Perform the following steps in a new `cmd` command prompt terminal instead!__

1) In a __new__ `cmd` command prompt terminal, run `cd root\hewitt-nic` to navigate into the `hewitt-nic` directory.
2) In this same terminal, install required Node packages by running `npm install`.
3) Now that the required Node packages have been installed, run `npm start` to start the frontend server.

And with that, the Frontend has been started! You can now access the website by visiting `http://localhost:3000/` in a browser of your choice. 

Please refer to `DesignDoc.md` for a guide to using the website!

# Updating Project Backend
In this section of the README, we will go over how to make alterations to this project's Django backend. 

## Updating DB Models
In Django, a model is a representation of an object within a table of a database. The models used throughout this project are stored at `root\hewitt-nic\django_backend\backend\api\models.py`. Any alterations to these models will need to be migrated to take effect in the database. To run a migration, activate the Python virtual environment by navigating to `root\hewitt-nic\django_backend` in a `cmd` command prompt terminal and then running `env\Scripts\activate` in this terminal. To run a migration from here, in this terminal, `cd backend` and then run `python manage.py makemigrations` followed by `python manage.py migrate`. Doing so will update the database to reflect the state of the models within `models.py`. Please refer to the `Django` documentation for information on how to properly structure models.

## Django Serializers
In Django, a serializer is an object in Django which converts data from a database into Python data types which are then stored in code. Serializers as used in this project are connected to a specific model that is located within `models.py`. Serializers for this project are stored in `root\hewitt-nic\django_backend\backend\api\serializers.py`. Please refer to the `Django` documentation for information on how to properly structure serializers.

## Django Views
In Django, a view is a Python function which takes in a web request and returns a response for that web request. In essence, a view determines how data is transferred from the database to the user via web requests. In this project, each view has at least one associated serializer. Views for this project are stored in `root\hewitt-nic\django_backend\backend\api\views.py`. Please refer to the `Django` documentation for information on how to properly structure views.

## Django URLs
In Django, urls are string urls which, if hit by a browser, connect a user to a specific Django view. In our project, each Django url has an associated view. Urls may also specify values that can be passed to a view. Urls for this project are stored in two locations. The first is `root\hewitt-nic\django_backend\backend\backend\urls.py`. This file lists all of the standard Django urls (i.e. the urls that are standard to Django operation). This project also uses a large number of custom urls which are found at `root\hewitt-nic\django_backend\backend\api\urls.py`. These urls link users to views that we designed and that are not standard to Django. When a user tries to route through the backend server through a browser, the backend server will first try to match the used url to one of the standard Django urls that are listed in `root\hewitt-nic\django_backend\backend\backend\urls.py`. If the url used does not match any of these defined urls, the backend server will instead try to match the url to a url listed in `root\hewitt-nic\django_backend\backend\api\urls.py`. Note that each url listed in `root\hewitt-nic\django_backend\backend\api\urls.py` are proceeded by an implicit `api/` route that is not listed in the file. Please refer to the `Django` documentation for information on how to properly structure urls.

## Django Settings
A number of settings can be altered for this Django backend server. These settings are located at `root\hewitt-nic\django_backend\backend\backend\settings.py`. Details about these settings and their values can be found in the `Django` documentation.

## Changing Databases
Django supports a number of different databases. We chose `MySQL` for our project, but another database could easily be used instead. The process used to change databases is relatively straightforward. In this section, we will walk through how to change the database for this project to a `postgres` database. 
1) On line `110` of `root\hewitt-nic\django_backend\backend\backend\settings.py`, change `'ENGINE': 'django.db.backends.mysql'` to `ENGINE": "django.db.backends.postgresql"` to tell the backend to look for a `Postgres` server rather than a `MySQL` server.
2) On line `11` of `root\hewitt-nic\requirements.txt` change `mysqlclient` to `psycopg2-binary`.
3) Create a database with the same `db_name` in Postgres.
4) Run a migration to transfer all needed tables into this new database.

# Citation for Backend Structure
The backend for this project was setup based on a tutorial for Django which can be found here:
`https://www.youtube.com/watch?v=c-QsfbznSXI`
This tutorial has an associated GitHUB which can be viewed here:
`https://github.com/techwithtim/Django-React-Full-Stack-App`