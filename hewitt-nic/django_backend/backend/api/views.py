from django.http import HttpResponse, JsonResponse
import csv
from django.shortcuts import render

# Create your views here.
from django.shortcuts import render
from django.contrib.auth.models import User
from django.db.models import Prefetch, Q
from rest_framework import generics
from .serializers import UserSerializer, AuthUserInfoSerializer, UserInfoSerializer, UserInfoUserAuthSerializer
from .serializers import JudgeSerializer, JudgeUsersSerializer, JudgeInfoSerializer, JudgeInfoUsersSerializer
from .serializers import GroupSerializerBasic, GroupUsersSerializer, GroupCompSerializer, GroupFullSerializer, ParticipantSerializer
from .serializers import RubricSerializer, RubricTestSerializer, SubmissionSerializer, SubmissionFullSerializer, CategorySerializer, LongAnswerSerializer, ScaleSerializer, CommentSerializer
from .serializers import FeedbackBasicSerializer, FeedbackFullSerializer
from .serializers import CompetitionBasicSerializer, CompetitionSerializer, CompetitionCreateSerializer, CompetitionRubricSerializer, CompetitionFullSerializer, ParticipantInfoSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import UserInfo, Feedback, Judge, LongAnswerFeedback, Group, Participant, Rubric, Submission, Competition, Judgeinfo, Participant, Scale, ScaleFeedback, Submission, UserInfo, Group, Category, LongAnswer, Comment

import pandas as pd
import numpy as np
import os
import pymysql

# defines views to be used (defines how django backend treats web requests)

########################## USER VIEWS ######################################

class GetCreateUserView(generics.ListCreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]
    
class GetCurrentUser(generics.ListAPIView):
    serializer_class = AuthUserInfoSerializer
    permission_classes = [AllowAny]
    def get_queryset(self):
        auth_user_id = self.request.user.id
        return User.objects.filter(id=auth_user_id)

class CreateUserInfoView(generics.ListCreateAPIView):
    # serializer_class = UserInfoSerializer
    serializer_class = UserInfoUserAuthSerializer
    permission_classes = [AllowAny]
    queryset = UserInfo.objects

    def perform_create(self, serializer):
        if serializer.is_valid():
            serializer.save()
        else:
            print(serializer.error)


class UpdateUserInfoView(generics.RetrieveUpdateAPIView):
    serializer_class = UserInfoUserAuthSerializer
    permission_classes = [AllowAny]
    queryset = UserInfo.objects.all()
    lookup_field = ('id')

    def preform_post(self, serializer):
        if serializer.is_valid():
            serializer.save()
        else:
            print(serializer.errors)


class GetUserInfoByID(generics.ListAPIView):
    serializer_class = UserInfoUserAuthSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        auth_user_id = self.request.user.id
        return UserInfo.objects.filter(user_id=auth_user_id)
    
class GetUserInfoByType(generics.ListAPIView):
    serializer_class = UserInfoUserAuthSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        type = self.kwargs.get('type')
        return UserInfo.objects.filter(type=type)

########################## JUDGE VIEWS ######################################


class ListCreateJudges(generics.ListCreateAPIView):
    serializer_class = JudgeSerializer
    permission_classes = [AllowAny]
    queryset = Judge.objects.all()


class ListUpdateDestroyJudge(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = JudgeSerializer
    permission_classes = [AllowAny]
    queryset = Judge.objects.all()
    lookup_field = ('id')


class GetJudgeUsers(generics.ListAPIView):
    serializer_class = JudgeUsersSerializer
    permission_classes = [AllowAny]
    queryset = UserInfo.objects.filter(type=2)


class GetJudgeUsersByCompetition(generics.ListAPIView):
    serializer_class = JudgeUsersSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        compID = self.kwargs.get('id')
        type = self.kwargs.get('type')

        if type == "in":
            # Nested/prefetch filtering from https://www.geeksforgeeks.org/how-to-filter-a-nested-serializer-in-django-rest-framework/
            return UserInfo.objects.prefetch_related(Prefetch("judge_info", queryset=Judge.objects.filter(competition=compID))).filter(judge_info__competition=compID)
        else:
            # Not query from https://stackoverflow.com/questions/687295/how-do-i-do-a-not-equal-in-django-queryset-filtering
            return UserInfo.objects.filter(Q(type=2), ~Q(judge_info__competition=compID))

class CreateJudgeInfoView(generics.ListCreateAPIView):
    serializer_class = JudgeInfoUsersSerializer
    permission_classes = [AllowAny]
    queryset = Judgeinfo.objects

    def perform_create(self, serializer):
        if serializer.is_valid():
            serializer.save()
        else:
            print(serializer.error) 

class UpdateJudgeInfoView(generics.RetrieveUpdateAPIView):
    serializer_class = JudgeInfoUsersSerializer
    permission_classes = [AllowAny]
    queryset = Judgeinfo.objects.all()
    lookup_field = ('id')

    def preform_post(self, serializer):
        if serializer.is_valid():
            serializer.save()
        else:
            print(serializer.errors)

########################## GUARDIAN VIEWS ######################################

class GetCreateGroups(generics.ListCreateAPIView):
    serializer_class = GroupSerializerBasic
    permission_classes = [AllowAny]
    queryset = Group.objects.all()
    
    def perform_create(self, serializer):
        if serializer.is_valid():
            serializer.save()
        else:
            print("Serializer errors!")
            print(serializer.errors)
            
class UpdateGroup(generics.RetrieveUpdateDestroyAPIView): 
    serializer_class = GroupSerializerBasic
    permission_classes = [AllowAny]
    queryset = Group.objects.all()
    lookup_field = ('id')
    
    def preform_post(self, serializer):
        if serializer.is_valid():
            serializer.save()
        else:
            print("Serializer errors!")
            print(serializer.errors)

class GetGroupsByUserAndCompState(generics.ListAPIView):
    serializer_class = GroupFullSerializer
    permission_classes = [AllowAny]
    
    def get_queryset(self):
        comp_type = self.kwargs.get('comp_type')
        # testUser = User.objects.get(username='aGuard2')
        # return Group.objects.filter(user=testUser.auth_user.id, comp__competition_state=comp_type)
        return Group.objects.filter(user=self.request.user.auth_user.id, comp__competition_state=comp_type)
    
class GetGroupsByCompID(generics.ListAPIView):
    serializer_class = GroupUsersSerializer
    permission_classes = [AllowAny]
    
    def get_queryset(self):
        comp_id = self.kwargs.get('comp_id')
        return Group.objects.filter(comp=comp_id)
    
class GetCreateParticipants(generics.ListCreateAPIView):
    serializer_class = ParticipantSerializer
    permission_classes = [AllowAny]
    queryset = Participant.objects.all()


########################## RUBRIC VIEWS ######################################

class CreateRubricView(generics.ListCreateAPIView):
    serializer_class = RubricSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        return Rubric.objects

    def perform_create(self, serializer):
        if serializer.is_valid():
            serializer.save()
        else:
            print("Serializer errors!")
            print(serializer.errors)

class DeleteRubric(generics.DestroyAPIView):
    serializer_class = RubricSerializer
    permission_classes = [AllowAny]
    queryset = Rubric.objects.all()
    lookup_field = ('id')

class CreateCategoryView(generics.ListCreateAPIView):
    serializer_class = CategorySerializer
    permission_classes = [AllowAny]
    queryset = Category.objects

    def perform_create(self, serializer):
        if serializer.is_valid():
            serializer.save()
        else:
            print(serializer.error)

class DeleteCategory(generics.DestroyAPIView):
    serializer_class = CategorySerializer
    permission_classes = [AllowAny]
    queryset = Category.objects.all()
    lookup_field = ('id')

class CreateCommentView(generics.ListCreateAPIView):
    serializer_class = CommentSerializer
    permission_classes = [AllowAny]
    queryset = Comment.objects

    def perform_create(self, serializer):
        if serializer.is_valid():
            serializer.save()
        else:
            print(serializer.error)

class DeleteComment(generics.DestroyAPIView):
    serializer_class = CommentSerializer
    permission_classes = [AllowAny]
    queryset = Comment.objects.all()
    lookup_field = ('id')

class CreateLongAnswerView(generics.ListCreateAPIView):
    serializer_class = LongAnswerSerializer
    permission_classes = [AllowAny]
    queryset = LongAnswer.objects

    def perform_create(self, serializer):
        if serializer.is_valid():
            serializer.save()
        else:
            print(serializer.error)

class DeleteLongAnswer(generics.DestroyAPIView):
    serializer_class = LongAnswerSerializer
    permission_classes = [AllowAny]
    queryset = LongAnswer.objects.all()
    lookup_field = ('id')

class CreateScaleView(generics.ListCreateAPIView):
    serializer_class = ScaleSerializer
    permission_classes = [AllowAny]
    queryset = Scale.objects

    def perform_create(self, serializer):
        if serializer.is_valid():
            serializer.save()
        else:
            print(serializer.error)

class DeleteScale(generics.DestroyAPIView):
    serializer_class = ScaleSerializer
    permission_classes = [AllowAny]
    queryset = Scale.objects.all()
    lookup_field = ('id')

class UpdateRubricView(generics.RetrieveUpdateAPIView):
    serializer_class = RubricSerializer
    permission_classes = [AllowAny]
    queryset = Rubric.objects.all()
    lookup_field = ('id')

    def preform_post(self, serializer):
        if serializer.is_valid():
            serializer.save()
        else:
            print(serializer.errors)

class UpdateCategoryView(generics.RetrieveUpdateAPIView):
    serializer_class = CategorySerializer
    permission_classes = [AllowAny]
    queryset = Category.objects.all()
    lookup_field = ('id')

    def preform_post(self, serializer):
        if serializer.is_valid():
            serializer.save()
        else:
            print(serializer.errors)

class UpdateCommentView(generics.RetrieveUpdateAPIView):
    serializer_class = CommentSerializer
    permission_classes = [AllowAny]
    queryset = Comment.objects.all()
    lookup_field = ('id')

    def preform_post(self, serializer):
        if serializer.is_valid():
            serializer.save()
        else:
            print(serializer.errors)

class UpdateLongAnswerView(generics.RetrieveUpdateAPIView):
    serializer_class = LongAnswerSerializer
    permission_classes = [AllowAny]
    queryset = LongAnswer.objects.all()
    lookup_field = ('id')

    def preform_post(self, serializer):
        if serializer.is_valid():
            serializer.save()
        else:
            print(serializer.errors)

class UpdateScaleView(generics.RetrieveUpdateAPIView):
    serializer_class = ScaleSerializer
    permission_classes = [AllowAny]
    queryset = Scale.objects.all()
    lookup_field = ('id')

    def preform_post(self, serializer):
        if serializer.is_valid():
            serializer.save()
        else:
            print(serializer.errors)

class GetRubricComponentsTest(generics.ListAPIView):
    serializer_class = RubricTestSerializer
    permission_classes = [AllowAny]
    queryset = Rubric.objects.all()

class GetFullRubricById(generics.ListAPIView):
    serializer_class = RubricTestSerializer
    permission_classes = [AllowAny]
    
    def get_queryset(self):
        rubric_id = self.kwargs.get('id')
        return Rubric.objects.filter(id=rubric_id)


########################## SUBMISSION VIEWS ######################################

class GetCreateSubmission(generics.ListCreateAPIView):
    serializer_class = SubmissionSerializer
    permission_classes = [AllowAny]
    
    def get_queryset(self):
        group_id = self.kwargs.get('group_id')
        comp_id = self.kwargs.get('comp_id')
        
        if (group_id):
            return Submission.objects.filter(group__id=group_id)
        elif (comp_id):
            return Submission.objects.filter(group__comp=comp_id)
        else:
            return Submission.objects.all()
    
    def perform_create(self, serializer):
        if serializer.is_valid():
            serializer.save()
        else:
            print("Serializer errors!")
            print(serializer.errors)

class GetCreateSubmissionFull(generics.ListCreateAPIView):
    serializer_class = SubmissionFullSerializer
    permission_classes = [AllowAny]
    
    def get_queryset(self):
        group_id = self.kwargs.get('group_id')
        comp_id = self.kwargs.get('comp_id')
        
        if (group_id):
            return Submission.objects.filter(group__id=group_id)
        elif (comp_id):
            return Submission.objects.filter(group__comp=comp_id)
        else:
            return Submission.objects.all()
    
    def perform_create(self, serializer):
        if serializer.is_valid():
            serializer.save()
        else:
            print("Serializer errors!")
            print(serializer.errors)

class UpdateSubmission(generics.RetrieveUpdateAPIView): 
    serializer_class = SubmissionSerializer
    permission_classes = [AllowAny]
    queryset = Submission.objects.all()
    lookup_field = ('id')
    
    def preform_post(self, serializer):
        if serializer.is_valid():
            serializer.save()
        else:
            print("Serializer errors!")
            print(serializer.errors)
            

########################## FEEDBACK VIEWS ######################################

class GetCreateFeedback(generics.ListCreateAPIView):
    serializer_class = FeedbackFullSerializer
    permission_classes = [AllowAny]
    queryset = Feedback.objects.all()
    
    # def get_queryset(self):
    #     compID = self.kwargs.get('comp_id')

    #     if compID:
    #         # Get feedback by competition
    #         return UserInfo.objects.filter(group__comp=compID)
    #     else:
    #         # Get all feedback
    #         return Feedback.objects.all()
    
    def preform_post(self, serializer):
        if serializer.is_valid():
            serializer.save()
        else:
            print("Serializer errors!")
            print(serializer.errors)
            
            
class ListUpdateDestroyFeedback(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = FeedbackBasicSerializer
    permission_classes = [AllowAny]
    queryset = Feedback.objects.all()
    lookup_field = ('id')


########################## COMPETITION VIEWS ######################################

class CreateCompetition(generics.ListCreateAPIView):
    serializer_class = CompetitionCreateSerializer
    permission_classes = [AllowAny]
    queryset = Competition.objects

    def perform_create(self, serializer):
        if serializer.is_valid():
            serializer.save()
        else:
            print("Serializer errors!")
            print(serializer.errors)

class UpdateCompetition(generics.RetrieveUpdateAPIView):
    serializer_class = CompetitionSerializer
    permission_classes = [AllowAny]
    queryset = Competition.objects.all()
    lookup_field = ('id')

    def preform_post(self, serializer):
        if serializer.is_valid():
            serializer.save()
        else:
            print("Serializer errors!")
            print(serializer.errors)


class DeleteCompetition(generics.DestroyAPIView):
    serializer_class = CompetitionSerializer
    permission_classes = [AllowAny]
    queryset = Competition.objects.all()
    lookup_field = ('id')


class GetCompetitions(generics.ListCreateAPIView):
    serializer_class = CompetitionSerializer
    permission_classes = [AllowAny]
    queryset = Competition.objects.all()


class GetCompetitionsAndRubrics(generics.ListAPIView):
    serializer_class = CompetitionRubricSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        return Competition.objects


class GetCompetitionsByState(generics.ListAPIView):
    serializer_class = CompetitionSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        state = self.kwargs.get('state')
        return Competition.objects.filter(competition_state=state)


class GetCompetitionsByID(generics.ListAPIView):
    serializer_class = CompetitionSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        _id = self.kwargs.get('id')
        return Competition.objects.filter(id=_id)


class GetCompetitionsByIDFull(generics.ListAPIView):
    serializer_class = CompetitionFullSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        _id = self.kwargs.get('id')
        return Competition.objects.filter(id=_id)


class GetParticpantPronouns(generics.ListAPIView):
    serializer_class = ParticipantInfoSerializer
    permission_classes = [AllowAny]

    def amountPronouns(pronouns):
        # .values_list() returns a list of tuples, so falt = True will provide a normal list(array)
        pronouns = Participant.objects.values_list(
            "pronouns", flat=True).distinct()
        amount = np.array()
        for pronoun in pronouns:
            amount = np.append(Participant.objects.filter(
                pronouns=pronoun).count())

        return (pronouns, amount)


##################### Charts ##########################
def getPronouns():
    return Participant.objects.values_list("pronouns", flat=True).distinct()


def amountPronouns(request):
    pronouns = Participant.objects.values_list("pronouns", flat=True).distinct()
    data = []
    for p in pronouns:
        count = Participant.objects.filter(pronouns=p).count()
        data.append({
            "pronouns": p,  # <-- fix here
            "amount": count
        })
    return JsonResponse(data, safe=False)

def getStates():
    return Participant.objects.values_list('state', flat=True).distinct()


def amountStates(request):
    states = getStates()
    data = []
    for s in states:
        count = Participant.objects.filter(state=s).count()
        data.append({
            "state": s,
            "amount": count
        })
    
    return JsonResponse(data, safe=False)


def getGrades():
    return Participant.objects.values_list('grade', flat=True).distinct()


def amountGrades(request):
    grades = getGrades()
    data = []

    for g in grades:
        count = Participant.objects.filter(grade=g).count()
        data.append({
            "grade": g,
            "amount": count
        })

    return JsonResponse(data, safe=False)

def getPrograms():
    return UserInfo.objects.values_list('program', flat=True).distinct()

def amountPrograms(request):
    programs = getPrograms()
    data = []
    
    for p in programs:
        count = UserInfo.objects.filter(program=p).count()
        data.append({
            "program": p,
            "amount": count
        })
    
    return JsonResponse(data, safe=False)


################ Export to CSV ##########################


def export_everything_per_participant(request):
    # Load credentials from .env
    from dotenv import load_dotenv
    load_dotenv()
    server = os.environ['DB_HOST']
    user = os.environ['DB_USER']
    pwd = os.environ['DB_PWD']
    db = os.environ['DB_NAME']
    # Connect to MySQL
    mydb = pymysql.connect(host=server, user=user, password=pwd, db=db)
    mydb.autocommit(True)
    cur = mydb.cursor()

    # Execute complex join query
    cur.execute("""
        SELECT
        c.id AS competition_id,
        c.name AS competition_name,
        c.start_date,
        c.submission_due_date,
        c.feedback_due_date,

        r.name AS rubric_name,
        r.checkbox_text,

        g.group_name,
        u.fname AS user_fname,
        u.lname AS user_lname,
        u.email AS user_email,

        p.f_name AS participant_fname,
        p.l_name AS participant_lname,
        p.grade,
        p.school,
        p.city,
        p.state,

        s.title AS submission_title,
        s.problem_solved,
        s.presentation_link,

        j.time_zone AS judge_time_zone,

        f.box_checked,
        f.approved,

        sf.score AS scale_score,
        la.prompt AS long_answer_prompt,
        laf.text AS long_answer_feedback

        FROM competition c
        JOIN rubric r ON c.rubric_id = r.id
        JOIN `group` g ON g.comp_id = c.id
        JOIN users u ON g.user_id = u.id
        LEFT JOIN participant p ON p.group_id = g.id
        LEFT JOIN submission s ON s.group_id = g.id
        LEFT JOIN judge j ON j.competition_id = c.id
        LEFT JOIN feedback f ON f.submission_id = s.id AND f.judge_id = j.id
        LEFT JOIN scale_feedback sf ON sf.feedback_id = f.id
        LEFT JOIN scale sc ON sf.scale_id = sc.id
        LEFT JOIN long_answer_feedback laf ON laf.feedback_id = f.id
        LEFT JOIN long_answer la ON laf.long_answer_id = la.id
    """)

    # Fetch results
    rows = cur.fetchall()
    columns = [desc[0] for desc in cur.description]

    # Prepare HTTP response
    response = HttpResponse(content_type='text/csv')
    response['Content-Disposition'] = 'attachment; filename="joined_competition_data.csv"'
    writer = csv.writer(response)
    writer.writerow(columns)  # headers
    writer.writerows(rows)    # data

    return response
