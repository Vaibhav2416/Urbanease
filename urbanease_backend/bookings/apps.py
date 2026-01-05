from django.apps import AppConfig


class BookingsConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'bookings'

    #Python_STD → Standard deviation of Python marks (ignore NaNs), rounded to 2 decimals
    
    #Average_Attendance_G2 → Mean attendance of section G2 after cleaning (strip + uppercase), rounded to 2 decimals
    
    #DA_Activity_Corr → Correlation between DA and Activity_Hours, rounded to 2 decimals
    
    #Activity_Outliers → Count of Activity_Hours anomalies (IQR method)
    
    #Section_Wise_Average_CGPA → Dictionary {Section: Avg_CGPA}, after cleaning section labels, rounded to 2 decimals