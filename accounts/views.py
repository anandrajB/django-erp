from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.generics import (
    CreateAPIView,
    RetrieveUpdateDestroyAPIView,
    UpdateAPIView,
    ListAPIView)
from random import randint
from django.core.mail import BadHeaderError, send_mail
from django.conf import settings
from django.shortcuts import get_object_or_404
from .models import *
from django.http import JsonResponse, HttpResponse, HttpResponseRedirect
from rest_framework.authtoken.models import Token
from django.contrib.auth import login, logout, authenticate
from rest_framework.permissions import AllowAny, IsAuthenticated, IsAdminUser
from django.contrib.auth.tokens import PasswordResetTokenGenerator

from .serializer import (
    BranchSerializer, DepartmentsSerializer,
    UsersSerializer, LoginSerializer,
    UserRoleSerializer, SubDivisionSerializer,
    UserUpdateSerializer, ChangePasswordSerializer,
    NullSerializer, EmailCheckSerializer, Userprofileserializer,
    ForgetPasswordSerializer)
from rest_framework.status import (
    HTTP_200_OK, HTTP_404_NOT_FOUND, HTTP_401_UNAUTHORIZED, HTTP_206_PARTIAL_CONTENT,
    HTTP_400_BAD_REQUEST, HTTP_201_CREATED, HTTP_203_NON_AUTHORITATIVE_INFORMATION, HTTP_206_PARTIAL_CONTENT
)
from .models import User
from rest_framework.response import Response
from rest_framework import exceptions
from data_management.models import *
from data_management.serializer import *

from django.utils.encoding import smart_str, force_str, force_bytes, smart_bytes, DjangoUnicodeDecodeError
from django.utils.http import urlsafe_base64_decode, urlsafe_base64_encode
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.urls import reverse
from django.contrib.sites.shortcuts import get_current_site
from django.core.mail import BadHeaderError, send_mail
from data_management.forms import *


class UserRegistration(ListAPIView):
    serializer_class = UsersSerializer
    permission_classes = [AllowAny]
    queryset = User.objects.all()

    def list(self, request):
        employee_id = request.query_params.get('employee_id')
        try:
            users = User.objects.all()
            if employee_id:
                users = users.filter(employee_id=employee_id)
                print(users)
            serializer = UserUpdateSerializer(users, many=True)
            return Response(serializer.data, status=HTTP_200_OK)
        except Exception as e:
            return Response({'status': 'failure', 'data': str(e)}, status=HTTP_206_PARTIAL_CONTENT)

    def post(self, request, *args, **kwargs):
        serializer = UsersSerializer(data=request.data)
        if serializer.is_valid():
            # try:
            serializer.save()
            print(serializer.data['name'], 'data')
            # subject = 'welcome to ERP Application'
            # message = 'Hi {}, \n' \
            #     'here is your ERP Application credentials \n'\
            #     'username: {} \n'\
            #     'password: {} \n'.format(
            #         request.data['name'], request.data['name'], request.data['password'])
            # email_from = settings.EMAIL_HOST_USER
            # recipient_list = [serializer.data['email'], ]
            # print('subject', subject, 'message', message,
            #       'to', recipient_list, 'from', email_from)
            # send_mail(subject, message, email_from, recipient_list)
            return Response({"status": "created", "data": serializer.data}, status=HTTP_200_OK)
            # except Exception as e:
            #     return Response({"status": "Not Created", "data": str(e)}, status=HTTP_206_PARTIAL_CONTENT)
        return Response({"status": "Not Created", "data": serializer.errors}, status=HTTP_206_PARTIAL_CONTENT)


class Login(APIView):
    serializer_class = LoginSerializer
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        employee_id = request.data.get('employee_id')
        password = request.data.get('password')
        print(employee_id, password)
        user = authenticate(
            request, employee_id=employee_id, password=password)
        print(user, 'password')
        if user:
            try:
                token, created = Token.objects.get_or_create(user=user)
                login(request, user)
                data = {'token': token.key,
                        'id': user.employee_id,
                        'email': user.email,
                        }
                print(data)
                return Response({"status": "Login Successfull", "data": data, 'code': HTTP_200_OK, }, status=HTTP_200_OK)
            except Exception as e:
                return Response({"data": str(e)}, status=HTTP_206_PARTIAL_CONTENT)
        return Response({"status": "failure", 'data': 'invalid credentials'}, status=HTTP_404_NOT_FOUND)


class Userprofile(RetrieveUpdateDestroyAPIView):
    serializer_class = Userprofileserializer
    permission_classes = [AllowAny]
    queryset = User.objects.all()

    def get(self, request, *args, **kwargs):
        user = self.request.user
        serializer = Userprofileserializer(user)
        return Response(serializer.data, status=HTTP_200_OK)


class UserCRUD(RetrieveUpdateDestroyAPIView):
    serializer_class = UserUpdateSerializer
    permission_classes = [AllowAny]
    queryset = User.objects.all()

    def retrieve(self, request, pk):
        try:
            queryset = get_object_or_404(User, id=pk)
            data = UserUpdateSerializer(queryset)
            return Response(data.data, status=HTTP_200_OK)
        except Exception as e:
            return Response({'data': str(e)}, status=HTTP_200_OK)

    def update(self, request, pk):
        try:
            branch = get_object_or_404(User, id=pk)
            serializer = UserUpdateSerializer(branch, data=request.data)
            if serializer.is_valid():
                serializer.save()
            return Response(serializer.data, status=HTTP_200_OK)
        except Exception as e:
            return Response({'status': 'failure', 'data': str(e)}, status=HTTP_206_PARTIAL_CONTENT)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response(status=HTTP_200_OK)


class LogoutAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        logout(request)
        return Response({"status": "Logged Out"}, status=HTTP_200_OK)


class ProfileView(APIView):
    serializer_class = UserUpdateSerializer
    permission_classes = [IsAuthenticated]
    queryset = User.objects.all()

    def get(self, request, *args, **kwargs):
        user = self.request.user
        serializer = UserUpdateSerializer(user)
        return Response({'status': 'success', 'data': serializer.data}, status=HTTP_200_OK)


# class ChangePasswordView(UpdateAPIView):
#     """
#     An endpoint for changing password.
#     """
#     serializer_class = ChangePasswordSerializer
#     model = User
#     permission_classes = (IsAuthenticated,)

#     def get_object(self, queryset=None):
#         obj = self.request.user
#         return obj

#     def update(self, request, *args, **kwargs):
#         self.object = self.get_object()
#         serializer = self.get_serializer(data=request.data)

#         if serializer.is_valid():
#             # Check old password
#             if not self.object.check_password(serializer.data.get("old_password")):
#                 return Response({"status": "failure", "data": "Wrong password."}, status=HTTP_206_PARTIAL_CONTENT)
#             # set_password also hashes the password that the user will get
#             self.object.set_password(serializer.data.get("new_password"))
#             self.object.save()

#             return Response({'status': 'success', 'data': 'updated successfully'}, status=HTTP_200_OK)
#         return Response(serializer.errors, status=HTTP_206_PARTIAL_CONTENT)


# class ForgetPasswordView(APIView):
#     serializer_class = EmailCheckSerializer
#     permission_classes = [AllowAny]
#     queryset = User.objects.all()

#     def post(self, request, *args, **kwargs):
#         email = request.data.get("email")
#         print(email)
#         if User.objects.filter(email=email).exists():
#             user = User.objects.get(email=email)
#             uid = urlsafe_base64_encode(smart_bytes(user.id))
#             token = PasswordResetTokenGenerator().make_token(user)
#             current_site = get_current_site(
#                 request=request).domain
#             relative_url = reverse('resetpasswordcheck',
#                                    kwargs={"uid": uid, "token": token})
#             absurl = 'http://' + current_site+relative_url
#             send_mail('verifying Email', "click below link to reset your password\n" +
#                       absurl, 'momc09917@gmail.com', [email])
#             return Response({"status": "send reset password email"}, status=HTTP_200_OK)
#         return Response({"status": "Email not exist"}, status=HTTP_200_OK)


# def checktoken(request, uid, token):
#     try:
#         id = smart_str(urlsafe_base64_decode(uid))
#         print(id, token)
#         user = User.objects.get(id=id)
#         print(PasswordResetTokenGenerator().check_token(user, token))
#         if PasswordResetTokenGenerator().check_token(user, token):
#             return render(request, 'accounts/resetpassword.html', {"uid": uid, "token": token})
#         return HttpResponse('not a valid token')
#     except DjangoUnicodeDecodeError as e:
#         if not PasswordResetTokenGenerator.check_token(user, token):
#             return HttpResponse('not a valid token')


# class ResetPassword(APIView):
#     serializer_class = ForgetPasswordSerializer

#     def patch(self, request):
#         serializer = ForgetPasswordSerializer(data=request.data)
#         serializer.is_valid(raise_exception=True)
#         return Response({"status": True, "message": "Password Rested successfully"})


class Changepassword(APIView):
    serializer_class = ChangePasswordSerializer

    def post(self, request, *args):
        data = request.data
        user = self.request.user
        new_password = data['new_password']
        confirm_password = data['confirm_password']
        if new_password != confirm_password:
            return Response({'status': 'failuire', 'data': 'new password and confirm password is not match'}, status=HTTP_206_PARTIAL_CONTENT)
        if user.is_superuser:
            user_obj = User.objects.get(pk=data['employee_id'])
            user_obj.set_password(new_password)
            user_obj.save()
        else:
            user.set_password(new_password)
            user.save()
            user.reset_password = False
        return Response({'status': 'success', 'data': 'password changed successfully'}, status=HTTP_200_OK)
