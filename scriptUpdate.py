import mysql.connector
import schedule
import time
import random
from datetime import datetime

def update_table():
    try:
        # Conectarea la baza de date
        conn = mysql.connector.connect(
            host="203.161.61.35",
            user="nnmadalin",
            password="tyh*khy!npe2QWZ4pzf",
            database="itmarathon2024"
        )
        
        cursor = conn.cursor()
        
        cursor.execute("SELECT * FROM coin")
        records = cursor.fetchall()
        
        for record in records:
            id, name, value, _, _ = record
            random_percentage = random.uniform(-2, 2)
            updated_value = value + (value * (random_percentage / 100))  # Calculăm noua valoare
            current_datetime = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
            
            # Actualizăm valoarea și procentajul în tabelul 'coin'
            cursor.execute("UPDATE coin SET value = %s, percentage = %s, data = %s WHERE id = %s", (updated_value, random_percentage, current_datetime, id))
            conn.commit()
            
            # Inserăm datele modificate în tabelul 'historyCoin'
            cursor.execute("INSERT INTO historyCoin (name, value, data, percentage) VALUES (%s, %s, %s, %s)", (name, updated_value, current_datetime, random_percentage))
            conn.commit()
        
        print("Valorile au fost actualizate cu succes.")
        
    except mysql.connector.Error as error:
        print("Eroare la conectarea la baza de date:", error)
        
    finally:
        if conn.is_connected():
            cursor.close()
            conn.close()
            print("Conexiunea la baza de date a fost închisă.")

# Programarea actualizării tabelului la fiecare 15 minute
schedule.every(15).minutes.do(update_table)

# Rularea în buclă pentru a permite programului să ruleze în continuu
while True:
    schedule.run_pending()
    time.sleep(1)
