from django.shortcuts import render
from rest_framework.generics import ListCreateAPIView, RetrieveAPIView, CreateAPIView, ListAPIView
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Job, Resume, Application
from .serializers import JobSerializer, UserSerializer, ResumeSerializer, ApplicationSerializer
from .filters import JobFilter


class JobView(ListCreateAPIView):
    queryset = Job.objects.filter(is_approved=True).order_by('-posted_at')
    serializer_class = JobSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    filterset_class = JobFilter  # Use the new filter class

    def perform_create(self, serializer):
        # Automatically set the recruiter to the current logged-in user
        serializer.save(recruiter=self.request.user)


class JobDetailView(RetrieveAPIView):
    queryset = Job.objects.filter(is_approved=True)
    serializer_class = JobSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]


class RegisterView(APIView):
    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ResumeUploadView(CreateAPIView):
    queryset = Resume.objects.all()
    serializer_class = ResumeSerializer
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def perform_create(self, serializer):
        # Link the resume to the current authenticated user
        serializer.save(user=self.request.user)


class ApplyView(CreateAPIView):
    queryset = Application.objects.all()
    serializer_class = ApplicationSerializer
    permission_classes = [IsAuthenticated]

    def create(self, request, *args, **kwargs):
        job_id = request.data.get('job_id')
        try:
            # Check if user has uploaded a resume
            resume = Resume.objects.get(user=request.user)
            # Prevent multiple applications for the same job
            if Application.objects.filter(applicant=request.user, job_id=job_id).exists():
                return Response(
                    {'detail': 'You have already applied for this job.'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            serializer = self.get_serializer(data={'job': job_id})
            serializer.is_valid(raise_exception=True)
            serializer.save(applicant=request.user, resume=resume)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        except Resume.DoesNotExist:
            return Response(
                {'detail': 'Please upload your resume first.'},
                status=status.HTTP_400_BAD_REQUEST
            )


class AppliedJobsView(ListAPIView):
    serializer_class = ApplicationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Return only the applications of the current user
        return Application.objects.filter(applicant=self.request.user).order_by('-applied_at')