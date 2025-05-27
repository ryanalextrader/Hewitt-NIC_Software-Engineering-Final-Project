from django.contrib.auth.models import User
from rest_framework import serializers
from .models import UserInfo, Judge, Group, Participant, Rubric, Submission, Competition, Category, Comment, Scale, LongAnswer, Judgeinfo, Feedback, LongAnswerFeedback, ScaleFeedback

# defines serializers used to convert database data into python data types

########################## USER SERIALIZERS ######################################

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "password"]
        extra_kwargs = {"password": {"write_only": True}}

    def create(self, validated_data):
        print(validated_data)
        user = User.objects.create_user(**validated_data)
        return user
    
class AuthUserInfoSerializer(serializers.ModelSerializer):

    def __init__ (self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields["auth_user"] = UserInfoSerializer(many=False, read_only=True)
    
    class Meta:
        model = User
        fields = ["id", "username", "auth_user"]
    
    
class UserInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserInfo
        fields = ["id", "firstname", "familyname", "type", "email", "pronouns", "program", "phonenumber"]

class UserInfoUserAuthSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserInfo
        fields = ["id", "firstname", "familyname", "type", "email", "pronouns", "program", "phonenumber", "user"]
    
    
########################## JUDGE SERIALIZERS ######################################
class JudgeInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Judgeinfo
        fields = ["id", "whatsappnumber", "address", "organization", "contacttitle", "round", "timezone", "experienced", 
                  "innovationexperience", "areaofexpertise", "accommodations", "interestquery", "hearquery", "excitementquery", 
                  "conflictofinterest", "questionsforus"]
        
class JudgeInfoUsersSerializer(serializers.ModelSerializer):
    class Meta:
        model = Judgeinfo
        fields = ["id", "whatsappnumber", "address", "organization", "contacttitle", "round", "timezone", "experienced", 
                  "innovationexperience", "areaofexpertise", "accommodations", "interestquery", "hearquery", "excitementquery", 
                  "conflictofinterest", "questionsforus", "users"]
        
class JudgeSerializer(serializers.ModelSerializer):
    # user = UserInfoSerializer(many=False, read_only=True)
    
    class Meta:
        model = Judge
        fields = ["id", "user", "competition", "min_grade_assigned", "max_grade_assigned", "time_zone"]
            
        
class JudgeUsersSerializer(serializers.ModelSerializer):
    judge_info = JudgeSerializer(many=True, read_only=True)
    def __init__ (self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields["judge_signup_info"] = JudgeInfoSerializer(many=True, read_only=True)
    
    class Meta:
        model = UserInfo
        fields = ["id", "firstname", "familyname", "type", "email", "pronouns", "program", "judge_info"]
        
########################## PARTICIPANT SERIALIZERS ######################################

class ParticipantSerializer(serializers.ModelSerializer):
    class Meta:
        model = Participant
        fields = ["id", "firstname", "familyname", "pronouns", "grade", "age", "school", "address", "city", "state", "zip", "group"]
        
class GroupSerializerBasic(serializers.ModelSerializer):
    class Meta:
        model = Group
        fields = ["id", "comp", "user", "project_title", "approved"]
        
class GroupUsersSerializer(serializers.ModelSerializer):
    group_participants = ParticipantSerializer(many=True, read_only=True)
    user = UserInfoSerializer(many=False, read_only=True)
    
    class Meta:
        model = Group
        fields = ["id", "comp", "user", "project_title", "approved", "group_participants"]
        
class GroupCompSerializer(serializers.ModelSerializer):
    # comp = CompetitionBasicSerializer(many=False, read_only=True)
    group_participants = ParticipantSerializer(many=True, read_only=True)
    # user = UserInfoSerializer(many=False, read_only=True)
    
    def __init__ (self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields["comp"] = CompetitionSerializer(many=False, read_only=True)
    
    class Meta:
        model = Group
        fields = ["id", "comp", "user", "project_title", "approved", "group_participants"]
        
class GroupFullSerializer(serializers.ModelSerializer):
    group_participants = ParticipantSerializer(many=True, read_only=True)
    user = UserInfoSerializer(many=False, read_only=True)
    def __init__ (self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        
        self.fields["comp"] = CompetitionSerializer(many=False, read_only=True)
        self.fields["group_submission"] = SubmissionFeedbackSerializer(many=True, read_only=True)
    
    class Meta:
        model = Group
        fields = ["id", "comp", "user", "project_title", "approved", "group_participants"]

########################## RUBRIC SERIALIZERS ######################################

class RubricSerializer(serializers.ModelSerializer):
    class Meta:
        model = Rubric
        fields = ["id", "name", "checkbox_text"]
        
class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ["id", "rubric", "text", "order"]
        
class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = ["id", "rubric", "text", "order"]
        
class LongAnswerSerializer(serializers.ModelSerializer):
    class Meta:
        model = LongAnswer
        fields = ["id", "rubric", "prompt", "order"]
        
class ScaleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Scale
        fields = ["id", "rubric", "max_score", "min_text", "max_text", "prompt_text", "order"]
        
class RubricTestSerializer(serializers.ModelSerializer):
    categories = CategorySerializer(many=True, read_only=True)
    comments = CommentSerializer(many=True, read_only=True)
    scales = ScaleSerializer(many=True, read_only=True)
    long_answers = LongAnswerSerializer(many=True, read_only=True)
    
    class Meta:
        model = Rubric
        fields = ["id", "name", "checkbox_text", "categories", "comments", "scales", "long_answers"]
        
########################## FEEDBACK SERIALIZERS ######################################
        
class FeedbackBasicSerializer(serializers.ModelSerializer):   
    class Meta:
        model = Feedback
        fields = ["id", "judge", "submission", "box_checked", "text_feedback", "approved"]
        
class LongAnswerFeedbackSerializer(serializers.ModelSerializer):
    class Meta:
        model = LongAnswerFeedback
        fields  = ["id", "feedback", "long_answer", "text"]
        
class ScaleFeedbackSerializer(serializers.ModelSerializer):
    class Meta:
        model = ScaleFeedback
        fields  = ["id", "feedback", "scale", "score"]
        
class FeedbackFullSerializer(serializers.ModelSerializer):
    
    def __init__ (self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields["long_answer_feedback"] = LongAnswerFeedbackSerializer(many=True, read_only=True)
        self.fields["scale_feedback"] = ScaleFeedbackSerializer(many=True, read_only=True)
    
    class Meta:
        model = Feedback
        fields = ["id", "judge", "submission", "box_checked", "text_feedback", "approved"]

 
########################## SUBMISSION SERIALIZERS ######################################

class SubmissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Submission
        fields = ["id", "group", "problem_solved", "presentation_link", "youtube_link", "log_book_link"]
        
class SubmissionFeedbackSerializer(serializers.ModelSerializer):
    submission_feedback = FeedbackFullSerializer(many=True, read_only=True)
    
    class Meta:
        model = Submission
        fields = ["id", "group", "problem_solved", "presentation_link", "youtube_link", "log_book_link", "submission_feedback"]
        
class SubmissionFullSerializer(serializers.ModelSerializer):
    group = GroupUsersSerializer(many=False, read_only=True)
    submission_feedback = FeedbackFullSerializer(many=True, read_only=True)
    
    class Meta:
        model = Submission
        fields = ["id", "group", "problem_solved", "presentation_link", "youtube_link", "log_book_link", "submission_feedback"]
        
########################## COMPETITION SERIALIZERS ######################################

class CompetitionBasicSerializer(serializers.ModelSerializer):
    class Meta:
        model = Competition
        fields = ["id", "name", "competition_state"]
        
class CompetitionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Competition
        fields = ["id", "name", "start_date", "submission_due_date", "feedback_due_date", "competition_state", "submission_active", "feedback_active", "rubric"]
        
class CompetitionCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Competition
        fields = ["name", "start_date", "submission_due_date", "feedback_due_date"]
        
class CompetitionRubricSerializer(serializers.ModelSerializer):
    rubric = RubricTestSerializer(many=False, read_only=True)
    
    class Meta:
        model = Competition
        fields = ["id", "name", "start_date", "submission_due_date", "feedback_due_date", "competition_state", "submission_active", "feedback_active", "rubric"]

class CompetitionRubricSerializer(serializers.ModelSerializer):
    rubric = RubricTestSerializer(many=False, read_only=True)
    
    class Meta:
        model = Competition
        fields = ["id", "name", "start_date", "submission_due_date", "feedback_due_date", "competition_state", "submission_active", "feedback_active", "rubric"]
        
class CompetitionFullSerializer(serializers.ModelSerializer):
    comp_groups = GroupUsersSerializer(many=True, read_only=True)
    comp_judges = JudgeSerializer(many=True, read_only=True)
    rubric = RubricTestSerializer(many=False, read_only=True)
    
    class Meta:
        model = Competition
        fields = ["id", "name", "start_date", "submission_due_date", "feedback_due_date", "competition_state", "submission_active", "feedback_active", "comp_groups", "comp_judges","rubric"]
        
class ParticipantInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Participant
        fields = ["pronouns", "grade", "state"]