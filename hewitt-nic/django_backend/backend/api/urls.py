from django.urls import path
from . import views

# defines urls that can be hit in the backend after the "api/" base url

urlpatterns = [
    # This user
    path("this_user/", views.GetCurrentUser.as_view()),
    
    # User URLS
    path("users/judges/<str:type>_compid/<str:id>/", views.GetJudgeUsersByCompetition.as_view(), name="judges-by-compID"),
    path("users/judges/", views.GetJudgeUsers.as_view(), name="get_judge_users"),
    path("users/", views.CreateUserInfoView.as_view(), name="create-user-info"),
    path("users/update/<str:id>/", views.UpdateUserInfoView.as_view(), name="user_info_update"),
    path("users/auth_user_id/", views.GetUserInfoByID.as_view(), name="user_info_by_auth_user"),
    path("users/<str:type>/", views.GetUserInfoByType.as_view(), name="user_info_by_type"),
    
    path("judges/", views.ListCreateJudges.as_view(), name="list_create_judges"),
    path("judges/edit/<str:id>/", views.ListUpdateDestroyJudge.as_view(), name="list_create_destroy_judge"),
    path("judgeinfo/", views.CreateJudgeInfoView.as_view(), name="create-judge-info"),
    path("judgeinfo/update/<str:id>/", views.UpdateJudgeInfoView.as_view(), name="judge_info_update"),
    
    path("groups/create/", views.GetCreateGroups.as_view()),
    path("groups/update/<str:id>/", views.UpdateGroup.as_view()),
    path("groups/<str:comp_type>/", views.GetGroupsByUserAndCompState.as_view()),
    path("groups/competition/<str:comp_id>/", views.GetGroupsByCompID.as_view()),
    
    path("participants/", views.GetCreateParticipants.as_view()),
    
    # Rubric URLS
    path("rubric/", views.CreateRubricView.as_view(), name="create-rubric"),
    path("rubric/delete/<str:id>/", views.DeleteRubric.as_view(), name="delete-rubric"),
    path("rubric/test/", views.GetRubricComponentsTest.as_view(), name="get-rubric-components"),
    path("rubric/full/<str:id>/", views.GetFullRubricById.as_view(), name="get-full-rubric-by-id"),
    path("rubric/category/", views.CreateCategoryView.as_view(), name="create-category"),
    path("rubric/category/delete/<str:id>/", views.DeleteCategory.as_view(), name="delete-category"),
    path("rubric/comment/", views.CreateCommentView.as_view(), name="create-comment"),
    path("rubric/comment/delete/<str:id>/", views.DeleteComment.as_view(), name="delete-comment"),
    path("rubric/scale/", views.CreateScaleView.as_view(), name="create-scale"),
    path("rubric/scale/delete/<str:id>/", views.DeleteScale.as_view(), name="delete-scale"),
    path("rubric/longanswer/", views.CreateLongAnswerView.as_view(), name="create-longanswer"),
    path("rubric/longanswer/delete/<str:id>/", views.DeleteLongAnswer.as_view(), name="delete-longanswer"),
    path("rubric/update/<str:id>/", views.UpdateRubricView.as_view(), name="update-rubric"),
    path("rubric/category/update/<str:id>/", views.UpdateCategoryView.as_view(), name="update-category"),
    path("rubric/comment/update/<str:id>/", views.UpdateCommentView.as_view(), name="update-comment"),
    path("rubric/scale/update/<str:id>/", views.UpdateScaleView.as_view(), name="update-scale"),
    path("rubric/longanswer/update/<str:id>/", views.UpdateLongAnswerView.as_view(), name="update-longanswer"),

    
    # Submission URLS
    path("submissions/", views.GetCreateSubmission.as_view()),
    path("submissions/<str:group_id>/", views.GetCreateSubmissionFull.as_view()),
    path("submissions/by_competition/<str:comp_id>/", views.GetCreateSubmissionFull.as_view()),
    path("submissions/update/<str:id>/", views.UpdateSubmission.as_view(), name="submission_update"),
    
    # Feedback URLS
    path("feedback/", views.GetCreateFeedback.as_view()),
    path("feedback/update/<str:id>/", views.ListUpdateDestroyFeedback.as_view()),
    # path("feedback/by_competition/<str:comp_id>/", views.GetCreateFeedback.as_view()),
    
    # Competition URLS
    path("competitions/", views.GetCompetitions.as_view(), name="competition_list"),
    path("competitions/delete/<str:id>/", views.DeleteCompetition.as_view(), name="competition_delete"),
    path("competitions/create/", views.CreateCompetition.as_view(), name="competition_create"),
    path("competitions/update/<str:id>/", views.UpdateCompetition.as_view(), name="competition_update"),
    path("competitions/state/<str:state>/", views.GetCompetitionsByState.as_view(), name="competition-list-by-state"),
    path("competitions/id/<str:id>/", views.GetCompetitionsByID.as_view(), name="competition-list-by-id"),
    path("competitions/idFull/<str:id>/", views.GetCompetitionsByIDFull.as_view(), name="competition-list-by-id-full"),
    path("participants/pronouns/", views.GetParticpantPronouns.as_view(), name="participant_info"),
    path("export-all/", views.export_everything_per_participant, name='export-all'),
    path("states-amount/", views.amountStates, name='amount-states'),
    path("grades-amount/", views.amountGrades, name='grades-amount'),
    path("pronoun-amount/", views.amountPronouns, name='pronoun-amount'),
    path("program-amount/", views.amountPrograms, name='program-amount'),
    
    
]