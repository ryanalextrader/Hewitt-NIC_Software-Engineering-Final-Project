import os
import django

# Setup Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from django.db import transaction
from django.utils import timezone
from api.models import UserInfo, Rubric, Category, Comment, LongAnswer, Scale, Competition, Group, Participant, Submission, Feedback, Judge, LongAnswerFeedback, ScaleFeedback
import datetime
import random

def create_test_data():
    """Create test data for all models in the competition system."""
    
    with transaction.atomic():
        # Create Users
        users = []
        user_types = {1: "Admin", 2: "Judge", 3: "Guardian"}
        
        for i in range(20):
            user_type = random.choice(list(user_types.keys()))
            user = UserInfo.objects.create(
                firstname=f"FirstName{i}",
                familyname=f"LastName{i}",
                type=user_type,
                email=f"user{i}@example.com",
                pronouns=random.choice(["He/Him", "She/Her", "They/Them"]),
                # password="password123",  # In a real system, you'd use a proper hashing mechanism
                program=f"Program {i % 8}"
            )
            users.append(user)
            print(f"Created User: {user.firstname} {user.familyname} ({user_types[user_type]})")
        
        # Create Rubrics with related elements
        rubrics = []
        for i in range(3):
            rubric = Rubric.objects.create(
                name=f"Rubric {i+1}",
                checkbox_text=f"Project meets all requirements for Rubric {i+1}"
            )
            rubrics.append(rubric)
            print(f"Created Rubric: {rubric.name}")
            
            # Create Categories for each Rubric
            for j in range(3):
                category = Category.objects.create(
                    rubric=rubric,
                    text=f"Category {j+1} for {rubric.name}",
                    order=j+1
                )
                print(f"  Created Category: {category.text}")
            
            # Create Comments for each Rubric
            for j in range(5):
                comment = Comment.objects.create(
                    rubric=rubric,
                    text=f"Comment {j+1} for {rubric.name}",
                    order=j+1
                )
                print(f"  Created Comment: {comment.text}")
            
            # Create Long Answers for each Rubric
            for j in range(2):
                long_answer = LongAnswer.objects.create(
                    rubric=rubric,
                    prompt=f"Describe in detail {j+1} for {rubric.name}",
                    order=j+1
                )
                print(f"  Created Long Answer Prompt: {long_answer.prompt}")
            
            # Create Scales for each Rubric
            for j in range(4):
                scale = Scale.objects.create(
                    rubric=rubric,
                    max_score=5,
                    min_text=f"Poor performance on criteria {j+1}",
                    max_text=f"Excellent performance on criteria {j+1}",
                    prompt_text=f"Rate the quality of {j+1} for {rubric.name}",
                    order=j+1
                )
                print(f"  Created Scale: {scale.prompt_text}")
        
        # Create Competitions
        competitions = []
        states = ["Upcoming", "Ongoing", "Ended"]
        today = timezone.now().date()
        
        for i in range(2):
            start_date = today + datetime.timedelta(days=(i-1)*30)
            submission_due = start_date + datetime.timedelta(days=14)
            feedback_due = submission_due + datetime.timedelta(days=7)
            
            competition = Competition.objects.create(
                name=f"Competition {i+1}",
                start_date=start_date,
                submission_due_date=submission_due,
                feedback_due_date=feedback_due,
                competition_state=states[i % len(states)],
                submission_active=i == 1,
                feedback_active=i == 1,
                rubric=rubrics[i % len(rubrics)]
            )
            competitions.append(competition)
            print(f"Created Competition: {competition.name} ({competition.competition_state})")
        
        # Create Groups
        groups = []
        guardian_users = [u for u in users if u.type == 3]
        
        for i, competition in enumerate(competitions):
            for j in range(3):  # 3 teams per competition
                # Get a user that hasn't been assigned to this competition yet
                available_users = [u for u in guardian_users if not Group.objects.filter(comp=competition, user=u).exists()]
                if available_users:
                    user = random.choice(available_users)
                    group = Group.objects.create(
                        comp=competition,
                        user=user
                    )
                    groups.append(group)
                    print(f"Created Group in {competition.name} with user {user.firstname}")
                    
                    # Create 2-3 Participants per group
                    for k in range(random.randint(2, 3)):
                        participant = Participant.objects.create(
                            firstname=f"Student{k+1}FirstName",
                            familyname=f"Student{k+1}LastName",
                            pronouns=random.choice(["He/Him", "She/Her", "They/Them"]),
                            grade=random.choice(["9", "10", "11", "12"]),
                            age=random.randint(6, 17),
                            school=f"School {random.randint(1, 5)}",
                            address=f"{random.randint(100, 999)} Main St, City {random.randint(1, 10)}",
                            group=group
                        )
                        print(f"  Created Participant: {participant.firstname} {participant.familyname}")
        
        # Create Judges
        judges = []
        judge_users = [u for u in users if u.type == 2]
        
        for i, competition in enumerate(competitions):
            # Assign 3-4 judges per competition
            for j in range(min(len(judge_users), random.randint(3, 4))):
                if j < len(judge_users):
                    judge = Judge.objects.create(
                        user=judge_users[j],
                        competition=competition,
                        min_grade_assigned=0,
                        max_grade_assigned=12,
                        time_zone=random.choice(["EST", "CST", "PST", "MST"])
                    )
                    judges.append(judge)
                    print(f"Created Judge for {competition.name}: {judge.user.firstname} {judge.user.familyname}")
        
        # Create Submissions
        submissions = []
        for group in groups:
            # Only create submissions for some groups
            if random.random() < 0.8:  # 80% chance of submission
                submission = Submission.objects.create(
                    group=group,
                    title=f"Project by {group.user.firstname}'s Team",
                    problem_solved=f"Solving problem #{random.randint(1, 10)}",
                    presentation_link=f"https://slides.example.com/presentation{random.randint(1000, 9999)}",
                    youtube_link=f"https://youtu.be/{random.randint(10000, 99999)}",
                    log_book_link=f"https://docs.example.com/logbook{random.randint(1000, 9999)}",
                    # Note: actual image files would need to be added separately
                )
                submissions.append(submission)
                print(f"Created Submission: {submission.title}")
                
                # Create Feedback for completed competitions
                if group.comp.competition_state in ["Completed", "Archived"]:
                    competition_judges = Judge.objects.filter(competition=group.comp)
                    
                    # Each judge gives feedback
                    for judge in competition_judges:
                        feedback = Feedback.objects.create(
                            judge=judge,
                            submission=submission,
                            box_checked=random.choice([0, 1]),
                            approved=random.randint(0,1)
                        )
                        print(f"  Created Feedback from judge {judge.user.firstname}")
                        
                        # Create Scale Feedback
                        for scale in Scale.objects.filter(rubric=group.comp.rubric):
                            scale_feedback = ScaleFeedback.objects.create(
                                feedback=feedback,
                                scale=scale,
                                score=random.randint(1, scale.max_score)
                            )
                            print(f"    Created Scale Feedback: score {scale_feedback.score} for {scale.prompt_text}")
                        
                        # Create Long Answer Feedback
                        for long_answer in LongAnswer.objects.filter(rubric=group.comp.rubric):
                            long_answer_feedback = LongAnswerFeedback.objects.create(
                                feedback=feedback,
                                long_answer=long_answer,
                                text=f"Detailed feedback for {long_answer.prompt}: Lorem ipsum dolor sit amet, consectetur adipiscing elit."
                            )
                            print(f"    Created Long Answer Feedback for prompt: {long_answer.prompt}")
    
    print("\nTest data creation complete!")

# Run the function to create data
if __name__ == "__main__":
    # os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
    create_test_data()