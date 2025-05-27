# Create your models here.
from django.db import models
from django.contrib.auth.models import User

# defines models to be used in the backend (a model corresponds to an entry in the database)

class UserInfo(models.Model):
    firstname = models.CharField(max_length=255, blank=True, null=True)
    familyname = models.CharField(max_length=255, blank=True, null=True)
    type = models.IntegerField(blank=True, null=True)
    email = models.CharField(max_length=255, blank=True, null=True)
    pronouns = models.CharField(max_length=255, blank=True, null=True)
    program = models.CharField(max_length=255, blank=True, null=True)
    phonenumber = models.CharField(max_length=255, blank=True, null=True)
    user = models.OneToOneField(User, models.CASCADE, related_name="auth_user")

    class Meta:
        # managed = False
        managed = True
        db_table = 'users'
        
class Competition(models.Model):
    name = models.CharField(max_length=255, blank=True, null=True)
    start_date = models.DateField(blank=True, null=True)
    submission_due_date = models.DateField(blank=True, null=True)
    feedback_due_date = models.DateField(blank=True, null=True)
    competition_state = models.CharField(max_length=36, default='Upcoming')
    submission_active = models.BooleanField(default=False)
    feedback_active = models.BooleanField(default=False)
    rubric = models.ForeignKey('Rubric', models.DO_NOTHING, null=True, blank=True)

    class Meta:
        # managed = False
        managed = True
        db_table = 'competition' 

class Judgeinfo(models.Model):
    whatsappnumber = models.CharField(max_length=255, blank=True, null=True)
    address = models.CharField(max_length=255, blank=True, null=True)
    organization = models.CharField(max_length=255, blank=True, null=True)
    contacttitle = models.CharField(max_length=255, blank=True, null=True)
    round = models.CharField(max_length=255, blank=True, null=True)
    timezone = models.CharField(max_length=255, blank=True, null=True)
    experienced = models.IntegerField(blank=True, null=True)
    innovationexperience = models.CharField(max_length=255, blank=True, null=True)
    areaofexpertise = models.CharField(max_length=255, blank=True, null=True)
    accommodations = models.CharField(max_length=255, blank=True, null=True)
    interestquery = models.CharField(max_length=255, blank=True, null=True)
    hearquery = models.CharField(max_length=255, blank=True, null=True)
    excitementquery = models.CharField(max_length=255, blank=True, null=True)
    conflictofinterest = models.CharField(max_length=255, blank=True, null=True)
    questionsforus = models.CharField(max_length=255, blank=True, null=True)
    users = models.ForeignKey('UserInfo', models.DO_NOTHING, null=True, blank=True, related_name="judge_signup_info")

    class Meta:
        managed = True
        db_table = 'judgeinfo'
        
class Judge(models.Model):
    user = models.ForeignKey('UserInfo', models.DO_NOTHING, default=None, related_name="judge_info")
    competition = models.ForeignKey(Competition, on_delete=models.CASCADE, default=None, related_name="comp_judges")
    min_grade_assigned = models.IntegerField(blank=True, null=True)
    max_grade_assigned = models.IntegerField(blank=True, null=True)
    time_zone = models.CharField(max_length=255, blank=True, null=True)

    class Meta:
        # managed = False
        managed = True
        db_table = 'judge'  
        
class Group(models.Model):
    comp = models.ForeignKey(Competition, on_delete=models.CASCADE, default=None, related_name="comp_groups")
    user = models.ForeignKey('UserInfo', models.DO_NOTHING, default=None)
    project_title = models.CharField(max_length=255, blank=False, null=False, default="group")
    approved = models.BooleanField(blank=False, null=False, default=False)

    class Meta:
        # managed = False
        managed = True
        db_table = 'group'  
                    
class Participant(models.Model):
    firstname = models.CharField(max_length=255, blank=True, null=True)
    familyname = models.CharField(max_length=255, blank=True, null=True)
    pronouns = models.CharField(max_length=255, blank=True, null=True)
    grade = models.CharField(max_length=255, blank=True, null=True)
    age = models.IntegerField(blank=True, null=True)
    school = models.CharField(max_length=255, blank=True, null=True)
    address = models.CharField(max_length=255, blank=True, null=True)
    city = models.CharField(max_length=255, blank=True, null=True)
    state = models.CharField(max_length=255, blank=True, null=True)
    zip = models.CharField(max_length=255, blank=True, null=True)
    group = models.ForeignKey(Group, on_delete=models.CASCADE, default=None, related_name="group_participants")

    class Meta:
        # managed = False
        managed = True
        db_table = 'participant'
        
class Rubric(models.Model):
    name = models.CharField(max_length=255, blank=True, null=True)
    checkbox_text = models.CharField(max_length=255, blank=True, null=True)

    class Meta:
        # managed = False
        managed = True
        db_table = 'rubric'
                
class Category(models.Model):
    rubric = models.ForeignKey('Rubric', on_delete=models.CASCADE, default=None, related_name='categories')
    text = models.CharField(max_length=255, blank=True, null=True)
    order = models.IntegerField(blank=True, null=True)
    
    # def __str__(self):
    #     return '%s, %d' % (self.text, self.order)

    class Meta:
        # managed = False
        managed = True
        db_table = 'category'

class Comment(models.Model):
    rubric = models.ForeignKey('Rubric', on_delete=models.CASCADE, default=None, related_name='comments')
    text = models.CharField(max_length=255, blank=True, null=True)
    order = models.IntegerField(blank=True, null=True)
    
    # def __str__(self):
    #     return '%s, %d' % (self.text, self.order)

    class Meta:
        # managed = False
        managed = True
        db_table = 'comment'
        
class LongAnswer(models.Model):
    rubric = models.ForeignKey('Rubric', on_delete=models.CASCADE, default=None, related_name='long_answers')
    prompt = models.CharField(max_length=255, blank=True, null=True)
    order = models.IntegerField(blank=True, null=True)
    
    # def __str__(self):
    #     return '%s, %d' % (self.prompt, self.order)

    class Meta:
        # managed = False
        managed = True
        db_table = 'long_answer'
        
class Scale(models.Model):
    rubric = models.ForeignKey(Rubric, on_delete=models.CASCADE, default=None, related_name='scales')
    max_score = models.IntegerField(blank=True, null=True)
    min_text = models.CharField(max_length=255, blank=True, null=True)
    max_text = models.CharField(max_length=255, blank=True, null=True)
    prompt_text = models.CharField(max_length=255, blank=True, null=True)
    order = models.IntegerField(blank=True, null=True)
    
    # def __str__(self):
    #     return '%s, %d' % (self.prompt_text, self.order)

    class Meta:
        # managed = False
        managed = True
        db_table = 'scale'  
        
class Submission(models.Model):
    group = models.ForeignKey(Group, models.DO_NOTHING, default=None, related_name="group_submission")
    problem_solved = models.CharField(max_length=255, blank=True, null=True)
    presentation_link = models.CharField(max_length=255, blank=True, null=True)       
    youtube_link = models.CharField(max_length=255, blank=True, null=True)
    log_book_link = models.CharField(max_length=255, blank=True, null=True)
    image_for_judges = models.ImageField(blank=True, null=True)
    public_image = models.ImageField(blank=True, null=True)
    team_image = models.ImageField(blank=True, null=True)

    class Meta:
        # managed = False
        managed = True
        db_table = 'submission' 
                     
class Feedback(models.Model):
    judge = models.ForeignKey('Judge', models.DO_NOTHING, default=None, related_name="judge_feedback")
    submission = models.ForeignKey('Submission', on_delete=models.CASCADE, default=None, related_name="submission_feedback")
    box_checked = models.BooleanField(blank=True, null=True)
    text_feedback = models.CharField(max_length=255, blank=True, null=True)
    approved = models.BooleanField(blank=True, null=True)

    class Meta:
        # managed = False
        managed = True
        db_table = 'feedback'

class LongAnswerFeedback(models.Model):
    feedback = models.ForeignKey(Feedback, on_delete=models.CASCADE, default=None, related_name="long_answer_feedback")
    long_answer = models.ForeignKey(LongAnswer, models.DO_NOTHING, default=None, related_name="long_answer_grade")
    text = models.CharField(max_length=255, blank=True, null=True)

    class Meta:
        # managed = False
        managed = True
        db_table = 'long_answer_feedback'

class ScaleFeedback(models.Model):
    feedback = models.ForeignKey(Feedback, on_delete=models.CASCADE, default=None, related_name="scale_feedback")
    scale = models.ForeignKey(Scale, models.DO_NOTHING, default=None, related_name="scale_grate")
    score = models.IntegerField(blank=True, null=True)

    class Meta:
        # managed = False
        managed = True
        db_table = 'scale_feedback'

