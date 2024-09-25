from rest_framework import permissions

#co quyen chinh ban than no
class IsOwner(permissions.IsAuthenticated):
    def has_object_permission(self, request, view, obj):
        return self.has_permission(request, view) and request.user == obj.user


class ReviewOwner(permissions.IsAuthenticated):
    def has_object_permission(self, request, view, review):
        return super().has_permission(request, view) and request.user == review.user
