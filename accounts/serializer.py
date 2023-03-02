from rest_framework.serializers import ModelSerializer, Serializer
from rest_framework import serializers
from .models import Branch, Department, User, UserRole, Sub_division
from django.contrib.auth.hashers import make_password
from django.core.exceptions import ValidationError
from django.utils.encoding import smart_str, force_str, force_bytes, smart_bytes
from django.utils.http import urlsafe_base64_decode, urlsafe_base64_encode
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.urls import reverse
from django.contrib.sites.shortcuts import get_current_site
from django.core.mail import BadHeaderError, send_mail
from django.conf import settings


class UserRoleSerializer(serializers.ModelSerializer):
    department_get = serializers.SerializerMethodField("get_department")
    division_get = serializers.SerializerMethodField("get_division")

    def get_division(self, obj):
        if obj.division:
            return obj.division.name
        return None

    def get_department(self, obj):
        if obj.department:
            return obj.department.name
        return None

    class Meta:
        model = UserRole
        fields = ['pk', 'id', 'role', 'department',
                  'department_get', 'division', 'division_get']


class Userprofileserializer(serializers.ModelSerializer):
    user_branch = serializers.SerializerMethodField("get_branch")

    def get_branch(self, obj):
        if obj.branch:
            branch_obj = {'cityname': obj.branch.cityname,
                          'state': obj.branch.state,
                          'country': obj.branch.country.country_name,
                          'pincode': obj.branch.pincode,
                          'branch_name': obj.branch.branch_name}
            return branch_obj
        return None

    class Meta:
        model = User
        fields = ['pk', 'employee_id', 'name', 'email', 'phone', 'password',
                  'department', 'department_subdivision', 'role', 'branch', 'user_branch']


class SubDivisionSerializer(serializers.ModelSerializer):
    department_get = serializers.SerializerMethodField("get_department")

    def get_department(self, obj):
        if obj.department:
            return obj.department.name
        return None

    def validate(self, data):
        # try:
        division_obj = self.Meta.model.objects.filter(
            department=data['department'].id, name=(data['name']).lower())
        print(data['department'].id, data['name'])
        if len(division_obj) > 0:
            print(division_obj[0].id)
            raise ValidationError(
                'division already exists in this department')

        return data

    class Meta:
        model = Sub_division
        fields = ['pk', 'id', 'department', 'name', 'department_get']


class BranchSerializer(ModelSerializer):
    country_get = serializers.SerializerMethodField("get_country")

    def get_country(self, obj):
        if obj.country:
            return obj.country.country_name
        return None

    class Meta:
        model = Branch
        fields = ['pk', 'id', 'branch_name', 'cityname', 'state',
                  'country', 'country_get', 'pincode', 'GST_Number', 'address']
        read_only_field = ['Branch_code']

    def validate(self, data):
        queryset = Branch.objects.all()
        if self.instance:
            id = self.instance.id
            print(id)
            queryset = queryset.exclude(id=id)
        return data


class DepartmentsSerializer(ModelSerializer):

    class Meta:
        model = Department
        fields = ['pk', 'id', 'name', 'role']


class UsersSerializer(ModelSerializer):
    class Meta:
        model = User
        fields = ['pk', 'employee_id', 'name', 'email', 'phone', 'password',
                  'department', 'department_subdivision', 'role', 'branch']
        # read_only_fields = []

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        # print(validated_data,'sd')
        # print(validated_data['password'], 'password')
        user.save()
        return user


class LoginSerializer(ModelSerializer):
    class Meta:
        model = User
        fields = ['employee_id', 'password']


class UserUpdateSerializer(ModelSerializer):
    # department_get = serializers.SerializerMethodField("get_department")
    # department_subdivision_get = serializers.SerializerMethodField(
    #     "get_subdivision")
    role_get = serializers.SerializerMethodField(
        "get_role")
    branch_get = serializers.SerializerMethodField("get_branch")

    def get_branch(self, obj):
        if obj.branch:
            return obj.branch.branch_name
        return None

    # def get_department(self, obj):
    #     if obj.department:
    #         return obj.department.name
    #     return None

    # def get_subdivision(self, obj):
    #     if obj.department_subdivision:
    #         return obj.department_subdivision.name
    #     return None

    def get_role(self, obj):
        if obj.role:
            return obj.role.role
        return None

    class Meta:
        model = User
        fields = ['pk', 'employee_id', 'name', 'email',
                  'phone', 'role', 'role_get', 'branch', 'branch_get']


# class ChangePasswordSerializer(Serializer):
#     class Meta:
#         model = User

#     """
#     Serializer for password change endpoint.
#     """
#     old_password = serializers.CharField(max_length=200)
#     new_password = serializers.CharField(required=True)


class ChangePasswordSerializer(Serializer):
    employee_id = serializers.CharField(max_length=30)
    new_password = serializers.CharField(max_length=10)
    confirm_password = serializers.CharField(required=True)


class ForgetPasswordSerializer(Serializer):
    uid = serializers.CharField()
    token = serializers.CharField()
    new_password = serializers.CharField(max_length=200)
    confirm_password = serializers.CharField(required=True)

    class Meta:
        fields = ['token', 'confirm_password', 'new_password', 'uid']

    def validate(self, attrs):
        try:
            password = attrs.get('new_password')
            confirmpassword = attrs.get('confirm_password')
            token = attrs.get('token')
            uid = attrs.get('uid')
            id = force_str(urlsafe_base64_decode(uid))
            user = User.objects.get(id=id)
            if not PasswordResetTokenGenerator().check_token(user, token):
                raise ValidationError('invalid token')
            if password == confirmpassword:
                user.set_password(password)
                user.save()
            else:
                raise ValidationError('Passwords do not match')
        except:
            raise ValidationError('invalid token')
        return super().validate(attrs)


class EmailCheckSerializer(Serializer):
    email = serializers.EmailField()


class NullSerializer(Serializer):
    pass
