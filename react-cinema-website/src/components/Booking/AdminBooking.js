import React, { useEffect, useState } from 'react';
import './style.scss';
import APIs, { endpoints } from 'configs/APIs';

const AdminBooking = () => {
    const [bookings, setBookings] = useState([]);
    
    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        try {
            // Gọi API lấy danh sách booking
            const response = await APIs.get(endpoints['booking']);
            const data = await response.json();
            setBookings(data);
        } catch (error) {
            console.error('Error fetching bookings:', error);
        }
    };

    const renderStatus = (status) => {
        const statusMap = {
            'pending': 'Chờ xác nhận',
            'confirmed': 'Đã xác nhận',
            'cancelled': 'Đã hủy'
        };
        return statusMap[status.toLowerCase()] || status;
    };

    return(

    <div className="admin-booking">
            <h2>Quản lý đặt vé</h2>
            <div className="booking-list">
                <table>
                    <thead>
                        <tr>
                            <th>Mã đặt vé</th>
                            <th>Người đặt</th>
                            <th>Suất chiếu</th>
                            <th>Ghế</th>
                            <th>Trạng thái</th>
                            <th>Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {bookings.map(booking => (
                            <tr key={booking.id}>
                                <td>{booking.id}</td>
                                <td>{booking.user.username || booking.user.email}</td>
                                <td>
                                    {/* Hiển thị thông tin từ model Showtime */}
                                    <div>{booking.showtime.movie.name}</div>
                                    <div>{`${booking.showtime.cinemaHall.name}`}</div>
                                    <div>{`${booking.showtime.showtime_date} ${booking.showtime.start_time}-${booking.showtime.end_time}`}</div>
                                </td>
                                <td>{booking.seats}</td>
                                <td>{renderStatus(booking.status)}</td>
                                <td>
                                    <button className="btn-detail">Chi tiết</button>
                                    {booking.status === 'pending' && (
                                        <>
                                            <button className="btn-confirm">Xác nhận</button>
                                            <button className="btn-cancel">Hủy vé</button>
                                        </>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminBooking;