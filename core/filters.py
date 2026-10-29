import django_filters
from .models import Job


class JobFilter(django_filters.FilterSet):
    # Case-insensitive search on title and description
    title = django_filters.CharFilter(lookup_expr='icontains')
    description = django_filters.CharFilter(lookup_expr='icontains')

    class Meta:
        model = Job
        # These are the fields the API can filter on
        fields = ['category', 'location', 'job_type', 'title', 'description']


class ApprovedJobFilter(django_filters.FilterSet):
    """Filter that only shows approved jobs to the public"""
    title = django_filters.CharFilter(lookup_expr='icontains')
    description = django_filters.CharFilter(lookup_expr='icontains')

    class Meta:
        model = Job
        fields = ['category', 'location', 'job_type', 'title', 'description']