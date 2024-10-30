//Xử lý layout avf xác thực người dùng cho booking

const BookingLayout = () => {
    const { showtimeId } = useParams();
    const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
    const currentUser = useSelector(state => state.auth.user);
  
    if (!isAuthenticated) {
      return <Navigate 
        to={Router.permis.LOGIN} 
        state={{ from: `/booking/${showtimeId}` }} 
      />;
    }
  
    return (
      <div className="booking-layout">
        <BOOKING />
      </div>
    );
};