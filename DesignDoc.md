Hewitt Learning – NIC Management Website

A capstone project by Caleb Flegel, Fabian Gomez, Michelle Lie, Sarah Mott, & Ryan Trader

# Table of Contents

1. Background
2. Objectives
3. Development Tools & Site Infrastructure
4. Site Layout & Features
5. Site Status & Future Work

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

# Site Layout and Features

## Site Roles

The website is divided into three different roles: administrator(s), judge(s), and guardian(s)/participant(s). This to ensure that the users with different roles would not have access to information that are not meant to be disclosed. For instance, not all judge will have access to the submissions, only admin can do so. This step is ensured that the information are being kept undisclosed unless admin grant them access. Admin has the control over the competitions and will be the point person to delegate and grant access.

### Administrator

The administrator serves as the main controller for the website and competitions. An admin user should be able to: 1. Create and manage competitions. This includes choosing start/end dates and deadlines for the submission of participants and judges. 2. Create, edit, copy, delete, and assign rubrics to competitions. 3. Assign judges to a competition (accordingly based off their interest). 5. Manage, edit, and approve judge feedback before giving back to the participants.

### Judge

The judge is responsible for giving feedback to competition submissions.
Judge will have access to: 1. See the project(s) they are assigned to. This includes the competition's details. 2. Give feedbacks to the projects (accordingly to the rubric that was created by the admin). 3. See graded and ungraded submissions for the current active competitions. 4. Ability to edit the submissions that they have graded before the deadlines.
Judge will not have access to: 1. The participants' detailed information that are not being disclosed by admin. 2. See other's judges' grades on other submissions. 3. Submissions from participants they are not assigned to.

### Guardian/ Participant

The guardian/ participant is the user who will actually submit work for a competition. The role is intended to be used by a parent/teacher who will sign up for a competition on a student's behalf.
The participant/ guardian will have access to: 1. Sign up for competitions (various times according to the number of students and projects) 2. See details for their active competitions and the upcoming competitions. 3. Submit their work for current competitions and resubmitting work as needed before deadlines or per admin's request. 4. See feedback from past competitions.
The participant/ guardian will not have access to: 1. Access the judge's information. 2. Access the full feedbacks that are not being disclosed by admin.

## Site Pages

    The pages are managed in the app.js. Where we implemented the protected route according to the roles to protect the data that all only accessible to admin. Judge have access to rubric page and contact page. Guardians can only access submissions and contact. Admin have access to competition management, competition edit, rubric (add edit preview), user management, charts, and all the pages that are accessible for judge and guardian.

    PUBLIC PAGES (accessible to all users regardless of their roles):

### Welcome / Login Page

    The welcome page will be the entry screen for all users.
    It's the entry point for users to participate in the competitions (as a judge, a guardian/ participant, and admin).
    It includes a log in field for registered user (with remember me feature) and a button that takes the users to sign-up page(s).
    This page is accessible for everyone and all users.

### Sign Up Page(s)

    This page has two buttons that would take user to different sign up pages based on the roles ('Sign up as a Guardian' and 'Sign up as a Judge').
    There's a button to navigate back to the welcome page for user's usability.
    This page is accessible for everyone and all users.

#### Sign up as a Guardian

    This page is a form to sign up as a guardian. It's filled with required fields including: First Name, Last Name, Email, Phone Number, Pronouns, Username, Password, and Confirm Password, as well as a required checklist of ensuring they are 18+ years old.
    Submit button would only work if they have filled all the requirement fields (marked with red star), the field would give red warning signs and instruction to fill the missing fields if not.
    There's a button to navigate back to the sign up page for user's usability.
    This page is accessible for everyone and all users.

#### Sign up as a Judge

    This page is a form to sign up as a judge. It's filled with fields similar to guardian's with more follow up questions that are based off their interests, expertise, and preferences.
    Submit button would only work if they have filled all the requirement fields (marked with red star), the field would give red warning signs and instruction to fill the missing fields if not.
    There's a feature to scroll back to the top page when user scrolls down to the bottom of the page since the sign up page is long.
    There's a button to navigate back to the sign up page for user's usability.
    This page is accessible for everyone and all users.

ADMIN SIDE PAGES (pages that are exclusively accessible by admin):

#### Admin Home Page

    The home page for the admin backend should allow for the admin users to see the status of all ongoing and upcoming competitions/ submissions. The site will pull all competitions in the ongoing or upcoming state. It will then display them in a digestible card format. The card should include the competition title as well as basic statistics such as number of judges and participants, number of submissions and grades, and percent of submissions with/without feedback. These stats will be calculated on the site based on pulled competition data. There will also be buttons for the admin to start upcoming competitions and end ongoing competitions. Confirmation popups will be included to prevent accidental clicks.

#### Competition Management

    The competition management page should allow for admin users to create, delete, and edit competitions. When a user wants to edit a competition, they will click a button to take them to another preview.

    On this  page (specific to each competition), the user should be able to edit all aspects of the competition.
    It will be divided into tabs/views. The first tab will include basic settings like name, end dates for submissions and feedback, and the selected rubric. The next tab will be to manage the judges. In this tab, the user should be able to add judges to a competition.
    For each judge, the admin should be able to see how many grades they have submitted and which grades they are assigned to (editable by the admin). The next tab will be to manage the participants.
    This will show basic info for each participant, including name, grade, and the status of their submissions. Admin should also be able to remove a user from a competition. Lastly, the admin will be able to see all submitted grades/feedback. The admin should be able to filter the grade by judge and/or submission title. For each submission, the admin will be able to edit the feedback in the same way a judge is able to, to approve the grade, filter the feedbacks, and limiting what the participants see for their feedback for the submission.

#### User Management

    This page will allow the admin to see and manage all users. Users should be searchable by name and be able to be filtered by role. For each user, the admin should be able to change their role (specifically promote/demote to admin). There should be protections to prevent all admins from being demoted. The admin will also be able to delete users.

#### Rubric Management

    This page will allow the admin to see and manage rubrics for competitions. It will be laid out similarly to the competition management page. Each rubric will be displayed with basic info like the rubric name, total points, and the number of assigned competitions. The admin will be able to click a button to edit a rubric.
    In the rubric edit page, an admin will be able to create/delete questions similarly to form systems like Microsoft forms. This means that the admin will be able to add questions and change the order as needed, accordingly to the types of feedbacks (ratings, long questions, etc.). The admin should be able to delete any created questions.  The scoring questions will let the judges assign a score based on a judging criteria from zero to a max score defined by the admin in the rubric.

#### Data Viewer

    The Data Viewer page will allow for an admin to view and export stats. The scale of the stats will be both global (AKA all competitions) and by competition. The stats included should include judge and participant data (number of participants, age & gender breakdown, etc), submission and grading data (average feedback scores, percent of submissions completed, etc), and submission type data (types/categories of projects). The data will be projected as charts and be able to exported in a .csv format.

JUDGE PAGES (pages that are exclusively accessible by the judge and admin):

#### Judge Home Page

    Displays both ungraded and graded competition submissions assigned to a specific judge.
    Cards for each submission, grouped in two categories (graded/ungraded competitions).
    Ungraded competition cards include a 'Submit Feedback' button which will direct judge to feedback page.
    Graded competition cards include a 'View Feedback' button which will direct judge to feedback page which will be autofilled with a judge's previously submitted feedback for that specific team (judges can then edit this feedback and resubmit it).Each card will display the title of the feedback, the category for the feedback, the industry for the feedback, and the number of received feedbacks (across all judges) for each submission.

#### Feedback Page

    The feedback page will allow for a judge to provide needed feedback for a participant submission. It will pull up fields to fill in grades from the rubric assigned to the competition. The page will autosave so no grades will be lost if the feedback hasn't been formally submitted.

GUARDIANS/ PARTICIPANTS PAGES ( pages that are exclusively accessible only by guardians/participants and admin)

    The participant-side of the website will be dedicated to allowing for the participant-type of user to enroll in new competitions, see the rubrics for current and upcoming competitions, see feedback from old competitions, and create a submission for a current competition.

#### Participant Home Page

Displays current and upcoming competitions for the signed in participants. Cards for each competition, grouped in two categories (upcoming/current competitions). Current competition cards include a 'Submit' button which will direct participant to submission page.
Each card will include a string displaying the participant due date for the competition.
All competition cards include a 'See More' button which expands the card and reveals more info for the co petition (rubric info, etc.). If a rubric does not exist yet for an upcoming competition, an 'unassigned' string will be displayed instead.

#### Submission Page

The submission page will allow a participant to create a submission for an assigned competition. This page will allow the user to supply information needed for the judging process. This includes project title, file uploading for the project presentation, YouTube linking, a description field, etc. It will autosave so no progress is lost if the work isn't formally submitted.

# Site Status & Future Work

## Site Status

Currently the site hav fulfilled the majority of the initial requirements defined by Hewitt.

The administrator type user is able to:

1. Create and delete competition as well as edit basic competition info such as due dates
2. Manage student group access to the competitions. The user can both import groups from a csv and approve/disapprove groups from participating in the competition.
3. Manage judge assignments for a competition. The user can assign a judge to a competition and define the grade levels the judge is responsible for evaluating.
4. Manage group submissions and judge evaluations. The user can view all submissions and any associated judge evaluations. For each evaluation, the admin can approve or disapprove the feedback from being seen by the group.
5. View site users and change user roles as needed.

The guardian type user is able to:

1. Submit a group to join a competition. The group will need to be approved by the admin before it can take part.
2. View groups by ongoing/upcoming/ended competitions.
3. Draft and edit submissions for approved groups in ongoing competitions.
4. View competition rubric previews for all approved groups.
5. View approved feedback for groups in ended competitions.

The judge type user is able to:

1. See the competitions that they have been assigned by the admin.
2. See the graded and ungraded status of the submissions they are assigned.
3. Give feedbacks according to the rubric (long answers, ratings, etc.) and being able to edit the feedbacks before the deadline.

With these user capabilities finished, a basic draft of a competition flow is nearly completed.

## Future Work

There are many opportunities for future work on this project. First and foremost, not all of the project objectives were met. The most pressing objective that was not met is allowing the user to view a competition statistics dashboard. While there are some basic statistic reporting, it is still not well integrated with the site. This should likely be the highest priority for adding new features. Past the data reporting, some additional future objectives to work towards are IP protection, award certificates, and real-time data dashboards.

In addition there are many potential changes that can be made ot improve the current site, these changes include:

1. Better user behavior guardrails. It is easy for bad user inputs to cause issues in backend processing. One specific instance of this is that group importing via csv. There are no checks to ensure that the csv format is correct. Another example is to prevent competition submissions/feedback being enabled when the competition is not in the active state.
2. Better data flow, management. There is a lot of room for improvement for handling deletions and editing of data. One example is that if
3. Data security. The majority of the backend calls are open to any user that can guess the proper url. In addition excess information is often gathered from backend calls for use in components. An example of this is that the backend call for submission feedback items includes all given feedbacks, including the unapproved feedback. While they aren't displayed on the frontend, the info could possibly be accessed from the console.
