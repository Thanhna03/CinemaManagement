from django.db import models
from django.contrib.auth.models import AbstractUser
from cloudinary.models import CloudinaryField
from django.utils import timezone
from ckeditor.fields import RichTextField




class BaseModel(models.Model):
    created_date = models.DateTimeField(auto_now_add=True, null=True)
    updated_date = models.DateTimeField(auto_now=True, null=True)
    active = models.BooleanField(default=True) 

    class Meta:
        abstract = True


class User(BaseModel, AbstractUser):
    class Role(models.IntegerChoices):
        ADMIN = 1, "Admin"
        STAFF = 2, "Staff"
        CUSTOMER = 3, "Customer"

    email = models.EmailField("email_address", unique=True, null=True)
    role = models.IntegerField(choices=Role.choices, default=Role.ADMIN)
    avatar = CloudinaryField(null=True)
    password_changed = models.BooleanField(default=False)

    def save(self, *args, **kwargs):
        if self.role == User.Role.ADMIN:
            self.is_staff = True
        else:
            self.is_staff = False
        super().save()

class Genre(BaseModel):
    name = models.CharField(max_length=50, unique=True)

    def __str__(self):
        return self.name


class Movie(BaseModel):
    name = models.CharField(max_length=255)
    description = models.TextField(null=True, blank=True)
    genre = models.ManyToManyField(Genre, null=True, blank=True)
    release_date = models.DateField(blank=True, null=True) #blank=True để có thể chỉnh sửa date -> chứ kh phải là mặc định
    trailer_url = models.URLField(null=True, blank=True)
    # poster_img = models.ImageField(upload_to='cinemamg/%Y/%m/', null=True, blank=True)
    poster_img = CloudinaryField(null=True)

    def __str__(self):
        return self.name


class CinemaHall(BaseModel):
    name = models.CharField(max_length=255)
    location = models.CharField(max_length=255)  # Vị trí của phòng chiếu trong rạp

    def __str__(self):
        return f"{self.name} - {self.location}"

class Showtime(BaseModel):
    showtime_date = models.DateTimeField() #ngay chieu
    start_time = models.TimeField() #gio bat dau chieu
    end_time = models.TimeField()  # gio ket thuc
    movie = models.ForeignKey('Movie', on_delete=models.CASCADE)
    cinemaHall = models.ForeignKey('CinemaHall', on_delete=models.CASCADE)


    class Meta:
        unique_together = ('movie', 'cinemaHall', 'showtime_date', 'start_time')
        ordering = ['showtime_date', 'start_time']

    def __str__(self):
        return f"Suất chiếu của {self.movie} tại {self.cinemaHall} vào ngày {self.showtime_date} từ {self.start_time} đến {self.end_time}"

class Booking(BaseModel):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    showtime = models.ForeignKey(Showtime, on_delete=models.CASCADE) #trong showtime da co Foreign key cua movie
    seats = models.CharField(max_length=10)
    status = models.CharField(max_length=20, choices=[('pending', 'Pending'), ('confirmed', 'Confirmed'), ('cancelled', 'Cancelled')])
    promotion = models.ForeignKey('Promotion', on_delete=models.SET_NULL, null=True, blank=True)
    def __str__(self):
        return f"Booking #{self.id} by {self.user} for {self.showtime}"

class Promotion(BaseModel):
    promo_choice = [
        ('Percent', 'Percent discount'),
        ('Fixed number', 'Fixed number discount')
    ]
    code = models.CharField(max_length=50, unique=True) #Ma khuyen mai
    description = models.TextField(null=True, blank=True)
    promo_type = models.CharField(max_length=20, choices=promo_choice)
    discount_value = models.DecimalField(max_digits=10, decimal_places=2) #gia tri KM
    minimum_order_value = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True) #Gia tri toi thieu de ap dung promo
    start_date = models.DateField()
    end_date = models.DateField()
    active = models.BooleanField(default=True)

    def is_valid(self): #kiem tra promo
        now = timezone.now()
        return self.active and (self.start_date <= now <= self.end_date) # hien tai < start va nho hon ket thuc => con hieu luc

    def apply_dis(self, total): #tinh toan so tien duoc giam gia
        if total >= self.minimum_order_value:
            if self.promo_type == "Percent":
                discount = (self.discount_value / 100) * total
            else: # fixed num
                discount = self.discount_value
            return min(discount, total) #dam bao gia tri nho hon hoa don
        return 0

    def __str__(self):
        return f"Promotion {self.code} - {self.promo_type}: {self.discount_value}"


class Invoice(BaseModel):
    booking = models.ForeignKey(Booking, on_delete=models.CASCADE)
    total_amount = models.DecimalField(max_digits=10, decimal_places=3)
    # discount = models.DecimalField(max_digits=10, decimal_places=3, default=8)
    promotion = models.ForeignKey(Promotion, on_delete=models.SET_NULL, null=True, blank=True)
    final_amount = models.DecimalField(max_digits=10, decimal_places=3)
    payment_status = models.CharField(max_length=20, choices=[('pending', 'Pending'), ('completed', 'Completed'), ('failed', 'Failed')])


    def save(self, *args, **kwargs):
        # Kiểm tra khuyến mãi và tính toán giảm giá
        promotion = self.booking.promotion
        if promotion and promotion.is_valid():
            self.discount = promotion.apply_dis(self.total_amount)
        else:
            self.discount = 0

        # Tính toán số tiền cuối cùng
        self.final_amount = self.total_amount - self.discount

        # Gọi phương thức save của lớp cha để lưu đối tượng
        super().save(*args, **kwargs)

    def __str__(self):
        return f"Invoice #{self.id} - Booking #{self.booking.id}"

class Review(BaseModel):
    rating_choice = [
        (1, '1 - Very Bad'),
        (2, '2 - Bad'),
        (3, '3 - Average'),
        (4, '4 - Good'),
        (5, '5 - Excellent')
    ]

    rating = models.IntegerField(choices=rating_choice)
    commemt = models.TextField(null=True, blank=True)
    movie = models.ForeignKey(Movie, on_delete=models.CASCADE, related_name='review')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='user')

    class Meta:
        unique_together = ('movie', 'user') #1 user danh gia 1 phim 1 lan
        ordering = ['-created_date'] #sap xep thoi gian crate moi nhat

    def __str__(self):
        return f"Review of {self.movie.name} by {self.user} - Rating: {self.rating}"

#Danh cho blog va tin tuc (neu co the phat trien)
class Interaction(BaseModel):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    #reaction cho post => them model cho post

    class Meta:
        abstract = True

class Comment(Interaction):
    content = models.CharField(max_length=255)

# class Like(Interaction):
#
#     class Meta:
#          unique_together = ('user') #kh duoc co 2 dong trung nhau => user va movie chan han