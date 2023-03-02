from django.db import models
from django.utils import timezone
from django.core.validators import MinLengthValidator, MaxValueValidator
from django.core.exceptions import ValidationError
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager
from django.contrib.auth.hashers import make_password
from django.http import JsonResponse
from django.core.management.base import BaseCommand, CommandError
import uuid
from data_management.models import Country
# Create your models here.

from django.contrib.auth.management.commands import createsuperuser


class Branch(models.Model):
    id = models.AutoField(primary_key=True)
    cityname = models.CharField(
        unique=True, max_length=50, null=True, blank=True)
    state = models.CharField(max_length=30, default='TamilNadu')
    country = models.ForeignKey(
        Country, on_delete=models.SET_NULL, null=True, blank=True)
    pincode = models.IntegerField(default=6000007)
    GST_Number = models.CharField(unique=True, blank=True, max_length=30)
    branch_code = models.CharField(
        editable=False, unique=True, max_length=10, null=True, blank=True, default='branchcode')
    branch_name = models.CharField(
        max_length=30, unique=True, null=True, blank=True)
    address = models.CharField(
        max_length=50, unique=True, null=True, blank=True)

    def save(self, *args, **kwargs):
        self.branch_code = str(uuid.uuid4())[:6]
        return super(Branch, self).save(*args, **kwargs)

    def __str__(self):
        return self.branch_name


class Department(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(unique=True, max_length=50)
    role = models.CharField(max_length=50, null=True, blank=True)

    def __str__(self):
        return self.name


class Sub_division(models.Model):
    id = models.AutoField(primary_key=True)
    department = models.ForeignKey(
        Department, null=True, on_delete=models.SET_NULL)
    name = models.CharField(max_length=50, null=True, blank=True)

    def __str__(self):
        return self.name


class UserRole(models.Model):
    id = models.AutoField(primary_key=True)
    department = models.ForeignKey(
        Department, null=True, blank=True, on_delete=models.SET_NULL)
    role = models.CharField(max_length=30, unique=True)
    division = models.ForeignKey(
        Sub_division, null=True, blank=True, on_delete=models.SET_NULL)

    def __str__(self):
        return self.role


class MyUserManager(BaseUserManager):
    def create_user(self, employee_id, password, name, **extra_fields):
        phone = extra_fields.get('phone', None)
        department_id = extra_fields.get('department', None)
        sub_division = extra_fields.get('department_subdivision', None)
        role = extra_fields.get('role', None)
        email = extra_fields.get('email', None)
        # employee_id = extra_fields.get('id', None)
        # name = extra_fields.get('name', None)
        if phone:
            try:
                phone = int(phone)
            except:
                raise ValueError('Mobile number only number')
        # password = make_password(password)
        # self.set_password(self.password)
        user = self.model(name=name, department=department_id, email=email,
                          phone=phone, employee_id=employee_id, department_subdivision=sub_division, role=role)
        # print(user)
        print(password)
        user.set_password(password)
        # user.save(using=self._db)
        return user

    def create_superuser(self, **extra_fields):
        user = self.create_user(**extra_fields)
        user.is_superuser = True
        user.save(using=self._db)
        return user


class User(AbstractBaseUser):
    email = models.EmailField(unique=True, null=True, blank=True)
    employee_id = models.CharField(
        unique=True, null=False, primary_key=True, max_length=50, default=123, blank=True)
    name = models.CharField(unique=True, max_length=50)
    phone = models.CharField(
        default=1234567890,
        max_length=10,
        validators=[
            MinLengthValidator(10)
        ], null=True, blank=True)
    department = models.ForeignKey(
        Department, on_delete=models.SET_NULL, null=True, blank=True)
    department_subdivision = models.ForeignKey(
        Sub_division, on_delete=models.SET_NULL, null=True, blank=True)
    role = models.ForeignKey(UserRole, on_delete=models.SET_NULL, null=True)
    is_superuser = models.BooleanField(default=False)
    reset_password = models.BooleanField(default=True)
    branch = models.ForeignKey(Branch, on_delete=models.SET_NULL, null=True)
    created_at = models.DateTimeField(default=timezone.now)
    objects = MyUserManager()
    USERNAME_FIELD = 'employee_id'
    REQUIRED_FIELDS = ['name', 'password']

    def save(self, *args, **kwargs):
        return super(User, self).save(*args, **kwargs)

    def __str__(self):
        return self.employee_id

    def has_perm(self, perm, obj=None):
        "Does the user have a specific permission?"
        return True

    def has_module_perms(self, app_label):
        "Does the user have permissions to view the app `app_label`?"
        return True

    @ property
    def is_staff(self):
        return self.is_superuser

    class Meta:
        ordering = ('created_at',)
