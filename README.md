How to run project:
https://github.com/datob111/CarRentalDemo.git
 django:
   cd backend/car_rental_b
   python -m venv venv
   source venv/bin/activate  # On Windows use `venv\Scripts\activate`
   pip install -r requirements.txt
   python manage.py migrate
   python manage.py runserver

 react:
   cd frontend/react_router
   npm install
   npm start
